---
title: "Weekly Digs #5"
slug: weekly-digs-5
date: 2018-03-30T06:28:00
updated: 2024-12-17T14:54:19
categories: [research]
tags: [privacy-preserving-machine-learning]
authors: [morten-dahl]
draft: false
legacyId: 2583
---

Good mix of approaches this time, including custom secure computation protocols, secure enclaves, and differential privacy.

## Papers

-   [Private Nearest Neighbors Classification in Federated Databases](https://eprint.iacr.org/2018/289)  
    Great work on custom MPC protocols for k-NN classification of a sample using a distributed data set and without leaking neither sample nor data set (concrete use-case is document classification with cosine similarity).
-   [Chiron: Privacy-preserving Machine Learning as a Service](https://arxiv.org/abs/1803.05961)  
    Interesting look at protecting both model specifics and privacy of training data via [secure enclaves](https://en.wikipedia.org/wiki/Software_Guard_Extensions). The technology is promising despite having experienced a few [issues recently](https://arxiv.org/abs/1802.09085) and avoids use of heavy cryptography.
-   [Hiding in the Crowd: A Massively Distributed Algorithm for Private Averaging with Malicious Adversaries](https://arxiv.org/abs/1803.09984)  
    Gossip-based peer-to-peer protocol for privately computing the exact average of a distributed data set directly between peers. No heavy cryptography is used in case of honest peers, with a PHE-based extension for detecting malicious cheating.
-   [Locally Private Bayesian Inference for Count Models](https://arxiv.org/abs/1803.08471)  
    When applying differential privacy one may either ignore the fact that noise has been added to the data or try to take it into account; the latter is done here with good illustrations of the improvements this can give.
-   [Comparing Population Means under Local Differential Privacy](https://arxiv.org/abs/1803.09027)  
    Another use-case of differential privacy, here looking at how to recover from the extra noise added in local DP when during privacy preserving A/B testing (and more).
-   [Cloud-based MPC with Encrypted Data](https://arxiv.org/abs/1803.09891)  
    Gives two schemes for private _[Model Predictive Control](https://en.wikipedia.org/wiki/Model_predictive_control)_ by a central authority (who might have a better understanding of the environment than individual sensors), one based on PHE and another on MPC.
