# Search

## Content

<!-- toc -->

- [Introduction](#introduction)
- [Binary Search](#binary-search)

<!-- tocstop -->

## Introduction

Search algorithms efficiently

## Binary Search

Binary search is for search elements in a ordered array.
It divided the array by 2, check if that element is looking for, if not, if is bigger looks in the left, smaller in the right.

The worst case scenario is log2(n) + 1. Imagine a 4 elements array, where we want to find 0.
```
|0|1|2|3| // first we try the 2, since is not correct we go left
|0|1| // next we try the 1, since is not, we move to the left
|0| // now we  try the 0, the number of tries is log2(4) + 1 = 3
```

Complexity:
- Worst case scenario: O(log(n)).
- Best case scenario: O(1).
- Average case scenario: O(log(n)).


Example using JS:
```
const array_origin = [ 1, 2, 3, 7, 10, 20, 93 ];
console.log(binary_search(2, array_origin));

function binary_search (element, array) {
	if (array.length === 0) {
		throw 'Not found element';
	}
	const index = Math.floor(array.length / 2);
	if (array[index] === element) {
		return index;
	}
	if (array[index] > element) {
		// search in the left
		return binary_search(element, array.splice(0, index));
	}
	// search in the left
	return binary_search(element, array.splice(index + 1));
}
```
