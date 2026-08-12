---
title: "Of Legal Tangles and Synthetic Datasets Part 2: Legality"
slug: of-legal-tangles-and-synthetic-datasets
date: 2022-03-24T05:59:18
updated: 2024-12-09T18:54:05
categories: [policy]
tags: [synthetic-data, ai-ethics, privacy-enhancing-technologies-pets]
authors: [gatha-varma]
draft: false
legacyId: 1465
---

Part 2: Where does synthetic data stand when it comes to the laws that protect user privacy?

In [a previous blog](https://blog.openmined.org/how-synthetic-data-can-leak-your-information/), we saw that synthetic data is as vulnerable to disclosures as real-world datasets. The simple logic that synthetic datasets need to serve statistical analysis results in models that can be trained and used to gain meaningful information from them as well. This is particularly true if the data was synthesized to retain the original relationships of its seed.

The sharing of models trained on sensitive data is, therefore, a critical issue as well. Historically, differential privacy has proven to be effective in not only data protection but also to answer model access requirements. Synthetic data further protected with guarantees of differential privacy, therefore, emerged as a popular solution. Here we will discuss the legality of synthetic data in its untouched glory and for the case when it has been enhanced with differential privacy.

---

## The legality of plain synthetic datasets

A plain synthetic dataset is devoid of any additional anonymizations or perturbations. It is generated with the simple mantra of _data in, data out_, and therefore is pretty much vulnerable to the possibility of _secret in, secret out_. Regulations that protect Personal Identifiable Information (PII) like GDPR, Health Insurance Portability and Accountability Act (HIPAA), and others are also relevant to synthetic datasets. Such regulations may cause strict interpretations that prohibit the release of synthetic datasets, or conversely share them in risky scenarios. In the first case of over-inclusive privacy, regulations state that _no privacy loss is permitted no matter how small the chance of leakage_. For the latter, the leniency in the release of synthetic datasets may result in an under-inclusive privacy scenario.

To better understand the nuances of the two cases, let us assume a large training dataset with few outliers. The two privacy scenarios would look like this:

### Over-inclusive privacy

HIPAA lays down the regulations to protect sensitive patient information. It stipulates that a dataset cannot be shared until all of the seventeen identifiers that include name, telephone numbers, and email address among others have been protected. The combination of these personal identifiers along with the medical details of an individual become PHI (Personal Health Information), thereby justifying the stringent statutes.

For the case of a synthetic dataset, the identifiers will be replaced by another value with a certain confidence. In the unlikely event that a particular query returns a real telephone number, the adversary cannot be sure that the value of associated attributes like the individual’s HIV status or cancer diagnosis will be the true value. The results achieved by querying synthetic datasets cannot be used for reconstruction as is the case with de-identified real datasets.

Here’s another promising figure. In an experiment, the probability of the presence of a secret in a synthetic dataset was over four thousand times more likely than a random word. Yet researchers were able to extract secrets with a low success rate of 42%.

The promise of a balanced privacy-utility tradeoff can be a favorable quality when deciding on PETs, and synthetic datasets have proven to be strong contenders. Nonetheless, for strict regulations like HIPAA, even a minuscule probability of identification would prohibit the release of such datasets.

### Under-inclusive privacy

Now let us focus on regulations that have scope for underestimation of the dataset’s disclosure potential. Statutes like California Consumer Privacy Act (CCPA) specify that data can be deemed shareable only if it lacks traditional identifiers like name or telephone number. Such protections are theoretically provided by a majority of PETs including synthetic datasets. But unintended identification is still possible especially since proxy identifiers such as user IDs or device serial numbers have been found to cause disclosure of user PII.

In the notable case of _Yershov vs. Gannett Satellite Info. Network, Inc_, the former’s unique Android ID, and the GPS coordinates of his device were shared with Adobe whenever he viewed a video through the service provider. Using this information, Adobe was able to identify Yershov and link the videos he had viewed to his individualized profile maintained by Adobe. Courts also agreed that anonymization of PII offers insufficient protection for sensitive information that is associated with such “anonymous codes”. Conversely, in the case of _re Nickelodeon_, the disclosure risks were diluted by the observation that “To an average person, an IP address or a digital code in a cookie file would likely be of little help in trying to identify an actual person.”

The theoretical risks associated with sharing of data should be mindful of the historical success of adversarial machine learning. Additionally, membership inference would allow an attacker to glean sensitive information about the training data; specifically, whether the record attempting to be matched was used to train the model. In either case, synthetic data does not insulate privacy completely.

To summarize, vanilla synthetic data is a fresh act and statutes can either result in too strict restrictions or underestimation of disclosure risks. The two-pronged approach of learning from history and anticipation of risks can help achieve the balance between over- and under-inclusive protections.

---

Such arguments pave the way to more robust and older solutions like differential privacy.

## The legality of differentially-private synthetic datasets

The robust guarantees offered by differential privacy (DP) address data leakage concerns as well as counter adversarial machine learning^. While differential privacy-protected synthetic data is a new technique, it may conditionally prove effective for different statutes.

When considering strict regulations of HIPPA, the promise of plausible deniability introduced by DP could prove to be a more preferred approach. In the case of under-inclusive privacy scenarios like the case of Yershov, the court could have approved of the data sharing if the theoretical chances of identification were very low.

Using differential privacy in combination with synthetic data addresses many concerns that are particular to the data generation process^^. However, it is not a silver bullet to all disclosure risks as no PET can completely solve the database-privacy problem.

---

## Closing thoughts

We can list down three observations from the above discussions:

1.  Synthetic datasets are a promising PET when compared to traditional anonymization techniques like de-identification
2.  The current statutes are open to misinterpretation and do not fully consider the benefits or risks associated with synthetic datasets
3.  Synthetic data, when combined with other PET like differential privacy, may provide more robust privacy-protecting solutions.

---

Sources:

-   [Health Insurance Portability and Accountability Act of 1996 (HIPAA)](https://www.cdc.gov/phlp/publications/topic/hipaa.html#:~:text=The%20Health%20Insurance%20Portability%20and,the%20patient's%20consent%20or%20knowledge.)
-   [California Consumer Privacy Act (CCPA)](https://oag.ca.gov/privacy/ccpa)
-   [Privacy and Synthetic Datasets](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3255766)
-   ^ [The Secret Sharer: Evaluating and Testing Unintended Memorization in Neural Networks](https://arxiv.org/abs/1802.08232)
-   ^^ [Differentially Private Synthetic Data: Applied Evaluations and Enhancements](https://arxiv.org/abs/2011.05537)
