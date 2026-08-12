---
title: "Weekly Digs #3"
slug: weekly-digs-3
date: 2018-03-09T15:05:00
updated: 2024-12-17T14:56:23
categories: [research]
tags: [privacy-preserving-machine-learning]
authors: [morten-dahl]
draft: false
legacyId: 2587
---

Big news this week with a good mix of everything: guides to help you explore, practical tools, and interesting new ideas! Enjoy.

## News

-   The [2018 Gödel Prize](http://eatcs.org/index.php/component/content/article/1-news/2670-2018-godel-prize) is awarded to Oded Regev for his paper [On lattices, learning with errors, random linear codes, and cryptography](https://cims.nyu.edu/~regev/papers/qcrypto.pdf). This had a huge influence on later work in cryptography, not least homomorphic encryption. [Via @hoonoseme](https://twitter.com/hoonoseme/status/971517058633601028).
-   [OpenMined](https://www.openmined.org/) is now maintaining a list of papers and tools around private machine learning: [https://github.com/OpenMined/awesome-ai-privacy](https://github.com/OpenMined/awesome-ai-privacy)! [Via @iamtrask](https://twitter.com/iamtrask/status/971711677526892544).
-   [Lab41](https://www.lab41.org/) has released a Python wrapper around Microsoft’s [SEAL](http://sealcrypto.org/) homomorphic encryption library: [https://github.com/Lab41/PySEAL](https://github.com/Lab41/PySEAL). [Via @mortendahlcs](https://twitter.com/mortendahlcs/status/971320764988346370).
-   The list of accepted contributed talks for this year’s [Theory and Practice of MPC](http://www.multipartycomputation.com/tpmpc-2018) workshop has been announced. This is the definitive annual event dedicated to secure multi-party computation. [Via @claudiorlandi](https://twitter.com/claudiorlandi/status/970976361933365249).

## Papers

-   [Generating Differentially Private Datasets Using GANs](https://arxiv.org/abs/1803.03148)  
    Interesting idea of using GANs to produce artificial differential privacy-preserving datasets from sensitive data that are safe to release for further training purposes. This is done on the client side, meaning there’s no need for a trusted aggregator.
-   [Faster Homomorphic Linear Transformations in HElib](https://ia.cr/2018/244)  
    The masters are at it again, giving algorithmic improvements to perhaps the most well-known homomorphic encryption library and thereby making it 30-75 times faster.
-   [Logistic Regression Model Training based on the Approximate Homomorphic Encryption](https://ia.cr/2018/254)  
    Private fitting of several logisictic regression models on smaller genomic data sets using the [HEAAN](https://github.com/kimandrik/HEAAN) homomorphic encryption scheme. Approach is somewhat typical gradient descent and sigmoid polynomial approximation but with significant concrete performance improvements over other work using HEAAN.

## Blogs

-   [The Building Blocks of Interpretability](https://distill.pub/2018/building-blocks/)  
    Nothing to do with private machine learning, yet this is so neat that it warrants a mention. Go play!
