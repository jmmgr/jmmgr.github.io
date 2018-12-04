/*
You have a ladder of X steps. You can go up the ladder by taking either one or two steps each time. Write a function to determine how many potential different combinations of one or two steps you could take to the top of the ladder.
*/

function steps (x) {
	if (x === 1)
		return 1; // one way to arrive at step 1
	if (x === 2)
		return 2; // Two ways to arrive at step 2

	return steps(x-1) + steps(x-2);
}
console.log(steps(5));
