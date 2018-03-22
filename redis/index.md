# Redis

Monitor a redis network
```
redis-cli -h development-logger.postmen.io -p 6379 monitor
```

Connect to a specific DB
```
redis-cli -h development-logger.postmen.io -p 6379 -n 401
```

Get all values (careful in prod, is costly) ``` keys * ```

Flush a specific db ``` flushdb ```


## Simple elements

Get one element ``` get key ```

Set one element ``` set key value ```

Delete one element ``` del key ```

## Lists

Add element to a list ``` LPUSH key value ```

Extract element of a list ``` LPOP key ```

Get all elements in list ``` LRANGE key 0 -1 ```

Lenght of the list ``` LLEN key ```

