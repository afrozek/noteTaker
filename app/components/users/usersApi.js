module.exports = usersApi;

var User = require('./usersModel.js');
var jwt = require('jwt-simple');
var bcrypt = require('bcrypt-nodejs');




function usersApi (app, express) {
	var usersApi = express.Router();

// login
	usersApi.post('/login', function (req, res) {
		var email = req.body.email;
		var password = req.body.password;

		User.findOne({email: email}, function(err,user){
			if(err) throw err;

			if(!user) return res.status(401).send({message: "Email does not exist"})
			//if(!user) return res.send("Email does not exist")

			bcrypt.compare(password, user.password, function (err, isMatch){
				//if(err) throw err;

				if(isMatch) createSendToken(user, res);
				else return res.status(401).send({message: "Wrong Password"})
			})//end compare

		})//end find

		
	
	}); //end login

// authenticate user
	usersApi.post('/authorize', function (req, res) {

		//check for token
		if(!req.body.token){
			return res.status(401).send({
				message:'You are not authorized to view this page'
			})
		}

		//token present, decode token
		var token = req.body.token;
		var payload = jwt.decode(token, 'secret');

		//check token contents
		if(!payload.sub)
			return res.status(401).send({message:'Authentication Failed'})

		//everything checked out
		res.json({success: true, profile: payload});
	});

// get all users
	usersApi.get('/all', function (req, res) {

		if(!req.headers.authorization){
			return res.status(401).send({
				message:'You are not authorized to view this page'
			})
		}

		var token = req.headers.authorization;
		var payload = jwt.decode(token, 'secret');

		if(!payload.sub)
			return res.status(401).send({message:'Authentication Failed'})

		res.send("members content");
	});

// add a user
	usersApi.post('/newUser', function (req, res) {

	//get body data
		//gen info
		var form = {};
		//form.firstname = req.body.firstname;
		//form.lastname = req.body.lastname;
		form.email = req.body.email;
		

		//auth info
		//form.username = req.body.username;
		form.password = req.body.password;
		//form.role = "user";

		var newUser = new User({
			email: form.email,
			password: form.password,
			userLevel: "member"
		})

		
		newUser.save(function(err){
			if(err) return res.send("failed: " + err)
			createSendToken(newUser, res);
		})

	}); //end post addUser



// update a user
	usersApi.put('/update', function (req, res) {

			//get body data
			var form = {};
			form.username = req.body.username;
			form.updateField = req.body.updateField;
			form.updateValue = req.body.updateValue;

			
			
	}); //end put updateUser


//delete a user
	usersApi.delete('/delete', function (req, res) {

			//get body data
			var form = {};
			form.username = req.body.username;

			
			
	}); //end put deleteUser 


	return usersApi;
}

	function createSendToken (user, res, message) {

		var payload = {
			//iss: req.hostname,
			sub: user.id,
			email: user.email,
			userLevel: user.userLevel
		}

		var token = jwt.encode(payload, "secret");

		res.status(200).send({token: token, message: "Did somebody ask for a token?"});	

	}