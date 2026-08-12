---
title: "RAAIS Grant Announcement"
slug: raais
date: 2019-07-08T16:38:06
updated: 2024-12-10T15:37:02
categories: [news]
tags: [announcements]
authors: [andrew-trask]
draft: false
legacyId: 2561
---

We’re very excited to announce the very first round of RAAIS OpenMined Grants, sponsored by very generous support from [The RAAIS Foundation](https://www.raais.org/), a UK Registered Charity. The RAAIS Foundation’s mission is to advance education and research in artificial intelligence for the common good. In line with this mission, they are financially supporting 3 full-time grants (each worth £2,000 per month for 3 months) toward work on OpenMined’s open-source codebase. If you can’t work full-time (e.g. you’re a student), you may instead request to work half-time for 6 months (£1,000 per month). All of the grants are to fund work on the core OpenMined codebase. Recipients of the RAAIS OpenMined Grants will get to choose between 3 use-cases to focus on. These are commissioned by the United Nations Privacy Task Team, the [Broad Institute at MIT and Harvard](https://www.broadinstitute.org/about-us), and the University of Oxford. If you would like to be considered for a grant, you can apply at the bottom of this page.

**Key Dates:**  
_Application Deadline: July 26th_  
_Notification Deadline: July 29th_  
_Development Begins: Aug 1_  
_Projects Completed: November 1st (full-time) or Feb 1st (half-time)_

## Project 1 – Encrypted Machine Translation

_Commissioned by the United Nations Privacy Task Team_

Machine Learning as a Service (MLaaS) is one of the most important and widespread deployment styles for machine learning (ML). Here, a cloud provider allows a user to upload data to its ML cloud service, which computes a set of predictions and returns these via an API to the user’s device. While powerful and convenient, this setup requires that the user has an inherent degree of trust in the cloud provider to protect the privacy of both the data being uploaded and the predictions being made.

One example of where this privacy concern is especially important is Machine Translation, wherein two people would like to leverage a machine to help them communicate, each in their own language. Today, cloud MLaaS deployments of machine translation require each person to upload what they’re saying to the cloud in order for it to be translated. As such, a cloud provider could potentially read both the uploaded text and the predicted translation. For particularly sensitive translations, this can be a non-starter.

Encrypted Machine Learning as a Service (EMLaaS) seeks to address this particular weakness of MLaaS by leveraging a machine learning classifier which operates on _encrypted_ data. In this way, the cloud service receives encrypted input data and returns encrypted predictions that can only be decrypted by the end user.

To that end, the United Nations Global Platform Privacy Task Team has endorsed the creation of an open source demo application to demonstrate how a cloud server can provide a translation service using EMLaaS. We envision such a service leveraging [PySyft](https://github.com/OpenMined/PySyft) and [Grid](https://github.com/OpenMined/Grid) as the cloud server and [syft.js](https://github.com/OpenMined/syft.js/) as the client library. You can read more about the genesis of this project [here](https://github.com/OpenMined/Grid/issues/203).

Upon the completion of this project, a demo of this platform is to be presented to the United Nations Privacy Task Team including Mark Craddock, the director of the United Nations Global Platform.

**Required Skills:** This project assumes that you are comfortable with Python development as well as the PyTorch Deep Learning Framework. As such, you should also be comfortable with the fundamentals of Deep Learning. Additionally, a big part of this project is the development and use of the syft.js library (which integrates Javascript with PySyft), so you must be comfortable with the basics of Javascript/Node development as well.

**Bonus Skills:** Since the final deliverable for this project is a working javascript app, web design / UX skills to make the app aesthetically pleasing are a plus! Priority will be given to applicants who have already demonstrated competence with PySyft and/or syft.js. Extra bonus points if you’ve already merged pull requests into OpenMined’s ecosystem.

## Project 2 – Federated Learning Data Science Platform

_Commissioned by the University of Oxford and the United Nations Privacy Task Team_

In this project, you’ll be building a platform which facilitates privacy-preserving research happening over a private, distributed dataset. This will allow researchers to do groundbreaking research without ever needing to request access to (or a copy of) the data they are studying. This will unlock new data to tackle important problems in healthcare, finance, and other fields involving personal information.

Key to the privacy technology narrative is a desire to allow data owners to participate in research without having to upload their data to someone else’s centralized compute infrastructure. This requirement is often a blocker for research involving private data. Individuals producing or protecting data are faced with a choice of whether to keep their data protected (on their own hardware) or to give it to a researcher in the hopes that it could contribute to valuable research goals (such as curing cancer).

Federated Learning is a new technique which allows an AI model to be trained on a dataset while it remains highly distributed. Conventionally, an AI model is trained on a single dataset which is located on a single machine/cluster, thus requiring such training data to be aggregated. Federated Learning flips this paradigm. Instead of bringing all of the data from all of the various data owners to the model’s centralized machine for training, it brings the model down to where the data lives (in all of its various locations, on infrastructure owned by the the data owners) to run the training.

Differential Privacy in the context of Data Science can empower an individual who is training a model to make formal guarantees about how much private information is learned by a statistical model or process.

In this project, you will focus on building out an open-source platform that delivers Federated Learning and Differential Privacy seamlessly as a part of existing Deep Learning Frameworks.

Upon the completion of this project, a demo of this platform is to be presented to the United Nations Privacy Task Team including Mark Craddock, the director of the United Nations Global Platform and John Gallacher, professor at the University of Oxford and director of the Dementias Platform UK.

**Required Skills:** This project assumes that you are comfortable with Python development as well as the PyTorch Deep Learning Framework. As such, you should also be comfortable with the fundamentals of Deep Learning.

**Bonus Skills:** Priority will be given to applicants who have already demonstrated competence with PySyft. Extra bonus points if you’ve already merged pull requests into OpenMined’s ecosystem.

## Project 3 – Encrypted Linear Regression for Genetics

_Commissioned by Jon Bloom, Broad Institute of Harvard and MIT_

One of the most important uses of encrypted machine learning technology is the ability for an AI model to be trained simultaneously across multiple encrypted datasets that may be owned by different organizations. Doing so provides the highest level of security to protect not only the datasets themselves but also the model/statistics being derived from the data. However, the technical expertise and computational complexity involved in providing this level of protection create a very high barrier to entry. The goal of this project is to make an application (with a UI) that lowers the barrier to entry for the encrypted training of linear models. In particular, a genetics researcher should be able to upload a CSV of datapoints into a server they own which will coordinate with other servers to train an encrypted linear model. This UI should be deployable using a [Grid](https://github.com/OpenMined/Grid) server.

In this project, you will be working with [Jon Bloom](https://www.broadinstitute.org/bios/jonathan-bloom) of the Broad Institute of Harvard and MIT for roadmap guidance and model development. In particular, Jon has already articulated a [specific training regime](https://github.com/OpenMined/PySyft/issues/2069) for model training, motivated by his work on the open-source [Hail project for scalable genomic analysis](https://github.com/hail-is/hail).

**Required Skills:** This project assumes that you are comfortable with Python development as well as the PyTorch Deep Learning Framework. As such, you should also be comfortable with the fundamentals of Deep Learning. Additionally, a big part of this project is the development and use of the [Grid](https://github.com/OpenMined/Grid) library (which integrates Flask with [PySyft](https://github.com/OpenMined/PySyft)), so you should be comfortable with the basics of server-side development as well. Finally, as Jon has developed an optimal training technique for encrypted linear models, basic familiarity with linear algebra (matrix multiplication, transpose, inverse, and indexing) is required.

**Bonus Skills:** Since the final deliverable for this project is a working web app, web design / UX skills to make the app aesthetically pleasing are a plus! Priority will be given to applicants who have already demonstrated competence with PySyft and/or Grid. Extra bonus points if you’ve already merged pull requests into OpenMined’s ecosystem.

## [How to Apply](#apply)

**Key Dates:**  
_Application Deadline: July 26th_  
_Notification Deadline: July 29th_  
_Development Begins: Aug 1_  
_Projects Completed: November 1st (full-time) or Feb 1st (half-time)_

The call for applicants opened on June 28th at the annual [RAAIS event](https://blog.openmined.org/raais/www.raais.co) in London that is presented by the [RAAIS Foundation](https://blog.openmined.org/raais/www.raais.org). To apply, send your resume/CV **before July 26th anywhere in the world** to [andrew@openmined.org](mailto:andrew@openmined.org) along with your Github username, which of the above projects you would be interested in working on (you may pick more than one), and a description of why you are interested in the project. Successful applicants will receive confirmation of their acceptance by **July 29th** and will begin work on **August 1st**

_If you or someone you know may be interested in sponsoring a grant like this one, please don’t hesitate to reach out via email! – [andrew@openmined.org](https://blog.openmined.org/raais/andrew@openmined.org)_
