---
title: "Differential Privacy from Program Analysis Perspective"
slug: differential-privacy-from-program-analysis-perspective-an-interview-with-yuxin-wang-a-rising-star-in-programming-analysis-of-differential-privacy
date: 2021-05-19T13:57:00
updated: 2024-12-09T19:21:35
categories: [research]
tags: [differential-privacy]
authors: [wenhui-zhang]
draft: false
legacyId: 1700
---
<!-- TODO(a11y): 1 localized body image(s) have empty alt text -->


‌             ‌

An interview with Yuxin Wang, a rising star in programming analysis of differential privacy.

****Editors: Wenhui Zhang, Yizheng Jiao, Yuxin Wang, Bala Priya****

<figure class="">

![](./media/screenshot-from-2021-05-19-09-37-30.png)

</figure>

                           Google Scholar: [@yuxinwang](https://scholar.google.com/citations?user=PLhQliEAAAAJ&hl=en) | LinkedIn: [@yuxinwangcs](https://www.linkedin.com/in/yuxinwangcs/)

Differential Privacy is a big and hot topic these years. Ever since Dwork et al \[1\] proposed Differential Privacy as a notion to quantify privacy leakage, there have been works that try to propose new algorithms that release different kinds of information while satisfying differential privacy.We had an interview with Yuxin Wang, a 4th year Ph.D. student at Pennsylvania State University**,** who focuses on verification and program analysis of differential privacy.

**Hi, Yuxin, why don’t we start with introducing the topic you are working on?**

> I mainly work on **program analysis of differential privacy,** including verification, violation detection, and program synthesis of algorithms that are related to differential privacy.

**As a researcher working in Differential Privacy for so many years, do you mind sharing your insights on what privacy means from your perspective?**

> I think privacy means that information about **you** stays yours. In other words, the information that can **identify** you should remain private, such as SSN, driver license number, medical records, or your name, anything that reveals the information that has a connection to you.

**So, put it together, do you mind giving us an example of Differential Privacy?**

> To put it simply, suppose we have a database that has your information, denoted as D1, and the other one without your data denoted as D2. A mechanism M is differentially private if the outputs of M(D1) and M(D2) are “roughly” the same. This is sometimes referred to as “I could have opted out”, meaning that it’s hard to judge only from the outputs of the algorithm if your data is in the database. Interested readers can refer to \[1\] for a full definition.

**Why is differential privacy important? Actually, this question can be made broader: Why is privacy important?**

> I think recent incidents from Facebook and Cambridge Analytica showed us that the breach of individual privacy can have a great negative impact on the society. On the bright side, this raises the awareness of the importance of privacy, so we have seen many actions taken on the legal side such as GDPR and other laws for privacy protections.

**How is differential privacy enforced in programming languages?**

> In academia, there have been several lines of works that aim at automatically verify / violation detection.

**Could you introduce a few interesting works in the field of program analysis of differential privacy?**

> Sure, in the past years we have seen many works on **Program Verification**. One line of work uses a proving technique called Randomness Alignment, it is a simple yet powerful technique and a few tools have been developed \[7,10-11\] that are capable of proving a variety of fundamental differential privacy algorithms.

> Besides alignment-based proofs, probabilistic couplings and liftings \[12-14\] have also been used in language-based verification of differential privacy. Most notably, Albarghouthi and Hsu \[3\] proposed the first automated tool capable of generating coupling proofs for complex mechanisms. Coupling proofs are known to be more general than alignment-based proofs, while alignment-based proofs are more light-weight.

> There is also an early line of work \[15-19\] that uses (variations of) relational Hoare logic and linear indexed types to derive differential privacy guarantees.

> On the **Violation Detection** side, Ding et al. \[20\] and Bichsel et al. \[21\] proposed counterexample generators that rely on sampling – running an algorithm hundreds of thousands of times to estimate the output distribution of mechanisms (this information is then used to find counterexamples). Our recent work \[7\] uses static analysis to detect violations without actually running the code.

> Recently there have been works on **Program Synthesis** (i.e., take a non-private base algorithm and make it differentially private), such as (1) KOLAHAL \[5\] takes a sketch program with unknown noise scales but known locations, then try to find the good values for the scales by leveraging the counterexamples generated by \[2\] and solving a continuous optimization approximation problem; (2) an earlier synthesizer \[6\] relies on user-supplied examples and sensitivity-directed Differential Privacy analysis language called DFuzz \[5\] to automatically synthesize DFuzz programs that satisfy differential privacy.

**There are some ongoing research works on differential privacy-preserving databases. Do you think program analysis could help with building such systems?**

> Programmers write programs that they claim to satisfy differential privacy, where they often accompany the claim with mathematical proof. However, manual proof is hard and error-prone, as shown in \[9\], even differential privacy experts can make mistakes. So automated verification can help in the development of differentially private algorithms and even provide insights for new algorithms.

**How to verify if differential privacy is enforced or violated?**

> Generally speaking it requires a proof (either mathematical or machine-generated from the verification tools) showing differential privacy is satisfied or statistical evidence that differential privacy is likely violated.

Thanks Yuxin for sharing time with us and explaining all the details. If you have more questions please feel free to contact **Yuxin.** Hope you enjoyed this session, and more of you will join the workforce and movement of differential privacy-preserving systems, i.e., **OpenMined**.

> Thanks! If you like to discuss anything related to Differential Privacy, feel free to reach me at yxwang@psu.edu.

## References and Further Reading

> \[1\] Cynthia Dwork, Aaron Roth, et al. The algorithmic foundations of differential privacy. Theoretical Computer Science, 9(3–4):211–407, 2014.

> \[2\] Zeyu Ding, Yuxin Wang, Guanhong Wang, Danfeng Zhang, and Daniel Kifer. Detecting violations of differential privacy. In Proceedings of the 2018 ACM SIGSAC Conference on Computer and Communications Security, CCS  ́18, pages 475–489, New York, NY, USA, 2018. ACM.

> \[3\] Zeyu Ding, Yuxin Wang, Danfeng Zhang, and Daniel Kifer. Free gap information from the differentially private sparse vector and noisy max mechanisms. PVLDB, 13(3):293–306, 2019.

> \[4\] Marco Gaboardi, Andreas Haeberlen, Justin Hsu, Arjun Narayan, and Benjamin C. Pierce. Linear dependent types for differential privacy. In Proceedings of the 40th Annual ACM SIGPLAN-SIGACT Symposium on Principles of Programming Languages, POPL ’13, pages 357–370, New York, NY, USA, 2013. ACM.

> \[5\] S. Roy, J. Hsu, and A. Albarghouthi. Learning differentially private mechanisms. In IEEE Symposium on Security and Privacy (SP), pages 1033–1046, Los Alamitos, CA, USA, may 2021. IEEE Computer Society.

> \[6\] Calvin Smith and Aws Albarghouthi. Synthesizing differentially private programs. Proc. ACM Program. Lang., 3(ICFP), July 2019.

> \[7\] Yuxin Wang, Zeyu Ding, Daniel Kifer, and Danfeng Zhang. CheckDP: An automated and integrated approach for proving differential privacy or finding precise counterexamples. In Proceedings of the 2020 ACM SIGSAC Conference on Computer and Communications Security, CCS ’20, page 919–938, New York, NY, USA, 2020. Association for Computing Machinery.

> \[8\] Jun Zhang, Xiaokui Xiao, and Xing Xie. Privtree: A differentially private algorithm for hierarchical decompositions. In Proceedings of the 2016 International Conference on Management of Data, pages 155–170, 2016.

> \[9\] Lyu, Min, Dong Su, and Ninghui Li. “Understanding the sparse vector technique for differential privacy.” arXiv preprint arXiv:1603.01699 (2016).

> \[10\] Danfeng Zhang and Daniel Kifer. 2017. LightDP: Towards Automating Differential Privacy Proofs. In Proceedings of the 44th ACM SIGPLAN Symposium on Principles of Programming Languages (Paris, France) (POPL 2017). ACM, New York, NY, USA, 888–901.

> \[11\] Yuxin Wang, Zeyu Ding, Guanhong Wang, Daniel Kifer, and Danfeng Zhang. 2019. Proving Differential Privacy with Shadow Execution. In Proceedings of the 40th ACM SIGPLAN Conference on Programming Language Design and Implementation (Phoenix, AZ, USA) (PLDI 2019). ACM, New York, NY, USA, 655–669. https: //doi.org/10.1145/3314221.3314619

> \[12\] Aws Albarghouthi and Justin Hsu. 2017. Synthesizing Coupling Proofs of Differ- ential Privacy. Proceedings of ACM Programming Languages 2, POPL, Article 58 (Dec. 2017), 30 pages.

> \[13\] Gilles Barthe, Noémie Fong, Marco Gaboardi, Benjamin Grégoire, Justin Hsu, and Pierre-Yves Strub. 2016. Advanced Probabilistic Couplings for Differential Privacy. In Proceedings of the 2016 ACM SIGSAC Conference on Computer and Communications Security (Vienna, Austria) (CCS ’16). ACM, New York, NY, USA, 55–67.

> \[14\] Gilles Barthe, Marco Gaboardi, Benjamin Grégoire, Justin Hsu, and Pierre-Yves Strub. 2016. Proving Differential Privacy via Probabilistic Couplings. In Proceed- ings of the 31st Annual ACM/IEEE Symposium on Logic in Computer Science (New York, NY, USA) (LICS ’16). ACM, New York, NY, USA, 749–758.

> \[15\] Gilles Barthe, Marco Gaboardi, Emilio Jesús Gallego Arias, Justin Hsu, César Kunz, and Pierre-Yves Strub. 2014. Proving Differential Privacy in Hoare Logic. In Proceedings of the 2014 IEEE 27th Computer Security Foundations Symposium (CSF ’14). IEEE Computer Society, Washington, DC, USA, 411–424.

> \[16\] Gilles Barthe, Boris Köpf, Federico Olmedo, and Santiago Zanella Béguelin. 2012. Probabilistic Relational Reasoning for Differential Privacy. In Proceedings of the 39th Annual ACM SIGPLAN-SIGACT Symposium on Principles of Programming Languages (Philadelphia, PA, USA) (POPL ’12). ACM, New York, NY, USA, 97–110.

> \[17\] Gilles Barthe and Federico Olmedo. 2013. Beyond Differential Privacy: Compo- sition Theorems and Relational Logic for f-divergences Between Probabilistic Programs. In Proceedings of the 40th International Conference on Automata, Lan- guages, and Programming – Volume Part II (Riga, Latvia) (ICALP’13). Springer- Verlag, Berlin, Heidelberg, 49–60.

> \[18\] Marco Gaboardi, Andreas Haeberlen, Justin Hsu, Arjun Narayan, and Benjamin C. Pierce. 2013. Linear Dependent Types for Differential Privacy. In Proceedings of the 40th Annual ACM SIGPLAN-SIGACT Symposium on Principles of Programming Languages (Rome, Italy) (POPL ’13). ACM, New York, NY, USA, 357–370. https: //doi.org/10.1145/2429069.2429113

> \[19\] Jason Reed and Benjamin C. Pierce. 2010. Distance Makes the Types Grow Stronger: A Calculus for Differential Privacy. In Proceedings of the 15th ACM SIG- PLAN International Conference on Functional Programming (Baltimore, Maryland, USA) (ICFP ’10). ACM, New York, NY, USA, 157–168. https://doi.org/10.1145/ 1863543.1863568

> \[20\] Zeyu Ding, Yuxin Wang, Guanhong Wang, Danfeng Zhang, and Daniel Kifer. 2018. Detecting Violations of Differential Privacy. In Proceedings of the 2018 ACM SIGSAC Conference on Computer and Communications Security (Toronto, Canada) (CCS ’18). ACM, New York, NY, USA, 475–489.

> \[21\] Benjamin Bichsel, Timon Gehr, Dana Drachsler-Cohen, Petar Tsankov, and Martin Vechev. 2018. DP-Finder: Finding Differential Privacy Violations by Sampling and Optimization. In Proceedings of the 2018 ACM SIGSAC Conference on Computer and Communications Security (Toronto, Canada) (CCS ’18). ACM, New York, NY, USA, 508–524.
