import { rateLimit } from "express-rate-limit";

const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    limit: 10, 
    message: "Too many attempts from this IP, please try again after 15 minutes",
    standardHeaders: true,
    legacyHeaders: false,
    cookie: { 
        secure: false,
        httpOnly: true,
        sameSite: "strict"
    },
    handler: (req, res) => {
        console.log(`Authentication rate limit has been exceeded for ${req.ip}`);
        res.status(429).send("Too many login/signout requests, please try again later.");
    }
});

export default authRateLimiter;