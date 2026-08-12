---
title: "A Peek into Synergos – AI Singapore’s Federated Learning System Built on top of PySyft"
slug: a-peek-into-synergos-ai-singapores-federated-learning-system-built-on-top-of-pysyft
date: 2020-11-10T17:26:00
updated: 2025-04-14T17:30:06
categories: [product]
tags: [federated-learning]
authors: [openmined-team]
cardText: light
location: "Singapore"
draft: false
legacyId: 6266
---

AI Singapore unveiled Synergos, their innovative federated learning system built on top of OpenMined’s PySyft library. Synergos leverages PySyft’s core capabilities to create a robust platform for privacy-preserving machine learning.

The key technical highlight is how Synergos uses PySyft’s PointerTensor, which allows computation on remote datasets without actually “seeing” the data – essentially working like a remote control for data operations. This foundation enabled AI Singapore to build a sophisticated system that lets multiple organizations train AI models collaboratively while maintaining data privacy.

What makes this implementation particularly notable is how AI Singapore extended PySyft’s functionality through their Federation component, creating an accessible interface for organizations to participate in federated learning without needing to understand the complex underlying mechanics.

This is a fantastic example of building production-ready privacy-preserving ML systems on top of OpenMined’s open-source tools. While we’ve highlighted the PySyft integration here, the full blog post offers a comprehensive deep-dive into Synergos’ architecture, including detailed explanations of its:

-   Key components and their interactions
-   Registration, training, and evaluation phases
-   Technical implementation details
-   Real-world use cases

For the complete technical architecture and implementation details, check out the full post: “[A Peek Into Synergos – AI Singapore’s Federated Learning System](https://ai4sme.aisingapore.org/2020/11/a-peek-into-synergos-ai-singapores-federated-learning-system/)“

The success of this implementation by a national AI initiative demonstrates the growing maturity and reliability of PySyft for real-world privacy-preserving machine learning applications. If your organization is interested in learning more about applications in your environment reach out to @Ronnie Falcon on our slack — Join at [openmined.org/get-involved](https://openmined.org/get-involved/)
