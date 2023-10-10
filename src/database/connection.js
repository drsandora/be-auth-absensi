const {
  CONNECTION
} = require("../config");

const pgp = require('pg-promise')();

const db = pgp(CONNECTION);

module.exports = db;


// SQL query to create the schema

const createTableQuery1 = `
    CREATE TABLE IF NOT EXISTS loginpemakai_k (
    loginpemakai_id SERIAL PRIMARY KEY,
    pegawai_id INT,
    username VARCHAR(255),
    password VARCHAR(255),
    temp_token VARCHAR(255),
    role_id VARCHAR(255)
    );
`;


async function createSchema() {
  try {
    await db.connect();
    await db.query(createTableQuery1);
    console.log('Schema created successfully.');
  } catch (error) {
    console.error('Error creating schema:', error);
  } 
}

createSchema();
