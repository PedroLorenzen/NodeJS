const express = require('express');
const app = express();
const cors = require('cors');

// Apply CORS for all origins
app.use(cors({
    origin: '*' // This will allow access from any origin
}));

const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Express running on Vercel");
});

app.get('/greet', (req, res) => {
    const { name } = req.query;
    res.json({ greeting: `Hello ${name}! Welcome to my time capsule.` });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
