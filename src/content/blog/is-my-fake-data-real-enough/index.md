---
title: "Is My Fake Data Real Enough?"
slug: is-my-fake-data-real-enough
date: 2021-11-26T05:30:07
updated: 2024-12-09T19:09:11
categories: [research]
authors: [gatha-varma]
draft: false
legacyId: 1532
---

_Synthetic data and validation of its expected behavior_

The research focused on the generation of synthetic data has gained pace like never before. While privacy is the foremost benefit of such data, additional advantages include making training data available for niche use-cases, covering under-represented classes to mitigate bias, or working around a reluctant data provider. The year 2020 saw how AI models stumbled due to the paucity of data availability. The novel SARS-Cov-2 virus showed unpredictable trends, difficulty in data collection, and taboo associated with the infection. Many patients did not want to report correct symptoms or did not approve sharing of their scans for the fear of isolation and being blamed for spreading the infection. The AI models developed to combat the spread of SARS-Cov-2 struggled with the lack of enough training data, and in many instances, synthetic patient data helped.

---

The generation and use of synthetic data is surely an exciting avenue, but it should also earn the trust of data scientists. After all, the models developed by training on such data will be used to make predictions and sway decisions. Researchers have identified seven validation strategies for the utility and integrity of generated data. The assumption behind these assessments was to make individual-level data broadly available, as opposed to, for example, releasing aggregate statistics or summary tables.

-   The first strategy of validation of generated data involves getting **the opinion of a domain expert**. Testing the ability of the expert to tell apart the original data from synthetic one can be considered an important test, especially in the case of medical images. Experts can not only judge the utility of the synthetic data but could also point out the attributes that contribute to the ‘realness’ of such data. For instance, the presence of certain veins in retinal images can make a huge difference between a real and a generated image. For the case where human judgment is not feasible, standard classification measures like the F-score or the ROC-AUC can be used to compare the efficacy of real versus synthetic data.
-   The second strategy aims at **the replication of studies**. This type of assessment checks if the results achieved using synthetic data can replicate outcomes that were computed from real data. These also include how synthetic data fared in terms of time taken to reach the solution or how outlier conditions were handled. An example could be how a patient’s survival duration at a hospital emergency room could be synthesized. The outcomes of a prediction model for both types of data can be compared to check for replication accuracy.
-   Thirdly, **the structural similarity between the real and synthetic data** might appear a minor assessment strategy but could prove to be quite efficient. It would simply check for variable types and names, file formats, metadata, and basic structure among the two under comparison. The structural similarity would allow analysts to run their code on locally available synthetic data first, then on the remote real data. The returned results could be manually reviewed for disclosure risks, and therefore validation on real data can be performed at the end of the analysis. For this to work, the code must run without modification on both real as well as synthetic data.
-   Fourthly, **the comparison of statistical properties between real data and synthetic data** can assist the latter’s validation. The general statistical metrics like the distance between data points, or correlation among the attributes can be compared to check the realness of the fake data. Such statistical properties do not consider specific analyses but assess the distinguishability. One advantage of this method is that it can be automated and provide a good perspective on the usability of the generated data. Moreover, the more indistinguishable the fake data is from the real, the more real it appears.
-   The fifth kind of assessment focuses on **bias and stability evaluation**. The process of data synthesis is generally a stochastic process where a different set of values are generated in each run. To check against potential bias in the synthetic data, several fake datasets can be generated and general utility metrics could be applied to them. The variation in the metrics can then be used to evaluate the stability and bias in the synthetic data. If the variations are large or display systematic bias then the synthetic data is not reliable and far from the desired realness.
-   Sixthly, the validation strategy can **utilize the availability of publicly available datasets and reports**. Many platforms now host datasets and reports that contain the results of their analysis. The behavior of synthetic data based on a similar premise can also be compared to such publicly available computations.
-   Since privacy is the foremost advantage offered by synthetic data, its **comparison with other Privacy-Enhancing Technologies (PET)** can better evaluate its efficacy. The results achieved through the use of some of the widely used PET like anonymization, perturbation, federated analysis, and homomorphic encryption can be compared with the privacy guarantee of the generated data. Moreover, such a validation process will also inform about the data utility offered by the generation method for the desired privacy guarantees.

---

Source:

[Seven Ways to Evaluate the Utility of Synthetic Data](https://ieeexplore.ieee.org/abstract/document/9138552)
