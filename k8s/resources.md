# Resources

## Content

<!-- toc -->

- [Introduction](#introduction)

<!-- tocstop -->

## Introduction

# PODs
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

<details><summary>Example POD</summary>
<p>
```
apiVersion: v1
kind: Pod
metadata:
  name: ubuntu
spec:
  containers:
  - name: ubuntu
    image: ubuntu:latest
    command: [ "/bin/bash", "-c", "--" ]
    args: [ "while true; do sleep 30; done;" ]
```
</p>
</details>


# Replica Set
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


# Deployments
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

<details><summary>Example Deployment</summary>
<p>
```
controllers/nginx-deployment.yaml 

apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
```
</p>
</details>

# Namespaces

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
apiVersion: v1
kind: Namespace
metadata:
  name: namespace-name
```

## ResourceQuota

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



# Services
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

## NodePort
Some definitions:
- NodeIp -> IP on the Node.
- NodePort -> Port on the Node, the valid range is 30000-32767
- Port -> port on the service
- Service IP -> The IP of the service in the cluster - Node IP -> The IP of the service in the cluster
- TargetPort -> port on the POD
- Pod IP -> The IP of the POD

So an user request NodeIp:NodePort, this is proxied to the serviceIP:Port, which is proxied to the PodIp:Targetport 

If there are several pods, they will be choosen a random algorithm. As well they will have SessionAffinity.

If your Pod run in several Nodes, K8s will automaticall will expand to the other Nodes. So this Nodes will have the same port linked.

NodePort Yaml
```
apiVersion: v1
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

<details><summary>Example NodePort</summary>
<p>
```
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  type: NodePort
  selector:
    app: MyApp
  ports:
    - port: 80
      targetPort: 80
      nodePort: 30007
```
</p>
</details>
## ClusterIp
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

<details><summary>Example ClusterIp</summary>
<p>
```
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: MyApp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
```
