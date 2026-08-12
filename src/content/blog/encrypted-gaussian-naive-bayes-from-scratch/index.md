---
title: "Encrypted Gaussian Naive Bayes from scratch"
slug: encrypted-gaussian-naive-bayes-from-scratch
date: 2020-07-07T15:37:49
updated: 2024-12-09T20:49:10
categories: [research]
tags: [tutorials]
authors: [siddhesh-shinde]
draft: false
legacyId: 2172
---

<!-- TODO(content): shortcode(s) present (verify) -->

## Naive Bayes:

Based on **Bayes Theorem**, Naive Bayes methods are probabilistic models which are used for classification. They are highly useful when dimensionality of the dataset is high.

### Bayes Theorem:

begin{align}P(A|B) = frac{P(B|A) \* P(A)}{P(B)}end{align}

Using **Bayes Theorem**, we can find the probability of an _event A_ occurring, given that an _event B_ has already occurred. Here, we consider a “_naive_” assumption that _events A and B_ are **independent of each other**. This assumption is held for all feature vectors that we consider.

So to calculate the probability of a given **variable** _y_, where we are provided with **feature vectors** _x1_ to _xn_, the Bayes Theorem can be applied as:

begin{align}P(y|x\_1, x\_2,.., x\_n) = frac{P(x\_1, x\_2,.., x\_n | y) \* P(y)}{P(x\_1, x\_2,.., x\_n)}end{align}

Depending upon the type of data we have, we can apply the following Theorem:

1.  Gaussian Naive Bayes
2.  Multinomial Naive Bayes (for multinomial data)
3.  Complement Naive Bayes (for imbalance multinomial data)
4.  Bernoulli Naive Bayes (for boolean-valued data)
5.  Categorical Naive Bayes (for categorically distributed data)

_In the following example, we will look at **Gaussian Naive Bayes**._

### Problem with Standard Naive Bayes

We can use Naive Bayes only on **categorical data,** i.e. _if we do not want to go ahead and bucket our data into categories_. At such times, it is useful to implement Gaussian Naive Bayes since it works on dataset with **continuous values**.

## Gaussian Naive Bayes

Here, we assume the feature set to be Gaussian in nature:  
begin{align}P(x\_i mid y) = frac{1}{sqrt{2pisigma^2\_y}} expleft(-frac{(x\_i – mu\_y)^2}{2sigma^2\_y}right)end{align}

Gaussian Naive Bayes helps us to deal with continuous data. In our dataset, if we have data which is distributed in **normal(or Gaussian)** form, we segregate the data according to their respective class values. Then, we calculate their mean and variance which then help us to further calculate the probability value of that particular attribute.

## Code Implementation:

```python
# import required packages
import torch
import syft as sy
```

Now we will create a virtual workers named **bob, alice and bill.**

```python
# create a hook
hook = sy.TorchHook(torch)

# create a worker
bob = sy.VirtualWorker(hook, id="bob")
alice = sy.VirtualWorker(hook, id="alice")
bill = sy.VirtualWorker(hook, id="bill")
```

For this code walk-through, we will generate some data and send it to **bob and alice,** while bill would be the crypto provider.

```python
# a random dataset 
data = torch.tensor([[3.393533211, 2.331273381],
					[3.110073483, 1.781539638],
					[1.343808831, 3.368360954],
					[3.582294042, 4.67917911],
					[2.280362439, 2.866990263],
					[7.423436942, 4.696522875],
					[5.745051997, 3.533989803],
					[9.172168622, 2.511101045],
					[7.792783481, 3.424088941],
					[7.939820817, 0.791637231]])
                    
# class values of the dataset
target = torch.tensor([[0],[0],[0],[0],[0],[1],[1],[1],[1],[1]])

# send the data and target labes to the workers
data = data.fix_precision().share(bob, alice, crypto_provider=bill)
target = target.fix_precision().share(bob, alice, crypto_provider=bill)
```

Following functions will help us to calculate the **statistics of our dataset** which we require to further calculate their probability value.

