import { Router } from 'express';
import bcrypt from 'bcrypt';
import { connect } from '../database/connection.js';
import { sanitizeEmail } from '../util/sanitize.js';

const router = Router();

router.post('/login', async (req, res) => {
    let { email, password } = req.body;
    email = sanitizeEmail(email);

    try {
        const db = await connect();
        const userQuery = await db.collection('users').findOne({ email });

        if (!userQuery) {
            return res.status(404).send({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, userQuery.password);
        if (isMatch) {
            req.session.user = {
                id: userQuery._id,
                email: userQuery.email,
                name: userQuery.name,
                location: userQuery.location
            };
            res.send({ message: "Logged in successfully" });
            console.log(`User with ID: ${userQuery._id} has logged in`);
        } else {
            res.status(401).send({ message: "Invalid password" });
            console.log(`User with ID: ${userQuery._id} has entered an invalid password`);
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send({ message: "Error logging in" });
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send({ message: "Error logging out" });
        }
        res.clearCookie('sid');
        res.send({ message: "Logged out successfully" });
        console.log("User has logged out and session destroyed");
    });
});

export default router;