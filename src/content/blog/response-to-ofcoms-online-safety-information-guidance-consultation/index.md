---
title: "Response to Ofcom’s Online Safety Information Guidance Consultation"
slug: response-to-ofcoms-online-safety-information-guidance-consultation
date: 2024-12-16T16:49:00
updated: 2025-03-10T16:03:08
categories: [policy]
tags: [secure-enclaves]
authors: [dave-buckley]
cardText: light
location: "United Kingdom (UK)"
draft: false
legacyId: 4541
---

The United Kingdom’s Office of Communications (Ofcom) has new powers under the [Online Safety Act 2023](https://www.legislation.gov.uk/ukpga/2023/50/section/100#section-100-1) to gather information from online platforms in service of protecting users. Ofcom requested feedback on their plans for using these new powers. In response, OpenMined proposed innovative technical solutions to revolutionize how digital oversight works. Our full response is available [here](https://www.ofcom.org.uk/siteassets/resources/documents/consultations/category-1-10-weeks/consultation-ofcoms-general-policy-on-information-gathering/responses-2/openmined-foundation.pdf?v=387473). 

## The Current Challenge

Today, when regulators need to audit or inspect online platforms, they typically have two options. They can either send representatives to physically visit the platform’s offices or ask the company to build special interfaces (i.e., APIs) for the specific audit. Both approaches have significant drawbacks. On-site visits are expensive, time-consuming, and limit when and where audits can happen. Building custom APIs can take months of development time and significant resources from both the platform and regulator.

## A Better Way Forward: Modern Oversight Tools

OpenMined proposed three innovative approaches to make oversight faster, cheaper, and more effective:

### 1\. Remote Execution Infrastructure

Instead of traveling on-site, regulators could use a setup leveraging [remote data science](https://openmined.org/blog/remote-data-science-part-1-todays-privacy-challenges-in-bigdata-2/). The system would include a “high-side” server inside the company’s firewall containing real data, and a “low-side” server with mock data that regulators can use to develop and test their audit code. This approach lets regulators perfect their analysis using mock data before running it on real data, all while protecting trade secrets and user privacy.

### 2\. Secure Enclaves

For more sensitive situations, OpenMined proposes using secure enclaves – specialized computer chips that create a secure environment where neither the company nor the regulator can see each other’s private information. This enables regulators to run confidential tests without revealing their testing methodology, while companies can provide access to their systems while protecting proprietary information. Both parties can trust the results without having to trust each other completely.

### 3\. Public Proof Registry

To provide additional accountability, OpenMined suggests creating a public registry (potentially hosted by Ofcom) that would record cryptographic proofs of what version of a system was tested. This would create a reliable chain of custody from companies to regulators and verify that production systems match what was tested. It would also enable independent third parties to confirm they’re examining the correct version of a system.

## Benefits of Modern Oversight

Traditional oversight methods are struggling to keep pace with the digital age. By adopting modern technical solutions, Ofcom could create a more effective regulatory system that better serves both companies and the public while reducing costs and complexity for all parties involved.

These technical approaches could transform online safety regulation in several important ways. The new systems would make audits faster and less expensive while enabling more frequent and thorough oversight. They would protect both regulatory and company secrets while reducing the need for physical site visits. These approaches can enable Ofcom to effectively operationalise its information gathering powers, helping to deliver a robust online safety regime in the UK. 

These tools could also help fulfill the promise of the Online Safety Act by enabling meaningful oversight while respecting legitimate business concerns about intellectual property and operational disruption. The proposed approach would allow Ofcom to carry out its regulatory duties more effectively while minimizing the burden on regulated companies.

## Looking Forward

While some parts of this vision still need development, most of the necessary technology already exists and is ready for testing. The UK Government has played a leading role in developing this kind of privacy-preserving infrastructure through initiatives such as the [UK-US PETs prize challenges](https://petsprizechallenges.com/) and the [PETs cost-benefit awareness tool](https://openmined.org/blog/pets-cost-benefit-awareness-tool/). OpenMined recommends Ofcom work with the UK Government and technology providers to pilot such infrastructure for online safety use cases. 

---

_This post summarizes OpenMined’s response to Ofcom’s consultation on information gathering powers under the Online Safety Act. OpenMined is a nonprofit organization specializing in privacy-enhancing technologies with experience implementing oversight systems for major technology companies._
