// --------------------------------------
// Arrays, for loops
// --------------------------------------
// Exercise 1 - Array Positioning

const letters = ["a", "b", "c"];
// show b in the console 

const b = letters[1];
console.log(letters[1]);


// --------------------------------------
// Exercise 2 - Array Positioning

const friends = [];

// What a lonely array. Add at least 3 friend objects to it.

friends.push({name: "John", sex: "man"}, {name: "Jane", sex: "unknown"}, {name: "Jack", sex: "man"});
console.log(friends);

// --------------------------------------
// Exercise 3 - Get the index of first occurance of that value. 

const significantMathNumbers = [0, 2.718, 3.14159, 1729];

// You want to programmatically find where the number 1729 is in the array.
// programmatically means that no finger counting allowed. There is a method for this (finding index based of value). 

const index = significantMathNumbers.indexOf(1729);
console.log(index);

// --------------------------------------
// Exercise 4 - Inserting elements

const diet = ["tomato", "cucumber", "rocket"];

// You are a programmer. In one line (one statement) insert hamburger, soda and pizza between the elements cucumber and rocket

console.log(diet);
diet.splice(2, 0, "hamburger", "soda", "pizza");
console.log(diet);

// --------------------------------------
// Exercise 5 - Remove element

// Remove the LAST element of the array.
// Don't remove by index. You know in advance that it's the last in the array because you are too full already. 

diet.pop();
console.log(diet);
diet.length = diet.length - 1;
console.log(diet);


// --------------------------------------
// Exercise 6 - Copy array

// You really like your daily diet from last exercise. Copy it to a new array called dinnerTray so you can give it to a friend.  

const dinnerTray = diet.slice();
console.log(dinnerTray);

const dinnerTray2 = [...diet];
console.log(dinnerTray2);

// --------------------------------------
// Exercise 7 - For loop

const lettersExpanded = ["a", "b", "c", "d", "e", "f", "g", "h"];

// log every second char in the array starting from b

let charArray = [];

for (let i = 1; i < lettersExpanded.length; i += 2) 
{
    charArray.push(lettersExpanded[i]);
}
console.log(charArray);

// --------------------------------------
// Exercise 8 - For loop and if statement

const numbers  = [5, 3, 2, 7, 11, 12, 0, -20, 6];

// log the element if the number is above 6 or below 0
// else push them to the array discardedNumbers

const numbersArray = [];
const discardedNumbers = [];

for (let i = 0; i < numbers.length; i++)
{
    if (numbers[i] > 6 || numbers[i] < 0)
    {
        numbersArray.push(numbers[i]);
    }
    else 
    {
        discardedNumbers.push(numbers[i]);
    }
}

console.log(numbersArray);

// --------------------------------------


