let a = [ 2,3,4,5,3,2,44,32,24]


for (let index = 0; index < a.length; index++) {
    const element = a[index];
    console.log(element);

    
}


a.forEach((value, index, arr) => {
    console.log(value, index , arr);
});


let object = {
    a:3,
    b:5,
    c:6
}
for (const key in object) {
    if (!Object.hasOwn(object, key)) continue;
    
    const element = object[key];
    console.log(element,key);
    
    
}
let fg = [3,45,65,43,23]
for (const iterator of fg) {
    console.log(iterator);
    
}














