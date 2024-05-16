import 'dotenv/config';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import cors from "cors";
import sessionMiddleware from './middleware/sessionMiddleware.js';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(sessionMiddleware);

app.use(express.static('public'));
app.use(express.json());
app.use(helmet());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 50,
    standardHeaders: true,
    legacyHeaders: false,
    cookie: { 
        secure: false,
        httpOnly: true,
        sameSite: 'strict'
    },
    handler: (req, res) => {
        console.log(`Rate limit exceeded for ${req.ip}`);
        res.status(429).send('Too many requests, please try again later.');
    }
});

app.use(limiter);

const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    limit: 10, 
    message: "Too many attempts from this IP, please try again after 15 minutes",
    standardHeaders: true,
    legacyHeaders: false,
    cookie: { 
        secure: false,
        httpOnly: true,
        sameSite: 'strict'
    },
    handler: (req, res) => {
        console.log(`Authentication rate limit has been exceeded for ${req.ip}`);
        res.status(429).send('Too many login/signout requests, please try again later.');
    }
});
app.use("/auth", authRateLimiter);

import authRouter from './routers/authRouter.js';
app.use("/auth", authRouter); //app.use('/auth', authRouter);

import sessionRouter from './routers/sessionRouter.js';
app.use("/session", sessionRouter);

import userRouter from './routers/userRouter.js';
app.use("/api", userRouter);

import jobRouter from './routers/jobRouter.js';
app.use("/api", jobRouter); // app.use('/api/jobs', jobsRouter);

import mailRouter from './routers/mailRouter.js';
app.use("/api", mailRouter);

app.all("*", (req, res) => {
    res.status(404).send({ message: "Not Found" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
