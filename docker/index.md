# Docker

## Content

<!-- toc -->

- [Introduction](#introduction)
- [Useful commands](#useful-commands)
- [Docker file](#docker-file)
  * [CMD](#cmd)
  * [CMD VS ENTRYPOINT](#cmd-vs-entrypoint)
- [Storage](#storage)
  * [Volume drivers](#volume-drivers)

<!-- tocstop -->

## Introduction

## Creating Docker Images

[great best practices summary](https://lipanski.com/posts/dockerfile-ruby-best-practices)

## Useful commands

```
# Run one terminal in ubuntu
docker run -ti ubuntu bash
# Run a sleep command in the back ground
docker run -d ubuntu sleep 10
```

## Docker file
### CMD
There is 2 ways of writting the `CMD`:
- Write the command as a string `CMD sleep 10`
- Write the command as an array `CMD ["sleep", "10"]`. Note that the first element of the array has to be an executable!!


### CMD VS ENTRYPOINT

When you set `CMD` (Command), It will be executed by default. For example the `ubuntu` image has `CMD bash`.
```
# Will run by default the CMD
docker run -ti ubuntu
```

Wen can set other commands:
```
CMD sleep 5
```
But if we want to sleep for 10 seconds, we need to replace the whole command.
```
docker run -d ubuntu-sleeper sleep 10
```

With entry point, we can append the argumens.
```
ENTRYPOINT['sleep']
```
Now the arguments of docker will be appended to entrypoint.
```
docker run -d ubuntu-sleeper 5
docker run -d ubuntu-sleeper 10
```

You can combine both (CMD and ENTRYPOINT)
```
ENTRYPOINT['sleep']
CMD['5']
```
This mean that by default we will sleep 5 seconds, but if we add arguments it will overriden.

As well you can override the entrypoint, if you specify the flag --entrypoint.
```
# This will only print 10
docker run --entrypoint echo ubuntu-sleeper 10
```


## Storage

For creating persistent volumes you can use volumes. 

```
# this step is not mandatory
docker volume create data_volume
# add the volume  (volume binding)
docker run -v data_volume:/var/lib/mysql mysql
# As well we can mount directories from the host (bind binding)
docker run -v /data/mysql:/var/lib/mysql mysql

# We cause --mount, is more verbose
docker run --mount type=bind,source=/data/msyql,target=/var/lib/mysql mysql
```

### Volume drivers
By default Docker will use the Volume drivers from the OS. But you want to use other.

For example, attaching an AWS EBS
```
docker run -it --name mysql --volume-driver rexray/ebs --mount src=ebs-vol1,target=/var/lib/mysql mysql
```

## Networking

List the docker networks
```
docker network ls
```

There are different drives:
- null (none)
- host
- bridge

### None network
We can start a container without network, it won't be able to reach the outside world.
```
docker run -network none nginx
```

### Host network
Will connecte the container to the host network. If you run an application on port 80, then it will be the `host_ip:80` to access it.
```
docker run -network host nginx
```
Remember not to run several applications in the same port, will fail

#### Example of host network

```
docker run --network host nginx
# curl localhost:80
```

In docker-compose would be (docker-compose.yml)

```
services:
  nginx:
    image: nginx
    network_mode: host
# curl localhost:80
```

### Bridge
Is the default network. A private network is created than docker containers are attached to.

If you want to access from outside our network, you can execute the container like
```
docker run -p 8080:80 nginx

# internally dockers create a NAT rule
iptables -t nat -A DOCKER -j DNAT --dport 8080 -to-destination 172.17.0.2:80 
```

#### In docker-compose
By default, docker-compose will create a new bridge network

`test_docker_file1/docker-compose.yml`

```
services:
  nginx:
    image: nginx
```

Would create a `test_docker_file1_default` network. You still can access the container using the IP of the bridge: `curl 172.19.0.2:80`

#### More technical details
Docker will create bridge in the host as `docker0`, yo can verify with `ip link` command

Internally docker will create a bridge
```
ip link add docker0 type bridge
```

Inside the containers it will be a `neth0` network. You can see Docker created a netspace inspecting the container:
```
docker inspect ddbcc60e045b | grep netns
# OR
sudo ip netns
# Note you need to create a link between docker namespaces and system namespaces
ln -s /var/run/docker/netns  /var/run/netns 
```

You can see the virtual ethernet cable docker creates with:
```
# Connection of the cable to the host
# It should be look like  veth548145f@if19
ip link

# In the namespace (run with sudo)
# it should look like eth0@if22
sudo ip -n 1198eece6801 link
```

Since docker creates a route, for the docker subnet via docker network, you will be able to access directly the elements using their IP.
```
link route
# should show something like this
# 172.17.0.0/16 dev docker0 proto kernel scope link src 172.17.0.1 
docker run nginx
curl 172.17.0.2:80
# should actually render the nginx server
```

### CNI
Container Network Interfaces
Is a set of standars to define how different solutions implements network.

Docker doesn't support it, so if you want to use docker + CNI solutions, you will need to make it manually.

For example, when K8s creates containers, it uses the `none` network. Then will use CNI plugins to add them to specific namespaces network.
