const config = require('../config/config.js')
const mysql = require('mysql')
const db = mysql.createConnection(config.mysql_connect)

const name = "Users";

var Users = {
    get_all: (req, res) => {
        //grab the site section from the req variable (/strains/)
        let pathname = req._parsedUrl.pathname.split('/');
        //split makes an array, so pick the second row
        let section = pathname[1];

        //sql
        let sql = `SELECT us_id, us_username, ut_name_th, ut_name_en,
                        COALESCE(
                            um_points - (
                                SELECT COALESCE(SUM(vl_points), 0)
                                FROM vt_voting_logs
                                WHERE vl_us_id = us.us_id
                                GROUP BY vl_us_id
                            ), um_points) AS um_points
                    FROM vt_users us
                    LEFT JOIN vt_user_point_matching ON um_us_id = us_id
                    LEFT JOIN vt_user_type ON us_ut_id = ut_id`;

        console.log(`Users -> call: get_all`);

        //query the DB using prepared statement
        var results = db.query(sql, function (err, results, fields) {
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
    check_login: async (req, res) => {

        //grab the site section from the req variable (/strains/)
        let pathname = req._parsedUrl.pathname.split('/');
        //split makes an array, so pick the second row
        let section = pathname[1];

        //sql
        let sql = `SELECT us_id, ut_name_th, ut_name_en, IF(COUNT(us_id) = 1,'true','false') AS canLogin
            FROM vt_users
            LEFT JOIN vt_user_type ON ut_id = us_ut_id
            WHERE us_username = ? AND us_password = ?`;

        let us_username = req.body.us_username;
        let us_password = req.body.us_password;
        let data = [us_username, us_password];

        console.log(`Users -> call: check_login [us_username = ${us_username}]`);

        //query the DB using prepared statement
        var results = db.query(sql, data, function (err, results, fields) {
            //if error, print blank results
            if (err) {
                console.log(err);
                res.json({ "error": err });
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
        });
    },
    get_logs: (req, res) => {

        //grab the site section from the req variable (/strains/)
        let pathname = req._parsedUrl.pathname.split('/');
        //split makes an array, so pick the second row
        let section = pathname[1];

        //sql
        let sql = `SELECT vl_id, ct_id, vl_us_id, ct_name_th, ct_name_en, vl_timestamp, SUM(vl_points) AS voted_score
                    FROM vt_voting_logs
                    LEFT JOIN vt_cluster ON vl_ct_id = ct_id
                    WHERE vl_us_id = ?`;

        let us_id = req.params.us_id;
        let data = [us_id];

        console.log(`Users -> call: get_logs [us_id = ${us_id}]`);

        //query the DB using prepared statement
        var results = db.query(sql, data, function (err, results, fields) {
            //if error, print blank results
            if (err) {
                console.log(err);
                res.json({ "error": err });
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

module.exports.Users = Users