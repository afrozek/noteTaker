(function() {
	'use strict'

	angular
		.module('notes')
		.controller('notesCtrl', notesCtrl)

	notesCtrl.$inject = ['notesService','$scope','$http','toastr','$window']

	function notesCtrl(notesService,$scope, $http, toastr, $window) {
		var vm = this;
		console.log("notes ballsout");

		vm.getNotes = getNotes();
		vm.allNotes = null;
		vm.activeNotes = [];

		vm.addNote = addNote;
		vm.saveNote = saveNote;
		vm.deleteNote = deleteNote;
		vm.updateNote = updateNote;
		vm.newNote = newNote;

		vm.activate = activate;
		vm.closeTab = closeTab;
		
		vm.showList = true;
		vm.gridMode = true;


		
	    
	   
	  	$scope.tinymceOptions = {
		    plugins: 'link image code',
		    toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code | paste'
		  };

		$scope.title = "ratsts";
		$scope.dogs ="froadsasdfadsgs"
		vm.tinymceModel = 'Initial consdsdtent';

// sample notes
		// vm.allNotes = [
		// 	{title:"gulp cheat sheet",content:"nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula q"},
		// 	{title:"meteor",content:"nonummy nibh euismod tincidunt ut laoreet dolore magna m consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula q"}
		// 	,
		// 	{title:"jquery",content:"nonummy nibh euismod tincidunt ut laoreet dolore magna m consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula q"}
		// 	,
		// 	{title:"angular",content:"nonummy nibh euismod tincidunt ut laoreet dolore magna m consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula q"}
		// 	,
		// 	{title:"swift",content:"nonummy nibh euismod tincidunt ut laoreet dolore magna m consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula q"}

		// ]

		//gets all notes
		

		function getNotes() {
			var token = $window.localStorage.getItem('userToken');
			$http.post('http://localhost:3000/api/notes/getAllNotesMeta',{token: token}).then(function(data){
				vm.allNotes = data.data.notes;
				console.log(vm.allNotes);
			})
		}

		function addNote() {

		}

		function saveNote() {

		}

		function deleteNote() {

		}

		function updateNote() {

		}

		


	    ////////////

	    function activate(note) {
	    	var permissionToActivate = true;
    		// checks if tab already open
    		if(vm.activeNotes.length > 0 && vm.activeNotes.length !== 4 ){
    			console.log('looping')
	    		angular.forEach(vm.activeNotes, function(value) {
	    			console.log(value._id.toString());
	    			console.log(note._id.toString());
				  if(value._id.toString() == note._id.toString()){
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
			  	vm.activeNotes.push(note);
				console.log(vm.activeNotes)
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

	    	// create new note object
	    	var newNote = {title:"doogs",content:"","sharedWith":[{"user": "auk2@njit.edu", "canEdit": false}]};
	    	
	    	// get token
	    	var token = $window.localStorage.getItem('userToken');

	    	// send new note object
	    	$http.post('http://localhost:3000/api/notes/addNote',{token: token, note: newNote}).then(function(data){
	    		console.log(data);

	    		// data returns the list of new notes
	    		vm.allNotes = data.data.notes;
	    		
	    		// push new note to active notes
	    		var newNoteIndex = vm.allNotes.length-1;
	    		activate(vm.allNotes[newNoteIndex]);

	    		// log new active notes
	    		console.log(vm.activeNotes);
	    	});
			
	    	//scroll to the new note
	    	window.location.hash = "notes#Untitled";
	    }

	    function deleteNote(noteId){
	    	console.log('deleting')
	    	console.log(noteId)
	    }

	    function refresh() {
	      /* */
	    }

	    function search() {
	      /* */
	    }
	}

})();


