import { Router } from "express";
const router = Router();

const jobsList = [
    { id: 1, title: "Software Developer", description: "Develop cutting-edge software solutions.", user: "John Doe", location: "New York", price: 100 },
    { id: 2, title: "Product Manager", description: "Manage product development process.", user: "Jane Doe", location: "San Francisco", price: 200 },
    { id: 3, title: "Project Manager", description: "Manage project execution.", user: "Alice Doe", location: "Los Angeles", price: 300 },
    { id: 4, title: "Software Engineer", description: "Develop software applications.", user: "Bob Doe", location: "Chicago", price: 400 },
    { id: 5, title: "Data Analyst", description: "Analyze data to provide insights.", user: "Eve Doe", location: "Boston", price: 500 }
];

router.get("/api/jobs", (req, res) => {
    res.send({ data: jobsList });
});

export default router;
