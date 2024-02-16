// Loop methods in JavaScript
// for, forEach, map, filter, sort, find, reduce

console.log("hello");
console.log("wow");

const dogs = [
    { name: "Lassie", famelevel: 30 },
    { name: "Fido", famelevel: 5 },
    { name: "Snoopy", famelevel: 10 },
    { name: "Rex", famelevel: 7 }
];

console.log(dogs);

// -------------------------------- add a famelevel of +3 for all dogs --------------------------------

for (let i = 0; i < dogs.length; i++) {
    dogs[i].famelevel += 3;
}

console.log(dogs);

// another way:
dogs.forEach(dog => {
    dog.famelevel += 3;
});

console.log(dogs);

// another way:
const increaseFame = dogs.map(dog => {
    return { name: dog.name, famelevel: dog.famelevel + 3 };
});

console.log(increaseFame);

// -------------------------------- Add key male and value true for all except Lassie --------------------------------

/*dogs.forEach(dog => {
    if (dog.name !== "Lassie") {
        dog.male = true; // Add the male key with true value
    }
});*/

/*const maleDogs = dogs.map(dog => {
    if (dog.name !== "Lassie") {
        return { name: dog.name, famelevel: dog.famelevel, male: true }
    }
    else {
        return { name: dog.name, famelevel: dog.famelevel }
    }
});*/

// En lækker at lave en oneliner som håndterer if/else. 
const maleDogs = dogs.map(dog => {
    dog.isMale = dog.name !== "Lassie" ? true : false;
    return dog;
});

// En anden måde at gøre det på hvor man returnerer det i et json object:
const jsonMaleDogs = dogs.map((dog) => ({name: dog.name, famelevel: dog.famelevel, isMale: dog.name !== "Lassie" ? true : false }));


console.log(maleDogs);
console.log(jsonMaleDogs);