import volcanoRouter from './routers/volcanoRouter.js';
import express from 'express';

const app = express();
const port = 3000;

app.use(express.json());

app.use(volcanoRouter);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});