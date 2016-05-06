(function() {
	'use strict'

	angular
		.module('notes')
		.controller('notesCtrl', notesCtrl)

	notesCtrl.$inject = ['notesService','$scope','$http','toastr','$window','$rootScope']

	function notesCtrl(notesService,$scope, $http, toastr, $window,$rootScope) {
		var vm = this;
		console.log("notes ballsout");

		vm.getNotesList = getNotesList;

		vm.getNotesList();
		vm.activeNotes = [];
		vm.getSingleNote = getSingleNote;


		vm.saveNote = saveNote;
		vm.deleteNote = deleteNote;
		vm.updateNoteContent = updateNoteContent;
		vm.updateNoteTitle = updateNoteTitle;
		vm.newNote = newNote;
		vm.addTag = addTag;
		vm.deleteTag = deleteTag;

		vm.activate = activate;
		vm.closeTab = closeTab;
		
		vm.showList = true;
		vm.gridMode = true;
		vm.toggleTags = false;

  
	  	$scope.tinymceOptions = {
		    plugins: 'link image code',
		    toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code | paste'
		  };

		$scope.title = "ratsts";
		$scope.dogs ="froadsasdfadsgs"
		vm.tinymceModel = 'Initial consdsdtent';


		

		function getNotesList() {
				vm.allNotes = [];
				console.log(vm.allNotes)
				notesService.getNotesList().then(function(data){
					vm.allNotes = [];
					
					setTimeout(function(){
						$rootScope.$apply(function(){
							console.log("updating")
							vm.allNotes = data.data.notes;
							console.log(vm.allNotes);
						})	
					}, 1000)
					
					console.log(vm.allNotes);
				})
		}

		function getSingleNote(noteId) {
			 notesService.getSingleNote(noteId).then(function(){
			 	return data.data;
			 })

		}


	    function activate(noteId) {
	    	var permissionToActivate = true;
    		// checks if tab already open
    		if(vm.activeNotes.length > 0 && vm.activeNotes.length !== 4 ){
    			console.log('looping')
	    		angular.forEach(vm.activeNotes, function(value) {
	    			console.log(value._id.toString());
	    			console.log(noteId.toString());
				  if(value._id.toString() == noteId.toString()){
				  	permissionToActivate = false;
				  	toastr.error("Whoops! Looks like this note is already open")
				  }
				});//end foreach
			}
		    if(vm.activeNotes.length == 4){
		    		console.log("checking max");
		    		permissionToActivate = false;
		    		toastr.error("Whoops! Looks like you have reached the max number of tabs(4)")
		    }
		
	    	if(permissionToActivate == true){
			  	console.log("else pushing");
			  	console.log(noteId)
			  	notesService.getSingleNote(noteId).then(function(res){
			  		var note = res.data.data;
			  		vm.activeNotes.push(note);
					console.log(vm.activeNotes)
			  	})
			  	
			} 
	    	
	    } //end function activate

	    function closeTab(index) {
	      vm.activeNotes.splice(index,1);
	      console.log(vm.activeNotes)

	    }

	    function newNote() {
	    	// first check if active notes is full
	    	if(vm.activeNotes.length == 4){
	    		return toastr.error("Whoops! Please close a tab before creating a new note");
	    	}

	    	
	    	// get token
	    	var token = $window.sessionStorage.getItem('userToken');

	    	// send new note object
	    	notesService.addNewNote().then(function(data){
	    		console.log(data);

	    		notesService.getNotesList().then(function(data2){
	    			// push new note to active notes
	    			console.log(data2)
	    			vm.allNotes = data2.data.notes;
		    		var newNoteIndex = vm.allNotes.length-1;
		    		activate(vm.allNotes[newNoteIndex]);
		    		//scroll to the new note
	    			window.location.hash = "notes#" + vm.allNotes[newNoteIndex]._id;

		    		// log new active notes
		    		console.log(vm.activeNotes);
	    		})
	    		
	    		
	    	});
			
	    	
	    }

	    function updateNoteContent(noteId, noteContent) {

	    	notesService.updateNoteContent(noteId, noteContent).then(function(data){
	    		console.log(data);
	    		if(data.data.nModified == 1){
	    			toastr.success("Note Saved!")
	    		}
	    	})
	    }

	    function updateNoteTitle(noteId, noteTitle) {

	    	notesService.updateNoteTitle(noteId, noteTitle).then(function(data){
	    		console.log(data);
	    		if(data.data.nModified == 1){
	    			vm.getNotesList();
	    		}
	    	})
	    }

	    function deleteNote(noteId,index){
	    	console.log('deleting')
	    	notesService.deleteNote(noteId).then(function(data){
	    		if(data.data.nModified == 1){
	    			closeTab(index)
	    			toastr.success("Note Deleted!")
	    			vm.getNotesList();
	    		}
	    		
	    	});
	    	
	    }


	    

	    function addTag(noteId, noteTagsArray){
	    	if(vm.newTagName == "" || vm.newTagName == undefined || vm.newTagName == null){
	    		toastr.error("Please enter a tag name")
	    	}
	    	else{
		    	noteTagsArray.push(vm.newTagName)
		    	
		    	notesService.updateNoteTags(noteId, noteTagsArray).then(function(res){
		    		// console.log(res.data.nModified);
		    		if(res.data.nModified == 1){
		    			toastr.success("Added " + vm.newTagName + " as a tag!")
		    			vm.newTagName = "";
		    		}
		    		else{
		    			toastr.error("Whoops!, Something went wrong, tags not updated");
		    		}
		    	})
	    	}
	    }

	    function deleteTag(noteId, noteTagsArray, index){
	    	noteTagsArray.splice(index, 1);
	    	
	    	notesService.updateNoteTags(noteId, noteTagsArray).then(function(res){
	    		// console.log(res.data.nModified);
	    		if(res.data.nModified == 1){
	    			toastr.success("Removed Tag!")
	    		}
	    		else{
	    			toastr.error("Whoops!, Something went wrong, cannot remove tag");
	    		}
	    	})
	    }

	    
	   
		function saveNote() {

		}


		function updateNote() {

		}

	}

})();


