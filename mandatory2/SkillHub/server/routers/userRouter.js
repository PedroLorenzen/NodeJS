import { Router } from 'express';
import bcrypt from 'bcrypt';
import db from '../database/connection.js';
import { sanitizeHTML, sanitizeEmail } from '../util/sanitize.js';

const router = Router();


router.get('/api/users', async (req, res) => {
    const result = await db.all('SELECT * FROM Users');
    res.send({ data: result })
    console.log(result);
});


router.post('/api/users', async (req, res) => {
    let { name, email, password, location } = req.body;

    try{
        const emailCheckQuery = 'SELECT email FROM Users WHERE email = ?';
        const existingUser = await db.get(emailCheckQuery, [email]);

        if (existingUser) {
            return res.status(409).send({ error: 'Email already exists.' });
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send({ error: 'Database operation for checking email matches failed' });
    }

    if (!name || !email || !password || !location) {
        return res.status(400).send({ error: 'Missing required information' });
    }

    else if (password.length < 6 || !password.match(/[A-Z]/) || !password.match(/[^\w\s]/)) {
        return res.status(400).send({
            error: 'Password must be at least 6 characters long, include at least one uppercase letter, and one special character.'
        });
    }

    try {
        name = sanitizeHTML(name);
        email = sanitizeEmail(email);
        location = sanitizeHTML(location)

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);
        const sql = 'INSERT INTO Users (name, email, password, location) VALUES (?, ?, ?, ?)';
        const result = await db.run(sql, [name, email, hashedPassword, location]);
        res.send({ lastID: result.lastID });
        console.log("New user with ID: " + result.lastID + " has been created");
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send({ error: 'Database operation for registering user failed' });
    }
});

export default router;