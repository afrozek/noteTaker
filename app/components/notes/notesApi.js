module.exports = notesApi;

var Note = require('./notesModel.js');
//var User = require('./usersModel.js');
var jwt = require('jwt-simple');
var bcrypt = require('bcrypt-nodejs');




function notesApi (app, express) {
	var notesApi = express.Router();


// get all notes
	notesApi.get('/getAllNotes', function (req, res) {


		Note.find({},function(err, note){
			return res.send(note);
		})

	});

// add a user
	notesApi.post('/newNote', function (req, res) {

	//get body data
		//gen info
		var form = {};
		// form.email = req.body.email;
		// form.note = req.body.note;

		form.email = "moiz@gmail.com";
		form.note = [{ title: "sampleNote" , items:["dogs","cats"] },{ title: "ragNote" , items:["carrots","nuts"] }]
		

		



		var newNote = new Note({
			owner: form.email,
			notes: form.note
		})

		
		newNote.save(function(err){
			if(err) return res.send("failed: " + err)
			res.send(newNote)
		})

	}); //end post addUser

// add a user
	notesApi.post('/updateNote', function (req, res) {

	//get body data
		//gen info
		var form = {};
		// form.email = req.body.email;
		// form.note = req.body.note;

		form.email = "moiz@gmail.com";
		form.note = [{ title: "sampleNote" , items:["dogs","cats"] },{ title: "ragNote" , items:["carrots","nuts"] }]
		

		



		// var newNote = new Note({
		// 	owner: form.email,
		// 	notes: form.note
		// })

		Note.findOne({owner: form.email} , function(err,note){
			//note.notes[0].items.push("rooots")
			note.notes[0].items = ['nick','trick']
			//res.send(note.notes[0].items);

			note.save(function(err,note){
				if(err) res.send("error")
				res.send(note)
			})
		})

		
		// newNote.save(function(err){
		// 	if(err) return res.send("failed: " + err)
		// 	res.send(newNote)
		// })

	}); //end post addUser

// add a user
	notesApi.post('/updateNotes', function (req, res) {

	//get body data
		//gen info
		var form = {};
		form.email = req.body.email;
		form.notes = req.body.notes;


		Note.findOne({owner: form.email} , function(err,notes){
			if(err) res.send(err);
			if(notes){

				notes.notes = form.notes;

				notes.save(function(err,newNotes){
					if(err) res.send(err)
					res.send({success: true, notes: newNotes})
				})
			}
			else res.send({success: false})
			//note.notes[0].items.push("rooots")
			//note.notes[0].items = ['nick','trick']
			//res.send(note.notes[0].items);

		})

	}); //end post addUser

// add a user
	notesApi.post('/getNotes', function (req, res) {

	//get body data
		//gen info
		var form = {};
		form.email = req.body.email;
	


		Note.findOne({owner: form.email} , function(err,notes){
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

