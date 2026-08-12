---
title: "What is e-voting, and which problems could it help solve?"
slug: what-is-e-voting-and-which-problems-could-it-help-solve
date: 2020-11-05T19:24:54
updated: 2024-12-09T19:42:57
categories: [research]
tags: [privacy-enhancing-technologies-pets]
authors: [tom-titcombe]
draft: false
legacyId: 1979
---

The 2020 U.S. presidential election has been, to put it bluntly, a nail-biter. It is, at time of writing, over two days since the voting booths began to close and both candidates have grounds to be hopeful of victory, with several states still in play. In comparison with other Western countries, the voting process has seemed torturously slow; it lies in stark contrast to U.K. elections, in which we can have a pretty good idea of the victor within seconds of polls closing (thanks, broadly useful exit polls), and have full confirmation well before even the earliest of birds brew their first cup of tea.

Aside from being a typically American spectacle, even being somewhat enjoyable for people with no particular dog in the fight or those who just like elections a little _too_ much, the ambiguity and lethargy of this year’s vote counting has far more malicious consequences. In the early hours of the morning after the election, incumbent Donald Trump first began to make claims (all-too-predictably, it should be noted) of voter fraud “stealing” the election from him. While the full effects of these claims are yet to be discernible, it is not difficult to imagine the civil unrest which could ensue, particularly given the form of 2020 America.

For those of you who (rather sensibly) have removed themselves from the minute-by-minute torment of the election, I offer this brief and thoroughly non-expert summary of events: The 2020 election has seen historic voter turnout, for both in person and “mail-in” votes. Typically (for reasons I cannot as of yet elucidate), mail-in votes skew heavily towards the Democrats. The rules for counting the different types of vote vary state-by-state. While Florida saw an early Biden lead since mail-ins were pre-calculated, some states, including Pennsylvania, Wisconsin and Michigan, were yet to count theirs even as election evening turned into night turned into dawn turned into day. In the morning after the election, Nevada even announced, teasingly, that it would have nothing substantial to announce until at least two days after election day. Just as Europe was waking up, Trump claimed victory while millions of votes in the aforementioned states were yet to be counted. More perniciously, he implied that any change from the scorecards at the time would be evidence of mass vote tampering by Democrats. Several hours later, the mail-in votes were counted and were (predictably) strongly pro-Biden. A few of the remaining states now appear to be turning from Red to Blue, putting victory within Biden’s grasp.

This post-election controversy is an indictment of a supposedly democratic system. If there is no fraud (and there is no evidence for it), then the fact that any party could even claim for it with a modicum of seriousness is an unideal feature of the system. If there is fraud, well, that is quite clearly incongruent with democracy. I proffer that vote counting does not need to be conducted in such a contentious manner and that the stress of election day could be completely removed. The answer to these problems is electronic voting (e-voting).

I can almost hear the exasperation at that reveal. “E-voting makes it easier to cheat”, “E-voting is insecure”, “Tom Scott said E-voting was a bad idea” \[1\]. For the moment I implore you to park all concerns about the (im)practicalities of e-voting and first consider its utility as a concept. At the heart of both Trump’s and Biden’s victory proclamations, they, if you believe that each of them believes what they are saying, both argue in favour of the same fundamental idea: that in a democratic system all lawful votes are counted, and _only_ lawful votes are counted. Where they differ is in defining what a lawful vote is, but I will leave that debate for the courts.

For an election result to be trusted, votes should be counted (i) timely, so the victor can take their deserved position; (ii) transparently, so votes are not manufactured; (iii) lawfully, for obvious reasons. The election-deciding states are only really failing charge (i), but not through malicious intent or malpractice. Some counties have had millions of mail-in votes to count and were prohibited from doing so until polls closed. That is an enormous challenge to ask of humans, who tire, make mistakes, and will be frantically aware that the eyes of the world are on them. To add yet more complexity to what is now a precariously ebullient situation, mail-in votes will continually arrive for days to come. It is in the delay in reaching a result where the essence of Trump’s contention lies.

