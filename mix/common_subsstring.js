function commonSubstring(X, Y) { 
	const arr = [];
    let result = 0;  // To store length of the longest common substring 
      
    for (let i = 0; i <= X.length; i++) { 
        for (let j = 0; j <= Y.length; j++) { 
            if (i == 0 || j == 0){ // we ignore the 0 elments we will proccess them later
				arr[i] = [];
                arr[i][j] = 0; 
			} else if (X.charAt(i - 1) == Y.charAt(j - 1)) { 
                arr[i][j] = arr[i - 1][j - 1] + 1; 
                result = Math.max(result, arr[i][j]); 
            }  
            else
                arr[i][j] = 0; 
        } 
    } 
    return result; 
} 

console.log(commonSubstring('holaadios', 'aaadios'));
