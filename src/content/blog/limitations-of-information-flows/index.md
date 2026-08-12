---
title: "Limitations of Information Flows"
slug: limitations-of-information-flows
date: 2021-02-19T03:20:14
updated: 2024-12-09T19:31:34
categories: [research]
authors: [johannes-stutz]
draft: false
legacyId: 1881
---

In the [first post](https://blog.openmined.org/society-runs-on-information-flows/) of the Private AI series we covered information flows and how they are fundamental to our society and human collaboration. We also learned about how information flows are often broken today because of the privacy-transparency trade-off.

> To make the matter less abstract, you can replace “information flows” with your favorite example. Take _democracy_, _scientific research_, or _communities working together to help the environment_.

To improve information flows, we need to understand what exactly is not working today. There are three key technical problems that form the foundation for privacy and transparency issues:

1.  The Copy Problem
2.  The Bundling Problem
3.  The Recursive Enforcement Problem

---

## The Copy Problem

Suppose I have a piece of information (i.e., a document or an mp3 file). If I make a copy of this and give it to you, I lose technical control over this copy. I have to _trust_ you that you don’t use it against me, that you follow laws governing my data, that you don’t share it with somebody else.

> _The **copy problem** describes that you lose control over how someone uses your data once you share a copy._

There are laws attempting to prevent people from misusing information, like [HIPPA](https://en.wikipedia.org/wiki/Health_Insurance_Portability_and_Accountability_Act) or [GDPR](https://en.wikipedia.org/wiki/General_Data_Protection_Regulation) or [CCPA](https://en.wikipedia.org/wiki/California_Consumer_Privacy_Act). But they are really **difficult to enforce**. That’s why the copy problem is so important as a **technical issue**. Because it determines what people actually can do with a piece of information – no matter what the law says.

You might be tempted to say: uncontrolled copying of all information sounds terrible, let’s stop this! But be careful. While the copy problem might hurt you sometimes, it is also protecting some of your freedoms. While anyone who stores your information can make copies of it, _you_ can also copy anyone’s data that _you_ store. Any attempt to limit this ability could have a big impact on your life.

**Example:** Digital piracy – the sharing of copyrighted songs, movies, software – is a classic example of the copy problem. As soon as a digital copy of a file is sold to the first customer, this customer could share it with all other potential customers. There is no way for the copyright holder to control this. In reaction to this, the entertainment industry developed DRM software.

> _**DRM** stands for_ [_digital rights management_](https://en.wikipedia.org/wiki/Digital_rights_management)_. It’s a set of technologies to control the use, modification, and distribution of copyrighted works. To dive deeper, read_ [_this comprehensive article_](https://computer.howstuffworks.com/drm.htm)_._

DRM software prevents your computer from playing files you didn’t buy. It is controversial because it is a [great potential threat](https://www.oreilly.com/content/cory-doctorow-on-the-real-life-dangers-of-drm/) to privacy and agency over consumer devices. **It lets central authorities control what you can and cannot do with your personal devices.**

But on the other hand, we don’t want artworks to be shared in an uncontrolled way. Artists deserve compensation for the value they create! An ideal solution would be a very **selective enforcement** of a copy limitation. Unfortunately, this is impossible to do: computers are machines that operate by making copies. To prevent data from being copied, you need incredibly invasive software.

The copy problem causes a **privacy-transparency trade-off**. Sometimes you might want to share data, but you have to weigh the benefits of sharing against the risks of misuse. A solution would radically change many industries, offering the best that both sides have to offer.

---

## The Bundling Problem

**Example:** When a bartender checks your ID to verify your age, he does not only see your date of birth. But also your home address, your full name, where you were born et cetera. In fact, it wouldn’t even be necessary for him to see your full birth date. It does not matter whether you are 19 or 49, only whether you are over 18. But if you just carried around a card that said “Greater than 18” or “Yes”, then how would the bartender verify it’s true?

> _The **bundling problem:** It can be difficult to share a certain piece of **intended information**, without also needing to reveal **additional information** to verify the intended information._

This problem is everywhere. More **examples**:

-   A news organization reports about protests. It shows videos of individual protesters, which could later be used against them.
-   Researchers share sensitive medical data, when all they needed were the patterns within this data.

### The Problem of Surveillance

Another **example** is home security systems. If you set up a video camera outside your front door, does it only record information about intruders? Of course not! It records every person that walks by, every car, every dog. Absolutely everything, always. Your ability to watch the 0.01 percent of the footage that actually matters, comes **bundled** with the need to record also the other 99.99 percent. And we **hope** that the 99.99 percent are not misused.

With the spread of home surveillance systems, this is a growing real-world problem! Please read this article about [police requesting access to Amazon Ring video footage](https://www.eff.org/de/press/releases/new-eff-report-shows-cops-used-ring-cameras-monitor-black-lives-matter-protests) to monitor Black Lives Matter protests.

Almost all sorts of surveillance suffer from this bundling problem. Rare events justify the collection of massive amounts of information, which is not supposed to be used for anything. Most people don’t know how to build a surveillance system that **only** records the rare events that it is intended to identify. But at the end of [this course](https://courses.openmined.org/courses), you will learn how to do this.

### AI Governance

The bundling problem is also a topic in AI governance.

> _**AI governance** is about evaluating and monitoring algorithms for effectiveness, risk, bias and ROI (Return On Investment) (Source:_ [_forbes.com_](https://www.forbes.com/sites/tomtaulli/2020/10/10/ai-artificial-intelligence-governance-how-to-get-it-right/?sh=2e53ca53745f)_)_

**Example:** [Courts use AI](https://www.technologyreview.com/2019/01/21/137783/algorithms-criminal-justice-ai/) to support them in parole decisions or sentencing decisions. Machine Learning models predict how likely it is someone will violate paroles.

Often it is hard to audit these algorithms. Do they actually behave like they are advertised? Were they developed in a responsible manner? The companies that build these algorithms have two credible reasons not do disclose any details:

1.  How exactly the algorithm works might be valuable intellectual property
2.  If the details of the algorithm were public, it might be easy to fool

There should be a way for these companies to prove the fairness of their algorithm without having to disclose their intellectual property.

### Artificial Bundling Problems

There is another form of bundling problems. Sometimes information that could be unbundled isn’t unbundled, because someone in a powerful position **does not want it to be unbundled**.

**Examples:**

-   You have to provide your email address to read an article.
-   You want to use a free trial, but you have to enter your full details and credit card.
-   You want to text with your friends, but you have to agree that a service [scans all images and links](https://www.slashgear.com/facebook-messenger-is-scanning-all-the-text-and-photos-you-share-04526002/) you send.

---

## The Recursive Enforcement Problem

Couldn’t third party oversight institutions solve a lot of the issues caused by the copy problem and bundling problems? Why not make undesirable uses of data illegal? While this sounds good in theory, enforcing such rules is much harder to do in practice.

> _**Recursive enforcement:** when enforcing privacy regulations, we end up in a recursive loop. Each authority that supervises other entities must itself be supervised by an authority._

**Example:** Imagine a student who uses medical records for their research. We worry that they might misuse the data. We could use a **third party authority** – the students’ supervisor – to make sure nothing bad is happening. But how would the supervisor detect if the student misused the data? As soon as the data is on the student’s computer, they could do anything with it, for example share it. The supervisor is unlikely to find out.

The solution: the data must stay on the supervisor’s machine, not on the student’s computer. This might be a bit of an inconvenience, but now the supervisor can watch everything the student does with the data. But what about the supervisor: now **they** have the ability to misuse the data! Who controls the supervisor? The university? And so on. We call this the **recursive enforcement (or oversight) problem**.

It’s one of the most important problems we face. This is the core technical problem of **data governance**. If you have to put data onto someone’s computer, then who makes sure that that someone doesn’t misuse it?

> **Data governance** is the process of managing the availability, usability, integrity and security of the data in enterprise systems \[…\] Effective data governance ensures that data is consistent and trustworthy and doesn’t get misused. (Source: [techtarget.com](https://searchdatamanagement.techtarget.com/definition/data-governance))

The problem of authorities needing their own authorities is also known in political science. It has been tackled through systems of decentralized governance. Things like democracy, representative government, checks and balances.

This is much harder to do with data. How can multiple people have ownership over a data point, that still has to live on a single machine?

There is a new class of technologies that allows this, and we will learn about it in the next part.

---

## Conclusion

This lesson explored the three major technical problems that underlie the privacy-transparency trade-off. The copy problem, the bundling problem, and the recursive enforcement problem.

In this article and the [last one](https://blog.openmined.org/society-runs-on-information-flows/) we learned about the _problems_ of today’s information flows. In the next blog post we will begin to learn about _solutions_!

---

## References

\[1\] [The Private AI Series, Course 1: Our Privacy Opportunity](https://courses.openmined.org/courses/our-privacy-opportunity)  
\[2\] [AI (Artificial Intelligence) Governance: How To Get It Right](https://www.forbes.com/sites/tomtaulli/2020/10/10/ai-artificial-intelligence-governance-how-to-get-it-right/?sh=2e53ca53745f)  
\[3\] [What Is Data Governance and Why Does It Matter?](https://searchdatamanagement.techtarget.com/definition/data-governance)
