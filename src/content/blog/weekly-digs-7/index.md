---
title: "Weekly Digs #7"
slug: weekly-digs-7
date: 2018-04-20T18:51:00
updated: 2024-12-17T14:54:02
categories: [research]
tags: [privacy-preserving-machine-learning]
authors: [morten-dahl]
draft: false
legacyId: 2581
---

<!-- TODO(content): shortcode(s) present (verify) -->

While academia may still be a bit busy with submission deadlines, industry reported interesting stories this week regarding secure computation.

## Papers

-   [Nothing Refreshes Like a RePSI: Reactive Private Set Intersection](https://eprint.iacr.org/2018/344)  
    [PSI](https://www.youtube.com/watch?v=42pT3_Mqp7Q) was several applications in private data processing, including object linking in advertising and data augmentation. This paper takes a step towards mitigating exhaustive attacks where a party learns too much by simply asking for many intersections.

## News

-   [Sharemind](https://sharemind.cyber.ee/), one of the biggest and earliest players pushing MPC to industry, has launched a [new privacy service](https://sharemind.cyber.ee/introducing-sharemind-hi/) based on [secure computation using secure enclaves](https://eprint.iacr.org/2016/1057) with the promise that it can handle big data. [Via @positium](https://twitter.com/positium/status/986178082812907520).
-   Interesting [interview with Lea Kissner](https://gizmodo.com/meet-the-woman-who-leads-nightwatch-google-s-internal-1825227132), the head of Google’s privacy team [NightWatch](https://www.buzzfeed.com/sheerafrenkel/google-has-a-secret-team-making-sure-its-products-are-safe?utm_term=.aw46WN654j#.dw461G6PqZ). Few details are given but “She recently tried to obscure some data using cryptography, so that none of it would be visible to Google upon upload … but it turned out that \[it\] would require more spare computing power than Google has” sounds like techniques that could be related to MPC or HE. [Via @rosa](https://twitter.com/rosa/status/986024500067106816).
-   Google had two AI presentations at this year’s RSA conference, one on fraud detection and one on adversarial techniques. [Via @goodfellow\_ian](https://twitter.com/goodfellow_ian/status/987415311518392320).

## Bonus

-   [Privacy-Preserving Multibiometric Authentication in Cloud with Untrusted Database Providers](https://eprint.iacr.org/2018/359)  
    Relevant application of secure computation to authentication using sensitive data. Relative black box use of existing protocols yet experimental performance <1sec.
-   [Private Anonymous Data Access](https://eprint.iacr.org/2018/363)  
    Interesting mix of [private information retrieval](https://en.wikipedia.org/wiki/Private_information_retrieval) and [oblivious RAM](https://en.wikipedia.org/wiki/Private_information_retrieval): “We consider a scenario where a server holds a huge database that it wants to make accessible to a large group of clients while maintaining privacy and anonymity … with the goal of getting the best of both worlds: allow many clients to privately and anonymously access the database as in PIR, while having an efficient server as in ORAM”.
-   [Adversarial Attacks Against Medical Deep Learning Systems](https://arxiv.org/abs/1804.05296)  
    A discussion around some of the concrete consequences the medical profession may face from adversarial examples in machine learning systems with a warning of “caution in employing deep learning systems in clinical settings”.
