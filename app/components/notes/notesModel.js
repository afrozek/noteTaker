var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var ObjectId = require('mongodb').ObjectID;
var User = require('../users/usersModel.js');



///
var NoteSchema = new mongoose.Schema(
{
	ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	owner: { type: String, required: true, unique: true },
	notes:[
			{
			  title: { type: String, required: true, unique: true },
			  content: String,
			  sharedWith:[
			  				{user: String, canEdit: Boolean}
			  			 ]
			}
		  ],
	sharedWithMe: [{owner: String, title: String, }]

});

var Note = mongoose.model('Note', NoteSchema);

// NoteSchema.methods.comparePasswords = function(password, callback){
// 	bcrypt.compare(password, this.password, callback);
// }


///
// NoteSchema.pre('save', function(next){
// 	var note = this;

// 	if(!note.isModified('password')) return next();

// 	bcrypt.genSalt(10, function(err,salt){
// 		if(err) return next(err);

// 		bcrypt.hash(note.password, salt, null, function(err, hash){
// 			if(err) return next(err);

// 			note.password = hash;
// 			next();
// 		})
// 	})
// })



module.exports = mongoose.model('Note', NoteSchema);

