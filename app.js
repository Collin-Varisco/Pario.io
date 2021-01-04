"use strict";
var createError = require("http-errors");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var ejs = require('ejs');
var mongodb = require("mongodb");
const { config } = require("process");


var express = require('express');
//make sure you keep this order
var app = express();
var server = require("http").Server(app);
var io = require('socket.io')(server);

//... 

server.listen(65080);

var router = express.Router();
app.set("views", "./views");


io.on("connection", (socket) => {
  socket.on("load-users", () => {
    mongodb.MongoClient.connect('mongodb://localhost', function (err, client) {
      if (err) throw err;
      var db = client.db('Pario');
      db.collection('users').find({}).toArray(function(err, result){
        if(err) throw err;
        console.log(result);
        io.emit("display-users", result); 
        client.close();
      })
    });
    });

  socket.on("get-comments", (post_ID) => {
    var ObjectId = require('mongodb').ObjectId;
    mongodb.MongoClient.connect('mongodb://localhost', function(err, client) {
      if(err) throw err;
      var db = client.db('Pario');

      db.collection('Posts').find({Parent_Comment_ID:post_ID}).toArray(function(err, result){
        if(err) throw err;
        io.emit("display-comments", result);
        client.close();
      });
    });
  });

  socket.on("get_parent_name", (id) => {


      var ObjectId = require('mongodb').ObjectId;
      mongodb.MongoClient.connect('mongodb://localhost', function (err, client) {
        if (err) throw err;
        var db = client.db('Pario');

        db.collection('Posts').findOne({_id:ObjectId(id)}, function(err, result){
          if(err) throw err;
          console.log(result.Post_Content + " | " + result.Author); 
          io.emit("receive_parent_name", result); 
          client.close();
        });
         
      });
  })

  socket.on("load-posts", () => {
    mongodb.MongoClient.connect('mongodb://localhost', function (err, client) {
      if (err) throw err;
      var db = client.db('Pario');

      db.collection('Posts').find({Post_Content:{"$exists":true, "$ne":""}},{Parent_Comment_ID:""}).toArray(function(err, result){
        if(err) throw err;
        io.emit("display-posts", result);
        client.close();
      });
    });
  });
  /* formArray
  [0] = textArea value
  [1] = username
  [2] = month
  [3] = day
  [4] = year
  [5] = hour
  [6] = minute
  [7] = AM/PM
  */
    socket.on("post-button", (formArray) => {
      mongodb.MongoClient.connect('mongodb://localhost', function (err, client) {
        if (err) throw err;
        var db = client.db('Pario');
        db.collection('Posts').insertOne(
            {"Post_Content": formArray[0], "Author": formArray[1], "Month": formArray[2], "Day": formArray[3], "Year": formArray[4], "Hour": formArray[5], "Minute": formArray[6], "AM_PM": formArray[7], "Comments": "", "Users_Comments": "", "Parent_Comment_ID": formArray[8]}
        ); 

        db.collection('Posts').find({}).toArray(function(err, result){
          if(err) throw err;
          io.emit("display-posts", result); 
          client.close();
        });
         
      });
      

    });


    socket.on("comment-page", (post_ID) => {
      var ObjectId = require('mongodb').ObjectId;
      mongodb.MongoClient.connect('mongodb://localhost', function (err, client) {
        if (err) throw err;
        var db = client.db('Pario');

        db.collection('Posts').findOne({_id:ObjectId(post_ID)}, function(err, result){
          if(err) throw err;
          console.log(result.Post_Content + " | " + result.Author); 
          client.close();
        });
         
      });
    });

    socket.on("update-comments", (parent_ID) => {

      mongodb.MongoClient.connect('mongodb://localhost', function (err, client) {
        if(err) throw err;
        var db = client.db('Pario');
        db.collection('Posts').find({Parent_Comment_ID:parent_ID}).toArray(function(err, result){
          if(err) throw err;
          io.emit('display-comments', (result)); 
          client.close();
        });
      });

      var ObjectId = require('mongodb').ObjectId;
      mongodb.MongoClient.connect('mongodb://localhost', function (err, client) {
        if (err) throw err;
        var db = client.db('Pario');

        db.collection('Posts').findOne({_id:ObjectId(parent_ID)}, function(err, result){
          if(err) throw err;
          io.emit('Focused-Post', (result));
          client.close();
        });
      });
    });

    socket.on("post-comment", (formArray) => {
      var ObjectId = require('mongodb').ObjectId;
      mongodb.MongoClient.connect('mongodb://localhost', function (err, client) {

        if (err) throw err;
        var db = client.db('Pario');
        db.collection('Posts').insertOne(
            {"Post_Content": formArray[0], "Author": formArray[1], "Month": formArray[2], "Day": formArray[3], "Year": formArray[4], "Hour": formArray[5], "Minute": formArray[6], "AM_PM": formArray[7], "Comments": "", "Users_Comments": "", "Parent_Comment_ID": formArray[8]}
        ); 


        db.collection('Posts').find({Parent_Comment_ID:formArray[8]}).toArray(function(err, result){
          if(err) throw err;
          io.emit('display-comments', (result)); 
          client.close();
        });
         
      });
    })
});
// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
// use res.render to load up an ejs view file

app.get('/index', function(req, res){
  res.render("index.ejs");
});

app.get('/comments', function(req, res){
  res.render("comments.ejs");
});


app.get('/:comments', function(req, res){
  res.render("comments.ejs");
});


// index page
app.get('/', function(req, res) {
    res.render("index");
});

// about page
app.get('/about', function(req, res) {
    res.render('pages/about');
});


module.exports = app;
