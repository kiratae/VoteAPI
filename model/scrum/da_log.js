const config = require('../../config/config.js')
const mysql = require('mysql')
const db = mysql.createConnection(config.mysql_connect)

var Log = {
    insert: (req, res) => {
        //sql
        let sql = `INSERT INTO scrum_logs (sl_ct_id, sl_se_id) VALUES (?, ?)`;

        let sl_ct_id = req.body.sl_ct_id;
        let sl_se_id = req.body.sl_se_id;
        let data = [ sl_ct_id, sl_se_id ]

        console.log(`[scrum] Event -> call: insert [sl_ct_id = ${sl_ct_id}, sl_se_id = ${sl_se_id}]`);

        //query the DB using prepared statement
        db.query(sql, data, function(err, results, fields){
            if (err) {
                return console.error(err.message)
            }
            // get inserted id
            console.log(`sl_id: ${results.insertId}\n`)

            res.json({ 'sl_id':results.insertId })

        });

    }
}

module.exports.Log = Log