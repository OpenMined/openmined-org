---
title: "CKKS explained, Part 3: Encryption and Decryption"
slug: ckks-explained-part-3-encryption-and-decryption
date: 2020-09-14T06:41:59
updated: 2025-05-23T16:42:43
categories: [research]
tags: [homomorphic-encryption, ckks, privacy-enhancing-technologies-pets]
authors: [daniel-huynh]
cardText: light
draft: false
legacyId: 2064
---

__****This post is part of our [Privacy-Preserving Data Science, Explained](https://blog.openmined.org/private-machine-learning-explained/) series.****__

## CKKS explained series

[Part 1, Vanilla Encoding and Decoding](https://blog.openmined.org/ckks-explained-part-1-simple-encoding-and-decoding/)  
[Part 2, Full Encoding and Decoding](https://blog.openmined.org/ckks-explained-part-2-ckks-encoding-and-decoding/)  
Part 3, Encryption and Decryption  
[Part 4, Multiplication and Relinearization](https://blog.openmined.org/ckks-explained-part-4-multiplication-and-relinearization/)  
[Part 5, Rescaling](https://blog.openmined.org/ckks-explained-part-5-rescaling/)

## Introduction

In the previous article [CKKS explained, Part 2: full encoding and decoding](https://blog.openmined.org/ckks-explained-part-2-ckks-encoding-and-decoding/), we saw how we could implement CKKS’s encoder and decoder, which enabled us to transform vectors to polynomials and vice-versa. This step was necessary as we will see that using polynomials is much more efficient for building an homomorphic encryption scheme than using vectors directly.

We will see in this article how we can use hard problems, such as **LWE** or **RLWE** to build an approximate homomorphic encryption scheme. CKKS uses approximate arithmetic instead of exact arithmetic, in the sense that once we finish computation we might get a slightly different result than if we did the computation directly. This means that if you encrypt 2 and 3, add their ciphertexts, and decrypt you might get something like 4.99 or 5.01 but not 5. Other schemes such as BFV are exact, which mean they will yield exactly 5.

Why use CKKS then ? CKKS is more suited for arithmetic on real numbers, where we can have approximate but close results, while BFV is more suited for arithmetic on integers.

We will see in this article how to implement the encryption and decryption for an approximate arithmetic homomorphic encryption scheme using LWE and RLWE.

## Learning with Error

CKKS is a public key encryption scheme, where a secret key and a public key are generated. While the public key is used for encryption and can be shared, the private key is used for decryption and must be kept secret.

The foundation of CKKS, and many other homomorphic encryption schemes, is the **Learning With Error** (LWE) problem, which was initially introduced in the paper [On lattices, learning with errors, random linear codes, and cryptography](https://cims.nyu.edu/~regev/papers/qcrypto.pdf) by Regev. The LWE problem is to distinguish noisy pairs of the form \\( (a\_i, b\_i) = (a\_i, \\langle a\_i, s \\rangle + e\_i) \\) from truly random ones in \\( \\mathbb{Z}\_q^n \\times \\mathbb{Z}\_q \\). Here \\( a\_i, s \\in \\mathbb{Z}\_q^n \\), \\( a\_i \\) is uniformly sampled, \\( s \\) is our secret, and the \\( e\_i \\in \\mathbb{Z}\_q \\) are small noises, typically gaussians, used to make the problem harder. If we did not introduce the \\( e\_i \\), the problem would have been much easier to solve, as we could use Gaussian elimination to solve the linear system.

The LWE problem is known to be as hard as worst case lattice problems, which are currently secure against attacks from quantum computers. Therefore, we can exploit the fact that finding a secret \\( s \\) from pairs of \\( (a\_i, \\langle a\_i, s \\rangle + e\_i) \\) is hard, and build a cryptosystem upon this.

Suppose we have generated a secret key \\( s \\in \\mathbb{Z}\_q^n \\) which we keep secret, and publish \\( n \\) pairs of the type \\( (a\_i, \\langle a\_i, s \\rangle + e\_i) \\), which can be written in matrix form as \\( (A, A \\cdot s + e) \\) with \\( A \\in \\mathbb{Z}\_q^{n \\times n}, e \\in \\mathbb{Z}\_q^n \\). As the LWE problem states, it is hard to recover the secret key from this couple, thus we can use that to create a public key.

Indeed we will use \\( p = (-A \\cdot s + e, A) \\) as our public key, which can be used publicly as the secret key is hard to extract from it. We chose to store \\( -A \\cdot s \\) instead of \\( A \\cdot s \\) for convenience as we will see later, but it doesn’t change the problem.

Then to encrypt and decrypt a message \\( \\mu \\in \\mathbb{Z}\_q^n \\) using the public and secret key, we can use the following scheme:

-   Encryption of \\( \\mu \\) using \\( p \\): output \\( c = (\\mu, 0) + p = (\\mu – A \\cdot s + e, A) = (c\_0, c\_1) \\).
-   Decryption of \\( c \\) using \\( s \\): output \\( \\tilde{\\mu} = c\_0 + c\_1 \\cdot s = \\mu – A \\cdot s + e + A \\cdot s = \\mu + e \\approx \\mu \\)

So for the encryption phase, we take the public key, and use it to mask our message \\( \\mu \\). The message is thus hidden in the first coordinate of the ciphertext with a the mask \\( -A \\cdot s \\). Remember that \\( A \\) is sampled uniformly, so it will indeed mask \\( \\mu \\) effectively. To remove it, we can use the second coordinate of \\( c \\), which only stores \\( A \\) and combine it with the secret key \\( s \\) to obtain the decryption which is \\( \\mu + e \\). Notice here that we do not exactly get the original message \\( \\mu \\) but \\( \\mu \\) plus some noise \\( e \\), which is why we say we have an approximate arithmetic scheme. If \\( e \\) is small enough, then the decryption will be close to the original \\( \\mu \\).

So we have seen here how to use the LWE problem to build a public crypto scheme that is secure against quantum attacks. The problem with the implementation above, is that while the secret key has size \\( \\mathcal{O}(n) \\), the public key has size \\( \\mathcal{O}(n^2) \\) due to the matrix \\( A \\) and computations will also require \\( \\mathcal{O}(n^2) \\) operations. Because \\( n \\) will dictate the security of our scheme, if we use LWE to construct our scheme, it will be too inefficient in practice as the \\( \\mathcal{O}(n^2) \\) size of keys and complexity will make it too impractical.

## Ring Learning with Error

That is why we will consider the Ring Learning With Error problem introduced in [On Ideal Lattices and Learning with Errors Over Rings](https://eprint.iacr.org/2012/230.pdf), which is a variant of LWE but on rings. Instead of working with vectors in \\( \\mathbb{Z}\_q^n \\), we will work on polynomials in \\( \\mathbb{Z}\_q\[X\]/(X^N + 1) \\) (we suppose here that \\( N \\) is a power of 2). So now we draw \\( a \\), \\( s \\), and \\( e \\) from \\( \\mathbb{Z}\_q\[X\]/(X^N + 1) \\), where \\( a \\) is still sampled uniformly, \\( s \\) is a small secret polynomial, and \\( e \\) is a small noisy polynomial. Switching to RLWE has two main advantages:

-   The key size is no longer quadratic but linear, as we now output the public key \\( p = (-a \\cdot s + e, a) \\), where \\( a \\cdot s \\) denotes the polynomial product of \\( a \\) with \\( s \\). Because all operations are done between polynomials, both the private and public keys are of size \\( \\mathcal{O}(n) \\).
-   Multiplications are done on polynomials, therefore it can be done with a complexity of \\( \\mathcal{O}(n \\log(n)) \\) using [Discrete Fourier Transform for polynomial multiplication](http://web.cs.iastate.edu/~cs577/handouts/polymultiply.pdf), instead of \\( \\mathcal{O}(n^2) \\) because we had to do matrix vector multiplication.

Therefore by using RLWE instead of LWE, we will much smaller keys, and operations will be even faster, so the preceding scheme becomes much more practical. Moreover, the RLWE is still a hard problem and provides strong security guarantees, thus using RLWE still provides a secure scheme.

We know understand why it was important to work with polynomials because they provide the basis for an efficient and secure scheme. Therefore you can understand now why we had to go through all the trouble of converting our vectors into polynomials of \\( \\mathbb{Z}\_q\[X\]/(X^N+1) \\) and vice-versa, as we can now leverage the algebraic structure of polynomial rings.

## Homomorphic operations

Now the have seen why we work on polynomials of \\( \\mathbb{Z}\_q\[X\]/(X^N+1) \\), and how we could get an encryption scheme based on this, let’s see how we can define addition and multiplication on ciphertexts to have an homomorphic encryption scheme.

So we said that we have a secret \\( s \\), and a public key \\( p = (b,a) = (-a \\cdot s + e, a) \\). To encrypt a message \\( \\mu \\) we simply output \\( c = (\\mu + b, a) \\), and to decrypt it with \\( s \\) we evaluate \\( c\_0 + c\_1 \\cdot s \\) which will approximately gives the original message.

### Addition

Now suppose we have two messages, \\( \\mu \\) and \\( \\mu’ \\) and that we encrypt them into \\( c = (c\_0,c\_1) \\) and \\( c’ = (c\_0′,c\_1′) \\). Then \\( c\_{add} = c + c’ = (c\_0 + c\_0′,c\_1 + c\_1′) \\) is a correct encryption of \\( \\mu + \\mu’ \\), i.e. when we decrypt it using \\( s \\) we get (approximatively) \\( \\mu + \\mu’ \\).

Indeed, the decryption mechanism of \\( c\_{add} \\) yields \\( c\_{add,0} + c\_{add,1} \\cdot s = c\_0 + c\_0′ + (c\_1 + c\_1′) \\cdot s = c\_0 + c\_1 \\cdot s + c\_0′ + c\_1′ \\cdot s = \\) \\( \\mu + \\mu’ + 2 e \\approx \\mu + \\mu’ \\) because we said that \\( e \\) is negligible.

What this means is that if you add ciphertexts, and you decrypt them, you will get the addition of the plaintexts! This means that with this simple scheme, you can allow someone to perform additions on encrypted data, and the user can still decrypt it and get the correct result. This is our first step toward an homomorphic encryption scheme.

### Multiplication

Nonetheless, we still need to define the multiplication on ciphertexts, which is more involved. Indeed, our goal will be to find a ciphertext \\( c\_{mult} \\) such that when we decrypt it with the secret key \\( s \\), we get the product of the plaintexts.

Because multiplying two ciphertexts is more complex, we will first focus now on multiplying a ciphertext with a plaintext, and see how to do multiplication between ciphertexts in a later article.

Suppose we have a plaintext \\( \\mu \\), encrypted into the ciphertext \\( c = (c\_0, c\_1) \\) and a plaintext \\( \\mu’ \\). Then to obtain the ciphertext of the multiplication, we simply need to output \\( c\_{mult} = (\\mu’ \\cdot c\_0, \\mu’ \\cdot c\_1) \\).

Indeed, when decrypting \\( c\_{mult} \\) we get \\( \\mu’ \\cdot c\_0 + \\mu’ \\cdot c\_1 \\cdot s = \\mu’ \\cdot (c\_0 + c\_1 \\cdot s) = \\mu’ \\cdot (\\mu + e) = \\mu’ \\cdot \\mu + \\mu’ \\cdot e \\approx \\mu’ \\cdot \\mu \\).

Therefore with these implementations of addition and multiplication, we have seen that it is possible to encrypt some data, perform operations on it, so that once we decrypt it, we have the same result as if we performed computation on plaintext data.

Because we have a few more concepts to address, like ciphertext-ciphertext multiplication, relinearization, and rescaling, we will not cover the code implementation yet. Once we will have all the building blocks, we will put everything together to have an end-to-end approximate homomorphic encryption scheme, similar to CKKS!

So I hope you understood how to build an homomorphic encryption scheme using RLWE, and next stop, ciphertext-to-ciphertext multiplication !