Contrast the laborious, manual vote counting process with an idealised electronic voting infrastructure: citizens privately and securely send their vote via a phone or computer to a number of vote counting bodies. **The votes are not counted before polls close and, because of the encryption protocol, there is no possible way for somebody to illegally view the results in advance.** Polls close and votes are aggregated _immediately_. There is no question as to whether a vote was sent before or after the deadline, because votes arrive at the counters’ terminals without the delay of conventional post and are verifiably timestamped.

The freedom to vote from anywhere using a personal phone may concern some people as providing an easy route to voter manipulation. But this criticism can be voided through vote governance, such as still requiring people to come to a polling station – perhaps individuals should be required to pick up a random one-time password from the station in order to cast their vote. In this setting, we have only changed the _medium_ of vote casting from paper to digital; the process of voting remains the same. Now, however, we can reap the benefits of rapid electronic calculation.

**I trust that you can see how e-voting potentially could be of use, but are perhaps still dubious of using real, existing systems in practice. Make no mistake, I’m not suggesting that e-voting solutions are ready to roll now, or will be even by the 2024 U.S. election. There are practical issues still to work out before attempting to bring any system to the political stage, but I believe the issues are worth tackling.** Recent years have seen great advancement in secure computational technologies, such as self-sovereign identity \[2\], differential privacy and secure multi-party computation, which together could be applied to deliver secure, private, transparent voting.

At OpenMined, we have begun to explore the efficacy of these technologies in a number of secure voting protocols, collectively dubbed _PryVote_ \[3\]. We have developed a demo which uses _Shamir’s Secret Sharing_ \[4, 5\] to encrypt the votes and split them between vote counters, each of whom keeps a separate, encrypted vote tally. Not all vote counters are needed to decrypt the final, combined tally, so if a party manipulates the vote tally they control, the true result can still be calculated and the fraudulent party can easily be discovered. Every party can have a stake in the vote counting process without compromising its security, which removes all possibility of crying foul at the outcome.

**We use cryptographically verifiable “credentials”, a concept called self-sovereign identity, to validate an individual’s right to vote \[6\]. Through this technology, we can permit votes to be cast without revealing sensitive, personal information like date of birth or address, which can open people up to intimidation and manipulation.**

It will undoubtedly be a little while, if ever, until we see PryVote in action in a national election. However, it is not out of the question that less – shall we say – impactful votes than the U.S. election are driven by our secure voting protocols in the near future. As a not-for-profit community of developers, our only drive is to empower people to carry out votes with privacy and security. We believe there is great potential for these protocols to facilitate everyday voting activities right now, be it deciding where to go for lunch or evaluating the truthfulness of a statement posted on social media.

**Our modern political problems are partly caused by 18th century approaches. It doesn’t have to be that way. It’s time to modernise democracy.**

## References

\[1\] – [https://www.youtube.com/watch?v=w3\_0x6oaDmI](https://www.youtube.com/watch?v=w3_0x6oaDmI)

\[2\] – [https://medium.com/metadium/introduction-to-self-sovereign-identity-and-its-10-guiding-principles-97c1ba603872](https://medium.com/metadium/introduction-to-self-sovereign-identity-and-its-10-guiding-principles-97c1ba603872)

\[3\] – [https://github.com/OpenMined/PyDentity/tree/master/projects/pryvote](https://github.com/OpenMined/PyDentity/tree/master/projects/pryvote)

\[4\] – [https://github.com/OpenMined/PyDentity/blob/feature/pryvote-lite/projects/pryvote/demo/2\_shamir\_secret\_sharing\_voting.ipynb](https://github.com/OpenMined/PyDentity/blob/feature/pryvote-lite/projects/pryvote/demo/2_shamir_secret_sharing_voting.ipynb)

\[5\] – [https://qvault.io/2020/08/18/very-basic-shamirs-secret-sharing/](https://qvault.io/2020/08/18/very-basic-shamirs-secret-sharing/)

\[6\] – [https://github.com/OpenMined/PyDentity](https://github.com/OpenMined/PyDentity)
