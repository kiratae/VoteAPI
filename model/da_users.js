const config = require('../config/config.js')
const mysql = require('mysql')
const db = mysql.createConnection(config.mysql_connect)

var Users = {
    insert: (req, res) => {
        //grab the site section from the req variable (/strains/)
        //console.log(req) to see all the goodies
        let pathname = req._parsedUrl.pathname.split('/');
        //split makes an array, so pick the second row
        let section = pathname[1];

        //sql
        let sql = `INSERT INTO vt_users (us_username, us_password, us_ut_id) VALUES (?, ?, ?)`;

        let us_username = req.body.us_username;
        let us_password = req.body.us_password;
        let us_ut_id = req.body.us_ut_id;
        let data = [ us_username, us_password, us_ut_id ];

        console.log(`call: insert [us_username = ${us_username}]`);

        //query the DB using prepared statement
        db.query(sql, data, function(err, results, fields){
            if (err) {
                res.json({"error":err.message})
                return console.error(err.message)
            }
            // get inserted id
            console.log(`us_id: ${results.insertId}\n`)

            //sql
            let sql = `INSERT INTO vt_user_point_matching (um_us_id, um_points) VALUES (?, ?)`;

            let um_us_id = results.insertId;
            let um_points = req.body.um_points;
            let data = [ um_us_id, um_points ];

            console.log(`call: insert [um_points = ${um_points}]`);

            //query the DB using prepared statement
            db.query(sql, data, function(err, results, fields){
                if (err) {
                    return console.error(err.message)
                }
                // get inserted id
                console.log(`um_id: ${results.insertId}\n`)
                res.json({"um_id":results.insertId})
            })
        })

    },
    get_by_key: (req, res) => {
        //grab the site section from the req variable (/strains/)
        //console.log(req) to see all the goodies
        let pathname = req._parsedUrl.pathname.split('/');
        //split makes an array, so pick the second row
        let section = pathname[1];

        //sql
        let sql =  `SELECT us_id, us_username, us_lastlogin,
                        COALESCE(
                            um_points - (
                                SELECT COALESCE(SUM(vl_points), 0)
                                FROM vt_voting_logs
                                WHERE vl_us_id = us.us_id
                                GROUP BY vl_us_id
                            ), um_points) AS um_points
                    FROM vt_users us
                    LEFT JOIN vt_user_point_matching um ON um_us_id = us_id
                    WHERE us_id = ?`;
        
        let us_id = req.params.us_id;
        let data = [ us_id ]

        console.log(`Users -> call: get_by_key [ us_id = ${us_id} ]`);

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
    can_vote: (req, res) => {
       //grab the site section from the req variable (/strains/)
        //console.log(req) to see all the goodies
        let pathname = req._parsedUrl.pathname.split('/');
        //split makes an array, so pick the second row
        let section = pathname[1];

        //sql
        let sql =  `SELECT IF(IFNULL(um_points, (um_points - (SELECT SUM(vl_points) FROM vt_voting_logs WHERE vl_us_id = us.us_id GROUP BY vl_us_id))) - ? >= 0, true, false) AS can_vote
                    FROM vt_users us
                    LEFT JOIN vt_user_point_matching ON um_us_id = us_id
                    WHERE us_id = ?`;
        
        let us_id = req.body.us_id;
        let sc_score = req.body.sc_score;
        let data = [ sc_score, us_id ]

        console.log(`Users -> call: can_vote [ us_id = ${us_id} ]`);

        //query the DB using prepared statement
        var results = db.query(sql, data, function(err, results, fields){
            //if error, print blank results
            if (err) {
                console.log(err);
                res.json(err);    
            }
            //send JSON to Express
            res.json(results[0])
        })
    },
    update_login: (req, res) => {
        //grab the site section from the req variable (/strains/)
        //console.log(req) to see all the goodies
        let pathname = req._parsedUrl.pathname.split('/');
        //split makes an array, so pick the second row
        let section = pathname[1];

        //sql
        let sql = `UPDATE vt_users SET us_lastlogin = CURRENT_TIMESTAMP WHERE  us_id = ?`;

        let us_id = req.body.us_id;
        let data = [ us_id ]

        console.log(`call: update_login [us_id = ${us_id}]`);

        //query the DB using prepared statement
        db.query(sql, data, function(err){
            //if error, print blank results
            if (err) {
                console.log(err);
                res.json({"error":err});
            }

            res.end();
        })
        
    },
    delete: (req, res) => {
        //grab the site section from the req variable (/strains/)
        //console.log(req) to see all the goodies
        let pathname = req._parsedUrl.pathname.split('/');
        //split makes an array, so pick the second row
        let section = pathname[1];

        //sql
        let sql = `DELETE FROM vt_users WHERE us_id = ?`;

        let us_id = req.params.us_id;
        let data = [ us_id ]

        console.log(`call: delete [us_id = ${us_id}]`);

        //query the DB using prepared statement
        db.query(sql, data, function(err, results, fields){
            if (err) {
                return console.error(err.message)
            }
            //sql
            let sql = `DELETE FROM vt_user_point_matching WHERE um_us_id = ?`;

            let um_us_id = req.params.us_id;
            let data = [ um_us_id ];

            db.query(sql, data, function(err, results, fields){
                if (err) {
                    return console.error(err.message)
                }

                res.end();
            });
        })
    },
}

module.exports.Users = Users