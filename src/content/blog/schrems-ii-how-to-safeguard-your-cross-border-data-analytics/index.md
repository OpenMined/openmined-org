---
title: "Three Ways to Future-Proof your Data Analytics against the Changing Regulatory Landscape"
slug: schrems-ii-how-to-safeguard-your-cross-border-data-analytics
date: 2020-07-30T12:56:15
updated: 2024-12-09T20:44:18
categories: [policy]
tags: [federated-learning]
authors: [eitan-rovero-shein]
draft: false
legacyId: 2125
---
<!-- TODO(a11y): 1 localized body image(s) have empty alt text -->


_Originally published on [DataFleets’ Blog](https://medium.com/datafleets-blog/schrems-ii-three-ways-to-safeguard-cross-border-data-analytics-5217d47ae207?source=friends_link&sk=adf355b8e4b1572c19dd02f134c9e98a)_

<figure class="">

![](./media/1lgbwhgqwnebgigitpbxuba.png)

<figcaption>Europe map at night. Provided by NASA, <a href="http://visibleearth.nasa.gov/view.php?id=79765" data-href="http://visibleearth.nasa.gov/view.php?id=79765" class="markup--anchor markup--figure-anchor" rel="noopener noreferrer noopener noopener noopener noopener noopener" target="_blank">visibleearth.nasa.gov/view.php?id=79765</a>.</figcaption></figure>

> **_“A ruling by the EU’s top court invalidates the key mechanism for transferring personal data from the EU to the US and imposes additional conditions for use of the standard contractual clauses.”_**

_—_ [_Latham and Watkins_](https://www.globalprivacyblog.com/privacy/cjeu-invalidates-eu-us-privacy-shield/)_, regarding Data Protection Commissioner v. Facebook Ireland Limited, Maximillian Schrems (Case C-311/1) (Schrems II)_

On Thursday, July 16th 2020, the European Court of Justice invalidated the EU-US Privacy Shield, one of the key mechanisms for lawfully transferring personal data between the two jurisdictions. Data controllers must now conduct detailed examinations of the circumstances of each transfer, the adequacy of protection at the recipient country, and the parties involved ([1](https://europeanlawblog.eu/2020/07/17/the-schrems-ii-judgment-of-the-court-of-justice-and-the-future-of-data-transfer-regulation/)). More than 5,300 companies operated under the EU-US Privacy Shield, ⅔ of which were SMEs ([2](https://www.bbc.com/news/technology-53418898)). Authorities like the Berlin data commissioner have called data localization the only credible solution ([3](https://pro.politico.eu/news/berlin-data-watchdog-calls-for-data-localisation-after-schrems-ii)), and The International Association of Privacy Professionals (_disclaimer: DataFleets is a Corporate Member_) highlighted the risk of the EU becoming an “Information Island” ([4](https://slack-redir.net/link?url=https%3A%2F%2Fiapp.org%2Fnews%2Fa%2Fwill-the-eu-become-an-information-island%2F))

The core issue for enterprise AI / ML initiatives is that data must be “pooled”. The inability to aggregate data from Europe may cause AI / ML models to degrade, including risk assessments for financial transaction monitoring / anti-money laundering (AML) and recommendation engines for what to watch, where to travel, and what to buy. All of this is compounded by two existing challenges: GDPR and COVID-19.

> “Our data in Europe is essentially frozen in an iceberg by GDPR. No one in the U.S. can touch it for analytics, and our ML models are poor because of it.”  _—_  Market-leading technology and travel company

> “Coronavirus broke our credit underwriting models. All the patterns changed.”  —  Market-leading financial services institution

We suggest that data teams use this opportunity to future proof their analytics against the changing regulatory landscape in three ways. Let’s take them in turn.

### 1\. Data Sovereignty

**_Future proof assumption: data should remain resident where it was created when establishing data pipelines and architecture._**

_Schrems II_ is the latest confirmation that data sovereignty is here to stay. The data economy is getting chopped up into Westphalian bits, blocking aggregation for analytics.

Definitions:

-   **Data residency** means that data “resides” or is stored in a location for regulatory purposes, such as tax regimes.
-   **Data sovereignty** is indistinguishable from data residency in practice but may denote local governance in addition to residency.
-   **Data localization** is sovereignty with an additional significant parameter: requiring data to be located exclusively in the jurisdiction where it was created.

Our CEO David Gilmore was asked by Bloomberg about similar trends affecting [USA / California CCPA](https://www.bloomberg.com/news/articles/2020-01-03/startups-chase-55-billion-boom-fueled-by-california-privacy-law) and [China](https://www.bloomberg.com/news/articles/2020-07-08/google-scrapped-cloud-initiative-in-china-sensitive-markets):

> … laws that require data reaped inside the country to stay there, with China being perhaps the most stringent example…More than 100 countries have some sort of data sovereignty laws in place, according to David Gilmore, chief executive officer of DataFleets Ltd., an enterprise software firm. In the U.S., state policies, such as California’s new consumer privacy law, provide further restrictions on how cloud companies handle data. **“It’s just the tip of the iceberg,” he said.**

According to [Bart Willemsen](https://www.gartner.com/analyst/61755), Vice President Analyst at Gartner:

> … by 2023, 65% of the world’s population will have its personal information covered under modern privacy regulations, up from 10% today

> … by 2023, more than 80% of companies worldwide will be facing at least one privacy-focused data protection regulation

### 2\. Cloud Migration and Multi-Cloud

**_Future proof assumption: my cloud provider must have a local data center in my countries of operation, and a multi-cloud approach may be required._**

Just like COVID-19 accelerated cloud computing, _Schrems II_ may catalyze local data centers for cloud providers. We researched which cloud provider was best positioned to take advantage of this shift. Here’s how many jurisdictions can be currently served by each provider (as of July 2020):

-   [**Azure:** 19 Countries (51 Regions)](https://azure.microsoft.com/en-us/global-infrastructure/geographies/)
-   [**AWS:** 18 Countries (24 Regions)](https://aws.amazon.com/about-aws/global-infrastructure/)
-   [**GCP:** 17 Countries (24 regions)](https://cloud.google.com/about/locations)

While currently all three have data centers in a similar number of geographies, Azure’s experience with a more distributed footprint could help them capitalize on this trend.

_Disclaimer:_ [_DataFleets_](https://www.datafleets.com/) _is cloud-agnostic, and we currently use cloud services from all three of the above providers._

We also observe regional fragmentation leading to multi-cloud implementations. For example, a leading financial services institution working with DataFleets uses Alibaba Cloud to support Asia Pacific while using one of the three above providers in US and Europe. With cloud data becoming increasingly politicized, we expect this Balkanization to continue.

### 3\. Privacy-by-design (PBD) and privacy-enhancing technologies (PETs)

**_Future proof assumption: data ops and analytics should include best practices to mathematically limit privacy risk._**

With this rapid increase in privacy regulation, investing _now_ in best practices such as data minimization, reducing data copies, and risk-based anonymization is not only ethical, it makes business sense to preserve operating continuity and gain a marketing edge as a privacy-first brand. An example is [Microsoft’s decision to uphold CCPA standards](https://blogs.microsoft.com/on-the-issues/2019/11/11/microsoft-california-privacy-rights/) across the entire U.S, not just in California.

Privacy-enchancing technologies are rapidly maturing and gaining admiration from regulators. The UK’s Information Commissioner’s Office [listed Federated Learning](https://ico.org.uk/media/about-the-ico/consultations/2617219/guidance-on-the-ai-auditing-framework-draft-for-consultation.pdf) as a tool that can meaningfully contribute to data minimization efforts. There are three best-of-breed open source projects we recommend evaluating:

-   [OpenMined](https://www.openmined.org/) Homomorphic Encryption, MPC, Differential Privacy, and Federated Learning
-   [White Noise](https://cloudblogs.microsoft.com/opensource/2020/05/19/new-differential-privacy-platform-microsoft-harvard-opendp/) Differential Privacy by Microsoft and Sarah Bird
-   [TensorFlow Federated](https://www.tensorflow.org/federated) Learning by Google

Federated Learning is especially applicable to the EU-US divide because its core insight is shipping models to data rather than aggregating data centrally. It combines:

1.  **Privacy** removes the need for traditional privacy approaches like data masking and tokenization
2.  **Federated architecture** removes the need for data aggregation such a single data lake or data warehouse

In the future, we predict Federated Learning and differentially-private federated SQL will be the prevailing paradigm for unified multi-jurisdictional analytics. This form of “arm’s-length data science” comes with the benefits of potentially greater and faster data access, improved developer productivity, and best-in-class privacy and security.

### **Conclusion**

It’s worth remembering there are trillions of dollars of economic growth at stake. A study from James Manyika and the McKinsey Global Institute in [2016](https://www.mckinsey.com/business-functions/mckinsey-digital/our-insights/digital-globalization-the-new-era-of-global-flows) showed that cross-border data flows significantly contribute to economic growth, with upwards of $2.8 trillion of net positive economic activity. A separate study by in [2018](https://www.mckinsey.com/featured-insights/artificial-intelligence/notes-from-the-ai-frontier-applications-and-value-of-deep-learning#part4) found AI can contribute 40 percent of the overall $9.5 trillion to $15.4 trillion annual impact by analytics.

_Tag us on Twitter [@DataFleets](https://slack-redir.net/link?url=https%3A%2F%2Ftwitter.com%2FDataFleets) or sign up to [access our Federated Learning on MNIST tutorial](https://slack-redir.net/link?url=https%3A%2F%2Fwww.datafleets.com%2Ftry-demo)._
