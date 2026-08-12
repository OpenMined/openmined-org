---
title: "No, AI hasn’t run out of data"
slug: ai-hasnt-run-out-of-data
titleMax: 56
date: 2025-12-01T14:14:15
updated: 2025-12-03T13:26:25
categories: [research, policy]
tags: [ai-ethics, privacy-enhancing-technologies-pets, large-language-models-llms]
authors: [jack-hardinges]
cover: ./cover.jpg
coverAlt: ""
cardText: dark
headerDownsize: 2
draft: false
legacyId: 8256
seo:
  description: "Elon Musk says AI exhausted all human data. He's wrong. 99.99% of the world's data is private and untapped. Here's how AI's relationship with data is really evolving—and what's at stake."
---

AI models’ relationship with our data is getting more dynamic, contextual and private—and the stakes are high

## The Claim

Earlier this year, Elon Musk claimed that [‘all human data for AI training has been exhausted’](https://www.theguardian.com/technology/2025/jan/09/elon-musk-data-ai-training-artificial-intelligence).

Ilya Sutskever, a co-founder of OpenAI, has said the world has reached ‘[peak data](https://the-decoder.com/openai-co-founder-says-ai-is-reaching-peak-data-as-it-hits-the-limits-of-the-internet/)’.

A [recent episode of the BBC’s The Artificial Human podcast](https://www.bbc.co.uk/programmes/m00274wj) asked if AI has hit a ‘data brick wall’.

But if you scratch beneath the surface, this narrative—_AI has run out of data_—really isn’t the right way to think about what’s happening.

## Context

Over the past five years, progress in AI has been characterized by models of large scale and complex architectures, capable of tasks such as natural language processing and content generation. These models have enabled [new categories of consumer AI tools](https://a16z.com/100-gen-ai-apps-5/) and captured massive public attention.

Almost all of these models have been developed [using vast amounts of data from the public web](https://creativecommons.org/wp-content/uploads/2025/06/Human-Content-to-Machine-Data_Final.pdf). This includes large datasets created with the express purpose of being widely used, such as [ImageNet](https://www.image-net.org/) and [Wikipedia](https://www.wikipedia.org/), as well as training datasets compiled through automated crawling of public websites, blogs, forums, books and social media platforms.

[Common Crawl](https://commoncrawl.org/) has been _the_ foundational dataset of recent times. As a freely available corpus of web text drawn from billions of webpages, it’s enabled models of, and at, unprecedented scale. Around [80% of the tokens used to train OpenAI’s GPT-3 model came from Common Crawl](https://www.mozillafoundation.org/en/research/library/generative-ai-training-data/common-crawl/), and between 2019 and 2023, more than 60% of all published LLMs relied on Common Crawl for their training data.

There’s not another dataset quite like Common Crawl, nor another public corpus of data as rich as the web. In this sense, [the low-hanging fruit has been eaten](https://www.dbreunig.com/2024/12/05/why-llms-are-hitting-a-wall.html). But rather than represent a terminal shortage, we’re instead seeing AI models enter a more dynamic, contextual and private relationship with data.

## Dynamic Access

The first generation of LLM-based tools were ‘[thin ChatGPT wrappers](https://www.ben-evans.com/benedictevans/2023/10/5/unbundling-ai)’—user interfaces that made calls to a static, pre-trained model. The responses these tools provided were largely generated from frozen snapshots of web data that the models had been trained on.

This was a serious flaw. Once trained, a model’s world stopped. What’s the point of a scientific research tool that doesn’t have access to the latest peer-reviewed papers? Or an answer engine that can’t access the latest news or sports scores?

This has changed quickly. Now, architectures such as [retrieval augmented generation](https://research.ibm.com/blog/retrieval-augmented-generation-RAG) enable models to draw on fresh data in response to user queries, instead of relying solely on the data they were exposed to during training. [Context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) has emerged as a specialist discipline, involving grounding a model’s outputs in live context rather than static memory. In late 2024, Anthropic introduced the [Model Context Protocol](https://en.wikipedia.org/wiki/Model_Context_Protocol). It’s an open standard that enables models—or ‘agents’—to integrate and adapt to data in real time, and therefore execute sequences of tasks. [Training environments](https://techcrunch.com/2025/09/21/silicon-valley-bets-big-on-environments-to-train-ai-agents/) are being explored as a way to make models better at responding to more complex, unpredictable scenarios. 

This evolution from one-time harvests to ongoing, dynamic access to data has also driven huge increases in crawling activity on the web. Some AI crawlers now [revisit web pages every few hours](https://arstechnica.com/ai/2025/03/devs-say-ai-crawlers-dominate-traffic-forcing-blocks-on-entire-countries/) to maintain up‑to‑date indexes and retrieve information for users. Companies like [Exa](https://exa.ai/), [FireCrawl](https://www.firecrawl.dev/) and [Valyu](https://www.valyu.network/blog/why-artificial-general-intelligence-agi-needs-context-enrichment) offer near real-time web search for models, rather than humans.

## Making Contact with Reality

The AI industry is pivoting hard from [trying to create gods to building products](https://www.aisnakeoil.com/p/ai-companies-are-pivoting-from-creating), in part due to the absence of further troves of web data to fuel yet-larger models.

In this new era, progress will not be measured against advancements only in technical frontiers—training the largest models, beating performance benchmarks and theorizing on ‘general intelligence’. Meaningful progress will instead be contingent on delivering products that solve real problems, function reliably and are adopted at scale.

The data needed to engineer targeted, domain-specific AI sits behind organizational boundaries rather than on the public web. For example, to deliver transformative health care insights, models will need access to [health records that span clinical, genomic, wearable and patient-generated data](https://pmc.ncbi.nlm.nih.gov/articles/PMC12316320/). This data is fragmented, held by a combination of hospitals, insurers, biobanks and patients themselves. In science, if AI is to deliver on its promise of delivering new or sped-up discoveries, models must now [‘make contact with reality’](https://techcrunch.com/2025/10/20/top-openai-google-brain-researchers-set-off-a-300m-vc-frenzy-for-their-startup-periodic-labs/), and wrestle with the mess of data generated by real-world labs, experiments and simulations.

At [OpenMined](https://openmined.org/), we estimate that AI has so far been trained, evaluated and deployed on [less than .](https://ifp.org/unlocking-a-million-times-more-data-for-ai/)[0](https://ifp.org/unlocking-a-million-times-more-data-for-ai/)[1% of all data](https://ifp.org/unlocking-a-million-times-more-data-for-ai/). The remaining 99.99%—more than 180 zettabytes and growing—has been generated by the world’s eight billion people, more than 360 million companies, and hundreds of thousands of government organizations. And it doubles every two years.

Over the past year, many AI firms have started to work with enterprise clients to enable them to integrate and work with their private datasets. Larry Ellison, cofounder and CTO of Oracle, has said [the future of AI will be built on secure access to enterprise data](https://www.techfinitive.com/oracles-larry-ellison-outlines-ai-future-built-on-secure-access-to-private-enterprise-data/). Aidan Gomez, co-founder of Cohere, has described [the firm’s pivot](https://www.linkedin.com/pulse/where-enterprise-ai-headed-aidan-gomez-dznjf/) to ‘highly customised, secure private deployment’ and focus on helping organizations build AI systems using ‘their most sensitive and valuable data assets’ in regulated industries like government, finance, energy, and healthcare. OpenAI’s recent [‘company knowledge’](https://www.theverge.com/news/806046/openai-chatgpt-company-knowledge-update) update lets organizations integrate their private workplace data into ChatGPT from apps like Slack and Google Drive. 

## Consumer Flywheels

Our interactions with chatbots, virtual assistants and software _create_ data.

This includes our prompts, instructions, queries, corrections and conversations, written in natural language, as well as technical logs, metadata, preferences and categorisations from these interactions. Enabling systems to retain and recall data from previous interactions—giving them ‘[memory](https://www.tanka.ai/blog/posts/ai-memory#:~:text=Long%2Dterm%20AI%20memory,intelligent%20and%20contextually%20aware%20assistance.)’—is intended to produce more coherent and personalized responses over time.

Given contemporary AI models interface with billions of consumers, the scale of this data flywheel is significant. From its launch in November 2022, [ChatGPT reached 100 million weekly active users within a year](https://openai.com/index/how-people-are-using-chatgpt/) and more than 700 million by mid‑2025. That user base alone [now sends around 2.5 billion prompts per day](https://mashable.com/article/openai-how-many-people-use-chatgpt), producing an immense real‑time stream of conversational and behavioural data.

Similar to enterprise integration, consumer AI tools are beginning to reach further into users’ documents, calendars, communications and other private data sources. [NotebookLM](https://notebooklm.google/), for example, powered by Google’s Gemini family of models, is designed to ground its responses in user-uploaded content such as PDFs, documents, slides and audio files. Wearables manufacturer WHOOP has recently [introduced ‘AI-driven coaching’](https://support.whoop.com/s/article/How-to-Use-the-AI-Powered-WHOOP-Coach?language=en_US), which provides training recommendations based on users’ biometric data and behavioral patterns.

AI firms are increasingly focused on creating further channels to access consumer data, including social media platforms, browser extensions and consumer apps. In launching their own browsers, OpenAI (with [ChatGPT Atlas](https://openai.com/index/introducing-chatgpt-atlas/)) and Perplexity ([Comet](https://www.perplexity.ai/comet)) are seeking to gain access to valuable search queries, website visits, click behavior and shopping decisions.

## Surveillance, Concentrated Power & Lost Public Benefit

AI clearly hasn’t run out of data. So what’s the problem?

First, large AI models’ current relationship with the web is simply unsustainable—technically, economically and socially. [Some websites are being knocked offline by the sheer volume of AI crawling activity](https://thelibre.news/foss-infrastructure-is-under-attack-by-ai-companies/). By providing answers directly to users, often with no attribution or links, [AI tools are choking traffic to original sources of content](https://creativecommons.org/wp-content/uploads/2025/06/Human-Content-to-Machine-Data_Final.pdf), including websites that have traditionally relied on human visitors to generate advertising revenue. In response, publishers are choosing to block their works from being accessed, or even [damage models that try to access them](https://zadzmo.org/code/nepenthes/). A closing off of the web in response to AI crawlers—especially using blunt approaches that do not distinguish them from other machines—is affecting crawling for legitimate and widely-accepted purposes, such as archival and research. Without new approaches for providing permission, credit and compensation, large AI models will continue to ‘[drill away at their own foundations](https://nmvg.mataroa.blog/blog/the-paradox-of-reuse-language-models-edition/)’.

Second, as AI systems reach further into the world’s private data, there’s a clear risk that the industry will follow [the surveillance capitalism playbook developed by social media platforms](https://www.techpolicy.press/before-ai-exploits-our-chats-lets-learn-from-social-media-mistakes/) over the past two decades. Under this scenario, the vast amounts of data generated through use of AI-enabled systems will be [extracted for targeted profiling, tracking and marketing](https://www.bleepingcomputer.com/news/artificial-intelligence/openai-is-going-meta-route-as-it-considers-memory-based-ads-on-chatgpt/). The opportunities for intrusive profiling and manipulation are even [more severe than with platforms of the past](https://hdsr.mitpress.mit.edu/pub/ujvharkk/release/1?utm_source=substack&utm_medium=email), given the persuasiveness of human-like chatbots and other interfaces. Meredith Whittaker, President of the Signal Foundation, has already warned that ‘[AI agents are coming for your privacy](https://www.economist.com/by-invitation/2025/09/09/ai-agents-are-coming-for-your-privacy-warns-meredith-whittaker?giftId=859d3a46-a913-4ee0-a3d5-060b774c2501&utm_campaign=gifted_article)’, which is particularly concerning in the context of data protection laws [looking like they will be weakened rather than made stronger](https://www.politico.eu/article/brussels-knifes-privacy-to-feed-the-ai-boom-gdpr-digital-omnibus/).

Third, if only a handful of companies come to dominate the landscape for data integration and AI model deployment, this will create—or further excacerbate—excessive concentrations of economic power. Left unchecked, this will not only enable the pervasive data capture and processing required for surveillance capitalism, but risk [undermining competition and limiting innovation](https://www.forbes.com/sites/jimosman/2024/06/30/big-techs-overpowering-influence-risks-to-markets-and-your-money/), [reducing consumer choice](https://emannuel.eu/risk/concentration-of-technological-power/) and [destabilizing democracies](https://www.amnesty.org/en/latest/news/2025/08/why-are-big-tech-companies-a-threat-to-human-rights/).

Ultimately, when control of data is centralized among a few powerful private sector entities, its use for the public benefit is hampered. Corporations often prioritize short-term data extraction and monetisation for their own ends. Just as we should be concerned about misuses of data via AI, we should be concerned about _missed uses_, such as to improve public health and tackle the climate crisis. And if every organisation works unilaterally, we don’t get [collective intelligence](https://www.undp.org/acceleratorlabs/untapped/about-untapped/why-collective-intelligence): the enhanced capacity that’s created when organisations work together and mobilize a wide range of ideas, insights and data. 

---

At OpenMined, we envision a different future—one where everyone can contribute to and benefit from AI.

We’re building open, federated and privacy-enhanced networks of data to make this a reality.

Sign up to learn more ↓
