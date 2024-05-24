import { Router } from "express";
import bcrypt from "bcrypt";
import { connect } from "../database/connection.js";
import { sanitizeHTML, sanitizeEmail } from "../util/sanitize.js";

const router = Router();

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

        const newUser = {
            _id: userId,
            name,
            email,
            password: hashedPassword,
            location
        };

        await db.collection("users").insertOne(newUser);
        res.send({ message: "User registered successfully" });
        console.log("New user with ID: " + newUser._id + " has been created");
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).send({ error: "Error registering user" });
    }
});

router.get("/users", async (req, res) => {
    if (req.session.user) {
        try {
            const db = await connect();
            if (req.query.getUser === "true") {
                const user = await db.collection("users").findOne({ _id: req.session.user.id });
                if (!user) {
                    console.log(`User with ID ${req.session.user.id} not found.`);
                    return res.status(404).send({ message: "User not found." });
                }
                console.log(`Session for userID ${req.session.user.id} retrieved.`);
                return res.send({ user });
            }
            else if (req.query.getUserById) {
                const userId = parseInt(req.query.getUserById);
                const user = await db.collection("users").findOne({ _id: userId });
                if (!user) {
                    console.log(`User with ID ${userId} not found.`)
                    return res.status(404).send({ message: "User not found." });
                }
                console.log(`User with ID ${userId} retrieved.`);
                return res.send({ user });
            }
            const result = await db.collection("users").find().toArray();
            res.send({ data: result });
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).send({ error: "Error fetching users" });
        }
    } else {
        res.status(401).send({ error: "Unauthorized" });
    }
});

router.put("/users", async (req, res) => {
    if (req.session.user) {
        try {
            const { name, email, location, oldPassword, newPassword } = req.body;
            let user = {};
            const db = await connect();
            user = await db.collection("users").findOne({ _id: req.session.user.id });
            if (user) {
                if (!name || !email || !location) {
                    return res.status(400).send({ error: "Missing required information" });
                }
                if (oldPassword) {
                    if (newPassword.length < 6 || !newPassword.match(/[A-Z]/) || !newPassword.match(/[^\w\s]/) || newPassword === oldPassword || newPassword === undefined) {
                        return res.status(400).send({
                            error: "Password must be at between 6 and 70 characters long, include at least one uppercase letter, one special character and not match the old password."
                        });
                    }
                    const isMatch = await bcrypt.compare(oldPassword, user.password);
                    if (isMatch) {
                        const salt = await bcrypt.genSalt(12);
                        const hashedPassword = await bcrypt.hash(newPassword, salt);
                        await db.collection("users").updateOne(
                            { _id: req.session.user.id },
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
                await db.collection("users").updateOne(
                    { _id: req.session.user.id },
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
            console.error("Error updating user:", error);
            res.status(500).send({ error: "Error updating user" });
        }
    }
});

router.delete("/users", async (req, res) => {
    if (req.session.user) {
        try {
            const db = await connect();
            const user = await db.collection("users").findOne({ _id: req.session.user.id });
            if (user) {
                await db.collection("jobs").deleteMany({ user_id: req.session.user.id });
                await db.collection("users").deleteOne({ _id: req.session.user.id });
                return res.send({ message: "User deleted successfully" });
            }
            return res.status(404).send({ message: "User not found." });
        } catch (error) {
            console.error("Error deleting user:", error);
            res.status(500).send({ error: "Error deleting user" });
        }
    } else {
        res.status(401).send({ error: "Unauthorized" });
    }
});

export default router;
