const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgres://postgres:meha2006@localhost:5432/postgres',
});

async function createDB() {
  try {
    console.log("Connecting to default postgres database...");
    await pool.query('CREATE DATABASE gatepass');
    console.log("Database 'gatepass' created successfully!");
  } catch (err) {
    if (err.code === '42P04') {
      console.log("Database 'gatepass' already exists.");
    } else {
      console.error("Error creating database:", err);
    }
  } finally {
    await pool.end();
  }
}

createDB();
