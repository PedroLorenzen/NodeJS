import { Router } from "express";
import { connect } from "../database/connection.js";
import { sanitizeHTML } from "../util/sanitize.js";

const router = Router();

router.get('/chats', async (req, res) => {
    if (req.session.user) {
        try {
            const db = await connect();
            const userId = req.session.user.id;
            const otherUserId = parseInt(req.query.otherUserId);

            if (!otherUserId) {
                const chats = await db.collection('chats').find({ user_ids: userId }).toArray();
                if (!chats || chats.length === 0) {
                    console.log(`No chats found for userID ${userId}.`);
                    return res.status(404).send({ message: 'No chats found.' });
                }
                console.log(`Chats for userID ${userId} retrieved.`);
                return res.send({ chats });
            }
            const chat = await db.collection("chats").findOne({ user_ids: { $all: [userId, otherUserId] } });
            if (!chat) {
                return res.status(404).send({ message: "Chat not found." });
            }
            console.log(`Chat history between user ID ${userId} and user ID ${otherUserId} retrieved.`);
            return res.send({ chat: chat.messages });
        } catch (error) {
            console.error('Error fetching chats:', error);
            return res.status(500).send({ error: 'Error fetching chats' });
        }

    } else {
        res.status(401).send({ error: 'Unauthorized' });
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
            const existingChat = await db.collection("chats").findOne({ user_ids: { $all: [userId, otherUserId] } });
            if (existingChat) {
                return res.status(400).send({ error: "Chat already exists between the users" });
            }

            const generateChatId = await db.collection("counters").findOneAndUpdate(
                { _id: "chatId" },
                { $inc: { sequence_value: 1 } },
                { returnDocument: "after" }
            );
            const chatId = generateChatId.sequence_value;

            const newChat = {
                _id: chatId,
                user_ids: [userId, otherUserId],
                messages: []
            };

            await db.collection("chats").insertOne(newChat);
            res.send({ message: "Chat created successfully", chatId });

        } catch (error) {
            console.error("Database error:", error);
            res.status(500).send({ error: "Database operation failed" });
        }
    } else {
        res.status(401).send({ error: "Unauthorized" });
    }
});


router.put('/chats', async (req, res) => {
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
                timestamp: new Date()
            };

            const result = await db.collection('chats').updateOne(
                { user_ids: { $all: [userId, otherUserId] } },
                { $push: { messages: newMessage } }
            );

            if (result.modifiedCount === 0) {
                console.log(`Chat between user ID ${userId} and user ID ${otherUserId} not found or user not authorized.`);
                return res.status(404).send({ message: 'Chat not found or user not authorized.' });
            }

            console.log(`Message added to chat between user ID ${userId} and user ID ${otherUserId}.`);
            return res.send({ message: 'Message added to chat.' });
        } catch (error) {
            console.error('Error updating chat:', error);
            res.status(500).send({ error: 'Error updating chat' });
        }
    } else {
        res.status(401).send({ error: 'Unauthorized' });
    }
});

router.delete('/chats', async (req, res) => {
    if (req.session.user) {
        try {
            const db = await connect();
            const userId = req.session.user.id;
            const otherUserId = parseInt(req.query.otherUserId);

            if (!otherUserId) {
                return res.status(400).send({ error: "Missing other user ID" });
            }

            const chat = await db.collection("chats").findOne({ user_ids: { $all: [userId, otherUserId] } });
            console.log(chat);
            if (!chat) {
                console.log(`Chat between user ID ${userId} and user ID ${otherUserId} not found.`);
                return res.status(404).send({ message: "Chat not found." });
            }
            const result = await db.collection('chats').deleteOne({
                user_ids: { $all: [userId, otherUserId] }
            });

            if (result.deletedCount === 0) {
                console.log(`Chat between user ID ${userId} and user ID ${otherUserId} not found or user not authorized.`);
                return res.status(404).send({ message: 'Chat not found or user not authorized.' });
            }

            console.log(`Chat between user ID ${userId} and user ID ${otherUserId} deleted.`);
            return res.status(404).send({ message: 'Chat deleted successfully.' });
        } catch (error) {
            console.error('Error deleting chat:', error);
            res.status(500).send({ error: 'Error deleting chat' });
        }
    } else {
        res.status(401).send({ error: 'Unauthorized' });
    }
});


export default router;