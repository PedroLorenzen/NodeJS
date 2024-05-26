import { Router } from "express";
import { connect } from "../database/connection.js";
import { sanitizeHTML } from "../util/sanitize.js";

const router = Router();

router.get("/skills", async (req, res) => {
    if (req.session.user) {
        try {
            const db = await connect();
            const query = {};

            if (req.query.skillId) {
                const skillId = parseInt(req.query.skillId);
                const skill = await db.collection("skills").findOne({ _id: skillId });
                if (!skill) {
                    return res.status(404).send({ message: "Skill not found" });
                }
                return res.send(skill);
            }
            const skills = await db.collection("skills").find(query).toArray();
            res.send(skills);
        } catch (error) {
            res.status(500).send({ error: "Error fetching skills" });
        }
    } else {
        res.status(401).send({ error: "Unauthorized" });
    }
});

router.post("/skills", async (req, res) => {
    if (req.session.user.isAdmin) {
        try {
            let { name } = req.body;
            const db = await connect();
            const existingSkill = await db.collection("skills").findOne({ name: name });

            if (!name) {
                return res.status(400).send({ error: "Missing skill name" });
            } else if (existingSkill) {
                return res.status(400).send({ error: "Skill already exists" });
            }

            const generateSkillId = await db.collection("counters").findOneAndUpdate(
                { _id: "skillId" },
                { $inc: { sequence_value: 1 } },
                { returnDocument: "after", upsert: true }
            );

            const skillId = generateSkillId.sequence_value;

            const newSkill = {
                _id: skillId,
                name: sanitizeHTML(name)
            };

            await db.collection("skills").insertOne(newSkill);
            res.send({ message: "Skill created successfully", newSkill });
        } catch (error) {
            res.status(500).send({ error: "Database operation failed" });
        }
    } else {
        res.status(401).send({ error: "Unauthorized" });
    }
});

router.put("/skills", async (req, res) => {
    if (req.session.user.isAdmin) {
        const skillId = parseInt(req.query.skillId);
        if (!skillId) {
            return res.status(400).send({ error: "Skill ID must be provided as a query parameter" });
        }
        try {
            let { name } = req.body;
            const db = await connect();
            const existingSkill = await db.collection("skills").findOne({ name: name });

            if (!name) {
                return res.status(400).send({ error: "Missing skill name" });
            } else if (existingSkill) {
                return res.status(400).send({ error: "Skill already exists" });
            }

            const updatedSkill = await db.collection("skills").findOneAndUpdate(
                { _id: skillId },
                { $set: { name } },
                { returnDocument: "after" }
            );
            res.send({ message: "Skill updated successfully", skill: updatedSkill.value });
        } catch (error) {
            res.status(500).send({ error: "Database operation failed" });
        }
    } else {
        res.status(401).send({ error: "Unauthorized" });
    }
});

router.delete("/skills", async (req, res) => {
    if (req.session.user.isAdmin) {
        const userId = req.session.user.id;
        const skillId = parseInt(req.query.skillId);
        if (!skillId) {
            return res.status(400).send({ error: "Skill ID must be provided as a query parameter" });
        }
        try {
            const db = await connect();
            const jobsWithSkill = await db.collection("jobs").find({ skill_id: skillId }).toArray();
            if(jobsWithSkill.length > 0) { 
                return res.status(400).send({ error: "Cannot delete skill with associated jobs" });
            }
            const deletedSkill = await db.collection("skills").deleteOne({ _id: skillId });
            if (deletedSkill.deletedCount === 1) {
                res.send({ message: "Skill deleted successfully" });
            } else {
                res.status(404).send({ error: "Skill not found or already deleted" });
            }
        } catch (error) {
            res.status(500).send({ error: "Database operation failed" });
        }
    } else {
        res.status(401).send({ error: "Unauthorized" });
    }
});

export default router;