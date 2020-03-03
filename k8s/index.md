# k8s

## Content

<!-- toc -->

## Introduction

K8 run into a cluster, the clusters are group in nodes.

There are 2 nodes:
- Master nodes -> Manage, Plan, Schedule and monitor nodes
	- ETCD -> key value store, stores information about the cluster
	- kube controller manager
	- kube-scheduler -> schedule containers
	- kube-api server
- Worker nodes -> host applications as containers
	- kubelet -> listen for instructions from the Kube-api server, and manages containers
	- kube-proxy -> enable comunication between services in the cluster


## ETCD
Distributed key value store [https://etcd.io](https://etcd.io)

Runs in port 2379
All the information of the cluster are saving as a key value (Nodes, Pods, Secrets, Configs..)
 
You can get the keys from ETCD running
```
kubectl exec etcd-master -n kube-system etcdctl get / --prefix -keys-only
```

K8s save the data in a tree format, being the `root`

## Kube-API server
Is an API service running in a master node.

Is responsinble of:
- Auth users
- Validate requests
- Retreive data
- Update ETCD (only the kube-api server updates the ETCD)
- Communicate with Scheduler
- Communicate with Kubelet

When we do a `kubectl` command, we first will contact this API, and this API will contact with the `kubelet` running in different nodes to do actions.

For example, crate a pod.
- User calls to kube-api server to create a pod
- Kube-scheduler monitors that there is a new request to create a pod, and notifies the kube-api server the node where create it.
- kube-api server updates info in ETCD cluster
- kube-api server command kubelet to create the pod
- kubelet udpate the status back to the kube-api server
- kube-api server updates in ETCD cluster


You can see the api-server options in the node master at `/etc/kubernetes/manifests/kube-apiserver.yaml
