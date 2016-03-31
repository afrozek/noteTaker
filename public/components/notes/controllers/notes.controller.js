(function() {
	'use strict'

	angular
		.module('notes')
		.controller('notesCtrl', notesCtrl)

	notesCtrl.$inject = ['notesService','$scope','$http','toastr']

	function notesCtrl(notesService,$scope, $http, toastr) {

		console.log("notes ctrl");

		//console.log( notesService.getNotes() )
		
	    var vm = this;

	   // vm.notes = notesService.getNotes();
	   vm.notes = notesService.getNotes().then(function(res){
               vm.notes = res.data.notes.notes
            })

	   vm.saveNotes = function(){
	   	notesService.saveNotes(vm.notes).then(function(res){
               console.log(res)
               if(res.data.success == true){
               	toastr.success("Notes Saved")
               }
               else{
               	toastr.error("sorry notes not saved")
               }
            })
	   }
	    //console.log(vm.notes[0].items[0])

	    vm.getNotesList = function(){
	    	
	    	//$scope.$apply();
	    	console.log("from controller")
	    	console.log($scope.notes)
	    	
	    }

	    vm.refreshBoard = function(){
	    	$scope.$apply();
	    	console.log("REFRESHING.............")
	    }

	    vm.newNote = {}
	    vm.newNote.title = null;
	    vm.newNote.items = []
	    vm.addNote = function(){
	    	var newNoteCopy = angular.copy(vm.newNote);
	    	vm.newNote.title = "";
	    	vm.notes.push(newNoteCopy)
	    }


	    

	    vm.gotoSession = gotoSession;
	    vm.refresh = refresh;
	    vm.search = search;
	    vm.sessions = [];
	    vm.title = 'notes';

	    vm.alertList = function(){
	    	vm.list = []
	    	angular.forEach(vm.notes, function(note) {
			  //console.log(note.title);
			  vm.list.push(note.title)
			});
			console.log(vm.list)
	    }



	    ////////////

	    function gotoSession() {
	      /* */
	    }

	    function refresh() {
	      /* */
	    }

	    function search() {
	      /* */
	    }
	}

})();


