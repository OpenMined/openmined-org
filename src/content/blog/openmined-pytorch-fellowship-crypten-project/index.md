---
title: "Announcing the OpenMined-PyTorch for Crypten Integration Fellowships"
slug: openmined-pytorch-fellowship-crypten-project
date: 2019-12-06T15:48:50
updated: 2024-12-10T15:23:52
categories: [community]
tags: [announcements]
authors: [theo-ryffel]
draft: false
legacyId: 2530
---

We’re very excited to announce the next round of open-source software development grants in the OpenMined community, generously sponsored by the PyTorch team and facilitated by the [RAAIS Foundation](https://blog.openmined.org/p/ddcc1c9a-6369-4ef8-8897-b132633f21bb/raais.org)! These fellowships will focus on integrating the new [CrypTen](https://github.com/facebookresearch/CrypTen) library in PySyft to offer a new backend for highly efficient encrypted computations using secure multi-party computation (SMPC). CrypTen has been released with PyTorch 1.3. It focuses on making encrypted server-to-server SMPC computations as fast as possible. Upon the completion of this project, Crypten will offer PySyft users new ways to run encrypted computation between cloud servers using state-of-the-art crypto protocols.

Three roles are offered, which are optionally part-time or full-time, depending on the candidate’s desires and flexibility. All of the fellowships are to fund work on the core OpenMined codebase. If you would like to be considered for any of the fellowships, please apply at the bottom of this page.

As for compensation, all roles listed below are paid the same rate: £2,000 per month for part-time work (6-month contract) or £4,000 per month for full-time work (3-month contract).

It’s important to note that **anyone may apply for an OpenMined fellowship**, however, we will show a strong preference to existing contributors. If you would like to better your chances of receiving a grant, we suggest you pick an issue labeled “good first issue” on the following code repositories:

-   [PySyft](https://github.com/OpenMined/PySyft/issues) – the main Syft library for federated and privacy-preserving machine learning
-   [PyGrid](https://github.com/OpenMined/PyGrid/issues) – the main Grid library for hosting PySyft in a cloud environment

### Key Dates

**Application Deadline:** December 18th, 2019  
**Candidates Selected:** December 23rd, 2019 (EDITED)  
**Development Beings:** January 2nd, 2020 (EDITED)  
**Project Completed:** July 1st, 2020

## Mission Description

We’re looking for 3 Python developers to integrate CrypTen as a backend of PySyft for encrypted computation. PySyft comes already with different solutions to perform encrypted computation: there is an existing backend for secure multi-party computation (SMPC) which is natively integrated in PySyft, and there is an ongoing project to perform homomorphic encryption (HE) using the SEAL library as a backend.

The reason why we want to have multiple backends is to allow users or researchers to find the most appropriate one for their needs. Indeed, SMPC and HE might be used alternatively depending on the context. For example, SMPC might be more appropriate when high bandwidth is available which HE might be preferred when computation time is not an issue.

Regarding SMPC, the current syft backend is relevant to allow encrypted computation across several types of devices. Apart from PySyft, the libraries syft.js and AndroidWorker allow to create syft workers on web pages and android devices, and the current implementation will allow to integrate those workers in a SMPC protocol. This versatility comes as the expense of efficiency while CrypTen might be much faster in a cloud server to cloud server context because it highly prioritizes speed of execution above other considerations.

The main challenge of this project will be to connect the notion of workers in PySyft and Crypten. More precisely, CrypTen currently supports computation across parties which are either different threads or processes. In the PySyft world, we would call them thread and process workers. The way those workers communicate is by using the classic functionalities of threading and multiprocessing libraries. In particular, most of the code that is executed by the workers is exactly the same: it is copied and sent to each one at the beginning of the computation. In return, PySyft has an implementation where a worker orchestrates the computation across all the workers that hold shares. Even if this might change, it makes the implementation quite different and hardens the integration. Another important consequence of using threading and multiprocessing libraries is that the data doesn’t need to be serialized when sent across machines, which is a major paradigm in PySyft as we expect workers from incompatible devices to communicate with each other. This will need to be adapted to the more general context where we want several python servers which are on separate machines to be able to use CrypTen as a backend and to communicate.

Therefore, several points are still left as open questions:

-   Is it necessary to serialize data when communicating across those servers? All the machinery is already available with PySyft but it might be expensive compared to simple memory copy and transfer. Ideally we want to support both methods for the worker communication: use the PySyft network protocol when needed or keep communication similar to what is done in CrypTen (using torch.distributed or other techniques).
-   If we use serialization, we might need to [define a new context of computation](https://github.com/facebookresearch/CrypTen/blob/master/crypten/mpc/context.py). In which case, how do we handle some of the CrypTen api components (like .reveal()) that are usually implemented with a reducer in the communicator interface, a common standard for library like multiprocessing?
-   Last point will be about how much control PySyft will have over the operations performed by CrypTen: while we want to delegate as much as possible the details of the protocols used, some aspects about permissioning and privacy tracking which are features PySyft can offer might require PySyft to follow along the tensor operations performed.

This project is not only about integration, it’s an opportunity for both libraries to complement each other and to make significant improvements by putting together efforts to enable practical encrypted computation in various contexts.

### Required Skills

-   You must be well-versed in Python development. You should ideally have at least 3 years of experience writing Python specifically.
-   You must be comfortable working in a team of 3 people with potentially overlapping topics. This includes dexterity with git.
-   You should have experience in distributing computation across threads or processes in Python (including libraries like torch.distributed, threading, multiprocessing, etc).

### Bonus Skills

-   Knowledge of PySyft is a huge bonus – we suggest that if you’re not familiar with PySyft, you get familiar with the basics first. Try doing the [PySyft tutorials](https://github.com/OpenMined/PySyft/tree/master/examples/tutorials) to get a good grasp of the material.
-   Knowledge of CrypTen is always a key asset for this project. Check out the [CrypTen tutorials](https://github.com/facebookresearch/CrypTen/tree/master/tutorials).
-   Knowledge of the principles behind deep learning and federated learning. If you haven’t already taken our [Udacity course](https://www.udacity.com/course/secure-and-private-ai--ud185), we suggest that you start there.
-   Knowledge of secure multi-party computation. You might want to start with these two tutorials [Part 1](https://mortendahl.github.io/2017/09/03/the-spdz-protocol-part1/) & [Part 2](https://mortendahl.github.io/2017/09/10/the-spdz-protocol-part2/).

## How to Apply

**Application Deadline:** December 18th, 2019  
**Candidates Selected:** December 22nd, 2019  
**Development Beings:** January 1st, 2020  
**Project Completed:** July 1st, 2020

The call for applicants opened on **December 6, 2019**. To apply, **[please fill out this google form](https://forms.gle/UYCGp45i19q9FmP89)**. Successful applicants will receive confirmation of their acceptance by December 22nd and will begin work on January 1st, 2020.

The project manager for this grant will be [**Theo Ryffel**](https://github.com/LaRiffle), the Crypto Team Lead for OpenMined. You may contact Theo with any further questions related to the grant and how to apply on Slack (**@Theo Ryffel**).

If you or someone you know may be interested in sponsoring a grant like this one, please don’t hesitate to reach out via email – [andrew@openmined.org](mailto:andrew@openmined.org).
