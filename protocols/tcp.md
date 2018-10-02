# TCP
Transmission Control Protocol.

## Content

<!-- toc -->

- [Introduction](#introduction)
- [TCP Segment](#tcp-segment)
  * [Sequence number](#sequence-number)
  * [Acknowledgment number](#acknowledgment-number)
  * [Data offset](#data-offset)
  * [Control bits](#control-bits)
  * [Window](#window)
  * [Checksum](#checksum)
  * [Urgent pointer](#urgent-pointer)
  * [Options](#options)
  * [Padding](#padding)
- [TCP handshake](#tcp-handshake)
- [TCP termination](#tcp-termination)
  * [Data transfer](#data-transfer)
    + [Retransmission](#retransmission)
  * [TCP VS UDP](#tcp-vs-udp)

<!-- tocstop -->

## Introduction
TCP was born because of IP's unreliability. The task of ascertaining the status of the datagrams sent over a network and handling the resending of information if parts have been discarded falls to TCP. 

TCP is optimized for accurate delivery rather than timely delivery and can incur relatively long delays (on the order of seconds) while waiting for out-of-order messages or re-transmissions of lost messages. Therefore, it is not particularly suitable for real-time applications such as Voice over IP. For such applications, protocols like the Real-time Transport Protocol (RTP) operating over the User Datagram Protocol (UDP) are usually recommended instead.

## TCP Segment

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|          Source Port          |       Destination Port        |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                        Sequence Number                        |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                    Acknowledgment Number                      |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|  Data |           |U|A|P|R|S|F|                               |
| Offset| Reserved  |R|C|S|S|Y|I|            Window             |
|       |           |G|K|H|T|N|N|                               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|           Checksum            |         Urgent Pointer        |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                    Options                    |    Padding    |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                             data                              |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+

                         TCP Header Format
```

### Sequence number
32bits
Initially is set to a random number, then it will increase per package sent.
Notice is a full duplex connection, so client and server will both have their own numbers.
### Acknowledgment number
32bits
Is the next package expecting to be received (base on the sequence number.
If the client send the sequence number ```A```, the server should response with the Ack number ```A+1```
### Data offset
4 bits
In words (32 bits), how big is this header. When the the data stars.
### Control bits
1 bit each
URG -> The Urgent Pointer is significant.
ACK -> ACK fiels is signficant (information in ACK Number is valid).
PSH -> Push function, the Sender send it to clean all the buffers of data.
RST -> Tells the receiving TCP stack to immediately abort the connection.
SYN -> Used in establishing a TCP connection to synchronize the sequence numbers between both endpoints.
FIN -> Used to indicate that the client will send no more data (but will continue to listen for data).

### Window
16 bit.
Is the number of data octects starting from the ACK number, that the reciever is willing to accept

### Checksum
16 bits.
Error-checking of the header, the Payload.

### Urgent pointer
16 bits
This field communicates the current value of the urgent pointer as a positive offset from the sequence number in this segment. The urgent pointer points to the sequence number of the octet following the urgent data. This field is only be interpreted in segments with the URG control bit set.

### Options
Variable 0–320 bits, divisible by 32

### Padding
Zero bit up to the next 32 bits. (so the header ocuppies a multiple of a word).

## TCP handshake
Is a 3 way handshake:
Client --> SYN --> Server
Server --> SYN-ACK --> Client
Client --> ACK --> Server

The handshake is mean to synchronize the sequences numbers of the client and the server.
1. C SYN S
Sequence number is set to a random number A.
1. S SYN-ACK C
Sequence number is set to a random number B.
ACK number is set to A+1 (next sequence it expects).
1. C ACK S
Sequence numer is set to A+1
ACK numbe ris set to B+1

## TCP termination
Is a 4 way handshake.
Any of the ends can close the connection. There is one Initiator and one Receiver.
I --> FIN --> R
R --> ACK --> I
R --> FIN --> I
I --> ACK --> R

A connection can be half open, one end sending FIN, and the the other not. FIN only means that end won't send more data.
After the side that sent the first FIN has responded with the final ACK, it waits for a timeout before finally closing the connection, during which time the local port is unavailable for new connections; this prevents confusion due to delayed packets being delivered during subsequent connections. 

### Data transfer

There are some other charactersistics that TCP has (but not UDP).
- Ordered data transfer: the destination host rearranges according to sequence number.
- Retransmission of lost packets: any cumulative stream not acknowledged is retransmitted.
- Error-free data transfer.
- Flow control: limits the rate a sender transfers data to guarantee reliable delivery. The receiver continually hints the sender on how much data can be received (controlled by the window field). When the receiving host's buffer fills, the next acknowledgment contains a 0 in the window size, to stop transfer and allow the data in the buffer to be processed.
- Congestion control.

Acknowledgments for data sent, or lack of acknowledgments, are used by senders to infer network conditions between the TCP sender and receiver. Coupled with timers, TCP senders and receivers can alter the behavior of the flow of data. This is more generally referred to as congestion control and/or network congestion avoidance. 

#### Retransmission
TCP uses two primary techniques to identify loss. Retransmission timeout (abbreviated as RTO) and duplicate cumulative acknowledgements (DupACKS). As well there is a more modern way called Selective ACK (SACK).

RTO: The sender keeps a record of each packet it sends and maintains a timer from when the packet was sent (based on the RTT, rount time trip). The sender re-transmits a packet if the timer expires before receiving the message acknowledgement. The timer is needed in case a packet gets lost or corrupted.

DupACKS: If a single packet (say packet 100) in a stream is lost, then the receiver cannot acknowledge packets above 100 because it uses cumulative acks. Hence the receiver acknowledges packet 99 again on the receipt of another data packet. This duplicate acknowledgement is used as a signal for packet loss. That is, if the sender receives three duplicate acknowledgements, it retransmits the last unacknowledged packet. A threshold of three is used because the network may reorder packets causing duplicate acknowledgements.

SACK: Allows the receiver to acknowledge discontinuous blocks of packets which were received correctly, in addition to the sequence number of the last contiguous byte received successively, as in the basic TCP acknowledgment.

### TCP VS UDP
TCP has this characteristics that UDP doesn't have:
- Reliable – Strictly only at transport layer, TCP manages message acknowledgment, retransmission and timeout. Multiple attempts to deliver the message are made. If it gets lost along the way, the server will re-request the lost part. In TCP, there's either no missing data, or, in case of multiple timeouts, the connection is dropped. (This reliability however does not cover application layer, at which a separate acknowledgement flow control is still necessary)
- Ordered – If two messages are sent over a connection in sequence, the first message will reach the receiving application first. When data segments arrive in the wrong order, TCP buffers delay the out-of-order data until all data can be properly re-ordered and delivered to the application.
- Heavyweight – TCP requires three packets to set up a socket connection, before any user data can be sent. TCP handles reliability and congestion control.
- Streaming – Data is read as a byte stream, no distinguishing indications are transmitted to signal message (segment) boundaries. (UDP reads UDP datagram by datagram)
- No broadcast
- No multicast
