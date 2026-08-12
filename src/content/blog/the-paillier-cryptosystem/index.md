---
title: "What is the Paillier cryptosystem?"
slug: the-paillier-cryptosystem
date: 2020-07-09T20:27:44
updated: 2025-06-06T22:26:45
categories: [research]
tags: [homomorphic-encryption]
authors: [will-clark]
cardText: light
draft: false
legacyId: 2155
---

__****This post is part of our [Privacy-Preserving Data Science, Explained](https://blog.openmined.org/private-machine-learning-explained/) series.****__

This post introduces the Paillier cryptosystem, which is a partial homomorphic encryption scheme. In a subsequent post we’ll see how this can be used as the basis for a private set intersection protocol.

## Homomorphic encryption

[Homomorphic encryption](https://en.wikipedia.org/wiki/Homomorphic_encryption) is a form of encryption which allows you to perform mathematical or logical operations on the encrypted data. For example, suppose we have two numbers \\(m\_1\\) and \\(m\_2\\) and we encrypt those numbers using some [public key encryption scheme](https://en.wikipedia.org/wiki/Public-key_cryptography) with a public key \\(pub\\) and a private key \\(priv\\). We get two ciphertexts \\(c\_1 = E\_{pub}(m\_1)\\) and \\(c\_2 = E\_{pub}(m\_2)\\). Normally, encryption aims to make all encrypted numbers indistinguishable from random numbers for anyone who does not have the private key required for decryption.

However with homomorphic encryption, some relationships are preserved. For example, if we have a homomorphic encryption scheme which enables addition, there will be a function \\(add\\) which anyone can perform on \\(c\_1\\) and \\(c\_2\\) such that the result, \\(add\_{pub}(c\_1, c\_2)\\), will decrypt to the sum of \\(m\_1\\) and \\(m\_2\\):

\\\[ D\_{priv}(add\_{pub}(E\_{pub}(m\_1), E\_{pub}(m\_2))) = m\_1 + m\_2 \\\]

Note that the \\(add\\) function will not necessarily be _literal_ addition, just whichever function plays the role described above, according to the relevant homomorphic encryption scheme.

There have been partial homomorphic encryption schemes for quite a while, where a limited number of operations can be performed on encrypted data, for example only addition or only multiplication. Fully homomorphic encryption schemes have been developed over the last decade or so, which support _arbitrary computations_ on encrypted data.

The [Paillier cryptosystem](https://en.wikipedia.org/wiki/Paillier_cryptosystem), invented by Pascal Paillier in 1999, is a partial homomorphic encryption scheme which allows two types of computation:

-   addition of two ciphertexts
-   multiplication of a ciphertext by a plaintext number

## Public key encryption scheme

The basic public key encryption scheme has three stages:

1.  generate a public-private key pair
2.  encrypt a number
3.  decrypt a number

### Helper functions

1.  \\(\\mathrm{gcd}(x, y)\\) outputs the greatest common divisor of \\(x\\) and \\(y\\).
2.  \\(\\mathrm{lcm}(x, y)\\) outputs the least common multiple of \\(x\\) and \\(y\\).

### Key generation

Key generation works as follows:

1.  Pick two large prime numbers \\(p\\) and \\(q\\), randomly and independently. Confirm that \\(\\mathrm{gcd}(pq, (p-1)(q-1))\\) is \\(1\\). If not, start again.
2.  Compute \\(n = pq\\).
3.  Define function \\(L(x) = \\frac{x – 1}{n}\\).
4.  Compute \\(\\lambda\\) as \\(\\mathrm{lcm}(p-1, q-1)\\).
5.  Pick a random integer \\(g\\) in the set \\(\\mathbb{Z}^\*\_{n^2}\\) (integers between 1 and \\(n^2\\)).
6.  Calculate the [modular multiplicative inverse](https://en.wikipedia.org/wiki/Modular_multiplicative_inverse) \\(\\mu = \\left(L(g^\\lambda \\bmod n^2)\\right)^{-1} \\bmod n\\). If \\(\\mu\\) does not exist, start again from step 1.
7.  The public key is \\((n, g)\\). Use this for encryption.
8.  The private key is \\(\\lambda\\). Use this for decryption.

### Encryption

Encryption can work for any \\(m\\) in the range \\(0 \\leq m < n\\):

1.  Pick a random number \\(r\\) in the range \\(0 < r < n\\).
2.  Compute ciphertext \\(c = g^m \\cdot r^n \\bmod n^2\\).

### Decryption

Decryption presupposes a ciphertext created by the above encryption process, so that \\(c\\) is in the range \\(0 < c < n^2\\):

1.  Compute the plaintext \\(m = L(c^\\lambda \\bmod n^2) \\cdot \\mu \\bmod n\\).

(Reminder: we can always recalculate \\(\\mu\\) from \\(\\lambda\\) and the public key).

### Example

Here are some example values if you want to work through the algorithm:

#### Key generation

1.  Pick \\(p = 13\\) and \\(q = 17\\). (They satisfy the condition.)
2.  Compute \\(n = 221\\).
3.  Compute \\(\\lambda = 48\\).
4.  Pick \\(g = 4886\\).
5.  Compute \\(\\mu = 159\\). (It exists.)

#### Encryption

1.  Set \\(m\_1 = 123\\).
2.  Pick \\(r\_1 = 666\\).
3.  Compute \\(c\_1 = 25889 \\bmod 221^2\\).

#### Decryption

1.  Compute \\(m\_{\\text{decrypted}} = 123 \\bmod 221\\). (The same as \\(m\_1\\).)

(But beware these numbers are too small to offer any real security and my random values weren’t all that random.)

## Homomorphic properties

Let’s take a look at the homomorphic properties of this encryption scheme…

### Addition of two ciphertexts

When two ciphertexts are multiplied, the result decrypts to the sum of their plaintexts:

\\\[ D\_{priv}(E\_{pub}(m\_1) \\cdot E\_{pub}(m\_2) \\bmod n^2) = m\_1 + m\_2 \\bmod n \\\]

### Multiplication of a ciphertext by a plaintext

When a ciphertext is raised to the power of a plaintext, the result decrypts to the product of the two plaintexts:

\\\[ D\_{priv}(E\_{pub}(m\_1)^{m\_2} \\bmod n^2) = m\_1 \\cdot m\_2 \\bmod n \\\]

### Gotchas

There are a couple of special cases which need to be handled carefully. The first is multiplying by \\(0\\). Because any number to the power of \\(0\\) is \\(1\\), if we multiply a ciphertext by a plaintext \\(0\\) using the method above, the result will always be \\(1\\), and anyone who sees this “encrypted” value will know that it decrypts to \\(0\\). Luckily we can use an alternative method for this case. Because multiplying any number by \\(0\\) gives \\(0\\), we can just skip the calculations and encrypt a \\(0\\) directly using the standard public key encryption scheme. Because of the random number introduced in the encryption step, nobody without the private key will be able to know what the plaintext is.

The other case is multiplying by \\(1\\). Because any number \\(x\\) to the power of \\(1\\) is \\(x\\), if we multiply a ciphertext by a plaintext \\(1\\) using the normal method, the output will be the same as the input. This is less severe than the case with \\(0\\) where the encrypted value could be inferred, but still a problem because anybody who is watching the communication between whoever holds the private key and whoever is multiplying numbers will be able to work out that the number was multiplied by \\(1\\). The solution is another workaround: instead of multiplying by \\(1\\), we perform an equivalent operation: adding \\(0\\)! We just freshly encrypt a \\(0\\) and perform the usual addition procedure to obtain a secure ciphertext.

### Example

Here are some example values continuing from the last example:

#### Homomorphic addition

1.  Set \\(m\_2 = 37\\).
2.  Pick \\(r\_2 = 999\\).
3.  Compute \\(c\_2 = 30692 \\mod 221^2\\).
4.  Compute \\(c\_{sum} = 25889 \\cdot 30692 = 39800 \\mod 221^2\\).
5.  Compute \\(m\_{sum} = 160 = 123 + 37 = m\_1 + m\_2 \\mod 221\\).

#### Homomorphic multiplication

1.  Set \\(m\_3 = 25\\).
2.  Compute \\(c\_{product} = 25889^{25} = 15723 \\mod 221^2\\).
3.  Compute \\(m\_{product} = 202 = 123 \\cdot 25 = m\_1 \\cdot m\_3 \\mod 221\\).

#### Multiplication by 0

1.  Set \\(m\_{multiply0} = 0\\).
2.  Pick \\(r\_{multiply0} = 444\\).
3.  Compute \\(c\_{multiply0} = 46663 \\mod 221^2\\).
4.  Compute \\(m\_{decrypted} = 0 = 123 \\cdot 0 = m\_1 \\cdot 0 \\mod 221\\).

#### Multiplication by 1

1.  Set \\(m\_{encrypt0} = 0\\).
2.  Pick \\(r\_{encrypt0} = 555\\).
3.  Compute \\(c\_{encrypt0} = 653 \\mod 221^2\\).
4.  Compute \\(c\_{multiply1} = 25889 \\cdot 653 = 6531 \\mod 221^2\\).
5.  Compute \\(m\_{multiply1} = 123 = 123 \\cdot 1 = m\_1 \\cdot 1 \\mod 221\\).

## Code

I have a learning repository for privacy-related algorithms [here](https://github.com/willclarktech/privacy-implementations). You can have a look there to see how I implemented these functions, and below is some code showing how you can use the library.

**WARNING: This library is not recommended for production use. It was written for learning purposes only.**

Assuming you have Git and Node.js with npm installed:

```shell
git clone https://github.com/willclarktech/privacy-implementations.git
cd privacy-implementations
npm install
npm run build
```

Now in a JavaScript file or Node.js REPL:

```js
const paillier = require("./build/cryptosystem/paillier");

const keys = paillier.generateKeysSync(); // Slow!

const plaintext1 = 1234567890n;
const plaintext2 = 55555555555n;

const ciphertext1 = paillier.encrypt(keys.pub)(plaintext1);
const ciphertext2 = paillier.encrypt(keys.pub)(plaintext2);

const ciphertextSum = paillier.add(keys.pub)(ciphertext1, ciphertext2);
const plaintextSum = paillier.decrypt(keys)(ciphertextSum); // 56790123445n = plaintext1 + plaintext2

const ciphertextProduct = paillier.multiply(keys.pub)(ciphertext1, plaintext2);
const plaintextProduct = paillier.decrypt(keys)(ciphertextProduct); // 68587104999314128950n = plaintext1 * plaintext2

const ciphertextMultiply0 = paillier.multiply(keys.pub)(ciphertext1, 0n); // != 1n
const ciphertextMultiply1 = paillier.multiply(keys.pub)(ciphertext1, 1n); // != ciphertext1
```

## Summary

In this post we’ve covered the Paillier cryptosystem, looking at how encryption, decryption, addition, and multiplication work. Next time we’ll take a look at how this can be used as a basis for a private set intersection protocol.

## Links

-   [Paillier’s original paper](https://www.cs.tau.ac.il/~fiat/crypt07/papers/Pai99pai.pdf)
-   [Node.js implementation](https://github.com/willclarktech/privacy-implementations/tree/ac7133a/src/cryptosystem/paillier) from my privacy learning repository
-   [Pure JavaScript implementation](https://github.com/OpenMined/paillier-pure) from [OpenMined](https://openmined.org/)
-   [A Python implementation](https://github.com/data61/python-paillier)
