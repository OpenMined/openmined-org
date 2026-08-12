---
title: "Announcing our partnership with Twitter to advance algorithmic transparency"
slug: announcing-our-partnership-with-twitter-to-advance-algorithmic-transparency
date: 2022-01-20T16:59:00
updated: 2024-12-19T19:33:25
categories: [news, stories]
tags: [announcements, partnerships]
authors: [andrew-trask]
cover: ./cover.jpg
coverAlt: ""
draft: false
legacyId: 1512
---

****Summary:**** As algorithms increasingly influence critical decisions in society, there is a growing call for third-party and public audits. However, concerns over privacy, security, and intellectual property often prevent algorithms from necessary external audits. In order to address that tradeoff, we’re partnering with Twitter to test how privacy enhancing technologies (PETs) drive greater accountability by enabling machine learning research without having to share or expose the underlying data or models with the researchers. In the long term, we hope that PETs can remove some of the barriers between external groups and organizations that own proprietary algorithms, enabling transparency without sacrificing privacy, security, or IP.

---

Today, society’s systems of algorithmic accountability are still sorely underdeveloped relative to the pervasiveness of their deployment. Many important algorithms remain inaccessible from audit entirely due to legitimate privacy, security, and IP concerns. For example, a revolutionary cancer classifier might be proprietary IP that can’t be released to medical researchers for testing. Or, perhaps an email SPAM detector can’t be released to the public if it would lead to malicious actors circumventing the system to send bulk emails, defeating the purpose of the algorithm. Paradoxically, a fully open, public audit may render both an algorithm and its audit to be useless. In some cases, such a public audit could even lead to meaningful harm.

Sometimes it’s not the algorithm that can’t be released, but the environment in which the algorithm operates. For example, auditing a SPAM detector isn’t of much use if the audit can’t occur in the environment it runs in, but this would require direct access to the private email inbox contents of the algorithm’s users. The same is easily said for most medical algorithms, credit scoring algorithms, and really any algorithm involving the lives of everyday people or valuable business processes. Evaluating an algorithm’s performance means accessing the data it’s using on a day-to-day basis, and that data itself can be too sensitive to reveal, even for the purposes of public accountability.

OpenMined’s thesis is that techniques for [structured transparency](https://arxiv.org/abs/2012.08347) can make it possible to answer questions using data you can’t see. Applied in this context, our thesis is that techniques for structured transparency can make it possible to audit an algorithm or replicate research findings while mitigating any privacy, security, or IP concerns. A third party can answer important questions regarding the safety, bias, and efficacy of an algorithm, without actually acquiring a copy of the algorithm or the data over which it operates.

If true, this thesis promises a significant improvement to the currently limited infrastructure for algorithmic accountability. However, we are still testing and investigating the potential for PETs to accomplish these goals. Before we can safely rely on these technologies to serve such an important role in society, they must first be piloted in realistic environments with significant investment made into R&D around the necessary software techniques.

As the next step in this direction, we are very excited to announce a [partnership with Twitter](https://blog.twitter.com/engineering/en_us/topics/insights/2022/investing-in-privacy-enhancing-tech-to-advance-transparency-in-ML). An initiative driven by Twitter’s [ML Ethics, Transparency and Accountability (META) team](https://blog.twitter.com/en_us/topics/company/2021/introducing-responsible-machine-learning-initiative), we are joining their journey to enable third-party access to non-public Twitter Data using privacy-preserving methods. We’re inspired by their recent study on [the amplification of political content on Twitter](https://blog.twitter.com/en_us/topics/company/2021/rml-politicalcontent), and find it to be a perfect example of the type of ethics research that could come from the infrastructure we are constructing. And with their help, we look forward to investigating the efficacy of our thesis that structured transparency techniques are ready to bring clarity and accountability to the use of algorithms across society.
