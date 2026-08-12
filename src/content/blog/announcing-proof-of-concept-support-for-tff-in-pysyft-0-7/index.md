---
title: "Announcing Proof-of-Concept Support for TFF in PySyft 0.7"
slug: announcing-proof-of-concept-support-for-tff-in-pysyft-0-7
date: 2022-09-26T16:33:18
updated: 2024-12-13T17:00:51
categories: [product]
tags: [pysyft, announcements]
authors: [teo-milea]
cover: ./cover.jpg
coverAlt: ""
draft: false
legacyId: 1344
---

<!-- TODO(content): shortcode(s) present (verify) -->

**Summary:** We are excited to announce that, as a part of the 0.7 release of PySyft, it will be possible to construct TensorFlow Federated computations and run them across a network of Domain nodes to train an AI model. We are particularly excited about the potential for this integration to bring the scale and flexibility to the PySyft ecosystem that TFF offers, in addition to the robust privacy techniques encoded within TFF’s APIs.

This integration is in the spirit of the OpenMined community’s desire to bring together different communities and technologies into a cohesive ecosystem for performing privacy preserving data science. To that end it is also aligned with PySyft’s long-term vision to integrate privacy enhancing technologies into an easy-to-use end-to-end platform for remote data science. If you run a privacy enhancing technologies project and you feel you might contribute to PySyft via an integration, please do reach out to @trask on [OpenMined’s slack](http://slack.openmined.org)!

To read more about the vision and motivations for this partnership, please see [TensorFlow Federated’s companion blogpost](https://blog.tensorflow.org/2022/09/bridging-communities-tensorflow-federated-tff-and-openmined.html).

If you’d like to join the team working on TensorFlow Federated, apply to work with Teo Milea as a part of [OpenMined’s padawan program](https://blog.openmined.org/work-on-ais-most-exciting-frontier-no-phd-required/)!

Outline:

-   **Part 1: About TensorFlow Federated**
-   **Part 2: About the TFF and PySyft Integration**
-   **Part 3: PySyft + TFF Tutorial**

**Part 1: About TensorFlow Federated**

Federated Learning has become a high-interest research topic with a strong promise to unlock access to datasets distributed across many owners. Recent research has seen successes in Federated Learning unlocking access to healthcare data at medical institutions as well as user data across mobile devices. As a vital component in the privacy enhancing technologies suite, it is a key pillar in the industry’s quest to make it possible to study data across 1000s of institutions without acquiring a copy of that data. If successful, Federated Learning and its PET (Privacy Enhancing Technologies) partners could lead to a transformative tailwind of new research data — with a myriad of major scientific breakthroughs in tow.

As Federated Learning has become more popular, multiple libraries have been developed, often integrating on top of major deep learning frameworks. Perhaps the first and most widely deployed/tested of these is TensorFlow Federated, which was developed by the team which originally proposed Federated Learning and deployed across hundreds of millions of Android devices around the world.

TensorFlow Federated combines TensorFlow with distributed communication operators and a strongly-typed functional environment in order to allow users to express novel federated algorithms. For convenience, it also provides high-level interfaces to common Federated Learning algorithms which can be applied to existing instances of TensorFlow models. This makes TFF one of the first choices for data scientists and data engineers when developing their data pipelines or their federated experiments, offering the potential to promote privacy with minimal impact to performance or flexibility.

**Part 2: About the TFF and PySyft Integration**

We are excited to announce a partnership with TFF which is born out of our shared belief in both privacy enhancing technologies and the value of open source software communities. The main goal of our collaboration is to allow PySyft users to use the TFF-compatible frameworks (TensorFlow/Keras/Jax/etc.) inside a PyGrid node deployed by HAGrid without requiring them to have a deep knowledge of either PySyft or TFF.

To help add clarity to this integration, we have prepared a proof-of-concept tutorial below in which we train a Keras model using data from a PyGrid node. Hopefully, this will offer you a glimpse into what the future of remote data science looks like and inspire you to [apply to work on this project with Teo Milea (me)!](https://blog.openmined.org/work-on-ais-most-exciting-frontier-no-phd-required/)

**Part 3: PySyft + TFF Tutorial**

**Steps:**

-   ******Step 1:****** Install Hagrid and Docker
-   **Step 2:** Open Hagrid Quickstart
-   **Step 3:** Within Hagrid Quickstart – Run the Wizard Notebook!
-   **Step 4:** Upgrade PySyft and Install TFF in Quickstart Environment
-   **Step 5:** Launch domain node using HAGrid
-   **Step 6:** Login to domain node
-   **Step 7:** Load dataset into jupyter notebook
-   **Step 8:** Select a subset of the dataset
-   **Step 9:** ETL dataset for training
-   **Step 10:** Annotate data with Differential Privacy related metadata
-   **Step 11:** Load dataset onto your domain node
-   **Step 12:** Create a data scientist account and give them privacy budget
-   **Step 13:** Login as data scientist
-   **Step 14:** Inspect datasets
-   **Step 15:** Create Keras model
-   **Step 16:** Train model on domain node
-   **Step 17:** Get involved in the team integrating PySyft + TFF!

In this tutorial we will show you how to deploy a HAGrid node that supports TFF and train a Keras model on the MedNIST dataset.

**Step 1:** Install Hagrid and Docker

Ok, first let’s get our setup ready! Note that this particularly tutorial is tested against Ubuntu 20.04 LTS with Python 3.9.9, but as Docker allows you to deploy on a wide variety of environments this tutorial should work for you regardless of your operating system. Let’s start by installing the needed packages.

<div style="overflow:auto; width:auto; border-width:.1em .1em .1em .8em; padding:.2em .6em"><pre style="margin: 0; line-height: 125%">$ pip install hagrid -U
</pre></div>

This will install the CLI tool which allows us to deploy domain nodes. In addition, you’ll need to install and run Docker (if you’re on Ubuntu 20 this is probably already installed, but if you’re on OSX or Windows you’ll need to run the client). You can find documentation on how to install Docker on [Docker’s Website](https://docs.docker.com/engine/install/) and the same information (plus some troubleshooting) on PySyft’s [Getting Started documentation](https://openmined.github.io/PySyft/getting_started/index.html).

**Step 2:** Open Hagrid Quickstart

Hagrid had a convenient command to launch a jupyter notebook inside of a conda environment. Please run:

<div style="overflow:auto; width:auto; border-width:.1em .1em .1em .8em; padding:.2em .6em"><pre style="margin: 0; line-height: 125%">$ hagrid quickstart
</pre></div>

This will pull down PySyft code as well.

**Step 3:** Within Hagrid Quickstart – Run the Wizard Notebook!

Within hagrid quickstart, run the cells in the wizard notebook to make sure you have all the right dependencies and can launch and land Domain servers.

**Step 4:** Upgrade PySyft and Install TFF in Quickstart Environment

Open up a new Jupyter Notebook and run the following command to upgrade PySyft (make sure to include the exclamation mark “!”).

<div style="overflow:auto; width:auto; border-width:.1em .1em .1em .8em; padding:.2em .6em"><pre style="margin: 0; line-height: 125%">!pip install syft -U --pre
</pre></div>

And now run the following command (also in a Jupyter notebook cell inside of quickstart) to install TensorFlow federated.

<div style="overflow:auto; width:auto; border-width:.1em .1em .1em .8em; padding:.2em .6em"><pre style="margin: 0; line-height: 125%">!pip install –upgrade tensorflow_federated
</pre></div>

If these commands ran successfully, you’re now ready to launch a domain node with TensorFlow Federated support!

Step 5: Launch domain node using HAGrid

From the command line (not jupyter notebook) run the following command:

<div style="overflow:auto; width:auto; border-width:.1em .1em .1em .8em; padding:.2em .6em"><pre style="margin: 0; line-height: 125%">$ hagrid launch –tag=latest –tff
</pre></div>

This will launch your domain server!

**Step 6:** Login to domain node

In the last step, we have started our domain. Hopefully, by now your domain node is up and healthy. Let’s see now how we can upload a dataset to this domain and train a model on it. Both of the notebooks described here can be found at: [https://github.com/OpenMined/PySyft/tree/dev/notebooks/PySyTFF](https://github.com/OpenMined/PySyft/tree/dev/notebooks/PySyTFF)

First, we will play the role of the Data Owner. We will log in to the Domain Node with the default credentials. From the jupyter notebook that was launched using “hagrid quickstart” a few steps ago, run:

<div style="overflow:auto; width:auto; border-width:.1em .1em .1em .8em; padding:.2em .6em"><pre style="margin: 0; line-height: 125%">domain = sy.login(email="info@openmined.org", password="changethis", port=8081)
<p></p></pre></div>

**Step 7:** Load dataset into jupyter notebook

For this demo we will use the MedNIST dataset for which we can run this cell to download it locally. Do so by running the following code in your notebook:

<div style="overflow:auto; width:auto; border-width:.1em .1em .1em .8em; padding:.2em .6em"><pre style="margin: 0; line-height: 125%"># Helper Methods
 
import os
import json
import pandas as pd
from PIL import Image
from enum import Enum
from collections import defaultdict
import numpy as np
from syft.core.adp.data_subject_list import DataSubjectList
from syft.core.adp.data_subject_list import DataSubjectArray
 
 
def get_label_mapping():
   # the data uses the following mapping
   mapping = {
       "AbdomenCT": 0,
       "BreastMRI": 1,
       "CXR": 2,
       "ChestCT": 3,
       "Hand": 4,
       "HeadCT": 5
   }
   return mapping
 
# download MedNIST.pkl
if not os.path.exists("./MedNIST.pkl"):
   os.system('curl -O "https://media.githubusercontent.com/media/shubham3121/datasets/main/MedNIST/MedNIST.pkl"')
else:
   print("MedNIST already downloaded")
 
df = pd.read_pickle("./MedNIST.pkl")
mapping = get_label_mapping()
 
total_num = df.shape[0]
print("Columns:", df.columns)
print("Total Images:", total_num)
print("Label Mapping", mapping)
</pre></div>

**Step 8:** Select a subset of the dataset

Because this dataset is quite big and our goal is not to solve the problem itself, but to quickly show you how to run a Keras model, we will only use a small subset from it to keep everything nice and fast:

<div style="overflow:auto; width:auto; border-width:.1em .1em .1em .8em; padding:.2em .6em"><pre style="margin: 0; line-height: 125%">subset_idx = []
step = 10000
size = 50
for i in range(6):
   subset_idx.extend(list(range(step * i, step * i + size)))
 
images = df['image'][subset_idx]
images = np.dstack(images.values).astype(np.int64)
images = np.rollaxis(images,-1)
labels = df['label'][subset_idx].to_numpy().astype("int64")
</pre></div>

**Step 9:** ETL dataset for training

Now we have to choose a way to represent the data subjects from our dataset. These are the unique entities that have data represented in the dataset, in our case the patients that have their data in the dataset. It is important to specify them in a different step as it is possible to have multiple data points corresponding to a single entity. For this, we can use the patient\_id from the dataset which is precisely the kind of identifier we need.

<div style="overflow:auto; width:auto; border-width:.1em .1em .1em .8em; padding:.2em .6em"><pre style="margin: 0; line-height: 125%">data_subjects = np.broadcast_to(np.array(DataSubjectList.from_series(df['patient_id'][subset_idx])),images.shape)
label_data_subjects = DataSubjectArray.from_objs(df['patient_id'][subset_idx])
</pre></div>

**Step 10:** Annotate data with Differential Privacy related metadata

Now we are ready to annotate the private data with metadata for our DP mechanism:

<div style="overflow:auto; width:auto; border-width:.1em .1em .1em .8em; padding:.2em .6em"><pre style="margin: 0; line-height: 125%">train_image_data = sy.Tensor(images).private(
   min_val=0, max_val=255, data_subjects=data_subjects
)
train_label_data = sy.Tensor(labels).private(
   min_val=0, max_val=5, data_subjects=label_data_subjects
)
</pre></div>

**Step 11:** Load dataset onto your domain node

<div style="overflow:auto; width:auto; border-width:.1em .1em .1em .8em; padding:.2em .6em"><pre style="margin: 0; line-height: 125%">domain.load_dataset(
   name='Mixed MedNIST 64 size 1200',
   assets={
       'images': train_image_data,
       "labels": train_label_data
   },
   description="Small dataset for TFF testing",
   chunk_size=200 * 2 ** 20
)
</pre></div>

**Step 12:** Create a data scientist account and give them privacy budget

However, loading a dataset into our node doesn’t mean anyone can access it yet for training machine learning models! For that, we need a data scientist user account. Let’s create one!

<div style="overflow:auto; width:auto; border-width:.1em .1em .1em .8em; padding:.2em .6em"><pre style="margin: 0; line-height: 125%">data_scientist_details = domain.create_user(
   name="Sam Carter",
   email="sam@stargate.net",
   password="changethis",
   budget=9999
)
</pre></div>

**Step 13:** Login as data scientist

Now it’s time to (pretend to be the data scientist and) train our Keras model!

Previously we uploaded the dataset to the domain and created a new data scientist account. Let’s use these credentials to login into the domain from the data scientist’s perspective. On a new notebook let’s run:

<div style="overflow:auto; width:auto; border-width:.1em .1em .1em .8em; padding:.2em .6em"><pre style="margin: 0; line-height: 125%">domain = sy.login(email="sam@stargate.net", password="changethis", port=8081)
</pre></div>

**Step 14:** Inspect datasets

Now we have a client that is logged in the domain node which will allow us to inspect the available datasets provided by the domain, by running:

<div style="overflow:auto; width:auto; border-width:.1em .1em .1em .8em; padding:.2em .6em"><pre style="margin: 0; line-height: 125%">domain.datasets
</pre></div>

**Step 15:** Create Keras model

Let’s create now Keras Model wrapped by a function just like in TFF:

<div style="overflow:auto; width:auto; border-width:.1em .1em .1em .8em; padding:.2em .6em"><pre style="margin: 0; line-height: 125%">def create_keras_model():
 return tf.keras.models.Sequential([
       tf.keras.layers.InputLayer(input_shape=(64,64,1), name='input'),
       tf.keras.layers.Conv2D(16, kernel_size=(5, 5), activation="relu", name='conv1'),
       tf.keras.layers.MaxPooling2D(pool_size=(2, 2), name='pool1'),
       tf.keras.layers.Flatten(),
       tf.keras.layers.Dense(32, kernel_initializer='zeros'),
       tf.keras.layers.ReLU(),
       tf.keras.layers.Dense(6, kernel_initializer='zeros'),
       tf.keras.layers.Softmax(),
 ])
</pre></div>

Now we will define some more parameters for the simulation we want to run. First, we will have to send the ids of the assets used for training the model. We will also specify the number of rounds we want to run, the number of clients we want to simulate, as well as a noise\_multiplier, and the number of clients on which we want to run this multiplier each round. For more details on how the DP features in TFF work, take a look at [this tutorial](https://www.tensorflow.org/federated/tutorials/federated_learning_with_differential_privacy). Given the model function and the parameters, we just have to run the new function `syft.tff.train_model`:

**Step 16:** Train model on domain node

<div style="overflow:auto; width:auto; border-width:.1em .1em .1em .8em; padding:.2em .6em"><pre style="margin: 0; line-height: 125%">model_fn = new_create_keras_model
 
params = {
   'rounds': 1,
   'no_clients': 5,
   'noise_multiplier': 0.05,
   'clients_per_round': 2,
   'train_data_id': domain.datasets[0]['images'].id_at_location.to_string(),
   'label_data_id': domain.datasets[0]['labels'].id_at_location.to_string()
   }
model, metrics = sy.tff.train_model(model_fn, params, domain)
</pre></div>

It might take a while, depending on the number of rounds you specified, the complexity of the network, and the size of your dataset, but that’s it. Congratulations, you’ve just trained your first Keras Model on a PyGrid node!

**Step 17:** Get involved in the team integrating PySyft + TFF!

It is true that our collaboration with TFF has just begun and there are plenty of improvements we can work on to make this proof-of-concept production ready. And by “we” I am also looking at you. Yeah, you!! If you have spotted some things that can be improved, feel free to apply to work with me through [OpenMined’s padawan program](https://blog.openmined.org/work-on-ais-most-exciting-frontier-no-phd-required/) — we want to expand our team and are excited to work with people that share our values and want to learn and contribute to both OpenMined and TFF. Feel free to take a look and apply!
