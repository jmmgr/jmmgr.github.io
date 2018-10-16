const array = [10, 3, 7, 2, 1, 20, 93];
console.log(array);

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
console.log(array);
