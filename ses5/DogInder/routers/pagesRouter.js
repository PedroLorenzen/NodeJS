import { Router } from 'express';
const router = Router();
import { homepagePage, matchesPage, contactPage } from '../util/readPages.js';

export default router;

app.get('/', (req, res) => {
    //res.sendFile(path.resolve("public/pages/homepage/homepage.html"));
    res.send(homepagePage);
});

router.get('/matches', (req, res) => {
    //res.sendFile(path.resolve("public/pages/matches/matches.html"));
    res.send(matchesPage);
});

app.get('/contact', (req, res) => {
    //res.sendFile(path.resolve("public/pages/contact/contact.html"));
    res.send(contactPage);
});

