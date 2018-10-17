const tree_origin = {
	value: '4',
	left: {
		value: '2',
		left: {
			value: '1',
		},
		right: {
			value: '3',
		}
	},
	right: {
		value: '6',
		left: {
			value: '5',
		},
		right: {
			value: '7',
		}
	}
};

function breadth_first_search(queue) {
	const out = [];
	while (queue.length > 0) {
		let element = queue.shift();
		console.log(element.value);

		if (element.left) queue.push(element.left);
		if (element.right) queue.push(element.right);
	}
}
breadth_first_search([tree_origin]);
