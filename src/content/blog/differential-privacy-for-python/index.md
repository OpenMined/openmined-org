---
title: "Dev Diaries- Wrapping Differential Privacy for Python"
slug: differential-privacy-for-python
date: 2020-06-02T05:49:33
updated: 2024-12-09T20:51:35
categories: [research]
tags: [differential-privacy]
authors: [ben-szymkow]
draft: false
legacyId: 2198
---

The [compelling use cases](https://blog.openmined.org/use-cases-of-differential-privacy/) for differential privacy are growing each day. Engineers at OpenMined have been busy building libraries to improve developer accessibility to industry tested implementations.

In this latest instalment of OpenMined Dev Diaries we talk to [Chinmay Shah](https://twitter.com/chinmayshah899), Python lead for OpenMined’s Differential Privacy team about his experiences building [PyDP](https://github.com/OpenMined/pydp), a Python API for Google’s [Differential Privacy library](https://github.com/google/differential-privacy).

### Why bring differential privacy to Python?

Python has incredible adoption around the world and has become a tool of choice by many data scientists and machine learning experts. Making differential privacy accessible to their ecosystem is a priority for OpenMined. COVID-19 certainly added to the urgency of our efforts, but differential privacy for python is one of the most requested capabilities by our community.

### What were some of the lessons your team learned along the way?

The engineering challenges of bringing Google’s differential privacy library to Python in a way that is palatable to our intended user base was fraught with challenges:

-   The first question we needed to answer was choice of binding/wrapping framework. [SWIG](http://www.swig.org/) looked good, but we ran into some problems with C++ templates. We also tried a host of others but eventually landed on [pybind11](https://github.com/pybind/pybind11). This library gave our team the flexibility to really take control of what our API looked like, integrated well with our build system and had great documentation.
-   The Google library uses the [Bazel build system](https://bazel.build/), but our team was more comfortable with CMake. After some experimentation it was pretty clear that we were on the wrong path. Once we learned how to use Bazel it really accelerated our work!
-   Google’s DP library makes extensive use of C++ templates. Figuring out the nuances of pybind11 bindings, templates and casting between C++/Python types turned out to be a lot harder than we expected. We made a breakthrough after lots of sleepless nights when we started looking at how other popular projects conquered this like the [TensorFlow library](https://github.com/tensorflow/tensorflow).

### What’s next?

These days, we are spending time bug fixing, improving bench-marking and validation, and collaborating with our research team to ensure that the code is fit-for-purpose for the most common production scenarios.

Beyond [PyDP](https://github.com/OpenMined/pydp), we plan to develop plugins for popular databases and expand the breadth of our offering to include additional perturbation mechanisms (e.g. Gaussian, exponential etc…) and support for more scenarios.

### How you can help!

If you want to start contributing to PyDP, why not try your hand at a [good first issue](https://github.com/openmined/pydp/issues?q=is%3Aissue+is%3Aopen+label%3A%22Good+first+issue+%3Amortar_board%3A%22)?  Feel free to join in the conversation on our [Slack community](https://join.slack.com/t/openmined/shared_invite/zt-een94bc6-6ErpR~73SFAdNu5~QH7tlg) as well. Join #lib\_pydp to get started!
