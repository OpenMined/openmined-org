---
title: "DSA Article 40 after EDMO: Europe Has the Right — Now It Needs the Mechanism"
slug: dsa-article-40-after-edmo-europe-has-the-right-now-it-needs-the-mechanism
titleMax: 52
date: 2025-09-01T09:00:00
updated: 2026-03-04T19:14:31
categories: [policy]
tags: [privacy-enhancing-technologies-pets, structured-transparency]
authors: [peter-ide-kostic]
cover: ./cover.jpg
coverAlt: ""
cardText: light
location: "European Union (EU)"
headerDownsize: 1
draft: false
legacyId: 8937
seo:
  description: "EDMO's guide reveals that API-based researcher access falls short of the DSA's goals. OpenMined argues. Europe should adopt compute-to-data approaches to make Article 40 deliver genuine, research-grade platform data access."
---

<!-- TODO(content): content_width_px=660 (custom content-column width — needs handling) -->

## Introduction

Europe has established a legal right to researcher access to platform data. The challenge now is making that right effective. [A recent guide](https://edmo.eu/publications/platform-datasets-challenges-insights-and-examples-for-researchers-under-article-40-of-the-digital-services-act/) from the [European Digital Media Observatory (EDMO)](https://edmo.eu/) offers essential clarity: platforms are driven by vast industrial data warehouses containing logs on content exposure, recommendation decisions, network dynamics, and enforcement actions, not merely “_posts and likes_.” The data researchers typically receive through “_research APIs_” is a superficial slice of publicly visible content. The data necessary to study systemic risks is generally not what researchers get.

## Article 40: Two Pathways, One Purpose

Article 40 of the Digital Services Act (DSA) is often treated as a single provision, but it contains two distinct access pathways:

1.  **Article 40(12) — Public data access:** Platforms must provide timely, research-grade access to data that is publicly visible on their interfaces.
2.  **Article 40(4) — Vetted researcher access:** Regulators can mandate that platforms provide access to vetted researchers investigating systemic risks and the effectiveness of mitigation strategies.

In principle, Article 40(12) enables broad monitoring and rapid research, while Article 40(4) facilitates deeper investigation when public data is insufficient. Together, they represent a comprehensive framework, but only if implemented with rigor.

## The API Illusion: Where Practice Falls Short

A recurring problem identified by EDMO is that European debate conflates “_researcher access_” with the mere existence of an API, but studying systemic risks means asking different questions from those an API can answer: What content do users actually see? How does amplification work? How do recommender systems shape attention? Which interventions change outcomes?

Answering these questions requires robust exposure data and representative sampling, stable variable definitions and thorough documentation, and reproducible, verifiable results. A narrow API is limited by quotas, missing fields, weak metadata, or frequently changing endpoints and thus cannot support this level of research. This constraint applies equally to Article 40(12) and to the deeper access envisioned under Article 40(4), where a thin API would be wholly inadequate.

## Delegated Act 2025/2050: Progress, but Not a Guarantee

Delegated Act (EU) 2025/2050 seeks to operationalize Article 40(4) by establishing structured processes and options for controlled-access environments. This is a welcome step. However, policymakers must avoid equating “_secure environments_” with meaningful access for researchers. A secure setting can still fail if it contains the wrong data, lacks documentation, restricts necessary analytical tools, or produces outputs that cannot be independently validated. Security alone does not ensure scientific adequacy.

## The Necessary Standard: State-of-the-Art Access

EDMO’s guide is clear: API access is insufficient for systemic-risk research when it fails to provide a comprehensive and reproducible view of platform behaviour. The core question is not whether platforms offer access. It is whether the access provided enables the DSA’s objectives to be met.

The practical solution is to move beyond treating access as “_data export_” or “_API endpoints._” Modern compute-to-data approaches, such as those supported by OpenMined tools, offer a better model:

-   Researchers bring their analysis code to the data, rather than extracting data to external systems.
-   Analysis is conducted close to the platform’s internal datasets.
-   Technical safeguards, like access controls, query logging, minimum cohort sizes, and output checks, are enforced automatically.
-   Results are reproducible and auditable, with versioning, changelogs, and signed execution records.

This approach serves all parties: researchers get the data they need; platforms protect trade secrets and reduce the risk of leakage; regulators gain auditable compliance records; and users benefit from stronger, verifiable oversight.

Critically, no new legislation is required. Article 40 already permits “_appropriate interfaces_,” and Regulation 2025/2050 supports controlled-access modalities. Europe needs only insist that these mechanisms meet the state of the art.

## Enforcement: The Real Bottleneck

EDMO identifies a telling pattern: researchers are rarely denied access outright. Instead, they receive it too late, with too many restrictions, or in formats that cannot support credible measurement. This “_non-compliance by friction_” persists because the consequences remain uncertain.

Enforcement is ultimately what determines whether Article 40 delivers timely, usable, research-grade access or ends up being a procedural formality of forms, portals, and insufficient APIs that never reaches the data needed to study systemic risks. If regulators accept the mere presence of an API as sufficient, platforms can appear compliant while failing the DSA’s purpose entirely.

## Recommendations

Define “_research-grade adequacy_” for systemic-risk studies. Set clear expectations covering exposure and sampling methodology, documentation standards, definition stability, and result reproducibility.

Adopt compute-to-data as the default for Articles 40(4) and 40(12) where deeper variables are required. Use secure, open-source analysis environments with governed outputs and full auditability, not thin APIs.

Require research-ready data products, not merely interfaces. Platforms should be expected to deliver the essential datasets identified by EDMO, including exposure-weighted samples and “_most-seen_” content sets.

Apply “_state of the art_” as a functional compliance test. If an access mechanism cannot support robust systemic-risk research, it should not be deemed compliant with Article 40.

Treat friction as a breach. Delayed, undocumented, or unusable access should be handled as non-compliance, not a technicality. Where API-based access is inadequate, regulators should require compute-to-data mechanisms with full auditability.

The policy decision before Europe is straightforward: continue accepting the appearance of access, or enforce mechanisms that make Article 40 work as intended. The legal framework is already in place. What is now required is the political will to insist on standards that are genuinely fit for purpose.
