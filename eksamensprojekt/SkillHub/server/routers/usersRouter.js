import { Router } from "express";
import bcrypt from "bcrypt";
import { connect } from "../database/connection.js";
import { sanitizeHTML, sanitizeEmail } from "../util/sanitize.js";

const router = Router();

router.get("/users", async (req, res) => {
    if (req.session.user) {
        try {
            const db = await connect();
            if (req.query.getUser === "true") {
                const user = await db.collection("users").findOne({ _id: req.session.user.id });
                if (!user) {
                    return res.status(404).send({ message: "User not found." });
                }
                return res.send({ user });
            }
            else if (req.query.getUserById) {
                const userId = parseInt(req.query.getUserById);
                const user = await db.collection("users").findOne({ _id: userId });
                if (!user) {
                    return res.status(404).send({ message: "User not found." });
                }
                return res.send({ user });
            }
            const result = await db.collection("users").find().toArray();
            res.send({ data: result });
        } catch (error) {
            res.status(500).send({ error: "Error fetching users" });
        }
    } else {
        res.status(401).send({ error: "Unauthorized" });
    }
});

router.post("/users", async (req, res) => {
    try {
        let { name, email, password, location } = req.body;
        if (!name || !email || !password || !location) {
            return res.status(400).send({ error: "Missing required information" });
        }
        if (password.length < 6 || password.length > 70 || !password.match(/[A-Z]/) || !password.match(/[^\w\s]/)) {
            return res.status(400).send({
                error: "Password must be at least 6 characters long, include at least one uppercase letter, and one special character."
            });
        }
        location = location.toLowerCase();
        name = sanitizeHTML(name);
        email = sanitizeEmail(email);
        location = sanitizeHTML(location);
        const db = await connect();
        const existingUser = await db.collection("users").findOne({ email: email });
        if (existingUser) {
            return res.status(409).send({ error: "Email already exists." });
        }
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        const generateUserId = await db.collection("counters").findOneAndUpdate(
            { _id: "userId" },
            { $inc: { sequence_value: 1 } },
            { returnDocument: "after" }
        );

        const userId = generateUserId.sequence_value;
        location = location.toLowerCase();

        const newUser = {
            _id: userId,
            name,
            email,
            password: hashedPassword,
            location,
            isAdmin: false
        };

        await db.collection("users").insertOne(newUser);
        res.send({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).send({ error: "Error registering user" });
    }
});

router.put("/users", async (req, res) => {
    if (req.session.user) {
        try {
            let { name, email, location, oldPassword, newPassword, isAdmin } = req.body;
            let user = {};
            let id = null;
            const db = await connect();

            if (req.query.getUserId) {
                user = await db.collection("users").findOne({ _id: parseInt(req.query.getUserId) });
                id = parseInt(req.query.getUserId);
            } else {
                user = await db.collection("users").findOne({ _id: req.session.user.id });
                id = req.session.user.id;
            }

            if (user) {
                if (!name || !email || !location) {
                    return res.status(400).send({ error: "Missing required information" });
                }
                location = location.toLowerCase();

                if (oldPassword) {
                    if (newPassword.length < 6 || !newPassword.match(/[A-Z]/) || !newPassword.match(/[^\w\s]/) || newPassword === oldPassword || newPassword === undefined) {
                        return res.status(400).send({
                            error: "Password must be between 6 and 70 characters long, include at least one uppercase letter, one special character, and not match the old password."
                        });
                    }
                    const isMatch = await bcrypt.compare(oldPassword, user.password);
                    if (isMatch) {
                        const salt = await bcrypt.genSalt(12);
                        const hashedPassword = await bcrypt.hash(newPassword, salt);
                        await db.collection("users").updateOne(
                            { _id: id },
                            {
                                $set: {
                                    name: sanitizeHTML(name),
                                    email: sanitizeEmail(email),
                                    location: sanitizeHTML(location),
                                    password: hashedPassword
                                }
                            },
                            { returnDocument: "after" }
                        );
                        return res.send({ message: "User updated successfully", user });
                    }
                    return res.status(401).send({ error: "Incorrect old password" });
                } 
                if (isAdmin !== undefined) {
                    await db.collection("users").updateOne(
                        { _id: id },
                        {
                            $set: {
                                name: sanitizeHTML(name),
                                email: sanitizeEmail(email),
                                location: sanitizeHTML(location),
                                isAdmin: isAdmin
                            }
                        },
                        { returnDocument: "after" }
                    );
                    return res.send({ message: "User updated successfully", user });
                }
                await db.collection("users").updateOne(
                    { _id: id },
                    {
                        $set: {
                            name: sanitizeHTML(name),
                            email: sanitizeEmail(email),
                            location: sanitizeHTML(location),
                        }
                    },
                    { returnDocument: "after" }
                );
                return res.send({ message: "User updated successfully", user });
            }
            return res.status(404).send({ message: "User not found." });
        } catch (error) {
            res.status(500).send({ error: "Error updating user" });
        }
    }
});


router.delete("/users", async (req, res) => {
    if (req.session.user) {
        try {
            let id = null;
            let user = {};
            const db = await connect();

            if (req.query.getUserId) {
                user = await db.collection("users").findOne({ _id: parseInt(req.query.getUserId) });
                id = parseInt(req.query.getUserId);
            } else {
                user = await db.collection("users").findOne({ _id: req.session.user.id });
                id = req.session.user.id;
            }
            if (user) {
                await db.collection("jobs").deleteMany({ user_id: id });
                await db.collection("chats").deleteMany({ user_ids: id });
                await db.collection("users").deleteOne({ _id: id });
                return res.send({ message: "User deleted successfully" });
            }
            return res.status(404).send({ message: "User not found." });
        } catch (error) {
            res.status(500).send({ error: "Error deleting user" });
        }
    } else {
        res.status(401).send({ error: "Unauthorized" });
    }
});

export default router;