```python
# calculate mean of list
def mean(numbers):
    s = sum(numbers) / len(numbers)
    return s

# calculate standard deviation of list
def stddev(numbers):
    num_copy = numbers
    avg = mean(numbers)

    for n in range(len(num_copy)):
        num_copy[n] = (num_copy[n] - avg) * (num_copy[n] - avg)

    variance = sum(num_copy) / (len(num_copy) - 1)

    std = torch.sqrt(variance.get().float_precision())
    std = std.fix_precision().share(bob, alice, crypto_provider=bill)

    return std

# calculate stats(mean, stddev, total) for each attribute of the dataset
def summarize_dataset(rows):
    numAttributes = len(rows[0])
    summaries = []

    for n in range(numAttributes):
        elements = []
        for r in range(len(rows)):
            elements.append(rows[r][n])
        m = mean(elements)
        s = stddev(elements)
        l = torch.tensor([len(elements)]).fix_precision().share(bob, alice, crypto_provider=bill)
        summaries.append([m, s, l])
    
    return summaries
```

As our labels are encrypted as well, we will define a function to **store unique values from the labels**.

```python
# generate list of labels for our datset
def getLabels(target):
    labels = []

    for t in range(len(target)):
        same = 0
        for l in range(len(labels)):
            same = (target[t] == labels[l]).get()
            if same:
                break
        if not same:
            labels.append(target[t])
    
    return labels
```

Now we will **segregate the attributes according to their class values**. For that, we will create a dictionary called  _separated_ and store the attributes with the key being their class value.

```python
# separate the dataset according to the class values
separated = dict()
labels = getLabels(target)

# initialize the labels as keys for 
# separated dictionary
for label in labels:
    separated[label] = list()

# loop over the rows of the dataset and apped the rows to the dictionary
# according to their class values
for i in range(len(target)):
    for l in range(len(labels)):
        same = target[i] == labels[l]
        if same.get():
            separated[labels[l]].append(data[i])
```

In the following code, we calculate the statistics of our dataset using the functions we defined earlier and store these values in the form of a dictionary.

```python
# initialize the stats dictionary and
# calculate the stats for the values in
# the separated dictionary
summaries = dict()

for class_value, rows in separated.items():
    for l in range(len(labels)):
        same = class_value == labels[l]
        if same.get():
            summaries[labels[l]] = summarize_dataset(rows)
```

As the equation to calculate probability has some constant values, hence we encrypt and send these values to bob and alice to avoid any issues during division.

```python
# import pi value and squareroot function from math library
from math import pi, sqrt

# encrypt the constants and send their values to virtual workers
sq_pi = sqrt(2 * pi)
sq_pi = torch.tensor([sqrt(2 * pi)]).fix_precision().share(bob, alice, crypto_provider=bill)
one = torch.tensor([1]).fix_precision().share(bob, alice, crypto_provider=bill)
```

We will define a function to calculate the **gaussian probability**.

```python
# Calculate the Gaussian probability distribution function for given row
def calculate_probability(x, mean, stdev):
    numerator = (x-mean)**2
    denominator = 2 * (stdev**2) 
    exponent = torch.exp(-(numerator / denominator))
    p = ((one / (sq_pi * stdev)) * exponent)
    
    return p
```

Now comes our main function, where we implement Gaussian Naive Bayes using all the functions which we defined above.

```python
# Calculate the probabilities of predicting each class for a given row
def calculate_class_probabilities(summaries, row):
    total_rows = len(target)

    probabilities = dict()

    for class_value, class_summaries in summaries.items():
        probabilities[class_value] = summaries[class_value][0][2] / total_rows
        for i in range(len(class_summaries)):
            mean, stdev, _ = class_summaries[i]
            probabilities[class_value] *= calculate_probability(row[i], mean, stdev)
    return probabilities
```

We can test our code using any values. For simplicity, we are using values from the dataset.

```python
test = torch.tensor([3.393533211, 2.331273381]).fix_precision().share(bob, alice, crypto_provider=bill)
```

Finally, we can calculate the probabilities for the class values by passing our test tensor in the _calculate\_class\_probabilities()_ function along with the _summaries_ dictionary which we calculated for our dataset.

```python
# calculate probabilities of every class for a given row
prob = calculate_class_probabilities(summaries, test)

for k, v in prob.items():
    print(k.get().float_precision())
    print(v.get().float_precision())
```
