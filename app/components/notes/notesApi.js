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

// initialize user's first note
	notesApi.post('/initNotes', function (req, res) {

	//get body data
		//gen info
		var form = {};
		form.owner = req.body.owner;
		form.notes = req.body.notes;
		form.ownerId = ObjectId("5694a306485d6b47ecaa9313");

		form.owner = "muz@gmail.com";
		form.notes =    [{
						  title: "testNote",
						  content: "Some dummy content",
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

		//req.body.

		var form = {};

		form.owner = "muz@gmail.com";
		form.ownerId = ObjectId("5694a306485d6b47ecaa9313");


		//form.userID = "";
		form.note =  {
						  "title": "spongebob notes",
						  "content": "what lives in a spongebob under the sea",
						  "sharedWith":[
						  				{"user": "auk2@njti.edu", "canEdit": false}
						  			 ]
						}

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
	notesApi.delete('/removeNote', function (req, res) {

		//req.body.

		var form = {};

		form.owner = "muz@gmail.com";
		form.ownerId = ObjectId("5694a306485d6b47ecaa9313");
		form.noteId = ObjectId("571e22ec0b2a095210a5ea15");

		//form.userID = "";
		form.note =  {
						  "title": "spongebob notes",
						  "content": "what lives in a spongebob under the sea",
						  "sharedWith":[
						  				{"user": "auk2@njit.edu", "canEdit": false}
						  			 ]
						}

	 	Note.update({_id: form.ownerId}, 
		    {$pull: {notes:{_id: form.noteId}}},
		    function(err, doc) {
		    	res.send(doc);
		    })
		

	}); //end addNote

// // updates/edits an entire note object
// 	notesApi.post('/updateNote', function (req, res) {

// 	//req.body.
// 		var form = {};

// 		form.owner = "muz@gmail.com";
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

// 		form.owner = "muz@gmail.com";
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

		form.owner = "muz@gmail.com";
		form.ownerId = ObjectId("5694a306485d6b47ecaa9313");

		//form.userId = req.body.userId;
		form.noteId = ObjectId("571dfd95db5cc6c00668f9d8");
		form.noteContent =  "i love doggsdssies"

		Note.update({_id: form.ownerId, "notes._id": form.noteId}, 
		    {$set: {"notes.$.content": form.noteContent }},
		    function(err, doc) {
		    	res.send(doc);
		    })

				
	}); //end 



// get notes by id
	notesApi.post('/getNotes', function (req, res) {

	//get body data
		//gen info
		var form = {};
		form.owner = req.body.owner;
		form.ownerId = ObjectId("5694a306485d6b47ecaa9313");


	


		Note.findById(form.ownerId , function(err,notes){
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




// //delete a user
// 	notesApi.delete('/delete', function (req, res) {

// 			//get body data
// 			var form = {};
// 			//form.username = req.body.username;
// 			form.username = "muz@gmail.com";
// 			form.userId = ObjectId("571e21c68993eda81ea34da1")
// 			form.noteId = ObjectId("571dfd95db5cc6c00668f9d8")

// 			Note.findById( form.userId, function(err,doc){
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

