import "dotenv/config";
import express from "express";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import sessionMiddleware from "./middleware/sessionMiddleware.js";
import { Server } from "socket.io";
import http from "http";
import { sanitizeHTML } from "./util/sanitize.js";

const app = express();

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(sessionMiddleware);

app.use(express.static("public"));
app.use(express.json());
app.use(helmet());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log('A user connected');

    socket.on("send-chat-message", (data) => {
        if (data.text === "" || data.text === null || data.text === undefined) {
            return;
        }
        io.emit("chat-message", data);
        console.log(data);
    });

    socket.on("disconnect", () => {
        console.log('A user disconnected');
        console.log(socket.id);
    });
});

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    limit: 100000,
    standardHeaders: true,
    legacyHeaders: false,
    cookie: {
        secure: false,
        httpOnly: true,
        sameSite: "strict"
    },
    handler: (req, res) => {
        console.log(`Rate limit exceeded for ${req.ip}`);
        res.status(429).send("Too many requests, please try again later.");
    }
});

app.use(limiter);

import authRouter from "./routers/authRouter.js";
app.use(authRouter);

import usersRouter from "./routers/usersRouter.js";
app.use(usersRouter);

import jobsRouter from "./routers/jobsRouter.js";
app.use(jobsRouter);

import mailsRouter from "./routers/mailsRouter.js";
app.use(mailsRouter);

import skillsRouter from "./routers/skillsRouter.js";
app.use(skillsRouter);

import chatsRouter from "./routers/chatsRouter.js";
app.use(chatsRouter);

app.all("*", (req, res) => {
    res.status(404).send({ message: "Not Found" });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
