import { Router } from 'express';
const router = Router();
import { homepagePage, matchesPage, contactPage } from '../util/readPages.js';

export default router;

app.get('/', (req, res) => {
    res.send(homepagePage);
});

router.get('/matches', (req, res) => {
    res.send(matchesPage);
});

app.get('/contact', (req, res) => {
    res.send(contactPage);
});

