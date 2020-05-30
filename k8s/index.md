# k8s
## Content

<!-- toc -->

- [Introduction](#introduction)
- [YAML files](#yaml-files)
- [Useful Kubectl commands](#useful-kubectl-commands)
- [Label and Selectors](#label-and-selectors)
- [Anotations](#anotations)
- [K8 Services, Controllers and Resources](#k8-services-controllers-and-resources)
  * [ETCD](#etcd)
  * [Kube-API server](#kube-api-server)
  * [Kube Controller Manager](#kube-controller-manager)
  * [Kube scheduler](#kube-scheduler)
  * [Kubelet](#kubelet)
  * [Kube proxy](#kube-proxy)
  * [PODs](#pods)
  * [ReplicationController](#replicationcontroller)
    + [Resouces and limits](#resouces-and-limits)
  * [Replica Set](#replica-set)
  * [Deployments](#deployments)
  * [Namespaces](#namespaces)
  * [ResourceQuota](#resourcequota)
  * [Services](#services)
    + [NodePort](#nodeport)
    + [ClusterIp](#clusterip)
- [Scheduler](#scheduler)
  * [nodeName](#nodename)
  * [nodeSelectors](#nodeselectors)
  * [Taint and Tolerance](#taint-and-tolerance)
  * [NodeAffinity](#nodeaffinity)
  * [DaemonSet](#daemonset)
  * [Static Pods](#static-pods)
  * [Multiple schedulers](#multiple-schedulers)
- [Monitor K8s](#monitor-k8s)
- [Application lifecyle managements](#application-lifecyle-managements)
  * [Rolling updates and Rollbacks in deployment](#rolling-updates-and-rollbacks-in-deployment)
  * [Commands and arguments](#commands-and-arguments)
  * [ENV variables](#env-variables)
  * [ConfigMaps](#configmaps)
  * [Secrets](#secrets)
  * [InitContainers](#initcontainers)
- [Cluster Maintenance](#cluster-maintenance)
  * [Draining Nodes](#draining-nodes)
- [Cluster upgrade of K8s](#cluster-upgrade-of-k8s)
  * [Back up and restore](#back-up-and-restore)
- [Security](#security)
  * [Authentication](#authentication)
    + [Baic auth + Token auth](#baic-auth--token-auth)
    + [PKI in K8s](#pki-in-k8s)
      - [Keys and certs needed in K8s](#keys-and-certs-needed-in-k8s)
      - [Generate the certificates](#generate-the-certificates)
      - [View certificates](#view-certificates)
    + [KubeConfig file](#kubeconfig-file)
    + [API endpoints](#api-endpoints)
    + [Roles](#roles)
    + [Cluster Roles](#cluster-roles)
    + [Image security](#image-security)
    + [Security contexts](#security-contexts)
    + [Network policy](#network-policy)
  * [Volumes](#volumes)
    + [Persistent Volumes](#persistent-volumes)
    + [Presistent Volume Claims](#presistent-volume-claims)

<!-- tocstop -->

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
kubectl run --generator=run-pod/v1 --image=redis redis
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

## Label and Selectors

Labels adds key-value tags to elements. Selector helps to filter those labels.

In K8s the labels are defined in under metadata, you add as many labels as you want:
```
metadata:
  labels:
    a: a
```

To select the nodes, we use selectors. For example in a replicaSet:
```
...
spec:
  replica: 3
  selector:
    matchLabels:
      a: a
  template:
    ....
```

Services don't use `matchLabel`, they are define like:
```
...
spec:
  selector: 
    a: a
```

You can select with selectors in kubectl
```
kubectl get pods --selector a=a
kubectl get pods -l a=a
kubectl get pods --selector a=a,b=b
kubectl get pods -l a=a,b=b
```



## Anotations

You can use annotations to add some extra information to the elements. Is as well in metadata. This information won't act as labels. So you won't be able to select from them.
```
metadata:
  name: ...
  labels: ...
  anotations:
    a: a
```


## K8 Services, Controllers and Resources


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

#### Resouces and limits

There are 2 resource limits:
- Request => Is the minimun amount, the scheduler will check which Nodes has this resources available.
- Limit =>  The Node will throtle to that CPU. An in case the Pod use more memory, eventually will terminate it.

You can assign a minimun in the namespace for containers:
- 0.5 CPU
- 256 Mi (2^20 Bytes)

You can use M (1000^2 Bytes)

By default, Containers has a limit of (maximum):
- 1 CPU
- 512 Mi

If you want to add other values for resources:
```
spec:
  containers:
  - name
    resources:
      requests:
        memory: "1Gi"
        cpu: 1
      limits:
        memory: "2Gi"
        cpu: 2
```

If a Pod consumes more CPU than the limit, it will be throttle, if it consumes more memory continuisly it will be terminate


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


## Monitor K8s

The default metric server only store information in memory, if you want more information you need to install another open source metric-servers. Like:
- prometheus
- elastic stack
- datadog
- dynatrace

Kubelet run inside a `cAdvisor` who will get information of the Node, and send them to the metric servers.

For use a metric server you can do:
- `git clone https://github.com/kodekloudhub/kubernetes-metrics-server.git`
- Then `kubectl apply -f {the just cloned directory}`


In K8s, we can log with
```
# log one Pod
kubectl logs -f name-pod
# log one container
kubectl logs -f name-pod container-name
```

## Cluster Maintenance

### Draining Nodes

When we want to make an operation in a Node we can drain the node
```
kubectl drain node-1
```

Kubectl will terminate the Pods running in that Node, adding them in other Nodes (Blue green)

Once you have finished with the update, you can add the Node back to rotation, this this will allow the scheduler to add Pods in the Node again.

```
kubectl uncordon node-1
```


If you want to make sure that new Pods are not added to a Node (but not drain the already running Pods), you can use cordon
```
kubectl cordon node-2
```

## Cluster upgrade of K8s

Check k8 version with
```
kubectl get pods
```

Kubernes version are set like V1.1.1

The resources should be more or less to the same version:
- kube-apiserver => version X
- controller-manager => version  X or X-1
- kube-scheduler => version X or X-1
- kubelet => version X, X-1 or X-2
- kube-proxy => version X, X-1 or X-2
- kubectl => version X+1, X, X-1

So some resources can be 1 version away of the version of kube-api, and other can be 2.

This allow us to upgrade litle by litle.

K8s, usually only maintain the latest 3 versions. And the recommended way to update is upgrade 1 version at a time (not several).

*Kubeadm upgrade*
strategy1:
- First update the master Node. When you are updating the master node, `kubectl`, `scheduling` etc. Won't work.
- Then, update the Workers Nodes one by one.

strategy2:
- First update the master Node. When you are updating the master node, `kubectl`, `scheduling` etc. Won't work.
- Then, add more nodes with the newer version, move Pods to this new, and delete the old nodes.


[Detail instructions to upgrade](https://kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
Update the master:
```
# If the master is in rotation
kubectl drain master
# ssh into the master
# Will tell you a Summary of current versions and availible. As well how to upgrade
kubectl drain master
kubeadm upgrade plan
kubeadm upgrade apply v1.17.0
apt upgrade -y kubelet=1.17.0-00
exit
kubectl uncordon master
```

Update the worker nodes:
```
# Drain the worker node
kubectl drain node-1
# ssh into the node
kubeadm upgrade node
apt upgrade -y kubelet=1.17.0-00
exit
kubectl uncordon node-1
```

### Back up and restore

// TODO REDO!!
One way of backup everything is:
```
kubectl get all --all-namespace -o yaml > all-deploy-services.yaml
```

When we start ETCD, we have to inform variable `data-dir`, here we will save the data from ETCD

As well you can use ETCD to make snapshots
```
# make a snapshot
ETCDCTL_API=3 etcdctl snaptshot save snapshot.db
# check the status of snapshot
ETCDCTL_API=3 etcdctl snaptshot status snapshot.db
# restore the backup:
  # stop the kube-api server
service kube-apiserver stop
  # 
ETCDCTL_API=3 etcdctl snaptshot restore snapshot.db \
--data-dir new-data directory
--initial-cluster ...
--initial-cluster-token... new token
--initial-advertise-peer-urls
# then add the new `data-dir` and the new `initial-cluster-token` in the etcd.service
# reload the daemon etcd
systectl daemon-reload
service etcd restart
service kube-apiserver start
```

## Security
All access to the hosts that form the cluster must be:
- root ssh disable
- password ssh diable
- only ssh-keys access enable

Control access to kube-apiserver:
- Who can access the cluster -> authentication mecanism
  - Files username + passwords
  - Files username + token
  - certificates
  - external auth providers (LDAP)
  - services accounts
- What can they do 
  - Role Base Access Controls --> users asigned to groups
  - Attributes Base Access Control
  - Node Authorization
  - Webhook Mode

All the comunications with the different services (ETCD, Kubelet, Kube-proxy, kube scheduler, kube Controller manager) with the kube api-server are secure using TLS encryption.

### Authentication

*Users (admins and Developers)*

The kube-apiserver authenticate the uses before process them.

#### Baic auth + Token auth

Note, this is not a recommended way to auth the kube-api

Note2, We need as well to create the Role and the RoleBindings to this users.

You can have a file with the information as `user-details.csv`
```
password13,user1,u0001
```
(password, user, user_id)
You can add a 4 column with the group
```
password13,user1,u0001,group1
```

Then start the kube-apiserver with
```
--basic-auth-file=user-details.csv
```

Then you can authenticate using a curl command like this:
```
curl https://master-node-ip:6443/api/v1/pods -u "user1:password123"
```

For using a token file is similar `user-token-details.csv`

```
asdfsadfasdfsadasd,user1,id1,group1
```

And inform restart the kube api-server with the options
```
--token-auth-file=user-details.csv
```

Then you can authenticate using a curl command like this:
```
curl https://master-node-ip:6443/api/v1/pods --header "Authorization: Bearer asdfsadfasdfsadasd"
```

#### PKI in K8s

Check the certification expiration of all the certificates
```
sudo kubeadm alpha certs check-expiration
```

##### Keys and certs needed in K8s

kube api-server:
  Needs an apiserver.crt and apiserver.key
  The kube api-server talks with the ETCD server and with the Kubelet server. To auth with them he can use the same apiserver.crt + apiserver.key. Or generate new private/public keys:
    - apiserver-kubelet-client.crt apiserver-kubelet-client.key
    - apiserver-etcd-client.crt apiserver-etcd-client.key

ETCD:
  Needs an etcdserver.crt and etcdserver.key

Kubelet:
  Needs an kubelet.crt and kubelet.key
  Kubelet needs to talk with the kube api-server. To auth they can use the same servers key/cert or create new client ones:
    - kubelet-client.crt
    - kubelet-client.key

Administrators:
  Needs an admin.crt and admin.key to auth in the kube api-server

Scheduler:
  Needs an scheduler.crt and schduler.key to auth in the kube api-server
  
Kube-controller manager:
  Needs a conroller-manager.crt and controller-managerlkey to auth in the kube api-server

Kube-proxy:
  Needs kube-proxy.crt and kube-proxy.key to auth in the kube-api server

CA:
  We need at least 1 CA to create the certs, ca.crt and ca.key



##### Generate the certificates

**key/cert for CA**
Generate private key for CA:
```
openssl genrsa -out ca.key 2048
```

Generate a Certificate Signing Requests:
```
openssl req -new -key ca.key -subj "/CN=KUBERNETES-CA" -out ca.csr
```

Sign the CA certificate (Self sign with the CA):
```
openssl x509 -req -in ca.csr -signkey ca.key -out ca.crt
```

After that, we will use this certificate to sign all the rest of public keys.
As well, all the services will need access to this ca.cert.


**key/cert for admin client certificates**

Generate a key:
```
openssl genrsa -out admin.key 2048
```
Generate a Certificate Signing Requests:
```
openssl req -new -key admin.key -subj "/CN=kube-admin/O=system:masters" -out admin.csr
```
Note, we add the `O` param to add group.

Sign with the CA key:
```
openssl x509 -req -in admin.csr -days 365 -CAkey ca.key -CA ca.crt -CAserial file_serial -out admin.crt
```

For accessing as admin we can do:
```
curl https://kube-apiserver:6443/api/v1/pods --key admin.key --cert admin.crt --cacert ca.crt
```

As well you can use the kub-config.yaml
```
apiVersion: v1
clusters:
- clusters:
    certificate-authority: ca.crt
    server: https://kube-apiserver:6443
  name: kubernetes
kind: Config
users:
- name: kubernetes-admin
  user:
    client_certificate: admin.crt
    client-key: admin.key
```

**key/cert for other users**
Kubernetes ha a native way of handle signup CertificateSIgningRequest.

CertificateSigningRequest Yaml
```
apiVersion: certificates.k8s.io/v1beta1
kind: CertificateSigningRequest
metadata:
  name: jesus
spec:
  groups:
  - system:authenticated
  usages:
  - digital signature
  - key encipherment
  - server auth
  request:
    ## The requests is the jesus.csr request encoded in base64
```
Note you can do `cat file.csr | base64 | tr -d '\n'

Useful Commands
```
# Get all the CSR
kubectl get csr
# Approve a CSR
kubectl certificate approve jesus
# Deny a CSR
kubectl certificate deny jesus
# Get the certificate
kubectl get csr jesus -o yaml | base64 --decode
```


This is managed by the KubeControllerManager, when you start the kube-controller-manageryou add the CA options
```
  --cluster-signing-cert-file=/etc/kubernetes/pki/ca.crt
  --cluster-signing-key-file=/etc/kubernetes/pki/ca.key
```

**key/cert for system client certificates**

Is the same than the previous step. The only difference is that in the CN (CName), we need to add the `system` before. This should look like:
```
-sub "/CN=SYSTEM-KUBE-SCHEDULER"
-sub "/CN=SYSTEM-KUBE-CONTROLLER_MANAGER"
-sub "/CN=SYSTEM-KUBE-PROXY"
```

*server side certificates ETCD*
ETCD can run a stand alone server, or in a cluster. If run it into a cluster this servers will need to talk to each other, so they will need to authenitcate. You will need to generate several key/cert:
- etcdserverver.crt etcdserver.key
- etcdpeer1.crt etcdpeer1.key
- etcdpeer1.cert etcdpeer1.key
- etcdpeer2.crt etcdpeer2.key

Each server will need:
```
  --key-file=/etcdserver.key
  --cert-file=/etcdserver.cert
  --peer-cert-file=/etcdpeer1.crt
  --peer-cient-cert-auth=true
  --peer-key-file=/etcdpeer1.key
  --peer-truested-ca-file=/ca.crt
  --trusted-ca-file=/ca.crt
```

**server side certificates Kube-api server**
You will need to set all the possible CNames (all the names other clients may be call him).
You can create a openss.cnf
```
[req]
req_extensions = v3_req
[ v3_req ]
basicContraints = CA:FALSE
keyUsage = nonRepudiation,
subjectAltName = alt_names
[alt_names]
DNS.1 = kubernetes
DNS.2 = kubernetes.default
DNS.3 = kubernetes.default.svc
DNS.4 = kubernetes.default.svc.clsuter.local
IP.1 = 10.96.0.1
IP.2 = 17.17.0.87
```

Then you can create the Certificate Signature Request
```
openssl -req new -key apiserver.key -sub "/CN=kube-apiserver" -out apiserver.csr -config openssl.cnf
```

Then you will need to add this in the starting kube-apiserver:
```
  --etcd-cafile=/ca.pem
  --etcd-certfile=/apiserver-etcd-client.crt
  --etcd-keyfile=/apiserver-etcd-client.key
  --client-ca-file=/ca.pem
  --tls-cert-file=/apiserver.crt
  --tls-private-key-file=/apiserver.key
  --kuebelet-certificate-authority=/ca.epm
  --kuebelet-client-certificate=/apiserver-kubelet-client.crt
  --kuebelet-client-key=/apiserver-kubelet-client.key
```

*server Kubelet servers*
Kubelet server run on each node, responsible to manage the node.

You need a key/cert per Node. Each node will have a CN the same as the node (node01, node02..)

Then you can start the kubelet as:
```
authentication:
  x509:
    clientCAFile: "/ca.pem"
tlsCertFile: "/kubelet-node01.crt"
tlsPrivateKeyFile: "/kuebelet-node01.key"
```

As well you will need to generate client certificates for the Kubelet to access the kube api-server. The CN should be `system:node:node01, system:node:node02...`

**Bots (service accounts)**

##### View certificates
If the cluster is deployed using kubeadm, we can find the Yaml finds to find the cert/keys.
```
/etc/kubernetes/manifests/kube-apiserver.yaml
```

Get the certifcate file and run
```
openssl x509 -in /etc/kubernetes/pki/apiserver.crt -text -noout
```
Then check the `Subject` name and the `Alternative Name` names. As well check the Issuer and the expiry date.

So you can check:
- certificate path is correct
- CN Name is correct
- Alt Names are correct
- Organization is correct
- Issuer are correct (ca)
- Epiration is correc (not in the fast)

#### KubeConfig file

When you execute one command
```
kubectl get pods
```

It by default will use the kube-config at `~/.kube/config`, you can specify other config with the flag `--kubeconfig`.

It has 3 sections:
**Clusters**
Is the different clusters enviroments you can use (development, production..)
**Users**
The users you have access
**Contexts**
Context links users with clusters

KubeConfig Yaml
```
apiVersion: v1
kind: Config
clusters:
- name: my-kube-playground
  cluster: 
    certificate-authority: ca.crt # You can specify the file
    certificate-authority-data: ca.crt | base64 # you can specify the data directly
    server: https://asdfaa:64443
users:
- name: my-kube-admin
  user:
    client-certificate: admin.crt
    client-key: admin.key

contexts:
- name: my-kube-admin@my-kube-playground
  context:
    cluster: my-kube-playground
    user: my-kube-admin
    namespace: name...
```

Useful context
```
# show the config use
kubectl config view
# show the current context
kubectl config currrent-context
# change context
kubectl config use-context name-context
```

#### API endpoints

You can access the API server by different endpoints depending of the action you want to make

To make this calls work, you can do
```
kubectl proxy
```

This will start a proxy in localhost, and you can query without credentials

```
curl -k http://localhost:6443/version
# Core functionality (ex. get pods)
curl -k http://localhost:6443/api
curl -k http://localhost:6443/api/v1/pods
# Named groups
curl -k http://localhost:6443/apis
curl -k http://localhost:6443/metrics
curl -k http://localhost:6443/healthz
curl -k http://localhost:6443/logs
```

The core group is the legacy group. You can find the oldest resources.
Tnew new way is the named groups (not everything is migrated)
In the named groups we can find
```
curl -k http://localhost:6443/apis/apps/v1/deployments
curl -k http://localhost:6443/apis/apps/v1/replicasets
curl -k http://localhost:6443/apis/apps/v1/statefulsets
curl -k http://localhost:6443/apis/networking.k8s.io/v1/networkpolicies
curl -k http://localhost:6443/apis/rbac.authorization.k8s.io/v1/roles
curl -k http://localhost:6443/apis/certificates.k8s.io/v1/certificatessigningrequests
```

Notice how the `apiVersion` of the Yaml objects, need to have this apiVersion.
Example Roles, will use in their yaml
```
apiVersoin: rbac.authorization.k8s.io/v1
```

#### Roles

We can create Role objects

Role Yaml
```
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: developer
rules
- apigroups: [""] # For core group, you can let it blank
  resources: ["pods"]
  verbs: ["list", "get", "create", "update", "delete"]
- apigroups: [""] # For core group, you can let it blank
  resources: ["configMap"]
  verbs: ["create']
```

You can add the namespace in the metadata. As well you can use the option `resourceNames` to limit the access to those resources (i.e. pods names).

Then we need to link Roles an Users, with RoleBinding object

RoleBinding Yaml
```
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: deveuser-developer-binding
subjects
- kind: User
  name: dev-ser
  apiGroup: rbac.authorization.k8s.ios
roleRef
  kind: Role
  name: developer
  apiGroup: rbac.authorization.k8s.ios
```

Useful commands
```
# get roles
kubectl get roles
# get the role bindings
kubectl get rolebinding
# see more details about one role
kubectl describe role developer
# see more details about one role-binding
kubectl describe rolebinding devuser-developer-binding
# To check if you have access you can use
kubectl auth can-i create deployments
kubectl auth can-i delete nodes
kubectl auth can-i create deployments --as dev-user
kubectl auth can-i create pods --as dev-user
kubectl auth can-i create deployments --as dev-user --namespace test
```

#### Cluster Roles

All the resources are either namespaced or cluster scoped. Some examples of cluster Scoped are:
- nodes
- PV
- clusterroles
- clusterrolebindings
- namespaces
- certificatesignrequests

They can't be assigned to namepace, they are under cluster.

You can check which resources are namespaced with:
```
kubectl api-resources --namespaced=true
kubectl api-resources --namespaced=false
```

To allow users to do actions in cluster roles resources, you need Cluster roles and Cluster roles resources

ClusterRole Yaml
```
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: cluster-administrator
rules
- apigroups: [""]
  resources: ["nodes"]
  verbs: ["list", "get", "create", "update", "delete"]
```

Then we need to link Roles an Users, with ClusterRoleBinding object

RoleBinding Yaml
```
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: cluster-admin-role-binding
subjects
- kind: User
  name: cluster-admin
  apiGroup: rbac.authorization.k8s.ios
roleRef
  kind: ClusterRole
  name: cluster-administrator
  apiGroup: rbac.authorization.k8s.ios
```

NOTE! you can create ClusterRoles to not namespaced resources. This will make the user to be able to access all the namespaces for that resources.

#### Image security

By default K8s uses docker hub. For example
```
# registri/user/image
docker.io/nginx/nginx
# equivalent to
nginx
# You can use other registries
gcr.io/kubernetes-e2e-test-images/dnsutils
#  You can use a private one (example ECR)
```

In docker for use a private registry, you need to login into that
```
docker login pirivate-registry.io
```

In K8s you need to create a secret docker-registry
```
kubectl create secret docker-registry regcred \
--docker-server=...\
--docker-username=...\
--docker-password=...\
--docker-email=..
```
Then you have to add it in the Pod definition file
```
apiVersion: V1
kind: Pod
metadata:
  name: nginx-pod
spec:
  containers:
  - name: nginx
    image: private-registri.io/apps/my-image
  imagePullSecrets:
  - name: regcred
```

#### Security contexts
You can configurate them at Pod level or Container level.
If in both, the container will override the Pod ones.

Example:
```
apiVersion: v1
kind: Pod
metadata:
  name: example
spec:
  securtyContext:
    runAsUser:100
  containers:
  - name: ubuntu
    image: ubuntu
    command: ["sleep", "3600"]

# OR
apiVersion: v1
kind: Pod
metadata:
  name: example
spec:
  containers:
  - name: ubuntu
    image: ubuntu
    command: ["sleep", "3600"]
    securityContext:
      runAsUser:100
      capabilities:
        add: ["MAC_ADMIN"]
```
If you define them in the containers, you can add capabilities. (not in the POD)


#### Network policy
By default all the Nodes can comunicate with other nodes in the cluster.
We can configure Network Policies to Pods to only allow the trafic we want.


Ingress: The incoming traffic
Egress: The outgoing traffic

For example, if we only want the DB to be access by the api-pod.

Network policy YAML
```
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: db-policy
spec:
  podSelector:
    matchLabels:
      role: db
    policyTypes:
    - Ingress
    ingress:
    - from:
      - podSelector:
          matchLabels:
            name: api-pod
      ports:
      - protocl: TCP
        port: 3306
```


### Volumes

K8s use the Container Storage Interface to comunicate with volume drivers (like AWS EBS). Is a layer between K8s and the volume drivers (used by other orchestration solutions)

Example adding a hostPath to a Pod
```
apiVersion: v1
kind: Pod
metadata: 
  name: random
spec:
  containers:
  - image: alpine
    name: alpine
    command: ["/bind/sh", "-c"]
    args: ["echo 'hola' >> /opt/say_hi.txt"]
    volumeMounts:
    - mountPath: /opt
      name: data-volume
  volumes:
  - name: data-volume
    hostPath:
      path: /data
      type: Directory
```

If instead a hostPath we want to use AWS EBS should be like:
```
volumes:
- name: data-volume
  awsElasticBlockStore:
    volumeID: volume_id
    fsType: ext4
```

#### Persistent Volumes
They are used to manage storage more centraly (not in the Pods Yaml files).

Persitent volume yaml
```
apiVersioN: v1
kind: PersistentVolume
metadata:
  name: pv-1
spec:
  accessModes:
  - ReadWriteOnce
  capacity:
    storage: 1Gi
  hostPath:
    path: /tmp/data
```

Useful commands
```
kubectl get persistentvolume
```
AccessModes:
  - ReadOnlyMany
  - ReadWriteOnce
  - ReadWriteMany

#### Presistent Volume Claims
Every Persistent Volume Claim is linked to one Persistent Volume.
K8s will bind the PVC and PC base on:
- sufficient capaity.
- access modes.
- volume modes.
- storage class
- selector

If K8s binds a large PV to a small PVC (because there not others). K8s won't assign the rest of the PV to another PVC, it will remain unused.
When not PV are availables, the PVC will remain "pending".

If you want, you can use selectors to bind them.

Persitent Volume Claim Yaml
```
apiVersion: v1
kind: PersistentVolumeClaim
metada:
  name: myclaim
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 500Mi
```

Useful commands
```
kubectl get persistentvolumeclaim
kubectl delete persistentvolumeclaim volume
```

We have different behaviours when the PVC is deleted:
```
# keep the data (the default one)
persistentVolumeReclaimPolicy: Retain
# delete automatically (make the PV available to others PVC)
persistentVolumeReclaimPolicy: Delete
# delete automatically and delete the data (will be available to other PVC).
persistentVolumeReclaimPolicy: Recycle
```

To add a PVC to a Pod, you need to add:
```
spec:
  containers:
  - name a-container
    image: nginx
    volumeMounts:
    - mountPath: /var/www/html
      name: mypd
  volumes:
  - name: mypd
    persistentVolumeClaim:
      claimName: myclaim
```
