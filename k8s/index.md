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

## YAML files

All the YAML files have the same 4 top level fields, and they are required.
```
apiVersion: # version of k8s api
kind: # type of object (Pod, Deployment, Service...)
metadata: # dictionary of data about the object 
  name: name of the object
  labels: # different key value of labels
    app: oneapp
    type: onetype
spec: # specification, information of that object. Is different by different objects
```

## Useful Kubectl commands

```
# Get all the objects
kubectl get all
# Generate a new Yaml file from a running service
kubectl get pod name-pod -o yaml
# Create a new deployment
kubectl create deployment --image=nginx nginx
# Create a new deployment Yaml without creating the deployment
kubectl create deployment --image=nginx nginx --dry-run -o yaml > example_deployment.yaml
```

[Kubectl usage conventions](https://kubernetes.io/docs/reference/kubectl/conventions/)

Imperative commands

```
# Create a new Pod without Yaml
kubecl run --generator=run-pod/v1 --image=redis redis
# Generate Pod yaml file without creating the Pod
kubectl run --generator=run-pod/v1 --image=redis redis --dry-run -o yaml
# Create a new deployment
kubectl create deployment name-depoyment --image=redis
# Generate Deployment Yaml without creating the Deployment
kubectl create deployment --image=redis redis --dry-run -o yaml
# Scale a deployment (increase replicas)
kubectl scale deployment --replicas=3 deployment-name
# Create a new service  ClusterIp (will use same labels as redis pod, but won't be able to specify the NodePort)
kubectl expose pod redis --port=6379 --name redis-service --dry-run -o yaml
# Generate new service ClusteIP (WONT use the labels of redis, will assume that the labels are app=redis)
kubectl create service clusterip redis --tcp=6379:6379 --dry-run -o yaml
# Create a ne Sertice NodePort (will use same labels as redis pod, But won't allow you to specify the NodePort)
kubectl expose pod redis --type=NodePort --port=6370  --name redis-service --dry-run -o yaml
# Generate new service Nodeport (WONT use the labels of redis, will assume tha the label are app=redis)
kubectl create service nodeport redis --tcp=6379:6379 --node-port=30080 --dry-run -o yaml



```



### Services


### ETCD
Runs in the master node, at port 2379.

Distributed key value store [https://etcd.io](https://etcd.io)

All the information of the cluster are saving as a key value (Nodes, Pods, Secrets, Configs..)
 
You can get the keys from ETCD running
```
kubectl exec etcd-master -n kube-system etcdctl get / --prefix -keys-only
```

K8s save the data in a tree format, being the `root`

### Kube-API server
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

The start options are located in the master Node at:
```
/etc/kubernetes/manifests/kube-apiserver.yaml

```

### Kube Controller Manager
Runs in the master node.

Node Controller:
- Watch the status of the nodes.
- The nodes send healtchecks to kube-apiserver.
- In case of the healthcheck to fail, the Node Controller will reasign the pods in that node and provision them in a healthy node.

Replication Controller
- Watch the status of replica sets, and make sure that the right number of pods are always running.

Other Controllers:
- Deployment Controller
- Namespace Controller
- Endpoint Controller
- Cronjob
- Job Controller
- PV proteccion Controller
- PV binder Controller
- Service Account Controller
- Stateful Set
- Replica Set


All this processes are package inside the Kube Controller manager. We can see this pod
```
kubectl get pod kube-controller-manager-master -n kube-system 
```
The start options are located in the master Node at:
```
/etc/kubernetes/manifests/kue-controller-manager.yaml
```

### Kube scheduler
Runs in the master node.

Its responsabilte is to decide which pod goes in which node. It will notify Kubelet on what to create.

It may take the decision base on resources.

The start options are located in the master Node at:
```
/etc/kubernetes/manifests/kube-scheduler.yaml
```

### Kubelet
Kubelet runs in the worker nodes.

- It monitor the containers of the node, and report to the kube-api.
- When needed, it request the container runtime engine (docker) to run instances.

Kubeadm doesn not deploy Kubelet by default, you need to run it manually.


### Kube proxy
Is a process that runs on each Node in the k8s cluster. Every time a new service is created, it will create a rule to route to that new service.
It uses Ip tables.

### PODs
[Pods](https://kubernetes.io/docs/concepts/workloads/pods/pod/) is a group of one or more containers (such as Docker containers), with shared storage/network, and a specification for how to run the containers

If 2 containers run in the same POD, they can access each other through `localhost`.

Useful commands
```
# Run a new pod
kubectl run --generator=run-pod/v1 nginx --image=nginx
# Get pods
kubetl get pods
# Get pods with extra info
kubectl get pods -o wide
# Create a pod
kubectl create -f pod.yml
# Describe a pod
kubectl describe pod rss-site
# Delete a pod
kubectl delete pod rss-site
# Update a running pod
kubectl edit pod rss-site
# Update pod (first change the yaml, then apply it
kubectl apply -f pod.yml
```

Pod Yaml
```
---
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
  labels:
    app: web
spec:
  containers: # this is an array, so we can have several containers
    - name: front-end # name of the container)
      image: nginx # image of the container
      ports:
        - containerPort: 80
    - name: rss-reader # second container
      image: nickchase/rss-php-nginx:v1
      ports:
        - containerPort: 88
```

### ReplicationController
*Note! the recommended way to set up a replication is through a Deployment and ReplicaSet*
[ReplicationController](https://kubernetes.io/docs/concepts/workloads/controllers/replicationcontroller/)
K8s have a replication controller, this controller responsability is to verify that right number of replicas are running.

It responsible as well to autoscale (if set)

Replication Controller Yaml
```
apiVersion: v1
kind: ReplicationController
metadata:
  name: my-rc
  labels:
    one_label: one_label
spec:
  template: # templates we input the same as a Pod wihout apiVerion or Kind
    metadata: name: my-pod
      labels:
        app: web
    spec:
      containers: # this is an array, so we can have several containers
        - name: front-end # name of the container)
          image: nginx # image of the container
  replicas: 3 # number of replica set
```
Useful commands
```
# Create a new ReplicaController
kubectl create -f example-rc.yaml
# Get replicationControllers,  will show the status of the replicas
kubetl get ReplicationController
```

### Replica Set
The recommended way to do replication is a Deployment that use ReplicaSet
Is the newer Replica Controller
[ReplicaSet](https://kubernetes.io/docs/concepts/workloads/controllers/replicaset/)

ReplicaSet is a wrap around Pods, you can define Pods and then add them the replication extra parameter.
When you create a ReplicaSet, the Pods will be created automatically

ReplicaSet can manage pods already created. Using selectors (different from ReplicationController) you can select existing Pods, and they will count as created.

ReplicationSet Yaml
```
apiVersion: apps/v1 # NOTE the apiVersion is different
kind: ReplicaSet
metadata:
  name: my-rs
  labels:
    one_label: one_label
spec:
  template: # templates we input the same as a Pod wihout apiVerion or Kind
	# Note, we should include template, so if ReplicaSet needs to create a new Pod it knos what to create
    metadata: name: my-pod
      labels:
        app: web
    spec:
      containers: # this is an array, so we can have several containers
        - name: front-end # name of the container)
          image: nginx # image of the container
  replicas: 3 # number of replica set
  selector: # mandatory field 
    matchLabels:
      one_label: one_label 
```

Useful commands
```
# Create ReplicaSet, will create the pods
kubectl create -f example-rs.yaml
# Get RepliclaSet, will show the status of the replicas
kubectl get replicaset
# Delete ReplicaSet (This also delete the underlying Pods
kubectl delete replicaset name-rs 
# Kubectl update
kubectl replace -f example-rs.yaml
# Increase the number of replicas (other way is modify the yaml directly)
kubectl scale --replicas=6 -f example-rs.yaml
# You can get an existing yaml file as
kubectl get rs name-rs -o yaml
```


### Deployments
[Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)

Deployment is a wrap around ReplicaSet. But it will allow rolling updated as well
Creating a new Deployment will create a ReplicaSet, which will create Pods.

The Yaml is very similiar to ReplicationSet, only some differences.

Deployment Yaml
```
apiVersion: apps/v1 # NOTE the apiVersion
kind: Deployment
metadata:
  name: my-deployment
  labels:
    one_label: one_label
spec:
  template: # templates we input the same as a Pod wihout apiVerion or Kind
	# Note, we should include template, so if ReplicaSet needs to create a new Pod it knos what to create
    metadata: name: my-pod
      labels:
        app: web
    spec:
      containers: # this is an array, so we can have several containers
        - name: front-end # name of the container)
          image: nginx # image of the container
  replicas: 3 # number of replica set
  selector: # mandatory field 
    matchLabels:
      one_label: one_label 
```

Useful commands
```
# Create Deployment, note this create a ReplicaSet
kubectl create -f example-deployment.yaml
# Get deployments
kubectl get deployments
```


### Namespaces

[Namespaces](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/)
Is just a virtual cluster inside the physycal cluster.

K8s create a namespace by default:
- default -> default namespace.
- kube-system -> K8s set this in a different namespace so you don't delete anything important by default
- kube-pulic -> 

Each namespace can:
- Have different policies to define who can do what.
- Have different resource limits

Inside the same namespace we can connect using only the name of the of the service. If we want to access a service from outside, we can append the name of the service.
i.e ngnix-service.namespace-name.svc.cluster.local, having:
- nginx-service -> name of the service
- namcespace-name -> name of the namespace
- svc -> service
- cluster.local -> default domain nameof the k8s cluster

Useful commands
```
# Get pods outside the actual namespace
kubectl get pods -namespace=kube-system
# Create a pod in a specific namespace
kubectl create -f pod-defintion.yaml -namespace=namespace-name
# Create a new namespace
kubectl create -f exampe-namespace.yaml
# Create a new namespace (other way)
kubectl create namespace dev
# Switch namespace
kubecton config set-context $(kubectl config current-context) --namespace=name-namespace
# Get pods in all namespaces
kubectl get pods --all-namespaces
```

As well you can add the namespace in the Yaml, in the metadata section
```
apiVersion: v1
kind: Pod
metadata: 
  name: my-pod
  namespace: my-nm
....
```

Namespace Yaml
```
apiVesion: v1
kind: Namespace
metadata:
  name: namespace-name
```

### ResourceQuota

[ResourceQuota](https://kubernetes.io/docs/concepts/policy/resource-quotas/)
Used to set limit of resources to namespaces.

ResourceQuota Yaml
```
apiVersion: v1
kind: ResourceQuota
metadata: 
  name: quota
  namespace: namespace-name # The namespace where assign the quota
spec:
  hard:
    pods: "10"
    requests.cpu: "4"
    requests.memory: 5Gi
    limits.cpu: "10"
    limits.memory: 10Gi
```

### Services
[Services](https://kubernetes.io/docs/concepts/services-networking/service/) an abstract way to expose an application running on a set of Pods as a network service.

Service type of services:
- NodePort. The service make accesible a Pod, through opening a port in the Node. So using the IP of the node and the port, we will be able to access the Pod.
- ClusterIp. Expoxe the service on a cluster internal IP
- LoadBalancer. Expose the service using a cloud provider LB.

Useful commands:
```
# Create new Service
kubectl create -f example-service.yaml
# Get the services
kubectl get services
```

#### NodePort
Some definitions:
- TagetPort -> port on the node
- Port -> port on the service
- NodePort -> Port on the Node, the valid range is 30000-32767
- Service IP -> The IP of the service in the cluster
- Node IP -> The IP of the service in the cluster
- Pod IP -> The IP of the Pod

So an user request NodeIp:NodePort, this is proxied to the serviceIP:Port, which is proxied to the PodIp:Targetport 

If there are several pods, they will be choosen a random algorithm. As well they will have SessionAffinity.

If your Pod run in several Nodes, K8s will automaticall will expand to the other Nodes. So this Nodes will have the same port linked.

NodePort Yaml
```
apiVersoin: v1
kind: Service
metadata:
  name: service-name
spec:
  type: NodePort
  ports: # is an array, you can have several mapings for one service
   - targetPort: 80 # port on the node. If not provided, will be assigned the same as port
     port: 80 # port on the service.  Mandatory
     nodePort: 30001 # port on the node. If not provided, a random will be assigned from the range
  selector: 
    label1: label1
```
#### ClusterIp
To expose the service on a cluster internal IP.
That means that all the Pods of the same type, will have a common IP for use it internally in the cluster.


ClusterIp Yaml
```
apiVersion: v1
kind: Service
metadata:
  name: clusterip-end
spec:
  type: ClusterIp # This is the default, if you don't inform it
  port:
    - targetPort: 80 # port of the node
      port: 80 # port of the service. Mandatory
   selector:
     label1: label1
     label2: label2
```

