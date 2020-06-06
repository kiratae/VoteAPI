#!/usr/bin/env node
//require dependencies
const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const port = 80;
const my_model = require('./model/my_model');

const fs = require('fs')
const { promisify } = require('util')

const unlinkAsync = promisify(fs.unlink)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(express.static(__dirname + '/public'))

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

//start Express server on defined port
app.listen(port);

// Storage file
var Storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "./public/images/cluster");
    },
    filename: function(req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});
var upload = multer({ storage: Storage }).single('ct_img'); //Field name and max count

//define a route, usually this would be a bunch of routes imported from another file
app.get('/', function (req, res, next) {
    res.send('Welcome to the BearHunt, Inc. API');
});

//log to console to let us know it's working
console.log('BearHunt, Inc. API server started on: ' + port);

app.post('/users/login' , my_model.m_users.Users.check_login)
app.post('/users/check' , my_model.da_users.Users.can_vote)
app.put('/users/logged_in' , my_model.da_users.Users.update_login)
app.get('/users/logs/:us_id' , my_model.m_users.Users.get_logs)

app.get('/users' , my_model.m_users.Users.get_all)
app.get('/users/:us_id' , my_model.da_users.Users.get_by_key)
app.post('/users' , my_model.da_users.Users.insert)
app.delete('/users/:us_id' , my_model.da_users.Users.delete)

app.get('/user_type' , my_model.m_user_type.UserType.get_all)
app.get('/user_type/:ut_id' , my_model.da_user_type.UserType.get_by_key)
app.post('/user_type' , my_model.da_user_type.UserType.insert)
app.put('/user_type' , my_model.da_user_type.UserType.update)
app.delete('/user_type/:ut_id' , my_model.da_user_type.UserType.delete)

app.get('/cluster' , my_model.m_cluster.Cluster.get_all)
app.get('/cluster/dashboard' , my_model.m_cluster.Cluster.get_all_dashboard)
app.get('/cluster/leaderboard' , my_model.m_cluster.Cluster.get_all_leaderboard)

app.get('/cluster/:ct_id' , my_model.da_cluster.Cluster.get_by_key)
app.post('/cluster' , my_model.da_cluster.Cluster.insert)
app.put('/cluster' , my_model.da_cluster.Cluster.update)
app.delete('/cluster/:ct_id' , my_model.da_cluster.Cluster.delete)

app.get('/systems' , my_model.m_systems.Systems.get_all)
app.post('/systems' , my_model.da_systems.Systems.insert)
app.put('/systems' , my_model.da_systems.Systems.update)
app.delete('/systems/:sys_id' , my_model.da_systems.Systems.delete)

// app.post('/add_score' , my_model.da_score.Score.update)
// app.post('/minus_score' , my_model.da_user_point_matching.UserPointMatching.vote)
app.post('/log' , my_model.da_voting_logs.VotingLogs.insert)

app.post('/restore_um' , my_model.da_user_point_matching.UserPointMatching.restore)
app.post('/restore_sc' , my_model.da_score.Score.restore)
app.post('/restore_vl' , my_model.da_voting_logs.VotingLogs.delete)

app.get('/score' , my_model.m_score.Score.get_score)
app.put('/score' , my_model.da_user_point_matching.UserPointMatching.update)
app.get('/resetScore' , my_model.da_score.Score.reset_all)

app.get('/vote_time' , my_model.m_vote_time.VoteTime.get_all)
app.put('/vote_time' , my_model.da_vote_time.VoteTime.update)

// ------------- START scrum -------------------------

app.post('/scrum/all_money' , my_model.m_log.Log.get_all_by_cluster)
app.get('/scrum/all_money_now' , my_model.m_log.Log.get_all_by_cluster_now)
app.get('/scrum/all_income_money_now' , my_model.m_log.Log.get_all_income_by_cluster_now)
app.get('/scrum/all_outcome_money_now' , my_model.m_log.Log.get_all_outcome_by_cluster_now)
app.post('/scrum/find_event' , my_model.m_event.Event.get_find_by_name)
app.post('/scrum/history' , my_model.m_event.Event.get_event_log)

app.get('/scrum/logs' , my_model.m_log.Log.get_all)
app.post('/scrum/logs' , my_model.da_log.Log.insert)

app.get('/scrum/events' , my_model.m_event.Event.get_all)
app.get('/scrum/events/:se_id' , my_model.da_event.Event.get_by_key)
app.post('/scrum/events' , my_model.da_event.Event.insert)
app.put('/scrum/events' , my_model.da_event.Event.update)


// ------------- END scrum ---------------------------

app.post("/api/Upload", (req, res) => {

    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            console.log("A Multer error occurred when uploading.");
        } else if (err) {
            console.log("An unknown error occurred when uploading.");
            // An unknown error occurred when uploading.
        }

        sharp(req.file.path)
            .resize(64,64)
            .toBuffer(function (err,info) {

            console.log("resizing image to 64x64 pixel.");
            fs.writeFile("./public/images/cluster/"+req.file.filename, info, (err) => {
                if (err) throw err;
                console.log('The file has been saved!');
            });

            console.log("uploaded file: "+req.file.filename);

            res.send(req.file);
        })

    });

});
app.post("/api/deleteImage",(req, res) => {

    unlinkAsync("./public/images/cluster/"+req.body.filename)

    res.json({"status":1})
});

app.get("/timesync",(req, res) => {

    const config = require('./config/config.js')
    const mysql = require('mysql')
    const db = mysql.createConnection(config.mysql_connect)

    //sql
    let sql =  `SELECT NOW() AS now`;


    var results = db.query(sql, function(err, results){
        //if error, print blank results
        if (err) {
            console.log(err);
            res.json({"error":err});
        }

        console.log(results);

        res.json(results)
    })

    
});
