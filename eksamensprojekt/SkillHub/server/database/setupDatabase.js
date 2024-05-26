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
            { _id: "userId", sequence_value: 10 },
            { _id: "jobId", sequence_value: 50 },
            { _id: "skillId", sequence_value: 15 },
            { _id: "chatId", sequence_value: 3 }
        ];

        await countersCollection.insertMany(initialCounters);
        console.log("Initial counters inserted");

        const usersCollection = db.collection("users");
        await usersCollection.deleteMany({});
        await usersCollection.createIndex({ location: 1 });

        const initialUsers = [
            { _id: 1, name: "Chris Johnson", email: "chris@johnson.dk", password: "$2a$12$eIxxyzAG76X21UfZpQtBR.EGPiu.dzczlHhOFNrEPNyTHeCoURVYO", location: "vejle", isAdmin: true },
            { _id: 2, name: "Jens Hansen", email: "jens@hansen.dk", password: "$2a$12$eIxxyzAG76X21UfZpQtBR.EGPiu.dzczlHhOFNrEPNyTHeCoURVYO", location: "holte", isAdmin: false},
            { _id: 3, name: "Alice Doe", email: "alice@doe.dk", password: "$2a$12$eIxxyzAG76X21UfZpQtBR.EGPiu.dzczlHhOFNrEPNyTHeCoURVYO", location: "københavn", isAdmin: false},
            { _id: 4, name: "Sophie Nielsen", email: "sophie@nielsen.dk", password: "$2a$12$eIxxyzAG76X21UfZpQtBR.EGPiu.dzczlHhOFNrEPNyTHeCoURVYO", location: "roskilde", isAdmin: false },
            { _id: 5, name: "Lars Løkke", email: "lars@løkke.dk", password: "$2a$12$eIxxyzAG76X21UfZpQtBR.EGPiu.dzczlHhOFNrEPNyTHeCoURVYO", location: "vejle", isAdmin: false },
            { _id: 6, name: "Emma Rasmussen", email: "emma@rasmussen.dk", password: "$2a$12$eIxxyzAG76X21UfZpQtBR.EGPiu.dzczlHhOFNrEPNyTHeCoURVYO", location: "københavn", isAdmin: false },
            { _id: 7, name: "Ole Christensen", email: "ole@christensen.dk", password: "$2a$12$eIxxyzAG76X21UfZpQtBR.EGPiu.dzczlHhOFNrEPNyTHeCoURVYO", location: "holte", isAdmin: false },
            { _id: 8, name: "Ida Madsen", email: "ida@madsen.dk", password: "$2a$12$eIxxyzAG76X21UfZpQtBR.EGPiu.dzczlHhOFNrEPNyTHeCoURVYO", location: "odense", isAdmin: false },
            { _id: 9, name: "Thomas Kjeldsen", email: "thomas@kjeldsen.dk", password: "$2a$12$eIxxyzAG76X21UfZpQtBR.EGPiu.dzczlHhOFNrEPNyTHeCoURVYO", location: "vejle", isAdmin: false },
            { _id: 10, name: "Marie Sørensen", email: "marie@sørensen.dk", password: "$2a$12$eIxxyzAG76X21UfZpQtBR.EGPiu.dzczlHhOFNrEPNyTHeCoURVYO", location: "roskilde", isAdmin: false }
        ];
        await usersCollection.insertMany(initialUsers);
        console.log("Initial users inserted");

        const skillsCollection = db.collection("skills");
        await skillsCollection.deleteMany({});
        await skillsCollection.createIndex({ name: 1 }, { unique: true });

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
            { _id: 9, name: "Expert in car repair", skill_id: 9, description: "If you need help with your car repair, I am the right person to help you", price: 120, user_id: 3 },
            { _id: 10, name: "Web Developer", skill_id: 10, description: "Expertise in developing scalable web applications", price: 130, user_id: 4 },
            { _id: 11, name: "JavaScript Developer", skill_id: 11, description: "Skilled in JavaScript and its frameworks", price: 140, user_id: 4 },
            { _id: 12, name: "Frontend Developer", skill_id: 12, description: "Specializes in frontend technologies", price: 150, user_id: 5 },
            { _id: 13, name: "Backend Developer", skill_id: 13, description: "Efficient in server-side languages", price: 160, user_id: 5 },
            { _id: 14, name: "Full Stack Developer", skill_id: 14, description: "Capable of handling both front and back end", price: 170, user_id: 6 },
            { _id: 15, name: "Node.js Developer", skill_id: 15, description: "Expert in Node.js environments", price: 180, user_id: 6 },
            { _id: 16, name: "React Developer", skill_id: 1, description: "Expert in React and state management libraries", price: 190, user_id: 7 },
            { _id: 17, name: "Angular Developer", skill_id: 2, description: "Specializes in Angular and TypeScript", price: 200, user_id: 7 },
            { _id: 18, name: "Vue.js Developer", skill_id: 3, description: "Experienced with Vue.js and Vuex", price: 210, user_id: 8 },
            { _id: 19, name: "UI/UX Designer", skill_id: 4, description: "Skills in UI/UX design for modern web applications", price: 220, user_id: 8 },
            { _id: 20, name: "JavaScript Tester", skill_id: 5, description: "Expertise in automated and manual testing of JavaScript apps", price: 230, user_id: 9 },
            { _id: 21, name: "Webpack Specialist", skill_id: 6, description: "Skilled in bundling JavaScript apps using Webpack", price: 240, user_id: 9 },
            { _id: 22, name: "Babel Expert", skill_id: 7, description: "Proficient in JavaScript transpiling with Babel", price: 250, user_id: 10 },
            { _id: 23, name: "NPM Package Developer", skill_id: 8, description: "Develops and maintains NPM packages", price: 260, user_id: 10 },
            { _id: 24, name: "ES6 Specialist", skill_id: 9, description: "Expert in ECMAScript 2016 (ES6) and newer specifications", price: 270, user_id: 4 },
            { _id: 25, name: "TypeScript Developer", skill_id: 10, description: "Expertise in TypeScript development for robust applications", price: 280, user_id: 4 },
            { _id: 26, name: "GraphQL Developer", skill_id: 11, description: "Skilled in creating and using GraphQL APIs", price: 290, user_id: 5 },
            { _id: 27, name: "Mobile JavaScript Developer", skill_id: 12, description: "Develops mobile applications using React Native or similar frameworks", price: 300, user_id: 5 },
            { _id: 28, name: "Electron Developer", skill_id: 13, description: "Creates desktop applications using Electron", price: 310, user_id: 6 },
            { _id: 29, name: "Next.js Developer", skill_id: 14, description: "Specializes in server-side rendered applications with Next.js", price: 320, user_id: 6 },
            { _id: 30, name: "Express.js Developer", skill_id: 15, description: "Expert in backend development with Express.js", price: 330, user_id: 7 }
        ];
        await jobsCollection.insertMany(initialJobs);
        console.log("Initial jobs inserted");

        const chatsCollection = db.collection("chats");
        await chatsCollection.deleteMany({});
        await chatsCollection.createIndex({ user_ids: 1 });

        const initialChats = [
            {
                _id: 1,
                user_ids: [1, 2],
                messages: [
                    { user_id: 1, text: "How are you?", timestamp: new Date() },
                    { user_id: 2, text: "I'm good, thanks! How about you?", timestamp: new Date() },
                    { user_id: 1, text: "I'm doing well, thank you!", timestamp: new Date() }
                ]
            },
            {
                _id: 2,
                user_ids: [1, 3],
                messages: [
                    { user_id: 1, text: "What are you doing?", timestamp: new Date() },
                    { user_id: 3, text: "Just working on a project.", timestamp: new Date() }
                ]
            },
            {
                _id: 3,
                user_ids: [2, 3],
                messages: [
                    { user_id: 2, text: "Hey, are you free this weekend?", timestamp: new Date() },
                    { user_id: 3, text: "Yes, I am. What do you have in mind?", timestamp: new Date() }
                ]
            }
        ];
        await chatsCollection.insertMany(initialChats);
        console.log("Initial chats inserted");

        console.log("Database setup complete");
    } catch (error) {
        console.error("Error setting up database:", error);
    } finally {
        await disconnect();
    }
};

setupDatabase();