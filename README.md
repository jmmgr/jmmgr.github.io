# wiki
Wiki of knowledge I keep forgetting

## index

[index](index.md)

## Verify the changes in local before to commit

[Grip](https://github.com/joeyespo/grip) allows to preview in local with Github templates.

Install

```
pip install grip

```

Run inside the folder
```
grip -b
```
(with the -b option it will open a browser)

## Generate commmon TOC

Add TOC placeholders to the files that you want to have it
```
<!-- toc -->
<!-- tocstop -->
```

Run
```
npm install -g markdown-toc
markdown-toc -i **/*.md
```
