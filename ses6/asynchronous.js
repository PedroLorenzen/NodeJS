/*Async bruges ved:
- Fetch API (GET, POST, PUT, DELETE)
- Fetch websites 
- Indlæsning af filer
- Ved brug af promises (resolve, reject, then, catch, finally)
- Ved brug af await (async/await)
- Ved brug af setTimeout
- Ved brug af setInterval 
- Ved brug af event listeners (click, mouseover, keydown, etc.)
- Database operationer (MongoDB, MySQL, etc.)
*/

// Javascript er single-threaded, hvilket betyder at den kun kan udføre en ting ad gangen.
// Asynchronous betyder at noget sker samtidig med noget andet.
// Dette kan ske fordi javascript har en event loop, som holder styr på hvad der skal udføres næste gang.
// Dette gør at javascript kan udføre flere ting samtidig, selvom det er single-threaded.

// Solution 1: Callbacks
// problem: Callback hell
// Det er en masse nestede funktioner med callbacks, som gør det svært at læse og forstå koden.
// Også kaldet "Pyramid of Doom"

// Solution 2: Promises
// problem: .then() og .catch() er ikke altid så lette at læse og forstå.
// states: 1. pending, 2. fulfilled (resolved vs rejected)
new Promise((resolve, reject) => {
    setTimeout(() => {
        try {
            resolve("Success!")
            // true
            // {response: "Success!"}
            // const functionReference = () => "Success!"; resolve(functionReference()) 
        }
        catch (error) {
            reject(error)
            // "Error!"
            // false
            // {response: "Error!"}
            // throw new Error("Error!")
        }
    }, 1000)
})
    .then((successMessage) => {
        console.log(successMessage)
        console.log("Now printing this after successMessage")
    })
    .catch((errorMessage) => {
        console.log(errorMessage)
    });
console.log("This is printed before the successMessage")
