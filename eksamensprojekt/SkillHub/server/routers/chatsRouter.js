import { Router } from "express";
import { connect } from "../database/connection.js";
import { sanitizeHTML } from "../util/sanitize.js";

const router = Router();

router.get("/chats", async (req, res) => {
    if (req.session.user) {
        try {
            const db = await connect();
            const userId = req.session.user.id;
            const otherUserId = parseInt(req.query.otherUserId);

            if (!otherUserId) {
                const chats = await db
                    .collection("chats")
                    .find({ user_ids: userId })
                    .toArray();
                if (!chats || chats.length === 0) {
                    return res.status(404).send({ message: "No chats found." });
                }
                return res.send({ chats });
            }
            const chat = await db
                .collection("chats")
                .findOne({ user_ids: { $all: [userId, otherUserId] } });
            if (!chat) {
                return res.status(404).send({ message: "Chat not found." });
            }
            return res.send({ chat: chat.messages });
        } catch (error) {
            return res.status(500).send({ error: "Error fetching chats" });
        }
    } else {
        res.status(401).send({ error: "Unauthorized" });
    }
});

router.post("/chats", async (req, res) => {
    if (req.session.user) {
        try {
            const otherUserId = parseInt(req.query.otherUserId);
            const userId = req.session.user.id;

            if (!otherUserId) {
                return res.status(400).send({ error: "Missing other user ID" });
            }

            const db = await connect();
            const existingChat = await db
                .collection("chats")
                .findOne({ user_ids: { $all: [userId, otherUserId] } });
            if (existingChat) {
                return res
                    .status(400)
                    .send({ error: "Chat already exists between the users" });
            }

            const generateChatId = await db
                .collection("counters")
                .findOneAndUpdate(
                    { _id: "chatId" },
                    { $inc: { sequence_value: 1 } },
                    { returnDocument: "after" },
                );
            const chatId = generateChatId.sequence_value;

            const newChat = {
                _id: chatId,
                user_ids: [userId, otherUserId],
                messages: [],
            };

            await db.collection("chats").insertOne(newChat);
            res.send({ message: "Chat created successfully", chatId });
        } catch (error) {
            res.status(500).send({ error: "Database operation failed" });
        }
    } else {
        res.status(401).send({ error: "Unauthorized" });
    }
});

router.put("/chats", async (req, res) => {
    if (req.session.user) {
        try {
            const db = await connect();
            const otherUserId = parseInt(req.query.otherUserId);
            const userId = req.session.user.id;
            const { text } = req.body;

            if (!otherUserId) {
                return res.status(400).send({ error: "Missing other user ID" });
            }

            const newMessage = {
                user_id: userId,
                text: sanitizeHTML(text),
                timestamp: new Date(),
            };

            const result = await db
                .collection("chats")
                .updateOne(
                    { user_ids: { $all: [userId, otherUserId] } },
                    { $push: { messages: newMessage } },
                );

            if (result.modifiedCount === 0) {
                return res.status(404).send({
                    message: "Chat not found or user not authorized.",
                });
            }

            return res.send({ message: "Message added to chat." });
        } catch (error) {
            res.status(500).send({ error: "Error updating chat" });
        }
    } else {
        res.status(401).send({ error: "Unauthorized" });
    }
});

router.delete("/chats", async (req, res) => {
    if (req.session.user) {
        try {
            const db = await connect();
            let userId = null;
            const otherUserId = parseInt(req.query.otherUserId);

            if (req.query.getUserId) {
                userId = parseInt(req.query.getUserId);
                const chats = await db
                    .collection("chats")
                    .find({ user_ids: userId })
                    .toArray();
                if (chats.length === 0) {
                    return res.status(404).send({ message: "Chat not found." });
                }
                const result = await db.collection("chats").deleteMany({
                    user_ids: userId,
                });
                if (result.deletedCount === 0) {
                    return res.status(404).send({
                        message: "Chat not found or user not authorized.",
                    });
                }
                return res
                    .status(200)
                    .send({ message: "Chats deleted successfully." });
            } else {
                userId = req.session.user.id;
            }

            if (!otherUserId) {
                return res.status(400).send({ error: "Missing other user ID" });
            }

            const chat = await db
                .collection("chats")
                .findOne({ user_ids: { $all: [userId, otherUserId] } });
            if (!chat) {
                return res.status(404).send({ message: "Chat not found." });
            }
            const result = await db.collection("chats").deleteOne({
                user_ids: { $all: [userId, otherUserId] },
            });

            if (result.deletedCount === 0) {
                return res.status(404).send({
                    message: "Chat not found or user not authorized.",
                });
            }

            return res
                .status(200)
                .send({ message: "Chat deleted successfully." });
        } catch (error) {
            res.status(500).send({ error: "Error deleting chat" });
        }
    } else {
        res.status(401).send({ error: "Unauthorized" });
    }
});

export default router;
