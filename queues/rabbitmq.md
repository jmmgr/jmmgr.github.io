# RabbitMQ

## Content

<!-- toc -->

  * [Introduction](#introduction)
  * [Arquitecture](#arquitecture)
    + [Distributed](#distributed)
      - [Clustering](#clustering)
      - [Federation](#federation)
    + [Automatic and manual ACK](#automatic-and-manual-ack)
    + [Durability](#durability)
    + [Dispatch](#dispatch)
    + [Publish/Subscribe](#publishsubscribe)
      - [Exchanges](#exchanges)
      - [fanout](#fanout)
      - [direct](#direct)
      - [topic](#topic)
- [(hash) can substitute for zero or more words.](#hash-can-substitute-for-zero-or-more-words)
  * [Code examples](#code-examples)
    + [Hello world](#hello-world)
    + [Manually ACK](#manualy-ack)
    + [Durability](#durability-1)
    + [Distpatch](#distpatch)
    + [Exchange fanout](#exchange-fanout)
    + [Exchange direct](#exchange-direct)
    + [Exchange topic](#exchange-topic)
  * [Commands](#commands)

<!-- tocstop -->

## Introduction
[Rabbitmq Protocol](https://www.rabbitmq.com/resources/specs/amqp0-9-1.pdf)

RabbitMQ is a message broker, can work distributed.
We got this info base in the (getting started)[https://www.rabbitmq.com/getstarted.html]


## Arquitecture

In RabbitMQ we have Producers and consumers.
By default, RabbitMQ will send each message to the next consumer, in sequence. On average every consumer will get the same number of messages. This way of distributing messages is called __round-robin__.

### Distributed 
There are 2 main options to make distributed, Clustering and Federation.

#### Clustering
- Chooses __Consistency__ and Partition Tolerance (CP) from the CAP theorem. 
- A cluster forms a single logical broker.
- Brokers must be connected via reliable LAN links. Communication is via Erlang internode messaging, requiring a shared Erlang cookie. 
- All nodes connect to all other nodes in both directions. 
- A client connecting to any node can see queues on all nodes.

Usually the users will have several endpoints to connect, if one fail, will reconnect to another.

#### Federation
- Brokers are logically separate and may have different owners. 
- Brokers can be connected via unreliable WAN links. Communication is via AMQP (optionally secured by SSL), requiring appropriate users and permissions to be set up. 
- Brokers can be connected in whatever topology you arrange. Links can be one- or two-way.
- Chooses __Availability__ and Partition Tolerance (AP) from the CAP theorem.
- A client connecting to any broker can only see queues in that broker.

### Automatic and manual ACK
Once RabbitMQ delivers a message to the customer it immediately marks it for deletion. In this case, if you kill a worker we will lose the message it was just processing. We'll also lose all the messages that were dispatched to this particular worker but were not yet handled.
This is the default behaviour, but you can sent autoACK to false (in the basicConsume), and then you need to explicity send the ack, there is not timeout, RabittMQ will check if the worker is alive. If the worker dies will send to another.

### Durability
When RabbitMQ quits or crashes it will forget the queues and messages unless you tell it not to. Two things are required to make sure that messages aren't lost: we need to mark both the queue and messages as durable.
So it will save the messages in Disk, if you set up this options.

### Dispatch
By default RabbitMQ dispatch the message the moment it arrives the queue (no matter if the worker is busy or not), to avoid this we can use basicQos with the int prefetchCount = 1 setting. This will make the workers to only receive one message at a time, till they receive the next one.
Notice that the queue will be growing if we do this way.

### Publish/Subscribe
Instead of 1 message to 1 worker, we can do 1 message to several workers (whoever is subscribed).

#### Exchanges
The core idea in the messaging model in RabbitMQ is that the producer never sends any messages directly to a queue. Actually, quite often the producer doesn't even know if a message will be delivered to any queue at all.
Instead, the producer can only send messages to an exchange. An exchange is a very simple thing. On one side it receives messages from producers and the other side it pushes them to queues. The exchange must know exactly what to do with a message it receives. Should it be appended to a particular queue? Should it be appended to many queues? Or should it get discarded. The rules for that are defined by the exchange type.
There are a few exchange types available: direct, topic, headers and fanout

So the idea is, the producer doesn't need to know anything about queues, only about the exchange, then the worker need to connect to the exchange, __bind__ the queues, and consume from the queues.

#### fanout
The fanout exchange is very simple. It just broadcasts all the messages it receives to all the queues it knows. 

#### direct
The routing algorithm behind a direct exchange is simple - a message goes to the queues whose binding key exactly matches the routing key of the message.
- On publish the message we need to provide the routing key.
- On binding the queue with the exchange we provide a "routing key" as well. (we bind once per routing key and queue, so same queue can have severals)

#### topic
Similar as topics, but allows several criterias. Is a list of words delimitated by dots. As:
stock.usd.nyse
nyse.vmw
(limit of 255 bytes)
So the Producers will send to an exchange giving this topics.
The consumers will use special characters to bind to a queue:
- * (star) can substitute for exactly one word.
- # (hash) can substitute for zero or more words.

Imagine we have a routing key as <stock_name>.<currency>.<exchange>, we can have:
- 992.HKD.HKE
- TSL.USD.NASDAQ

we can bind to:
- 992.*.* --> interested only in Lenovo
- TSL.# --> intereseted only in Tesla
- *.HKD.* --> interested only HKD

If a message with a routing key doesn't match any, will be discarded.
The routing keys start comparing from the beginning, so if we publish 992.hola.adios.hola, we will macth 992.*.*


## Code examples
### Hello world
Most important parts:
- we need to create a connection
- as well create a chanel
- then user basicPublis and basicConsume

Connect to the Server
```
ConnectionFactory factory = new ConnectionFactory();
factory.setHost("localhost");
Connection connection = factory.newConnection();
Channel channel = connection.createChannel();
```

Send message to a Queue
```
channel.queueDeclare(QUEUE_NAME, false, false, false, null);
String message = "Hello World!";
channel.basicPublish("", QUEUE_NAME, null, message.getBytes());
System.out.println(" [x] Sent '" + message + "'");
```

For receive messages from the queue, we need to connect the same as the producter, and then add:
```
Consumer consumer = new DefaultConsumer(channel) {
  @Override
  public void handleDelivery(String consumerTag, Envelope envelope,
                             AMQP.BasicProperties properties, byte[] body)
      throws IOException {
    String message = new String(body, "UTF-8");
    System.out.println(" [x] Received '" + message + "'");
  }
};
channel.basicConsume(QUEUE_NAME, true, consumer);
```

### Manually ACK
Only need to add it on basicConsume, and as well don't forget to do the basicAck
```
boolean autoAck = false;
channel.basicConsume(TASK_QUEUE_NAME, autoAck, consumer);

// and then in consumer
channel.basicAck(envelope.getDeliveryTag(), false);
```

### Durability
We need to set up in the queue and in the basicPublish:

```
boolean durable = true;
channel.queueDeclare("task_queue", durable, false, false, null);
```

```
channel.basicPublish("", "task_queue",
            MessageProperties.PERSISTENT_TEXT_PLAIN,
            message.getBytes());
```

### Distpatch

```
int prefetchCount = 1;
channel.basicQos(prefetchCount);
```

### Exchange fanout

Declare the exchange.
```
channel.exchangeDeclare("logs", "fanout");
```

Binding a queue with the exchange
```
String queueName = channel.queueDeclare().getQueue(); // gets a random name for a queue
channel.queueBind(queueName, "logs", "");
```

Publish the job in the logs exchange.
```
channel.basicPublish( "logs", "", null, message.getBytes());
```
(If you provide "", it would go to the default exchange, so the messages will be routed to the queue)

### Exchange direct
Declare the exchange
```
channel.exchangeDeclare(EXCHANGE_NAME, "direct");
```

Publish the message
```
channel.basicPublish(EXCHANGE_NAME, ROUTING_KEY, null, message.getBytes());
```

Consumer binding:
```
channel.exchangeDeclare(EXCHANGE_NAME, "direct");
channel.queueBind(queueName, EXCHANGE_NAME, ROUTING_KEY1);
channel.queueBind(queueName, EXCHANGE_NAME, ROUTING_KEY2);
```

### Exchange topic
Declare the exchane and publish
```
channel.exchangeDeclare(EXCHANGE_NAME, "topic");
channel.basicPublish(EXCHANGE_NAME, ROUTING_KEY, null, message.getBytes());
```

Consumer
```
channel.exchangeDeclare(EXCHANGE_NAME, "topic");
channel.queueBind(queueName, EXCHANGE_NAME, bindingKey);
```


## Commands

Listing the queues
```
sudo rabbitmqctl list_queues
```

Checking which messages hasn't been ack (only on manualy ack).
```
sudo rabbitmqctl list_queues name messages_ready messages_unacknowledged
```

list exchanges
```
sudo rabbitmqctl list_exchanges
```

list bindings
```
rabbitmqctl list_bindings
```
