const config = require('../config/config.js')
const mysql = require('mysql')
const my_model = require('./my_model');
const md5 = require('md5');
const db = mysql.createConnection(config.mysql_connect)

var Score = {
    insert: (req, res) => {
        //grab the site section from the req variable (/strains/)
        let pathname = req._parsedUrl.pathname.split('/');
        //split makes an array, so pick the second row
        let section = pathname[1];

        //sql
        let sql = `INSERT INTO vt_users (us_username, us_password, us_ut_id) VALUES (?, ?, ?)`;

        let us_username = req.body.us_username;
        let us_password = req.body.us_password;
        let us_ut_id = req.body.us_ut_id;
        let data = [ us_username, us_password, us_ut_id ]

        console.log(`call: insert [us_username = ${us_username}]`);

        //query the DB using prepared statement
        db.query(sql, data, function(err, results, fields){
            //if error, print error results
            if (err) {
                console.log(err);
                res.json({"error": err});
            }
            // get inserted id
            console.log(`us_id: ${results.insertId}\n`)
            res.json({cht_id:results.insertId})
        })

    },
    get_by_key: (req, res) => {
        //grab the site section from the req variable (/strains/)
        let pathname = req._parsedUrl.pathname.split('/');
        //split makes an array, so pick the second row
        let section = pathname[1];

        //sql
        let sql =  `SELECT us_id, us_username, us_lastlogin, um_points
                    FROM vt_users
                    LEFT JOIN vt_user_point_matching
                    ON um_us_id = us_id
                    WHERE  us_id = ?`;
        
        let us_id = req.params.us_id;
        let data = [ us_id ]

        console.log(`call: get_by_key`);

        //query the DB using prepared statement
        var results = db.query(sql, data, function(err, results, fields){
            //if error, print error results
            if (err) {
                console.log(err);
                res.json({"error": err});
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
    update: (req, res) => {
        //grab the site section from the req variable (/strains/)
        //console.log(req) to see all the goodies
        let pathname = req._parsedUrl.pathname.split('/');
        //split makes an array, so pick the second row
        let section = pathname[1];

        //check Hash
        if(md5("l3ear@Hunt;") == req.body.hash){
            //sql
            let sql = `UPDATE vt_score SET sc_score = sc_score + ? WHERE sc_ct_id = ?`;

            let us_id = req.body.us_id;
            let sc_score = req.body.sc_score;
            let sc_ct_id = req.body.ct_id;
            let data = [ sc_score, sc_ct_id ]

            console.log(`call: update [sc_ct_id = ${sc_ct_id}]`);

            //query the DB using prepared statement
            db.query(sql, data, function(err){
                //if error, print error results
                if (err) {
                    console.log(err);
                    res.json({"error": err});
                }

                // my_model.da_user_point_matching.UserPointMatching.vote(req, res);

                res.json({"status":true});
            });

        }else{
            res.end();
        }
        
    },
    restore: (req, res) => {
        //sql
        let sql = `SELECT sc_score FROM vt_score WHERE sc_id = ?`;

        let sc_id = req.body.sc_id;
        let sc_score = req.body.sc_score;
        let data = [ sc_id ];

        db.query(sql, data, function(err, results){
            //if error, print error results
            if (err) {
                console.log(err);
                res.json({"error": err});
            }

            let score = results[0]['sc_score'];

            if(sc_score - score >= 0){

                let sql = `UPDATE vt_score SET sc_score = sc_score - ? WHERE sc_id = ?`;

                let sc_id = req.body.sc_id;
                let sc_score = req.body.sc_score;
                let data = [ sc_score, sc_id ];
        
                console.log(`Score -> call: restore [sc_id = ${sc_id}, sc_score = ${sc_score}]`);
        
                //query the DB using prepared statement
                db.query(sql, data, function(err){
                    //if error, print error results
                    if (err) {
                        console.log(err);
                        res.json({"error": err});
                    }
        
                    res.json({"status": true});
        
                    // my_model.da_voting_logs.VotingLogs.delete(req, res);
                });

            }else{

                res.json({"status": false});

            }

        });
    },
    reset_all: (req, res) => {
        //sql
        let sql = `UPDATE vt_score SET sc_score = 0`;

        console.log(`Score -> call: reset_all`);

        //query the DB using prepared statement
        db.query(sql, function(err){
            //if error, print error results
            if (err) {
                console.log(err);
                res.json({"error": err});
            }

            res.json({"reset":true});
        });
    },
    delete: (req, res) => {

    },
}

module.exports.Score = Score