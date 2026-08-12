---
title: "Weekly Digs #10"
slug: weekly-digs-10
date: 2018-05-18T20:07:00
updated: 2024-12-17T14:53:48
categories: [research]
tags: [privacy-preserving-machine-learning]
authors: [morten-dahl]
draft: false
legacyId: 2579
---

Small but good: we only dug up one paper this week but it comes with very interesting claims.

## Papers

-   [SecureNN: Efficient and Private Neural Network Training](https://eprint.iacr.org/2018/442)  
    Following recent approaches but reporting significant performance improvements via specialized protocols for the 3 and 4-server setting: the claimed cost of encrypted training is in some cases only 13-33 times that of training on cleartext data. Big factor in this is the avoidance of bit-decomposition and garbled circuits when computing comparisons and ReLUs.
