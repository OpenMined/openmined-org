---
title: "Apply to Join the Syft Core Team"
slug: join-the-syft-core-team
date: 2020-03-16T16:38:45
updated: 2024-12-09T21:05:12
categories: [foundation]
authors: [andrew-trask]
draft: false
legacyId: 2443
---

[OpenMined’s 2020 Roadmap](https://github.com/OpenMined/Roadmap) stipulates that our primary objective this year is to put software into production. At present, we are championing [7 use cases](https://github.com/OpenMined/Roadmap), several of which have been funded by organizations such as [PyTorch](https://blog.openmined.org/announcing-the-pytorch-openmined-federated-learning-fellowships/), the [RAAIS Foundation](https://blog.openmined.org/raais/), and soon, [Google Summer of Code](https://blog.openmined.org/announcing-openmined-google-summer-of-code/). This has lead to a very important (and intentional) change in the focus of our development teams.

Instead of each of our teams focusing on _abstract technologies_, each of our teams are focusing on _use cases_, with technologies being a dependency to accomplish the use case.

This shift in development focus (and increase in headcount/pace) has created a vacuum on one important part of our roadmap, the general-purpose infrastructure upon which all the use cases are constructed. This vacuum is particularly strong as we expand from being a single-language stack (Python) to being a polyglot (Python, Javascript, Kotlin, Swift, and C), multi-framework (PyTorch, Tensorflow, Jax, Keras, and NumPy) ecosystem.

Thus, we need a long-term concerted effort to ensure that these language, framework, and use-case specific pieces:

-   **Speak the same “Syft Language”** serializing objects (such as tensors, tensor abstractions, commands, messages, plans, and protocols) in a consistent fashion.
-   **Minimize code duplication** across projects when multiple projects have similar needs.
-   **Facilitate extensibility** providing support for OpenMined’s longer-term goals as opposed to just the short-term (2020) use cases.
-   **Leverage abstractions** which allow our codebase to be machine-learning framework agnostic, giving us immunity to the changing deep learning framework landscape and automatic support for each proposed feature in all popular frameworks.

In short, as we move from PySyft the library to Syft the ecosystem (PySyft, syft.js, KotlinSyft, SwiftSyft, syft-proto, SyferText, and syft.c), we need a concerted effort to ensure that our core abstractions and capabilities are properly constructed.

It is with this context in mind that I’m excited to announce the Syft Core team! This team will be focused on creating and maintaining the abstractions which allow the Syft ecosystem to thrive across languages and frameworks. They will be responsible for PySyft (which is the core to the ecosystem) and syft-proto, which defines the Protobuf spec for all Syft objects.

**I will be personally leading** the Syft Core Team, meeting weekly with all members to collaborate on development. To that end, I would like to issue a call for general application to join the team! I should say, this team will not be for the faint of heart, and while all projects in OpenMined are collaborative, this team’s work will be particularly collaborative. As such, I will be setting a very high expectation of consistency for week-to-week work.

**Requirements to Apply:**

-   You must be **deeply familiar** with at least one deep learning framework. By “deeply familiar”, I mean that you should be able to code sophisticated neural networks mostly from memory. The API should be something you know by heart. Deep familiarity with multiple frameworks is ideal.
-   You must be **deeply familiar** with Deep Learning. You should feel comfortable implementing all common layer types from scratch (we will be doing this!), and comfortable implementing an autograd system from scratch (we will be doing this!). If you don’t know how, [my book can teach you](https://www.manning.com/books/grokking-deep-learning).
-   You must be **somewhat familiar** with the following deep learning frameworks: PyTorch, Tensorflow, Keras, Jax, and NumPy. “Somewhat familiar” means you could code a neural network using only each framework’s documentation (i.e., not using tutorials).
-   You must be **very comfortable** with object oriented programming in Python. We will be creating advanced abstractions, decorators, subclasses, and even parsing the abstract syntax tree a bit (automatic code generation).
-   You must have at least **10 hours per week** to set aside for the project.
-   You must have merged a pull request into [PySyft](https://github.com/OpenMined/PySyft), ideally one which is deeply technical.
-   You **must be a team player**. This team will sit at the very center of the community, writing code upon which all other teams will rely. As such, this team will undoubtedly receive many requests from all other dev teams on a consistent, ongoing basis. It is our job to care about what they care about, and to build abstractions which serve them. This is not a good team for lone-wolf cowboys. 🙂

At the time of writing this, wee will be working both on the current version of PySyft and on a from-scratch refactor which we expect to be released 1-2 minor versions from now. We will also publish a framework paper together along with the wider OpenMined Core Contributor team. It’s going to be a really fun ride.

If you are interested, you may [apply here](https://docs.google.com/forms/d/1b1nJ2fa3HuXDqL1-ySFIbUiB0A_AqEk4duYRowGDQ0I/edit) and I will promptly review your application. Applications will be received on an ongoing basis.
