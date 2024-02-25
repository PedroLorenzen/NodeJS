// import express from "express";
const express = require("express");
const app = require("express")();

app.use(express.json()); // Middleware til at parse JSON data fra body i requests. Skal være før routes. Ellers kan vi ikke bruge req.body i POST, PUT, PATCH requests.

// Array af objekter med
const allDrinks = {
    "drinks": [
        {
            "id": 1,
            "name": "Mojito",
            "ingredients": ["White rum", "Sugar", "Lime juice", "Soda water", "Mint"]
        },
        {
            "id": 2,
            "name": "Old Fashioned",
            "ingredients": ["Bourbon", "Brown sugar", "Angostura Bitters", "Orange twist"]
        },
        {
            "id": 3,
            "name": "Margarita",
            "ingredients": ["Tequila", "Lime juice", "Triple sec", "Salt"]
        },
        {
            "id": 4,
            "name": "Cosmopolitan",
            "ingredients": ["Vodka", "Triple sec", "Cranberry juice", "Lime juice"]
        },
        {
            "id": 5,
            "name": "Negroni",
            "ingredients": ["Gin", "Sweet Vermouth", "Campari", "Orange peel"]
        },
        {
            "id": 6,
            "name": "Espresso Martini",
            "ingredients": ["Vodka", "Coffee liqueur", "Freshly brewed espresso", "Sugar syrup"]
        },
        {
            "id": 7,
            "name": "Moscow Mule",
            "ingredients": ["Vodka", "Spicy ginger beer", "Lime juice", "Lime wedge"]
        },
        {
            "id": 8,
            "name": "Bloody Mary",
            "ingredients": ["Vodka", "Tomato juice", "Lemon juice", "Worcestershire Sauce", "Tabasco", "Celery"]
        },
        {
            "id": 9,
            "name": "Pina Colada",
            "ingredients": ["White rum", "Coconut cream", "Pineapple juice"]
        },
        {
            "id": 10,
            "name": "Gin Tonic",
            "ingredients": ["Gin", "Tonic Water", "Lime wedge"]
        }
    ]
}

let lastId = allDrinks.drinks[allDrinks.drinks.length - 1].id; // Variabel til at holde styr på at give det rigtige id til nye objekter. Se POST request.
// -1 fordi vi bruger 0 indexering i arrays. Så sidste element er altid length - 1.

// ------------------------------------------------ GET ------------------------------------------------ //

// Standard drinks endpoint med indbygget query parameter.
// Brug http://localhost:8080/drinks?name=Mojito eller http://localhost:8080/drinks?ingredient=Lime%20juice
// Hvis der er flere query parameters i samme string: http://localhost:8080/drinks?name=Mojito&ingredient=Lime%20juice
// req.query: Her er parameter navnene keys og parameter værdierne values.
app.get(`/drinks`, (req, res) => {
    const { name, ingredient } = req.query;
    if (name) {
        console.log(`Name requested is: ${name}`);
        const drinkFromName = allDrinks.drinks.find(d => d.name.toLowerCase() === name.toLowerCase());
        if (drinkFromName) {
            res.send({ data: drinkFromName });
            console.log(drinkFromName, `\n`);
        }
        else {
            res.send({ error: `Drink with name: ${name} not found` });
            console.log(`Drink with name: ${name} not found \n`);
        }
    }
    else if (ingredient) {
        console.log(`Ingredient requested is: ${ingredient}`);
        const drinksFromIngredient = allDrinks.drinks.filter(d => d.ingredients.includes(ingredient));
        if (drinksFromIngredient.length > 0) {
            res.send({ data: drinksFromIngredient });
            console.log(drinksFromIngredient, `\n`);
        }
        else {
            res.send({ error: `No drinks found with ingredient: ${ingredient}` });
            console.log(`No drinks found with ingredient: ${ingredient} \n`);
        }
    }
    else {
        if (allDrinks) {
            res.send({ data: allDrinks });
            console.log(`No valid parameters, returning all drinks:`)
            console.log(allDrinks, `\n`);
        }
        else {
            res.send({ error: `No drinks found` });
            console.log(`No drinks found \n`);
        }
    }

});

