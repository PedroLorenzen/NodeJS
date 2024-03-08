import express from 'express'; 
// nu bruger vi import fordi vi har lavet express til et modul
const app = express();
app.use(express.static('public')); 
// vi bruger express.static for at vise vores statiske filer til brugeren
// app.use static gør at brugeren udelukkende har adgang til en enkel side så de ikke kan gå ind og se ting de ikke må/har brug for.

import getMatches from './util/matches.js';

import { homepagePage, matchesPage, contactPage } from './util/readPages.js';

//getMatches();

// ================================ HTML =============================== //

app.get('/', (req, res) => {
    //res.sendFile(path.resolve("public/pages/homepage/homepage.html"));
    res.send(homepagePage);
});

app.get('/matches', (req, res) => {
    //res.sendFile(path.resolve("public/pages/matches/matches.html"));
    res.send(matchesPage);
});

app.get('/contact', (req, res) => {
    //res.sendFile(path.resolve("public/pages/contact/contact.html"));
    res.send(contactPage);
});

// ================================ API =============================== //

app.get('/api/matches', async (req, res) => {
    const matches = await getMatches();
    res.send({data: matches});
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on port:`, PORT))