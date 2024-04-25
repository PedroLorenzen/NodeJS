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
    saveUninitialized: true,
    cookie: { secure: false } //  cookie: { secure: process.env.NODE_ENV === 'production' } kan sættes til true hvis man bruger https i production (kræver certifikat)
}));

// General rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutter
    limit: 50, // Begræns antal requests til 50 pr. windowMs
    standardHeaders: true, // 'draft-7'
    legacyHeaders: false,
});
app.use(limiter);

// Rate limiter for authentication routes
const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutter
    limit: 5, // Begræns antal requests til 5 pr. windowMs
    message: "Too many attempts from this IP, please try again after 15 minutes",
    standardHeaders: true,
    legacyHeaders: false,
});
app.use("/auth", authRateLimiter);

// Import and use routers
import userRouter from './routers/userRouter.js';
app.use('/api/users', userRouter);

import jobsRouter from './routers/jobsRouter.js';
app.use(jobsRouter); // app.use('/api/jobs', jobsRouter);

import authRouter from './routers/authRouter.js';
app.use(authRouter); //app.use('/auth', authRouter);

import sessionRouter from './routers/sessionRouter.js';
app.use('/session', sessionRouter);

import xssRouter from './routers/xssRouter.js';
app.use('/xss', xssRouter);

// 404 for alle andre requests
app.all("*", (req, res) => {
    res.status(404).send({ message: "Not Found" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
