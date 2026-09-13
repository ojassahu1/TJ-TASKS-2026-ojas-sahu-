let mf = [2,34,4,54,343,6465,453,]
let newar  = []
for (let index = 0; index < mf.length; index++) {
    const element = mf[index];
    newar.push(element**2)

    
}
console.log(newar);

// method 2
let newarr = mf.map((e, index , array)=>{
    return e**2;
})
console.log(newarr);





// 

const greaterthanseven = (e) =>{
    if(e>7){
        return true
    }
    return false
}


console.log(newarr.filter(greaterthanseven));





// reduce  method

let arr2 = [2,3,4,56,7,54,32,30];

const red = (a,b) => {
    return a*b ;

}
console.log(arr2.reduce(red))


// from.array

console.log(Array.from("harry"));


// factorial 
let sym = [34,5]
const fact = (a) => {
    return a*(a-1);
}
console.log(sym.reduce(fact));