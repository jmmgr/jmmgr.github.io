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

function postorder(tree) {
	if (tree.left) {
		postorder(tree.left);
	}
	if (tree.right) {
		postorder(tree.right);
	}
	console.log(tree.value);
}
postorder(tree_origin);
console.log('-------------');

function postorder_no_recursive(stack) {
	const out = [];
	while (stack.length > 0) {
		let element = stack.pop();
		out.push(element.value);

		if (element.left) stack.push(element.left);
		if (element.right) stack.push(element.right);
	}
	while (out.length > 0) {
		console.log(out.pop());
	}
}
postorder_no_recursive([tree_origin]);
