import { Router } from "express";
import { connect } from "../database/connection.js";
import { sanitizeHTML } from "../util/sanitize.js";
import { parse } from "dotenv";

const router = Router();

router.post("/jobs", async (req, res) => {
    if (req.session.user) {
        try {
            let { name, skill_id, description, price, user_id } = req.body;

            if (!Number.isFinite(price) || price <= 0) {
                return res.status(400).send({ error: "Price must be a number and over 0" });
            }
            if (!Number.isFinite(skill_id)) {
                return res.status(400).send({ error: "Skill ID must be a number" });
            }
            if (!Number.isFinite(user_id)) {
                return res.status(400).send({ error: "User ID must be a number" });
            }

            if (!name || !description) {
                return res.status(400).send({ error: "Missing required information" });
            }

            const db = await connect();
            const generateJobId = await db.collection("counters").findOneAndUpdate(
                { _id: "jobId" },
                { $inc: { sequence_value: 1 } },
                { returnDocument: "after", upsert: true }
            );
            const jobId = generateJobId.sequence_value;

            const newJob = {
                _id: jobId,
                name: sanitizeHTML(name),
                skill_id,
                description: sanitizeHTML(description),
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
            } else if (req.query.skillId) {
                const skillId = parseInt(req.query.skillId);
                query.skill_id = skillId;
            } else if (req.query.jobId) {
                const jobId = parseInt(req.query.jobId);
                const job = await db.collection("jobs").findOne({ _id: jobId });
                if (job && job._id === jobId) {
                    return res.send({ job });
                }
                return res.status(404).send({ message: "Job not found." });
            } else if (req.query.sortBySkills) {
                const jobs = await db.collection('jobs').find().sort({ skillId: 1 }).toArray();
                if (jobs && jobs.length > 0) {
                    return res.send({ data: jobs });
                }
                return res.status(404).send({ message: "Jobs sorted by skill not found." });
            }
            const jobs = await db.collection("jobs").find(query).toArray();
            if (jobs && jobs.length > 0) {
                return res.send({ data: jobs });
            }
            return res.status(404).send({ message: "Jobs sorted by " + query + " not found."});

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
            console.log("error the job id is not provided" + jobId)
            return res.status(400).send({ error: "Job ID must be provided as a query parameter" });
        }
        try {
            const { name, skill_id, description, price, user_id } = req.body;

            if (!Number.isFinite(jobId) || jobId <= 0) {
                return res.status(400).send({ error: "Job ID must be a number and over 0" });
            }
            if (!Number.isFinite(skill_id) || skill_id <= 0) {
                return res.status(400).send({ error: "Skill ID must be a number and over 0" });
            }
            if (!Number.isFinite(price) || price <= 0) {
                return res.status(400).send({ error: "Price must be a number and over 0" });
            }
            if (!Number.isFinite(user_id)) {
                return res.status(400).send({ error: "User ID must be a number" });
            }
            if (!name || !description) {
                return res.status(400).send({ error: "Missing required information" });
            }

            const db = await connect();
            const updatedJob = await db.collection("jobs").findOneAndUpdate(
                { _id: jobId },
                {
                    $set: {
                        name: sanitizeHTML(name),
                        skill_id,
                        description: sanitizeHTML(description),
                        price: price,
                        user_id: user_id
                    }
                },
                { returnDocument: "after" }
            );
            res.send({ message: "Job updated successfully: ", job: updatedJob });
        } catch (error) {
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
                res.status(404).send({ error: "Job not found" });
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