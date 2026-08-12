---
title: "Announcing PipelineDP"
slug: announcing-pipelinedp-an-api-for-applying-differential-privacy-in-production
date: 2022-01-28T14:00:00
updated: 2024-12-19T19:33:20
categories: [news, stories]
tags: [announcements, privacy-enhancing-technologies-pets, differential-privacy]
authors: [abinav-ravi-venkatakrishnan]
cover: ./cover.jpg
coverAlt: ""
cardText: light
draft: false
legacyId: 1506
---

A big part of OpenMined’s mission is to make privacy preserving machine learning (PPML) accessible. Differential privacy is one of the most important PETs in the PPML ecosystem owing to its ability to provide output privacy, and OpenMined’s differential privacy team has been developing an open source library, PyDP, for the past 2+ years. In 2021 this progress culminated in our wonderful partnership with Google to [co-create production-level tools for Differential Privacy](https://developers.googleblog.com/2021/01/how-were-helping-developers-with-differential-privacy.html).

Today, with the Google Anonymization team; we are very pleased to announce the release of PipelineDP, an open source tool to build and use differentially private data pipelines.

### Why PipelineDP?

The story of PipelineDP starts with PyDP. PyDP provides many important functions for applying differential privacy via a relatively low-level Python API. While this offers great flexibility, it also requires additional expertise and configuration such as accounting for the privacy budget, calculating the sensitivity of various functions, and implementing correct aggregations. Building upon the powerful foundation that PyDP provides, PipelineDP offers a high-level end-to-end solution which manages these complexities under the hood while still ensuring that the result is differentially private.

For many real-life applications, a dataset cannot be loaded all at once into the memory so we use data pipelines to manage them one section at a time. Thus, for especially large datasets, we would like to apply differential privacy in a manner that is compatible with the workflow of a data pipeline. PipelineDP offers this functionality, allowing us to apply techniques like those in PyDP within existing frameworks for large data pipelines such as Apache Spark and Apache Beam.

### About PipelineDP:

PipelineDP is a framework for applying differential privacy to large datasets using batch processing systems like Apache spark and Apache Beam. As a first step in making this accessible to people who want to apply differential privacy, PipelineDP provides a convenient API which is familiar to Spark or Beam developers.

This API encapsulates the complexities of differential privacy such as protection of outliers and long tail categories, generation of safe noise, and privacy budget accounting. It also supports many standard computations such as count, sum, average and is easily extensible to support other aggregation types.

The repository for the project can be found at [https://github.com/OpenMined/PipelineDP/](https://github.com/OpenMined/PipelineDP/)  
To try it out yourself!  You can follow some examples here – [https://github.com/OpenMined/PipelineDP/tree/main/examples](https://github.com/OpenMined/PipelineDP/tree/main/examples)
