import { Router } from "express";
const router = Router();

const jobsList = [
    { id: 1, title: "Software Developer", description: "Develop cutting-edge software solutions." },
    // other jobs
];

router.get("/api/jobs", (req, res) => {
    res.send({ data: jobsList });
});

/*
const eclipseMovies = [
    { id: 1, title: "Sun in a net", director: "Stefan Uher", year: 1963 },
    { id: 2, title: "L'eclisse", director: "Michelangelo Antonioni", year: 1962 },
];

router.get("/api/movies", (req, res) => {
    res.send({ data: eclipseMovies });
});
*/

export default router;
