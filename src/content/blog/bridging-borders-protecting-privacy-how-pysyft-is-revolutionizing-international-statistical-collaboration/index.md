---
title: "Bridging Borders, Protecting Privacy: How PySyft is Revolutionizing International Statistical Collaboration"
slug: bridging-borders-protecting-privacy-how-pysyft-is-revolutionizing-international-statistical-collaboration
date: 2024-12-13T14:59:00
updated: 2025-04-18T15:00:32
categories: [product, stories]
authors: [dave-buckley]
cover: ./cover.jpg
coverAlt: ""
cardText: light
draft: false
legacyId: 6330
---

_This blog post summarizes the paper “_[_A New Model for International Privacy Preserving Data Sharing Across National Statistical Organizations_](https://www.census.gov/library/working-papers/2024/comm/mitchell-et-al.html)_” by the United States Census Bureau, Statistics Canada, Italian National Institute of Statistics, and the United Nations Statistics Division. This paper was presented at USENIX Conference on Privacy Engineering Practice and Respect 2024 – the link to the presentation is_ [_here_](https://www.usenix.org/conference/pepr24/presentation/mitchell)_._ 

National Statistical Organizations (NSOs) face a critical challenge in today’s data landscape: how to share valuable insights while protecting individual and organizational privacy. A groundbreaking collaboration between the US Census Bureau, Statistics Canada (StatCan), and the Italian National Institute of Statistics (Istat) is demonstrating how new privacy-enhancing technologies (PETs) can revolutionize this balance.

## The Challenge of Data Privacy for Statistical Agencies

NSOs like the US Census Bureau collect vast amounts of data about populations and economies. They operate under dual mandates that often conflict:

1.  Maintain the privacy of individuals and organizations
2.  Make data broadly available for research and analysis

Currently, international data exchanges between NSOs involve lengthy verification processes before any analysis can begin. These administrative burdens make cross-border data sharing cumbersome and limit the potential for international statistical collaboration.

## The UN PET Lab Initiative

The UN Privacy-Enhancing Technologies Lab (UN PET Lab) was established by the UN Committee of Experts on Big Data and Data Science for Official Statistics to explore real-world applications of privacy-enhancing technologies. This initiative created the framework for the collaboration between the three national statistical agencies.

## OpenMined’s PySyft: The Technical Foundation

At the heart of this project is [PySyft](https://openmined.org/pysyft/), an open-source technology developed by OpenMined. PySyft enables a novel approach to data sharing by:

-   Allowing external data scientists to submit code to data owners
-   Enabling data owners to review and approve code before it runs on their data
-   Facilitating privacy-preserving data science where data never leaves its original location

PySyft’s workflow creates several checkpoints for review:

1.  Data scientists develop code using mock data with the same structure as private data
2.  Data owners review the code before it’s run on actual private data
3.  Data owners review the results before they’re shared back with the data scientist

This ensures that sensitive information remains protected throughout the process.

## International Deployment

Each NSO deployed PySyft in its own environment:

-   The Census Bureau used Cloud.gov (a government-focused Cloud Foundry platform)
-   Statistics Canada leveraged the Shared Services Canada’s (SSC) Science Program to create an Azure subscription on their cloud
-   Istat set up a Microsoft Azure virtual machine in a secure environment

The UN PET Lab hosted a network gateway that connected all three systems, creating a secure network for data sharing while ensuring each agency maintained control of its data.

## Proof of Concept 

In February 2024, StatCan and Istat successfully performed a data join through this network, followed by a join between StatCan and the Census Bureau in May 2024. Using the Python Record Linkage Toolkit, the system matched census records across both datasets based on common fields like name, date of birth, and address.

The successful test demonstrated that data could be matched across international boundaries while ensuring privacy protections remained in place. The result shared with the data scientist was simply the count of matching records (813 in the US Census-StatCan join), maintaining the privacy of the underlying data.

## Future Directions

Now that a basic join has been demonstrated, the collaboration is looking to proceed and include Mexico’s NSO, the National Institute of Statistics and Geography (INEGI), to perform a join modeling North American trade data.

The initial data join described in this paper is considered a “Phase 1” of this project for the Census Bureau. Phase 2 will consist of utilizing synthetic data based on actual private data in 2025. This will allow the teams to begin working towards a more robust system architecture before attempting a join on actual private data, which is Phase 3 and the final phase of the pilot project.

## Broader Implications

This project demonstrates how PETs can transform international data collaboration. By enabling secure, privacy-preserving data analysis across borders, these technologies have the potential to:

-   Reduce administrative burdens for data sharing
-   Enhance privacy protections for sensitive data
-   Enable new insights from international data comparisons
-   Create a framework for international statistical collaboration

As noted in various reports, including the [US National Strategy to Advance Privacy-Preserving Data Sharing and Analytics](https://openmined.org/blog/pysyft-recognized-in-the-us-national-strategy-to-advance-privacy-preserving-data-sharing-and-analytics/), pilot projects like this are crucial for demonstrating not just technical feasibility but also addressing policy, legal, and sociotechnical aspects of privacy-preserving data sharing.

The success of this collaboration between OpenMined and multiple NSOs represents an important milestone in building a future where data can be more freely analyzed while maintaining robust privacy protections.
