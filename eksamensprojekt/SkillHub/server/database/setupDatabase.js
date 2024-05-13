import db from './connection.js';

const deleteMode = process.argv.includes('--delete');
console.log(process.argv);

async function setupDatabase() {
    try {
        if (deleteMode) {
            await db.exec(`DROP TABLE IF EXISTS Jobs`);
            await db.exec(`DROP TABLE IF EXISTS Users`);
        }

        await db.exec(`
            CREATE TABLE IF NOT EXISTS Users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                password TEXT NOT NULL,
                location VARCHAR(255)
            );
        `);

        await db.exec(`
            CREATE TABLE IF NOT EXISTS Jobs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(255) NOT NULL,
                skill TEXT CHECK(skill IN ('Painting', 'IT-support', 'Drywall', 'Roofing', 'Plumbing', 'Electrical', 'Carpentry', 'Masonry', 'Gardening', 'Car repair', 'Cleaning', 'Cooking', 'Childcare', 'Petcare', 'Tutoring', 'Personal training')) NOT NULL,
                description TEXT NOT NULL,
                price INTEGER NOT NULL,
                user_id INTEGER,
                FOREIGN KEY (user_id) REFERENCES Users(id)
            );
        `);

        if (deleteMode) {
            // Alle dummy user passwords er 123
            await db.run(`INSERT INTO Users (name, email, password, location) VALUES ('John Doe', 'john@doe.dk', '$2a$12$eIxxyzAG76X21UfZpQtBR.EGPiu.dzczlHhOFNrEPNyTHeCoURVYO', 'Vejle')`);
            await db.run(`INSERT INTO Users (name, email, password, location) VALUES ('Jane Doe', 'jane@doe.dk', '$2a$12$eIxxyzAG76X21UfZpQtBR.EGPiu.dzczlHhOFNrEPNyTHeCoURVYO', 'Vejle')`);
            await db.run(`INSERT INTO Users (name, email, password, location) VALUES ('Alice Doe', 'alice@doe.dk', '$2a$12$eIxxyzAG76X21UfZpQtBR.EGPiu.dzczlHhOFNrEPNyTHeCoURVYO', 'Vejle')`);
            await db.run(`INSERT INTO Jobs (name, skill, description, price, user_id) VALUES ('Expert in painting houses', 'Painting', 'If you want a person with 10 years of painting experience then I will be the right fit for you', 30, 1)`);
            await db.run(`INSERT INTO Jobs (name, skill, description, price, user_id) VALUES ('Expert in IT-support', 'IT-support', 'If you need help with your computer, I am the right person to help you', 50, 1)`);
            await db.run(`INSERT INTO Jobs (name, skill, description, price, user_id) VALUES ('Expert in roofing', 'Roofing', 'If you need help with your roof, please contact me I am very good', 70, 1)`);
            await db.run(`INSERT INTO Jobs (name, skill, description, price, user_id) VALUES ('Expert in plumbing', 'Plumbing', 'If you need help with your plumbing, I am the right person to help you', 60, 2)`);
            await db.run(`INSERT INTO Jobs (name, skill, description, price, user_id) VALUES ('Expert in electrical', 'Electrical', 'If you need help with your electrical installations, I am the right person to help you', 80, 2)`);
            await db.run(`INSERT INTO Jobs (name, skill, description, price, user_id) VALUES ('Expert in carpentry', 'Carpentry', 'If you need help with your carpentry, I am the right person to help you', 90, 2)`);
            await db.run(`INSERT INTO Jobs (name, skill, description, price, user_id) VALUES ('Expert in masonry', 'Masonry', 'If you need help with your masonry, I am the right person to help you', 100, 3)`);
            await db.run(`INSERT INTO Jobs (name, skill, description, price, user_id) VALUES ('Expert in gardening', 'Gardening', 'If you need help with your gardening, I am the right person to help you', 110, 3)`);
            await db.run(`INSERT INTO Jobs (name, skill, description, price, user_id) VALUES ('Expert in car repair', 'Car repair', 'If you need help with your car repair, I am the right person to help you', 120, 3)`);
            
        }
    }
    catch (error) {
        console.log('An error occurred while running setupDatase.js:', error);
    }
}

setupDatabase();

// node ./database/setupDatabase.js --delete