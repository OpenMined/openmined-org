---
title: "Advancing Research on Sensitive Personal Health Data with Syft"
slug: advancing-research-on-sensitive-personal-health-data-with-syft
date: 2025-10-01T21:12:01
updated: 2025-10-02T10:58:34
categories: [product]
tags: [federated-learning, privacy-preserving-machine-learning, secure-enclaves, privacy-enhancing-technologies-pets, syftbox]
authors: [subha-ramkumar]
cardText: light
hideDefaultForm: true
headerDownsize: 1
draft: false
legacyId: 7898
seo:
  description: "Learn how Syft enables health research without centralizing personal data. Compute on encrypted data while maintaining individual privacy and control."
---

<!-- TODO(content): HubSpot form(s) auto-embedded as <FormEmbed> — verify placement -->

## Individually Owned Health Data – The Opportunity and Risk

Every day, people generate streams of health data – from heart rates on wearables to mobility patterns, sleep cycles, and even subtle shifts in language on their phones. Combined, these signals could unlock breakthroughs in detecting disease earlier, monitoring progression more accurately, and tailoring treatment to the individual. The potential is enormous, and most would agree that health research should be able to harness these signals for the common good.

But here’s the problem: this data is also among the most private information people own. Centralizing it in large repositories creates a dangerous trade-off. On the one hand, researchers need rich datasets to make discoveries. On the other, individuals are asked to surrender records of their daily lives, knowing that leaks, misuse, or re-identification are real risks. [Studies have shown](#footnote-1) that privacy concerns directly affect people’s willingness to share their health data[¹](#footnote-1). And even when datasets are anonymized, [research has demonstrated](#footnote-2) that widely used techniques like k-anonymity often fail – especially for vulnerable groups whose unique demographic or healthcare patterns make them easy to trace[²](#footnote-2). The cost of this tension is severe: critical studies stall, promising insights go undiscovered, and trust erodes between participants and the institutions that need their data.

This is where Syft offers a different path. Instead of moving raw health data into centralized silos, Syft enables computation where the data already lives – under the control of the individual. In short, Syft allows science to move forward without forcing people to give up control of their most private information. This article explores how that shift works, why it matters, and what it could mean for the future of individually owned health data.

## A Solution: Compute Without Centralizing Data

A feasible approach is to enable researchers to use health data without centralizing it. Instead of pooling raw records into large databases, the computations themselves move to where the data already lives.

Syft, a distributed network of private data being developed at OpenMined, enables exactly this. Each participant’s device acts as a secure node in the network. Researchers send computations to those nodes, the devices execute them locally (or within a trusted enclave), and only the aggregated results are returned. At no point does sensitive health data leave the individual’s control.

_This approach flips the traditional model:_

-   Raw data stays protected on participants’ devices.
-   Researchers still gain insights at scale without ever handling the underlying sensitive information.

## The Two Workflows on Syft

### 1\. Local computation on device

Lightweight analytics run directly on a participant’s phone or hub. For example, step counts can be reduced into daily mobility summaries, or typing speed data transformed into variability metrics. Only these summaries are encrypted and shared outward.

### 2\. Federated computation via secure enclave

For more complex tasks or sensitive inputs, encrypted data can be transmitted into a trusted execution environment. Computations run in isolation inside the enclave, and only derived features or results are released. With end-to-end encryption supported by the Syft protocol, raw inputs remain confidential during transit, while secure enclaves ensure they are never exposed during computation.

Together, these two paths provide flexibility: some insights can be computed entirely at the edge, while others require enclave-based processing – both with strong privacy guarantees. 

## Example Use Case: Alzheimer’s Disease Progression Monitoring

Participants with early-stage Alzheimer’s can generate data passively through their smartphones and wearables, some of which are –

-   Mobility and movement: GPS traces, step counts, gait patterns.  
    
-   Sleep data: sleep duration and interruptions from wearable devices.  
    
-   Language use: changes in text message patterns, voice notes, or speech cadence.  
    
-   Cognitive activity: reaction time in simple tasks, reminders completed, mobile app usage patterns.

This data, collected over a significant period of time, could be valuable to researchers interested in how these digital biomarkers correlate with disease progression.

### Workflow 1: On-Device Computation (An Example of Local Analysis)

Scenario: Detecting daily activity patterns that may indicate cognitive decline.

1.  The participant’s phone collects GPS, accelerometer, and step-count data.  
    
2.  A local algorithm (running in the Syft mobile app) calculates a simple feature: average daily mobility range and number of distinct locations visited.  
    
3.  Instead of sharing raw GPS coordinates or movement logs, the phone only shares the summary statistic (for example: “participant visited 3–5 unique locations per day, average radius 2.5 km”).  
    
4.  These summaries from thousands of participants are aggregated across the network.

_Why this works locally:_

-   The computation (mobility summary) is lightweight.  
    
-   Privacy is protected because exact locations and raw movement data never leave the device.

### Workflow 2: Federated Computation via Trusted Enclave

Scenario: Detecting subtle changes in language patterns that may predict disease progression.

1.  The participant’s device records speech samples or text messages (already private and sensitive).  
    
2.  Instead of processing entirely on-device, the encrypted data is sent to a Trusted Execution Environment (TEE), another node of the Syft network similar to that of the participant.  
    
3.  Inside the enclave, a more computationally intensive language model runs to analyze changes in vocabulary richness, sentence complexity, and pauses in speech- as designed by the researcher.  
    
4.  Only the derived features (for example, reduced lexical diversity score compared to baseline) are output to researchers.  
    
5.  At no point can raw text or speech be seen outside the enclave, because encryption is maintained end-to-end by the Syft network.

_Why this requires a TEE:_

-   Natural language processing on large amounts of text/audio is resource-heavy for most phones.  
    
-   Aggregating and comparing across participants may require centralized but privacy-preserving computation.  
    
-   Stronger privacy guarantees are needed because language data is highly identifying.

## Why This Matters Beyond Alzheimer’s

The same workflow applies across a range of conditions- Parkinson’s disease, cardiovascular health, depression, or even broader behavioral research can all benefit from decentralized analysis. The core idea and workflow are not disease-specific or even data-specific, Syft enables completely customised workflows which move from the idea of centralized data to that of federated data networks.

This alternative workflow allows individuals to retain control over their most sensitive signals while making those signals usable for science. It is a path to bridging the gap between privacy and progress. It could also lead to channels of attribution and remuneration down the line.

Data is no longer scarce, what is scarce is trust. Without privacy guarantees, participants will continue to hold back the most valuable information. Syft provides a workflow that allows research to progress without demanding that people surrender complete control of their data. Apart from being a technical adjustment, it is a shift in how research can be conducted responsibly in the age of individually owned data.

## Get Started

If you have a project like this, and want to better understand how Syft could help you meet your goals, request a demo. Alternatively subscribe to get updates about similar technologies and use cases.

<div class="hs-form-embed" data-form-id="2bc6e25c-b96d-426c-8e8a-dfed11d9ce83" data-portal-id="6487402" data-region="na1"></div>
