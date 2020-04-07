# Linux Networks

## Content

<!-- toc -->

- [IP command](#ip-command)

<!-- tocstop -->

## Switch VS Router
A switch connects computers on the same network. All the IPs should be in the same IP range of the network. When connected, the switch will get an IP on the network.
To achieve this the switchs use layer 2 protocols, they mostly just redirects data. The switch will have a MAC table.
A computer connected to the network need to know the MAC address of the destination (through ARP protocol). The Switch will receive the ehthernet frame and forward to the destination computer.

A Router connects different networks. For example the internet with your local network. Routers run layer 3 protocols.
When you connect a router to different networks, it will receive IPs in all the networks.
Then the router (or you), need to create a new route to redirect the packages to the other network through the Router IP.


## IP command
[Nice cheat sheet](https://access.redhat.com/sites/default/files/attachments/rh_ip_command_cheatsheet_1214_jcs_print.pdf)

Check the interfaces
```
ip link
```

Check the IP addresses
```
ip address
# or
ip addr
```

Assign IP address to the system (they should be on the same network, and available).
```
ip addr add 192.168.1.10/4 dev eth0
# The IP should be on CIDR format
# dev = device
# eth0 the device/interface you want to add the IP into
```

If you want to route a specific subnect through a specific gateway you need to create a new route.
```
ip route add 192.168.2.0/24 via 192.168.1.1
# In this case we are telling the computer that the subnect 192.168.2.0/4 can be reach through the 192.168.1.1 (which is the router address).
```

If you want to add a default route (for accessing all the IPs, for example internet). You can add a `default` route
```
ip route add default via 192.168.1.1
# So any request not int your network, will go throuth this gateway
# equivalent to
ip route add 0.0.0.0 via 192.168.1.1
```

Show the routes
```
ip route
```

Using a computer as a router, A <-network1-> B <-network2-> C
```
# 1. Add IPs in network 1 192.168.1.0
# in A server
ip addr add 192.168.1.5/24 dev eth0
# in B server
ip addr add 192.168.1.6/24 dev eth0

# 2. Add IPs in network 2 192.168.2.0
# in B server
ip addr add 192.168.2.6/24 dev eth1
# in C server
ip addr add 192.168.2.5/24 dev eth0

# 3. Add a route to connect both networks.
# in A server
ip route add 192.168.2.0/4 via 192.168.1.6
# in C server
ip route add 192.168.1.0/4 via 192.168.2.6

# 4. Connect both networks (allow linux to ip_forward)
# in B server
echo 1 > /proc/sys/net/ipv4/ip_forward
# to make it persistent, set in /etc/sysctl.conf file, value net.ipv4.ip_forward = 1
```

## Network Namespaces

Use by containers to perform isolation. The container only will see the process running inside the containers. The host machine will be able to see the containers inside the machine.

When a container is created, they will have their own virtual interfaces, routing table and arp table (they won't be able to acces the host ones).

Create a new network namespaces
```
# Create a red and blue network namespaces
ip netns add red
ip netns add blue
```

Show the network namespaces
```
ip netns
```

To list the interfaces in a namespace
```
ip netns exec red ip link
ip netns exec bue ip link
# or
ip -n red link
ip -n red blue
```

To list arp tables and route tables
```
ip -n red neighbor
ip -n red route
```

One way to link namespaces is to create a virtual eth cable, between namespaces.
```
# 1. Creates 2 virtual ethernet interface veth-red and veth-blue
ip link add veth-red type veth peer name veth-blue

# 2. Add the interfaces to the namespaces
ip link set veth-red netns red
ip link set veth-blue netns blue

# 3. Add IP address to the interfaces in this namespaces
ip -n red addr add 192.168.15.1/30 dev veth-red
ip -n blue addr add 192.168.15.2/30 dev veth-blue

# 4. make the interfaces up
ip -n red link set veth-red up
ip -n blue link set veth-blue up

# 5. ping each other
ip netns exec red ping 192.168.15.2
ip netns exec blue ping 192.168.15.1

# 6. check arp tables (you can verify that they see each other)
ip -n red neighbor
ip -n blue neighbor
```

If you have several namespaces you create a virtual switch to connect to each other. We will use the bridge option.
```
# 1. create a bridge
ip link add v-net-0 type bridge

# 2. make it available
ip link set dev  v-net-0 type up

# 3. create virtual eth cables 
ip link add veth-red type type veth peer name veth-red-br
ip link add veth-blue type type veth peer name veth-blue-br

# 4. attach cable to the namespaces
ip link set veth-red netns red
ip link set veth-blue netns blue

# 4. attach cable to the bridge
ip link set veth-red-br netns master v-net-0
ip link set veth-blue-br netns blue v-net-0

# 5. add IP addreses
ip -n red addr add 192.168.15.1/24 dev veth-red
ip -n blue addr add 192.168.15.2/24 dev veth-blue

# 6. set the eth interface up
ip -n red link set veth-red up
ip -n blue link set veth-blue up

# 7. attach the network to the host so we can access the namespaces
ip addr add 192.168.15.5/24 v-net-0

# 8. add route to allow traffic from the namesaces to the outside world
ip netns exec blue ip route add default via 192.168.15.5
ip netns exec red ip route add default via 192.168.15.5

# 9. add NAT in our host so the the traffic can come back
# this will masquerade (replace) all the IP from the network, with the ones from the host. This way the receiver will reply to the host
iptables -t nat -A POSTROUTING -s 192.168.15.0/24 -j MASQUERADE

# 10. We can add a NAT table for incoming traffic to our namespaces
iptables -t nat -A PREROUTING --dport 80 --to-destination 192.168.15.2:80 -j DNAT
```


## Netstat
Netstat print network connections, routing tables etc.

For example, get which port is using etcd in our system
```
netstat -anp | grep etcd
# -a = all
# -n = Show numeric addresses instead of hostname
# -p = Show the PID of the problem on which thi socket belongs
```

