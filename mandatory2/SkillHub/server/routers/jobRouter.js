import { Router } from 'express';
import db from '../database/connection.js';
import { sanitizeHTML } from '../util/sanitize.js';

const router = Router();


router.get('/jobs', async (req, res) => {
    const result = await db.all('SELECT * FROM Jobs');
    console.log("All jobs have been fetched");
    res.send({ data: result })
});

router.post('/jobs', async (req, res) => {
    let { name, skill, description, price, userid } = req.body;

    if (!Number.isFinite(price)) {
        return res.status(400).send({ error: 'Price must be numbers' });
    }
    if (!Number.isFinite(userid)){
        return res.status(400).send({ error: 'User ID must be a number' });
    }

    name = sanitizeHTML(name);
    skill = sanitizeHTML(skill);
    description = sanitizeHTML(description);

    if (!name || !skill || !description || !price || !userid) {
        return res.status(400).send({ error: 'Missing required information' });
    }
    else {
        try {
            const sql = 'INSERT INTO Jobs (name, skill, description, price, user_id) VALUES (?, ?, ?, ?, ?)';
            const result = await db.run(sql, [name, skill, description, price, userid]);
            res.send({ lastID: result.lastID });
            console.log("New job with ID: " + result.lastID + " has been created");
            console.log("Name: " + name + " Skill: " + skill + " Description: " + description + " Price: " + price + " User ID: " + userid);
        } catch (error) {
            console.error('Database error:', error);
            res.status(500).send({ error: 'Database operation failed' });
        }
    }
});

export default router;