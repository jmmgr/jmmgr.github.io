# Scheduling

## Content

<!-- toc -->

- [Introduction](#introduction)

<!-- tocstop -->

## Introduction

# Scheduler

K8s scheduler by default will assign Pods to Nodes. When it does it, it will inform the field `nodeName` in the Pod (with the node where it was assigned).

There are 4 ways to manage which Pods goes to which selectors:
- NodeName -> inform in the Pod which Node you want to be assigned.
- NodeSelector -> inform in the Pod the Node using selectors (you need to create first the labels in the Node).
- Taint and Tolerance. You force Pods not to be assigned in some Nodes. Only the ones with the Tolerance will be able to be assigned (But those with tolerance could be assigned in other Nodes as well).
- NodeAffinity -> is like NodeSelector but much more advanced.
 
## nodeName

You can manually schedule a Pod informing the `nodeName` field (under `spec`) to the node where you want to schedule it. But you only can inform it at creation time, you can't modify the Pod later with this field.

```
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  nodeName: node01
  ....
```

If you want to change the the `nodeName` on the fly, you will need to create a Binding yaml and send it directoy to kube-api server on that pod.

Binding Yaml
```
apiVersion: v1
kind: Binding
metadata:
  name: nginx
target:
  apiVersion: v1
  kind: Node # what to bind
  name: node02 # the node to bind it with
```

Then send it to 
```
curl --header "Content-Type:application/json" --request POST --data '{"apiVersion":"v1", "kind": "Binding"...' http://$SERVER/api/v1/namespaces/default/pods/$PODNAME/binding/
```

## nodeSelectors

Another way to select a node from a Pod, is throuh NodeSelectors
You need to add labels in the node.
```
spec:
  containers:
    ...
  nodeSelector:
    size: Large # Labels of the Nodes
```

To add labes to the Node use the command
```
# where size=large is the label-key and label-value
kubectl label nodes node01 size=large
```

Node selectors has a problem, you can't select OR labels, or NOT label.. etc.

### Taint and Tolerance
Used to set restrictions into Nodes to accept Pods. Meaning that a Pod won't be able to be scheduled in a specif Node. 

For example, K8s set a taint into Master Node, so no Pods can be scheduled there (only the ones with the Tolerance).

You can see the taitn as
```
kubecl 	describe node kubemaster | grep Taint
```

Different from *Node affinity*, which is which Nodes are preferred by the Pods.

Taint is like if a vacine is set in the Nodes, so the pods can't do some actions. Tolerance is like making virus tolerance to that vacine.

For example:
```
kubectl taint nodes node1 a=a:NoSchedule
# a=a the taint (the vacine). Needed to add tolerance later.
# taint-effect
#  NoSchedule -> the nodes won't schedule those Pods
#  PrefereNoSchedule -> the nodes will try not schedule, but there is not guarantee
#  NoExecute ->  NoSchedule + the Pods already executing will be evicted
```

The toleration is added directly in the Pods, under `spec`
```
spec:
  containers:
    ...
  tolerations:
  - key: "a"
    operator: "Equal"
    value: "a"
    effect: "NoSchedule"
```

To remove the taint of a Node you can execute the command with the taint + `-` at the end.
```
kubectl taint node master node-role.kubernetes.io/master:NoSchedule-
```

### NodeAffinity
[Node Affilinity](https://kubernetes.io/docs/concepts/configuration/assign-pod-node/#node-affinity)
Is like Node selectors but more advance.

Example in a Pod.
```
spec:
  containers:
    ...
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: kubernetes.io/e2e-az-name
            operator: In
            values:
            - e2e-az1
          - key: size
            operator: Exists
	...
# this is equivalent to
  nodeSelector:
    size: Large
  ...
```

But there are other operators, for example:
- NotIn
- Exists # check if the label key exist

Depending of the behaviour we have other options
- requiredDuringSchedulingIgnoredDuringExecution
   - If the Afinnity rules doesn't match any Node on scheduling, it won't be schedules
   - If when running the Pod, and there are changes (i.e. labels of the Node). Ignore the new changes (Labels on the Pod will be had in account)
- preferredDuringShedulingIgoreDuringExection ->
   - If the Afinnity rules doesn't match any Node on scheduling, it will ignore the affinity rules and place the Pod on any Node.
   - If when running the Pod, and there are changes (i.e. labels of the Node). Ignore the new changes (Labels on the Pod will be had in account)
- requiredDuringSchedulingRequiredDuringExecution (not available now)->
   - If the Afinnity rules doesn't match any Node on scheduling, it won't be schedules
   - If when running the Pod, and there are changes (i.e. labels of the Node). Evicted the Nodes that doesn't match

### DaemonSet
[DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/) ensures that your Pod runs a copy on each Node.
When nodes are added into the cluster, a Pod will be added to it.

Some uses cases are:
- Kube-proxy
- Monitoring Solution.
- Logs viewer.

DaemonSet is very similiar to the ReplicaSet, it has a Pod inside their spec.

DaemonSet yaml
```
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: fluentd-elasticsearch
spec:
  selector:
    matchLabels:
      name: fluentd-elasticsearch
  template:
    metadata:
      labels:
        name: fluentd-elasticsearch
    spec:
      containers:
      - name: fluentd-elasticsearch
        image: quay.io/fluentd_elasticsearch/fluentd:v2.5.2
```

Useful commands
```
kubectl get daemonsets
kubectl describe daemonsets name-daemonset
```

They use the Kube-scheduler and affinity rules to allocate the Pods in each Node.

### Static Pods

If we only have 1 node running kubelet inside, we can still create Pods. The way to do it is to put Pod yamls in a specific directory of the Node.
Kubelet will read this directory time to time, and create the pods present there. As well Kubelet will ensure that the Pods is running (will start a new one if something happens). And if you delete the Pod file, it will delete the Pod for the node.

If you run Kube-api, and run `kubectl get pods`, it will show you the static pods as well. But you won't be able to modify them.

The directory where store the Pod yamls, can be informed in the starting Kubelet command as a parameter. You can find this value in the config of the kubelet, value `staticPodPath`

Noted this are completely ignored by the Kube-scheduler, they are only managed by the Kubelet.

Useful commands
```
# The static ones are the onesthat end in "-master" or the name of the node the are in.
kubectl get pods --all-namespaces
```

### Multiple schedulers
You can run multiple schedulers, each schduler should have a different name. So when you start the scheduler you should change:
- Change the name of the scheduler `--scheduler-name=my-schedule`
- Change the `leader-elect=false` (If you don't have 2 only one can have the true)
- Change the port `--port=10253`
- Change the secure port `--secure-port=0`

To make sure that a Pod is allocated with your scheduler
```
....
spec:
  containers:
    - image: nginx
      name: nginx
  schedulerName: my-scheduler
```

Commands
```
# Get the events, you can check  under Reason "Scheduled" which scheduler was used
kubect get events 
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
