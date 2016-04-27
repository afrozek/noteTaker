(function(){
	'use strict'

	angular
    	.module('notes')
    	.factory('notesService', notesService);

    notesService.$inject = ['$http','$window']

    function notesService($http,$window) {

        var token = getToken();
    	var service = {
            getToken: getToken, 
            getNotesList: getNotesList,
            getSingleNote: getSingleNote,
            saveAllNotes: saveAllNotes,
            addNewNote: addNewNote,
            updateNoteContent: updateNoteContent,
            deleteNote: deleteNote,
            // updateNoteTitle: updateNoteTitle,
            // updateNoteContent: updateNote
    	};

    	return service;

    	////////////

        function getToken() {
            return $window.localStorage.getItem('userToken');
        }
      
        // gets notes list, excludes the actual note content
        function getNotesList () {
            return $http.post('http://localhost:3000/api/notes/getAllNotesMeta',{token: token});
        } //end getNote()

        function getSingleNote(noteId) {
            return $http.post('http://localhost:3000/api/notes/getSingleNote',{token: token, noteId: noteId});

        }

        function addNewNote () {

            // create new note object
            var newNote = {title:"froost",content:"some content","sharedWith":[{"user": "auk2@njit.edu", "canEdit": false}]};
            
           return $http.post('http://localhost:3000/api/notes/addNote',{token: token, note: newNote})
        }

         function updateNoteContent(noteId, noteContent) {
            return $http.post('http://localhost:3000/api/notes/updateNoteContent',{token: token, noteId: noteId, noteContent:noteContent});

        }

        function deleteNote(noteId) {
            return $http.post('http://localhost:3000/api/notes/deleteNote',{token: token, noteId: noteId});

        }

        function saveAllNotes(notes) {
            return $http.post('http://localhost:3000/api/notes/updateNotes',{email:"moiz@gmail.com",notes: notes})
        }



    }

	

})();
