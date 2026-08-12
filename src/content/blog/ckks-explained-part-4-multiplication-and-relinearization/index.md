---
title: "CKKS explained, Part 4: Multiplication and Relinearization"
slug: ckks-explained-part-4-multiplication-and-relinearization
date: 2020-11-02T07:19:15
updated: 2025-05-23T17:16:42
categories: [research]
tags: [homomorphic-encryption, ckks, privacy-enhancing-technologies-pets]
authors: [daniel-huynh]
cardText: light
draft: false
legacyId: 1991
---

__****This post is part of our [Privacy-Preserving Data Science, Explained](https://blog.openmined.org/private-machine-learning-explained/) series.****__

## CKKS explained series

[Part 1, Vanilla Encoding and Decoding](https://blog.openmined.org/ckks-explained-part-1-simple-encoding-and-decoding/)  
[Part 2, Full Encoding and Decoding](https://blog.openmined.org/ckks-explained-part-2-ckks-encoding-and-decoding/)  
[Part 3, Encryption and Decryption](https://blog.openmined.org/ckks-explained-part-3-encryption-and-decryption/)  
Part 4, Multiplication and Relinearization  
[Part 5, Rescaling](https://blog.openmined.org/ckks-explained-part-5-rescaling/)

## Introduction

In the previous article [CKKS explained, Part 3: Encryption and Decryption](https://blog.openmined.org/ckks-explained-part-3-encryption-and-decryption/), we saw how one could create an homomorphic encryption scheme based on the RLWE problem, with an implementation of homomorphic addition, and ciphertext-plaintext multiplication.

While it was easy to perform ciphertext-plaintext multiplication, ciphertext-ciphertext is much more involved as we will see. Indeed, we will have many things to handle to do it properly, such as finding the right operation such that once decrypted we get the product of two ciphertexts, and managing the size of the ciphertext.

Therefore, this article will introduce the concepts of ciphertext-ciphertext multiplication and relinearization to reduce the size of the resulting ciphertext.

## Recap of basic operations

To see how we will perform ciphertext-ciphertext multiplication in CKKS, let’s recap what we saw in the previous article.

First, remember that we work on the polynomial space \\( \\mathcal{R}\_q = \\mathbb{Z}\_q\[X\]/(X^N+1) \\). We sample \\( s \\) as our secret key, then we can safely output a public key \\( p = (b,a) = (-a \\cdot s + e, a) \\) with \\( a \\) uniformly sampled on \\( \\mathcal{R}\_q \\), and \\( e \\) a small random polynomial.

Then we have \\(\\texttt{Encrypt}(\\mu,p) = c = (c\_0,c\_1) = (\\mu,0) + p = (b + \\mu,a) \\in \\mathcal{R}\_q^2\\) is the encryption operation of a plaintext \\(\\mu \\in \\mathbb{Z}\_q\[X\]/(X^N+1)\\) using the public key \\(p\\).  
To decrypt a ciphertext \\(c\\) using the secret key, we perform the following operation:  
\\(\\texttt{Decrypt}(c,s) = c\_0 + c\_1 \\cdot s = \\mu + e\\).

We then saw that it was easy to define an operation addition \\(\\texttt{CAdd}(c,c’)\\) on ciphertexts, so that once we decrypt the output of \\(\\texttt{CAdd}\\) we will approximately get the addition of the two underlying plaintexts.

The way to do this is to define \\(\\texttt{CAdd}\\) as the following:  
\\(\\texttt{CAdd}(c,c’) = (c\_0 + c\_0′, c\_1 + c\_1′) = c + c’ = c\_{add}\\)  
Indeed, if we apply the decryption operation on it we get:  
\\(\\texttt{Decrypt}(c\_{add}, s) = c\_0 + c\_0′ + (c\_1 + c\_1′) \\cdot s = c\_0 + c\_1 \\cdot s + c\_0′ + c\_1′ \\cdot s = \\texttt{Decrypt}(c,s) + \\texttt{Decrypt}(c’,s) \\approx \\mu + \\mu’\\)

Here we see that the add operation on ciphertexts is pretty straightforward, we simply need to add the two ciphertexts, and we can use the regular decryption operation to decrypt the result to get the addition of the two underlying plaintexts.

We will see that both the multiplication and the decryption operation are more complex when doing ciphertext-ciphertext multiplication.

## Ciphertext-ciphertext multiplication

So now that we saw that, we see that our goal is to find operations \\(\\texttt{CMult}\\), \\(\\texttt{DecryptMult}\\) such that for two ciphertexts \\(c, c’\\) we have:

\\(\\texttt{DecryptMult}(\\texttt{CMult}(c,c’), s) = \\texttt{Decrypt}(c,s) \\cdot \\texttt{Decrypt}(c’,s)\\).

Remember that \\(\\texttt{Decrypt}(c,s) = c\_0 + c\_1 \\cdot s\\). So if we develop the expression above we get:

\\(\\texttt{Decrypt}(c,s) \\cdot \\texttt{Decrypt}(c’,s) = (c\_0 + c\_1 s) \\cdot (c\_0′ + c\_1′ s) = c\_0 c\_0′ + (c\_0 c\_1′ + c\_0′ c\_1) s + c\_1 c\_1′ s^2  
\= d\_0 + d\_1 s + d\_2 s^2 \\)  
with \\(d\_0 = c\_0 c\_0’\\), \\(d\_1 = (c\_0 c\_1′ + c\_0′ c\_1)\\), \\(d\_2 = c\_1 c\_1’\\)

Interesting! If we think about it, evaluating \\(\\texttt{Decrypt}(c,s) = c\_0 + c\_1 s\\) can be seen as a polynomial evaluation on the secret key \\(s\\), and it is a polynomial of degree one of the form \\(c\_0 + c\_1 S\\), with \\(S\\) the polynomial variable.

So if we see the decryption operation on the product of two ciphertexts, it can be seen as the polynomial \\(d\_0 + d\_1 S + d\_2 S^2\\) of degree 2 evaluated on the secret key \\(s\\).

Therefore we see that we could use the following operations to do ciphertext-ciphertext multiplication:

-   \\(\\texttt{CMult}(c,c’) = c\_{mult} = (d\_0, d\_1, d\_2) = ( c\_0 c\_0′, c\_0 c\_1′ + c\_0′ c\_1, c\_1 c\_1′)\\)
-   \\(\\texttt{DecryptMult}(c\_{mult}, s) = d\_0 + d\_1 s + d\_2 s^2 \\)

Using such operations could work, nonetheless there is one problem: **the size of the ciphertext grew!** Indeed, while ciphertexts were usually only a couple of polynomials, here we have 3 polynomials for our ciphertext. By using the same reasoning as before, if we do nothing, to correctly decrypt the next product we will need 5 polynomials, then 9, and so on. Therefore the size of the ciphertext will grow exponentially and it will not be usable in practice if we were to define ciphertext-ciphertext multiplication like that.

We need to find a way to do multiplication without increasing the ciphertext size at each step. That’s where relinearization comes in!

## Relinearization

So we saw that we could define the multiplication between ciphertexts as the operation \\(\\texttt{CMult}(c,c’) = (d\_0, d\_1, d\_2)\\). The problem is that now, the output is a ciphertext of dimension 3, and if we keep increasing the size of the ciphertexts after each computation it will become infeasible to use in practice.

So let’s think about it, what is the problem? The problem is that we have a third term that is needed, the \\(d\_2\\) term that is used for the polynomial decryption \\(\\texttt{DecryptMult}(c\_{mult}, s) = d\_0 + d\_1.s + d\_2.s^2\\). But what if we could somehow find a way to compute the \\(d\_2.s^2\\) with only a polynomial of degree 1 as the regular decryption? Then in that case the size of the ciphertexts would be constant, they would all be only a couple of polynomials!

That’s the very essence of relinearization: finding a couple of polynomials \\((d\_0′,d\_1′) = \\texttt{Relin}(c\_{mult})\\) such that:  
\\(\\texttt{Decrypt}((d\_0′,d\_1′),s) = d\_0′ + d\_1′.s = d\_0 + d\_1.s + d\_2.s^2 = \\texttt{Decrypt}(c,s) \\cdot \\texttt{Decrypt}(c’,s)\\)  
i.e. relinearization allows to have a polynomial couple, and not triple, such that once it is decrypted using the regular decryption circuit which only needs the secret key, and not its square, we get the multiplication of the two underlying plaintexts.

Therefore, if we perform relinearization after each ciphertext-ciphertext multiplication, **we will always have ciphertexts of the same size, with the same decryption circuit !**

Now you may wonder how do we actually need to define \\(\\texttt{Relin}\\) to have such result. The idea is simple, we know that we need to have a couple of polynomials such that \\(d\_0′ + d\_1′.s = d\_0 + d\_1.s + d\_2.s^2\\). The idea is that we will define \\((d\_0′,d\_1′) = (d\_0,d\_1) + P\\) where \\(P\\) represents a couple of polynomial such that \\(\\texttt{Decrypt}(P,s) = d\_2.s^2\\).

This way, when we evaluate the decryption circuit on \\((d\_0′,d\_1′)\\) we get:  
\\(\\texttt{Decrypt}((d\_0′,d\_1′),s) = \\texttt{Decrypt}((d\_0,d\_1),s) + \\texttt{Decrypt}(P,s) = d\_0 + d\_1.s + d\_2.s^2\\)

One way to do this, is to provide an **evaluation key**, which will serve to compute \\(P\\). Let \\(\\mathrm{evk} = \\left(-a\_0.s + e\_0 + s^2, a\_0\\right)\\), with \\(e\_0\\) a small random polynomial, and \\(a\_0\\) an uniformly sampled polynomial on \\(\\mathcal{R}\_q\\). Then if we apply \\(\\texttt{Decrypt}(\\mathrm{evk},s) = e\_0 + s^2 \\approx s^2\\). That’s good! We see that we can publicly share the evaluation key to the party performing computation, as the secret will be hard to extract based on the RLWE problem, and it can be used to find the square term.

So one possible candidate for \\(P\\), the ciphertext which should decrypt to \\(d\_2.s^2\\) could simply be \\(P = d\_2.\\mathrm{evk} = \\left(d\_2.(-a\_0 + e\_0 + s^2), d\_2.a\_0\\right)\\). Indeed as we saw we have \\(\\texttt{Decrypt}(P,s) = d\_2.s^2 + d\_2.e\_0\\). So can we do as usual, and consider that \\(d\_2.s^2 + d\_2.e\_0 \\approx d\_2.s^2\\)?

Unfortunately we cannot do that because the \\(d\_2.e\_0\\) term is much bigger than the usual noise we have. If you noticed before, we allowed the approximation of the result because the error polynomial was small, such as a sum of small polynomials that would not affect too much the result for instance. The problem here is that \\(d\_2\\) will be big, as it is \\(d\_2 = c\_1.c\_1’\\) where each \\(c\_1\\) includes a polynomial \\(a\\) uniformly sampled on \\(\\mathcal{R}\_q\\), therefore it is much bigger than the small error polynomials we usually deal with.

So how do we deal with this in practice? The trick is to modify a bit the evaluation key, and define it as \\(\\mathrm{evk} = \\left(-a\_0.s + e\_0 + p.s^2, a\_0\\right) \\bmod p.q\\), with \\(p\\) a big integer, and \\(a\_0\\) uniformly sampled from \\(\\mathcal{R}\_{p.q}\\). The idea here is that we will divide by \\(p\\) to reduce the noise induced by the multiplication with \\(d\_2\\), so in the end we have:  
\\(P = \\left\\lfloor p^{-1} \\cdot d\_2 \\cdot \\mathrm{evk} \\right\\rceil \\bmod q\\), which means we will divide by \\(p\\) and round it to the nearest integer, and work with modulo \\(q\\) (and not \\(p.q\\)).

Well at last we finally have our candidate! So to define the relinearization, we will need an evaluation key (which can be made public without risk), and we define it as:  
\\(\\texttt{Relin}((d\_0,d\_1,d\_2), \\mathrm{evk}) = (d\_0,d\_1) + \\left\\lfloor p^{-1} \\cdot d\_2 \\cdot \\mathrm{evk} \\right\\rceil\\)  
So if we have two ciphertexts \\(c,c’\\), and we want to multiply them (possibly several times) then decrypt the result, the workflow would be:

1.  Multiply them: \\(c\_{mult} = \\texttt{CMult}(c,c’) = (d\_0,d\_1,d\_2)\\)
2.  Relinearize it: \\(c\_{relin} = \\texttt{Relin}((d\_0,d\_1,d\_2), \\mathrm{evk})\\)
3.  Decrypt the output: \\(\\mu\_{mult} = \\texttt{Decrypt}(c\_{relin}, s) \\approx \\mu \\cdot \\mu’\\)

I only gave the overall idea here, but if you are interested to know the details, I would recommend reading the explanation in the paper [“Somewhat Practical Fully Homomorphic Encryption”](https://eprint.iacr.org/2012/144.pdf).

So now we know how to multiply two ciphertexts together, and keep their size constant. That’s great! While you might think it’s over, we will see that there is one last step to do to have an homomorphic encryption scheme: rescaling. We will see in the next article what is rescaling and how it can be done, before coding everything ourselves!
