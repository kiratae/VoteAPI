const config = require('../config/config.js')
const mysql = require('mysql')
const db = mysql.createConnection(config.mysql_connect)

var Cluster = {
    insert: (req, res) => {
        //grab the site section from the req variable (/strains/)
        //console.log(req) to see all the goodies
        let pathname = req._parsedUrl.pathname.split('/');
        //split makes an array, so pick the second row
        let section = pathname[1];

        //sql
        let sql = `INSERT INTO vt_cluster (ct_sequence, ct_name_th, ct_name_en, ct_img, ct_color_code) VALUES (?, ?, ?, ?, ?)`;

        let ct_sequence = req.body.ct_sequence;
        let ct_name_th = req.body.ct_name_th;
        let ct_name_en = req.body.ct_name_en;
        let ct_img = req.body.ct_img;
        let ct_color_code = req.body.ct_color_code;
        let data = [ ct_sequence, ct_name_th, ct_name_en, ct_img, ct_color_code ]

        console.log(`call: insert [ct_name_th = ${ct_name_th}]`);

        //query the DB using prepared statement
        db.query(sql, data, function(err, results, fields){
            if (err) {
                return console.error(err.message)
            }
            // get inserted id
            console.log(`ct_id: ${results.insertId}\n`)

            let sql = `INSERT INTO vt_system_matching (sm_ct_id, sm_sys_id) VALUES (?, ?)`;

            let sm_ct_id = results.insertId;
            let sm_sys_id = req.body.sm_sys_id;
            let data = [ sm_ct_id, sm_sys_id ]

            db.query(sql, data, function(err, results, fields){
                if (err) {
                    return console.error(err.message)
                }

                let sm_id = results.insertId;
                console.log(`sm_id: ${sm_id}\n`)

                let sql = `INSERT INTO vt_score (sc_ct_id) VALUES (?)`;

                let sc_ct_id = sm_ct_id;
                let data = [ sc_ct_id ]

                db.query(sql, data, function(err, results, fields){
                    if (err) {
                        return console.error(err.message)
                    }

                    console.log(`sc_id: ${results.insertId}\n`)

                    res.json({ 'sc_id':results.insertId, 'sm_ct_id': sm_ct_id, 'sm_id': sm_id })
                });

            });
            
        });

    },
    update: (req, res) => {
        //grab the site section from the req variable (/strains/)
        //console.log(req) to see all the goodies
        let pathname = req._parsedUrl.pathname.split('/');
        //split makes an array, so pick the second row
        let section = pathname[1];

        //sql
        let sql = `UPDATE vt_cluster
                    SET ct_sequence = ?,
                        ct_name_th = ?,
                        ct_name_en = ?,
                        ct_img = ?,
                        ct_color_code = ?
                    WHERE ct_id = ?`;

        let ct_id = req.body.ct_id;
        let ct_sequence = req.body.ct_sequence;
        let ct_name_th = req.body.ct_name_th;
        let ct_name_en = req.body.ct_name_en;
        let ct_img = req.body.ct_img;
        let ct_color_code = req.body.ct_color_code;
        let data = [ ct_sequence, ct_name_th, ct_name_en, ct_img, ct_color_code, ct_id ]

        console.log(`Cluster -> call: update [ct_id = ${ct_id}]`);

        //query the DB using prepared statement
        db.query(sql, data, function(err, results, fields){
            if (err) {
                return console.error(err.message)
            }

            res.json({ 'status':true })
            
        })
    },
    get_by_key: (req, res) => {
        //grab the site section from the req variable (/strains/)
        //console.log(req) to see all the goodies
        let pathname = req._parsedUrl.pathname.split('/');
        //split makes an array, so pick the second row
        let section = pathname[1];

        //sql
        let sql =  `SELECT ct_id, ct_name_th, ct_name_en, ct_img, ct_color_code, sys_name_th, sys_name_en
                    FROM vt_cluster
                    LEFT JOIN vt_system_matching ON sm_ct_id = ct_id
                    LEFT JOIN vt_systems ON sm_sys_id = sys_id
                    WHERE ct_id = ?`;
        
        let ct_id = req.params.ct_id;
        let data = [ ct_id ]

        console.log(`call: get_by_key [ ct_id = ${ct_id} ]`);

        //query the DB using prepared statement
        var results = db.query(sql, data, function(err, results, fields){
            //if error, print blank results
            if (err) {
                // console.log(err);
                var apiResult = {};
                
                apiResult.meta = {
                    table: section,
                    type: "collection",
                    total: 0
                }
                //create an empty data table
                apiResult.data = [];
                
                //send the results (apiResult) as JSON to Express (res)
                //Express uses res.json() to send JSON to client
                //you will see res.send() used for HTML
                res.json(apiResult);
                
            }

            //make results 
            var resultJson = JSON.stringify(results);
            resultJson = JSON.parse(resultJson);
            var apiResult = {}

            // create a meta table to help apps
            //do we have results? what section? etc
            apiResult.meta = {
                table: section,
                type: "collection",
                total: 1,
                total_entries: resultJson.length
            }

            //add our JSON results to the data table
            apiResult.data = resultJson;

            //send JSON to Express
            res.json(apiResult)
        })
    },
    delete: (req, res) => {
        //grab the site section from the req variable (/strains/)
        //console.log(req) to see all the goodies
        let pathname = req._parsedUrl.pathname.split('/');
        //split makes an array, so pick the second row
        let section = pathname[1];

        //sql
        let sql = `DELETE FROM vt_system_matching WHERE sm_ct_id = ?`;

        let sm_ct_id = req.params.ct_id;
        let data = [ sm_ct_id ]

        console.log(`call: delete vt_system_matching [sm_ct_id = ${sm_ct_id}]`);

        //query the DB using prepared statement
        db.query(sql, data, function(err, results, fields){
            if (err) {
                return console.error(err.message)
            }
            
            let sql = `DELETE FROM vt_score WHERE sc_ct_id = ?`;

            let ct_id = req.params.ct_id;
            let data = [ ct_id ]

            console.log(`call: delete vt_score [sc_ct_id = ${ct_id}]`);

            //query the DB using prepared statement
            db.query(sql, data, function(err, results, fields){
                if (err) {
                    return console.error(err.message)
                }

                let sql = `DELETE FROM vt_cluster WHERE ct_id = ?`;

                let ct_id = req.params.ct_id;
                let data = [ ct_id ]

                console.log(`call: delete vt_cluster [ct_id = ${ct_id}]`);

                //query the DB using prepared statement
                db.query(sql, data, function(err, results, fields){
                    if (err) {
                        return console.error(err.message)
                    }
                    res.end()
                });
            });
        });

    },
}

module.exports.Cluster = Cluster