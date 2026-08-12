---
title: "Weekly Digs #6"
slug: weekly-digs-6
date: 2018-04-13T12:24:00
updated: 2024-12-17T14:54:10
categories: [research]
tags: [privacy-preserving-machine-learning]
authors: [morten-dahl]
draft: false
legacyId: 2582
---

A slightly slower period yet still new work on differential privacy and covert channels!

## Papers

-   [Differentially Private Confidence Intervals for Empirical Risk Minimization](https://arxiv.org/abs/1804.03794)  
    Addresses the question of computing confidence intervals in a private manner, using either DP or [concentrated DP](https://arxiv.org/abs/1603.01887). Gives concrete examples and experiments using logistic regression and SVM.

## News

-   Facebook host [privacy summit](https://research.fb.com/facebook-hosts-distinguished-faculty-for-privacy-summit/) but seem a bit sparse on details. [Via @sweis](https://twitter.com/sweis/status/984464406254829568).

## Bonus

-   [PowerHammer: Exfiltrating Data from Air-Gapped Computers through Power Lines](https://arxiv.org/abs/1804.04014)  
    More work on leaking data from air-gapped computers through obscure side-channels, this time through power lines by varying the CPU utilization, achieving bit rates of 10-1000 bit/sec for different attacks.
