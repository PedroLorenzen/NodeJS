import { homepagePage, matchesPage, contactPage } from "../util/readPages.js";
import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.send(homepagePage);
});

router.get("/matches", (req, res) => {
    res.send(matchesPage);
});

router.get("/contact", (req, res) => {
    res.send(contactPage);
});


export default router;