# Terminal tools

## tcpdump

## sed

Replace in place in all the js files:
```
sed -i 's/find/replace/' **/*.js
```

## find

Using or in find
```
find . -name *.4ct -o -name *.idv  
```

Delete
```
find . -name *.4ct -o -name *.idv -delete
```

## grep

Excluding directories

```
grep -rn --exclude-dir={node_modules,log,coverage,.nyc_output}

-r recursive
-n prefix each line with line number
```
