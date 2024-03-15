import { Router } from 'express';

const router = Router();

export default router;

app.get('/api/matches', async (req, res) => {
    const matches = await getMatches();
    res.send({data: matches});
});