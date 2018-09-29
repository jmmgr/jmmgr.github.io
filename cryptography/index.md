# Cryptography

## Content

<!-- toc -->

- [Bibliography](#bibliography)
- [Cipher / Symetric](#cipher--symetric)
  * [XOR](#xor)
    + [One time pads](#one-time-pads)
  * [Block ciphers](#block-ciphers)
    + [AES](#aes)
    + [DES/3DES](#des3des)
    + [Stream Ciphers](#stream-ciphers)
      - [ECB mode](#ecb-mode)
      - [CBC mode](#cbc-mode)
      - [CTR mode](#ctr-mode)
      - [Native stream ciphers](#native-stream-ciphers)
  * [gpg symmetric](#gpg-symmetric)
- [Public Key / Asymmetric](#public-key--asymmetric)
  * [key exchange](#key-exchange)
    + [Diffie Hellman](#diffie-hellman)
      - [Discrete logarithm](#discrete-logarithm)
      - [Elliptic curves](#elliptic-curves)
      - [Problem with Diffie Hellman](#problem-with-diffie-hellman)
    + [RSA](#rsa)
      - [Modular arithmetic](#modular-arithmetic)
      - [Problems with RSA](#problems-with-rsa)
  * [gpg asymmetric](#gpg-asymmetric)
    + [Export a public key](#export-a-public-key)
    + [Import other people public keys](#import-other-people-public-keys)
  * [export the private key](#export-the-private-key)
  * [Revoke a public key](#revoke-a-public-key)
- [Hash functions](#hash-functions)
  * [MD5](#md5)
  * [SHA-1](#sha-1)
  * [SHA2](#sha2)
  * [Password storage](#password-storage)
    + [Rainbow tables](#rainbow-tables)
  * [Hash trees/Merkle tree](#hash-treesmerkle-tree)
- [MAC](#mac)
  * [Combining MAC and message](#combining-mac-and-message)
- [Checksums](#checksums)
- [Signature algorithms](#signature-algorithms)

<!-- tocstop -->

## Bibliography
[Crypto 101](https://github.com/crypto101/crypto101.github.io/raw/master/Crypto101.pdf)

[GNU privacy handbook](https://www.gnupg.org/gph/en/manual.html)

## Cipher / Symetric

### XOR

The "exclusive or" (XOR), is a binary operation that is true only if only one of the input is true.

In languages like Python and JavaScript is represented by "^".

A|B|C
-|-|-
0|0|0
1|1|0
1|0|1
0|1|1

One of the properties of XOR is that can be use use to "flip" a bit. So "x^1" will be "~x", and "x^0" will be "x".

This has some properties:
- x^0 = x
- x^1 = ~x
- x^x = 0
- x^a^a = x

#### One time pads
We can use [XOR](xor) to do a basic encryption.

```
C = P^K
```
C is the ciphertext (encrypted element).
P is plain text we want to encript.
K is or key.

Notice that our Key (K), has to be of the same length than the plain text we want to encrypt.

In the case of decryption.

```
P = C^K
```

Whe only need to XOR the Key again, because ```K^K``` cancel each other, and C is "P^K".

This way of encryption even if is very easy has some problems if use wrong:
- Not using truly random data for the key.
- Reusing the pad. (Crib dragging)

Reusing the pad (or key), can make quite easy to break this cipher.
Two encrypted text C1 and C2 with the same key,  apply XOR to them and the Key will be cancel.

```
C1^C2 = P1^K^P2^K= P1^P2
```
If P1 or P2, repeat the same bits for some length, it will give glimpses of the encoded element.

Another way to attack this, is Crib dragging. If there is a piece of text that we know appear in the encrypted element. We can "encrypt" it to appear at any position of the text, and check with other encrypted messages if that has sense. If so, we can start working from any side of it.

Example:
```
lets say we know "the" appears a lot, we can make Ki to match "the" agains Ci, at every position of the text, and verify those ki with other encrypted text. Once we have a piece of K valid, we can add a space at " " this will give us another ki.
```

### Block ciphers
Is an algorithm that allow us to encrypt blocks of a fixed length.
```
C = E(k,P)
```
C is the ciphertext
E is a Encryption function.
k is the Key.
P is the Plain text.

For decryption.
```
P = D(k,C)
```
Where D is a decryption function.

Sometimes the Block ciphers have in the name the size of the key they support, like AES192/AES256. And sometimes is fixed DES/3DES.

#### AES
Advanced Encryption Standard (AES), original name Rijndael.

Has a block size of 128 bits.
key sizes supported 128, 192 and 256 bits. Depending of the key size will have 10,12 or 14 rounds.

High-level explanation of the Algorithm:
1. KeyExpansion, The key schedule is the process which AES uses to derive 128-bit keys for each round from one master key.
2. Initial round key addition:
		- AddRoundKey—each byte of the state is combined with a block of the round key using bitwise xor.
3. 9, 11 or 13 rounds:
 		- SubBytes—a non-linear substitution step where each byte is replaced with another according to a lookup table.
		- ShiftRows—a transposition step where the last three rows of the state are shifted cyclically a certain number of steps.
		- MixColumns—a linear mixing operation which operates on the columns of the state, combining the four bytes in each column.
		- AddRoundKey
4. Final round (making 10, 12 or 14 rounds in total):
		- SubBytes
		- ShiftRows
		- AddRoundKey

AES is considered a very fast cipher.

#### DES/3DES
Data Encryption Standard.

The DES is not considered safe anymore, because of his tiny key 56 bits (8 bits are used for parity check, so in total 64).

3DES is an effort of keeping using the DES hardware. (Companies in the finatial industry still use it).
```
C = E(k1,D(k2,E(k3,p)))
```
1. DES encryption with k3
2. DES decryption with k2
3. DES encryption with k1

3DES is secure but very slow. AES-128 only takes 12.6 cycles per byte, while 3DES takes up to 134.5 cycles per byte.

Right now the DES can be cracked in less than [24 hours](https://en.wikipedia.org/wiki/EFF_DES_cracker)

#### Stream Ciphers
We have seen block ciphers, but if we need to encrypt a flow of bits, we will need stream ciphers.

Stream ciphers may be separate into:
- mode operations of block ciphers. Are block ciphers with some extra simple logic to apply them to streams.
- native stream ciphers. This ciphers use their own cipher.

##### ECB mode
Electronic Code Book.
Is the simplest mode of operation, consist in apply the same block cipher and key to each block in the stream. This is highly unsafe, since blocks with same input will get same output.

So it may be easy to guess the input. Example:
![image encrypted ECB](https://upload.wikimedia.org/wikipedia/commons/f/f0/Tux_ecb.jpg)

Notice, for achieve this, need a bitmap, and change the headers.

##### CBC mode
Cipher block chaining mode.

Is similar to block chain, each block of plaintext is XOR with the previous ciphertext before being encrypted.

Encription.
![Encryption CBC](https://upload.wikimedia.org/wikipedia/commons/8/80/CBC_encryption.svg)

Decription
![Decryption CBC](https://upload.wikimedia.org/wikipedia/commons/2/2a/CBC_decryption.svg)

At the first block, since there is not previous, need an Initialization Vector. This IV can't be predictable, otherwise it may be attacked.

##### CTR mode
Counter mode.

Instead of an Initialization Vector, it uses a nonce. But is just a different name. This nonce will be padded with zeros and add a counter. At every block the counter will increase.

Encryption:
![CTR encryption](https://upload.wikimedia.org/wikipedia/commons/4/4d/CTR_encryption_2.svg)
![CTR decryption](https://upload.wikimedia.org/wikipedia/commons/3/3c/CTR_decryption_2.svg)

CTR was introduced by Diffie and Hellman.

##### Native stream ciphers
Before we saw that block ciphers can be use with mode of operations. But there is aswell some pure stream ciphers, which will encrypt the data with their own cipher.
Such as:
- synchronous. (similar to one time pad).
- [RC4](https://en.wikipedia.org/wiki/RC4) (Already declared insecure)
- [Salsa20](https://en.wikipedia.org/wiki/Salsa20)
- ChaCha20. Related to Salsa20. 

Google has selected ChaCha20 along with Bernstein's Poly1305 message authentication code as a replacement for RC4 in TLS, which is used for Internet security.[20] Google's implementation secures https (TLS/SSL) traffic between the Chrome browser on Android phones and Google's websites

### gpg symmetric
To see which ciphers gpg support,  run `gpg --version`

Encrypt:
```
gpg --symmetric --cipher-algo AES256 example_file
or
gpg -c --cipher-algo AES256 example_file
or using default cipher (default may vary through versions, man gpg)
gpg -c example_file
```
We can use one by default adding `cipher-algo NAME` in `~/.gnupg/gpg.conf`

The key used to drive the symmetric cipher is derived from a passphrase supplied when the document is encrypted.

Decrypt:
```
gpg -o example_file --decrypt example_file.gpg 
or
gpg -o example_file -d example_file.gpg 
```

## Public Key / Asymmetric

One public key.
One Private key.
One decrypt the messages encrypted with the other.

Signing with a private key will authenticate the message as the sender.
Encrypt will the public key will only be decrypted with the private key. (third party can encrypt with the public key of the person he wants to send the message)

Exchange Keys [Example TLS exchange keys algorithms)[https://en.wikipedia.org/wiki/Transport_Layer_Security#Key_exchange_or_key_agreement]

### key exchange
There is different ways to exchange keys, we will center in 2:
- Diffie Hellman.
- RSA.

#### Diffie Hellman
This is only a key exchange, doesn't provide encryption or signature.
Is used very often cause he can generate keys very fast, that means that there is not need to reuse the same  key. This is called ephemeral key. The reason why is good, is because if in the case that one server key is leaked, it won't affect all the past communications.

DHE -> Diffie Hellman Ephemeral.
ECDHE -> Elliptic Curve Diffie Hellman Ephemeral

DH is considered publick key cause both sides need to agree in some public keys. And is ok for third parties to know them.

This algorithm is used for exchange keys. For the actual encryption a symetric algorithm is used, with the key just exchanged.

For example image that Alice and Bob wan to share a secret without Eve to know. Lets represent this with colors:
- Alice and Bob agree on a base color Cb(Eve as well will get it).
- Each of them think of of their own secret colors, Color Alice secret (CAs) and Color Bob secret (CBs).
- Alice and Bob mix this secrets with the base color. So we have Cb+CAs Cb+CBs.
- Now they exchange the colors, and Eve will intercept them.
- Now both them appliy their own secrets to the just exanged color. So they will have Cb+CAs+CBs and Cb+CBs+CAs. That is the same color, so they have a secret.

This only works if the alogrithm we use, fulfill:
- Very easy to mix colors (easy calculation in one direction).
- Mixing colors in different order, result in the same color.
- Mixing colors is one way, we can't separate them to see what were the original colors.

There are two algorithms we can use: 
- Discrete logarithm
- Elliptic curve

##### Discrete logarithm

```
y ≡ g^x(mod p)
```
Compute y is very easy. However compute x is very hard.

Example: 
- Alice and Bob exchange a Prime (p) and a Generator (g) in cliear text. Where ```P<G``` and G is primitive root of P. G = 7, P = 11.
- Alice and Bob generates a random number Xa = 6, xb = 9. For their secret.
- They calculate "Y" with their numbers:
	- Ya = 7^6(mod 11) = 4
	- Yb = 7^4(mod 11) = 8
- They share this number in the open.
- Now both of them compute the secret: 
	- Alicia -> Secret = Yb^xa(mod p) = 8^6 (mod 11) = 3.
	- Bob -> Secret = Ya^xb (mod p) = 6^9 (mod 11) = 3

For Discrete logarithm to be difficult to crack, p and q needs to be huge.

##### Elliptic curves
The complexity of Elliptic curve in the other direction is much bigger than Discrete logarithm. So we need much smaller keys.

| Security level in bits | Discrete log key bits | Elliptic curve key bits |
|---|---|---|
| 56 | 512 | 112 |
| 80 | 1024 | 160 |
| 112|  2048 | 224 |
| 128|  3072 | 256 |
| 256|  15360 | 512 |

##### Problem with Diffie Hellman

This exchange of keys has one problem. A person called Mallory can be in the middle, negotiating the keys with Alice and Bob. This attack is called MITM (man in the middle).

To avoid it, we need to find ways for Alice to identify is talking with Bob, and the other way arond.

#### RSA
RSA can be use to share key, encrypt and authenticate. Is a much more complete schema than Diffie hellman

With RSA a user will have Public and Private Key. If someone wants to send him something will use the user public key (only the private key can decrypt). 
RSA relies in modular arithmetic (it can uses as well Elliptic Curve).

##### Modular arithmetic
Encryption
```
C ≡ M^e(mod N)
```

Decryption
```
M ≡ C^d(mod N)
```

Where M is the Message
C is the ciphertext
D is the secret.
E and N are the public keys. Remember we are using the public key from the receiver to encrypt the text.
N is the module, and is the product of two prime numbers P and Q.

How are this numbers are calculated:
- Generate two large random primes, p and q, of approximately equal size such that their product n=pq is of the required bit length, e.g. 1024 bits.
- Compute n=pq and ```ϕ=(p−1)(q−1)```.
- Choose an integer e, ```1<e<ϕ```, such that ```gcd(e,ϕ)=1```. (common choices for e are 3, 5, 17, 257 and 65537). gcd = greatest common divisor. So they need to be co-primes.
- Compute the secret exponent d, ```1<d<ϕ```, such that ```ed=1modϕ```.
- The public key is (n,e) and the private key (d,p,q). Keep all the values d, p, q and ϕ secret.

Example of numbers using 256-bit RSA:
```
p = 255972651020913583852708738755558492779
q = 315961372360286283221530569994994089667
N = 80877470103268491690225776687889776985485516372419877405296906209811698014593
e = 65537
d = 62101042930507606982857645825838676738862341745400679479964616076341592694761
```
The conditions we need to satisfied ```p and q are prime, N == p*q, and e*d % ((p-1)*(q-1)) == 1```

When we use a 256-bit RSA means that the key has to be of 256. If we calculate:
- log2(N) = 255.4..
- log2(d) = 255.1..
This means to represent this numbers in binary, 256 digits are needed.

So in order to be able to calculate d in a reasonable time, we need to know P and Q. 
Deriving P and Q from N when they are very big number is very difficult.

##### Problems with RSA
One of the problems with RSA is that only can encrypt a number as big as the mod N.
As well they are much slower that the symmetric encryption schemes.

### gpg asymmetric

generate public/private key pair
```
gpg --gen-key
```
Need to choose the type of key, key size, how long the key should be valid, key-id, comment for identify the key, email and passphrase.

Listing the keys
```
gpg --list-keys
or
gpg --list-keys email@mail.com
or
gpg --list-keys key-id
```

Output
```
sec   2048R/IDXXXXXX 2018-03-22                     
uid                  Name <email@mail.com>                                  
ssb   2048R/IDXXXXXX 2018-03-22  
```

#### Export a public key

```
gpg --armor --export > public_key.asc
or
gpg --armor --export XXX(Identifier) > public_key_jesus.asc
```

Note asc is ASCII armored format.

The armor option will create a base64 representation of the key, easier to manage.

```
-----BEGIN PGP PUBLIC KEY BLOCK-----                

mQENBFqzPvkBCADxixHEwbD3b+QNKJrg7xJhpHyY5bY+c7wNPBeu7eA+kSVdiQ/d
7wotzH84B9d8y8C7opRAhmjAhsihSYTA1UjpDuGJx8qU0pdPnnMOqD/mVG1qpVsl
....
PtdieMSjMtnTq7AjdT1FJ6PjsZpqpikmMZqh0daY2QXozLmAUZa+N7jzbJyXwY1h
6XQgsNWRp79zQwkqMzvAIeZ7b8VjuZXFIrHOcfq7WQhTcA+mPgIocyq/l9K6MSLV
uVBjcKkiGQff+nZwkCuaBe+D9Urji/ReL+VU3UPVgYKTonN/FSkJvzh9HHLdyhyn
hQ==                      
=X7+r                     
-----END PGP PUBLIC KEY BLOCK-----   
```

#### Import other people public keys


Now, if someone else wants to import the public key will need to:
```
gpg --import public_key_jesus.asc
```

After that he needs to do some extra steps:
1. Check the fingerprint of the public key
2. Verify with the owner the fingerprint is correct
3. Sign the key. Signing the key is like approving this public key, mark it as trusted

for checking the fingerprint we can do:
```
gpg --fingerprint fingerprint key-id
```

As well we can do all the steps directly
```
gpg --edit key-id
```
then for checking the fingerprint
```
fpr
```
after validate with the user we can sign it
```
sign
```
we can check who has signed this public key with check
```
check
```

### export the private key

```
gpg --export-secret-keys key-id > private_key
```

For import back the key:
```
gpg --import private_key
```

### Revoke a public key

For revoke the public key, we can generate a revocation certificate and import it whenever we want to revoke a key. (the private key is not secure, or is lost). Note, that we need the private key to generate the certification. So the best is generate it before hand.

```
gpg --output revocation_cert.asc --gen-revoke key-id
```

Then just import the key
```
gpg --import revocation_cert.asc
```

If the key is in a server, we will need to update the server as:
```
gpg --keyserver server --send-keys key-id
```

## Hash functions

A hash function is any function that can be used to map data of arbitrary size to data of a fixed size. The values returned by a hash function are called hash values, hash codes, digests, or simply hashes

They need to fulfill certain properties:
- Determinism. Same value gives same hash.
- Uniformity. The hashes need to be evenly distributed.
- Defined range. Usually we want to get same size, and can't get outside the range.
- Avalanche effect. Two input that are very similar, should have completerly different output.
- Non Invertible. From the hash we can't get the input.

### MD5
[https://en.wikipedia.org/wiki/MD5](MD5) provides hashes of 128 bits.
It has several vulnerabilities.

And is very easy to find [collisions](https://www.mscs.dal.ca/~selinger/md5collision/). So is not recommended its usage.

To compute md5 from the terminal
```
echo -n hola | md5sum
```
Notice -n won't send the trailing newline

### SHA-1
[https://en.wikipedia.org/wiki/SHA-1](SHA-1) Provides hashes of 160 bits.

Since 2005 SHA-1 has not been considered secure against well funded opponents, and since 2010 many organizations have recommended its replacement by SHA-2 or SHA-3. Microsoft, Google, Apple and Mozilla have all announced that their respective browsers will stop accepting SHA-1 SSL certificates by 2017.

To compute sha1 from the terminal
```
echo -n hola | sha1sum
```

### SHA2
The [https://en.wikipedia.org/wiki/SHA-2](https://en.wikipedia.org/wiki/SHA-2) family consists of six hash functions with digests (hash values) that are 224, 256, 384 or 512 bits: SHA-224, SHA-256, SHA-384, SHA-512, SHA-512/224, SHA-512/256.

SHA-224 and SHA-384 are simply truncated versions of SHA-256 and SHA-512 respectively. SHA-512/224 and SHA-512/256 are also truncated versions of SHA-512. Only changing the initial values.

The SHA-2 hash function is implemented in some widely used security applications and protocols, including TLS and SSL, PGP, SSH, S/MIME, and IPSec.

To compute sha256 from the terminal
```
echo -n hola | sha256sum
```

### Password storage
One common missuse of hash functions is to store hash of passwords in the DB. So they are not stored in plain text.

To solve this problem, usually a salt is added to the password. But we have to notice that if the salt is not big enough, and or hash + salt is leaked, it may be hacked.

One recommendation is to use Bcrypt (key derivation function). The main advantage is that they are slower to compute. So if the information is leaked will have more complexity.

We can check [haveibeenpwned](https://haveibeenpwned.com/) to see if an email has been leaked.

An example of the information.
```
Dropbox: In mid 2012, Dropbox suffered a data breach which exposed the stored credentials of tens of millions of their customers. In August 2016, they forced password resets for customers they believed may be at risk. A large volume of data totalling over 68 million records was subsequently traded online and included email addresses and salted hashes of passwords (half of them SHA1, half of them bcrypt).

Compromised data: Email addresses, Passwords
```

Changed the password may not be enough, since a lot of people reuse the passwords in different servers.

#### Rainbow tables
Rainbow tables are pre-computed values of hashes, so from a hash find a specific password.

This has a space-time trade off, using less computer power and more storage.

One way to store less space is using hash chains.

It uses different Reduction functions R1, R2... Rk. 
They will be concatenated with Hash functions so we will have:
```
Password1 --Hash-> Password2 --R1--> Password3 --Hash--> Password4 --R2--> Password4
```
So in this example we only need to save the Password1 and the Password4 in the table. All the rest of the values can be deduced.

Lets say we want to find "HOLA":
- First apply R2 to "HOLA", and look up for the result at the end of the chains (Password4). If found then we start from the beginning applying Hashes and Reduction functions. Till we find our element.
- If not we apply R1 to "HOLA" then hash it and apply R2 to the result. If found, repeat from the beginning of the chain.

### Hash trees/Merkle tree
Hash trees are trees where each node is identified by a hash value, consisting of its contents and the hash value of its ancestor. The root node, not having an ancestor, simply hashes its own contents.

For example one example is a tree where the leaf nodes have the data, and the nodes only the hashes from his childs. This is a binary hash tree.
![example hash tree](https://upload.wikimedia.org/wikipedia/commons/9/95/Hash_Tree.svg)

Systems like these or their variants are used by many systems, particularly distributed systems. Examples include distributed version control systems such as Git, digital currencies such as Bitcoin, distributed peer-to-peer networks like Bittorrent, and distributed databases such as Cassandra.

## MAC
The message authentication codes is a small bit of information that can be used to check the authenticity and the integrity of a message. These codes are often called ”tags”. This is symetric algorithms. For asymmetric algorithms we would use signatures.

A message authentication code consists of three algorithms:
- A key generation algorithm selects a key from the key space uniformly at random.
- A signing algorithm efficiently returns a tag given the key and the message.
- A verifying algorithm efficiently verifies the authenticity of the message given the key and the tag.

MACs are used for authentication (that's why they require a key). Using hash doesn't use keys so if somebody distribute binaries with a hash, anybody can modify the binaries and hash it again, it doesn't authenticate the binaries.

An HMAC is a specific type of message authentication code (MAC) involving a cryptographic hash function and a secret cryptographic key.  

### Combining MAC and message
There are mainly 3 ways to combine the message and the MAC.
- Authenticate and encrypt the plaintext separately. ```C=E(KC, P), t=MAC(KM  P)```. Send ciphertext and tag. This is how SSH does it.
- Authenticate then encrypt. ```t=MAC(KM, P), C=E(KC, P||t)```` Authenticate the plaintext and then encrypt the combination of the plaintext and the authentication tag. Only need to send the ciphertext, since the tag is appended to the message before encrypt. This is how TLS does it.
- Encrypt then authenticate. ```C=E(KC ,P ), t=MAC(KM, C)```. Encrypt the plaintext, compute the MAC of that ciphertext. Need to send both ciphertext and tag. This is how IPSec does it.

Some people says, that decrypt before authenticate is a bad idea, so only IPSec is doing it correctly. [here we can read an article about it](https://moxie.org/blog/the-cryptographic-doom-principle)

## Checksums
Designed to detect the most common errors in the data and often to be fast to compute (for effective checksumming fast streams of data).
CRC32 or Adler32

## Signature algorithms
A signature algorithm is the public-key equivalent of a message authentication code. It consists of three parts:
1. a key generation algorithm, which can be shared with other public-key algorithms
2. a signature generation algorithm
3. a signature verification algorithm

Signature algorithms can be built using encryption algorithms. Using the private key, we produce a value based on the message, usually using a cryptographic hash function.

So we can sign using a private key with a hash function. Receivers can decrypt with our public key.

We can use for example RSA with a hash function. 

Or DSA (Digital Signature Algorithm), that uses its own way to decide keys, and sha for hash.
