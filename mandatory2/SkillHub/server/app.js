import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import cors from "cors";

const app = express();

app.use(cors({
    credentials: true,
    origin: true
}));

app.use(express.static('public'));
app.use(express.json());
app.use(helmet());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

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

import userRouter from './routers/userRouter.js';
app.use(userRouter);

import jobsRouter from './routers/jobRouter.js';
app.use(jobsRouter); // app.use('/api/jobs', jobsRouter);

import authRouter from './routers/authRouter.js';
app.use(authRouter); //app.use('/auth', authRouter);

import sessionRouter from './routers/sessionRouter.js';
app.use(sessionRouter);

import mailRouter from './routers/mailRouter.js';
app.use(mailRouter);

app.all("*", (req, res) => {
    res.status(404).send({ message: "Not Found" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
