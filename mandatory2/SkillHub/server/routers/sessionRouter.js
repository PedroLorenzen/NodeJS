import { Router } from 'express';

const router = Router();

/* Bruges ikke da user allerede er sat i authRouter login
router.post('/session/setuser', (req, res) => {
    const { user } = req.body;
    if (user) {
        req.session.user = user;
        res.send({ message: `Session for ${user} initialized.` });
        console.log(`Session for ${user} initialized.`)
    } else {
        res.status(400).send({ message: "No user provided." });
    }
});*/

router.get('/session/getuser', (req, res) => {
    if (req.session.user) {
        res.send({ user: req.session.user });
        console.log(`Session for userID ${req.session.user.id} retrieved.`);
    } else {
        res.status(404).send({ message: "No session found." });
        console.log("No session found.");
    }
});

export default router;