app.get(`/drinks/:id`, (req, res) => {

    const providedDrinkId = Number(req.params.id);
    console.log(`id requested for GET is: ${providedDrinkId}`); // `` gør at vi kan bruge variabler i strings vs. '' eller ""
    console.log(req.params);

    // Man skal ikke bruge filter da man derfor får et array af objekter og måske flere elementer istedet for kun 1. 
    const providedDrink = allDrinks.drinks.find(d => d.id === providedDrinkId);
    /* Det samme som:
    for (let i = 0; i < allDrinks.drinks.length; i++){
        if(allDrinks.drinks[i].id === id)
        {
            drink = allDrinks.drinks[i];
        }
    } */

    if (providedDrink) {
        console.log(providedDrink, `\n`);
        res.send({ data: providedDrink });
    }
    else {
        res.send({ error: `Drink with id: ${providedDrinkId} not found` }); // send altid JSON tilbage når vi arbejder med data.
        console.log(`Drink with id: ${providedDrinkId} not found \n`);
    }
});

// ------------------------------------------------ POST ------------------------------------------------ //

app.post('/drinks', (req, res) => {
    const { name, ingredients } = req.body;

    if (!name || !ingredients) {
        return res.send({ error: 'Your post request did not go through. Did you set Name and ingredients correctly?' });
        console.log('Your post request did not go through. Did you set Name and ingredients correctly? \n');
    }
    else
    {
        const newId = ++lastId; // Se variabel deklaration øverst i filen. Increment til at give nye objekter et nyt id som er unikt selvom der slettes objekter.
        const newDrink = { id: newId, name: name, ingredients: ingredients }; 
        // det er ikke nødvendigt at skrive name: name og ingredients..., da hvis navnet er det samme så fungerer det som property shorthand, men for overblik gør jeg det sådan.

        allDrinks.drinks.push(newDrink); // Se 
        res.send({ data: newDrink });
        console.log(`New drink requested for POST is: ${newDrink}`);
    }
});

// ------------------------------------------------ PUT ------------------------------------------------ //

app.put('/drinks/:id', (req, res) => {
    const drinkIdToUpdate = Number(req.params.id);
    const { name, ingredients } = req.body;
    console.log(`id requested for PUT is: ${drinkIdToUpdate}`);

    if (!name || !ingredients) {
        return res.send({ error: 'Your put request did not go through. Did you set Name and ingredients?' });
    }

    const drinkToUpdate = allDrinks.drinks.find(d => d.id === drinkIdToUpdate);
    if (drinkToUpdate) {
        drinkToUpdate.name = name;
        drinkToUpdate.ingredients = ingredients;
        res.send({ data: drinkToUpdate });
        console.log(`Updated drink for PUT is: ${drinkToUpdate}`);
        // Jeg opdaterer ikke ID da jeg tænker det kan påvirke andre objekter hvis jeg ændrer ID'et - hvis dette var et større program.
    }
    else {
        res.send({ error: `Drink with id: ${drinkIdToUpdate} not found` });
    }
});

// ------------------------------------------------ PATCH ------------------------------------------------ //

app.patch('/drinks/:id', (req, res) => {
    const drinkIdToPatch = Number(req.params.id);
    const { name, ingredients } = req.body;
    console.log(`id requested for PATCH is: ${drinkIdToPatch}`);

    const drinkToPatch = allDrinks.drinks.find(d => d.id === drinkIdToPatch);
    if (drinkToPatch) {
        if (name) {
            drinkToPatch.name = name;
        }
        if (ingredients) {
            drinkToPatch.ingredients = ingredients;
        }
        res.send({ data: drinkToPatch });
        console.log(`Updated drink for PATCH is: ${drinkToPatch}`);
    }
    else {
        res.send({ error: `Drink with id: ${drinkIdToPatch} not found` });
    }
});

// ------------------------------------------------ DELETE ------------------------------------------------ //

app.delete('/drinks/:id', (req, res) => {
    const drinkIdToDelete = Number(req.params.id);
    console.log(`id requested for DELETE is: ${drinkIdToDelete}`);

    const drinkIndex = allDrinks.drinks.findIndex(d => d.id === drinkIdToDelete);
    if (drinkIndex > -1) { // -1 er en standard værdi for at sige at noget ikke findes. Ellers kan man også bruge >=0
        const [deletedDrink] = allDrinks.drinks.splice(drinkIndex, 1);
        //splice her bruges til at fjerne et element fra et array og returnere det fjernede element som et nyt array.
        res.send({ data: deletedDrink });
        console.log(`Deleted drink for DELETE is: ${JSON.stringify(deletedDrink)}`);
    } else {
        res.send({ error: `Drink with id: ${drinkIdToDelete} not found` });
    }
});


// ------------------------------------------------ START SERVER ------------------------------------------------ //

app.listen(8080, (error) => {
    if (error) {
        console.log(`Error starting the server: ${error}`);
        return;
    }
    console.log("Server started on http://localhost:8080");
});