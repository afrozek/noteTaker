(function(){
    'use strict'

angular
    .module('app', [
    	'ui.router',
    	'ngAnimate',
    	'sample',
    	'register',
    	'toastr',
    	'auth',
    	'members',
    	'notes',
        'budget',
        'chart.js',
        'notify',
        'ui.tinymce'
    ])



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





})();; //end iffe


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
			controller: 'notesCtrl',
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


angular
    .module('auth', [
      
    ]);
angular
    .module('budget', [
      'chart.js'
    ]);
angular
    .module('members', [
      
    ]);
angular
    .module('notes', [
      
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


// (function(){
// 	'use strict'

// 	angular
//     	.module('auth')
//     	.factory('authInterceptor', authInterceptor);

//     authInterceptor.inject = ['authService']

//     function authInterceptor(authService) {



//     	var service = {

//     		request: request,
//             response: response

//     	};

//     	return service;

//     	////////////

//     	function request(config) {

//             //console.log("authInterceptor request function")

//             var token = authService.getToken();

//             if(token){
//                 config.headers.authorization = token;
//                 console.log("token present");
//             }
//             else{
//                 console.log("no token");
//             }    
//             return config;
// 	    }

// 	    function response(response) {
//             //console.log("authInterceptor response function")
//             return response;
// 	    }

//     } //end authInterceptor

	

// })();

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
		.module('notes')
		.controller('notesCtrl', notesCtrl)

	notesCtrl.$inject = ['notesService','$scope','$http','toastr']

	function notesCtrl(notesService,$scope, $http, toastr) {
		var vm = this;
		console.log("notes ballsout");

		vm.activate = activate;
		vm.closeTab = closeTab;

		
	    
	    $scope.note1 = "aldsjflkasdj";
	    console.log($scope.note1);
	  	$scope.tinymceOptions = {
		    plugins: 'link image code',
		    toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code | paste'
		  };

		$scope.title = "ratsts";
		$scope.dogs ="froadsasdfadsgs"
		vm.tinymceModel = 'Initial consdsdtent';

		vm.allNotes = [
			{title:"gulp cheat sheet",content:"nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula q"},
			{title:"meteor",content:"nonummy nibh euismod tincidunt ut laoreet dolore magna m consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula q"}
			,
			{title:"jquery",content:"nonummy nibh euismod tincidunt ut laoreet dolore magna m consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula q"}
			,
			{title:"angular",content:"nonummy nibh euismod tincidunt ut laoreet dolore magna m consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula q"}
			,
			{title:"swift",content:"nonummy nibh euismod tincidunt ut laoreet dolore magna m consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula q"}
			
			


		]

		vm.activeNotes = [];


  $scope.tinymceOptions = {
    plugins: 'link image code',
    toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code'
  };



	    ////////////

	    function activate(note) {
	    	vm.activeNotes.push(note);
	    	console.log(vm.activeNotes)
	    }

	    function closeTab(index) {
	      vm.activeNotes.splice(index,1);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUuanMiLCJjb250cm9sbGVycy9hcHAuY29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2FwcC5ob21lLmNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9hcHAubG9naW4uY29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2FwcC5uYXYuY29udHJvbGxlci5qcyIsImRpcmVjdGl2ZXMvc2VsZWN0VGV4dC5kaXJlY3RpdmUuanMiLCJyb3V0ZXMvYXBwLnJvdXRlcy5qcyIsImF1dGgvYXV0aC5tb2R1bGUuanMiLCJidWRnZXQvYnVkZ2V0Lm1vZHVsZS5qcyIsIm1lbWJlcnMvbWVtYmVycy5tb2R1bGUuanMiLCJub3Rlcy9ub3Rlcy5tb2R1bGUuanMiLCJub3RpZnkvbm90aWZ5Lm1vZHVsZS5qcyIsInJlZ2lzdGVyL3JlZ2lzdGVyLm1vZHVsZS5qcyIsInNhbXBsZUNvbXBvbmVudC9zYW1wbGUubW9kdWxlLmpzIiwiYXV0aC9zZXJ2aWNlcy9hdXRoLmludGVyY2VwdG9yLnNlcnZpY2UuanMiLCJhdXRoL3NlcnZpY2VzL2F1dGguc2VydmljZS5qcyIsImJ1ZGdldC9jb250cm9sbGVycy9idWRnZXQuY29udHJvbGxlci5qcyIsImJ1ZGdldC9kaXJlY3RpdmVzL25vdGVzLmRpcmVjdGl2ZS5iYWNrdXAuanMiLCJidWRnZXQvZGlyZWN0aXZlcy9ub3Rlcy5kaXJlY3RpdmUuanMiLCJidWRnZXQvc2VydmljZXMvYnVkZ2V0LnNlcnZpY2UuanMiLCJtZW1iZXJzL2NvbnRyb2xsZXJzL21lbWJlcnMuY29udHJvbGxlci5qcyIsIm1lbWJlcnMvc2VydmljZXMvbWVtYmVycy5zZXJ2aWNlLmpzIiwibm90ZXMvY29udHJvbGxlcnMvbm90ZXMuY29udHJvbGxlci5qcyIsIm5vdGVzL2RpcmVjdGl2ZXMvbm90ZXMuZGlyZWN0aXZlLmJhY2t1cC5qcyIsIm5vdGVzL2RpcmVjdGl2ZXMvbm90ZXMuZGlyZWN0aXZlLmpzIiwibm90ZXMvc2VydmljZXMvbm90ZXMuc2VydmljZS5qcyIsIm5vdGlmeS9jb250cm9sbGVycy9ub3RpZnkuY29udHJvbGxlci5qcyIsIm5vdGlmeS9kaXJlY3RpdmVzL25vdGlmeS5kaXJlY3RpdmUuanMiLCJub3RpZnkvc2VydmljZXMvbm90aWZ5LnNlcnZpY2UuanMiLCJyZWdpc3Rlci9jb250cm9sbGVycy9yZWdpc3Rlci5jb250cm9sbGVyLmpzIiwicmVnaXN0ZXIvZGlyZWN0aXZlcy9yZWdpc3Rlci5kaXJlY3RpdmUuanMiLCJyZWdpc3Rlci9zZXJ2aWNlcy9yZWdpc3Rlci5zZXJ2aWNlLmpzIiwic2FtcGxlQ29tcG9uZW50L2NvbnRyb2xsZXJzL3NhbXBsZS5jb250cm9sbGVyLmpzIiwic2FtcGxlQ29tcG9uZW50L2RpcmVjdGl2ZXMvc2FtcGxlLmRpcmVjdGl2ZS5qcyIsInNhbXBsZUNvbXBvbmVudC9zZXJ2aWNlcy9zYW1wbGUuc2VydmljZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9MQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7XG4gICAgJ3VzZSBzdHJpY3QnXG5cbmFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAnLCBbXG4gICAgXHQndWkucm91dGVyJyxcbiAgICBcdCduZ0FuaW1hdGUnLFxuICAgIFx0J3NhbXBsZScsXG4gICAgXHQncmVnaXN0ZXInLFxuICAgIFx0J3RvYXN0cicsXG4gICAgXHQnYXV0aCcsXG4gICAgXHQnbWVtYmVycycsXG4gICAgXHQnbm90ZXMnLFxuICAgICAgICAnYnVkZ2V0JyxcbiAgICAgICAgJ2NoYXJ0LmpzJyxcbiAgICAgICAgJ25vdGlmeScsXG4gICAgICAgICd1aS50aW55bWNlJ1xuICAgIF0pXG5cblxuXG4ucnVuKFsnJHJvb3RTY29wZScsJyRzdGF0ZScsJ2F1dGhTZXJ2aWNlJywnJHEnLGZ1bmN0aW9uKCRyb290U2NvcGUsICRzdGF0ZSwgYXV0aFNlcnZpY2UgLCRxKSB7XG4gICAgYXV0aFNlcnZpY2UuaW5mbygpO1xuXG4gICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZUVycm9yJywgZnVuY3Rpb24gKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zLCBlcnJvcikge1xuICAgICAgICAgICBcbiAgICAgICAgICAvLyBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNUQVRFIENIQU5HRSBFUlJPUiBFUlJPUiBFUlJPUiBFUlJPUkVSUk9SXCIpO1xuICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5ob21lJylcbiAgICAgICAgXG4gICAgICB9KTtcblxuICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdGFydCcsIGZ1bmN0aW9uIChldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcykge1xuICAgIC8vYXV0aFNlcnZpY2UuaW5mbygpO1xuICAgIC8vYXV0aFNlcnZpY2UuaXNBdXRob3JpemVkKCBldmVudCwgZnJvbVN0YXRlLCB0b1N0YXRlKTtcbiAgICAvL2NvbnNvbGUubG9nKFwic3RhdGUgY2hhbmdpbmdcIik7XG4gICAgLy9jb25zb2xlLmxvZyh0b1N0YXRlKVxuXG4gICAgICAgIGlmKHRvU3RhdGUuZGF0YS5wZXJtaXNzaW9uID09PSB0cnVlKXtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJuZWVkIHBlcm1pc3Npb25cIik7XG4gICAgICAgICAgICAvL3RvU3RhdGUucmVzb2x2ZSA9IHRvU3RhdGUucmVzb2x2ZSB8fCB7fTtcbiAgICAgICAgICAgIC8vdG9TdGF0ZS5yZXNvbHZlID0ge307XG5cbiAgICAgICAgICAgIC8vY2hlY2sgdG8gc2VlIGlmIHRoZXJlIHdhcyBhIHJlc29sdmUgYWxyZWFkeSBhZGRlZFxuICAgICAgICAgICAgaWYoIXRvU3RhdGUucmVzb2x2ZS5hdXRob3JpemF0aW9uUmVzb2x2ZXIpe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdhZGRpbmcgYXV0aCByZXNvbHZlcicpO1xuICAgICAgICAgICAgICAgIC8vYWRkIHJlc29sdmVyXG4gICAgICAgICAgICAgICAgdG9TdGF0ZS5yZXNvbHZlLmF1dGhvcml6YXRpb25SZXNvbHZlciA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXV0aFNlcnZpY2UuaXNBdXRob3JpemVkKGV2ZW50LCBmcm9tU3RhdGUsIHRvU3RhdGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwianVzdCBhZGRlZDogXCIpXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyh0b1N0YXRlLnJlc29sdmUuYXV0aG9yaXphdGlvblJlc29sdmVyKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAvL2p1c3QgdG8gc2hvdyB0aGF0IHRoZSByZXNvbHZlciB3YXMgYWxyZWFkeSBhZGRlZFxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2codG9TdGF0ZS5yZXNvbHZlLmF1dGhvcml6YXRpb25SZXNvbHZlcilcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IC8vZW5kIGlmIG5lZWRzIHBlcm1pc3Npb25cblxuXG4gICAgfSk7IC8vZW5kIHJvb3RTY29wZS4kb25cblxuXG4gICAgXG5cbn1dKTsgLy9lbmQgLnJ1blxuXG5cblxuXG5cbn0pKCk7OyAvL2VuZCBpZmZlXG5cbiIsIihmdW5jdGlvbigpIHtcblx0J3VzZSBzdHJpY3QnXG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ2FwcCcpXG5cdFx0LmNvbnRyb2xsZXIoJ2FwcEN0cmwnLCBhcHBDdHJsKVxuXG5cdGFwcEN0cmwuJGluamVjdCA9IFsnc2FtcGxlU2VydmljZScsJ2F1dGhTZXJ2aWNlJywnJHN0YXRlJywnJGh0dHAnLCd0b2FzdHInLCckcm9vdFNjb3BlJywnbm90aWZ5U2VydmljZSddXG5cblx0ZnVuY3Rpb24gYXBwQ3RybChzYW1wbGVTZXJ2aWNlLGF1dGhTZXJ2aWNlLCRzdGF0ZSwgJGh0dHAsIHRvYXN0ciwgJHJvb3RTY29wZSxub3RpZnlTZXJ2aWNlKSB7XG5cblx0XHQgdmFyIHZtID0gdGhpcztcblxuXHRcdCAvLyBvbiBpbml0aWFsIGxvYWRcblx0XHQgLy8gdXNlciBsb2dpbiBzdGF0dXNcblx0XHQgdm0uaXNMb2dnZWQgPSBhdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQodm0pO1xuXG5cdFx0ICRyb290U2NvcGUuJG9uKCdsb2dnZWRJbicsZnVuY3Rpb24oKXtcblx0XHQgXHR2bS5pc0xvZ2dlZCA9IHRydWU7XG5cdFx0IH0pXG5cblx0XHQgJHJvb3RTY29wZS4kb24oJ2xvZ2dlZE91dCcsZnVuY3Rpb24oKXtcblx0XHQgXHR2bS5pc0xvZ2dlZCA9IGZhbHNlO1xuXHRcdCB9KVxuXG5cdFx0IHZhciBtZXNzYWdlID0ge2RhdGEgOiBcInJvb3N0c1wifTtcblx0XHQgLy9ub3RpZnlTZXJ2aWNlLnB1c2goIG1lc3NhZ2UpO1xuXG5cdFx0IC8vYWxlcnQoXCJ3YXRjaGluZ1wiKTtcblxuXG5cdH0gLy9lbmQgYXBwQ3RybFxuXG59KSgpOztcblxuXG4iLCIoZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0J1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCdhcHAnKVxuXHRcdC5jb250cm9sbGVyKCdob21lQ3RybCcsIGhvbWVDdHJsKVxuXHRcdC5jb250cm9sbGVyKCdwYXJlbnRDdHJsJywgcGFyZW50Q3RybClcblxuXHRob21lQ3RybC5pbmplY3QgPSBbJ3NhbXBsZVNlcnZpY2UnLCckc2NvcGUnXVxuXG5cdGZ1bmN0aW9uIGhvbWVDdHJsKHNhbXBsZVNlcnZpY2UsICRzY29wZSkge1xuXHRcdFxuXHRcdHNhbXBsZVNlcnZpY2UuaW5mbygpO1xuXG5cdCAgICB2YXIgdm0gPSB0aGlzO1xuXG5cdCAgICB2bS5nb3RvU2Vzc2lvbiA9IGdvdG9TZXNzaW9uO1xuXHQgICAgdm0ucmVmcmVzaCA9IHJlZnJlc2g7XG5cdCAgICB2bS5zZWFyY2ggPSBzZWFyY2g7XG5cdCAgICB2bS5zZXNzaW9ucyA9IFtdO1xuXHQgICAgdm0udGVzdCA9ICd0ZXN0JztcblxuXHQgICAgLy8vLy8vLy8vLy8vXG5cblx0ICAgIC8vICRzY29wZS4kb24oJ2RvZ3MnLCBmdW5jdGlvbiAoKSB7XG5cdCAgICAvLyBcdGNvbnNvbGUubG9nKFwicmVjZWl2ZWRcIilcblx0ICAgIC8vIH0pO1xuXG5cdCAgICBmdW5jdGlvbiBnb3RvU2Vzc2lvbigpIHtcblxuXHRcdH1cblxuXHQgICAgZnVuY3Rpb24gcmVmcmVzaCgpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gc2VhcmNoKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXHR9IC8vIGVuZCBob21lQ3RybFxuXG5cdHBhcmVudEN0cmwuaW5qZWN0ID0gWydzYW1wbGVTZXJ2aWNlJywnJHNjb3BlJ11cblxuXHRmdW5jdGlvbiBwYXJlbnRDdHJsKCRzY29wZSkge1xuXHRcdFxuXHQgICAgdmFyIHZtID0gdGhpcztcblx0ICAgIC8vY29uc29sZS5sb2coXCJwYXJlbnRcIilcblxuXHQgICAvLyAkc2NvcGUuJGVtaXQoJ2RvZ3MnLCdzb21lIGRhdGEnKTtcblxuXG5cdH0gLy8gZW5kIHBhcmVudEN0cmxcblxufSkoKTtcblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuIiwiXHQoZnVuY3Rpb24oKXtcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnYXBwJylcblx0XHQuY29udHJvbGxlcihcImxvZ2luQ3RybFwiLCBsb2dpbkN0cmwpXG5cblx0bG9naW5DdHJsLiRpbmplY3QgPSBbJyRzY29wZScsJ3NhbXBsZVNlcnZpY2UnLCdhdXRoU2VydmljZScsJyRzdGF0ZScsJyRodHRwJywndG9hc3RyJ11cblxuXHRmdW5jdGlvbiBsb2dpbkN0cmwoJHNjb3BlLHNhbXBsZVNlcnZpY2UsYXV0aFNlcnZpY2UsJHN0YXRlLCAkaHR0cCwgdG9hc3RyKSB7XG5cdFx0Ly9zYW1wbGVTZXJ2aWNlLmluZm8oKTtcblx0XHQvL2NvbnNvbGUubG9nKFwibG9naW5DdHJsXCIpXG5cblx0ICAgIHZhciB2bSA9IHRoaXM7XG5cdCAgICB2bS51c2VyID0gXCJcIlxuXHQgICAgdm0ubG9naW5Gb3JtID0gXCJcIjtcblx0ICAgIFxuXHQgICAgdm0ubG9naW4gPSBsb2dpbjtcblx0ICAgIHZtLmxvZ291dCA9IGxvZ291dDtcblxuXHQgICAgLy8vLy8vLy8vLy8vXG5cblx0ICAgIGZ1bmN0aW9uIGxvZ2luKCkge1xuXHQgICAgXHRhdXRoU2VydmljZS5sb2dpbih2bS51c2VyLCdhcHAubm90ZXMnKVxuXHRcdFx0dm0udXNlciA9IFwiXCI7XG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIGxvZ291dCgpIHtcblx0ICAgIFx0Y29uc29sZS5sb2coXCJsb2dnaW5nIG91dC4uLlwiKVxuXHQgICAgXHRhdXRoU2VydmljZS5sb2dvdXQoKTtcblx0ICAgIH1cblxuXG5cdH0gLy9lbmQgbG9naW5DdHJsXG5cblxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcblx0J3VzZSBzdHJpY3QnXG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ2FwcCcpXG5cdFx0LmNvbnRyb2xsZXIoJ25hdkN0cmwnLCBuYXZDdHJsKVxuXG5cdG5hdkN0cmwuaW5qZWN0ID0gWycnXVxuXG5cdGZ1bmN0aW9uIG5hdkN0cmwoKSB7XG5cdFx0XG5cdFx0Ly9jb25zb2xlLmxvZygnbmF2IGNvbnRyb2xsZXInKTtcblxuXHQgICAgdmFyIHZtID0gdGhpcztcblxuXG5cdCAgICB2bS5sb2dnZWRJbiA9IHRydWU7XG5cdCAgICB2bS5nb3RvU2Vzc2lvbiA9IGdvdG9TZXNzaW9uO1xuXHQgICAgdm0ucmVmcmVzaCA9IHJlZnJlc2g7XG5cdCAgICB2bS5zZWFyY2ggPSBzZWFyY2g7XG5cdCAgICB2bS5zZXNzaW9ucyA9IFtdO1xuXHQgICAgdm0udGl0bGUgPSAnTmF2Jztcblx0ICAgIC8vJHNjb3BlLnRpdGxlID0gXCJtb3VzZVwiO1xuXG5cdCAgICAvLy8vLy8vLy8vLy9cblxuXHQgICAgZnVuY3Rpb24gZ290b1Nlc3Npb24oKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIHJlZnJlc2goKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIHNlYXJjaCgpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblx0fVxuXG59KSgpO1xuXG5cbiIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAnKVxuICAgIC5kaXJlY3RpdmUoJ3NlbGVjdFRleHQnLCBzZWxlY3RUZXh0KVxuICAgIFxuICAgIHNlbGVjdFRleHQuJGluamVjdCA9IFsnJHdpbmRvdyddXG5cbmZ1bmN0aW9uIHNlbGVjdFRleHQoJHdpbmRvdyl7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICBlbGVtZW50LmJpbmQoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCEkd2luZG93LmdldFNlbGVjdGlvbigpLnRvU3RyaW5nKCkpIHtcbiAgICAgICAgdGhpcy5zZXRTZWxlY3Rpb25SYW5nZSh0aGlzLnZhbHVlLmxlbmd0aCwgdGhpcy52YWx1ZS5sZW5ndGgpXG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59XG5cblxuIiwiXG5hbmd1bGFyLm1vZHVsZSgnYXBwJylcblx0LmNvbmZpZyhbJyR1cmxSb3V0ZXJQcm92aWRlcicsJyRzdGF0ZVByb3ZpZGVyJywnJGh0dHBQcm92aWRlcicsZnVuY3Rpb24oJHVybFJvdXRlclByb3ZpZGVyLCRzdGF0ZVByb3ZpZGVyLCRodHRwUHJvdmlkZXIpe1xuXHRcdFxuXHRcdCR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJ2hvbWUnKTtcblx0XHQvL3N0YXRlc1xuXHRcdCRzdGF0ZVByb3ZpZGVyXG5cblx0XHQuZGVjb3JhdG9yKCdwYXRoJywgZnVuY3Rpb24oc3RhdGUsIHBhcmVudEZuKSB7XG5cdFx0XHQvL2NvbnNvbGUubG9nKFwiY29uZmlndXJpbmcgc3RhdGVzXCIpXHRcblx0XHRcdGlmIChzdGF0ZS5zZWxmLnJlc29sdmUgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRzdGF0ZS5zZWxmLnJlc29sdmUgPSB7fTtcblx0XHRcdFx0c3RhdGUucmVzb2x2ZSA9IHN0YXRlLnNlbGYucmVzb2x2ZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBwYXJlbnRGbihzdGF0ZSk7XG4gICAgICAgICB9KVxuXG5cdFx0LnN0YXRlKCdhcHAnLHtcblx0XHRcdGFic3RyYWN0OiB0cnVlLFxuXHRcdFx0dGVtcGxhdGVVcmw6J2FwcC92aWV3cy9hcHAudmlldy5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdhcHBDdHJsJyxcblx0XHRcdGNvbnRyb2xsZXJBczogJ2FwcCdcblxuXHRcdH0pXG5cblx0XHQuc3RhdGUoJ2FwcC5ob21lJyx7XG5cdFx0XHR1cmw6ICcvaG9tZScsXG5cdFx0XHR0ZW1wbGF0ZVVybDonYXBwL3ZpZXdzL2FwcC5ob21lLmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ2hvbWVDdHJsJyxcblx0XHRcdGNvbnRyb2xsZXJBczogJ2hvbWUnLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRwZXJtaXNzaW9uOiBmYWxzZSxcblx0XHRcdFx0cGVybWlzc2lvbkxldmVsOiBbJ2V2ZXJ5b25lJ11cblx0XHRcdH1cblx0XHR9KVxuXG5cdFx0LnN0YXRlKCdhcHAucmVnaXN0ZXInLHtcblx0XHRcdHVybDogJy9yZWdpc3RlcicsXG5cdFx0XHR0ZW1wbGF0ZVVybDonY29tcG9uZW50cy9yZWdpc3Rlci92aWV3cy9yZWdpc3Rlci52aWV3Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ3JlZ2lzdGVyQ3RybCcsXG5cdFx0XHRjb250cm9sbGVyQXM6ICdyZWdpc3RlcicsXG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdHBlcm1pc3Npb246IGZhbHNlLFxuXHRcdFx0XHRwZXJtaXNzaW9uTGV2ZWw6IFsnZXZlcnlvbmUnXVxuXHRcdFx0fVxuXHRcdH0pXG5cblx0XHQuc3RhdGUoJ2FwcC5tZW1iZXJzJyx7XG5cdFx0XHR1cmw6ICcvbWVtYmVycycsXG5cdFx0XHR0ZW1wbGF0ZVVybDonY29tcG9uZW50cy9tZW1iZXJzL3ZpZXdzL21lbWJlcnMuaG9tZS5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdtZW1iZXJzQ3RybCcsXG5cdFx0XHRjb250cm9sbGVyQXM6ICdtZW1iZXJzJyxcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0cGVybWlzc2lvbjogdHJ1ZSxcblx0XHRcdFx0cGVybWlzc2lvbkxldmVsOiBbJ2FkbWluJywnbWVtYmVyJ11cblx0XHRcdH1cblx0XHR9KVxuXG5cdFx0LnN0YXRlKCdhcHAubm90ZXMnLHtcblx0XHRcdHVybDogJy9ub3RlcycsXG5cdFx0XHR0ZW1wbGF0ZVVybDonY29tcG9uZW50cy9ub3Rlcy92aWV3cy9ub3Rlcy52aWV3Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ25vdGVzQ3RybCcsXG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdHBlcm1pc3Npb246IHRydWUsXG5cdFx0XHRcdHBlcm1pc3Npb25MZXZlbDogWydhZG1pbicsJ21lbWJlciddXG5cdFx0XHR9XG5cdFx0fSlcblxuXHRcdC5zdGF0ZSgnYXBwLmJ1ZGdldCcse1xuXHRcdFx0dXJsOiAnL2J1ZGdldCcsXG5cdFx0XHR0ZW1wbGF0ZVVybDonY29tcG9uZW50cy9idWRnZXQvdmlld3MvYnVkZ2V0LnZpZXcuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnYnVkZ2V0Q3RybCcsXG5cdFx0XHRjb250cm9sbGVyQXM6ICdidWRnZXQnLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRwZXJtaXNzaW9uOiB0cnVlLFxuXHRcdFx0XHRwZXJtaXNzaW9uTGV2ZWw6IFsnYWRtaW4nXVxuXHRcdFx0fVxuXHRcdH0pXG5cblx0XHQvLyRodHRwUHJvdmlkZXIuaW50ZXJjZXB0b3JzLnB1c2goJ2F1dGhJbnRlcmNlcHRvcicpO1xuXG5cblxuXHR9XSk7XG5cbiIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdhdXRoJywgW1xuICAgICAgXG4gICAgXSk7IiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ2J1ZGdldCcsIFtcbiAgICAgICdjaGFydC5qcydcbiAgICBdKTsiLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgnbWVtYmVycycsIFtcbiAgICAgIFxuICAgIF0pOyIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdub3RlcycsIFtcbiAgICAgIFxuICAgIF0pOyIsIihmdW5jdGlvbigpe1xuXHQndXNlIHN0cmljdCdcblxuYW5ndWxhclxuXHQubW9kdWxlKCdub3RpZnknLCBbXG5cdCAgXG5cdF0pO1xuXG59KSgpO1xuXG5cbiIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdyZWdpc3RlcicsIFtcbiAgICBcdCdhdXRoJ1xuICAgIF0pOyIsIihmdW5jdGlvbigpe1xuXHQndXNlIHN0cmljdCdcblxuYW5ndWxhclxuXHQubW9kdWxlKCdzYW1wbGUnLCBbXG5cdCAgXG5cdF0pO1xuXG59KSgpO1xuXG4iLCIvLyAoZnVuY3Rpb24oKXtcbi8vIFx0J3VzZSBzdHJpY3QnXG5cbi8vIFx0YW5ndWxhclxuLy8gICAgIFx0Lm1vZHVsZSgnYXV0aCcpXG4vLyAgICAgXHQuZmFjdG9yeSgnYXV0aEludGVyY2VwdG9yJywgYXV0aEludGVyY2VwdG9yKTtcblxuLy8gICAgIGF1dGhJbnRlcmNlcHRvci5pbmplY3QgPSBbJ2F1dGhTZXJ2aWNlJ11cblxuLy8gICAgIGZ1bmN0aW9uIGF1dGhJbnRlcmNlcHRvcihhdXRoU2VydmljZSkge1xuXG5cblxuLy8gICAgIFx0dmFyIHNlcnZpY2UgPSB7XG5cbi8vICAgICBcdFx0cmVxdWVzdDogcmVxdWVzdCxcbi8vICAgICAgICAgICAgIHJlc3BvbnNlOiByZXNwb25zZVxuXG4vLyAgICAgXHR9O1xuXG4vLyAgICAgXHRyZXR1cm4gc2VydmljZTtcblxuLy8gICAgIFx0Ly8vLy8vLy8vLy8vXG5cbi8vICAgICBcdGZ1bmN0aW9uIHJlcXVlc3QoY29uZmlnKSB7XG5cbi8vICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJhdXRoSW50ZXJjZXB0b3IgcmVxdWVzdCBmdW5jdGlvblwiKVxuXG4vLyAgICAgICAgICAgICB2YXIgdG9rZW4gPSBhdXRoU2VydmljZS5nZXRUb2tlbigpO1xuXG4vLyAgICAgICAgICAgICBpZih0b2tlbil7XG4vLyAgICAgICAgICAgICAgICAgY29uZmlnLmhlYWRlcnMuYXV0aG9yaXphdGlvbiA9IHRva2VuO1xuLy8gICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidG9rZW4gcHJlc2VudFwiKTtcbi8vICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgIGVsc2V7XG4vLyAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJubyB0b2tlblwiKTtcbi8vICAgICAgICAgICAgIH0gICAgXG4vLyAgICAgICAgICAgICByZXR1cm4gY29uZmlnO1xuLy8gXHQgICAgfVxuXG4vLyBcdCAgICBmdW5jdGlvbiByZXNwb25zZShyZXNwb25zZSkge1xuLy8gICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImF1dGhJbnRlcmNlcHRvciByZXNwb25zZSBmdW5jdGlvblwiKVxuLy8gICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuLy8gXHQgICAgfVxuXG4vLyAgICAgfSAvL2VuZCBhdXRoSW50ZXJjZXB0b3JcblxuXHRcblxuLy8gfSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHQvLyd1c2Ugc3RyaWN0J1xuXG5cdGFuZ3VsYXJcbiAgICBcdC5tb2R1bGUoJ2F1dGgnLFtdKVxuICAgIFx0LmZhY3RvcnkoJ2F1dGhTZXJ2aWNlJywgYXV0aFNlcnZpY2UpO1xuXG4gICAgYXV0aFNlcnZpY2UuJGluamVjdCA9IFsnJHdpbmRvdycsJyRodHRwJywndG9hc3RyJywnJHN0YXRlJywnJHJvb3RTY29wZScsJyRsb2NhdGlvbicsJyRxJ107XG5cbiAgICBmdW5jdGlvbiBhdXRoU2VydmljZSgkd2luZG93LCRodHRwLHRvYXN0ciwkc3RhdGUsJHJvb3RTY29wZSwkbG9jYXRpb24sJHEpIHtcblxuICAgIFxuXG4gICAgXHR2YXIgc2VydmljZSA9IHtcblxuICAgICAgICAgICAgaW5mbzogaW5mbyxcblxuICAgICAgICAgICAgbG9naW46IGxvZ2luLFxuICAgICAgICAgICAgbG9nb3V0OiBsb2dvdXQsXG5cbiAgICBcdFx0c2V0VG9rZW46IHNldFRva2VuLFxuICAgICAgICAgICAgZ2V0VG9rZW46IGdldFRva2VuLFxuICAgIFx0XHRjbGVhclRva2VuOiBjbGVhclRva2VuLFxuXG4gICAgICAgICAgICBpc0F1dGhlbnRpY2F0ZWQ6IGlzQXV0aGVudGljYXRlZCwgLy8gdmVyaWZpZXMgdG9rZW5cbiAgICAgICAgICAgIGlzQXV0aG9yaXplZDogaXNBdXRob3JpemVkIC8vIHZlcmlmaWVzIHJvdXRlIHBlcm1pc3Npb25zXG5cbiAgICBcdH07XG5cbiAgICBcdHJldHVybiBzZXJ2aWNlO1xuXG4gICAgXHQvLy8vLy8vLy8vLy9cblxuICAgICAgICBmdW5jdGlvbiBpbmZvICgpIHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJhdXRoIHNlcnZpY2VcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyByZWRpcmVjdCB0YWtlcyByb3V0ZSBzdHJpbmcgaWUuICdhcHAuaG9tZSdcbiAgICAgICAgZnVuY3Rpb24gbG9naW4gKHVzZXJMb2dpbkRhdGEsIHJlZGlyZWN0KSB7XG4gICAgICAgICAgICAkaHR0cC5wb3N0KCdodHRwOi8vbG9jYWxob3N0OjMwMDAvYXBpL3VzZXJzL2xvZ2luJywgdXNlckxvZ2luRGF0YSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXMpe1xuICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgICAgICAgICAgICAgIGlmKHJlcy5zdGF0dXMgPT0gMjAwKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRva2VuKHJlcy5kYXRhLnRva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGVtaXQoXCJsb2dnZWRJblwiKTsgIFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9hc3RyLnN1Y2Nlc3MocmVzLmRhdGEubWVzc2FnZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHR5cGVvZihyZWRpcmVjdCkgIT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28ocmVkaXJlY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmdW5jdGlvbihlcnIpe1xuICAgICAgICAgICAgICAgICAgICB0b2FzdHIuZXJyb3IoZXJyLmRhdGEubWVzc2FnZSlcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKVxuICAgICAgICAgICAgICAgIH0pXG5cblxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gbG9nb3V0ICgpIHtcbiAgICAgICAgICAgIGNsZWFyVG9rZW4oKTtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGVtaXQoXCJsb2dnZWRPdXRcIik7XG4gICAgICAgICAgICAkc3RhdGUuZ28oXCJhcHAuaG9tZVwiKTtcbiAgICAgICAgICAgIHRvYXN0ci5zdWNjZXNzKFwiWW91IGhhdmUgYmVlbiBsb2dnZWQgb3V0XCIpO1xuICAgICAgICB9XG5cblxuXG4gICAgXHRmdW5jdGlvbiBzZXRUb2tlbiAodG9rZW4pIHtcbiAgICAgICAgICAgICR3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3VzZXJUb2tlbicsdG9rZW4pO1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBnZXRUb2tlbiAoKSB7XG4gICAgICAgICAgICB2YXIgdG9rZW4gPSAkd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKCd1c2VyVG9rZW4nKTtcbiAgICAgICAgICAgIHJldHVybiB0b2tlbjtcblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gY2xlYXJUb2tlbiAoKSB7XG4gICAgICAgICAgICAkd2luZG93LmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCd1c2VyVG9rZW4nKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdyYWJiaXRzJylcblx0ICAgIH1cblxuICAgICAgICAvL2Jhc2ljYWxseSBhcmUgdGhleSBsb2dnZWQgaW5cbiAgICAgICAgZnVuY3Rpb24gaXNBdXRoZW50aWNhdGVkICgpIHtcblxuICAgICAgICAgICAgdmFyIHRva2VuID0gZ2V0VG9rZW4oKTtcbiAgICAgICAgICAgIGlmKHRva2VuKXtcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCdodHRwOi8vbG9jYWxob3N0OjMwMDAvYXBpL3VzZXJzL2F1dGhvcml6ZScse3Rva2VuOnRva2VufSlcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhyZXMpXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnYXV0aG9yaXppbmcuLicpXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiggcmVzLmRhdGEuc3VjY2VzcyA9PSB0cnVlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2FzdHIuc3VjY2VzcyhcIkF1dGhlbnRpY2F0aW9uIFN1Y2Nlc3MhXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJBdXRoZW50aWNhdGlvbiBTdWNjZXNzIVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGVtaXQoXCJsb2dnZWRJblwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3RvYXN0ci5lcnJvcihcIkF1dGhlbnRpY2F0aW9uIEZhaWxlZFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQXV0aGVudGljYXRpb24gRmFpbGVkXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LGZ1bmN0aW9uKGVycil7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b2FzdHIuZXJyb3IoZXJyLmRhdGEpXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAvL3RvYXN0ci5lcnJvcihcImF1dGhlbnRpY2F0aW9uIGZhaWxlZCwgbm8gdG9rZW4gcHJlc2VudFwiKVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYXV0aGVudGljYXRpb24gZmFpbGVkLCBubyB0b2tlbiBwcmVzZW50XCIpXG4gICAgICAgICAgICB9IFxuICAgICAgICAgICBcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGlzQXV0aG9yaXplZCAoZXZlbnQsIGZyb21TdGF0ZSwgdG9TdGF0ZSkge1xuICAgICAgICAgICAgICAgIC8vcmV0dXJuICRxLnJlamVjdCgpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicnVubmluZyBpcyBhdXRob3JpemVkXCIpXG5cbiAgICAgICAgICAgICAgICAvL2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgdmFyIHRva2VuID0gZ2V0VG9rZW4oKTtcbiAgICAgICAgICAgICAgICB2YXIgdXNlcmxldmVsID0gbnVsbDtcbiAgICAgICAgICAgICAgICB2YXIgcHJvY2VlZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgaWYodG9rZW4pe1xuICAgICAgICAgICAgICAgICAgLy8gIHJldHVybiAkcS5yZWplY3Q7XG4gICAgICAgICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGkvdXNlcnMvYXV0aG9yaXplJyx7dG9rZW46dG9rZW59KVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdhdXRob3JpemluZy4uJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiggcmVzLmRhdGEuc3VjY2VzcyA9PSB0cnVlICYmIHJlcy5kYXRhLnByb2ZpbGUudXNlckxldmVsKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcy5kYXRhLnByb2ZpbGUudXNlckxldmVsKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyTGV2ZWwgPSByZXMuZGF0YS5wcm9maWxlLnVzZXJMZXZlbDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vbG9vcCB0aHJvdWdoIHBlcm1pc3Npb24gbGlzdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGk9MDsgaSA8IHRvU3RhdGUuZGF0YS5wZXJtaXNzaW9uTGV2ZWwubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vaWYgY3VycmVudCB1c2VybGV2ZWwgbWF0Y2hlcyBwZXJtaXNzaW9uIGxldmVsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy90aGVuIHNldCBwcm9jZWVkIHRvIHRydWUgYW5kIGJyZWFrIHRoZSBmb3IgbG9vcCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImN1cnJlbnQgbG9vcCBpIDogXCIgKyB0b1N0YXRlLmRhdGEucGVybWlzc2lvbkxldmVsW2ldKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHVzZXJMZXZlbCA9PSB0b1N0YXRlLmRhdGEucGVybWlzc2lvbkxldmVsW2ldKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicGVybWlzc2lvbiBtYXRjaFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzZXR0aW5nIHByb2NlZWQgdHJ1ZVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2VlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vcmV0dXJuIHRvYXN0ci5zdWNjZXNzKFwicHJvY2VlZFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImtlZXAgbG9va2luZ1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzZXR0aW5nIHByb2NlZWQgZmFsc2VcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2NlZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfS8vZW5kIGZvciBsb29wICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IC8vIGVuZCBpZiBwcm9maWxlIHJldHVybmVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZWxzZSBubyBwcm9maWxlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9hc3RyLmVycm9yKFwiYmFkIHJlcXVlc3RcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2VlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibGFzdCBjaGVja1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHByb2NlZWQgPT0gZmFsc2Upe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIklUUyBGQUxTRVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmhvbWUnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pIC8vZW5kIHRoZW5cbiAgICAgICAgICAgICAgICB9Ly9lbmQgaWYgdG9rZW5cblxuICAgICAgICAgICAgICAgIC8vZWxzZSBubyB0b2tlbiBcbiAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICB0b2FzdHIuZXJyb3IoXCJubyB0b2tlbiBwcmVzZW50XCIpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgXG5cbiAgICAgICAgfS8vZW5kIGlzQXV0aG9yaXplZFxuICAgICAgICBcblxuICAgIH0vL2VuZCBhdXRoU2VydmljZVxuXG5cblxuXHRcblxufSkoKTsgLy9lbmQgaWZmZVxuXG5cbiIsIihmdW5jdGlvbigpIHtcblx0J3VzZSBzdHJpY3QnXG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ2J1ZGdldCcpXG5cdFx0LmNvbnRyb2xsZXIoJ2J1ZGdldEN0cmwnLCBidWRnZXRDdHJsKVxuXG5cdGJ1ZGdldEN0cmwuJGluamVjdCA9IFsnJHNjb3BlJywnJGh0dHAnLCd0b2FzdHInXVxuXG5cdGZ1bmN0aW9uIGJ1ZGdldEN0cmwoJHNjb3BlLCAkaHR0cCwgdG9hc3RyKSB7XG5cdFx0Y29uc29sZS5sb2coJ2xvYWRlZCBidWRnZXRDdHJsJyk7XG5cdFxuXHRcdC8vICRzY29wZS5NYXRoID0gd2luZG93Lk1hdGg7XG5cblx0XHQgICAgXG5cblxuICBcdFx0XHQvLyBpbmNvbWVcbiAgXHRcdFx0JHNjb3BlLmluY29tZSA9IHt9XG4gIFx0XHRcdCRzY29wZS5pbmNvbWUubW9udGhseSA9IDQ1MDA7XG5cbiAgXHRcdFx0Ly8gYmlsbHNcbiAgXHRcdFx0JHNjb3BlLmJpbGxzID1bXVxuICBcdFx0XHQkc2NvcGUuYmlsbHMgPSBbXG4gIFx0XHRcdFx0e25hbWU6XCJyZW50XCIsIGNvc3Q6IDI1MDB9LFxuICBcdFx0XHRcdHtuYW1lOlwidXRpbGl0aWVzXCIsIGNvc3Q6IDIwMH0sXG4gIFx0XHRcdFx0e25hbWU6XCJjYXIgaW5zdXJhbmNlXCIsIGNvc3Q6IDE1MH0sXG4gIFx0XHRcdFx0e25hbWU6XCJjYXIgcGF5bWVudFwiLCBjb3N0OiAyNTB9LFxuICBcdFx0XHRcdHtuYW1lOlwiZ2FzXCIsIGNvc3Q6IDEwMH0sXG4gIFx0XHRcdFx0e25hbWU6XCJneW0gbWVtYmVyc2hpcFwiLCBjb3N0OiA1MH0sXG4gIFx0XHRcdFx0e25hbWU6XCJjZWxsIHBob25lXCIsIGNvc3Q6IDgwfSxcblxuICBcdFx0XHRdXG5cbiAgICAgICAgXG5cbiAgXHRcdFx0JHNjb3BlLmFkZE5ld0JpbGwgPSBmdW5jdGlvbigpe1xuICBcdFx0XHRcdCRzY29wZS5iaWxscy5wdXNoKHtuYW1lOiAkc2NvcGUubmV3QmlsbE5hbWUsIGNvc3Q6IDAgfSlcbiAgXHRcdFx0XHQkc2NvcGUubmV3QmlsbE5hbWUgPSBcIlwiO1xuICBcdFx0XHR9XG5cbiAgXHRcdFx0JHNjb3BlLnJlbW92ZUJpbGxJdGVtID0gZnVuY3Rpb24oaW5kZXgpe1xuICBcdFx0XHRcdCRzY29wZS5iaWxscy5zcGxpY2UoaW5kZXgsMSk7XG4gIFx0XHRcdH1cblxuICBcdFx0XHQvL2J1ZGdldCBpdGVtc1xuICBcdFx0XHQkc2NvcGUuYnVkZ2V0SXRlbXMgPSBbXTtcbiAgXHRcdFx0JHNjb3BlLmJ1ZGdldEl0ZW1zID0gW1xuICBcdFx0XHRcdHtuYW1lOiBcImVhdCBvdXRcIiwgYnVkZ2V0OiAxMDAsIHNwZW50OiAzMCB9LFxuICBcdFx0XHRcdHtuYW1lOiBcImNsb3RoaW5nXCIsIGJ1ZGdldDogMjAwLCBzcGVudDogOTB9XG4gIFx0XHRcdF1cblxuICBcdFx0XHQkc2NvcGUuYWRkTmV3QnVkZ2V0SXRlbSA9IGZ1bmN0aW9uKCl7XG4gIFx0XHRcdFx0JHNjb3BlLmJ1ZGdldEl0ZW1zLnB1c2goe25hbWU6ICRzY29wZS5uZXdCdWRnZXRJdGVtTmFtZSwgYnVkZ2V0OiAwLCBzcGVudDogMCB9KVxuICBcdFx0XHRcdCRzY29wZS5uZXdCdWRnZXRJdGVtTmFtZSA9IFwiXCI7XG4gIFx0XHRcdH1cblxuICAgICAgICAkc2NvcGUucHVyY2hhc2VzID0gW11cbiAgICAgICAgJHNjb3BlLnB1cmNoYXNlcyA9IFt7Y2F0ZWdvcnk6IFwiZWF0IG91dFwifV1cblxuICAgICAgICAkc2NvcGUuYWRkUHVyY2hhc2VJdGVtID0gZnVuY3Rpb24oKXtcblxuICAgICAgICB9XG5cblxuICAgICAgICAkc2NvcGUubW9udGhseU92ZXJ2aWV3ID0ge307XG4gICAgICAgICRzY29wZS5tb250aGx5T3ZlcnZpZXcuYmlsbHNUb3RhbCA9IDA7XG4gICAgICAgICRzY29wZS5tb250aGx5T3ZlcnZpZXcuYnVkZ2V0VG90YWwgPSAwO1xuICAgICAgICAkc2NvcGUubW9udGhseU92ZXJ2aWV3LmJ1ZGdldFNwZW50VG90YWwgPSAwO1xuICAgICAgICAkc2NvcGUubW9udGhseU92ZXJ2aWV3LnRvdGFsRXN0aW1hdGVkRXhwZW5kaXR1cmUgPSAwO1xuXG4gICAgICAgIFxuICAgICAgICAkc2NvcGUuY2FsY3VsYXRlQmlsbHNUb3RhbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciB0b3RhbCA9IDA7XG4gICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8ICRzY29wZS5iaWxscy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICB0b3RhbCA9IHRvdGFsICsgJHNjb3BlLmJpbGxzW2ldLmNvc3Q7XG4gICAgICAgICAgfVxuICAgICAgICAgICRzY29wZS5tb250aGx5T3ZlcnZpZXcuYmlsbHNUb3RhbCA9IHRvdGFsO1xuICAgICAgICAgICRzY29wZS5jYWxjdWxhdGVUb3RhbEV4cGVuZGl0dXJlKClcbiAgICAgICAgICByZXR1cm4gdG90YWw7XG4gICAgICAgIH1cblxuICAgICAgICBcblxuICAgICAgICAkc2NvcGUuY2FsY3VsYXRlQnVkZ2V0VG90YWwgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgdG90YWwgPSAwO1xuICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCAkc2NvcGUuYnVkZ2V0SXRlbXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgdG90YWwgPSB0b3RhbCArICRzY29wZS5idWRnZXRJdGVtc1tpXS5idWRnZXQ7XG4gICAgICAgICAgfVxuICAgICAgICAgICRzY29wZS5tb250aGx5T3ZlcnZpZXcuYnVkZ2V0VG90YWwgPSB0b3RhbDtcbiAgICAgICAgICAkc2NvcGUuY2FsY3VsYXRlVG90YWxFeHBlbmRpdHVyZSgpXG4gICAgICAgICAgcmV0dXJuIHRvdGFsOyAgICAgICBcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5jYWxjdWxhdGVCdWRnZXRTcGVudFRvdGFsID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIHRvdGFsID0gMDtcbiAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgJHNjb3BlLmJ1ZGdldEl0ZW1zLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIHRvdGFsID0gdG90YWwgKyAkc2NvcGUuYnVkZ2V0SXRlbXNbaV0uc3BlbnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgICRzY29wZS5tb250aGx5T3ZlcnZpZXcuYnVkZ2V0U3BlbnRUb3RhbCA9IHRvdGFsO1xuICAgICAgICAgIC8vJHNjb3BlLmNhbGN1bGF0ZVRvdGFsRXhwZW5kaXR1cmUoKVxuICAgICAgICAgIHJldHVybiB0b3RhbDsgICAgICAgXG4gICAgICAgIH1cblxuICAgICAgICBcblxuXG5cbiAgICAgICAkc2NvcGUuJHdhdGNoKFwiYmlsbHNcIiwgJHNjb3BlLmNhbGN1bGF0ZUJpbGxzVG90YWwsIHRydWUpXG4gICAgICAgJHNjb3BlLiR3YXRjaChcImJ1ZGdldEl0ZW1zXCIsICRzY29wZS5jYWxjdWxhdGVCdWRnZXRUb3RhbCwgdHJ1ZSlcbiAgICAgICAkc2NvcGUuJHdhdGNoKFwiYnVkZ2V0SXRlbXNcIiwgJHNjb3BlLmNhbGN1bGF0ZUJ1ZGdldFNwZW50VG90YWwsIHRydWUpXG5cbiAgICAgLy8gJHNjb3BlLiR3YXRjaChcImJ1ZGdldEl0ZW1zXCIsICRzY29wZS5jYWxjdWxhdGVCdWRnZXRUb3RhbCwgdHJ1ZSlcblxuXG4gICAgICAgICRzY29wZS5jYWxjdWxhdGVUb3RhbEV4cGVuZGl0dXJlID0gZnVuY3Rpb24gICgpIHtcbiAgICAgICAgICAgICAkc2NvcGUubW9udGhseU92ZXJ2aWV3LnRvdGFsRXN0aW1hdGVkRXhwZW5kaXR1cmUgPSAkc2NvcGUubW9udGhseU92ZXJ2aWV3LmJpbGxzVG90YWwgKyAkc2NvcGUubW9udGhseU92ZXJ2aWV3LmJ1ZGdldFRvdGFsO1xuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLmNhbGN1bGF0ZUJpbGxzVG90YWwoKTtcbiAgICAgICAgJHNjb3BlLmNhbGN1bGF0ZUJ1ZGdldFRvdGFsKCk7XG4gICAgICAgICRzY29wZS5jYWxjdWxhdGVCdWRnZXRTcGVudFRvdGFsKCk7XG4gICAgICAgICRzY29wZS5jYWxjdWxhdGVUb3RhbEV4cGVuZGl0dXJlKCk7XG5cbiAgICAgICAgJHNjb3BlLmxhYmVscyA9IFtcIkJpbGxzXCIsIFwiQnVkZ2V0XCIsIFwiUmVtYWluaW5nXCJdO1xuICAgICAgICAkc2NvcGUuZGF0YSA9IFskc2NvcGUubW9udGhseU92ZXJ2aWV3LmJpbGxzVG90YWwsXG4gICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5tb250aGx5T3ZlcnZpZXcuYnVkZ2V0VG90YWwsXG4gICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5pbmNvbWUubW9udGhseSAtICRzY29wZS5tb250aGx5T3ZlcnZpZXcudG90YWxFc3RpbWF0ZWRFeHBlbmRpdHVyZV07XG5cblxuXG5cblxuXHR9XG5cbn0pKCk7XG5cblxuIiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ25vdGVzJylcbiAgICAuZGlyZWN0aXZlKCdub3RlQ2FyZCcsIG5vdGVDYXJkKTtcblxuZnVuY3Rpb24gbm90ZUNhcmQoKSB7XG5cdHJldHVybntcblx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdHNjb3BlOiB7XG5cdFx0XHRkYXRhOiBcIj1cIixcblx0XHRcdGRyYWdnYWJsZTogXCI9XCJcblx0XHR9LFxuXHRcdHJlcGxhY2U6IHRydWUsXG5cdFx0dGVtcGxhdGU6IFwiPGgxPnt7ZG9nc319e3tkcmFnU3RhdHVzfX08L2gxPlwiLFxuXHRcdGxpbms6IGZ1bmN0aW9uKHNjb3BlLGVsZW1lbnQpe1xuXHRcdFx0ZWxlbWVudC5jbGljayhmdW5jdGlvbigpe1xuXHRcdFx0XHRjb25zb2xlLmxvZyhlbGVtZW50KVxuXHRcdFx0XHRlbGVtZW50WzBdLmRyYWdnYWJsZSA9IHRydWU7XG5cdFx0XHR9KVxuXHRcdH0sXG5cdFx0Y29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKXtcblx0XHRcdC8vYWxlcnQoXCJjb250cm9sbGVyXCIpO1xuXHRcdFx0JHNjb3BlLmRvZ3MgPSAkc2NvcGUuZGF0YSArIFwiZG9nc1wiO1xuXHRcdFx0aWYoJHNjb3BlLmRyYWdnYWJsZSlcblx0XHRcdFx0JHNjb3BlLmRyYWdTdGF0dXMgPSBmYWxzZTtcblx0XHRcdGVsc2UgJHNjb3BlLmRyYWdTdGF0dXMgPSB0cnVlO1xuXG5cdFx0XHRcblx0XHR9XG5cdH1cbn1cblxuXG5cbi8vIGFuZ3VsYXJcbi8vICAgICAubW9kdWxlKCdub3RlcycpXG4vLyAgICAgLmRpcmVjdGl2ZSgnbm90ZUNhcmQnLCBub3RlQ2FyZCk7XG5cbi8vIGZ1bmN0aW9uIG5vdGVDYXJkKCkge1xuLy8gXHRyZXR1cm57XG4vLyBcdFx0cmVzdHJpY3Q6ICdFJyxcbi8vIFx0XHRjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpe1xuLy8gXHRcdFx0YWxlcnQoXCJjb250cm9sbGVyXCIpO1xuLy8gXHRcdFx0Y29uc29sZS5sb2coJ2RvZycpXG4vLyBcdFx0fSxcbi8vIFx0XHR0ZW1wbGF0ZVVybDogJycsXG4vLyBcdFx0cmVwbGFjZTogdHJ1ZVxuLy8gXHRcdC8vIHNjb3BlOiB7fVxuLy8gXHR9XG4vLyB9IiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ25vdGVzJylcbiAgICAuZGlyZWN0aXZlKCdub3RlQ2FyZHMnLCBub3RlQ2FyZHMpXG5cblxuICAgIFxuXG5mdW5jdGlvbiBub3RlQ2FyZHMoKSB7XG5cdHJldHVybntcblx0XHRyZXN0cmljdDogJ0FFJyxcblx0XHRzY29wZToge1xuXHRcdFx0bm90ZXM6IFwiPVwiLFxuXHRcdFx0bmV3SXRlbTogXCI9XCJcblx0XHR9LFxuXHRcdHJlcGxhY2U6IGZhbHNlLFxuXHRcdHRyYW5zY2x1ZGU6IGZhbHNlLFxuXHRcdHRlbXBsYXRlVXJsOiBcImNvbXBvbmVudHMvbm90ZXMvdmlld3Mvbm90ZS5kaXJlY3RpdmUudmlldy5odG1sXCIsXG5cdFx0bGluazogZnVuY3Rpb24oc2NvcGUsZWxlbWVudCxhdHRycyl7XG5cdFx0XHQvLyQoIFwiI3NvcnRhYmxlXCIgKS5zb3J0YWJsZSgpO1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhzY29wZSlcblx0XHRcdC8vY29uc29sZS5sb2coZWxlbWVudClcblx0XHRcdC8vY29uc29sZS5sb2coYXR0cnMpXG5cdFx0XHQvL2VsZW1lbnQuc29ydGFibGUoKTtcblx0XHRcdC8vY29uc29sZS5sb2coc2NvcGUubm90ZXMpXG5cdFx0XHRzY29wZS5kb2dzID0gZnVuY3Rpb24obm90ZSl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKG5vdGUpXG5cdFx0XHR9XG5cblxuXHRcdFx0ZWxlbWVudC5zb3J0YWJsZSh7XG5cdFx0ICAgICAgIC8vIHBsYWNlaG9sZGVyOiBcInVpLXN0YXRlLWhpZ2hsaWdodFwiLFxuXHRcdCAgICAgICAgc3RhcnQ6IGZ1bmN0aW9uKGV2ZW50LCB1aSkge1xuXHRcdCAgICAgICAgICAgIHZhciBzdGFydF9wb3MgPSB1aS5pdGVtLmluZGV4KCk7XG5cdFx0ICAgICAgICAgICAgdWkuaXRlbS5kYXRhKCdzdGFydF9wb3MnLCBzdGFydF9wb3MpO1xuXHRcdCAgICAgICAgfSxcblx0XHQgICAgICAgIHVwZGF0ZTogZnVuY3Rpb24oZXZlbnQsIHVpKSB7XG5cdFx0ICAgICAgICAgICAgdmFyIHN0YXJ0X3BvcyA9IHVpLml0ZW0uZGF0YSgnc3RhcnRfcG9zJyk7XG5cdFx0ICAgICAgICAgICAgdmFyIGVuZF9wb3MgPSB1aS5pdGVtLmluZGV4KCk7XG5cdFx0ICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhzdGFydF9wb3MgKyAnIC0gJyArIGVuZF9wb3MpO1xuXHRcdCAgICAgICAgICBcblx0XHQgICAgICAgICAgdmFyIHN0YXJ0SXRlbSA9IHNjb3BlLm5vdGVzW3N0YXJ0X3Bvc107XG5cdFx0ICAgICAgICAgICBzY29wZS5ub3Rlcy5zcGxpY2Uoc3RhcnRfcG9zLDEpXG5cdFx0ICAgICAgICAgICBzY29wZS5ub3Rlcy5zcGxpY2UoZW5kX3BvcywwLCBzdGFydEl0ZW0pXG5cdFx0ICAgICAgICAgICBzY29wZS4kYXBwbHkoKTtcblxuXHRcdCAgICAgICAgICAgLy9jb25zb2xlLmxvZyhzY29wZS5ub3Rlcylcblx0XHQgICAgICAgICAgIFxuXHRcdCAgICAgICAgICAgXG5cdFx0ICAgICAgICB9XG5cdFx0ICAgIH0pOyAvLyBlbmQgc29ydGFibGVcblxuXHRcdCAgIFxuXG5cdFx0ICAgIGNvbnNvbGUubG9nKGVsZW1lbnQpXG5cblxuXHRcdH0sXG5cdFx0Y29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKXtcblx0XHRcdCRzY29wZS5mb3JtID17fVxuXHRcdFx0JHNjb3BlLmFkZEl0ZW0gPSBmdW5jdGlvbihpbmRleCxpdGVtKXtcblx0XHRcdFx0Ly9hbGVydChpbmRleClcblx0XHRcdFx0Y29uc29sZS5sb2coJHNjb3BlLm5ld0l0ZW0pXG5cdFx0XHRcdCRzY29wZS5ub3Rlc1tpbmRleF0uaXRlbXMucHVzaChpdGVtKVxuXHRcdFx0XHQkc2NvcGUuZm9ybSA9IHt9XG5cdFx0XHRcdC8vY29uc29sZS5sb2coJHNjb3BlLm5vdGVzW2luZGV4XS5pdGVtcylcblx0XHRcdH1cblxuXHRcdFx0JHNjb3BlLmRlbGV0ZU5vdGUgPSBmdW5jdGlvbihpbmRleCl7XG5cdFx0XHRcdCRzY29wZS5ub3Rlcy5zcGxpY2UoaW5kZXgsMSk7XG5cdFx0XHR9XG5cblxuXHRcdFx0Ly9hbGVydChcImNvbnRyb2xsZXJcIik7XG5cdFx0XHQvLyAkc2NvcGUuZG9ncyA9ICRzY29wZS5kYXRhICsgXCJkb2dzXCI7XG5cdFx0XHQvLyBpZigkc2NvcGUuZHJhZ2dhYmxlKVxuXHRcdFx0Ly8gXHQkc2NvcGUuZHJhZ1N0YXR1cyA9IGZhbHNlO1xuXHRcdFx0Ly8gZWxzZSAkc2NvcGUuZHJhZ1N0YXR1cyA9IHRydWU7XG5cblx0XHRcdFxuXHRcdH1cblx0fVxufSAvL2VuZCBub3RlY2FyZHMgZGlyZWN0aXZlXG5cbmFuZ3VsYXJcblx0Lm1vZHVsZSgnbm90ZXMnKVxuXHQuZGlyZWN0aXZlKCdub3RlQ2FyZCcsIG5vdGVDYXJkKVxuXG5mdW5jdGlvbiBub3RlQ2FyZCgpIHtcblxuXHR2YXIgdGVtcERhdGEgPSB7fTtcblx0dmFyIHRlbXBOb3RlID0gbnVsbDtcblxuXHRyZXR1cm57XG5cdFx0cmVzdHJpY3Q6ICdBRScsXG5cdFx0c2NvcGU6IHtcblx0XHRcdG5vdGU6IFwiPVwiLFxuXHRcdFx0bm90ZXM6IFwiPVwiXG5cdFx0fSxcblx0XHRyZXBsYWNlOiB0cnVlLFxuXHRcdHRyYW5zY2x1ZGU6IGZhbHNlLFxuXHRcdHRlbXBsYXRlVXJsOiBcImNvbXBvbmVudHMvbm90ZXMvdmlld3Mvbm90ZXMuaXRlbXMudmlldy5odG1sXCIsXG5cdFx0bGluazogZnVuY3Rpb24oc2NvcGUsZWxlbWVudCxhdHRycyl7XG5cdFx0XHQvLyQoIFwiI3NvcnRhYmxlXCIgKS5zb3J0YWJsZSgpO1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhzY29wZSlcblx0XHRcdC8vY29uc29sZS5sb2coZWxlbWVudClcblx0XHRcdC8vY29uc29sZS5sb2coYXR0cnMpXG5cdFx0XHQvL2VsZW1lbnQuc29ydGFibGUoKTtcblx0XHRcdC8vY29uc29sZS5sb2coc2NvcGUubm90ZXMpXG5cdFx0XHQvL3Njb3BlLiR3YXRjaCgnbm90ZXMnLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAvLyBhbGwgdGhlIGNvZGUgaGVyZS4uLlxuICAgIFx0XHRcbiAgICBcdFx0XG5cdFx0XHRcblxuXHRcdFx0ZWxlbWVudC5zb3J0YWJsZSh7XG5cdFx0XHRcdGNvbm5lY3RXaXRoOiBcIi5jb25uZWN0ZWRTb3J0YWJsZVwiLFxuXHRcdCAgICAgICAvL3BsYWNlaG9sZGVyOiBcInVpLXN0YXRlLWhpZ2hsaWdodFwiLFxuXHRcdCAgICAgICAgc3RhcnQ6IGZ1bmN0aW9uKGV2ZW50LCB1aSkge1xuXHRcdCAgICAgICAgXHRjb25zb2xlLmxvZyhcIlNUQVJUIFNUQVJUIFNUQVJUIFNUQVJUIFNUQVJUXCIpXG5cdFx0ICAgICAgICBcdGNvbnNvbGUubG9nKGVsZW1lbnQpXG5cdFx0ICAgICAgICBcdGNvbnNvbGUubG9nKHRlbXBEYXRhKVxuXHRcdCAgICAgICAgXHRcblxuXHRcdCAgICAgICAgXHR0ZW1wRGF0YS5zdGFydE5vdGUgPSBhbmd1bGFyLmNvcHkoc2NvcGUubm90ZSk7XG5cdFx0ICAgICAgICBcdHRlbXBEYXRhLnN0YXJ0Tm90ZUluZGV4ID0gYXR0cnMubm90ZWluZGV4O1xuXHRcdFx0XHRcdHRlbXBEYXRhLnN0YXJ0Tm90ZUl0ZW1JbmRleCA9IHVpLml0ZW0uaW5kZXgoKTtcblx0XHRcdFx0XHR0ZW1wRGF0YS5zdGFydE5vdGVJdGVtQ29udGVudCA9IHRlbXBEYXRhLnN0YXJ0Tm90ZS5pdGVtc1t0ZW1wRGF0YS5zdGFydE5vdGVJdGVtSW5kZXhdO1xuXHRcdCAgIFx0XHRcdFxuXHRcdCAgIFx0XHRcdHRlbXBOb3RlID0gYW5ndWxhci5jb3B5KHNjb3BlLm5vdGUpXG5cdFx0ICAgXHRcdFx0Y29uc29sZS5sb2codGVtcE5vdGUpXG5cblx0XHQgICAgICAgIH0sXG5cdFx0ICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uKGV2ZW50LCB1aSkge1xuXG5cdFx0ICAgICAgIC8vIGNvbnNvbGUubG9nKHNjb3BlLnRlbXBEYXRhKVx0XG5cdCAgICAgICAgIFx0aWYgKCF1aS5zZW5kZXIpIHtcdFx0ICAgICAgIFxuXHRcdFx0ICAgICAgICAgY29uc29sZS5sb2coXCJVUERBVEUgVVBEQVRFIFVQREFURSBVUERBVEUgVVBEQVRFIElOU0lERSBJRlwiIClcblxuXHRcdFx0ICAgICAgICBcblx0XHRcdFx0XHRcdFx0XHQgICAgICAgICBcblxuXHRcdFx0XHRcdHZhciBzdGFydF9wb3MgPSB0ZW1wRGF0YS5zdGFydE5vdGVJdGVtSW5kZXg7XG5cdFx0XHRcdFx0dmFyIGVuZF9wb3MgPSB1aS5pdGVtLmluZGV4KCk7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coc3RhcnRfcG9zICsgJyAtICcgKyBlbmRfcG9zKTtcblxuXHRcdFx0XHRcdHRlbXBOb3RlLml0ZW1zLnNwbGljZShzdGFydF9wb3MsMSlcblx0XHRcdFx0XHR0ZW1wTm90ZS5pdGVtcy5zcGxpY2UoZW5kX3BvcywwLCB0ZW1wRGF0YS5zdGFydE5vdGVJdGVtQ29udGVudClcblx0XHRcdFx0XHQvL3Njb3BlLm5vdGUgPSB0ZW1wTm90ZVxuXHRcdFx0XHRcdHNjb3BlLm5vdGVzW3RlbXBEYXRhLnN0YXJ0Tm90ZUluZGV4XSA9IHRlbXBOb3RlO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKHNjb3BlLm5vdGVzKVxuXG5cdFx0XHRcdFx0dmFyIHJhc3QgPSB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJhZHNAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiczFcIixcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJsYXVuc2RyeVwiLCBcImFwc3BseSBqb2JzXCIsIFwiZ3N5bVwiIF0sXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMS8xLzIyMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIxLzIyLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3pzZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgICAgIH1cblxuXHRcdFx0XHRcdC8vc2NvcGUubm90ZXNbMF0uaXRlbXMucHVzaChcIlBVQ0tTXCIpXG5cblx0XHRcdFx0XHRzY29wZS4kYXBwbHkoKTtcblxuXHRcdCAgIC8vICAgICAgICAgLy9jb25zb2xlLmxvZyhzY29wZS5ub3Rlcylcblx0XHRcdCAgICB9ICAgXG5cdFx0ICAgICAgICAgICBcblx0XHQgICAgICAgIH0sIC8vZW5kIHVwZGF0ZVxuXHRcdCAgICAgICAgcmVjZWl2ZTogZnVuY3Rpb24oZXZlbnQsIHVpKXtcblx0XHQgICAgICAgIFx0Y29uc29sZS5sb2coXCJSRUNFSVZFIFJFQ0VJVkUgUkVDRUlWRSBSRUNFSVZFIFJFQ0VJVkVcIilcblx0XHQgICAgICAgIFx0Y29uc29sZS5sb2codGVtcERhdGEpXG5cblx0XHQgICAgICAgIFx0dGVtcERhdGEuZW5kTm90ZSA9IGFuZ3VsYXIuY29weShzY29wZS5ub3RlKTtcblx0XHQgICAgICAgIFx0dGVtcERhdGEuZW5kTm90ZUluZGV4ID0gYXR0cnMubm90ZWluZGV4O1xuXHRcdFx0XHRcdHRlbXBEYXRhLmVuZE5vdGVJdGVtSW5kZXggPSB1aS5pdGVtLmluZGV4KCk7XG5cblx0XHRcdFx0XHRcblxuXHRcdFx0XHRcdCAgLy9jb25zb2xlLmxvZyhcInJlbW92aW5nIGl0ZW06IFwiICsgc2NvcGUubm90ZXNbbm90ZU9yaWdpbkluZGV4XS5pdGVtc1tzdGFydF9wb3NdKTtcblx0XHQgICAgICAgICAgIHRlbXBEYXRhLnN0YXJ0Tm90ZS5pdGVtcy5zcGxpY2UodGVtcERhdGEuc3RhcnROb3RlSXRlbUluZGV4LDEpXG5cdFx0XHQgICAgICAgdGVtcERhdGEuZW5kTm90ZS5pdGVtcy5zcGxpY2UodGVtcERhdGEuZW5kTm90ZUl0ZW1JbmRleCwwLHRlbXBEYXRhLnN0YXJ0Tm90ZUl0ZW1Db250ZW50KVxuXHRcdFx0ICAgICAgIGNvbnNvbGUubG9nKHRlbXBEYXRhKVxuXG5cdFx0XHQgICAgICAgc2NvcGUubm90ZXNbdGVtcERhdGEuc3RhcnROb3RlSW5kZXhdID0gdGVtcERhdGEuc3RhcnROb3RlO1xuXHRcdFx0ICAgICAgIHNjb3BlLm5vdGVzW3RlbXBEYXRhLmVuZE5vdGVJbmRleF0gPSB0ZW1wRGF0YS5lbmROb3RlO1xuXHQgICAgICAgICAgIFx0XG5cdCAgICAgICAgICAgXHRcdGNvbnNvbGUubG9nKHRlbXBEYXRhLnN0YXJ0Tm90ZS5pdGVtcylcblx0ICAgICAgICAgICBcdFx0Y29uc29sZS5sb2codGVtcERhdGEuZW5kTm90ZS5pdGVtcylcblxuXHRcdCAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImFkZGluZyBhZnRlciBwb3NpdGlvbjogXCIgKyBlbmRfcG9zKVxuXHRcdCAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImFkZGluZyBhZnRlcjogXCIgKyBzY29wZS5ub3Rlc1tub3RlRGVzdGluYXRpb25JbmRleF0uaXRlbXNbZW5kX3Bvc10pXG5cdFx0ICAgICAgICAgICAvL3Njb3BlLm5vdGVzW25vdGVEZXN0aW5hdGlvbkluZGV4XS5pdGVtcy5zcGxpY2UoZW5kX3BvcywwLCBzdGFydEl0ZW0pXG5cblx0XHQgICAgICAgIFx0Ly9zY29wZS50ZW1wRGF0YSA9IFwicHJhd25zXCI7XG5cdFx0ICAgICAgICBcdFxuXHRcdCAgICAgICAgXHRcblx0XHQgICAgICAgIFx0Ly8gY29uc29sZS5sb2codGVtcERhdGEpXG5cdFx0ICAgICAgICBcdC8vIC8vY29uc29sZS5sb2coc2NvcGUubm90ZSk7XG5cdFx0ICAgICAgICBcdHZhciByYXN0ID0ge1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyYWRzQG5qaXQuZWR1XCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcInMxXCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwibGF1bnNkcnlcIiwgXCJhcHNwbHkgam9ic1wiLCBcImdzeW1cIiBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjEvMS8yMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMS8yMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96c2UuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9XG5cdFx0ICAgICAgICBcdFxuXHRcdCAgICAgICAgICAgc2NvcGUuJGFwcGx5KCk7XG5cdFx0XG5cblx0XHQgICAgICAgIH1cblxuXHRcdCAgICB9KTsgLy8gZW5kIHNvcnRhYmxlXG5cblx0XHQgLy8gIH0pOyAvL2VuZCB3YXRjaFxuXG5cblxuXHRcdH0sXG5cdFx0Y29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKXtcblxuXHRcdFx0JHNjb3BlLm1vb3NlID0gXCJkaW5nXCJcblx0XHRcdCRzY29wZS5kZWxldGVJdGVtID0gZnVuY3Rpb24ocGFyZW50SW5kZXgsIGluZGV4KXtcblx0XHRcdFx0Y29uc29sZS5sb2cocGFyZW50SW5kZXgpXG5cdFx0XHRcdGNvbnNvbGUubG9nKGluZGV4KVxuXHRcdFx0XHQkc2NvcGUubm90ZXNbcGFyZW50SW5kZXhdLml0ZW1zLnNwbGljZShpbmRleCwxKVxuXG5cdFx0XHR9XG5cblx0XHRcdCRzY29wZS5yYW5kb21JZCA9IGZ1bmN0aW9uKGl0ZW0pe1xuICAgXHRcdFx0IHJldHVybiBcIklEXCIgKyBpdGVtICsgKE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiA5OTkpICsgMSkpO1xuXHRcdFx0fVxuXHRcdFx0Ly9hbGVydChcImNvbnRyb2xsZXJcIik7XG5cdFx0XHQvLyAkc2NvcGUuZG9ncyA9ICRzY29wZS5kYXRhICsgXCJkb2dzXCI7XG5cdFx0XHQvLyBpZigkc2NvcGUuZHJhZ2dhYmxlKVxuXHRcdFx0Ly8gXHQkc2NvcGUuZHJhZ1N0YXR1cyA9IGZhbHNlO1xuXHRcdFx0Ly8gZWxzZSAkc2NvcGUuZHJhZ1N0YXR1cyA9IHRydWU7XG5cblx0XHRcdGNvbnNvbGUubG9nKCRzY29wZSlcblxuXHRcdFx0XG5cdFx0fVxuXHR9XG59IC8vZW5kIG5vdGVjYXJkIGRpcmVjdGl2ZVxuXG5cblxuXG5cbiIsIihmdW5jdGlvbigpe1xuXHQndXNlIHN0cmljdCdcblxuXHRhbmd1bGFyXG4gICAgXHQubW9kdWxlKCdidWRnZXQnKVxuICAgIFx0LmZhY3RvcnkoJ2J1ZGdldFNlcnZpY2UnLCBidWRnZXRTZXJ2aWNlKTtcblxuICAgIGJ1ZGdldFNlcnZpY2UuJGluamVjdCA9IFsnJGh0dHAnXVxuXG4gICAgZnVuY3Rpb24gYnVkZ2V0U2VydmljZSgkaHR0cCkge1xuICAgIFx0dmFyIHNlcnZpY2UgPSB7XG5cbiAgICAgICAgICAgIGdldE5vdGU6IGdldE5vdGUsXG4gICAgICAgICAgICBnZXROb3RlczogZ2V0Tm90ZXMsXG4gICAgICAgICAgICBzYXZlTm90ZXM6IHNhdmVOb3Rlc1xuXG5cbiAgICBcdH07XG5cbiAgICBcdHJldHVybiBzZXJ2aWNlO1xuXG4gICAgXHQvLy8vLy8vLy8vLy9cblxuICAgICAgICAvLyBnZXRzIGEgc2luZ2xlIG5vdGVcbiAgICAgICAgZnVuY3Rpb24gZ2V0Tm90ZSAoKSB7XG5cbiAgICAgICAgICAgIHZhciBub3RlID0ge1xuICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJ0b2RvXCIsXG4gICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJsYXVuZHJ5XCIsIFwiYXBwbHkgam9ic1wiLCBcImd5bVwiIF0sXG4gICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIxLzEvMjAxNlwiLFxuICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIxLzIvMjAxNlwiLFxuICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96ZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbm90ZTtcblxuICAgICAgICB9IC8vZW5kIGdldE5vdGUoKVxuXG5cbiAgICAgICAgLy8gZ2V0cyBhbGwgbm90ZXNcbiAgICAgICAgZnVuY3Rpb24gZ2V0Tm90ZXMgKCkge1xuXG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCdodHRwOi8vbG9jYWxob3N0OjMwMDAvYXBpL25vdGVzL2dldE5vdGVzJyx7ZW1haWw6XCJtb2l6QGdtYWlsLmNvbVwifSlcbiAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgIFxuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgbm90ZXMgPSBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyQG5qaXQuZWR1XCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIjFcIixcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJsYXVuZHJ5XCIsIFwiYXBwbHkgam9ic1wiLCBcImd5bVwiIF0sXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMS8xLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjEvMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96ZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyQG5qaXQuZWR1XCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIjJcIixcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJodG1sNSBkcmFnIGFuZCBkcm9wXCIsIFwic29ja2V0LmlvXCIsIFwibm9kZWpzXCIgXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIyLzEvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMi8yLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3plLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiM1wiLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImJvc2UgaGVhZHBob25lc1wiLCBcIjIwMTYgaG9uZGEgZ3JpbGxcIiwgXCJzb2xpZCBzdGF0ZSBoYXJkIGRyaXZlXCIgXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIxLzEvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMS8yLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3plLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiNFwiLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImxhdW5kcnlcIiwgXCJhcHBseSBqb2JzXCIsIFwiZ3ltXCIgXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIxLzEvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMS8yLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3plLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiNVwiLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImh0bWw1IGRyYWcgYW5kIGRyb3BcIiwgXCJzb2NrZXQuaW9cIiwgXCJub2RlanNcIiBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjIvMS8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIyLzIvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvemUuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMkBuaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCI2XCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwiYm9zZSBoZWFkcGhvbmVzXCIsIFwiMjAxNiBob25kYSBncmlsbFwiLCBcInNvbGlkIHN0YXRlIGhhcmQgZHJpdmVcIiBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjEvMS8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIxLzIvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvemUuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMkBuaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCI3XCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwibGF1bmRyeVwiLCBcImFwcGx5IGpvYnNcIiwgXCJneW1cIixcImJvc2UgaGVhZHBob25lc1wiLCBcIjIwMTYgaG9uZGEgZ3JpbGxcIiwgXCJzb2xpZCBzdGF0ZSBoYXJkIGRyaXZlXCIgIF0sXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMS8xLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjEvMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96ZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyQG5qaXQuZWR1XCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIjhcIixcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJodG1sNSBkcmFnIGFuZCBkcm9wXCIsIFwic29ja2V0LmlvXCIsIFwibm9kZWpzXCIgXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIyLzEvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMi8yLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3plLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiOVwiLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImJvc2UgaGVhZHBob25lc1wiLCBcIjIwMTYgaG9uZGEgZ3JpbGxcIiwgXCJzb2xpZCBzdGF0ZSBoYXJkIGRyaXZlXCIsXCJodG1sNSBkcmFnIGFuZCBkcm9wXCIsIFwic29ja2V0LmlvXCIsIFwibm9kZWpzXCIgIF0sXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMS8xLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjEvMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96ZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF0gLy9lbmQgbm90ZXMgYXJyYXlcblxuICAgICAgICAgICAgLy9yZXR1cm4gbm90ZXNcbiAgICAgICAgfSAvL2VuZCBnZXQgbm90ZXNcblxuICAgICAgICBmdW5jdGlvbiBzYXZlTm90ZXMobm90ZXMpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCdodHRwOi8vbG9jYWxob3N0OjMwMDAvYXBpL25vdGVzL3VwZGF0ZU5vdGVzJyx7ZW1haWw6XCJtb2l6QGdtYWlsLmNvbVwiLG5vdGVzOiBub3Rlc30pXG4gICAgICAgIH1cblxuXG5cbiAgICB9XG5cblx0XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0J1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCdtZW1iZXJzJylcblx0XHQuY29udHJvbGxlcignbWVtYmVyc0N0cmwnLCBtZW1iZXJzQ3RybClcblxuXHRtZW1iZXJzQ3RybC4kaW5qZWN0ID0gWyckaHR0cCddXG5cblx0ZnVuY3Rpb24gbWVtYmVyc0N0cmwoJGh0dHApIHtcblxuXHQgICAgdmFyIHZtID0gdGhpcztcblxuXHQgICAgdm0ubWVtYmVyc0NvbnRlbnQgPSBtZW1iZXJzQ29udGVudCgpO1xuXHQgICAgdm0uZ290b1Nlc3Npb24gPSBnb3RvU2Vzc2lvbjtcblx0ICAgIHZtLnJlZnJlc2ggPSByZWZyZXNoO1xuXHQgICAgdm0uc2VhcmNoID0gc2VhcmNoO1xuXHQgICAgdm0uc2Vzc2lvbnMgPSBbXTtcblx0ICAgIHZtLnRpdGxlID0gJ21lbWJlcnMnO1xuXG5cdCAgICAvLy8vLy8vLy8vLy9cblxuXHQgICAgZnVuY3Rpb24gbWVtYmVyc0NvbnRlbnQoKXtcblx0ICAgIFx0IC8vICRodHRwLmdldCgnaHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaS91c2Vycy9hbGwnKVxuXHQgICAgXHRcdC8vIC50aGVuKGZ1bmN0aW9uKHJlcyl7XG5cdCAgICBcdFx0Ly8gXHRjb25zb2xlLmxvZyhyZXMuZGF0YSlcblx0ICAgIFx0XHQvLyBcdHZtLm1lbWJlcnNDb250ZW50ID0gcmVzLmRhdGE7XG5cdCAgICBcdFx0Ly8gfSxcblx0ICAgIFx0XHQvLyBmdW5jdGlvbihlcnIpe1xuXHQgICAgXHRcdC8vIFx0Y29uc29sZS5sb2coZXJyLnN0YXR1cyArIFwiIFwiICsgZXJyLnN0YXR1c1RleHQpO1xuXHQgICAgXHRcdC8vIFx0dm0ubWVtYmVyc0NvbnRlbnQgPSBlcnIuZGF0YTtcblx0ICAgIFx0XHQvLyB9KVxuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBnb3RvU2Vzc2lvbigpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gcmVmcmVzaCgpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gc2VhcmNoKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXHR9XG5cbn0pKCk7XG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cdCd1c2Ugc3RyaWN0J1xuXG5cdGFuZ3VsYXJcbiAgICBcdC5tb2R1bGUoJ3NhbXBsZScpXG4gICAgXHQuZmFjdG9yeSgnc2FtcGxlU2VydmljZScsIHNhbXBsZVNlcnZpY2UpO1xuXG4gICAvLyBzYW1wbGVTZXJ2aWNlLmluamVjdCA9IFsnJ11cblxuICAgIGZ1bmN0aW9uIHNhbXBsZVNlcnZpY2UoKSB7XG4gICAgXHR2YXIgc2VydmljZSA9IHtcblxuICAgIFx0XHRlcnJvcjogZXJyb3IsXG4gICAgXHRcdGluZm86IGluZm8sXG4gICAgXHRcdHN1Y2Nlc3M6IHN1Y2Nlc3NcblxuICAgIFx0fTtcblxuICAgIFx0cmV0dXJuIHNlcnZpY2U7XG5cbiAgICBcdC8vLy8vLy8vLy8vL1xuXG4gICAgXHRmdW5jdGlvbiBlcnJvcigpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gaW5mbygpIHtcblx0ICAgICAgLyogKi9cbiAgICAgICAgICAvL2NvbnNvbGUubG9nKFwic2FtcGxlU2VydmljZVwiKTtcblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gc3VjY2VzcygpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblxuXG4gICAgfVxuXG5cdFxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCdcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnbm90ZXMnKVxuXHRcdC5jb250cm9sbGVyKCdub3Rlc0N0cmwnLCBub3Rlc0N0cmwpXG5cblx0bm90ZXNDdHJsLiRpbmplY3QgPSBbJ25vdGVzU2VydmljZScsJyRzY29wZScsJyRodHRwJywndG9hc3RyJ11cblxuXHRmdW5jdGlvbiBub3Rlc0N0cmwobm90ZXNTZXJ2aWNlLCRzY29wZSwgJGh0dHAsIHRvYXN0cikge1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0Y29uc29sZS5sb2coXCJub3RlcyBiYWxsc291dFwiKTtcblxuXHRcdHZtLmFjdGl2YXRlID0gYWN0aXZhdGU7XG5cdFx0dm0uY2xvc2VUYWIgPSBjbG9zZVRhYjtcblxuXHRcdFxuXHQgICAgXG5cdCAgICAkc2NvcGUubm90ZTEgPSBcImFsZHNqZmxrYXNkalwiO1xuXHQgICAgY29uc29sZS5sb2coJHNjb3BlLm5vdGUxKTtcblx0ICBcdCRzY29wZS50aW55bWNlT3B0aW9ucyA9IHtcblx0XHQgICAgcGx1Z2luczogJ2xpbmsgaW1hZ2UgY29kZScsXG5cdFx0ICAgIHRvb2xiYXI6ICd1bmRvIHJlZG8gfCBib2xkIGl0YWxpYyB8IGFsaWdubGVmdCBhbGlnbmNlbnRlciBhbGlnbnJpZ2h0IHwgY29kZSB8IHBhc3RlJ1xuXHRcdCAgfTtcblxuXHRcdCRzY29wZS50aXRsZSA9IFwicmF0c3RzXCI7XG5cdFx0JHNjb3BlLmRvZ3MgPVwiZnJvYWRzYXNkZmFkc2dzXCJcblx0XHR2bS50aW55bWNlTW9kZWwgPSAnSW5pdGlhbCBjb25zZHNkdGVudCc7XG5cblx0XHR2bS5hbGxOb3RlcyA9IFtcblx0XHRcdHt0aXRsZTpcImd1bHAgY2hlYXQgc2hlZXRcIixjb250ZW50Olwibm9udW1teSBuaWJoIGV1aXNtb2QgdGluY2lkdW50IHV0IGxhb3JlZXQgZG9sb3JlIG1hZ25hIGFsaXF1YW0gZXJhdCB2b2x1dHBhdC4gVXQgd2lzaSBlbmltIGFkIG1pbmltIHZlbmlhbSwgcXVpcyBub3N0cnVkIGV4ZXJjaSB0YXRpb24gdWxsYW1jb3JwZXIgc3VzY2lwaXQgbG9ib3J0aXMgbmlzbCB1dCBhbGlxdWlwIGV4IGVhIGNvbW1vZG8gY29uc2VxdWF0LiBEdWlzIGF1dGVtIHZlbCBldW0gaXJpdXJlIGRvbG9yIGluIGhlbmRyZXJpdCBpbiB2dWxwdXRhdGUgdmVsaXQgZXNzZSBtb2xlc3RpZSBjb25zZXF1YXQsIHZlbCBpbGx1bSBkb2xvcmUgZXUgZmV1Z2lhdCBudWxsYSBmYWNpbGlzaXMgYXQgdmVybyBlcm9zIGV0IGFjY3Vtc2FuIGV0IGl1c3RvIG9kaW8gZGlnbmlzc2ltIHF1aSBibGFuZGl0IHByYWVzZW50IGx1cHRhdHVtIHp6cmlsIGRlbGVuaXQgYXVndWUgZHVpcyBkb2xvcmUgdGUgZmV1Z2FpdCBudWxsYSBmYWNpbGlzaS4gTmFtIGxpYmVyIHRlbXBvciBjdW0gc29sdXRhIG5vYmlzIGVsZWlmZW5kIG9wdGlvbiBjb25ndWUgbmloaWwgaW1wZXJkaWV0IGRvbWluZyBpZCBxdW9kIG1hemltIHBsYWNlcmF0IGZhY2VyIHBvc3NpbSBhc3N1bS4gVHlwaSBub24gaGFiZW50IGNsYXJpdGF0ZW0gaW5zaXRhbTsgZXN0IHVzdXMgbGVnZW50aXMgaW4gaWlzIHF1aSBmYWNpdCBlb3J1bSBjbGFyaXRhdGVtLiBJbnZlc3RpZ2F0aW9uZXMgZGVtb25zdHJhdmVydW50IGxlY3RvcmVzIGxlZ2VyZSBtZSBsaXVzIHF1b2QgaWkgbGVndW50IHNhZXBpdXMuIENsYXJpdGFzIGVzdCBldGlhbSBwcm9jZXNzdXMgZHluYW1pY3VzLCBxdWkgc2VxdWl0dXIgbXV0YXRpb25lbSBjb25zdWV0dWRpdW0gbGVjdG9ydW0uIE1pcnVtIGVzdCBub3RhcmUgcXVhbSBsaXR0ZXJhIGdvdGhpY2EsIHF1YW0gbnVuYyBwdXRhbXVzIHBhcnVtIGNsYXJhbSwgYW50ZXBvc3Vlcml0IGxpdHRlcmFydW0gZm9ybWFzIGh1bWFuaXRhdGlzIHBlciBzZWFjdWxhIHFcIn0sXG5cdFx0XHR7dGl0bGU6XCJtZXRlb3JcIixjb250ZW50Olwibm9udW1teSBuaWJoIGV1aXNtb2QgdGluY2lkdW50IHV0IGxhb3JlZXQgZG9sb3JlIG1hZ25hIG0gY29uc3VldHVkaXVtIGxlY3RvcnVtLiBNaXJ1bSBlc3Qgbm90YXJlIHF1YW0gbGl0dGVyYSBnb3RoaWNhLCBxdWFtIG51bmMgcHV0YW11cyBwYXJ1bSBjbGFyYW0sIGFudGVwb3N1ZXJpdCBsaXR0ZXJhcnVtIGZvcm1hcyBodW1hbml0YXRpcyBwZXIgc2VhY3VsYSBxXCJ9XG5cdFx0XHQsXG5cdFx0XHR7dGl0bGU6XCJqcXVlcnlcIixjb250ZW50Olwibm9udW1teSBuaWJoIGV1aXNtb2QgdGluY2lkdW50IHV0IGxhb3JlZXQgZG9sb3JlIG1hZ25hIG0gY29uc3VldHVkaXVtIGxlY3RvcnVtLiBNaXJ1bSBlc3Qgbm90YXJlIHF1YW0gbGl0dGVyYSBnb3RoaWNhLCBxdWFtIG51bmMgcHV0YW11cyBwYXJ1bSBjbGFyYW0sIGFudGVwb3N1ZXJpdCBsaXR0ZXJhcnVtIGZvcm1hcyBodW1hbml0YXRpcyBwZXIgc2VhY3VsYSBxXCJ9XG5cdFx0XHQsXG5cdFx0XHR7dGl0bGU6XCJhbmd1bGFyXCIsY29udGVudDpcIm5vbnVtbXkgbmliaCBldWlzbW9kIHRpbmNpZHVudCB1dCBsYW9yZWV0IGRvbG9yZSBtYWduYSBtIGNvbnN1ZXR1ZGl1bSBsZWN0b3J1bS4gTWlydW0gZXN0IG5vdGFyZSBxdWFtIGxpdHRlcmEgZ290aGljYSwgcXVhbSBudW5jIHB1dGFtdXMgcGFydW0gY2xhcmFtLCBhbnRlcG9zdWVyaXQgbGl0dGVyYXJ1bSBmb3JtYXMgaHVtYW5pdGF0aXMgcGVyIHNlYWN1bGEgcVwifVxuXHRcdFx0LFxuXHRcdFx0e3RpdGxlOlwic3dpZnRcIixjb250ZW50Olwibm9udW1teSBuaWJoIGV1aXNtb2QgdGluY2lkdW50IHV0IGxhb3JlZXQgZG9sb3JlIG1hZ25hIG0gY29uc3VldHVkaXVtIGxlY3RvcnVtLiBNaXJ1bSBlc3Qgbm90YXJlIHF1YW0gbGl0dGVyYSBnb3RoaWNhLCBxdWFtIG51bmMgcHV0YW11cyBwYXJ1bSBjbGFyYW0sIGFudGVwb3N1ZXJpdCBsaXR0ZXJhcnVtIGZvcm1hcyBodW1hbml0YXRpcyBwZXIgc2VhY3VsYSBxXCJ9XG5cdFx0XHRcblx0XHRcdFxuXG5cblx0XHRdXG5cblx0XHR2bS5hY3RpdmVOb3RlcyA9IFtdO1xuXG5cbiAgJHNjb3BlLnRpbnltY2VPcHRpb25zID0ge1xuICAgIHBsdWdpbnM6ICdsaW5rIGltYWdlIGNvZGUnLFxuICAgIHRvb2xiYXI6ICd1bmRvIHJlZG8gfCBib2xkIGl0YWxpYyB8IGFsaWdubGVmdCBhbGlnbmNlbnRlciBhbGlnbnJpZ2h0IHwgY29kZSdcbiAgfTtcblxuXG5cblx0ICAgIC8vLy8vLy8vLy8vL1xuXG5cdCAgICBmdW5jdGlvbiBhY3RpdmF0ZShub3RlKSB7XG5cdCAgICBcdHZtLmFjdGl2ZU5vdGVzLnB1c2gobm90ZSk7XG5cdCAgICBcdGNvbnNvbGUubG9nKHZtLmFjdGl2ZU5vdGVzKVxuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBjbG9zZVRhYihpbmRleCkge1xuXHQgICAgICB2bS5hY3RpdmVOb3Rlcy5zcGxpY2UoaW5kZXgsMSk7XG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIHJlZnJlc2goKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIHNlYXJjaCgpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblx0fVxuXG59KSgpO1xuXG5cbiIsIi8vIGFuZ3VsYXJcbi8vICAgICAubW9kdWxlKCdub3RlcycpXG4vLyAgICAgLmRpcmVjdGl2ZSgnbm90ZUNhcmQnLCBub3RlQ2FyZCk7XG5cbi8vIGZ1bmN0aW9uIG5vdGVDYXJkKCkge1xuLy8gXHRyZXR1cm57XG4vLyBcdFx0cmVzdHJpY3Q6ICdFJyxcbi8vIFx0XHRzY29wZToge1xuLy8gXHRcdFx0ZGF0YTogXCI9XCIsXG4vLyBcdFx0XHRkcmFnZ2FibGU6IFwiPVwiXG4vLyBcdFx0fSxcbi8vIFx0XHRyZXBsYWNlOiB0cnVlLFxuLy8gXHRcdHRlbXBsYXRlOiBcIjxoMT57e2RvZ3N9fXt7ZHJhZ1N0YXR1c319PC9oMT5cIixcbi8vIFx0XHRsaW5rOiBmdW5jdGlvbihzY29wZSxlbGVtZW50KXtcbi8vIFx0XHRcdGVsZW1lbnQuY2xpY2soZnVuY3Rpb24oKXtcbi8vIFx0XHRcdFx0Y29uc29sZS5sb2coZWxlbWVudClcbi8vIFx0XHRcdFx0ZWxlbWVudFswXS5kcmFnZ2FibGUgPSB0cnVlO1xuLy8gXHRcdFx0fSlcbi8vIFx0XHR9LFxuLy8gXHRcdGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSl7XG4vLyBcdFx0XHQvL2FsZXJ0KFwiY29udHJvbGxlclwiKTtcbi8vIFx0XHRcdCRzY29wZS5kb2dzID0gJHNjb3BlLmRhdGEgKyBcImRvZ3NcIjtcbi8vIFx0XHRcdGlmKCRzY29wZS5kcmFnZ2FibGUpXG4vLyBcdFx0XHRcdCRzY29wZS5kcmFnU3RhdHVzID0gZmFsc2U7XG4vLyBcdFx0XHRlbHNlICRzY29wZS5kcmFnU3RhdHVzID0gdHJ1ZTtcblxuXHRcdFx0XG4vLyBcdFx0fVxuLy8gXHR9XG4vLyB9XG5cblxuXG4vLyAvLyBhbmd1bGFyXG4vLyAvLyAgICAgLm1vZHVsZSgnbm90ZXMnKVxuLy8gLy8gICAgIC5kaXJlY3RpdmUoJ25vdGVDYXJkJywgbm90ZUNhcmQpO1xuXG4vLyAvLyBmdW5jdGlvbiBub3RlQ2FyZCgpIHtcbi8vIC8vIFx0cmV0dXJue1xuLy8gLy8gXHRcdHJlc3RyaWN0OiAnRScsXG4vLyAvLyBcdFx0Y29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKXtcbi8vIC8vIFx0XHRcdGFsZXJ0KFwiY29udHJvbGxlclwiKTtcbi8vIC8vIFx0XHRcdGNvbnNvbGUubG9nKCdkb2cnKVxuLy8gLy8gXHRcdH0sXG4vLyAvLyBcdFx0dGVtcGxhdGVVcmw6ICcnLFxuLy8gLy8gXHRcdHJlcGxhY2U6IHRydWVcbi8vIC8vIFx0XHQvLyBzY29wZToge31cbi8vIC8vIFx0fVxuLy8gLy8gfSIsIi8vIGFuZ3VsYXJcbi8vICAgICAubW9kdWxlKCdub3RlcycpXG4vLyAgICAgLmRpcmVjdGl2ZSgnbm90ZUNhcmRzJywgbm90ZUNhcmRzKVxuXG5cbiAgICBcblxuLy8gZnVuY3Rpb24gbm90ZUNhcmRzKCkge1xuLy8gXHRyZXR1cm57XG4vLyBcdFx0cmVzdHJpY3Q6ICdBRScsXG4vLyBcdFx0c2NvcGU6IHtcbi8vIFx0XHRcdG5vdGVzOiBcIj1cIixcbi8vIFx0XHRcdG5ld0l0ZW06IFwiPVwiXG4vLyBcdFx0fSxcbi8vIFx0XHRyZXBsYWNlOiBmYWxzZSxcbi8vIFx0XHR0cmFuc2NsdWRlOiBmYWxzZSxcbi8vIFx0XHR0ZW1wbGF0ZVVybDogXCJjb21wb25lbnRzL25vdGVzL3ZpZXdzL25vdGUuZGlyZWN0aXZlLnZpZXcuaHRtbFwiLFxuLy8gXHRcdGxpbms6IGZ1bmN0aW9uKHNjb3BlLGVsZW1lbnQsYXR0cnMpe1xuLy8gXHRcdFx0Ly8kKCBcIiNzb3J0YWJsZVwiICkuc29ydGFibGUoKTtcbi8vIFx0XHRcdC8vY29uc29sZS5sb2coc2NvcGUpXG4vLyBcdFx0XHQvL2NvbnNvbGUubG9nKGVsZW1lbnQpXG4vLyBcdFx0XHQvL2NvbnNvbGUubG9nKGF0dHJzKVxuLy8gXHRcdFx0Ly9lbGVtZW50LnNvcnRhYmxlKCk7XG4vLyBcdFx0XHQvL2NvbnNvbGUubG9nKHNjb3BlLm5vdGVzKVxuLy8gXHRcdFx0c2NvcGUuZG9ncyA9IGZ1bmN0aW9uKG5vdGUpe1xuLy8gXHRcdFx0XHRjb25zb2xlLmxvZyhub3RlKVxuLy8gXHRcdFx0fVxuXG5cbi8vIFx0XHRcdGVsZW1lbnQuc29ydGFibGUoe1xuLy8gXHRcdCAgICAgICAvLyBwbGFjZWhvbGRlcjogXCJ1aS1zdGF0ZS1oaWdobGlnaHRcIixcbi8vIFx0XHQgICAgICAgIHN0YXJ0OiBmdW5jdGlvbihldmVudCwgdWkpIHtcbi8vIFx0XHQgICAgICAgICAgICB2YXIgc3RhcnRfcG9zID0gdWkuaXRlbS5pbmRleCgpO1xuLy8gXHRcdCAgICAgICAgICAgIHVpLml0ZW0uZGF0YSgnc3RhcnRfcG9zJywgc3RhcnRfcG9zKTtcbi8vIFx0XHQgICAgICAgIH0sXG4vLyBcdFx0ICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uKGV2ZW50LCB1aSkge1xuLy8gXHRcdCAgICAgICAgICAgIHZhciBzdGFydF9wb3MgPSB1aS5pdGVtLmRhdGEoJ3N0YXJ0X3BvcycpO1xuLy8gXHRcdCAgICAgICAgICAgIHZhciBlbmRfcG9zID0gdWkuaXRlbS5pbmRleCgpO1xuLy8gXHRcdCAgICAgICAgICAgIC8vY29uc29sZS5sb2coc3RhcnRfcG9zICsgJyAtICcgKyBlbmRfcG9zKTtcblx0XHQgICAgICAgICAgXG4vLyBcdFx0ICAgICAgICAgIHZhciBzdGFydEl0ZW0gPSBzY29wZS5ub3Rlc1tzdGFydF9wb3NdO1xuLy8gXHRcdCAgICAgICAgICAgc2NvcGUubm90ZXMuc3BsaWNlKHN0YXJ0X3BvcywxKVxuLy8gXHRcdCAgICAgICAgICAgc2NvcGUubm90ZXMuc3BsaWNlKGVuZF9wb3MsMCwgc3RhcnRJdGVtKVxuLy8gXHRcdCAgICAgICAgICAgc2NvcGUuJGFwcGx5KCk7XG5cbi8vIFx0XHQgICAgICAgICAgIC8vY29uc29sZS5sb2coc2NvcGUubm90ZXMpXG5cdFx0ICAgICAgICAgICBcblx0XHQgICAgICAgICAgIFxuLy8gXHRcdCAgICAgICAgfVxuLy8gXHRcdCAgICB9KTsgLy8gZW5kIHNvcnRhYmxlXG5cblx0XHQgICBcblxuLy8gXHRcdCAgICBjb25zb2xlLmxvZyhlbGVtZW50KVxuXG5cbi8vIFx0XHR9LFxuLy8gXHRcdGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSl7XG4vLyBcdFx0XHQkc2NvcGUuZm9ybSA9e31cbi8vIFx0XHRcdCRzY29wZS5hZGRJdGVtID0gZnVuY3Rpb24oaW5kZXgsaXRlbSl7XG4vLyBcdFx0XHRcdC8vYWxlcnQoaW5kZXgpXG4vLyBcdFx0XHRcdGNvbnNvbGUubG9nKCRzY29wZS5uZXdJdGVtKVxuLy8gXHRcdFx0XHQkc2NvcGUubm90ZXNbaW5kZXhdLml0ZW1zLnB1c2goaXRlbSlcbi8vIFx0XHRcdFx0JHNjb3BlLmZvcm0gPSB7fVxuLy8gXHRcdFx0XHQvL2NvbnNvbGUubG9nKCRzY29wZS5ub3Rlc1tpbmRleF0uaXRlbXMpXG4vLyBcdFx0XHR9XG5cbi8vIFx0XHRcdCRzY29wZS5kZWxldGVOb3RlID0gZnVuY3Rpb24oaW5kZXgpe1xuLy8gXHRcdFx0XHQkc2NvcGUubm90ZXMuc3BsaWNlKGluZGV4LDEpO1xuLy8gXHRcdFx0fVxuXG5cbi8vIFx0XHRcdC8vYWxlcnQoXCJjb250cm9sbGVyXCIpO1xuLy8gXHRcdFx0Ly8gJHNjb3BlLmRvZ3MgPSAkc2NvcGUuZGF0YSArIFwiZG9nc1wiO1xuLy8gXHRcdFx0Ly8gaWYoJHNjb3BlLmRyYWdnYWJsZSlcbi8vIFx0XHRcdC8vIFx0JHNjb3BlLmRyYWdTdGF0dXMgPSBmYWxzZTtcbi8vIFx0XHRcdC8vIGVsc2UgJHNjb3BlLmRyYWdTdGF0dXMgPSB0cnVlO1xuXG5cdFx0XHRcbi8vIFx0XHR9XG4vLyBcdH1cbi8vIH0gLy9lbmQgbm90ZWNhcmRzIGRpcmVjdGl2ZVxuXG4vLyBhbmd1bGFyXG4vLyBcdC5tb2R1bGUoJ25vdGVzJylcbi8vIFx0LmRpcmVjdGl2ZSgnbm90ZUNhcmQnLCBub3RlQ2FyZClcblxuLy8gZnVuY3Rpb24gbm90ZUNhcmQoKSB7XG5cbi8vIFx0dmFyIHRlbXBEYXRhID0ge307XG4vLyBcdHZhciB0ZW1wTm90ZSA9IG51bGw7XG5cbi8vIFx0cmV0dXJue1xuLy8gXHRcdHJlc3RyaWN0OiAnQUUnLFxuLy8gXHRcdHNjb3BlOiB7XG4vLyBcdFx0XHRub3RlOiBcIj1cIixcbi8vIFx0XHRcdG5vdGVzOiBcIj1cIlxuLy8gXHRcdH0sXG4vLyBcdFx0cmVwbGFjZTogdHJ1ZSxcbi8vIFx0XHR0cmFuc2NsdWRlOiBmYWxzZSxcbi8vIFx0XHR0ZW1wbGF0ZVVybDogXCJjb21wb25lbnRzL25vdGVzL3ZpZXdzL25vdGVzLml0ZW1zLnZpZXcuaHRtbFwiLFxuLy8gXHRcdGxpbms6IGZ1bmN0aW9uKHNjb3BlLGVsZW1lbnQsYXR0cnMpe1xuLy8gXHRcdFx0Ly8kKCBcIiNzb3J0YWJsZVwiICkuc29ydGFibGUoKTtcbi8vIFx0XHRcdC8vY29uc29sZS5sb2coc2NvcGUpXG4vLyBcdFx0XHQvL2NvbnNvbGUubG9nKGVsZW1lbnQpXG4vLyBcdFx0XHQvL2NvbnNvbGUubG9nKGF0dHJzKVxuLy8gXHRcdFx0Ly9lbGVtZW50LnNvcnRhYmxlKCk7XG4vLyBcdFx0XHQvL2NvbnNvbGUubG9nKHNjb3BlLm5vdGVzKVxuLy8gXHRcdFx0Ly9zY29wZS4kd2F0Y2goJ25vdGVzJywgZnVuY3Rpb24oKSB7XG5cbi8vICAgICAgICAgLy8gYWxsIHRoZSBjb2RlIGhlcmUuLi5cbiAgICBcdFx0XG4gICAgXHRcdFxuXHRcdFx0XG5cbi8vIFx0XHRcdGVsZW1lbnQuc29ydGFibGUoe1xuLy8gXHRcdFx0XHRjb25uZWN0V2l0aDogXCIuY29ubmVjdGVkU29ydGFibGVcIixcbi8vIFx0XHQgICAgICAgLy9wbGFjZWhvbGRlcjogXCJ1aS1zdGF0ZS1oaWdobGlnaHRcIixcbi8vIFx0XHQgICAgICAgIHN0YXJ0OiBmdW5jdGlvbihldmVudCwgdWkpIHtcbi8vIFx0XHQgICAgICAgIFx0Y29uc29sZS5sb2coXCJTVEFSVCBTVEFSVCBTVEFSVCBTVEFSVCBTVEFSVFwiKVxuLy8gXHRcdCAgICAgICAgXHRjb25zb2xlLmxvZyhlbGVtZW50KVxuLy8gXHRcdCAgICAgICAgXHRjb25zb2xlLmxvZyh0ZW1wRGF0YSlcblx0XHQgICAgICAgIFx0XG5cbi8vIFx0XHQgICAgICAgIFx0dGVtcERhdGEuc3RhcnROb3RlID0gYW5ndWxhci5jb3B5KHNjb3BlLm5vdGUpO1xuLy8gXHRcdCAgICAgICAgXHR0ZW1wRGF0YS5zdGFydE5vdGVJbmRleCA9IGF0dHJzLm5vdGVpbmRleDtcbi8vIFx0XHRcdFx0XHR0ZW1wRGF0YS5zdGFydE5vdGVJdGVtSW5kZXggPSB1aS5pdGVtLmluZGV4KCk7XG4vLyBcdFx0XHRcdFx0dGVtcERhdGEuc3RhcnROb3RlSXRlbUNvbnRlbnQgPSB0ZW1wRGF0YS5zdGFydE5vdGUuaXRlbXNbdGVtcERhdGEuc3RhcnROb3RlSXRlbUluZGV4XTtcblx0XHQgICBcdFx0XHRcbi8vIFx0XHQgICBcdFx0XHR0ZW1wTm90ZSA9IGFuZ3VsYXIuY29weShzY29wZS5ub3RlKVxuLy8gXHRcdCAgIFx0XHRcdGNvbnNvbGUubG9nKHRlbXBOb3RlKVxuXG4vLyBcdFx0ICAgICAgICB9LFxuLy8gXHRcdCAgICAgICAgdXBkYXRlOiBmdW5jdGlvbihldmVudCwgdWkpIHtcblxuLy8gXHRcdCAgICAgICAvLyBjb25zb2xlLmxvZyhzY29wZS50ZW1wRGF0YSlcdFxuLy8gXHQgICAgICAgICBcdGlmICghdWkuc2VuZGVyKSB7XHRcdCAgICAgICBcbi8vIFx0XHRcdCAgICAgICAgIGNvbnNvbGUubG9nKFwiVVBEQVRFIFVQREFURSBVUERBVEUgVVBEQVRFIFVQREFURSBJTlNJREUgSUZcIiApXG5cblx0XHRcdCAgICAgICAgXG5cdFx0XHRcdFx0XHRcdFx0ICAgICAgICAgXG5cbi8vIFx0XHRcdFx0XHR2YXIgc3RhcnRfcG9zID0gdGVtcERhdGEuc3RhcnROb3RlSXRlbUluZGV4O1xuLy8gXHRcdFx0XHRcdHZhciBlbmRfcG9zID0gdWkuaXRlbS5pbmRleCgpO1xuLy8gXHRcdFx0XHRcdGNvbnNvbGUubG9nKHN0YXJ0X3BvcyArICcgLSAnICsgZW5kX3Bvcyk7XG5cbi8vIFx0XHRcdFx0XHR0ZW1wTm90ZS5pdGVtcy5zcGxpY2Uoc3RhcnRfcG9zLDEpXG4vLyBcdFx0XHRcdFx0dGVtcE5vdGUuaXRlbXMuc3BsaWNlKGVuZF9wb3MsMCwgdGVtcERhdGEuc3RhcnROb3RlSXRlbUNvbnRlbnQpXG4vLyBcdFx0XHRcdFx0Ly9zY29wZS5ub3RlID0gdGVtcE5vdGVcbi8vIFx0XHRcdFx0XHRzY29wZS5ub3Rlc1t0ZW1wRGF0YS5zdGFydE5vdGVJbmRleF0gPSB0ZW1wTm90ZTtcblx0XHRcdFx0XHRcbi8vIFx0XHRcdFx0XHRjb25zb2xlLmxvZyhzY29wZS5ub3RlcylcblxuLy8gXHRcdFx0XHRcdHZhciByYXN0ID0ge1xuLy8gICAgICAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyYWRzQG5qaXQuZWR1XCIsXG4vLyAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcInMxXCIsXG4vLyAgICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwibGF1bnNkcnlcIiwgXCJhcHNwbHkgam9ic1wiLCBcImdzeW1cIiBdLFxuLy8gICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjEvMS8yMjAxNlwiLFxuLy8gICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMS8yMi8yMDE2XCIsXG4vLyAgICAgICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96c2UuYWtAZ21haWwuY29tXCJcbi8vICAgICAgICAgICAgICAgICB9XG5cbi8vIFx0XHRcdFx0XHQvL3Njb3BlLm5vdGVzWzBdLml0ZW1zLnB1c2goXCJQVUNLU1wiKVxuXG4vLyBcdFx0XHRcdFx0c2NvcGUuJGFwcGx5KCk7XG5cbi8vIFx0XHQgICAvLyAgICAgICAgIC8vY29uc29sZS5sb2coc2NvcGUubm90ZXMpXG4vLyBcdFx0XHQgICAgfSAgIFxuXHRcdCAgICAgICAgICAgXG4vLyBcdFx0ICAgICAgICB9LCAvL2VuZCB1cGRhdGVcbi8vIFx0XHQgICAgICAgIHJlY2VpdmU6IGZ1bmN0aW9uKGV2ZW50LCB1aSl7XG4vLyBcdFx0ICAgICAgICBcdGNvbnNvbGUubG9nKFwiUkVDRUlWRSBSRUNFSVZFIFJFQ0VJVkUgUkVDRUlWRSBSRUNFSVZFXCIpXG4vLyBcdFx0ICAgICAgICBcdGNvbnNvbGUubG9nKHRlbXBEYXRhKVxuXG4vLyBcdFx0ICAgICAgICBcdHRlbXBEYXRhLmVuZE5vdGUgPSBhbmd1bGFyLmNvcHkoc2NvcGUubm90ZSk7XG4vLyBcdFx0ICAgICAgICBcdHRlbXBEYXRhLmVuZE5vdGVJbmRleCA9IGF0dHJzLm5vdGVpbmRleDtcbi8vIFx0XHRcdFx0XHR0ZW1wRGF0YS5lbmROb3RlSXRlbUluZGV4ID0gdWkuaXRlbS5pbmRleCgpO1xuXG5cdFx0XHRcdFx0XG5cbi8vIFx0XHRcdFx0XHQgIC8vY29uc29sZS5sb2coXCJyZW1vdmluZyBpdGVtOiBcIiArIHNjb3BlLm5vdGVzW25vdGVPcmlnaW5JbmRleF0uaXRlbXNbc3RhcnRfcG9zXSk7XG4vLyBcdFx0ICAgICAgICAgICB0ZW1wRGF0YS5zdGFydE5vdGUuaXRlbXMuc3BsaWNlKHRlbXBEYXRhLnN0YXJ0Tm90ZUl0ZW1JbmRleCwxKVxuLy8gXHRcdFx0ICAgICAgIHRlbXBEYXRhLmVuZE5vdGUuaXRlbXMuc3BsaWNlKHRlbXBEYXRhLmVuZE5vdGVJdGVtSW5kZXgsMCx0ZW1wRGF0YS5zdGFydE5vdGVJdGVtQ29udGVudClcbi8vIFx0XHRcdCAgICAgICBjb25zb2xlLmxvZyh0ZW1wRGF0YSlcblxuLy8gXHRcdFx0ICAgICAgIHNjb3BlLm5vdGVzW3RlbXBEYXRhLnN0YXJ0Tm90ZUluZGV4XSA9IHRlbXBEYXRhLnN0YXJ0Tm90ZTtcbi8vIFx0XHRcdCAgICAgICBzY29wZS5ub3Rlc1t0ZW1wRGF0YS5lbmROb3RlSW5kZXhdID0gdGVtcERhdGEuZW5kTm90ZTtcblx0ICAgICAgICAgICBcdFxuLy8gXHQgICAgICAgICAgIFx0XHRjb25zb2xlLmxvZyh0ZW1wRGF0YS5zdGFydE5vdGUuaXRlbXMpXG4vLyBcdCAgICAgICAgICAgXHRcdGNvbnNvbGUubG9nKHRlbXBEYXRhLmVuZE5vdGUuaXRlbXMpXG5cbi8vIFx0XHQgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJhZGRpbmcgYWZ0ZXIgcG9zaXRpb246IFwiICsgZW5kX3Bvcylcbi8vIFx0XHQgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJhZGRpbmcgYWZ0ZXI6IFwiICsgc2NvcGUubm90ZXNbbm90ZURlc3RpbmF0aW9uSW5kZXhdLml0ZW1zW2VuZF9wb3NdKVxuLy8gXHRcdCAgICAgICAgICAgLy9zY29wZS5ub3Rlc1tub3RlRGVzdGluYXRpb25JbmRleF0uaXRlbXMuc3BsaWNlKGVuZF9wb3MsMCwgc3RhcnRJdGVtKVxuXG4vLyBcdFx0ICAgICAgICBcdC8vc2NvcGUudGVtcERhdGEgPSBcInByYXduc1wiO1xuXHRcdCAgICAgICAgXHRcblx0XHQgICAgICAgIFx0XG4vLyBcdFx0ICAgICAgICBcdC8vIGNvbnNvbGUubG9nKHRlbXBEYXRhKVxuLy8gXHRcdCAgICAgICAgXHQvLyAvL2NvbnNvbGUubG9nKHNjb3BlLm5vdGUpO1xuLy8gXHRcdCAgICAgICAgXHR2YXIgcmFzdCA9IHtcbi8vICAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMmFkc0Buaml0LmVkdVwiLFxuLy8gICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJzMVwiLFxuLy8gICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImxhdW5zZHJ5XCIsIFwiYXBzcGx5IGpvYnNcIiwgXCJnc3ltXCIgXSxcbi8vICAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIxLzEvMjIwMTZcIixcbi8vICAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjEvMjIvMjAxNlwiLFxuLy8gICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvenNlLmFrQGdtYWlsLmNvbVwiXG4vLyAgICAgICAgICAgICAgICAgfVxuXHRcdCAgICAgICAgXHRcbi8vIFx0XHQgICAgICAgICAgIHNjb3BlLiRhcHBseSgpO1xuXHRcdFxuXG4vLyBcdFx0ICAgICAgICB9XG5cbi8vIFx0XHQgICAgfSk7IC8vIGVuZCBzb3J0YWJsZVxuXG4vLyBcdFx0IC8vICB9KTsgLy9lbmQgd2F0Y2hcblxuXG5cbi8vIFx0XHR9LFxuLy8gXHRcdGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSl7XG5cbi8vIFx0XHRcdCRzY29wZS5tb29zZSA9IFwiZGluZ1wiXG4vLyBcdFx0XHQkc2NvcGUuZGVsZXRlSXRlbSA9IGZ1bmN0aW9uKHBhcmVudEluZGV4LCBpbmRleCl7XG4vLyBcdFx0XHRcdGNvbnNvbGUubG9nKHBhcmVudEluZGV4KVxuLy8gXHRcdFx0XHRjb25zb2xlLmxvZyhpbmRleClcbi8vIFx0XHRcdFx0JHNjb3BlLm5vdGVzW3BhcmVudEluZGV4XS5pdGVtcy5zcGxpY2UoaW5kZXgsMSlcblxuLy8gXHRcdFx0fVxuXG4vLyBcdFx0XHQkc2NvcGUucmFuZG9tSWQgPSBmdW5jdGlvbihpdGVtKXtcbi8vICAgIFx0XHRcdCByZXR1cm4gXCJJRFwiICsgaXRlbSArIChNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogOTk5KSArIDEpKTtcbi8vIFx0XHRcdH1cbi8vIFx0XHRcdC8vYWxlcnQoXCJjb250cm9sbGVyXCIpO1xuLy8gXHRcdFx0Ly8gJHNjb3BlLmRvZ3MgPSAkc2NvcGUuZGF0YSArIFwiZG9nc1wiO1xuLy8gXHRcdFx0Ly8gaWYoJHNjb3BlLmRyYWdnYWJsZSlcbi8vIFx0XHRcdC8vIFx0JHNjb3BlLmRyYWdTdGF0dXMgPSBmYWxzZTtcbi8vIFx0XHRcdC8vIGVsc2UgJHNjb3BlLmRyYWdTdGF0dXMgPSB0cnVlO1xuXG4vLyBcdFx0XHRjb25zb2xlLmxvZygkc2NvcGUpXG5cblx0XHRcdFxuLy8gXHRcdH1cbi8vIFx0fVxuLy8gfSAvL2VuZCBub3RlY2FyZCBkaXJlY3RpdmVcblxuXG5cblxuXG4iLCIoZnVuY3Rpb24oKXtcblx0J3VzZSBzdHJpY3QnXG5cblx0YW5ndWxhclxuICAgIFx0Lm1vZHVsZSgnbm90ZXMnKVxuICAgIFx0LmZhY3RvcnkoJ25vdGVzU2VydmljZScsIG5vdGVzU2VydmljZSk7XG5cbiAgICBub3Rlc1NlcnZpY2UuJGluamVjdCA9IFsnJGh0dHAnXVxuXG4gICAgZnVuY3Rpb24gbm90ZXNTZXJ2aWNlKCRodHRwKSB7XG4gICAgXHR2YXIgc2VydmljZSA9IHtcblxuICAgICAgICAgICAgZ2V0Tm90ZTogZ2V0Tm90ZSxcbiAgICAgICAgICAgIGdldE5vdGVzOiBnZXROb3RlcyxcbiAgICAgICAgICAgIHNhdmVOb3Rlczogc2F2ZU5vdGVzXG5cblxuICAgIFx0fTtcblxuICAgIFx0cmV0dXJuIHNlcnZpY2U7XG5cbiAgICBcdC8vLy8vLy8vLy8vL1xuXG4gICAgICAgIC8vIGdldHMgYSBzaW5nbGUgbm90ZVxuICAgICAgICBmdW5jdGlvbiBnZXROb3RlICgpIHtcblxuICAgICAgICAgICAgdmFyIG5vdGUgPSB7XG4gICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMkBuaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgIHRpdGxlOiBcInRvZG9cIixcbiAgICAgICAgICAgICAgICBpdGVtczogWyBcImxhdW5kcnlcIiwgXCJhcHBseSBqb2JzXCIsIFwiZ3ltXCIgXSxcbiAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjEvMS8yMDE2XCIsXG4gICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjEvMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3plLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBub3RlO1xuXG4gICAgICAgIH0gLy9lbmQgZ2V0Tm90ZSgpXG5cblxuICAgICAgICAvLyBnZXRzIGFsbCBub3Rlc1xuICAgICAgICBmdW5jdGlvbiBnZXROb3RlcyAoKSB7XG5cbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGkvbm90ZXMvZ2V0Tm90ZXMnLHtlbWFpbDpcIm1vaXpAZ21haWwuY29tXCJ9KVxuICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBub3RlcyA9IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiMVwiLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImxhdW5kcnlcIiwgXCJhcHBseSBqb2JzXCIsIFwiZ3ltXCIgXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIxLzEvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMS8yLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3plLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiMlwiLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImh0bWw1IGRyYWcgYW5kIGRyb3BcIiwgXCJzb2NrZXQuaW9cIiwgXCJub2RlanNcIiBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjIvMS8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIyLzIvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvemUuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMkBuaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCIzXCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwiYm9zZSBoZWFkcGhvbmVzXCIsIFwiMjAxNiBob25kYSBncmlsbFwiLCBcInNvbGlkIHN0YXRlIGhhcmQgZHJpdmVcIiBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjEvMS8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIxLzIvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvemUuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMkBuaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCI0XCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwibGF1bmRyeVwiLCBcImFwcGx5IGpvYnNcIiwgXCJneW1cIiBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjEvMS8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIxLzIvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvemUuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMkBuaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCI1XCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwiaHRtbDUgZHJhZyBhbmQgZHJvcFwiLCBcInNvY2tldC5pb1wiLCBcIm5vZGVqc1wiIF0sXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMi8xLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjIvMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96ZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyQG5qaXQuZWR1XCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIjZcIixcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJib3NlIGhlYWRwaG9uZXNcIiwgXCIyMDE2IGhvbmRhIGdyaWxsXCIsIFwic29saWQgc3RhdGUgaGFyZCBkcml2ZVwiIF0sXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMS8xLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjEvMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96ZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyQG5qaXQuZWR1XCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIjdcIixcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJsYXVuZHJ5XCIsIFwiYXBwbHkgam9ic1wiLCBcImd5bVwiLFwiYm9zZSBoZWFkcGhvbmVzXCIsIFwiMjAxNiBob25kYSBncmlsbFwiLCBcInNvbGlkIHN0YXRlIGhhcmQgZHJpdmVcIiAgXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIxLzEvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMS8yLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3plLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiOFwiLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImh0bWw1IGRyYWcgYW5kIGRyb3BcIiwgXCJzb2NrZXQuaW9cIiwgXCJub2RlanNcIiBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjIvMS8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIyLzIvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvemUuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMkBuaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCI5XCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwiYm9zZSBoZWFkcGhvbmVzXCIsIFwiMjAxNiBob25kYSBncmlsbFwiLCBcInNvbGlkIHN0YXRlIGhhcmQgZHJpdmVcIixcImh0bWw1IGRyYWcgYW5kIGRyb3BcIiwgXCJzb2NrZXQuaW9cIiwgXCJub2RlanNcIiAgXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIxLzEvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMS8yLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3plLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXSAvL2VuZCBub3RlcyBhcnJheVxuXG4gICAgICAgICAgICAvL3JldHVybiBub3Rlc1xuICAgICAgICB9IC8vZW5kIGdldCBub3Rlc1xuXG4gICAgICAgIGZ1bmN0aW9uIHNhdmVOb3Rlcyhub3Rlcykge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGkvbm90ZXMvdXBkYXRlTm90ZXMnLHtlbWFpbDpcIm1vaXpAZ21haWwuY29tXCIsbm90ZXM6IG5vdGVzfSlcbiAgICAgICAgfVxuXG5cblxuICAgIH1cblxuXHRcblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0J3VzZSBzdHJpY3QnXG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ25vdGlmeScpXG5cdFx0LmNvbnRyb2xsZXIoJ25vdGlmeUN0cmwnLCBub3RpZnlDdHJsKVxuXG5cdC8vIG5vdGlmeUN0cmwuJGluamVjdCA9IFtdXG5cblx0ZnVuY3Rpb24gbm90aWZ5Q3RybCgpIHtcblxuXHQgICAgdmFyIHZtID0gdGhpcztcblxuXHQgICAgdm0uZ290b1Nlc3Npb24gPSBnb3RvU2Vzc2lvbjtcblx0ICAgIHZtLnJlZnJlc2ggPSByZWZyZXNoO1xuXHQgICAgdm0uc2VhcmNoID0gc2VhcmNoO1xuXHQgICAgdm0uc2Vzc2lvbnMgPSBbXTtcblx0ICAgIHZtLnRpdGxlID0gJ25vdGlmeSc7XG5cblx0ICAgIC8vLy8vLy8vLy8vL1xuXG5cdCAgICBcblxuXHQgICAgZnVuY3Rpb24gZ290b1Nlc3Npb24oKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIHJlZnJlc2goKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIHNlYXJjaCgpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblx0fVxuXG59KSgpO1xuXG5cbiIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdub3RpZnknKVxuICAgIC5kaXJlY3RpdmUoJ25vdGlmeScsIG5vdGlmeSlcblxuICAgIG5vdGlmeS4kaW5qZWN0ID0gWydub3RpZnlTZXJ2aWNlJywnJHJvb3RTY29wZScsJyR0aW1lb3V0J11cbiAgICBcblxuZnVuY3Rpb24gbm90aWZ5KCkge1xuXHRyZXR1cm57XG5cdFx0cmVzdHJpY3Q6ICdBRScsXG5cdFx0dGVtcGxhdGU6ICc8bGkgbmctcmVwZWF0PVwiaXRlbSBpbiBub3RpZnlMaXN0XCI+e3tpdGVtfX08L2xpPicsXG5cdFx0bGluazogZnVuY3Rpb24oc2NvcGUsZWxlbWVudCxhdHRycyl7XG5cblx0XHR2YXIgbGkgPSBhbmd1bGFyLmVsZW1lbnQoZWxlbWVudC5jaGlsZHJlbigpWzBdKVxuXHRcdGNvbnNvbGUubG9nKGxpKVxuXHRcdFxuXHRcdGFuaW1hdGVEb3duID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zb2xlLmxvZygnYW5pbWF0aW5nJylcbiAgICAgICAgICAgICQodGhpcykuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgdG9wOiAnKz05OSdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIGFuaW1hdGVSaWdodCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBcdGNvbnNvbGUubG9nKCdhbmltYXRpbmcnKVxuICAgICAgICAgICAgJCh0aGlzKS5hbmltYXRlKHtcbiAgICAgICAgICAgIFx0XG4gICAgICAgICAgICAgICAgbGVmdDogJys9NTAnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAkKGxpKS5vbignY2xpY2snLCBhbmltYXRlUmlnaHQpO1xuICAgICAgIC8vICQobGkpLm9uKCdjbGljaycsIGFuaW1hdGVSaWdodCk7ICBcblx0XHQgICAgIFx0XHRcblx0XHRcdFxuXHRcdFx0ICAgIFxuXG5cblxuXHRcdH0sXG5cdFx0Y29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlLG5vdGlmeVNlcnZpY2UsJHJvb3RTY29wZSwkdGltZW91dCl7XG5cdFx0XHRjb25zb2xlLmxvZygnbm90aWZ5IGRpcmVjdGl2ZScpXG5cdFx0XHRcblx0XHRcdCRzY29wZS5ub3RpZnlMaXN0ID0gW1wiZG9nc1wiLFwiY2F0c1wiXTtcdFx0XHRcblxuXHRcdFx0ICRyb290U2NvcGUuJG9uKCdwdXNoZWQnLGZ1bmN0aW9uKGV2ZW50LG1lc3NhZ2Upe1xuXHRcdFx0IFx0Y29uc29sZS5sb2coXCJkaXJlY3RpdmU6IHJlY2VpdmluZ1wiKTtcblx0XHRcdCBcdCRzY29wZS5ub3RpZnlMaXN0LnB1c2gobWVzc2FnZS5kYXRhKTtcblx0XHRcdCBcdFx0XHRcdCBcdCRzY29wZS4kYXBwbHkoKTtcblx0XHRcdCBcdC8vICR0aW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHQgXHQvLyBcdCRzY29wZS5kYXRhID0gbnVsbDtcblx0XHRcdCBcdC8vIH0sMzAwMClcblxuXHRcdFx0IH0pXG5cdFx0XHRcblx0XHR9XG5cdH1cbn0gLy9lbmQgbm90aWZ5IGRpcmVjdGl2ZVxuIiwiKGZ1bmN0aW9uKCl7XG4gICAgJ3VzZSBzdHJpY3QnXG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ25vdGlmeScpXG4gICAgICAgIC5mYWN0b3J5KCdub3RpZnlTZXJ2aWNlJywgbm90aWZ5U2VydmljZSk7XG5cbiAgICBub3RpZnlTZXJ2aWNlLiRpbmplY3QgPSBbJyRyb290U2NvcGUnXVxuXG4gICAgZnVuY3Rpb24gbm90aWZ5U2VydmljZSgkcm9vdFNjb3BlKSB7XG4gICAgICAgIHZhciBzZXJ2aWNlID0ge1xuXG4gICAgICAgICAgICBwdXNoOiBwdXNoLFxuXG5cbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gc2VydmljZTtcblxuICAgICAgICAvLy8vLy8vLy8vLy9cblxuICAgICAgICBmdW5jdGlvbiBwdXNoKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicHVzaGluZyBmcm9tIHNlcnZpY2VcIik7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRlbWl0KFwicHVzaGVkXCIsIG1lc3NhZ2UpO1xuXG4gICAgICAgIH1cblxuXG5cbiAgICB9XG5cbiAgICBcblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0J3VzZSBzdHJpY3QnXG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ3JlZ2lzdGVyJylcblx0XHQuY29udHJvbGxlcigncmVnaXN0ZXJDdHJsJywgcmVnaXN0ZXJDdHJsKVxuXG5cdHJlZ2lzdGVyQ3RybC5pbmplY3QgPSBbJ3RvYXN0cicsJyRodHRwJywncmVnaXN0ZXJTZXJ2aWNlJ11cblxuXHRmdW5jdGlvbiByZWdpc3RlckN0cmwodG9hc3RyLCRodHRwLHJlZ2lzdGVyU2VydmljZSkge1xuXG5cdCAgICB2YXIgdm0gPSB0aGlzO1xuXG5cdCAgICB2bS5mb3JtID0ge31cblx0ICAgIHZtLnN1Ym1pdFN0YXR1cyA9IFwiXCI7XG5cdCAgICB2bS5zdWJtaXRGb3JtID0gc3VibWl0Rm9ybTtcblx0ICAgIFxuXHQgICAgLy9kaXNwbGF5IGluZm8gb24gbG9hZFxuXHQgICAgaW5mbygpO1xuXG5cdCAgICAvLy8vLy8vLy8vLy9cblxuXHQgICAgZnVuY3Rpb24gc3VibWl0Rm9ybShpc1ZhbGlkKSB7XG5cdCAgICBcdFxuXHQgICAgXHRjb25zb2xlLmxvZyh2bS5mb3JtKTtcblx0ICAgIFx0XG5cdCAgICBcdC8vIGNoZWNrIHRvIG1ha2Ugc3VyZSB0aGUgZm9ybSBpcyBjb21wbGV0ZWx5IHZhbGlkXG5cdFx0ICAgIGlmIChpc1ZhbGlkKSB7XG5cdFx0ICAgICAgY29uc29sZS5sb2coXCJWYWxpZCBGb3JtXCIpO1xuXHRcdCAgICAgIHNlbmRGb3JtKHZtLmZvcm0pO1xuXHRcdCAgICB9XG5cdCAgICB9XG5cblx0ICAgIC8vc2VuZHMgZm9ybSB0byBhcGlcblx0ICAgIGZ1bmN0aW9uIHNlbmRGb3JtKGZvcm0pIHtcblx0XHRcdHJlZ2lzdGVyU2VydmljZS5uZXdVc2VyKHZtLGZvcm0pXG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIGluZm8oKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICAgIGNvbnNvbGUubG9nKFwicmVnaXN0ZXIgY29udHJvbGxlclwiKVxuXHQgICAgfVxuXG5cdH1cblxufSkoKTtcblxuXG4iLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgncmVnaXN0ZXInKVxuICAgIC5kaXJlY3RpdmUoJ3JlZ2lzdGVyRGlyJywgcmVnaXN0ZXJEaXIpO1xuXG5mdW5jdGlvbiByZWdpc3RlckRpcigpIHtcblx0cmV0dXJue1xuXHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0dGVtcGxhdGVVcmw6ICcnLFxuXHRcdHJlcGxhY2U6IHRydWVcblx0XHQvLyBzY29wZToge31cblx0fVxufSIsIihmdW5jdGlvbigpe1xuXHQndXNlIHN0cmljdCdcblxuXHRhbmd1bGFyXG4gICAgXHQubW9kdWxlKCdyZWdpc3RlcicpXG4gICAgXHQuZmFjdG9yeSgncmVnaXN0ZXJTZXJ2aWNlJywgcmVnaXN0ZXJTZXJ2aWNlKTtcblxuICAgIHJlZ2lzdGVyU2VydmljZS5pbmplY3QgPSBbJyRodHRwJywndG9hc3RyJywnYXV0aFNlcnZpY2UnLCckc3RhdGUnLCckcm9vdFNjb3BlJ11cblxuICAgIGZ1bmN0aW9uIHJlZ2lzdGVyU2VydmljZSgkaHR0cCx0b2FzdHIsYXV0aFNlcnZpY2UsJHN0YXRlLCRyb290U2NvcGUpIHtcbiAgICBcdHZhciBzZXJ2aWNlID0ge1xuXG4gICAgICAgICAgICBuZXdVc2VyOiBuZXdVc2VyLFxuICAgIFx0XHRlcnJvcjogZXJyb3IsXG4gICAgXHRcdGluZm86IGluZm8sXG4gICAgXHRcdHN1Y2Nlc3M6IHN1Y2Nlc3NcblxuICAgIFx0fTtcblxuICAgIFx0cmV0dXJuIHNlcnZpY2U7XG5cbiAgICBcdC8vLy8vLy8vLy8vL1xuXG4gICAgICAgIGZ1bmN0aW9uIG5ld1VzZXIodm0sIGZvcm0pIHtcbiAgICAgICAgICAgICRodHRwLnBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGkvdXNlcnMvbmV3VXNlcicsIGZvcm0pXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIGF1dGhTZXJ2aWNlLnNldFRva2VuKHJlcy5kYXRhLnRva2VuKTtcblxuICAgICAgICAgICAgICAvL3RvYXN0XG4gICAgICAgICAgICAgIHRvYXN0ci5zdWNjZXNzKCdZb3UgYXJlIG5vdyBteSBCZXRhIScpO1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xuXG4gICAgICAgICAgICAgIC8vY2hhbmdlIHN0YXR1cyBvbiB2aWV3XG4gICAgICAgICAgICAgIHZtLnN1Ym1pdFN0YXR1cyA9IFwiU3VjY2Vzc1wiO1xuICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAvL2VtcHR5IGZvcm1cbiAgICAgICAgICAgICAgdm0uZm9ybSA9IFwiXCI7XG5cbiAgICAgICAgICAgICAgLy9yZWRpcmVjdFxuICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5tZW1iZXJzJyk7XG5cbiAgICAgICAgICAgICAgJHJvb3RTY29wZS4kZW1pdChcImxvZ2dlZEluXCIpO1xuXG4gICAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgICAgdG9hc3RyLmVycm9yKCdGYWlsZWQ6ICcgKyBlcnIuZGF0YSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgXHRmdW5jdGlvbiBlcnJvcigpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gaW5mbygpIHtcblx0ICAgICAgLyogKi9cbiAgICAgICAgICBjb25zb2xlLmxvZyhcInJlZ2lzdGVyU2VydmljZVwiKTtcblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gc3VjY2VzcygpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblxuXG4gICAgfVxuXG5cdFxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCdcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnc2FtcGxlJylcblx0XHQuY29udHJvbGxlcignc2FtcGxlQ3RybCcsIHNhbXBsZUN0cmwpXG5cblx0c2FtcGxlQ3RybC4kaW5qZWN0ID0gW11cblxuXHRmdW5jdGlvbiBzYW1wbGVDdHJsKCkge1xuXG5cdCAgICB2YXIgdm0gPSB0aGlzO1xuXG5cdCAgICB2bS5nb3RvU2Vzc2lvbiA9IGdvdG9TZXNzaW9uO1xuXHQgICAgdm0ucmVmcmVzaCA9IHJlZnJlc2g7XG5cdCAgICB2bS5zZWFyY2ggPSBzZWFyY2g7XG5cdCAgICB2bS5zZXNzaW9ucyA9IFtdO1xuXHQgICAgdm0udGl0bGUgPSAnU2FtcGxlJztcblxuXHQgICAgLy8vLy8vLy8vLy8vXG5cblx0ICAgIGZ1bmN0aW9uIGdvdG9TZXNzaW9uKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiByZWZyZXNoKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBzZWFyY2goKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cdH1cblxufSkoKTtcblxuXG4iLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgnc2FtcGxlJylcbiAgICAuZGlyZWN0aXZlKCdzYW1wbGVEaXInLCBzYW1wbGVEaXIpO1xuXG5mdW5jdGlvbiBzYW1wbGVEaXIoKSB7XG5cdHJldHVybntcblx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdHRlbXBsYXRlVXJsOiAnJyxcblx0XHRyZXBsYWNlOiB0cnVlXG5cdFx0Ly8gc2NvcGU6IHt9XG5cdH1cbn0iLCIoZnVuY3Rpb24oKXtcblx0J3VzZSBzdHJpY3QnXG5cblx0YW5ndWxhclxuICAgIFx0Lm1vZHVsZSgnc2FtcGxlJylcbiAgICBcdC5mYWN0b3J5KCdzYW1wbGVTZXJ2aWNlJywgc2FtcGxlU2VydmljZSk7XG5cbiAgICBzYW1wbGVTZXJ2aWNlLiRpbmplY3QgPSBbXVxuXG4gICAgZnVuY3Rpb24gc2FtcGxlU2VydmljZSgpIHtcbiAgICBcdHZhciBzZXJ2aWNlID0ge1xuXG4gICAgXHRcdGVycm9yOiBlcnJvcixcbiAgICBcdFx0aW5mbzogaW5mbyxcbiAgICBcdFx0c3VjY2Vzczogc3VjY2Vzc1xuXG4gICAgXHR9O1xuXG4gICAgXHRyZXR1cm4gc2VydmljZTtcblxuICAgIFx0Ly8vLy8vLy8vLy8vXG5cbiAgICBcdGZ1bmN0aW9uIGVycm9yKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBpbmZvKCkge1xuXHQgICAgICAvKiAqL1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwic2FtcGxlU2VydmljZVwiKTtcblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gc3VjY2VzcygpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblxuXG4gICAgfVxuXG5cdFxuXG59KSgpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
