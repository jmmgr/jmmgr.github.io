# Trees

## Content

<!-- toc -->

- [Introduction](#introduction)
- [Concepts](#concepts)
- [Concepts Binary trees](#concepts-binary-trees)
- [Transvering a tree](#transvering-a-tree)
  * [Depth first search](#depth-first-search)
    + [Pre-order (NLR)](#pre-order-nlr)
    + [In-order (LNR)](#in-order-lnr)
    + [Post-order (LRN)](#post-order-lrn)
  * [Breadth First Search](#breadth-first-search)
- [BST](#bst)
  * [Balanced tree](#balanced-tree)
- [AVL](#avl)
- [Red-black tree](#red-black-tree)

<!-- tocstop -->

## Introduction

A tree is a data structure that represent the data with a collection of linked nodes, starting with the root node, and finishing in leaf nodes.


A tree of unordered data is quite useless, because for finding data we will need to visit all the nodes. So we usually try to order the trees.

## Concepts
The depth of a node is the number of branches from the root to the node. The node height is the number of nodes from between the original node and the deepest leaf. The tree height is the node height of the root, i.e. the number of branches along the longest path in the tree.

!(tree-depth-height)[https://i.stack.imgur.com/8yPi9.png]

## Concepts Binary trees
A full binary tree is a binary tree in which each node has exactly zero or two children. (all the full binary trees have an odd number of nodes).

A complete binary tree is a binary tree in which every level, except possibly the last, is completely filled, and all nodes are as far left as possible. 

## Transvering a tree
if we want to visit all the nodes of a trees, there is 2 main ways, top to bottom or left to right.

Having this JS tree as an object.
```
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
```

### Depth first search
This way of searching a tree is going top to bottom. 

Usually can be represented with a stack (LIFO). Will be like:
- push the root in the stack.
- pop stack, get that element push right and then left children. (repeat this step for the rest)
As you can see we, since we push first the right, and then the right, we will process the left and all its children before process the right.

There are 3 options.

#### Pre-order (NLR)
First visit Node then Left then Right.

![tree_preorder](https://upload.wikimedia.org/wikipedia/commons/d/d4/Sorted_binary_tree_preorder.svg)

Example in JS recursive
```
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
```

Example in JS no recursive
```
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
```

#### In-order (LNR)
First visit Left then Node then Right.
In a case of a BST, In-order visit will visit from the smallest to the biggest node.

![tree_inorder](https://upload.wikimedia.org/wikipedia/commons/7/77/Sorted_binary_tree_inorder.svg)

Example using JS.
```
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
```
Example using JS not recursive.
```
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
```

#### Post-order (LRN)
First visit Left then right then Node.

![tree_postorder](https://upload.wikimedia.org/wikipedia/commons/9/9d/Sorted_binary_tree_postorder.svg)

Example using JS
```
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
```

Example using JS not recursive.
```
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
```

As you can see the no recursive is the same as the preorder, but instead of "log" right away, we put the values in another stack. (This doesn't mean that one is reverse than the other).

### Breadth First Search

On the BFS we will search first all the current levels before we pass to the next one. It can be represented as a queue.

Example using JS.
```
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
```

## BST
Binary Search Trees.

A BST is a binary tree (max 2 childrens per node), where the tree is ordered. In a BST we consider ordered if for any given node, the left children is smaller and the right children is bigger.
Notice that BST can't have repeated elements.

BST can be very inneficient if they are not balanced. Can be the same as linked lists.

|Algorithm	|Average	|Worst case|
|-----------|-----------|----------|
|Space		|O(n)		|O(n)      |
|Search		|O(log n)	|O(n)      |
|Insert		|O(log n)	|O(n)      |
|Delete		|O(log n)	|O(n)      |

### Balanced tree
A balaced tree is a tree that fulfill all this conditions:
- The left and right subtrees' heights differ by at most one
- The left subtree is balanced
- The right subtree is balanced

## AVL
AVL are a type of of BST that are self balanced, so on insertion or deleted are more efficient than BST.
Notice, that the insertion and the deletion are much more expensive than in BST, cause the need of maintain the tree balance.
So is a good idea to use it when there is not a lot of inserts/delete, but a lot of searchs.

|Algorithm	|Average	|Worst case|
|-----------|-----------|----------|
|Space		|O(n)		|O(n)      |
|Search		|O(log n)	|O(log n)  |
|Insert		|O(log n)	|O(log n)  |
|Delete		|O(log n)	|O(log n)  |


When you insert/delete a node, we need to check if all the ancestors are balance (retracing), if is not balance anymore we will need to rebalance.

![Example-rebalance-avl](https://upload.wikimedia.org/wikipedia/commons/f/fd/AVL_Tree_Example.gif)

For rebalancing we need to rotate the tree. Rotating the tree is only switch 2 values. It can be right rotation (switch a left children with his parent) or left rotation (switch a right children with his parent).

There are 4 cases that may need rebalance: 
- Left-Left -> One right rotation needed.
- Left-Right -> First left rotation, then right rotation.
- Right-Left -> First right rotation, then left rotation.
- Right-Right-> One left rotation needed.


Example left-left
![rotate_left_left](https://ds055uzetaobb.cloudfront.net/image_optimizer/d2c5af8d07713b346c5acf8234ffc5ddc4e45b51.png)

Example left-right
![rotate_left_right](https://ds055uzetaobb.cloudfront.net/image_optimizer/9368f75f6beb38ec1a914c5fdb8932e62c01b1d7.png)

Example right-left
![rotate_right_left](https://ds055uzetaobb.cloudfront.net/image_optimizer/a267b2dabaa0aed7f9bb57fd5a5b27c4dcec713c.png)

Example right-right
![rotate_right_right](https://ds055uzetaobb.cloudfront.net/image_optimizer/8cf2b469dbfdc55e867b3150fa204c06751c201a.png)

## Red-black tree
Red-black tree is another type of self-balancing tree. The different with AVL is that is less strict with its definition of balance, so it will insert and delete faster but the searchs are at the same complexity.

|Algorithm	|Average	|Worst case|
|-----------|-----------|----------|
|Space		|O(n)		|O(n)      |
|Search		|O(log n)	|O(log n)  |
|Insert		|O(log n)	|O(log n)  |
|Delete		|O(log n)	|O(log n)  |

Properties:
- Each node is either red or black.
- The root is black. This rule is sometimes omitted. Since the root can always be changed from red to black, but not necessarily vice versa, this rule has little effect on analysis.
- All leaves (NIL) are black.
- If a node is red, then both its children are black.
- Every path from a given node to any of its descendant NIL nodes contains the same number of black nodes.
