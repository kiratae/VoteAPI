const mysql_connect = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'vote_database'
}

const connectionString = 'postgresql://Kiratae:1150@localhost:51361/vote_db';

exports.mysql_connect = mysql_connect
exports.postgresql_connect = connectionString