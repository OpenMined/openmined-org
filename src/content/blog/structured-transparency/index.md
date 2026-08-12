---
title: "Structured Transparency Continued: Verifying Inputs and Outputs"
slug: structured-transparency
date: 2021-06-08T09:14:00
updated: 2024-12-09T19:19:37
categories: [research]
authors: [johannes-stutz]
draft: false
legacyId: 1652
---

The [first post](https://blog.openmined.org/society-runs-on-information-flows/) of the Private AI series was all about information flows and how they are fundamental to our society. We also learned about how information flows are often broken today because of the privacy-transparency trade-off.

In the [second post](https://blog.openmined.org/limitations-of-information-flows/) we discussed which technical problems exactly are underlying the privacy-transparency trade-off.

In the [third post](https://blog.openmined.org/structured-transparency-input-output-privacy/) we were introduced to the concept of **structured transparency**. We learned about input and output privacy, two of the five guarantees of structured transparency.

Today, in post four, we continue with structured transparency, covering input and output **verification** as well as **flow governance**.

## Input Verification

We learned about how input and output privacy can help you hiding information you don’t want to share. But how do we know that information from such a well-hidden information flow is true?

**Examples:**

-   If a data scientist can’t look at her data, how does she know what it looks like?
-   A police officer wants to check if a driver is of legal age. He would usually look at the driver’s license. This comes bundled with all kinds of information: date of birth, photo, license ID, address… When all he has to know is that YES, you are allowed to drive. But how could he verify a card that only said YES?

The driver’s license is a good example of **internal consistency**. It makes it hard to create fake documents, videos, or money. It also makes it hard to pretend you’re someone else in real life.

**Internal consistency** refers to someone in the real world recognizing **how things usually look like.**

> **Example:** You receive a banknote that was printed on a regular printer. You would immediately feel that something is not right, even if the layout etc. is correct.

Internal consistency is one of humanity’s most powerful tools for communicating trust. But this approach to verify information has two problems.

1.  With enough effort, internal consistency can be faked. From classic approaches like [faking dollar bills](https://en.wikipedia.org/wiki/Counterfeit_United_States_currency) to modern, AI-based techniques called [deepfakes](https://youtu.be/l82PxsKHxYc?t=21).
2.  It requires sending way more information than is necessary to communicate. It has data leakage built-in!

We need tools that allow verifying a piece of information. In a way that it a) can’t be faked and b) does not require revealing any extra information.

## Technical Tools for Input Verification

### Tool 1: Cryptographic Signatures

When you look at the top left of your browser, you probably see a little padlock ?. This symbolizes one of the most extraordinary input verification technologies ever deployed. When you enter a URL in your browser, hundreds of computers and network switches and cables help you find the right files. What if only one of these machines lied and sent you an altered version of the website? Would you notice it, if the website looked just as you expected?

This is called a man-in-the-middle attack. It is one of the most important input verification problems.

> A **man-in-the-middle attack** is when someone gets between you and another party and alters messages you are exchanging.

This kind of attack is impossible when the little lock ? in your browser appears. It means that your communication with a server is encrypted with [HTTPS](https://en.wikipedia.org/wiki/HTTPS).

HTTPS is an example of the most important tool for input verification: A cryptographic signature.

> A **cryptographic signature** allows someone to sign a document with a mark that only they could make.

It has a significant advantage over real-life signatures. It cannot be copied! Remember [public-key cryptography](https://deeplearning.berlin/online%20courses/privacy/the%20private%20ai%20series/openmined/2021/01/19/Our-Privacy-Opportunity-Part-3.html#Tool-1:-Public-key-Cryptography)? The public key lets you encrypt something that only the private key can decrypt.

Cryptographic signatures are like this, too. You can sign any digital document with your **private key**. It does not matter where these documents go. Anyone who receives the signed document can verify with your **public key** that it is in fact your document.

What does it mean to “sign” a digital document, an image, an audio file? Signatures are just a mark. They are attached to an object, affiliating this object to you. What keeps a signature attached to this object? Digital signatures are actually a second file that you are sending with a document. We call this second file the **certificate**. You need the certificate to guarantee that this document is yours.

When you enter google.com in your browser – how do you know the page you receive is actually from google.com? Couldn’t anyone copy the public key (it’s public, after all)? This is what a **certificate authority** is for. It provides a big list of domain names and associated public keys, called certificates. When you receive a webpage that’s supposed to be from google.com, your browser checks its signature using the public key from the registry.

How do we know that a signature is associated with this particular file, and that nobody altered the file? For this, we need to know what a **hash** is.

> A **hash** is a way to convert any kind of digital object into a single big number. It is deterministic, which means: no matter who calculates the hash, the same document will always result in the same hash.

If you change even one letter in a text document or one pixel in an image file, the hash will be completely different! When google.com signs a website before sending it to you, this is what it actually does. It hashes the big page into a single number. When it creates a signature, it’s a signature for _that number_. It is unique for this page!

> **Tip:** If this was not clear or you want to gain a better understanding of cryptographic signatures, please check out [this great video](https://www.youtube.com/watch?v=T4Df5_cojAs)

### Tool 2: Active Security & Zero-Knowledge Proofs

From a structured transparency perspective, cryptographic signatures are only good for a single, **straight pipe** of information. Any alterations of the content would corrupt the message. This is good in case a hacker messed with your data. But it also prevents us from performing any useful computations along the way. What we want is a tool that allows transformation of the data, but only in a very specific way. How would input verification work in such a case?

We look at two of the many techniques looking to verify a flow and its inputs.

1.  Zero-Knowledge Proofs
2.  Encrypted computation (like HE or SMPC) with Active Security

**Example:** Your country holds an election. When you see the big number on the TV screen, counting the votes: How can you be sure that your vote was counted? **Goal:** We need something like a super-signature for the result. This would allow to proof that all inputs were used in the calculation of the final result. Every voter could check – with their public key – if their signed vote was included.

This is the idea behind encrypted communication with active security or zero-knowledge proofs. If a computation is agreed upon, then a signature can be created when information is processed in an information flow. There is cryptographic evidence allowing anyone who participated in the computation that their input was included in the final result.

> **Note:** While these technologies exist, using them at the scale of an actual vote would be extremely challenging today. It is still ongoing research work.

These concepts are not only applicable to simple computations like voting, but also for complex tasks like machine learning algorithms. You could have proof that your data was processed by a fair algorithm.

### Public/private key pairs for groups of people

1.  In previous lessons, we learned about private/public keys. One key pair was always linked to one person. But a key could also proof your anonymous identity. Think of it like a username: it can be anonymous, but represents the same person every time.
2.  There can be an infinite amount of key pairs. Those could be used not only by individuals, but by groups of people. Like all doctors in your town or everyone who is a English/Spanish interpreter. These public/private key pairs could allow you to proof that you are a member of a group, without revealing which member exactly you are.

Your real-life signature is tied to your identity. In contrast, cryptographic signatures don’t have to be this way. They can be used to verify only specific attributes about you. Returning to our popular bar example: you could have a private key which proofs that you are of legal age to drink. If the bartender asked you for ID, you could prove that you are a member of the group that is over a certain age. Without having to reveal all the private information on your ID card.

This is input privacy and input verification at the same time!

### Reputation

A new concept: here we don’t mean reputation not for people for companies, but the reputation for a verified input. This is a topic of active research, but it’s supposed to inspire creativity.

**Example:** You are a data scientist and you are connected to a **network of data owners**. Let’s say there are `635` data owners who claim to have data on breast cancer. But because it’s private data, you’re not allowed to actually look at this data. Even though you can’t see the data, they want to charge you `10$/day` to train your ML model. How do you decide which one of these `635` owners you trust? What would prevent anyone from attaching themselves to the network and pretending to have data on breast cancer?

1.  Some of them might be **entities you know and trust**. Let’s say `40` of the data owners were well-known hospitals. They can prove their identity via a signature and have a brand they don’t want to damage, so you can trust their data.
2.  What about the other `595` data owners? Well, if you are the first person using a private dataset, **you can’t know**. You just have to try it. The data owner should probably let you do so for free.

Let’s say you are the first person to use data owner `346`‘s dataset on breast cancer. You train an ML model, validate it with a known dataset, and it does pretty well. `346` had some useful data! You leave a review: “The dataset worked”. You sign it with your private key. You could even leave cryptographic proof that _you_ did the analysis and which accuracy you achieved. The second, third, fourth, … person comes along and sees your review. They can try the dataset for themselves and leave a review as well. They are all co-signing the same statement: This dataset, which you cannot see, is actually good. As the dataset becomes more verified, its price should increase.

What if there hadn’t been a trusted dataset to evaluate with? Wasn’t it lucky that a hospital had a similar dataset you could trust and compare? The solutions to this problem are complex, but there are ways to deal with it. This category of solutions is called **endorsements through a social network**.

> **Important:** You cannot invent trust out of nowhere. But you can take small amounts of trust and scale that trust to an entire community.

Humanity is very connected. On LinkedIn, there is a feature that shows the degree of connection to other people. 1st degree connections are the people in your contact list. 2nd degree connections are the people your contacts have as 1st degree connections. Similar approaches could work to estimate whether an anonymous review or signature is real. You could look at the connections of this signature to people you actually know. If you can’t find any connections, then it probably is fake.

This is futuristic, but it shows how much trust and collaboration we can build as these tools make progress.

## Output Verification

> **Output verification** asks: how do we verify that the outputs from a hidden information flow contain the properties we want?

Output verification is one of the most important components of structured transparency. It allows you to verify that an algorithm, that’s affecting your life, is actually good.

Machine learning models are often difficult to fully understand. They also can produce [very biased results](https://towardsdatascience.com/real-life-examples-of-discriminating-artificial-intelligence-cae395a90070).

> **Tip:** I can highly recommend [Rachel Thomas’ lesson on Data Ethics](https://course.fast.ai/videos/?lesson=5) from fast.ai. It is a great introduction on the topic of Bias in AI.

If we want to use algorithms, we need a way to test and **audit an algorithm’s performance**. Fairness & Bias in ML are an area of active research and they are very important. For ethical reasons first, but also for legal reasons. An example is the automatic processing of applications at some companies. The algorithm must now lower the chances for someone because their gender, race, etc. are historically underrepresented in the dataset.

This is a complex challenge. Let’s cover some of the highlights.

Think about a world without digital tools, when all decisions were made by humans. Do we know that any particular decision was **made in a fair way**? If a person is following a procedure, we can analyze the procedure. But if a person simply makes a decision, it can be difficult to prove that this was an unfair decision, i.e., a gender-based decision.

How has society responded to human brains being black boxes and the bias of human judgement? We have laws. We have procedures for what people are and aren’t allowed to do. A formal policy, **a set of procedures someone has to follow** to ensure their decisions are fair and just. It’s not perfect, but it brings the decision-making process into the open.

In the long run, **algorithms have the potential to be more transparent** and more consistent than humans. However: most of the decisions humans make today are not ready for algorithms to take over. Algorithms are not accurate enough yet. But while the early use of algorithms has made mistakes regarding fairness and bias, Andrew is optimistic. The long-term potential for more fairness, transparency, and accountability is promising. Because algorithms are easier to audit than a person.

How to certify algorithms that we can’t look at, because they’re private?

1.  Let trusted third parties or regulators audit them. Example: The Coca Cola recipe is famously secret, but _someone_ from the government had to certify that it’s safe. But there will not be a regulator for every possible case. That brings us to the second point:
2.  Construct a new private information flow to evaluate the algorithm. Use a different algorithm to evaluate this one. Use input and output privacy techniques to analyze the algorithm. You could measure how accurate, fair, safe an algorithm is, without having access to the algorithm itself.

## Flow Governance

Setting up an ideal information flow is not enough. If anyone could change the guarantees, that would be a problem. Who should have permission to change the guarantees? This is regarding input/output privacy as well as input/output verification.

> **Important:** Without proper governance mechanisms, the integrity of the other guarantees are at risk.

There are different forms of governance:

-   **Unilateral governance:** An example is simple **public-key encryption**. I encrypt my message with your public key and send it to you. This is now an object only governed by you. Nobody else could use the information within the message. **Homomorphic encryption** is slightly different. If somebody sends me homomorphically encrypted information, I have _some_ governance over it. I can’t read it, but I can modify it, perform calculations on it. Nevertheless, it is controlled by only one person, the private-key holder.
-   **Consensus governance:** Remember **additive secret-sharing** from [SMPC](https://deeplearning.berlin/online%20courses/privacy/the%20private%20ai%20series/openmined/2021/01/19/Our-Privacy-Opportunity-Part-3.html#Tool-3:-Secure-Multi-Party-Computation-\(SMPC))? Where a number was encrypted between multiple shareholders. Someone could only perform calculations on the number or decrypt it if **all** shareholders decided to allow it. Each shareholder has veto power.
-   **Threshold schemes:** These allow for decisions with a democratic majority. SMPC and HE can both be configured this way. You can even set an arbitrary threshold. If a percentage of shareholders larger than this threshold wants to do something, they’ll have enough cryptographic permission to do it. This can mean running a computation, decrypting an output, adding a shareholder, …

Why is this so powerful? All these fancy tools rely on trust. Nobody is perfectly trustworthy. But it’s possible to design systems where people are more likely to work together. Groups of people, with checks and balances and control over each other.

An **example** where distributing governance over a number is especially useful: You want to store all your photos in the cloud. You could split the photos into two or more shares (SMPC), and give them to different cloud providers. You could still use their services but unless they all decided to collude, they couldn’t use your information.

> **Note:** These tools are still in development and might not work in every practical use case.

Being able to share data in SMPC state is a genuine solution to the Recursive Enforcement Problem. Having information split between multiple people, with everyone having a veto power to prevent misuse, alleviates the recursive enforcement problem.

These tools give us incredible new options. But they aren’t useful until we use them in systems that match the strenghts and weaknesses of humans. Computer scientists and social scientists will have to collaborate!

## Conclusion

This lesson explored the remaining three guarantees of structured transparency: Input Verification, Output Verification, and Flow Governance.

Thank you for reading! The next post in the series will cover the impact of Structured Transparency.

Cover Image: Photo by [Ron Whitaker](https://unsplash.com/@ronwhitaker?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/@ronwhitaker?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
