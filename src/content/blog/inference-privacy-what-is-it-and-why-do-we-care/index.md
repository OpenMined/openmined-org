---
title: "Inference privacy: what is it, and why do we care?"
slug: inference-privacy-what-is-it-and-why-do-we-care
date: 2020-04-11T01:17:45
updated: 2024-12-09T21:00:03
categories: [research]
tags: [privacy-preserving-machine-learning]
authors: [fatemehsadat-mireshghallah]
draft: false
legacyId: 2381
---
<!-- TODO(content): 7 unrecoverable figure(s) removed — dead Google-Docs/social paste artifacts (404 on live for years, no archive). Recreate if valuable. -->


_When you ask your home voice assistant to check the weather, it is listening to and saving not only your voice but also everything else that surrounds you. If other people are talking in the background, it hears the conversation. If someone is knocking at your door, it hears that too. All of this excess information sent to the third party for processing_ — _but it doesn’t have to be this way. In this blog post, we discuss a new privacy-preserving mechanism for inference, which relies on noise addition to provide privacy. This mechanism is called_ [_Cloak_](https://arxiv.org/abs/2003.12154) _\[1\]._


### What is Inference Privacy?

Privacy is a huge concern in many different aspects of our lives. We use many devices on a daily basis that are continuously collecting information, and sending them to third-party service providers to process, and return some results to us. For example, when you call out your voice assistant at home and ask what the weather is like, it is listening to and saving not only your voice but also everything else that surrounds you. If other people are talking in the background, it hears the conversation. If someone is knocking at your door, it hears that too. There is all this excess information sent to the third party for processing.


Another example is when you have some pictures, and you want to run a service on them, for instance, detect smiles or find particular people in them. You upload these images on the cloud, where a service provider carries out these tasks for you. Again, here, you are providing much more information than what is necessary for your task. You are giving away your environment, the time of the day, the clothes you are wearing and the activities you were engaged in. Even in the faces themselves, you do not always need all the features to carry out a certain task. For smile detection, for instance, you only need the mouth. In both these cases, the executed task is inference, where an already trained deployed model produces predictions based on the input. We call the privacy of clients and users in these cases inference privacy.

### How does it work?

There is much less work regarding inference privacy (~20 papers) than there is on the privacy of training the models (over 600 papers). Most of these works rely on some type of encryption, which provides very high levels of privacy and accuracy, but slows down the runtime of the task. In the rest of this blog post, we want to discuss a new privacy-preserving mechanism for inference, which relies on noise addition to provide privacy. This mechanism is called [Cloak](https://arxiv.org/abs/2003.12154) \[1\]. Cloak leverages the 3-dimensional trade-off space of computation, utility/accuracy, and privacy. We can see a depiction of this below. Cloak **discovers** **what features the pre-trained DNN relies on for decision making**, and automatically calibrates the intensity of the noise to those features based on their importance. Least important  features end up with highest intensity of noise.  


If we were to add some random noise to the input of the model, we would incur a huge loss in the utility of the model. So instead, we train noise distributions that have three important features: 1) incur a minimal loss to the model utility (the neural network is robust to this noise) 2) Decrease the amount of information in the input images, and try to only keep conducive features 3) Adhere to the minimum required noise. To create a non-sensitive representation of the input, we take independent samples from a Laplace set of distributions whose parameters (location and scale parameters, similar to mean and variance in Gaussian distribution) are found through the training. We then add this noise to the input, to get a noisy representation. Below you can see an illustration of this sampling.


So the problem boils down to learning the locations (M) and scales (B) tensors. If we learn the scales tensor through gradient descent, then it could take any real value. However, we have to apply some constraint (for example the scales can never be negative, and we should also adhere to a minimum required noise). For this, we reparameterize tensor B and introduce the trainable tensor P, instead. We then write B as:


You can find more information about the mathematics of this reparameterization in the paper. We then have to define a loss function to optimize, and find the parameters M and B. Our loss function has two goals: 1) Increase the intensity of the noise as much as possible, to obfuscate non-conducive information. 2) Keep the utility of the model intact. We have two terms in the loss function to correspond to these two goals. The coefficient lambda is a knob that provides a trade-off between privacy and utility. You can see the loss function below:


We applied Cloak to four sets of benchmark datasets. We can see the results for the CelebA dataset below:


Here, the main inference task is smile detection, and we try to remove as much extra, non-conducive information as possible by increasing noise intensity.  The first row shows the intensity of the noise applied to each pixel. Darker colours mean noise with higher variance. As we have increased the amount of noise (tune the lambda coefficient to give more weight to privacy), more pixels are obfuscated. The next two rows show two examples of noisy representations, as the noise increases. It is noteworthy that the accuracy of the model fed normal (not noisy) representations on the smile detection task is 91.8%, and the accuracy of the model fed the rightmost noisy representations is 86.9%. We offer further evaluation and analysis such as mutual information reduction and an adversary trying to infer sensitive information, which you can see in the paper.

### Read the paper here:

\[1\] [Mireshghallah, F., Taram, M., Jalali, A., Elthakeb, A.T., Tullsen, D. and Esmaeilzadeh, H., 2020. A Principled Approach to Learning Stochastic Representations for Privacy in Deep Neural Inference. _arXiv preprint arXiv:2003.12154_.](https://arxiv.org/abs/2003.12154)
