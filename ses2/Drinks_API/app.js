const app = require("express")();

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

app.get("/drinks", (req, res) =>{
    if(allDrinks)
    {
        res.send({allDrinks: allDrinks});
        console.log(allDrinks, "\n");
    }
    else
    {
        res.send({error: "No drinks found"});
        console.log("No drinks found \n");
    }
});

app.get("/drinks/:id", (req, res) =>{ 

    const id = req.params.id;
    console.log(`id requested is: ${id}`); // `` gør at vi kan bruge variabler i strings.
    console.log(req.params);

    const drink = allDrinks.drinks.find(d => d.id.toString() === id);
    /* Det samme som:
    for (let i = 0; i < allDrinks.drinks.length; i++){
        if(allDrinks.drinks[i].id.toString() === id)
        {
            drink = allDrinks.drinks[i];
        }
    } */

    if(drink){
        console.log(drink, "\n");
        res.send({drink_by_id: drink});
    }
    else {
        res.send({error: `Drink with id: ${id} not found`}); // send altid JSON tilbage når vi arbejder med data.
        console.log(`Drink with id: ${id} not found \n`);
    }
});

// query parameter for at finde drinks med et bestemt navn
// Brug http://localhost:8080/drinks?name=Mojito f.eks.
app.get("/drinks", (req, res) => {
    const { name } = req.query;
    if (name) {
        console.log(`Name requested is: ${name}`);
        const drink = allDrinks.drinks.find(d => d.name.toLowerCase() === name.toLowerCase());

        if (drink) {
            console.log(drink, "\n");
            res.send({ drink_by_name: drink });
        } else {
            res.send({ error: `Drink with name: ${name} not found` });
            console.log(`Drink with name: ${name} not found \n`);
        }
    } else {
        console.log("No name requested");
        res.send(allDrinks);
    }
});

// query parameter for at finde drinks med en bestemt ingrediens
// Brug http://localhost:8080/drinks?ingredient=Lime%20juice f.eks.
app.get("/drinks", (req, res) => {
    const { ingredient } = req.query;
    if (ingredient) {
        console.log(`Ingredient requested is: ${ingredient}`);
        const drinks = allDrinks.drinks.filter(d => d.ingredients.includes(ingredient));

        if (drinks.length > 0) {
            res.send({ drinks_by_ingredient: drinks });
            console.log(drinks, "\n");
        } else {
            res.send({ error: `No drinks found with ingredient: ${ingredient}` });
            console.log(`No drinks found with ingredient: ${ingredient} \n`);
        }
    } else {
        console.log("No ingredient requested");
        res.send(allDrinks);
    }
});

app.listen(8080);