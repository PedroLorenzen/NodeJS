// --------------------------------------
// Exercise 3 - Add numbers from string to float

const numberOne = "1.10";
const numberTwo = "2.30";

// add those two numbers and show the result
// you cannot touch line 1 neither line 2

const addNumbers = parseFloat(numberOne) + parseFloat(numberTwo);
console.log(addNumbers);

// --------------------------------------


// --------------------------------------
// Exercise 4 - Add the numbers and the total with 2 decimals

const anotherNumberOne = "1.10";
const anotherNumberTwo = "2.30";

function cutDecimals2(x) {
    return Number.parseFloat(x).toFixed(2);
  }

const addNumbers2 = parseFloat(anotherNumberOne) + parseFloat(anotherNumberTwo);
const cutAddNumbers2 = cutDecimals2(addNumbers2);
console.log(cutAddNumbers2);
// --------------------------------------
// Exercise 5 - Decimals and average

const one = 10;
const two = 45;
const three = 98;

// Show in the console the avg. with 5 decimals

function cutDecimals5(x) {
    return Number.parseFloat(x).toFixed(5);
  }

const avg = (one + two + three) / 3;
const cutAvg = cutDecimals5(avg);
console.log(cutAvg);

// --------------------------------------
// Exercise 6 - Get the character by index

const letters = "abc";
// Get me the character "c"

const charC = letters.charAt(2);
console.log(charC);


// --------------------------------------
// Exercise 7 - Replace

const fact = "You are learning javascript!";

// capitalize the J in Javascript

const newFact = fact.replace("j", "J");
console.log(newFact);

// --------------------------------------



