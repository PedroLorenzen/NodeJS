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


// En promisified funktion:
random = Math.random()

async function myPromise() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if(random > 0.5) {
                resolve("Success!")
            }
            else(
                reject("Error!")
            )
        }, 1000)
    })
    .then((successMessage) => {
        console.log(successMessage)
    })
    .catch((errorMessage) => {
        console.log(errorMessage)
    });
}
//myPromise() // Viser ikke pending fordi vi ikke printer i consolen.
console.log(myPromise()) // Promise { <pending> } - pending fordi vi ikke har resolved eller rejected endnu.
/*.then((successMessage) => {
    console.log(successMessage)
})
.catch((errorMessage) => {
    console.log(errorMessage)
});*/ // Kan også skrives her for at få det samme resultat som ovenfor. Det her kan dog også bruges hvis det ikke er et promise.


// Make a fetch function, call it myFetch, it should return a promise json() that you can call response.json() on.
// The function should take a url as an argument.
// Then call the function and console.log the data you get back.
// Use the following url: https://jsonplaceholder.typicode.com/posts

/*
function myFetch(URL, options = {}) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                resolve({
                    json: () => Promise.resolve("Response from server")
                });
            }
            catch {
                reject();
            }
        }, 1000)
    })
}
myFetch("https://jsonplaceholder.typicode.com/posts")
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.log(error));
*/

// Solution 3: Async/Await
// Dette er syntactic sugar for promises.
// Min yndlings metode.


async function myFetch(url) {
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error("Error!");
        }
    } catch (error) {
        console.log(error);
    }
}
myFetch("https://jsonplaceholder.typicode.com/posts/1")
    .then(data => console.log(data))
    .catch(error => console.log(error));

