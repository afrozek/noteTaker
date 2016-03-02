var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');



///
var NoteSchema = new mongoose.Schema({
	owner: { type: String, required: true },
	notes:[{ title: String , items:[] }]
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

