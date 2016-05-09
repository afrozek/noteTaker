var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var ObjectId = require('mongodb').ObjectID;
var User = require('../users/usersModel.js');



///
var NoteSchema = new mongoose.Schema(
{
	ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	owner: { type: String, required: true, unique: false },
	notes:[
			{
			  id_: { type: mongoose.Schema.Types.ObjectId },
			  title: { type: String },
			  content: String,
			  tags: [],
			  created: { type: String},
			  sharedWith:[
			  				{user: String, canEdit: Boolean}
			  			 ]
			}
		  ],
	sharedWithMe: [{owner: String, title: String, }]

});

var Note = mongoose.model('Note', NoteSchema);





// NoteSchema.pre('save', function(next){
// 	var note = this;

// 	var date = new Date(note.created);  // dateStr you get from mongodb

// 	var d = date.getDate();
// 	var m = date.getMonth()+1;

// 	note.created = d + "" + m;
// 			next();
// 		})



module.exports = mongoose.model('Note', NoteSchema);

