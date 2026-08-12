---
title: "Announcing the OpenMined-PyTorch Federated Learning Fellowships"
slug: announcing-the-pytorch-openmined-federated-learning-fellowships
date: 2019-12-06T15:49:23
updated: 2024-12-10T15:23:21
categories: [community]
tags: [federated-learning, announcements, privacy-preserving-machine-learning]
authors: [patrick-cason]
draft: false
legacyId: 2526
---

We’re very excited to announce the next round of open-source software development grants in the OpenMined community, generously sponsored by the PyTorch team! These fellowships will focus on developing “worker libraries”, allowing PySyft code to be executed in other environments like a mobile phone or web browser. Many of the roles are optionally part-time or full-time, depending on the candidate’s desires and flexibility. All of the fellowships are to fund work on the core OpenMined codebase. If you would like to be considered for any of the fellowships, you can apply at the bottom of this page.

As for compensation, all roles listed below are paid the same rate: £2,000 per month for part-time work (6-month contract) or £4,000 per month for full-time work (3-month contract).

It’s important to note that **anyone may apply for an OpenMined fellowship**, however, we will show a strong preference to existing contributors. If you would like to better your chances of receiving a grant, we suggest you pick an issue labeled “good first issue” on the following code repositories:

-   [Syft.js](https://github.com/OpenMined/syft.js/issues) – _the Syft worker for the web (written in Javascript)_
-   [Grid.js](https://github.com/OpenMined/grid.js/issues) – _a WebSocket/HTTPS server connecting PySyft to Syft.js_
-   [AndroidWorker](https://github.com/OpenMined/AndroidWorker/issues) – _the Syft worker for Android (written in Kotlin)_
-   [PyGrid](https://github.com/OpenMined/PyGrid/issues) – _the main Grid library for hosting PySyft in a cloud environment_

### Key Dates

**Application Deadline:** December 18th, 2019  
**Candidates Selected:** December 22nd, 2019  
**Development Beings:** January 1st, 2020  
**Project Completed:** July 1st, 2020

[**Link to fellowship application**](https://forms.gle/E9gyihtrwo4LPqtG6)

## Javascript Developer Fellowship

We’re looking for a Javascript developer to help with development on both the syft.js and the grid.js projects. Syft.js is the PySyft worker library for the web, allowing for PySyft code to be executed remotely in a web browser (regardless of your deep learning framework).

One of the more challenging aspects of this project is the translation layer, which allows for framework-specific code to be translated from either PyTorch or TensorFlow (for Python) into TensorFlow.js. As a candidate, you’ll be expected to help with creating a bi-directional translation layer between these major deep learning frameworks.

We also have a specific federated learning component within syft.js, built using WebRTC data channels. This allows for multiple parties to train or predict on the same model and communicate directly via peer-to-peer communication rather than through a central Grid server.

**The syft.js project should be built to serve as a blueprint for other worker libraries built in other languages.** While we already have the majority of the syft.js and grid.js projects built, they are not finished, and there is a lot of work to be done in conjunction with the PyGrid and PySyft teams to ensure long-term compatibility.

### Required Skills

-   You must be well-versed in modern ES6/7 Javascript development
-   You must have a good knowledge of build tools and bundlers, including but not limited to Webpack, Babel, and Rollup
-   You should have a good knowledge of Javascript in general, including both object-oriented programming and functional programming. Ideally, you’ve been coding in Javascript regularly for at least 3 years.

### Bonus Skills

-   Knowledge of PySyft is a huge bonus – we suggest that if you’re not familiar with PySyft or even the Python language itself, that you get familiar with the basics first. Try doing the [PySyft tutorials](https://github.com/OpenMined/PySyft/tree/master/examples/tutorials) to get a good grasp of the material.
-   Knowledge of the principles behind deep learning and federated learning – if you haven’t already taken our [Udacity course](https://www.udacity.com/course/secure-and-private-ai--ud185), we suggest that you start there.
-   Experience in WebRTC is a great nice-to-have – while the majority of this work has already been completed, it will certainly differentiate candidates who lack such experience. For a quick primer, [check out this tutorial](https://www.html5rocks.com/en/tutorials/webrtc/basics/).
-   Experience working with writing distributed socket servers
-   Experience writing libraries in Javascript

## Kotlin Developer Fellowships

We’re looking for **two** qualified Android developers to work on our existing AndroidWorker library built in Kotlin. This project serves as the native Android worker library for the OpenMined ecosystem. While we already have a good start, we would like to continue our work in extending this library to work with other workers.

There are many discrepancies between the two current worker libraries: AndroidWorker and syft.js. One of the biggest challenges in this grant will be deciding upon a common API between the two projects and implementing the missing pieces for each.

One such project would be implementing WebRTC in Kotlin to allow for messages to be sent directly to another worker (in Android or otherwise).

### Required Skills

-   You must be well-versed in Android development, particularly with experience writing Kotlin. We will not be developing the AndroidWorker library in Java.
-   You must have basic knowledge of the concepts behind deep learning and federated learning. If you haven’t already taken our [Udacity course](https://www.udacity.com/course/secure-and-private-ai--ud185), we suggest that you start there.
-   You must have a basic knowledge of PySyft. If you’re not entirely familiar with the project, please [start with the tutorials](https://github.com/OpenMined/PySyft/tree/master/examples/tutorials).

### Bonus Skills

-   Knowledge of WebRTC is a plus – while you won’t need to implement a signaling server, you will be required to build a WebRTC client that can communicate with other worker libraries (cross-language and cross-environment).
-   Experience building libraries in Kotlin or Java

## Swift Developer Fellowships

We’re looking for **two** qualified iOS developers to build a Syft worker library in Swift, called SwiftSyft! This project will serve as the native iOS worker library for the OpenMined ecosystem. While we currently have not built such a library, we are actively doing so in both Javascript (for the web) and Kotlin (for Android). As a candidate, you’ll be benefitting from developing a library that, conceptually speaking, has mostly been architected from a technical perspective.

Currently, we have no active developers working on a project related to extending PySyft to iOS. The benefit is that you will have the ability to permanently shape the OpenMined ecosystem more than most developers have the opportunity to.

### Required Skills

-   You must be well-versed in iOS development, particularly with experience writing Swift. We will not be developing the SwiftSyft library in Objective-C.
-   You must have basic knowledge of the concepts behind deep learning and federated learning. If you haven’t already taken our [Udacity course](https://www.udacity.com/course/secure-and-private-ai--ud185), we suggest that you start there.
-   You must have a basic knowledge of PySyft. If you’re not entirely familiar with the project, please [start with the tutorials](https://github.com/OpenMined/PySyft/tree/master/examples/tutorials).

### Bonus Skills

-   Knowledge of WebRTC is a plus – while you won’t need to implement a signaling server, you will be required to build a WebRTC client that can communicate with other worker libraries (cross-language and cross-environment).
-   Experience building libraries in Swift or Objective-C

## Python Developer Fellowship

We’re looking for a qualified Python developer to work primarily on the PyGrid project, as well as on PySyft. Due to the context-specific nature of this role, this person will almost certainly have to be done by an existing contributor. So, if you’re looking to apply, be sure to look at doing one of the many “[good first issues](https://github.com/OpenMined/PyGrid/issues)” on our Github repo first!

The PyGrid project has a deep integration with PySyft, handling the majority of the networking and model hosting logic. If you’re looking to deploy PySyft to the cloud, PyGrid is the library you will use!

Currently, there are two Grid projects: PyGrid and grid.js (written in Javascript). One of our major goals with this grant is to unify the two projects entirely in Python. At the moment, syft.js only currently works with grid.js, and AndroidWorker only works with PyGrid. We need PyGrid to implement a standard socket and HTTP API for interacting with PySyft code as a non-Python worker.

### Required Skills

-   While this isn’t a skill, it’s a requirement that this grant is awarded to an existing contributor to the PyGrid project.
-   You should ideally have at least 3 years of experience writing Python specifically.

### Bonus Skills

-   Knowledge of the WebRTC signaling protocol is a huge bonus. This code has already been implemented in Javascript for the grid.js code, so a language port should be all that’s needed.
-   Knowledge of cloud deployment, auto-scaling, and Docker are bonus skills and would allow PyGrid to be deployed anywhere.
-   Experience building libraries in Python 3

## How to Apply

**Application Deadline:** December 18th, 2019  
**Candidates Selected:** December 22nd, 2019  
**Development Beings:** January 1st, 2020  
**Project Completed:** July 1st, 2020

The call for applicants opened on December 6th. **To apply for any of the positions, [please fill out this Google Form](https://forms.gle/E9gyihtrwo4LPqtG6).** Successful applicants will receive confirmation of their acceptance by December 22nd and will begin work on January 1st, 2020.

The project manager for this grant will be **[Patrick Cason](https://github.com/cereallarceny)**, the Javascript Team Lead for OpenMined. You may contact Patrick with any further questions related to the grant and how to apply on Slack (**@cereallarceny**).

If you or someone you know may be interested in sponsoring a grant like this one, please don’t hesitate to reach out via email – [andrew@openmined.org](mailto:andrew@openmined.org).
