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
        'notify'
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
	    	authService.login(vm.user,'app.members')
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
			controllerAs: 'notes',
			data: {
				permission: true,
				permissionLevel: ['admin']
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
		.module('notes')
		.controller('notesCtrl', notesCtrl)

	notesCtrl.$inject = ['notesService']

	function notesCtrl(notesService) {

		console.log("notes ctrl");

		//console.log( notesService.getNotes() )
		
	    var vm = this;

	    vm.notes = notesService.getNotes();
	    vm.dragdata = {startNotePos: null,  startItemPos: null, endNotePos: null, endItemPos: null}
	    //console.log(vm.notes[0].items[0])


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






(function(){
	'use strict'

	angular
    	.module('notes')
    	.factory('notesService', notesService);

    notesService.$inject = []

    function notesService() {
    	var service = {

            getNote: getNote,
            getNotes: getNotes


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
                }  
            ] //end notes array

            return notes
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
		scope: {
			// notes: "=",
			// newItem: "="
		},
		replace: false,
		transclude: false,
		// templateUrl: "components/notes/views/note.directive.view.html",
		template: "<h1>{{data}}</h1>",
		link: function(scope,element,attrs){

			// scope.dogs = function(note){
			// 	console.log(note)
			// }   

		   console.log(element)


		},
		controller: function($scope,notifyService,$rootScope,$timeout){
			console.log('notify directive')
			$scope.data = null;			

			 $rootScope.$on('pushed',function(event,message){
			 	console.log("directive: receiving");
			 	$scope.data = message.data;
			 	$scope.$apply();
			 	$timeout(function(){
			 		$scope.data = "";
			 	},3000)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUuanMiLCJjb250cm9sbGVycy9hcHAuY29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2FwcC5ob21lLmNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9hcHAubG9naW4uY29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2FwcC5uYXYuY29udHJvbGxlci5qcyIsImRpcmVjdGl2ZXMvc2VsZWN0VGV4dC5kaXJlY3RpdmUuanMiLCJyb3V0ZXMvYXBwLnJvdXRlcy5qcyIsImF1dGgvYXV0aC5tb2R1bGUuanMiLCJidWRnZXQvYnVkZ2V0Lm1vZHVsZS5qcyIsIm1lbWJlcnMvbWVtYmVycy5tb2R1bGUuanMiLCJub3Rlcy9ub3Rlcy5tb2R1bGUuanMiLCJub3Rlc0JVL25vdGVzLm1vZHVsZS5qcyIsIm5vdGlmeS9ub3RpZnkubW9kdWxlLmpzIiwicmVnaXN0ZXIvcmVnaXN0ZXIubW9kdWxlLmpzIiwic2FtcGxlQ29tcG9uZW50L3NhbXBsZS5tb2R1bGUuanMiLCJhdXRoL3NlcnZpY2VzL2F1dGguaW50ZXJjZXB0b3Iuc2VydmljZS5qcyIsImF1dGgvc2VydmljZXMvYXV0aC5zZXJ2aWNlLmpzIiwiYnVkZ2V0L2NvbnRyb2xsZXJzL2J1ZGdldC5jb250cm9sbGVyLmpzIiwiYnVkZ2V0L2RpcmVjdGl2ZXMvbm90ZXMuZGlyZWN0aXZlLmJhY2t1cC5qcyIsImJ1ZGdldC9kaXJlY3RpdmVzL25vdGVzLmRpcmVjdGl2ZS5qcyIsImJ1ZGdldC9zZXJ2aWNlcy9idWRnZXQuc2VydmljZS5qcyIsIm1lbWJlcnMvY29udHJvbGxlcnMvbWVtYmVycy5jb250cm9sbGVyLmpzIiwibWVtYmVycy9zZXJ2aWNlcy9tZW1iZXJzLnNlcnZpY2UuanMiLCJub3Rlcy9jb250cm9sbGVycy9ub3Rlcy5jb250cm9sbGVyLmpzIiwibm90ZXMvZGlyZWN0aXZlcy9ub3Rlcy5kaXJlY3RpdmUuYmFja3VwLmpzIiwibm90ZXMvZGlyZWN0aXZlcy9ub3Rlcy5kaXJlY3RpdmUuanMiLCJub3Rlcy9zZXJ2aWNlcy9ub3Rlcy5zZXJ2aWNlLmpzIiwibm90ZXNCVS9jb250cm9sbGVycy9ub3Rlcy5jb250cm9sbGVyLmpzIiwibm90ZXNCVS9kaXJlY3RpdmVzL25vdGVzLmRpcmVjdGl2ZS5iYWNrdXAuanMiLCJub3Rlc0JVL2RpcmVjdGl2ZXMvbm90ZXMuZGlyZWN0aXZlLmpzIiwibm90ZXNCVS9zZXJ2aWNlcy9ub3Rlcy5zZXJ2aWNlLmpzIiwibm90aWZ5L2NvbnRyb2xsZXJzL25vdGlmeS5jb250cm9sbGVyLmpzIiwibm90aWZ5L2RpcmVjdGl2ZXMvbm90aWZ5LmRpcmVjdGl2ZS5qcyIsIm5vdGlmeS9zZXJ2aWNlcy9ub3RpZnkuc2VydmljZS5qcyIsInJlZ2lzdGVyL2NvbnRyb2xsZXJzL3JlZ2lzdGVyLmNvbnRyb2xsZXIuanMiLCJyZWdpc3Rlci9kaXJlY3RpdmVzL3JlZ2lzdGVyLmRpcmVjdGl2ZS5qcyIsInJlZ2lzdGVyL3NlcnZpY2VzL3JlZ2lzdGVyLnNlcnZpY2UuanMiLCJzYW1wbGVDb21wb25lbnQvY29udHJvbGxlcnMvc2FtcGxlLmNvbnRyb2xsZXIuanMiLCJzYW1wbGVDb21wb25lbnQvZGlyZWN0aXZlcy9zYW1wbGUuZGlyZWN0aXZlLmpzIiwic2FtcGxlQ29tcG9uZW50L3NlcnZpY2VzL3NhbXBsZS5zZXJ2aWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtcbiAgICAndXNlIHN0cmljdCdcblxuYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcCcsIFtcbiAgICBcdCd1aS5yb3V0ZXInLFxuICAgIFx0J25nQW5pbWF0ZScsXG4gICAgXHQnc2FtcGxlJyxcbiAgICBcdCdyZWdpc3RlcicsXG4gICAgXHQndG9hc3RyJyxcbiAgICBcdCdhdXRoJyxcbiAgICBcdCdtZW1iZXJzJyxcbiAgICBcdCdub3RlcycsXG4gICAgICAgICdidWRnZXQnLFxuICAgICAgICAnY2hhcnQuanMnLFxuICAgICAgICAnbm90aWZ5J1xuICAgIF0pXG5cblxuXG4ucnVuKFsnJHJvb3RTY29wZScsJyRzdGF0ZScsJ2F1dGhTZXJ2aWNlJywnJHEnLGZ1bmN0aW9uKCRyb290U2NvcGUsICRzdGF0ZSwgYXV0aFNlcnZpY2UgLCRxKSB7XG4gICAgYXV0aFNlcnZpY2UuaW5mbygpO1xuXG4gICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZUVycm9yJywgZnVuY3Rpb24gKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zLCBlcnJvcikge1xuICAgICAgICAgICBcbiAgICAgICAgICAvLyBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNUQVRFIENIQU5HRSBFUlJPUiBFUlJPUiBFUlJPUiBFUlJPUkVSUk9SXCIpO1xuICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5ob21lJylcbiAgICAgICAgXG4gICAgICB9KTtcblxuICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdGFydCcsIGZ1bmN0aW9uIChldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcykge1xuICAgIC8vYXV0aFNlcnZpY2UuaW5mbygpO1xuICAgIC8vYXV0aFNlcnZpY2UuaXNBdXRob3JpemVkKCBldmVudCwgZnJvbVN0YXRlLCB0b1N0YXRlKTtcbiAgICAvL2NvbnNvbGUubG9nKFwic3RhdGUgY2hhbmdpbmdcIik7XG4gICAgLy9jb25zb2xlLmxvZyh0b1N0YXRlKVxuXG4gICAgICAgIGlmKHRvU3RhdGUuZGF0YS5wZXJtaXNzaW9uID09PSB0cnVlKXtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJuZWVkIHBlcm1pc3Npb25cIik7XG4gICAgICAgICAgICAvL3RvU3RhdGUucmVzb2x2ZSA9IHRvU3RhdGUucmVzb2x2ZSB8fCB7fTtcbiAgICAgICAgICAgIC8vdG9TdGF0ZS5yZXNvbHZlID0ge307XG5cbiAgICAgICAgICAgIC8vY2hlY2sgdG8gc2VlIGlmIHRoZXJlIHdhcyBhIHJlc29sdmUgYWxyZWFkeSBhZGRlZFxuICAgICAgICAgICAgaWYoIXRvU3RhdGUucmVzb2x2ZS5hdXRob3JpemF0aW9uUmVzb2x2ZXIpe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdhZGRpbmcgYXV0aCByZXNvbHZlcicpO1xuICAgICAgICAgICAgICAgIC8vYWRkIHJlc29sdmVyXG4gICAgICAgICAgICAgICAgdG9TdGF0ZS5yZXNvbHZlLmF1dGhvcml6YXRpb25SZXNvbHZlciA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXV0aFNlcnZpY2UuaXNBdXRob3JpemVkKGV2ZW50LCBmcm9tU3RhdGUsIHRvU3RhdGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwianVzdCBhZGRlZDogXCIpXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyh0b1N0YXRlLnJlc29sdmUuYXV0aG9yaXphdGlvblJlc29sdmVyKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAvL2p1c3QgdG8gc2hvdyB0aGF0IHRoZSByZXNvbHZlciB3YXMgYWxyZWFkeSBhZGRlZFxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2codG9TdGF0ZS5yZXNvbHZlLmF1dGhvcml6YXRpb25SZXNvbHZlcilcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IC8vZW5kIGlmIG5lZWRzIHBlcm1pc3Npb25cblxuXG4gICAgfSk7IC8vZW5kIHJvb3RTY29wZS4kb25cblxuXG4gICAgXG5cbn1dKTsgLy9lbmQgLnJ1blxuXG5cblxuXG5cbn0pKCk7OyAvL2VuZCBpZmZlXG5cbiIsIihmdW5jdGlvbigpIHtcblx0J3VzZSBzdHJpY3QnXG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ2FwcCcpXG5cdFx0LmNvbnRyb2xsZXIoJ2FwcEN0cmwnLCBhcHBDdHJsKVxuXG5cdGFwcEN0cmwuJGluamVjdCA9IFsnc2FtcGxlU2VydmljZScsJ2F1dGhTZXJ2aWNlJywnJHN0YXRlJywnJGh0dHAnLCd0b2FzdHInLCckcm9vdFNjb3BlJywnbm90aWZ5U2VydmljZSddXG5cblx0ZnVuY3Rpb24gYXBwQ3RybChzYW1wbGVTZXJ2aWNlLGF1dGhTZXJ2aWNlLCRzdGF0ZSwgJGh0dHAsIHRvYXN0ciwgJHJvb3RTY29wZSxub3RpZnlTZXJ2aWNlKSB7XG5cblx0XHQgdmFyIHZtID0gdGhpcztcblxuXHRcdCAvLyBvbiBpbml0aWFsIGxvYWRcblx0XHQgLy8gdXNlciBsb2dpbiBzdGF0dXNcblx0XHQgdm0uaXNMb2dnZWQgPSBhdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQodm0pO1xuXG5cdFx0ICRyb290U2NvcGUuJG9uKCdsb2dnZWRJbicsZnVuY3Rpb24oKXtcblx0XHQgXHR2bS5pc0xvZ2dlZCA9IHRydWU7XG5cdFx0IH0pXG5cblx0XHQgJHJvb3RTY29wZS4kb24oJ2xvZ2dlZE91dCcsZnVuY3Rpb24oKXtcblx0XHQgXHR2bS5pc0xvZ2dlZCA9IGZhbHNlO1xuXHRcdCB9KVxuXG5cdFx0IHZhciBtZXNzYWdlID0ge2RhdGEgOiBcInJvb3N0c1wifTtcblx0XHQgLy9ub3RpZnlTZXJ2aWNlLnB1c2goIG1lc3NhZ2UpO1xuXG5cdFx0IC8vYWxlcnQoXCJ3YXRjaGluZ1wiKTtcblxuXG5cdH0gLy9lbmQgYXBwQ3RybFxuXG59KSgpOztcblxuXG4iLCIoZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0J1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCdhcHAnKVxuXHRcdC5jb250cm9sbGVyKCdob21lQ3RybCcsIGhvbWVDdHJsKVxuXHRcdC5jb250cm9sbGVyKCdwYXJlbnRDdHJsJywgcGFyZW50Q3RybClcblxuXHRob21lQ3RybC5pbmplY3QgPSBbJ3NhbXBsZVNlcnZpY2UnLCckc2NvcGUnXVxuXG5cdGZ1bmN0aW9uIGhvbWVDdHJsKHNhbXBsZVNlcnZpY2UsICRzY29wZSkge1xuXHRcdFxuXHRcdHNhbXBsZVNlcnZpY2UuaW5mbygpO1xuXG5cdCAgICB2YXIgdm0gPSB0aGlzO1xuXG5cdCAgICB2bS5nb3RvU2Vzc2lvbiA9IGdvdG9TZXNzaW9uO1xuXHQgICAgdm0ucmVmcmVzaCA9IHJlZnJlc2g7XG5cdCAgICB2bS5zZWFyY2ggPSBzZWFyY2g7XG5cdCAgICB2bS5zZXNzaW9ucyA9IFtdO1xuXHQgICAgdm0udGVzdCA9ICd0ZXN0JztcblxuXHQgICAgLy8vLy8vLy8vLy8vXG5cblx0ICAgIC8vICRzY29wZS4kb24oJ2RvZ3MnLCBmdW5jdGlvbiAoKSB7XG5cdCAgICAvLyBcdGNvbnNvbGUubG9nKFwicmVjZWl2ZWRcIilcblx0ICAgIC8vIH0pO1xuXG5cdCAgICBmdW5jdGlvbiBnb3RvU2Vzc2lvbigpIHtcblxuXHRcdH1cblxuXHQgICAgZnVuY3Rpb24gcmVmcmVzaCgpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gc2VhcmNoKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXHR9IC8vIGVuZCBob21lQ3RybFxuXG5cdHBhcmVudEN0cmwuaW5qZWN0ID0gWydzYW1wbGVTZXJ2aWNlJywnJHNjb3BlJ11cblxuXHRmdW5jdGlvbiBwYXJlbnRDdHJsKCRzY29wZSkge1xuXHRcdFxuXHQgICAgdmFyIHZtID0gdGhpcztcblx0ICAgIC8vY29uc29sZS5sb2coXCJwYXJlbnRcIilcblxuXHQgICAvLyAkc2NvcGUuJGVtaXQoJ2RvZ3MnLCdzb21lIGRhdGEnKTtcblxuXG5cdH0gLy8gZW5kIHBhcmVudEN0cmxcblxufSkoKTtcblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuIiwiXHQoZnVuY3Rpb24oKXtcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnYXBwJylcblx0XHQuY29udHJvbGxlcihcImxvZ2luQ3RybFwiLCBsb2dpbkN0cmwpXG5cblx0bG9naW5DdHJsLiRpbmplY3QgPSBbJyRzY29wZScsJ3NhbXBsZVNlcnZpY2UnLCdhdXRoU2VydmljZScsJyRzdGF0ZScsJyRodHRwJywndG9hc3RyJ11cblxuXHRmdW5jdGlvbiBsb2dpbkN0cmwoJHNjb3BlLHNhbXBsZVNlcnZpY2UsYXV0aFNlcnZpY2UsJHN0YXRlLCAkaHR0cCwgdG9hc3RyKSB7XG5cdFx0Ly9zYW1wbGVTZXJ2aWNlLmluZm8oKTtcblx0XHQvL2NvbnNvbGUubG9nKFwibG9naW5DdHJsXCIpXG5cblx0ICAgIHZhciB2bSA9IHRoaXM7XG5cdCAgICB2bS51c2VyID0gXCJcIlxuXHQgICAgdm0ubG9naW5Gb3JtID0gXCJcIjtcblx0ICAgIFxuXHQgICAgdm0ubG9naW4gPSBsb2dpbjtcblx0ICAgIHZtLmxvZ291dCA9IGxvZ291dDtcblxuXHQgICAgLy8vLy8vLy8vLy8vXG5cblx0ICAgIGZ1bmN0aW9uIGxvZ2luKCkge1xuXHQgICAgXHRhdXRoU2VydmljZS5sb2dpbih2bS51c2VyLCdhcHAubWVtYmVycycpXG5cdFx0XHR2bS51c2VyID0gXCJcIjtcblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gbG9nb3V0KCkge1xuXHQgICAgXHRjb25zb2xlLmxvZyhcImxvZ2dpbmcgb3V0Li4uXCIpXG5cdCAgICBcdGF1dGhTZXJ2aWNlLmxvZ291dCgpO1xuXHQgICAgfVxuXG5cblx0fSAvL2VuZCBsb2dpbkN0cmxcblxuXG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCdcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnYXBwJylcblx0XHQuY29udHJvbGxlcignbmF2Q3RybCcsIG5hdkN0cmwpXG5cblx0bmF2Q3RybC5pbmplY3QgPSBbJyddXG5cblx0ZnVuY3Rpb24gbmF2Q3RybCgpIHtcblx0XHRcblx0XHQvL2NvbnNvbGUubG9nKCduYXYgY29udHJvbGxlcicpO1xuXG5cdCAgICB2YXIgdm0gPSB0aGlzO1xuXG5cblx0ICAgIHZtLmxvZ2dlZEluID0gdHJ1ZTtcblx0ICAgIHZtLmdvdG9TZXNzaW9uID0gZ290b1Nlc3Npb247XG5cdCAgICB2bS5yZWZyZXNoID0gcmVmcmVzaDtcblx0ICAgIHZtLnNlYXJjaCA9IHNlYXJjaDtcblx0ICAgIHZtLnNlc3Npb25zID0gW107XG5cdCAgICB2bS50aXRsZSA9ICdOYXYnO1xuXHQgICAgLy8kc2NvcGUudGl0bGUgPSBcIm1vdXNlXCI7XG5cblx0ICAgIC8vLy8vLy8vLy8vL1xuXG5cdCAgICBmdW5jdGlvbiBnb3RvU2Vzc2lvbigpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gcmVmcmVzaCgpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gc2VhcmNoKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXHR9XG5cbn0pKCk7XG5cblxuIiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcCcpXG4gICAgLmRpcmVjdGl2ZSgnc2VsZWN0VGV4dCcsIHNlbGVjdFRleHQpXG4gICAgXG4gICAgc2VsZWN0VGV4dC4kaW5qZWN0ID0gWyckd2luZG93J11cblxuZnVuY3Rpb24gc2VsZWN0VGV4dCgkd2luZG93KXtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgIGVsZW1lbnQuYmluZCgnY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoISR3aW5kb3cuZ2V0U2VsZWN0aW9uKCkudG9TdHJpbmcoKSkge1xuICAgICAgICB0aGlzLnNldFNlbGVjdGlvblJhbmdlKHRoaXMudmFsdWUubGVuZ3RoLCB0aGlzLnZhbHVlLmxlbmd0aClcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn1cblxuXG4iLCJcbmFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuXHQuY29uZmlnKFsnJHVybFJvdXRlclByb3ZpZGVyJywnJHN0YXRlUHJvdmlkZXInLCckaHR0cFByb3ZpZGVyJyxmdW5jdGlvbigkdXJsUm91dGVyUHJvdmlkZXIsJHN0YXRlUHJvdmlkZXIsJGh0dHBQcm92aWRlcil7XG5cdFx0XG5cdFx0JHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnaG9tZScpO1xuXHRcdC8vc3RhdGVzXG5cdFx0JHN0YXRlUHJvdmlkZXJcblxuXHRcdC5kZWNvcmF0b3IoJ3BhdGgnLCBmdW5jdGlvbihzdGF0ZSwgcGFyZW50Rm4pIHtcblx0XHRcdC8vY29uc29sZS5sb2coXCJjb25maWd1cmluZyBzdGF0ZXNcIilcdFxuXHRcdFx0aWYgKHN0YXRlLnNlbGYucmVzb2x2ZSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHN0YXRlLnNlbGYucmVzb2x2ZSA9IHt9O1xuXHRcdFx0XHRzdGF0ZS5yZXNvbHZlID0gc3RhdGUuc2VsZi5yZXNvbHZlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHBhcmVudEZuKHN0YXRlKTtcbiAgICAgICAgIH0pXG5cblx0XHQuc3RhdGUoJ2FwcCcse1xuXHRcdFx0YWJzdHJhY3Q6IHRydWUsXG5cdFx0XHR0ZW1wbGF0ZVVybDonYXBwL3ZpZXdzL2FwcC52aWV3Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ2FwcEN0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAnYXBwJ1xuXG5cdFx0fSlcblxuXHRcdC5zdGF0ZSgnYXBwLmhvbWUnLHtcblx0XHRcdHVybDogJy9ob21lJyxcblx0XHRcdHRlbXBsYXRlVXJsOidhcHAvdmlld3MvYXBwLmhvbWUuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnaG9tZUN0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAnaG9tZScsXG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdHBlcm1pc3Npb246IGZhbHNlLFxuXHRcdFx0XHRwZXJtaXNzaW9uTGV2ZWw6IFsnZXZlcnlvbmUnXVxuXHRcdFx0fVxuXHRcdH0pXG5cblx0XHQuc3RhdGUoJ2FwcC5yZWdpc3Rlcicse1xuXHRcdFx0dXJsOiAnL3JlZ2lzdGVyJyxcblx0XHRcdHRlbXBsYXRlVXJsOidjb21wb25lbnRzL3JlZ2lzdGVyL3ZpZXdzL3JlZ2lzdGVyLnZpZXcuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAncmVnaXN0ZXJDdHJsJyxcblx0XHRcdGNvbnRyb2xsZXJBczogJ3JlZ2lzdGVyJyxcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0cGVybWlzc2lvbjogZmFsc2UsXG5cdFx0XHRcdHBlcm1pc3Npb25MZXZlbDogWydldmVyeW9uZSddXG5cdFx0XHR9XG5cdFx0fSlcblxuXHRcdC5zdGF0ZSgnYXBwLm1lbWJlcnMnLHtcblx0XHRcdHVybDogJy9tZW1iZXJzJyxcblx0XHRcdHRlbXBsYXRlVXJsOidjb21wb25lbnRzL21lbWJlcnMvdmlld3MvbWVtYmVycy5ob21lLmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ21lbWJlcnNDdHJsJyxcblx0XHRcdGNvbnRyb2xsZXJBczogJ21lbWJlcnMnLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRwZXJtaXNzaW9uOiB0cnVlLFxuXHRcdFx0XHRwZXJtaXNzaW9uTGV2ZWw6IFsnYWRtaW4nLCdtZW1iZXInXVxuXHRcdFx0fVxuXHRcdH0pXG5cblx0XHQuc3RhdGUoJ2FwcC5ub3Rlcycse1xuXHRcdFx0dXJsOiAnL25vdGVzJyxcblx0XHRcdHRlbXBsYXRlVXJsOidjb21wb25lbnRzL25vdGVzL3ZpZXdzL25vdGVzLnZpZXcuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnbm90ZXNDdHJsJyxcblx0XHRcdGNvbnRyb2xsZXJBczogJ25vdGVzJyxcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0cGVybWlzc2lvbjogdHJ1ZSxcblx0XHRcdFx0cGVybWlzc2lvbkxldmVsOiBbJ2FkbWluJ11cblx0XHRcdH1cblx0XHR9KVxuXG5cdFx0LnN0YXRlKCdhcHAuYnVkZ2V0Jyx7XG5cdFx0XHR1cmw6ICcvYnVkZ2V0Jyxcblx0XHRcdHRlbXBsYXRlVXJsOidjb21wb25lbnRzL2J1ZGdldC92aWV3cy9idWRnZXQudmlldy5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdidWRnZXRDdHJsJyxcblx0XHRcdGNvbnRyb2xsZXJBczogJ2J1ZGdldCcsXG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdHBlcm1pc3Npb246IHRydWUsXG5cdFx0XHRcdHBlcm1pc3Npb25MZXZlbDogWydhZG1pbiddXG5cdFx0XHR9XG5cdFx0fSlcblxuXHRcdC8vJGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaCgnYXV0aEludGVyY2VwdG9yJyk7XG5cblxuXG5cdH1dKTtcblxuIiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ2F1dGgnLCBbXG4gICAgICBcbiAgICBdKTsiLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgnYnVkZ2V0JywgW1xuICAgICAgJ2NoYXJ0LmpzJ1xuICAgIF0pOyIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdtZW1iZXJzJywgW1xuICAgICAgXG4gICAgXSk7IiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ25vdGVzJywgW1xuICAgICAgXG4gICAgXSk7IiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ25vdGVzJywgW1xuICAgICAgXG4gICAgXSk7IiwiKGZ1bmN0aW9uKCl7XG5cdCd1c2Ugc3RyaWN0J1xuXG5hbmd1bGFyXG5cdC5tb2R1bGUoJ25vdGlmeScsIFtcblx0ICBcblx0XSk7XG5cbn0pKCk7XG5cblxuIiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ3JlZ2lzdGVyJywgW1xuICAgIFx0J2F1dGgnXG4gICAgXSk7IiwiKGZ1bmN0aW9uKCl7XG5cdCd1c2Ugc3RyaWN0J1xuXG5hbmd1bGFyXG5cdC5tb2R1bGUoJ3NhbXBsZScsIFtcblx0ICBcblx0XSk7XG5cbn0pKCk7XG5cbiIsIi8vIChmdW5jdGlvbigpe1xuLy8gXHQndXNlIHN0cmljdCdcblxuLy8gXHRhbmd1bGFyXG4vLyAgICAgXHQubW9kdWxlKCdhdXRoJylcbi8vICAgICBcdC5mYWN0b3J5KCdhdXRoSW50ZXJjZXB0b3InLCBhdXRoSW50ZXJjZXB0b3IpO1xuXG4vLyAgICAgYXV0aEludGVyY2VwdG9yLmluamVjdCA9IFsnYXV0aFNlcnZpY2UnXVxuXG4vLyAgICAgZnVuY3Rpb24gYXV0aEludGVyY2VwdG9yKGF1dGhTZXJ2aWNlKSB7XG5cblxuXG4vLyAgICAgXHR2YXIgc2VydmljZSA9IHtcblxuLy8gICAgIFx0XHRyZXF1ZXN0OiByZXF1ZXN0LFxuLy8gICAgICAgICAgICAgcmVzcG9uc2U6IHJlc3BvbnNlXG5cbi8vICAgICBcdH07XG5cbi8vICAgICBcdHJldHVybiBzZXJ2aWNlO1xuXG4vLyAgICAgXHQvLy8vLy8vLy8vLy9cblxuLy8gICAgIFx0ZnVuY3Rpb24gcmVxdWVzdChjb25maWcpIHtcblxuLy8gICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImF1dGhJbnRlcmNlcHRvciByZXF1ZXN0IGZ1bmN0aW9uXCIpXG5cbi8vICAgICAgICAgICAgIHZhciB0b2tlbiA9IGF1dGhTZXJ2aWNlLmdldFRva2VuKCk7XG5cbi8vICAgICAgICAgICAgIGlmKHRva2VuKXtcbi8vICAgICAgICAgICAgICAgICBjb25maWcuaGVhZGVycy5hdXRob3JpemF0aW9uID0gdG9rZW47XG4vLyAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ0b2tlbiBwcmVzZW50XCIpO1xuLy8gICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgZWxzZXtcbi8vICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5vIHRva2VuXCIpO1xuLy8gICAgICAgICAgICAgfSAgICBcbi8vICAgICAgICAgICAgIHJldHVybiBjb25maWc7XG4vLyBcdCAgICB9XG5cbi8vIFx0ICAgIGZ1bmN0aW9uIHJlc3BvbnNlKHJlc3BvbnNlKSB7XG4vLyAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiYXV0aEludGVyY2VwdG9yIHJlc3BvbnNlIGZ1bmN0aW9uXCIpXG4vLyAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4vLyBcdCAgICB9XG5cbi8vICAgICB9IC8vZW5kIGF1dGhJbnRlcmNlcHRvclxuXG5cdFxuXG4vLyB9KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdC8vJ3VzZSBzdHJpY3QnXG5cblx0YW5ndWxhclxuICAgIFx0Lm1vZHVsZSgnYXV0aCcsW10pXG4gICAgXHQuZmFjdG9yeSgnYXV0aFNlcnZpY2UnLCBhdXRoU2VydmljZSk7XG5cbiAgICBhdXRoU2VydmljZS4kaW5qZWN0ID0gWyckd2luZG93JywnJGh0dHAnLCd0b2FzdHInLCckc3RhdGUnLCckcm9vdFNjb3BlJywnJGxvY2F0aW9uJywnJHEnXTtcblxuICAgIGZ1bmN0aW9uIGF1dGhTZXJ2aWNlKCR3aW5kb3csJGh0dHAsdG9hc3RyLCRzdGF0ZSwkcm9vdFNjb3BlLCRsb2NhdGlvbiwkcSkge1xuXG4gICAgXG5cbiAgICBcdHZhciBzZXJ2aWNlID0ge1xuXG4gICAgICAgICAgICBpbmZvOiBpbmZvLFxuXG4gICAgICAgICAgICBsb2dpbjogbG9naW4sXG4gICAgICAgICAgICBsb2dvdXQ6IGxvZ291dCxcblxuICAgIFx0XHRzZXRUb2tlbjogc2V0VG9rZW4sXG4gICAgICAgICAgICBnZXRUb2tlbjogZ2V0VG9rZW4sXG4gICAgXHRcdGNsZWFyVG9rZW46IGNsZWFyVG9rZW4sXG5cbiAgICAgICAgICAgIGlzQXV0aGVudGljYXRlZDogaXNBdXRoZW50aWNhdGVkLCAvLyB2ZXJpZmllcyB0b2tlblxuICAgICAgICAgICAgaXNBdXRob3JpemVkOiBpc0F1dGhvcml6ZWQgLy8gdmVyaWZpZXMgcm91dGUgcGVybWlzc2lvbnNcblxuICAgIFx0fTtcblxuICAgIFx0cmV0dXJuIHNlcnZpY2U7XG5cbiAgICBcdC8vLy8vLy8vLy8vL1xuXG4gICAgICAgIGZ1bmN0aW9uIGluZm8gKCkge1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImF1dGggc2VydmljZVwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHJlZGlyZWN0IHRha2VzIHJvdXRlIHN0cmluZyBpZS4gJ2FwcC5ob21lJ1xuICAgICAgICBmdW5jdGlvbiBsb2dpbiAodXNlckxvZ2luRGF0YSwgcmVkaXJlY3QpIHtcbiAgICAgICAgICAgICRodHRwLnBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGkvdXNlcnMvbG9naW4nLCB1c2VyTG9naW5EYXRhKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlcyl7XG4gICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzKTtcbiAgICAgICAgICAgICAgICAgICAgaWYocmVzLnN0YXR1cyA9PSAyMDApe1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VG9rZW4ocmVzLmRhdGEudG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kZW1pdChcImxvZ2dlZEluXCIpOyAgXG4gICAgICAgICAgICAgICAgICAgICAgICB0b2FzdHIuc3VjY2VzcyhyZXMuZGF0YS5tZXNzYWdlKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYodHlwZW9mKHJlZGlyZWN0KSAhPSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhyZWRpcmVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVycil7XG4gICAgICAgICAgICAgICAgICAgIHRvYXN0ci5lcnJvcihlcnIuZGF0YS5tZXNzYWdlKVxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpXG4gICAgICAgICAgICAgICAgfSlcblxuXG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBsb2dvdXQgKCkge1xuICAgICAgICAgICAgY2xlYXJUb2tlbigpO1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kZW1pdChcImxvZ2dlZE91dFwiKTtcbiAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC5ob21lXCIpO1xuICAgICAgICAgICAgdG9hc3RyLnN1Y2Nlc3MoXCJZb3UgaGF2ZSBiZWVuIGxvZ2dlZCBvdXRcIik7XG4gICAgICAgIH1cblxuXG5cbiAgICBcdGZ1bmN0aW9uIHNldFRva2VuICh0b2tlbikge1xuICAgICAgICAgICAgJHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndXNlclRva2VuJyx0b2tlbik7XG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIGdldFRva2VuICgpIHtcbiAgICAgICAgICAgIHZhciB0b2tlbiA9ICR3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3VzZXJUb2tlbicpO1xuICAgICAgICAgICAgcmV0dXJuIHRva2VuO1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBjbGVhclRva2VuICgpIHtcbiAgICAgICAgICAgICR3aW5kb3cubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3VzZXJUb2tlbicpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3JhYmJpdHMnKVxuXHQgICAgfVxuXG4gICAgICAgIC8vYmFzaWNhbGx5IGFyZSB0aGV5IGxvZ2dlZCBpblxuICAgICAgICBmdW5jdGlvbiBpc0F1dGhlbnRpY2F0ZWQgKCkge1xuXG4gICAgICAgICAgICB2YXIgdG9rZW4gPSBnZXRUb2tlbigpO1xuICAgICAgICAgICAgaWYodG9rZW4pe1xuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGkvdXNlcnMvYXV0aG9yaXplJyx7dG9rZW46dG9rZW59KVxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHJlcylcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdhdXRob3JpemluZy4uJylcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCByZXMuZGF0YS5zdWNjZXNzID09IHRydWUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvYXN0ci5zdWNjZXNzKFwiQXV0aGVudGljYXRpb24gU3VjY2VzcyFcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkF1dGhlbnRpY2F0aW9uIFN1Y2Nlc3MhXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kZW1pdChcImxvZ2dlZEluXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vdG9hc3RyLmVycm9yKFwiQXV0aGVudGljYXRpb24gRmFpbGVkXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJBdXRoZW50aWNhdGlvbiBGYWlsZWRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvYXN0ci5lcnJvcihlcnIuZGF0YSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgIC8vdG9hc3RyLmVycm9yKFwiYXV0aGVudGljYXRpb24gZmFpbGVkLCBubyB0b2tlbiBwcmVzZW50XCIpXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJhdXRoZW50aWNhdGlvbiBmYWlsZWQsIG5vIHRva2VuIHByZXNlbnRcIilcbiAgICAgICAgICAgIH0gXG4gICAgICAgICAgIFxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaXNBdXRob3JpemVkIChldmVudCwgZnJvbVN0YXRlLCB0b1N0YXRlKSB7XG4gICAgICAgICAgICAgICAgLy9yZXR1cm4gJHEucmVqZWN0KCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJydW5uaW5nIGlzIGF1dGhvcml6ZWRcIilcblxuICAgICAgICAgICAgICAgIC8vZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB2YXIgdG9rZW4gPSBnZXRUb2tlbigpO1xuICAgICAgICAgICAgICAgIHZhciB1c2VybGV2ZWwgPSBudWxsO1xuICAgICAgICAgICAgICAgIHZhciBwcm9jZWVkID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICBpZih0b2tlbil7XG4gICAgICAgICAgICAgICAgICAvLyAgcmV0dXJuICRxLnJlamVjdDtcbiAgICAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnaHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaS91c2Vycy9hdXRob3JpemUnLHt0b2tlbjp0b2tlbn0pXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2F1dGhvcml6aW5nLi4nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCByZXMuZGF0YS5zdWNjZXNzID09IHRydWUgJiYgcmVzLmRhdGEucHJvZmlsZS51c2VyTGV2ZWwpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzLmRhdGEucHJvZmlsZS51c2VyTGV2ZWwpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJMZXZlbCA9IHJlcy5kYXRhLnByb2ZpbGUudXNlckxldmVsO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9sb29wIHRocm91Z2ggcGVybWlzc2lvbiBsaXN0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaT0wOyBpIDwgdG9TdGF0ZS5kYXRhLnBlcm1pc3Npb25MZXZlbC5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9pZiBjdXJyZW50IHVzZXJsZXZlbCBtYXRjaGVzIHBlcm1pc3Npb24gbGV2ZWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3RoZW4gc2V0IHByb2NlZWQgdG8gdHJ1ZSBhbmQgYnJlYWsgdGhlIGZvciBsb29wIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY3VycmVudCBsb29wIGkgOiBcIiArIHRvU3RhdGUuZGF0YS5wZXJtaXNzaW9uTGV2ZWxbaV0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYodXNlckxldmVsID09IHRvU3RhdGUuZGF0YS5wZXJtaXNzaW9uTGV2ZWxbaV0pe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJwZXJtaXNzaW9uIG1hdGNoXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInNldHRpbmcgcHJvY2VlZCB0cnVlXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9jZWVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9yZXR1cm4gdG9hc3RyLnN1Y2Nlc3MoXCJwcm9jZWVkXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwia2VlcCBsb29raW5nXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInNldHRpbmcgcHJvY2VlZCBmYWxzZVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2VlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9ICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9Ly9lbmQgZm9yIGxvb3AgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gLy8gZW5kIGlmIHByb2ZpbGUgcmV0dXJuZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBlbHNlIG5vIHByb2ZpbGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2FzdHIuZXJyb3IoXCJiYWQgcmVxdWVzdFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9jZWVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJsYXN0IGNoZWNrXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYocHJvY2VlZCA9PSBmYWxzZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSVRTIEZBTFNFXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAuaG9tZScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSkgLy9lbmQgdGhlblxuICAgICAgICAgICAgICAgIH0vL2VuZCBpZiB0b2tlblxuXG4gICAgICAgICAgICAgICAgLy9lbHNlIG5vIHRva2VuIFxuICAgICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgICAgIHRvYXN0ci5lcnJvcihcIm5vIHRva2VuIHByZXNlbnRcIilcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICBcblxuICAgICAgICB9Ly9lbmQgaXNBdXRob3JpemVkXG4gICAgICAgIFxuXG4gICAgfS8vZW5kIGF1dGhTZXJ2aWNlXG5cblxuXG5cdFxuXG59KSgpOyAvL2VuZCBpZmZlXG5cblxuIiwiKGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCdcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnYnVkZ2V0Jylcblx0XHQuY29udHJvbGxlcignYnVkZ2V0Q3RybCcsIGJ1ZGdldEN0cmwpXG5cblx0YnVkZ2V0Q3RybC4kaW5qZWN0ID0gWyckc2NvcGUnLCckaHR0cCcsJ3RvYXN0ciddXG5cblx0ZnVuY3Rpb24gYnVkZ2V0Q3RybCgkc2NvcGUsICRodHRwLCB0b2FzdHIpIHtcblx0XHRjb25zb2xlLmxvZygnbG9hZGVkIGJ1ZGdldEN0cmwnKTtcblx0XG5cdFx0Ly8gJHNjb3BlLk1hdGggPSB3aW5kb3cuTWF0aDtcblxuXHRcdCAgICBcblxuXG4gIFx0XHRcdC8vIGluY29tZVxuICBcdFx0XHQkc2NvcGUuaW5jb21lID0ge31cbiAgXHRcdFx0JHNjb3BlLmluY29tZS5tb250aGx5ID0gNDUwMDtcblxuICBcdFx0XHQvLyBiaWxsc1xuICBcdFx0XHQkc2NvcGUuYmlsbHMgPVtdXG4gIFx0XHRcdCRzY29wZS5iaWxscyA9IFtcbiAgXHRcdFx0XHR7bmFtZTpcInJlbnRcIiwgY29zdDogMjUwMH0sXG4gIFx0XHRcdFx0e25hbWU6XCJ1dGlsaXRpZXNcIiwgY29zdDogMjAwfSxcbiAgXHRcdFx0XHR7bmFtZTpcImNhciBpbnN1cmFuY2VcIiwgY29zdDogMTUwfSxcbiAgXHRcdFx0XHR7bmFtZTpcImNhciBwYXltZW50XCIsIGNvc3Q6IDI1MH0sXG4gIFx0XHRcdFx0e25hbWU6XCJnYXNcIiwgY29zdDogMTAwfSxcbiAgXHRcdFx0XHR7bmFtZTpcImd5bSBtZW1iZXJzaGlwXCIsIGNvc3Q6IDUwfSxcbiAgXHRcdFx0XHR7bmFtZTpcImNlbGwgcGhvbmVcIiwgY29zdDogODB9LFxuXG4gIFx0XHRcdF1cblxuICAgICAgICBcblxuICBcdFx0XHQkc2NvcGUuYWRkTmV3QmlsbCA9IGZ1bmN0aW9uKCl7XG4gIFx0XHRcdFx0JHNjb3BlLmJpbGxzLnB1c2goe25hbWU6ICRzY29wZS5uZXdCaWxsTmFtZSwgY29zdDogMCB9KVxuICBcdFx0XHRcdCRzY29wZS5uZXdCaWxsTmFtZSA9IFwiXCI7XG4gIFx0XHRcdH1cblxuICBcdFx0XHQkc2NvcGUucmVtb3ZlQmlsbEl0ZW0gPSBmdW5jdGlvbihpbmRleCl7XG4gIFx0XHRcdFx0JHNjb3BlLmJpbGxzLnNwbGljZShpbmRleCwxKTtcbiAgXHRcdFx0fVxuXG4gIFx0XHRcdC8vYnVkZ2V0IGl0ZW1zXG4gIFx0XHRcdCRzY29wZS5idWRnZXRJdGVtcyA9IFtdO1xuICBcdFx0XHQkc2NvcGUuYnVkZ2V0SXRlbXMgPSBbXG4gIFx0XHRcdFx0e25hbWU6IFwiZWF0IG91dFwiLCBidWRnZXQ6IDEwMCwgc3BlbnQ6IDMwIH0sXG4gIFx0XHRcdFx0e25hbWU6IFwiY2xvdGhpbmdcIiwgYnVkZ2V0OiAyMDAsIHNwZW50OiA5MH1cbiAgXHRcdFx0XVxuXG4gIFx0XHRcdCRzY29wZS5hZGROZXdCdWRnZXRJdGVtID0gZnVuY3Rpb24oKXtcbiAgXHRcdFx0XHQkc2NvcGUuYnVkZ2V0SXRlbXMucHVzaCh7bmFtZTogJHNjb3BlLm5ld0J1ZGdldEl0ZW1OYW1lLCBidWRnZXQ6IDAsIHNwZW50OiAwIH0pXG4gIFx0XHRcdFx0JHNjb3BlLm5ld0J1ZGdldEl0ZW1OYW1lID0gXCJcIjtcbiAgXHRcdFx0fVxuXG4gICAgICAgICRzY29wZS5wdXJjaGFzZXMgPSBbXVxuICAgICAgICAkc2NvcGUucHVyY2hhc2VzID0gW3tjYXRlZ29yeTogXCJlYXQgb3V0XCJ9XVxuXG4gICAgICAgICRzY29wZS5hZGRQdXJjaGFzZUl0ZW0gPSBmdW5jdGlvbigpe1xuXG4gICAgICAgIH1cblxuXG4gICAgICAgICRzY29wZS5tb250aGx5T3ZlcnZpZXcgPSB7fTtcbiAgICAgICAgJHNjb3BlLm1vbnRobHlPdmVydmlldy5iaWxsc1RvdGFsID0gMDtcbiAgICAgICAgJHNjb3BlLm1vbnRobHlPdmVydmlldy5idWRnZXRUb3RhbCA9IDA7XG4gICAgICAgICRzY29wZS5tb250aGx5T3ZlcnZpZXcuYnVkZ2V0U3BlbnRUb3RhbCA9IDA7XG4gICAgICAgICRzY29wZS5tb250aGx5T3ZlcnZpZXcudG90YWxFc3RpbWF0ZWRFeHBlbmRpdHVyZSA9IDA7XG5cbiAgICAgICAgXG4gICAgICAgICRzY29wZS5jYWxjdWxhdGVCaWxsc1RvdGFsID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIHRvdGFsID0gMDtcbiAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgJHNjb3BlLmJpbGxzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIHRvdGFsID0gdG90YWwgKyAkc2NvcGUuYmlsbHNbaV0uY29zdDtcbiAgICAgICAgICB9XG4gICAgICAgICAgJHNjb3BlLm1vbnRobHlPdmVydmlldy5iaWxsc1RvdGFsID0gdG90YWw7XG4gICAgICAgICAgJHNjb3BlLmNhbGN1bGF0ZVRvdGFsRXhwZW5kaXR1cmUoKVxuICAgICAgICAgIHJldHVybiB0b3RhbDtcbiAgICAgICAgfVxuXG4gICAgICAgIFxuXG4gICAgICAgICRzY29wZS5jYWxjdWxhdGVCdWRnZXRUb3RhbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciB0b3RhbCA9IDA7XG4gICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8ICRzY29wZS5idWRnZXRJdGVtcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICB0b3RhbCA9IHRvdGFsICsgJHNjb3BlLmJ1ZGdldEl0ZW1zW2ldLmJ1ZGdldDtcbiAgICAgICAgICB9XG4gICAgICAgICAgJHNjb3BlLm1vbnRobHlPdmVydmlldy5idWRnZXRUb3RhbCA9IHRvdGFsO1xuICAgICAgICAgICRzY29wZS5jYWxjdWxhdGVUb3RhbEV4cGVuZGl0dXJlKClcbiAgICAgICAgICByZXR1cm4gdG90YWw7ICAgICAgIFxuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLmNhbGN1bGF0ZUJ1ZGdldFNwZW50VG90YWwgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgdG90YWwgPSAwO1xuICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCAkc2NvcGUuYnVkZ2V0SXRlbXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgdG90YWwgPSB0b3RhbCArICRzY29wZS5idWRnZXRJdGVtc1tpXS5zcGVudDtcbiAgICAgICAgICB9XG4gICAgICAgICAgJHNjb3BlLm1vbnRobHlPdmVydmlldy5idWRnZXRTcGVudFRvdGFsID0gdG90YWw7XG4gICAgICAgICAgLy8kc2NvcGUuY2FsY3VsYXRlVG90YWxFeHBlbmRpdHVyZSgpXG4gICAgICAgICAgcmV0dXJuIHRvdGFsOyAgICAgICBcbiAgICAgICAgfVxuXG4gICAgICAgIFxuXG5cblxuICAgICAgICRzY29wZS4kd2F0Y2goXCJiaWxsc1wiLCAkc2NvcGUuY2FsY3VsYXRlQmlsbHNUb3RhbCwgdHJ1ZSlcbiAgICAgICAkc2NvcGUuJHdhdGNoKFwiYnVkZ2V0SXRlbXNcIiwgJHNjb3BlLmNhbGN1bGF0ZUJ1ZGdldFRvdGFsLCB0cnVlKVxuICAgICAgICRzY29wZS4kd2F0Y2goXCJidWRnZXRJdGVtc1wiLCAkc2NvcGUuY2FsY3VsYXRlQnVkZ2V0U3BlbnRUb3RhbCwgdHJ1ZSlcblxuICAgICAvLyAkc2NvcGUuJHdhdGNoKFwiYnVkZ2V0SXRlbXNcIiwgJHNjb3BlLmNhbGN1bGF0ZUJ1ZGdldFRvdGFsLCB0cnVlKVxuXG5cbiAgICAgICAgJHNjb3BlLmNhbGN1bGF0ZVRvdGFsRXhwZW5kaXR1cmUgPSBmdW5jdGlvbiAgKCkge1xuICAgICAgICAgICAgICRzY29wZS5tb250aGx5T3ZlcnZpZXcudG90YWxFc3RpbWF0ZWRFeHBlbmRpdHVyZSA9ICRzY29wZS5tb250aGx5T3ZlcnZpZXcuYmlsbHNUb3RhbCArICRzY29wZS5tb250aGx5T3ZlcnZpZXcuYnVkZ2V0VG90YWw7XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuY2FsY3VsYXRlQmlsbHNUb3RhbCgpO1xuICAgICAgICAkc2NvcGUuY2FsY3VsYXRlQnVkZ2V0VG90YWwoKTtcbiAgICAgICAgJHNjb3BlLmNhbGN1bGF0ZUJ1ZGdldFNwZW50VG90YWwoKTtcbiAgICAgICAgJHNjb3BlLmNhbGN1bGF0ZVRvdGFsRXhwZW5kaXR1cmUoKTtcblxuICAgICAgICAkc2NvcGUubGFiZWxzID0gW1wiQmlsbHNcIiwgXCJCdWRnZXRcIiwgXCJSZW1haW5pbmdcIl07XG4gICAgICAgICRzY29wZS5kYXRhID0gWyRzY29wZS5tb250aGx5T3ZlcnZpZXcuYmlsbHNUb3RhbCxcbiAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm1vbnRobHlPdmVydmlldy5idWRnZXRUb3RhbCxcbiAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmluY29tZS5tb250aGx5IC0gJHNjb3BlLm1vbnRobHlPdmVydmlldy50b3RhbEVzdGltYXRlZEV4cGVuZGl0dXJlXTtcblxuXG5cblxuXG5cdH1cblxufSkoKTtcblxuXG4iLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgnbm90ZXMnKVxuICAgIC5kaXJlY3RpdmUoJ25vdGVDYXJkJywgbm90ZUNhcmQpO1xuXG5mdW5jdGlvbiBub3RlQ2FyZCgpIHtcblx0cmV0dXJue1xuXHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0c2NvcGU6IHtcblx0XHRcdGRhdGE6IFwiPVwiLFxuXHRcdFx0ZHJhZ2dhYmxlOiBcIj1cIlxuXHRcdH0sXG5cdFx0cmVwbGFjZTogdHJ1ZSxcblx0XHR0ZW1wbGF0ZTogXCI8aDE+e3tkb2dzfX17e2RyYWdTdGF0dXN9fTwvaDE+XCIsXG5cdFx0bGluazogZnVuY3Rpb24oc2NvcGUsZWxlbWVudCl7XG5cdFx0XHRlbGVtZW50LmNsaWNrKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKGVsZW1lbnQpXG5cdFx0XHRcdGVsZW1lbnRbMF0uZHJhZ2dhYmxlID0gdHJ1ZTtcblx0XHRcdH0pXG5cdFx0fSxcblx0XHRjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpe1xuXHRcdFx0Ly9hbGVydChcImNvbnRyb2xsZXJcIik7XG5cdFx0XHQkc2NvcGUuZG9ncyA9ICRzY29wZS5kYXRhICsgXCJkb2dzXCI7XG5cdFx0XHRpZigkc2NvcGUuZHJhZ2dhYmxlKVxuXHRcdFx0XHQkc2NvcGUuZHJhZ1N0YXR1cyA9IGZhbHNlO1xuXHRcdFx0ZWxzZSAkc2NvcGUuZHJhZ1N0YXR1cyA9IHRydWU7XG5cblx0XHRcdFxuXHRcdH1cblx0fVxufVxuXG5cblxuLy8gYW5ndWxhclxuLy8gICAgIC5tb2R1bGUoJ25vdGVzJylcbi8vICAgICAuZGlyZWN0aXZlKCdub3RlQ2FyZCcsIG5vdGVDYXJkKTtcblxuLy8gZnVuY3Rpb24gbm90ZUNhcmQoKSB7XG4vLyBcdHJldHVybntcbi8vIFx0XHRyZXN0cmljdDogJ0UnLFxuLy8gXHRcdGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSl7XG4vLyBcdFx0XHRhbGVydChcImNvbnRyb2xsZXJcIik7XG4vLyBcdFx0XHRjb25zb2xlLmxvZygnZG9nJylcbi8vIFx0XHR9LFxuLy8gXHRcdHRlbXBsYXRlVXJsOiAnJyxcbi8vIFx0XHRyZXBsYWNlOiB0cnVlXG4vLyBcdFx0Ly8gc2NvcGU6IHt9XG4vLyBcdH1cbi8vIH0iLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgnbm90ZXMnKVxuICAgIC5kaXJlY3RpdmUoJ25vdGVDYXJkcycsIG5vdGVDYXJkcylcblxuXG4gICAgXG5cbmZ1bmN0aW9uIG5vdGVDYXJkcygpIHtcblx0cmV0dXJue1xuXHRcdHJlc3RyaWN0OiAnQUUnLFxuXHRcdHNjb3BlOiB7XG5cdFx0XHRub3RlczogXCI9XCIsXG5cdFx0XHRuZXdJdGVtOiBcIj1cIlxuXHRcdH0sXG5cdFx0cmVwbGFjZTogZmFsc2UsXG5cdFx0dHJhbnNjbHVkZTogZmFsc2UsXG5cdFx0dGVtcGxhdGVVcmw6IFwiY29tcG9uZW50cy9ub3Rlcy92aWV3cy9ub3RlLmRpcmVjdGl2ZS52aWV3Lmh0bWxcIixcblx0XHRsaW5rOiBmdW5jdGlvbihzY29wZSxlbGVtZW50LGF0dHJzKXtcblx0XHRcdC8vJCggXCIjc29ydGFibGVcIiApLnNvcnRhYmxlKCk7XG5cdFx0XHQvL2NvbnNvbGUubG9nKHNjb3BlKVxuXHRcdFx0Ly9jb25zb2xlLmxvZyhlbGVtZW50KVxuXHRcdFx0Ly9jb25zb2xlLmxvZyhhdHRycylcblx0XHRcdC8vZWxlbWVudC5zb3J0YWJsZSgpO1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhzY29wZS5ub3Rlcylcblx0XHRcdHNjb3BlLmRvZ3MgPSBmdW5jdGlvbihub3RlKXtcblx0XHRcdFx0Y29uc29sZS5sb2cobm90ZSlcblx0XHRcdH1cblxuXG5cdFx0XHRlbGVtZW50LnNvcnRhYmxlKHtcblx0XHQgICAgICAgLy8gcGxhY2Vob2xkZXI6IFwidWktc3RhdGUtaGlnaGxpZ2h0XCIsXG5cdFx0ICAgICAgICBzdGFydDogZnVuY3Rpb24oZXZlbnQsIHVpKSB7XG5cdFx0ICAgICAgICAgICAgdmFyIHN0YXJ0X3BvcyA9IHVpLml0ZW0uaW5kZXgoKTtcblx0XHQgICAgICAgICAgICB1aS5pdGVtLmRhdGEoJ3N0YXJ0X3BvcycsIHN0YXJ0X3Bvcyk7XG5cdFx0ICAgICAgICB9LFxuXHRcdCAgICAgICAgdXBkYXRlOiBmdW5jdGlvbihldmVudCwgdWkpIHtcblx0XHQgICAgICAgICAgICB2YXIgc3RhcnRfcG9zID0gdWkuaXRlbS5kYXRhKCdzdGFydF9wb3MnKTtcblx0XHQgICAgICAgICAgICB2YXIgZW5kX3BvcyA9IHVpLml0ZW0uaW5kZXgoKTtcblx0XHQgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHN0YXJ0X3BvcyArICcgLSAnICsgZW5kX3Bvcyk7XG5cdFx0ICAgICAgICAgIFxuXHRcdCAgICAgICAgICB2YXIgc3RhcnRJdGVtID0gc2NvcGUubm90ZXNbc3RhcnRfcG9zXTtcblx0XHQgICAgICAgICAgIHNjb3BlLm5vdGVzLnNwbGljZShzdGFydF9wb3MsMSlcblx0XHQgICAgICAgICAgIHNjb3BlLm5vdGVzLnNwbGljZShlbmRfcG9zLDAsIHN0YXJ0SXRlbSlcblx0XHQgICAgICAgICAgIHNjb3BlLiRhcHBseSgpO1xuXG5cdFx0ICAgICAgICAgICAvL2NvbnNvbGUubG9nKHNjb3BlLm5vdGVzKVxuXHRcdCAgICAgICAgICAgXG5cdFx0ICAgICAgICAgICBcblx0XHQgICAgICAgIH1cblx0XHQgICAgfSk7IC8vIGVuZCBzb3J0YWJsZVxuXG5cdFx0ICAgXG5cblx0XHQgICAgY29uc29sZS5sb2coZWxlbWVudClcblxuXG5cdFx0fSxcblx0XHRjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpe1xuXHRcdFx0JHNjb3BlLmZvcm0gPXt9XG5cdFx0XHQkc2NvcGUuYWRkSXRlbSA9IGZ1bmN0aW9uKGluZGV4LGl0ZW0pe1xuXHRcdFx0XHQvL2FsZXJ0KGluZGV4KVxuXHRcdFx0XHRjb25zb2xlLmxvZygkc2NvcGUubmV3SXRlbSlcblx0XHRcdFx0JHNjb3BlLm5vdGVzW2luZGV4XS5pdGVtcy5wdXNoKGl0ZW0pXG5cdFx0XHRcdCRzY29wZS5mb3JtID0ge31cblx0XHRcdFx0Ly9jb25zb2xlLmxvZygkc2NvcGUubm90ZXNbaW5kZXhdLml0ZW1zKVxuXHRcdFx0fVxuXG5cdFx0XHQkc2NvcGUuZGVsZXRlTm90ZSA9IGZ1bmN0aW9uKGluZGV4KXtcblx0XHRcdFx0JHNjb3BlLm5vdGVzLnNwbGljZShpbmRleCwxKTtcblx0XHRcdH1cblxuXG5cdFx0XHQvL2FsZXJ0KFwiY29udHJvbGxlclwiKTtcblx0XHRcdC8vICRzY29wZS5kb2dzID0gJHNjb3BlLmRhdGEgKyBcImRvZ3NcIjtcblx0XHRcdC8vIGlmKCRzY29wZS5kcmFnZ2FibGUpXG5cdFx0XHQvLyBcdCRzY29wZS5kcmFnU3RhdHVzID0gZmFsc2U7XG5cdFx0XHQvLyBlbHNlICRzY29wZS5kcmFnU3RhdHVzID0gdHJ1ZTtcblxuXHRcdFx0XG5cdFx0fVxuXHR9XG59IC8vZW5kIG5vdGVjYXJkcyBkaXJlY3RpdmVcblxuYW5ndWxhclxuXHQubW9kdWxlKCdub3RlcycpXG5cdC5kaXJlY3RpdmUoJ25vdGVDYXJkJywgbm90ZUNhcmQpXG5cbmZ1bmN0aW9uIG5vdGVDYXJkKCkge1xuXG5cdHZhciB0ZW1wRGF0YSA9IHt9O1xuXHR2YXIgdGVtcE5vdGUgPSBudWxsO1xuXG5cdHJldHVybntcblx0XHRyZXN0cmljdDogJ0FFJyxcblx0XHRzY29wZToge1xuXHRcdFx0bm90ZTogXCI9XCIsXG5cdFx0XHRub3RlczogXCI9XCJcblx0XHR9LFxuXHRcdHJlcGxhY2U6IHRydWUsXG5cdFx0dHJhbnNjbHVkZTogZmFsc2UsXG5cdFx0dGVtcGxhdGVVcmw6IFwiY29tcG9uZW50cy9ub3Rlcy92aWV3cy9ub3Rlcy5pdGVtcy52aWV3Lmh0bWxcIixcblx0XHRsaW5rOiBmdW5jdGlvbihzY29wZSxlbGVtZW50LGF0dHJzKXtcblx0XHRcdC8vJCggXCIjc29ydGFibGVcIiApLnNvcnRhYmxlKCk7XG5cdFx0XHQvL2NvbnNvbGUubG9nKHNjb3BlKVxuXHRcdFx0Ly9jb25zb2xlLmxvZyhlbGVtZW50KVxuXHRcdFx0Ly9jb25zb2xlLmxvZyhhdHRycylcblx0XHRcdC8vZWxlbWVudC5zb3J0YWJsZSgpO1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhzY29wZS5ub3Rlcylcblx0XHRcdC8vc2NvcGUuJHdhdGNoKCdub3RlcycsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIC8vIGFsbCB0aGUgY29kZSBoZXJlLi4uXG4gICAgXHRcdFxuICAgIFx0XHRcblx0XHRcdFxuXG5cdFx0XHRlbGVtZW50LnNvcnRhYmxlKHtcblx0XHRcdFx0Y29ubmVjdFdpdGg6IFwiLmNvbm5lY3RlZFNvcnRhYmxlXCIsXG5cdFx0ICAgICAgIC8vcGxhY2Vob2xkZXI6IFwidWktc3RhdGUtaGlnaGxpZ2h0XCIsXG5cdFx0ICAgICAgICBzdGFydDogZnVuY3Rpb24oZXZlbnQsIHVpKSB7XG5cdFx0ICAgICAgICBcdGNvbnNvbGUubG9nKFwiU1RBUlQgU1RBUlQgU1RBUlQgU1RBUlQgU1RBUlRcIilcblx0XHQgICAgICAgIFx0Y29uc29sZS5sb2coZWxlbWVudClcblx0XHQgICAgICAgIFx0Y29uc29sZS5sb2codGVtcERhdGEpXG5cdFx0ICAgICAgICBcdFxuXG5cdFx0ICAgICAgICBcdHRlbXBEYXRhLnN0YXJ0Tm90ZSA9IGFuZ3VsYXIuY29weShzY29wZS5ub3RlKTtcblx0XHQgICAgICAgIFx0dGVtcERhdGEuc3RhcnROb3RlSW5kZXggPSBhdHRycy5ub3RlaW5kZXg7XG5cdFx0XHRcdFx0dGVtcERhdGEuc3RhcnROb3RlSXRlbUluZGV4ID0gdWkuaXRlbS5pbmRleCgpO1xuXHRcdFx0XHRcdHRlbXBEYXRhLnN0YXJ0Tm90ZUl0ZW1Db250ZW50ID0gdGVtcERhdGEuc3RhcnROb3RlLml0ZW1zW3RlbXBEYXRhLnN0YXJ0Tm90ZUl0ZW1JbmRleF07XG5cdFx0ICAgXHRcdFx0XG5cdFx0ICAgXHRcdFx0dGVtcE5vdGUgPSBhbmd1bGFyLmNvcHkoc2NvcGUubm90ZSlcblx0XHQgICBcdFx0XHRjb25zb2xlLmxvZyh0ZW1wTm90ZSlcblxuXHRcdCAgICAgICAgfSxcblx0XHQgICAgICAgIHVwZGF0ZTogZnVuY3Rpb24oZXZlbnQsIHVpKSB7XG5cblx0XHQgICAgICAgLy8gY29uc29sZS5sb2coc2NvcGUudGVtcERhdGEpXHRcblx0ICAgICAgICAgXHRpZiAoIXVpLnNlbmRlcikge1x0XHQgICAgICAgXG5cdFx0XHQgICAgICAgICBjb25zb2xlLmxvZyhcIlVQREFURSBVUERBVEUgVVBEQVRFIFVQREFURSBVUERBVEUgSU5TSURFIElGXCIgKVxuXG5cdFx0XHQgICAgICAgIFxuXHRcdFx0XHRcdFx0XHRcdCAgICAgICAgIFxuXG5cdFx0XHRcdFx0dmFyIHN0YXJ0X3BvcyA9IHRlbXBEYXRhLnN0YXJ0Tm90ZUl0ZW1JbmRleDtcblx0XHRcdFx0XHR2YXIgZW5kX3BvcyA9IHVpLml0ZW0uaW5kZXgoKTtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhzdGFydF9wb3MgKyAnIC0gJyArIGVuZF9wb3MpO1xuXG5cdFx0XHRcdFx0dGVtcE5vdGUuaXRlbXMuc3BsaWNlKHN0YXJ0X3BvcywxKVxuXHRcdFx0XHRcdHRlbXBOb3RlLml0ZW1zLnNwbGljZShlbmRfcG9zLDAsIHRlbXBEYXRhLnN0YXJ0Tm90ZUl0ZW1Db250ZW50KVxuXHRcdFx0XHRcdC8vc2NvcGUubm90ZSA9IHRlbXBOb3RlXG5cdFx0XHRcdFx0c2NvcGUubm90ZXNbdGVtcERhdGEuc3RhcnROb3RlSW5kZXhdID0gdGVtcE5vdGU7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coc2NvcGUubm90ZXMpXG5cblx0XHRcdFx0XHR2YXIgcmFzdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMmFkc0Buaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJzMVwiLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImxhdW5zZHJ5XCIsIFwiYXBzcGx5IGpvYnNcIiwgXCJnc3ltXCIgXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIxLzEvMjIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjEvMjIvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvenNlLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICAgICAgfVxuXG5cdFx0XHRcdFx0Ly9zY29wZS5ub3Rlc1swXS5pdGVtcy5wdXNoKFwiUFVDS1NcIilcblxuXHRcdFx0XHRcdHNjb3BlLiRhcHBseSgpO1xuXG5cdFx0ICAgLy8gICAgICAgICAvL2NvbnNvbGUubG9nKHNjb3BlLm5vdGVzKVxuXHRcdFx0ICAgIH0gICBcblx0XHQgICAgICAgICAgIFxuXHRcdCAgICAgICAgfSwgLy9lbmQgdXBkYXRlXG5cdFx0ICAgICAgICByZWNlaXZlOiBmdW5jdGlvbihldmVudCwgdWkpe1xuXHRcdCAgICAgICAgXHRjb25zb2xlLmxvZyhcIlJFQ0VJVkUgUkVDRUlWRSBSRUNFSVZFIFJFQ0VJVkUgUkVDRUlWRVwiKVxuXHRcdCAgICAgICAgXHRjb25zb2xlLmxvZyh0ZW1wRGF0YSlcblxuXHRcdCAgICAgICAgXHR0ZW1wRGF0YS5lbmROb3RlID0gYW5ndWxhci5jb3B5KHNjb3BlLm5vdGUpO1xuXHRcdCAgICAgICAgXHR0ZW1wRGF0YS5lbmROb3RlSW5kZXggPSBhdHRycy5ub3RlaW5kZXg7XG5cdFx0XHRcdFx0dGVtcERhdGEuZW5kTm90ZUl0ZW1JbmRleCA9IHVpLml0ZW0uaW5kZXgoKTtcblxuXHRcdFx0XHRcdFxuXG5cdFx0XHRcdFx0ICAvL2NvbnNvbGUubG9nKFwicmVtb3ZpbmcgaXRlbTogXCIgKyBzY29wZS5ub3Rlc1tub3RlT3JpZ2luSW5kZXhdLml0ZW1zW3N0YXJ0X3Bvc10pO1xuXHRcdCAgICAgICAgICAgdGVtcERhdGEuc3RhcnROb3RlLml0ZW1zLnNwbGljZSh0ZW1wRGF0YS5zdGFydE5vdGVJdGVtSW5kZXgsMSlcblx0XHRcdCAgICAgICB0ZW1wRGF0YS5lbmROb3RlLml0ZW1zLnNwbGljZSh0ZW1wRGF0YS5lbmROb3RlSXRlbUluZGV4LDAsdGVtcERhdGEuc3RhcnROb3RlSXRlbUNvbnRlbnQpXG5cdFx0XHQgICAgICAgY29uc29sZS5sb2codGVtcERhdGEpXG5cblx0XHRcdCAgICAgICBzY29wZS5ub3Rlc1t0ZW1wRGF0YS5zdGFydE5vdGVJbmRleF0gPSB0ZW1wRGF0YS5zdGFydE5vdGU7XG5cdFx0XHQgICAgICAgc2NvcGUubm90ZXNbdGVtcERhdGEuZW5kTm90ZUluZGV4XSA9IHRlbXBEYXRhLmVuZE5vdGU7XG5cdCAgICAgICAgICAgXHRcblx0ICAgICAgICAgICBcdFx0Y29uc29sZS5sb2codGVtcERhdGEuc3RhcnROb3RlLml0ZW1zKVxuXHQgICAgICAgICAgIFx0XHRjb25zb2xlLmxvZyh0ZW1wRGF0YS5lbmROb3RlLml0ZW1zKVxuXG5cdFx0ICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiYWRkaW5nIGFmdGVyIHBvc2l0aW9uOiBcIiArIGVuZF9wb3MpXG5cdFx0ICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiYWRkaW5nIGFmdGVyOiBcIiArIHNjb3BlLm5vdGVzW25vdGVEZXN0aW5hdGlvbkluZGV4XS5pdGVtc1tlbmRfcG9zXSlcblx0XHQgICAgICAgICAgIC8vc2NvcGUubm90ZXNbbm90ZURlc3RpbmF0aW9uSW5kZXhdLml0ZW1zLnNwbGljZShlbmRfcG9zLDAsIHN0YXJ0SXRlbSlcblxuXHRcdCAgICAgICAgXHQvL3Njb3BlLnRlbXBEYXRhID0gXCJwcmF3bnNcIjtcblx0XHQgICAgICAgIFx0XG5cdFx0ICAgICAgICBcdFxuXHRcdCAgICAgICAgXHQvLyBjb25zb2xlLmxvZyh0ZW1wRGF0YSlcblx0XHQgICAgICAgIFx0Ly8gLy9jb25zb2xlLmxvZyhzY29wZS5ub3RlKTtcblx0XHQgICAgICAgIFx0dmFyIHJhc3QgPSB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJhZHNAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiczFcIixcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJsYXVuc2RyeVwiLCBcImFwc3BseSBqb2JzXCIsIFwiZ3N5bVwiIF0sXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMS8xLzIyMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIxLzIyLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3pzZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgICAgIH1cblx0XHQgICAgICAgIFx0XG5cdFx0ICAgICAgICAgICBzY29wZS4kYXBwbHkoKTtcblx0XHRcblxuXHRcdCAgICAgICAgfVxuXG5cdFx0ICAgIH0pOyAvLyBlbmQgc29ydGFibGVcblxuXHRcdCAvLyAgfSk7IC8vZW5kIHdhdGNoXG5cblxuXG5cdFx0fSxcblx0XHRjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpe1xuXG5cdFx0XHQkc2NvcGUubW9vc2UgPSBcImRpbmdcIlxuXHRcdFx0JHNjb3BlLmRlbGV0ZUl0ZW0gPSBmdW5jdGlvbihwYXJlbnRJbmRleCwgaW5kZXgpe1xuXHRcdFx0XHRjb25zb2xlLmxvZyhwYXJlbnRJbmRleClcblx0XHRcdFx0Y29uc29sZS5sb2coaW5kZXgpXG5cdFx0XHRcdCRzY29wZS5ub3Rlc1twYXJlbnRJbmRleF0uaXRlbXMuc3BsaWNlKGluZGV4LDEpXG5cblx0XHRcdH1cblxuXHRcdFx0JHNjb3BlLnJhbmRvbUlkID0gZnVuY3Rpb24oaXRlbSl7XG4gICBcdFx0XHQgcmV0dXJuIFwiSURcIiArIGl0ZW0gKyAoTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIDk5OSkgKyAxKSk7XG5cdFx0XHR9XG5cdFx0XHQvL2FsZXJ0KFwiY29udHJvbGxlclwiKTtcblx0XHRcdC8vICRzY29wZS5kb2dzID0gJHNjb3BlLmRhdGEgKyBcImRvZ3NcIjtcblx0XHRcdC8vIGlmKCRzY29wZS5kcmFnZ2FibGUpXG5cdFx0XHQvLyBcdCRzY29wZS5kcmFnU3RhdHVzID0gZmFsc2U7XG5cdFx0XHQvLyBlbHNlICRzY29wZS5kcmFnU3RhdHVzID0gdHJ1ZTtcblxuXHRcdFx0Y29uc29sZS5sb2coJHNjb3BlKVxuXG5cdFx0XHRcblx0XHR9XG5cdH1cbn0gLy9lbmQgbm90ZWNhcmQgZGlyZWN0aXZlXG5cblxuXG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cdCd1c2Ugc3RyaWN0J1xuXG5cdGFuZ3VsYXJcbiAgICBcdC5tb2R1bGUoJ2J1ZGdldCcpXG4gICAgXHQuZmFjdG9yeSgnYnVkZ2V0U2VydmljZScsIGJ1ZGdldFNlcnZpY2UpO1xuXG4gICAgYnVkZ2V0U2VydmljZS4kaW5qZWN0ID0gWyckaHR0cCddXG5cbiAgICBmdW5jdGlvbiBidWRnZXRTZXJ2aWNlKCRodHRwKSB7XG4gICAgXHR2YXIgc2VydmljZSA9IHtcblxuICAgICAgICAgICAgZ2V0Tm90ZTogZ2V0Tm90ZSxcbiAgICAgICAgICAgIGdldE5vdGVzOiBnZXROb3RlcyxcbiAgICAgICAgICAgIHNhdmVOb3Rlczogc2F2ZU5vdGVzXG5cblxuICAgIFx0fTtcblxuICAgIFx0cmV0dXJuIHNlcnZpY2U7XG5cbiAgICBcdC8vLy8vLy8vLy8vL1xuXG4gICAgICAgIC8vIGdldHMgYSBzaW5nbGUgbm90ZVxuICAgICAgICBmdW5jdGlvbiBnZXROb3RlICgpIHtcblxuICAgICAgICAgICAgdmFyIG5vdGUgPSB7XG4gICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMkBuaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgIHRpdGxlOiBcInRvZG9cIixcbiAgICAgICAgICAgICAgICBpdGVtczogWyBcImxhdW5kcnlcIiwgXCJhcHBseSBqb2JzXCIsIFwiZ3ltXCIgXSxcbiAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjEvMS8yMDE2XCIsXG4gICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjEvMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3plLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBub3RlO1xuXG4gICAgICAgIH0gLy9lbmQgZ2V0Tm90ZSgpXG5cblxuICAgICAgICAvLyBnZXRzIGFsbCBub3Rlc1xuICAgICAgICBmdW5jdGlvbiBnZXROb3RlcyAoKSB7XG5cbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGkvbm90ZXMvZ2V0Tm90ZXMnLHtlbWFpbDpcIm1vaXpAZ21haWwuY29tXCJ9KVxuICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBub3RlcyA9IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiMVwiLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImxhdW5kcnlcIiwgXCJhcHBseSBqb2JzXCIsIFwiZ3ltXCIgXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIxLzEvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMS8yLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3plLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiMlwiLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImh0bWw1IGRyYWcgYW5kIGRyb3BcIiwgXCJzb2NrZXQuaW9cIiwgXCJub2RlanNcIiBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjIvMS8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIyLzIvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvemUuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMkBuaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCIzXCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwiYm9zZSBoZWFkcGhvbmVzXCIsIFwiMjAxNiBob25kYSBncmlsbFwiLCBcInNvbGlkIHN0YXRlIGhhcmQgZHJpdmVcIiBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjEvMS8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIxLzIvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvemUuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMkBuaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCI0XCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwibGF1bmRyeVwiLCBcImFwcGx5IGpvYnNcIiwgXCJneW1cIiBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjEvMS8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIxLzIvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvemUuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMkBuaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCI1XCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwiaHRtbDUgZHJhZyBhbmQgZHJvcFwiLCBcInNvY2tldC5pb1wiLCBcIm5vZGVqc1wiIF0sXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMi8xLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjIvMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96ZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyQG5qaXQuZWR1XCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIjZcIixcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJib3NlIGhlYWRwaG9uZXNcIiwgXCIyMDE2IGhvbmRhIGdyaWxsXCIsIFwic29saWQgc3RhdGUgaGFyZCBkcml2ZVwiIF0sXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMS8xLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjEvMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96ZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyQG5qaXQuZWR1XCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIjdcIixcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJsYXVuZHJ5XCIsIFwiYXBwbHkgam9ic1wiLCBcImd5bVwiLFwiYm9zZSBoZWFkcGhvbmVzXCIsIFwiMjAxNiBob25kYSBncmlsbFwiLCBcInNvbGlkIHN0YXRlIGhhcmQgZHJpdmVcIiAgXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIxLzEvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMS8yLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3plLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiOFwiLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImh0bWw1IGRyYWcgYW5kIGRyb3BcIiwgXCJzb2NrZXQuaW9cIiwgXCJub2RlanNcIiBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjIvMS8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIyLzIvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvemUuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMkBuaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCI5XCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwiYm9zZSBoZWFkcGhvbmVzXCIsIFwiMjAxNiBob25kYSBncmlsbFwiLCBcInNvbGlkIHN0YXRlIGhhcmQgZHJpdmVcIixcImh0bWw1IGRyYWcgYW5kIGRyb3BcIiwgXCJzb2NrZXQuaW9cIiwgXCJub2RlanNcIiAgXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIxLzEvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMS8yLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3plLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXSAvL2VuZCBub3RlcyBhcnJheVxuXG4gICAgICAgICAgICAvL3JldHVybiBub3Rlc1xuICAgICAgICB9IC8vZW5kIGdldCBub3Rlc1xuXG4gICAgICAgIGZ1bmN0aW9uIHNhdmVOb3Rlcyhub3Rlcykge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGkvbm90ZXMvdXBkYXRlTm90ZXMnLHtlbWFpbDpcIm1vaXpAZ21haWwuY29tXCIsbm90ZXM6IG5vdGVzfSlcbiAgICAgICAgfVxuXG5cblxuICAgIH1cblxuXHRcblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0J3VzZSBzdHJpY3QnXG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ21lbWJlcnMnKVxuXHRcdC5jb250cm9sbGVyKCdtZW1iZXJzQ3RybCcsIG1lbWJlcnNDdHJsKVxuXG5cdG1lbWJlcnNDdHJsLiRpbmplY3QgPSBbJyRodHRwJ11cblxuXHRmdW5jdGlvbiBtZW1iZXJzQ3RybCgkaHR0cCkge1xuXG5cdCAgICB2YXIgdm0gPSB0aGlzO1xuXG5cdCAgICB2bS5tZW1iZXJzQ29udGVudCA9IG1lbWJlcnNDb250ZW50KCk7XG5cdCAgICB2bS5nb3RvU2Vzc2lvbiA9IGdvdG9TZXNzaW9uO1xuXHQgICAgdm0ucmVmcmVzaCA9IHJlZnJlc2g7XG5cdCAgICB2bS5zZWFyY2ggPSBzZWFyY2g7XG5cdCAgICB2bS5zZXNzaW9ucyA9IFtdO1xuXHQgICAgdm0udGl0bGUgPSAnbWVtYmVycyc7XG5cblx0ICAgIC8vLy8vLy8vLy8vL1xuXG5cdCAgICBmdW5jdGlvbiBtZW1iZXJzQ29udGVudCgpe1xuXHQgICAgXHQgLy8gJGh0dHAuZ2V0KCdodHRwOi8vbG9jYWxob3N0OjMwMDAvYXBpL3VzZXJzL2FsbCcpXG5cdCAgICBcdFx0Ly8gLnRoZW4oZnVuY3Rpb24ocmVzKXtcblx0ICAgIFx0XHQvLyBcdGNvbnNvbGUubG9nKHJlcy5kYXRhKVxuXHQgICAgXHRcdC8vIFx0dm0ubWVtYmVyc0NvbnRlbnQgPSByZXMuZGF0YTtcblx0ICAgIFx0XHQvLyB9LFxuXHQgICAgXHRcdC8vIGZ1bmN0aW9uKGVycil7XG5cdCAgICBcdFx0Ly8gXHRjb25zb2xlLmxvZyhlcnIuc3RhdHVzICsgXCIgXCIgKyBlcnIuc3RhdHVzVGV4dCk7XG5cdCAgICBcdFx0Ly8gXHR2bS5tZW1iZXJzQ29udGVudCA9IGVyci5kYXRhO1xuXHQgICAgXHRcdC8vIH0pXG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIGdvdG9TZXNzaW9uKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiByZWZyZXNoKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBzZWFyY2goKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cdH1cblxufSkoKTtcblxuXG4iLCIoZnVuY3Rpb24oKXtcblx0J3VzZSBzdHJpY3QnXG5cblx0YW5ndWxhclxuICAgIFx0Lm1vZHVsZSgnc2FtcGxlJylcbiAgICBcdC5mYWN0b3J5KCdzYW1wbGVTZXJ2aWNlJywgc2FtcGxlU2VydmljZSk7XG5cbiAgIC8vIHNhbXBsZVNlcnZpY2UuaW5qZWN0ID0gWycnXVxuXG4gICAgZnVuY3Rpb24gc2FtcGxlU2VydmljZSgpIHtcbiAgICBcdHZhciBzZXJ2aWNlID0ge1xuXG4gICAgXHRcdGVycm9yOiBlcnJvcixcbiAgICBcdFx0aW5mbzogaW5mbyxcbiAgICBcdFx0c3VjY2Vzczogc3VjY2Vzc1xuXG4gICAgXHR9O1xuXG4gICAgXHRyZXR1cm4gc2VydmljZTtcblxuICAgIFx0Ly8vLy8vLy8vLy8vXG5cbiAgICBcdGZ1bmN0aW9uIGVycm9yKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBpbmZvKCkge1xuXHQgICAgICAvKiAqL1xuICAgICAgICAgIC8vY29uc29sZS5sb2coXCJzYW1wbGVTZXJ2aWNlXCIpO1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBzdWNjZXNzKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXG5cbiAgICB9XG5cblx0XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0J1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCdub3RlcycpXG5cdFx0LmNvbnRyb2xsZXIoJ25vdGVzQ3RybCcsIG5vdGVzQ3RybClcblxuXHRub3Rlc0N0cmwuJGluamVjdCA9IFsnbm90ZXNTZXJ2aWNlJywnJHNjb3BlJywnJGh0dHAnLCd0b2FzdHInXVxuXG5cdGZ1bmN0aW9uIG5vdGVzQ3RybChub3Rlc1NlcnZpY2UsJHNjb3BlLCAkaHR0cCwgdG9hc3RyKSB7XG5cblx0XHRjb25zb2xlLmxvZyhcIm5vdGVzIGN0cmxcIik7XG5cblx0XHQvL2NvbnNvbGUubG9nKCBub3Rlc1NlcnZpY2UuZ2V0Tm90ZXMoKSApXG5cdFx0XG5cdCAgICB2YXIgdm0gPSB0aGlzO1xuXG5cdCAgIC8vIHZtLm5vdGVzID0gbm90ZXNTZXJ2aWNlLmdldE5vdGVzKCk7XG5cdCAgIHZtLm5vdGVzID0gbm90ZXNTZXJ2aWNlLmdldE5vdGVzKCkudGhlbihmdW5jdGlvbihyZXMpe1xuICAgICAgICAgICAgICAgdm0ubm90ZXMgPSByZXMuZGF0YS5ub3Rlcy5ub3Rlc1xuICAgICAgICAgICAgfSlcblxuXHQgICB2bS5zYXZlTm90ZXMgPSBmdW5jdGlvbigpe1xuXHQgICBcdG5vdGVzU2VydmljZS5zYXZlTm90ZXModm0ubm90ZXMpLnRoZW4oZnVuY3Rpb24ocmVzKXtcbiAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcylcbiAgICAgICAgICAgICAgIGlmKHJlcy5kYXRhLnN1Y2Nlc3MgPT0gdHJ1ZSl7XG4gICAgICAgICAgICAgICBcdHRvYXN0ci5zdWNjZXNzKFwiTm90ZXMgU2F2ZWRcIilcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICBcdHRvYXN0ci5lcnJvcihcInNvcnJ5IG5vdGVzIG5vdCBzYXZlZFwiKVxuICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcblx0ICAgfVxuXHQgICAgLy9jb25zb2xlLmxvZyh2bS5ub3Rlc1swXS5pdGVtc1swXSlcblxuXHQgICAgdm0uZ2V0Tm90ZXNMaXN0ID0gZnVuY3Rpb24oKXtcblx0ICAgIFx0XG5cdCAgICBcdC8vJHNjb3BlLiRhcHBseSgpO1xuXHQgICAgXHRjb25zb2xlLmxvZyhcImZyb20gY29udHJvbGxlclwiKVxuXHQgICAgXHRjb25zb2xlLmxvZygkc2NvcGUubm90ZXMpXG5cdCAgICBcdFxuXHQgICAgfVxuXG5cdCAgICB2bS5yZWZyZXNoQm9hcmQgPSBmdW5jdGlvbigpe1xuXHQgICAgXHQkc2NvcGUuJGFwcGx5KCk7XG5cdCAgICBcdGNvbnNvbGUubG9nKFwiUkVGUkVTSElORy4uLi4uLi4uLi4uLi5cIilcblx0ICAgIH1cblxuXHQgICAgdm0ubmV3Tm90ZSA9IHt9XG5cdCAgICB2bS5uZXdOb3RlLnRpdGxlID0gbnVsbDtcblx0ICAgIHZtLm5ld05vdGUuaXRlbXMgPSBbXVxuXHQgICAgdm0uYWRkTm90ZSA9IGZ1bmN0aW9uKCl7XG5cdCAgICBcdHZhciBuZXdOb3RlQ29weSA9IGFuZ3VsYXIuY29weSh2bS5uZXdOb3RlKTtcblx0ICAgIFx0dm0ubmV3Tm90ZS50aXRsZSA9IFwiXCI7XG5cdCAgICBcdHZtLm5vdGVzLnB1c2gobmV3Tm90ZUNvcHkpXG5cdCAgICB9XG5cblxuXHQgICAgXG5cblx0ICAgIHZtLmdvdG9TZXNzaW9uID0gZ290b1Nlc3Npb247XG5cdCAgICB2bS5yZWZyZXNoID0gcmVmcmVzaDtcblx0ICAgIHZtLnNlYXJjaCA9IHNlYXJjaDtcblx0ICAgIHZtLnNlc3Npb25zID0gW107XG5cdCAgICB2bS50aXRsZSA9ICdub3Rlcyc7XG5cblx0ICAgIHZtLmFsZXJ0TGlzdCA9IGZ1bmN0aW9uKCl7XG5cdCAgICBcdHZtLmxpc3QgPSBbXVxuXHQgICAgXHRhbmd1bGFyLmZvckVhY2godm0ubm90ZXMsIGZ1bmN0aW9uKG5vdGUpIHtcblx0XHRcdCAgLy9jb25zb2xlLmxvZyhub3RlLnRpdGxlKTtcblx0XHRcdCAgdm0ubGlzdC5wdXNoKG5vdGUudGl0bGUpXG5cdFx0XHR9KTtcblx0XHRcdGNvbnNvbGUubG9nKHZtLmxpc3QpXG5cdCAgICB9XG5cblxuXG5cdCAgICAvLy8vLy8vLy8vLy9cblxuXHQgICAgZnVuY3Rpb24gZ290b1Nlc3Npb24oKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIHJlZnJlc2goKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIHNlYXJjaCgpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblx0fVxuXG59KSgpO1xuXG5cbiIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdub3RlcycpXG4gICAgLmRpcmVjdGl2ZSgnbm90ZUNhcmQnLCBub3RlQ2FyZCk7XG5cbmZ1bmN0aW9uIG5vdGVDYXJkKCkge1xuXHRyZXR1cm57XG5cdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRzY29wZToge1xuXHRcdFx0ZGF0YTogXCI9XCIsXG5cdFx0XHRkcmFnZ2FibGU6IFwiPVwiXG5cdFx0fSxcblx0XHRyZXBsYWNlOiB0cnVlLFxuXHRcdHRlbXBsYXRlOiBcIjxoMT57e2RvZ3N9fXt7ZHJhZ1N0YXR1c319PC9oMT5cIixcblx0XHRsaW5rOiBmdW5jdGlvbihzY29wZSxlbGVtZW50KXtcblx0XHRcdGVsZW1lbnQuY2xpY2soZnVuY3Rpb24oKXtcblx0XHRcdFx0Y29uc29sZS5sb2coZWxlbWVudClcblx0XHRcdFx0ZWxlbWVudFswXS5kcmFnZ2FibGUgPSB0cnVlO1xuXHRcdFx0fSlcblx0XHR9LFxuXHRcdGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSl7XG5cdFx0XHQvL2FsZXJ0KFwiY29udHJvbGxlclwiKTtcblx0XHRcdCRzY29wZS5kb2dzID0gJHNjb3BlLmRhdGEgKyBcImRvZ3NcIjtcblx0XHRcdGlmKCRzY29wZS5kcmFnZ2FibGUpXG5cdFx0XHRcdCRzY29wZS5kcmFnU3RhdHVzID0gZmFsc2U7XG5cdFx0XHRlbHNlICRzY29wZS5kcmFnU3RhdHVzID0gdHJ1ZTtcblxuXHRcdFx0XG5cdFx0fVxuXHR9XG59XG5cblxuXG4vLyBhbmd1bGFyXG4vLyAgICAgLm1vZHVsZSgnbm90ZXMnKVxuLy8gICAgIC5kaXJlY3RpdmUoJ25vdGVDYXJkJywgbm90ZUNhcmQpO1xuXG4vLyBmdW5jdGlvbiBub3RlQ2FyZCgpIHtcbi8vIFx0cmV0dXJue1xuLy8gXHRcdHJlc3RyaWN0OiAnRScsXG4vLyBcdFx0Y29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKXtcbi8vIFx0XHRcdGFsZXJ0KFwiY29udHJvbGxlclwiKTtcbi8vIFx0XHRcdGNvbnNvbGUubG9nKCdkb2cnKVxuLy8gXHRcdH0sXG4vLyBcdFx0dGVtcGxhdGVVcmw6ICcnLFxuLy8gXHRcdHJlcGxhY2U6IHRydWVcbi8vIFx0XHQvLyBzY29wZToge31cbi8vIFx0fVxuLy8gfSIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdub3RlcycpXG4gICAgLmRpcmVjdGl2ZSgnbm90ZUNhcmRzJywgbm90ZUNhcmRzKVxuXG5cbiAgICBcblxuZnVuY3Rpb24gbm90ZUNhcmRzKCkge1xuXHRyZXR1cm57XG5cdFx0cmVzdHJpY3Q6ICdBRScsXG5cdFx0c2NvcGU6IHtcblx0XHRcdG5vdGVzOiBcIj1cIixcblx0XHRcdG5ld0l0ZW06IFwiPVwiXG5cdFx0fSxcblx0XHRyZXBsYWNlOiBmYWxzZSxcblx0XHR0cmFuc2NsdWRlOiBmYWxzZSxcblx0XHR0ZW1wbGF0ZVVybDogXCJjb21wb25lbnRzL25vdGVzL3ZpZXdzL25vdGUuZGlyZWN0aXZlLnZpZXcuaHRtbFwiLFxuXHRcdGxpbms6IGZ1bmN0aW9uKHNjb3BlLGVsZW1lbnQsYXR0cnMpe1xuXHRcdFx0Ly8kKCBcIiNzb3J0YWJsZVwiICkuc29ydGFibGUoKTtcblx0XHRcdC8vY29uc29sZS5sb2coc2NvcGUpXG5cdFx0XHQvL2NvbnNvbGUubG9nKGVsZW1lbnQpXG5cdFx0XHQvL2NvbnNvbGUubG9nKGF0dHJzKVxuXHRcdFx0Ly9lbGVtZW50LnNvcnRhYmxlKCk7XG5cdFx0XHQvL2NvbnNvbGUubG9nKHNjb3BlLm5vdGVzKVxuXHRcdFx0c2NvcGUuZG9ncyA9IGZ1bmN0aW9uKG5vdGUpe1xuXHRcdFx0XHRjb25zb2xlLmxvZyhub3RlKVxuXHRcdFx0fVxuXG5cblx0XHRcdGVsZW1lbnQuc29ydGFibGUoe1xuXHRcdCAgICAgICAvLyBwbGFjZWhvbGRlcjogXCJ1aS1zdGF0ZS1oaWdobGlnaHRcIixcblx0XHQgICAgICAgIHN0YXJ0OiBmdW5jdGlvbihldmVudCwgdWkpIHtcblx0XHQgICAgICAgICAgICB2YXIgc3RhcnRfcG9zID0gdWkuaXRlbS5pbmRleCgpO1xuXHRcdCAgICAgICAgICAgIHVpLml0ZW0uZGF0YSgnc3RhcnRfcG9zJywgc3RhcnRfcG9zKTtcblx0XHQgICAgICAgIH0sXG5cdFx0ICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uKGV2ZW50LCB1aSkge1xuXHRcdCAgICAgICAgICAgIHZhciBzdGFydF9wb3MgPSB1aS5pdGVtLmRhdGEoJ3N0YXJ0X3BvcycpO1xuXHRcdCAgICAgICAgICAgIHZhciBlbmRfcG9zID0gdWkuaXRlbS5pbmRleCgpO1xuXHRcdCAgICAgICAgICAgIC8vY29uc29sZS5sb2coc3RhcnRfcG9zICsgJyAtICcgKyBlbmRfcG9zKTtcblx0XHQgICAgICAgICAgXG5cdFx0ICAgICAgICAgIHZhciBzdGFydEl0ZW0gPSBzY29wZS5ub3Rlc1tzdGFydF9wb3NdO1xuXHRcdCAgICAgICAgICAgc2NvcGUubm90ZXMuc3BsaWNlKHN0YXJ0X3BvcywxKVxuXHRcdCAgICAgICAgICAgc2NvcGUubm90ZXMuc3BsaWNlKGVuZF9wb3MsMCwgc3RhcnRJdGVtKVxuXHRcdCAgICAgICAgICAgc2NvcGUuJGFwcGx5KCk7XG5cblx0XHQgICAgICAgICAgIC8vY29uc29sZS5sb2coc2NvcGUubm90ZXMpXG5cdFx0ICAgICAgICAgICBcblx0XHQgICAgICAgICAgIFxuXHRcdCAgICAgICAgfVxuXHRcdCAgICB9KTsgLy8gZW5kIHNvcnRhYmxlXG5cblx0XHQgICBcblxuXHRcdCAgICBjb25zb2xlLmxvZyhlbGVtZW50KVxuXG5cblx0XHR9LFxuXHRcdGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSl7XG5cdFx0XHQkc2NvcGUuZm9ybSA9e31cblx0XHRcdCRzY29wZS5hZGRJdGVtID0gZnVuY3Rpb24oaW5kZXgsaXRlbSl7XG5cdFx0XHRcdC8vYWxlcnQoaW5kZXgpXG5cdFx0XHRcdGNvbnNvbGUubG9nKCRzY29wZS5uZXdJdGVtKVxuXHRcdFx0XHQkc2NvcGUubm90ZXNbaW5kZXhdLml0ZW1zLnB1c2goaXRlbSlcblx0XHRcdFx0JHNjb3BlLmZvcm0gPSB7fVxuXHRcdFx0XHQvL2NvbnNvbGUubG9nKCRzY29wZS5ub3Rlc1tpbmRleF0uaXRlbXMpXG5cdFx0XHR9XG5cblx0XHRcdCRzY29wZS5kZWxldGVOb3RlID0gZnVuY3Rpb24oaW5kZXgpe1xuXHRcdFx0XHQkc2NvcGUubm90ZXMuc3BsaWNlKGluZGV4LDEpO1xuXHRcdFx0fVxuXG5cblx0XHRcdC8vYWxlcnQoXCJjb250cm9sbGVyXCIpO1xuXHRcdFx0Ly8gJHNjb3BlLmRvZ3MgPSAkc2NvcGUuZGF0YSArIFwiZG9nc1wiO1xuXHRcdFx0Ly8gaWYoJHNjb3BlLmRyYWdnYWJsZSlcblx0XHRcdC8vIFx0JHNjb3BlLmRyYWdTdGF0dXMgPSBmYWxzZTtcblx0XHRcdC8vIGVsc2UgJHNjb3BlLmRyYWdTdGF0dXMgPSB0cnVlO1xuXG5cdFx0XHRcblx0XHR9XG5cdH1cbn0gLy9lbmQgbm90ZWNhcmRzIGRpcmVjdGl2ZVxuXG5hbmd1bGFyXG5cdC5tb2R1bGUoJ25vdGVzJylcblx0LmRpcmVjdGl2ZSgnbm90ZUNhcmQnLCBub3RlQ2FyZClcblxuZnVuY3Rpb24gbm90ZUNhcmQoKSB7XG5cblx0dmFyIHRlbXBEYXRhID0ge307XG5cdHZhciB0ZW1wTm90ZSA9IG51bGw7XG5cblx0cmV0dXJue1xuXHRcdHJlc3RyaWN0OiAnQUUnLFxuXHRcdHNjb3BlOiB7XG5cdFx0XHRub3RlOiBcIj1cIixcblx0XHRcdG5vdGVzOiBcIj1cIlxuXHRcdH0sXG5cdFx0cmVwbGFjZTogdHJ1ZSxcblx0XHR0cmFuc2NsdWRlOiBmYWxzZSxcblx0XHR0ZW1wbGF0ZVVybDogXCJjb21wb25lbnRzL25vdGVzL3ZpZXdzL25vdGVzLml0ZW1zLnZpZXcuaHRtbFwiLFxuXHRcdGxpbms6IGZ1bmN0aW9uKHNjb3BlLGVsZW1lbnQsYXR0cnMpe1xuXHRcdFx0Ly8kKCBcIiNzb3J0YWJsZVwiICkuc29ydGFibGUoKTtcblx0XHRcdC8vY29uc29sZS5sb2coc2NvcGUpXG5cdFx0XHQvL2NvbnNvbGUubG9nKGVsZW1lbnQpXG5cdFx0XHQvL2NvbnNvbGUubG9nKGF0dHJzKVxuXHRcdFx0Ly9lbGVtZW50LnNvcnRhYmxlKCk7XG5cdFx0XHQvL2NvbnNvbGUubG9nKHNjb3BlLm5vdGVzKVxuXHRcdFx0Ly9zY29wZS4kd2F0Y2goJ25vdGVzJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgLy8gYWxsIHRoZSBjb2RlIGhlcmUuLi5cbiAgICBcdFx0XG4gICAgXHRcdFxuXHRcdFx0XG5cblx0XHRcdGVsZW1lbnQuc29ydGFibGUoe1xuXHRcdFx0XHRjb25uZWN0V2l0aDogXCIuY29ubmVjdGVkU29ydGFibGVcIixcblx0XHQgICAgICAgLy9wbGFjZWhvbGRlcjogXCJ1aS1zdGF0ZS1oaWdobGlnaHRcIixcblx0XHQgICAgICAgIHN0YXJ0OiBmdW5jdGlvbihldmVudCwgdWkpIHtcblx0XHQgICAgICAgIFx0Y29uc29sZS5sb2coXCJTVEFSVCBTVEFSVCBTVEFSVCBTVEFSVCBTVEFSVFwiKVxuXHRcdCAgICAgICAgXHRjb25zb2xlLmxvZyhlbGVtZW50KVxuXHRcdCAgICAgICAgXHRjb25zb2xlLmxvZyh0ZW1wRGF0YSlcblx0XHQgICAgICAgIFx0XG5cblx0XHQgICAgICAgIFx0dGVtcERhdGEuc3RhcnROb3RlID0gYW5ndWxhci5jb3B5KHNjb3BlLm5vdGUpO1xuXHRcdCAgICAgICAgXHR0ZW1wRGF0YS5zdGFydE5vdGVJbmRleCA9IGF0dHJzLm5vdGVpbmRleDtcblx0XHRcdFx0XHR0ZW1wRGF0YS5zdGFydE5vdGVJdGVtSW5kZXggPSB1aS5pdGVtLmluZGV4KCk7XG5cdFx0XHRcdFx0dGVtcERhdGEuc3RhcnROb3RlSXRlbUNvbnRlbnQgPSB0ZW1wRGF0YS5zdGFydE5vdGUuaXRlbXNbdGVtcERhdGEuc3RhcnROb3RlSXRlbUluZGV4XTtcblx0XHQgICBcdFx0XHRcblx0XHQgICBcdFx0XHR0ZW1wTm90ZSA9IGFuZ3VsYXIuY29weShzY29wZS5ub3RlKVxuXHRcdCAgIFx0XHRcdGNvbnNvbGUubG9nKHRlbXBOb3RlKVxuXG5cdFx0ICAgICAgICB9LFxuXHRcdCAgICAgICAgdXBkYXRlOiBmdW5jdGlvbihldmVudCwgdWkpIHtcblxuXHRcdCAgICAgICAvLyBjb25zb2xlLmxvZyhzY29wZS50ZW1wRGF0YSlcdFxuXHQgICAgICAgICBcdGlmICghdWkuc2VuZGVyKSB7XHRcdCAgICAgICBcblx0XHRcdCAgICAgICAgIGNvbnNvbGUubG9nKFwiVVBEQVRFIFVQREFURSBVUERBVEUgVVBEQVRFIFVQREFURSBJTlNJREUgSUZcIiApXG5cblx0XHRcdCAgICAgICAgXG5cdFx0XHRcdFx0XHRcdFx0ICAgICAgICAgXG5cblx0XHRcdFx0XHR2YXIgc3RhcnRfcG9zID0gdGVtcERhdGEuc3RhcnROb3RlSXRlbUluZGV4O1xuXHRcdFx0XHRcdHZhciBlbmRfcG9zID0gdWkuaXRlbS5pbmRleCgpO1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKHN0YXJ0X3BvcyArICcgLSAnICsgZW5kX3Bvcyk7XG5cblx0XHRcdFx0XHR0ZW1wTm90ZS5pdGVtcy5zcGxpY2Uoc3RhcnRfcG9zLDEpXG5cdFx0XHRcdFx0dGVtcE5vdGUuaXRlbXMuc3BsaWNlKGVuZF9wb3MsMCwgdGVtcERhdGEuc3RhcnROb3RlSXRlbUNvbnRlbnQpXG5cdFx0XHRcdFx0Ly9zY29wZS5ub3RlID0gdGVtcE5vdGVcblx0XHRcdFx0XHRzY29wZS5ub3Rlc1t0ZW1wRGF0YS5zdGFydE5vdGVJbmRleF0gPSB0ZW1wTm90ZTtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhzY29wZS5ub3RlcylcblxuXHRcdFx0XHRcdHZhciByYXN0ID0ge1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyYWRzQG5qaXQuZWR1XCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcInMxXCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwibGF1bnNkcnlcIiwgXCJhcHNwbHkgam9ic1wiLCBcImdzeW1cIiBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjEvMS8yMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMS8yMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96c2UuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9XG5cblx0XHRcdFx0XHQvL3Njb3BlLm5vdGVzWzBdLml0ZW1zLnB1c2goXCJQVUNLU1wiKVxuXG5cdFx0XHRcdFx0c2NvcGUuJGFwcGx5KCk7XG5cblx0XHQgICAvLyAgICAgICAgIC8vY29uc29sZS5sb2coc2NvcGUubm90ZXMpXG5cdFx0XHQgICAgfSAgIFxuXHRcdCAgICAgICAgICAgXG5cdFx0ICAgICAgICB9LCAvL2VuZCB1cGRhdGVcblx0XHQgICAgICAgIHJlY2VpdmU6IGZ1bmN0aW9uKGV2ZW50LCB1aSl7XG5cdFx0ICAgICAgICBcdGNvbnNvbGUubG9nKFwiUkVDRUlWRSBSRUNFSVZFIFJFQ0VJVkUgUkVDRUlWRSBSRUNFSVZFXCIpXG5cdFx0ICAgICAgICBcdGNvbnNvbGUubG9nKHRlbXBEYXRhKVxuXG5cdFx0ICAgICAgICBcdHRlbXBEYXRhLmVuZE5vdGUgPSBhbmd1bGFyLmNvcHkoc2NvcGUubm90ZSk7XG5cdFx0ICAgICAgICBcdHRlbXBEYXRhLmVuZE5vdGVJbmRleCA9IGF0dHJzLm5vdGVpbmRleDtcblx0XHRcdFx0XHR0ZW1wRGF0YS5lbmROb3RlSXRlbUluZGV4ID0gdWkuaXRlbS5pbmRleCgpO1xuXG5cdFx0XHRcdFx0XG5cblx0XHRcdFx0XHQgIC8vY29uc29sZS5sb2coXCJyZW1vdmluZyBpdGVtOiBcIiArIHNjb3BlLm5vdGVzW25vdGVPcmlnaW5JbmRleF0uaXRlbXNbc3RhcnRfcG9zXSk7XG5cdFx0ICAgICAgICAgICB0ZW1wRGF0YS5zdGFydE5vdGUuaXRlbXMuc3BsaWNlKHRlbXBEYXRhLnN0YXJ0Tm90ZUl0ZW1JbmRleCwxKVxuXHRcdFx0ICAgICAgIHRlbXBEYXRhLmVuZE5vdGUuaXRlbXMuc3BsaWNlKHRlbXBEYXRhLmVuZE5vdGVJdGVtSW5kZXgsMCx0ZW1wRGF0YS5zdGFydE5vdGVJdGVtQ29udGVudClcblx0XHRcdCAgICAgICBjb25zb2xlLmxvZyh0ZW1wRGF0YSlcblxuXHRcdFx0ICAgICAgIHNjb3BlLm5vdGVzW3RlbXBEYXRhLnN0YXJ0Tm90ZUluZGV4XSA9IHRlbXBEYXRhLnN0YXJ0Tm90ZTtcblx0XHRcdCAgICAgICBzY29wZS5ub3Rlc1t0ZW1wRGF0YS5lbmROb3RlSW5kZXhdID0gdGVtcERhdGEuZW5kTm90ZTtcblx0ICAgICAgICAgICBcdFxuXHQgICAgICAgICAgIFx0XHRjb25zb2xlLmxvZyh0ZW1wRGF0YS5zdGFydE5vdGUuaXRlbXMpXG5cdCAgICAgICAgICAgXHRcdGNvbnNvbGUubG9nKHRlbXBEYXRhLmVuZE5vdGUuaXRlbXMpXG5cblx0XHQgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJhZGRpbmcgYWZ0ZXIgcG9zaXRpb246IFwiICsgZW5kX3Bvcylcblx0XHQgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJhZGRpbmcgYWZ0ZXI6IFwiICsgc2NvcGUubm90ZXNbbm90ZURlc3RpbmF0aW9uSW5kZXhdLml0ZW1zW2VuZF9wb3NdKVxuXHRcdCAgICAgICAgICAgLy9zY29wZS5ub3Rlc1tub3RlRGVzdGluYXRpb25JbmRleF0uaXRlbXMuc3BsaWNlKGVuZF9wb3MsMCwgc3RhcnRJdGVtKVxuXG5cdFx0ICAgICAgICBcdC8vc2NvcGUudGVtcERhdGEgPSBcInByYXduc1wiO1xuXHRcdCAgICAgICAgXHRcblx0XHQgICAgICAgIFx0XG5cdFx0ICAgICAgICBcdC8vIGNvbnNvbGUubG9nKHRlbXBEYXRhKVxuXHRcdCAgICAgICAgXHQvLyAvL2NvbnNvbGUubG9nKHNjb3BlLm5vdGUpO1xuXHRcdCAgICAgICAgXHR2YXIgcmFzdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMmFkc0Buaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJzMVwiLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImxhdW5zZHJ5XCIsIFwiYXBzcGx5IGpvYnNcIiwgXCJnc3ltXCIgXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIxLzEvMjIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjEvMjIvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvenNlLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICAgICAgfVxuXHRcdCAgICAgICAgXHRcblx0XHQgICAgICAgICAgIHNjb3BlLiRhcHBseSgpO1xuXHRcdFxuXG5cdFx0ICAgICAgICB9XG5cblx0XHQgICAgfSk7IC8vIGVuZCBzb3J0YWJsZVxuXG5cdFx0IC8vICB9KTsgLy9lbmQgd2F0Y2hcblxuXG5cblx0XHR9LFxuXHRcdGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSl7XG5cblx0XHRcdCRzY29wZS5tb29zZSA9IFwiZGluZ1wiXG5cdFx0XHQkc2NvcGUuZGVsZXRlSXRlbSA9IGZ1bmN0aW9uKHBhcmVudEluZGV4LCBpbmRleCl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKHBhcmVudEluZGV4KVxuXHRcdFx0XHRjb25zb2xlLmxvZyhpbmRleClcblx0XHRcdFx0JHNjb3BlLm5vdGVzW3BhcmVudEluZGV4XS5pdGVtcy5zcGxpY2UoaW5kZXgsMSlcblxuXHRcdFx0fVxuXG5cdFx0XHQkc2NvcGUucmFuZG9tSWQgPSBmdW5jdGlvbihpdGVtKXtcbiAgIFx0XHRcdCByZXR1cm4gXCJJRFwiICsgaXRlbSArIChNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogOTk5KSArIDEpKTtcblx0XHRcdH1cblx0XHRcdC8vYWxlcnQoXCJjb250cm9sbGVyXCIpO1xuXHRcdFx0Ly8gJHNjb3BlLmRvZ3MgPSAkc2NvcGUuZGF0YSArIFwiZG9nc1wiO1xuXHRcdFx0Ly8gaWYoJHNjb3BlLmRyYWdnYWJsZSlcblx0XHRcdC8vIFx0JHNjb3BlLmRyYWdTdGF0dXMgPSBmYWxzZTtcblx0XHRcdC8vIGVsc2UgJHNjb3BlLmRyYWdTdGF0dXMgPSB0cnVlO1xuXG5cdFx0XHRjb25zb2xlLmxvZygkc2NvcGUpXG5cblx0XHRcdFxuXHRcdH1cblx0fVxufSAvL2VuZCBub3RlY2FyZCBkaXJlY3RpdmVcblxuXG5cblxuXG4iLCIoZnVuY3Rpb24oKXtcblx0J3VzZSBzdHJpY3QnXG5cblx0YW5ndWxhclxuICAgIFx0Lm1vZHVsZSgnbm90ZXMnKVxuICAgIFx0LmZhY3RvcnkoJ25vdGVzU2VydmljZScsIG5vdGVzU2VydmljZSk7XG5cbiAgICBub3Rlc1NlcnZpY2UuJGluamVjdCA9IFsnJGh0dHAnXVxuXG4gICAgZnVuY3Rpb24gbm90ZXNTZXJ2aWNlKCRodHRwKSB7XG4gICAgXHR2YXIgc2VydmljZSA9IHtcblxuICAgICAgICAgICAgZ2V0Tm90ZTogZ2V0Tm90ZSxcbiAgICAgICAgICAgIGdldE5vdGVzOiBnZXROb3RlcyxcbiAgICAgICAgICAgIHNhdmVOb3Rlczogc2F2ZU5vdGVzXG5cblxuICAgIFx0fTtcblxuICAgIFx0cmV0dXJuIHNlcnZpY2U7XG5cbiAgICBcdC8vLy8vLy8vLy8vL1xuXG4gICAgICAgIC8vIGdldHMgYSBzaW5nbGUgbm90ZVxuICAgICAgICBmdW5jdGlvbiBnZXROb3RlICgpIHtcblxuICAgICAgICAgICAgdmFyIG5vdGUgPSB7XG4gICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMkBuaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgIHRpdGxlOiBcInRvZG9cIixcbiAgICAgICAgICAgICAgICBpdGVtczogWyBcImxhdW5kcnlcIiwgXCJhcHBseSBqb2JzXCIsIFwiZ3ltXCIgXSxcbiAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjEvMS8yMDE2XCIsXG4gICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjEvMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3plLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBub3RlO1xuXG4gICAgICAgIH0gLy9lbmQgZ2V0Tm90ZSgpXG5cblxuICAgICAgICAvLyBnZXRzIGFsbCBub3Rlc1xuICAgICAgICBmdW5jdGlvbiBnZXROb3RlcyAoKSB7XG5cbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGkvbm90ZXMvZ2V0Tm90ZXMnLHtlbWFpbDpcIm1vaXpAZ21haWwuY29tXCJ9KVxuICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBub3RlcyA9IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiMVwiLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImxhdW5kcnlcIiwgXCJhcHBseSBqb2JzXCIsIFwiZ3ltXCIgXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIxLzEvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMS8yLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3plLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiMlwiLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImh0bWw1IGRyYWcgYW5kIGRyb3BcIiwgXCJzb2NrZXQuaW9cIiwgXCJub2RlanNcIiBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjIvMS8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIyLzIvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvemUuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMkBuaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCIzXCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwiYm9zZSBoZWFkcGhvbmVzXCIsIFwiMjAxNiBob25kYSBncmlsbFwiLCBcInNvbGlkIHN0YXRlIGhhcmQgZHJpdmVcIiBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjEvMS8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIxLzIvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvemUuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMkBuaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCI0XCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwibGF1bmRyeVwiLCBcImFwcGx5IGpvYnNcIiwgXCJneW1cIiBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjEvMS8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIxLzIvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvemUuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMkBuaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCI1XCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwiaHRtbDUgZHJhZyBhbmQgZHJvcFwiLCBcInNvY2tldC5pb1wiLCBcIm5vZGVqc1wiIF0sXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMi8xLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjIvMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96ZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyQG5qaXQuZWR1XCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIjZcIixcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJib3NlIGhlYWRwaG9uZXNcIiwgXCIyMDE2IGhvbmRhIGdyaWxsXCIsIFwic29saWQgc3RhdGUgaGFyZCBkcml2ZVwiIF0sXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMS8xLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjEvMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96ZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyQG5qaXQuZWR1XCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIjdcIixcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJsYXVuZHJ5XCIsIFwiYXBwbHkgam9ic1wiLCBcImd5bVwiLFwiYm9zZSBoZWFkcGhvbmVzXCIsIFwiMjAxNiBob25kYSBncmlsbFwiLCBcInNvbGlkIHN0YXRlIGhhcmQgZHJpdmVcIiAgXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIxLzEvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMS8yLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3plLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiOFwiLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImh0bWw1IGRyYWcgYW5kIGRyb3BcIiwgXCJzb2NrZXQuaW9cIiwgXCJub2RlanNcIiBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjIvMS8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIyLzIvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvemUuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMkBuaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCI5XCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwiYm9zZSBoZWFkcGhvbmVzXCIsIFwiMjAxNiBob25kYSBncmlsbFwiLCBcInNvbGlkIHN0YXRlIGhhcmQgZHJpdmVcIixcImh0bWw1IGRyYWcgYW5kIGRyb3BcIiwgXCJzb2NrZXQuaW9cIiwgXCJub2RlanNcIiAgXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIxLzEvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMS8yLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3plLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXSAvL2VuZCBub3RlcyBhcnJheVxuXG4gICAgICAgICAgICAvL3JldHVybiBub3Rlc1xuICAgICAgICB9IC8vZW5kIGdldCBub3Rlc1xuXG4gICAgICAgIGZ1bmN0aW9uIHNhdmVOb3Rlcyhub3Rlcykge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGkvbm90ZXMvdXBkYXRlTm90ZXMnLHtlbWFpbDpcIm1vaXpAZ21haWwuY29tXCIsbm90ZXM6IG5vdGVzfSlcbiAgICAgICAgfVxuXG5cblxuICAgIH1cblxuXHRcblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0J3VzZSBzdHJpY3QnXG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ25vdGVzJylcblx0XHQuY29udHJvbGxlcignbm90ZXNDdHJsJywgbm90ZXNDdHJsKVxuXG5cdG5vdGVzQ3RybC4kaW5qZWN0ID0gWydub3Rlc1NlcnZpY2UnXVxuXG5cdGZ1bmN0aW9uIG5vdGVzQ3RybChub3Rlc1NlcnZpY2UpIHtcblxuXHRcdGNvbnNvbGUubG9nKFwibm90ZXMgY3RybFwiKTtcblxuXHRcdC8vY29uc29sZS5sb2coIG5vdGVzU2VydmljZS5nZXROb3RlcygpIClcblx0XHRcblx0ICAgIHZhciB2bSA9IHRoaXM7XG5cblx0ICAgIHZtLm5vdGVzID0gbm90ZXNTZXJ2aWNlLmdldE5vdGVzKCk7XG5cdCAgICB2bS5kcmFnZGF0YSA9IHtzdGFydE5vdGVQb3M6IG51bGwsICBzdGFydEl0ZW1Qb3M6IG51bGwsIGVuZE5vdGVQb3M6IG51bGwsIGVuZEl0ZW1Qb3M6IG51bGx9XG5cdCAgICAvL2NvbnNvbGUubG9nKHZtLm5vdGVzWzBdLml0ZW1zWzBdKVxuXG5cblx0ICAgIHZtLmRyYWdzdGFydCA9IGZ1bmN0aW9uICgpIHtcblx0ICAgIFx0Y29uc29sZS5sb2coXCJkcmFnIHN0YXJ0ZWRcIilcblx0ICAgIH1cblxuXHQgICAgdm0uZ290b1Nlc3Npb24gPSBnb3RvU2Vzc2lvbjtcblx0ICAgIHZtLnJlZnJlc2ggPSByZWZyZXNoO1xuXHQgICAgdm0uc2VhcmNoID0gc2VhcmNoO1xuXHQgICAgdm0uc2Vzc2lvbnMgPSBbXTtcblx0ICAgIHZtLnRpdGxlID0gJ25vdGVzJztcblxuXG5cdCAgICB2bS5hbGVydExpc3QgPSBmdW5jdGlvbigpe1xuXHQgICAgXHR2bS5saXN0ID0gW11cblx0ICAgIFx0YW5ndWxhci5mb3JFYWNoKHZtLm5vdGVzLCBmdW5jdGlvbihub3RlKSB7XG5cdFx0XHQgIC8vY29uc29sZS5sb2cobm90ZS50aXRsZSk7XG5cdFx0XHQgIHZtLmxpc3QucHVzaChub3RlLnRpdGxlKVxuXHRcdFx0fSk7XG5cdFx0XHRjb25zb2xlLmxvZyh2bS5saXN0KVxuXHQgICAgfVxuXG5cblxuXHQgICAgLy8vLy8vLy8vLy8vXG5cblx0ICAgIGZ1bmN0aW9uIGdvdG9TZXNzaW9uKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiByZWZyZXNoKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBzZWFyY2goKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cdH1cblxufSkoKTtcblxuXG4iLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgnbm90ZXMnKVxuICAgIC5kaXJlY3RpdmUoJ25vdGVDYXJkJywgbm90ZUNhcmQpO1xuXG5mdW5jdGlvbiBub3RlQ2FyZCgpIHtcblx0cmV0dXJue1xuXHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0c2NvcGU6IHtcblx0XHRcdGRhdGE6IFwiPVwiLFxuXHRcdFx0ZHJhZ2dhYmxlOiBcIj1cIlxuXHRcdH0sXG5cdFx0cmVwbGFjZTogdHJ1ZSxcblx0XHR0ZW1wbGF0ZTogXCI8aDE+e3tkb2dzfX17e2RyYWdTdGF0dXN9fTwvaDE+XCIsXG5cdFx0bGluazogZnVuY3Rpb24oc2NvcGUsZWxlbWVudCl7XG5cdFx0XHRlbGVtZW50LmNsaWNrKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKGVsZW1lbnQpXG5cdFx0XHRcdGVsZW1lbnRbMF0uZHJhZ2dhYmxlID0gdHJ1ZTtcblx0XHRcdH0pXG5cdFx0fSxcblx0XHRjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpe1xuXHRcdFx0Ly9hbGVydChcImNvbnRyb2xsZXJcIik7XG5cdFx0XHQkc2NvcGUuZG9ncyA9ICRzY29wZS5kYXRhICsgXCJkb2dzXCI7XG5cdFx0XHRpZigkc2NvcGUuZHJhZ2dhYmxlKVxuXHRcdFx0XHQkc2NvcGUuZHJhZ1N0YXR1cyA9IGZhbHNlO1xuXHRcdFx0ZWxzZSAkc2NvcGUuZHJhZ1N0YXR1cyA9IHRydWU7XG5cblx0XHRcdFxuXHRcdH1cblx0fVxufVxuXG5cblxuLy8gYW5ndWxhclxuLy8gICAgIC5tb2R1bGUoJ25vdGVzJylcbi8vICAgICAuZGlyZWN0aXZlKCdub3RlQ2FyZCcsIG5vdGVDYXJkKTtcblxuLy8gZnVuY3Rpb24gbm90ZUNhcmQoKSB7XG4vLyBcdHJldHVybntcbi8vIFx0XHRyZXN0cmljdDogJ0UnLFxuLy8gXHRcdGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSl7XG4vLyBcdFx0XHRhbGVydChcImNvbnRyb2xsZXJcIik7XG4vLyBcdFx0XHRjb25zb2xlLmxvZygnZG9nJylcbi8vIFx0XHR9LFxuLy8gXHRcdHRlbXBsYXRlVXJsOiAnJyxcbi8vIFx0XHRyZXBsYWNlOiB0cnVlXG4vLyBcdFx0Ly8gc2NvcGU6IHt9XG4vLyBcdH1cbi8vIH0iLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgnbm90ZXMnKVxuICAgIC5kaXJlY3RpdmUoJ25vdGVDYXJkcycsIG5vdGVDYXJkcylcbiAgICBcblxuZnVuY3Rpb24gbm90ZUNhcmRzKCkge1xuXHRyZXR1cm57XG5cdFx0cmVzdHJpY3Q6ICdBRScsXG5cdFx0c2NvcGU6IHtcblx0XHRcdG5vdGVzOiBcIj1cIixcblx0XHRcdGRyYWdkYXRhOiBcIj1cIlxuXHRcdH0sXG5cdFx0cmVwbGFjZTogZmFsc2UsXG5cdFx0dHJhbnNjbHVkZTogdHJ1ZSxcblx0XHR0ZW1wbGF0ZVVybDogXCJjb21wb25lbnRzL25vdGVzL3ZpZXdzL25vdGUuZGlyZWN0aXZlLnZpZXcuaHRtbFwiLFxuXHRcdGxpbms6IGZ1bmN0aW9uKHNjb3BlLGVsZW1lbnQsYXR0cnMpe1xuXHRcdFx0Ly8kKCBcIiNzb3J0YWJsZVwiICkuc29ydGFibGUoKTtcblx0XHRcdC8vY29uc29sZS5sb2coc2NvcGUpXG5cdFx0XHQvL2NvbnNvbGUubG9nKGVsZW1lbnQpXG5cdFx0XHQvL2NvbnNvbGUubG9nKGF0dHJzKVxuXHRcdFx0Ly9lbGVtZW50LnNvcnRhYmxlKCk7XG5cdFx0XHQvL2NvbnNvbGUubG9nKHNjb3BlLm5vdGVzKVxuXHRcdFx0c2NvcGUuZG9ncyA9IGZ1bmN0aW9uKG5vdGUpe1xuXHRcdFx0XHRjb25zb2xlLmxvZyhub3RlKVxuXHRcdFx0fVxuXG5cdFx0XHRlbGVtZW50LnNvcnRhYmxlKHtcblx0XHQgICAgICAgLy8gcGxhY2Vob2xkZXI6IFwidWktc3RhdGUtaGlnaGxpZ2h0XCIsXG5cblx0XHQgICAgICAgIHN0YXJ0OiBmdW5jdGlvbihldmVudCwgdWkpIHtcblx0XHQgICAgICAgICAgICB2YXIgc3RhcnRfcG9zID0gdWkuaXRlbS5pbmRleCgpO1xuXHRcdCAgICAgICAgICAgIHVpLml0ZW0uZGF0YSgnc3RhcnRfcG9zJywgc3RhcnRfcG9zKTtcblx0XHQgICAgICAgICAgICBjb25zb2xlLmxvZyhzY29wZS5kcmFnZGF0YSlcblx0XHQgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGF0dHJzLmRyYWdkYXRhKVxuXHRcdCAgICAgICAgfSxcblx0XHQgICAgICAgIHVwZGF0ZTogZnVuY3Rpb24oZXZlbnQsIHVpKSB7XG5cdFx0ICAgICAgICAgICAgdmFyIHN0YXJ0X3BvcyA9IHVpLml0ZW0uZGF0YSgnc3RhcnRfcG9zJyk7XG5cdFx0ICAgICAgICAgICAgdmFyIGVuZF9wb3MgPSB1aS5pdGVtLmluZGV4KCk7XG5cdFx0ICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhzdGFydF9wb3MgKyAnIC0gJyArIGVuZF9wb3MpO1xuXHRcdCAgICAgICAgICBcblx0XHQgICAgICAgICAgdmFyIHN0YXJ0SXRlbSA9IHNjb3BlLm5vdGVzW3N0YXJ0X3Bvc107XG5cdFx0ICAgICAgICAgICBzY29wZS5ub3Rlcy5zcGxpY2Uoc3RhcnRfcG9zLDEpXG5cdFx0ICAgICAgICAgICBzY29wZS5ub3Rlcy5zcGxpY2UoZW5kX3BvcywwLCBzdGFydEl0ZW0pXG5cdFx0ICAgICAgICAgICBzY29wZS4kYXBwbHkoKTtcblxuXHRcdCAgICAgICAgICAgLy9jb25zb2xlLmxvZyhzY29wZS5ub3Rlcylcblx0XHQgICAgICAgICAgIFxuXHRcdCAgICAgICAgICAgXG5cdFx0ICAgICAgICB9XG5cdFx0ICAgIH0pOyAvLyBlbmQgc29ydGFibGVcblxuXHRcdCAgIFxuXG5cdFx0ICAgIGNvbnNvbGUubG9nKGVsZW1lbnQpXG5cblxuXHRcdH0sXG5cdFx0Y29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKXtcblx0XHRcdC8vYWxlcnQoXCJjb250cm9sbGVyXCIpO1xuXHRcdFx0Ly8gJHNjb3BlLmRvZ3MgPSAkc2NvcGUuZGF0YSArIFwiZG9nc1wiO1xuXHRcdFx0Ly8gaWYoJHNjb3BlLmRyYWdnYWJsZSlcblx0XHRcdC8vIFx0JHNjb3BlLmRyYWdTdGF0dXMgPSBmYWxzZTtcblx0XHRcdC8vIGVsc2UgJHNjb3BlLmRyYWdTdGF0dXMgPSB0cnVlO1xuXG5cdFx0XHRcblx0XHR9XG5cdH1cbn0gLy9lbmQgbm90ZWNhcmRzIGRpcmVjdGl2ZVxuXG5hbmd1bGFyXG5cdC5tb2R1bGUoJ25vdGVzJylcblx0LmRpcmVjdGl2ZSgnbm90ZUNhcmQnLCBub3RlQ2FyZClcblxuZnVuY3Rpb24gbm90ZUNhcmQoKSB7XG5cdHJldHVybntcblx0XHRyZXN0cmljdDogJ0FFJyxcblx0XHRzY29wZToge1xuXHRcdFx0bm90ZTogXCI9XCIsXG5cdFx0XHRub3RlczogXCI9XCIsXG5cdFx0XHRkcmFnZGF0YTogXCI9XCJcblx0XHR9LFxuXHRcdHJlcGxhY2U6IHRydWUsXG5cdFx0dHJhbnNjbHVkZTogZmFsc2UsXG5cdFx0dGVtcGxhdGVVcmw6IFwiY29tcG9uZW50cy9ub3Rlcy92aWV3cy9ub3Rlcy5pdGVtcy52aWV3Lmh0bWxcIixcblx0XHRsaW5rOiBmdW5jdGlvbihzY29wZSxlbGVtZW50LGF0dHJzKXtcblx0XHRcdC8vJCggXCIjc29ydGFibGVcIiApLnNvcnRhYmxlKCk7XG5cdFx0XHQvL2NvbnNvbGUubG9nKHNjb3BlKVxuXHRcdFx0Y29uc29sZS5sb2coZWxlbWVudClcblx0XHRcdC8vY29uc29sZS5sb2coYXR0cnMpXG5cdFx0XHQvL2VsZW1lbnQuc29ydGFibGUoKTtcblx0XHRcdC8vY29uc29sZS5sb2coc2NvcGUubm90ZXMpXG5cdFx0XHRcblxuXHRcdFx0ZWxlbWVudC5zb3J0YWJsZSh7XG5cdFx0ICAgICAgIC8vcGxhY2Vob2xkZXI6IFwidWktc3RhdGUtaGlnaGxpZ2h0XCIsXG5cdFx0ICAgICAgIGNvbm5lY3RXaXRoOiBcIi5jb25uZWN0ZWRTb3J0YWJsZVwiLFxuXG5cdFx0ICAgICAgICBzdGFydDogZnVuY3Rpb24oZXZlbnQsIHVpKSB7XG5cdFx0ICAgICAgICBcdGNvbnNvbGUubG9nKFwiU1RBUlQgRlVOQ1RJT04gU1RBUlQgRlVOQ1RJT04gU1RBUlQgRlVOQ1RJT04gU1RBUlQgRlVOQ1RJT04gXCIpXG5cdFx0ICAgICAgICBcdGNvbnNvbGUubG9nKFwiU1RBUlQgRlVOQ1RJT04gU1RBUlQgRlVOQ1RJT04gU1RBUlQgRlVOQ1RJT04gU1RBUlQgRlVOQ1RJT04gXCIpXG5cdFx0ICBcdFx0XHRcblx0XHQgIFx0XHRcdC8vY2xlYXIgZHJhZ2RhdGEgZnJvbSBub3Rlcy5jb250cm9sbGVyXG5cdFx0ICAgICAgIFx0XHRzY29wZS5kcmFnZGF0YSA9IHtzdGFydE5vdGVQb3M6IG51bGwsICBzdGFydEl0ZW1Qb3M6IG51bGwsIGVuZE5vdGVQb3M6IG51bGwsIGVuZEl0ZW1Qb3M6IG51bGx9XG5cdFx0ICAgICAgIFx0XHRcblxuXHRcdCAgICAgICBcdFx0Ly9zZXQgc3RhcnQgbm90ZSBhbmQgc3RhcnQgaXRlbSBwb3NpdGlvblxuXHRcdCAgICAgICAgXHRzY29wZS5kcmFnZGF0YS5zdGFydE5vdGVQb3MgPSBhdHRycy5ub3RlaW5kZXg7XG5cdFx0ICAgICAgICAgICAgc2NvcGUuZHJhZ2RhdGEuc3RhcnRJdGVtUG9zID0gdWkuaXRlbS5pbmRleCgpO1xuXHRcdCAgICAgICAgICAgIC8vbG9nIGRhdGFcblxuXHRcdCAgICAgICAgICAgICB2YXIgc3RhcnRfcG9zID0gdWkuaXRlbS5pbmRleCgpO1xuICAgICAgICAgIFx0XHRcdCB1aS5pdGVtLmRhdGEoJ3N0YXJ0X3BvcycsIHN0YXJ0X3Bvcyk7XG5cdFx0ICAgICAgICAgICAgLy9zY29wZS4kYXBwbHkoKTtcblx0XHQgICAgICAgICAgICBjb25zb2xlLmxvZyhzY29wZS5kcmFnZGF0YSlcblxuXG5cdFx0ICAgICAgICB9LFxuXHRcdCAgICAgICAgdXBkYXRlOiBmdW5jdGlvbihldmVudCwgdWkpIHtcblx0XHQgICAgICAgIFx0Ly9vbmx5IGZvciBjaGFuZ2VzIHdpdGhpbiBvd24gbGlzdFxuXHRcdCAgICAgICAgXHRjb25zb2xlLmxvZyhcIlVQREFURSBGVU5DVElPTiBVUERBVEUgRlVOQ1RJT04gVVBEQVRFIEZVTkNUSU9OIFVQREFURSBGVU5DVElPTiBcIilcblx0XHQgICAgICAgIFx0Y29uc29sZS5sb2coXCJVUERBVEUgRlVOQ1RJT04gVVBEQVRFIEZVTkNUSU9OIFVQREFURSBGVU5DVElPTiBVUERBVEUgRlVOQ1RJT04gXCIpXG5cblx0XHRcdCAgICAgICAgc2NvcGUuZHJhZ2RhdGEuZW5kSXRlbVBvcyA9IHVpLml0ZW0uaW5kZXgoKTtcblxuXG5cdFx0ICAgICAgICBcdFx0Y29uc29sZS5sb2coXCJFWEVDVVRJTkcgVVBEQVRFIEZVTkNUSU9OIEVYRUNVVElORyBVUERBVEUgRlVOQ1RJT04gRVhFQ1VUSU5HIFVQREFURSBGVU5DVElPTlwiKVxuXHRcdCAgICAgICAgXHRcdGNvbnNvbGUubG9nKHNjb3BlLmRyYWdkYXRhKVxuXG5cdFx0XHQgICAgICAgICAgIHZhciBzdGFydEl0ZW0gPSBzY29wZS5ub3RlLml0ZW1zW3Njb3BlLmRyYWdkYXRhLnN0YXJ0SXRlbVBvc107XG5cblx0XHRcdCAgICAgICAgICAgdmFyIHN0YXJ0X3BvcyA9IHVpLml0ZW0uZGF0YSgnc3RhcnRfcG9zJyk7XG4gICAgICAgICAgXHRcdFx0ICAgdmFyIGVuZF9wb3MgPSB1aS5pdGVtLmluZGV4KCk7XG5cblx0XHRcdCAgICAgICAgICAgc2NvcGUubm90ZS5pdGVtcy5zcGxpY2Uoc3RhcnRfcG9zLDEpXG4gICAgICAgICAgXHRcdFx0ICAgc2NvcGUubm90ZS5pdGVtcy5zcGxpY2UoZW5kX3BvcywwLCBzdGFydEl0ZW0pXG5cdFx0XHQgICAgICAgICAgIHNjb3BlLiRhcHBseSgpO1x0XG5cblx0XHQgICAgICAgICAgIFxuXHRcdCAgICAgICAgfSwvL2VuZCB1cGRhdGVcblx0XHQgICAgICAgICBkb2c6IGZ1bmN0aW9uKGV2ZW50LCB1aSkge1xuXHRcdCAgICAgICAgIFx0Y29uc29sZS5sb2coXCJSRUNFSVZFIEZVTkNUSU9OIFJFQ0VJVkUgRlVOQ1RJT04gUkVDRUlWRSBGVU5DVElPTiBSRUNFSVZFIEZVTkNUSU9OIFwiKVxuXHRcdCAgICAgICAgXHRjb25zb2xlLmxvZyhcIlJFQ0VJVkUgRlVOQ1RJT04gUkVDRUlWRSBGVU5DVElPTiBSRUNFSVZFIEZVTkNUSU9OIFJFQ0VJVkUgRlVOQ1RJT04gXCIpXG5cdFx0ICAgICAgICBcdGNvbnNvbGUubG9nKHNjb3BlLmRyYWdkYXRhKVxuXHRcdCAgICAgICAgXHRjb25zb2xlLmxvZyhhdHRycy5ub3RlaW5kZXgpXG5cblx0XHQgICAgICAgIFx0ICAgdmFyIHN0YXJ0SXRlbSA9IHNjb3BlLm5vdGUuaXRlbXNbc2NvcGUuZHJhZ2RhdGEuc3RhcnRJdGVtUG9zXTtcblx0XHQgICAgICAgIFx0ICAgdmFyIHN0YXJ0Tm90ZVBvcyA9IHNjb3BlLmRyYWdkYXRhLnN0YXJ0Tm90ZVBvcztcblx0XHQgICAgICAgIFx0ICAgc2NvcGUuZHJhZ2RhdGEuZW5kSXRlbVBvcyA9IHVpLml0ZW0uaW5kZXgoKTtcblx0XHQgICAgICAgIFx0ICAgc2NvcGUuZHJhZ2RhdGEuZW5kTm90ZVBvcyA9IGF0dHJzLm5vdGVpbmRleDtcblxuXHRcdCAgICAgICAgXHQgICBjb25zb2xlLmxvZyhzdGFydE5vdGVQb3MpXG5cdFx0XHQgICAgICAgICAgIHNjb3BlLm5vdGVzW3N0YXJ0Tm90ZVBvc10uaXRlbXMuc3BsaWNlKHNjb3BlLmRyYWdkYXRhLnN0YXJ0SXRlbVBvcywxKVxuXHRcdFx0ICAgICAgICAgICBzY29wZS5ub3Rlc1tzY29wZS5kcmFnZGF0YS5lbmROb3RlUG9zXS5pdGVtcy5zcGxpY2Uoc2NvcGUuZHJhZ2RhdGEuZW5kSXRlbVBvcywwLCBzdGFydEl0ZW0pXG5cdFx0XHQgICAgICAgICAgIFxuXG5cblx0XHRcdCAgICAgICAgICAgc2NvcGUuJGFwcGx5KCk7XG5cblxuXHRcdCAgICAgICAgXHRcblx0XHQgICAgICAgIH0sLy9lbmQgcmVjZWl2ZVxuXG5cblx0XHQgICAgfSk7IC8vIGVuZCBzb3J0YWJsZVxuXHRcdFxuXHRcdH0sXG5cdFx0Y29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKXtcblx0XHRcdC8vYWxlcnQoXCJjb250cm9sbGVyXCIpO1xuXHRcdFx0Ly8gJHNjb3BlLmRvZ3MgPSAkc2NvcGUuZGF0YSArIFwiZG9nc1wiO1xuXHRcdFx0Ly8gaWYoJHNjb3BlLmRyYWdnYWJsZSlcblx0XHRcdC8vIFx0JHNjb3BlLmRyYWdTdGF0dXMgPSBmYWxzZTtcblx0XHRcdC8vIGVsc2UgJHNjb3BlLmRyYWdTdGF0dXMgPSB0cnVlO1xuXG5cdFx0XHRcdFxuXHRcdH1cblx0fVxufSAvL2VuZCBub3RlY2FyZCBkaXJlY3RpdmVcblxuXG5cblxuXG4iLCIoZnVuY3Rpb24oKXtcblx0J3VzZSBzdHJpY3QnXG5cblx0YW5ndWxhclxuICAgIFx0Lm1vZHVsZSgnbm90ZXMnKVxuICAgIFx0LmZhY3RvcnkoJ25vdGVzU2VydmljZScsIG5vdGVzU2VydmljZSk7XG5cbiAgICBub3Rlc1NlcnZpY2UuJGluamVjdCA9IFtdXG5cbiAgICBmdW5jdGlvbiBub3Rlc1NlcnZpY2UoKSB7XG4gICAgXHR2YXIgc2VydmljZSA9IHtcblxuICAgICAgICAgICAgZ2V0Tm90ZTogZ2V0Tm90ZSxcbiAgICAgICAgICAgIGdldE5vdGVzOiBnZXROb3Rlc1xuXG5cbiAgICBcdH07XG5cbiAgICBcdHJldHVybiBzZXJ2aWNlO1xuXG4gICAgXHQvLy8vLy8vLy8vLy9cblxuICAgICAgICAvLyBnZXRzIGEgc2luZ2xlIG5vdGVcbiAgICAgICAgZnVuY3Rpb24gZ2V0Tm90ZSAoKSB7XG5cbiAgICAgICAgICAgIHZhciBub3RlID0ge1xuICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJ0b2RvXCIsXG4gICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJsYXVuZHJ5XCIsIFwiYXBwbHkgam9ic1wiLCBcImd5bVwiIF0sXG4gICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIxLzEvMjAxNlwiLFxuICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIxLzIvMjAxNlwiLFxuICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96ZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbm90ZTtcblxuICAgICAgICB9IC8vZW5kIGdldE5vdGUoKVxuXG5cbiAgICAgICAgLy8gZ2V0cyBhbGwgbm90ZXNcbiAgICAgICAgZnVuY3Rpb24gZ2V0Tm90ZXMgKCkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgbm90ZXMgPSBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyQG5qaXQuZWR1XCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIjFcIixcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJsYXVuZHJ5XCIsIFwiYXBwbHkgam9ic1wiLCBcImd5bVwiIF0sXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMS8xLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjEvMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96ZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyQG5qaXQuZWR1XCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIjJcIixcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJodG1sNSBkcmFnIGFuZCBkcm9wXCIsIFwic29ja2V0LmlvXCIsIFwibm9kZWpzXCIgXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIyLzEvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMi8yLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3plLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiM1wiLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImJvc2UgaGVhZHBob25lc1wiLCBcIjIwMTYgaG9uZGEgZ3JpbGxcIiwgXCJzb2xpZCBzdGF0ZSBoYXJkIGRyaXZlXCIgXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIxLzEvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMS8yLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3plLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiNFwiLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImxhdW5kcnlcIiwgXCJhcHBseSBqb2JzXCIsIFwiZ3ltXCIgXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIxLzEvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMS8yLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3plLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiNVwiLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImh0bWw1IGRyYWcgYW5kIGRyb3BcIiwgXCJzb2NrZXQuaW9cIiwgXCJub2RlanNcIiBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjIvMS8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIyLzIvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvemUuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMkBuaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCI2XCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwiYm9zZSBoZWFkcGhvbmVzXCIsIFwiMjAxNiBob25kYSBncmlsbFwiLCBcInNvbGlkIHN0YXRlIGhhcmQgZHJpdmVcIiBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjEvMS8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIxLzIvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvemUuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMkBuaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCI3XCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwibGF1bmRyeVwiLCBcImFwcGx5IGpvYnNcIiwgXCJneW1cIixcImJvc2UgaGVhZHBob25lc1wiLCBcIjIwMTYgaG9uZGEgZ3JpbGxcIiwgXCJzb2xpZCBzdGF0ZSBoYXJkIGRyaXZlXCIgIF0sXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMS8xLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjEvMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96ZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgICAgIH0gIFxuICAgICAgICAgICAgXSAvL2VuZCBub3RlcyBhcnJheVxuXG4gICAgICAgICAgICByZXR1cm4gbm90ZXNcbiAgICAgICAgfVxuXG5cblxuICAgIH1cblxuXHRcblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0J3VzZSBzdHJpY3QnXG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ25vdGlmeScpXG5cdFx0LmNvbnRyb2xsZXIoJ25vdGlmeUN0cmwnLCBub3RpZnlDdHJsKVxuXG5cdC8vIG5vdGlmeUN0cmwuJGluamVjdCA9IFtdXG5cblx0ZnVuY3Rpb24gbm90aWZ5Q3RybCgpIHtcblxuXHQgICAgdmFyIHZtID0gdGhpcztcblxuXHQgICAgdm0uZ290b1Nlc3Npb24gPSBnb3RvU2Vzc2lvbjtcblx0ICAgIHZtLnJlZnJlc2ggPSByZWZyZXNoO1xuXHQgICAgdm0uc2VhcmNoID0gc2VhcmNoO1xuXHQgICAgdm0uc2Vzc2lvbnMgPSBbXTtcblx0ICAgIHZtLnRpdGxlID0gJ25vdGlmeSc7XG5cblx0ICAgIC8vLy8vLy8vLy8vL1xuXG5cdCAgICBcblxuXHQgICAgZnVuY3Rpb24gZ290b1Nlc3Npb24oKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIHJlZnJlc2goKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIHNlYXJjaCgpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblx0fVxuXG59KSgpO1xuXG5cbiIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdub3RpZnknKVxuICAgIC5kaXJlY3RpdmUoJ25vdGlmeScsIG5vdGlmeSlcblxuICAgIG5vdGlmeS4kaW5qZWN0ID0gWydub3RpZnlTZXJ2aWNlJywnJHJvb3RTY29wZScsJyR0aW1lb3V0J11cbiAgICBcblxuZnVuY3Rpb24gbm90aWZ5KCkge1xuXHRyZXR1cm57XG5cdFx0cmVzdHJpY3Q6ICdBRScsXG5cdFx0c2NvcGU6IHtcblx0XHRcdC8vIG5vdGVzOiBcIj1cIixcblx0XHRcdC8vIG5ld0l0ZW06IFwiPVwiXG5cdFx0fSxcblx0XHRyZXBsYWNlOiBmYWxzZSxcblx0XHR0cmFuc2NsdWRlOiBmYWxzZSxcblx0XHQvLyB0ZW1wbGF0ZVVybDogXCJjb21wb25lbnRzL25vdGVzL3ZpZXdzL25vdGUuZGlyZWN0aXZlLnZpZXcuaHRtbFwiLFxuXHRcdHRlbXBsYXRlOiBcIjxoMT57e2RhdGF9fTwvaDE+XCIsXG5cdFx0bGluazogZnVuY3Rpb24oc2NvcGUsZWxlbWVudCxhdHRycyl7XG5cblx0XHRcdC8vIHNjb3BlLmRvZ3MgPSBmdW5jdGlvbihub3RlKXtcblx0XHRcdC8vIFx0Y29uc29sZS5sb2cobm90ZSlcblx0XHRcdC8vIH0gICBcblxuXHRcdCAgIGNvbnNvbGUubG9nKGVsZW1lbnQpXG5cblxuXHRcdH0sXG5cdFx0Y29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlLG5vdGlmeVNlcnZpY2UsJHJvb3RTY29wZSwkdGltZW91dCl7XG5cdFx0XHRjb25zb2xlLmxvZygnbm90aWZ5IGRpcmVjdGl2ZScpXG5cdFx0XHQkc2NvcGUuZGF0YSA9IG51bGw7XHRcdFx0XG5cblx0XHRcdCAkcm9vdFNjb3BlLiRvbigncHVzaGVkJyxmdW5jdGlvbihldmVudCxtZXNzYWdlKXtcblx0XHRcdCBcdGNvbnNvbGUubG9nKFwiZGlyZWN0aXZlOiByZWNlaXZpbmdcIik7XG5cdFx0XHQgXHQkc2NvcGUuZGF0YSA9IG1lc3NhZ2UuZGF0YTtcblx0XHRcdCBcdCRzY29wZS4kYXBwbHkoKTtcblx0XHRcdCBcdCR0aW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHQgXHRcdCRzY29wZS5kYXRhID0gXCJcIjtcblx0XHRcdCBcdH0sMzAwMClcblx0XHRcdCB9KVxuXHRcdFx0XG5cdFx0fVxuXHR9XG59IC8vZW5kIG5vdGlmeSBkaXJlY3RpdmVcbiIsIihmdW5jdGlvbigpe1xuICAgICd1c2Ugc3RyaWN0J1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdub3RpZnknKVxuICAgICAgICAuZmFjdG9yeSgnbm90aWZ5U2VydmljZScsIG5vdGlmeVNlcnZpY2UpO1xuXG4gICAgbm90aWZ5U2VydmljZS4kaW5qZWN0ID0gWyckcm9vdFNjb3BlJ11cblxuICAgIGZ1bmN0aW9uIG5vdGlmeVNlcnZpY2UoJHJvb3RTY29wZSkge1xuICAgICAgICB2YXIgc2VydmljZSA9IHtcblxuICAgICAgICAgICAgcHVzaDogcHVzaCxcblxuXG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIHNlcnZpY2U7XG5cbiAgICAgICAgLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgZnVuY3Rpb24gcHVzaChtZXNzYWdlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInB1c2hpbmcgZnJvbSBzZXJ2aWNlXCIpO1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kZW1pdChcInB1c2hlZFwiLCBtZXNzYWdlKTtcblxuICAgICAgICB9XG5cblxuXG4gICAgfVxuXG4gICAgXG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0J1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCdyZWdpc3RlcicpXG5cdFx0LmNvbnRyb2xsZXIoJ3JlZ2lzdGVyQ3RybCcsIHJlZ2lzdGVyQ3RybClcblxuXHRyZWdpc3RlckN0cmwuaW5qZWN0ID0gWyd0b2FzdHInLCckaHR0cCcsJ3JlZ2lzdGVyU2VydmljZSddXG5cblx0ZnVuY3Rpb24gcmVnaXN0ZXJDdHJsKHRvYXN0ciwkaHR0cCxyZWdpc3RlclNlcnZpY2UpIHtcblxuXHQgICAgdmFyIHZtID0gdGhpcztcblxuXHQgICAgdm0uZm9ybSA9IHt9XG5cdCAgICB2bS5zdWJtaXRTdGF0dXMgPSBcIlwiO1xuXHQgICAgdm0uc3VibWl0Rm9ybSA9IHN1Ym1pdEZvcm07XG5cdCAgICBcblx0ICAgIC8vZGlzcGxheSBpbmZvIG9uIGxvYWRcblx0ICAgIGluZm8oKTtcblxuXHQgICAgLy8vLy8vLy8vLy8vXG5cblx0ICAgIGZ1bmN0aW9uIHN1Ym1pdEZvcm0oaXNWYWxpZCkge1xuXHQgICAgXHRcblx0ICAgIFx0Y29uc29sZS5sb2codm0uZm9ybSk7XG5cdCAgICBcdFxuXHQgICAgXHQvLyBjaGVjayB0byBtYWtlIHN1cmUgdGhlIGZvcm0gaXMgY29tcGxldGVseSB2YWxpZFxuXHRcdCAgICBpZiAoaXNWYWxpZCkge1xuXHRcdCAgICAgIGNvbnNvbGUubG9nKFwiVmFsaWQgRm9ybVwiKTtcblx0XHQgICAgICBzZW5kRm9ybSh2bS5mb3JtKTtcblx0XHQgICAgfVxuXHQgICAgfVxuXG5cdCAgICAvL3NlbmRzIGZvcm0gdG8gYXBpXG5cdCAgICBmdW5jdGlvbiBzZW5kRm9ybShmb3JtKSB7XG5cdFx0XHRyZWdpc3RlclNlcnZpY2UubmV3VXNlcih2bSxmb3JtKVxuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBpbmZvKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgICBjb25zb2xlLmxvZyhcInJlZ2lzdGVyIGNvbnRyb2xsZXJcIilcblx0ICAgIH1cblxuXHR9XG5cbn0pKCk7XG5cblxuIiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ3JlZ2lzdGVyJylcbiAgICAuZGlyZWN0aXZlKCdyZWdpc3RlckRpcicsIHJlZ2lzdGVyRGlyKTtcblxuZnVuY3Rpb24gcmVnaXN0ZXJEaXIoKSB7XG5cdHJldHVybntcblx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdHRlbXBsYXRlVXJsOiAnJyxcblx0XHRyZXBsYWNlOiB0cnVlXG5cdFx0Ly8gc2NvcGU6IHt9XG5cdH1cbn0iLCIoZnVuY3Rpb24oKXtcblx0J3VzZSBzdHJpY3QnXG5cblx0YW5ndWxhclxuICAgIFx0Lm1vZHVsZSgncmVnaXN0ZXInKVxuICAgIFx0LmZhY3RvcnkoJ3JlZ2lzdGVyU2VydmljZScsIHJlZ2lzdGVyU2VydmljZSk7XG5cbiAgICByZWdpc3RlclNlcnZpY2UuaW5qZWN0ID0gWyckaHR0cCcsJ3RvYXN0cicsJ2F1dGhTZXJ2aWNlJywnJHN0YXRlJywnJHJvb3RTY29wZSddXG5cbiAgICBmdW5jdGlvbiByZWdpc3RlclNlcnZpY2UoJGh0dHAsdG9hc3RyLGF1dGhTZXJ2aWNlLCRzdGF0ZSwkcm9vdFNjb3BlKSB7XG4gICAgXHR2YXIgc2VydmljZSA9IHtcblxuICAgICAgICAgICAgbmV3VXNlcjogbmV3VXNlcixcbiAgICBcdFx0ZXJyb3I6IGVycm9yLFxuICAgIFx0XHRpbmZvOiBpbmZvLFxuICAgIFx0XHRzdWNjZXNzOiBzdWNjZXNzXG5cbiAgICBcdH07XG5cbiAgICBcdHJldHVybiBzZXJ2aWNlO1xuXG4gICAgXHQvLy8vLy8vLy8vLy9cblxuICAgICAgICBmdW5jdGlvbiBuZXdVc2VyKHZtLCBmb3JtKSB7XG4gICAgICAgICAgICAkaHR0cC5wb3N0KCdodHRwOi8vbG9jYWxob3N0OjMwMDAvYXBpL3VzZXJzL25ld1VzZXInLCBmb3JtKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgICBhdXRoU2VydmljZS5zZXRUb2tlbihyZXMuZGF0YS50b2tlbik7XG5cbiAgICAgICAgICAgICAgLy90b2FzdFxuICAgICAgICAgICAgICB0b2FzdHIuc3VjY2VzcygnWW91IGFyZSBub3cgbXkgQmV0YSEnKTtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzKTtcblxuICAgICAgICAgICAgICAvL2NoYW5nZSBzdGF0dXMgb24gdmlld1xuICAgICAgICAgICAgICB2bS5zdWJtaXRTdGF0dXMgPSBcIlN1Y2Nlc3NcIjtcbiAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgLy9lbXB0eSBmb3JtXG4gICAgICAgICAgICAgIHZtLmZvcm0gPSBcIlwiO1xuXG4gICAgICAgICAgICAgIC8vcmVkaXJlY3RcbiAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAubWVtYmVycycpO1xuXG4gICAgICAgICAgICAgICRyb290U2NvcGUuJGVtaXQoXCJsb2dnZWRJblwiKTtcblxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAgIHRvYXN0ci5lcnJvcignRmFpbGVkOiAnICsgZXJyLmRhdGEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgIFx0ZnVuY3Rpb24gZXJyb3IoKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIGluZm8oKSB7XG5cdCAgICAgIC8qICovXG4gICAgICAgICAgY29uc29sZS5sb2coXCJyZWdpc3RlclNlcnZpY2VcIik7XG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIHN1Y2Nlc3MoKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cblxuICAgIH1cblxuXHRcblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0J3VzZSBzdHJpY3QnXG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ3NhbXBsZScpXG5cdFx0LmNvbnRyb2xsZXIoJ3NhbXBsZUN0cmwnLCBzYW1wbGVDdHJsKVxuXG5cdHNhbXBsZUN0cmwuJGluamVjdCA9IFtdXG5cblx0ZnVuY3Rpb24gc2FtcGxlQ3RybCgpIHtcblxuXHQgICAgdmFyIHZtID0gdGhpcztcblxuXHQgICAgdm0uZ290b1Nlc3Npb24gPSBnb3RvU2Vzc2lvbjtcblx0ICAgIHZtLnJlZnJlc2ggPSByZWZyZXNoO1xuXHQgICAgdm0uc2VhcmNoID0gc2VhcmNoO1xuXHQgICAgdm0uc2Vzc2lvbnMgPSBbXTtcblx0ICAgIHZtLnRpdGxlID0gJ1NhbXBsZSc7XG5cblx0ICAgIC8vLy8vLy8vLy8vL1xuXG5cdCAgICBmdW5jdGlvbiBnb3RvU2Vzc2lvbigpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gcmVmcmVzaCgpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gc2VhcmNoKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXHR9XG5cbn0pKCk7XG5cblxuIiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ3NhbXBsZScpXG4gICAgLmRpcmVjdGl2ZSgnc2FtcGxlRGlyJywgc2FtcGxlRGlyKTtcblxuZnVuY3Rpb24gc2FtcGxlRGlyKCkge1xuXHRyZXR1cm57XG5cdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHR0ZW1wbGF0ZVVybDogJycsXG5cdFx0cmVwbGFjZTogdHJ1ZVxuXHRcdC8vIHNjb3BlOiB7fVxuXHR9XG59IiwiKGZ1bmN0aW9uKCl7XG5cdCd1c2Ugc3RyaWN0J1xuXG5cdGFuZ3VsYXJcbiAgICBcdC5tb2R1bGUoJ3NhbXBsZScpXG4gICAgXHQuZmFjdG9yeSgnc2FtcGxlU2VydmljZScsIHNhbXBsZVNlcnZpY2UpO1xuXG4gICAgc2FtcGxlU2VydmljZS4kaW5qZWN0ID0gW11cblxuICAgIGZ1bmN0aW9uIHNhbXBsZVNlcnZpY2UoKSB7XG4gICAgXHR2YXIgc2VydmljZSA9IHtcblxuICAgIFx0XHRlcnJvcjogZXJyb3IsXG4gICAgXHRcdGluZm86IGluZm8sXG4gICAgXHRcdHN1Y2Nlc3M6IHN1Y2Nlc3NcblxuICAgIFx0fTtcblxuICAgIFx0cmV0dXJuIHNlcnZpY2U7XG5cbiAgICBcdC8vLy8vLy8vLy8vL1xuXG4gICAgXHRmdW5jdGlvbiBlcnJvcigpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gaW5mbygpIHtcblx0ICAgICAgLyogKi9cbiAgICAgICAgICBjb25zb2xlLmxvZyhcInNhbXBsZVNlcnZpY2VcIik7XG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIHN1Y2Nlc3MoKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cblxuICAgIH1cblxuXHRcblxufSkoKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
