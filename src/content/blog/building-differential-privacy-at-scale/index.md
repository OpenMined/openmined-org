---
title: "Building Differential Privacy at Scale"
slug: building-differential-privacy-at-scale
date: 2021-04-17T10:58:40
updated: 2024-12-09T19:24:51
categories: [research]
tags: [differential-privacy, privacy-enhancing-technologies-pets]
authors: [ishan-mistry]
draft: false
legacyId: 1770
---
<!-- TODO(content): 3 unrecoverable figure(s) removed — dead Google-Docs/social paste artifacts (404 on live for years, no archive). Recreate if valuable. -->


This is the summary of the talk “[Building differential privacy at scale](https://www.youtube.com/watch?v=VaBlM-E7czg)” by Miguel Guevara ( Product Manager at Google)  at the OpenMined Privacy Conference 2020.

People are getting aware of their data rights and also about the clever ways using which companies could use their personal data for profits. But just having this knowledge is not enough. We need to build an infrastructure that actually helps us implement these rights in order to have better and robust information flows. The talk highlights this idea and walks us through the journey and hurdles faced on our way to differential privacy.

### What are the stages involved in building the infrastructure?

1.  Building strong foundations.
2.  Building frameworks familiar to the users.
3.  Navigating to the utility – privacy frontier.

### Why do we need privacy-preserving infrastructure?

1.  People are becoming more aware of their data and privacy rights leading to a significant rise in the rise of private data.
2.  A privacy-based infrastructure could accelerate the development process as the developers often have to perform many experiments in the ideation stage – giving them insights from the overall statistical trends before even seeing the data and plan their tasks accordingly.

### What did this journey of stepping into the world of privacy look like for Google?

The team at Google took the SQL query engine (as the subject), which was not widely used back then, turned it into a use case for a Differentially private service early on. SQL is used extensively as a component for a wide number of applications and hence it could be a notable contribution.

Building the infrastructure had its own sets of challenges:

1.  Initially, there was a lot of computation skewness as some of the initial users were processing terabytes of data to produce differential private results.
2.  Making it user-centric – something people can get easily familiar with.

### How does the differentially private SQL work?

It mainly splits and separates the SQL statements into transforms within the scope of particular users and the statements made across the results of the traditional transforms across many users.

Making of the  privacy equivalents of joins (while also proscribing some joins) enabled cross user transforms  – which include all the basic statistical functions – mean median percentile, etc.

Given below is a query that has been made in a differentially private environment.


One can observe the changes in the format of a Differentially private Query as compared to the conventional SQL query. Here we explicitly specify the privacy parameters like Epsilon (the concept of privacy budget wherein we set a limit on the extent to which the data can be actually reconstructed) as per the use case.

Notice the use of Anonymous aggregate functions like ANON\_COUNT  and ANON\_AVG.

Also, the paper linked below discusses in fair detail how the various partitions are made by scanning tables and then joining them to form partitions. The image below depicts the process that happens in the background when running a differentially private Query.


### How do you know if the infrastructure is doing what it’s supposed to do (Model Testing)?  

This is an integral component of the infrastructure, we as the builders of the infrastructure should be able to prove that it does “something say X ”, but nothing more than that. This is the only way to enumerate all the possible states and behaviors of the system. The result is that it gives confidence that an algorithm is “not incorrect ” with a certain confidence. This confidence score is a good indicator of the correct functioning of the infrastructure.

### Use cases

1.  Mobility map : The goal was to publish a privacy-preserving map of the movement patterns of the world’s population with partners like Oxford, Harvard, UNICEF, etc. This map was then used to measure the impact of mobility in Puerto Rico.

2\. New insights into human mobility using the infrastructure built by Google. It included the mobility reports that included daily numbers and national coverage. Using the privacy-enabled insights from their built infrastructure, they also published a search trends symptoms dataset.

### Utility privacy frontier

People are usually skeptical when they know about the fact that additional noise is added to the data in order to make it private. But most of the convincing is done by showing them the results and then letting them decide.

For example, the speaker’s team uses a probability graph to explain the benefits.


The [graph](https://www.youtube.com/watch?v=VaBlM-E7czg) shown depicts that even an attacker has a prior probability of just 0.516 to guess whether the person/data he is looking for is present or not. After applying the differential privacy techniques the posterior probability increases from 0.516 to 0.762.

This is one way of how we could realize the information gain that occurs when we select a certain epsilon, a privacy budget parameter that tells you the extent to which a person can reverse engineer the data.  
Helping people produce meaningful statistics and bounds from the dataset and at the same time also preserving a healthy amount of privacy during the process is also one of the ways to make people aware of the benefits and hence making the infrastructure more familiar and accessible.

### Key takeaways (TL;DR)  

It does take a lot of time in getting the differential privacy infrastructure from the ground up but this time and effort is a result of the numerous use cases and scenarios that undoubtedly pay off in the end. The use cases that we saw bolster the fact that making the infrastructure “user-centric” is crucial.

This leads us to the final section where we discussed why people are reluctant to incorporate differential privacy into their stacks and looked at ways of educating people bout the advantages by helping them grasp the insights better through a comparison between the prior and posterior changes. This way we introduce the power of using differentially private infrastructure and hence also garner user support.

### References

\[1\] [“Differentially Private SQL”](https://arxiv.org/pdf/1909.01917.pdf) that the speaker refers to in the talk.  
\[2\] Link to the conference talk – [Building Differential privacy at scale](https://www.youtube.com/watch?v=VaBlM-E7czg)  
\[3\] Cover Photo by [Mika Korhonen](https://unsplash.com/@mikakor?utm_source=ghost&utm_medium=referral&utm_campaign=api-credit) on Unsplash
