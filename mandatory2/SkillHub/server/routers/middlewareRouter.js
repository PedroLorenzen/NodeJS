import { Router } from 'express';

const router = Router();

// Logging Middleware
router.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

export default router;
