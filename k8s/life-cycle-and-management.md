# Life cycle and management

## Content

<!-- toc -->

- [Introduction](#introduction)

<!-- tocstop -->

## Introduction


## Rolling updates and Rollbacks in deployment

Everytime we change a Pod/Container, we will create a Rollout. This rollout will create the new Pods base on the deployment strategy.

Two Deployment stragegy:
- Recreate => will tear down first the old deployment and after that create the new one.
- Rolling update => Blue green deployment. Will do the deployment one by one. Under the hood, they deployment will create a new ReplicaSet, and get rid of the old one Pods, one pod at a time (it wont remove it)

Useful commands
```
# After change the image, you can create a new rollout applying the changes 
kubectl apply -f deployment-definition.yml
# You can update the image ad-hoc, but be careful, DO NOT APPLY THE DEPLOYMENT FILE
kubectl set image deployment/myapp-deployment nginx=nginx:1.9.1
# Check the status of a rollout
kubectl rollout status deployment/myapp-deployment
# Check the hitory of a rollout
kubectl rollout history deployment/myapp-deployment
# Rollback a rollout, it will bringh back the Pods in the old deployment
kubectl rollout undo deployment/myapp-deployment
# Check the replicaSets
kubectl get replicaset
# Create one deployment (with replicaset)
kubectl run nginx --image=nginx
# Get the deployments
kubectl get deployments
```

## Commands and arguments
[Command and arguments](https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#use-environment-variables-to-define-arguments)

Command: If you inform this, it will override the Docker entrypoint/command
Args: if you inform this, it will append with the Docker entrypoint/command or with the command of K8s.

Pod yaml:
```
spec:
  containers:
  - name: ubuntu-sleeper
    image: ubuntu-sleeper
    command: ["sleep"] # This is like Docker `ENTRYPOINT` (it overwite it)
    args: ["10"] # This is like the Docker `CMD`, it pass arguments to the `command` or to the Docker `ENTRYPOINT` 
```

## ENV variables

Use an env property, which is an array:
```
spec:
  containers:
  - name: ubuntu-sleeper
    image: ubuntu-sleeper
    env:
    - name: HOLA
      value: adios 
    - name: FOO
      value: bar 
```

Other way to set up environmet variables is through Configmaps or Secrets.

## ConfigMaps
Using env variables can be messy, with ConfigMaps, we can pass env variables much easier.

Creation of a config map:
```
# Create a new configmap passing the variables, you can repeat the --form-literal as much as you want
kubectl create configmap name-config-map --from-literal=AAA=bbb
# Create a configmap from a yaml file
kubectl create -f my-configmap.yaml
```

ConfigMap Yaml
```
apiVersion: v1
kind: ConfigMap
metadata:
  name: my-config-map
data:
  env1: value1
  env2: value2
```

Add a Configmap in a Pod:
```
spec:
  containers:
  - name: my-container
    image: my-image
    envFrom:
    - configMapRef:
        name: my-config-map # name of the configMap
```

Useful Commands:
```
kubectl get configmaps
kubectl describe configmaps my-config-map
```


## Secrets
Is like a configMap but base64 encrypted.

useful commands
```
# Create imperative, add as many --from-literal as you want
kubectl create secret generic secret-name --from-literal=key1=value1
kubectl create secret generic secret-name --from-literal=key1=value1
# Create through a file
kubectl create secret generic secret-name --from-file=file
# Declarative way
kubectl create -f secret.yaml
# get
kubectl get secrets
# describe
kubectl describe secrets secret-name
# get with values (base64 values)
kubectl get secrets secret-name -o yaml
```


Secret Yaml
```
apiVersion: v1
kind: Secret
metadata:
  name: secret-name
data:
 secret1: asdfadsf # The value must be encoded in base64
```

you can encode/decode with:
```
echo 'password' | base64
echo 'cGFzc3dvcmQK' | base64 --decode
```

Adding secrets to a Pod
```
spec:
  containers:
  - name: my-pod
    image: my-image
    envFrom:
      - secretRef:
          name: name-secret
```

## InitContainers
In a Pod when you want to execute some code before other containers start, you can do it with a InitContainer.
The initContainer process needs to run to completion.
You can can have several InitContainers, they will run one at a time, till they complete.
After that the normal containers will start.

Yaml
```
spec:
  containers:
  - name: myapp-container
    image: busybox:1.28
    command: ['sh', '-c', 'echo The app is running! && sleep 3600']
  initContainers:
  - name: init-myservice
    image: busybox
    command: ['sh', '-c', 'git clone <some-repository-that-will-be-used-by-application> ; done;']

```
