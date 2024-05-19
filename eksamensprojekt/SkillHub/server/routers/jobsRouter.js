import { Router } from 'express';
import { connect } from '../database/connection.js';
import { sanitizeHTML } from '../util/sanitize.js';
import { parse } from 'dotenv';

const router = Router();

router.get('/jobs', async (req, res) => {
    if (req.session.user) {
        try {
            const db = await connect();
            const query = {};

            if (req.query.filterByUser) {
                query.user_id = req.session.user.id;
                console.log("Fetching jobs for user ID:", req.session.user.id);
            }
            else if (req.query.getJobId) {
                const _id = parseInt(req.query.getJobId);
                console.log("ID: ", _id);
                const job = await db.collection('jobs').findOne({ _id });
                if (job) {
                    console.log(`Session for userID ${job._id} retrieved.`);
                    return res.send({ job });
                }
                res.status(404).send({ message: "Job not found." });
                console.log(`Job with ID ${_id} not found.`);
                return;
            }
            const jobs = await db.collection('jobs').find(query).toArray();
            res.send({ data: jobs });

        } catch (error) {
            console.error('Error fetching jobs:', error);
            res.status(500).send({ error: 'Error fetching jobs' });
        }
    }
});

router.post('/jobs', async (req, res) => {
    if (req.session.user) {
        try {
            let { name, skill, description, price, user_id } = req.body;

            if (!Number.isFinite(price) || price <= 0) {
                return res.status(400).send({ error: 'Price must be a number and over 0' });
            }
            if (!Number.isFinite(user_id)) {
                return res.status(400).send({ error: 'User ID must be a number' });
            }

            if (!name || !skill || !description || !price || !user_id) {
                return res.status(400).send({ error: 'Missing required information' });
            }
            name = sanitizeHTML(name);
            skill = sanitizeHTML(skill);
            description = sanitizeHTML(description);

            const db = await connect();

            const generateJobId = await db.collection('counters').findOneAndUpdate(
                { _id: 'jobId' },
                { $inc: { sequence_value: 1 } },
                { returnDocument: 'after', upsert: true }
            );

            const jobId = generateJobId.sequence_value;

            const newJob = {
                _id: jobId,
                name,
                skill,
                description,
                price,
                user_id
            };

            await db.collection('jobs').insertOne(newJob);
            res.send({ message: 'Job created successfully' });
            console.log("New user with ID: " + newJob._id + " has been created");
            console.log("Name: " + name + " Skill: " + skill + " Description: " + description + " Price: " + price + " User ID: " + user_id);

        } catch (error) {
            console.error('Database error:', error);
            res.status(500).send({ error: 'Database operation failed' });
        }
    }
});

export default router;