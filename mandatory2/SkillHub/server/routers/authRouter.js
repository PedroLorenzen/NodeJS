import { Router } from 'express';
import bcrypt from 'bcrypt';
import db from '../database/connection.js';
const router = Router();

router.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const userQuery = await db.get('SELECT * FROM Users WHERE email = ?', [email]);
        if (!userQuery) {
            return res.status(404).send({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, userQuery.password);
        if (isMatch) {
            req.session.user = {
                id: userQuery.id,
                email: userQuery.email,
                name: userQuery.name,
                location: userQuery.location
            };
            res.send({ message: "Logged in successfully" });
            console.log("User with ID: " + userQuery.id + " has logged in");
        } else {
            res.status(401).send({ message: "Invalid password" });
            console.log("User with ID: " + userQuery.id + " has entered an invalid password");
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send({ message: "Error logging in" });
    }
});


router.get('/auth/logout', (req, res) => {
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