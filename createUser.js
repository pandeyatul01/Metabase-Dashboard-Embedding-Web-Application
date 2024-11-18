const bcrypt = require('bcrypt');
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root', // Replace with your MySQL password
    database: 'metabase_auth',
    port: 3306
});

const username = 'staff';
const password = 'staff'; // Replace with the desired password

bcrypt.hash(password, 10, (err, hash) => {
    if (err) throw err;
    db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], (err, results) => {
        if (err) throw err;
        console.log('User created successfully');
        db.end();
    });
});
