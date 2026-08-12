---
title: "Homomorphic Encryption in PySyft with SEAL and PyTorch"
slug: ckks-homomorphic-encryption-pytorch-pysyft-seal
date: 2020-04-13T13:43:08
updated: 2024-12-19T19:26:56
categories: [product]
tags: [pysyft, homomorphic-encryption]
authors: [ayoub-benaissa]
cover: ./cover.jpg
coverAlt: ""
cardText: light
draft: false
legacyId: 2379
---
<!-- TODO(content): 1 unrecoverable figure(s) removed — dead Google-Docs/social paste artifacts (404 on live for years, no archive). Recreate if valuable. -->
<!-- TODO(a11y): 1 localized body image(s) have empty alt text -->



**Summary:** In this post we showcase a new tensor type that leverages the CKKS homomorphic encryption scheme implemented on the [SEAL](https://github.com/Microsoft/SEAL) Microsoft library to evaluate tensor operations on encrypted data.


## Why Homomorphic Encryption in Machine Learning?

Before diving into how to use this tensor, I would like to highlight the main use-case where homomorphic encryption (HE) has shown to be practical enough.

**Evaluating models on encrypted data:** As companies continues to develop machine learning models for different tasks, these models can sometimes be a key asset and can’t be shared publicly for different reasons, on the other end, the user wants to use these models without exposing his data. HE lets the user encrypts his data in a way that it can be computed on as if we were computing on plain data, thus he can send his encrypted data to the model owner who can evaluate his model on this encrypted data, and return an encrypted result to the user, who can later decrypts it.

<figure class="">

![](./media/om-ckks-graphic-v-01-2x.png)

</figure>

OpenMined has started to work on [TenSEAL](https://github.com/OpenMined/TenSEAL) which is a library for doing homomorphic encryption operations on tensors, so that implementing such use-case is possible. TenSEAL is a result of contributors efforts at extending the [SEAL](https://github.com/Microsoft/SEAL) Microsoft library to tensor operations, and wrap this all together to add more HE capabilities to PySyft. From the side of PySyft, you will only see torch tensors that you are already familiar with, but which implements either the CKKS or BFV schemes.

Next we will look at the new tensor type, the CKKSTensor, and show how to use it in PySyft.

## CKKSTensor

The CKKS HE scheme is best suited for machine learning applications, it supports addition and multiplication on encrypted real numbers but yield approximate results, which should be fine for such use-case. Let’s now go through a code example showing how to use the CKKSTensor which basically uses SEAL’s implementation of the CKKS scheme to encrypt, evaluate and decrypt tensors.

#### Imports and Context Creation

```python
import syft as sy
import torch as th
import syft.frameworks.tenseal as ts

# hook PyTorch to add extra functionalities like the ability to encrypt torch tensors
hook = sy.TorchHook(th)

# Generate CKKS public and secret keys
public_keys, secret_key = ts.generate_ckks_keys()
```

We are now all set to start encrypting and evaluating tensors.

**Note:** `public_keys` is actually a TenSEALContext object, a special object in TenSEAL that can hold multiple keys other than the public-key, namely the relinearization and galois keys which are public as well and serve other purposes than encrypting tensors, only the secret-key can be used to decrypt tensors.

#### Encrypting Tensors

Let’s first create a random matrix.

```python
matrix = th.tensor([[10.5, 73, 65.2], [13.33, 22, 81]])
```

Now we encrypt the matrix by specifying the encryption scheme as well as the public-key

```python
matrix_encrypted = matrix.encrypt("ckks", public_key=public_keys)
```

#### Evaluation

We can add, sub and mul encrypted tensors with both encrypted and plain torch tensors, no need for extra tools to do this, just normal torch operations.

```python
# to use for plain evaluations
t_eval = th.tensor([[1, 2.5, 4], [13, 7, 16]])
# to use for encrypted evaluations
t_encrypted = t_eval.encrypt("ckks", public_key=public_keys)

print("encrypted tensor + plain tensor")
result = matrix_encrypted + t_eval
# result is an encrypted tensor
print(result.decrypt(secret_key=secret_key))

print("encrypted tensor + encrypted tensor")
result = matrix_encrypted + t_encrypted
# result is an encrypted tensor
print(result.decrypt(secret_key=secret_key))

print("encrypted tensor - plain tensor")
result = matrix_encrypted - t_eval
# result is an encrypted tensor
print(result.decrypt(secret_key=secret_key))

print("encrypted tensor - encrypted tensor")
result = matrix_encrypted - t_encrypted
# result is an encrypted tensor
print(result.decrypt(secret_key=secret_key))

print("encrypted tensor * plain tensor")
result = matrix_encrypted * t_eval
# result is an encrypted tensor
print(result.decrypt(secret_key=secret_key))

print("encrypted tensor * encrypted tensor")
result = matrix_encrypted * t_encrypted
# result is an encrypted tensor
print(result.decrypt(secret_key=secret_key))
```

You can go further and try other tensor shapes.

## Conclusion and Future Work

This is the first step towards doing machine learning on HE encrypted data. Further steps in this project would aim at supporting more tensor operations including dot-product, matrix multiplication and convolution, thus providing the ability to evaluate neural networks on encrypted data.

If you enjoyed this and would like to join the movement toward privacy preserving, decentralized ownership of AI and the AI supply chain (data), you can do so in the following ways!

#### Star PySyft and TenSEAL on Github

The easiest way to help our community is just by starring the repositories! This helps raise awareness of the cool tools we’re building.

-   [Star PySyft](https://github.com/OpenMined/PySyft)
-   [Star TenSEAL](https://github.com/OpenMined/TenSEAL)

#### Join the Crypto Team

If you’re already a contributor to PySyft, and if you’re interested to work on crypto related use cases, you should definitely join us!

-   [Apply to the Crypto Team !](https://docs.google.com/forms/d/1T6MJ21V1lb7aEr4ilZOTYQXzxXP6KbpLumZVmTZMSuY/edit)

#### Pick our tutorials on GitHub!

We made really nice tutorials to get a better understanding of what Federated and Privacy-Preserving Learning should look like and how we are building the bricks for this to happen.

-   [Checkout the PySyft tutorials](https://github.com/OpenMined/PySyft/tree/master/examples/tutorials)
-   [Checkout the TenSEAL tutorials](https://github.com/OpenMined/TenSEAL/tree/master/tutorials)

#### Join our Slack!

The best way to keep up to date on the latest advancements is to join our community!

-   [Join slack.openmined.org](http://slack.openmined.org/)

#### Join a Code Project!

The best way to contribute to our community is to become a code contributor! If you want to start “one off” mini-projects, you can go to PySyft GitHub Issues page and search for issues marked Good First Issue.

-   [Good First Issue Tickets](https://github.com/OpenMined/PySyft/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22)

#### Donate

If you don’t have time to contribute to our codebase, but would still like to lend support, you can also become a Backer on our Open Collective. All donations go toward our web hosting and other community expenses such as hackathons and meetups!

-   [Donate through OpenMined’s Open Collective Page](https://opencollective.com/openmined)
