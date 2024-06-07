import { Router } from "express";
import bcrypt from "bcrypt";
import { connect } from "../database/connection.js";
import { sanitizeEmail } from "../util/sanitize.js";
import authRateLimiter from "../middleware/authRateLimiterMiddleware.js";

const router = Router();

router.get("/logout", authRateLimiter, (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(400).send({ message: "User is not logged in" });
        }
        req.session.destroy(() => {
            res.clearCookie("sid");
            res.send({ message: "Logged out successfully" });
        });
    } catch (error) {
        return res.status(500).send({ message: "Error logging out: " + error });
    }
});

router.post("/login", authRateLimiter, async (req, res) => {
    let { email, password } = req.body;
    email = sanitizeEmail(email);
    try {
        const db = await connect();
        const userQuery = await db.collection("users").findOne({ email });

        if (!userQuery) {
            return res.status(404).send({ message: "Invalid email" });
        }

        const isMatch = await bcrypt.compare(password, userQuery.password);
        if (isMatch) {
            req.session.user = {
                id: userQuery._id,
                email: userQuery.email,
                name: userQuery.name,
                location: userQuery.location,
                isAdmin: userQuery.isAdmin,
            };
            return res.send({ message: "Logged in successfully" });
        }
        return res.status(401).send({ message: "Invalid password" });
    } catch (error) {
        return res.status(500).send({ message: "Error logging in" });
    }
});

export default router;
