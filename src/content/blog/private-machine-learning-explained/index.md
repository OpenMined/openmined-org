---
title: "Privacy-Preserving Data Science, Explained"
slug: private-machine-learning-explained
date: 2020-05-19T12:59:15
updated: 2024-12-09T20:53:23
categories: [research]
tags: [federated-learning, differential-privacy, homomorphic-encryption, privacy-preserving-machine-learning, multi-party-computation]
authors: [emma-bluemke]
draft: false
legacyId: 2241
---

**Many of the issues that we want to solve today with data science require access to sensitive, personal information – be it our medical history, financial records, or private habits.** Every day, people like you and I produce a vast amount of data on our smartphones, electronic devices, or medical equipment. But because of privacy or proprietary concerns, data for tackling meaningful problems can be limited and difficult to access.

**Can we perform data science without intruding on our individual privacy? If so, what technologies can we combine to make it possible?**

Traditionally, training a model would require transferring this data to a central server, but this raises numerous concerns about the privacy and security of the data. The risks from data leaks and misuse have led various parts of the world to legislate data protection laws. To perform data science in domains that require private data while abiding data privacy laws and minimizing risks, machine learning researchers have harnessed solutions from privacy and security research, developing the field of private and secure data science.

Private and secure machine learning (ML) is heavily inspired by cryptography and privacy research. **It consists of a collection of techniques that allow models to be trained _without_ having direct access to the data and that prevent these models from inadvertently storing sensitive information about the data.**

Private and secure ML is performed in practice using a combination of techniques, though each method has limitations and costs. Some techniques would be overly burdensome in contexts where data and model owners already trust each other (e.g. when employees inside a company trains models on company-internal data), while others would be insufficiently secure for contexts that need to protect data and models from the actions of malicious actors. An appropriate mix of techniques for a specific project can only be decided once the various trade-offs of techniques are clearly communicated to the data-holders and key stakeholders of the project.

**In this blog series, we’ll explain common topics in privacy-preserving data science. We’ll distill each topic to a single sentence and quick overview in this introductory page, and in the followup posts, you’ll the further details and code demonstrations of each technique.**

**We hope these posts serve as a useful resource for you to figure out the best techniques for use cases in your organization.**

Want to go straight to the deep-dives? Here’s a shortcut:

