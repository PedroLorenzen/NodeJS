/*
I javascript kan man kalde en funktion før man deklarerer den. 
Dordi javascript først kører koden igennem en gang for at finde alle funktioner og derefter kører koden igennem igen.
Dette kaldes hoisting.
Dette kan lade sig gøre fordi JIT (Just in time) compileren i javascript kører filen igennem flere gange.
Her laves en callstack som holder styr på hvilke funktioner der skal kaldes og hvilke der skal kaldes først.
Der er også en variabel stack som holder styr på hvilke variabler der er i brug.
*/

HelloWorld();

function HelloWorld() {
    console.log("Hello World");
}


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
}
// Math.floor runder ned til nærmeste heltal, derfor lægger vi 1 til max for at få det rigtige tal.

const anonymfunktion = function(min, max)
{
    return Math.floor(Math.random() * (max + 1 - min)) + min;
}
// Dette er en anonym funktion, da den ikke har et navn. Den kan kaldes ved at skrive anonymfunktion(1, 10);
// const vs direkte function call: const er en reference til en funktion, hvorimod direkte function call er en funktion der bliver kaldt direkte.

//Samme metode med arrow function:
const arrowFunction = (min, max) => {
    return Math.floor(Math.random() * (max + 1 - min)) + min;
}
// Arrow function binder this til det scope den er i.
// Arrow function er en forkortet version af en anonym funktion.
// De er vigtige i react, da de binder this til det scope de er i.

//Oneliner:
const arrowFunctionOneLiner = (min, max) => Math.floor(Math.random() * (max + 1 - min)) + min;

// Callback function: En funktion der bliver sendt som en parameter til en anden funktion.
                // string // callback function
/*function doSomething(name, genericAction) {
    return genericAction(name);
}
// Firstclass citizen: En funktion kan sendes som en parameter til en anden funktion som en anden variabel.

const running = (name) => `${name} is running`;

console.log(doSomething("Alex", running));*/

// oneliner:
const eat = (name, genericAction) => genericAction(name);

// her kaldes funktionen eat med parametrene "Alex" og en anonym funktion. 
// ${name} er en placeholder for det navn der bliver sendt med.
console.log(eat("Alex", (name) => `${name} is eating`));
