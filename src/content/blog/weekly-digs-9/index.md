---
title: "Weekly Digs #9"
slug: weekly-digs-9
date: 2018-05-11T14:57:00
updated: 2024-12-17T14:53:56
categories: [research]
tags: [privacy-preserving-machine-learning]
authors: [morten-dahl]
draft: false
legacyId: 2580
---

If anyone had any doubt that private machine learning is a growing area then this week might take care of that.

## Papers

**Secure multiparty computation:**

-   [ABY3: A Mixed Protocol Framework for Machine Learning](https://eprint.iacr.org/2018/403)  
    One of big guys in secure computation for ML is back with new protocols in the 3-server setting for training linear regression, logistic regression, and neural network models. Impressive performance improvements for both training and prediction.
-   [EPIC: Efficient Private Image Classification (or: Learning from the Masters)](https://eprint.iacr.org/2017/1190)  
    An update to work from last year on efficient private image classification using SPDZ and support vector machines. Includes great overview of recent related work.

**Homomorphic encryption:**

-   [Unsupervised Machine Learning on Encrypted Data](https://eprint.iacr.org/2018/411)  
    Implements K-means privately using fully homomorphic encryption and a bit-wise rational encoding, with suggestions for tweaking K-means to make it more practical for this setting. The TFHE library (see next) is used for experiments.
-   [TFHE: Fast Fully Homomorphic Encryption over the Torus](https://eprint.iacr.org/2018/421)  
    Proclaimed as the fastest FHE [library](https://tfhe.github.io/tfhe/) currently available, this paper is the extended version of previous descriptions of the underlying scheme and optimizations.
-   [Homomorphic Secret Sharing: Optimizations and Applications](https://eprint.iacr.org/2018/419)  
    Further work on a hybrid scheme between homomorphic encryption and secret sharing: operations can be performed locally by each share holder as in the former, yet a final combination is needed in the end to recover the result as in the latter: “this enables a level of compactness and efficiency of reconstruction that is impossible to achieve via standard FHE”.

**Secure enclaves:**

-   [SecureCloud: Secure Big Data Processing in Untrusted Clouds](https://arxiv.org/abs/1805.01783)  
    An joint European research project to develop a platform for pushing critical applications to untrusted cloud environments, using secure enclaves and supporting big data. Envisioned use cases from finance, health care, and smart grids.
-   [SecureStreams: A Reactive Middleware Framework for Secure Data Stream Processing](https://arxiv.org/abs/1805.01752)  
    Presents concrete work done in the above SecureCloud project, namely a high-level Lua-based framework for privately processing streams at scale using dataflow programming and secure enclaves.

**Differential privacy:**

-   [Privately Learning High-Dimensional Distributions](https://arxiv.org/abs/1805.00216)  
    Tackles the problem that privacy “comes almost for free when data is low-dimensional but comes at a steep price when data is high-dimensional” as measured in amount of samples needed. Two mechanisms are presented for learning respectively a multivariate Gaussian and a product distribution.
-   [SynTF: Synthetic and Differentially Private Term Frequency Vectors for Privacy-Preserving Text Mining](https://arxiv.org/abs/1805.00904)  
    A differentially private mechanism is used to prevent author re-identification in texts used for training models where anomymized feature vectors can be used instead of the actual body text. Concrete experiments include topic classification of newsgroups postings.
-   [Distributed Differentially-Private Algorithms for Matrix and Tensor Factorization](https://arxiv.org/abs/1804.10299)  
    Correlated noise is used to privately perform two common operations via a centralized but curious party or directly between data holders, respectively. Interestingly, the correlated noise is not uniform as in typical secure aggregation settings.

## Bonus

-   [An Empirical Analysis of Anonymity in Zcash](https://arxiv.org/abs/1805.03180)  
    A little reminder that anonymity is hard.
