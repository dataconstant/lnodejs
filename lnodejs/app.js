var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require("mongoose");
var bodyparser = require("body-parser")


var app = express();



app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost/loginapp");

var userSchema = new mongoose.Schema({
  uname:String,
  pword:String
});

var User = mongoose.model("User",userSchema);

app.post('/add_user', function(req, res){

  User.create({
    uname:req.body.username,
    pword:req.body.password
  },function (err) {
    if(err){
      res.send(err)
    }
    else res.redirect("/")
  })
});

app.post('/check_user', function(req, res){
   var uname = req.body.username;
   var pword = req.body.password;

   User.findOne({uname:uname,pword:pword},function (err,user) {
     if (user!=null && uname.localeCompare(user.uname)==0 && pword.localeCompare(user.pword)==0 ){
       console.log("Logged In")
       res.render("dashboard",{username:uname})
     }
     else {
       res.redirect("/")
       console.log("Failed")
     }
   });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'views')));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/dashboard', (req, res) => {
  res.render('dashboard');
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
