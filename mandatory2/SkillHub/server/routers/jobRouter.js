import { Router } from 'express';
const router = Router();
import db from '../database/connection.js';

router.get('/api/jobs', async (req, res) => {
    const result = await db.all('SELECT * FROM Jobs');
    res.send({ data: result })
    console.log(result);
});

router.post('/api/jobs', async (req, res) => {
    const { name, skill, description, price } = req.body;
    if (!name || !skill || !description || !price) {
        return res.status(400).send({ error: 'Missing required information' });
    }
    else {
        try {
            // Brug af prepared statements for at undgå SQL injection
            const sql = 'INSERT INTO Jobs (name, skill, description, price) VALUES (?, ?, ?, ?)';
            const result = await db.run(sql, [name, skill, description, price]);
            res.send({ lastID: result.lastID });
            console.log("New job with ID: " + result.lastID + " has been created");
        } catch (error) {
            console.error('Database error:', error);
            res.status(500).send({ error: 'Database operation failed' });
        }
    }
});

export default router;