import express from 'express'; 
// nu bruger vi import fordi vi har lavet express til et modul
const app = express();
app.use(express.static('public')); 
// vi bruger express.static for at vise vores statiske filer til brugeren
// app.use static gør at brugeren udelukkende har adgang til en enkel side
import matchesRouter from './routers/matchesRouter.js';
import pagesRouter from './routers/pagesRouter.js';

app.use(matchesRouter); // indeholder nu alle routes til matches
app.use(pagesRouter); // indeholder nu alle routes til pages

const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on port:`, PORT))