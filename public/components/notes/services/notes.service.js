(function(){
	'use strict'

	angular
    	.module('notes')
    	.factory('notesService', notesService);

    notesService.$inject = ['$http','$window','authService']

    function notesService($http, $window, authService) {

        
    	var service = { 
            getNotesList: getNotesList,
            getSingleNote: getSingleNote,
            saveAllNotes: saveAllNotes,
            addNewNote: addNewNote,
            updateNoteContent: updateNoteContent,
            updateNoteTitle: updateNoteTitle,
            updateNoteTags: updateNoteTags,
            deleteNote: deleteNote,
            // updateNoteTitle: updateNoteTitle,
            // updateNoteContent: updateNote
    	};

    	return service;

    	////////////

        
            
        
      
        // gets notes list, excludes the actual note content
        function getNotesList () {
            var token = authService.getToken();
            return $http.post('http://localhost:3000/api/notes/getAllNotesMeta',{token: token});
        } //end getNote()

        function getSingleNote(noteId) {
            var token = authService.getToken();
            return $http.post('http://localhost:3000/api/notes/getSingleNote',{token: token, noteId: noteId});

        }

        function addNewNote () {
            var token = authService.getToken();
            
            return $http.post('http://localhost:3000/api/notes/addNote',{token: token})
        }

        function updateNoteContent(noteId, noteContent) {
            var token = authService.getToken();
            return $http.post('http://localhost:3000/api/notes/updateNoteContent',{token: token, noteId: noteId, noteContent:noteContent});

        }

        function updateNoteTitle(noteId, noteTitle) {
            var token = authService.getToken();
            return $http.post('http://localhost:3000/api/notes/updateNoteTitle',{token: token, noteId: noteId, noteTitle:noteTitle});
        }



        function deleteNote(noteId) {
            var token = authService.getToken();
            return $http.post('http://localhost:3000/api/notes/deleteNote',{token: token, noteId: noteId});

        }

        function saveAllNotes(notes) {
            var token = authService.getToken();
            return $http.post('http://localhost:3000/api/notes/updateNotes',{email:"moiz@gmail.com",notes: notes})
        }

        function updateNoteTags(noteId, noteTagsArray) {
            var token = authService.getToken();
           return $http.post('http://localhost:3000/api/notes/updateNoteTags',{token: token, noteId: noteId, tags: noteTagsArray })
        }



    }

	

})();
