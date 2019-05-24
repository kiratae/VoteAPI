const config = require('../../config/config.js')
const mysql = require('mysql')
const db = mysql.createConnection(config.mysql_connect)

var Log = {
    get_all: function(req, res){
        //grab the site section from the req variable (/strains/)
        //console.log(req) to see all the goodies
        let pathname = req._parsedUrl.pathname.split('/');
        //split makes an array, so pick the second row
        let section = pathname[1];

        //sql
        let sql =  `SELECT ct_name_th, ct_img, ct_color_code, se_name, se_details, se_values, sl_time_stamp
                    FROM scrum_logs
                    LEFT JOIN vt_cluster ON sl_ct_id = ct_id
                    LEFT JOIN scrum_events ON sl_se_id = se_id`;

        //console.log(`call: get_all [us_username = ${us_username}]`);

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
    get_all_by_cluster: function(req, res){
        //grab the site section from the req variable (/strains/)
        //console.log(req) to see all the goodies
        let pathname = req._parsedUrl.pathname.split('/');
        //split makes an array, so pick the second row
        let section = pathname[1];

        //sql
        let sql =  `SELECT ct_sequence,ct_name_th,"0" AS "Hour", ct_color_code,sl_time_stamp, (sc_money + IFNULL((SUM(se_values) ), 0)) AS total_money
                        FROM vt_score
                        LEFT JOIN vt_cluster ON sc_ct_id = ct_id
                            LEFT JOIN scrum_logs ON sl_ct_id = ct_id
                            LEFT JOIN scrum_events ON sl_se_id = se_id
                            WHERE sl_time_stamp BETWEEN FROM_UNIXTIME(0) AND FROM_UNIXTIME(UNIX_TIMESTAMP()-(?*0))
                            GROUP BY ct_id
                    UNION
                    SELECT ct_sequence,ct_name_th,"1" AS "Hour", ct_color_code,sl_time_stamp, (sc_money + IFNULL((SUM(se_values) ), 0)) AS total_money
                            FROM vt_score
                            LEFT JOIN vt_cluster ON sc_ct_id = ct_id
                            LEFT JOIN scrum_logs ON sl_ct_id = ct_id
                            LEFT JOIN scrum_events ON sl_se_id = se_id
                            WHERE sl_time_stamp BETWEEN FROM_UNIXTIME(0) AND FROM_UNIXTIME(UNIX_TIMESTAMP()-(?*1))
                            GROUP BY ct_id
                    UNION
                    SELECT ct_sequence,ct_name_th,"2" AS "Hour" ,ct_color_code,sl_time_stamp, (sc_money + IFNULL((SUM(se_values) ), 0)) AS total_money
                            FROM vt_score
                            LEFT JOIN vt_cluster ON sc_ct_id = ct_id
                            LEFT JOIN scrum_logs ON sl_ct_id = ct_id
                            LEFT JOIN scrum_events ON sl_se_id = se_id
                            WHERE sl_time_stamp BETWEEN FROM_UNIXTIME(0) AND FROM_UNIXTIME(UNIX_TIMESTAMP()-(?*2))
                            GROUP BY ct_id
                    UNION
                    SELECT ct_sequence,ct_name_th,"3" AS "Hour", ct_color_code,sl_time_stamp, (sc_money + IFNULL((SUM(se_values) ), 0)) AS total_money
                            FROM vt_score
                            LEFT JOIN vt_cluster ON sc_ct_id = ct_id
                            LEFT JOIN scrum_logs ON sl_ct_id = ct_id
                            LEFT JOIN scrum_events ON sl_se_id = se_id
                            WHERE sl_time_stamp BETWEEN FROM_UNIXTIME(0) AND FROM_UNIXTIME(UNIX_TIMESTAMP()-(?*3))
                            GROUP BY ct_id
                    UNION
                    SELECT ct_sequence,ct_name_th,"4" AS "Hour", ct_color_code,sl_time_stamp, (sc_money + IFNULL((SUM(se_values) ), 0)) AS total_money
                            FROM vt_score
                            LEFT JOIN vt_cluster ON sc_ct_id = ct_id
                            LEFT JOIN scrum_logs ON sl_ct_id = ct_id
                            LEFT JOIN scrum_events ON sl_se_id = se_id
                            WHERE sl_time_stamp BETWEEN FROM_UNIXTIME(0) AND FROM_UNIXTIME(UNIX_TIMESTAMP()-(?*4))
                            GROUP BY ct_id
                    UNION
                    SELECT ct_sequence,ct_name_th,"5" AS "Hour", ct_color_code,sl_time_stamp, (sc_money + IFNULL((SUM(se_values) ), 0)) AS total_money
                            FROM vt_score
                            LEFT JOIN vt_cluster ON sc_ct_id = ct_id
                            LEFT JOIN scrum_logs ON sl_ct_id = ct_id
                            LEFT JOIN scrum_events ON sl_se_id = se_id
                            WHERE sl_time_stamp BETWEEN FROM_UNIXTIME(0) AND FROM_UNIXTIME(UNIX_TIMESTAMP()-(?*5))
                            GROUP BY ct_id
                    ORDER by HOUR DESC`;

        //console.log(`call: get_all [us_username = ${us_username}]`);

        let time = req.body.time;
        let data = [ time, time, time, time, time, time ]

        //query the DB using prepared statement
        var results = db.query(sql, data,function(err, results, fields){
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
    get_all_by_cluster_now: function(req, res){
        //grab the site section from the req variable (/strains/)
        //console.log(req) to see all the goodies
        let pathname = req._parsedUrl.pathname.split('/');
        //split makes an array, so pick the second row
        let section = pathname[1];

        //sql
        let sql =  `SELECT ct_sequence,ct_name_th,"0" AS "Hour", ct_color_code,sl_time_stamp, (sc_money + IFNULL((SUM(se_values) ), 0)) AS total_money
                        FROM vt_score
                        LEFT JOIN vt_cluster ON sc_ct_id = ct_id
                            LEFT JOIN scrum_logs ON sl_ct_id = ct_id
                            LEFT JOIN scrum_events ON sl_se_id = se_id
                            WHERE sl_time_stamp BETWEEN FROM_UNIXTIME(0) AND FROM_UNIXTIME(UNIX_TIMESTAMP()-(3600*0))
                            GROUP BY ct_id`;

        //console.log(`call: get_all [us_username = ${us_username}]`);

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
    get_all_income_by_cluster_now: function(req, res){
        //grab the site section from the req variable (/strains/)
        //console.log(req) to see all the goodies
        let pathname = req._parsedUrl.pathname.split('/');
        //split makes an array, so pick the second row
        let section = pathname[1];

        //sql
        let sql =  `SELECT ct_sequence,ct_name_th,"0" AS "Hour", ct_color_code,sl_time_stamp, (sc_money + IFNULL((SUM(se_values) ), 0)) AS total_money
                    FROM vt_score
                    LEFT JOIN vt_cluster ON sc_ct_id = ct_id
                    LEFT JOIN scrum_logs ON sl_ct_id = ct_id
                    LEFT JOIN scrum_events ON sl_se_id = se_id
                    WHERE sl_time_stamp BETWEEN FROM_UNIXTIME(0) AND FROM_UNIXTIME(UNIX_TIMESTAMP()-(3600*0))
                    AND se_values >= 0
                    GROUP BY ct_id`;

        //console.log(`call: get_all [us_username = ${us_username}]`);

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
    get_all_outcome_by_cluster_now: function(req, res){
        //grab the site section from the req variable (/strains/)
        //console.log(req) to see all the goodies
        let pathname = req._parsedUrl.pathname.split('/');
        //split makes an array, so pick the second row
        let section = pathname[1];

        //sql
        let sql =  `SELECT ct_sequence,ct_name_th,"0" AS "Hour", ct_color_code,sl_time_stamp, (sc_money + IFNULL((SUM(se_values * -1) ), 0)) AS total_money
                    FROM vt_score
                    LEFT JOIN vt_cluster ON sc_ct_id = ct_id
                    LEFT JOIN scrum_logs ON sl_ct_id = ct_id
                    LEFT JOIN scrum_events ON sl_se_id = se_id
                    WHERE sl_time_stamp BETWEEN FROM_UNIXTIME(0) AND FROM_UNIXTIME(UNIX_TIMESTAMP()-(3600*0))
                    AND se_values < 0
                    GROUP BY ct_id`;

        //console.log(`call: get_all [us_username = ${us_username}]`);

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

module.exports.Log = Log