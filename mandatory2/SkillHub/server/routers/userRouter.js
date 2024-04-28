import { Router } from 'express';
const router = Router();
import db from '../database/connection.js';

router.get('/api/users', async (req, res) => {
    const result = await db.all('SELECT * FROM Users');
    res.send({ data: result })
    console.log(result);
});

router.post('/api/users', async (req, res) => {
    const { name, email, password, location } = req.body;
    if (!name || !email || !password || !location) {
        return res.status(400).send({ error: 'Missing required information' });
    }
    else {
        try {
            // Brug af prepared statements for at undgå SQL injection
            const sql = 'INSERT INTO Users (name, email, password, location) VALUES (?, ?, ?, ?)';
            const result = await db.run(sql, [name, email, password, location]);
            res.send({ lastID: result.lastID });
            console.log("New user with ID: " + result.lastID + " has been created");
        } catch (error) {
            console.error('Database error:', error);
            res.status(500).send({ error: 'Database operation failed' });
        }
    }
});

export default router;