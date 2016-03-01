(function() {
	'use strict'

	angular
		.module('notes')
		.controller('notesCtrl', notesCtrl)

	notesCtrl.$inject = ['notesService','$scope']

	function notesCtrl(notesService,$scope) {

		console.log("notes ctrl");

		//console.log( notesService.getNotes() )
		
	    var vm = this;

	    vm.notes = notesService.getNotes();
	    //console.log(vm.notes[0].items[0])

	    vm.getNotesList = function(){
	    	
	    	//$scope.$apply();
	    	console.log("from controller")
	    	console.log($scope.notes)
	    	
	    }

	    vm.refreshBoard = function(){
	    	//$scope.apply();
	    	console.log("REFRESHING.............")
	    }


	    vm.dragstart = function () {
	    	console.log("drag started")
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

})()


