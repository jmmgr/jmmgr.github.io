# TLS

Transport Layer Security.

As well known as SSL (SSL is the old standard).

## Content

<!-- toc -->

- [Introduction](#introduction)
  * [TLS handshake](#tls-handshake)
  * [Pre master secret vs master secret](#pre-master-secret-vs-master-secret)
  * [Certificate Authorities](#certificate-authorities)
  * [SNI and domain fronting](#sni-and-domain-fronting)

<!-- tocstop -->

## Introduction

The goal of TLS is transport bytes securerly over internet or other networks. It's an hybrid cryptosytem, it uses both symmetric and asymmetric encrytption algorithms. Using different encrytptions schemas for different purposes.

On a TLS handshake, client and server need to agree in which [algorithms to use (cipherSuite)](https://wiki.mozilla.org/Security/Server_Side_TLS).
```
0xC0,0x2C  -  ECDHE-ECDSA-AES256-GCM-SHA384  TLSv1.2  Kx=ECDH  Au=ECDSA  Enc=AESGCM(256)    Mac=AEAD
0xC0,0x30  -  ECDHE-RSA-AES256-GCM-SHA384    TLSv1.2  Kx=ECDH  Au=RSA    Enc=AESGCM(256)    Mac=AEAD
0xCC,0xA9  -  ECDHE-ECDSA-CHACHA20-POLY1305  TLSv1.2  Kx=ECDH  Au=ECDSA  Enc=ChaCha20(256)  Mac=AEAD
0xCC,0xA8  -  ECDHE-RSA-CHACHA20-POLY1305    TLSv1.2  Kx=ECDH  Au=RSA    Enc=ChaCha20(256)  Mac=AEAD
0xC0,0x2B  -  ECDHE-ECDSA-AES128-GCM-SHA256  TLSv1.2  Kx=ECDH  Au=ECDSA  Enc=AESGCM(128)    Mac=AEAD
0xC0,0x2F  -  ECDHE-RSA-AES128-GCM-SHA256    TLSv1.2  Kx=ECDH  Au=RSA    Enc=AESGCM(128)    Mac=AEAD
0xC0,0x24  -  ECDHE-ECDSA-AES256-SHA384      TLSv1.2  Kx=ECDH  Au=ECDSA  Enc=AES(256)       Mac=SHA384
0xC0,0x28  -  ECDHE-RSA-AES256-SHA384        TLSv1.2  Kx=ECDH  Au=RSA    Enc=AES(256)       Mac=SHA384
0xC0,0x23  -  ECDHE-ECDSA-AES128-SHA256      TLSv1.2  Kx=ECDH  Au=ECDSA  Enc=AES(128)       Mac=SHA256
0xC0,0x27  -  ECDHE-RSA-AES128-SHA256        TLSv1.2  Kx=ECDH  Au=RSA    Enc=AES(128)       Mac=SHA256
```

This list is for moderns TLS servers (and secure). All the CipherSuites use [ECDHE](https://www.peerlyst.com/posts/a-technical-rant-about-the-different-e-s-in-ssl-tls) for exchange of key. The problem with using RSA, is that doesn't follow *forward secrecy* , this is the property that an attacker that recorded your encrypted communication and then later obtained your private key, they shouldn't be able to decrypt the previously recorded communication. However, RSA can be used for signing and authentication.

If we choose ECDHE-RSA-AES128-SHA256. This means that the client and the server will use the TLS with Eliptic Curve Diffie-HellmanEphemeral (ECDHE). The authentication method will use RSA. This will be used in conjunction with AES symmetric encryption algorithm with a 128-bit key and a SHA-256 hashing algorithm to maintain data integrity during the transfer of information.

Remember that key exchange can suffer from man in the middle, so you need a "signature", this can be achieve with RSA or DSA.

### TLS handshake
The TLS Handshake Protocol involves the following steps:

1. The client sends a *Client hello* message to the server, along with the client's random value and supported cipher suites.
2. The server responds by sending a *Server hello* message to the client, along with the server's random value, TLS version and cipher suites selected.
3. The server sends its certificate to the client for authentication and may request a certificate from the client. The server sends the *Server hello done* message.
4. If the server has requested a certificate from the client, the client sends it.
5. The client creates a random Pre-Master Secret and encrypts it with the public key from the server's certificate, sending the encrypted Pre-Master Secret to the server.
6. The server receives the Pre-Master Secret. The server and client each generate the Master Secret and session keys based on the Pre-Master Secret.
7. The client sends *Change cipher spec* notification to server to indicate that the client will start using the new session keys for hashing and encrypting messages. Client also sends *Client finished* message.
8. Server receives *Change cipher spec* and switches its record layer security state to symmetric encryption using the session keys. Server sends *Server finished* message to the client.
9. Client and server can now exchange application data over the secured channel they have established. All messages sent from client to server and from server to client are encrypted using session key.

Notice than in this case, in the step 5, we share the pre master secret using RSA (only using the public key of the server).
In Diffie-Hellman, the client can't compute a premaster secret on its own; both sides contribute to computing it, so the client needs to get a Diffie-Hellman public key from the server. In ephemeral Diffie-Hellman, that public key isn't in the certificate (that's what ephemeral Diffie-Hellman means). So the server has to send the client its ephemeral DH public key in a separate message so that the client can compute the premaster secret (remember, both parties need to know the premaster secret, because that's how they derive the master secret).

If we want to use DHE, we should replace some steps.
1. The server sends its *ServerKeyExchange* message, sending his DH Keys (generated) signed with is public key. This message is sent for all DHE and DH_anon ciphersuites. (Before step 3)
2. The server sends a *ServerHelloDone* message, indicating it is done with handshake negotiation. (like step 3)
3. The client responds with a ClientKeyExchange message, with a PreMasterSecret. This PreMasterSecret is encrypted using the public key of the server certificate. (Step 6).

The DH-anon and ECDH-anon key agreement methods do not authenticate the server or the user and hence are rarely used because those are vulnerable to man-in-the-middle attack. Only DHE and ECDHE provide forward secrecy. 

Resuming a secure sesion on TLS:
1. The client sends a *Client hello* message using the Session ID of the session to be resumed.
2. The server checks its session cache for a matching Session ID. If a match is found, and the server is able to resume the session, it sends a *Server hello* message with the Session ID.
3. Client and server must exchange *Change cipher spec* messages and send *Client finished* and *Server finished* messages.
4. Client and server can now resume application data exchange over the secure channel.

If a session ID match is not found, the server generates a new session ID and the TLS client and server perform a full handshake.

### Pre master secret vs master secret
[The point of a premaster secret is to provide greater consistency between TLS cipher suites](https://crypto.stackexchange.com/questions/24780/what-is-the-purpose-of-pre-master-secret-in-ssl-tls). 

Once Server and Client has the *pre master secret*, they will derive the *master secret* from the random numbers exchanged in the steps 1 and 2, and the *pre master secret*

### Certificate Authorities
As we saw in the step 3 of the handshake, the server sends its certificate to the client for authentication. But how do we know that the certificate is actually from the server and not from a man in the middle? Through Certificated Authorities (CA).

TLS clients has a list of certifications of CA, from the OS and from the browser.
For example to see the CA of the OS, we can check:
```
cat /etc/ssl/certs/ca-bundle.crt
```

This are trusted certificates. For a fee, this CA will sign other certificates as long as they can prove who they are.

When a TLS client connects to a server, that server provides a certificate chain. Typically, their own certificate is signed by an intermediary CA certificate, which is signed by another, and another, and one that is signed by a trusted root certificate authority. Since the client already has a copy of that root certificate, they can verify the *signature chain* starting with the root.

You can generate your own CA. Depending of the protocol may be rejected.
- HTTPS -> Some browsers won't allow visit the webpage.
- OpenVPN -> We can create our own CA, for example [when we set the router to suppport OpenVPN](https://www.forshee.me/2016/03/16/ubiquiti-edgerouter-lite-setup-part-5-openvpn-setup.html).

### SNI and domain fronting
[Server Name Indication](https://en.wikipedia.org/wiki/Server_Name_Indication) is an extension of TLS, on which the client can indicate the hostname he is trying to connect at the start of the handshaking TLS.
The reason to include the hostname is when we want one IP to provide different certificates. In order to know which certificate need to be selected for the handshake we use the host provided in the SNI.

Because is at the start of the Handshake this information won't be encrypted.

This provide one advantage (one IP can host different services), but in the other hand some countries have been use this for [censoring] (https://signal.org/blog/looking-back-on-the-front/)

One way to avoid censoring this some companies like [Signal](https://signal.org/blog/looking-back-on-the-front/) have been using [domain fronting](https://www.bamsoftware.com/papers/fronting/). Some server provides have the peculiarity that if you provide as a SNI hostname a webpage from their domain, thy will end up redirecting to the actual server described in the HTTP data. (After decrypt).
So lets say that if you are usig GCP service, you can set your SNI hostname as ```google.com```, and the encrypt HTTP will have the info to which host to redirect.

Unfortunately this is considered a breach in the Terms and Conditions of GCP and AWS, and asked Signal to cease using it.

### Certificates

#### X.509
[X.509](https://en.wikipedia.org/wiki/X.509) is the most common format for certificates. Is used in HTTPS.

[RFC](https://tools.ietf.org/html/rfc5280)

Common extensions of this cert are:
- CRT -> use for certificates, it may be DER or PEM
- CER -> Microsoft version of CRT
- KEY -> Used for both public and private PKCS#8 keys.

Common ways of encondig the cert (also use as extensions):
- PEM -> Is an armored base64 of the binary cert. (the one that starts with -----BEGIN CERTIFICATE----)
- DER -> Is the cert in binary.

To verify the content of a cerfiticate:
```
openssl x509 -text -inform PEM -in client-auth-ca/staging/root/certs/ca.cert.pem
openssl x509 -text -inform DER -in client-auth-ca/staging/root/certs/ca.cert.pem
```

For `openssl x509` PEM is the default, so no need to inform the `-inform PEM`

Some common fields of this certicate are:
- Issuer. Is the issuer (for example GoDadaddy).
	- O (Organization)
	- OU (Organization unit)
	- L, ST, C (locality, state, country)
- Validity
	- Not Before
    - Not After
- Subject:
	- CN (Common Name)
- Subject Public Key Info -> carry the public key and identify the algorith.
- Signature Algorithm -> contains the algorithm identifier for the algorithm used by the CA to sign the certificate.
- X509v3 extensions.
	- X509v3 Authority key Identifier -> Identifier of who signed this cert
	- X509v3 Subject Key Identifier -> Identifier of this cert

#### PKCS 12
A format to store several chrptography objects in a single file.

Is commonly use to bundle private key + X.509 certificate. As well can be used to bundle a chain of trust.

To verify the content of a pkcs12 file:
```
openssl pkcs12 -in file.pkcs12
```

#### Certificate bundle
This is just some certs written in the same file one after another.It identify the certificate chain, from your cert, to the root certificate.
Example:
```
---BEGIN CERTIFICATE----
base64 code leaf cert
---END CERTIFICATE----
---BEGIN CERTIFICATE----
base64 code intermediate cert
---END CERTIFICATE----
---BEGIN CERTIFICATE----
base64 code root cert
---END CERTIFICATE----
```

Two ways to verify which one is the root cert:
- Verify that the Issuer and Subject has the same information.
- Verify that the `X509v3 Authority key Identifier` and `X509v3 Subject Key Identifier` has the same identifier.

To verify which one is the leaf cert:
- Verify which one has the CN of your webpage.

To verify the order is correct:
- You can check `X509v3 Authority key Identifier` and `X509v3 Subject Key Identifier`. Each intermediate has the `Authority key` set as the previous `Subject key`.

### Mutual authentication
Very nice article about TLS handshake and mutual authentication [mutual authentication](https://medium.com/sitewards/the-magic-of-tls-x509-and-mutual-authentication-explained-b2162dec4401)

The idea is the server wants to make sure that the Client is who is he claiming to be. So the client will have its own certificate.

There will be some new steps in the TLS handshake so the client can send its certificate.

![mutual authenitcation image](https://miro.medium.com/max/952/1*P1ujapQhTYNgd2hWl_8Njg.png)
