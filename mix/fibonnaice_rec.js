function fibonnaci(n) {
	if (n === 1 || n === 2)
		return 1;
	else 
		return fibonnaci(n-1)+fibonnaci(n-2);
}

console.log(fibonnaci(6));

