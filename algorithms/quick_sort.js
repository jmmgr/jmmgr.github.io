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
