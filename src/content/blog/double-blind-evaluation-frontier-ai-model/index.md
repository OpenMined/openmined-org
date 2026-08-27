---
title: "PySyft used for first double-blind evaluation of a proprietary, frontier-class AI model"
slug: double-blind-evaluation-frontier-ai-model
date: 2026-08-27
categories: [news, research]
tags: [pysyft, ai-safety, secure-enclaves, ai-auditing]
authors: [openmined-team]
cover: ./cover.jpg
coverAlt: "Graphic depicting a concept of a proprietary, frontier class AI model"
cardText: light
# 52px is the largest cap that renders the desired 3-line break with no
# hyphenated word split (56 splits "double-blind", 48 splits "frontier-class";
# measured at 1440w). Mobile floor + fluid rate stay automatic.
titleMax: 52
sectionSpacing: spacious
related:
  - secure-enclaves-for-ai-evaluation
  - hugging-face-leave-commercial-apis-to-read-breach-logs
# Embargoed until the coordinated launch with GDM/AVERI — the URL must be live
# for GDM's blog to link, but nothing may point at it before the announcement.
# Publish by deleting this flag (see content.config.ts → unlisted).
unlisted: true
seo:
  description: "After nearly a decade of R&D, PySyft has been used by GDM, AVERI, Singapore AISI, and MLCommons to facilitate the world’s first double-blind evaluations of a proprietary, frontier class AI model."
---

<!-- TODO(content): "Details of the pilots" cites four external pieces (GDM's
     blogpost, AVERI's, MLCommons', the technical report) with NO links in the
     source doc — they need URLs before the post is un-hidden. -->

## Executive Summary

