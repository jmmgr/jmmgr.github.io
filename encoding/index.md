# Encoding

## Content

<!-- toc -->

  * [Introduction](#introduction)
- [ASCII](#ascii)
- [Unicode](#unicode)
  * [BOM](#bom)
  * [UTF8](#utf8)
  * [GB 18030](#gb-18030)
  * [Base64](#base64)

<!-- tocstop -->

## Introduction

Computers only understand bits, in order to transalate those bits into something humans understand we need to set rules, we call this rules Character Encoding.

The data that is represented in bits and doesn't follow any encoding is called "binary data"

In VIM if we want to check the encoding we can do ```set fileencoding```, as some text files doesn't have any meta data to save the encoding, so VIM will try to detect it.

# ASCII
American Standard Code for Information Interchange.
[wiki](https://en.wikipedia.org/wiki/ASCII)

Is one of the first encodings, most of the modern encodings are based on this one. It has several drawbacks:
- Only support US characters.
- Always use the same width to represent characters.
- By default uses 7 bits to represent characters, so 128 different characters

Is easy to represent the values represented in an [ASCII table](https://www.asciitable.com/) of characters.

Common values in decimal are:
- 32, space
- 48, 0
- 65, A
- 97, a

As a curiosity the reason why the use 7 bits, is because it was designed before there Bytes.

# Unicode

[Unicode](https://en.wikipedia.org/wiki/Unicode)

Unicode is a standard for encoding data. This means that per se is not an encoding format, but there are different encoding formats implement this standard.

Some examples are UTF-8, UTF-16, GB18030.

Is variable width encoding. Depending of the size of the code points we have different versions:
- UTF-8, code points have 8 bits. 
- UTF-16, code points have 16 bits. 

## BOM
Byte Order of Mark.

[BOM](https://en.wikipedia.org/wiki/Byte_order_mark)

Sometimes is included at the beginning of the text file may be used for byte ordering detection (or byte endianness detection).

The Unicode standard recommends not to use it for UTF-8, but some windows applications like Notepad add it.

## UTF8
[UTF-8](https://en.wikipedia.org/wiki/UTF-8)

Char. number range  |        UTF-8 octet sequence
   (hexadecimal)    |              (binary)
--------------------+---------------------------------------------
0000 0000-0000 007F | 0xxxxxxx
0000 0080-0000 07FF | 110xxxxx 10xxxxxx
0000 0800-0000 FFFF | 1110xxxx 10xxxxxx 10xxxxxx
0001 0000-0010 FFFF | 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx

So for example if we read 1 Byte of a text encoded in UTF-8, and its first bit is 0, we will know that this is a full character. (Actually would be an ASCII compatible character).

If it starts with 11, we will know that the next Byte starts with 10 and is the end of the character.
If it starts with 111, there will be 2 more Bytes, startting with 10.

UTF-8 uses max of 4 Bytes to represent a character.

Examples.
```
$ U+0024 00100100 (Is equivalent to ASCII)
€ U+20AC 11100010 10000010 10101100 
```

## GB 18030

Is the official encoding for China.

## Base64

Base 64 encodes text into a radix-64 representation. Is very useful to transfer binary data as text.

The 64 characters used to represent it are:
- A-Z (26)
- a-z (26)
- 0-9 (10)
- +/ (2)

The way it works, it separates the text into chunks of 6 bits. Since 2^6 is 64, we will be able to represent all of the different chunks.

Since we get text in 8 bits (1 Byte), and we dividided it into 6 bits, not always we will have a perfect match. So we wil padding with 0s and use the ```=``` to indicate how many zeros we added.

Padding:
- If (totalBits%6 === 0). There is a perfect match, so no add padding or symbol.
- If (totalBits%6 === 4). We need to add two zeros of padding and add ```=``` to the encoding.
- If (totalBits%6 === 2). We need to add four zeros of padding and add ```==``` to the enconding.

