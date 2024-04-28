import { Router } from 'express';
const router = Router();
import db from '../database/connection.js';

router.get('/api/jobs', async (req, res) => {
    const result = await db.all('SELECT * FROM Jobs');
    res.send({ data: result })
    console.log(result);
});

router.get('/api/jobs', async (req, res) => {
    const userId = req.query.user_id;
    let sqlQuery;
    let params = [];

    if (userId) {
        sqlQuery = 'SELECT * FROM Jobs WHERE user_id = ?';
        params.push(userId);
    } else {
        sqlQuery = 'SELECT * FROM Jobs';
    }

    try {
        const result = await db.all(sqlQuery, params);
        res.send({ data: result });
        console.log(result);
    } catch (error) {
        console.error('Failed to retrieve jobs:', error);
        res.status(500).send({ error: 'Failed to retrieve data' });
    }
});

router.post('/api/jobs', async (req, res) => {
    const { name, skill, description, price, userid } = req.body;
    if (!name || !skill || !description || !price || !userid) {
        return res.status(400).send({ error: 'Missing required information' });
    }
    else {
        try {
            // Brug af prepared statements for at undgå SQL injection
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