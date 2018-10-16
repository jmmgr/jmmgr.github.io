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
