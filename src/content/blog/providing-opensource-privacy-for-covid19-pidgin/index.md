---
title: "OpenMined dey Provide Open-Source Privacy for COVID-19 apps"
slug: providing-opensource-privacy-for-covid19-pidgin
date: 2020-03-25T12:20:40
updated: 2024-12-17T14:55:59
categories: [news]
authors: [openmined-team]
draft: false
legacyId: 2411
---

_We sincerely thank Temitope Oladokun for this translation! _[Click here for English.](https://blog.openmined.org/providing-opensource-privacy-for-covid19/)__

---

******As COVID19 dey so, developers around the world don dey create apps wey go reduce both economic and epidemic wahala wey we dey face so.******

******He dey veri important make our tech solutions wey we go build during this period make dem comply with data privacy regulations because we no wan make anoda privacy kasala to burst. He dey easy to overlook Data privacy for the process because app development na common sometin but privacy expertise no dey common at all.******

**Privacy na key to enjoy the benefit wey the applications dey do — for example, contact-tracing apps must to reach a critical amount of users if you wan make he dey truly effective. Privacy no be only human right, he also dey very crucial to maximise trust — and also make he dey compliance — in these COVID-19 applications.**

******OpenMined na community wey get 7,300+ engineers, researchers, writers and developers wey dey dedicated to lower the barrier if you wan enter private AI technologies wey dey provided through open-source code and free education.******

******If we provide our expertise, open-source code, educational materials, and organizational infrastructure, we go enable COVID-19 app developers around the world make dem maximise the effectiveness of their apps and also we go protect the privacy of their potential users.******

---

Over the past several weeks, we have observed the rapid creation of mobile and web apps alongside data infrastructure for monitoring and slowing the spread of COVID-19 around the world. The shared goal is to minimise the spread of the disease while simultaneously minimising its economic impact. Location-tracking apps have exposed major concerns that these rapid-tech solutions will permanently erode the privacy of a large number of the world’s population.

It is now apparent that measures needed to control the damage from COVID-19 will be ongoing and long-term. It is crucially important that the tech solutions rapidly built during this period comply with data privacy regulations and do not set the public up for future exploitation.

In response to this need, OpenMined is providing free code and education to help the tech community during its response to the COVID-19 pandemic.

While app development talent is plentiful, and many developers are capable of building scalable, location based analytics useful for monitoring and mitigating the spread of COVID-19, **sourcing talent for doing so in a privacy preserving way is much more difficult**.

OpenMined is **providing our expertise, open-source code, educational materials, and logistical infrastructure so we can enable COVID-19 app developers to maximise the effectiveness of their apps while also protecting the privacy of their potentially massive user-base.**

**Specifically, OpenMined is working to:**

-   **[Provide the free, open-source code](https://github.com/OpenMined)** for implementing the necessary privacy preserving techniques. To serve as many requirements as possible, the code base includes both individual components and white-label applications.
-   [**Provide education for all**](https://blog.openmined.org/covid-app-privacy-advice/) app makers and personnel responsible for vetting apps on behalf of their local jurisdiction about how these apps should and can be built in a way that protects citizen data and the private information it contains.

### These apps are urgently needed. Why care about privacy right now?  

Beyond protecting liberties and basic human rights, **there are two critical reasons why  COVID-19 app builders need to care about privacy right now:**

**The first and most important reason is that user compliance is going to be one of the main challenges to successful deployment of these apps in democracies. As an example; contact-tracing apps must reach a critical mass of users to be truly effective.** We have seen the success of these apps in other nations with different political structures, but we must keep in mind that the attitude toward government and privacy varies between nations. Guarantees about data handling, such as ‘this app does not ever upload your data to the cloud’, help to instill a greater degree of trust — and therefore, compliance — from individuals. **Privacy preserving systems are effective systems.**

Next is a more immediate challenge: if privacy is not maintained and a vast amount of personal data is put into one public location by infrastructure built in a short amount of time, this creates what security experts call a “honey pot” — a massive dataset ripe for exploitation. It is important to acknowledge that there is no such thing as perfectly secure software, particularly when it is built and deployed under a rapid deadline (such as during a pandemic). Thus, it is **far** **better to aggregate less personal data —** _**especially**_ **when we are trying to rapidly prototype apps that will be deployed to a huge number of people.**

Furthermore, as this is a **global** pandemic; hundreds of independent organizations, countries, and states will implement and approve their own version of COVID-19 apps. This is a good thing — app diversity will improve security by diversifying risk and reducing the reward for any one system that is compromised. By applying privacy preserving technologies to these apps we can preserve the benefits of data centralisation and aggregation while ensuring information security, and that individual freedoms are upheld.

### Okay, I’m developing a COVID-19 app right now. What will OpenMined provide for me?

Most of the COVID-19 apps in development use 3 types of data sources. Absolute location (GPS coordinates), relative location (who have you been around), and verifying whether people are members of a specific group — that group might be age, whether or not they’ve been tested or vaccinated, etc.

What we as OpenMined are seeking to:

-   Demonstrate the variety of areas where this data can be sourced from, and provide infrastructure for developers **to be able to get this data with the proper consent so apps can be as effective as possible by building user trust and driving compliance.**
-   **Show how developers can leverage these 3 kinds of data to develop their apps in a way that preserves the privacy of their users.** Again, this is crucial to maximise the trust and compliance in the app, which is crucial to the efficacy of these apps. Therefore, this ensures that the app is simultaneously the most effective app possible while also being the most privacy preserving app possible.

Furthermore, by providing our open-source code we help developers two-fold:

-   **Developers can now readily integrate privacy-preserving techniques into their applications — which previously would have been out of reach or time-consuming for non-experts to design.**
-   Additionally, developers have access to the source code itself of both components and full applications. **This allows them to tailor the code to meet medical, legal and security standards as demanded by their organisation, country, and state. Developers are not locked in.** By providing both individual components and complete white-label applications to teams and organisations building their own tech solutions, we can empower them to implement the necessary privacy-preserving techniques they would otherwise not be able to leverage.

**To emphasise, it is not OpenMined’s goal to build the** _**one**_ **defining app and the** _**one**_ **defining app infrastructure. It is instead our goal to lower the barrier-to-entry so that all app developers who are building around the world are empowered with the right knowledge and tools to not only build as fast as possible, but also be as effective as possible at mitigating the damages from the disease and economic impacts.**

## Great – where do I get started?

### For developers:  

-   Read our live document with technical advice, **[Maximising Privacy and Effectiveness in COVID-19 Apps.](https://blog.openmined.org/covid-app-privacy-advice/)**
-   ****If you have questions or need assistance, post in the [Covid-19 Technical Collaboration Slack Channel](https://join.slack.com/share/I010QJ4UVC6/TvEmflnmtVapKqxMU2Tczij5/enQtMTAyNDYxNjk4MTQxNC1iYjI1ZDczMGE2MmNkODIyZWQzNDliNzlmMjcwYjNkOGYyYTU2YTkyZmE0NmFlYmRjYmYwMzAwY2ZmZGE0MjU1).****

**Relevant ****Github Repositories****:**

-   **[Private Identity Server](https://github.com/OpenMined/private-identity-server)**
-   [**PyDP: Python wrapper for Google’s Differential Privacy project**](https://github.com/OpenMined/PyDP)
-   [**COVID Alert App**](https://github.com/OpenMined/covid-alert)
-   [**Using the Hyperledger Aries to facilitate decentralised identity services**](https://github.com/OpenMined/Aries-DID)
-   ******More coming soon…******

### For government officials who approve/disapprove apps:  

-   ****If you have questions about an app that you are approving or have any questions about privacy in COVID-19 apps, ask us in the [Covid-19 Technical Collaboration Channel](https://join.slack.com/share/I010QJ4UVC6/TvEmflnmtVapKqxMU2Tczij5/enQtMTAyNDYxNjk4MTQxNC1iYjI1ZDczMGE2MmNkODIyZWQzNDliNzlmMjcwYjNkOGYyYTU2YTkyZmE0NmFlYmRjYmYwMzAwY2ZmZGE0MjU1) or email [covid@openmined.org](mailto:covid@openmined.org).****

### For privacy and security experts looking to help:  

-   Our live document with technical advice, **[Maximising Privacy and Effectiveness in COVID-19 Apps.](https://blog.openmined.org/covid-app-privacy-advice/)**
-   ****If you have recommended additions/edits to this blogpost or want to help us out, post in the [Covid-19 Technical Collaboration Slack Channel](https://join.slack.com/share/I010QJ4UVC6/TvEmflnmtVapKqxMU2Tczij5/enQtMTAyNDYxNjk4MTQxNC1iYjI1ZDczMGE2MmNkODIyZWQzNDliNzlmMjcwYjNkOGYyYTU2YTkyZmE0NmFlYmRjYmYwMzAwY2ZmZGE0MjU1).****

### For donors:  

**We need to move fast.**

If time was not an element, OpenMined would already be in an excellent position to deliver these services to the general public using our extensive volunteer community. OpenMined is a community of 7,300+ engineers, researchers, marketers, and hackers dedicated to lowering the barrier-to-entry to private AI technologies through open-source code and free education. We currently have 8 development teams, 6 community teams, and 2 research teams with 100+ people meeting every week.

However, the vast majority of our engineers are volunteers working limited hours on their projects. Even among these volunteers, many are experiencing significant displacement in their own personal and professional lives (loss of job, loss of workspace, additional family burdens, etc.). Many who want to help cannot, and those that can can only do so with limited cycles.

In addition, no one knows when the current pandemic will cease. Predictions for a publicly available vaccine range from 18 to 21 months. Predictions as to when society will resume life as normal are even hazier. We believe that a fast-moving and hard-hitting development & education effort for 6 months could have a profound impact on covid data and application infrastructure around the globe.

**Our ask is the ability to upgrade our development (coding) and education (writing) communities to full and part time hours for an extended period of time (6 months).** By providing stability in the lives of our members, we can focus them on delivering the code resources and educational material (for how to use the resources) in the fastest way possible.

If you don’t have time to contribute to our codebase, but would still like to lend support, you can become a Backer on our Open Collective. All donations go toward supporting our community in our important mission to make the world more privacy preserving, which is especially important during this time of crisis!

### [Donate through OpenMined’s Open Collective Page](https://opencollective.com/openmined)
