# Sorting

## Content

<!-- toc -->

- [Introduction](#introduction)
- [Insertion Sort](#insertion-sort)
- [Merge Sort](#merge-sort)
- [Quick Sort](#quick-sort)

<!-- tocstop -->

## Introduction

There are different ways to order elements, here we will explain some common algorithms to order, and its features and drawbacks.

## Insertion Sort

Starting from the first element, find its correct place comparing it with all the elements in the left, and insert.

In the best case scenario we would need to compare (n -1), since each element (but the first one), will be need to compare only once, and decide you don't need to move it.

In the worst case scenario, every element needs to be compare to all the elements lower than him. So it should be (n - 1)(n)/2.

Complexity:
- Worst case scenario: O(n^2).
- Best case scenario: O(n).
- Average case scenario: O(n^2).

!(insertion sort gif)[https://upload.wikimedia.org/wikipedia/commons/0/0f/Insertion-sort-example-300px.gif]
!(insertion sort gif2)[https://upload.wikimedia.org/wikipedia/commons/4/42/Insertion_sort.gif]

Example using JS.
```
const array = [10, 3, 7, 2, 1, 20, 93];

for (let i = 1; i < array.length; i++) {
	for (let j = i - 1; j >= 0; j--) {
		if (array[j] < array[i]) {
			// remove the element
			const value = array.splice(i, 1)[0];
			// insert element at the j position
			array.splice(j + 1, 0, value);
			break;
		} else if (j === 0) {
			// case when the element is the smallest
			const value = array.splice(i, 1)[0];
			array.splice(j, 0, value);
		}
	}
}
```

## Merge Sort

Merge sort is a recursive algorithm. The idea is divide first the array into arrays of one element, and then start joining them and sorting together.

Complexity:
- Worst case scenario: O(nlog(n)).
- Best case scenario: O(nlog(n)).
- Average case scenario: O(nlog(n)).

!(merge sort order gif)[https://upload.wikimedia.org/wikipedia/commons/c/cc/Merge-sort-example-300px.gif]
!(merge sort visualize gif)[https://upload.wikimedia.org/wikipedia/commons/c/c5/Merge_sort_animation2.gif]
!(merge sort image)[https://ds055uzetaobb.cloudfront.net/image_optimizer/ecf26f1700ce8f8a6aa757e5a67dae09579d16e4.jpg]



```
const array_origin = [10, 3, 7, 2, 1, 20, 93];
console.log(merge_sort(array_origin));

function merge_sort (array) {
	if (array.length <= 1) {
		return array;
	}
	const middle = Math.floor(array.length / 2);
	const left = merge_sort(array.splice(0, middle));
	const right = merge_sort(array);
	// merge both arrays together
	let new_array = [];
	let left_idx = 0;
	let right_idx = 0;
	while (left_idx < left.length && right_idx < right.length) {
		if (left[left_idx] < right[right_idx]) {
			new_array.push(left[left_idx]);
			left_idx++;
		} else {
			new_array.push(right[right_idx]);
			right_idx++;
		}
	}
	if (left_idx < left.length) {
		new_array = new_array.concat(left.splice(left_idx));
	}
	if (right_idx < right.length) {
		new_array = new_array.concat(right.splice(right_idx));
	}
	return new_array;
}
```

## Quick Sort

Quicksort is a divide and conquer algorithm. Quicksort first divides a large array into two smaller sub-arrays: the low elements and the high elements. Quicksort can then recursively sort the sub-arrays.

The steps are:

1. Pick an element, called a pivot, from the array.
2. Partitioning: reorder the array so that all elements with values less than the pivot come before the pivot, while all elements with values greater than the pivot come after it (equal values can go either way). After this partitioning, the pivot is in its final position. This is called the partition operation.
3. Recursively apply the above steps to the sub-array of elements with smaller values and separately to the sub-array of elements with greater values.

The base case of the recursion is arrays of size zero or one, which are in order by definition, so they never need to be sorted.

The pivot selection and partitioning steps can be done in several different ways; the choice of specific implementation schemes greatly affects the algorithm's performance.

Complexity:
- Worst case scenario: O(n^2).
- Best case scenario: O(nlog(n)).
- Average case scenario: O(nlog(n)).

Notice that in general Quick sort is faster than merge sort.

!(quick sort merge)[https://upload.wikimedia.org/wikipedia/commons/6/6a/Sorting_quicksort_anim.gif]

Example in JS:
```
const array_origin = [10, 3, 7, 2, 1, 20, 93];
console.log(quick_sort(array_origin));

function quick_sort (array) {
	if (array.length <= 1) {
		return array;
	}
	// pick a pivot
	const pivot = array[0];
	const array_left = [];
	const array_right = [];

	for (let i=1; i < array.length; i++) {
		if (array[i] > pivot) {
			array_right.push(array[i]);
		}else {
			array_left.push(array[i]);
		}
	}
	const array_left_order = quick_sort(array_left);
	const array_right_order = quick_sort(array_right);

	return array_left_order.concat([pivot]).concat(array_right_order);
}
```
