import { Router } from "express";
const contactRouter = Router();

contactRouter.post("/api/contact", (req, res) => {
    console.log("Contact form submitted", req.body);
    res.send("Contact form submitted");
});
// console.log giver mig: Contact form submitted { name: 'Anders', email: 'chri@gmail.com', message: 'asdjasdkl' }
export default contactRouter;