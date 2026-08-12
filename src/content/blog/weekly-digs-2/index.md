---
title: "Weekly Digs #2"
slug: weekly-digs-2
date: 2018-03-02T15:10:00
updated: 2024-12-17T14:56:23
categories: [research]
tags: [privacy-preserving-machine-learning]
authors: [morten-dahl]
draft: false
legacyId: 2588
---

Digging into private machine learning this week brought us training logistic and boosting models on encrypted data, and an update on how to ensure that the final model itself doesn’t leak too much itself. And for those that prefer to first sit back an enjoy a presentation we also noticed a gem of a presentation on applying secure computation to real-world use cases, and some of the unexpected obstacles that can occur.

## News

-   [@mvaria](https://twitter.com/mvaria)‘s talk about a real-world application of MPC at this year’s ENIGMA conference is online and well worth a [watch](https://www.youtube.com/watch?v=d9rMokeYx9I)! [Via @lcyqn](https://twitter.com/lcyqn/status/968638260774932480).

## Papers

-   [Scalable Private Learning with PATE](https://arxiv.org/abs/1802.08908)  
    Follow-up work to the [celebrated](https://blog.acolyer.org/2017/05/09/semi-supervised-knowledge-transfer-for-deep-learning-from-private-training-data/) Student-Teacher way of ensuring privacy of training data via differential privacy, now with better privacy bounds and hence less added noise. This is partially achieved by switching to Gaussian noise and more advanced (trusted) aggregation mechanisms.
-   [Privacy-Preserving Logistic Regression Training](https://ia.cr/2018/233)  
    Fitting a logistic model from homomorphically encrypted data using the Newton-Raphson iterative method, but with a fixed and approximated Hessian matrix. Performance is evaluated on the iDASH cancer detection scenario.
-   [Privacy-Preserving Boosting with Random Linear Classifiers for Learning from User-Generated Data](https://arxiv.org/abs/1802.08288)  
    Presents the _SecureBoost_ framework for mixing boosting algorithms with secure computation. The former uses randomly generated linear classifiers at the base and the latter comes in three variants: RLWE+GC, Paillier+GC, and SecretSharing+GC. Performance experiments on both the model itself and on the secure versions are provided.
-   [Machine learning and genomics: precision medicine vs. patient privacy](https://arxiv.org/abs/1802.10568)  
    Non-technical paper illustrating that secure computation techniques are finding their way into otherwise unrelated research areas, and hitting home-run with “data access restrictions are a burden for researchers, particularly junior researchers or small labs that do not have the clout to set up collaborations with major data curators”.

## Blogs

-   [Uber’s differential privacy .. probably isn’t](https://github.com/frankmcsherry/blog/blob/master/posts/2018-02-25.md)  
    [@frankmcsherry](https://twitter.com/frankmcsherry/status/968778164565626880) looks at Uber’s [SQL differential privacy](https://github.com/uber/sql-differential-privacy) project and shares experience gained from implementing these things in Microsoft’s [PINQ](https://www.microsoft.com/en-us/research/publication/privacy-integrated-queries/).
