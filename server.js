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

db.connect(function(err) {
    //if (err) throw err;
    console.log("Connected!");
    db.query("CREATE DATABASE IF NOT EXISTS users", function (err, result) {
      //if (err) throw err;
      //console.log("Database created");
    });
  });

db.connect(function(err) {
    //if (err) throw err;
    console.log("Connected!");
    var sql = "CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, nickname VARCHAR(255), password VARCHAR(255), email VARCHAR(255), age VARCHAR(255))";
    db.query(sql, function (err, result) {
        //if (err) throw err;
        //console.log("Table created");
    });
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
            //if (err) throw err;
            console.log(result);
            if(result.length === 0) {
                res.send('This login is not registered');
            } else if(result.length > 0) {
                res.send( {text: 'You are logged in', nickname: nickname });
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
            //if (err) throw err;
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

app.get('/', function(req, res){
    res.sendFile(__dirname + '/chat.html');
});

users = [];
connections = [];

io.sockets.on('connection', function(socket){
    connections.push(socket);
    console.log(socket);

    socket.on('disconnect', function(data) {
        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets connected', connections.length);
    });

    socket.on('send message', function(data) {
        //console.log(users, connections)
        // console.log(data, '2');
        io.emit('new message', {msg: data, user: socket.username});
    });
    //New User
    socket.on('new user', function(data) {
        socket.username = data;
        users.push(socket.username);
        console.log(data, users, '3')
        updateUsernames();
    });

    function updateUsernames() {
        io.sockets.emit('get users', users);
    }
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});