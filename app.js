require('dotenv').config();
const mysql2 = require('mysql2');

// Create MySQL connection
const connection = mysql2.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql'
});

// Handle connection errors
connection.on('error', (err) => {
    console.error('MySQL connection error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('Database connection was closed.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
        console.log('Database has too many connections.');
    }
    if (err.code === 'ECONNREFUSED') {
        console.log('Database connection was refused.');
    }
});

// Graceful shutdown
process.on('SIGINT', () => {
    connection.end((err) => {
        if (err) {
            console.error('Error closing MySQL connection:', err);
        } else {
            console.log('MySQL connection closed gracefully.');
        }
        process.exit(0);
    });
});

module.exports = connection;

