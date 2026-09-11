var type = 5;



console.log(type + 5 );
console.log(typeof type)

let dict= {
    arm : "hath",
    leg: "pair",
    mouth: "muh",
    dance: "dance",
    
}

console.log(dict)


let j = 16;

let m = j > 10 && j < 20;
console.log(m)

switch(j){

    case 23:
        console.log("this is no");
        break;

    case 16:
        console.log("this is not a number");
        break;

    default:
        console.log("this is unknown")

}

let h = 46;
if ( h%2 == 0 && h%3==0){
    console.log("it is divisible by 2 and 3")
}
else{
    console.log("not divisible by both")
}


for (let a = 0; a < 10; a++) {
    // let i = 1;
    console.log( a);
    
}

let obj = {
    name: "student",
    class: "engineering",
    rollNumber: "45"
}



for (const key in obj) {
    // if (!Object.hasOwn(obj, key)) continue;
    
    const element = obj[key];
    console.log(element, key)
    
    
}

for (const c of "harry") {
    console.log(c)
}
let y = 0;
 while(y<10){
    console.log(y);
    y++;
    
 }
console.log("space space")
let k = 0;
 do{
    console.log(k);
    k++;
 }while(k<10);

let IO = {
    harry: 98,
    studentTwo: 70,
    studentThree: 7,
}

for (const key in IO) {
    // if (!Object.hasOwn(object, key)) continue;
    
    const element = IO[key];
    console.log(element, key)
    
    
}

function func(name) {
    console.log("\nhey " + name + ", you are nice.")
    console.log("\nhey " + name + ", you are good and nice.")
    console.log("\nhey " + name + ", you are a great person.")
}
func("harry");

// functions which sums two nnmber 


function sum(a,b){
    // console.log(a+b);
    return a+b;
}

result = sum(4,5);
console.log("the sum of these number is : ", result);

// optional parameter 

function sum2(a,b, c =3){
    return a+ b+c
    
    
}

make = sum2(2,3,4);
console.log("the sum of these number is : ", make);

const func3 = (x)=>{
    console.log("arrow func", x)
}


func3(34);
func3(45);