const config = require('../config/config.js');
const mysql = require('mysql');
const my_model = require('./my_model');
const md5 = require('md5');
const db = mysql.createConnection(config.mysql_connect);

var UserPointMatching = {
    insert: (req, res) => {
        // to do insert to db
    },
    get_by_key: (req, res) => {
        // to do get_by_key from db
    },
    update: (req, res) => {
        //sql
        let sql = `UPDATE vt_user_point_matching SET um_points = ? WHERE um_us_id = ?`;

        let us_id = req.body.us_id;
        let sc_score = req.body.sc_score;
        let data = [ sc_score, us_id ]

        console.log(`UserPointMatching -> call: update [us_id = ${us_id}]`);

        //query the DB using prepared statement
        db.query(sql, data, function(err){
            //if error, print error results
            if (err) {
                console.log(err);
                res.json({"error": err});
            }

            res.end();
        }) 
    },
    vote: (req, res) => {
        //check Hash
        if(md5("l3ear@Hunt;") == req.body.hash){

            let us_id = req.body.us_id;
            let data = [ us_id ]

            let sql = `SELECT um_points FROM vt_user_point_matching WHERE um_us_id = ?`;

            db.query(sql, data, function(err, results){
                //if error, print error results
                if (err) {
                    console.log(err);
                    res.json({"error": err});
                }

                let hasPoint = results[0]['um_points'];
                console.log(hasPoint);

                let scoreToVote = req.body.sc_score;

                if(hasPoint - scoreToVote >= 0){
                    //sql
                    let sql = `UPDATE vt_user_point_matching SET um_points = um_points - ? WHERE um_us_id = ?`;

                    let us_id = req.body.us_id;
                    let sc_score = req.body.sc_score;
                    let data = [ sc_score, us_id ]

                    console.log(`UserPointMatching -> call: vote [us_id = ${us_id}]`);

                    //query the DB using prepared statement
                    db.query(sql, data, function(err){
                        //if error, print error results
                        if (err) {
                            console.log(err);
                            res.json({"error": err});
                        }

                        // my_model.da_voting_logs.VotingLogs.insert(req, res);

                        res.json({ "status":true });
                    });
                }else{
                    res.json({ "status":false });
                }
                
            });

        }else{
            res.end();
        }
    
    },
    restore: (req, res) => {
        //sql
        let sql = `UPDATE vt_user_point_matching SET um_points = um_points + ? WHERE um_us_id = ?`;

        let us_id = req.body.us_id;
        let sc_score = req.body.sc_score;
        let data = [ sc_score, us_id ];

        console.log(`UserPointMatching -> call: restore [us_id = ${us_id}, sc_score = ${sc_score}]`);

        //query the DB using prepared statement
        db.query(sql, data, function(err){
            //if error, print error results
            if (err) {
                console.log(err);
                res.json({"error": err});
            }

            res.json({"status": true});

            //my_model.da_score.Score.restore(req, res);
        });
    
    },
    delete: (req, res) => {
        // to do delete from db
    },
}

module.exports.UserPointMatching = UserPointMatching