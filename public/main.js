(function(){
    'use strict'

angular
    .module('app', [
        'auth',
    	'ui.router',
    	'ngAnimate',
    	'sample',
    	'register',
    	'toastr',
    	'members',
    	'notes',
        'budget',
        'chart.js',
        'notify',
        'ui.tinymce'
    ])

// .config(function($httpProvider) {

//     // attach our auth interceptor to the http requests
//     $httpProvider.interceptors.push('authInterceptor');

// })


.run(['$rootScope','$state','authService','$q',function($rootScope, $state, authService ,$q) {
    authService.info();

    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
           
          // event.preventDefault();
           console.log("STATE CHANGE ERROR ERROR ERROR ERRORERROR");
           $state.go('app.home')
        
      });

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    //authService.info();
    //authService.isAuthorized( event, fromState, toState);
    //console.log("state changing");
    //console.log(toState)

        if(toState.data.permission === true){

            console.log("need permission");
            //toState.resolve = toState.resolve || {};
            //toState.resolve = {};

            //check to see if there was a resolve already added
            if(!toState.resolve.authorizationResolver){
                console.log('adding auth resolver');
                //add resolver
                toState.resolve.authorizationResolver = function(){
                     return authService.isAuthorized(event, fromState, toState);
                }
                //console.log("just added: ")
                //console.log(toState.resolve.authorizationResolver)
            }
            else{
                //just to show that the resolver was already added
                //console.log(toState.resolve.authorizationResolver)
            }

        } //end if needs permission


    }); //end rootScope.$on


    

}]); //end .run





})(); //end iffe


(function() {
	'use strict'

	angular
		.module('app')
		.controller('appCtrl', appCtrl)

	appCtrl.$inject = ['sampleService','authService','$state','$http','toastr','$rootScope','notifyService']

	function appCtrl(sampleService,authService,$state, $http, toastr, $rootScope,notifyService) {

		 var vm = this;

		 // on initial load
		 // user login status
		 vm.isLogged = authService.isAuthenticated(vm);

		 $rootScope.$on('loggedIn',function(){
		 	vm.isLogged = true;
		 })

		 $rootScope.$on('loggedOut',function(){
		 	vm.isLogged = false;
		 })

		 var message = {data : "roosts"};
		 //notifyService.push( message);

		 //alert("watching");


	} //end appCtrl

})();;



