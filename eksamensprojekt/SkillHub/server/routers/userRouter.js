import { Router } from 'express';
import bcrypt from 'bcrypt';
import { connect } from '../database/connection.js';
import { sanitizeHTML, sanitizeEmail } from '../util/sanitize.js';

const router = Router();

async function getNextUserId() {
    const db = await connect();
    const result = await db.collection('counters').findOneAndUpdate(
        { _id: 'userId' },
        { $inc: { sequence_value: 1 } },
        { returnOriginal: false, upsert: true }
    );
    return result.value.sequence_value;
}

router.get('/users', async (req, res) => {
    try {
        const db = await connect();
        const result = await db.collection('users').find().toArray();
        res.send({ data: result });
        console.log("All user have been fetched");
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send({ error: 'Error fetching users' });
    }
});

router.post('/users', async (req, res) => {
    let { name, email, password, location } = req.body;
    if (!name || !email || !password || !location) {
        return res.status(400).send({ error: 'Missing required information' });
    }
    if (password.length < 6 || !password.match(/[A-Z]/) || !password.match(/[^\w\s]/)) {
        return res.status(400).send({
            error: 'Password must be at least 6 characters long, include at least one uppercase letter, and one special character.'
        });
    }
    try {
        name = sanitizeHTML(name);
        email = sanitizeEmail(email);
        location = sanitizeHTML(location);
        const db = await connect();
        const existingUser = await db.collection('users').findOne({ email: email });
        if (existingUser) {
            return res.status(409).send({ error: 'Email already exists.' });
        }
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);
        const userId = await getNextUserId();

        const newUser = {
            _id: userId,
            name,
            email,
            password: hashedPassword,
            location
        };

        const result = await db.collection('users').insertOne(newUser);
        res.send({ insertedId: result.insertedId });
        console.log("New user with ID: " + result.insertedId + " has been created");
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send({ error: 'Error registering user' });
    }
});



export default router;
