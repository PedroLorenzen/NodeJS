import { connect, disconnect } from "./connection.js";

const deleteMode = process.argv.includes("--delete");
console.log(process.argv);

async function setupDatabase() {
    try {
        const db = await connect();

        if (deleteMode) {
            const collections = await db.collections();
            for (let collection of collections) {
                await collection.drop();
                console.log(`Dropped collection: ${collection.collectionName}`);
            }
        }

        const countersCollection = db.collection("counters");
        await countersCollection.deleteMany({});

        const initialCounters = [
        { _id: "userId", sequence_value: 3 },
        { _id: "jobId", sequence_value: 9 },
        { _id: "skillId", sequence_value: 9}
        ];

        await countersCollection.insertMany(initialCounters);
        console.log("Initial counters inserted");

        const usersCollection = db.collection("users");
        await usersCollection.deleteMany({});
        await usersCollection.createIndex({ location: 1 });

        const initialUsers = [
            { _id: 1, name: "Chris Johnson", email: "chris@johnson.dk", password: "$2a$12$eIxxyzAG76X21UfZpQtBR.EGPiu.dzczlHhOFNrEPNyTHeCoURVYO", location: "Vejle" },
            { _id: 2, name: "Jens Hansen", email: "jens@hansen.dk", password: "$2a$12$eIxxyzAG76X21UfZpQtBR.EGPiu.dzczlHhOFNrEPNyTHeCoURVYO", location: "Holte" },
            { _id: 3, name: "Alice Doe", email: "alice@doe.dk", password: "$2a$12$eIxxyzAG76X21UfZpQtBR.EGPiu.dzczlHhOFNrEPNyTHeCoURVYO", location: "København" }
        ];
        await usersCollection.insertMany(initialUsers);
        console.log("Initial users inserted");

        const skillsCollection = db.collection("skills");
        await skillsCollection.deleteMany({});

        const initialSkills = [
            { _id: 1, name: "Painting" },
            { _id: 2, name: "IT-support" },
            { _id: 3, name: "Roofing" },
            { _id: 4, name: "Plumbing" },
            { _id: 5, name: "Electrical" },
            { _id: 6, name: "Carpentry" },
            { _id: 7, name: "Masonry" },
            { _id: 8, name: "Gardening" },
            { _id: 9, name: "Car repair" },
            { _id: 10, name: "Cleaning" },
            { _id: 11, name: "Cooking" },
            { _id: 12, name: "Babysitting" },
            { _id: 13, name: "Dog walking" },
            { _id: 14, name: "Personal training" },
            { _id: 15, name: "Moving" }
        ];

        await skillsCollection.insertMany(initialSkills);
        console.log("Initial skills inserted");

        const jobsCollection = db.collection("jobs");
        await jobsCollection.deleteMany({});
        await jobsCollection.createIndex({ skill_id: 1, price: 1 });

        const initialJobs = [
            { _id: 1, name: "Expert in painting houses", skill_id: 1, description: "If you want a person with 10 years of painting experience then I will be the right fit for you", price: 30, user_id: 1 },
            { _id: 2, name: "Expert in IT-support", skill_id: 2, description: "If you need help with your computer, I am the right person to help you", price: 50, user_id: 1 },
            { _id: 3, name: "Expert in roofing", skill_id: 3, description: "If you need help with your roof, please contact me I am very good", price: 70, user_id: 1 },
            { _id: 4, name: "Expert in plumbing", skill_id: 4, description: "If you need help with your plumbing, I am the right person to help you", price: 60, user_id: 2 },
            { _id: 5, name: "Expert in electrical", skill_id: 5, description: "If you need help with your electrical installations, I am the right person to help you", price: 80, user_id: 2 },
            { _id: 6, name: "Expert in carpentry", skill_id: 6, description: "If you need help with your carpentry, I am the right person to help you", price: 90, user_id: 2 },
            { _id: 7, name: "Expert in masonry", skill_id: 7, description: "If you need help with your masonry, I am the right person to help you", price: 100, user_id: 3 },
            { _id: 8, name: "Expert in gardening", skill_id: 8, description: "If you need help with your gardening, I am the right person to help you", price: 110, user_id: 3 },
            { _id: 9, name: "Expert in car repair", skill_id: 9, description: "If you need help with your car repair, I am the right person to help you", price: 120, user_id: 3 }
        ];
        await jobsCollection.insertMany(initialJobs);
        console.log("Initial jobs inserted");

        console.log("Database setup complete");
    } catch (error) {
        console.error("Error setting up database:", error);
    } finally {
        await disconnect();
    }
};

setupDatabase();