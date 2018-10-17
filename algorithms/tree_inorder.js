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

function inorder(tree) {
	if (tree.left) {
		inorder(tree.left);
	}
	console.log(tree.value);
	if (tree.right) {
		inorder(tree.right);
	}
}
inorder(tree_origin);

console.log('-------------');

function inorder_no_recursive(tree_origin) {
	const stack = [];
	let current_node = tree_origin;
	while (stack.length > 0 || current_node) {
		if (current_node) {
			stack.push(current_node);
			current_node = current_node.left;
		} else {
			current_node = stack.pop();
			console.log(current_node.value);
			current_node = current_node.right;
		}
	}
}
inorder_no_recursive(tree_origin);
