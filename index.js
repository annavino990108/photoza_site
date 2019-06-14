const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt-nodejs');
const bodyParser = require('body-parser');
const hbs = require("hbs");
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const Schema = mongoose.Schema;
const app = express();
const config = require('./config/app');
const routes = require('./routes');
const models = require('./models');

mongoose.connect(config.connectDB, {
  useNewUrlParser: true,
  useFindAndModify: true,
  useCreateIndex: true
}, function(err){
    if(err) return console.log(err);
    app.listen(config.port, function(){
        console.log("Сервер ожидает подключения...");
    });
});

app.use(
  session({
    secret: config.SESSION_SECRET,
    resave:true,
    saveUninitialized:false,
    store:new MongoStore({
      mongooseConnection:mongoose.connection
    })
  })
);

hbs.registerHelper('if_equal', function(a, opts) {
    if (a == global.user_id) {
        return opts.fn(this)
    } else {
        return opts.inverse(this)
    }
});
hbs.registerHelper('if_user', function(a, b, opts) {
    if (a == b) {
        return opts.fn(this)
    } else {
        return opts.inverse(this)
    }
});

app.set("view engine", "hbs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/public', express.static('public'));
app.use('/uploads', express.static('uploads'));
hbs.registerPartials(__dirname + "/views/blocks");

app.get("/", function(req, res){
  const session_user = (req.session.userId);
  models.File.find().sort({_id:-1}).limit(12).find((err, file)=>{
    models.User.find({role:"photographer"}).sort({rating:1}).limit(3).find((err,user)=>{
          res.render("home.hbs",{session_user,file,user});
    });
  });
});

app.get("/redactor",(req, res)=>{
  const session_user = (req.session.userId);
  models.File.find({user:session_user}).sort({ $natural: -1 }).limit(1).find(function(err, file){
    console.log(file);
    res.render("redactor_image.hbs",{session_user,file});
  });
});

app.use('/site',routes.site);
app.use('/api',routes.auth);
app.use('/api',routes.user);
app.use('/api',routes.geo);

app.use(function(req, res, next){
  res.status(404);
    res.render("error.hbs");
});
