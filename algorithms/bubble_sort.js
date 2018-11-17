const array_origin = [10, 3, 7, 2, 1, 20, 93];
console.log(bubble_sort(array_origin));

function bubble_sort(array) {
    let bribes = 0;
    let swapped;
    do {
        swapped = false;
        for (let i = 0; i < array.length - 1; i++) {
            if (array[i] > array[i + 1]) {
                const current = array[i];
                array[i] = array[i + 1];
                array[i + 1] = current;
                swapped = true;
            }
        }
    } while (swapped);
	return array;
}
