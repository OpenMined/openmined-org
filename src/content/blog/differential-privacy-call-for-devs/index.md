---
title: "OpenMined is wrapping Google’s differential privacy into your app (and we need you!)"
slug: differential-privacy-call-for-devs
date: 2020-04-06T08:36:11
updated: 2024-12-09T21:00:57
categories: [community]
tags: [announcements, differential-privacy]
authors: [ben-szymkow]
draft: false
legacyId: 2388
---

__Building an easy to use wrapper around a robust cryptography library for use in mobile apps and browsers.__

COVID-19 is not the first pandemic that our planet has been forced to endure. It is however, the first pandemic where we have access to the amazing power of cloud computing, rapid coordination of health professionals on a global scale and the ability to deploy digital tools to millions almost instantly.

These digital tools are very effective at collecting important data that can arm governments, medical researchers and other agencies with the intelligence they need to provide an extremely effective response to this threat. The problem is that these tools demand the collection of sensitive data that most individuals (rightly so!) want to keep private!

Differential privacy is a great approach to reducing this risk in a provable mathematical way. However, as with all cryptography techniques, going from theory to secure implementation is fraught with challenges.

Fortunatley, last year Google has open sourced it’s DP [C++ library](https://github.com/google/differential-privacy), which we believe to be one of the most secure, battle-hardened implementations of Differential Privacy ever produced.. However, since the library is in C++, it is definitely not a trivial task for a React developer or an iOS app builder use it!

OpenMined is working on a few projects ([read more here](https://blog.openmined.org/openmineds-efforts-for-the-coronavirus-pandemic/)) to bake this library into languages that most of you are familiar with. We need some help to get these completed quickly, so come join us on [Slack](http://slack.openmined.org/) now and introduce yourself in the #covid\_dp\_lib\_wrapping channel!

-   [PyDP: Python wrapper for Google’s Differential Privacy project](https://github.com/OpenMined/PyDP)
-   [dp.js: Javascript wrapper for Google’s Differential Privacy project](https://github.com/OpenMined/dp.js)
-   [org.openmined.dp: Google’s DP project in Java family of languages (Java, Scala, Kotlin)](https://github.com/OpenMined/org.openmined.dp)
-   [SwiftDP: Swift wrapper for Google’s Differential Privacy Project](https://github.com/OpenMined/SwiftDP)

Also feel free to connect with me (Ben Szymkow) directly at my [twitter](https://twitter.com/BenjaminSzymkow) or [LinkedIn](https://www.linkedin.com/in/benjaminszymkow/) profiles!