After nearly a decade of research and development including contributions from over [400 contributors](https://github.com/OpenMined/PySyft/graphs/contributors?all=1) from around the world, we are pleased to announce that [PySyft](https://github.com/OpenMined/PySyft) has been used by Google DeepMind, AVERI, Singapore AISI, and MLCommons to facilitate the **world's first double-blind evaluations of a proprietary, frontier class AI model**.

PySyft was used by AVERI and then Singapore AISI to evaluate Gemini 2.5 Flash-Lite using unreleased prompts from MLCommons and Singapore AISI respectively. PySyft was used to facilitate these "double-blind" evaluations by orchestrating the submission, approval, and execution of confidential code and assets from each party in GPU enclaves on Google Cloud Platform. And because of PySyft's orchestration of the enclave guarantees, neither AVERI nor Singapore AISI were able to see the Gemini model, and Google DeepMind was unable to see AVERI and Singapore AISI's prompts and responses.

In this blog post, we discuss the confidentiality-transparency tradeoffs that have long constrained external oversight of AI systems, how PySyft can move this pareto frontier, and what this pilot achieved.

## The need for "double-blind" evaluations

For as long as external evaluators have been testing proprietary AI systems, both evaluators and AI companies have faced a confidentiality problem: they each have assets they have legitimate reasons to protect. But in order to perform an evaluation, one side must choose to be the one who takes on the risk: either the AI company sends their model to an evaluator for testing (risking IP), or the evaluator sends their prompts and evaluation methodology to the AI company (perhaps via API) and risks disclosing "the test" to the "tested".

Consequently, every AI evaluation up until this point has involved one side taking on this risk, a problem severe enough to lead some to question the veracity of benchmark results. This uncertainty about evaluation veracity doesn't just impact the confidentiality of two parties in an evaluation, it undermines global confidence in the AI evaluation ecosystem as a whole. Thus, solving this confidentiality problem has been an important, long-standing challenge to the field.

## The promise of structured transparency

For several decades, privacy-enhancing technologies (PETs) like homomorphic encryption, secure multi-party computation, and differential privacy have promised the idea of multiple organizations collaborating using data they do not share. And in 2020, the framework of [structured transparency](https://arxiv.org/pdf/2012.08347) (ST) offered a way for these PET puzzle pieces to fit together to enable such multi-organizational collaboration. However, while the ingredients have become mature, their assembly into practical infrastructure has been elusive.

## The road to structured transparency in practice

Since its founding in 2017, OpenMined has been developing (and re-developing) PySyft to bridge the gap between the promise of PETs and the reality of cross organization data collaborations, focusing especially on the external oversight of AI systems. During this time, we've worked on practical problems which have largely been overlooked by the academic privacy technology literature, but which are material to the day-to-day operations of organizations considering deploying structured transparency technology in practice, such as:

- how can ST be accomplished without opening novel holes in a firewall?
- how can ST be accomplished while using transport layers organizations already trust?
- what happens when different organizations have conflicting trust requirements but need to use shared infrastructure?
- what happens when multiple organizations update ST software versions at different times but still want to work with one another?
- how does one handle secure serialization of custom, private assets across organizations?
- how can one organization write software which will run against the private objects and assets of another organization… when those private assets can't be disclosed?

We have discovered these and other questions through real-world pilots and partnerships with [Twitter](/blog/announcing-our-partnership-with-twitter-to-advance-algorithmic-transparency/), [Microsoft](/blog/openmined-partners-with-microsoft-to-advance-privacy-preserving-ai-research-for-the-christchurch-call/), [Meta](/blog/facebook-partners-with-openmined-to-advance-privacy-preserving-ai/), [Reddit](/blog/announcing-our-partnership-with-reddit-to-expand-privacy-preserving-researcher-access/), [Anthropic](/blog/secure-enclaves-for-ai-evaluation/), [DeepMind](/blog/openmined-deepmined-announced-as-a-winner-in-the-uk-us-pets-prize-challenge/), [Google](/blog/announcing-pipelinedp-an-api-for-applying-differential-privacy-in-production/), the [US Census Bureau](/blog/bridging-borders-protecting-privacy-how-pysyft-is-revolutionizing-international-statistical-collaboration/), and in research published with the [United Nations](/blog/syft-featured-in-guide-on-pets-in-official-statistics/), [the Royal Society](/blog/from-privacy-to-partnership-the-royal-society-makes-the-case-for-pets-powered-collaboration/), the [UK's Department for Science Information and Technology](/blog/pysyft-featured-in-uk-dsit-portfolio-of-ai-assurance-techniques/), and [the Whitehouse](/blog/pysyft-recognized-in-the-us-national-strategy-to-advance-privacy-preserving-data-sharing-and-analytics/). And building across nearly a decade of work, and with contributions from over 400 contributors, we've reached a point where two organizations can double-blind evaluate an LLM using PySyft.

Following this research, in 2024, [PySyft was used by Anthropic and UK AISI](/blog/secure-enclaves-for-ai-evaluation/) to test a double blind evaluation across their respective infrastructures using public assets (GPT-2 and a subset of CAMEL bio dataset). While this provided useful feedback on the remaining security, UX, and other features needed to protect real assets in this novel way, it did not accomplish the central milestone of double-blind evaluations: two organizations actually leveraging enclaves to provide mutual confidentiality protections for their actual confidential assets.

## Details of the pilots

Full details of these pilots can be found in Google DeepMind's blogpost, in AVERI's blogpost, in ML Common's blogpost, and in the technical report co-authored by all of the above.

## Acknowledgements

We are deeply appreciative of the teams at Google, whose security, legal, and engineering staff engaged seriously with novel infrastructure, and of AVERI and Singapore AISI, whose scrutiny and support have made the system stronger. The evaluation drew on reserved, non-public prompt sets from MLCommons and Singapore AISI, whose willingness to entrust its benchmark material to this novel protection made the double-blind design meaningful. OpenMined is grateful for the support of Coefficient Giving, whose multi-year commitment to secure evaluation infrastructure has carried this work from early prototypes to the deployment described here, and to Georgetown's Center for Security and Emerging Technology, the Christchurch Call, Prime Minister Jacinda Ardern, Google, Microsoft, Twitter/X, and Meta/PyTorch for their early funding and support of PySyft and its development.

OpenMined is a 501(c)(3) nonprofit, and work like this is sustained by the generosity of our community alongside institutional grants. If you believe secure, independent evaluation of proprietary AI should exist as public infrastructure, [please consider supporting it directly](/get-involved/).
