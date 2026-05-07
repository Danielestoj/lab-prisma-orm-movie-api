// src/config/db.js
const { Pool } = require('pg')
//
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  //database: process.env.DB_NAME || 'peliculas_db',
  //user: process.env.DB_USER || 'postgres',
  //password: process.env.DB_PASSWORD,
  //configuración para tests
  database: process.env.NODE_ENV === 'test'
    ? process.env.DB_TEST_NAME
    : process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  //
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
})


module.exports = pool