let arr = [1,3,5,6,7,4];


// console.log(arr);
// console.log(arr.length);
// console.log(arr[2]);
// console.log(arr[1], typeof arr);

// CONVER TO STRING 
// console.log(arr.toString());


// to join array 

console.log(arr.join(" and "));
// it remove from last 
console.log(arr.pop());
console.log(arr)
// it adds in last 
console.log(arr.push(100));
console.log(arr)
// to remove from front 
arr.shift()
console.log(arr);
// it adds in front of arrray 
arr.unshift("jack")
console.log(arr);

delete arr[3];
console.log(arr);
console.log(arr.length);

// used to join two arrays 

let a1 = [2,34,50,56,78,45];
let a2 = [34,54,32,67,88];
let a3 = [11,33,55,6,7,85];

s = a1.concat(a2,a3);

console.log(s);


// to sort an array

m = a2.sort();
console.log(m);

// to remove an element and put an element \

d = a3.splice(3 , 2 ,);  
console.log(d);  // 6,7
console.log(a3);   // 11,33,55,85

e = a3.splice(3,2,5,6);
console.log(a3); // 11 , 33, 55 , 5 , 6


// LOOPS START 



