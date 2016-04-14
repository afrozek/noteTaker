module.exports = notesApi;

var Note = require('./notesModel.js');
//var User = require('./usersModel.js');
var jwt = require('jwt-simple');
var bcrypt = require('bcrypt-nodejs');
var ObjectId = require('mongodb').ObjectID;




function notesApi (app, express) {
	var notesApi = express.Router();


// get all notes
	notesApi.get('/getAllNotes', function (req, res) {


		Note.find({},function(err, note){
			return res.send(note);
		})

	});

// add a user
	notesApi.post('/initNotes', function (req, res) {

	//get body data
		//gen info
		var form = {};
		form.owner = req.body.owner;
		form.notes = req.body.notes;

		// form.owner = "muz@gmail.com";
		// form.notes =    [{
		// 				  title: "testNote",
		// 				  content: "Some dummy content",
		// 				  sharedWith:[
		// 				  				{user: "auk2@njti.edu", canEdit: false}
		// 				  			 ]
		// 				}]

		Note.find({owner: form.owner}, function(err,note){
			if(err)  res.send(err)

			//checks for dupes, and creates  if doesnt exist
			else if (!note[0]){

				var initNote = new Note({
					owner: form.owner,
					notes: form.notes
				})

				initNote.save(function(err){
					if(err) return res.send("failed: " + err)
					res.send(initNote)
				})

			}//end else if

			else res.send("already exists")
		})
		
		

		
		

	}); //end post addUser

// add a user
	notesApi.post('/addNote', function (req, res) {

		var form = {};

		form.owner = "smuz@gmail.com";
		form.note =  {
						  "title": "frog house",
						  "content": "Some dummy content",
						  "sharedWith":[
						  				{"user": "auk2@njti.edu", "canEdit": false}
						  			 ]
						}

	 	Note.findOneAndUpdate(
		    form.owner,
		    {$push: {"notes": form.note}},
		    {safe: true, upsert: true, new:true},
		    function(err, result) {
		        if(err)res.send(err)
		        res.send(result)
		    }
		);
		

	}); //end addNote

// 
	notesApi.post('/updateNotes', function (req, res) {



	}); //end  

// 
	notesApi.post('/getNotes', function (req, res) {

	//get body data
		//gen info
		var form = {};
		form.owner = req.body.owner;
	


		Note.findOne({owner: form.owner} , function(err,notes){
			if(err) res.send(err);
			if(notes){

				res.send({success: true, notes: notes})
			}
			else res.send({success: false})
			//note.notes[0].items.push("rooots")
			//note.notes[0].items = ['nick','trick']
			//res.send(note.notes[0].items);

		})

	}); //end post addUser




// update a user
	notesApi.put('/update', function (req, res) {

		//Note.find(One)
			
			
	}); //end put updateUser


//delete a user
	notesApi.delete('/delete', function (req, res) {

			//get body data
			var form = {};
			form.username = req.body.username;

			
			
	}); //end put deleteUser 


	return notesApi;
}

