---
title: "Design a federated learning system in seven steps"
slug: design-a-federated-learning-system-in-seven-steps
date: 2021-10-29T00:00:00
updated: 2024-12-09T19:10:57
categories: [research]
tags: [federated-learning, tutorials, privacy-preserving-machine-learning, multi-party-computation]
authors: [nasron-cheong]
draft: false
legacyId: 1585
---
<!-- TODO(a11y): 5 localized body image(s) have empty alt text -->


#### _What should you consider when building an enterprise federated learning system?_

<figure class="">

![](./media/4-hunter-harritt-ype9sdopdyc-unsplash.jpg)

<figcaption>Photo by <a href="https://unsplash.com/@hharritt?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText" rel="noopener">Hunter Harritt</a> on <a href="https://unsplash.com/s/photos/machine-learning?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText" rel="noopener">Unsplash</a></figcaption></figure>

### Introduction

Companies like Google and Apple have pioneered federated learning as a way to build higher performing machine learning models on distributed datasets without compromising privacy. Today, Google uses federated learning to power keyboard predictions in Gboard and Apple uses it to improve the accuracy of Face ID and Siri.

But how do you get started?

While there are many great [resources](https://changelog.com/practicalai/153) that describe what federated learning is, there isn’t a lot of information covering how to apply it in your business.

This article is meant to be a guide that will enable you to set up a scalable federated learning system. Because requirements may differ across users and use cases, this guide won’t provide you with all of the answers. However, it should equip you with key questions and considerations to help you design a system that works for you.

At [integrate.ai](https://integrate.ai/) (where I am Engineering Lead) we are focused on making federated learning more accessible. Here are the seven steps that we’ve uncovered:

-   **Step 1**: Pick your model framework
-   **Step 2:** Determine the network mechanism
-   **Step 3:** Build the centralized service
-   **Step 4:** Design the client system
-   **Step 5:** Set up the training process
-   **Step 6:** Establish the model management system
-   **Step 7:** Addressing privacy and security

### Federated learning 101

Before we dive in, let’s make sure you have a basic understanding of federated learning.

Unlike traditional machine learning techniques that require data to be centralized for training, federated learning is a method for training models on distributed datasets. Portions of a machine learning model are trained where the data is located (e.g., these could be private datasets from two or more companies) and model parameters are shared among participants to produce an improved model. No data moves within the system, which means that organizations can collaborate without compromising privacy or sensitive IP while avoiding the pain and expense of transferring data through traditional means.

Here are some examples of where federated learning can be used:

-   Improving natural language processing models in robotic process automation solutions by using data from multiple enterprises
-   Increasing the accuracy of fraud detection models using data from credit card companies and banks
-   Improving attribution models using data from advertisers and publishers
-   Enhancing personalization and recommendation systems using data from different consumer enterprises
-   Improving computer-vision models for healthcare diagnostics using data from multiple hospitals
-   Avoiding the need to migrate databases into a centralized location for machine learning purposes

Time to jump into how to set up a federated learning system.

For simplicity, let’s assume we’re doing horizontal federated learning. In this case, the target variable and inputs for the machine learning task are the same across datasets but more samples are needed to make a better model.

### Step 1: Pick your model framework

<figure class="">

![](./media/4-christopher-gower-m-hrflhgabo-unsplash-1.jpg)

<figcaption>Photo by <a href="https://unsplash.com/@cgower?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText" rel="noopener">Christopher Gower</a> on <a href="https://unsplash.com/?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText" rel="noopener">Unsplash</a></figcaption></figure>

The first step is to pick your underlying model implementation. You’ll need to choose a model framework that has some support for federated learning in the form for your application. Selection criteria includes items like domain (e.g. imaging, NLP, or tabular data), team familiarity with the technology, and the compatibility of the framework with existing infrastructure.

[PyTorch](https://pytorch.org/) or [TensorFlow](https://www.tensorflow.org/) are popular choices; these libraries provide some facilities for federated learning but additional production ready components need to be added for a complete solution. Key components are described below.

### Step 2: Determine the networking mechanism

Next, you need to determine what networking mechanism to use. This mechanism is the messaging format and framework for passing the instructions between each participant in the federated learning network.

There are few options to choose from, including:

-   [PySyft](https://github.com/OpenMined/PySyft) with PyTorch — a PyTorch focused framework from OpenMined to enable federated learning
-   [Flower](https://flower.dev/) — a generic framework that abstracts the messaging flow to support multiple modeling frameworks.
-   [Tensorflow Federated](https://www.tensorflow.org/federated/tutorials/custom_federated_algorithms_1) — Tensorflow’s approach to distributing model operations

Deciding on which option is right for you usually comes down to how flexible you need the networking mechanism to be across modeling frameworks. For example, if your team wants to work mainly in PyTorch and needs lower level access to modeling operations, then PySyft may be a good choice.

If you want to prioritize flexibility, then Flower is a good choice because it enables federated learning on different modeling frameworks.

Both the networking and core model framework choices are also dependent on the application being within an organization, or between multiple organizations. In the latter case, choices need to be acceptable across all participating organizations.

Now we have some base pieces to begin putting together a federated learning system.

### Step 3: Build the centralized service

<figure class="">

![](./media/4-rodrigo-kugnharski-pdwc5wm1stw-unsplash.jpg)

<figcaption>Photo by <a href="https://unsplash.com/@kugnharski?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText" rel="noopener">Rodrigo Kugnharski</a> on <a href="https://unsplash.com/s/photos/center?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText" rel="noopener">Unsplash</a></figcaption></figure>

Once you have picked your model framework and networking mechanism, you need to establish a centralized service to manage the participants. This service will be responsible for coordinating communication between the participants, as well as monitoring the training progress.

From an operational perspective, this service will likely need to:

1.  Have authentication and authorization mechanisms built in, along with the support structure to keep it reliable; this includes ensuring that the service is stateless to aid in load balancing, which means that a storage mechanism needs to be chosen to hold intermediate information passing between clients.
2.  Be deployed, and maintained to meet the demand of the federated learning system.
3.  Be able to administer the training sessions.

There are additional key design considerations from a functional perspective, to take into account as well. For example:

-   Does authorization or service isolation need to be added to separate different data networks? That is, some groups of participants that can collaborate together, but not between groups.
-   Can a client trigger a training session or does it have to be centrally administered?
-   How will clients disconnecting and reconnecting affect the training? This problem is compounded by the number of parties participating in the training.
-   What statistics should be collected during the training session and how will monitoring be set up so that the system can measure the quality of the model being trained?
-   How will the service manage participating clients operating at different speeds?
-   How will the system know when to drop a client if they become unreliable so that the model can still continue to be trained?

Taking the time to design a system that takes these considerations into account is critical to ensure that the system you will implement will be reliable, flexible and valuable.

### Step 4: Design the client system

<figure class="">

![](./media/4-israel-palacio-imcukz72ous-unsplash.jpg)

<figcaption>Photo by <a href="https://unsplash.com/@othentikisra?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText" rel="noopener">israel palacio</a> on <a href="https://unsplash.com/s/photos/connection?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText" rel="noopener">Unsplash</a></figcaption></figure>

Now it’s time to consider a possible design for the client system. This system needs to be able to perform client side training operations, and coordinate the model parameters with the central service. The client system will also need to fetch new parameters from other clients in the network to update the local model.

To design and deliver a reliable client application, you should seek to answer the following questions:

-   Should the client system be a package that’s installable or should it be something like a docker image? How will dependency versioning be managed?
-   How will the client authenticate and communicate with the server?
-   How will monitoring the training process work?
-   How will error recovery be handled during the model training process?

### Step 5: Set up training processes

The federated learning system needs to know what private data should be used from each client to train the local models for a particular session.

This information needs to come from another user, or the central service. Therefore, the meta information about available data has to be managed in some form; this is typically done by the central service.

This also requires that clients register this meta information about what datasets are available for other clients. Similarly, metadata for each client will need to be retrieved from the central service about which datasets should be used for a training session.

### Step 6: Establish the model management system

The output of a training session is a machine learning model. The federated learning system needs to manage model metrics and access so that the appropriate users can use the trained model.

The following questions can be used to guide how the system will manage models:

-   Should all participants be able to access a copy of the model or do only some participants get access to it?
-   Where will the model be stored (typically this will be by the centralized service)?

### Step 7: Addressing privacy and security

<figure class="">

![](./media/1d6cosrqcuxb8jqrujk7ynw.jpg)

<figcaption>Photo by <a href="https://unsplash.com/@flyd2069?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText" data-href="https://unsplash.com/@flyd2069?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText" class="markup--anchor markup--figure-anchor" rel="noopener" target="_blank">FLY:D</a> on&nbsp;<a href="https://unsplash.com/s/photos/cyber-security?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText" data-href="https://unsplash.com/s/photos/cyber-security?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText" class="markup--anchor markup--figure-anchor" rel="noopener" target="_blank">Unsplash</a></figcaption></figure>

The final model is available locally to one or more of the participants. Because this model was trained by sharing weights between different parties, inverting the model to retrieve insights about the underlying training data is possible.

Therefore, determining the acceptable risks for the model itself is important. These risks could include being able to re-identify an individual in a particular training set or regenerate the training set itself, which could contain sensitive IP that a participant does not want to expose.

Different methods for mitigating these risks exist; one example would be applying differential privacy to the model weights before transmission to the central service. By adjusting the privacy budget, it’s possible to balance the utility of the final model with the amount of risk that you find acceptable.

Optimizing model risk versus model performance is use case dependent so it’s important to engage the right stakeholders when making this decision.

### Conclusion

Federated learning has a huge potential to be a key tool for data scientists, enabling them to train better models across distributed data sets without compromising privacy or sensitive IP. However, understanding where and how to start with implementing federated learning in your enterprise can seem like a daunting task.

I hope that the steps above help guide you on your journey to using federated learning. If you have any questions or feedback on this guide, I’d love to discuss them in the comments.
