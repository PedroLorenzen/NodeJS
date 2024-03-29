const express = require("express");

const app = express();

app.use(express.static("public"));

// const helicopterFactoryFile = require("./util/helicopterFactory.js");
// console.log(helicopterFactoryFile.helicopterFactory());

const { helicopterFactory } = require("./util/helicopterFactory.js");
console.log(helicopterFactory());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/homepage/homepage.html");
});

app.get("/publicsquare", (req, res) => {
    res.sendFile(__dirname + "/public/publicSquare/publicSquare.html");
});

const knownNames = ["Anders", "Alice"];

app.get("/greeting", (req, res) => {
    const providedName = req.params.name;
    if (knownNames.includes(providedName)) {
        res.send({ data: `Hello ${providedName}!` });
    } else {
        res.send({ data: "Hello stranger!" });
    }
});

app.get("/knownpeople", (req, res) => {
    res.send({ data: knownNames.length });
});

app.get("/proxy", (req, res) => {
    // fetch("https://www.google.com")
    // .then((response) => response.text())
    // .then((result) => res.send(result));
    fetch("https://google.com")
    .then(response => response.arrayBuffer())
    .then(buffer => {
        const decoder = new TextDecoder('iso-8859-1');
        const text = decoder.decode(buffer);
        res.send(text);
    });
});

app.get("/publicSquare", (req, res) => {
    console.log("redirecting to publicSquare");
    res.redirect("/publicsquare");
});

app.get("/treasuretrove", (req, res) => {
    res.send({data: "you found the correct passphrase and is inside the treasure trove endpoint!"});
});

// query: http://localhost:8080/secretpassphrase?passphrase=Sesame%20open%20up!
app.get("/secretpassphrase", (req, res) => {
    const passphrase = req.query.passphrase;
    if (passphrase !== "Sesame open up!") {
        res.status(400).send({ data: "Wrong passphrase" });
    } else {
        res.redirect("/treasuretrove");
    }
});

const PORT = 8080;
app.listen(PORT, () => console.log("Server is running on port", PORT));
