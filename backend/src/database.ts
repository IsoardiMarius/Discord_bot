const mysql = require('mysql2');

export const database = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            database: process.env.DB_DATABASE,
        });

// Connect to the database
database.connect(
    (err) => {
        if (err) {
            console.log('Error connecting to Db');
            return;
        }
        else console.log('Connection established to the database ' + process.env.DB_DATABASE + ' on ' + process.env.DB_HOST + ' as ' + process.env.DB_USER + '.');
    }
);

module.exports = database;


