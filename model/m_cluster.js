const config = require('../config/config.js')
const mysql = require('mysql')
const db = mysql.createConnection(config.mysql_connect)

var Cluster = {
    get_all: (req, res) => {
        //grab the site section from the req variable (/strains/)
        //console.log(req) to see all the goodies
        let pathname = req._parsedUrl.pathname.split('/');
        //split makes an array, so pick the second row
        let section = pathname[1];

        //sql
        let sql =  `SELECT ct_id, ct_sequence, ct_name_th, ct_name_en, ct_img, ct_color_code, sys_id, sys_name_th, sys_name_en
                    FROM vt_cluster
                    LEFT JOIN vt_system_matching ON sm_ct_id = ct_id
                    LEFT JOIN vt_systems ON sm_sys_id = sys_id
                    LEFT JOIN vt_score ON sc_ct_id = ct_id
                    ORDER BY ct_sequence ASC`;

        console.log(`call: get_all`);

        //query the DB using prepared statement
        var results = db.query(sql, function(err, results, fields){
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
    get_all_dashboard: (req, res) => {
        //grab the site section from the req variable (/strains/)
        //console.log(req) to see all the goodies
        let pathname = req._parsedUrl.pathname.split('/');
        //split makes an array, so pick the second row
        let section = pathname[1];

        //sql
        let sql =  `SELECT ct_id, ct_sequence, ct_name_th, ct_name_en, ct_img, ct_color_code, sys_id, sys_name_th, sys_name_en,
                    (
                        SELECT (sc_money + IFNULL((SUM(se_values) ), 0)) AS total_money
                        FROM vt_score
                        LEFT JOIN vt_cluster ON sc_ct_id = ct_id
                        LEFT JOIN scrum_logs ON sl_ct_id = ct_id
                        LEFT JOIN scrum_events ON sl_se_id = se_id
                        WHERE sl_ct_id = ct.ct_id
                        GROUP BY sl_ct_id
                    ) AS total_money
                    FROM vt_cluster AS ct
                    LEFT JOIN vt_system_matching ON sm_ct_id = ct_id
                    LEFT JOIN vt_systems ON sm_sys_id = sys_id
                    LEFT JOIN vt_score ON sc_ct_id = ct_id
                    ORDER BY ct_sequence ASC`;

        console.log(`call: get_all`);

        //query the DB using prepared statement
        var results = db.query(sql, function(err, results, fields){
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
    get_all_leaderboard: (req, res) => {
        //grab the site section from the req variable (/strains/)
        //console.log(req) to see all the goodies
        let pathname = req._parsedUrl.pathname.split('/');
        //split makes an array, so pick the second row
        let section = pathname[1];

        //sql
        let sql =  `SELECT ct_id, ct_sequence, ct_name_th, ct_name_en, ct_img, ct_color_code, sys_id, sys_name_th, sys_name_en,
                    (
                        SELECT (sc_money + IFNULL((SUM(se_values) ), 0)) AS total_money
                        FROM vt_score
                        LEFT JOIN vt_cluster ON sc_ct_id = ct_id
                        LEFT JOIN scrum_logs ON sl_ct_id = ct_id
                        LEFT JOIN scrum_events ON sl_se_id = se_id
                        WHERE sl_ct_id = ct.ct_id
                        GROUP BY sl_ct_id
                    ) AS total_money
                    FROM vt_cluster AS ct
                    LEFT JOIN vt_system_matching ON sm_ct_id = ct_id
                    LEFT JOIN vt_systems ON sm_sys_id = sys_id
                    LEFT JOIN vt_score ON sc_ct_id = ct_id
                    ORDER BY total_money DESC`;

        console.log(`call: get_all`);

        //query the DB using prepared statement
        var results = db.query(sql, function(err, results, fields){
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
    }
}


module.exports.Cluster = Cluster