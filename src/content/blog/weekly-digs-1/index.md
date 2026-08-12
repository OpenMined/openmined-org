---
title: "Weekly Digs #1"
slug: weekly-digs-1
date: 2018-02-23T15:07:00
updated: 2024-12-17T14:56:23
categories: [research]
tags: [privacy-preserving-machine-learning]
authors: [morten-dahl]
draft: false
legacyId: 2589
---

We are happy to kick off _the weekly dig_ into what’s going on in private machine learning!

It’s an increasingly busy field so we’ll keep it short, with a mix of research papers, blog posts, and general news. Sometimes just a quick summary, sometimes a small commentary. Enjoy.

## Papers

-   [The Secret Sharer: Measuring Unintended Neural Network Memorization & Extracting Secrets](https://arxiv.org/abs/1802.08232)  
    Concrete study of what a model can leak about sensitive information in the training data. Perhaps not surprisingly, “only by developing and training a differential private model are we able to … protect against the extraction of secrets”.
-   [Doing Real Work with FHE: The Case of Logistic Regression](https://ia.cr/2018/202)  
    The heavyweights of homomorphic encryption apply [HElib](https://github.com/shaih/HElib) to logistic regression with a focus on implementing “optimized versions of many bread and butter FHE tools. These tools include binary arithmetic, comparisons, partial sorting, and low-precision approximation of complicated functions such as reciprocals and logarithms”.
-   [Reading in the Dark: Classifying Encrypted Digits with Functional Encryption](https://ia.cr/2018/206)  
    Develops a functional encryption scheme for “efficient computation of quadratic polynomials on encrypted vectors” and applies this to private MNIST prediction (i.e. using a model trained on unencrypted data) via suitable quadratic models.
