// server/db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // stored in your .env
  ssl: {
    rejectUnauthorized: false // required for Render.com
  }
});

module.exports = pool;
