const config = require('../config/config.js')
const mysql = require('mysql')
const db = mysql.createConnection(config.mysql_connect)

var VoteTime = {
    get_all: (req, res) => {
        //grab the site section from the req variable (/strains/)
        //console.log(req) to see all the goodies
        let pathname = req._parsedUrl.pathname.split('/');
        //split makes an array, so pick the second row
        let section = pathname[1];

        //sql
        let sql =  `SELECT *
                    FROM vt_vote_time`;

        console.log(`Cluster -> call: get_all`);

        //query the DB using prepared statement
        var results = db.query(sql, function(err, results, fields){
            //if error, print blank results
            if (err) {
                console.log(err);
                res.json({"error":err});
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


module.exports.VoteTime = VoteTime