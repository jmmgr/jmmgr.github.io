# Beanstalkd

Protocol: https://github.com/kr/beanstalkd/blob/v1.3/doc/protocol.txt

### connect
You can connect through Telnet 
```
telnet 130.XXX.XXX.21 11300
```

As well you can use a wrap around the telnet command, so once in telnet it wil have history of the commands you have executed.

```
rlwrap telnet -e '#' 130.XXX.XXX.21 11300
```

The '#' will be the escape character (seems ctr + ] won't work with the rlwrap) 

### commands

```
list-tubes
use queue_name
peek-buried
delete id
```

