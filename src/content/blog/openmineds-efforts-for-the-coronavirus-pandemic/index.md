---
title: "OpenMined’s Efforts for the Coronavirus Pandemic: COVID Alert App, Private Set Intersection, a Differential Privacy Wrapper and Private Identity"
slug: openmineds-efforts-for-the-coronavirus-pandemic
date: 2020-04-01T15:16:46
updated: 2024-12-09T21:01:38
categories: [community]
tags: [announcements, private-set-intersection, differential-privacy]
authors: [openmined-team]
draft: false
legacyId: 2390
---

_Right now, COVID-19 apps are being built around the world to help societies mitigate the social, economic and epidemic threats they face._

_Data privacy is crucial for these apps. Not only is privacy a human right, but it is also needed for establishing trust — and therefore, compliance — in these COVID-19 apps._

_OpenMined is a community of 7,300+ engineers, researchers, writers, and developers dedicated to lowering the barrier-to-entry to private AI technologies. We are giving_ [_technical advice_](https://blog.openmined.org/covid-app-privacy-advice/)_,_ [_open-source code_](https://github.com/OpenMined)_, and [support on Slack](https://join.slack.com/t/openmined/shared_invite/zt-deu0kql0-kn~hh1CM3LdME6WORkIp6g) to help app developers worldwide protect the privacy of their user-base._

[_Read our original announcement here._](https://blog.openmined.org/providing-opensource-privacy-for-covid19/)

_Read our advice for [Maximizing Privacy and Effectiveness in COVID-19 Apps](https://blog.openmined.org/covid-app-privacy-advice/)._

---

## OpenMined’s Projects Relevant to COVID-19

### 1 – COVID Alert App

_An end-to-end, white-label and open-source COVID-19 app example._

Our COVID Alert app is a mobile application for iOS and Android that notifies a user when they’re in an area where a person infected with COVID-19 has recently been. We are open sourcing the unique privacy preserving features, as well as the sample end-to-end COVID Alert app to demonstrate their ease of integration.

Currently, COVID Alert demonstrates the popular contact tracing use case. Other apps for fighting Coronavirus show a map with the locations of infected individuals, this not only compromises their privacy but risks their safety. To combat this issue, the COVID Alert app by OpenMined uses homomorphic encryption to anonymously encrypt and compare a user’s current location to all recent locations of infected individuals. This method preserves the privacy of app users and infected individuals- ensuring that nobody truly knows the exact location of others.

The mobile app is paired with a web dashboard which both patients and public health officials can access. Patients have the ability to enter in basic information such as name, birth date, and country, as well as enter in all their recent locations. We’re working on a Google Maps integration that would utilise smartphone location data. This would create a seamless and accurate input process as location data is automatically uploaded to the app’s database.

For public health officials we’ve created an admin dashboard where they may “verify” patients. We do not consider the locations of patients in the system for contact tracing until they have been verified by an appropriate health official. By design, patients are not allowed to sign up and must have an account created for them, ensuring that officials are not burdened with verifying thousands of fake patients.

The COVID Alert app is available in 8 languages: English, Spanish, Italian, Portuguese, French, Russian, Arabic, and Mandarin Chinese.

**Github Repositories:**

-   [COVID Alert App](https://github.com/OpenMined/covid-alert)

### 2 – Private Set Intersection

_Building open-source libraries for private set intersection to run on many devices in many contexts._

Private set intersection is a powerful cryptographic technique which allows two parties to compare data with one another without exposing their raw data to the other party. In the context of COVID-19 contact tracing the two parties are:

-   **A centralised data store:** Containing locations which infected patients visited prior to their isolation.
-   ******Many individual mobile phones:** Containing location information of the individual owner of the phone.****

To determine whether an individual has visited a location previously visited by a known patient there has to be a comparison between the two data sources. Private set intersection allows the two groups to determine if there are any common locations between them. Crucially private set interactions prevents the centralised data store seeing what’s on the user’s phone and the user seeing what’s on the server. This results in a contact tracing app which does not need to publish infected patient locations publicly- where they could be exploited or abused. Furthermore, the app does not need to store all individual user locations in a centralised data store- preventing the creation of a treasure trove of personally identifying information.

OpenMined is building open-source libraries for private set intersection across every possible backend that we can imagine: we want to enable private set intersection across any type of phone (android, iOS, mobile browser) to any server type (javascript and python based backend servers).

**Github Repositories:**

-   [A Javascript library for private set intersection](https://github.com/OpenMined/psi.js)
-   [A Swift library for private set intersection](https://github.com/OpenMined/SwiftPSI)
-   [A Kotlin library for private set intersection](https://github.com/OpenMined/KotlinPSI)
-   [A Python library for private set intersection](https://github.com/OpenMined/PyPSI)

### 3 – Differential Privacy

_Building an easy to use wrapper around a robust cryptography library for use in mobile apps and browsers._

The data used for many COVID-19 related apps will be sensitive data: locations, health information, etc. We must ensure a user is not affected (e.g. not harmed) by their entry or participation in an app’s database. Differential privacy is considered to be one of the state-of-the-art concepts that can help us achieve this goal.

Differential privacy is a useful component in providing privacy for a wide range of projects, however there is currently only one (to our knowledge) differential privacy library that is open-source, deployed to millions of devices already, openly licensed, and is truly robust in its implementation: [Google’s Differential Privacy C++ library](https://github.com/google/differential-privacy). However, C++ by itself doesn’t run in any of the contexts we need to run apps — mobile phones, browsers, mobile browsers, and servers. We’re creating an ensemble of new open-source libraries that wrap Google’s C++ library to enable the best-in-class cryptography implementation that Google has produced, to be run by anyone, anywhere.

**Github Repositories:**

-   [PyDP: Python wrapper for Google’s Differential Privacy project](https://github.com/OpenMined/PyDP)
-   [dp.js: Javascript wrapper for Google’s Differential Privacy project](https://github.com/OpenMined/dp.js)
-   [org.openmined.dp: Google’s DP project in Java family of languages (Java, Scala, Kotlin)](https://github.com/OpenMined/org.openmined.dp)
-   [SwiftDP: Swift wrapper for Google’s Differential Privacy Project](https://github.com/OpenMined/SwiftDP)

### 4 – Private Identity

_Simplifying how you connect your personal data to the COVID-19 apps you want to use, without compromising your privacy._

The Private Identity project aims to empower individuals to prove aspects of their identity to others, think digital “passport”, without compromising their own privacy. A successful implementation of this project would have huge short and long term impacts in the fight against COVID-19:

-   **Short term:** Individuals can prove they are eligible for certain tests or facilities. This could remove critical bottlenecks to current efforts. With reference to project #1, the COVID Alert app, users could sign themselves up to the service without having to be approved by a health official as they would have a provable and verifiable way of demonstrating who they are.
-   ******Long term:** As society begins to open up once more this project will allow individuals to prove that they do not pose an infection risk to others. For example, if I want to be able to prove to my boss, a cafe owner, or other gatekeepers of public spaces that I am an individual at low-risk of infection to other people, there are various input data sources that I might use to prove this. This might be that I’ve tested positive for the right antibodies (i.e. have had the disease but no longer do), or have been in quarantine in my house for the required period of time. The private identity project aims to allow individuals to prove these data points without revealing further personal information. Thus, giving individuals more autonomy over their social reintegration, while simultaneously reducing the administrative burden on public services.****

The Private Identity project is split into two:

1.  **Data Integration:** This work stream focuses on making integration of data sources with the project as turn key as possible. This encourages application developers to integrate the technology with new or existing solutions. While allowing users to verify their identities on the platform (i.e. to prevent fraud) by connecting external identity-bolstering services e.g. social media accounts, bank accounts, biometric information.
2.  **Self Sovereign Identity:** This work stream will develop the technology to allow individuals to generate  proofs, called a credential, that proves a certain fact about themself, verified by someone else. You can think of a credential a lot like a signature. I go to my doctor to get my doctor to sign a document that confirms something about the state of my health, but a written signature can be forged and difficult to verify. A _credential_ is a cryptographic signature which is impossible to forge and trivial to verify — we’re packaging that capability into an app.

**Github Repositories:**

-   [Private Identity Server](https://github.com/OpenMined/private-identity-server)
-   [Miner: a collection of web scraping tools focused on making it easier for users to download their own data.](https://github.com/OpenMined/miner)
-   [Using the Hyperledger Aries to facilitate decentralised identity services](https://github.com/OpenMined/Aries-DID)

### Want to help?

If you would like to help construct or use these projects, join one of the following slack channels on [OpenMined’s Slack Team](https://join.slack.com/t/openmined/shared_invite/zt-deu0kql0-kn~hh1CM3LdME6WORkIp6g).

-   #covid\_alert – development and use of the covid alert app.
-   #covid\_dp\_lib\_wrapping – work on building DP libraries
-   #covid\_mobile\_data\_collection – empowering users to download their own data to their devices
-   #covid\_opus-private-identity-server – the private identity project
-   #covid\_pis\_sso – SSO integrations for the private identity server
-   #covid\_private\_set\_interesction – the private set intersection libraries mentioned above
-   #covid\_technical\_blog – revisions or recommendations for any of our COVID related blog posts
