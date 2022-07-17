# K8s Networks

## Cluster network K8s cluster has 1 master node, and it may have 1 or more worker nodes.
- All the nodes are connected to the same network 192.168.1.0
- Each node has its own IP (on the same network)
- Have their own MAC addreses
- Need to have open some Ports:
  - Master Nodes:
    - 2379 (ETCD)
    - 2380 (ETCD replication, if you have several master nodes)
    - 6433 (kube-api)
    - 10250 (kubelete)
    - 10251 (kube-scheduler)
    - 10252 (kube-controller-manager)
  - Worker Nodes:
    - 30000-32767 (Services)
    - 10250 (kubelete)


### Pod Network
K8s expects:
- Every POD should have an IP address.
- Every POD Should be able to communicate with every other POD in the same node.
- Every POD should be able to communicate with every other POD on other nodes without NAT.

#### CNI plugins

Responsabilities:
- Must suppot arguments ADD/DEL/CHECK.
- Must support parameters container id, networs ns etc.
- Must manage IP address assignment to PODs
- Must Return result in a specific format.

CNI plugion are configurated in the kubelet (because CNI perform actions when you add a new POD.
When you start a kubelet need to pass the options
```
--network-plugin=cni # use cni
--cni-bin-dir=/opt/cni/bin # where are supported cni plugins as executables
--cni--confdir=/etc/cni/net.d # Set of configurate files, to know what to use. It will only pick one of them, if several will pick the first in alphabetic order)
```      
 
**CNI weave**

Weave will deploy an agent in each node. Each agent store information aout how to contanct the rest of the agents. if you need to contact a pod in another node, you only need to contact your local agent, and he will send the package to the agent in the right node.

Weave creates its own bridge. Then assign each agent their own IP address.

You can deploy Weave manually or as pods in the cluster.

If you deploy using PODs, you can see them with
```
kubectl get pods -n kube-system
```

### Service Network
Usually you don't want to access Pods through IPs. if you want to access a POD, you should do it through services.

Services are a cluster wide concept, they are not created in each Node.

When we create a service object, is assigned an IP addres from a pre-defined range. The Kube-proxy running in each node, get that IP address and create forwarding rules in each Node of the cluster.
You can set the default ip-range when starting the kube-api-server
```
kube-apiserver --service-cluster-ip-range=10.96.0.0/12
# default is 10.0.0.0/25
```

The forwarding rules are set so all the traffic that to the service IP, is forwarded to the POD IP.

When starting the kube-proxy, you can select how to create the forwarding rules
```
kube-proxy --proxy-mode [userspace | iptables | ipvs]
# By default kube-proxy use iptables
```

You can check the ip tables like
```
iptables -L -t net | grep db-service
```

As well you can see in the logs of kube-proxy the creation of the ip-tables
```
cat /var/log/kube-proxy.log
```


## DNS
K8s set it by default. The newer version runs CorDNS as a POD, and it creates a service  with `kube-dns` name. When the PODs are created, the kubelet sets `/etc/resolv.conf` is set as the IP of this `kube-dns` service.

The `/etc/resolv.conf` will look like
```
nameserver 10.96.0.10
search default.svc.cluster.local svc.cluster.local cluster.local
# this search allows you to search svc without the fully qualify domain. 
```

Wnever you create a Service, Kube DNS create a record matching the name of the service and the IP addres.

If they are in the same namespace you can use directly the name.
If you are in different namespaces you need to add the namespace at the end. (as the /etc/resolv.conf is set).
```
# if you look in the default namespace
curl http://web-service
# not default namespace
curl http://web-service.name-space-name
# you as well can add svc (for service)
curl http://web-service.name-space-name.svc
# as well the cluster `cluster.local` (this will be the fully qualify name)
curl http://web-service.name-space.svc.cluster.local
```

You can add options to create DNS records for the PODs. This will create DNS records as:
- the name will be the IP but dashes insteads of dots.
- the  type would be pod
For example:
```
curl http://10-244-2-5.apps.pod.cluster.local
```


CoreDNS config is set at `/etc/coredns/Corefile`. If you want the PODs to have DNS records by default you can set change the `pods` option.kkkkkkkkkkkkkkkk

## Ingress
Ingress is an load balancer, build inside K8s.

Responsabilities:
- Allows users to access your apps via url path
- Provides TLS

Ingress can be implemented using an Ingress controller:
- Nginx (supported by K8s project)
- Haproxy
- traefik
- others

Then add different rules (Ingress resources).

To use Ingress you need:
- Deploy the Ingress controller
- Create a new resource Ingress (will use the Ingres-controller)

### Ingress controller

Need:
- Deployment. Creates the Ingress controller.
- Service. Service to access the Ingress controller (NodePort).
- ConfigMap. Contains the Nginx options (or other controller)
- ServiceAccount. Adds permissions to the Ingress controller to monitor the K8s resources.

### Ingress resource
It will contains the different rules to route the traffic.

If the url doesn't match anythng, it will route to the `Default backend`. You can check the default BE in the `describe ingress`

Ingress YAML routing everything to the same service
```
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: ingress-name
spec:
  backend:
    serviceName: name-service
    servicePort:  service-port
```

Ingress YAML routing different urls for different services same domain
```
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: ingress-name
spec:
  rules:
  - http:
      paths:
      - path: /url1
        backend:
          serviceName: name-service
          servicePort:  service-port
      - path: /url2
        backend:
          serviceName: name-service
          servicePort:  service-port
```

Ingress YAML routing different urls for different domain names
```
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: ingress-name
spec:
  rules:
  - host: www.myfirstdomain.com
    http:
      paths:
      - path: /url1
        backend:
          serviceName: name-service
          servicePort:  service-port
  - host: www.myseconddomain.com
    http:
      - path: /url2
        backend:
          serviceName: name-service
          servicePort:  service-port
```

Useful commands:
```
# list the Ingress
kubectl get ingress
# check the rules
kubectl describe ingress ingress-name
```
