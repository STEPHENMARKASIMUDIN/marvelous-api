let mysql = require('mysql'),
    connection = mysql.createPool({
        host: '192.168.0.0',
        user: 'test',
        password: '1234',
        database: 'db',
        pool: {
            "maxConnections": "5000",
            "maxIdleTime": "5000"
        },
        connectionLimit: 5000

    });
module.exports = connection;