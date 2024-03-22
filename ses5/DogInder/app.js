import express from 'express'; 
// nu bruger vi import fordi vi har lavet express til et modul
const app = express();
app.use(express.static('public')); 

app.use(express.urlencoded({ extended: true })); // middleware for at parse body fra POST requests

const PORT = process.env.PORT;
console.log(`Your port is ${PORT}`);

// vi bruger express.static for at vise vores statiske filer til brugeren
// app.use static gør at brugeren udelukkende har adgang til en enkel side
import matchesRouter from './routers/matchesRouter.js';
import pagesRouter from './routers/pagesRouter.js';
import contactRouter from './routers/contactRouter.js';

app.use(matchesRouter); // indeholder nu alle routes til matches
app.use(pagesRouter); // indeholder nu alle routes til pages
app.use(contactRouter); // indeholder nu alle routes til contact

// Her bruger vi en synlig port hvilket ikke er anbefalet. Så vi definerer istedet miljøvariablerne gennem vores script i package.json
//const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on port:`, PORT))