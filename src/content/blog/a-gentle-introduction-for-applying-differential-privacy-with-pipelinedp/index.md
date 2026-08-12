---
title: "A gentle introduction for applying Differential Privacy with PipelineDP"
slug: a-gentle-introduction-for-applying-differential-privacy-with-pipelinedp
date: 2022-01-28T14:00:00
updated: 2024-12-09T18:56:37
categories: [research]
tags: [privacy-enhancing-technologies-pets, differential-privacy, tutorials]
authors: [chinmay-shah]
draft: false
legacyId: 1503
---

Today, we are proud to announce the Beta version of a framework for differential privacy in Python we call _PipelineDP_, which OpenMined built in tight collaboration with Google.

### What is PipelineDP?

PipelineDP is a Python framework for applying central differential privacy to large datasets using batch processing systems such as [Apache Spark](https://spark.apache.org/), [Apache Beam](https://beam.apache.org/). Also, PipelineDP can run locally without any batch processing systems, which is convenient for small datasets. The “Pipeline” in PipelineDP is there because it supports running data processing pipelines (such as Beam or Spark) with differential privacy.

The goal of PipelineDP is to make differential privacy accessible to non-experts:

-   **provides a convenient API** familiar to Spark or Beam developers;
-   **encapsulates the complexities** of differential privacy, such as protection of outliers and rare categories, generation of safe noise and privacy budget accounting;
-   **supports many standard computations**, such as count, sum, average (and in future more metrics).

PipelineDP builds upon the previous open-source work:

-   it uses low-level differential privacy primitives from our [PyDP library](https://github.com/OpenMined/PyDP);
-   it is conceptually similar to [Privacy On Beam](https://github.com/google/differential-privacy/tree/main/privacy-on-beam), a similar framework for Go; the key difference is availability for Python developers and extensibility to arbitrary data processing systems;

### Example of applying PipelineDP

The goal of PipelineDP is to make private processing as easy and scalable as regular processing using systems such as Spark or Beam. Here’s a simplified example showing regular and private processing side by side:

Let’s consider how to compute the number of views per movie in the Netflix prize dataset (which can be downloaded [here](https://www.kaggle.com/netflix-inc/netflix-prize-data)). The dataset consists of movie views, which might be represented in Python:

<table style="border:none; border-collapse:collapse"><colgroup></colgroup><tbody><tr style="height:0pt"><td style="border-left:solid #e0e0e0 1pt; border-right:solid #e0e0e0 1pt; border-bottom:solid #e0e0e0 1pt; border-top:solid #e0e0e0 1pt; vertical-align:top; padding:5pt 5pt 5pt 5pt; overflow:hidden; overflow-wrap:break-word"><p dir="ltr" style="line-height:1.38; margin-top:0pt; margin-bottom:0pt">import datetime as dt</p><p dir="ltr" style="line-height:1.38; margin-top:0pt; margin-bottom:0pt">@dataclass</p><p dir="ltr" style="line-height:1.38; margin-top:0pt; margin-bottom:0pt">class MovieView:</p><p dir="ltr" style="line-height:1.38; margin-top:0pt; margin-bottom:0pt">&nbsp;user_id: int</p><p dir="ltr" style="line-height:1.38; margin-top:0pt; margin-bottom:0pt">&nbsp;movie_id: int</p><p dir="ltr" style="line-height:1.38; margin-top:0pt; margin-bottom:0pt">&nbsp;rating: int</p><p dir="ltr" style="line-height:1.38; margin-top:0pt; margin-bottom:0pt">&nbsp;date: dt.datetime</p></td></tr></tbody></table>

Let’s assume movie views are loaded to Spark [RDD](https://spark.apache.org/docs/latest/rdd-programming-guide.html) **movie\_views.**

<table style="border:none; border-collapse:collapse"><colgroup><col width="349"> <col width="388"></colgroup><tbody><tr style="height:0pt"><td style="border-left:solid #000000 1pt; border-right:solid #000000 1pt; border-bottom:solid #000000 1pt; border-top:solid #000000 1pt; vertical-align:top; padding:5pt 5pt 5pt 5pt; overflow:hidden; overflow-wrap:break-word"><p dir="ltr" style="line-height:1.2; margin-top:0pt; margin-bottom:0pt">Regular computation</p></td><td style="border-left:solid #000000 1pt; border-right:solid #000000 1pt; border-bottom:solid #000000 1pt; border-top:solid #000000 1pt; vertical-align:top; padding:5pt 5pt 5pt 5pt; overflow:hidden; overflow-wrap:break-word"><p dir="ltr" style="line-height:1.2; margin-top:0pt; margin-bottom:0pt">Private computation</p></td></tr><tr style="height:0pt"><td style="border-left:solid #000000 1pt; border-right:solid #000000 1pt; border-bottom:solid #000000 1pt; border-top:solid #000000 1pt; vertical-align:top; padding:5pt 5pt 5pt 5pt; overflow:hidden; overflow-wrap:break-word"><p dir="ltr" style="line-height:1.38; margin-top:0pt; margin-bottom:0pt"># Extract movie ids</p><p dir="ltr" style="line-height:1.38; margin-top:0pt; margin-bottom:0pt">movie_ids = movie_views.map(lambda mv: (mv.movie_id, 1))</p><p></p><p dir="ltr" style="line-height:1.38; margin-top:0pt; margin-bottom:0pt"># Compute count</p><p dir="ltr" style="line-height:1.38; margin-top:0pt; margin-bottom:0pt">movie_count = movie_ids.countPerKey()</p><p></p></td><td style="border-left:solid #000000 1pt; border-right:solid #000000 1pt; border-bottom:solid #000000 1pt; border-top:solid #000000 1pt; vertical-align:top; padding:5pt 5pt 5pt 5pt; overflow:hidden; overflow-wrap:break-word"><p dir="ltr" style="line-height:1.38; margin-top:0pt; margin-bottom:0pt"># Create PrivateRDD</p><p dir="ltr" style="line-height:1.38; margin-top:0pt; margin-bottom:0pt">private_movie_views = pipeline_dp.make_private(movie_views,&nbsp;</p><p dir="ltr" style="line-height:1.2; margin-top:0pt; margin-bottom:0pt">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;budget_accountant,&nbsp;</p><p dir="ltr" style="line-height:1.2; margin-top:0pt; margin-bottom:0pt">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;privacy_id_extractor=lambda mv: mv.user_id)</p><p></p><p dir="ltr" style="line-height:1.38; margin-top:0pt; margin-bottom:0pt"># compute the private count</p><p dir="ltr" style="line-height:1.38; margin-top:0pt; margin-bottom:0pt">dp_movie_count = private_movie_views.count(</p><p dir="ltr" style="line-height:1.38; margin-top:0pt; margin-bottom:0pt">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CountParams(max_partitions_contributed=100,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p><p dir="ltr" style="line-height:1.38; margin-top:0pt; margin-bottom:0pt">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;max_contributions_per_partition=1,</p><p dir="ltr" style="line-height:1.2; margin-top:0pt; margin-bottom:0pt">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;partition_extractor=lambda mv: mv.movie_id))</p></td></tr></tbody></table>

One of the differences with regular computations is that PipelineDP needs to know what is the privacy id for each dataset record. Usually the privacy id corresponds to the user id. The privacy is specified by the **privacy\_id\_extractor** function.

In PipelineDP terminology, a partition is a subset of the data by which dp statistics is computed, in this case 1 partition corresponds to 1 movie (a partition for every movie record).

Internally PipelineDP manages all complexities for assuring that the result is differentially privacy. For example in this case

1.  PipelineDP performs contribution bounding by each privacy\_id, namely in this case it’s ensured that each privacy id contributes to not more than 100 partitions. In case if there are more than 100 views per user, 100 views are randomly sampled, others are dropped. That is needed in order to limit a mechanism’s sensitivity
2.  Laplace noise is added. [The Laplace mechanism](https://en.wikipedia.org/wiki/Additive_noise_mechanisms) is a default mechanism, another supported option is the Gaussian mechanism.

This is somewhat simplified, and there’s more setup that needs to be done to define privacy properties of the pipeline, such as privacy budget. For more details, please check our examples for [Spark](https://github.com/OpenMined/PipelineDP/blob/main/examples/movie_view_ratings_spark.py) and [Beam](https://github.com/OpenMined/PipelineDP/blob/main/examples/movie_view_ratings_beam.py), and a thorough [Jupiter Notebook](https://github.com/OpenMined/PipelineDP/blob/main/examples/quickstart.ipynb) that walks you through the main concepts.

### What’s next?

DP is a vast and quickly evolving area. Now PipelineDP supports a small set of possible computations. It is a big road ahead. We are planning to add new aggregation types (e.g. private quantiles), improve usability by supporting automatic tuning of parameters.

### Interested in contributing?

If you like to help please let us know (Contact @chinmay on Slack).

-   **Interested to learn more about how differential privacy works?** Contributing code to PipelineDP is an excellent way to get your hands dirty.
-   **Are you a researcher and you’ve published a new method or improvement?** Adding this to PipelineDP will make it available to the community.
-   ******Have an exciting example of differential privacy?** We’d like to hear more and add your example to our [collection of examples](https://github.com/OpenMined/PipelineDP/tree/main/examples), either as a python script or as a Jupiter notebook**.**
