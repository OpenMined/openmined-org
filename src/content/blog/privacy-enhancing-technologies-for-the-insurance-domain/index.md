---
title: "Privacy Enhancing Technologies for the Insurance Domain"
slug: privacy-enhancing-technologies-for-the-insurance-domain
date: 2022-03-21T21:27:00
updated: 2024-12-09T18:52:18
categories: [research]
tags: [use-cases, privacy-enhancing-technologies-pets]
authors: [hema-krishnamurthy]
draft: false
legacyId: 1466
---

Presently, the insurance and financial services sector face the classical data conundrum – there are troves of data available, yet not enough of it is usable.  The primary challenge is that data is siloed, and not being shared owing to privacy or competitive intelligence concerns and hence the data available in the ecosystem is not put to its full use.

Different regulations come into play that mandate restrictions on how data can be collected, used, or governed.  However, using privacy enhancing technologies (PETs) enable just data insights to be shared without sharing the data itself.  This can benefit all players in the ecosystem, while giving the data owners sufficient guarantees that their data isn’t being misused or shared without complex consent management.  

## Privacy Enhancing Technologies  

PETs are a broad range of technologies that enable deriving maximum value from available data, with minimal risks of privacy leakage.  There are different types of privacy enhancing technologies that cater to different use cases:

-   **Differentially Private Synthetic data** – Synthetic data is artificial data generated using algorithms that mirror the statistical properties of the original data. However, synthetic data doesn’t in itself offer privacy guarantees and hence is typically augmented with techniques like differential privacy.
-   **Secure multiparty computation (SMPC)-** Cryptographic techniques that enable secure data collaboration wherein multiple parties in the ecosystem can perform joint computations on their data without the data leaving the data owners’ perimeter.
-   **Homomorphic Encryption** – This technique allows computations to be done on encrypted data.
-   **Federated Learning-** This technique allows global machine learning models to be trained using data local to decentralized devices, without any data being shared.  Training data doesn’t leave the owner’s perimeter.  

### Where and how can PETs help in Insurance services ?

_Water, water, everywhere, Nor any drop to drink – Samuel Taylor Coleridge_

There are several applications for privacy enhancing technologies in the Insurance domain.

-   **Advanced analytics**– There are several compliance and regulatory burdens in sharing data across jurisdictions for generating valuable insights from data. This applies not just to data sharing externally, but also within different divisions in a business.  Hence majority of the analytics is performed on data available within a given jurisdiction which clearly doesn’t help in capturing the full value of available data. Techniques like _SMPC  and homomorphic encryption_ can be used to develop different analytics solutions like holistic market share view, risk exposure view etc wherein the insurance carriers and their clients all benefit from cross-party data insights\[3\].
-   ******Telematics –******  Usage based insurance models use telematics data to determine driving behavior and tailor insurance rates accordingly. However, due to regulatory concerns around privacy, limited data from telematics devices is utilized in designing custom rates for drivers. _Synthetic data_ can be used in these cases to develop more accurate premium rating/risk classification models to quantify risks in usage-based insurance \[1\].  
-   ******Increased volume of training data –****** _Synthetic data with differential privacy_ added, can be used to provide large scale data sets for model training/applications testing when data compliance measures prevent the sharing of original carrier/client data across different groups. Addition of differential privacy with the right parameter values (as appropriate to the use case to balance privacy vs utility), can provide high privacy guarantees for the synthetic data and lower the probability of re-identification attacks\[4\].

-   **Better ESG outcomes** – Responsible data handling is a key tenet of sustainable businesses. but failure to invest in the evolving PETs may negatively impact the ESG ratings of businesses. In the ESG Context, PETs tend to have an impact in all the three pillars:
    -   **Environmental (E)** – PETs enable data collaboration without the need for making copies of data thereby reducing storage and energy requirements.
    -   **Social (S)** – PETs give stronger privacy guarantees thereby aiding corporate responsibility towards sensitive data handling.
    -   **Governance (G)** – Failure to comply with data privacy regulations results in high fines and reputational damage. Businesses not investing in evolving PETs as part of ESG initiatives tend to take on higher risk.

-   ******Fraud detection-****** Cross collaboration between carriers can help with more accurate fraud detection models. _Federated learning_ can be used to train global fraud detection models on different carrier data locally.  Techniques like _SMPC_ can be used to perform joint computations on cross-carrier data to classify incoming claims as legitimate or fraudulent \[2\].
-   ******Private Data marketplace –****** PETs can be used to gather industry-specific information across carriers to establish benchmarks, perform better risk management and provide custom market-specific views,  without compromising user privacy.
-   **Property and Casualty** – Improved pricing with _synthetic_ geolocation data, more claims data\[4\].
-   ******Cost and bias reduction** –**** _Synthetic_ data is cheap to produce. With real world data, gathering and labeling datasets is often prohibitively expensive​. Synthetic data is automatically labeled and can deliberately include important corner cases. Also,  if a particular group is underrepresented in a sample dataset, _synthetic_ data can be used to fill in those gap​s.  
-   **Simplified test engineering** – Start with a small subset of production data and generate a privacy inherent replacement that can be shared without compliance concerns.

## Conclusion

As data innovation evolves, businesses in the Insurance industry need to keep up with the trends and invest in privacy enhancing technologies that help in increased data collaboration, while reducing the amount of data collected and retained. Industry wide investment in PETs to enable secure data collaboration can make more data available than what is today to help gather improved insights from data that was not previously possible, while providing  better ESG outcomes and without exposing any sensitive business information.

## References:

\[1\] [Banghee So](https://arxiv.org/search/stat?searchtype=author&query=So%2C+B), [Jean-Philippe Boucher](https://arxiv.org/search/stat?searchtype=author&query=Boucher%2C+J), [Emiliano A. Valdez](https://arxiv.org/search/stat?searchtype=author&query=Valdez%2C+E+A), (2021). Synthetic Dataset Generation of Driver Telematics.

\[2\] [https://claimshare.intellecteu.com/](https://claimshare.intellecteu.com/)

\[3\][https://lds.epfl.ch/privacy-preserving-insights-for-insurance/](https://lds.epfl.ch/privacy-preserving-insights-for-insurance/)

\[4\] https://mostly.ai/industries/synthetic-data-for-insurance/
