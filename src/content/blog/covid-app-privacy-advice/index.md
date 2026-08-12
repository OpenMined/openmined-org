---
title: "Maximizing Privacy and Effectiveness in COVID-19 Apps"
slug: covid-app-privacy-advice
date: 2020-03-24T23:58:42
updated: 2025-03-10T16:14:19
categories: [research]
tags: [privacy-enhancing-technologies-pets]
authors: [openmined-team]
draft: false
legacyId: 2415
---

__Right now, COVID-19 apps are being built around the world to help societies mitigate the social, economic and epidemic threats they face.__

__Data privacy is crucial for these apps. Not only is privacy a human right, but it is also needed for establishing trust — and therefore, compliance — in these COVID-19 apps.__

[__Read our original announcement here.__](https://blog.openmined.org/providing-opensource-privacy-for-covid19/)

_****UPDATE:**** Our community is working on four main open-source projects relating to pandemic-tech: a white label COVID Alert App, private set intersection, a differential privacy wrapper, and private identity. [****Read more about these here.****](https://blog.openmined.org/openmineds-efforts-for-the-coronavirus-pandemic/)_

---

**NOTICE:** This is a live document which is being continually updated. We have decided to publish it in an earlier state because of the rapid pace of COVID-19 development. If you have recommended edits to this blogpost, ping the #covid\_technical\_blogpost on [OpenMined’s Slack](https://join.slack.com/t/openmined/shared_invite/zt-deu0kql0-kn~hh1CM3LdME6WORkIp6g).

_Disclaimer: this series is meant to be a helpful high-level guide towards the construction of your app. It was rapidly written to assist with the COVID-19 response by a team of experts, and it is edited by open submission. Please ensure that you bring dedicated experts onto your team to help you implement important privacy and security measures properly. For introduction to such experts, join slack.openmined.org and request an introduction in the #general-discussion channel._

---

**TLDR:** if you are building/auditing a COVID-19 app without the following four phrases:

-   On-device data storage and computation
-   Differential Privacy
-   Encrypted Computation (homomorphic encryption, private set intersection, …)
-   Privacy-preserving identity verification

… this article is for you. It contains information which could save lives and better preserve basic human rights during this time of crisis.

---

**Summary:** There are 5 use-cases that **citizens want**:

-   ******Planning Trips:****** they want an app to tell them places to avoid
-   ******Proximity Alert:****** they want to know if they’re moving into a COVID-19 hotspot
-   ******Exposure Alert:****** they want to know if they may have been exposed so that they can self-isolate, take preventative measures (wash, sleep, vitamins, hydration), monitor symptoms, and seek treatment in a timely manner.
-   ******Symptom Analysis:****** they want to enter their symptoms and timeline into a service (or speak with an expert) to know whether they likely have COVID-19.
-   ******Proof of Health:****** as society comes back online, they will seek to prove that they do not have COVID-19 in order to be early users of common areas.

There are 5 use-cases that **government health services want:**

-   ******Fast Contact Tracing:****** rapid identification of those exposed to COVID-positive people.
-   ******High-Precision Self-Isolation Request:****** the ability to message percentages of specific groups to request isolation (such as “80% of people over 60 who aren’t nurses or doctors”)
-   [**High-Precision Self-Isolation Estimation:**](https://www.wired.com/story/value-ethics-using-phone-data-monitor-covid-19/) the ability to accurately estimate the percentage of specific groups are self-isolating (such as ‘What percent of those >60 are self isolating?”)
-   ******High-Precision Symptomatic Citizen Estimation:****** what groups of the population are starting to have COVID-19 symptoms, early warning system for new outbreaks.
-   ******Proof of Health:****** as the epidemic winds down, we want to allow parts of society to ramp up earlier by empowering citizens with the ability to verify they are low-risk of COVID-19 exposure (and thus ready to re-enter public spaces).

The primary focus of these use-cases is to empower society with the ability to have the **best possible tradeoff between economic and epidemic threats** to society. However, we believe that these use cases are also possible without eroding the privacy of citizens in the process. In this article, we will endeavor to describe exactly how this is possible in hopes that app builders around the world will be able to maximize for both app effectiveness and citizen privacy.

---

Over the past several weeks, we have observed the rapid creation of mobile and web apps for monitoring and slowing the spread of COVID-19. The common objective is to minimize the spread of the disease while also minimizing its economic impact. This dual-objective reflects the harsh reality that both biological and economic threats threaten the lives of many. An additional concern is that our technological responses will temporarily or permanently reduce the privacy of a large number of the world’s population.

In this document, we provide a survey of use-cases being proposed for COVID-19 apps, the techniques being used, and make recommendations for how app effectiveness can be maximized while also providing maximal levels of privacy. We also provide links to working code implementations which we hope will be useful to you in the construction of your app. If you are not building an app, but are instead validating someone else’s app, please read on as well. This document is for you.

## Part 1: Use Cases  

There are two primary groups of use-cases people are seeking to fulfill, although apps sometimes seek to address multiple use-cases simultaneously. These two groups of use-cases reflect the dominant desires of the two primary entities: the individual seeking to avoid coronavirus themselves, and the government seeking to minimize the mortal and economic impacts of coronavirus on their population. Individuals are concerned with 5 use cases:

-   ******Planning Trips:****** they want an app to tell them places to avoid
-   ******Proximity Alert:****** they want to know if they’re moving into a COVID-19 hotspot
-   ******Exposure Alert:****** they want to know if they may have been exposed so that they can self-isolate, take preventative measures (wash, sleep, vitamins, hydration), monitor symptoms, and seek treatment in a timely manner.
-   ******Symptom Analysis:****** they want to enter their symptoms and timeline into a service (or speak with an expert) to know whether they likely have COVID-19.
-   ******Proof of Health:****** as society comes back online, they will need to prove that they do not have COVID-19 in order to be early users of public spaces.

Government officials are tasked with a duty which is similar to the interests of individuals but is instead viewed in aggregate. It is a government’s job to protect society. While we do not necessarily know all goals of governments, and they seem to vary depending on the country, common government interests (as reported by the media) include:

1.  **Preventing the disease** from entering their geographic region.
2.  **Eliminating the disease** from their geographic region when it enters.
3.  **Protecting Healthcare:** If the disease cannot be contained, ensuring that the speed of its spread does not overwhelm a hospital system
4.  **Protecting the Vulnerable:** If the disease cannot be contained, ensuring that the spread does not affect those most vulnerable (in the case of COVID-19, the elderly and those with prior health conditions)
5.  **Distribute resources** (basic provisions as well as medical resources such as masks and ventilators) properly amongst society.
6.  **Prevent Second Breakouts:** If the disease cannot be contained, ensuring that second breakouts do not occur later.
7.  **Minimize negative economic impact**
8.  **Minimize panic.**

If we take these desires at face value, this leads us to believe that the following app-based use cases are useful to governments in their efforts to protect society from harm:

-   **Fast Contact Tracing:** when a citizen is exposed, they want to quickly inform individuals who have been near the person to self-isolate to minimize the spread of the disease. Many countries are doing this manually by having a health representative ask a patient where they remember going. This is slow, manual, and error-prone given that the patient needs to remember everyone they may have had contact with for a 2 week period (many of whom include strangers).

-   **High-Precision Self-Isolation Requests:** without something similar to an app, governments must resort to very coarse-grained ways of encouraging self-isolation (media campaigns, closing venues, closing borders, etc.). Thus, one app use-case offers the ability for a government to request self-isolation at a more precise level.
    
    You may be wondering, “why not ask everyone to self-isolate”? This is because 100% self-isolation would lead to a myriad of problems, the most obvious of which is that 100% self-isolation would stop the massive supply-chain that provides food, water, power, and medical supplies to an entire nation of people. This is not to mention that it could trigger economic upheaval which can cause harm (including loss-of-life) in a variety of ways.
    
    So, if you’re a government you want the ability to recommend self-isolation to specific groups of people. Here’s a reasonable list of groups a government would like to specifically request to self-isolate, in rough order of preference (higher in the list means higher preference):
    
    -   People who have been exposed to COVID-19
    -   People who are over a certain age or have existing medical conditions
    -   _… more things here …_
    -   Greater than X% of the population, where X is adjustable depending on the severity of the spread of the disease
    -   People who are over a certain age or have existing medical conditions
    
    The list above is roughly ordered because if the top item on the list (people who have been exposed) was possible to do with 100% accuracy, then a government would have no need to recommend self-isolation to groups lower on the list. However, if attempts at groups higher on the list are not successful, then a government wants to be able to request self-isolation to groups which are lower on the list in an effort to minimize both the spread of the disease and the economic impact.
    
    Without an app (or some other means of messaging millions of people based on certain attributes), a government instead has to rely on proxies. For example, if you want younger folk to self-quarantine, you close schools. If you want non-young people to self-quarantine a bit more, you close bars. However, these are very coarse grained, meaning that it’s hard to pick specific groups to self-isolate using these techniques. For example, closing schools doesn’t just cause kids to self-isolate, but also their parents who now have to stay at home and watch them!
    
    Furthermore, encouraging self-isolation in this way is an “all or nothing” game for each category. What if simply asking 60% of kids in schools to stay home (such as kids with a stay-at-home parent) would sufficiently slow the spread to a halt? This option is not available by simply “closing schools”. However, an app which allows a government to message specific groups of people could allow for short-notice, high-precision updates to self-isolation requests: allowing a government to find the best possible tradeoff between economic and epidemic based threats to society.
    

-   **High-Precision Self-Isolation Estimation:** Related to the previous use case, it is also important for government health services to be able to estimate the degree to which groups of society are choosing to self-isolate. Note, I’m NOT referring to an app by which a government could know whether individual people are self-isolating. I’m referring to an app which allows a government to estimate the percentage of certain groups which are self isolating (such as those over a certain age, within a certain region, or of a certain profession).
    
-   **High-Precision Symptomatic Citizen Estimation:** similar to the high-precision self-isolation estimation use case, this use case involves a government health service seeking to observe what percentage of the population is symptomatic. As with the previous use cases, this information is most useful when measured at the group level (such as people in a geographic area, of a certain age, of a certain profession, or of a certain age). The goal is to have further information on how the disease may be spreading beyond the scale of what existing test results indicate. Additionally, the “number of people not isolating but symptomatic” is a particularly useful statistic.
    
-   **Proof of Health:** at some point a government wants to start re-opening institutions in order to protect the economy. However, a major concern is that a second wave of the disease could be re-ignited. One option is an application which will allow those least likely to be carrying the disease to be most able to participate in public spaces which involve physical contact (gyms, dance-halls, massage parlours, etc.). Thus, a smartphone application which employees of such institutions could use to verify the health-risk of patrons entering their premises (and thus prevent/delay/limit their entrance) could allow society to restart sooner. This, as with the other efforts, can help society find the best tradeoff between economic and epidemic threats to society.
    

## Part 2: A Fully Featured App  

Given these use-cases, let’s consider what a fully featured app would do such that it can meet all of these use-cases. All of the use cases above are actually derivatives of 3 sources of data:

-   ******Historical and Current Absolute Location:****** where are you, where have you been, and have you (are you) quarantining?
-   **Historical and Current Relative Location:** with whom have you been in close physical proximity in the last 2 weeks. This can sometimes be inferred from your absolute location, but the difference between 50 feet and 5 feet matters in terms of probability of exposure, and so this deserves a category of its own.
-   ******Verified Group Identity:****** What groups are you a member of, where “groups” refers to any possible filter a government service professional might want to understand (age, profession, pre-existing health conditions, COVID-19 positive/negative, self-isolating or not, symptomatic or not, etc.)

All 10 use cases above are derived from insights found in these three data types. The hardest part of doing a proper COVID-19 app is not the application itself, it is the rapid acquisition and verification of these input data-points for a large enough percentage of the population to be useful. Thus, each use case is accomplished in 3 steps:

1.  Acquire data from a myriad of sources
2.  Compute aggregate statistics needed for X use case
3.  Setup messaging architecture to communicate results to target audience

In some cases the target audience is a government health representative, and in others the target audience is an individual seeking to avoid exposure to COVID-19. However, all use cases seem to follow these three basic steps.

The hardest part is step (1), and the hardest part to do **in a way that preserves privacy** is step (2). But before we get to that, we need to consider the full vocabulary of possible data sources.

## Part 3: Acquiring Data  

NOTE: I’m going to get to **how to do this in a privacy preserving way** in a later section. But before we can do that, we need to understand what kind of data we may want to work with and where that data currently lives. Please don’t make judgements related to privacy until you’ve gotten to the later part of the article.

As mentioned above, there are 3 kinds of data we need to source. In this document, we will outline high level strategies for outlining datasets. However, moving forward we will be **crowdsourcing ideas and open-source implementations** for these moving forward. To begin, the first and most obviously important dataset is:

### Current and Historical Absolute Location Data  

In short, a number of the use cases above specifically require GPS-style location data about individuals inputs. There are generally two approaches to acquiring this data:

1.  Build a smartphone app which records location via:
    
    **a. Background GPS Logging**
    
    This is perhaps the area where most projects are focusing the majority of their time. It has several headwinds. First, iOS no longer allows you to track GPS location offline. We haven’t heard of anyone figuring out a way (technically or by getting a formal exception) of doing this. Secondly, this approach has a “zero start” problem where it’s only useful for historical location analytics after millions of people have downloaded your app and had it for several weeks.  
    For this reason, simply building an app which has GPS tracking turned on is insufficient. It is probably, however, an important part of a wider collection of location based input sources.
    
    -   Pros:
        -   works anywhere in the world
        -   accurate up to a few feet
    -   Cons:
        -   can’t run it in the background on iOS devices
        -   people don’t always have their phones
        -   GPS can lose accuracy indoors, underground (subways), or in valleys
        -   doesn’t imply whether one is in a confined space or not (sharing air)
    
    **b. Wifi Router Logging:**
    
    There are databases which can map from a wifi router’s identity to a specific location. Thus, measuring the current and historical wifi router history of an Android or iOS device can be a good way to estimate location within urban areas.
    
    -   Pros:
        
        -   This is probably MOST useful for verifying that someone has been self-isolating (staying at home) by virtue of the fact that their phone has stayed connected to their home wifi router.
        -   Works well in big cities (where the people are, and where GPS can struggle)
        -   Is already integrated into most smartphones via hybrid positioning system, but if GPS cannot run in the background of your app you might try to roll your own Wifi Router Logging service.
        -   Might be available as historical data (Android, iOS), at least for Wifi routers which the phone connected to. This is a net win over GPS which doesn’t automatically get recorded for use by arbitrary apps.
        -   Might work on trains and subways which support local routers. It depends on the train’s setup (is it one router for the whole train or one per carriage, for example). But if you wanted to detect if two people were on the same train, this isn’t a bad approach.
    -   Cons:
        
        -   Doesn’t work as well in rural areas without wifi routers.
        -   Unlikely that historical data is reliable. This is most useful after people have had the app for some time.
        -   If you are recording GPS in the background on Android, don’t bother with this because teams of people have already worked really hard to embed this within existing GPS systems.
        -   Self / Witness Testimony: it is also conceivable that one could build an app which allows one person to testify where they have been and to allow others to both “verify” where they have been and “fill in the gaps” of any missing spaces (places where other people remember you being but maybe not yourself).
        
        It may not be immediately clear how useful this is, but with some of the identity verification related technologies mentioned below, this might actually be a reasonable part of a robust identity system. This system looks even more appealing when one considers how manual current contact tracing efforts are. Instead of simply an interview where one person lists where they have been over the last two weeks, an app could assist them to be more accurate and speedy in their recollections. For example, integrating with one’s recent payment history or google maps history could help someone see their own digital footprint and remember where they’ve been.
        
        Perhaps the most compelling aspect of this use case is that it 100% fits in with what seems to be existing protocols for contact tracing, helping existing contact tracing efforts be faster / more effective without trying to replace them entirely (which from a product management is hard to do without a contact tracer helping you build the app… and most contact tracers are quite busy right now).
        

2.  Download location data from one of a user’s existing services  
    While the previous section required custom app development to record a user’s location looking forward, these groups of data sources can also look at a user’s location going backward from when they download the app. Thus, these sources provide a more immediate value proposition to users of the app.
    
    -   **Google Maps History:** If you have the Google Maps app, it records your history of movements in your profile. Individuals have the ability to download their own personal profiles hosted on Google via a service called Takeout ([https://google.com/takeout/](https://google.com/takeout/)). The following [script](https://pastebin.com/QUyTe0Pw), can parse the takeout file to get at the user maps history contained within (Thank you Kevin!).
    -   **Personal Cell Tower Usage:** it appears that individuals can get their own cell tower data from providers such as AT&T.
    -   **Purchase History:** many forms of purchase history can be tied to specific purchase locations.
        -   Raw Data:
            
            -   Pictures of receipts
            -   Credit Card Data
            -   Smart Wallet History:
                -   [https://pay.amazon.co.uk/help/201754710](https://pay.amazon.co.uk/help/201754710)
                -   [https://support.apple.com/en-us/HT209489](https://support.apple.com/en-us/HT209489)
        -   Business Location
            
        -   Gas Consumption (implies level of quarantine compliance)  
            Spending types (implies level of quarantine compliance)
            
    -   **Single Location Data:** some forms of data aren’t directly about predicting someone’s arbitrary location, but they can verify one’s presence in specific locations, such as a home or work.
        -   Amazon Alexa
            -   Review Voice Recordings to Prove You Were AT Home: [https://www.amazon.co.uk/gp/help/customer/display.html?nodeId=GHXNJNLTRWCTBBGW](https://www.amazon.co.uk/gp/help/customer/display.html?nodeId=GHXNJNLTRWCTBBGW)
    -   **Car Travel History:** some cars also record location
        -   [https://www.carlock.co/gps-car-tracker/route-history/](https://www.carlock.co/gps-car-tracker/route-history/)
        -   [https://www.wired.com/2012/03/onstart-lets-you-track-your-spouse-for-0-12-a-day/](https://www.wired.com/2012/03/onstart-lets-you-track-your-spouse-for-0-12-a-day/)

### Historical and Present **Relative** **Location** Data  

Perhaps the most important use-cases for COVID-19 apps leverage proximity data. This data is less concerned with people’s absolute location and more concerned with whether individuals are in close proximity to each other (and for how long).

This data is particularly useful because it is intuitively more privacy preserving while also being more useful for slowing and understanding the spread of disease than absolute location data. Whether two individuals have been close to each other is less inherently revealing or intrinsically valuable than an individual’s absolute location (in that if you only new that two anonymous people had been near each other, you know almost nothing; but if you know an anonymous person’s absolute location, you know quite a lot). However, relative location is the most important information for understanding an epidemic because disease spreads through close contact.

There are a host of ways to infer relative location data. Unfortunately, the vast majority of them can only be collected with custom applications designed to do so. Unlike GPS, historical proximity data is largely unavailable. Thus, while these sources are incredibly useful, it is very likely that you will want to pair them with GPS data as well so that apps become immediately useful when they are first downloaded and increasingly useful as these techniques below are applied:

**1\. Bluetooth Broadcasting**

The general premise of this data source, [which has already been widely deployed to fight Covid-19 in Singapore](https://www.channelnewsasia.com/news/singapore/covid19-trace-together-mobile-app-contact-tracing-coronavirus-12560616), is for a phone to broadcast a random number (which could change frequently) via bluetooth 24 hours a day. Additionally, each phone listens and remembers all the hashes it has seen across time. Then, when an individual is tested to be COVID-19 positive, the random numbers they broadcasted are published on a server and anyone who remembers seeing one of the random numbers knows they were in contact with this person.

**2\. Gyroscope / Accelerometer / Ambient Audio Hash**

Mobile phones, when sitting within a moving vehicle, will experience similar bumps and turns over a similar period of time. If these “bumps and turns” can be hashed properly, they can be used to detect if two phones were near each other within the same moving vehicle without revealing anything else about the vehicle or the location. This is a clever idea, but bluetooth is probably better (sans disparities in battery usage). Ambient audio can also be used in a similar way, but bluetooth is still probably better because of its consistency.

The only reason to attempt multiple sources would be to provide better verification that multiple phones truly were in the same environment (it’s harder to fake multiple sources of signal)

One other reason would be if one can source the historical gyroscope or accelerometer data of a mobile phone. This might allow for some hisotrical proximity data to be inferred.

### Group Affiliation Data  

For governments, group affiliation data is all about understanding the ways that a disease is affecting different groups in society by being able to perform statistics over sub-groups of the entire population. Some of the most important groups include:

-   The group of people who have been tested for COVID-19
-   The group of people who have NOT been tested for COVID-19
-   Of those tested, the group of people who tested positive
-   Of those tested, the group of people who tested negative
-   The group of people who are self isolating
-   The group of people who are not self isolating
-   The group of people over 60
-   The group of people under 60
-   The group of people with underlying conditions
-   Etc.

Being able to calculate accurate and up-to-date statistics over these groups (ideally in a privacy preserving way) is vital to governments’ ability to manage and respond to an epidemic threat.

However, the usefulness of being able to identify groups (in a privacy preserving way) is not merely for calculating statistics, it is also for group-specific messaging. For example, a government may make requests to self-isolate to specific at-risk groups (or groups which, if they got sick, pose a risk to others, such as the children of medical professionals). They might also want to message random subsets of groups (such as 60% of X group should self-isolate) to allow for finer-grained adjustments to the spread of the disease.

However, whether individuals subscribe to a group can be particularly challenging to gather (and especially difficult to do in a privacy preserving way). This is because group membership is not always something someone can reliably report for themselves. While individuals can reliably report symptoms, and perhaps even location (although this may be more prone to deception), other attributes such as whether they test positive/negative for a disease require explicit validation from trusted third parties.

For more on how this data can be collected in a reliable and privacy preserving way, please see this our ongoing [Privacy Identity Server](https://github.com/OpenMined/private-identity-server) project. Additional discussion is provided in the next section.

**Call for Contributors:** the above data sources are key to fighting this epidemic. Key to both the collection of this data and the infrastructure for privacy preservation is the ability to load this data directly from its source into a smartphone. We, as a community, are calling for contributions to create individual components for iOS, Android, and React Native which can collect each of the above-mentioned datasets. This will allow app makers around the world to be empowered with this information in a way that forms **the starting point for privacy-preserving analysis** (on-device data), as mentioned in the next section. If you would like to get involved, please join the #covid\_mobile\_data\_collection channel in [OpenMined’s Slack](https://join.slack.com/t/openmined/shared_invite/zt-deu0kql0-kn~hh1CM3LdME6WORkIp6g) .

## Part 4: Privacy Preserving App Tech  

So you’ve figured out a way to empower a smartphone user to download and store their data directly into their own phone. Now, how do you facilitate the processing of that data to deliver your use case in a privacy preserving way. While a full survey of privacy preserving technologies is out of scope for this document (please see our [Udacity Course](https://udacity.com/private-ai) for an intro-level explanation of several key ones), there are a small handful of techniques which are likely to be “go-to” for covid app use cases.

**Assumptions:**

-   You have confirmed COVID-19 patient data in a cloud server
-   You have all other user data on each user’s individual device
-   Data on both patients and users include all three groups:
-   Absolute location Data
-   Relative Location (proximity) Data
-   Group Identifier Data (or the ability to prove group identity via Private identity Server)

### Private Set Intersection  

Whenever you want to compare a user’s data with a patient’s (such as checking to see if they were in the same location), a go-to technique is Private Set Intersection. Normal set intersection simply checks to see whether two sets of objects both contain the same objects. So, intuitively, private set intersection allows for the same but without anyone learning anything else about each other’s sets.

For example, if your smartphone had a set of locations your user had recently been in, and the server had a set of locations that a COVID-19 patient had been in, private set intersection could allow a user to learn whether any of their locations match those of the patient’s.

Same algorithm for comparing bluetooth! If a user had a list of all the random numbers they had seen over bluetooth (see above section if you don’t know why we’re collecting random numbers via bluetooth), and the server had a list of all the bluetooth numbers which had been broadcasted by COVID-19 patients during their contagious period, then users could learn whether or not they were in close proximity to patients without ever revealing their location and vise versa. In my opinion, **this is the most compelling long-term, privacy preserving analytic for contact tracing.**

You might ask, why use private set intersection? Why not just upload the user’s broadcasted random numbers to the server and do normal set intersection there? The reason is that if you have a “complete graph” of people and when they were in close contact, you can infer a load of useful, valuable, and potentially harmful inferences. Pseudonymous data != truly anonymous data. Use private set intersection instead.

So, for any analytic where you want to compare a user’s data (on a phone) with a patient’s data (in the cloud), use PSI to avoid centralizing a massive amount of data to a single location, which is a prime target for hacking and intentional or accidental mis-use. Empower users to have technical control over their data, to maintain control over the only copies of their information. Empower users with consent.

**Resources for Private Set Intersection:**

-   ****[**Example Covid-19 App (Server, iOS, and Android) With Private Set Intersection (via inner product of bits) Over GPS Coordinates**](https://github.com/OpenMined/covid-alert)****
-   ****[**JIFF: javascript library for secure multi-party computation**](https://github.com/multiparty/jiff)****
-   ****[**inner prod example**](https://github.com/multiparty/jiff/blob/master/tutorials/5-innerprod.md) **–** inner products of bits can be used for private set intersection****
-   [JSPaillier: javascript paillier homomorphic encryption](https://mhe.github.io/jspaillier/)
-   Can do inner product based private set intersection by doing an inner product between an encrypted vector of bits from the client and a decrypted vector of bits from the server.
-   More to come…

**Call for Contributions:**We need to rapidly prototype more private set intersection infrastructure for use in iOS, Android, and React Native apps against a variety of server architectures (Python and Node.js being the primary). We need to build more individual component libraries for PSI as well as end-to-end example implementations to aid in people’s ability to use this vital technology. We also need security vetting of existing implementations. Please join the #covid\_private\_set\_intersection channel in [OpenMined’s slack](https://join.slack.com/t/openmined/shared_invite/zt-deu0kql0-kn~hh1CM3LdME6WORkIp6g) if you are interested and able to help with this vital work.

### Differential Privacy  

This is a very challenging topic to explain in a short amount of time. So I’ll begin by giving a few references which explain what Differential Privacy is:

-   [https://youtu.be/4zrU54VIK6k?t=695](https://youtu.be/4zrU54VIK6k?t=695)
-   [https://t.co/VRldauRFn5?amp=1](https://t.co/VRldauRFn5?amp=1)
-   [https://t.co/5KSRPDfkRB?amp=1](https://t.co/5KSRPDfkRB?amp=1)
-   [https://t.co/deo5bKHGGO?amp=1](https://t.co/deo5bKHGGO?amp=1)
-   [https://udacity.com/private-ai](https://udacity.com/private-ai) (see the Differential Privacy section and the interview with Abhishek Bhowmick)

But in case you don’t have time for those resources, I’ll do my best to summarize what Differential Privacy is useful for in the context of Covid-19 apps.

Differential Privacy is useful for collecting privacy preserving statistics about a large group of people. (It’s useful for more stuff than that, but for right now, that’s all we care about.)

Let’s say you wanted to calculate the average age of a group of people. Instead of having each person send you their **true age**, you have them send you their **true age + random number between -100 and 100.** So, if someone was 42, they might send you 42 + (-50) = -8.

Now you might be wondering, why is this useful? Well, it turns out that we can generate random numbers so that if you average over enough of them, they cancel each other out. Thus, if 10,000 people all add a random number (pulled from a distribution with a mean of 0) to their age before reporting it, the average age reported will still be similar to the underlying raw data despite the fact that nobody revealed their true age.

The bigger the random numbers (on average), the more privacy protection we give people, but the larger the group of people we need to average over before we can get aggregate statistics

This approach is useful for allowing app users to transform their local data in a way that protects it so that the central server can collect useful statistics without the central server being able to reverse engineer any specific person’s personal data.

**Resources for Differential Privacy:**

-   ****[**https://github.com/google/differential-privacy**](https://github.com/google/differential-privacy)****
-   ******Google battle-hardened DP library. Use this if you can!******
-   ****[**https://github.com/OpenMined/PyDP**](https://github.com/OpenMined/PyDP)****
-   ******Python wrapper around Google’s battle hardened DP library – use this if you can!******
-   ****[**Javascript DP Repos**](https://github.com/search?l=JavaScript&q=%22differential+privacy%22&type=Repositories) **(including unverified implementations)******
-   ****[**Python DP Repos**](https://github.com/search?l=Python&q=%22differential+privacy%22&type=Repositories) **(including unverified implementations)******
-   ****[**Java DP Repos**](https://github.com/search?l=Java&q=%22differential+privacy%22&type=Repositories) **(including unverified implementations)******
-   ******Todo: Swift Repos?******
-   ******Todo: Kotlin Repos?******

**Call for Contributions:** Perhaps the most robust differential privacy library is [Google’s C++ DP LIbrary](https://github.com/google/differential-privacy), however we need this library to be running on mobile phones and servers. While there is currently a project to [wrap this library in Python](https://github.com/OpenMined/PyDP), we also need to provide this library to Java, Swift, and Kotlin languages. If you are interested and able to help with these efforts, please join the #covid\_dp\_lib\_wrapping channel in [OpenMined’s Slack Team](https://join.slack.com/t/openmined/shared_invite/zt-deu0kql0-kn~hh1CM3LdME6WORkIp6g).

### Private Identity Server  

When an individual needs to indicate that they are a member of a specific group (such as an age group, racial group, income group, COVID-19 positive/negative group, geographical group, etc.), it is often not enough for that individual to simply self-declare. For particularly important groups (such as the group of “trained medical surgeons”), membership in the group has to be certified by an official source. This is a vital part of our society’s infrastructure.

However, when attempting to empower a user to prove an attribute about themselves in a privacy preserving way, this can be a challenge. Namely, having someone simply enter “I am a doctor” in an app is really no guarantee at all that it’s true.

Instead, when an owner of an app need to prove that they are a member of a group to someone else, we need that app owner to tell a certifying body to support their claim. This is particularly challenging in our society which, frankly, still does most certifications on paper.

And convincing every certifying body to build an API which will provide this service probably isn’t going to happen fast enough for a COVID-19 response.

So, how do we overcome this and empower hundreds of millions of app users with the ability to prove arbitrary group membership virtually overnight?

We do so by running what is called a Private Identity Server (PIS).

A private identity server is a neutral third-party which will login to online services on behalf of an app user (via SSO) and verify certain claims. In this way, it is a “digital witness” of literally anything which you yourself could look up about yourself online.

For example, let’s say that an app user wants to prove to a friend that they have more than $1,000 in their bank account. Obviously a bank doesn’t have an API for “prove to my friend I have more than $1,000”. The only other obvious option is for the app user to let their friend login to their online banking portal (BAD IDEA!).

What a PIS server would do is login via SSO (which would only allow limited capabilities as is common with SSO architectures), look at the number in the account, and send a URL back to the app user. The app user can then give this URL to their friend who, when they visit the website will see a testimony from the Private Identity Server that the app user does indeed belong to the “group of people with >$1000 in their bank account”.

In this way, the PIS can securely, independently verify any claim for which an online API exists for the user to see their own information. Since most of society’s services have these kinds of online portals, many claims about individuals can be proven in this way.

The key issue is that you must trust the PIS to be honest. However, this is not really an issue, as decentralization can be facilitated by redundancy. If 100 different, independent entities (a government, a non-profit, an insurance company, your grandma, etc.) all run identity servers and all give an identical answer, it is reasonable to think that the answer is true (i.e., that all the servers couldn’t possibly be colluding).

There obviously a lot of questions you might have on how Private Identity Servers could work, how they protect privacy, and more. Please join OpenMined’s community slack to discuss this further.

Bringing it back to COVID-19, it is our mission to enable app users to be able to prove membership in various groups for a wide variety of use-cases (as mentioned above). This includes both the ability for a government health service to learn aggregate statistics about its population, but also so that individuals can prove they are low-risk individuals (which is likely an ensemble of many proofs).

**Important:** this is also a means by which, for health services with online test results, an app could prove to someone else that they are covid positive/negative.

**Important:** this is also a means by which, for services which record one’s location online (such as google maps), one person could prove to another person that they (or at least their phone) has been in self-isolation. This could be supported by PIS proofs that energy consumption increased in the home, and that no purchases were made in person (at physical retail stores) over a certain period. All of this is useful information to verify someone’s claims that they are low-risk of spreading infection (and thus, ready to be early adopters of the local gym as the pandemic recedes).

**Important:** this is also the means by which Sybil attacks against your central database could be mitigated, better enforcing things like rate limiters. If you can verify that two users are not secretly the same user, a variety of privacy measures become much more robust. Relying users who use your app to prove that they have SSO ability to a wide variety of services with identical identity parameters (Name, DOB, etc,.), and that they don’t match any of your other current users, is an above-average against Sybil.

**Important:** this is also a means by which someone could verify their identity online. In other words, they could prove that messages they write (such as a blogpost or news article) is actually from the same person as their public twitter/linkedin profile by virtue of a PIS server. (This one is a bit trickier but it can be done.) Take that fake news!

And most importantly, all of this is possible without requiring every other service on the planet to explicitly support the capability, which means that it can be rolled out quickly and (relatively) inexpensively. The primary development priorities are security and scalability.

**Resources for Private Identity Server:**

-   ****[**https://github.com/OpenMined/private-identity-server**](https://github.com/OpenMined/private-identity-server)****
-   ****[**https://github.com/OpenMined/Aries-DID**](https://github.com/OpenMined/Aries-DID)****

**Call for Contributions:** Perhaps the greatest need for contributions is the construction of backend SSO infrastructure for the Private Identity Server, allowing it to safely login to the thousands of services that people around the world use every day. If you are experienced at building SSO integrations (or at web scraping which may also be required), please join the #covid\_pis\_sso channel in [OpenMined’s Slack Team](https://join.slack.com/t/openmined/shared_invite/zt-deu0kql0-kn~hh1CM3LdME6WORkIp6g).

### Private Identity Server -> Sovereign Self Identity  

…coming soon…

## Part 5: A Roadmap for App Dev  

…coming soon…

## Part 6: Closing Thoughts

-   Please open-source anything you build – even if it means people don’t deploy \*your\* app but instead use your app for inspiration, it’s more than worth it. The mission is to save lives, not to develop proprietary IP.
-   Please get involved in creating these resources for others. Send us links to things you build and we will add them to this blogpost so that others can use them in their COVID-19 apps. [covid@openmined.org](mailto:covid@openmined.org)
