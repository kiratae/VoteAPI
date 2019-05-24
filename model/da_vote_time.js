const config = require('../config/config.js')
const mysql = require('mysql')
const db = mysql.createConnection(config.mysql_connect)

var VoteTime = {
    update: (req, res) => {
        //grab the site section from the req variable (/strains/)
        //console.log(req) to see all the goodies
        let pathname = req._parsedUrl.pathname.split('/');
        //split makes an array, so pick the second row
        let section = pathname[1];

        //sql
        let sql = `UPDATE vt_vote_time
                    SET vt_start_vote = ?,
                        vt_end_vote = ?
                    WHERE vt_id = 1`;

        let vt_start_vote = req.body.vt_start_vote;
        let vt_end_vote = req.body.vt_end_vote;
        let data = [ vt_start_vote, vt_end_vote ]

        console.log(`call: update [vt_vote_time]`);

        //query the DB using prepared statement
        db.query(sql, data, function(err, results, fields){
            if (err) {
                return console.error(err.message)
            }

            res.json({ 'status':true })
            
        })
    }
}

module.exports.VoteTime = VoteTime