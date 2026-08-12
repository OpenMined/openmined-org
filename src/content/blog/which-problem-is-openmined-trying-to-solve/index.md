---
title: "Companies have too much access to our data, while  researchers often have too little. Which problem is OpenMined trying to solve?"
slug: which-problem-is-openmined-trying-to-solve
date: 2020-09-21T15:23:54
updated: 2025-03-10T16:19:34
categories: [research]
tags: [remote-data-science]
authors: [emma-bluemke]
draft: false
legacyId: 2058
---

We build and invent technology to improve our lives. Until recently, most technology improved our lives without needing any information about us – think of a dishwasher, for example.

This one-size-fits all approach didn’t work for everything, however — remember the excitement about the ‘big data’ revolution? We realized that ‘wisdom’ could be pulled from our data to be used to personalize or improve that technology to better our lives.

Sometimes these apps or devices need sensitive personal information: locations, health data (heartbeat, sleep, prescriptions), financial information, biometrics (finger prints, photos of our faces), data from all the sensors in our smart-devices (internet of things), and our political data (our political interests, views, history, personal connections and beliefs).  Some would even argue that _all data_ is sensitive data (see [Sensitive Says Who?,](https://hackylawyer.com/writing/f/sensitive-says-who?) and [All Your Data is Health Data](https://www.nytimes.com/2019/08/13/opinion/health-data.html), and [If I have nothing to hide, why should I care about my privacy?](https://medium.com/@FabioAEsteves/i-have-nothing-to-hide-why-should-i-care-about-my-privacy-f488281b8f1d)).

**Today, there is too much uncontrolled access to data.**

Currently, we often allow companies to access, store, sell, and use this data in exchange for their services.  In addition, we often have to provide much more information about ourselves than necessary in order to prove or verify a specific aspect about ourselves or use a certain service. This harms us in two ways.

1.  **The first** and most obvious way is that the data that is stored somewhere, out of our control, and can be hacked or stolen (see [World’s Biggest Data Breaches & Hacks](https://www.informationisbeautiful.net/visualizations/worlds-biggest-data-breaches-hacks/)) and then used against us in a variety of ways.
2.  **The second** is a way that snuck up on us: our data can be used to influence our behaviour in ways that aren’t in our best interest (as we’ve seen with the [attention economy](https://www.forbes.com/sites/cognitiveworld/2019/11/24/sick-of-the-attention-economy-its-time-to-rebel/#49ecc66035ac), [targeted political manipulation](https://www.jstor.org/stable/10.5325/jinfopoli.9.2019.0370#metadata_info_tab_contents)). This is often motivated by financial or political incentives, such as [surveillance capitalism](https://en.wikipedia.org/wiki/Surveillance_capitalism).

**On the other hand, there simultaneously hasn’t been enough access to the insights from important data.**

Do you remember the promises of the ‘big data’ revolution and all the promises of AI? Research and development for healthcare, science, economics, environmental studies, and more was going to blossom. However, while certain areas of research have certainly blossomed, some of the most important areas haven’t, often due to a lack of the necessary quality and quantity of data.

Many of the huge improvements in AI have come from the availability of large, high quality datasets available to researchers  — for example, [IBM Watson’s success on jeopardy](https://www.nytimes.com/2011/02/17/science/17jeopardy-watson.html), relied on Wikipedia’s release of a structured dataset derived from their articles.  The availability of [ImageNet](http://www.image-net.org/), a large, high-quality image dataset, led directly to rapid progress in computer vision. For good reasons, we have barriers and safeguards that prevent us from releasing a large dataset of the world’s most sensitive and valuable information. But as it turns out, sensitive data is exactly what you need to solve some pretty important problems, especially in healthcare.

**A common solution proposed for this problem is open-access, ‘anonymized’ datasets.** Although these have good intentions (e.g. to cure cancer) it still leaves us with two problems:

1.  First, there’s still lots of important data that will _never_ be able to be released in an open-access dataset. Sometimes the data is proprietary, sometimes it’s just far too personal. So this model **won’t ever solve the original problem fully**.
2.  Second, if this data is human-centric data (i.e. rather than a large dataset of plant or bacteria genomes) this could cause even _more_ problems than it solves:
3.  [We now know that datasets can be de-anonymized](https://www.fastcompany.com/90278465/sorry-your-data-can-still-be-identified-even-its-anonymized), and linked to other public datasets to identify even more information about the individual.
4.  We truly don’t yet know what sort of sensitive information can be inferred from seemingly anonymous, non-sensitive data. For example, it’s possible to predict the [age](https://www.sciencedirect.com/science/article/pii/S1053811919305026?via%3Dihub) and [sex](https://www.ncbi.nlm.nih.gov/pubmed/27421184) of a patient from some medical images. and we’ve seen that in some cases,

**How can we allow controlled access to insights from important data?**

Recently, several interesting technical developments have unlocked new possibilities for gaining insight from data without requiring privacy compromises. One technique that is being used is Federated Learning: training your machine learning model on data that is stored in different places. Instead of moving the data to the model, the model is sent to where the data is located. The data remains at its source device (for example, a cell phone, or a hospital server). This solves a lot of problems, but not all: the content of the local data can sometimes be inferred from the weight updates or [improvements in the model](https://arxiv.org/pdf/1812.00535.pdf). To prevent [extracting private data from a neural network](https://blog.openmined.org/extracting-private-data-from-a-neural-network/), further techniques can be employed, such as differential privacy or encrypted computation (i.e. homomorphic encryption, which makes it possible to perform math on data while it remains encrypted). When combined with (local) differential privacy, federated learning [provides strong privacy guarantees](https://arxiv.org/pdf/1812.00984.pdf).

OpenMined is using these privacy techniques, in combination with other cryptographic techniques, to solve the problems mentioned above:

### Problem 1: Too much uncontrolled access to data

**Privacy-Preserving Apps:** OpenMined is building an ecosystem of open-source code for end-to-end privacy-preserving apps. It is no longer necessary to centralize sensitive data being produced on edge devices such as smartphones. My data no longer needs to be stored somewhere, out of my control, vulnerable to being hacked or stolen. An app or researcher can gain the ‘wisdom’ they need from that data without ever moving the data or being able to reconstruct sensitive information from that data.

The tools for this go beyond federated learning: [private set intersection](https://blog.openmined.org/private-set-intersection/) is a powerful cryptographic technique which allows two parties (i.e., a phone and a central server) to compare data with one another without exposing their raw data to the other party. The [Private Identity project](https://github.com/OpenMined/Aries-DID) aims to empower individuals to prove aspects of their identity to others without compromising their own privacy. It allows an individual to generate proofs, called a credential, that proves a certain fact about themselves, verified by someone else.

You can think of a credential a lot like a signature. I go to my doctor to get my doctor to sign a document that confirms something about the state of my health, but a written signature can be forged and difficult to verify. A credential is a cryptographic signature which is impossible to forge and trivial to verify — we’re packaging that capability into an app.

### Problem 2: Not enough access to the insights from important data

[**PyGrid**](https://blog.openmined.org/what-is-pygrid-demo/)**, [PySyft](https://github.com/OpenMined/PySyft) and [more](https://github.com/OpenMined/OM-Welcome-Package): OpenMined is building a peer-to-peer platform for private data science and federated learning.** Data owners can provide, monitor, and manage access to their own private data clusters. The data does not leave the data owner’s server. Data scientists can then use PyGrid to perform private statistical analysis on the private dataset, or even perform federated learning across multiple institution’s datasets.

A system like this enables:

**Insights from larger training sets:** The ability to train models on datasets without copying and moving data between institutions and borders can enable greater collaboration, providing researchers with larger training datasets without aggregating that data in one institution.

**Insights from more diverse training sets:** Not only will this allow us to have more training data, it will allow us to have more accurate training data: if we can train on data from other institutions worldwide, we can [properly diversify our datasets](https://www.apa.org/monitor/2010/05/weird) to ensure our research better serves our world’s population. For example, current volunteer-base datasets can often feature a disproportionate number of young, university student subjects, which results in training data that is not representative of our patient populations.

**Insights from highly sensitive data without the risk:** These privacy techniques can enable researchers to find answers from highly sensitive information without needing to see the data or receive copies themselves.

**Convenience:** Federated learning also presents a practical alternative to moving around huge amounts of data. For example, [predictive maintenance](https://blog.openmined.org/predictive-maintenance-of-turbofan-engines-using-federated-learning/) uses sensor data to predict when a machine, such as an engine, needs maintenance. Often, the amount of data produced by dozens of sensors monitoring 24 hours a day is simply inconvenient or impossible to move to a central server to train. In addition, federated learning makes it possible to no longer need to centralize the data being produced on edge devices such as smartphones. As this becomes a common privacy practice for apps, ask yourself if you really need to move customer’s data onto a central database, or if you can take advantage of federated learning instead.  
In other words, with these tools, we can now allow _controlled_ access to the answers _f_rom _important data._ We can solve important problems while also preventing our data from being misused.

**With these tools, we can allow _controlled_ access to the answers from important data.**

---

****This article is an open call for social & political scientists, STS researchers, philosophers, and more to join our community and join the discussions around privacy technology. We welcome your skillset.**** We’d love to hear your input. If you’d like to join the conversation around this, join us on the writing team at slack.openmined.org.

If you’re new to privacy-preserving tech, you can read this explanation series we made for beginners: [****Privacy-Preserving Data Science, Explained****](https://blog.openmined.org/private-machine-learning-explained/).

**If you want to join our mission on making the world more privacy preserving:**

-   ****[OpenMined Welcome Package](https://github.com/OpenMined/OM-Welcome-Package) –**** You can see a map of all the projects we work on here!
-   **[**Get your free tickets for** OpenMined’s Privacy Conference **2020**](https://pricon.openmined.org/)**
-   ****[Join OpenMined](http://slack.openmined.org/)** [S](http://slack.openmined.org/)**[lack](http://slack.openmined.org/)****
-   **[**Check** out **OpenMined’s GitHub**](https://github.com/OpenMined)**
-   ****[Placements at OpenMined](https://placements.openmined.org/)****
