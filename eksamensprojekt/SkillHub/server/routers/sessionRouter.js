import { Router } from 'express';
import { connect } from '../database/connection.js';
import { ObjectId } from 'mongodb';

const router = Router();

router.get('/getuser', async (req, res) => {
    if (req.session.user) {
        try {
            const db = await connect();
            const user = await db.collection('users').findOne({ _id: req.session.user.id });

            if (user) {
                res.send({ user });
                console.log(`Session for userID ${req.session.user.id} retrieved.`);
            } else {
                res.status(404).send({ message: "User not found." });
                console.log(`User with ID ${req.session.user.id} not found.`);
            }
        } catch (error) {
            console.error('Error retrieving user:', error);
            res.status(500).send({ message: "Error retrieving user." });
        }
    } else {
        res.status(404).send({ message: "No session found." });
        console.log("No session found.");
    }
});

export default router;
