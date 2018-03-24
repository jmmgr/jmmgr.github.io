# Cryptography

[GNU privacy handbook](https://www.gnupg.org/gph/en/manual.html)

## Public Key / Asymmetric

One public key.
One Private key.
One decrypt the messages encrypted with the other.

Signing with your private key will authenticate the message as yours.
Encrypt will the public key will make only you to read that message.

Exchange Keys [Example SSL exchange keys algorithms)[https://en.wikipedia.org/wiki/Transport_Layer_Security#Key_exchange_or_key_agreement]

### gpg asymetric

generate public/private key pair
```
gpg --gen-key
```
You will need to choose the type of key you want, keysize, how long the key should be valid, key-id, comment for identify the key, email and passphrase.

You can list they keys
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

#### Export your public key

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


Now, if someone else wants to import your public key will need to:
```
gpg --import public_key_jesus.asc
```

After that he needs to do some extra steps:
1. Check the fingerprint of the public key
2. Verify with the owner the fingerprint is correct
3. Sign the key. Signing the key is like approving this public key, mark it as trusted

for checking the fingerprint you can do:
```
gpg --fingerprint fingerprint key-id
```

As well you can do all the steps directly
```
gpg --edit key-id
then for checking the fingerprint write
fpr
after validate with the user you can sign it
sign
you can check who has signed this publick key with check
check
```

### export your private key

```
gpg --export-secret-keys key-id > private_key
```

For import back the key:
```
gpg --import private_key
```

### Revocate your public key

For revocate the public key, you can generate a revocation certificate and impor it whenever you wan to revocate a key. (the private key is not secure, or is lost). Note, that you need the private key to generate the certification.

```
gpg --output revocation_cert.asc --gen-revoke key-id
```

Then just import the key
```
gpg --import revocation_cert.asc
```

If your key is in a server, you will need to update the server as:
```
gpg --keyserver server --send-keys key-id
```

## Cipher / Symetric

### gpg symmetric

To see which ciphers gpg support, you can run `gpg --version`

Encrypt:
```
gpg --symmetric --cipher-algo AES256 example_file
or
gpg -c --cipher-algo AES256 example_file
or using default cipher (default may vary through versions, man gpg)
gpg -c example_file
```
You can force to use one adding `cipher-algo NAME` in `~/.gnupg/gpg.conf`

The key used to drive the symmetric cipher is derived from a passphrase supplied when the document is encrypted.

Decrypt:
```
gpg -o example_file --decrypt example_file.gpg 
or
gpg -o example_file -d example_file.gpg 

```
