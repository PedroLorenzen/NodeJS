import { Router } from "express";
const router = Router();

router.get("/api/users", (req, res) => {
    res.send({ data: req.session.userName });
});

router.post("/api/users", (req, res) => {
    req.session.userName = req.body.name;
    res.send({ data: `Welcome ${req.session.userName}!` });
});

/*
router.get("/api/customers", (req, res) => {
    res.send({ data: req.session.customerName });
});

router.post("/api/customers", (req, res) => {
    req.session.customerName = req.body.name;
    res.send({ data: `Welcome ${req.session.customerName}!` });
});
*/

export default router;
