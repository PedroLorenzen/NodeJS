//const express = require('express'); // Import express
//const app = express(); // Create an instance of express

//oneliner:
const app = require('express')();

//endpoint  //callback function 
            //request, response 
            //(client, server)
app.get('/', (req, res) => {
    res.send("Hello World"); // Send a response to the client
}); // Create a get request on the root endpoint

// Her laves en ny route på /route endpointet.
app.get('/firstRoute', (req, res) => {
    res.send({ data: [1, 2, 3, 4, 5] });
    //(jsonobject{javascriptobjekt[array]})
});

app.get("/secondRoute", (req, res) => {
    res.send("<h1>Welcome to the page</h1>");
});

// Create a third route with the endpoint thirdRoute
app.get("/thirdRoute/:someValue/:someOtherValue", (req, res) => {
    const someValue = req.params.someValue;
    const someOtherValue = req.params.someOtherValue;
    console.log(someValue, someOtherValue); // Hello World
    console.log(req.params); // { someValue: 'værdi', someOtherValue: 'værdi' }
    res.send({data: ["Hello", "World", "This", "Is", "A", "Test"]});
});

let balance = 100;
app.get("/wallet/:paymentOut", (req, res) => 
{
    const withdrawalAmount = req.params.paymentOut;
    if (balance >= withdrawalAmount && withdrawalAmount > 0) 
    {
        balance -= withdrawalAmount;
        res.send({ balance: balance }); //send altid JSON tilbage når vi arbejder med data. 
        // Dette gør at der er en universel standard for hvordan sendes så modtager programmet ved hvad der sendes.
    }
    else if (withdrawalAmount < 1 || !withdrawalAmount || withdrawalAmount != Number) {
        res.send(({data: "You didn't send a valid number or the value is not a number"}))
    }
    else 
    {
        res.send({ error: "Not enough money" });
    }
});

// HTTP: 80
// HTTPS: 443
// HTTP dev: 8080
// HTTPS dev: 8443
app.listen(8080);