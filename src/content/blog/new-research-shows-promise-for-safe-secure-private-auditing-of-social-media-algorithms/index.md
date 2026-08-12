---
title: "New Research Shows Promise for Safe, Secure & Private Auditing of Social Media Algorithms"
slug: new-research-shows-promise-for-safe-secure-private-auditing-of-social-media-algorithms
date: 2024-11-01T15:28:00
updated: 2025-03-10T16:19:34
categories: [stories]
tags: [remote-data-science]
authors: [dave-buckley]
cover: ./cover.jpg
coverAlt: "OpenMined x Christchurch Call"
cardText: light
draft: false
legacyId: 4590
---

The Christchurch Call Initiative on Algorithmic Outcomes (CCIAO) released their technical report demonstrating how they used privacy-enhancing technologies to enable independent external researchers to study social media recommendation algorithms while protecting user privacy and platform security.

The researchers involved in the project were able to conduct audits of recommendation systems at LinkedIn and Dailymotion using two key technologies:

1.  [PySyft](https://github.com/OpenMined/PySyft) for remote data science, allowing researchers to analyze data without directly accessing it
2.  [OpenDP](https://github.com/opendp/opendp) for differential privacy, ensuring individual user privacy in the analysis results

Traditional attempts to study social media algorithms face major hurdles around data access. Platforms are understandably hesitant to share sensitive user data or proprietary information about their algorithms. Previous approaches to enabling research on such data have included building highly bespoke APIs, requiring researchers to travel to a secure computing facility, or making data accessible for a fixed period of time (after which all data and code is deleted) through a data clean room. These approaches have significant limitations – the types of research that can be conducted are highly constrained, researchers are required to take on significant legal liability, and studies cannot be readily replicated or reproduced.

The CCIAO project took a different approach. Rather than copying or transferring sensitive data, researchers could run approved analyses remotely while the data stayed securely on company servers. This “structured transparency” approach gave platforms confidence to allow more detailed research than typically possible, and also removed legal liability from the researchers since they were never able to directly see underlying data.

The researchers were able to conduct meaningful analyses, including:

-   How LinkedIn’s recommendation algorithms distribute job postings across different industries
-   How different Dailymotion algorithms handle potentially suggestive content
-   Comparative analysis of recommendation fairness between platforms

For example, they discovered LinkedIn’s algorithm distributes content more evenly across users compared to Dailymotion, where the top 10% of videos receive 75% of recommendations.

The success of this pilot demonstrates a promising path forward for algorithmic transparency. As governments introduce new platform regulations requiring greater transparency, like the European Union’s Digital Services Act, the privacy-preserving approach developed here could help platforms comply while protecting sensitive data.

The report’s authors suggest expanding this framework to:

-   Study more platforms and recommendation systems
-   Analyze content spread between platforms
-   Better understand real-world impacts by incorporating additional data sources

Most importantly, this work shows that meaningful external oversight of social media algorithms is possible while respecting privacy and security concerns. The report demonstrates crucial progress toward understanding how these systems shape our online experiences.

The technical report, authored by Jiahao Chen, Jack Bandy, Dave Buckley, and Ruchi Bhatia, is available [here →](https://www.christchurchcall.org/safe-secure-private-research-finds-third-parties-can-audit-online-algorithms/)
