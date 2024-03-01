import express from 'express'; 
// nu bruger vi import fordi vi har lavet express til et modul
const app = express();
app.use(express.static('public')); 
// vi bruger express.static for at vise vores statiske filer til brugeren

import path from 'path';


app.get('/', (req, res) => {
    res.sendFile(path.resolve("public/homepage/homepage.html"));
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on port:`, PORT))