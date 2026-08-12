---
title: "Enabling External Scrutiny of AI Systems with PETs"
slug: enabling-external-scrutiny-of-ai-systems-with-pets
date: 2025-02-05T17:37:00
updated: 2025-07-21T23:26:38
categories: [product, research]
tags: [ai-auditing]
authors: [openmined-team]
cardText: light
draft: false
legacyId: 6267
---

Researchers from Georgetown University’s Center for Security and Emerging Technology (CSET) have detailed how new privacy-enhancing technologies (PETs) can facilitate external scrutiny of AI systems without compromising security, privacy, or intellectual property.

Read the full paper [here](https://arxiv.org/abs/2502.05219). The paper is summarized below.  

## The Challenge of AI Scrutiny

AI systems like Facebook’s newsfeed recommendation algorithm and large language models such as ChatGPT now operate globally, affecting billions of users. This widespread impact has raised legitimate concerns about potential risks including:

-   Personalized misinformation
-   Biased decision-making algorithms
-   Novel cyberattacks against critical infrastructure

While experts across the field agree on the necessity of independent external scrutiny for consequential AI systems, practical implementation has faced significant hurdles. AI companies have been reluctant to grant access to external researchers due to concerns about:

-   Compromising user data privacy
-   System security vulnerabilities
-   Protecting valuable intellectual property

## Technical AI Governance Infrastructure

OpenMined has developed end-to-end technical infrastructure that enables privacy-preserving audits of AI systems. The core software library, [PySyft](https://openmined.org/pysyft/), works to support a fundamental workflow:

1.  A researcher remotely proposes questions to a model owner
2.  The model owner approves the researchers’ questions
3.  The researcher receives answers without learning anything else about the proprietary systems

This infrastructure leverages well-established technologies, including secure enclaves, secure multi-party computation, zero-knowledge proofs, federated learning, and differential privacy.

## Real-World Success Stories

#### Case Study 1: The Christchurch Call Initiative on Algorithmic Outcomes

Following the 2019 terrorist shootings in New Zealand, the Christchurch Call coalition launched the Initiative on Algorithmic Outcomes (CCIAO). In 2023, [OpenMined collaborated with the initiative](https://openmined.org/blog/new-research-shows-promise-for-safe-secure-private-auditing-of-social-media-algorithms/) in what became the first-ever use of an integrated privacy-preserving access tool for external research on social media platforms.

This pilot program demonstrated that external researchers could leverage private assets (video impression data) to investigate algorithmic impacts without seeing the raw data, precluding the need for extensive legal review and making the process significantly less burdensome.

#### Case Study 2: UK AI Safety Institute

More recently, [OpenMined partnered with the UK AI Safety Institute and Anthropic](https://openmined.org/blog/secure-enclaves-for-ai-evaluation/) to trial safety evaluations of frontier AI models while maintaining privacy. The setup enabled “mutual secrecy,” with the contents of a biology dataset remaining private to UK AISI while the AI model weights remained private to Anthropic.

This successful demonstration proved that government entities and AI companies can negotiate and enforce shared governance over model evaluations.

## Future Directions

OpenMined’s technical infrastructure can apply to various scrutiny paradigms, including:

-   Analyzing whether recommendation systems have partisan leans
-   Checking if chatbots produce toxic responses
-   Protecting researchers’ intellectual property in audits
-   Preventing AI companies from “teaching to the test” by training on audit prompts

Currently, we are developing features to allow researchers to keep their code private in addition to their data, further empowering sophisticated research with less oversight from model owners.

## Conclusion

External scrutiny of AI systems provides crucial transparency into AI development and should be an integral component of AI governance. With OpenMined’s privacy-preserving technical solutions now successfully deployed in real-world governance scenarios, AI companies can no longer use privacy, security, and IP as conclusive excuses for refusing access to external researchers.

These innovative approaches deserve further exploration and support from the AI governance community as we work toward more transparent and accountable AI systems.
