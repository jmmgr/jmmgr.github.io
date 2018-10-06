# ICMP

Internet Control Message Protocol
[rfc](https://tools.ietf.org/html/rfc792)


## Content

<!-- toc -->

  * [Introduction](#introduction)
  * [ICMP Segment](#icmp-segment)
- [PING](#ping)

<!-- tocstop -->

## Introduction

Is build in top of the IP protocol.

It is used by network devices, including routers, to send error messages and operational information indicating, for example, that a requested service is not available or that a host or router could not be reached.

As well is used by 2 diagnostics tools, ping and traceroute.

Is important to mention that since ping doesn't use TCP or UDP, doesn't have the concept of ports.

## ICMP Segment

 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|     Type      |     Code      |          Checksum             |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                     Rest of the header                        |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+

# PING
We can see in [Type and Code](https://en.wikipedia.org/wiki/Internet_Control_Message_Protocol#Control_messages) what are the different values the can take.

For Ping we wouls use Type 8, Code 0. And the request would be Type 0, Code 0.


