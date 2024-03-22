import { Router } from "express";
const contactRouter = Router();

contactRouter.post("/api/contact", (req, res) => {
    console.log(toString(req.body));
    res.send("Contact form submitted");
});

export default contactRouter;