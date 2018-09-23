# DNS

Domain Name System. 
[Comic](https://howdns.works/).

Is a protocol to translate domain names into IP addresses. Using a distributed DB that implement hierarchical name systems.

## Introduction

Before the DNS existed, Computers used the Host files to map domains to IPs. This had a lot of problems in terms of scalability, everyone needed to have the latest copy of the Host file.
Instead with the DNS protocols, only need to locate a DNS resolver, that handle the process responding the IP of a domain.

Usually DNS use UDP, and the Port 53. But it may use TCP for some operations

## Commands

There are 2 terminal utilities to get the IP of a domain. dig and nslookup.

### dig
Example using dig and Cloudfare DNS server
```
dig @1.1.1.1 google.com
```
In a computer the resolvers are stored at ```/etc/resolv.conf```, more information in [DNS resolver](#dns-resolver).

We can use trace to find how many hoops we need to get the information.
```
dig @1.1.1.1 google.com +trace
```

We can try to find reverse as well
```
dig -x 54.247.124.36
```
This command won't response the exact domain name.

Example ```dig @1.1.1.1 google.com```:
```
; <<>> DiG 9.11.4-P1-RedHat-9.11.4-5.P1.fc28 <<>> @1.1.1.1 google.com
; (1 server found)
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 12541
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 1452
;; QUESTION SECTION:
;google.com.                    IN      A

;; ANSWER SECTION:
google.com.             298     IN      A       172.217.161.174

;; Query time: 1547 msec
;; SERVER: 1.1.1.1#53(1.1.1.1)
;; WHEN: Sat Sep 22 13:25:43 HKT 2018
;; MSG SIZE  rcvd: 55
```

There is a "question section" and "answer section". As well which Server was used ```1.1.1.1```

### nslookup

```nslooup google.com``` response
```
Server:         192.168.1.1
Address:        192.168.1.1#53

Non-authoritative answer:
Name:   google.com
Address: 172.217.161.174
Name:   google.com
Address: 2404:6800:4005:80f::200e
```

Using another resolver ```nslookup google.com 1.1.1.1```
```
Server:         1.1.1.1
Address:        1.1.1.1#53

Non-authoritative answer:
Name:   google.com
Address: 172.217.161.174
Name:   google.com
Address: 2404:6800:4005:80f::200e
```

It returns less information, to the point.


## Flow

As we said before DNS is a hierarchical DB.

When there is a request of information it may pass different types of servers.

1) Root Level
2) TLD (Top Level Domains)
3) Second Level Domains
4) Sub-Domain
5) Host

### Root
There is 13 servers provided as Root, a DNS resolver must know their address (or know another resolver that knows them). Is the top of the hierarchy.

On a dig with +trace the first respose are the root servers.
```
.                       426221  IN      NS      a.root-servers.net.
.                       426221  IN      NS      k.root-servers.net.
.                       426221  IN      NS      l.root-servers.net.
.                       426221  IN      NS      m.root-servers.net.
.                       426221  IN      NS      b.root-servers.net.
.                       426221  IN      NS      c.root-servers.net.
.                       426221  IN      NS      d.root-servers.net.
.                       426221  IN      NS      e.root-servers.net.
.                       426221  IN      NS      f.root-servers.net.
.                       426221  IN      NS      g.root-servers.net.
.                       426221  IN      NS      h.root-servers.net.
.                       426221  IN      NS      i.root-servers.net.
```

### TLD

There are different types of TLD:

- general (gTLD), such as com, org, gorv, net...
- country code (ccTLD), such as es, uk, us...
- infrastructure, such as arpa 

Example of gTLD response with +trace:
```
com.                    172800  IN      NS      l.gtld-servers.net.
com.                    172800  IN      NS      b.gtld-servers.net.
com.                    172800  IN      NS      c.gtld-servers.net.
com.                    172800  IN      NS      d.gtld-servers.net.
com.                    172800  IN      NS      e.gtld-servers.net.
com.                    172800  IN      NS      f.gtld-servers.net.
com.                    172800  IN      NS      g.gtld-servers.net.
com.                    172800  IN      NS      a.gtld-servers.net.
com.                    172800  IN      NS      h.gtld-servers.net.
com.                    172800  IN      NS      i.gtld-servers.net.
com.                    172800  IN      NS      j.gtld-servers.net.
com.                    172800  IN      NS      k.gtld-servers.net.
com.                    172800  IN      NS      m.gtld-servers.net.
```

### Second level domains
Is below the TLD, for examle in ```www.immd.gov.hk``` would be "gov".

### Subdomain
It can specifies a lot of hosts. For example ```immd.gov.hk```, can have "www" and "ww1".

### Hosts
It specify the machine. So has the whole path, from the root to the host. This is called "Fully Qualified Domain Name" (FQDN).
For example  ```www.immd.gov.hk.``` has a exact location in the DNS hierarchy, since it has its information up to host.

