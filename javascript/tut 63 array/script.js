// Common array operations
const numbers = [1, 2, 3, 4, 5];

const added = [...numbers, 6];
const doubled = numbers.map((number) => number * 2);
const evenNumbers = numbers.filter((number) => number % 2 === 0);
const total = numbers.reduce((sum, number) => sum + number, 0);

console.log({ numbers, added, doubled, evenNumbers, total });



