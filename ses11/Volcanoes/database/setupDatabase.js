import db from './connection.js';

const deleteMode = process.argv.includes('--delete');
console.log(process.argv); 

if (deleteMode) {
    db.exec(`DROP TABLE IF EXISTS Villages`);
    db.exec(`DROP TABLE IF EXISTS Volcanoes`);
}

db.exec(`
CREATE TABLE IF NOT EXISTS Volcanoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    isActive BOOLEAN,
    location VARCHAR(255),
    type TEXT CHECK(type IN ('pointy', 'flat', 'underwater', 'supervolcano'))
);
`);

db.exec(`
CREATE TABLE IF NOT EXISTS Villages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    volcano_id INTEGER,
    FOREIGN KEY (volcano_id) REFERENCES Volcanoes(id)
);
`);

if (deleteMode) {
    db.run(`INSERT INTO Villages (name, volcano_id) VALUES ('Hakone', 1)`);
    db.run(`INSERT INTO Villages (name, volcano_id) VALUES ('Fujinomiya', 1)`);
    db.run(`INSERT INTO Volcanoes (name, location, type) VALUES ('Mount St. Helens', 'USA', 'pointy')`);
    db.run(`INSERT INTO Volcanoes (name, location, type) VALUES ('Krakatoa', 'Indonesia', 'underwater')`);
}