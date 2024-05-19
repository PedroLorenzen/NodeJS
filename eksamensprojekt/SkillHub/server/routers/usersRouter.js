import { Router } from 'express';
import bcrypt from 'bcrypt';
import { connect } from '../database/connection.js';
import { sanitizeHTML, sanitizeEmail } from '../util/sanitize.js';

const router = Router();

router.get('/users', async (req, res) => {
    if (req.session.user) {
        try {
            const db = await connect();
            if (req.query.getUser === "true") {
                const user = await db.collection('users').findOne({ _id: req.session.user.id });
                if (user) {
                    console.log(`Session for userID ${req.session.user.id} retrieved.`);
                    return res.send({ user });
                }
                console.log(`User with ID ${req.session.user.id} not found.`);
                return res.status(404).send({ message: "User not found." });
            }
            const result = await db.collection('users').find().toArray();
            res.send({ data: result });
            console.log("All users have been fetched");
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).send({ error: 'Error fetching users' });
        }
    } else {
        res.status(401).send({ error: 'Unauthorized' });
    }
});

router.post('/users', async (req, res) => {
    try {
        let { name, email, password, location } = req.body;
        if (!name || !email || !password || !location) {
            return res.status(400).send({ error: 'Missing required information' });
        }
        if (password.length < 6 || !password.match(/[A-Z]/) || !password.match(/[^\w\s]/)) {
            return res.status(400).send({
                error: 'Password must be at least 6 characters long, include at least one uppercase letter, and one special character.'
            });
        }
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

        const generateUserId = await db.collection('counters').findOneAndUpdate(
            { _id: 'userId' },
            { $inc: { sequence_value: 1 } },
            { returnDocument: 'after', upsert: true }
        );

        const userId = generateUserId.sequence_value;

        const newUser = {
            _id: userId,
            name,
            email,
            password: hashedPassword,
            location
        };

        await db.collection('users').insertOne(newUser);
        res.send({ message: 'User registered successfully' });
        console.log("New user with ID: " + newUser._id + " has been created");
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send({ error: 'Error registering user' });
    }
});



export default router;
