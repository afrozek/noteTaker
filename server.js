
//==============================================================
// BASE SETUP
//==============================================================

// CALL PACKAGES-----------------------------------------------
	var express = require('express'); // call epxress
	var app = express(); // define app
	var bodyParser = require('body-parser'); // reads post contents
	var morgan = require('morgan'); // logs all requests to console
	var mongoose = require('mongoose'); //ORM 
	var path = require('path');
	//var port = 3000;
//CONFIG IMPORT
	//var config = require('./config');

	
	
//==============================================================
// APP CONFIG
//==============================================================
	// use bodyparser to grab info from POST requests
	app.use(bodyParser.urlencoded({extended:true}));
	app.use(bodyParser.json());

	// handle CORS requests(cross origin resource sharing)
	app.use(function(req,res,next){
		res.setHeader('Access-Control-Allow-Origin','*');
		res.setHeader('Access-Control-Allow-Methods','GET,POST');
		res.setHeader('Access-Control-Allow-Headers','X-Requested-With,content-type,Authorization');
		next();
	});

// log all requests to console
	app.use(morgan('dev'));


// DB CONNECT
	//mongoose.connect(config.database);
	// mongoose.connect("mongodb://localhost:27017/notekeeper");

//STATIC FILE LOCATIONS
app.use(express.static(__dirname + '/public'));


//==============================================================
// ROUTES FOR API
//==============================================================

//API ROUTES
var usersApi = require('./app/components/users/usersApi')(app,express);
app.use('/api/users',usersApi);

var notesApi = require('./app/components/notes/notesApi')(app,express);
app.use('/api/notes',notesApi);

//CATCHALL : sends all routes not defined to front end
//MUST BE REGISTERED AFTER API ROUTES ABOVE^^
app.get('/',function(req,res){
	res.sendFile(path.join(__dirname + '/public/index.html'));
});



//SERVER START
//===============================


// app.listen(port)
// console.log('Something bout to go down on port: ' + port);

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
 
app.listen(server_port, server_ip_address, function () {
  console.log( "Listening on " + server_ip_address + ", server_port " + server_port )
});







