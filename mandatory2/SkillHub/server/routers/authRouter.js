import { Router } from 'express';
import bcrypt from 'bcrypt';

const router = Router();
const users = [];

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(password, salt);
};

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await hashPassword(password);

    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(409).send({ message: "User already exists" });
    }

    const newUser = {
        id: users.length + 1,
        username,
        password: hashedPassword
    };

    users.push(newUser);
    res.status(201).send({ message: "User registered successfully", userId: newUser.id });
    console.log(newUser);
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username);

    if (!user) {
        return res.status(404).send({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
        req.session.userId = user.id;
        res.send({ message: "Logged in successfully" });
    } else {
        res.status(401).send({ message: "Invalid credentials" });
    }
});

export default router;
