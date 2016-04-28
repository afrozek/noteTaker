module.exports = notesApi;

var Note = require('./notesModel.js');
var User = require('../users/usersModel.js');

var jwt = require('jwt-simple');
var bcrypt = require('bcrypt-nodejs');
var ObjectId = require('mongodb').ObjectID;




function notesApi (app, express) {
	var notesApi = express.Router();
	var ownerId = null;
	var owner = null;

// middleware to authorize user to notes api

	notesApi.use(function(req, res, next){
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
		else{
			ownerId = payload.sub;
			owner = payload.email;
		}

		//everything checked out
		//res.json({success: true, id: ownerId});
		console.log("request by: " + owner)
		next();
	})


// get all notes
	notesApi.post('/getAllNotes', function (req, res) {


		Note.find({ownerId: ownerId},function(err, note){
			return res.send(note[0].notes);
		})

	});

// get all note metadatas
	notesApi.post('/getAllNotesMeta', function (req, res) {


		Note.find({ownerId: ownerId},'notes.title notes._id notes.sharedWith',function(err, note){
			return res.send(note[0]);
		})

	});

// get single note
	notesApi.post('/getSingleNote', function (req, res) {

		var noteId = req.body.noteId;

		Note.find({ownerId: ownerId},function(err, doc){
			var note = doc[0].notes.id(noteId);
			if(note){
				return res.send({success: true, data: note});
			}
			else{
				return res.send({success: false, data: "no note found"});
			}
		})

	});


// initialize user's first note
	notesApi.post('/initNotes', function (req, res) {

	//get body data
		//gen info
		var form = {};
		form.owner = owner;
		//form.notes = req.body.notes;
		form.ownerId = ownerId;

		//form.owner = owner";
		form.notes =    [{
						  title: "My First Note",
						  content: "your first sample note",
						  sharedWith:[
						  				{user: "auk2@njti.edu", canEdit: false}
						  			 ]
						}]

		Note.find({ownerId: form.ownerId}, function(err,note){
			if(err) return res.json({"success": false , data: err})

			//checks for dupes, and creates  if doesnt exist
			else if (!note[0]){

				var initNote = new Note({
					ownerId: form.ownerId,
					owner: form.owner,
					notes: form.notes
				})

				initNote.save(function(err){
					if(err) return res.json({"success": false , data: err})
					res.json({"success": true , data: initNote})
				})

			}//end else if

			else res.json({"success": false , data: "already initialized"})
		})
		
				

	}); //end post addUser

// adds a note
// pushes new note to notes array
	notesApi.post('/addNote', function (req, res) {

		var form = {};

		//form.owner = owner";
		form.ownerId = ownerId;


		//form.ownerId = "";
		// form.note =  {
		// 				  "title": "spongebob notes",
		// 				  "content": "what lives in a spongebob under the sea",
		// 				  "sharedWith":[
		// 				  				{"user": "auk2@njti.edu", "canEdit": false}
		// 				  			 ]
		// 				}

		form.note = req.body.note;

	 	Note.findOneAndUpdate(
		    form.ownerId,
		    {$push: {"notes": form.note}},
		    {safe: true, upsert: true, new:true},
		    function(err, result) {
		        if(err)res.send(err)
		        res.send(result)
		    }
		);
		

	}); //end addNote

// removes a note
// pulls a note from notes array
	notesApi.post('/deleteNote', function (req, res) {

		//req.body.

		var form = {};

		// form.owner = owner";
		form.ownerId = ownerId;
		form.noteId = req.body.noteId.toString();

		//form.ownerId = "";
		form.note =  {
						  "title": "spongebob notes",
						  "content": "what lives in a spongebob under the sea",
						  "sharedWith":[
						  				{"user": "auk2@njit.edu", "canEdit": false}
						  			 ]
						}

	 	Note.update({ownerId: form.ownerId}, 
		    {$pull: {notes:{_id: form.noteId}}},
		    function(err, doc) {
		    	console.log(form.noteId)
		    	if(err)res.send(err);
		    	res.send(doc);
		    })
		

	}); //end addNote

// // updates/edits an entire note object
// 	notesApi.post('/updateNote', function (req, res) {

// 	//req.body.
// 		var form = {};

// 		form.owner = owner";
// 		form.noteIndex = 0;

// 	//form.note.id
// 		form.note =  {
// 						  "title": "frog house",
// 						  "content": "using query,set and options roosts",
// 						  "sharedWith":[
// 						  				{"user": "auk2@njti.edu", "canEdit": false}
// 						  			 ]
// 						}

// 	// prepare parent query
// 		var query = form.owner;

// 	//create set object				
// 		var set = {$set: {}};
// 	//prepare set query
// 		set.$set["notes." + form.noteIndex] = form.note;

// 	//options
// 		var options = {safe: true, upsert: true, new:true};

// 	//execute the query					
// 		Note.findOneAndUpdate(
// 			query,
// 			set,
// 			options,
// 			function(err, doc) {
// 		    res.send(doc);
// 		});

// 	}); //end  



// // updates/edits content of a note
// 	notesApi.post('/updateNoteContent', function (req, res) {

// 	//req.body.
// 		var form = {};

// 		form.owner = owner";
// 		form.noteIndex = 0;

// 	//form.note.id
// 		form.noteContent =  "this i0 new updated content"

// 	// prepare parent query
// 		var query = form.owner;

// 	//create set object				
// 		var set = {$set: {}};
// 	//prepare set query
// 		set.$set["notes." + form.noteIndex + '.content'] = form.noteContent;

// 	//options
// 		var options = {safe: true, upsert: true, new:true};

// 	//execute the query					
// 		Note.findOneAndUpdate(query,set,options,function(err, doc) {
// 		    res.send(doc);
// 		});

// 	}); //end 

// updates/edits content of a note by id
	notesApi.post('/updateNoteContent', function (req, res) {

	//req.body.
		var form = {};

		// form.owner = owner";
		form.ownerId = ownerId;
		form.noteId = req.body.noteId;
		form.noteContent =  req.body.noteContent;

		Note.update({ownerId: form.ownerId, "notes._id": form.noteId}, 
		    {$set: {"notes.$.content": form.noteContent }},
		    function(err, doc) {
		    	res.send(doc);
		    })

				
	}); //end 


// updates/edits content of a note by id
	notesApi.post('/updateNoteTitle', function (req, res) {

	//req.body.
		var form = {};

		// form.owner = owner";
		form.ownerId = ownerId;
		form.noteId = req.body.noteId;
		form.noteTitle =  req.body.noteTitle;

		Note.update({ownerId: form.ownerId, "notes._id": form.noteId}, 
		    {$set: {"notes.$.title": form.noteTitle }},
		    function(err, doc) {
		    	res.send(doc);
		    })

				
	}); //end 



// // get notes by id
// 	notesApi.post('/getNotes', function (req, res) {

// 	//get body data
// 		//gen info
		
// 		var form = {}
// 		form.ownerId = ownerId;


	


// 		Note.findById(form.ownerId , function(err,notes){
// 			res.send(notes)
// 			// if(err) res.send(err);
// 			// if(notes){

// 			// 	res.send({success: true, notes: notes})
// 			// }
// 			// else res.send({success: false})
// 			//note.notes[0].items.push("rooots")
// 			//note.notes[0].items = ['nick','trick']
// 			//res.send(note.notes[0].items);

// 		})

// 	}); //end post addUser




// //delete a user
// 	notesApi.delete('/delete', function (req, res) {

// 			//get body data
// 			var form = {};
// 			//form.username = req.body.username;
// 			form.username = "muz@gmail.com";
// 			form.ownerId = ObjectId("571e21c68993eda81ea34da1")
// 			form.noteId = ObjectId("571dfd95db5cc6c00668f9d8")

// 			Note.findById( form.ownerId, function(err,doc){
// 				if(err)res.send(err)
// 				if(!doc || typeof(doc) == 'undefined' || null ){
// 					res.json({"status": false , "data": "no user found"})
// 				} 
// 				else{
// 					var notes = doc.notes.id(form.noteId);
// 					if(!notes || typeof(notes) == 'undefined' || null) res.json({status: false, data: "note not found"});
// 					else res.json({status: true, data: notes});
					
// 					//res.send(doc.notes.id(ObjectId("571dfd95db5cc6c00668f9d8")))
// 				}
// 				//res.send(doc)
			
// 			})
			
// 	}); //end put deleteUser 


	return notesApi;
}

