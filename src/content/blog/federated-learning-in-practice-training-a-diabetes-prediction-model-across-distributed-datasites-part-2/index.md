---
title: "Federated Learning in Practice: Training a Diabetes Prediction Model Across Distributed Datasites – Part 2"
slug: federated-learning-in-practice-training-a-diabetes-prediction-model-across-distributed-datasites-part-2
date: 2025-07-02T16:58:44
updated: 2025-07-21T23:24:11
categories: [product]
tags: [federated-learning, tutorials, privacy-enhancing-technologies-pets, syftbox]
authors: [khoa-nguyen, osam-kyemenu-sarsah]
cover: ./cover.jpg
coverAlt: ""
cardText: light
draft: false
legacyId: 7128
seo:
  description: "In Part 2 of our Federated Learning series, learn how to submit a machine learning job to real, remote datasites using the SyftBox network—without accessing private data. A practical guide for Data Scientists moving from local simulation to distributed networks."
---

## The Data Scientist Role: Submitting a Job to a Remote Network

In [Part 1](https://openmined.org/blog/federated-learning-in-practice-diabetes-prediction/), we successfully simulated the entire federated learning workflow on our local machine. We saw how Data Owners (DOs) could set up their datasites and how a Data Scientist (DS) could submit a job to train a model across them. This local run was crucial for understanding the mechanics of the process. Now, we’ll take the next logical step: moving from simulation to a real, distributed network. In this part, you will act as the Data Scientist, but instead of connecting to local datasites, you will submit your training job to remote data owners running on the [SyftBox network](https://www.syftbox.net/). The exciting part? The code and workflow remain almost exactly the same, showcasing the power of the `syft_flwr` abstraction layer.

> If you are already a Federated Learning practitioner, consider our **Federated Learning Co-Design Program**. You will get direct support from the OpenMined team to build production ready federated learning solutions.
> 
>  <a class="btn" href="https://openmined.org/federated-learning/co-design/" target="_blank" rel="noopener">Learn more and apply now →</a> 

### Step 1: Switching to Remote Mode

The only change we need to make in our Data Scientist notebook (`ds.ipynb`) is to switch off local testing. This tells SyftBox to stop simulating the network locally and instead connect to real, remote datasites.

In your `ds.ipynb` notebook, find the cell where `LOCAL_TEST` is defined and set it to `False`. Ensure your SyftBox client is running in your terminal, as it handles the communication between datasites.

### Step 2: Connecting to Remote Data Owners

With `LOCAL_TEST` now `False`, our connection code points to the public identifiers of the remote datasites. Part 1 established a pattern of using email-style addresses as unique identifiers, and we continue that here. For this tutorial, we will connect to two datasites hosted by OpenMined with emails `flower-test-group-1@openmined.org` and `flower-test-group-2@openmined.org`.

```python
from pathlib import Path
from syft_rds.orchestra import setup_rds_server

# This flag is the only change needed to go from local to remote
LOCAL_TEST = False

import syft_rds as sy
from syft_core import Client
DS = Client.load().email

# We now use the public identifiers of the remote datasites
DO1 = "flower-test-group-1@openmined.org"
DO2 = "flower-test-group-2@openmined.org"

# Initialize sessions with the remote hosts
do_client_1 = sy.init_session(host=DO1)
print("Logged into: ", do_client_1.host)

do_client_2 = sy.init_session(host=DO2)
print("Logged into: ", do_client_2.host)

do_clients = [do_client_1, do_client_2]
do_emails = [DO1, DO2]
```

### Step 3: The Workflow Stays the Same

This is the most powerful takeaway of the `syft_flwr` framework. From this point on, the Data Scientist’s workflow is **identical** to the one we followed in the local simulation. You would still:

1.  Explore the mock datasets from the DOs to understand their structure.
2.  Bootstrap the `syft_flwr` project to configure it for the remote participants.
3.  (Optional) Run simulations using `syft_flwr.run()` to ensure the code is correct before submission.
4.  Submit the job to the remote datasites.

When you run the job submission code, your `syft_flwr` project is securely sent across the internet to the remote datasites. On the other end, the Data Owners would receive a notification and follow the same review and approval process we saw in Step 7 of [Part 1](https://openmined.org/blog/federated-learning-in-practice-diabetes-prediction/). For this tutorial, the remote datasites are configured to automatically approve the job, allowing training to begin immediately.

## What We Have Accomplished in Part 2

You have now successfully acted as a Data Scientist in a real-world federated learning scenario. You submitted a job to train a federated model to remote participants without ever having direct access to their infrastructure or their private data. The `syft_flwr` framework leveraging the [Syftbox Network](https://www.syftbox.net/) handles the complex networking, security, and orchestration, allowing you to focus on the machine learning task.

But how are these public, remote datasites created in the first place? In our [final part](https://openmined.org/blog/federated-learning-in-practice-training-a-diabetes-prediction-model-across-distributed-datasites-part-3/), we will switch hats one last time to become a Data Owner and learn how to set up our own persistent, public datasite.

## Skip Ahead and Start Building for Production?

We invite data scientists, researchers, and engineers working on production federated learning use cases to check out and apply to our **Federated Learning Co-Design Program** (No commitments).

 <a class="btn" href="https://openmined.org/federated-learning/co-design/" target="_blank" rel="noopener">Apply to the Co-Design Program Now</a> 

### Have questions?

-   Join the conversation in our [Slack Community](https://openmined.org/slack/)
-   Already in the OpenMined workspace? Join the `[#community-federated-learning](https://openmined.slack.com/archives/C081120HQ21)` channel
