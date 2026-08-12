---
title: "Interview with Chinmay Shah: Differential Privacy Team Lead at OpenMined"
slug: interview-with-chinmay-shah-dp-team-lead-at-openmined
date: 2021-06-29T07:21:55
updated: 2025-01-10T14:41:40
categories: [community]
tags: [differential-privacy]
authors: [bala-priya-c]
draft: false
legacyId: 1629
---
<!-- TODO(a11y): 1 localized body image(s) have empty alt text -->


In the privacy research community, Differential Privacy has become the gold standard and is an active area of research. In essence, Differential Privacy (DP) is a property of the database access mechanism, that **ensures protection of an individual’s identity** while **allowing** **meaningful inference about the group**. It is therefore, an **algorithm level guarantee** that can facilitate availability of datasets for useful research.

At OpenMined, there have been research efforts in Differential Privacy. Starting with **project PyDP** – a Python wrapper for Google’s Differential Privacy project, the PyDP team’s diligence has resulted in several milestones with more to come!

In this interview, Chinmay Shah, who leads the  Differential Privacy team at OpenMined, talks about his interests, the team’s journey and the exciting road ahead!

<figure class="">

![](./media/1-circle-cropped-2.png)

<figcaption>Chinmay Shah: <a href="http://github.com/chinmayshah99/">GitHub</a> | <a href="https://twitter.com/chinmayshah899/">Twitter</a> | <a href="https://www.linkedin.com/in/chinmayshah99/">LinkedIn</a> | <a href="https://chinmayshah.xyz/">Website</a></figcaption></figure>

**Could you tell us where you’re based?**

> “Currently, I’m based in Mumbai, India.”

**Tell us about your academic background and professional experience**

> “I graduated with a Bachelor’s in Computer Engineering in 2020. After graduating, I’ve been working as a Software Development Engineer at SatSure, a space-tech startup. I predominantly work on building software solutions for enterprises.”

**What are your skills and specialties?**

> “I’ve been using Python, and building large data processing pipelines and backend services professionally. I also code in C++ and have a general interest in Machine Learning. As an engineer by profession, I try to get my hands dirty on the full development cycle from designing, management to product delivery. That said, I love solving problems, and am keen on learning whatever is necessary to deliver the solution.”

**What got you into PPML and how did you come to know about OpenMined?**

> “I’ve always been a strong believer in privacy. With the advent of Machine Learning technologies, it always used to get me thinking about how one would preserve privacy when all underlying technologies are data-driven. This quest led me to the field of Privacy-Preserving Machine Learning and that’s when I came across OpenMined.”

**How did you start contributing to OpenMined? Could you tell us about your first  contribution to the OpenMined codebase?**

> “I got involved in OpenMined during the inception of the PyDP team. I remember us deciding on a wrapping library to make Google Differential Privacy library accessible in Python. My first contribution was to move from a SWIG based system to a Pybind11 based wrapping method.”

**What motivated you to work on project PyDP? What interested you about Differential Privacy in particular?**

> “I’ve always worked on making technology accessible and when I came across Differential Privacy, there was Google DP and the codebase was in C++. We felt making the library accessible in Python would help drive a large-scale adoption of the same. This was our motivation for the PyDP project.
> 
> Differential Privacy makes an interesting promise, about protecting individual privacy while giving insights about the group. With our internet economy driven by hyper-tailoring of ads, and a wealth of other use-cases, Differential Privacy is certainly a super important tool.”

**Could you tell us about team PyDP and the milestones achieved?**

> “PyDP started with the sole goal of making Differential Privacy accessible. Since then, we have around 70k installs from PyPI, 600+ commits, and 50+ contributors! Some of the highlights of our journey so far include the following:  
> – Release of the first alpha version in April 2020  
> – Release of a stable version in September 2020  
> – Support for algorithms outside of Google’s DP library in June 2021
> 
> Going forward, we’ll be working on integrating the scikit-learn ecosystem into PyDP. This means that you’d be able to build Differentially Private Machine Learning models using your favourite algorithms.”

**What are you working on currently at OpenMined?**

> “Currently, I lead the Differential Privacy team, which encompasses all Differential Privacy related projects, including PyDP and PipelineDP.”

**What learning resources would you recommend for Differential Privacy and Privacy-Preserving AI in general?**

> For Differential privacy, I would highly recommend [CS860- Algorithms for Private Data Analysis](http://www.gautamkamath.com/CS860-fa2020.html) by Gautam Kamath and [Cynthia Dwork’s Differential Privacy lectures](https://www.youtube.com/playlist?list=PLW0RMTGWCiOXS94e5H-0RcnIsgjEbL2v0).
> 
> For Privacy-Preserving ML, I would recommend the [Secure and Private AI course on Udacity](https://www.udacity.com/course/secure-and-private-ai--ud185) by Andrew Trask and [OpenMined’s Private AI Series](https://courses.openmined.org/).

**Could you tell us about the roadmap to join team PyDP?**

> “Differential Privacy is still an active area of research and you certainly don’t need to have a thorough knowledge of the field to start contributing. The interest to contribute and willingness to learn are the key requirements. Be sure to DM me on OpenMined Slack and we can take it from there!”
