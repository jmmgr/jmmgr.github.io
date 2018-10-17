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

function preorder(tree) {
	console.log(tree.value);
	if (tree.left) {
		preorder(tree.left);
	}
	if (tree.right) {
		preorder(tree.right);
	}
}
preorder(tree_origin);

console.log('-------------');

// we receive the stack with the tree inside
function preorder_no_recursive(stack) {
	while (stack.length > 0) {
		const element = stack.pop();
		console.log(element.value);
		if (element.right) stack.push(element.right);
		if (element.left) stack.push(element.left);
	}
}
preorder_no_recursive([tree_origin]);
