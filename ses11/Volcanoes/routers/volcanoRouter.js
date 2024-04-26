import {Router} from 'express';
const volcanoRouter = Router();
import db from '../database/connection.js';

/*async function getVolcanoes() {
    const result = await db.all('SELECT * FROM Volcanoes');
    return result
}

volcanoRouter.get('/api/volcanoes', async (req, res) => {
    const result = await getVolcanoes();
    res.send({data: result});
});*/

volcanoRouter.get('/api/volcanoes', async (req, res) => {
    const result = await db.all('SELECT * FROM Volcanoes');
    console.log(result);
    res.send({data: result})
});

volcanoRouter.post('/api/volcanoes', async (req, res) => {
    const { name, location, type } = req.body;
    if (!name || !location || !type) {
        return res.status(400).send({ error: 'Missing required information' });
    }

    try {
        // Brug af prepared statements for at undgå SQL injection
        const sql = 'INSERT INTO Volcanoes (name, location, type) VALUES (?, ?, ?)';
        const result = await db.run(sql, [name, location, type]);
        res.send({ lastID: result.lastID });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send({ error: 'Database operation failed' });
    }
});

export default volcanoRouter;