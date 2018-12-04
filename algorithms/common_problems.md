# Common Problems

## Content

<!-- toc -->

- [Introduction](#introduction)
- [Arrays and Strings](#arrays-and-strings)
  * [Problems](#problems)

<!-- tocstop -->

## Introduction

We will make a quick summary of the most common problems and its solution. Thiw way we will have patters for identify future problems.

We can have as reference [this webpage.](https://www.programcreek.com/2012/11/top-10-algorithms-for-coding-interview/)

## Arrays and Strings

Insert time O(1).
Access time by index O(1).
Search time by value O(log(n)).

Arrays in Java that have dynamic resizing, on full will double the length and copy all the values to new part of the memory.
When you insert into an array, we consider that is insert O(1), because of amortize insertion. Over all, if you are doubling the space all the time, you will copy max of N elements (n/2 + n/4 + ... 2 + 1). So we can say that is O(1) anyway.

In Javascript the Arrays in memory may be a proper array or a Hash table, depending of how dense/sparse the array is. ECMAScript doesn't provide specifics, so it depends of the implementations


Fos String in Java, everytime you concat a String will create a new one, so will copy character by character. Use StringBuiler.

### Problems

__Longest palindrome substring__
Simples algorithm check each element if is a palindrome.
So 1 for to check each element, and for each element we need to check 2:
- That element (so the palindrome is odd).
- That element + 1 (so the palindrome is even, and the 2 elements in the center are the same).
That function only check which is the longest, and returns it.


__word break__
Decide if a string can be represented with a dic of words (without spaces).

````
public boolean wordBreak(String s, Set<String> wordDict) {
	// create an array of length of the string +1
	int[] pos = new int[s.length()+1];
	// fill it with -1
	Arrays.fill(pos, -1);
	// we set the position 0 to true
	pos[0]=0;
	for(int i=0; i<s.length(); i++){
		// For each element that is different of -1 (the first time from 0)
		if(pos[i]!=-1){
			// do another iteration to do substrings
			for(int j=i+1; j<=s.length(); j++){
				String sub = s.substring(i, j);
				// In case the worDict contains it, we set it as different from -1
				if(wordDict.contains(sub)){
					pos[j]=i;
				}
			}
		}
	}
	return pos[s.length()]!=-1;
}
```

__ladder word__
Given two words (start and end), and a dictionary, find the length of shortest transformation sequence from start to end, such that only one letter can be changed at a time and each intermediate word must exist in the dictionary. For example, given:
start = "hit"
end = "cog"
dict = ["hot","dot","dog","lot","log"]
"hit" -> "hot" -> "dot" -> "dog" -> "cog"

We can do a Queue, save in the queue the start word with the number of steps 1.
Then while the queue is not empty
first check if the word got from the queue is the result, and return the number of steps.
if not we make all possible transformations of a word, changing one letter. if that word exist in the dict, we insert it in the queue, and continue.


__2 sums__
Given an array of integers, find two numbers such that they add up to a specific target number.

The best way is to use a hashmap:
```
    HashMap<Integer, Integer> map = new HashMap<Integer, Integer>();
    for(int i=0; i<nums.length; i++){
        if(map.containsKey(nums[i])){
            return new int[]{map.get(nums[i]), i};
        }else{
			// we create the hashmap at the same time as we check
            map.put(target-nums[i], i);
        }
    }
```

__3Sum__
Find all unique triplets that equals a number.

The best is first sort it. Then use the middle number as a pointer.
and check from smaller and bigger if the sum is equals.
Then for remove repeated elements we can just move index till is different.

Another solution is use a hashmap, you can find middle, and for all the smaller check if exist in the hashmap the difference.

__longest substring wihout repeating characters__

We can start from 0, adding each character to a hash, if the character already exist, we just pick the previous one and saved it. And we continue from this point. (this is if the questions is for duplicates) If the question is for repeated.
We can save in a hashmap the position of each characters, once we find a repeated, we save the substring and start from the position saved in the hashmap.

__set matrix to 0__
Given a m * n matrix, if an element is 0, set its entire row and column to 0.

Create two arrays rows, columns, and input there which ones we need to set to 0.

Then set them to zero.

__merge sorted arrays__
Given two sorted integer arrays A and B, merge B into A as one sorted array.

if you need to merge into A, the best is start from the end, with 2 pointers. M for A, N for B, starting with the length -1, and comparing and descresing wichever is inserted.
At the end we need to add all the left of B.
```
public class Solution {
    public void merge(int A[], int m, int B[], int n) {
 
        while(m > 0 && n > 0){
            if(A[m-1] > B[n-1]){
                A[m+n-1] = A[m-1];
                m--;
            }else{
                A[m+n-1] = B[n-1];
                n--;
            }
        }
 
        while(n > 0){
            A[m+n-1] = B[n-1];
            n--;
        }
    }
}
```







## Hash table

Insert time O(1).
Access time by key O(1).

Steps to implement a hash table:
1. Compute the key hash code, usually will be int or long (2 different keys can have the same).
2. Map the hash to an index in an array, for example hash % array length.
3. At this index we can have a linked list of values (since there may be collisions).

Next time when we want to find a key, we calculate the hash and the position, then compare the key to each element of the linked list and get the value.

If the collisions is very high, we can have a lookup of O(n), if is well implemented should be O(1).

## Linked List

Insert time O(N). If you only have the head, and want to insert in the last position, need to check all.
Access time by index O(K). Where K is the index.
Access time by value O(N)

Deleting a node in linked list n:
- prev.next = n.next

Deleting a node in double linked list n:
- prev.next = n.next
- n.next.prev =  n.prev

The problem is that we won't have the prev that easy in a Linked list, so the best way is to check the next:
```
while (n.next !== null) {
	if(n.nextdata == d) {
		n.next = n.next.next;
		return head;
	}
	n = n.next;
}
```

### Runner techniche
Consist in have 2 pointer to the linkedlist, one fast and one slow. The fast may be move at double the speed of the lest one. This is helpful for know the half of the linked list or find cycles etc.

## Stack and Queue

Stack is LIFO, Queue is FIFO.

Stack in Javascript:
```
const arr = [];
arr.push('a'); // add at element at the end
const el = arr.pop('a'); // takes the last element of the array
```

Queue in Javascript:
```
const arr = [];
arr.push('a'); // add at element at the end
const el = arr.shift(); // takes the fist element of the array
```

A stack can be implemented using a linked list, having the head as the last element, and changing this head everyime we push or pop.

As well a Queue can be implemented using a linked list, but we would need two pointers, for the head and for the tail. We would need to add and remove from different pointers.


## Trees and Graph

For doing Breadth first search, we can using a Queue, for each node we process, we will write all its descendans in the queue, then continue processing the fist element of the queue.

Depth first search can be implemented using recursion.

For graph operations, we need to save which elements have been visited, because any element can point to an already visited node. We can do it adding a property to the node, or maintaining an array with the elements visited values.

A way to represent a Graph is a Adjacency Matrix, is a NxN (number of nodes) Matrix, if the matrix[i][j] is true, that means that there is a connection. This implementation may be a little bit more slow to iterate, because for each element youd don't know its connections till you check in the array.


For finding the shortest path betweeen 2 nodes, we may want to do 2 bidirectionals breadth firsts searchs, one from each node and see where it collides.


## Bit manipulation

x^0 = x
x^1 = ~x
x^x = 0
x&0 = 0
x&1 = x
x&x = x
x|0 = x
x|1 = 1
x|x = x

## Negative numbers
To represent negative numbers we usally do a 2 complement. Plus the sign bit.
2 complement is achieve fliping all the numbers and then adding 1.
For example represent in 4 bit -3:
- first we add the negative bit 1000 --> this step can be igmore, cause when we flip is achieve
- then we calculate 3, 011 and flip it over 100 (the flip is with N bytes -1 or N bytes, depending if you add manually the sign bit.
- we add them + 0001 = 1000 + 0100 + 0001 = 1101.

The representation of -1 is 1111111111111

Since the representation of negative numbers is different we have 2 shifts:
- Sign-propagating right shift (>>)
- Zero-fill right shift (>>>)

In the case of positive numbers the result is the same, 
but for example (-1>>2) Always is going go be -1 (the -1 is propagated).
But in the case of (-1>>>3) the result is 30, cause we fill of 30 zeros, and only have 2 left 0011


## Get i Bit
First do a shift to create a 000010000 where i is in the position.
Then do and AND and comparate to 0.
```
(1<<4 & 99) === 0
```

## Set i Bit
First do a shift to create a 000010000 where i is in the position.
then do an OR and return
```
1<<4 | 99
```

## Clear i Bit
First do a shift to create a 000010000 where i is in the position.
Then negate it, and do an AND
```
~(1<<4) & 99
```

## Create a mask
A maks is something like 00011111

```
(1<<4) -1
```

For create a mask in the other direction 111110000
```
(-1<<4)
```

## Update i Bit
First we set that bit to 0, creating 11111011111, and doing and AND.
Then we shift the value we want to put  and apply an OR.

This will update the third bit of 99 with an 1.
```
(~(1<<3)&99)|(1<<3)
```

