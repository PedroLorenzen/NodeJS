import { Router } from "express";
import { connect } from "../database/connection.js";
import { sanitizeHTML } from "../util/sanitize.js";
import { parse } from "dotenv";

const router = Router();

router.post("/jobs", async (req, res) => {
    if (req.session.user) {
        try {
            let { name, skill, description, price, user_id } = req.body;

            if (!Number.isFinite(price) || price <= 0) {
                return res.status(400).send({ error: "Price must be a number and over 0" });
            }
            if (!Number.isFinite(user_id)) {
                return res.status(400).send({ error: "User ID must be a number" });
            }

            if (!name || !skill || !description || !price || !user_id) {
                return res.status(400).send({ error: "Missing required information" });
            }
            name = sanitizeHTML(name);
            skill = sanitizeHTML(skill);
            description = sanitizeHTML(description);

            const db = await connect();

            const generateJobId = await db.collection("counters").findOneAndUpdate(
                { _id: "jobId" },
                { $inc: { sequence_value: 1 } },
                { returnDocument: "after", upsert: true }
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

            await db.collection("jobs").insertOne(newJob);
            res.send({ message: "Job created successfully" });

        } catch (error) {
            console.error("Database error:", error);
            res.status(500).send({ error: "Database operation failed" });
        }
    } else {
        res.status(401).send({ error: "Unauthorized" });
    }

});

router.get("/jobs", async (req, res) => {
    if (req.session.user) {
        try {
            const db = await connect();
            const query = {};

            if (req.query.filterJobsByUser) {
                query.user_id = req.session.user.id;
            } else if (req.query.jobId) {
                const jobId = parseInt(req.query.jobId);
                console.log("ID: ", jobId);
                const job = await db.collection("jobs").findOne({ _id: jobId });
                if (job) {
                    return res.send({ job });
                }
                res.status(404).send({ message: "Job not found." });
                return;
            } else if (req.query.jobSkills) {
                
            }
            const jobs = await db.collection("jobs").find(query).toArray();
            res.send({ data: jobs });

        } catch (error) {
            console.error("Error fetching jobs:", error);
            res.status(500).send({ error: "Error fetching jobs" });
        }
    } else {
        res.status(401).send({ error: "Unauthorized" });
    }
});

router.put("/jobs", async (req, res) => {
    if (req.session.user) {
        const jobId = parseInt(req.query.jobId);
        console.log("ID: ", jobId);
        if (!jobId) {
            return res.status(400).send({ error: "Job ID must be provided as a query parameter" });
        }
        try {
            const { name, skill, description, price, user_id } = req.body;

            if (!Number.isFinite(jobId) && jobId <= 0) {
                return res.status(400).send({ error: "Job ID must be a number and over 0" });
            }
            if (!Number.isFinite(price) || price <= 0) {
                return res.status(400).send({ error: "Price must be a number and over 0" });
            }
            if (!Number.isFinite(user_id)) {
                return res.status(400).send({ error: "User ID must be a number" });
            }
            if (!name || !skill || !description || !price || !user_id) {
                return res.status(400).send({ error: "Missing required information" });
            }

            const sanitizedData = {
                _id: jobId,
                name: sanitizeHTML(name),
                skill: sanitizeHTML(skill),
                description: sanitizeHTML(description),
                price,
                user_id
            };

            const db = await connect();
            const updatedJob = await db.collection("jobs").findOneAndUpdate(
                { _id: jobId },
                { $set: sanitizedData },
                { returnDocument: "after" }
            );
            
            res.send({ message: "Job updated successfully: ", job: updatedJob });
        } catch (error) {
            console.error("Database error:", error);
            res.status(500).send({ error: "Database operation failed" });
        }
    } else {
        res.status(401).send({ error: "Unauthorized" });
    }
});

router.delete("/jobs", async (req, res) => {
    if (req.session.user) {
        const jobId = parseInt(req.query.jobId);
        if (!jobId) {
            return res.status(400).send({ error: "Job ID must be provided as a query parameter" });
        }
        try {
            const db = await connect();
            const deletedJob = await db.collection("jobs").deleteOne({ _id: jobId });

            if (deletedJob.deletedCount === 1) {
                res.send({ message: "Job deleted successfully: " + jobId });
            } else {
                res.status(404).send({ error: "Job not found or already deleted" });
            }
        } catch (error) {
            console.error("Database error:", error);
            res.status(500).send({ error: "Database operation failed" });
        }
    } else {
        res.status(401).send({ error: "Unauthorized" });
    }
});

export default router;