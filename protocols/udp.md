# UDP
User Datagram Protocol

## Content

<!-- toc -->

- [Introduction](#introduction)
- [UDP Segment](#udp-segment)
- [Aplications](#aplications)

<!-- tocstop -->

## Introduction
UDP uses minimun overhead for send packages. But is an unrealiable package.

Some of its characteristics:
- Unreliable – When a UDP message is sent, it cannot be known if it will reach its destination; it could get lost along the way. There is no concept of acknowledgment, retransmission, or timeout.
- Not ordered – If two messages are sent to the same recipient, the order in which they arrive cannot be predicted.
- Lightweight – There is no ordering of messages, no tracking connections, etc. It is a small transport layer designed on top of IP.
- Datagrams – Packets are sent individually and are checked for integrity only if they arrive. Packets have definite boundaries which are honored upon receipt, meaning a read operation at the receiver socket will yield an entire message as it was originally sent.
- No congestion control – UDP itself does not avoid congestion. Congestion control measures must be implemented at the application level.
- Broadcasts — being connectionless, UDP can broadcast - sent packets can be addressed to be receivable by all devices on the subnet.
-  Multicast - a multicast mode of operation is supported whereby a single datagram packet can be automatically routed without duplication to very large numbers of subscribers.

## UDP Segment

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|          Source Port          |       Destination Port        |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|   Length(UDP Header + data)   |       UDP Checksum            |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                             data                              |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+

                         UDP Header Format
```

## Aplications
DNS and DHCP uses UDP.
Voice and video traffic is generally transmitted using UDP. Real-time video and audio streaming protocols are designed to handle occasional lost packets, so only slight degradation in quality occurs, rather than large delays if lost packets were retransmitted. Such VoiceIP