-   **[What is Federated Learning?](https://blog.openmined.org/what-is-federated-learning/)**
-   [**What is Differential Privacy by Shuffling?**](https://blog.openmined.org/differential-privacy-by-shuffling/)
-   **[What is Homomorphic Encryption?](https://blog.openmined.org/what-is-homomorphic-encryption/)**
-   [**What is the Paillier Cryptosystem?**](https://blog.openmined.org/the-paillier-cryptosystem/)
-   **[What is Private Set Intersection?](https://blog.openmined.org/private-set-intersection/)**
-   **[Private Set Intersection with the Paillier Cryptosystem](https://blog.openmined.org/private-set-intersection-with-the-paillier-cryptosystem/)**
-   [**What is the Diffie-Hellman key exchange protocol?**](https://blog.openmined.org/diffie-hellman-key-exchange/)
-   **[Private Set Intersection with Diffie-Hellman](https://blog.openmined.org/private-set-intersection-with-diffie-hellman/)**
-   [**What is a Split Neural Network?**](https://blog.openmined.org/split-neural-networks-on-pysyft/)
-   [**What is PyVertical?**](https://blog.openmined.org/what-is-pyvertical/)
-   **[What is Secure Multi-Party Computation?](https://blog.openmined.org/what-is-secure-multi-party-computation/)**
-   **[What is CrypTen? / CrypTen Integration into PySyft](https://blog.openmined.org/crypten-integration-in-pysyft/)**
-   [**What is Encrypted Machine Learning as a Service?**](https://blog.openmined.org/what-is-encrypted-machine-learning-as-a-service/)

---

## Privacy Techniques: One Sentence Summaries

### Federated Learning

**In short: Federated learning means training your machine learning model on data that is stored on different devices or servers across the world, without having to centrally collect the data samples.**

Instead of moving the data to the model, copies of the global model are sent to where the data is located. The local data samples remain at their source devices, say a smartphone or a hospital server. A model is sent to the device and trained on the local data, after which the newly improved model with it’s update is sent back to the main server to be aggregated with the main model.

This preserves privacy in the sense that the data has not been moved from the device. However, there is still a limitation: the content of the local data can [sometimes be inferred](https://arxiv.org/pdf/1812.00535.pdf) from the weight updates or improvements in the model. While individual clients are not able to reconstruct samples, an “honest-but-curious” server could. To prevent the possibility of inferring personal characteristics from the data, further techniques can be employed, such as differential privacy or encrypted computation.

For more information and a code demonstration, see [**What is Federated Learning?**](https://blog.openmined.org/what-is-federated-learning/)

**There are, of course, some variations of federated learning** – if you’re interested, [learn more about **the difference between ‘model-centric’ and ‘data-centric’** federated learning here](https://blog.openmined.org/announcing-new-libraries-for-fl-on-web-and-mobile/). The description above focused on ‘data-centric’.

You can check out [**OpenMined’s library for federated learning, PySyft, on GitHub.**](https://github.com/OpenMined/PySyft)

### Differential Privacy

**In short: Sometimes, AI models can memorize details about the data they’ve trained on and could ‘leak’ these details later on. Differential privacy is a framework (using math) for measuring this leakage and reducing the possibility of it happening.**

Often, deep-neural networks are over-parameterized, meaning that they can encode more information than is necessary for the prediction task. The result is a machine learning model that can inadvertently memorize individual samples. For example, a language model designed to emit predictive text (such as the next-word suggestions seen on smartphones) can be [probed to release information](https://www.usenix.org/system/files/sec19-carlini.pdf) about individual samples that were used for training (“my social security number is …”).

Differential privacy is a mathematical framework for measuring this leakage. [Differential privacy](https://www.cis.upenn.edu/~aaroth/Papers/privacybook.pdf) describes the following promise to data owners: “you will not be affected, adversely or otherwise, by allowing your data to be used in any study or analysis, no matter what other studies, datasets, or information sources are available”.

A critical aspect of this definition is the guarantee of privacy no matter what other studies, datasets or information sources are available to the attacker – it’s been well-publicized that two or more ‘anonymized’ datasets can be combined to successfully infer and de-anonymize highly private information. This is known as a [‘linkage’ attack](https://www.marklogic.com/blog/protecting-linkage-attacks-use-anonymous-data/), and [presents a serious risk](https://gss.civilservice.gov.uk/wp-content/uploads/2018/12/12-12-18_FINAL_Privitar_Kobbi_Nissim_article.pdf) given the abundance of data so easily available to attackers today (examples: the infamous [Netflix prize attack](https://www.cs.cornell.edu/~shmat/shmat_oak08netflix.pdf), [health records being re-identified](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3229505/)). Differential privacy, however, is more robust than simple dataset anonymization in that it quantifies the risk that such de-anonymization can occur, empowering a data owner with the ability to minimize the risk.

Differential privacy works by injecting a controlled amount of statistical noise to obscure the data contributions from individuals in the dataset. This is performed while ensuring that the model still gains insight into the overall population, and thus provides predictions that are accurate enough to be useful. Research in this field allows the degree of privacy loss to be calculated and evaluated based on the concept of a privacy ‘budget’, and ultimately, the use of differential privacy is a careful tradeoff between privacy preservation and model utility.

Stay tuned for our detailed series on _What is Differential Privacy?_

### What is PyDP?

**In short: PyDP is a Python wrapper for Google’s [Differential Privacy](https://github.com/google/differential-privacy) project.**

Python has incredible adoption around the world and has become a tool of choice by many data scientists and machine learning experts. Making differential privacy accessible to their ecosystem is a priority for OpenMined. The library provides a set of ε-differentially private algorithms, which can be used to produce aggregate statistics over numeric data sets containing private or sensitive information.

For more information, check out the [**PyDP repo on Github**](https://github.com/OpenMined/pydp). Stay tuned for more posts on PyDP.

### What is Differential Privacy by Shuffling?

**In short: The shuffler is a separate service that is responsible for receiving, grouping, and shuffling the data. Shuffling isn’t a privacy model in itself but a layer that can be compatible with various existing privacy strategies.**

Differential privacy has been established as the gold standard for measuring and guaranteeing data privacy, but putting it into practice has [proved challenging until recently](https://journalprivacyconfidentiality.org/index.php/jpc/article/view/689). Practitioners often face a difficult choice between privacy and accuracy. Privacy amplification by shuffling is a relatively new idea that aims to provide greater accuracy while preserving privacy by shuffling batches of similar data. This approach has the potential to allow for richer, more reliable data analysis while preserving privacy.

For a more in-depth explanation, see [**What is Differential Privacy by Shuffling?**](https://blog.openmined.org/differential-privacy-by-shuffling/)

### Homomorphic Encryption

**In short: Homomorphic encryption allows you to make your data unreadable yet still do math on it.**

Homomorphic encryption (HE), as opposed to traditional encryption methods, allows meaningful calculations to be performed on encrypted data. When using homomorphic encryption, data can be encrypted by its owner and sent to the model owner to run computation. For example, it would apply a trained classification model to encrypted patient data, and send back the encrypted result (e.g. a prediction of a disease) back to the patient. Notably, the model weights don’t need to be encrypted here as the computation happens on the model owner’s side. There are currently restrictions on the type of calculations that can be performed using homomorphic encryption, and the computation performance is still very far from traditional techniques.

For more information and a code demonstration, see [**What is Homomorphic Encryption?**](https://blog.openmined.org/what-is-homomorphic-encryption/)

You can check out [**OpenMined’s TenSEAL library for doing homomorphic encryption operations on tensors on GitHub.**](https://github.com/OpenMined/TenSEAL)

You might also be interested in: **[Homomorphic Encryption in PySyft with SEAL and PyTorch](https://blog.openmined.org/ckks-homomorphic-encryption-pytorch-pysyft-seal/), [Build an Homomorphic Encryption Scheme from Scratch with Python](https://blog.openmined.org/build-an-homomorphic-encryption-scheme-from-scratch-with-python/)**

**The [Paillier cryptosystem](https://en.wikipedia.org/wiki/Paillier_cryptosystem)**, invented by Pascal Paillier in 1999, is a partial homomorphic encryption scheme which allows two types of computation:

-   addition of two ciphertexts
-   multiplication of a ciphertext by a plaintext number

For a detailed explanation, please see [**What is the Paillier Cryptosystem?**](https://blog.openmined.org/the-paillier-cryptosystem/)

### What is Private Set Intersection?

**In short: If two parties want to test if their datasets contain a matching value, but don’t want to ‘show’ their data to each other, they can use private set intersection to do so.**

Private set intersection (PSI) is a powerful cryptographic technique which enables two parties, which both have a set of data points, to compare these data sets without exposing their raw data to the other party (thus sacrificing their individual data privacy). In other words, PSI allows us to test whether the parties share a common datapoint (such as a location, ID, etc) – the result is a third data set with only those elements, which both parties have in common.

For more information and a code demonstration, see [**What is Private Set Intersection?**](https://blog.openmined.org/private-set-intersection/)

You can also check out **[OpenMined’s PSI library on GitHub](https://github.com/OpenMined/PSI).**

You might also like to see how a PSI protocol can be built using the Paillier cryptosystem in **[Private Set Intersection with the Paillier Cryptosystem](https://blog.openmined.org/private-set-intersection-with-the-paillier-cryptosystem/).**

The **Diffie-Hellman key exchange protocol** allows two parties to agree on a single secret without an eavesdropper discovering what it is, and without revealing their respective private keys to each other. For more detail, please see [**What is the Diffie-Hellman key exchange protocol?**](https://blog.openmined.org/diffie-hellman-key-exchange/)

You might also like to see how a PSI protocol can be built using the Diffie-Hellman key exchange protocol in **[Private Set Intersection with Diffie-Hellman.](https://blog.openmined.org/private-set-intersection-with-diffie-hellman/)**

### What is Secure Multi-Party Computation?

**In short: Secure multi-party computation allows multiple parties to collectively perform some computation and receive the resulting output without ever exposing any party’s sensitive input.**

Secure multi-party computation (SMPC), in turn, is a method that allows separate parties to jointly compute a common function while keeping both the inputs and the function parameters private. It allows a model to be trained or applied to data from different sources without disclosing the training data items or the model’s weights. It relies on building shares of some value, which, when summed, reconstruct the original value. SMPC is computationally less intensive than HE, but requires a lot of communication between the parties, so bandwidth can be a bottleneck.

For more information and a code demonstration, see **[What is Secure Multi-Party Computation?](https://blog.openmined.org/what-is-secure-multi-party-computation/)**

### What is CrypTen?

**In short: [CrypTen](https://github.com/facebookresearch/CrypTen) is a framework developed by [Facebook Research](https://research.fb.com/) for Privacy Preserving Machine Learning built on PyTorch.**

The goal of CrypTen is to make secure computing techniques accessible to Machine Learning practitioners and efficient for server to server interactions. It currently implements [Secure Multi-Party Computation](https://blog.openmined.org/what-is-secure-multi-party-computation/) as its secure computing backend. More information can be found on the [project repo on Github](https://github.com/facebookresearch/CrypTen).

For more information, see **[What is CrypTen? / CrypTen Integration into PySyft](https://blog.openmined.org/crypten-integration-in-pysyft/)**

### What is a Split Neural Network (SplitNN)?

**In short: The training of the neural network (NN) is ‘split’ across two or more hosts.**

Traditionally, [PySyft](https://www.openmined.org/) has been used to facilitate [federated learning](https://blog.openmined.org/upgrade-to-federated-learning-in-10-lines/). However, we can also leverage the tools included in this framework to implement distributed neural networks. These allow for researchers to process data held remotely and compute predictions in a radically decentralised way.

For more information and a code demonstration, see **[What is a Split Neural Network?](https://blog.openmined.org/split-neural-networks-on-pysyft/)**

### What is PyVertical?

**In short: [PyVertical](https://github.com/OpenMined/PyVertical) uses private set intersection ([PSI](https://www.github.com/OpenMined/PSI)) to link datasets in a privacy-preserving way. We train SplitNNs on the vertically partitioned data to ensure the data remains separated throughout the entire process.**

For a detailed explanation, please see [**What is PyVertical?**](https://blog.openmined.org/what-is-pyvertical/)

### What are Zero Knowledge Proofs?

**In short: A Zero Knowledge Proof (ZKP) is a mathematical method to prove that one party possesses something without actually revealing the information.**

Stay tuned for _What are Zero Knowledge Proofs?_ In the meantime, you can check out [**OpenMined’s Python library for Zero Proof Knowledge on GitHub**](https://github.com/OpenMined/PyZPK).

### Protecting the model

**Note:** **While Federated Learning and Differential Privacy can be used to protect data owners from loss of privacy, they are insufficient to protect a model from theft or mis-use by the data owner.** Federated Learning, for example, requires that a model owner send a copy of the model to many data owners, putting the model at risk of IP theft or sabotage through [data poisoning](https://papers.nips.cc/paper/6943-certified-defenses-for-data-poisoning-attacks.pdf). Encrypted computation can be used to address this risk by allowing the model to train while in an encrypted state. The most well known methods of encrypted computation are Homomorphic Encryption, Secure Multi-Party Computation, and Functional Encryption.

### What is Encrypted Machine Learning as a Service?

**In short: Instead of merely providing MLaaS that might be leaky, service providers can introduce EMLaaS(Encrypted Machine Learning as a Service) to assure customers about their data security.**

Today, some cloud operators are offering Machine Learning as a Service(MLaaS). Service providers don’t want to open up about their model, which are black boxes to the customers. Vice versa, due to data sensitivity, customers may not be interested to share their raw data through API calls. **Encrypted Machine Learning can help protect the data and the model by encryption.**

For more information, see [**What is Encrypted Machine Learning as a Service?**](https://blog.openmined.org/what-is-encrypted-machine-learning-as-a-service/)

---

## Looking Deeper

In this blog series, we’ll show how federated learning can provide us the data we need to train the model and how homomorphic encryption, encrypted deep learning, secure multi-party computation and differential privacy can protect the privacy of your clients. In these links, you’ll find example code of each technique used to build modern privacy-preserving data applications.

These links will have plenty of code snippets to get you started with your use case, and links to other resources to go into the weeds of privacy-preserving ML.

-   **[What is Federated Learning?](https://blog.openmined.org/what-is-federated-learning/)**
-   [**What is Differential Privacy by Shuffling?**](https://blog.openmined.org/differential-privacy-by-shuffling/)
-   **[What is Homomorphic Encryption?](https://blog.openmined.org/what-is-homomorphic-encryption/)**
-   [**What is the Paillier Cryptosystem?**](https://blog.openmined.org/the-paillier-cryptosystem/)
-   **[What is Private Set Intersection?](https://blog.openmined.org/private-set-intersection/)**
-   **[Private Set Intersection with the Paillier Cryptosystem](https://blog.openmined.org/private-set-intersection-with-the-paillier-cryptosystem/)**
-   [**What is the Diffie-Hellman key exchange protocol?**](https://blog.openmined.org/diffie-hellman-key-exchange/)
-   **[Private Set Intersection with Diffie-Hellman](https://blog.openmined.org/private-set-intersection-with-diffie-hellman/)**
-   [**What is a Split Neural Network?**](https://blog.openmined.org/split-neural-networks-on-pysyft/)
-   [**What is PyVertical?**](https://blog.openmined.org/what-is-pyvertical/)
-   **[What is Secure Multi-Party Computation?](https://blog.openmined.org/what-is-secure-multi-party-computation/)**
-   **[What is CrypTen? / CrypTen Integration into PySyft](https://blog.openmined.org/crypten-integration-in-pysyft/)**
-   [**What is Encrypted Machine Learning as a Service?**](https://blog.openmined.org/what-is-encrypted-machine-learning-as-a-service/)

---

____OpenMined would like to thank Antonio Lopardo, Emma Bluemke, Théo Ryffel, Nahua Kang, Andrew Trask, Jonathan Lebensold, Ayoub Benaissa, and Madhura Joshi__,_ Shaistha Fathima, Na_te Solon, Robin Röhm, Sabrina Steinert,_ _Michael Höh_ and Ben Szymkow, Laura Ayre, Mir Mohammad Jaber, Adam J Hall, and Will Clark_ ____for their__ contributions to various parts of __this series.___ We’d also like to thank Bennett Farkas and Kyoko Eng from the OpenMined design team for graphics!_
