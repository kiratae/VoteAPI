const config = require('../config/config.js')
const mysql = require('mysql')
const db = mysql.createConnection(config.mysql_connect)

var Score = {
    get_score: (req, res)=>{
        //grab the site section from the req variable (/strains/)
        //console.log(req) to see all the goodies
        let pathname = req._parsedUrl.pathname.split('/');
        //split makes an array, so pick the second row
        let section = pathname[1];

        //sql
        let sql =  `SELECT ct_name_th, ct_color_code, ct_img, SUM(vl_points) as sc_score
                    FROM vt_cluster
                    LEFT JOIN vt_voting_logs ON vl_ct_id = ct_id
                    GROUP BY ct_id
                    ORDER BY ct_sequence`;

        console.log(`call: get_score`);

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

module.exports.Score = Score