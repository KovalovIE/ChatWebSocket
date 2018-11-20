var express = require("express");
var app = express();
var http = require('http').Server(app);
var mysql = require('mysql');
var bodyParser = require("body-parser");
//var path = require('path');
var io = require('socket.io')(http);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + "/public"));

var db = mysql.createConnection({
    host: "localhost",
    user: "mysql",
    password: "mysql",
    database: "users"
});

app.post("/login", function (req, res) {
    // console.log(req.body);
    let obj = {
        nickname: req.body.nickname,
        password: req.body.password
    };

    db.connect(function(err) {
        let nickname = obj.nickname;
        let password = obj.password;
        let sql = 'SELECT * FROM users WHERE nickname = ? and password = ?';
        db.query(sql, [nickname, password], function (err, result) {
            if (err) throw err;
            console.log(result);
            if(result.length === 0) {
                res.send('This login is not registered');
            } else if(result.length > 0) {
                res.send('You are logged in');
            }
        });
        var sql1 = 'SELECT * FROM users WHERE nickname = ? OR password = ?';
        db.query(sql1, [nickname, password], function (err, result) {
            if (err) throw err;
            console.log(result);
        });
    });
});

app.post("/registration", function (req, res) {
    // console.log(req.body);
    let obj = {
        nickname: req.body.nickname,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        email: req.body.email,
        age: req.body.age
    };

    if (obj.password === obj.confirmPassword) {
        db.connect(function(err) {
            if (err) throw err;
            var sql = "INSERT INTO users (nickname, password, email, age) VALUES ?";
            var values = [
                [obj.nickname, obj.password, obj.email, obj.age]
            ];
            db.query(sql, [values], function (err, result) {
              if (err) throw err;
              console.log("Add new user");
              res.send('Congratulations, after 5 seconds you are redirected to the login page.');
            });
        });
    } else if (obj.password !== obj.confirmPassword) {
        res.send('Passwords do not match');
    }
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});