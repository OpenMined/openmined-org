---
title: "Weekly Digs #4"
slug: weekly-digs-4
date: 2018-03-16T18:34:00
updated: 2024-12-17T14:56:23
categories: [research]
tags: [privacy-preserving-machine-learning]
authors: [morten-dahl]
draft: false
legacyId: 2586
---

<!-- TODO(content): shortcode(s) present (verify) -->

Shorter but still interesting mix this week with two pillars of private machine learning: homomorphic encryption and differential privacy!

## Papers

-   [Model-Agnostic Private Learning via Stability](https://arxiv.org/abs/1803.05101)  
    More work on ensuring privacy of training data via differential private query mechanisms. Compared to paper from a few weeks ago, this one focuses on “algorithms that are agnostic to the underlying learning problem \[with\] formal utility guarantees \[and\] provable accuracy guarantees”.
-   [Homomorphic Encryption for Speaker Recognition: Protection of Biometric Templates and Vendor Model Parameters](https://arxiv.org/abs/1803.03559)  
    The Paillier cryptosystem is used to securely evaluate simplified similarity functions so users don’t leak biometric information during authentication. Performance numbers included.
-   [Efficient Determination of Equivalence for Encrypted Data](https://arxiv.org/abs/1803.03760)  
    Reminder that even a simpler task such as privately linking identities and records together is relevant in industry.

## Bonus

-   [The Morning Paper: When coding style survives compilation](https://blog.acolyer.org/2018/03/16/when-coding-style-survives-compilation-de-anonymizing-programmers-from-executable-binaries/)  
    Anonymity is hard! Random forests can be trained to identify your coding style from source code as well as compiled programs.
