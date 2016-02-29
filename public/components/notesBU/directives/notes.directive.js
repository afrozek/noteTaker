angular
    .module('notes')
    .directive('noteCards', noteCards)
    

function noteCards() {
	return{
		restrict: 'AE',
		scope: {
			notes: "=",
			dragdata: "="
		},
		replace: false,
		transclude: true,
		templateUrl: "components/notes/views/note.directive.view.html",
		link: function(scope,element,attrs){
			//$( "#sortable" ).sortable();
			//console.log(scope)
			//console.log(element)
			//console.log(attrs)
			//element.sortable();
			//console.log(scope.notes)
			scope.dogs = function(note){
				console.log(note)
			}

			element.sortable({
		       // placeholder: "ui-state-highlight",

		        start: function(event, ui) {
		            var start_pos = ui.item.index();
		            ui.item.data('start_pos', start_pos);
		            console.log(scope.dragdata)
		            //console.log(attrs.dragdata)
		        },
		        update: function(event, ui) {
		            var start_pos = ui.item.data('start_pos');
		            var end_pos = ui.item.index();
		            //console.log(start_pos + ' - ' + end_pos);
		          
		          var startItem = scope.notes[start_pos];
		           scope.notes.splice(start_pos,1)
		           scope.notes.splice(end_pos,0, startItem)
		           scope.$apply();

		           //console.log(scope.notes)
		           
		           
		        }
		    }); // end sortable

		   

		    console.log(element)


		},
		controller: function($scope){
			//alert("controller");
			// $scope.dogs = $scope.data + "dogs";
			// if($scope.draggable)
			// 	$scope.dragStatus = false;
			// else $scope.dragStatus = true;

			
		}
	}
} //end notecards directive

angular
	.module('notes')
	.directive('noteCard', noteCard)

function noteCard() {
	return{
		restrict: 'AE',
		scope: {
			note: "=",
			notes: "=",
			dragdata: "="
		},
		replace: true,
		transclude: false,
		templateUrl: "components/notes/views/notes.items.view.html",
		link: function(scope,element,attrs){
			//$( "#sortable" ).sortable();
			//console.log(scope)
			console.log(element)
			//console.log(attrs)
			//element.sortable();
			//console.log(scope.notes)
			

			element.sortable({
		       //placeholder: "ui-state-highlight",
		       connectWith: ".connectedSortable",

		        start: function(event, ui) {
		        	console.log("START FUNCTION START FUNCTION START FUNCTION START FUNCTION ")
		        	console.log("START FUNCTION START FUNCTION START FUNCTION START FUNCTION ")
		  			
		  			//clear dragdata from notes.controller
		       		scope.dragdata = {startNotePos: null,  startItemPos: null, endNotePos: null, endItemPos: null}
		       		

		       		//set start note and start item position
		        	scope.dragdata.startNotePos = attrs.noteindex;
		            scope.dragdata.startItemPos = ui.item.index();
		            //log data

		             var start_pos = ui.item.index();
          			 ui.item.data('start_pos', start_pos);
		            //scope.$apply();
		            console.log(scope.dragdata)


		        },
		        update: function(event, ui) {
		        	//only for changes within own list
		        	console.log("UPDATE FUNCTION UPDATE FUNCTION UPDATE FUNCTION UPDATE FUNCTION ")
		        	console.log("UPDATE FUNCTION UPDATE FUNCTION UPDATE FUNCTION UPDATE FUNCTION ")

			        scope.dragdata.endItemPos = ui.item.index();


		        		console.log("EXECUTING UPDATE FUNCTION EXECUTING UPDATE FUNCTION EXECUTING UPDATE FUNCTION")
		        		console.log(scope.dragdata)

			           var startItem = scope.note.items[scope.dragdata.startItemPos];

			           var start_pos = ui.item.data('start_pos');
          			   var end_pos = ui.item.index();

			           scope.note.items.splice(start_pos,1)
          			   scope.note.items.splice(end_pos,0, startItem)
			           scope.$apply();	

		           
		        },//end update
		         dog: function(event, ui) {
		         	console.log("RECEIVE FUNCTION RECEIVE FUNCTION RECEIVE FUNCTION RECEIVE FUNCTION ")
		        	console.log("RECEIVE FUNCTION RECEIVE FUNCTION RECEIVE FUNCTION RECEIVE FUNCTION ")
		        	console.log(scope.dragdata)
		        	console.log(attrs.noteindex)

		        	   var startItem = scope.note.items[scope.dragdata.startItemPos];
		        	   var startNotePos = scope.dragdata.startNotePos;
		        	   scope.dragdata.endItemPos = ui.item.index();
		        	   scope.dragdata.endNotePos = attrs.noteindex;

		        	   console.log(startNotePos)
			           scope.notes[startNotePos].items.splice(scope.dragdata.startItemPos,1)
			           scope.notes[scope.dragdata.endNotePos].items.splice(scope.dragdata.endItemPos,0, startItem)
			           


			           scope.$apply();


		        	
		        },//end receive


		    }); // end sortable
		
		},
		controller: function($scope){
			//alert("controller");
			// $scope.dogs = $scope.data + "dogs";
			// if($scope.draggable)
			// 	$scope.dragStatus = false;
			// else $scope.dragStatus = true;

				
		}
	}
} //end notecard directive





