# Redis

Monitor a redis network
```
redis-cli -h development-logger.xxxxxx.io -p 6379 monitor
```

Connect to a specific DB
```
redis-cli -h development-logger.xxxxxxx.io -p 6379 -n 401
```

Get all values (careful in prod, is costly) ``` keys * ```

Flush a specific db ``` flushdb ```


## Data types

Get the data type of one key

``` TYPE key ```

### Strings

Get one element ``` GET key ```

Set one element ``` SET key value ```

Delete one element ``` DEL key ```

### Lists

Lists are good for adding elements, but expensive to find an element in the middle.

Add element to the head ``` LPUSH key element ```

Add element to the tail ``` RPUSH key element ```

Extract element of a list ``` LPOP key ```

Get all elements in list ``` LRANGE key 0 -1 ```

Length of the list ``` LLEN key ```

### Sets

Sets don't allow repeated elements, and accesing elements is O(1).

Add a new element ``` SADD key element ```

Remove an element of a set ``` SREM key element ```

Get all elements in the set ``` SMEMBERS key ```

Verify if a element exists ``` SISMEMBERS key element ```

Length of the set ``` SCARD key ```


### Sorted Sets

Like sets, but each element have a score. This score is used to order the set, from smallest to greatest.

Add a new element ```  ZADD key score element ```

Add several elements ```  ZADD key score element score element ```

Remove element of a set ``` ZREM key element ```

Get all elements in the set ``` ZRANGE key 0 -1 ```

Get all elements with scores ``` ZRANGE key 0 -1 WITHSCORES ```

Get score of a member ``` ZSCORE key element ```

Length of the set ``` ZCARD key ```


### Hash

Add new field to the hash ``` HSET key field value ```

Get one field ```  HGET key field ```

Get all the fields ```  HGETALL key ```

Delete field ``` HDEL key field ```