## DNS resolver

A DNS resolver is a client side of DNS, it will request a DNS queries.

There is a local resolver in the computer, it will do queries to other resolvers.

On a negotiation with the DHCP protocol (to get an IP), ther DHCP server response a list of name servers, this name servers will be written in ```/etc/resolv.conf``` and will be use those as a resolver servers. So the machine resolver will request DNS queries to those servers.

Instead of use the ones provided by the DHCP server (By default would be ISP resolvers), we can configure a machine/router to use some public resolvers.

[Cloudfare](https://developers.cloudflare.com/1.1.1.1/setting-up-1.1.1.1/)
```
1.1.1.1
1.0.0.1
```

[Google](https://developers.google.com/speed/public-dns/)
```
8.8.8.8
8.8.4.4
```

Content of resolv.conf ```cat /etc/resolv.conf```:
```
# Generated by NetworkManager
search jesus.fedora
nameserver 192.168.1.1
nameserver 210.87.250.58
nameserver 210.87.253.23
```

The first entry is a router IP, that's because the router has "DNS forward" activated, so all the DNS traffic will be send first to the router who will redirect to other resolvers.
DNS forwarding has two main advantages:
- Is safer, since the our external DNS queries comes from the router (more privacy).
- The router can cache the information of external queries.

The resolver may query the DNS servers by recursive or iterative queries.
- recursive: They request the information to a DNS server, and if this one doesn't have have the information will query to other servers, So there is only need of one query. (The server may not support recursive and may return in a iteractive way).
- iterative: The DNS server, will return the information of who may know the request. So the resolver may need to do several queries.

In ```dig google.com +trace``` Is a iterative request, Showing what each server response.

## Type of resource records

There is a lot of different of [resource records](https://en.wikipedia.org/wiki/List_of_DNS_record_types) (RR). The more important are:
- A: returns an IPv4 address.
- AAAA: returns an IPv6 address.
- CNAME: Canonical name record, is an Alias. The DNS will search for the alias IP, and return it.
- MX: Mail exchange record. Specifies how email should be routed with the Simple Mail Transfer Protocol (SMTP).
- NS: Name server.
- SOA: Start of authority record.

## Domain registrar
[wikipedia](https://en.wikipedia.org/wiki/Domain_name_registrar)

Is a company that tells the TLD where to find a specific domain. Providing data of the domain and DNS servers.

Example:
- Godaddy (The biggest one)
- MarkMonitor (Google use this, offers security)
- Freenom (.tk domains free)
- internetbs (Nassau)

On a registration of a new domain the registrar needs to provide the name servers, so the TLD knows where to query the domains.

Domain registrar usually offer other services, such DNS and Hosting. If they don't offer DNS service, the client will need to provide his own. (Ex Cloudfare).

The maximum a domain registrar can book a domain is 10 years. After they need to renew it.

To know which registrar a domain is using use whois. ```whois google.com```
It will return the Registrar information.
```
Registrar WHOIS Server: whois.markmonitor.com
Registrar URL: http://www.markmonitor.com
Updated Date: 2018-02-21T10:45:07-0800
Creation Date: 1997-09-15T00:00:00-0700
Registrar Registration Expiration Date: 2020-09-13T21:00:00-0700
Registrar: MarkMonitor, Inc.
Registrar IANA ID: 292
Registrar Abuse Contact Email: abusecomplaints@markmonitor.com
Registrar Abuse Contact Phone: +1.2083895740
```

As well the Name Server registered:
```
Name Server: ns3.google.com
Name Server: ns4.google.com
Name Server: ns2.google.com
Name Server: ns1.google.com
```

## DNS security

### Encryption

The DNS protocol doesn't have any encryption. So the ISP or someone spying the network traffic may get information of the activity.
There are surging some protocols to encrypt it:
- DNSCrypt
- DNS over TLS
- DNS over HTTPS

[More info](https://arstechnica.com/information-technology/2018/04/how-to-keep-your-isps-nose-out-of-your-browser-history-with-encrypted-dns/)

### DNS cache poisoning

If a DNS server is compromised, the attacker my change the cache, directing the traffic to a fake server.

### DDoS

If a DNS server receive so many request that can't response new ones. It is possible that a lot of web pages stop working.
[Example](https://www.pcworld.com/article/3133847/internet/ddos-attack-on-dyn-knocks-spotify-twitter-github-etsy-and-more-offline.html)



## Dynamic DNS

DDNS or DynDNS, is a method of automatically updating a name server in the Domain Name System (DNS), often in real time, with the active DDNS configuration of its configured hostnames, addresses or other information. 

For example [duckdns.org](https://duckdns.org/why.jsp) A client can register his router to update the duckdns DNS. So even if the router IP change, will change the DNS record and can access with the same domain.

