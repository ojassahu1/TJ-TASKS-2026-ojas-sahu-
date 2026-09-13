
// nfactorial = n * n-1 factorial
// eg = 4= 4 * 3! ;
// let n = 5;
const red = (n) => {  
    let result = 1;
    for (let i = 1; i <= n; i++) {
        let temp = 0; 
        for(let b =  0; b < i; b++ ){

            temp += result;
        }
        result = temp;
        
    }

return result;
};
console.log(red(3))


const redd = (m) => {
    let result = 1;
    for (let i = 1; i <= m; i++) {
        result *= i;
    }
    return result;
};
console.log(redd(7)); // 6