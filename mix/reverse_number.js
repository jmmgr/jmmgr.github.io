function reverse(n) {
	let new_number = 0;
	while (n > 0) {
		const dig = n%10;
		n = Math.floor(n/10);
		new_number = new_number * 10 + dig;
	}
	return new_number;
}

console.log(reverse(600));

