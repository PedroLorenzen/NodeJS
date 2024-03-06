import express from 'express'; 
// nu bruger vi import fordi vi har lavet express til et modul
const app = express();
app.use(express.static('public')); 
// vi bruger express.static for at vise vores statiske filer til brugeren

import path from 'path';
import getMatches from './util/matches.js';

//getMatches();

// ================================ HTML =============================== //

app.get('/', (req, res) => {
    res.sendFile(path.resolve("public/homepage/homepage.html"));
});

app.get('/matches', (req, res) => {
    res.sendFile
    (path.resolve("public/matches/matches.html"));
});

// ================================ API =============================== //

app.get('/api/matches', (req, res) => {
    const matches = getMatches();
    res.send({data: matches});
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on port:`, PORT))