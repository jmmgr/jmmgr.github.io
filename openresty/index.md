# Openresty

## Content

<!-- toc -->

- [Introduction](#introduction)
- [Basic directives:](#basic-directives)
  * [lua_code_cache](#lua_code_cache)
  * [init_by_lua](#init_by_lua)
  * [init_by_lua_file](#init_by_lua_file)
  * [set_by_lua](#set_by_lua)
  * [set_by_lua_file](#set_by_lua_file)
  * [content_by_lua_block](#content_by_lua_block)
  * [content_by_lua_file](#content_by_lua_file)
  * [rewrite_by_lua_block](#rewrite_by_lua_block)
  * [access_by_lua_block](#access_by_lua_block)
- [Nnginx API](#nnginx-api)
  * [ngx.location.capture](#ngxlocationcapture)
  * [ngx.location.capture.multi](#ngxlocationcapturemulti)
  * [req](#req)
    + [headers](#headers)
    + [body](#body)
    + [method](#method)
    + [URI](#uri)
    + [URL arguments](#url-arguments)
  * [res](#res)
    + [headers](#headers-1)
    + [status](#status)
    + [body](#body-1)
  * [Debug](#debug)
  * [Working with JSON](#working-with-json)

<!-- tocstop -->

## Introduction

Openrestry is an extension of Nginx that supports LUA.

Base on http://www.staticshin.com/programming/definitely-an-open-resty-guide/

## Basic directives:

### lua_code_cache

This won't cache the ```*by_lua_file``` directives, is good for debug, but don't use it in production or it will make the service slower.
(So not neet of restart Nginx if you change a LUA file).  
### init_by_lua

Init some Global variables. Notice that global variables are a bad idea in LUA in general, you should use ```local``` as much as possible.

```
init_by_lua '
cjson = require("cjson") -- cjson is a global variable
'
```
This will declare cjson as a variable, it can be used in all the LUA scripts.

### init_by_lua_file

Same as ```init_by_lua``` but you pass a file instead.

### set_by_lua

Is similar to Nginx ```set```, but evaluating some LUA string.

Notice is blocking the event loop, so only use with basic directives, not loops.

```
location /set_by_lua{
set $nvar 20;
set_by_lua $lvar 'return ngx.var.nvar+1';
echo "$nvar,$lvar";
}
```

### set_by_lua_file 

Same as ```set_by_lua``` but evaluates the LUA of a file.


### content_by_lua_block

[link](https://github.com/openresty/lua-nginx-module#content_by_lua_block)
Executes some LUA code, but is not blocking the event loop, it will execute in another subroutine.

```
 content_by_lua_block {
     ngx.say("I need no extra escaping here, for example: \r\nblah")
 }
```

### content_by_lua_file
As ```content_by_lua_block``` but using a file.

```
 location ~ ^/app/([-_a-zA-Z0-9/]+) {
     set $path $1;
     content_by_lua_file /path/to/lua/app/root/$path.lua;
 }
```

### rewrite_by_lua_block

Similar to the [Nginx one](https://nginx.org/en/docs/http/ngx_http_rewrite_module.html).
It rewrites the URI requested, can be used for example to redirect to a new url.
It spawn a new coroutine.

But the lua one can execute LUA code, so it can make API calls, and then redirect

For example using Nginx only:
```
 location / {
     eval $res {
         proxy_pass http://foo.com/check-spam;
     }

     if ($res = 'spam') {
         rewrite ^ /terms-of-use.html redirect;
     }

     fastcgi_pass ...;
 }
```

Using LUA:
```
 location = /check-spam {
     internal;
     proxy_pass http://foo.com/check-spam;
 }

 location / {
     rewrite_by_lua '
         local res = ngx.location.capture("/check-spam")
         if res.body == "spam" then
             return ngx.redirect("/terms-of-use.html")
         end
     ';

     fastcgi_pass ...;
 }
```

In both cases, we will first check if is spam, if afirmative redirect the ```terms-of-use```.

### access_by_lua_block

Similar to the [Nginx one](https://nginx.org/en/docs/http/ngx_http_access_module.html).
(limit access to certain client addresses).

You can get those addreses making an API call.

```
location / {
     access_by_lua_block {
         local res = ngx.location.capture("/auth")

         if res.status == ngx.HTTP_OK then
             return
         end

         if res.status == ngx.HTTP_FORBIDDEN then
             ngx.exit(res.status)
         end

         ngx.exit(ngx.HTTP_INTERNAL_SERVER_ERROR)
     }

     # proxy_pass/fastcgi_pass/postgres_pass/...
 }
```

## Nnginx API

This is where Nginx do more of the things, and we can use it in the LUA code.

Nginx makes 2 packages to be available as global variables: ngx and ndk.

### ngx.location.capture

It allows you to do a request to an internal location.

It doesn't make any HTTP execution, but internally will arrange the value.

Remember that the URI must be internal. For external we can use proxy pass. For example:

```
local res = ngx.location.capture("/google_proxy")
```

```
location /google_proxy{
	proxy_pass http://www.google.com/;
}
```

We will internally call /google_proxy, and then proxy_pass to the external URI.

The res will have:
- res.status
- res.header
- res.body
- res.truncated

We can access the headers as res.header["Content-type"].

You can pass more information other than the URI, as:

```
local res = ngx.location.caputre("/hello",{args={a=1,b=2}})
```

```
local account_page = ngx.location.capture("/get_account",
{method=ngx.HTTP_POST,body=
json_body,args={user_name=name}
})
```

### ngx.location.capture.multi

Is like location, but doing several request in pararel.

{% raw %}
```
local home,about,contact = ngx.location.capture.multi{{"/home"},{"/about"},{"/contact"}}
```
{% endraw %}


### req

To get the request info we can use req:

#### headers
```
local headers = ngx.req.get_headers()
local cookie = headers["Cookie"]
local etag = headers["Etag"]
local host = headers["Host"]
```

other actions with headers can be:
- ngx.req.set_header
- ngx.req.clear_header
- ngx.req.raw_header

set_header and clear_header are use in the request because by default, all the subrequests subsequently initiated by ngx.location.capture and ngx.location.capture_multi will inherit the new header.


#### body

ngx.req.body() reads all the body data, once it has ben read, you can aaccess through: 
- ngx.req.get_body_data
- ngx.req.get_post_args

As well we can use:
- ngx.set_body_data

To set new data.

#### method

- ngx.req.get_method
- ngx.req.set_method

You can access to the ENUMS as:
```
ngx.req.set_method(ngx.HTTP_POST)
```
ngx.HTTP_POST

#### URI

ngx.req.set_uri

#### URL arguments

For getting the argument "a" we can do:
```
local arg_a = ngx.req.get_uri_args()["a"]
```

We can set either by string or objects:

```
ngx.req.set_uri_args("a=3&b=hello%20world")

ngx.req.set_uri_args({ a = 3, b = {5, 6} })

```

### res

This allow us to modify the response to send back to the client.

#### headers

Note that any ```-``` in a header is replaced by a ```_```.

ngx.header will is the header of the response (no need of res).

```
ngx.header.content_type = "application/json" 
```
Although an ngx.header looks and behaves like a table it is not.The ngx.header does not return an iteratable lua table. For that purpose use:

```
local resp_headers = ngx.resp.get_headers()
```

#### status

```
ngx.status = ngx.HTTP_NOT_MODIFIED
```

#### body

Openrestry gives two methods to return the body: ngx.say() and ngx.print().

Print doesn't have a \n at the end, but says has it.

```
ngx.print("Hello world") --sends  Hello world
ngx.say("Hello world") -- sends Hello world/n that is the body appended with a newline
ngx.say(cjson.encode({a=1,b=2})) -- you can also send json in the response body
```

### Debug

For debug openresty, you can check the logs (wherever you set them in the nginx.conf.

```
error_log logs/error.log;
```

As well you can set it as the sterr (so it will show in the terminal)

```
error_log /dev/stderr;
```

Another useful tool to debug is ngx.log, for example:
```
local body = res.body
ngx.log(ngx.ERR,body)
```

### Working with JSON
Openresty comes with cjson pre installed.

we can use as cjson.encode() anad cjson.decode().

Notice that in LUA there is not Arrays, there is only tables. (like objects).
So this are 2 valid tables:
```
local table1 = {hola== "adios"}
or 
local table2 = {"hola", "adios"}
```

The first one will be access as:
table1.hola
--> adios

The second one:
table2[1]
--> hola

Notice that the Tables whitout index start from 1.

