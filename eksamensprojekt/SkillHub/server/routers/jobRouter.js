import { Router } from 'express';
import { connect } from '../database/connection.js';
import { sanitizeHTML } from '../util/sanitize.js';

const router = Router();

router.get('/jobs', async (req, res) => {
    try {
        const db = await connect();
        const query = {};

        if (req.session.user && req.query.filterByUser === 'true') {
            query.user_id = req.session.user.id;  // assuming user id is stored in session under user.id
            console.log("Fetching jobs for user ID:", req.session.user.id);
        }

        const jobs = await db.collection('jobs').find(query).toArray();
        res.send({ data: jobs });
        
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).send({ error: 'Error fetching jobs' });
    }
});

router.post('/jobs', async (req, res) => {
    if (req.session.user) {
        let { name, skill, description, price, user_id } = req.body;

        if (!Number.isFinite(price)) {
            return res.status(400).send({ error: 'Price must be a number' });
        }
        if (!Number.isFinite(user_id)) {
            return res.status(400).send({ error: 'User ID must be a number' });
        }

        name = sanitizeHTML(name);
        skill = sanitizeHTML(skill);
        description = sanitizeHTML(description);

        if (!name || !skill || !description || !price || !user_id) {
            return res.status(400).send({ error: 'Missing required information' });
        } else {
            try {
                const db = await connect();
                const job = { name, skill, description, price, user_id };
                const result = await db.collection('jobs').insertOne(job);
                res.send({ insertedId: result.insertedId });
                console.log("New job with ID: " + result.insertedId + " has been created");
                console.log("Name: " + name + " Skill: " + skill + " Description: " + description + " Price: " + price + " User ID: " + user_id);
            } catch (error) {
                console.error('Database error:', error);
                res.status(500).send({ error: 'Database operation failed' });
            }
        }
    }
});

export default router;