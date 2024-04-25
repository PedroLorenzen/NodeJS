import { Router } from 'express';

const router = Router();

router.post('/setuser', (req, res) => {
    const { user } = req.body;
    if (user) {
        req.session.user = user;
        res.send({ message: `Session for ${user} initialized.` });
    } else {
        res.status(400).send({ message: "No user provided." });
    }
});

router.get('/getuser', (req, res) => {
    if (req.session.user) {
        res.send({ user: req.session.user });
    } else {
        res.status(404).send({ message: "No session found." });
    }
});

export default router;