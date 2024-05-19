import 'dotenv/config';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import cors from "cors";
import sessionMiddleware from './middleware/sessionMiddleware.js';

const app = express();

app.use(cors({
    origin: true,
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

import authRouter from './routers/authRouter.js';
app.use(authRouter);

import usersRouter from './routers/usersRouter.js';
app.use(usersRouter);

import jobsRouter from './routers/jobsRouter.js';
app.use(jobsRouter);

import mailsRouter from './routers/mailsRouter.js';
app.use(mailsRouter);

app.all("*", (req, res) => {
    res.status(404).send({ message: "Not Found" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
