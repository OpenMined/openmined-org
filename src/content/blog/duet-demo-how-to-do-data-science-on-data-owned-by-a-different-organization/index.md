---
title: "Duet Demo – How to do data science on data owned by a different organization"
slug: duet-demo-how-to-do-data-science-on-data-owned-by-a-different-organization
date: 2021-01-28T16:03:23
updated: 2024-12-19T19:30:44
categories: [product]
tags: [pysyft]
authors: [tejas-jain]
cover: ./cover.jpg
coverAlt: ""
cardText: light
draft: false
legacyId: 1896
---
<!-- TODO(a11y): 1 localized body image(s) have empty alt text -->


**_Update as of November 18, 2021: The version of PySyft mentioned in this post has been deprecated. Any implementations using this older version of PySyft are unlikely to work. Stay tuned for the release of PySyft 0.6.0, a data centric library for use in production targeted for release in early December._**

> **This is a summary of [Duet Tutorial by Andrew Trask](https://www.youtube.com/watch?v=DppXfA6C8L8) which was presented at OpenMined Privacy Conference 2020.**

### Brief intro to federated learning and its limitations

According to [Wikipedia](https://en.wikipedia.org/wiki/Federated_learning), federated learning (also known as collaborative learning) is a Machine Learning (“ML”) technique that trains an algorithm across multiple decentralized edge devices or servers holding local data samples without moving them. This approach stands in contrast to traditional centralized machine learning techniques where all the local datasets are uploaded to one server, as well as in contrast to the more classical decentralized approaches, which often assume that local data samples are identically distributed.

In simpler terms, federated learning is an approach to training ML models without compromising the privacy of data owners. Since the data never leaves the owner’s device, privacy is retained. However, in practice, privacy may still be compromised. The model weights that are transmitted during the training process can still potentially be used to learn something about the training data. In this approach, data owners only have a binary choice. They can either participate in the training process or opt-out. There’s no in-between that allows the data owners granular control over what data they share and how much they share if they decide to participate.

### Duet and its novel approach to remote Data Science  

Duet is a novel approach that moves away from the **central server management** ideology in federated learning. It focuses on providing a coordination mechanism between data owners and data scientists where the goal of data scientists is to perform data analysis and train models on data they cannot see. Unlike past approaches, Duet provides data owners granular control over their data and ensures effective collaboration between the two parties. In essence, data owners can not only decide whether they want to participate in the training process but also choose what operations the data scientists can perform on the data.

### Code walkthrough

Let’s walk through some basic code examples to understand how Duet can be leveraged for Remote Data Science.

Note: All code snippets that are to be executed by data owners will be labeled as “**_Owner_**” and snippets that are to be executed by data scientists will be labeled as “_**Scientist**_”.

#### Part 1 – Setting up a Duet Connection

**_**(Owner)**_** – Launch the Duet server on the owner’s machine

```python
import syft as sy
duet = sy.launch_duet()
```

You can see the shift in control right from the get-go. Unlike traditional federated learning approaches, in Duet, the owner initiates the connection. The scientist cannot access anything unless the owner invites them to a collaborative training session.

Initiating a Duet session will generate a session ID that needs to be shared with the scientist to join the session.

Let’s suppose the session ID is `xyxyxyxyxyxyxyxyxyxyxyxyxyxyxyxy`

**_**(Scientist)**_** _– Use the session ID to join the Duet session_

```python
import syft as sy
duet = sy.join_duet("xyxyxyxyxyxyxyxyxyxyxyxyxyxyxyxy")
```

On execution, a client ID will be returned that the owner needs to enter into the prompt at their end. This would finally connect the two parties.

#### Part 2 – Setting up Model for remote training

Most of the work here is to be done by the **_scientist_**.

_**(Scientist)**_ – Create a simple convolution network. Notice here that we do this just like PyTorch with two crucial differences

-   We inherit from `sy.Module` instead of `nn.Module`
-   We need to pass in a variable called `torch_ref` which we will use internally for any calls that would normally be to `torch`

```python
class SyNet(sy.Module):
    def __init__(self, torch_ref):
        super(SyNet, self).__init__(torch_ref=torch_ref)
        self.conv1 = self.torch_ref.nn.Conv2d(1, 32, 3, 1)
        self.conv2 = self.torch_ref.nn.Conv2d(32, 64, 3, 1) 
        self.dropout = self.torch_ref.nn.Dropout2d(0.25)
        self.fc1 = self.torch_ref.nn.Linear(9216, 128)
        self.fc2 = self.torch_ref.nn.Linear(128, 10)

    def forward(self, x):
        x = self.torch_ref.nn.functional.relu(self.conv1(x))
        x = self.torch_ref.nn.functional.relu(self.conv2(x))
        x = self.torch_ref.nn.functional.max_pool2d(x, 2)
        x = self.dropout(x)
        x = self.torch_ref.flatten(x, 1)
        x = self.torch_ref.nn.functional.relu(self.fc1(x))
        x = self.fc2(self.dropout(x))
        output = self.torch_ref.nn.functional.log_softmax(x, dim=1)
        return output
```

**_**(Scientist)**_** – Create a local model using local copies of `torch` and `torchvision`

```python
import torch
import torchvision

local_model = SyNet(torch)

local_transform_1 = torchvision.transforms.ToTensor()  
local_transform_2 = torchvision.transforms.Normalize(0.1307, 0.3081) 
local_transforms = torchvision.transforms.Compose([local_transform_1, local_transform_2])

args = {"batch_size": 64,
        "test_batch_size": 1000,
        "epochs": 14,
        "lr": 1.0,
        "gamma": 0.7,
        "no_cuda": False,
        "seed": 42, # the meaning of life
        "log_interval": 10,
        "save_model": True,}

test_data = torchvision.datasets.MNIST('../data', train=False, download=True, transform=local_transforms)
test_loader = torch.utils.data.DataLoader(test_data,args["test_batch_size"])
test_data_length = len(test_loader.dataset)
```

#### Part 3 – Sending the local model to the Duet partner

Once the **_scientist_** has initialized the model, they can send it to their Duet partner for training. They can also request the Duet partner to provide details such as availability of GPU via the Duet API.

**_(Scientist)_** – Request details of GPU availability from the owner.

```python
# send the model to data owner's machine
remote_model = local_model.send(duet)

# lets ask the Data Owner if their Machine has CUDA
has_cuda = False
has_cuda_ptr = remote_torch.cuda.is_available()
has_cuda = bool(has_cuda_ptr.get(request_block=True,
                                 name="cuda_is_available",
                                 reason="To run test and inference locally",
                                 timeout_secs=5,))
```

_**(Owner)**_ – At their end, the owner can see all available requests using `duet.requests.pandas`. They can manually approve or deny requests using `accept()` or `deny()`.  
For example, first request in the queue can be approved as follows `duet.requests[0].accept()`

Alternatively, the owner can predefine handlers that’ll approve or deny the requests automatically

```python
duet.requests.add_handler(name="cuda_is_available", action="accept")

duet.requests.add_handler(
    name="loss",
    action="deny",
    timeout_secs=-1,  # no timeout
    print_local=True  # print the result in your notebook
)

duet.requests.add_handler(name="train_size", action="accept")
```

Notice here that the owner has added a handler for `loss` that’ll deny the request. Keep this in mind, as we’ll come back to this later.

Note – `name` argument for requests sent by the scientist and handlers added by the owners need to match, otherwise the handlers would fail to work. So, both parties need to engage in open and honest communication otherwise the training session would fail.

#### Part 4 – Setting up the training process

**_**(Scientist)**_** – Define the `train()` function for the remote model on the owner’s device

```python
def train(remote_model, torch_ref, train_loader, optimizer, epoch, args, train_data_length):

    train_batches = round((train_data_length / args["batch_size"]) + 0.5)
    if remote_model.is_local:
        print("Training requires remote remote_model")
        return
    remote_model.train()

    for batch_idx, data in enumerate(train_loader):
        data_ptr, target_ptr = data[0], data[1]
        optimizer.zero_grad()
        output = remote_model(data_ptr)
        loss = torch_ref.nn.functional.nll_loss(output, target_ptr)
        loss.backward()
        optimizer.step()
        loss_item = loss.item()
        train_loss = duet.python.Float(0)  # create a remote Float we can use for summation
        train_loss += loss_item
		
        if batch_idx % args["log_interval"] == 0:
            local_loss = None
            local_loss = loss_item.get(name="loss",
				       reason="To evaluate training progress",
				       request_block=True,
				       timeout_secs=5)
            if local_loss is not None:
                print("Train Epoch: {} {} {:.4}".format(epoch, batch_idx, local_loss))
            else:
                print("Train Epoch: {} {} ?".format(epoch, batch_idx))
```

Well, the code here certainly looks overwhelming. So let’s break it down piece-by-piece.

1.  First the `is_local` attribute of the model is checked to ensure that the model passed to the function is a remote model, not a local one.
2.  Like a standard training operation, we fetch the data, pass it through the model, and calculate the loss. However, notice the distinction here. We use the remote torch library as indicated by `torch_ref` used in the snippet above.
3.  Since operations are executed on the remote machine, we do not have access to any training information unless we explicitly request permission for it. Let’s say, we want to monitor the training loss, we request the owner’s permission using the Duet API.

We are almost done here. Now, if you go back to Part 3 of this article you’ll notice that the owner had already added a handler to reject the scientist’s request for viewing training loss.

<figure class="">

![](./media/you-shall-not-pass.jpg)

</figure>

Isn’t this wonderful? The owner has full control over what data is accessible to the other Duet party.

Note – I have skipped out some of the code and parts of the model training process for the sake of keeping the article concise. However, I’ve covered all the concepts that you need to know to get started with Duet.

For full training and inference code, check out the [sample Duet notebooks](https://github.com/OpenMined/PySyft/tree/dev/examples/duet/mnist).

Disclaimer – Duet is still in development and the API may change in future releases. Please keep an eye on the [official PySyft repo](https://github.com/OpenMined/PySyft).
