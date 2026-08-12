---
title: "If the COVID19-pandemic were the earthquake, privacy loss could become the next tsunami"
slug: if-the-covid19-pandemic-were-the-earthquake-privacy-loss-could-become-the-next-tsunami
date: 2020-04-15T14:24:50
updated: 2025-03-10T16:14:19
categories: [research]
tags: [privacy-enhancing-technologies-pets]
authors: [georgios-kaissis]
draft: false
legacyId: 2316
---

> _And whatsoever I shall see or hear in the course of my profession \[…\] I will never divulge, holding such things to be holy secrets._
> 
> _– From the W.H.S. Jones translation of the Hippocratic Oath_

_by Georgios Kaissis and Rickmer Braren_

As radiologists we are never more than a few clicks away from petabytes of patient data in the form of imaging datasets and clinical information. It is not uncommon to receive requests to share this data with clinician colleagues and researchers. During the course of the SARS-CoV2 pandemic however, we witnessed an unprecedented surge in requests by tech start-ups, established companies and other academics to share images and clinical datasets from patients with COVID-19, control populations with other pathologies or healthy subjects in order to build databases, train algorithms, deploy AI tools and conduct research to fight the pandemic.

The premise under which these requests were often posed was for our department to “donate our data” in exchange for co-authorship on a publication, academic funding, requests to buy datasets, or an appeal to our good will.

At the same time, all over the world, voices are getting louder asking to ease the social restrictions and rules imposed on the country for the past few weeks. A prominent german virologist recently offered the existence of a contact tracing app for mobile phones and wearables as one of the solutions to this issue, and a potential prerequisite for loosening the social restrictions.

I see many parallels between being asked to ‘donate’ patient data and the larger discussion about consenting to participation in automated contact tracing. Personal data is personal data, no matter if it’s structured clinical data and images or a log of our recent contacts in the form of movement and interaction data sourced from mobile phone or wearable sensors. **Personal data is and remains an invaluable good by nature of it being valuable both in a monetary and an ethical sense.**

There are, however, differences between the data we are being entrusted with as physicians for executing our clinical and research duties, and the data our phones and devices generate: **We own** _**our**_ **data, but we don’t own our patients’ data.** **Data governance does not equal data ownership.**

My department has been asked for patient data by fellow researchers trying to develop COVID-19 diagnostic tools or cures but also by start-ups claiming to want to help without any financial interest. Irrespective of the underlying intentions, the potential ramifications of releasing patient data to third parties need to be considered. Well-intentioned requests with insufficient technical implementations can lead to disastrous privacy outcomes. In the rush to establish technical frameworks for data sharing and processing under the pressure of the pandemic, some seem to neglect consulting with privacy and security experts. Data sharing under the premise that it will be safeguarded by anonymisation or pseudonymisation alone neglects the mounting evidence on linkage attacks proving that these techniques are not effective.

### The privacy-preserving alternatives to sharing data

Data governance entails the responsibility of safekeeping, and as physicians we are entrusted with patient data to fulfil our clinical duties and legally and morally bound to protect it like the life and health of the patient it belongs to. Beyond this singular purpose, we require authorisation, preferentially by the patient themselves after thorough and truthful explanation of the intended purpose in appropriate language (i.e. informed consent).

In the context of any form of data sharing, our decisions must hinge not only on our moral and ethical convictions and the legal frameworks in place, but also on our knowledge about the technical implementations of the data storage and processing systems. As individuals, we are asked to decide whether to allow the use of our or our patient’s data for a certain purpose. We should be ensuring that his purpose is being explicitly and conclusively stated and demand _single use accountability_.

The centralised storage of patient data on “secure clouds”, “repositories” and “databases” has been proposed on several occasions, arguing that the pandemic is rapidly progressing and that there is no time for more granular governance solutions. **I believe we should be insisting on funding being directed towards** [**decentralised data storage models**](https://arxiv.org/abs/2003.08119) **first and foremost. Single copies of encrypted datasets should be stored under the provable assertions of ownership, governance retention and permanent deletion upon request.**

In addition, algorithms trained on this data must be designed to un-learn the dataset, and optimally be encrypted themselves, precluding model inversion. Fortunately, with other industries also limited by regulations of private data, three cutting edge techniques have been developed that have huge potential for the future of machine learning in healthcare: federated learning, differential privacy, and encrypted computation. These modern privacy techniques would allow us to train our models on encrypted data from multiple institutions, hospitals, and clinics without sharing the patient data__.__ See [Emma’s blog post](https://blog.openmined.org/federated-learning-differential-privacy-and-encrypted-computation-for-medical-imaging/) for an excellent summary on the techniques of privacy-preserving machine learning on medical images.

In our effort to establish trusted frameworks, we need to consider who the privacy guarantor of such systems is. My preference is being able to probe the system itself to ascertain its trustworthiness. This requires mathematically provable security and auditability through public-facing APIs, open-source implementations, and thorough documentation. Inherent trust in governments notwithstanding, I believe it is both our right and duty to not rely on subjective assurances of privacy, which might be compromised due to unintended implementation errors.

It stood out to me during this pandemic how often politicians and the press noted the important role of scientists in informing policy making. It’s reassuring to see the opinions of virologists and epidemiologists being featured in the media. However, ethicists, philosophers, disease modeling experts, sociologists and economists should also be asked to contribute their expertise and willingness to inform. As a community of experts on privacy and security, we and other communities like OpenMined should aim to empower the public and the policy makers by informing, teaching, researching and developing, and offering our expertise wherever required.

The debate about data sharing should not be conducted under time pressure, false premises, populistic claims or misguided motives. Some of what is asked of us right now, whether it be to share data, or to allow our movements and interactions to be tracked, is essentially the same as has been happening for years on the internet, social media and on our mobile devices, and what is considered normal and lawful in certain states.

**Today’s decisions and the precedents we set will shape the world we will live in after the pandemic — and we still have the time to decide.**
