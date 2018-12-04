function fibonnaci(n) {
	const arr = [undefined, 1, 1];
	if (n <=2) {
		return arr[n];
	}
	for (let i =3; i <=n; i++) {
		arr[i] = arr[i-1] + arr[i-2];
	}
	return arr[n];
}

console.log(fibonnaci(6));

