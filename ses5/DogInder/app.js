import express from 'express'; 
// nu bruger vi import fordi vi har lavet express til et modul
const app = express();
app.use(express.static('public')); 
// vi bruger express.static for at vise vores statiske filer til brugeren
// app.use static gør at brugeren udelukkende har adgang til en enkel side så de ikke kan gå ind og se ting de ikke må/har brug for.


import path from 'path';
import getMatches from './util/matches.js';

import fs from "fs";
import { send } from 'process';
const homepage = fs.readFileSync("./public/pages/homepage/homepage.html").toString();
console.log(homepage);

const header = fs.readFileSync("./public/components/header/header.html").toString();
const footer = fs.readFileSync("./public/components/footer/footer.html").toString();

//getMatches();

// ================================ HTML =============================== //

app.get('/', (req, res) => {
    //res.sendFile(path.resolve("public/pages/homepage/homepage.html"));
    res.send(homepage);
});

app.get('/matches', (req, res) => {
    res.sendFile(path.resolve("public/pages/matches/matches.html"));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.resolve("public/pages/contact/contact.html"));
});

app.get('/page', (req, res) => {
    res.sendFile(path.resolve("public/pages/contact/contact.html"));
});

// ================================ API =============================== //

app.get('/api/matches', async (req, res) => {
    console.log("i am in this endpoint")
    const matches = await getMatches();
    res.send({data: matches});
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on port:`, PORT))