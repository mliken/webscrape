var express = require('express');
var app = express();

var port = process.env.PORT || 8042;
var mongoose = require('mongoose');

var path = require('path');
app.use(express.static(path.join(__dirname,"/public/")));

var morgan = require('morgan');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


/***************Mongodb configuration********************/
var mongoose = require('mongoose');
var configDB = require('./config/database.js');
//configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database


//view engine setup
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");


// routes ======================================================================
var routes = require("./controllers/controllers.js");
app.use("/", routes);

//launch ======================================================================
var PORT = process.env.PORT || 8080;
app.listen(process.env.PORT || 8080, function(){
	console.log("App listening on PORT" + PORT);
}

//catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.status(404).render('404', {title: "Sorry, page not found", session: req.sessionbo});
});

app.use(function (req, res, next) {
    res.status(500).render('404', {title: "Sorry, page not found"});
});
exports = module.exports = app;