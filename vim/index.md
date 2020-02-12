# Template

## Content

<!-- toc -->

## Introduction

Some VIM knowledge that is good not to forget


### Setting Starscope (similar to C-tags)

[Tutorial about Cscope](http://cscope.sourceforge.net/cscope_vim_tutorial.html)

[Tutorial about Starscope](https://github.com/eapache/starscope/blob/master/doc/USER_GUIDE.md)

Csope is for `c` if you want another language you need a tool that generate similar files.

Starscope supports Ruby and Javascript.

You can install as `gem install starscope`

Generate the DB
```
starscope
```

Notice that this will generate a DB of all the subdirectories, so if you want to search cross-project, better to execute it in the common directory.

After that we can export the DB in a format that `Cscope` understands
```
startscope -e cscope
```

This will generate a `cscope.out` file


#### Adding Cscope into VIM

You can add this [cscope_maps.vim](http://cscope.sourceforge.net/cscope_maps.vim) fime into the `~/.vim/plugin`

After that you need to make some changes:
- Change the line 41 with the your `cscope.out` file


#### Debugging Cscope

First try to make it without vim, this will try to find all places where this Query string a appears
```
scope -f ~/git/cscope.out -dL0 Query
```
As well you can test trying to find the definition
```
scope -f ~/git/cscope.out -dL1 Query
```
