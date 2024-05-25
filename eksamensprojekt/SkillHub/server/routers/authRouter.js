import { Router } from "express";
import bcrypt from "bcrypt";
import { connect } from "../database/connection.js";
import { sanitizeEmail } from "../util/sanitize.js";
import authRateLimiter from "../middleware/authRateLimiterMiddleware.js";

const router = Router();

router.post("/login", authRateLimiter, async (req, res) => {
    let { email, password } = req.body;
    email = sanitizeEmail(email);
    try {
        const db = await connect();
        const userQuery = await db.collection("users").findOne({ email });

        if (!userQuery) {
            console.log(`User with email: ${email} does not exist in the database`);
            return res.status(404).send({ message: "Invalid email" });
        }

        const isMatch = await bcrypt.compare(password, userQuery.password);
        if (isMatch) {
            req.session.user = {
                id: userQuery._id,
                email: userQuery.email,
                name: userQuery.name,
                location: userQuery.location,
                isAdmin: userQuery.isAdmin
            };
            console.log(`User with ID: ${userQuery._id} has logged in`);
            return res.send({ message: "Logged in successfully" });
        }

        console.log(`User with ID: ${userQuery._id} has entered an invalid password`);
        return res.status(401).send({ message: "Invalid password" });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).send({ message: "Error logging in" });
    }
});

router.get("/logout", authRateLimiter, (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send({ message: "Error logging out" });
        }
        res.clearCookie("sid");
        res.send({ message: "Logged out successfully" });
        console.log("User has logged out and session destroyed");
    });
});

export default router;
