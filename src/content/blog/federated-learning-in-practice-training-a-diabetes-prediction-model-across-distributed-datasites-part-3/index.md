---
title: "Federated Learning in Practice: Training a Diabetes Prediction Model Across Distributed Datasites – Part 3"
slug: federated-learning-in-practice-training-a-diabetes-prediction-model-across-distributed-datasites-part-3
date: 2025-07-07T21:40:08
updated: 2025-07-21T23:23:51
categories: [product]
tags: [federated-learning, tutorials, privacy-enhancing-technologies-pets, syftbox]
authors: [khoa-nguyen, osam-kyemenu-sarsah]
cover: ./cover.jpg
coverAlt: ""
cardText: light
draft: false
legacyId: 7129
seo:
  description: "Learn how to deploy your own public datasite and participate as a Data Owner in a real federated learning network using SyftBox. Part 3 of the series shows you how to securely share data for remote training while preserving privacy."
---

## The Data Owner Role: Setting Up a Public Datasite

In [part 1](https://openmined.org/blog/federated-learning-in-practice-diabetes-prediction/) and [part 2](https://openmined.org/blog/federated-learning-in-practice-training-a-diabetes-prediction-model-across-distributed-datasites-part-2/), we simulated a Data Owner’s environment and then connected to a pre-existing remote one. In this final part of the series, we will learn how to **create and deploy our own public datasite**. This is the crucial step for any organization wanting to participate as a data provider in a larger federated learning network.

As a Data Owner, your goal is to make your data available for secure computation while maintaining full control and privacy. This means deploying a persistent, network-accessible datasite that other data scientists can submit jobs to.

> If you are already a Federated Learning practitioner, consider our **Federated Learning Co-Design Program**. You will get direct support from the OpenMined team to build production ready federated learning solutions.
> 
>  <a class="btn" href="https://openmined.org/federated-learning/co-design/" target="_blank" rel="noopener">Learn more and apply now →</a> 

### Step 1: Deploying a Public Datasite

To deploy a public datasite instead of a local simulation, we turn the `` `LOCAL_TEST` `` flag `False`. When you have your SyftBox client running, it will instruct SyftBox to deploy a persistent, network-accessible datasite on the network with public mock data for discoverability and experimentation.

For the `DO_EMAIL`, you must use the official, registered identity you created with SyftBox in Part 1, Step 3. This is your unique, verifiable address on the network.

```python
# In your Data Owner setup notebook (e.g., do1.ipynb)

import syft_rds as sy
from syft_core import Client

DO_EMAIL = Client.load().email
print("DO email: ", DO_EMAIL)

do_client = sy.init_session(host=DO_EMAIL)
```

Once this command completes, your datasite is live and discoverable on the [SyftBox network](https://www.syftbox.net/) by other authenticated users.

The data owners will also have to run a remote data science (rds) server to be able to receive jobs from data scientists. So next, let’s run it in a terminal:

```
uv run syft-rds server
```

### Step 2: Managing Data and Jobs

Just like the Data Scientist’s workflow, the Data Owner’s day-to-day management tasks remain **exactly the same** whether the datasite is local or on the network.

You would follow the identical steps from Part 1 to:

1.  **Create your dataset**, providing both the `path` to the private data (which will always stay locally on your machine, never be shared or uploaded to the SyftBox network) and a `mock_path` for discoverability. Mock dataset can be a very short and noisy version of the private dataset (e.g. synthetic data), it only needs to mirror the private dataset’s structure.
2.  **Monitor for incoming jobs** from data scientists using `do_client.jobs.get_all()`.
3.  **Review and execute** approved jobs on your private data using `job.show_user_code()` and `do_client.run_private(job)`.

The `syft_flwr` framework is designed to provide a consistent and simple interface, abstracting away the underlying complexities of networking and deployment. This allows you, the Data Owner, to focus on what matters: data governance and secure collaboration.

---

## Series Conclusion: Your Journey in Federated Learning

Congratulations! Over this three-part series, you have navigated a complete, end-to-end federated learning workflow. Let’s recap the journey:

-   In **[Part 1](https://openmined.org/blog/federated-learning-in-practice-diabetes-prediction/)**, you built a foundational understanding by simulating the entire network—two Data Owners and a Data Scientist—on your local machine.
-   In **[Part 2](https://openmined.org/blog/federated-learning-in-practice-training-a-diabetes-prediction-model-across-distributed-datasites-part-2/)**, you stepped into the role of a Data Scientist, submitting a real training job to remote datasites on a distributed network hosted by [SyftBox](https://www.syftbox.net/).
-   In **Part 3**, you switched hats to become a Data Owner, learning how to deploy your own public datasite and securely manage requests from other datasites on the network.

You have successfully trained a machine learning model that learned from multiple, distributed private datasets without anyone ever having to share their raw data. This is the core promise of federated learning in action, made practical and accessible by leveraging OpenMined’s [Syftbox](https://www.syftbox.net/) and the [Flower](https://flower.ai/) federated learning framework.

### Start Building for Production?

We invite data scientists, researchers, and engineers working on production federated learning use cases to check out and apply to our **Federated Learning Co-Design Program** (No commitments). You will get direct support from the OpenMined team to build production-ready federated learning solutions.

 <a class="btn" href="https://openmined.org/federated-learning/co-design/" target="_blank" rel="noopener">Apply to the Co-Design Program Now</a> 

### Have questions or want to contribute?

Your journey doesn’t have to end here. The best way to learn is by doing and engaging with the community. If you have questions, run into issues, or want to share your experience, the OpenMined community is the place to go.

-   Join the conversation in our [Slack Community](https://openmined.org/slack/)
-   Already in the OpenMined workspace? Join the `[#community-federated-learning](https://openmined.slack.com/archives/C081120HQ21)` channel
