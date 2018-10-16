const array_origin = [10, 3, 7, 2, 1, 20, 93];
console.log(merge_sort(array_origin));

function merge_sort (array) {
	if (array.length <= 1) {
		return array;
	}
	const middle = array.length / 2;
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