(function() {
	'use strict'

	angular
		.module('app')
		.controller('homeCtrl', homeCtrl)
		.controller('parentCtrl', parentCtrl)

	homeCtrl.inject = ['sampleService','$scope']

	function homeCtrl(sampleService, $scope) {
		
		sampleService.info();

	    var vm = this;

	    vm.gotoSession = gotoSession;
	    vm.refresh = refresh;
	    vm.search = search;
	    vm.sessions = [];
	    vm.test = 'test';

	    ////////////

	    // $scope.$on('dogs', function () {
	    // 	console.log("received")
	    // });

	    function gotoSession() {

		}

	    function refresh() {
	      /* */
	    }

	    function search() {
	      /* */
	    }
	} // end homeCtrl

	parentCtrl.inject = ['sampleService','$scope']

	function parentCtrl($scope) {
		
	    var vm = this;
	    //console.log("parent")

	   // $scope.$emit('dogs','some data');


	} // end parentCtrl

})();














	(function(){

	angular
		.module('app')
		.controller("loginCtrl", loginCtrl)

	loginCtrl.$inject = ['$scope','sampleService','authService','$state','$http','toastr']

	function loginCtrl($scope,sampleService,authService,$state, $http, toastr) {
		//sampleService.info();
		//console.log("loginCtrl")

	    var vm = this;
	    vm.user = ""
	    vm.loginForm = "";
	    
	    vm.login = login;
	    vm.logout = logout;

	    ////////////

	    function login() {
	    	authService.login(vm.user,'app.notes')
			vm.user = "";
	    }

	    function logout() {
	    	console.log("logging out...")
	    	authService.logout();
	    }


	} //end loginCtrl



})();
(function() {
	'use strict'

	angular
		.module('app')
		.controller('navCtrl', navCtrl)

	navCtrl.inject = ['']

	function navCtrl() {
		
		//console.log('nav controller');

	    var vm = this;


	    vm.loggedIn = true;
	    vm.gotoSession = gotoSession;
	    vm.refresh = refresh;
	    vm.search = search;
	    vm.sessions = [];
	    vm.title = 'Nav';
	    //$scope.title = "mouse";

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



angular
    .module('app')
    .directive('selectText', selectText)
    
    selectText.$inject = ['$window']

function selectText($window){
    return function (scope, element, attrs) {
    element.bind('click', function () {
      if (!$window.getSelection().toString()) {
        this.setSelectionRange(this.value.length, this.value.length)
      }
    });
  };
}




angular.module('app')
	.config(['$urlRouterProvider','$stateProvider','$httpProvider',function($urlRouterProvider,$stateProvider,$httpProvider){
		
		$urlRouterProvider.otherwise('home');
		//states
		$stateProvider

		.decorator('path', function(state, parentFn) {
			//console.log("configuring states")	
			if (state.self.resolve === undefined) {
				state.self.resolve = {};
				state.resolve = state.self.resolve;
			}
			return parentFn(state);
         })

		.state('app',{
			abstract: true,
			templateUrl:'app/views/app.view.html',
			controller: 'appCtrl',
			controllerAs: 'app'

		})

		.state('app.home',{
			url: '/home',
			templateUrl:'app/views/app.home.html',
			controller: 'homeCtrl',
			controllerAs: 'home',
			data: {
				permission: false,
				permissionLevel: ['everyone']
			}
		})

		.state('app.register',{
			url: '/register',
			templateUrl:'components/register/views/register.view.html',
			controller: 'registerCtrl',
			controllerAs: 'register',
			data: {
				permission: false,
				permissionLevel: ['everyone']
			}
		})

		.state('app.members',{
			url: '/members',
			templateUrl:'components/members/views/members.home.html',
			controller: 'membersCtrl',
			controllerAs: 'members',
			data: {
				permission: true,
				permissionLevel: ['admin','member']
			}
		})

		.state('app.notes',{
			url: '/notes',
			templateUrl:'components/notes/views/notes.view.html',

			data: {
				permission: true,
				permissionLevel: ['admin','member']
			}
		})

		.state('app.budget',{
			url: '/budget',
			templateUrl:'components/budget/views/budget.view.html',
			controller: 'budgetCtrl',
			controllerAs: 'budget',
			data: {
				permission: true,
				permissionLevel: ['admin']
			}
		})

		//$httpProvider.interceptors.push('authInterceptor');



	}]);


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



// angular
//     .module('notes')
//     .directive('noteCard', noteCard);

// function noteCard() {
// 	return{
// 		restrict: 'E',
// 		scope: {
// 			data: "=",
// 			draggable: "="
// 		},
// 		replace: true,
// 		template: "<h1>{{dogs}}{{dragStatus}}</h1>",
// 		link: function(scope,element){
// 			element.click(function(){
// 				console.log(element)
// 				element[0].draggable = true;
// 			})
// 		},
// 		controller: function($scope){
// 			//alert("controller");
// 			$scope.dogs = $scope.data + "dogs";
// 			if($scope.draggable)
// 				$scope.dragStatus = false;
// 			else $scope.dragStatus = true;

			
// 		}
// 	}
// }



// // angular
// //     .module('notes')
// //     .directive('noteCard', noteCard);

// // function noteCard() {
// // 	return{
// // 		restrict: 'E',
// // 		controller: function($scope){
// // 			alert("controller");
// // 			console.log('dog')
// // 		},
// // 		templateUrl: '',
// // 		replace: true
// // 		// scope: {}
// // 	}
// // }
// angular
//     .module('notes')
//     .directive('noteCards', noteCards)


    

// function noteCards() {
// 	return{
// 		restrict: 'AE',
// 		scope: {
// 			notes: "=",
// 			newItem: "="
// 		},
// 		replace: false,
// 		transclude: false,
// 		templateUrl: "components/notes/views/note.directive.view.html",
// 		link: function(scope,element,attrs){
// 			//$( "#sortable" ).sortable();
// 			//console.log(scope)
// 			//console.log(element)
// 			//console.log(attrs)
// 			//element.sortable();
// 			//console.log(scope.notes)
// 			scope.dogs = function(note){
// 				console.log(note)
// 			}


// 			element.sortable({
// 		       // placeholder: "ui-state-highlight",
// 		        start: function(event, ui) {
// 		            var start_pos = ui.item.index();
// 		            ui.item.data('start_pos', start_pos);
// 		        },
// 		        update: function(event, ui) {
// 		            var start_pos = ui.item.data('start_pos');
// 		            var end_pos = ui.item.index();
// 		            //console.log(start_pos + ' - ' + end_pos);
		          
// 		          var startItem = scope.notes[start_pos];
// 		           scope.notes.splice(start_pos,1)
// 		           scope.notes.splice(end_pos,0, startItem)
// 		           scope.$apply();

// 		           //console.log(scope.notes)
		           
		           
// 		        }
// 		    }); // end sortable

		   

// 		    console.log(element)


// 		},
// 		controller: function($scope){
// 			$scope.form ={}
// 			$scope.addItem = function(index,item){
// 				//alert(index)
// 				console.log($scope.newItem)
// 				$scope.notes[index].items.push(item)
// 				$scope.form = {}
// 				//console.log($scope.notes[index].items)
// 			}

// 			$scope.deleteNote = function(index){
// 				$scope.notes.splice(index,1);
// 			}


// 			//alert("controller");
// 			// $scope.dogs = $scope.data + "dogs";
// 			// if($scope.draggable)
// 			// 	$scope.dragStatus = false;
// 			// else $scope.dragStatus = true;

			
// 		}
// 	}
// } //end notecards directive

// angular
// 	.module('notes')
// 	.directive('noteCard', noteCard)

// function noteCard() {

// 	var tempData = {};
// 	var tempNote = null;

// 	return{
// 		restrict: 'AE',
// 		scope: {
// 			note: "=",
// 			notes: "="
// 		},
// 		replace: true,
// 		transclude: false,
// 		templateUrl: "components/notes/views/notes.items.view.html",
// 		link: function(scope,element,attrs){
// 			//$( "#sortable" ).sortable();
// 			//console.log(scope)
// 			//console.log(element)
// 			//console.log(attrs)
// 			//element.sortable();
// 			//console.log(scope.notes)
// 			//scope.$watch('notes', function() {

//         // all the code here...
    		
    		
			

// 			element.sortable({
// 				connectWith: ".connectedSortable",
// 		       //placeholder: "ui-state-highlight",
// 		        start: function(event, ui) {
// 		        	console.log("START START START START START")
// 		        	console.log(element)
// 		        	console.log(tempData)
		        	

// 		        	tempData.startNote = angular.copy(scope.note);
// 		        	tempData.startNoteIndex = attrs.noteindex;
// 					tempData.startNoteItemIndex = ui.item.index();
// 					tempData.startNoteItemContent = tempData.startNote.items[tempData.startNoteItemIndex];
		   			
// 		   			tempNote = angular.copy(scope.note)
// 		   			console.log(tempNote)

// 		        },
// 		        update: function(event, ui) {

// 		       // console.log(scope.tempData)	
// 	         	if (!ui.sender) {		       
// 			         console.log("UPDATE UPDATE UPDATE UPDATE UPDATE INSIDE IF" )

			        
								         

// 					var start_pos = tempData.startNoteItemIndex;
// 					var end_pos = ui.item.index();
// 					console.log(start_pos + ' - ' + end_pos);

// 					tempNote.items.splice(start_pos,1)
// 					tempNote.items.splice(end_pos,0, tempData.startNoteItemContent)
// 					//scope.note = tempNote
// 					scope.notes[tempData.startNoteIndex] = tempNote;
					
// 					console.log(scope.notes)

// 					var rast = {
//                     owner: "auk2ads@njit.edu",
//                     title: "s1",
//                     items: [ "launsdry", "apsply jobs", "gsym" ],
//                     createDate: "1/1/22016",
//                     lastModified: "1/22/2016",
//                     sharedWith: "a.frozse.ak@gmail.com"
//                 }

// 					//scope.notes[0].items.push("PUCKS")

// 					scope.$apply();

// 		   //         //console.log(scope.notes)
// 			    }   
		           
// 		        }, //end update
// 		        receive: function(event, ui){
// 		        	console.log("RECEIVE RECEIVE RECEIVE RECEIVE RECEIVE")
// 		        	console.log(tempData)

// 		        	tempData.endNote = angular.copy(scope.note);
// 		        	tempData.endNoteIndex = attrs.noteindex;
// 					tempData.endNoteItemIndex = ui.item.index();

					

// 					  //console.log("removing item: " + scope.notes[noteOriginIndex].items[start_pos]);
// 		           tempData.startNote.items.splice(tempData.startNoteItemIndex,1)
// 			       tempData.endNote.items.splice(tempData.endNoteItemIndex,0,tempData.startNoteItemContent)
// 			       console.log(tempData)

// 			       scope.notes[tempData.startNoteIndex] = tempData.startNote;
// 			       scope.notes[tempData.endNoteIndex] = tempData.endNote;
	           	
// 	           		console.log(tempData.startNote.items)
// 	           		console.log(tempData.endNote.items)

// 		           //console.log("adding after position: " + end_pos)
// 		           //console.log("adding after: " + scope.notes[noteDestinationIndex].items[end_pos])
// 		           //scope.notes[noteDestinationIndex].items.splice(end_pos,0, startItem)

// 		        	//scope.tempData = "prawns";
		        	
		        	
// 		        	// console.log(tempData)
// 		        	// //console.log(scope.note);
// 		        	var rast = {
//                     owner: "auk2ads@njit.edu",
//                     title: "s1",
//                     items: [ "launsdry", "apsply jobs", "gsym" ],
//                     createDate: "1/1/22016",
//                     lastModified: "1/22/2016",
//                     sharedWith: "a.frozse.ak@gmail.com"
//                 }
		        	
// 		           scope.$apply();
		

// 		        }

// 		    }); // end sortable

// 		 //  }); //end watch



// 		},
// 		controller: function($scope){

// 			$scope.moose = "ding"
// 			$scope.deleteItem = function(parentIndex, index){
// 				console.log(parentIndex)
// 				console.log(index)
// 				$scope.notes[parentIndex].items.splice(index,1)

// 			}

// 			$scope.randomId = function(item){
//    			 return "ID" + item + (Math.floor((Math.random() * 999) + 1));
// 			}
// 			//alert("controller");
// 			// $scope.dogs = $scope.data + "dogs";
// 			// if($scope.draggable)
// 			// 	$scope.dragStatus = false;
// 			// else $scope.dragStatus = true;

// 			console.log($scope)

			
// 		}
// 	}
// } //end notecard directive






(function(){
	'use strict'

	angular
    	.module('notes')
    	.factory('notesService', notesService);

    notesService.$inject = ['$http']

    function notesService($http) {
    	var service = {

            getNote: getNote,
            getNotes: getNotes,
            saveNotes: saveNotes


    	};

    	return service;

    	////////////

        // gets a single note
        function getNote () {

            var note = {
                owner: "auk2@njit.edu",
                title: "todo",
                items: [ "laundry", "apply jobs", "gym" ],
                createDate: "1/1/2016",
                lastModified: "1/2/2016",
                sharedWith: "a.froze.ak@gmail.com"
            }

            return note;

        } //end getNote()


        // gets all notes
        function getNotes () {

        return $http.post('http://localhost:3000/api/notes/getNotes',{email:"moiz@gmail.com"})
                 
                
           
            
            var notes = [
                {
                    owner: "auk2@njit.edu",
                    title: "1",
                    items: [ "laundry", "apply jobs", "gym" ],
                    createDate: "1/1/2016",
                    lastModified: "1/2/2016",
                    sharedWith: "a.froze.ak@gmail.com"
                },
                {
                    owner: "auk2@njit.edu",
                    title: "2",
                    items: [ "html5 drag and drop", "socket.io", "nodejs" ],
                    createDate: "2/1/2016",
                    lastModified: "2/2/2016",
                    sharedWith: "a.froze.ak@gmail.com"
                },
                {
                    owner: "auk2@njit.edu",
                    title: "3",
                    items: [ "bose headphones", "2016 honda grill", "solid state hard drive" ],
                    createDate: "1/1/2016",
                    lastModified: "1/2/2016",
                    sharedWith: "a.froze.ak@gmail.com"
                },
                {
                    owner: "auk2@njit.edu",
                    title: "4",
                    items: [ "laundry", "apply jobs", "gym" ],
                    createDate: "1/1/2016",
                    lastModified: "1/2/2016",
                    sharedWith: "a.froze.ak@gmail.com"
                },
                {
                    owner: "auk2@njit.edu",
                    title: "5",
                    items: [ "html5 drag and drop", "socket.io", "nodejs" ],
                    createDate: "2/1/2016",
                    lastModified: "2/2/2016",
                    sharedWith: "a.froze.ak@gmail.com"
                },
                {
                    owner: "auk2@njit.edu",
                    title: "6",
                    items: [ "bose headphones", "2016 honda grill", "solid state hard drive" ],
                    createDate: "1/1/2016",
                    lastModified: "1/2/2016",
                    sharedWith: "a.froze.ak@gmail.com"
                },
                {
                    owner: "auk2@njit.edu",
                    title: "7",
                    items: [ "laundry", "apply jobs", "gym","bose headphones", "2016 honda grill", "solid state hard drive"  ],
                    createDate: "1/1/2016",
                    lastModified: "1/2/2016",
                    sharedWith: "a.froze.ak@gmail.com"
                },
                {
                    owner: "auk2@njit.edu",
                    title: "8",
                    items: [ "html5 drag and drop", "socket.io", "nodejs" ],
                    createDate: "2/1/2016",
                    lastModified: "2/2/2016",
                    sharedWith: "a.froze.ak@gmail.com"
                },
                {
                    owner: "auk2@njit.edu",
                    title: "9",
                    items: [ "bose headphones", "2016 honda grill", "solid state hard drive","html5 drag and drop", "socket.io", "nodejs"  ],
                    createDate: "1/1/2016",
                    lastModified: "1/2/2016",
                    sharedWith: "a.froze.ak@gmail.com"
                }
            ] //end notes array

            //return notes
        } //end get notes

        function saveNotes(notes) {
            return $http.post('http://localhost:3000/api/notes/updateNotes',{email:"moiz@gmail.com",notes: notes})
        }



    }

	

})();

(function() {
	'use strict'

	angular
		.module('budget')
		.controller('budgetCtrl', budgetCtrl)

	budgetCtrl.$inject = ['$scope','$http','toastr']

	function budgetCtrl($scope, $http, toastr) {
		console.log('loaded budgetCtrl');
	
		// $scope.Math = window.Math;

		    


  			// income
  			$scope.income = {}
  			$scope.income.monthly = 4500;

  			// bills
  			$scope.bills =[]
  			$scope.bills = [
  				{name:"rent", cost: 2500},
  				{name:"utilities", cost: 200},
  				{name:"car insurance", cost: 150},
  				{name:"car payment", cost: 250},
  				{name:"gas", cost: 100},
  				{name:"gym membership", cost: 50},
  				{name:"cell phone", cost: 80},

  			]

        

  			$scope.addNewBill = function(){
  				$scope.bills.push({name: $scope.newBillName, cost: 0 })
  				$scope.newBillName = "";
  			}

  			$scope.removeBillItem = function(index){
  				$scope.bills.splice(index,1);
  			}

  			//budget items
  			$scope.budgetItems = [];
  			$scope.budgetItems = [
  				{name: "eat out", budget: 100, spent: 30 },
  				{name: "clothing", budget: 200, spent: 90}
  			]

  			$scope.addNewBudgetItem = function(){
  				$scope.budgetItems.push({name: $scope.newBudgetItemName, budget: 0, spent: 0 })
  				$scope.newBudgetItemName = "";
  			}

        $scope.purchases = []
        $scope.purchases = [{category: "eat out"}]

        $scope.addPurchaseItem = function(){

        }


        $scope.monthlyOverview = {};
        $scope.monthlyOverview.billsTotal = 0;
        $scope.monthlyOverview.budgetTotal = 0;
        $scope.monthlyOverview.budgetSpentTotal = 0;
        $scope.monthlyOverview.totalEstimatedExpenditure = 0;

        
        $scope.calculateBillsTotal = function() {
          var total = 0;
          for(var i = 0; i < $scope.bills.length; i++){
            total = total + $scope.bills[i].cost;
          }
          $scope.monthlyOverview.billsTotal = total;
          $scope.calculateTotalExpenditure()
          return total;
        }

        

        $scope.calculateBudgetTotal = function() {
          var total = 0;
          for(var i = 0; i < $scope.budgetItems.length; i++){
            total = total + $scope.budgetItems[i].budget;
          }
          $scope.monthlyOverview.budgetTotal = total;
          $scope.calculateTotalExpenditure()
          return total;       
        }

        $scope.calculateBudgetSpentTotal = function() {
          var total = 0;
          for(var i = 0; i < $scope.budgetItems.length; i++){
            total = total + $scope.budgetItems[i].spent;
          }
          $scope.monthlyOverview.budgetSpentTotal = total;
          //$scope.calculateTotalExpenditure()
          return total;       
        }

        



       $scope.$watch("bills", $scope.calculateBillsTotal, true)
       $scope.$watch("budgetItems", $scope.calculateBudgetTotal, true)
       $scope.$watch("budgetItems", $scope.calculateBudgetSpentTotal, true)

     // $scope.$watch("budgetItems", $scope.calculateBudgetTotal, true)


        $scope.calculateTotalExpenditure = function  () {
             $scope.monthlyOverview.totalEstimatedExpenditure = $scope.monthlyOverview.billsTotal + $scope.monthlyOverview.budgetTotal;
        }

        $scope.calculateBillsTotal();
        $scope.calculateBudgetTotal();
        $scope.calculateBudgetSpentTotal();
        $scope.calculateTotalExpenditure();

        $scope.labels = ["Bills", "Budget", "Remaining"];
        $scope.data = [$scope.monthlyOverview.billsTotal,
                       $scope.monthlyOverview.budgetTotal,
                       $scope.income.monthly - $scope.monthlyOverview.totalEstimatedExpenditure];





	}

})();



angular
    .module('notes')
    .directive('noteCard', noteCard);

function noteCard() {
	return{
		restrict: 'E',
		scope: {
			data: "=",
			draggable: "="
		},
		replace: true,
		template: "<h1>{{dogs}}{{dragStatus}}</h1>",
		link: function(scope,element){
			element.click(function(){
				console.log(element)
				element[0].draggable = true;
			})
		},
		controller: function($scope){
			//alert("controller");
			$scope.dogs = $scope.data + "dogs";
			if($scope.draggable)
				$scope.dragStatus = false;
			else $scope.dragStatus = true;

			
		}
	}
}



// angular
//     .module('notes')
//     .directive('noteCard', noteCard);

// function noteCard() {
// 	return{
// 		restrict: 'E',
// 		controller: function($scope){
// 			alert("controller");
// 			console.log('dog')
// 		},
// 		templateUrl: '',
// 		replace: true
// 		// scope: {}
// 	}
// }
angular
    .module('notes')
    .directive('noteCards', noteCards)


    

function noteCards() {
	return{
		restrict: 'AE',
		scope: {
			notes: "=",
			newItem: "="
		},
		replace: false,
		transclude: false,
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
			$scope.form ={}
			$scope.addItem = function(index,item){
				//alert(index)
				console.log($scope.newItem)
				$scope.notes[index].items.push(item)
				$scope.form = {}
				//console.log($scope.notes[index].items)
			}

			$scope.deleteNote = function(index){
				$scope.notes.splice(index,1);
			}


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

	var tempData = {};
	var tempNote = null;

	return{
		restrict: 'AE',
		scope: {
			note: "=",
			notes: "="
		},
		replace: true,
		transclude: false,
		templateUrl: "components/notes/views/notes.items.view.html",
		link: function(scope,element,attrs){
			//$( "#sortable" ).sortable();
			//console.log(scope)
			//console.log(element)
			//console.log(attrs)
			//element.sortable();
			//console.log(scope.notes)
			//scope.$watch('notes', function() {

        // all the code here...
    		
    		
			

			element.sortable({
				connectWith: ".connectedSortable",
		       //placeholder: "ui-state-highlight",
		        start: function(event, ui) {
		        	console.log("START START START START START")
		        	console.log(element)
		        	console.log(tempData)
		        	

		        	tempData.startNote = angular.copy(scope.note);
		        	tempData.startNoteIndex = attrs.noteindex;
					tempData.startNoteItemIndex = ui.item.index();
					tempData.startNoteItemContent = tempData.startNote.items[tempData.startNoteItemIndex];
		   			
		   			tempNote = angular.copy(scope.note)
		   			console.log(tempNote)

		        },
		        update: function(event, ui) {

		       // console.log(scope.tempData)	
	         	if (!ui.sender) {		       
			         console.log("UPDATE UPDATE UPDATE UPDATE UPDATE INSIDE IF" )

			        
								         

					var start_pos = tempData.startNoteItemIndex;
					var end_pos = ui.item.index();
					console.log(start_pos + ' - ' + end_pos);

					tempNote.items.splice(start_pos,1)
					tempNote.items.splice(end_pos,0, tempData.startNoteItemContent)
					//scope.note = tempNote
					scope.notes[tempData.startNoteIndex] = tempNote;
					
					console.log(scope.notes)

					var rast = {
                    owner: "auk2ads@njit.edu",
                    title: "s1",
                    items: [ "launsdry", "apsply jobs", "gsym" ],
                    createDate: "1/1/22016",
                    lastModified: "1/22/2016",
                    sharedWith: "a.frozse.ak@gmail.com"
                }

					//scope.notes[0].items.push("PUCKS")

					scope.$apply();

		   //         //console.log(scope.notes)
			    }   
		           
		        }, //end update
		        receive: function(event, ui){
		        	console.log("RECEIVE RECEIVE RECEIVE RECEIVE RECEIVE")
		        	console.log(tempData)

		        	tempData.endNote = angular.copy(scope.note);
		        	tempData.endNoteIndex = attrs.noteindex;
					tempData.endNoteItemIndex = ui.item.index();

					

					  //console.log("removing item: " + scope.notes[noteOriginIndex].items[start_pos]);
		           tempData.startNote.items.splice(tempData.startNoteItemIndex,1)
			       tempData.endNote.items.splice(tempData.endNoteItemIndex,0,tempData.startNoteItemContent)
			       console.log(tempData)

			       scope.notes[tempData.startNoteIndex] = tempData.startNote;
			       scope.notes[tempData.endNoteIndex] = tempData.endNote;
	           	
	           		console.log(tempData.startNote.items)
	           		console.log(tempData.endNote.items)

		           //console.log("adding after position: " + end_pos)
		           //console.log("adding after: " + scope.notes[noteDestinationIndex].items[end_pos])
		           //scope.notes[noteDestinationIndex].items.splice(end_pos,0, startItem)

		        	//scope.tempData = "prawns";
		        	
		        	
		        	// console.log(tempData)
		        	// //console.log(scope.note);
		        	var rast = {
                    owner: "auk2ads@njit.edu",
                    title: "s1",
                    items: [ "launsdry", "apsply jobs", "gsym" ],
                    createDate: "1/1/22016",
                    lastModified: "1/22/2016",
                    sharedWith: "a.frozse.ak@gmail.com"
                }
		        	
		           scope.$apply();
		

		        }

		    }); // end sortable

		 //  }); //end watch



		},
		controller: function($scope){

			$scope.moose = "ding"
			$scope.deleteItem = function(parentIndex, index){
				console.log(parentIndex)
				console.log(index)
				$scope.notes[parentIndex].items.splice(index,1)

			}

			$scope.randomId = function(item){
   			 return "ID" + item + (Math.floor((Math.random() * 999) + 1));
			}
			//alert("controller");
			// $scope.dogs = $scope.data + "dogs";
			// if($scope.draggable)
			// 	$scope.dragStatus = false;
			// else $scope.dragStatus = true;

			console.log($scope)

			
		}
	}
} //end notecard directive






(function(){
	'use strict'

	angular
    	.module('budget')
    	.factory('budgetService', budgetService);

    budgetService.$inject = ['$http']

    function budgetService($http) {
    	var service = {

            getNote: getNote,
            getNotes: getNotes,
            saveNotes: saveNotes


    	};

    	return service;

    	////////////

        // gets a single note
        function getNote () {

            var note = {
                owner: "auk2@njit.edu",
                title: "todo",
                items: [ "laundry", "apply jobs", "gym" ],
                createDate: "1/1/2016",
                lastModified: "1/2/2016",
                sharedWith: "a.froze.ak@gmail.com"
            }

            return note;

        } //end getNote()


        // gets all notes
        function getNotes () {

        return $http.post('http://localhost:3000/api/notes/getNotes',{email:"moiz@gmail.com"})
                 
                
           
            
            var notes = [
                {
                    owner: "auk2@njit.edu",
                    title: "1",
                    items: [ "laundry", "apply jobs", "gym" ],
                    createDate: "1/1/2016",
                    lastModified: "1/2/2016",
                    sharedWith: "a.froze.ak@gmail.com"
                },
                {
                    owner: "auk2@njit.edu",
                    title: "2",
                    items: [ "html5 drag and drop", "socket.io", "nodejs" ],
                    createDate: "2/1/2016",
                    lastModified: "2/2/2016",
                    sharedWith: "a.froze.ak@gmail.com"
                },
                {
                    owner: "auk2@njit.edu",
                    title: "3",
                    items: [ "bose headphones", "2016 honda grill", "solid state hard drive" ],
                    createDate: "1/1/2016",
                    lastModified: "1/2/2016",
                    sharedWith: "a.froze.ak@gmail.com"
                },
                {
                    owner: "auk2@njit.edu",
                    title: "4",
                    items: [ "laundry", "apply jobs", "gym" ],
                    createDate: "1/1/2016",
                    lastModified: "1/2/2016",
                    sharedWith: "a.froze.ak@gmail.com"
                },
                {
                    owner: "auk2@njit.edu",
                    title: "5",
                    items: [ "html5 drag and drop", "socket.io", "nodejs" ],
                    createDate: "2/1/2016",
                    lastModified: "2/2/2016",
                    sharedWith: "a.froze.ak@gmail.com"
                },
                {
                    owner: "auk2@njit.edu",
                    title: "6",
                    items: [ "bose headphones", "2016 honda grill", "solid state hard drive" ],
                    createDate: "1/1/2016",
                    lastModified: "1/2/2016",
                    sharedWith: "a.froze.ak@gmail.com"
                },
                {
                    owner: "auk2@njit.edu",
                    title: "7",
                    items: [ "laundry", "apply jobs", "gym","bose headphones", "2016 honda grill", "solid state hard drive"  ],
                    createDate: "1/1/2016",
                    lastModified: "1/2/2016",
                    sharedWith: "a.froze.ak@gmail.com"
                },
                {
                    owner: "auk2@njit.edu",
                    title: "8",
                    items: [ "html5 drag and drop", "socket.io", "nodejs" ],
                    createDate: "2/1/2016",
                    lastModified: "2/2/2016",
                    sharedWith: "a.froze.ak@gmail.com"
                },
                {
                    owner: "auk2@njit.edu",
                    title: "9",
                    items: [ "bose headphones", "2016 honda grill", "solid state hard drive","html5 drag and drop", "socket.io", "nodejs"  ],
                    createDate: "1/1/2016",
                    lastModified: "1/2/2016",
                    sharedWith: "a.froze.ak@gmail.com"
                }
            ] //end notes array

            //return notes
        } //end get notes

        function saveNotes(notes) {
            return $http.post('http://localhost:3000/api/notes/updateNotes',{email:"moiz@gmail.com",notes: notes})
        }



    }

	

})();

angular
    .module('auth', [
      
    ]);
angular
    .module('members', [
      
    ]);
(function(){
	'use strict'

angular
	.module('notify', [
	  
	]);

})();



angular
    .module('register', [
    	'auth'
    ]);
(function(){
	'use strict'

angular
	.module('sample', [
	  
	]);

})();


angular
    .module('notes', [
      
    ]);
angular
    .module('budget', [
      'chart.js'
    ]);
(function(){
    'use strict'

    angular
        .module('auth')
        .factory('authInterceptor', authInterceptor);

    authInterceptor.$inject = ['authService']

    function authInterceptor(authService) {



        var service = {

            request: request,
            response: response

        };

        return service;

        ////////////

        function request(config) {

            //console.log("authInterceptor request function")

            var token = authService.getToken();

            if(token){
                config.headers.token = token;
                console.log("token present");
            }
            else{
                console.log("no token");
            }    
            return config;
        }

        function response(response) {
            //console.log("authInterceptor response function")
            return response;
        }

    } //end authInterceptor

    

})();

(function(){
	//'use strict'

	angular
    	.module('auth',[])
    	.factory('authService', authService);

    authService.$inject = ['$window','$http','toastr','$state','$rootScope','$location','$q'];

    function authService($window,$http,toastr,$state,$rootScope,$location,$q) {

    

    	var service = {

            info: info,

            login: login,
            logout: logout,

    		setToken: setToken,
            getToken: getToken,
    		clearToken: clearToken,

            isAuthenticated: isAuthenticated, // verifies token
            isAuthorized: isAuthorized // verifies route permissions

    	};

    	return service;

    	////////////

        function info () {
            //console.log("auth service");
        }

        // redirect takes route string ie. 'app.home'
        function login (userLoginData, redirect) {
            $http.post('http://localhost:3000/api/users/login', userLoginData)
                .then(function(res){
                   // console.log(res);
                    if(res.status == 200){
                        setToken(res.data.token);
                        $rootScope.$emit("loggedIn");  
                        toastr.success(res.data.message);

                        if(typeof(redirect) != undefined){
                            $state.go(redirect)
                        }
                        
                    }

                },
                function(err){
                    toastr.error(err.data.message)
                    console.log(err)
                })


        }

        function logout () {
            clearToken();
            $rootScope.$emit("loggedOut");
            $state.go("app.home");
            toastr.success("You have been logged out");
        }



    	function setToken (token) {
            $window.localStorage.setItem('userToken',token);
	    }

	    function getToken () {
            var token = $window.localStorage.getItem('userToken');
            return token;
	    }

	    function clearToken () {
            $window.localStorage.removeItem('userToken');
            console.log('rabbits')
	    }

        //basically are they logged in
        function isAuthenticated () {

            var token = getToken();
            if(token){
                $http.post('http://localhost:3000/api/users/authorize',{token:token})
                    .then(function (res) {
                        //console.log(res)
                        console.log('authorizing..')
                        if( res.data.success == true){
                            toastr.success("Authentication Success!")
                            console.log("Authentication Success!")
                            $rootScope.$emit("loggedIn");
                            return true;
                        } 
                        else {
                            //toastr.error("Authentication Failed")
                            console.log("Authentication Failed")
                            return false;
                        }
                    },function(err){
                        toastr.error(err.data)
                        console.log(err);
                    })
            }
            else{
                //toastr.error("authentication failed, no token present")
                console.log("authentication failed, no token present")
            } 
           
        }

        function isAuthorized (event, fromState, toState) {
                //return $q.reject();
                console.log("running is authorized")

                //event.preventDefault();
                var token = getToken();
                var userlevel = null;
                var proceed = false;

                if(token){
                  //  return $q.reject;
                   return $http.post('http://localhost:3000/api/users/authorize',{token:token})
                        .then(function (res) {
                            console.log('authorizing..')
                            if( res.data.success == true && res.data.profile.userLevel){
                                
                                console.log(res.data.profile.userLevel)
                                userLevel = res.data.profile.userLevel;

                                        //loop through permission list
                                         for(var i=0; i < toState.data.permissionLevel.length; i++){
                                           //if current userlevel matches permission level
                                           //then set proceed to true and break the for loop 
                                           console.log("current loop i : " + toState.data.permissionLevel[i])
                                           
                                           if(userLevel == toState.data.permissionLevel[i]){
                                                console.log("permission match")
                                                console.log("setting proceed true")
                                                proceed = true;
                                                break;
                                                //return toastr.success("proceed")
                                            }
                                           else {
                                                console.log("keep looking")
                                                console.log("setting proceed false")
                                                proceed = false;
                                            }  
                                        }//end for loop  
                            } // end if profile returned
                            // else no profile
                            else{
                                toastr.error("bad request")
                                proceed = false;
                            }

                            console.log("last check")
                            if(proceed == false){
                                console.log("ITS FALSE")
                                return $q.reject();
                                $state.go('app.home')
                            }
                        }) //end then
                }//end if token

                //else no token 
                else{
                    toastr.error("no token present")
                    return $q.reject();
                }
                 
            

        }//end isAuthorized
        

    }//end authService

    



	

})(); //end iffe



(function() {
	'use strict'

	angular
		.module('members')
		.controller('membersCtrl', membersCtrl)

	membersCtrl.$inject = ['$http']

	function membersCtrl($http) {

	    var vm = this;

	    vm.membersContent = membersContent();
	    vm.gotoSession = gotoSession;
	    vm.refresh = refresh;
	    vm.search = search;
	    vm.sessions = [];
	    vm.title = 'members';

	    ////////////

	    function membersContent(){
	    	 // $http.get('http://localhost:3000/api/users/all')
	    		// .then(function(res){
	    		// 	console.log(res.data)
	    		// 	vm.membersContent = res.data;
	    		// },
	    		// function(err){
	    		// 	console.log(err.status + " " + err.statusText);
	    		// 	vm.membersContent = err.data;
	    		// })
	    }

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



(function(){
	'use strict'

	angular
    	.module('sample')
    	.factory('sampleService', sampleService);

   // sampleService.inject = ['']

    function sampleService() {
    	var service = {

    		error: error,
    		info: info,
    		success: success

    	};

    	return service;

    	////////////

    	function error() {
	      /* */
	    }

	    function info() {
	      /* */
          //console.log("sampleService");
	    }

	    function success() {
	      /* */
	    }


    }

	

})();

(function() {
	'use strict'

	angular
		.module('notify')
		.controller('notifyCtrl', notifyCtrl)

	// notifyCtrl.$inject = []

	function notifyCtrl() {

	    var vm = this;

	    vm.gotoSession = gotoSession;
	    vm.refresh = refresh;
	    vm.search = search;
	    vm.sessions = [];
	    vm.title = 'notify';

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



angular
    .module('notify')
    .directive('notify', notify)

    notify.$inject = ['notifyService','$rootScope','$timeout']
    

function notify() {
	return{
		restrict: 'AE',
		template: '<li ng-repeat="item in notifyList">{{item}}</li>',
		link: function(scope,element,attrs){

		var li = angular.element(element.children()[0])
		console.log(li)
		
		animateDown = function() {
			console.log('animating')
            $(this).animate({
                top: '+=99'
            });
        };

        animateRight = function() {
        	console.log('animating')
            $(this).animate({
            	
                left: '+=50'
            });
        };

        $(li).on('click', animateRight);
       // $(li).on('click', animateRight);  
		     		
			
			    



		},
		controller: function($scope,notifyService,$rootScope,$timeout){
			console.log('notify directive')
			
			$scope.notifyList = ["dogs","cats"];			

			 $rootScope.$on('pushed',function(event,message){
			 	console.log("directive: receiving");
			 	$scope.notifyList.push(message.data);
			 				 	$scope.$apply();
			 	// $timeout(function(){
			 	// 	$scope.data = null;
			 	// },3000)

			 })
			
		}
	}
} //end notify directive

(function(){
    'use strict'

    angular
        .module('notify')
        .factory('notifyService', notifyService);

    notifyService.$inject = ['$rootScope']

    function notifyService($rootScope) {
        var service = {

            push: push,


        };

        return service;

        ////////////

        function push(message) {
            console.log("pushing from service");
            $rootScope.$emit("pushed", message);

        }



    }

    

})();

(function() {
	'use strict'

	angular
		.module('register')
		.controller('registerCtrl', registerCtrl)

	registerCtrl.inject = ['toastr','$http','registerService']

	function registerCtrl(toastr,$http,registerService) {

	    var vm = this;

	    vm.form = {}
	    vm.submitStatus = "";
	    vm.submitForm = submitForm;
	    
	    //display info on load
	    info();

	    ////////////

	    function submitForm(isValid) {
	    	
	    	console.log(vm.form);
	    	
	    	// check to make sure the form is completely valid
		    if (isValid) {
		      console.log("Valid Form");
		      sendForm(vm.form);
		    }
	    }

	    //sends form to api
	    function sendForm(form) {
			registerService.newUser(vm,form)
	    }

	    function info() {
	      /* */
	      console.log("register controller")
	    }

	}

})();



angular
    .module('register')
    .directive('registerDir', registerDir);

function registerDir() {
	return{
		restrict: 'E',
		templateUrl: '',
		replace: true
		// scope: {}
	}
}
(function(){
	'use strict'

	angular
    	.module('register')
    	.factory('registerService', registerService);

    registerService.inject = ['$http','toastr','authService','$state','$rootScope']

    function registerService($http,toastr,authService,$state,$rootScope) {
    	var service = {

            newUser: newUser,
    		error: error,
    		info: info,
    		success: success

    	};

    	return service;

    	////////////

        function newUser(vm, form) {
            $http.post('http://localhost:3000/api/users/newUser', form)
            .then(function(res) {
              
              authService.setToken(res.data.token);

              //toast
              toastr.success('You are now my Beta!');
              console.log(res);

              //change status on view
              vm.submitStatus = "Success";
             
              //empty form
              vm.form = "";

              //redirect
              $state.go('app.members');

              $rootScope.$emit("loggedIn");

            }, function(err) {
              toastr.error('Failed: ' + err.data);
            });
        }

    	function error() {
	      /* */
	    }

	    function info() {
	      /* */
          console.log("registerService");
	    }

	    function success() {
	      /* */
	    }


    }

	

})();

(function() {
	'use strict'

	angular
		.module('sample')
		.controller('sampleCtrl', sampleCtrl)

	sampleCtrl.$inject = []

	function sampleCtrl() {

	    var vm = this;

	    vm.gotoSession = gotoSession;
	    vm.refresh = refresh;
	    vm.search = search;
	    vm.sessions = [];
	    vm.title = 'Sample';

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



angular
    .module('sample')
    .directive('sampleDir', sampleDir);

function sampleDir() {
	return{
		restrict: 'E',
		templateUrl: '',
		replace: true
		// scope: {}
	}
}
(function(){
	'use strict'

	angular
    	.module('sample')
    	.factory('sampleService', sampleService);

    sampleService.$inject = []

    function sampleService() {
    	var service = {

    		error: error,
    		info: info,
    		success: success

    	};

    	return service;

    	////////////

    	function error() {
	      /* */
	    }

	    function info() {
	      /* */
          console.log("sampleService");
	    }

	    function success() {
	      /* */
	    }


    }

	

})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUuanMiLCJjb250cm9sbGVycy9hcHAuY29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2FwcC5ob21lLmNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9hcHAubG9naW4uY29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2FwcC5uYXYuY29udHJvbGxlci5qcyIsImRpcmVjdGl2ZXMvc2VsZWN0VGV4dC5kaXJlY3RpdmUuanMiLCJyb3V0ZXMvYXBwLnJvdXRlcy5qcyIsIm5vdGVzL2NvbnRyb2xsZXJzL25vdGVzLmNvbnRyb2xsZXIuanMiLCJub3Rlcy9kaXJlY3RpdmVzL25vdGVzLmRpcmVjdGl2ZS5iYWNrdXAuanMiLCJub3Rlcy9kaXJlY3RpdmVzL25vdGVzLmRpcmVjdGl2ZS5qcyIsIm5vdGVzL3NlcnZpY2VzL25vdGVzLnNlcnZpY2UuanMiLCJidWRnZXQvY29udHJvbGxlcnMvYnVkZ2V0LmNvbnRyb2xsZXIuanMiLCJidWRnZXQvZGlyZWN0aXZlcy9ub3Rlcy5kaXJlY3RpdmUuYmFja3VwLmpzIiwiYnVkZ2V0L2RpcmVjdGl2ZXMvbm90ZXMuZGlyZWN0aXZlLmpzIiwiYnVkZ2V0L3NlcnZpY2VzL2J1ZGdldC5zZXJ2aWNlLmpzIiwiYXV0aC9hdXRoLm1vZHVsZS5qcyIsIm1lbWJlcnMvbWVtYmVycy5tb2R1bGUuanMiLCJub3RpZnkvbm90aWZ5Lm1vZHVsZS5qcyIsInJlZ2lzdGVyL3JlZ2lzdGVyLm1vZHVsZS5qcyIsInNhbXBsZUNvbXBvbmVudC9zYW1wbGUubW9kdWxlLmpzIiwibm90ZXMvbm90ZXMubW9kdWxlLmpzIiwiYnVkZ2V0L2J1ZGdldC5tb2R1bGUuanMiLCJhdXRoL3NlcnZpY2VzL2F1dGguc2VydmljZS5pbnRlcmNlcHRvci5qcyIsImF1dGgvc2VydmljZXMvYXV0aC5zZXJ2aWNlLmpzIiwibWVtYmVycy9jb250cm9sbGVycy9tZW1iZXJzLmNvbnRyb2xsZXIuanMiLCJtZW1iZXJzL3NlcnZpY2VzL21lbWJlcnMuc2VydmljZS5qcyIsIm5vdGlmeS9jb250cm9sbGVycy9ub3RpZnkuY29udHJvbGxlci5qcyIsIm5vdGlmeS9kaXJlY3RpdmVzL25vdGlmeS5kaXJlY3RpdmUuanMiLCJub3RpZnkvc2VydmljZXMvbm90aWZ5LnNlcnZpY2UuanMiLCJyZWdpc3Rlci9jb250cm9sbGVycy9yZWdpc3Rlci5jb250cm9sbGVyLmpzIiwicmVnaXN0ZXIvZGlyZWN0aXZlcy9yZWdpc3Rlci5kaXJlY3RpdmUuanMiLCJyZWdpc3Rlci9zZXJ2aWNlcy9yZWdpc3Rlci5zZXJ2aWNlLmpzIiwic2FtcGxlQ29tcG9uZW50L2NvbnRyb2xsZXJzL3NhbXBsZS5jb250cm9sbGVyLmpzIiwic2FtcGxlQ29tcG9uZW50L2RpcmVjdGl2ZXMvc2FtcGxlLmRpcmVjdGl2ZS5qcyIsInNhbXBsZUNvbXBvbmVudC9zZXJ2aWNlcy9zYW1wbGUuc2VydmljZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeklBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtcbiAgICAndXNlIHN0cmljdCdcblxuYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcCcsIFtcbiAgICAgICAgJ2F1dGgnLFxuICAgIFx0J3VpLnJvdXRlcicsXG4gICAgXHQnbmdBbmltYXRlJyxcbiAgICBcdCdzYW1wbGUnLFxuICAgIFx0J3JlZ2lzdGVyJyxcbiAgICBcdCd0b2FzdHInLFxuICAgIFx0J21lbWJlcnMnLFxuICAgIFx0J25vdGVzJyxcbiAgICAgICAgJ2J1ZGdldCcsXG4gICAgICAgICdjaGFydC5qcycsXG4gICAgICAgICdub3RpZnknLFxuICAgICAgICAndWkudGlueW1jZSdcbiAgICBdKVxuXG4vLyAuY29uZmlnKGZ1bmN0aW9uKCRodHRwUHJvdmlkZXIpIHtcblxuLy8gICAgIC8vIGF0dGFjaCBvdXIgYXV0aCBpbnRlcmNlcHRvciB0byB0aGUgaHR0cCByZXF1ZXN0c1xuLy8gICAgICRodHRwUHJvdmlkZXIuaW50ZXJjZXB0b3JzLnB1c2goJ2F1dGhJbnRlcmNlcHRvcicpO1xuXG4vLyB9KVxuXG5cbi5ydW4oWyckcm9vdFNjb3BlJywnJHN0YXRlJywnYXV0aFNlcnZpY2UnLCckcScsZnVuY3Rpb24oJHJvb3RTY29wZSwgJHN0YXRlLCBhdXRoU2VydmljZSAsJHEpIHtcbiAgICBhdXRoU2VydmljZS5pbmZvKCk7XG5cbiAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlRXJyb3InLCBmdW5jdGlvbiAoZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMsIGVycm9yKSB7XG4gICAgICAgICAgIFxuICAgICAgICAgIC8vIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgIGNvbnNvbGUubG9nKFwiU1RBVEUgQ0hBTkdFIEVSUk9SIEVSUk9SIEVSUk9SIEVSUk9SRVJST1JcIik7XG4gICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmhvbWUnKVxuICAgICAgICBcbiAgICAgIH0pO1xuXG4gICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN0YXJ0JywgZnVuY3Rpb24gKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zKSB7XG4gICAgLy9hdXRoU2VydmljZS5pbmZvKCk7XG4gICAgLy9hdXRoU2VydmljZS5pc0F1dGhvcml6ZWQoIGV2ZW50LCBmcm9tU3RhdGUsIHRvU3RhdGUpO1xuICAgIC8vY29uc29sZS5sb2coXCJzdGF0ZSBjaGFuZ2luZ1wiKTtcbiAgICAvL2NvbnNvbGUubG9nKHRvU3RhdGUpXG5cbiAgICAgICAgaWYodG9TdGF0ZS5kYXRhLnBlcm1pc3Npb24gPT09IHRydWUpe1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5lZWQgcGVybWlzc2lvblwiKTtcbiAgICAgICAgICAgIC8vdG9TdGF0ZS5yZXNvbHZlID0gdG9TdGF0ZS5yZXNvbHZlIHx8IHt9O1xuICAgICAgICAgICAgLy90b1N0YXRlLnJlc29sdmUgPSB7fTtcblxuICAgICAgICAgICAgLy9jaGVjayB0byBzZWUgaWYgdGhlcmUgd2FzIGEgcmVzb2x2ZSBhbHJlYWR5IGFkZGVkXG4gICAgICAgICAgICBpZighdG9TdGF0ZS5yZXNvbHZlLmF1dGhvcml6YXRpb25SZXNvbHZlcil7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2FkZGluZyBhdXRoIHJlc29sdmVyJyk7XG4gICAgICAgICAgICAgICAgLy9hZGQgcmVzb2x2ZXJcbiAgICAgICAgICAgICAgICB0b1N0YXRlLnJlc29sdmUuYXV0aG9yaXphdGlvblJlc29sdmVyID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhdXRoU2VydmljZS5pc0F1dGhvcml6ZWQoZXZlbnQsIGZyb21TdGF0ZSwgdG9TdGF0ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJqdXN0IGFkZGVkOiBcIilcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHRvU3RhdGUucmVzb2x2ZS5hdXRob3JpemF0aW9uUmVzb2x2ZXIpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgIC8vanVzdCB0byBzaG93IHRoYXQgdGhlIHJlc29sdmVyIHdhcyBhbHJlYWR5IGFkZGVkXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyh0b1N0YXRlLnJlc29sdmUuYXV0aG9yaXphdGlvblJlc29sdmVyKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gLy9lbmQgaWYgbmVlZHMgcGVybWlzc2lvblxuXG5cbiAgICB9KTsgLy9lbmQgcm9vdFNjb3BlLiRvblxuXG5cbiAgICBcblxufV0pOyAvL2VuZCAucnVuXG5cblxuXG5cblxufSkoKTsgLy9lbmQgaWZmZVxuXG4iLCIoZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0J1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCdhcHAnKVxuXHRcdC5jb250cm9sbGVyKCdhcHBDdHJsJywgYXBwQ3RybClcblxuXHRhcHBDdHJsLiRpbmplY3QgPSBbJ3NhbXBsZVNlcnZpY2UnLCdhdXRoU2VydmljZScsJyRzdGF0ZScsJyRodHRwJywndG9hc3RyJywnJHJvb3RTY29wZScsJ25vdGlmeVNlcnZpY2UnXVxuXG5cdGZ1bmN0aW9uIGFwcEN0cmwoc2FtcGxlU2VydmljZSxhdXRoU2VydmljZSwkc3RhdGUsICRodHRwLCB0b2FzdHIsICRyb290U2NvcGUsbm90aWZ5U2VydmljZSkge1xuXG5cdFx0IHZhciB2bSA9IHRoaXM7XG5cblx0XHQgLy8gb24gaW5pdGlhbCBsb2FkXG5cdFx0IC8vIHVzZXIgbG9naW4gc3RhdHVzXG5cdFx0IHZtLmlzTG9nZ2VkID0gYXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKHZtKTtcblxuXHRcdCAkcm9vdFNjb3BlLiRvbignbG9nZ2VkSW4nLGZ1bmN0aW9uKCl7XG5cdFx0IFx0dm0uaXNMb2dnZWQgPSB0cnVlO1xuXHRcdCB9KVxuXG5cdFx0ICRyb290U2NvcGUuJG9uKCdsb2dnZWRPdXQnLGZ1bmN0aW9uKCl7XG5cdFx0IFx0dm0uaXNMb2dnZWQgPSBmYWxzZTtcblx0XHQgfSlcblxuXHRcdCB2YXIgbWVzc2FnZSA9IHtkYXRhIDogXCJyb29zdHNcIn07XG5cdFx0IC8vbm90aWZ5U2VydmljZS5wdXNoKCBtZXNzYWdlKTtcblxuXHRcdCAvL2FsZXJ0KFwid2F0Y2hpbmdcIik7XG5cblxuXHR9IC8vZW5kIGFwcEN0cmxcblxufSkoKTs7XG5cblxuIiwiKGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCdcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnYXBwJylcblx0XHQuY29udHJvbGxlcignaG9tZUN0cmwnLCBob21lQ3RybClcblx0XHQuY29udHJvbGxlcigncGFyZW50Q3RybCcsIHBhcmVudEN0cmwpXG5cblx0aG9tZUN0cmwuaW5qZWN0ID0gWydzYW1wbGVTZXJ2aWNlJywnJHNjb3BlJ11cblxuXHRmdW5jdGlvbiBob21lQ3RybChzYW1wbGVTZXJ2aWNlLCAkc2NvcGUpIHtcblx0XHRcblx0XHRzYW1wbGVTZXJ2aWNlLmluZm8oKTtcblxuXHQgICAgdmFyIHZtID0gdGhpcztcblxuXHQgICAgdm0uZ290b1Nlc3Npb24gPSBnb3RvU2Vzc2lvbjtcblx0ICAgIHZtLnJlZnJlc2ggPSByZWZyZXNoO1xuXHQgICAgdm0uc2VhcmNoID0gc2VhcmNoO1xuXHQgICAgdm0uc2Vzc2lvbnMgPSBbXTtcblx0ICAgIHZtLnRlc3QgPSAndGVzdCc7XG5cblx0ICAgIC8vLy8vLy8vLy8vL1xuXG5cdCAgICAvLyAkc2NvcGUuJG9uKCdkb2dzJywgZnVuY3Rpb24gKCkge1xuXHQgICAgLy8gXHRjb25zb2xlLmxvZyhcInJlY2VpdmVkXCIpXG5cdCAgICAvLyB9KTtcblxuXHQgICAgZnVuY3Rpb24gZ290b1Nlc3Npb24oKSB7XG5cblx0XHR9XG5cblx0ICAgIGZ1bmN0aW9uIHJlZnJlc2goKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIHNlYXJjaCgpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblx0fSAvLyBlbmQgaG9tZUN0cmxcblxuXHRwYXJlbnRDdHJsLmluamVjdCA9IFsnc2FtcGxlU2VydmljZScsJyRzY29wZSddXG5cblx0ZnVuY3Rpb24gcGFyZW50Q3RybCgkc2NvcGUpIHtcblx0XHRcblx0ICAgIHZhciB2bSA9IHRoaXM7XG5cdCAgICAvL2NvbnNvbGUubG9nKFwicGFyZW50XCIpXG5cblx0ICAgLy8gJHNjb3BlLiRlbWl0KCdkb2dzJywnc29tZSBkYXRhJyk7XG5cblxuXHR9IC8vIGVuZCBwYXJlbnRDdHJsXG5cbn0pKCk7XG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cbiIsIlx0KGZ1bmN0aW9uKCl7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ2FwcCcpXG5cdFx0LmNvbnRyb2xsZXIoXCJsb2dpbkN0cmxcIiwgbG9naW5DdHJsKVxuXG5cdGxvZ2luQ3RybC4kaW5qZWN0ID0gWyckc2NvcGUnLCdzYW1wbGVTZXJ2aWNlJywnYXV0aFNlcnZpY2UnLCckc3RhdGUnLCckaHR0cCcsJ3RvYXN0ciddXG5cblx0ZnVuY3Rpb24gbG9naW5DdHJsKCRzY29wZSxzYW1wbGVTZXJ2aWNlLGF1dGhTZXJ2aWNlLCRzdGF0ZSwgJGh0dHAsIHRvYXN0cikge1xuXHRcdC8vc2FtcGxlU2VydmljZS5pbmZvKCk7XG5cdFx0Ly9jb25zb2xlLmxvZyhcImxvZ2luQ3RybFwiKVxuXG5cdCAgICB2YXIgdm0gPSB0aGlzO1xuXHQgICAgdm0udXNlciA9IFwiXCJcblx0ICAgIHZtLmxvZ2luRm9ybSA9IFwiXCI7XG5cdCAgICBcblx0ICAgIHZtLmxvZ2luID0gbG9naW47XG5cdCAgICB2bS5sb2dvdXQgPSBsb2dvdXQ7XG5cblx0ICAgIC8vLy8vLy8vLy8vL1xuXG5cdCAgICBmdW5jdGlvbiBsb2dpbigpIHtcblx0ICAgIFx0YXV0aFNlcnZpY2UubG9naW4odm0udXNlciwnYXBwLm5vdGVzJylcblx0XHRcdHZtLnVzZXIgPSBcIlwiO1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBsb2dvdXQoKSB7XG5cdCAgICBcdGNvbnNvbGUubG9nKFwibG9nZ2luZyBvdXQuLi5cIilcblx0ICAgIFx0YXV0aFNlcnZpY2UubG9nb3V0KCk7XG5cdCAgICB9XG5cblxuXHR9IC8vZW5kIGxvZ2luQ3RybFxuXG5cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0J1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCdhcHAnKVxuXHRcdC5jb250cm9sbGVyKCduYXZDdHJsJywgbmF2Q3RybClcblxuXHRuYXZDdHJsLmluamVjdCA9IFsnJ11cblxuXHRmdW5jdGlvbiBuYXZDdHJsKCkge1xuXHRcdFxuXHRcdC8vY29uc29sZS5sb2coJ25hdiBjb250cm9sbGVyJyk7XG5cblx0ICAgIHZhciB2bSA9IHRoaXM7XG5cblxuXHQgICAgdm0ubG9nZ2VkSW4gPSB0cnVlO1xuXHQgICAgdm0uZ290b1Nlc3Npb24gPSBnb3RvU2Vzc2lvbjtcblx0ICAgIHZtLnJlZnJlc2ggPSByZWZyZXNoO1xuXHQgICAgdm0uc2VhcmNoID0gc2VhcmNoO1xuXHQgICAgdm0uc2Vzc2lvbnMgPSBbXTtcblx0ICAgIHZtLnRpdGxlID0gJ05hdic7XG5cdCAgICAvLyRzY29wZS50aXRsZSA9IFwibW91c2VcIjtcblxuXHQgICAgLy8vLy8vLy8vLy8vXG5cblx0ICAgIGZ1bmN0aW9uIGdvdG9TZXNzaW9uKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiByZWZyZXNoKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBzZWFyY2goKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cdH1cblxufSkoKTtcblxuXG4iLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwJylcbiAgICAuZGlyZWN0aXZlKCdzZWxlY3RUZXh0Jywgc2VsZWN0VGV4dClcbiAgICBcbiAgICBzZWxlY3RUZXh0LiRpbmplY3QgPSBbJyR3aW5kb3cnXVxuXG5mdW5jdGlvbiBzZWxlY3RUZXh0KCR3aW5kb3cpe1xuICAgIHJldHVybiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgZWxlbWVudC5iaW5kKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghJHdpbmRvdy5nZXRTZWxlY3Rpb24oKS50b1N0cmluZygpKSB7XG4gICAgICAgIHRoaXMuc2V0U2VsZWN0aW9uUmFuZ2UodGhpcy52YWx1ZS5sZW5ndGgsIHRoaXMudmFsdWUubGVuZ3RoKVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xufVxuXG5cbiIsIlxuYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG5cdC5jb25maWcoWyckdXJsUm91dGVyUHJvdmlkZXInLCckc3RhdGVQcm92aWRlcicsJyRodHRwUHJvdmlkZXInLGZ1bmN0aW9uKCR1cmxSb3V0ZXJQcm92aWRlciwkc3RhdGVQcm92aWRlciwkaHR0cFByb3ZpZGVyKXtcblx0XHRcblx0XHQkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCdob21lJyk7XG5cdFx0Ly9zdGF0ZXNcblx0XHQkc3RhdGVQcm92aWRlclxuXG5cdFx0LmRlY29yYXRvcigncGF0aCcsIGZ1bmN0aW9uKHN0YXRlLCBwYXJlbnRGbikge1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhcImNvbmZpZ3VyaW5nIHN0YXRlc1wiKVx0XG5cdFx0XHRpZiAoc3RhdGUuc2VsZi5yZXNvbHZlID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0c3RhdGUuc2VsZi5yZXNvbHZlID0ge307XG5cdFx0XHRcdHN0YXRlLnJlc29sdmUgPSBzdGF0ZS5zZWxmLnJlc29sdmU7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcGFyZW50Rm4oc3RhdGUpO1xuICAgICAgICAgfSlcblxuXHRcdC5zdGF0ZSgnYXBwJyx7XG5cdFx0XHRhYnN0cmFjdDogdHJ1ZSxcblx0XHRcdHRlbXBsYXRlVXJsOidhcHAvdmlld3MvYXBwLnZpZXcuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnYXBwQ3RybCcsXG5cdFx0XHRjb250cm9sbGVyQXM6ICdhcHAnXG5cblx0XHR9KVxuXG5cdFx0LnN0YXRlKCdhcHAuaG9tZScse1xuXHRcdFx0dXJsOiAnL2hvbWUnLFxuXHRcdFx0dGVtcGxhdGVVcmw6J2FwcC92aWV3cy9hcHAuaG9tZS5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdob21lQ3RybCcsXG5cdFx0XHRjb250cm9sbGVyQXM6ICdob21lJyxcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0cGVybWlzc2lvbjogZmFsc2UsXG5cdFx0XHRcdHBlcm1pc3Npb25MZXZlbDogWydldmVyeW9uZSddXG5cdFx0XHR9XG5cdFx0fSlcblxuXHRcdC5zdGF0ZSgnYXBwLnJlZ2lzdGVyJyx7XG5cdFx0XHR1cmw6ICcvcmVnaXN0ZXInLFxuXHRcdFx0dGVtcGxhdGVVcmw6J2NvbXBvbmVudHMvcmVnaXN0ZXIvdmlld3MvcmVnaXN0ZXIudmlldy5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdyZWdpc3RlckN0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAncmVnaXN0ZXInLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRwZXJtaXNzaW9uOiBmYWxzZSxcblx0XHRcdFx0cGVybWlzc2lvbkxldmVsOiBbJ2V2ZXJ5b25lJ11cblx0XHRcdH1cblx0XHR9KVxuXG5cdFx0LnN0YXRlKCdhcHAubWVtYmVycycse1xuXHRcdFx0dXJsOiAnL21lbWJlcnMnLFxuXHRcdFx0dGVtcGxhdGVVcmw6J2NvbXBvbmVudHMvbWVtYmVycy92aWV3cy9tZW1iZXJzLmhvbWUuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnbWVtYmVyc0N0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAnbWVtYmVycycsXG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdHBlcm1pc3Npb246IHRydWUsXG5cdFx0XHRcdHBlcm1pc3Npb25MZXZlbDogWydhZG1pbicsJ21lbWJlciddXG5cdFx0XHR9XG5cdFx0fSlcblxuXHRcdC5zdGF0ZSgnYXBwLm5vdGVzJyx7XG5cdFx0XHR1cmw6ICcvbm90ZXMnLFxuXHRcdFx0dGVtcGxhdGVVcmw6J2NvbXBvbmVudHMvbm90ZXMvdmlld3Mvbm90ZXMudmlldy5odG1sJyxcblxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRwZXJtaXNzaW9uOiB0cnVlLFxuXHRcdFx0XHRwZXJtaXNzaW9uTGV2ZWw6IFsnYWRtaW4nLCdtZW1iZXInXVxuXHRcdFx0fVxuXHRcdH0pXG5cblx0XHQuc3RhdGUoJ2FwcC5idWRnZXQnLHtcblx0XHRcdHVybDogJy9idWRnZXQnLFxuXHRcdFx0dGVtcGxhdGVVcmw6J2NvbXBvbmVudHMvYnVkZ2V0L3ZpZXdzL2J1ZGdldC52aWV3Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ2J1ZGdldEN0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAnYnVkZ2V0Jyxcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0cGVybWlzc2lvbjogdHJ1ZSxcblx0XHRcdFx0cGVybWlzc2lvbkxldmVsOiBbJ2FkbWluJ11cblx0XHRcdH1cblx0XHR9KVxuXG5cdFx0Ly8kaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKCdhdXRoSW50ZXJjZXB0b3InKTtcblxuXG5cblx0fV0pO1xuXG4iLCIoZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0J1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCdub3RlcycpXG5cdFx0LmNvbnRyb2xsZXIoJ25vdGVzQ3RybCcsIG5vdGVzQ3RybClcblxuXHRub3Rlc0N0cmwuJGluamVjdCA9IFsnbm90ZXNTZXJ2aWNlJywnJHNjb3BlJywnJGh0dHAnLCd0b2FzdHInLCckd2luZG93J11cblxuXHRmdW5jdGlvbiBub3Rlc0N0cmwobm90ZXNTZXJ2aWNlLCRzY29wZSwgJGh0dHAsIHRvYXN0ciwgJHdpbmRvdykge1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0Y29uc29sZS5sb2coXCJub3RlcyBiYWxsc291dFwiKTtcblxuXHRcdHZtLmdldE5vdGVzID0gZ2V0Tm90ZXMoKTtcblx0XHR2bS5hbGxOb3RlcyA9IG51bGw7XG5cdFx0dm0uYWN0aXZlTm90ZXMgPSBbXTtcblxuXHRcdHZtLmFkZE5vdGUgPSBhZGROb3RlO1xuXHRcdHZtLnNhdmVOb3RlID0gc2F2ZU5vdGU7XG5cdFx0dm0uZGVsZXRlTm90ZSA9IGRlbGV0ZU5vdGU7XG5cdFx0dm0udXBkYXRlTm90ZSA9IHVwZGF0ZU5vdGU7XG5cdFx0dm0ubmV3Tm90ZSA9IG5ld05vdGU7XG5cblx0XHR2bS5hY3RpdmF0ZSA9IGFjdGl2YXRlO1xuXHRcdHZtLmNsb3NlVGFiID0gY2xvc2VUYWI7XG5cdFx0XG5cdFx0dm0uc2hvd0xpc3QgPSB0cnVlO1xuXHRcdHZtLmdyaWRNb2RlID0gdHJ1ZTtcblxuXG5cdFx0XG5cdCAgICBcblx0ICAgXG5cdCAgXHQkc2NvcGUudGlueW1jZU9wdGlvbnMgPSB7XG5cdFx0ICAgIHBsdWdpbnM6ICdsaW5rIGltYWdlIGNvZGUnLFxuXHRcdCAgICB0b29sYmFyOiAndW5kbyByZWRvIHwgYm9sZCBpdGFsaWMgfCBhbGlnbmxlZnQgYWxpZ25jZW50ZXIgYWxpZ25yaWdodCB8IGNvZGUgfCBwYXN0ZSdcblx0XHQgIH07XG5cblx0XHQkc2NvcGUudGl0bGUgPSBcInJhdHN0c1wiO1xuXHRcdCRzY29wZS5kb2dzID1cImZyb2Fkc2FzZGZhZHNnc1wiXG5cdFx0dm0udGlueW1jZU1vZGVsID0gJ0luaXRpYWwgY29uc2RzZHRlbnQnO1xuXG4vLyBzYW1wbGUgbm90ZXNcblx0XHQvLyB2bS5hbGxOb3RlcyA9IFtcblx0XHQvLyBcdHt0aXRsZTpcImd1bHAgY2hlYXQgc2hlZXRcIixjb250ZW50Olwibm9udW1teSBuaWJoIGV1aXNtb2QgdGluY2lkdW50IHV0IGxhb3JlZXQgZG9sb3JlIG1hZ25hIGFsaXF1YW0gZXJhdCB2b2x1dHBhdC4gVXQgd2lzaSBlbmltIGFkIG1pbmltIHZlbmlhbSwgcXVpcyBub3N0cnVkIGV4ZXJjaSB0YXRpb24gdWxsYW1jb3JwZXIgc3VzY2lwaXQgbG9ib3J0aXMgbmlzbCB1dCBhbGlxdWlwIGV4IGVhIGNvbW1vZG8gY29uc2VxdWF0LiBEdWlzIGF1dGVtIHZlbCBldW0gaXJpdXJlIGRvbG9yIGluIGhlbmRyZXJpdCBpbiB2dWxwdXRhdGUgdmVsaXQgZXNzZSBtb2xlc3RpZSBjb25zZXF1YXQsIHZlbCBpbGx1bSBkb2xvcmUgZXUgZmV1Z2lhdCBudWxsYSBmYWNpbGlzaXMgYXQgdmVybyBlcm9zIGV0IGFjY3Vtc2FuIGV0IGl1c3RvIG9kaW8gZGlnbmlzc2ltIHF1aSBibGFuZGl0IHByYWVzZW50IGx1cHRhdHVtIHp6cmlsIGRlbGVuaXQgYXVndWUgZHVpcyBkb2xvcmUgdGUgZmV1Z2FpdCBudWxsYSBmYWNpbGlzaS4gTmFtIGxpYmVyIHRlbXBvciBjdW0gc29sdXRhIG5vYmlzIGVsZWlmZW5kIG9wdGlvbiBjb25ndWUgbmloaWwgaW1wZXJkaWV0IGRvbWluZyBpZCBxdW9kIG1hemltIHBsYWNlcmF0IGZhY2VyIHBvc3NpbSBhc3N1bS4gVHlwaSBub24gaGFiZW50IGNsYXJpdGF0ZW0gaW5zaXRhbTsgZXN0IHVzdXMgbGVnZW50aXMgaW4gaWlzIHF1aSBmYWNpdCBlb3J1bSBjbGFyaXRhdGVtLiBJbnZlc3RpZ2F0aW9uZXMgZGVtb25zdHJhdmVydW50IGxlY3RvcmVzIGxlZ2VyZSBtZSBsaXVzIHF1b2QgaWkgbGVndW50IHNhZXBpdXMuIENsYXJpdGFzIGVzdCBldGlhbSBwcm9jZXNzdXMgZHluYW1pY3VzLCBxdWkgc2VxdWl0dXIgbXV0YXRpb25lbSBjb25zdWV0dWRpdW0gbGVjdG9ydW0uIE1pcnVtIGVzdCBub3RhcmUgcXVhbSBsaXR0ZXJhIGdvdGhpY2EsIHF1YW0gbnVuYyBwdXRhbXVzIHBhcnVtIGNsYXJhbSwgYW50ZXBvc3Vlcml0IGxpdHRlcmFydW0gZm9ybWFzIGh1bWFuaXRhdGlzIHBlciBzZWFjdWxhIHFcIn0sXG5cdFx0Ly8gXHR7dGl0bGU6XCJtZXRlb3JcIixjb250ZW50Olwibm9udW1teSBuaWJoIGV1aXNtb2QgdGluY2lkdW50IHV0IGxhb3JlZXQgZG9sb3JlIG1hZ25hIG0gY29uc3VldHVkaXVtIGxlY3RvcnVtLiBNaXJ1bSBlc3Qgbm90YXJlIHF1YW0gbGl0dGVyYSBnb3RoaWNhLCBxdWFtIG51bmMgcHV0YW11cyBwYXJ1bSBjbGFyYW0sIGFudGVwb3N1ZXJpdCBsaXR0ZXJhcnVtIGZvcm1hcyBodW1hbml0YXRpcyBwZXIgc2VhY3VsYSBxXCJ9XG5cdFx0Ly8gXHQsXG5cdFx0Ly8gXHR7dGl0bGU6XCJqcXVlcnlcIixjb250ZW50Olwibm9udW1teSBuaWJoIGV1aXNtb2QgdGluY2lkdW50IHV0IGxhb3JlZXQgZG9sb3JlIG1hZ25hIG0gY29uc3VldHVkaXVtIGxlY3RvcnVtLiBNaXJ1bSBlc3Qgbm90YXJlIHF1YW0gbGl0dGVyYSBnb3RoaWNhLCBxdWFtIG51bmMgcHV0YW11cyBwYXJ1bSBjbGFyYW0sIGFudGVwb3N1ZXJpdCBsaXR0ZXJhcnVtIGZvcm1hcyBodW1hbml0YXRpcyBwZXIgc2VhY3VsYSBxXCJ9XG5cdFx0Ly8gXHQsXG5cdFx0Ly8gXHR7dGl0bGU6XCJhbmd1bGFyXCIsY29udGVudDpcIm5vbnVtbXkgbmliaCBldWlzbW9kIHRpbmNpZHVudCB1dCBsYW9yZWV0IGRvbG9yZSBtYWduYSBtIGNvbnN1ZXR1ZGl1bSBsZWN0b3J1bS4gTWlydW0gZXN0IG5vdGFyZSBxdWFtIGxpdHRlcmEgZ290aGljYSwgcXVhbSBudW5jIHB1dGFtdXMgcGFydW0gY2xhcmFtLCBhbnRlcG9zdWVyaXQgbGl0dGVyYXJ1bSBmb3JtYXMgaHVtYW5pdGF0aXMgcGVyIHNlYWN1bGEgcVwifVxuXHRcdC8vIFx0LFxuXHRcdC8vIFx0e3RpdGxlOlwic3dpZnRcIixjb250ZW50Olwibm9udW1teSBuaWJoIGV1aXNtb2QgdGluY2lkdW50IHV0IGxhb3JlZXQgZG9sb3JlIG1hZ25hIG0gY29uc3VldHVkaXVtIGxlY3RvcnVtLiBNaXJ1bSBlc3Qgbm90YXJlIHF1YW0gbGl0dGVyYSBnb3RoaWNhLCBxdWFtIG51bmMgcHV0YW11cyBwYXJ1bSBjbGFyYW0sIGFudGVwb3N1ZXJpdCBsaXR0ZXJhcnVtIGZvcm1hcyBodW1hbml0YXRpcyBwZXIgc2VhY3VsYSBxXCJ9XG5cblx0XHQvLyBdXG5cblx0XHQvL2dldHMgYWxsIG5vdGVzXG5cdFx0XG5cblx0XHRmdW5jdGlvbiBnZXROb3RlcygpIHtcblx0XHRcdHZhciB0b2tlbiA9ICR3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3VzZXJUb2tlbicpO1xuXHRcdFx0JGh0dHAucG9zdCgnaHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaS9ub3Rlcy9nZXRBbGxOb3Rlc01ldGEnLHt0b2tlbjogdG9rZW59KS50aGVuKGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0XHR2bS5hbGxOb3RlcyA9IGRhdGEuZGF0YS5ub3Rlcztcblx0XHRcdFx0Y29uc29sZS5sb2codm0uYWxsTm90ZXMpO1xuXHRcdFx0fSlcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBhZGROb3RlKCkge1xuXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gc2F2ZU5vdGUoKSB7XG5cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBkZWxldGVOb3RlKCkge1xuXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gdXBkYXRlTm90ZSgpIHtcblxuXHRcdH1cblxuXHRcdFxuXG5cblx0ICAgIC8vLy8vLy8vLy8vL1xuXG5cdCAgICBmdW5jdGlvbiBhY3RpdmF0ZShub3RlKSB7XG5cdCAgICBcdHZhciBwZXJtaXNzaW9uVG9BY3RpdmF0ZSA9IHRydWU7XG4gICAgXHRcdC8vIGNoZWNrcyBpZiB0YWIgYWxyZWFkeSBvcGVuXG4gICAgXHRcdGlmKHZtLmFjdGl2ZU5vdGVzLmxlbmd0aCA+IDAgJiYgdm0uYWN0aXZlTm90ZXMubGVuZ3RoICE9PSA0ICl7XG4gICAgXHRcdFx0Y29uc29sZS5sb2coJ2xvb3BpbmcnKVxuXHQgICAgXHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5hY3RpdmVOb3RlcywgZnVuY3Rpb24odmFsdWUpIHtcblx0ICAgIFx0XHRcdGNvbnNvbGUubG9nKHZhbHVlLl9pZC50b1N0cmluZygpKTtcblx0ICAgIFx0XHRcdGNvbnNvbGUubG9nKG5vdGUuX2lkLnRvU3RyaW5nKCkpO1xuXHRcdFx0XHQgIGlmKHZhbHVlLl9pZC50b1N0cmluZygpID09IG5vdGUuX2lkLnRvU3RyaW5nKCkpe1xuXHRcdFx0XHQgIFx0cGVybWlzc2lvblRvQWN0aXZhdGUgPSBmYWxzZTtcblx0XHRcdFx0ICBcdHRvYXN0ci5lcnJvcihcIldob29wcyEgTG9va3MgbGlrZSB0aGlzIG5vdGUgaXMgYWxyZWFkeSBvcGVuXCIpXG5cdFx0XHRcdCAgfVxuXHRcdFx0XHR9KTsvL2VuZCBmb3JlYWNoXG5cdFx0XHR9XG5cdFx0ICAgIGlmKHZtLmFjdGl2ZU5vdGVzLmxlbmd0aCA9PSA0KXtcblx0XHQgICAgXHRcdGNvbnNvbGUubG9nKFwiY2hlY2tpbmcgbWF4XCIpO1xuXHRcdCAgICBcdFx0cGVybWlzc2lvblRvQWN0aXZhdGUgPSBmYWxzZTtcblx0XHQgICAgXHRcdHRvYXN0ci5lcnJvcihcIldob29wcyEgTG9va3MgbGlrZSB5b3UgaGF2ZSByZWFjaGVkIHRoZSBtYXggbnVtYmVyIG9mIHRhYnMoNClcIilcblx0XHQgICAgfVxuXHRcdFxuXHQgICAgXHRpZihwZXJtaXNzaW9uVG9BY3RpdmF0ZSA9PSB0cnVlKXtcblx0XHRcdCAgXHRjb25zb2xlLmxvZyhcImVsc2UgcHVzaGluZ1wiKTtcblx0XHRcdCAgXHR2bS5hY3RpdmVOb3Rlcy5wdXNoKG5vdGUpO1xuXHRcdFx0XHRjb25zb2xlLmxvZyh2bS5hY3RpdmVOb3Rlcylcblx0XHRcdH0gXG5cdCAgICBcdFxuXHQgICAgfSAvL2VuZCBmdW5jdGlvbiBhY3RpdmF0ZVxuXG5cdCAgICBmdW5jdGlvbiBjbG9zZVRhYihpbmRleCkge1xuXHQgICAgICB2bS5hY3RpdmVOb3Rlcy5zcGxpY2UoaW5kZXgsMSk7XG5cdCAgICAgIGNvbnNvbGUubG9nKHZtLmFjdGl2ZU5vdGVzKVxuXG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIG5ld05vdGUoKSB7XG5cdCAgICBcdC8vIGZpcnN0IGNoZWNrIGlmIGFjdGl2ZSBub3RlcyBpcyBmdWxsXG5cdCAgICBcdGlmKHZtLmFjdGl2ZU5vdGVzLmxlbmd0aCA9PSA0KXtcblx0ICAgIFx0XHRyZXR1cm4gdG9hc3RyLmVycm9yKFwiV2hvb3BzISBQbGVhc2UgY2xvc2UgYSB0YWIgYmVmb3JlIGNyZWF0aW5nIGEgbmV3IG5vdGVcIik7XG5cdCAgICBcdH1cblxuXHQgICAgXHQvLyBjcmVhdGUgbmV3IG5vdGUgb2JqZWN0XG5cdCAgICBcdHZhciBuZXdOb3RlID0ge3RpdGxlOlwiZG9vZ3NcIixjb250ZW50OlwiXCIsXCJzaGFyZWRXaXRoXCI6W3tcInVzZXJcIjogXCJhdWsyQG5qaXQuZWR1XCIsIFwiY2FuRWRpdFwiOiBmYWxzZX1dfTtcblx0ICAgIFx0XG5cdCAgICBcdC8vIGdldCB0b2tlblxuXHQgICAgXHR2YXIgdG9rZW4gPSAkd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKCd1c2VyVG9rZW4nKTtcblxuXHQgICAgXHQvLyBzZW5kIG5ldyBub3RlIG9iamVjdFxuXHQgICAgXHQkaHR0cC5wb3N0KCdodHRwOi8vbG9jYWxob3N0OjMwMDAvYXBpL25vdGVzL2FkZE5vdGUnLHt0b2tlbjogdG9rZW4sIG5vdGU6IG5ld05vdGV9KS50aGVuKGZ1bmN0aW9uKGRhdGEpe1xuXHQgICAgXHRcdGNvbnNvbGUubG9nKGRhdGEpO1xuXG5cdCAgICBcdFx0Ly8gZGF0YSByZXR1cm5zIHRoZSBsaXN0IG9mIG5ldyBub3Rlc1xuXHQgICAgXHRcdHZtLmFsbE5vdGVzID0gZGF0YS5kYXRhLm5vdGVzO1xuXHQgICAgXHRcdFxuXHQgICAgXHRcdC8vIHB1c2ggbmV3IG5vdGUgdG8gYWN0aXZlIG5vdGVzXG5cdCAgICBcdFx0dmFyIG5ld05vdGVJbmRleCA9IHZtLmFsbE5vdGVzLmxlbmd0aC0xO1xuXHQgICAgXHRcdGFjdGl2YXRlKHZtLmFsbE5vdGVzW25ld05vdGVJbmRleF0pO1xuXG5cdCAgICBcdFx0Ly8gbG9nIG5ldyBhY3RpdmUgbm90ZXNcblx0ICAgIFx0XHRjb25zb2xlLmxvZyh2bS5hY3RpdmVOb3Rlcyk7XG5cdCAgICBcdH0pO1xuXHRcdFx0XG5cdCAgICBcdC8vc2Nyb2xsIHRvIHRoZSBuZXcgbm90ZVxuXHQgICAgXHR3aW5kb3cubG9jYXRpb24uaGFzaCA9IFwibm90ZXMjVW50aXRsZWRcIjtcblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gZGVsZXRlTm90ZShub3RlSWQpe1xuXHQgICAgXHRjb25zb2xlLmxvZygnZGVsZXRpbmcnKVxuXHQgICAgXHRjb25zb2xlLmxvZyhub3RlSWQpXG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIHJlZnJlc2goKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIHNlYXJjaCgpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblx0fVxuXG59KSgpO1xuXG5cbiIsIi8vIGFuZ3VsYXJcbi8vICAgICAubW9kdWxlKCdub3RlcycpXG4vLyAgICAgLmRpcmVjdGl2ZSgnbm90ZUNhcmQnLCBub3RlQ2FyZCk7XG5cbi8vIGZ1bmN0aW9uIG5vdGVDYXJkKCkge1xuLy8gXHRyZXR1cm57XG4vLyBcdFx0cmVzdHJpY3Q6ICdFJyxcbi8vIFx0XHRzY29wZToge1xuLy8gXHRcdFx0ZGF0YTogXCI9XCIsXG4vLyBcdFx0XHRkcmFnZ2FibGU6IFwiPVwiXG4vLyBcdFx0fSxcbi8vIFx0XHRyZXBsYWNlOiB0cnVlLFxuLy8gXHRcdHRlbXBsYXRlOiBcIjxoMT57e2RvZ3N9fXt7ZHJhZ1N0YXR1c319PC9oMT5cIixcbi8vIFx0XHRsaW5rOiBmdW5jdGlvbihzY29wZSxlbGVtZW50KXtcbi8vIFx0XHRcdGVsZW1lbnQuY2xpY2soZnVuY3Rpb24oKXtcbi8vIFx0XHRcdFx0Y29uc29sZS5sb2coZWxlbWVudClcbi8vIFx0XHRcdFx0ZWxlbWVudFswXS5kcmFnZ2FibGUgPSB0cnVlO1xuLy8gXHRcdFx0fSlcbi8vIFx0XHR9LFxuLy8gXHRcdGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSl7XG4vLyBcdFx0XHQvL2FsZXJ0KFwiY29udHJvbGxlclwiKTtcbi8vIFx0XHRcdCRzY29wZS5kb2dzID0gJHNjb3BlLmRhdGEgKyBcImRvZ3NcIjtcbi8vIFx0XHRcdGlmKCRzY29wZS5kcmFnZ2FibGUpXG4vLyBcdFx0XHRcdCRzY29wZS5kcmFnU3RhdHVzID0gZmFsc2U7XG4vLyBcdFx0XHRlbHNlICRzY29wZS5kcmFnU3RhdHVzID0gdHJ1ZTtcblxuXHRcdFx0XG4vLyBcdFx0fVxuLy8gXHR9XG4vLyB9XG5cblxuXG4vLyAvLyBhbmd1bGFyXG4vLyAvLyAgICAgLm1vZHVsZSgnbm90ZXMnKVxuLy8gLy8gICAgIC5kaXJlY3RpdmUoJ25vdGVDYXJkJywgbm90ZUNhcmQpO1xuXG4vLyAvLyBmdW5jdGlvbiBub3RlQ2FyZCgpIHtcbi8vIC8vIFx0cmV0dXJue1xuLy8gLy8gXHRcdHJlc3RyaWN0OiAnRScsXG4vLyAvLyBcdFx0Y29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKXtcbi8vIC8vIFx0XHRcdGFsZXJ0KFwiY29udHJvbGxlclwiKTtcbi8vIC8vIFx0XHRcdGNvbnNvbGUubG9nKCdkb2cnKVxuLy8gLy8gXHRcdH0sXG4vLyAvLyBcdFx0dGVtcGxhdGVVcmw6ICcnLFxuLy8gLy8gXHRcdHJlcGxhY2U6IHRydWVcbi8vIC8vIFx0XHQvLyBzY29wZToge31cbi8vIC8vIFx0fVxuLy8gLy8gfSIsIi8vIGFuZ3VsYXJcbi8vICAgICAubW9kdWxlKCdub3RlcycpXG4vLyAgICAgLmRpcmVjdGl2ZSgnbm90ZUNhcmRzJywgbm90ZUNhcmRzKVxuXG5cbiAgICBcblxuLy8gZnVuY3Rpb24gbm90ZUNhcmRzKCkge1xuLy8gXHRyZXR1cm57XG4vLyBcdFx0cmVzdHJpY3Q6ICdBRScsXG4vLyBcdFx0c2NvcGU6IHtcbi8vIFx0XHRcdG5vdGVzOiBcIj1cIixcbi8vIFx0XHRcdG5ld0l0ZW06IFwiPVwiXG4vLyBcdFx0fSxcbi8vIFx0XHRyZXBsYWNlOiBmYWxzZSxcbi8vIFx0XHR0cmFuc2NsdWRlOiBmYWxzZSxcbi8vIFx0XHR0ZW1wbGF0ZVVybDogXCJjb21wb25lbnRzL25vdGVzL3ZpZXdzL25vdGUuZGlyZWN0aXZlLnZpZXcuaHRtbFwiLFxuLy8gXHRcdGxpbms6IGZ1bmN0aW9uKHNjb3BlLGVsZW1lbnQsYXR0cnMpe1xuLy8gXHRcdFx0Ly8kKCBcIiNzb3J0YWJsZVwiICkuc29ydGFibGUoKTtcbi8vIFx0XHRcdC8vY29uc29sZS5sb2coc2NvcGUpXG4vLyBcdFx0XHQvL2NvbnNvbGUubG9nKGVsZW1lbnQpXG4vLyBcdFx0XHQvL2NvbnNvbGUubG9nKGF0dHJzKVxuLy8gXHRcdFx0Ly9lbGVtZW50LnNvcnRhYmxlKCk7XG4vLyBcdFx0XHQvL2NvbnNvbGUubG9nKHNjb3BlLm5vdGVzKVxuLy8gXHRcdFx0c2NvcGUuZG9ncyA9IGZ1bmN0aW9uKG5vdGUpe1xuLy8gXHRcdFx0XHRjb25zb2xlLmxvZyhub3RlKVxuLy8gXHRcdFx0fVxuXG5cbi8vIFx0XHRcdGVsZW1lbnQuc29ydGFibGUoe1xuLy8gXHRcdCAgICAgICAvLyBwbGFjZWhvbGRlcjogXCJ1aS1zdGF0ZS1oaWdobGlnaHRcIixcbi8vIFx0XHQgICAgICAgIHN0YXJ0OiBmdW5jdGlvbihldmVudCwgdWkpIHtcbi8vIFx0XHQgICAgICAgICAgICB2YXIgc3RhcnRfcG9zID0gdWkuaXRlbS5pbmRleCgpO1xuLy8gXHRcdCAgICAgICAgICAgIHVpLml0ZW0uZGF0YSgnc3RhcnRfcG9zJywgc3RhcnRfcG9zKTtcbi8vIFx0XHQgICAgICAgIH0sXG4vLyBcdFx0ICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uKGV2ZW50LCB1aSkge1xuLy8gXHRcdCAgICAgICAgICAgIHZhciBzdGFydF9wb3MgPSB1aS5pdGVtLmRhdGEoJ3N0YXJ0X3BvcycpO1xuLy8gXHRcdCAgICAgICAgICAgIHZhciBlbmRfcG9zID0gdWkuaXRlbS5pbmRleCgpO1xuLy8gXHRcdCAgICAgICAgICAgIC8vY29uc29sZS5sb2coc3RhcnRfcG9zICsgJyAtICcgKyBlbmRfcG9zKTtcblx0XHQgICAgICAgICAgXG4vLyBcdFx0ICAgICAgICAgIHZhciBzdGFydEl0ZW0gPSBzY29wZS5ub3Rlc1tzdGFydF9wb3NdO1xuLy8gXHRcdCAgICAgICAgICAgc2NvcGUubm90ZXMuc3BsaWNlKHN0YXJ0X3BvcywxKVxuLy8gXHRcdCAgICAgICAgICAgc2NvcGUubm90ZXMuc3BsaWNlKGVuZF9wb3MsMCwgc3RhcnRJdGVtKVxuLy8gXHRcdCAgICAgICAgICAgc2NvcGUuJGFwcGx5KCk7XG5cbi8vIFx0XHQgICAgICAgICAgIC8vY29uc29sZS5sb2coc2NvcGUubm90ZXMpXG5cdFx0ICAgICAgICAgICBcblx0XHQgICAgICAgICAgIFxuLy8gXHRcdCAgICAgICAgfVxuLy8gXHRcdCAgICB9KTsgLy8gZW5kIHNvcnRhYmxlXG5cblx0XHQgICBcblxuLy8gXHRcdCAgICBjb25zb2xlLmxvZyhlbGVtZW50KVxuXG5cbi8vIFx0XHR9LFxuLy8gXHRcdGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSl7XG4vLyBcdFx0XHQkc2NvcGUuZm9ybSA9e31cbi8vIFx0XHRcdCRzY29wZS5hZGRJdGVtID0gZnVuY3Rpb24oaW5kZXgsaXRlbSl7XG4vLyBcdFx0XHRcdC8vYWxlcnQoaW5kZXgpXG4vLyBcdFx0XHRcdGNvbnNvbGUubG9nKCRzY29wZS5uZXdJdGVtKVxuLy8gXHRcdFx0XHQkc2NvcGUubm90ZXNbaW5kZXhdLml0ZW1zLnB1c2goaXRlbSlcbi8vIFx0XHRcdFx0JHNjb3BlLmZvcm0gPSB7fVxuLy8gXHRcdFx0XHQvL2NvbnNvbGUubG9nKCRzY29wZS5ub3Rlc1tpbmRleF0uaXRlbXMpXG4vLyBcdFx0XHR9XG5cbi8vIFx0XHRcdCRzY29wZS5kZWxldGVOb3RlID0gZnVuY3Rpb24oaW5kZXgpe1xuLy8gXHRcdFx0XHQkc2NvcGUubm90ZXMuc3BsaWNlKGluZGV4LDEpO1xuLy8gXHRcdFx0fVxuXG5cbi8vIFx0XHRcdC8vYWxlcnQoXCJjb250cm9sbGVyXCIpO1xuLy8gXHRcdFx0Ly8gJHNjb3BlLmRvZ3MgPSAkc2NvcGUuZGF0YSArIFwiZG9nc1wiO1xuLy8gXHRcdFx0Ly8gaWYoJHNjb3BlLmRyYWdnYWJsZSlcbi8vIFx0XHRcdC8vIFx0JHNjb3BlLmRyYWdTdGF0dXMgPSBmYWxzZTtcbi8vIFx0XHRcdC8vIGVsc2UgJHNjb3BlLmRyYWdTdGF0dXMgPSB0cnVlO1xuXG5cdFx0XHRcbi8vIFx0XHR9XG4vLyBcdH1cbi8vIH0gLy9lbmQgbm90ZWNhcmRzIGRpcmVjdGl2ZVxuXG4vLyBhbmd1bGFyXG4vLyBcdC5tb2R1bGUoJ25vdGVzJylcbi8vIFx0LmRpcmVjdGl2ZSgnbm90ZUNhcmQnLCBub3RlQ2FyZClcblxuLy8gZnVuY3Rpb24gbm90ZUNhcmQoKSB7XG5cbi8vIFx0dmFyIHRlbXBEYXRhID0ge307XG4vLyBcdHZhciB0ZW1wTm90ZSA9IG51bGw7XG5cbi8vIFx0cmV0dXJue1xuLy8gXHRcdHJlc3RyaWN0OiAnQUUnLFxuLy8gXHRcdHNjb3BlOiB7XG4vLyBcdFx0XHRub3RlOiBcIj1cIixcbi8vIFx0XHRcdG5vdGVzOiBcIj1cIlxuLy8gXHRcdH0sXG4vLyBcdFx0cmVwbGFjZTogdHJ1ZSxcbi8vIFx0XHR0cmFuc2NsdWRlOiBmYWxzZSxcbi8vIFx0XHR0ZW1wbGF0ZVVybDogXCJjb21wb25lbnRzL25vdGVzL3ZpZXdzL25vdGVzLml0ZW1zLnZpZXcuaHRtbFwiLFxuLy8gXHRcdGxpbms6IGZ1bmN0aW9uKHNjb3BlLGVsZW1lbnQsYXR0cnMpe1xuLy8gXHRcdFx0Ly8kKCBcIiNzb3J0YWJsZVwiICkuc29ydGFibGUoKTtcbi8vIFx0XHRcdC8vY29uc29sZS5sb2coc2NvcGUpXG4vLyBcdFx0XHQvL2NvbnNvbGUubG9nKGVsZW1lbnQpXG4vLyBcdFx0XHQvL2NvbnNvbGUubG9nKGF0dHJzKVxuLy8gXHRcdFx0Ly9lbGVtZW50LnNvcnRhYmxlKCk7XG4vLyBcdFx0XHQvL2NvbnNvbGUubG9nKHNjb3BlLm5vdGVzKVxuLy8gXHRcdFx0Ly9zY29wZS4kd2F0Y2goJ25vdGVzJywgZnVuY3Rpb24oKSB7XG5cbi8vICAgICAgICAgLy8gYWxsIHRoZSBjb2RlIGhlcmUuLi5cbiAgICBcdFx0XG4gICAgXHRcdFxuXHRcdFx0XG5cbi8vIFx0XHRcdGVsZW1lbnQuc29ydGFibGUoe1xuLy8gXHRcdFx0XHRjb25uZWN0V2l0aDogXCIuY29ubmVjdGVkU29ydGFibGVcIixcbi8vIFx0XHQgICAgICAgLy9wbGFjZWhvbGRlcjogXCJ1aS1zdGF0ZS1oaWdobGlnaHRcIixcbi8vIFx0XHQgICAgICAgIHN0YXJ0OiBmdW5jdGlvbihldmVudCwgdWkpIHtcbi8vIFx0XHQgICAgICAgIFx0Y29uc29sZS5sb2coXCJTVEFSVCBTVEFSVCBTVEFSVCBTVEFSVCBTVEFSVFwiKVxuLy8gXHRcdCAgICAgICAgXHRjb25zb2xlLmxvZyhlbGVtZW50KVxuLy8gXHRcdCAgICAgICAgXHRjb25zb2xlLmxvZyh0ZW1wRGF0YSlcblx0XHQgICAgICAgIFx0XG5cbi8vIFx0XHQgICAgICAgIFx0dGVtcERhdGEuc3RhcnROb3RlID0gYW5ndWxhci5jb3B5KHNjb3BlLm5vdGUpO1xuLy8gXHRcdCAgICAgICAgXHR0ZW1wRGF0YS5zdGFydE5vdGVJbmRleCA9IGF0dHJzLm5vdGVpbmRleDtcbi8vIFx0XHRcdFx0XHR0ZW1wRGF0YS5zdGFydE5vdGVJdGVtSW5kZXggPSB1aS5pdGVtLmluZGV4KCk7XG4vLyBcdFx0XHRcdFx0dGVtcERhdGEuc3RhcnROb3RlSXRlbUNvbnRlbnQgPSB0ZW1wRGF0YS5zdGFydE5vdGUuaXRlbXNbdGVtcERhdGEuc3RhcnROb3RlSXRlbUluZGV4XTtcblx0XHQgICBcdFx0XHRcbi8vIFx0XHQgICBcdFx0XHR0ZW1wTm90ZSA9IGFuZ3VsYXIuY29weShzY29wZS5ub3RlKVxuLy8gXHRcdCAgIFx0XHRcdGNvbnNvbGUubG9nKHRlbXBOb3RlKVxuXG4vLyBcdFx0ICAgICAgICB9LFxuLy8gXHRcdCAgICAgICAgdXBkYXRlOiBmdW5jdGlvbihldmVudCwgdWkpIHtcblxuLy8gXHRcdCAgICAgICAvLyBjb25zb2xlLmxvZyhzY29wZS50ZW1wRGF0YSlcdFxuLy8gXHQgICAgICAgICBcdGlmICghdWkuc2VuZGVyKSB7XHRcdCAgICAgICBcbi8vIFx0XHRcdCAgICAgICAgIGNvbnNvbGUubG9nKFwiVVBEQVRFIFVQREFURSBVUERBVEUgVVBEQVRFIFVQREFURSBJTlNJREUgSUZcIiApXG5cblx0XHRcdCAgICAgICAgXG5cdFx0XHRcdFx0XHRcdFx0ICAgICAgICAgXG5cbi8vIFx0XHRcdFx0XHR2YXIgc3RhcnRfcG9zID0gdGVtcERhdGEuc3RhcnROb3RlSXRlbUluZGV4O1xuLy8gXHRcdFx0XHRcdHZhciBlbmRfcG9zID0gdWkuaXRlbS5pbmRleCgpO1xuLy8gXHRcdFx0XHRcdGNvbnNvbGUubG9nKHN0YXJ0X3BvcyArICcgLSAnICsgZW5kX3Bvcyk7XG5cbi8vIFx0XHRcdFx0XHR0ZW1wTm90ZS5pdGVtcy5zcGxpY2Uoc3RhcnRfcG9zLDEpXG4vLyBcdFx0XHRcdFx0dGVtcE5vdGUuaXRlbXMuc3BsaWNlKGVuZF9wb3MsMCwgdGVtcERhdGEuc3RhcnROb3RlSXRlbUNvbnRlbnQpXG4vLyBcdFx0XHRcdFx0Ly9zY29wZS5ub3RlID0gdGVtcE5vdGVcbi8vIFx0XHRcdFx0XHRzY29wZS5ub3Rlc1t0ZW1wRGF0YS5zdGFydE5vdGVJbmRleF0gPSB0ZW1wTm90ZTtcblx0XHRcdFx0XHRcbi8vIFx0XHRcdFx0XHRjb25zb2xlLmxvZyhzY29wZS5ub3RlcylcblxuLy8gXHRcdFx0XHRcdHZhciByYXN0ID0ge1xuLy8gICAgICAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyYWRzQG5qaXQuZWR1XCIsXG4vLyAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcInMxXCIsXG4vLyAgICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwibGF1bnNkcnlcIiwgXCJhcHNwbHkgam9ic1wiLCBcImdzeW1cIiBdLFxuLy8gICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjEvMS8yMjAxNlwiLFxuLy8gICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMS8yMi8yMDE2XCIsXG4vLyAgICAgICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96c2UuYWtAZ21haWwuY29tXCJcbi8vICAgICAgICAgICAgICAgICB9XG5cbi8vIFx0XHRcdFx0XHQvL3Njb3BlLm5vdGVzWzBdLml0ZW1zLnB1c2goXCJQVUNLU1wiKVxuXG4vLyBcdFx0XHRcdFx0c2NvcGUuJGFwcGx5KCk7XG5cbi8vIFx0XHQgICAvLyAgICAgICAgIC8vY29uc29sZS5sb2coc2NvcGUubm90ZXMpXG4vLyBcdFx0XHQgICAgfSAgIFxuXHRcdCAgICAgICAgICAgXG4vLyBcdFx0ICAgICAgICB9LCAvL2VuZCB1cGRhdGVcbi8vIFx0XHQgICAgICAgIHJlY2VpdmU6IGZ1bmN0aW9uKGV2ZW50LCB1aSl7XG4vLyBcdFx0ICAgICAgICBcdGNvbnNvbGUubG9nKFwiUkVDRUlWRSBSRUNFSVZFIFJFQ0VJVkUgUkVDRUlWRSBSRUNFSVZFXCIpXG4vLyBcdFx0ICAgICAgICBcdGNvbnNvbGUubG9nKHRlbXBEYXRhKVxuXG4vLyBcdFx0ICAgICAgICBcdHRlbXBEYXRhLmVuZE5vdGUgPSBhbmd1bGFyLmNvcHkoc2NvcGUubm90ZSk7XG4vLyBcdFx0ICAgICAgICBcdHRlbXBEYXRhLmVuZE5vdGVJbmRleCA9IGF0dHJzLm5vdGVpbmRleDtcbi8vIFx0XHRcdFx0XHR0ZW1wRGF0YS5lbmROb3RlSXRlbUluZGV4ID0gdWkuaXRlbS5pbmRleCgpO1xuXG5cdFx0XHRcdFx0XG5cbi8vIFx0XHRcdFx0XHQgIC8vY29uc29sZS5sb2coXCJyZW1vdmluZyBpdGVtOiBcIiArIHNjb3BlLm5vdGVzW25vdGVPcmlnaW5JbmRleF0uaXRlbXNbc3RhcnRfcG9zXSk7XG4vLyBcdFx0ICAgICAgICAgICB0ZW1wRGF0YS5zdGFydE5vdGUuaXRlbXMuc3BsaWNlKHRlbXBEYXRhLnN0YXJ0Tm90ZUl0ZW1JbmRleCwxKVxuLy8gXHRcdFx0ICAgICAgIHRlbXBEYXRhLmVuZE5vdGUuaXRlbXMuc3BsaWNlKHRlbXBEYXRhLmVuZE5vdGVJdGVtSW5kZXgsMCx0ZW1wRGF0YS5zdGFydE5vdGVJdGVtQ29udGVudClcbi8vIFx0XHRcdCAgICAgICBjb25zb2xlLmxvZyh0ZW1wRGF0YSlcblxuLy8gXHRcdFx0ICAgICAgIHNjb3BlLm5vdGVzW3RlbXBEYXRhLnN0YXJ0Tm90ZUluZGV4XSA9IHRlbXBEYXRhLnN0YXJ0Tm90ZTtcbi8vIFx0XHRcdCAgICAgICBzY29wZS5ub3Rlc1t0ZW1wRGF0YS5lbmROb3RlSW5kZXhdID0gdGVtcERhdGEuZW5kTm90ZTtcblx0ICAgICAgICAgICBcdFxuLy8gXHQgICAgICAgICAgIFx0XHRjb25zb2xlLmxvZyh0ZW1wRGF0YS5zdGFydE5vdGUuaXRlbXMpXG4vLyBcdCAgICAgICAgICAgXHRcdGNvbnNvbGUubG9nKHRlbXBEYXRhLmVuZE5vdGUuaXRlbXMpXG5cbi8vIFx0XHQgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJhZGRpbmcgYWZ0ZXIgcG9zaXRpb246IFwiICsgZW5kX3Bvcylcbi8vIFx0XHQgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJhZGRpbmcgYWZ0ZXI6IFwiICsgc2NvcGUubm90ZXNbbm90ZURlc3RpbmF0aW9uSW5kZXhdLml0ZW1zW2VuZF9wb3NdKVxuLy8gXHRcdCAgICAgICAgICAgLy9zY29wZS5ub3Rlc1tub3RlRGVzdGluYXRpb25JbmRleF0uaXRlbXMuc3BsaWNlKGVuZF9wb3MsMCwgc3RhcnRJdGVtKVxuXG4vLyBcdFx0ICAgICAgICBcdC8vc2NvcGUudGVtcERhdGEgPSBcInByYXduc1wiO1xuXHRcdCAgICAgICAgXHRcblx0XHQgICAgICAgIFx0XG4vLyBcdFx0ICAgICAgICBcdC8vIGNvbnNvbGUubG9nKHRlbXBEYXRhKVxuLy8gXHRcdCAgICAgICAgXHQvLyAvL2NvbnNvbGUubG9nKHNjb3BlLm5vdGUpO1xuLy8gXHRcdCAgICAgICAgXHR2YXIgcmFzdCA9IHtcbi8vICAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMmFkc0Buaml0LmVkdVwiLFxuLy8gICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJzMVwiLFxuLy8gICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImxhdW5zZHJ5XCIsIFwiYXBzcGx5IGpvYnNcIiwgXCJnc3ltXCIgXSxcbi8vICAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIxLzEvMjIwMTZcIixcbi8vICAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjEvMjIvMjAxNlwiLFxuLy8gICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvenNlLmFrQGdtYWlsLmNvbVwiXG4vLyAgICAgICAgICAgICAgICAgfVxuXHRcdCAgICAgICAgXHRcbi8vIFx0XHQgICAgICAgICAgIHNjb3BlLiRhcHBseSgpO1xuXHRcdFxuXG4vLyBcdFx0ICAgICAgICB9XG5cbi8vIFx0XHQgICAgfSk7IC8vIGVuZCBzb3J0YWJsZVxuXG4vLyBcdFx0IC8vICB9KTsgLy9lbmQgd2F0Y2hcblxuXG5cbi8vIFx0XHR9LFxuLy8gXHRcdGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSl7XG5cbi8vIFx0XHRcdCRzY29wZS5tb29zZSA9IFwiZGluZ1wiXG4vLyBcdFx0XHQkc2NvcGUuZGVsZXRlSXRlbSA9IGZ1bmN0aW9uKHBhcmVudEluZGV4LCBpbmRleCl7XG4vLyBcdFx0XHRcdGNvbnNvbGUubG9nKHBhcmVudEluZGV4KVxuLy8gXHRcdFx0XHRjb25zb2xlLmxvZyhpbmRleClcbi8vIFx0XHRcdFx0JHNjb3BlLm5vdGVzW3BhcmVudEluZGV4XS5pdGVtcy5zcGxpY2UoaW5kZXgsMSlcblxuLy8gXHRcdFx0fVxuXG4vLyBcdFx0XHQkc2NvcGUucmFuZG9tSWQgPSBmdW5jdGlvbihpdGVtKXtcbi8vICAgIFx0XHRcdCByZXR1cm4gXCJJRFwiICsgaXRlbSArIChNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogOTk5KSArIDEpKTtcbi8vIFx0XHRcdH1cbi8vIFx0XHRcdC8vYWxlcnQoXCJjb250cm9sbGVyXCIpO1xuLy8gXHRcdFx0Ly8gJHNjb3BlLmRvZ3MgPSAkc2NvcGUuZGF0YSArIFwiZG9nc1wiO1xuLy8gXHRcdFx0Ly8gaWYoJHNjb3BlLmRyYWdnYWJsZSlcbi8vIFx0XHRcdC8vIFx0JHNjb3BlLmRyYWdTdGF0dXMgPSBmYWxzZTtcbi8vIFx0XHRcdC8vIGVsc2UgJHNjb3BlLmRyYWdTdGF0dXMgPSB0cnVlO1xuXG4vLyBcdFx0XHRjb25zb2xlLmxvZygkc2NvcGUpXG5cblx0XHRcdFxuLy8gXHRcdH1cbi8vIFx0fVxuLy8gfSAvL2VuZCBub3RlY2FyZCBkaXJlY3RpdmVcblxuXG5cblxuXG4iLCIoZnVuY3Rpb24oKXtcblx0J3VzZSBzdHJpY3QnXG5cblx0YW5ndWxhclxuICAgIFx0Lm1vZHVsZSgnbm90ZXMnKVxuICAgIFx0LmZhY3RvcnkoJ25vdGVzU2VydmljZScsIG5vdGVzU2VydmljZSk7XG5cbiAgICBub3Rlc1NlcnZpY2UuJGluamVjdCA9IFsnJGh0dHAnXVxuXG4gICAgZnVuY3Rpb24gbm90ZXNTZXJ2aWNlKCRodHRwKSB7XG4gICAgXHR2YXIgc2VydmljZSA9IHtcblxuICAgICAgICAgICAgZ2V0Tm90ZTogZ2V0Tm90ZSxcbiAgICAgICAgICAgIGdldE5vdGVzOiBnZXROb3RlcyxcbiAgICAgICAgICAgIHNhdmVOb3Rlczogc2F2ZU5vdGVzXG5cblxuICAgIFx0fTtcblxuICAgIFx0cmV0dXJuIHNlcnZpY2U7XG5cbiAgICBcdC8vLy8vLy8vLy8vL1xuXG4gICAgICAgIC8vIGdldHMgYSBzaW5nbGUgbm90ZVxuICAgICAgICBmdW5jdGlvbiBnZXROb3RlICgpIHtcblxuICAgICAgICAgICAgdmFyIG5vdGUgPSB7XG4gICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMkBuaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgIHRpdGxlOiBcInRvZG9cIixcbiAgICAgICAgICAgICAgICBpdGVtczogWyBcImxhdW5kcnlcIiwgXCJhcHBseSBqb2JzXCIsIFwiZ3ltXCIgXSxcbiAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjEvMS8yMDE2XCIsXG4gICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjEvMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3plLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBub3RlO1xuXG4gICAgICAgIH0gLy9lbmQgZ2V0Tm90ZSgpXG5cblxuICAgICAgICAvLyBnZXRzIGFsbCBub3Rlc1xuICAgICAgICBmdW5jdGlvbiBnZXROb3RlcyAoKSB7XG5cbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGkvbm90ZXMvZ2V0Tm90ZXMnLHtlbWFpbDpcIm1vaXpAZ21haWwuY29tXCJ9KVxuICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBub3RlcyA9IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiMVwiLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImxhdW5kcnlcIiwgXCJhcHBseSBqb2JzXCIsIFwiZ3ltXCIgXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIxLzEvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMS8yLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3plLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiMlwiLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImh0bWw1IGRyYWcgYW5kIGRyb3BcIiwgXCJzb2NrZXQuaW9cIiwgXCJub2RlanNcIiBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjIvMS8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIyLzIvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvemUuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMkBuaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCIzXCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwiYm9zZSBoZWFkcGhvbmVzXCIsIFwiMjAxNiBob25kYSBncmlsbFwiLCBcInNvbGlkIHN0YXRlIGhhcmQgZHJpdmVcIiBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjEvMS8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIxLzIvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvemUuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMkBuaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCI0XCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwibGF1bmRyeVwiLCBcImFwcGx5IGpvYnNcIiwgXCJneW1cIiBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjEvMS8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIxLzIvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvemUuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMkBuaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCI1XCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwiaHRtbDUgZHJhZyBhbmQgZHJvcFwiLCBcInNvY2tldC5pb1wiLCBcIm5vZGVqc1wiIF0sXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMi8xLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjIvMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96ZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyQG5qaXQuZWR1XCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIjZcIixcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJib3NlIGhlYWRwaG9uZXNcIiwgXCIyMDE2IGhvbmRhIGdyaWxsXCIsIFwic29saWQgc3RhdGUgaGFyZCBkcml2ZVwiIF0sXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMS8xLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjEvMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96ZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyQG5qaXQuZWR1XCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIjdcIixcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJsYXVuZHJ5XCIsIFwiYXBwbHkgam9ic1wiLCBcImd5bVwiLFwiYm9zZSBoZWFkcGhvbmVzXCIsIFwiMjAxNiBob25kYSBncmlsbFwiLCBcInNvbGlkIHN0YXRlIGhhcmQgZHJpdmVcIiAgXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIxLzEvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMS8yLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3plLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiOFwiLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImh0bWw1IGRyYWcgYW5kIGRyb3BcIiwgXCJzb2NrZXQuaW9cIiwgXCJub2RlanNcIiBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjIvMS8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIyLzIvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvemUuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMkBuaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCI5XCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwiYm9zZSBoZWFkcGhvbmVzXCIsIFwiMjAxNiBob25kYSBncmlsbFwiLCBcInNvbGlkIHN0YXRlIGhhcmQgZHJpdmVcIixcImh0bWw1IGRyYWcgYW5kIGRyb3BcIiwgXCJzb2NrZXQuaW9cIiwgXCJub2RlanNcIiAgXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIxLzEvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMS8yLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3plLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXSAvL2VuZCBub3RlcyBhcnJheVxuXG4gICAgICAgICAgICAvL3JldHVybiBub3Rlc1xuICAgICAgICB9IC8vZW5kIGdldCBub3Rlc1xuXG4gICAgICAgIGZ1bmN0aW9uIHNhdmVOb3Rlcyhub3Rlcykge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGkvbm90ZXMvdXBkYXRlTm90ZXMnLHtlbWFpbDpcIm1vaXpAZ21haWwuY29tXCIsbm90ZXM6IG5vdGVzfSlcbiAgICAgICAgfVxuXG5cblxuICAgIH1cblxuXHRcblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0J3VzZSBzdHJpY3QnXG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ2J1ZGdldCcpXG5cdFx0LmNvbnRyb2xsZXIoJ2J1ZGdldEN0cmwnLCBidWRnZXRDdHJsKVxuXG5cdGJ1ZGdldEN0cmwuJGluamVjdCA9IFsnJHNjb3BlJywnJGh0dHAnLCd0b2FzdHInXVxuXG5cdGZ1bmN0aW9uIGJ1ZGdldEN0cmwoJHNjb3BlLCAkaHR0cCwgdG9hc3RyKSB7XG5cdFx0Y29uc29sZS5sb2coJ2xvYWRlZCBidWRnZXRDdHJsJyk7XG5cdFxuXHRcdC8vICRzY29wZS5NYXRoID0gd2luZG93Lk1hdGg7XG5cblx0XHQgICAgXG5cblxuICBcdFx0XHQvLyBpbmNvbWVcbiAgXHRcdFx0JHNjb3BlLmluY29tZSA9IHt9XG4gIFx0XHRcdCRzY29wZS5pbmNvbWUubW9udGhseSA9IDQ1MDA7XG5cbiAgXHRcdFx0Ly8gYmlsbHNcbiAgXHRcdFx0JHNjb3BlLmJpbGxzID1bXVxuICBcdFx0XHQkc2NvcGUuYmlsbHMgPSBbXG4gIFx0XHRcdFx0e25hbWU6XCJyZW50XCIsIGNvc3Q6IDI1MDB9LFxuICBcdFx0XHRcdHtuYW1lOlwidXRpbGl0aWVzXCIsIGNvc3Q6IDIwMH0sXG4gIFx0XHRcdFx0e25hbWU6XCJjYXIgaW5zdXJhbmNlXCIsIGNvc3Q6IDE1MH0sXG4gIFx0XHRcdFx0e25hbWU6XCJjYXIgcGF5bWVudFwiLCBjb3N0OiAyNTB9LFxuICBcdFx0XHRcdHtuYW1lOlwiZ2FzXCIsIGNvc3Q6IDEwMH0sXG4gIFx0XHRcdFx0e25hbWU6XCJneW0gbWVtYmVyc2hpcFwiLCBjb3N0OiA1MH0sXG4gIFx0XHRcdFx0e25hbWU6XCJjZWxsIHBob25lXCIsIGNvc3Q6IDgwfSxcblxuICBcdFx0XHRdXG5cbiAgICAgICAgXG5cbiAgXHRcdFx0JHNjb3BlLmFkZE5ld0JpbGwgPSBmdW5jdGlvbigpe1xuICBcdFx0XHRcdCRzY29wZS5iaWxscy5wdXNoKHtuYW1lOiAkc2NvcGUubmV3QmlsbE5hbWUsIGNvc3Q6IDAgfSlcbiAgXHRcdFx0XHQkc2NvcGUubmV3QmlsbE5hbWUgPSBcIlwiO1xuICBcdFx0XHR9XG5cbiAgXHRcdFx0JHNjb3BlLnJlbW92ZUJpbGxJdGVtID0gZnVuY3Rpb24oaW5kZXgpe1xuICBcdFx0XHRcdCRzY29wZS5iaWxscy5zcGxpY2UoaW5kZXgsMSk7XG4gIFx0XHRcdH1cblxuICBcdFx0XHQvL2J1ZGdldCBpdGVtc1xuICBcdFx0XHQkc2NvcGUuYnVkZ2V0SXRlbXMgPSBbXTtcbiAgXHRcdFx0JHNjb3BlLmJ1ZGdldEl0ZW1zID0gW1xuICBcdFx0XHRcdHtuYW1lOiBcImVhdCBvdXRcIiwgYnVkZ2V0OiAxMDAsIHNwZW50OiAzMCB9LFxuICBcdFx0XHRcdHtuYW1lOiBcImNsb3RoaW5nXCIsIGJ1ZGdldDogMjAwLCBzcGVudDogOTB9XG4gIFx0XHRcdF1cblxuICBcdFx0XHQkc2NvcGUuYWRkTmV3QnVkZ2V0SXRlbSA9IGZ1bmN0aW9uKCl7XG4gIFx0XHRcdFx0JHNjb3BlLmJ1ZGdldEl0ZW1zLnB1c2goe25hbWU6ICRzY29wZS5uZXdCdWRnZXRJdGVtTmFtZSwgYnVkZ2V0OiAwLCBzcGVudDogMCB9KVxuICBcdFx0XHRcdCRzY29wZS5uZXdCdWRnZXRJdGVtTmFtZSA9IFwiXCI7XG4gIFx0XHRcdH1cblxuICAgICAgICAkc2NvcGUucHVyY2hhc2VzID0gW11cbiAgICAgICAgJHNjb3BlLnB1cmNoYXNlcyA9IFt7Y2F0ZWdvcnk6IFwiZWF0IG91dFwifV1cblxuICAgICAgICAkc2NvcGUuYWRkUHVyY2hhc2VJdGVtID0gZnVuY3Rpb24oKXtcblxuICAgICAgICB9XG5cblxuICAgICAgICAkc2NvcGUubW9udGhseU92ZXJ2aWV3ID0ge307XG4gICAgICAgICRzY29wZS5tb250aGx5T3ZlcnZpZXcuYmlsbHNUb3RhbCA9IDA7XG4gICAgICAgICRzY29wZS5tb250aGx5T3ZlcnZpZXcuYnVkZ2V0VG90YWwgPSAwO1xuICAgICAgICAkc2NvcGUubW9udGhseU92ZXJ2aWV3LmJ1ZGdldFNwZW50VG90YWwgPSAwO1xuICAgICAgICAkc2NvcGUubW9udGhseU92ZXJ2aWV3LnRvdGFsRXN0aW1hdGVkRXhwZW5kaXR1cmUgPSAwO1xuXG4gICAgICAgIFxuICAgICAgICAkc2NvcGUuY2FsY3VsYXRlQmlsbHNUb3RhbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciB0b3RhbCA9IDA7XG4gICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8ICRzY29wZS5iaWxscy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICB0b3RhbCA9IHRvdGFsICsgJHNjb3BlLmJpbGxzW2ldLmNvc3Q7XG4gICAgICAgICAgfVxuICAgICAgICAgICRzY29wZS5tb250aGx5T3ZlcnZpZXcuYmlsbHNUb3RhbCA9IHRvdGFsO1xuICAgICAgICAgICRzY29wZS5jYWxjdWxhdGVUb3RhbEV4cGVuZGl0dXJlKClcbiAgICAgICAgICByZXR1cm4gdG90YWw7XG4gICAgICAgIH1cblxuICAgICAgICBcblxuICAgICAgICAkc2NvcGUuY2FsY3VsYXRlQnVkZ2V0VG90YWwgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgdG90YWwgPSAwO1xuICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCAkc2NvcGUuYnVkZ2V0SXRlbXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgdG90YWwgPSB0b3RhbCArICRzY29wZS5idWRnZXRJdGVtc1tpXS5idWRnZXQ7XG4gICAgICAgICAgfVxuICAgICAgICAgICRzY29wZS5tb250aGx5T3ZlcnZpZXcuYnVkZ2V0VG90YWwgPSB0b3RhbDtcbiAgICAgICAgICAkc2NvcGUuY2FsY3VsYXRlVG90YWxFeHBlbmRpdHVyZSgpXG4gICAgICAgICAgcmV0dXJuIHRvdGFsOyAgICAgICBcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5jYWxjdWxhdGVCdWRnZXRTcGVudFRvdGFsID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIHRvdGFsID0gMDtcbiAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgJHNjb3BlLmJ1ZGdldEl0ZW1zLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIHRvdGFsID0gdG90YWwgKyAkc2NvcGUuYnVkZ2V0SXRlbXNbaV0uc3BlbnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgICRzY29wZS5tb250aGx5T3ZlcnZpZXcuYnVkZ2V0U3BlbnRUb3RhbCA9IHRvdGFsO1xuICAgICAgICAgIC8vJHNjb3BlLmNhbGN1bGF0ZVRvdGFsRXhwZW5kaXR1cmUoKVxuICAgICAgICAgIHJldHVybiB0b3RhbDsgICAgICAgXG4gICAgICAgIH1cblxuICAgICAgICBcblxuXG5cbiAgICAgICAkc2NvcGUuJHdhdGNoKFwiYmlsbHNcIiwgJHNjb3BlLmNhbGN1bGF0ZUJpbGxzVG90YWwsIHRydWUpXG4gICAgICAgJHNjb3BlLiR3YXRjaChcImJ1ZGdldEl0ZW1zXCIsICRzY29wZS5jYWxjdWxhdGVCdWRnZXRUb3RhbCwgdHJ1ZSlcbiAgICAgICAkc2NvcGUuJHdhdGNoKFwiYnVkZ2V0SXRlbXNcIiwgJHNjb3BlLmNhbGN1bGF0ZUJ1ZGdldFNwZW50VG90YWwsIHRydWUpXG5cbiAgICAgLy8gJHNjb3BlLiR3YXRjaChcImJ1ZGdldEl0ZW1zXCIsICRzY29wZS5jYWxjdWxhdGVCdWRnZXRUb3RhbCwgdHJ1ZSlcblxuXG4gICAgICAgICRzY29wZS5jYWxjdWxhdGVUb3RhbEV4cGVuZGl0dXJlID0gZnVuY3Rpb24gICgpIHtcbiAgICAgICAgICAgICAkc2NvcGUubW9udGhseU92ZXJ2aWV3LnRvdGFsRXN0aW1hdGVkRXhwZW5kaXR1cmUgPSAkc2NvcGUubW9udGhseU92ZXJ2aWV3LmJpbGxzVG90YWwgKyAkc2NvcGUubW9udGhseU92ZXJ2aWV3LmJ1ZGdldFRvdGFsO1xuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLmNhbGN1bGF0ZUJpbGxzVG90YWwoKTtcbiAgICAgICAgJHNjb3BlLmNhbGN1bGF0ZUJ1ZGdldFRvdGFsKCk7XG4gICAgICAgICRzY29wZS5jYWxjdWxhdGVCdWRnZXRTcGVudFRvdGFsKCk7XG4gICAgICAgICRzY29wZS5jYWxjdWxhdGVUb3RhbEV4cGVuZGl0dXJlKCk7XG5cbiAgICAgICAgJHNjb3BlLmxhYmVscyA9IFtcIkJpbGxzXCIsIFwiQnVkZ2V0XCIsIFwiUmVtYWluaW5nXCJdO1xuICAgICAgICAkc2NvcGUuZGF0YSA9IFskc2NvcGUubW9udGhseU92ZXJ2aWV3LmJpbGxzVG90YWwsXG4gICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5tb250aGx5T3ZlcnZpZXcuYnVkZ2V0VG90YWwsXG4gICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5pbmNvbWUubW9udGhseSAtICRzY29wZS5tb250aGx5T3ZlcnZpZXcudG90YWxFc3RpbWF0ZWRFeHBlbmRpdHVyZV07XG5cblxuXG5cblxuXHR9XG5cbn0pKCk7XG5cblxuIiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ25vdGVzJylcbiAgICAuZGlyZWN0aXZlKCdub3RlQ2FyZCcsIG5vdGVDYXJkKTtcblxuZnVuY3Rpb24gbm90ZUNhcmQoKSB7XG5cdHJldHVybntcblx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdHNjb3BlOiB7XG5cdFx0XHRkYXRhOiBcIj1cIixcblx0XHRcdGRyYWdnYWJsZTogXCI9XCJcblx0XHR9LFxuXHRcdHJlcGxhY2U6IHRydWUsXG5cdFx0dGVtcGxhdGU6IFwiPGgxPnt7ZG9nc319e3tkcmFnU3RhdHVzfX08L2gxPlwiLFxuXHRcdGxpbms6IGZ1bmN0aW9uKHNjb3BlLGVsZW1lbnQpe1xuXHRcdFx0ZWxlbWVudC5jbGljayhmdW5jdGlvbigpe1xuXHRcdFx0XHRjb25zb2xlLmxvZyhlbGVtZW50KVxuXHRcdFx0XHRlbGVtZW50WzBdLmRyYWdnYWJsZSA9IHRydWU7XG5cdFx0XHR9KVxuXHRcdH0sXG5cdFx0Y29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKXtcblx0XHRcdC8vYWxlcnQoXCJjb250cm9sbGVyXCIpO1xuXHRcdFx0JHNjb3BlLmRvZ3MgPSAkc2NvcGUuZGF0YSArIFwiZG9nc1wiO1xuXHRcdFx0aWYoJHNjb3BlLmRyYWdnYWJsZSlcblx0XHRcdFx0JHNjb3BlLmRyYWdTdGF0dXMgPSBmYWxzZTtcblx0XHRcdGVsc2UgJHNjb3BlLmRyYWdTdGF0dXMgPSB0cnVlO1xuXG5cdFx0XHRcblx0XHR9XG5cdH1cbn1cblxuXG5cbi8vIGFuZ3VsYXJcbi8vICAgICAubW9kdWxlKCdub3RlcycpXG4vLyAgICAgLmRpcmVjdGl2ZSgnbm90ZUNhcmQnLCBub3RlQ2FyZCk7XG5cbi8vIGZ1bmN0aW9uIG5vdGVDYXJkKCkge1xuLy8gXHRyZXR1cm57XG4vLyBcdFx0cmVzdHJpY3Q6ICdFJyxcbi8vIFx0XHRjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpe1xuLy8gXHRcdFx0YWxlcnQoXCJjb250cm9sbGVyXCIpO1xuLy8gXHRcdFx0Y29uc29sZS5sb2coJ2RvZycpXG4vLyBcdFx0fSxcbi8vIFx0XHR0ZW1wbGF0ZVVybDogJycsXG4vLyBcdFx0cmVwbGFjZTogdHJ1ZVxuLy8gXHRcdC8vIHNjb3BlOiB7fVxuLy8gXHR9XG4vLyB9IiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ25vdGVzJylcbiAgICAuZGlyZWN0aXZlKCdub3RlQ2FyZHMnLCBub3RlQ2FyZHMpXG5cblxuICAgIFxuXG5mdW5jdGlvbiBub3RlQ2FyZHMoKSB7XG5cdHJldHVybntcblx0XHRyZXN0cmljdDogJ0FFJyxcblx0XHRzY29wZToge1xuXHRcdFx0bm90ZXM6IFwiPVwiLFxuXHRcdFx0bmV3SXRlbTogXCI9XCJcblx0XHR9LFxuXHRcdHJlcGxhY2U6IGZhbHNlLFxuXHRcdHRyYW5zY2x1ZGU6IGZhbHNlLFxuXHRcdHRlbXBsYXRlVXJsOiBcImNvbXBvbmVudHMvbm90ZXMvdmlld3Mvbm90ZS5kaXJlY3RpdmUudmlldy5odG1sXCIsXG5cdFx0bGluazogZnVuY3Rpb24oc2NvcGUsZWxlbWVudCxhdHRycyl7XG5cdFx0XHQvLyQoIFwiI3NvcnRhYmxlXCIgKS5zb3J0YWJsZSgpO1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhzY29wZSlcblx0XHRcdC8vY29uc29sZS5sb2coZWxlbWVudClcblx0XHRcdC8vY29uc29sZS5sb2coYXR0cnMpXG5cdFx0XHQvL2VsZW1lbnQuc29ydGFibGUoKTtcblx0XHRcdC8vY29uc29sZS5sb2coc2NvcGUubm90ZXMpXG5cdFx0XHRzY29wZS5kb2dzID0gZnVuY3Rpb24obm90ZSl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKG5vdGUpXG5cdFx0XHR9XG5cblxuXHRcdFx0ZWxlbWVudC5zb3J0YWJsZSh7XG5cdFx0ICAgICAgIC8vIHBsYWNlaG9sZGVyOiBcInVpLXN0YXRlLWhpZ2hsaWdodFwiLFxuXHRcdCAgICAgICAgc3RhcnQ6IGZ1bmN0aW9uKGV2ZW50LCB1aSkge1xuXHRcdCAgICAgICAgICAgIHZhciBzdGFydF9wb3MgPSB1aS5pdGVtLmluZGV4KCk7XG5cdFx0ICAgICAgICAgICAgdWkuaXRlbS5kYXRhKCdzdGFydF9wb3MnLCBzdGFydF9wb3MpO1xuXHRcdCAgICAgICAgfSxcblx0XHQgICAgICAgIHVwZGF0ZTogZnVuY3Rpb24oZXZlbnQsIHVpKSB7XG5cdFx0ICAgICAgICAgICAgdmFyIHN0YXJ0X3BvcyA9IHVpLml0ZW0uZGF0YSgnc3RhcnRfcG9zJyk7XG5cdFx0ICAgICAgICAgICAgdmFyIGVuZF9wb3MgPSB1aS5pdGVtLmluZGV4KCk7XG5cdFx0ICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhzdGFydF9wb3MgKyAnIC0gJyArIGVuZF9wb3MpO1xuXHRcdCAgICAgICAgICBcblx0XHQgICAgICAgICAgdmFyIHN0YXJ0SXRlbSA9IHNjb3BlLm5vdGVzW3N0YXJ0X3Bvc107XG5cdFx0ICAgICAgICAgICBzY29wZS5ub3Rlcy5zcGxpY2Uoc3RhcnRfcG9zLDEpXG5cdFx0ICAgICAgICAgICBzY29wZS5ub3Rlcy5zcGxpY2UoZW5kX3BvcywwLCBzdGFydEl0ZW0pXG5cdFx0ICAgICAgICAgICBzY29wZS4kYXBwbHkoKTtcblxuXHRcdCAgICAgICAgICAgLy9jb25zb2xlLmxvZyhzY29wZS5ub3Rlcylcblx0XHQgICAgICAgICAgIFxuXHRcdCAgICAgICAgICAgXG5cdFx0ICAgICAgICB9XG5cdFx0ICAgIH0pOyAvLyBlbmQgc29ydGFibGVcblxuXHRcdCAgIFxuXG5cdFx0ICAgIGNvbnNvbGUubG9nKGVsZW1lbnQpXG5cblxuXHRcdH0sXG5cdFx0Y29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKXtcblx0XHRcdCRzY29wZS5mb3JtID17fVxuXHRcdFx0JHNjb3BlLmFkZEl0ZW0gPSBmdW5jdGlvbihpbmRleCxpdGVtKXtcblx0XHRcdFx0Ly9hbGVydChpbmRleClcblx0XHRcdFx0Y29uc29sZS5sb2coJHNjb3BlLm5ld0l0ZW0pXG5cdFx0XHRcdCRzY29wZS5ub3Rlc1tpbmRleF0uaXRlbXMucHVzaChpdGVtKVxuXHRcdFx0XHQkc2NvcGUuZm9ybSA9IHt9XG5cdFx0XHRcdC8vY29uc29sZS5sb2coJHNjb3BlLm5vdGVzW2luZGV4XS5pdGVtcylcblx0XHRcdH1cblxuXHRcdFx0JHNjb3BlLmRlbGV0ZU5vdGUgPSBmdW5jdGlvbihpbmRleCl7XG5cdFx0XHRcdCRzY29wZS5ub3Rlcy5zcGxpY2UoaW5kZXgsMSk7XG5cdFx0XHR9XG5cblxuXHRcdFx0Ly9hbGVydChcImNvbnRyb2xsZXJcIik7XG5cdFx0XHQvLyAkc2NvcGUuZG9ncyA9ICRzY29wZS5kYXRhICsgXCJkb2dzXCI7XG5cdFx0XHQvLyBpZigkc2NvcGUuZHJhZ2dhYmxlKVxuXHRcdFx0Ly8gXHQkc2NvcGUuZHJhZ1N0YXR1cyA9IGZhbHNlO1xuXHRcdFx0Ly8gZWxzZSAkc2NvcGUuZHJhZ1N0YXR1cyA9IHRydWU7XG5cblx0XHRcdFxuXHRcdH1cblx0fVxufSAvL2VuZCBub3RlY2FyZHMgZGlyZWN0aXZlXG5cbmFuZ3VsYXJcblx0Lm1vZHVsZSgnbm90ZXMnKVxuXHQuZGlyZWN0aXZlKCdub3RlQ2FyZCcsIG5vdGVDYXJkKVxuXG5mdW5jdGlvbiBub3RlQ2FyZCgpIHtcblxuXHR2YXIgdGVtcERhdGEgPSB7fTtcblx0dmFyIHRlbXBOb3RlID0gbnVsbDtcblxuXHRyZXR1cm57XG5cdFx0cmVzdHJpY3Q6ICdBRScsXG5cdFx0c2NvcGU6IHtcblx0XHRcdG5vdGU6IFwiPVwiLFxuXHRcdFx0bm90ZXM6IFwiPVwiXG5cdFx0fSxcblx0XHRyZXBsYWNlOiB0cnVlLFxuXHRcdHRyYW5zY2x1ZGU6IGZhbHNlLFxuXHRcdHRlbXBsYXRlVXJsOiBcImNvbXBvbmVudHMvbm90ZXMvdmlld3Mvbm90ZXMuaXRlbXMudmlldy5odG1sXCIsXG5cdFx0bGluazogZnVuY3Rpb24oc2NvcGUsZWxlbWVudCxhdHRycyl7XG5cdFx0XHQvLyQoIFwiI3NvcnRhYmxlXCIgKS5zb3J0YWJsZSgpO1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhzY29wZSlcblx0XHRcdC8vY29uc29sZS5sb2coZWxlbWVudClcblx0XHRcdC8vY29uc29sZS5sb2coYXR0cnMpXG5cdFx0XHQvL2VsZW1lbnQuc29ydGFibGUoKTtcblx0XHRcdC8vY29uc29sZS5sb2coc2NvcGUubm90ZXMpXG5cdFx0XHQvL3Njb3BlLiR3YXRjaCgnbm90ZXMnLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAvLyBhbGwgdGhlIGNvZGUgaGVyZS4uLlxuICAgIFx0XHRcbiAgICBcdFx0XG5cdFx0XHRcblxuXHRcdFx0ZWxlbWVudC5zb3J0YWJsZSh7XG5cdFx0XHRcdGNvbm5lY3RXaXRoOiBcIi5jb25uZWN0ZWRTb3J0YWJsZVwiLFxuXHRcdCAgICAgICAvL3BsYWNlaG9sZGVyOiBcInVpLXN0YXRlLWhpZ2hsaWdodFwiLFxuXHRcdCAgICAgICAgc3RhcnQ6IGZ1bmN0aW9uKGV2ZW50LCB1aSkge1xuXHRcdCAgICAgICAgXHRjb25zb2xlLmxvZyhcIlNUQVJUIFNUQVJUIFNUQVJUIFNUQVJUIFNUQVJUXCIpXG5cdFx0ICAgICAgICBcdGNvbnNvbGUubG9nKGVsZW1lbnQpXG5cdFx0ICAgICAgICBcdGNvbnNvbGUubG9nKHRlbXBEYXRhKVxuXHRcdCAgICAgICAgXHRcblxuXHRcdCAgICAgICAgXHR0ZW1wRGF0YS5zdGFydE5vdGUgPSBhbmd1bGFyLmNvcHkoc2NvcGUubm90ZSk7XG5cdFx0ICAgICAgICBcdHRlbXBEYXRhLnN0YXJ0Tm90ZUluZGV4ID0gYXR0cnMubm90ZWluZGV4O1xuXHRcdFx0XHRcdHRlbXBEYXRhLnN0YXJ0Tm90ZUl0ZW1JbmRleCA9IHVpLml0ZW0uaW5kZXgoKTtcblx0XHRcdFx0XHR0ZW1wRGF0YS5zdGFydE5vdGVJdGVtQ29udGVudCA9IHRlbXBEYXRhLnN0YXJ0Tm90ZS5pdGVtc1t0ZW1wRGF0YS5zdGFydE5vdGVJdGVtSW5kZXhdO1xuXHRcdCAgIFx0XHRcdFxuXHRcdCAgIFx0XHRcdHRlbXBOb3RlID0gYW5ndWxhci5jb3B5KHNjb3BlLm5vdGUpXG5cdFx0ICAgXHRcdFx0Y29uc29sZS5sb2codGVtcE5vdGUpXG5cblx0XHQgICAgICAgIH0sXG5cdFx0ICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uKGV2ZW50LCB1aSkge1xuXG5cdFx0ICAgICAgIC8vIGNvbnNvbGUubG9nKHNjb3BlLnRlbXBEYXRhKVx0XG5cdCAgICAgICAgIFx0aWYgKCF1aS5zZW5kZXIpIHtcdFx0ICAgICAgIFxuXHRcdFx0ICAgICAgICAgY29uc29sZS5sb2coXCJVUERBVEUgVVBEQVRFIFVQREFURSBVUERBVEUgVVBEQVRFIElOU0lERSBJRlwiIClcblxuXHRcdFx0ICAgICAgICBcblx0XHRcdFx0XHRcdFx0XHQgICAgICAgICBcblxuXHRcdFx0XHRcdHZhciBzdGFydF9wb3MgPSB0ZW1wRGF0YS5zdGFydE5vdGVJdGVtSW5kZXg7XG5cdFx0XHRcdFx0dmFyIGVuZF9wb3MgPSB1aS5pdGVtLmluZGV4KCk7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coc3RhcnRfcG9zICsgJyAtICcgKyBlbmRfcG9zKTtcblxuXHRcdFx0XHRcdHRlbXBOb3RlLml0ZW1zLnNwbGljZShzdGFydF9wb3MsMSlcblx0XHRcdFx0XHR0ZW1wTm90ZS5pdGVtcy5zcGxpY2UoZW5kX3BvcywwLCB0ZW1wRGF0YS5zdGFydE5vdGVJdGVtQ29udGVudClcblx0XHRcdFx0XHQvL3Njb3BlLm5vdGUgPSB0ZW1wTm90ZVxuXHRcdFx0XHRcdHNjb3BlLm5vdGVzW3RlbXBEYXRhLnN0YXJ0Tm90ZUluZGV4XSA9IHRlbXBOb3RlO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKHNjb3BlLm5vdGVzKVxuXG5cdFx0XHRcdFx0dmFyIHJhc3QgPSB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJhZHNAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiczFcIixcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJsYXVuc2RyeVwiLCBcImFwc3BseSBqb2JzXCIsIFwiZ3N5bVwiIF0sXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMS8xLzIyMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIxLzIyLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3pzZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgICAgIH1cblxuXHRcdFx0XHRcdC8vc2NvcGUubm90ZXNbMF0uaXRlbXMucHVzaChcIlBVQ0tTXCIpXG5cblx0XHRcdFx0XHRzY29wZS4kYXBwbHkoKTtcblxuXHRcdCAgIC8vICAgICAgICAgLy9jb25zb2xlLmxvZyhzY29wZS5ub3Rlcylcblx0XHRcdCAgICB9ICAgXG5cdFx0ICAgICAgICAgICBcblx0XHQgICAgICAgIH0sIC8vZW5kIHVwZGF0ZVxuXHRcdCAgICAgICAgcmVjZWl2ZTogZnVuY3Rpb24oZXZlbnQsIHVpKXtcblx0XHQgICAgICAgIFx0Y29uc29sZS5sb2coXCJSRUNFSVZFIFJFQ0VJVkUgUkVDRUlWRSBSRUNFSVZFIFJFQ0VJVkVcIilcblx0XHQgICAgICAgIFx0Y29uc29sZS5sb2codGVtcERhdGEpXG5cblx0XHQgICAgICAgIFx0dGVtcERhdGEuZW5kTm90ZSA9IGFuZ3VsYXIuY29weShzY29wZS5ub3RlKTtcblx0XHQgICAgICAgIFx0dGVtcERhdGEuZW5kTm90ZUluZGV4ID0gYXR0cnMubm90ZWluZGV4O1xuXHRcdFx0XHRcdHRlbXBEYXRhLmVuZE5vdGVJdGVtSW5kZXggPSB1aS5pdGVtLmluZGV4KCk7XG5cblx0XHRcdFx0XHRcblxuXHRcdFx0XHRcdCAgLy9jb25zb2xlLmxvZyhcInJlbW92aW5nIGl0ZW06IFwiICsgc2NvcGUubm90ZXNbbm90ZU9yaWdpbkluZGV4XS5pdGVtc1tzdGFydF9wb3NdKTtcblx0XHQgICAgICAgICAgIHRlbXBEYXRhLnN0YXJ0Tm90ZS5pdGVtcy5zcGxpY2UodGVtcERhdGEuc3RhcnROb3RlSXRlbUluZGV4LDEpXG5cdFx0XHQgICAgICAgdGVtcERhdGEuZW5kTm90ZS5pdGVtcy5zcGxpY2UodGVtcERhdGEuZW5kTm90ZUl0ZW1JbmRleCwwLHRlbXBEYXRhLnN0YXJ0Tm90ZUl0ZW1Db250ZW50KVxuXHRcdFx0ICAgICAgIGNvbnNvbGUubG9nKHRlbXBEYXRhKVxuXG5cdFx0XHQgICAgICAgc2NvcGUubm90ZXNbdGVtcERhdGEuc3RhcnROb3RlSW5kZXhdID0gdGVtcERhdGEuc3RhcnROb3RlO1xuXHRcdFx0ICAgICAgIHNjb3BlLm5vdGVzW3RlbXBEYXRhLmVuZE5vdGVJbmRleF0gPSB0ZW1wRGF0YS5lbmROb3RlO1xuXHQgICAgICAgICAgIFx0XG5cdCAgICAgICAgICAgXHRcdGNvbnNvbGUubG9nKHRlbXBEYXRhLnN0YXJ0Tm90ZS5pdGVtcylcblx0ICAgICAgICAgICBcdFx0Y29uc29sZS5sb2codGVtcERhdGEuZW5kTm90ZS5pdGVtcylcblxuXHRcdCAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImFkZGluZyBhZnRlciBwb3NpdGlvbjogXCIgKyBlbmRfcG9zKVxuXHRcdCAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImFkZGluZyBhZnRlcjogXCIgKyBzY29wZS5ub3Rlc1tub3RlRGVzdGluYXRpb25JbmRleF0uaXRlbXNbZW5kX3Bvc10pXG5cdFx0ICAgICAgICAgICAvL3Njb3BlLm5vdGVzW25vdGVEZXN0aW5hdGlvbkluZGV4XS5pdGVtcy5zcGxpY2UoZW5kX3BvcywwLCBzdGFydEl0ZW0pXG5cblx0XHQgICAgICAgIFx0Ly9zY29wZS50ZW1wRGF0YSA9IFwicHJhd25zXCI7XG5cdFx0ICAgICAgICBcdFxuXHRcdCAgICAgICAgXHRcblx0XHQgICAgICAgIFx0Ly8gY29uc29sZS5sb2codGVtcERhdGEpXG5cdFx0ICAgICAgICBcdC8vIC8vY29uc29sZS5sb2coc2NvcGUubm90ZSk7XG5cdFx0ICAgICAgICBcdHZhciByYXN0ID0ge1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyYWRzQG5qaXQuZWR1XCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcInMxXCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwibGF1bnNkcnlcIiwgXCJhcHNwbHkgam9ic1wiLCBcImdzeW1cIiBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjEvMS8yMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMS8yMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96c2UuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9XG5cdFx0ICAgICAgICBcdFxuXHRcdCAgICAgICAgICAgc2NvcGUuJGFwcGx5KCk7XG5cdFx0XG5cblx0XHQgICAgICAgIH1cblxuXHRcdCAgICB9KTsgLy8gZW5kIHNvcnRhYmxlXG5cblx0XHQgLy8gIH0pOyAvL2VuZCB3YXRjaFxuXG5cblxuXHRcdH0sXG5cdFx0Y29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKXtcblxuXHRcdFx0JHNjb3BlLm1vb3NlID0gXCJkaW5nXCJcblx0XHRcdCRzY29wZS5kZWxldGVJdGVtID0gZnVuY3Rpb24ocGFyZW50SW5kZXgsIGluZGV4KXtcblx0XHRcdFx0Y29uc29sZS5sb2cocGFyZW50SW5kZXgpXG5cdFx0XHRcdGNvbnNvbGUubG9nKGluZGV4KVxuXHRcdFx0XHQkc2NvcGUubm90ZXNbcGFyZW50SW5kZXhdLml0ZW1zLnNwbGljZShpbmRleCwxKVxuXG5cdFx0XHR9XG5cblx0XHRcdCRzY29wZS5yYW5kb21JZCA9IGZ1bmN0aW9uKGl0ZW0pe1xuICAgXHRcdFx0IHJldHVybiBcIklEXCIgKyBpdGVtICsgKE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiA5OTkpICsgMSkpO1xuXHRcdFx0fVxuXHRcdFx0Ly9hbGVydChcImNvbnRyb2xsZXJcIik7XG5cdFx0XHQvLyAkc2NvcGUuZG9ncyA9ICRzY29wZS5kYXRhICsgXCJkb2dzXCI7XG5cdFx0XHQvLyBpZigkc2NvcGUuZHJhZ2dhYmxlKVxuXHRcdFx0Ly8gXHQkc2NvcGUuZHJhZ1N0YXR1cyA9IGZhbHNlO1xuXHRcdFx0Ly8gZWxzZSAkc2NvcGUuZHJhZ1N0YXR1cyA9IHRydWU7XG5cblx0XHRcdGNvbnNvbGUubG9nKCRzY29wZSlcblxuXHRcdFx0XG5cdFx0fVxuXHR9XG59IC8vZW5kIG5vdGVjYXJkIGRpcmVjdGl2ZVxuXG5cblxuXG5cbiIsIihmdW5jdGlvbigpe1xuXHQndXNlIHN0cmljdCdcblxuXHRhbmd1bGFyXG4gICAgXHQubW9kdWxlKCdidWRnZXQnKVxuICAgIFx0LmZhY3RvcnkoJ2J1ZGdldFNlcnZpY2UnLCBidWRnZXRTZXJ2aWNlKTtcblxuICAgIGJ1ZGdldFNlcnZpY2UuJGluamVjdCA9IFsnJGh0dHAnXVxuXG4gICAgZnVuY3Rpb24gYnVkZ2V0U2VydmljZSgkaHR0cCkge1xuICAgIFx0dmFyIHNlcnZpY2UgPSB7XG5cbiAgICAgICAgICAgIGdldE5vdGU6IGdldE5vdGUsXG4gICAgICAgICAgICBnZXROb3RlczogZ2V0Tm90ZXMsXG4gICAgICAgICAgICBzYXZlTm90ZXM6IHNhdmVOb3Rlc1xuXG5cbiAgICBcdH07XG5cbiAgICBcdHJldHVybiBzZXJ2aWNlO1xuXG4gICAgXHQvLy8vLy8vLy8vLy9cblxuICAgICAgICAvLyBnZXRzIGEgc2luZ2xlIG5vdGVcbiAgICAgICAgZnVuY3Rpb24gZ2V0Tm90ZSAoKSB7XG5cbiAgICAgICAgICAgIHZhciBub3RlID0ge1xuICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJ0b2RvXCIsXG4gICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJsYXVuZHJ5XCIsIFwiYXBwbHkgam9ic1wiLCBcImd5bVwiIF0sXG4gICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIxLzEvMjAxNlwiLFxuICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIxLzIvMjAxNlwiLFxuICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96ZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbm90ZTtcblxuICAgICAgICB9IC8vZW5kIGdldE5vdGUoKVxuXG5cbiAgICAgICAgLy8gZ2V0cyBhbGwgbm90ZXNcbiAgICAgICAgZnVuY3Rpb24gZ2V0Tm90ZXMgKCkge1xuXG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCdodHRwOi8vbG9jYWxob3N0OjMwMDAvYXBpL25vdGVzL2dldE5vdGVzJyx7ZW1haWw6XCJtb2l6QGdtYWlsLmNvbVwifSlcbiAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgIFxuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgbm90ZXMgPSBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyQG5qaXQuZWR1XCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIjFcIixcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJsYXVuZHJ5XCIsIFwiYXBwbHkgam9ic1wiLCBcImd5bVwiIF0sXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMS8xLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjEvMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96ZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyQG5qaXQuZWR1XCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIjJcIixcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJodG1sNSBkcmFnIGFuZCBkcm9wXCIsIFwic29ja2V0LmlvXCIsIFwibm9kZWpzXCIgXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIyLzEvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMi8yLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3plLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiM1wiLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImJvc2UgaGVhZHBob25lc1wiLCBcIjIwMTYgaG9uZGEgZ3JpbGxcIiwgXCJzb2xpZCBzdGF0ZSBoYXJkIGRyaXZlXCIgXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIxLzEvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMS8yLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3plLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiNFwiLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImxhdW5kcnlcIiwgXCJhcHBseSBqb2JzXCIsIFwiZ3ltXCIgXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIxLzEvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMS8yLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3plLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiNVwiLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImh0bWw1IGRyYWcgYW5kIGRyb3BcIiwgXCJzb2NrZXQuaW9cIiwgXCJub2RlanNcIiBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjIvMS8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIyLzIvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvemUuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMkBuaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCI2XCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwiYm9zZSBoZWFkcGhvbmVzXCIsIFwiMjAxNiBob25kYSBncmlsbFwiLCBcInNvbGlkIHN0YXRlIGhhcmQgZHJpdmVcIiBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjEvMS8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIxLzIvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvemUuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMkBuaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCI3XCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwibGF1bmRyeVwiLCBcImFwcGx5IGpvYnNcIiwgXCJneW1cIixcImJvc2UgaGVhZHBob25lc1wiLCBcIjIwMTYgaG9uZGEgZ3JpbGxcIiwgXCJzb2xpZCBzdGF0ZSBoYXJkIGRyaXZlXCIgIF0sXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMS8xLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjEvMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96ZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyQG5qaXQuZWR1XCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIjhcIixcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJodG1sNSBkcmFnIGFuZCBkcm9wXCIsIFwic29ja2V0LmlvXCIsIFwibm9kZWpzXCIgXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIyLzEvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMi8yLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3plLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiOVwiLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImJvc2UgaGVhZHBob25lc1wiLCBcIjIwMTYgaG9uZGEgZ3JpbGxcIiwgXCJzb2xpZCBzdGF0ZSBoYXJkIGRyaXZlXCIsXCJodG1sNSBkcmFnIGFuZCBkcm9wXCIsIFwic29ja2V0LmlvXCIsIFwibm9kZWpzXCIgIF0sXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMS8xLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjEvMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96ZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF0gLy9lbmQgbm90ZXMgYXJyYXlcblxuICAgICAgICAgICAgLy9yZXR1cm4gbm90ZXNcbiAgICAgICAgfSAvL2VuZCBnZXQgbm90ZXNcblxuICAgICAgICBmdW5jdGlvbiBzYXZlTm90ZXMobm90ZXMpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCdodHRwOi8vbG9jYWxob3N0OjMwMDAvYXBpL25vdGVzL3VwZGF0ZU5vdGVzJyx7ZW1haWw6XCJtb2l6QGdtYWlsLmNvbVwiLG5vdGVzOiBub3Rlc30pXG4gICAgICAgIH1cblxuXG5cbiAgICB9XG5cblx0XG5cbn0pKCk7XG4iLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXV0aCcsIFtcbiAgICAgIFxuICAgIF0pOyIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdtZW1iZXJzJywgW1xuICAgICAgXG4gICAgXSk7IiwiKGZ1bmN0aW9uKCl7XG5cdCd1c2Ugc3RyaWN0J1xuXG5hbmd1bGFyXG5cdC5tb2R1bGUoJ25vdGlmeScsIFtcblx0ICBcblx0XSk7XG5cbn0pKCk7XG5cblxuIiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ3JlZ2lzdGVyJywgW1xuICAgIFx0J2F1dGgnXG4gICAgXSk7IiwiKGZ1bmN0aW9uKCl7XG5cdCd1c2Ugc3RyaWN0J1xuXG5hbmd1bGFyXG5cdC5tb2R1bGUoJ3NhbXBsZScsIFtcblx0ICBcblx0XSk7XG5cbn0pKCk7XG5cbiIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdub3RlcycsIFtcbiAgICAgIFxuICAgIF0pOyIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdidWRnZXQnLCBbXG4gICAgICAnY2hhcnQuanMnXG4gICAgXSk7IiwiKGZ1bmN0aW9uKCl7XG4gICAgJ3VzZSBzdHJpY3QnXG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2F1dGgnKVxuICAgICAgICAuZmFjdG9yeSgnYXV0aEludGVyY2VwdG9yJywgYXV0aEludGVyY2VwdG9yKTtcblxuICAgIGF1dGhJbnRlcmNlcHRvci4kaW5qZWN0ID0gWydhdXRoU2VydmljZSddXG5cbiAgICBmdW5jdGlvbiBhdXRoSW50ZXJjZXB0b3IoYXV0aFNlcnZpY2UpIHtcblxuXG5cbiAgICAgICAgdmFyIHNlcnZpY2UgPSB7XG5cbiAgICAgICAgICAgIHJlcXVlc3Q6IHJlcXVlc3QsXG4gICAgICAgICAgICByZXNwb25zZTogcmVzcG9uc2VcblxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBzZXJ2aWNlO1xuXG4gICAgICAgIC8vLy8vLy8vLy8vL1xuXG4gICAgICAgIGZ1bmN0aW9uIHJlcXVlc3QoY29uZmlnKSB7XG5cbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJhdXRoSW50ZXJjZXB0b3IgcmVxdWVzdCBmdW5jdGlvblwiKVxuXG4gICAgICAgICAgICB2YXIgdG9rZW4gPSBhdXRoU2VydmljZS5nZXRUb2tlbigpO1xuXG4gICAgICAgICAgICBpZih0b2tlbil7XG4gICAgICAgICAgICAgICAgY29uZmlnLmhlYWRlcnMudG9rZW4gPSB0b2tlbjtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInRva2VuIHByZXNlbnRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibm8gdG9rZW5cIik7XG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICAgICAgcmV0dXJuIGNvbmZpZztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHJlc3BvbnNlKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiYXV0aEludGVyY2VwdG9yIHJlc3BvbnNlIGZ1bmN0aW9uXCIpXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgIH1cblxuICAgIH0gLy9lbmQgYXV0aEludGVyY2VwdG9yXG5cbiAgICBcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHQvLyd1c2Ugc3RyaWN0J1xuXG5cdGFuZ3VsYXJcbiAgICBcdC5tb2R1bGUoJ2F1dGgnLFtdKVxuICAgIFx0LmZhY3RvcnkoJ2F1dGhTZXJ2aWNlJywgYXV0aFNlcnZpY2UpO1xuXG4gICAgYXV0aFNlcnZpY2UuJGluamVjdCA9IFsnJHdpbmRvdycsJyRodHRwJywndG9hc3RyJywnJHN0YXRlJywnJHJvb3RTY29wZScsJyRsb2NhdGlvbicsJyRxJ107XG5cbiAgICBmdW5jdGlvbiBhdXRoU2VydmljZSgkd2luZG93LCRodHRwLHRvYXN0ciwkc3RhdGUsJHJvb3RTY29wZSwkbG9jYXRpb24sJHEpIHtcblxuICAgIFxuXG4gICAgXHR2YXIgc2VydmljZSA9IHtcblxuICAgICAgICAgICAgaW5mbzogaW5mbyxcblxuICAgICAgICAgICAgbG9naW46IGxvZ2luLFxuICAgICAgICAgICAgbG9nb3V0OiBsb2dvdXQsXG5cbiAgICBcdFx0c2V0VG9rZW46IHNldFRva2VuLFxuICAgICAgICAgICAgZ2V0VG9rZW46IGdldFRva2VuLFxuICAgIFx0XHRjbGVhclRva2VuOiBjbGVhclRva2VuLFxuXG4gICAgICAgICAgICBpc0F1dGhlbnRpY2F0ZWQ6IGlzQXV0aGVudGljYXRlZCwgLy8gdmVyaWZpZXMgdG9rZW5cbiAgICAgICAgICAgIGlzQXV0aG9yaXplZDogaXNBdXRob3JpemVkIC8vIHZlcmlmaWVzIHJvdXRlIHBlcm1pc3Npb25zXG5cbiAgICBcdH07XG5cbiAgICBcdHJldHVybiBzZXJ2aWNlO1xuXG4gICAgXHQvLy8vLy8vLy8vLy9cblxuICAgICAgICBmdW5jdGlvbiBpbmZvICgpIHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJhdXRoIHNlcnZpY2VcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyByZWRpcmVjdCB0YWtlcyByb3V0ZSBzdHJpbmcgaWUuICdhcHAuaG9tZSdcbiAgICAgICAgZnVuY3Rpb24gbG9naW4gKHVzZXJMb2dpbkRhdGEsIHJlZGlyZWN0KSB7XG4gICAgICAgICAgICAkaHR0cC5wb3N0KCdodHRwOi8vbG9jYWxob3N0OjMwMDAvYXBpL3VzZXJzL2xvZ2luJywgdXNlckxvZ2luRGF0YSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXMpe1xuICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgICAgICAgICAgICAgIGlmKHJlcy5zdGF0dXMgPT0gMjAwKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRva2VuKHJlcy5kYXRhLnRva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGVtaXQoXCJsb2dnZWRJblwiKTsgIFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9hc3RyLnN1Y2Nlc3MocmVzLmRhdGEubWVzc2FnZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHR5cGVvZihyZWRpcmVjdCkgIT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28ocmVkaXJlY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmdW5jdGlvbihlcnIpe1xuICAgICAgICAgICAgICAgICAgICB0b2FzdHIuZXJyb3IoZXJyLmRhdGEubWVzc2FnZSlcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKVxuICAgICAgICAgICAgICAgIH0pXG5cblxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gbG9nb3V0ICgpIHtcbiAgICAgICAgICAgIGNsZWFyVG9rZW4oKTtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGVtaXQoXCJsb2dnZWRPdXRcIik7XG4gICAgICAgICAgICAkc3RhdGUuZ28oXCJhcHAuaG9tZVwiKTtcbiAgICAgICAgICAgIHRvYXN0ci5zdWNjZXNzKFwiWW91IGhhdmUgYmVlbiBsb2dnZWQgb3V0XCIpO1xuICAgICAgICB9XG5cblxuXG4gICAgXHRmdW5jdGlvbiBzZXRUb2tlbiAodG9rZW4pIHtcbiAgICAgICAgICAgICR3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3VzZXJUb2tlbicsdG9rZW4pO1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBnZXRUb2tlbiAoKSB7XG4gICAgICAgICAgICB2YXIgdG9rZW4gPSAkd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKCd1c2VyVG9rZW4nKTtcbiAgICAgICAgICAgIHJldHVybiB0b2tlbjtcblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gY2xlYXJUb2tlbiAoKSB7XG4gICAgICAgICAgICAkd2luZG93LmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCd1c2VyVG9rZW4nKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdyYWJiaXRzJylcblx0ICAgIH1cblxuICAgICAgICAvL2Jhc2ljYWxseSBhcmUgdGhleSBsb2dnZWQgaW5cbiAgICAgICAgZnVuY3Rpb24gaXNBdXRoZW50aWNhdGVkICgpIHtcblxuICAgICAgICAgICAgdmFyIHRva2VuID0gZ2V0VG9rZW4oKTtcbiAgICAgICAgICAgIGlmKHRva2VuKXtcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCdodHRwOi8vbG9jYWxob3N0OjMwMDAvYXBpL3VzZXJzL2F1dGhvcml6ZScse3Rva2VuOnRva2VufSlcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhyZXMpXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnYXV0aG9yaXppbmcuLicpXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiggcmVzLmRhdGEuc3VjY2VzcyA9PSB0cnVlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2FzdHIuc3VjY2VzcyhcIkF1dGhlbnRpY2F0aW9uIFN1Y2Nlc3MhXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJBdXRoZW50aWNhdGlvbiBTdWNjZXNzIVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGVtaXQoXCJsb2dnZWRJblwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3RvYXN0ci5lcnJvcihcIkF1dGhlbnRpY2F0aW9uIEZhaWxlZFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQXV0aGVudGljYXRpb24gRmFpbGVkXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LGZ1bmN0aW9uKGVycil7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b2FzdHIuZXJyb3IoZXJyLmRhdGEpXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAvL3RvYXN0ci5lcnJvcihcImF1dGhlbnRpY2F0aW9uIGZhaWxlZCwgbm8gdG9rZW4gcHJlc2VudFwiKVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYXV0aGVudGljYXRpb24gZmFpbGVkLCBubyB0b2tlbiBwcmVzZW50XCIpXG4gICAgICAgICAgICB9IFxuICAgICAgICAgICBcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGlzQXV0aG9yaXplZCAoZXZlbnQsIGZyb21TdGF0ZSwgdG9TdGF0ZSkge1xuICAgICAgICAgICAgICAgIC8vcmV0dXJuICRxLnJlamVjdCgpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicnVubmluZyBpcyBhdXRob3JpemVkXCIpXG5cbiAgICAgICAgICAgICAgICAvL2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgdmFyIHRva2VuID0gZ2V0VG9rZW4oKTtcbiAgICAgICAgICAgICAgICB2YXIgdXNlcmxldmVsID0gbnVsbDtcbiAgICAgICAgICAgICAgICB2YXIgcHJvY2VlZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgaWYodG9rZW4pe1xuICAgICAgICAgICAgICAgICAgLy8gIHJldHVybiAkcS5yZWplY3Q7XG4gICAgICAgICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGkvdXNlcnMvYXV0aG9yaXplJyx7dG9rZW46dG9rZW59KVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdhdXRob3JpemluZy4uJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiggcmVzLmRhdGEuc3VjY2VzcyA9PSB0cnVlICYmIHJlcy5kYXRhLnByb2ZpbGUudXNlckxldmVsKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcy5kYXRhLnByb2ZpbGUudXNlckxldmVsKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyTGV2ZWwgPSByZXMuZGF0YS5wcm9maWxlLnVzZXJMZXZlbDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vbG9vcCB0aHJvdWdoIHBlcm1pc3Npb24gbGlzdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGk9MDsgaSA8IHRvU3RhdGUuZGF0YS5wZXJtaXNzaW9uTGV2ZWwubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vaWYgY3VycmVudCB1c2VybGV2ZWwgbWF0Y2hlcyBwZXJtaXNzaW9uIGxldmVsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy90aGVuIHNldCBwcm9jZWVkIHRvIHRydWUgYW5kIGJyZWFrIHRoZSBmb3IgbG9vcCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImN1cnJlbnQgbG9vcCBpIDogXCIgKyB0b1N0YXRlLmRhdGEucGVybWlzc2lvbkxldmVsW2ldKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHVzZXJMZXZlbCA9PSB0b1N0YXRlLmRhdGEucGVybWlzc2lvbkxldmVsW2ldKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicGVybWlzc2lvbiBtYXRjaFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzZXR0aW5nIHByb2NlZWQgdHJ1ZVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2VlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vcmV0dXJuIHRvYXN0ci5zdWNjZXNzKFwicHJvY2VlZFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImtlZXAgbG9va2luZ1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzZXR0aW5nIHByb2NlZWQgZmFsc2VcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2NlZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfS8vZW5kIGZvciBsb29wICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IC8vIGVuZCBpZiBwcm9maWxlIHJldHVybmVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZWxzZSBubyBwcm9maWxlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9hc3RyLmVycm9yKFwiYmFkIHJlcXVlc3RcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2VlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibGFzdCBjaGVja1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHByb2NlZWQgPT0gZmFsc2Upe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIklUUyBGQUxTRVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmhvbWUnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pIC8vZW5kIHRoZW5cbiAgICAgICAgICAgICAgICB9Ly9lbmQgaWYgdG9rZW5cblxuICAgICAgICAgICAgICAgIC8vZWxzZSBubyB0b2tlbiBcbiAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICB0b2FzdHIuZXJyb3IoXCJubyB0b2tlbiBwcmVzZW50XCIpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgXG5cbiAgICAgICAgfS8vZW5kIGlzQXV0aG9yaXplZFxuICAgICAgICBcblxuICAgIH0vL2VuZCBhdXRoU2VydmljZVxuXG4gICAgXG5cblxuXG5cdFxuXG59KSgpOyAvL2VuZCBpZmZlXG5cblxuIiwiKGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCdcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnbWVtYmVycycpXG5cdFx0LmNvbnRyb2xsZXIoJ21lbWJlcnNDdHJsJywgbWVtYmVyc0N0cmwpXG5cblx0bWVtYmVyc0N0cmwuJGluamVjdCA9IFsnJGh0dHAnXVxuXG5cdGZ1bmN0aW9uIG1lbWJlcnNDdHJsKCRodHRwKSB7XG5cblx0ICAgIHZhciB2bSA9IHRoaXM7XG5cblx0ICAgIHZtLm1lbWJlcnNDb250ZW50ID0gbWVtYmVyc0NvbnRlbnQoKTtcblx0ICAgIHZtLmdvdG9TZXNzaW9uID0gZ290b1Nlc3Npb247XG5cdCAgICB2bS5yZWZyZXNoID0gcmVmcmVzaDtcblx0ICAgIHZtLnNlYXJjaCA9IHNlYXJjaDtcblx0ICAgIHZtLnNlc3Npb25zID0gW107XG5cdCAgICB2bS50aXRsZSA9ICdtZW1iZXJzJztcblxuXHQgICAgLy8vLy8vLy8vLy8vXG5cblx0ICAgIGZ1bmN0aW9uIG1lbWJlcnNDb250ZW50KCl7XG5cdCAgICBcdCAvLyAkaHR0cC5nZXQoJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGkvdXNlcnMvYWxsJylcblx0ICAgIFx0XHQvLyAudGhlbihmdW5jdGlvbihyZXMpe1xuXHQgICAgXHRcdC8vIFx0Y29uc29sZS5sb2cocmVzLmRhdGEpXG5cdCAgICBcdFx0Ly8gXHR2bS5tZW1iZXJzQ29udGVudCA9IHJlcy5kYXRhO1xuXHQgICAgXHRcdC8vIH0sXG5cdCAgICBcdFx0Ly8gZnVuY3Rpb24oZXJyKXtcblx0ICAgIFx0XHQvLyBcdGNvbnNvbGUubG9nKGVyci5zdGF0dXMgKyBcIiBcIiArIGVyci5zdGF0dXNUZXh0KTtcblx0ICAgIFx0XHQvLyBcdHZtLm1lbWJlcnNDb250ZW50ID0gZXJyLmRhdGE7XG5cdCAgICBcdFx0Ly8gfSlcblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gZ290b1Nlc3Npb24oKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIHJlZnJlc2goKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIHNlYXJjaCgpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblx0fVxuXG59KSgpO1xuXG5cbiIsIihmdW5jdGlvbigpe1xuXHQndXNlIHN0cmljdCdcblxuXHRhbmd1bGFyXG4gICAgXHQubW9kdWxlKCdzYW1wbGUnKVxuICAgIFx0LmZhY3RvcnkoJ3NhbXBsZVNlcnZpY2UnLCBzYW1wbGVTZXJ2aWNlKTtcblxuICAgLy8gc2FtcGxlU2VydmljZS5pbmplY3QgPSBbJyddXG5cbiAgICBmdW5jdGlvbiBzYW1wbGVTZXJ2aWNlKCkge1xuICAgIFx0dmFyIHNlcnZpY2UgPSB7XG5cbiAgICBcdFx0ZXJyb3I6IGVycm9yLFxuICAgIFx0XHRpbmZvOiBpbmZvLFxuICAgIFx0XHRzdWNjZXNzOiBzdWNjZXNzXG5cbiAgICBcdH07XG5cbiAgICBcdHJldHVybiBzZXJ2aWNlO1xuXG4gICAgXHQvLy8vLy8vLy8vLy9cblxuICAgIFx0ZnVuY3Rpb24gZXJyb3IoKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIGluZm8oKSB7XG5cdCAgICAgIC8qICovXG4gICAgICAgICAgLy9jb25zb2xlLmxvZyhcInNhbXBsZVNlcnZpY2VcIik7XG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIHN1Y2Nlc3MoKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cblxuICAgIH1cblxuXHRcblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0J3VzZSBzdHJpY3QnXG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ25vdGlmeScpXG5cdFx0LmNvbnRyb2xsZXIoJ25vdGlmeUN0cmwnLCBub3RpZnlDdHJsKVxuXG5cdC8vIG5vdGlmeUN0cmwuJGluamVjdCA9IFtdXG5cblx0ZnVuY3Rpb24gbm90aWZ5Q3RybCgpIHtcblxuXHQgICAgdmFyIHZtID0gdGhpcztcblxuXHQgICAgdm0uZ290b1Nlc3Npb24gPSBnb3RvU2Vzc2lvbjtcblx0ICAgIHZtLnJlZnJlc2ggPSByZWZyZXNoO1xuXHQgICAgdm0uc2VhcmNoID0gc2VhcmNoO1xuXHQgICAgdm0uc2Vzc2lvbnMgPSBbXTtcblx0ICAgIHZtLnRpdGxlID0gJ25vdGlmeSc7XG5cblx0ICAgIC8vLy8vLy8vLy8vL1xuXG5cdCAgICBcblxuXHQgICAgZnVuY3Rpb24gZ290b1Nlc3Npb24oKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIHJlZnJlc2goKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIHNlYXJjaCgpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblx0fVxuXG59KSgpO1xuXG5cbiIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdub3RpZnknKVxuICAgIC5kaXJlY3RpdmUoJ25vdGlmeScsIG5vdGlmeSlcblxuICAgIG5vdGlmeS4kaW5qZWN0ID0gWydub3RpZnlTZXJ2aWNlJywnJHJvb3RTY29wZScsJyR0aW1lb3V0J11cbiAgICBcblxuZnVuY3Rpb24gbm90aWZ5KCkge1xuXHRyZXR1cm57XG5cdFx0cmVzdHJpY3Q6ICdBRScsXG5cdFx0dGVtcGxhdGU6ICc8bGkgbmctcmVwZWF0PVwiaXRlbSBpbiBub3RpZnlMaXN0XCI+e3tpdGVtfX08L2xpPicsXG5cdFx0bGluazogZnVuY3Rpb24oc2NvcGUsZWxlbWVudCxhdHRycyl7XG5cblx0XHR2YXIgbGkgPSBhbmd1bGFyLmVsZW1lbnQoZWxlbWVudC5jaGlsZHJlbigpWzBdKVxuXHRcdGNvbnNvbGUubG9nKGxpKVxuXHRcdFxuXHRcdGFuaW1hdGVEb3duID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zb2xlLmxvZygnYW5pbWF0aW5nJylcbiAgICAgICAgICAgICQodGhpcykuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgdG9wOiAnKz05OSdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIGFuaW1hdGVSaWdodCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBcdGNvbnNvbGUubG9nKCdhbmltYXRpbmcnKVxuICAgICAgICAgICAgJCh0aGlzKS5hbmltYXRlKHtcbiAgICAgICAgICAgIFx0XG4gICAgICAgICAgICAgICAgbGVmdDogJys9NTAnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAkKGxpKS5vbignY2xpY2snLCBhbmltYXRlUmlnaHQpO1xuICAgICAgIC8vICQobGkpLm9uKCdjbGljaycsIGFuaW1hdGVSaWdodCk7ICBcblx0XHQgICAgIFx0XHRcblx0XHRcdFxuXHRcdFx0ICAgIFxuXG5cblxuXHRcdH0sXG5cdFx0Y29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlLG5vdGlmeVNlcnZpY2UsJHJvb3RTY29wZSwkdGltZW91dCl7XG5cdFx0XHRjb25zb2xlLmxvZygnbm90aWZ5IGRpcmVjdGl2ZScpXG5cdFx0XHRcblx0XHRcdCRzY29wZS5ub3RpZnlMaXN0ID0gW1wiZG9nc1wiLFwiY2F0c1wiXTtcdFx0XHRcblxuXHRcdFx0ICRyb290U2NvcGUuJG9uKCdwdXNoZWQnLGZ1bmN0aW9uKGV2ZW50LG1lc3NhZ2Upe1xuXHRcdFx0IFx0Y29uc29sZS5sb2coXCJkaXJlY3RpdmU6IHJlY2VpdmluZ1wiKTtcblx0XHRcdCBcdCRzY29wZS5ub3RpZnlMaXN0LnB1c2gobWVzc2FnZS5kYXRhKTtcblx0XHRcdCBcdFx0XHRcdCBcdCRzY29wZS4kYXBwbHkoKTtcblx0XHRcdCBcdC8vICR0aW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHQgXHQvLyBcdCRzY29wZS5kYXRhID0gbnVsbDtcblx0XHRcdCBcdC8vIH0sMzAwMClcblxuXHRcdFx0IH0pXG5cdFx0XHRcblx0XHR9XG5cdH1cbn0gLy9lbmQgbm90aWZ5IGRpcmVjdGl2ZVxuIiwiKGZ1bmN0aW9uKCl7XG4gICAgJ3VzZSBzdHJpY3QnXG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ25vdGlmeScpXG4gICAgICAgIC5mYWN0b3J5KCdub3RpZnlTZXJ2aWNlJywgbm90aWZ5U2VydmljZSk7XG5cbiAgICBub3RpZnlTZXJ2aWNlLiRpbmplY3QgPSBbJyRyb290U2NvcGUnXVxuXG4gICAgZnVuY3Rpb24gbm90aWZ5U2VydmljZSgkcm9vdFNjb3BlKSB7XG4gICAgICAgIHZhciBzZXJ2aWNlID0ge1xuXG4gICAgICAgICAgICBwdXNoOiBwdXNoLFxuXG5cbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gc2VydmljZTtcblxuICAgICAgICAvLy8vLy8vLy8vLy9cblxuICAgICAgICBmdW5jdGlvbiBwdXNoKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicHVzaGluZyBmcm9tIHNlcnZpY2VcIik7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRlbWl0KFwicHVzaGVkXCIsIG1lc3NhZ2UpO1xuXG4gICAgICAgIH1cblxuXG5cbiAgICB9XG5cbiAgICBcblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0J3VzZSBzdHJpY3QnXG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ3JlZ2lzdGVyJylcblx0XHQuY29udHJvbGxlcigncmVnaXN0ZXJDdHJsJywgcmVnaXN0ZXJDdHJsKVxuXG5cdHJlZ2lzdGVyQ3RybC5pbmplY3QgPSBbJ3RvYXN0cicsJyRodHRwJywncmVnaXN0ZXJTZXJ2aWNlJ11cblxuXHRmdW5jdGlvbiByZWdpc3RlckN0cmwodG9hc3RyLCRodHRwLHJlZ2lzdGVyU2VydmljZSkge1xuXG5cdCAgICB2YXIgdm0gPSB0aGlzO1xuXG5cdCAgICB2bS5mb3JtID0ge31cblx0ICAgIHZtLnN1Ym1pdFN0YXR1cyA9IFwiXCI7XG5cdCAgICB2bS5zdWJtaXRGb3JtID0gc3VibWl0Rm9ybTtcblx0ICAgIFxuXHQgICAgLy9kaXNwbGF5IGluZm8gb24gbG9hZFxuXHQgICAgaW5mbygpO1xuXG5cdCAgICAvLy8vLy8vLy8vLy9cblxuXHQgICAgZnVuY3Rpb24gc3VibWl0Rm9ybShpc1ZhbGlkKSB7XG5cdCAgICBcdFxuXHQgICAgXHRjb25zb2xlLmxvZyh2bS5mb3JtKTtcblx0ICAgIFx0XG5cdCAgICBcdC8vIGNoZWNrIHRvIG1ha2Ugc3VyZSB0aGUgZm9ybSBpcyBjb21wbGV0ZWx5IHZhbGlkXG5cdFx0ICAgIGlmIChpc1ZhbGlkKSB7XG5cdFx0ICAgICAgY29uc29sZS5sb2coXCJWYWxpZCBGb3JtXCIpO1xuXHRcdCAgICAgIHNlbmRGb3JtKHZtLmZvcm0pO1xuXHRcdCAgICB9XG5cdCAgICB9XG5cblx0ICAgIC8vc2VuZHMgZm9ybSB0byBhcGlcblx0ICAgIGZ1bmN0aW9uIHNlbmRGb3JtKGZvcm0pIHtcblx0XHRcdHJlZ2lzdGVyU2VydmljZS5uZXdVc2VyKHZtLGZvcm0pXG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIGluZm8oKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICAgIGNvbnNvbGUubG9nKFwicmVnaXN0ZXIgY29udHJvbGxlclwiKVxuXHQgICAgfVxuXG5cdH1cblxufSkoKTtcblxuXG4iLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgncmVnaXN0ZXInKVxuICAgIC5kaXJlY3RpdmUoJ3JlZ2lzdGVyRGlyJywgcmVnaXN0ZXJEaXIpO1xuXG5mdW5jdGlvbiByZWdpc3RlckRpcigpIHtcblx0cmV0dXJue1xuXHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0dGVtcGxhdGVVcmw6ICcnLFxuXHRcdHJlcGxhY2U6IHRydWVcblx0XHQvLyBzY29wZToge31cblx0fVxufSIsIihmdW5jdGlvbigpe1xuXHQndXNlIHN0cmljdCdcblxuXHRhbmd1bGFyXG4gICAgXHQubW9kdWxlKCdyZWdpc3RlcicpXG4gICAgXHQuZmFjdG9yeSgncmVnaXN0ZXJTZXJ2aWNlJywgcmVnaXN0ZXJTZXJ2aWNlKTtcblxuICAgIHJlZ2lzdGVyU2VydmljZS5pbmplY3QgPSBbJyRodHRwJywndG9hc3RyJywnYXV0aFNlcnZpY2UnLCckc3RhdGUnLCckcm9vdFNjb3BlJ11cblxuICAgIGZ1bmN0aW9uIHJlZ2lzdGVyU2VydmljZSgkaHR0cCx0b2FzdHIsYXV0aFNlcnZpY2UsJHN0YXRlLCRyb290U2NvcGUpIHtcbiAgICBcdHZhciBzZXJ2aWNlID0ge1xuXG4gICAgICAgICAgICBuZXdVc2VyOiBuZXdVc2VyLFxuICAgIFx0XHRlcnJvcjogZXJyb3IsXG4gICAgXHRcdGluZm86IGluZm8sXG4gICAgXHRcdHN1Y2Nlc3M6IHN1Y2Nlc3NcblxuICAgIFx0fTtcblxuICAgIFx0cmV0dXJuIHNlcnZpY2U7XG5cbiAgICBcdC8vLy8vLy8vLy8vL1xuXG4gICAgICAgIGZ1bmN0aW9uIG5ld1VzZXIodm0sIGZvcm0pIHtcbiAgICAgICAgICAgICRodHRwLnBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGkvdXNlcnMvbmV3VXNlcicsIGZvcm0pXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIGF1dGhTZXJ2aWNlLnNldFRva2VuKHJlcy5kYXRhLnRva2VuKTtcblxuICAgICAgICAgICAgICAvL3RvYXN0XG4gICAgICAgICAgICAgIHRvYXN0ci5zdWNjZXNzKCdZb3UgYXJlIG5vdyBteSBCZXRhIScpO1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xuXG4gICAgICAgICAgICAgIC8vY2hhbmdlIHN0YXR1cyBvbiB2aWV3XG4gICAgICAgICAgICAgIHZtLnN1Ym1pdFN0YXR1cyA9IFwiU3VjY2Vzc1wiO1xuICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAvL2VtcHR5IGZvcm1cbiAgICAgICAgICAgICAgdm0uZm9ybSA9IFwiXCI7XG5cbiAgICAgICAgICAgICAgLy9yZWRpcmVjdFxuICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5tZW1iZXJzJyk7XG5cbiAgICAgICAgICAgICAgJHJvb3RTY29wZS4kZW1pdChcImxvZ2dlZEluXCIpO1xuXG4gICAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgICAgdG9hc3RyLmVycm9yKCdGYWlsZWQ6ICcgKyBlcnIuZGF0YSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgXHRmdW5jdGlvbiBlcnJvcigpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gaW5mbygpIHtcblx0ICAgICAgLyogKi9cbiAgICAgICAgICBjb25zb2xlLmxvZyhcInJlZ2lzdGVyU2VydmljZVwiKTtcblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gc3VjY2VzcygpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblxuXG4gICAgfVxuXG5cdFxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCdcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnc2FtcGxlJylcblx0XHQuY29udHJvbGxlcignc2FtcGxlQ3RybCcsIHNhbXBsZUN0cmwpXG5cblx0c2FtcGxlQ3RybC4kaW5qZWN0ID0gW11cblxuXHRmdW5jdGlvbiBzYW1wbGVDdHJsKCkge1xuXG5cdCAgICB2YXIgdm0gPSB0aGlzO1xuXG5cdCAgICB2bS5nb3RvU2Vzc2lvbiA9IGdvdG9TZXNzaW9uO1xuXHQgICAgdm0ucmVmcmVzaCA9IHJlZnJlc2g7XG5cdCAgICB2bS5zZWFyY2ggPSBzZWFyY2g7XG5cdCAgICB2bS5zZXNzaW9ucyA9IFtdO1xuXHQgICAgdm0udGl0bGUgPSAnU2FtcGxlJztcblxuXHQgICAgLy8vLy8vLy8vLy8vXG5cblx0ICAgIGZ1bmN0aW9uIGdvdG9TZXNzaW9uKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiByZWZyZXNoKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBzZWFyY2goKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cdH1cblxufSkoKTtcblxuXG4iLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgnc2FtcGxlJylcbiAgICAuZGlyZWN0aXZlKCdzYW1wbGVEaXInLCBzYW1wbGVEaXIpO1xuXG5mdW5jdGlvbiBzYW1wbGVEaXIoKSB7XG5cdHJldHVybntcblx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdHRlbXBsYXRlVXJsOiAnJyxcblx0XHRyZXBsYWNlOiB0cnVlXG5cdFx0Ly8gc2NvcGU6IHt9XG5cdH1cbn0iLCIoZnVuY3Rpb24oKXtcblx0J3VzZSBzdHJpY3QnXG5cblx0YW5ndWxhclxuICAgIFx0Lm1vZHVsZSgnc2FtcGxlJylcbiAgICBcdC5mYWN0b3J5KCdzYW1wbGVTZXJ2aWNlJywgc2FtcGxlU2VydmljZSk7XG5cbiAgICBzYW1wbGVTZXJ2aWNlLiRpbmplY3QgPSBbXVxuXG4gICAgZnVuY3Rpb24gc2FtcGxlU2VydmljZSgpIHtcbiAgICBcdHZhciBzZXJ2aWNlID0ge1xuXG4gICAgXHRcdGVycm9yOiBlcnJvcixcbiAgICBcdFx0aW5mbzogaW5mbyxcbiAgICBcdFx0c3VjY2Vzczogc3VjY2Vzc1xuXG4gICAgXHR9O1xuXG4gICAgXHRyZXR1cm4gc2VydmljZTtcblxuICAgIFx0Ly8vLy8vLy8vLy8vXG5cbiAgICBcdGZ1bmN0aW9uIGVycm9yKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBpbmZvKCkge1xuXHQgICAgICAvKiAqL1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwic2FtcGxlU2VydmljZVwiKTtcblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gc3VjY2VzcygpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblxuXG4gICAgfVxuXG5cdFxuXG59KSgpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
