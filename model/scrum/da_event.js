const config = require('../../config/config.js')
const mysql = require('mysql')
const db = mysql.createConnection(config.mysql_connect)

var Event = {
    insert: (req, res) => {
        //sql
        let sql = `INSERT INTO scrum_events (se_name, se_details, se_values) VALUES (?, ?, ?)`;

        let se_name = req.body.se_name;
        let se_details = req.body.se_details;
        let se_values = req.body.se_values;
        let data = [ se_name, se_details, se_values ]

        console.log(`[scrum] Event -> call: insert [se_name = ${se_name}]`);

        //query the DB using prepared statement
        db.query(sql, data, function(err, results, fields){
            if (err) {
                return console.error(err.message)
            }
            // get inserted id
            console.log(`se_id: ${results.insertId}\n`)

            res.json({ 'se_id':results.insertId })

        });
    },
    update: (req, res) => {

        //sql
        let sql = `UPDATE scrum_events
                    SET se_name = ?,
                        se_details = ?,
                        se_values = ?
                    WHERE se_id = ?`;

        let se_id = req.body.se_id;
        let se_name = req.body.se_name;
        let se_details = req.body.se_details;
        let se_values = req.body.se_values;
        let data = [ se_name, se_details, se_values, se_id ]

        console.log(`[scrum] Event -> call: update [se_id = ${se_id}]`);

        //query the DB using prepared statement
        db.query(sql, data, function(err, results, fields){
            if (err) {
                return console.error(err.message)
            }

            res.json({ 'status':true })
            
        })
    },
    get_by_key: (req, res) => {
        //sql
        let sql =  `SELECT *
                    FROM scrum_events
                    WHERE se_id = ?`;
        
        let se_id = req.params.se_id;
        let data = [ se_id ]

        console.log(`[scrum] Event -> call: get_by_key [ se_id = ${se_id} ]`);

        //query the DB using prepared statement
        db.query(sql, data, function(err, results, fields){
            if (err) {
                console.log(err);
                res.json({ 'error':err })
            }

            res.json(results)
        })
    }
}

module.exports.Event = Event