import { Router } from 'express';
import escape from 'escape-html';

const router = Router();
const messages = [];

// Retrieve messages with XSS protection
router.get('/xss/messages', (req, res) => {
    res.send({ data: messages.map(message => escape(message)) });
});

// Save a new message with XSS escaping
router.post('/xss/messages', (req, res) => {
    const escapedMessage = escape(req.body.message);
    messages.push(escapedMessage);
    res.send({ data: messages });
});

export default router;
