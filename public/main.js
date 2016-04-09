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
			controllerAs: 'notes',
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUuanMiLCJjb250cm9sbGVycy9hcHAuY29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2FwcC5ob21lLmNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9hcHAubG9naW4uY29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2FwcC5uYXYuY29udHJvbGxlci5qcyIsImRpcmVjdGl2ZXMvc2VsZWN0VGV4dC5kaXJlY3RpdmUuanMiLCJyb3V0ZXMvYXBwLnJvdXRlcy5qcyIsImF1dGgvYXV0aC5tb2R1bGUuanMiLCJidWRnZXQvYnVkZ2V0Lm1vZHVsZS5qcyIsIm1lbWJlcnMvbWVtYmVycy5tb2R1bGUuanMiLCJub3Rlcy9ub3Rlcy5tb2R1bGUuanMiLCJub3Rlc0JVL25vdGVzLm1vZHVsZS5qcyIsIm5vdGlmeS9ub3RpZnkubW9kdWxlLmpzIiwicmVnaXN0ZXIvcmVnaXN0ZXIubW9kdWxlLmpzIiwic2FtcGxlQ29tcG9uZW50L3NhbXBsZS5tb2R1bGUuanMiLCJhdXRoL3NlcnZpY2VzL2F1dGguaW50ZXJjZXB0b3Iuc2VydmljZS5qcyIsImF1dGgvc2VydmljZXMvYXV0aC5zZXJ2aWNlLmpzIiwiYnVkZ2V0L2NvbnRyb2xsZXJzL2J1ZGdldC5jb250cm9sbGVyLmpzIiwiYnVkZ2V0L2RpcmVjdGl2ZXMvbm90ZXMuZGlyZWN0aXZlLmJhY2t1cC5qcyIsImJ1ZGdldC9kaXJlY3RpdmVzL25vdGVzLmRpcmVjdGl2ZS5qcyIsImJ1ZGdldC9zZXJ2aWNlcy9idWRnZXQuc2VydmljZS5qcyIsIm1lbWJlcnMvY29udHJvbGxlcnMvbWVtYmVycy5jb250cm9sbGVyLmpzIiwibWVtYmVycy9zZXJ2aWNlcy9tZW1iZXJzLnNlcnZpY2UuanMiLCJub3Rlcy9jb250cm9sbGVycy9ub3Rlcy5jb250cm9sbGVyLmpzIiwibm90ZXMvZGlyZWN0aXZlcy9ub3Rlcy5kaXJlY3RpdmUuYmFja3VwLmpzIiwibm90ZXMvZGlyZWN0aXZlcy9ub3Rlcy5kaXJlY3RpdmUuanMiLCJub3Rlcy9zZXJ2aWNlcy9ub3Rlcy5zZXJ2aWNlLmpzIiwibm90ZXNCVS9jb250cm9sbGVycy9ub3Rlcy5jb250cm9sbGVyLmpzIiwibm90ZXNCVS9kaXJlY3RpdmVzL25vdGVzLmRpcmVjdGl2ZS5iYWNrdXAuanMiLCJub3Rlc0JVL2RpcmVjdGl2ZXMvbm90ZXMuZGlyZWN0aXZlLmpzIiwibm90ZXNCVS9zZXJ2aWNlcy9ub3Rlcy5zZXJ2aWNlLmpzIiwibm90aWZ5L2NvbnRyb2xsZXJzL25vdGlmeS5jb250cm9sbGVyLmpzIiwibm90aWZ5L2RpcmVjdGl2ZXMvbm90aWZ5LmRpcmVjdGl2ZS5qcyIsIm5vdGlmeS9zZXJ2aWNlcy9ub3RpZnkuc2VydmljZS5qcyIsInJlZ2lzdGVyL2NvbnRyb2xsZXJzL3JlZ2lzdGVyLmNvbnRyb2xsZXIuanMiLCJyZWdpc3Rlci9kaXJlY3RpdmVzL3JlZ2lzdGVyLmRpcmVjdGl2ZS5qcyIsInJlZ2lzdGVyL3NlcnZpY2VzL3JlZ2lzdGVyLnNlcnZpY2UuanMiLCJzYW1wbGVDb21wb25lbnQvY29udHJvbGxlcnMvc2FtcGxlLmNvbnRyb2xsZXIuanMiLCJzYW1wbGVDb21wb25lbnQvZGlyZWN0aXZlcy9zYW1wbGUuZGlyZWN0aXZlLmpzIiwic2FtcGxlQ29tcG9uZW50L3NlcnZpY2VzL3NhbXBsZS5zZXJ2aWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7XG4gICAgJ3VzZSBzdHJpY3QnXG5cbmFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAnLCBbXG4gICAgXHQndWkucm91dGVyJyxcbiAgICBcdCduZ0FuaW1hdGUnLFxuICAgIFx0J3NhbXBsZScsXG4gICAgXHQncmVnaXN0ZXInLFxuICAgIFx0J3RvYXN0cicsXG4gICAgXHQnYXV0aCcsXG4gICAgXHQnbWVtYmVycycsXG4gICAgXHQnbm90ZXMnLFxuICAgICAgICAnYnVkZ2V0JyxcbiAgICAgICAgJ2NoYXJ0LmpzJyxcbiAgICAgICAgJ25vdGlmeSdcbiAgICBdKVxuXG5cblxuLnJ1bihbJyRyb290U2NvcGUnLCckc3RhdGUnLCdhdXRoU2VydmljZScsJyRxJyxmdW5jdGlvbigkcm9vdFNjb3BlLCAkc3RhdGUsIGF1dGhTZXJ2aWNlICwkcSkge1xuICAgIGF1dGhTZXJ2aWNlLmluZm8oKTtcblxuICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VFcnJvcicsIGZ1bmN0aW9uIChldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcywgZXJyb3IpIHtcbiAgICAgICAgICAgXG4gICAgICAgICAgLy8gZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgY29uc29sZS5sb2coXCJTVEFURSBDSEFOR0UgRVJST1IgRVJST1IgRVJST1IgRVJST1JFUlJPUlwiKTtcbiAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAuaG9tZScpXG4gICAgICAgIFxuICAgICAgfSk7XG5cbiAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3RhcnQnLCBmdW5jdGlvbiAoZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpIHtcbiAgICAvL2F1dGhTZXJ2aWNlLmluZm8oKTtcbiAgICAvL2F1dGhTZXJ2aWNlLmlzQXV0aG9yaXplZCggZXZlbnQsIGZyb21TdGF0ZSwgdG9TdGF0ZSk7XG4gICAgLy9jb25zb2xlLmxvZyhcInN0YXRlIGNoYW5naW5nXCIpO1xuICAgIC8vY29uc29sZS5sb2codG9TdGF0ZSlcblxuICAgICAgICBpZih0b1N0YXRlLmRhdGEucGVybWlzc2lvbiA9PT0gdHJ1ZSl7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibmVlZCBwZXJtaXNzaW9uXCIpO1xuICAgICAgICAgICAgLy90b1N0YXRlLnJlc29sdmUgPSB0b1N0YXRlLnJlc29sdmUgfHwge307XG4gICAgICAgICAgICAvL3RvU3RhdGUucmVzb2x2ZSA9IHt9O1xuXG4gICAgICAgICAgICAvL2NoZWNrIHRvIHNlZSBpZiB0aGVyZSB3YXMgYSByZXNvbHZlIGFscmVhZHkgYWRkZWRcbiAgICAgICAgICAgIGlmKCF0b1N0YXRlLnJlc29sdmUuYXV0aG9yaXphdGlvblJlc29sdmVyKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnYWRkaW5nIGF1dGggcmVzb2x2ZXInKTtcbiAgICAgICAgICAgICAgICAvL2FkZCByZXNvbHZlclxuICAgICAgICAgICAgICAgIHRvU3RhdGUucmVzb2x2ZS5hdXRob3JpemF0aW9uUmVzb2x2ZXIgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGF1dGhTZXJ2aWNlLmlzQXV0aG9yaXplZChldmVudCwgZnJvbVN0YXRlLCB0b1N0YXRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImp1c3QgYWRkZWQ6IFwiKVxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2codG9TdGF0ZS5yZXNvbHZlLmF1dGhvcml6YXRpb25SZXNvbHZlcilcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgLy9qdXN0IHRvIHNob3cgdGhhdCB0aGUgcmVzb2x2ZXIgd2FzIGFscmVhZHkgYWRkZWRcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHRvU3RhdGUucmVzb2x2ZS5hdXRob3JpemF0aW9uUmVzb2x2ZXIpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSAvL2VuZCBpZiBuZWVkcyBwZXJtaXNzaW9uXG5cblxuICAgIH0pOyAvL2VuZCByb290U2NvcGUuJG9uXG5cblxuICAgIFxuXG59XSk7IC8vZW5kIC5ydW5cblxuXG5cblxuXG59KSgpOzsgLy9lbmQgaWZmZVxuXG4iLCIoZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0J1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCdhcHAnKVxuXHRcdC5jb250cm9sbGVyKCdhcHBDdHJsJywgYXBwQ3RybClcblxuXHRhcHBDdHJsLiRpbmplY3QgPSBbJ3NhbXBsZVNlcnZpY2UnLCdhdXRoU2VydmljZScsJyRzdGF0ZScsJyRodHRwJywndG9hc3RyJywnJHJvb3RTY29wZScsJ25vdGlmeVNlcnZpY2UnXVxuXG5cdGZ1bmN0aW9uIGFwcEN0cmwoc2FtcGxlU2VydmljZSxhdXRoU2VydmljZSwkc3RhdGUsICRodHRwLCB0b2FzdHIsICRyb290U2NvcGUsbm90aWZ5U2VydmljZSkge1xuXG5cdFx0IHZhciB2bSA9IHRoaXM7XG5cblx0XHQgLy8gb24gaW5pdGlhbCBsb2FkXG5cdFx0IC8vIHVzZXIgbG9naW4gc3RhdHVzXG5cdFx0IHZtLmlzTG9nZ2VkID0gYXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKHZtKTtcblxuXHRcdCAkcm9vdFNjb3BlLiRvbignbG9nZ2VkSW4nLGZ1bmN0aW9uKCl7XG5cdFx0IFx0dm0uaXNMb2dnZWQgPSB0cnVlO1xuXHRcdCB9KVxuXG5cdFx0ICRyb290U2NvcGUuJG9uKCdsb2dnZWRPdXQnLGZ1bmN0aW9uKCl7XG5cdFx0IFx0dm0uaXNMb2dnZWQgPSBmYWxzZTtcblx0XHQgfSlcblxuXHRcdCB2YXIgbWVzc2FnZSA9IHtkYXRhIDogXCJyb29zdHNcIn07XG5cdFx0IC8vbm90aWZ5U2VydmljZS5wdXNoKCBtZXNzYWdlKTtcblxuXHRcdCAvL2FsZXJ0KFwid2F0Y2hpbmdcIik7XG5cblxuXHR9IC8vZW5kIGFwcEN0cmxcblxufSkoKTs7XG5cblxuIiwiKGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCdcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnYXBwJylcblx0XHQuY29udHJvbGxlcignaG9tZUN0cmwnLCBob21lQ3RybClcblx0XHQuY29udHJvbGxlcigncGFyZW50Q3RybCcsIHBhcmVudEN0cmwpXG5cblx0aG9tZUN0cmwuaW5qZWN0ID0gWydzYW1wbGVTZXJ2aWNlJywnJHNjb3BlJ11cblxuXHRmdW5jdGlvbiBob21lQ3RybChzYW1wbGVTZXJ2aWNlLCAkc2NvcGUpIHtcblx0XHRcblx0XHRzYW1wbGVTZXJ2aWNlLmluZm8oKTtcblxuXHQgICAgdmFyIHZtID0gdGhpcztcblxuXHQgICAgdm0uZ290b1Nlc3Npb24gPSBnb3RvU2Vzc2lvbjtcblx0ICAgIHZtLnJlZnJlc2ggPSByZWZyZXNoO1xuXHQgICAgdm0uc2VhcmNoID0gc2VhcmNoO1xuXHQgICAgdm0uc2Vzc2lvbnMgPSBbXTtcblx0ICAgIHZtLnRlc3QgPSAndGVzdCc7XG5cblx0ICAgIC8vLy8vLy8vLy8vL1xuXG5cdCAgICAvLyAkc2NvcGUuJG9uKCdkb2dzJywgZnVuY3Rpb24gKCkge1xuXHQgICAgLy8gXHRjb25zb2xlLmxvZyhcInJlY2VpdmVkXCIpXG5cdCAgICAvLyB9KTtcblxuXHQgICAgZnVuY3Rpb24gZ290b1Nlc3Npb24oKSB7XG5cblx0XHR9XG5cblx0ICAgIGZ1bmN0aW9uIHJlZnJlc2goKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIHNlYXJjaCgpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblx0fSAvLyBlbmQgaG9tZUN0cmxcblxuXHRwYXJlbnRDdHJsLmluamVjdCA9IFsnc2FtcGxlU2VydmljZScsJyRzY29wZSddXG5cblx0ZnVuY3Rpb24gcGFyZW50Q3RybCgkc2NvcGUpIHtcblx0XHRcblx0ICAgIHZhciB2bSA9IHRoaXM7XG5cdCAgICAvL2NvbnNvbGUubG9nKFwicGFyZW50XCIpXG5cblx0ICAgLy8gJHNjb3BlLiRlbWl0KCdkb2dzJywnc29tZSBkYXRhJyk7XG5cblxuXHR9IC8vIGVuZCBwYXJlbnRDdHJsXG5cbn0pKCk7XG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cbiIsIlx0KGZ1bmN0aW9uKCl7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ2FwcCcpXG5cdFx0LmNvbnRyb2xsZXIoXCJsb2dpbkN0cmxcIiwgbG9naW5DdHJsKVxuXG5cdGxvZ2luQ3RybC4kaW5qZWN0ID0gWyckc2NvcGUnLCdzYW1wbGVTZXJ2aWNlJywnYXV0aFNlcnZpY2UnLCckc3RhdGUnLCckaHR0cCcsJ3RvYXN0ciddXG5cblx0ZnVuY3Rpb24gbG9naW5DdHJsKCRzY29wZSxzYW1wbGVTZXJ2aWNlLGF1dGhTZXJ2aWNlLCRzdGF0ZSwgJGh0dHAsIHRvYXN0cikge1xuXHRcdC8vc2FtcGxlU2VydmljZS5pbmZvKCk7XG5cdFx0Ly9jb25zb2xlLmxvZyhcImxvZ2luQ3RybFwiKVxuXG5cdCAgICB2YXIgdm0gPSB0aGlzO1xuXHQgICAgdm0udXNlciA9IFwiXCJcblx0ICAgIHZtLmxvZ2luRm9ybSA9IFwiXCI7XG5cdCAgICBcblx0ICAgIHZtLmxvZ2luID0gbG9naW47XG5cdCAgICB2bS5sb2dvdXQgPSBsb2dvdXQ7XG5cblx0ICAgIC8vLy8vLy8vLy8vL1xuXG5cdCAgICBmdW5jdGlvbiBsb2dpbigpIHtcblx0ICAgIFx0YXV0aFNlcnZpY2UubG9naW4odm0udXNlciwnYXBwLm5vdGVzJylcblx0XHRcdHZtLnVzZXIgPSBcIlwiO1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBsb2dvdXQoKSB7XG5cdCAgICBcdGNvbnNvbGUubG9nKFwibG9nZ2luZyBvdXQuLi5cIilcblx0ICAgIFx0YXV0aFNlcnZpY2UubG9nb3V0KCk7XG5cdCAgICB9XG5cblxuXHR9IC8vZW5kIGxvZ2luQ3RybFxuXG5cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0J1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCdhcHAnKVxuXHRcdC5jb250cm9sbGVyKCduYXZDdHJsJywgbmF2Q3RybClcblxuXHRuYXZDdHJsLmluamVjdCA9IFsnJ11cblxuXHRmdW5jdGlvbiBuYXZDdHJsKCkge1xuXHRcdFxuXHRcdC8vY29uc29sZS5sb2coJ25hdiBjb250cm9sbGVyJyk7XG5cblx0ICAgIHZhciB2bSA9IHRoaXM7XG5cblxuXHQgICAgdm0ubG9nZ2VkSW4gPSB0cnVlO1xuXHQgICAgdm0uZ290b1Nlc3Npb24gPSBnb3RvU2Vzc2lvbjtcblx0ICAgIHZtLnJlZnJlc2ggPSByZWZyZXNoO1xuXHQgICAgdm0uc2VhcmNoID0gc2VhcmNoO1xuXHQgICAgdm0uc2Vzc2lvbnMgPSBbXTtcblx0ICAgIHZtLnRpdGxlID0gJ05hdic7XG5cdCAgICAvLyRzY29wZS50aXRsZSA9IFwibW91c2VcIjtcblxuXHQgICAgLy8vLy8vLy8vLy8vXG5cblx0ICAgIGZ1bmN0aW9uIGdvdG9TZXNzaW9uKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiByZWZyZXNoKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBzZWFyY2goKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cdH1cblxufSkoKTtcblxuXG4iLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwJylcbiAgICAuZGlyZWN0aXZlKCdzZWxlY3RUZXh0Jywgc2VsZWN0VGV4dClcbiAgICBcbiAgICBzZWxlY3RUZXh0LiRpbmplY3QgPSBbJyR3aW5kb3cnXVxuXG5mdW5jdGlvbiBzZWxlY3RUZXh0KCR3aW5kb3cpe1xuICAgIHJldHVybiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgZWxlbWVudC5iaW5kKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghJHdpbmRvdy5nZXRTZWxlY3Rpb24oKS50b1N0cmluZygpKSB7XG4gICAgICAgIHRoaXMuc2V0U2VsZWN0aW9uUmFuZ2UodGhpcy52YWx1ZS5sZW5ndGgsIHRoaXMudmFsdWUubGVuZ3RoKVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xufVxuXG5cbiIsIlxuYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG5cdC5jb25maWcoWyckdXJsUm91dGVyUHJvdmlkZXInLCckc3RhdGVQcm92aWRlcicsJyRodHRwUHJvdmlkZXInLGZ1bmN0aW9uKCR1cmxSb3V0ZXJQcm92aWRlciwkc3RhdGVQcm92aWRlciwkaHR0cFByb3ZpZGVyKXtcblx0XHRcblx0XHQkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCdob21lJyk7XG5cdFx0Ly9zdGF0ZXNcblx0XHQkc3RhdGVQcm92aWRlclxuXG5cdFx0LmRlY29yYXRvcigncGF0aCcsIGZ1bmN0aW9uKHN0YXRlLCBwYXJlbnRGbikge1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhcImNvbmZpZ3VyaW5nIHN0YXRlc1wiKVx0XG5cdFx0XHRpZiAoc3RhdGUuc2VsZi5yZXNvbHZlID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0c3RhdGUuc2VsZi5yZXNvbHZlID0ge307XG5cdFx0XHRcdHN0YXRlLnJlc29sdmUgPSBzdGF0ZS5zZWxmLnJlc29sdmU7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcGFyZW50Rm4oc3RhdGUpO1xuICAgICAgICAgfSlcblxuXHRcdC5zdGF0ZSgnYXBwJyx7XG5cdFx0XHRhYnN0cmFjdDogdHJ1ZSxcblx0XHRcdHRlbXBsYXRlVXJsOidhcHAvdmlld3MvYXBwLnZpZXcuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnYXBwQ3RybCcsXG5cdFx0XHRjb250cm9sbGVyQXM6ICdhcHAnXG5cblx0XHR9KVxuXG5cdFx0LnN0YXRlKCdhcHAuaG9tZScse1xuXHRcdFx0dXJsOiAnL2hvbWUnLFxuXHRcdFx0dGVtcGxhdGVVcmw6J2FwcC92aWV3cy9hcHAuaG9tZS5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdob21lQ3RybCcsXG5cdFx0XHRjb250cm9sbGVyQXM6ICdob21lJyxcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0cGVybWlzc2lvbjogZmFsc2UsXG5cdFx0XHRcdHBlcm1pc3Npb25MZXZlbDogWydldmVyeW9uZSddXG5cdFx0XHR9XG5cdFx0fSlcblxuXHRcdC5zdGF0ZSgnYXBwLnJlZ2lzdGVyJyx7XG5cdFx0XHR1cmw6ICcvcmVnaXN0ZXInLFxuXHRcdFx0dGVtcGxhdGVVcmw6J2NvbXBvbmVudHMvcmVnaXN0ZXIvdmlld3MvcmVnaXN0ZXIudmlldy5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdyZWdpc3RlckN0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAncmVnaXN0ZXInLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRwZXJtaXNzaW9uOiBmYWxzZSxcblx0XHRcdFx0cGVybWlzc2lvbkxldmVsOiBbJ2V2ZXJ5b25lJ11cblx0XHRcdH1cblx0XHR9KVxuXG5cdFx0LnN0YXRlKCdhcHAubWVtYmVycycse1xuXHRcdFx0dXJsOiAnL21lbWJlcnMnLFxuXHRcdFx0dGVtcGxhdGVVcmw6J2NvbXBvbmVudHMvbWVtYmVycy92aWV3cy9tZW1iZXJzLmhvbWUuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnbWVtYmVyc0N0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAnbWVtYmVycycsXG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdHBlcm1pc3Npb246IHRydWUsXG5cdFx0XHRcdHBlcm1pc3Npb25MZXZlbDogWydhZG1pbicsJ21lbWJlciddXG5cdFx0XHR9XG5cdFx0fSlcblxuXHRcdC5zdGF0ZSgnYXBwLm5vdGVzJyx7XG5cdFx0XHR1cmw6ICcvbm90ZXMnLFxuXHRcdFx0dGVtcGxhdGVVcmw6J2NvbXBvbmVudHMvbm90ZXMvdmlld3Mvbm90ZXMudmlldy5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdub3Rlc0N0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAnbm90ZXMnLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRwZXJtaXNzaW9uOiB0cnVlLFxuXHRcdFx0XHRwZXJtaXNzaW9uTGV2ZWw6IFsnYWRtaW4nLCdtZW1iZXInXVxuXHRcdFx0fVxuXHRcdH0pXG5cblx0XHQuc3RhdGUoJ2FwcC5idWRnZXQnLHtcblx0XHRcdHVybDogJy9idWRnZXQnLFxuXHRcdFx0dGVtcGxhdGVVcmw6J2NvbXBvbmVudHMvYnVkZ2V0L3ZpZXdzL2J1ZGdldC52aWV3Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ2J1ZGdldEN0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAnYnVkZ2V0Jyxcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0cGVybWlzc2lvbjogdHJ1ZSxcblx0XHRcdFx0cGVybWlzc2lvbkxldmVsOiBbJ2FkbWluJ11cblx0XHRcdH1cblx0XHR9KVxuXG5cdFx0Ly8kaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKCdhdXRoSW50ZXJjZXB0b3InKTtcblxuXG5cblx0fV0pO1xuXG4iLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXV0aCcsIFtcbiAgICAgIFxuICAgIF0pOyIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdidWRnZXQnLCBbXG4gICAgICAnY2hhcnQuanMnXG4gICAgXSk7IiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ21lbWJlcnMnLCBbXG4gICAgICBcbiAgICBdKTsiLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgnbm90ZXMnLCBbXG4gICAgICBcbiAgICBdKTsiLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgnbm90ZXMnLCBbXG4gICAgICBcbiAgICBdKTsiLCIoZnVuY3Rpb24oKXtcblx0J3VzZSBzdHJpY3QnXG5cbmFuZ3VsYXJcblx0Lm1vZHVsZSgnbm90aWZ5JywgW1xuXHQgIFxuXHRdKTtcblxufSkoKTtcblxuXG4iLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgncmVnaXN0ZXInLCBbXG4gICAgXHQnYXV0aCdcbiAgICBdKTsiLCIoZnVuY3Rpb24oKXtcblx0J3VzZSBzdHJpY3QnXG5cbmFuZ3VsYXJcblx0Lm1vZHVsZSgnc2FtcGxlJywgW1xuXHQgIFxuXHRdKTtcblxufSkoKTtcblxuIiwiLy8gKGZ1bmN0aW9uKCl7XG4vLyBcdCd1c2Ugc3RyaWN0J1xuXG4vLyBcdGFuZ3VsYXJcbi8vICAgICBcdC5tb2R1bGUoJ2F1dGgnKVxuLy8gICAgIFx0LmZhY3RvcnkoJ2F1dGhJbnRlcmNlcHRvcicsIGF1dGhJbnRlcmNlcHRvcik7XG5cbi8vICAgICBhdXRoSW50ZXJjZXB0b3IuaW5qZWN0ID0gWydhdXRoU2VydmljZSddXG5cbi8vICAgICBmdW5jdGlvbiBhdXRoSW50ZXJjZXB0b3IoYXV0aFNlcnZpY2UpIHtcblxuXG5cbi8vICAgICBcdHZhciBzZXJ2aWNlID0ge1xuXG4vLyAgICAgXHRcdHJlcXVlc3Q6IHJlcXVlc3QsXG4vLyAgICAgICAgICAgICByZXNwb25zZTogcmVzcG9uc2VcblxuLy8gICAgIFx0fTtcblxuLy8gICAgIFx0cmV0dXJuIHNlcnZpY2U7XG5cbi8vICAgICBcdC8vLy8vLy8vLy8vL1xuXG4vLyAgICAgXHRmdW5jdGlvbiByZXF1ZXN0KGNvbmZpZykge1xuXG4vLyAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiYXV0aEludGVyY2VwdG9yIHJlcXVlc3QgZnVuY3Rpb25cIilcblxuLy8gICAgICAgICAgICAgdmFyIHRva2VuID0gYXV0aFNlcnZpY2UuZ2V0VG9rZW4oKTtcblxuLy8gICAgICAgICAgICAgaWYodG9rZW4pe1xuLy8gICAgICAgICAgICAgICAgIGNvbmZpZy5oZWFkZXJzLmF1dGhvcml6YXRpb24gPSB0b2tlbjtcbi8vICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInRva2VuIHByZXNlbnRcIik7XG4vLyAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICBlbHNle1xuLy8gICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibm8gdG9rZW5cIik7XG4vLyAgICAgICAgICAgICB9ICAgIFxuLy8gICAgICAgICAgICAgcmV0dXJuIGNvbmZpZztcbi8vIFx0ICAgIH1cblxuLy8gXHQgICAgZnVuY3Rpb24gcmVzcG9uc2UocmVzcG9uc2UpIHtcbi8vICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJhdXRoSW50ZXJjZXB0b3IgcmVzcG9uc2UgZnVuY3Rpb25cIilcbi8vICAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbi8vIFx0ICAgIH1cblxuLy8gICAgIH0gLy9lbmQgYXV0aEludGVyY2VwdG9yXG5cblx0XG5cbi8vIH0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0Ly8ndXNlIHN0cmljdCdcblxuXHRhbmd1bGFyXG4gICAgXHQubW9kdWxlKCdhdXRoJyxbXSlcbiAgICBcdC5mYWN0b3J5KCdhdXRoU2VydmljZScsIGF1dGhTZXJ2aWNlKTtcblxuICAgIGF1dGhTZXJ2aWNlLiRpbmplY3QgPSBbJyR3aW5kb3cnLCckaHR0cCcsJ3RvYXN0cicsJyRzdGF0ZScsJyRyb290U2NvcGUnLCckbG9jYXRpb24nLCckcSddO1xuXG4gICAgZnVuY3Rpb24gYXV0aFNlcnZpY2UoJHdpbmRvdywkaHR0cCx0b2FzdHIsJHN0YXRlLCRyb290U2NvcGUsJGxvY2F0aW9uLCRxKSB7XG5cbiAgICBcblxuICAgIFx0dmFyIHNlcnZpY2UgPSB7XG5cbiAgICAgICAgICAgIGluZm86IGluZm8sXG5cbiAgICAgICAgICAgIGxvZ2luOiBsb2dpbixcbiAgICAgICAgICAgIGxvZ291dDogbG9nb3V0LFxuXG4gICAgXHRcdHNldFRva2VuOiBzZXRUb2tlbixcbiAgICAgICAgICAgIGdldFRva2VuOiBnZXRUb2tlbixcbiAgICBcdFx0Y2xlYXJUb2tlbjogY2xlYXJUb2tlbixcblxuICAgICAgICAgICAgaXNBdXRoZW50aWNhdGVkOiBpc0F1dGhlbnRpY2F0ZWQsIC8vIHZlcmlmaWVzIHRva2VuXG4gICAgICAgICAgICBpc0F1dGhvcml6ZWQ6IGlzQXV0aG9yaXplZCAvLyB2ZXJpZmllcyByb3V0ZSBwZXJtaXNzaW9uc1xuXG4gICAgXHR9O1xuXG4gICAgXHRyZXR1cm4gc2VydmljZTtcblxuICAgIFx0Ly8vLy8vLy8vLy8vXG5cbiAgICAgICAgZnVuY3Rpb24gaW5mbyAoKSB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiYXV0aCBzZXJ2aWNlXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmVkaXJlY3QgdGFrZXMgcm91dGUgc3RyaW5nIGllLiAnYXBwLmhvbWUnXG4gICAgICAgIGZ1bmN0aW9uIGxvZ2luICh1c2VyTG9naW5EYXRhLCByZWRpcmVjdCkge1xuICAgICAgICAgICAgJGh0dHAucG9zdCgnaHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaS91c2Vycy9sb2dpbicsIHVzZXJMb2dpbkRhdGEpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzKXtcbiAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgICAgICAgICAgICAgICBpZihyZXMuc3RhdHVzID09IDIwMCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUb2tlbihyZXMuZGF0YS50b2tlbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRlbWl0KFwibG9nZ2VkSW5cIik7ICBcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvYXN0ci5zdWNjZXNzKHJlcy5kYXRhLm1lc3NhZ2UpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0eXBlb2YocmVkaXJlY3QpICE9IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKHJlZGlyZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgICAgICAgICAgdG9hc3RyLmVycm9yKGVyci5kYXRhLm1lc3NhZ2UpXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycilcbiAgICAgICAgICAgICAgICB9KVxuXG5cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGxvZ291dCAoKSB7XG4gICAgICAgICAgICBjbGVhclRva2VuKCk7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRlbWl0KFwibG9nZ2VkT3V0XCIpO1xuICAgICAgICAgICAgJHN0YXRlLmdvKFwiYXBwLmhvbWVcIik7XG4gICAgICAgICAgICB0b2FzdHIuc3VjY2VzcyhcIllvdSBoYXZlIGJlZW4gbG9nZ2VkIG91dFwiKTtcbiAgICAgICAgfVxuXG5cblxuICAgIFx0ZnVuY3Rpb24gc2V0VG9rZW4gKHRva2VuKSB7XG4gICAgICAgICAgICAkd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKCd1c2VyVG9rZW4nLHRva2VuKTtcblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gZ2V0VG9rZW4gKCkge1xuICAgICAgICAgICAgdmFyIHRva2VuID0gJHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndXNlclRva2VuJyk7XG4gICAgICAgICAgICByZXR1cm4gdG9rZW47XG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIGNsZWFyVG9rZW4gKCkge1xuICAgICAgICAgICAgJHdpbmRvdy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgndXNlclRva2VuJyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygncmFiYml0cycpXG5cdCAgICB9XG5cbiAgICAgICAgLy9iYXNpY2FsbHkgYXJlIHRoZXkgbG9nZ2VkIGluXG4gICAgICAgIGZ1bmN0aW9uIGlzQXV0aGVudGljYXRlZCAoKSB7XG5cbiAgICAgICAgICAgIHZhciB0b2tlbiA9IGdldFRva2VuKCk7XG4gICAgICAgICAgICBpZih0b2tlbil7XG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnaHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaS91c2Vycy9hdXRob3JpemUnLHt0b2tlbjp0b2tlbn0pXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2cocmVzKVxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2F1dGhvcml6aW5nLi4nKVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIHJlcy5kYXRhLnN1Y2Nlc3MgPT0gdHJ1ZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9hc3RyLnN1Y2Nlc3MoXCJBdXRoZW50aWNhdGlvbiBTdWNjZXNzIVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQXV0aGVudGljYXRpb24gU3VjY2VzcyFcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRlbWl0KFwibG9nZ2VkSW5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IFxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy90b2FzdHIuZXJyb3IoXCJBdXRoZW50aWNhdGlvbiBGYWlsZWRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkF1dGhlbnRpY2F0aW9uIEZhaWxlZFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxmdW5jdGlvbihlcnIpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9hc3RyLmVycm9yKGVyci5kYXRhKVxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgLy90b2FzdHIuZXJyb3IoXCJhdXRoZW50aWNhdGlvbiBmYWlsZWQsIG5vIHRva2VuIHByZXNlbnRcIilcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImF1dGhlbnRpY2F0aW9uIGZhaWxlZCwgbm8gdG9rZW4gcHJlc2VudFwiKVxuICAgICAgICAgICAgfSBcbiAgICAgICAgICAgXG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBpc0F1dGhvcml6ZWQgKGV2ZW50LCBmcm9tU3RhdGUsIHRvU3RhdGUpIHtcbiAgICAgICAgICAgICAgICAvL3JldHVybiAkcS5yZWplY3QoKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInJ1bm5pbmcgaXMgYXV0aG9yaXplZFwiKVxuXG4gICAgICAgICAgICAgICAgLy9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHZhciB0b2tlbiA9IGdldFRva2VuKCk7XG4gICAgICAgICAgICAgICAgdmFyIHVzZXJsZXZlbCA9IG51bGw7XG4gICAgICAgICAgICAgICAgdmFyIHByb2NlZWQgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIGlmKHRva2VuKXtcbiAgICAgICAgICAgICAgICAgIC8vICByZXR1cm4gJHEucmVqZWN0O1xuICAgICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCdodHRwOi8vbG9jYWxob3N0OjMwMDAvYXBpL3VzZXJzL2F1dGhvcml6ZScse3Rva2VuOnRva2VufSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnYXV0aG9yaXppbmcuLicpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoIHJlcy5kYXRhLnN1Y2Nlc3MgPT0gdHJ1ZSAmJiByZXMuZGF0YS5wcm9maWxlLnVzZXJMZXZlbCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMuZGF0YS5wcm9maWxlLnVzZXJMZXZlbClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlckxldmVsID0gcmVzLmRhdGEucHJvZmlsZS51c2VyTGV2ZWw7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2xvb3AgdGhyb3VnaCBwZXJtaXNzaW9uIGxpc3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpPTA7IGkgPCB0b1N0YXRlLmRhdGEucGVybWlzc2lvbkxldmVsLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2lmIGN1cnJlbnQgdXNlcmxldmVsIG1hdGNoZXMgcGVybWlzc2lvbiBsZXZlbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vdGhlbiBzZXQgcHJvY2VlZCB0byB0cnVlIGFuZCBicmVhayB0aGUgZm9yIGxvb3AgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJjdXJyZW50IGxvb3AgaSA6IFwiICsgdG9TdGF0ZS5kYXRhLnBlcm1pc3Npb25MZXZlbFtpXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih1c2VyTGV2ZWwgPT0gdG9TdGF0ZS5kYXRhLnBlcm1pc3Npb25MZXZlbFtpXSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInBlcm1pc3Npb24gbWF0Y2hcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2V0dGluZyBwcm9jZWVkIHRydWVcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2NlZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3JldHVybiB0b2FzdHIuc3VjY2VzcyhcInByb2NlZWRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJrZWVwIGxvb2tpbmdcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2V0dGluZyBwcm9jZWVkIGZhbHNlXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9jZWVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0vL2VuZCBmb3IgbG9vcCAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSAvLyBlbmQgaWYgcHJvZmlsZSByZXR1cm5lZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGVsc2Ugbm8gcHJvZmlsZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvYXN0ci5lcnJvcihcImJhZCByZXF1ZXN0XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2NlZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImxhc3QgY2hlY2tcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihwcm9jZWVkID09IGZhbHNlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJJVFMgRkFMU0VcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5ob21lJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSAvL2VuZCB0aGVuXG4gICAgICAgICAgICAgICAgfS8vZW5kIGlmIHRva2VuXG5cbiAgICAgICAgICAgICAgICAvL2Vsc2Ugbm8gdG9rZW4gXG4gICAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgdG9hc3RyLmVycm9yKFwibm8gdG9rZW4gcHJlc2VudFwiKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIFxuXG4gICAgICAgIH0vL2VuZCBpc0F1dGhvcml6ZWRcbiAgICAgICAgXG5cbiAgICB9Ly9lbmQgYXV0aFNlcnZpY2VcblxuXG5cblx0XG5cbn0pKCk7IC8vZW5kIGlmZmVcblxuXG4iLCIoZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0J1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCdidWRnZXQnKVxuXHRcdC5jb250cm9sbGVyKCdidWRnZXRDdHJsJywgYnVkZ2V0Q3RybClcblxuXHRidWRnZXRDdHJsLiRpbmplY3QgPSBbJyRzY29wZScsJyRodHRwJywndG9hc3RyJ11cblxuXHRmdW5jdGlvbiBidWRnZXRDdHJsKCRzY29wZSwgJGh0dHAsIHRvYXN0cikge1xuXHRcdGNvbnNvbGUubG9nKCdsb2FkZWQgYnVkZ2V0Q3RybCcpO1xuXHRcblx0XHQvLyAkc2NvcGUuTWF0aCA9IHdpbmRvdy5NYXRoO1xuXG5cdFx0ICAgIFxuXG5cbiAgXHRcdFx0Ly8gaW5jb21lXG4gIFx0XHRcdCRzY29wZS5pbmNvbWUgPSB7fVxuICBcdFx0XHQkc2NvcGUuaW5jb21lLm1vbnRobHkgPSA0NTAwO1xuXG4gIFx0XHRcdC8vIGJpbGxzXG4gIFx0XHRcdCRzY29wZS5iaWxscyA9W11cbiAgXHRcdFx0JHNjb3BlLmJpbGxzID0gW1xuICBcdFx0XHRcdHtuYW1lOlwicmVudFwiLCBjb3N0OiAyNTAwfSxcbiAgXHRcdFx0XHR7bmFtZTpcInV0aWxpdGllc1wiLCBjb3N0OiAyMDB9LFxuICBcdFx0XHRcdHtuYW1lOlwiY2FyIGluc3VyYW5jZVwiLCBjb3N0OiAxNTB9LFxuICBcdFx0XHRcdHtuYW1lOlwiY2FyIHBheW1lbnRcIiwgY29zdDogMjUwfSxcbiAgXHRcdFx0XHR7bmFtZTpcImdhc1wiLCBjb3N0OiAxMDB9LFxuICBcdFx0XHRcdHtuYW1lOlwiZ3ltIG1lbWJlcnNoaXBcIiwgY29zdDogNTB9LFxuICBcdFx0XHRcdHtuYW1lOlwiY2VsbCBwaG9uZVwiLCBjb3N0OiA4MH0sXG5cbiAgXHRcdFx0XVxuXG4gICAgICAgIFxuXG4gIFx0XHRcdCRzY29wZS5hZGROZXdCaWxsID0gZnVuY3Rpb24oKXtcbiAgXHRcdFx0XHQkc2NvcGUuYmlsbHMucHVzaCh7bmFtZTogJHNjb3BlLm5ld0JpbGxOYW1lLCBjb3N0OiAwIH0pXG4gIFx0XHRcdFx0JHNjb3BlLm5ld0JpbGxOYW1lID0gXCJcIjtcbiAgXHRcdFx0fVxuXG4gIFx0XHRcdCRzY29wZS5yZW1vdmVCaWxsSXRlbSA9IGZ1bmN0aW9uKGluZGV4KXtcbiAgXHRcdFx0XHQkc2NvcGUuYmlsbHMuc3BsaWNlKGluZGV4LDEpO1xuICBcdFx0XHR9XG5cbiAgXHRcdFx0Ly9idWRnZXQgaXRlbXNcbiAgXHRcdFx0JHNjb3BlLmJ1ZGdldEl0ZW1zID0gW107XG4gIFx0XHRcdCRzY29wZS5idWRnZXRJdGVtcyA9IFtcbiAgXHRcdFx0XHR7bmFtZTogXCJlYXQgb3V0XCIsIGJ1ZGdldDogMTAwLCBzcGVudDogMzAgfSxcbiAgXHRcdFx0XHR7bmFtZTogXCJjbG90aGluZ1wiLCBidWRnZXQ6IDIwMCwgc3BlbnQ6IDkwfVxuICBcdFx0XHRdXG5cbiAgXHRcdFx0JHNjb3BlLmFkZE5ld0J1ZGdldEl0ZW0gPSBmdW5jdGlvbigpe1xuICBcdFx0XHRcdCRzY29wZS5idWRnZXRJdGVtcy5wdXNoKHtuYW1lOiAkc2NvcGUubmV3QnVkZ2V0SXRlbU5hbWUsIGJ1ZGdldDogMCwgc3BlbnQ6IDAgfSlcbiAgXHRcdFx0XHQkc2NvcGUubmV3QnVkZ2V0SXRlbU5hbWUgPSBcIlwiO1xuICBcdFx0XHR9XG5cbiAgICAgICAgJHNjb3BlLnB1cmNoYXNlcyA9IFtdXG4gICAgICAgICRzY29wZS5wdXJjaGFzZXMgPSBbe2NhdGVnb3J5OiBcImVhdCBvdXRcIn1dXG5cbiAgICAgICAgJHNjb3BlLmFkZFB1cmNoYXNlSXRlbSA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgfVxuXG5cbiAgICAgICAgJHNjb3BlLm1vbnRobHlPdmVydmlldyA9IHt9O1xuICAgICAgICAkc2NvcGUubW9udGhseU92ZXJ2aWV3LmJpbGxzVG90YWwgPSAwO1xuICAgICAgICAkc2NvcGUubW9udGhseU92ZXJ2aWV3LmJ1ZGdldFRvdGFsID0gMDtcbiAgICAgICAgJHNjb3BlLm1vbnRobHlPdmVydmlldy5idWRnZXRTcGVudFRvdGFsID0gMDtcbiAgICAgICAgJHNjb3BlLm1vbnRobHlPdmVydmlldy50b3RhbEVzdGltYXRlZEV4cGVuZGl0dXJlID0gMDtcblxuICAgICAgICBcbiAgICAgICAgJHNjb3BlLmNhbGN1bGF0ZUJpbGxzVG90YWwgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgdG90YWwgPSAwO1xuICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCAkc2NvcGUuYmlsbHMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgdG90YWwgPSB0b3RhbCArICRzY29wZS5iaWxsc1tpXS5jb3N0O1xuICAgICAgICAgIH1cbiAgICAgICAgICAkc2NvcGUubW9udGhseU92ZXJ2aWV3LmJpbGxzVG90YWwgPSB0b3RhbDtcbiAgICAgICAgICAkc2NvcGUuY2FsY3VsYXRlVG90YWxFeHBlbmRpdHVyZSgpXG4gICAgICAgICAgcmV0dXJuIHRvdGFsO1xuICAgICAgICB9XG5cbiAgICAgICAgXG5cbiAgICAgICAgJHNjb3BlLmNhbGN1bGF0ZUJ1ZGdldFRvdGFsID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIHRvdGFsID0gMDtcbiAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgJHNjb3BlLmJ1ZGdldEl0ZW1zLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIHRvdGFsID0gdG90YWwgKyAkc2NvcGUuYnVkZ2V0SXRlbXNbaV0uYnVkZ2V0O1xuICAgICAgICAgIH1cbiAgICAgICAgICAkc2NvcGUubW9udGhseU92ZXJ2aWV3LmJ1ZGdldFRvdGFsID0gdG90YWw7XG4gICAgICAgICAgJHNjb3BlLmNhbGN1bGF0ZVRvdGFsRXhwZW5kaXR1cmUoKVxuICAgICAgICAgIHJldHVybiB0b3RhbDsgICAgICAgXG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuY2FsY3VsYXRlQnVkZ2V0U3BlbnRUb3RhbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciB0b3RhbCA9IDA7XG4gICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8ICRzY29wZS5idWRnZXRJdGVtcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICB0b3RhbCA9IHRvdGFsICsgJHNjb3BlLmJ1ZGdldEl0ZW1zW2ldLnNwZW50O1xuICAgICAgICAgIH1cbiAgICAgICAgICAkc2NvcGUubW9udGhseU92ZXJ2aWV3LmJ1ZGdldFNwZW50VG90YWwgPSB0b3RhbDtcbiAgICAgICAgICAvLyRzY29wZS5jYWxjdWxhdGVUb3RhbEV4cGVuZGl0dXJlKClcbiAgICAgICAgICByZXR1cm4gdG90YWw7ICAgICAgIFxuICAgICAgICB9XG5cbiAgICAgICAgXG5cblxuXG4gICAgICAgJHNjb3BlLiR3YXRjaChcImJpbGxzXCIsICRzY29wZS5jYWxjdWxhdGVCaWxsc1RvdGFsLCB0cnVlKVxuICAgICAgICRzY29wZS4kd2F0Y2goXCJidWRnZXRJdGVtc1wiLCAkc2NvcGUuY2FsY3VsYXRlQnVkZ2V0VG90YWwsIHRydWUpXG4gICAgICAgJHNjb3BlLiR3YXRjaChcImJ1ZGdldEl0ZW1zXCIsICRzY29wZS5jYWxjdWxhdGVCdWRnZXRTcGVudFRvdGFsLCB0cnVlKVxuXG4gICAgIC8vICRzY29wZS4kd2F0Y2goXCJidWRnZXRJdGVtc1wiLCAkc2NvcGUuY2FsY3VsYXRlQnVkZ2V0VG90YWwsIHRydWUpXG5cblxuICAgICAgICAkc2NvcGUuY2FsY3VsYXRlVG90YWxFeHBlbmRpdHVyZSA9IGZ1bmN0aW9uICAoKSB7XG4gICAgICAgICAgICAgJHNjb3BlLm1vbnRobHlPdmVydmlldy50b3RhbEVzdGltYXRlZEV4cGVuZGl0dXJlID0gJHNjb3BlLm1vbnRobHlPdmVydmlldy5iaWxsc1RvdGFsICsgJHNjb3BlLm1vbnRobHlPdmVydmlldy5idWRnZXRUb3RhbDtcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5jYWxjdWxhdGVCaWxsc1RvdGFsKCk7XG4gICAgICAgICRzY29wZS5jYWxjdWxhdGVCdWRnZXRUb3RhbCgpO1xuICAgICAgICAkc2NvcGUuY2FsY3VsYXRlQnVkZ2V0U3BlbnRUb3RhbCgpO1xuICAgICAgICAkc2NvcGUuY2FsY3VsYXRlVG90YWxFeHBlbmRpdHVyZSgpO1xuXG4gICAgICAgICRzY29wZS5sYWJlbHMgPSBbXCJCaWxsc1wiLCBcIkJ1ZGdldFwiLCBcIlJlbWFpbmluZ1wiXTtcbiAgICAgICAgJHNjb3BlLmRhdGEgPSBbJHNjb3BlLm1vbnRobHlPdmVydmlldy5iaWxsc1RvdGFsLFxuICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUubW9udGhseU92ZXJ2aWV3LmJ1ZGdldFRvdGFsLFxuICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuaW5jb21lLm1vbnRobHkgLSAkc2NvcGUubW9udGhseU92ZXJ2aWV3LnRvdGFsRXN0aW1hdGVkRXhwZW5kaXR1cmVdO1xuXG5cblxuXG5cblx0fVxuXG59KSgpO1xuXG5cbiIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdub3RlcycpXG4gICAgLmRpcmVjdGl2ZSgnbm90ZUNhcmQnLCBub3RlQ2FyZCk7XG5cbmZ1bmN0aW9uIG5vdGVDYXJkKCkge1xuXHRyZXR1cm57XG5cdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRzY29wZToge1xuXHRcdFx0ZGF0YTogXCI9XCIsXG5cdFx0XHRkcmFnZ2FibGU6IFwiPVwiXG5cdFx0fSxcblx0XHRyZXBsYWNlOiB0cnVlLFxuXHRcdHRlbXBsYXRlOiBcIjxoMT57e2RvZ3N9fXt7ZHJhZ1N0YXR1c319PC9oMT5cIixcblx0XHRsaW5rOiBmdW5jdGlvbihzY29wZSxlbGVtZW50KXtcblx0XHRcdGVsZW1lbnQuY2xpY2soZnVuY3Rpb24oKXtcblx0XHRcdFx0Y29uc29sZS5sb2coZWxlbWVudClcblx0XHRcdFx0ZWxlbWVudFswXS5kcmFnZ2FibGUgPSB0cnVlO1xuXHRcdFx0fSlcblx0XHR9LFxuXHRcdGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSl7XG5cdFx0XHQvL2FsZXJ0KFwiY29udHJvbGxlclwiKTtcblx0XHRcdCRzY29wZS5kb2dzID0gJHNjb3BlLmRhdGEgKyBcImRvZ3NcIjtcblx0XHRcdGlmKCRzY29wZS5kcmFnZ2FibGUpXG5cdFx0XHRcdCRzY29wZS5kcmFnU3RhdHVzID0gZmFsc2U7XG5cdFx0XHRlbHNlICRzY29wZS5kcmFnU3RhdHVzID0gdHJ1ZTtcblxuXHRcdFx0XG5cdFx0fVxuXHR9XG59XG5cblxuXG4vLyBhbmd1bGFyXG4vLyAgICAgLm1vZHVsZSgnbm90ZXMnKVxuLy8gICAgIC5kaXJlY3RpdmUoJ25vdGVDYXJkJywgbm90ZUNhcmQpO1xuXG4vLyBmdW5jdGlvbiBub3RlQ2FyZCgpIHtcbi8vIFx0cmV0dXJue1xuLy8gXHRcdHJlc3RyaWN0OiAnRScsXG4vLyBcdFx0Y29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKXtcbi8vIFx0XHRcdGFsZXJ0KFwiY29udHJvbGxlclwiKTtcbi8vIFx0XHRcdGNvbnNvbGUubG9nKCdkb2cnKVxuLy8gXHRcdH0sXG4vLyBcdFx0dGVtcGxhdGVVcmw6ICcnLFxuLy8gXHRcdHJlcGxhY2U6IHRydWVcbi8vIFx0XHQvLyBzY29wZToge31cbi8vIFx0fVxuLy8gfSIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdub3RlcycpXG4gICAgLmRpcmVjdGl2ZSgnbm90ZUNhcmRzJywgbm90ZUNhcmRzKVxuXG5cbiAgICBcblxuZnVuY3Rpb24gbm90ZUNhcmRzKCkge1xuXHRyZXR1cm57XG5cdFx0cmVzdHJpY3Q6ICdBRScsXG5cdFx0c2NvcGU6IHtcblx0XHRcdG5vdGVzOiBcIj1cIixcblx0XHRcdG5ld0l0ZW06IFwiPVwiXG5cdFx0fSxcblx0XHRyZXBsYWNlOiBmYWxzZSxcblx0XHR0cmFuc2NsdWRlOiBmYWxzZSxcblx0XHR0ZW1wbGF0ZVVybDogXCJjb21wb25lbnRzL25vdGVzL3ZpZXdzL25vdGUuZGlyZWN0aXZlLnZpZXcuaHRtbFwiLFxuXHRcdGxpbms6IGZ1bmN0aW9uKHNjb3BlLGVsZW1lbnQsYXR0cnMpe1xuXHRcdFx0Ly8kKCBcIiNzb3J0YWJsZVwiICkuc29ydGFibGUoKTtcblx0XHRcdC8vY29uc29sZS5sb2coc2NvcGUpXG5cdFx0XHQvL2NvbnNvbGUubG9nKGVsZW1lbnQpXG5cdFx0XHQvL2NvbnNvbGUubG9nKGF0dHJzKVxuXHRcdFx0Ly9lbGVtZW50LnNvcnRhYmxlKCk7XG5cdFx0XHQvL2NvbnNvbGUubG9nKHNjb3BlLm5vdGVzKVxuXHRcdFx0c2NvcGUuZG9ncyA9IGZ1bmN0aW9uKG5vdGUpe1xuXHRcdFx0XHRjb25zb2xlLmxvZyhub3RlKVxuXHRcdFx0fVxuXG5cblx0XHRcdGVsZW1lbnQuc29ydGFibGUoe1xuXHRcdCAgICAgICAvLyBwbGFjZWhvbGRlcjogXCJ1aS1zdGF0ZS1oaWdobGlnaHRcIixcblx0XHQgICAgICAgIHN0YXJ0OiBmdW5jdGlvbihldmVudCwgdWkpIHtcblx0XHQgICAgICAgICAgICB2YXIgc3RhcnRfcG9zID0gdWkuaXRlbS5pbmRleCgpO1xuXHRcdCAgICAgICAgICAgIHVpLml0ZW0uZGF0YSgnc3RhcnRfcG9zJywgc3RhcnRfcG9zKTtcblx0XHQgICAgICAgIH0sXG5cdFx0ICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uKGV2ZW50LCB1aSkge1xuXHRcdCAgICAgICAgICAgIHZhciBzdGFydF9wb3MgPSB1aS5pdGVtLmRhdGEoJ3N0YXJ0X3BvcycpO1xuXHRcdCAgICAgICAgICAgIHZhciBlbmRfcG9zID0gdWkuaXRlbS5pbmRleCgpO1xuXHRcdCAgICAgICAgICAgIC8vY29uc29sZS5sb2coc3RhcnRfcG9zICsgJyAtICcgKyBlbmRfcG9zKTtcblx0XHQgICAgICAgICAgXG5cdFx0ICAgICAgICAgIHZhciBzdGFydEl0ZW0gPSBzY29wZS5ub3Rlc1tzdGFydF9wb3NdO1xuXHRcdCAgICAgICAgICAgc2NvcGUubm90ZXMuc3BsaWNlKHN0YXJ0X3BvcywxKVxuXHRcdCAgICAgICAgICAgc2NvcGUubm90ZXMuc3BsaWNlKGVuZF9wb3MsMCwgc3RhcnRJdGVtKVxuXHRcdCAgICAgICAgICAgc2NvcGUuJGFwcGx5KCk7XG5cblx0XHQgICAgICAgICAgIC8vY29uc29sZS5sb2coc2NvcGUubm90ZXMpXG5cdFx0ICAgICAgICAgICBcblx0XHQgICAgICAgICAgIFxuXHRcdCAgICAgICAgfVxuXHRcdCAgICB9KTsgLy8gZW5kIHNvcnRhYmxlXG5cblx0XHQgICBcblxuXHRcdCAgICBjb25zb2xlLmxvZyhlbGVtZW50KVxuXG5cblx0XHR9LFxuXHRcdGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSl7XG5cdFx0XHQkc2NvcGUuZm9ybSA9e31cblx0XHRcdCRzY29wZS5hZGRJdGVtID0gZnVuY3Rpb24oaW5kZXgsaXRlbSl7XG5cdFx0XHRcdC8vYWxlcnQoaW5kZXgpXG5cdFx0XHRcdGNvbnNvbGUubG9nKCRzY29wZS5uZXdJdGVtKVxuXHRcdFx0XHQkc2NvcGUubm90ZXNbaW5kZXhdLml0ZW1zLnB1c2goaXRlbSlcblx0XHRcdFx0JHNjb3BlLmZvcm0gPSB7fVxuXHRcdFx0XHQvL2NvbnNvbGUubG9nKCRzY29wZS5ub3Rlc1tpbmRleF0uaXRlbXMpXG5cdFx0XHR9XG5cblx0XHRcdCRzY29wZS5kZWxldGVOb3RlID0gZnVuY3Rpb24oaW5kZXgpe1xuXHRcdFx0XHQkc2NvcGUubm90ZXMuc3BsaWNlKGluZGV4LDEpO1xuXHRcdFx0fVxuXG5cblx0XHRcdC8vYWxlcnQoXCJjb250cm9sbGVyXCIpO1xuXHRcdFx0Ly8gJHNjb3BlLmRvZ3MgPSAkc2NvcGUuZGF0YSArIFwiZG9nc1wiO1xuXHRcdFx0Ly8gaWYoJHNjb3BlLmRyYWdnYWJsZSlcblx0XHRcdC8vIFx0JHNjb3BlLmRyYWdTdGF0dXMgPSBmYWxzZTtcblx0XHRcdC8vIGVsc2UgJHNjb3BlLmRyYWdTdGF0dXMgPSB0cnVlO1xuXG5cdFx0XHRcblx0XHR9XG5cdH1cbn0gLy9lbmQgbm90ZWNhcmRzIGRpcmVjdGl2ZVxuXG5hbmd1bGFyXG5cdC5tb2R1bGUoJ25vdGVzJylcblx0LmRpcmVjdGl2ZSgnbm90ZUNhcmQnLCBub3RlQ2FyZClcblxuZnVuY3Rpb24gbm90ZUNhcmQoKSB7XG5cblx0dmFyIHRlbXBEYXRhID0ge307XG5cdHZhciB0ZW1wTm90ZSA9IG51bGw7XG5cblx0cmV0dXJue1xuXHRcdHJlc3RyaWN0OiAnQUUnLFxuXHRcdHNjb3BlOiB7XG5cdFx0XHRub3RlOiBcIj1cIixcblx0XHRcdG5vdGVzOiBcIj1cIlxuXHRcdH0sXG5cdFx0cmVwbGFjZTogdHJ1ZSxcblx0XHR0cmFuc2NsdWRlOiBmYWxzZSxcblx0XHR0ZW1wbGF0ZVVybDogXCJjb21wb25lbnRzL25vdGVzL3ZpZXdzL25vdGVzLml0ZW1zLnZpZXcuaHRtbFwiLFxuXHRcdGxpbms6IGZ1bmN0aW9uKHNjb3BlLGVsZW1lbnQsYXR0cnMpe1xuXHRcdFx0Ly8kKCBcIiNzb3J0YWJsZVwiICkuc29ydGFibGUoKTtcblx0XHRcdC8vY29uc29sZS5sb2coc2NvcGUpXG5cdFx0XHQvL2NvbnNvbGUubG9nKGVsZW1lbnQpXG5cdFx0XHQvL2NvbnNvbGUubG9nKGF0dHJzKVxuXHRcdFx0Ly9lbGVtZW50LnNvcnRhYmxlKCk7XG5cdFx0XHQvL2NvbnNvbGUubG9nKHNjb3BlLm5vdGVzKVxuXHRcdFx0Ly9zY29wZS4kd2F0Y2goJ25vdGVzJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgLy8gYWxsIHRoZSBjb2RlIGhlcmUuLi5cbiAgICBcdFx0XG4gICAgXHRcdFxuXHRcdFx0XG5cblx0XHRcdGVsZW1lbnQuc29ydGFibGUoe1xuXHRcdFx0XHRjb25uZWN0V2l0aDogXCIuY29ubmVjdGVkU29ydGFibGVcIixcblx0XHQgICAgICAgLy9wbGFjZWhvbGRlcjogXCJ1aS1zdGF0ZS1oaWdobGlnaHRcIixcblx0XHQgICAgICAgIHN0YXJ0OiBmdW5jdGlvbihldmVudCwgdWkpIHtcblx0XHQgICAgICAgIFx0Y29uc29sZS5sb2coXCJTVEFSVCBTVEFSVCBTVEFSVCBTVEFSVCBTVEFSVFwiKVxuXHRcdCAgICAgICAgXHRjb25zb2xlLmxvZyhlbGVtZW50KVxuXHRcdCAgICAgICAgXHRjb25zb2xlLmxvZyh0ZW1wRGF0YSlcblx0XHQgICAgICAgIFx0XG5cblx0XHQgICAgICAgIFx0dGVtcERhdGEuc3RhcnROb3RlID0gYW5ndWxhci5jb3B5KHNjb3BlLm5vdGUpO1xuXHRcdCAgICAgICAgXHR0ZW1wRGF0YS5zdGFydE5vdGVJbmRleCA9IGF0dHJzLm5vdGVpbmRleDtcblx0XHRcdFx0XHR0ZW1wRGF0YS5zdGFydE5vdGVJdGVtSW5kZXggPSB1aS5pdGVtLmluZGV4KCk7XG5cdFx0XHRcdFx0dGVtcERhdGEuc3RhcnROb3RlSXRlbUNvbnRlbnQgPSB0ZW1wRGF0YS5zdGFydE5vdGUuaXRlbXNbdGVtcERhdGEuc3RhcnROb3RlSXRlbUluZGV4XTtcblx0XHQgICBcdFx0XHRcblx0XHQgICBcdFx0XHR0ZW1wTm90ZSA9IGFuZ3VsYXIuY29weShzY29wZS5ub3RlKVxuXHRcdCAgIFx0XHRcdGNvbnNvbGUubG9nKHRlbXBOb3RlKVxuXG5cdFx0ICAgICAgICB9LFxuXHRcdCAgICAgICAgdXBkYXRlOiBmdW5jdGlvbihldmVudCwgdWkpIHtcblxuXHRcdCAgICAgICAvLyBjb25zb2xlLmxvZyhzY29wZS50ZW1wRGF0YSlcdFxuXHQgICAgICAgICBcdGlmICghdWkuc2VuZGVyKSB7XHRcdCAgICAgICBcblx0XHRcdCAgICAgICAgIGNvbnNvbGUubG9nKFwiVVBEQVRFIFVQREFURSBVUERBVEUgVVBEQVRFIFVQREFURSBJTlNJREUgSUZcIiApXG5cblx0XHRcdCAgICAgICAgXG5cdFx0XHRcdFx0XHRcdFx0ICAgICAgICAgXG5cblx0XHRcdFx0XHR2YXIgc3RhcnRfcG9zID0gdGVtcERhdGEuc3RhcnROb3RlSXRlbUluZGV4O1xuXHRcdFx0XHRcdHZhciBlbmRfcG9zID0gdWkuaXRlbS5pbmRleCgpO1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKHN0YXJ0X3BvcyArICcgLSAnICsgZW5kX3Bvcyk7XG5cblx0XHRcdFx0XHR0ZW1wTm90ZS5pdGVtcy5zcGxpY2Uoc3RhcnRfcG9zLDEpXG5cdFx0XHRcdFx0dGVtcE5vdGUuaXRlbXMuc3BsaWNlKGVuZF9wb3MsMCwgdGVtcERhdGEuc3RhcnROb3RlSXRlbUNvbnRlbnQpXG5cdFx0XHRcdFx0Ly9zY29wZS5ub3RlID0gdGVtcE5vdGVcblx0XHRcdFx0XHRzY29wZS5ub3Rlc1t0ZW1wRGF0YS5zdGFydE5vdGVJbmRleF0gPSB0ZW1wTm90ZTtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhzY29wZS5ub3RlcylcblxuXHRcdFx0XHRcdHZhciByYXN0ID0ge1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyYWRzQG5qaXQuZWR1XCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcInMxXCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwibGF1bnNkcnlcIiwgXCJhcHNwbHkgam9ic1wiLCBcImdzeW1cIiBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjEvMS8yMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMS8yMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96c2UuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9XG5cblx0XHRcdFx0XHQvL3Njb3BlLm5vdGVzWzBdLml0ZW1zLnB1c2goXCJQVUNLU1wiKVxuXG5cdFx0XHRcdFx0c2NvcGUuJGFwcGx5KCk7XG5cblx0XHQgICAvLyAgICAgICAgIC8vY29uc29sZS5sb2coc2NvcGUubm90ZXMpXG5cdFx0XHQgICAgfSAgIFxuXHRcdCAgICAgICAgICAgXG5cdFx0ICAgICAgICB9LCAvL2VuZCB1cGRhdGVcblx0XHQgICAgICAgIHJlY2VpdmU6IGZ1bmN0aW9uKGV2ZW50LCB1aSl7XG5cdFx0ICAgICAgICBcdGNvbnNvbGUubG9nKFwiUkVDRUlWRSBSRUNFSVZFIFJFQ0VJVkUgUkVDRUlWRSBSRUNFSVZFXCIpXG5cdFx0ICAgICAgICBcdGNvbnNvbGUubG9nKHRlbXBEYXRhKVxuXG5cdFx0ICAgICAgICBcdHRlbXBEYXRhLmVuZE5vdGUgPSBhbmd1bGFyLmNvcHkoc2NvcGUubm90ZSk7XG5cdFx0ICAgICAgICBcdHRlbXBEYXRhLmVuZE5vdGVJbmRleCA9IGF0dHJzLm5vdGVpbmRleDtcblx0XHRcdFx0XHR0ZW1wRGF0YS5lbmROb3RlSXRlbUluZGV4ID0gdWkuaXRlbS5pbmRleCgpO1xuXG5cdFx0XHRcdFx0XG5cblx0XHRcdFx0XHQgIC8vY29uc29sZS5sb2coXCJyZW1vdmluZyBpdGVtOiBcIiArIHNjb3BlLm5vdGVzW25vdGVPcmlnaW5JbmRleF0uaXRlbXNbc3RhcnRfcG9zXSk7XG5cdFx0ICAgICAgICAgICB0ZW1wRGF0YS5zdGFydE5vdGUuaXRlbXMuc3BsaWNlKHRlbXBEYXRhLnN0YXJ0Tm90ZUl0ZW1JbmRleCwxKVxuXHRcdFx0ICAgICAgIHRlbXBEYXRhLmVuZE5vdGUuaXRlbXMuc3BsaWNlKHRlbXBEYXRhLmVuZE5vdGVJdGVtSW5kZXgsMCx0ZW1wRGF0YS5zdGFydE5vdGVJdGVtQ29udGVudClcblx0XHRcdCAgICAgICBjb25zb2xlLmxvZyh0ZW1wRGF0YSlcblxuXHRcdFx0ICAgICAgIHNjb3BlLm5vdGVzW3RlbXBEYXRhLnN0YXJ0Tm90ZUluZGV4XSA9IHRlbXBEYXRhLnN0YXJ0Tm90ZTtcblx0XHRcdCAgICAgICBzY29wZS5ub3Rlc1t0ZW1wRGF0YS5lbmROb3RlSW5kZXhdID0gdGVtcERhdGEuZW5kTm90ZTtcblx0ICAgICAgICAgICBcdFxuXHQgICAgICAgICAgIFx0XHRjb25zb2xlLmxvZyh0ZW1wRGF0YS5zdGFydE5vdGUuaXRlbXMpXG5cdCAgICAgICAgICAgXHRcdGNvbnNvbGUubG9nKHRlbXBEYXRhLmVuZE5vdGUuaXRlbXMpXG5cblx0XHQgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJhZGRpbmcgYWZ0ZXIgcG9zaXRpb246IFwiICsgZW5kX3Bvcylcblx0XHQgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJhZGRpbmcgYWZ0ZXI6IFwiICsgc2NvcGUubm90ZXNbbm90ZURlc3RpbmF0aW9uSW5kZXhdLml0ZW1zW2VuZF9wb3NdKVxuXHRcdCAgICAgICAgICAgLy9zY29wZS5ub3Rlc1tub3RlRGVzdGluYXRpb25JbmRleF0uaXRlbXMuc3BsaWNlKGVuZF9wb3MsMCwgc3RhcnRJdGVtKVxuXG5cdFx0ICAgICAgICBcdC8vc2NvcGUudGVtcERhdGEgPSBcInByYXduc1wiO1xuXHRcdCAgICAgICAgXHRcblx0XHQgICAgICAgIFx0XG5cdFx0ICAgICAgICBcdC8vIGNvbnNvbGUubG9nKHRlbXBEYXRhKVxuXHRcdCAgICAgICAgXHQvLyAvL2NvbnNvbGUubG9nKHNjb3BlLm5vdGUpO1xuXHRcdCAgICAgICAgXHR2YXIgcmFzdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMmFkc0Buaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJzMVwiLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImxhdW5zZHJ5XCIsIFwiYXBzcGx5IGpvYnNcIiwgXCJnc3ltXCIgXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIxLzEvMjIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjEvMjIvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvenNlLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICAgICAgfVxuXHRcdCAgICAgICAgXHRcblx0XHQgICAgICAgICAgIHNjb3BlLiRhcHBseSgpO1xuXHRcdFxuXG5cdFx0ICAgICAgICB9XG5cblx0XHQgICAgfSk7IC8vIGVuZCBzb3J0YWJsZVxuXG5cdFx0IC8vICB9KTsgLy9lbmQgd2F0Y2hcblxuXG5cblx0XHR9LFxuXHRcdGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSl7XG5cblx0XHRcdCRzY29wZS5tb29zZSA9IFwiZGluZ1wiXG5cdFx0XHQkc2NvcGUuZGVsZXRlSXRlbSA9IGZ1bmN0aW9uKHBhcmVudEluZGV4LCBpbmRleCl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKHBhcmVudEluZGV4KVxuXHRcdFx0XHRjb25zb2xlLmxvZyhpbmRleClcblx0XHRcdFx0JHNjb3BlLm5vdGVzW3BhcmVudEluZGV4XS5pdGVtcy5zcGxpY2UoaW5kZXgsMSlcblxuXHRcdFx0fVxuXG5cdFx0XHQkc2NvcGUucmFuZG9tSWQgPSBmdW5jdGlvbihpdGVtKXtcbiAgIFx0XHRcdCByZXR1cm4gXCJJRFwiICsgaXRlbSArIChNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogOTk5KSArIDEpKTtcblx0XHRcdH1cblx0XHRcdC8vYWxlcnQoXCJjb250cm9sbGVyXCIpO1xuXHRcdFx0Ly8gJHNjb3BlLmRvZ3MgPSAkc2NvcGUuZGF0YSArIFwiZG9nc1wiO1xuXHRcdFx0Ly8gaWYoJHNjb3BlLmRyYWdnYWJsZSlcblx0XHRcdC8vIFx0JHNjb3BlLmRyYWdTdGF0dXMgPSBmYWxzZTtcblx0XHRcdC8vIGVsc2UgJHNjb3BlLmRyYWdTdGF0dXMgPSB0cnVlO1xuXG5cdFx0XHRjb25zb2xlLmxvZygkc2NvcGUpXG5cblx0XHRcdFxuXHRcdH1cblx0fVxufSAvL2VuZCBub3RlY2FyZCBkaXJlY3RpdmVcblxuXG5cblxuXG4iLCIoZnVuY3Rpb24oKXtcblx0J3VzZSBzdHJpY3QnXG5cblx0YW5ndWxhclxuICAgIFx0Lm1vZHVsZSgnYnVkZ2V0JylcbiAgICBcdC5mYWN0b3J5KCdidWRnZXRTZXJ2aWNlJywgYnVkZ2V0U2VydmljZSk7XG5cbiAgICBidWRnZXRTZXJ2aWNlLiRpbmplY3QgPSBbJyRodHRwJ11cblxuICAgIGZ1bmN0aW9uIGJ1ZGdldFNlcnZpY2UoJGh0dHApIHtcbiAgICBcdHZhciBzZXJ2aWNlID0ge1xuXG4gICAgICAgICAgICBnZXROb3RlOiBnZXROb3RlLFxuICAgICAgICAgICAgZ2V0Tm90ZXM6IGdldE5vdGVzLFxuICAgICAgICAgICAgc2F2ZU5vdGVzOiBzYXZlTm90ZXNcblxuXG4gICAgXHR9O1xuXG4gICAgXHRyZXR1cm4gc2VydmljZTtcblxuICAgIFx0Ly8vLy8vLy8vLy8vXG5cbiAgICAgICAgLy8gZ2V0cyBhIHNpbmdsZSBub3RlXG4gICAgICAgIGZ1bmN0aW9uIGdldE5vdGUgKCkge1xuXG4gICAgICAgICAgICB2YXIgbm90ZSA9IHtcbiAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyQG5qaXQuZWR1XCIsXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwidG9kb1wiLFxuICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwibGF1bmRyeVwiLCBcImFwcGx5IGpvYnNcIiwgXCJneW1cIiBdLFxuICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMS8xLzIwMTZcIixcbiAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMS8yLzIwMTZcIixcbiAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvemUuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG5vdGU7XG5cbiAgICAgICAgfSAvL2VuZCBnZXROb3RlKClcblxuXG4gICAgICAgIC8vIGdldHMgYWxsIG5vdGVzXG4gICAgICAgIGZ1bmN0aW9uIGdldE5vdGVzICgpIHtcblxuICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnaHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaS9ub3Rlcy9nZXROb3Rlcycse2VtYWlsOlwibW9pekBnbWFpbC5jb21cIn0pXG4gICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIG5vdGVzID0gW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMkBuaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCIxXCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwibGF1bmRyeVwiLCBcImFwcGx5IGpvYnNcIiwgXCJneW1cIiBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjEvMS8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIxLzIvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvemUuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMkBuaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCIyXCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwiaHRtbDUgZHJhZyBhbmQgZHJvcFwiLCBcInNvY2tldC5pb1wiLCBcIm5vZGVqc1wiIF0sXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMi8xLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjIvMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96ZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyQG5qaXQuZWR1XCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIjNcIixcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJib3NlIGhlYWRwaG9uZXNcIiwgXCIyMDE2IGhvbmRhIGdyaWxsXCIsIFwic29saWQgc3RhdGUgaGFyZCBkcml2ZVwiIF0sXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMS8xLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjEvMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96ZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyQG5qaXQuZWR1XCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIjRcIixcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJsYXVuZHJ5XCIsIFwiYXBwbHkgam9ic1wiLCBcImd5bVwiIF0sXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMS8xLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjEvMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96ZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyQG5qaXQuZWR1XCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIjVcIixcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJodG1sNSBkcmFnIGFuZCBkcm9wXCIsIFwic29ja2V0LmlvXCIsIFwibm9kZWpzXCIgXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIyLzEvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMi8yLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3plLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiNlwiLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImJvc2UgaGVhZHBob25lc1wiLCBcIjIwMTYgaG9uZGEgZ3JpbGxcIiwgXCJzb2xpZCBzdGF0ZSBoYXJkIGRyaXZlXCIgXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIxLzEvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMS8yLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3plLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiN1wiLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImxhdW5kcnlcIiwgXCJhcHBseSBqb2JzXCIsIFwiZ3ltXCIsXCJib3NlIGhlYWRwaG9uZXNcIiwgXCIyMDE2IGhvbmRhIGdyaWxsXCIsIFwic29saWQgc3RhdGUgaGFyZCBkcml2ZVwiICBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjEvMS8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIxLzIvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvemUuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMkBuaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCI4XCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwiaHRtbDUgZHJhZyBhbmQgZHJvcFwiLCBcInNvY2tldC5pb1wiLCBcIm5vZGVqc1wiIF0sXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMi8xLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjIvMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96ZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyQG5qaXQuZWR1XCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIjlcIixcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJib3NlIGhlYWRwaG9uZXNcIiwgXCIyMDE2IGhvbmRhIGdyaWxsXCIsIFwic29saWQgc3RhdGUgaGFyZCBkcml2ZVwiLFwiaHRtbDUgZHJhZyBhbmQgZHJvcFwiLCBcInNvY2tldC5pb1wiLCBcIm5vZGVqc1wiICBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjEvMS8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIxLzIvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvemUuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdIC8vZW5kIG5vdGVzIGFycmF5XG5cbiAgICAgICAgICAgIC8vcmV0dXJuIG5vdGVzXG4gICAgICAgIH0gLy9lbmQgZ2V0IG5vdGVzXG5cbiAgICAgICAgZnVuY3Rpb24gc2F2ZU5vdGVzKG5vdGVzKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnaHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaS9ub3Rlcy91cGRhdGVOb3Rlcycse2VtYWlsOlwibW9pekBnbWFpbC5jb21cIixub3Rlczogbm90ZXN9KVxuICAgICAgICB9XG5cblxuXG4gICAgfVxuXG5cdFxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCdcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnbWVtYmVycycpXG5cdFx0LmNvbnRyb2xsZXIoJ21lbWJlcnNDdHJsJywgbWVtYmVyc0N0cmwpXG5cblx0bWVtYmVyc0N0cmwuJGluamVjdCA9IFsnJGh0dHAnXVxuXG5cdGZ1bmN0aW9uIG1lbWJlcnNDdHJsKCRodHRwKSB7XG5cblx0ICAgIHZhciB2bSA9IHRoaXM7XG5cblx0ICAgIHZtLm1lbWJlcnNDb250ZW50ID0gbWVtYmVyc0NvbnRlbnQoKTtcblx0ICAgIHZtLmdvdG9TZXNzaW9uID0gZ290b1Nlc3Npb247XG5cdCAgICB2bS5yZWZyZXNoID0gcmVmcmVzaDtcblx0ICAgIHZtLnNlYXJjaCA9IHNlYXJjaDtcblx0ICAgIHZtLnNlc3Npb25zID0gW107XG5cdCAgICB2bS50aXRsZSA9ICdtZW1iZXJzJztcblxuXHQgICAgLy8vLy8vLy8vLy8vXG5cblx0ICAgIGZ1bmN0aW9uIG1lbWJlcnNDb250ZW50KCl7XG5cdCAgICBcdCAvLyAkaHR0cC5nZXQoJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGkvdXNlcnMvYWxsJylcblx0ICAgIFx0XHQvLyAudGhlbihmdW5jdGlvbihyZXMpe1xuXHQgICAgXHRcdC8vIFx0Y29uc29sZS5sb2cocmVzLmRhdGEpXG5cdCAgICBcdFx0Ly8gXHR2bS5tZW1iZXJzQ29udGVudCA9IHJlcy5kYXRhO1xuXHQgICAgXHRcdC8vIH0sXG5cdCAgICBcdFx0Ly8gZnVuY3Rpb24oZXJyKXtcblx0ICAgIFx0XHQvLyBcdGNvbnNvbGUubG9nKGVyci5zdGF0dXMgKyBcIiBcIiArIGVyci5zdGF0dXNUZXh0KTtcblx0ICAgIFx0XHQvLyBcdHZtLm1lbWJlcnNDb250ZW50ID0gZXJyLmRhdGE7XG5cdCAgICBcdFx0Ly8gfSlcblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gZ290b1Nlc3Npb24oKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIHJlZnJlc2goKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIHNlYXJjaCgpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblx0fVxuXG59KSgpO1xuXG5cbiIsIihmdW5jdGlvbigpe1xuXHQndXNlIHN0cmljdCdcblxuXHRhbmd1bGFyXG4gICAgXHQubW9kdWxlKCdzYW1wbGUnKVxuICAgIFx0LmZhY3RvcnkoJ3NhbXBsZVNlcnZpY2UnLCBzYW1wbGVTZXJ2aWNlKTtcblxuICAgLy8gc2FtcGxlU2VydmljZS5pbmplY3QgPSBbJyddXG5cbiAgICBmdW5jdGlvbiBzYW1wbGVTZXJ2aWNlKCkge1xuICAgIFx0dmFyIHNlcnZpY2UgPSB7XG5cbiAgICBcdFx0ZXJyb3I6IGVycm9yLFxuICAgIFx0XHRpbmZvOiBpbmZvLFxuICAgIFx0XHRzdWNjZXNzOiBzdWNjZXNzXG5cbiAgICBcdH07XG5cbiAgICBcdHJldHVybiBzZXJ2aWNlO1xuXG4gICAgXHQvLy8vLy8vLy8vLy9cblxuICAgIFx0ZnVuY3Rpb24gZXJyb3IoKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIGluZm8oKSB7XG5cdCAgICAgIC8qICovXG4gICAgICAgICAgLy9jb25zb2xlLmxvZyhcInNhbXBsZVNlcnZpY2VcIik7XG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIHN1Y2Nlc3MoKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cblxuICAgIH1cblxuXHRcblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0J3VzZSBzdHJpY3QnXG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ25vdGVzJylcblx0XHQuY29udHJvbGxlcignbm90ZXNDdHJsJywgbm90ZXNDdHJsKVxuXG5cdG5vdGVzQ3RybC4kaW5qZWN0ID0gWydub3Rlc1NlcnZpY2UnLCckc2NvcGUnLCckaHR0cCcsJ3RvYXN0ciddXG5cblx0ZnVuY3Rpb24gbm90ZXNDdHJsKG5vdGVzU2VydmljZSwkc2NvcGUsICRodHRwLCB0b2FzdHIpIHtcblxuXHRcdGNvbnNvbGUubG9nKFwibm90ZXMgY3RybFwiKTtcblxuXHRcdC8vY29uc29sZS5sb2coIG5vdGVzU2VydmljZS5nZXROb3RlcygpIClcblx0XHRcblx0ICAgIHZhciB2bSA9IHRoaXM7XG5cblx0ICAgLy8gdm0ubm90ZXMgPSBub3Rlc1NlcnZpY2UuZ2V0Tm90ZXMoKTtcblx0ICAgdm0ubm90ZXMgPSBub3Rlc1NlcnZpY2UuZ2V0Tm90ZXMoKS50aGVuKGZ1bmN0aW9uKHJlcyl7XG4gICAgICAgICAgICAgICB2bS5ub3RlcyA9IHJlcy5kYXRhLm5vdGVzLm5vdGVzXG4gICAgICAgICAgICB9KVxuXG5cdCAgIHZtLnNhdmVOb3RlcyA9IGZ1bmN0aW9uKCl7XG5cdCAgIFx0bm90ZXNTZXJ2aWNlLnNhdmVOb3Rlcyh2bS5ub3RlcykudGhlbihmdW5jdGlvbihyZXMpe1xuICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzKVxuICAgICAgICAgICAgICAgaWYocmVzLmRhdGEuc3VjY2VzcyA9PSB0cnVlKXtcbiAgICAgICAgICAgICAgIFx0dG9hc3RyLnN1Y2Nlc3MoXCJOb3RlcyBTYXZlZFwiKVxuICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgIFx0dG9hc3RyLmVycm9yKFwic29ycnkgbm90ZXMgbm90IHNhdmVkXCIpXG4gICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuXHQgICB9XG5cdCAgICAvL2NvbnNvbGUubG9nKHZtLm5vdGVzWzBdLml0ZW1zWzBdKVxuXG5cdCAgICB2bS5nZXROb3Rlc0xpc3QgPSBmdW5jdGlvbigpe1xuXHQgICAgXHRcblx0ICAgIFx0Ly8kc2NvcGUuJGFwcGx5KCk7XG5cdCAgICBcdGNvbnNvbGUubG9nKFwiZnJvbSBjb250cm9sbGVyXCIpXG5cdCAgICBcdGNvbnNvbGUubG9nKCRzY29wZS5ub3Rlcylcblx0ICAgIFx0XG5cdCAgICB9XG5cblx0ICAgIHZtLnJlZnJlc2hCb2FyZCA9IGZ1bmN0aW9uKCl7XG5cdCAgICBcdCRzY29wZS4kYXBwbHkoKTtcblx0ICAgIFx0Y29uc29sZS5sb2coXCJSRUZSRVNISU5HLi4uLi4uLi4uLi4uLlwiKVxuXHQgICAgfVxuXG5cdCAgICB2bS5uZXdOb3RlID0ge31cblx0ICAgIHZtLm5ld05vdGUudGl0bGUgPSBudWxsO1xuXHQgICAgdm0ubmV3Tm90ZS5pdGVtcyA9IFtdXG5cdCAgICB2bS5hZGROb3RlID0gZnVuY3Rpb24oKXtcblx0ICAgIFx0dmFyIG5ld05vdGVDb3B5ID0gYW5ndWxhci5jb3B5KHZtLm5ld05vdGUpO1xuXHQgICAgXHR2bS5uZXdOb3RlLnRpdGxlID0gXCJcIjtcblx0ICAgIFx0dm0ubm90ZXMucHVzaChuZXdOb3RlQ29weSlcblx0ICAgIH1cblxuXG5cdCAgICBcblxuXHQgICAgdm0uZ290b1Nlc3Npb24gPSBnb3RvU2Vzc2lvbjtcblx0ICAgIHZtLnJlZnJlc2ggPSByZWZyZXNoO1xuXHQgICAgdm0uc2VhcmNoID0gc2VhcmNoO1xuXHQgICAgdm0uc2Vzc2lvbnMgPSBbXTtcblx0ICAgIHZtLnRpdGxlID0gJ25vdGVzJztcblxuXHQgICAgdm0uYWxlcnRMaXN0ID0gZnVuY3Rpb24oKXtcblx0ICAgIFx0dm0ubGlzdCA9IFtdXG5cdCAgICBcdGFuZ3VsYXIuZm9yRWFjaCh2bS5ub3RlcywgZnVuY3Rpb24obm90ZSkge1xuXHRcdFx0ICAvL2NvbnNvbGUubG9nKG5vdGUudGl0bGUpO1xuXHRcdFx0ICB2bS5saXN0LnB1c2gobm90ZS50aXRsZSlcblx0XHRcdH0pO1xuXHRcdFx0Y29uc29sZS5sb2codm0ubGlzdClcblx0ICAgIH1cblxuXG5cblx0ICAgIC8vLy8vLy8vLy8vL1xuXG5cdCAgICBmdW5jdGlvbiBnb3RvU2Vzc2lvbigpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gcmVmcmVzaCgpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gc2VhcmNoKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXHR9XG5cbn0pKCk7XG5cblxuIiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ25vdGVzJylcbiAgICAuZGlyZWN0aXZlKCdub3RlQ2FyZCcsIG5vdGVDYXJkKTtcblxuZnVuY3Rpb24gbm90ZUNhcmQoKSB7XG5cdHJldHVybntcblx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdHNjb3BlOiB7XG5cdFx0XHRkYXRhOiBcIj1cIixcblx0XHRcdGRyYWdnYWJsZTogXCI9XCJcblx0XHR9LFxuXHRcdHJlcGxhY2U6IHRydWUsXG5cdFx0dGVtcGxhdGU6IFwiPGgxPnt7ZG9nc319e3tkcmFnU3RhdHVzfX08L2gxPlwiLFxuXHRcdGxpbms6IGZ1bmN0aW9uKHNjb3BlLGVsZW1lbnQpe1xuXHRcdFx0ZWxlbWVudC5jbGljayhmdW5jdGlvbigpe1xuXHRcdFx0XHRjb25zb2xlLmxvZyhlbGVtZW50KVxuXHRcdFx0XHRlbGVtZW50WzBdLmRyYWdnYWJsZSA9IHRydWU7XG5cdFx0XHR9KVxuXHRcdH0sXG5cdFx0Y29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKXtcblx0XHRcdC8vYWxlcnQoXCJjb250cm9sbGVyXCIpO1xuXHRcdFx0JHNjb3BlLmRvZ3MgPSAkc2NvcGUuZGF0YSArIFwiZG9nc1wiO1xuXHRcdFx0aWYoJHNjb3BlLmRyYWdnYWJsZSlcblx0XHRcdFx0JHNjb3BlLmRyYWdTdGF0dXMgPSBmYWxzZTtcblx0XHRcdGVsc2UgJHNjb3BlLmRyYWdTdGF0dXMgPSB0cnVlO1xuXG5cdFx0XHRcblx0XHR9XG5cdH1cbn1cblxuXG5cbi8vIGFuZ3VsYXJcbi8vICAgICAubW9kdWxlKCdub3RlcycpXG4vLyAgICAgLmRpcmVjdGl2ZSgnbm90ZUNhcmQnLCBub3RlQ2FyZCk7XG5cbi8vIGZ1bmN0aW9uIG5vdGVDYXJkKCkge1xuLy8gXHRyZXR1cm57XG4vLyBcdFx0cmVzdHJpY3Q6ICdFJyxcbi8vIFx0XHRjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpe1xuLy8gXHRcdFx0YWxlcnQoXCJjb250cm9sbGVyXCIpO1xuLy8gXHRcdFx0Y29uc29sZS5sb2coJ2RvZycpXG4vLyBcdFx0fSxcbi8vIFx0XHR0ZW1wbGF0ZVVybDogJycsXG4vLyBcdFx0cmVwbGFjZTogdHJ1ZVxuLy8gXHRcdC8vIHNjb3BlOiB7fVxuLy8gXHR9XG4vLyB9IiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ25vdGVzJylcbiAgICAuZGlyZWN0aXZlKCdub3RlQ2FyZHMnLCBub3RlQ2FyZHMpXG5cblxuICAgIFxuXG5mdW5jdGlvbiBub3RlQ2FyZHMoKSB7XG5cdHJldHVybntcblx0XHRyZXN0cmljdDogJ0FFJyxcblx0XHRzY29wZToge1xuXHRcdFx0bm90ZXM6IFwiPVwiLFxuXHRcdFx0bmV3SXRlbTogXCI9XCJcblx0XHR9LFxuXHRcdHJlcGxhY2U6IGZhbHNlLFxuXHRcdHRyYW5zY2x1ZGU6IGZhbHNlLFxuXHRcdHRlbXBsYXRlVXJsOiBcImNvbXBvbmVudHMvbm90ZXMvdmlld3Mvbm90ZS5kaXJlY3RpdmUudmlldy5odG1sXCIsXG5cdFx0bGluazogZnVuY3Rpb24oc2NvcGUsZWxlbWVudCxhdHRycyl7XG5cdFx0XHQvLyQoIFwiI3NvcnRhYmxlXCIgKS5zb3J0YWJsZSgpO1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhzY29wZSlcblx0XHRcdC8vY29uc29sZS5sb2coZWxlbWVudClcblx0XHRcdC8vY29uc29sZS5sb2coYXR0cnMpXG5cdFx0XHQvL2VsZW1lbnQuc29ydGFibGUoKTtcblx0XHRcdC8vY29uc29sZS5sb2coc2NvcGUubm90ZXMpXG5cdFx0XHRzY29wZS5kb2dzID0gZnVuY3Rpb24obm90ZSl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKG5vdGUpXG5cdFx0XHR9XG5cblxuXHRcdFx0ZWxlbWVudC5zb3J0YWJsZSh7XG5cdFx0ICAgICAgIC8vIHBsYWNlaG9sZGVyOiBcInVpLXN0YXRlLWhpZ2hsaWdodFwiLFxuXHRcdCAgICAgICAgc3RhcnQ6IGZ1bmN0aW9uKGV2ZW50LCB1aSkge1xuXHRcdCAgICAgICAgICAgIHZhciBzdGFydF9wb3MgPSB1aS5pdGVtLmluZGV4KCk7XG5cdFx0ICAgICAgICAgICAgdWkuaXRlbS5kYXRhKCdzdGFydF9wb3MnLCBzdGFydF9wb3MpO1xuXHRcdCAgICAgICAgfSxcblx0XHQgICAgICAgIHVwZGF0ZTogZnVuY3Rpb24oZXZlbnQsIHVpKSB7XG5cdFx0ICAgICAgICAgICAgdmFyIHN0YXJ0X3BvcyA9IHVpLml0ZW0uZGF0YSgnc3RhcnRfcG9zJyk7XG5cdFx0ICAgICAgICAgICAgdmFyIGVuZF9wb3MgPSB1aS5pdGVtLmluZGV4KCk7XG5cdFx0ICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhzdGFydF9wb3MgKyAnIC0gJyArIGVuZF9wb3MpO1xuXHRcdCAgICAgICAgICBcblx0XHQgICAgICAgICAgdmFyIHN0YXJ0SXRlbSA9IHNjb3BlLm5vdGVzW3N0YXJ0X3Bvc107XG5cdFx0ICAgICAgICAgICBzY29wZS5ub3Rlcy5zcGxpY2Uoc3RhcnRfcG9zLDEpXG5cdFx0ICAgICAgICAgICBzY29wZS5ub3Rlcy5zcGxpY2UoZW5kX3BvcywwLCBzdGFydEl0ZW0pXG5cdFx0ICAgICAgICAgICBzY29wZS4kYXBwbHkoKTtcblxuXHRcdCAgICAgICAgICAgLy9jb25zb2xlLmxvZyhzY29wZS5ub3Rlcylcblx0XHQgICAgICAgICAgIFxuXHRcdCAgICAgICAgICAgXG5cdFx0ICAgICAgICB9XG5cdFx0ICAgIH0pOyAvLyBlbmQgc29ydGFibGVcblxuXHRcdCAgIFxuXG5cdFx0ICAgIGNvbnNvbGUubG9nKGVsZW1lbnQpXG5cblxuXHRcdH0sXG5cdFx0Y29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKXtcblx0XHRcdCRzY29wZS5mb3JtID17fVxuXHRcdFx0JHNjb3BlLmFkZEl0ZW0gPSBmdW5jdGlvbihpbmRleCxpdGVtKXtcblx0XHRcdFx0Ly9hbGVydChpbmRleClcblx0XHRcdFx0Y29uc29sZS5sb2coJHNjb3BlLm5ld0l0ZW0pXG5cdFx0XHRcdCRzY29wZS5ub3Rlc1tpbmRleF0uaXRlbXMucHVzaChpdGVtKVxuXHRcdFx0XHQkc2NvcGUuZm9ybSA9IHt9XG5cdFx0XHRcdC8vY29uc29sZS5sb2coJHNjb3BlLm5vdGVzW2luZGV4XS5pdGVtcylcblx0XHRcdH1cblxuXHRcdFx0JHNjb3BlLmRlbGV0ZU5vdGUgPSBmdW5jdGlvbihpbmRleCl7XG5cdFx0XHRcdCRzY29wZS5ub3Rlcy5zcGxpY2UoaW5kZXgsMSk7XG5cdFx0XHR9XG5cblxuXHRcdFx0Ly9hbGVydChcImNvbnRyb2xsZXJcIik7XG5cdFx0XHQvLyAkc2NvcGUuZG9ncyA9ICRzY29wZS5kYXRhICsgXCJkb2dzXCI7XG5cdFx0XHQvLyBpZigkc2NvcGUuZHJhZ2dhYmxlKVxuXHRcdFx0Ly8gXHQkc2NvcGUuZHJhZ1N0YXR1cyA9IGZhbHNlO1xuXHRcdFx0Ly8gZWxzZSAkc2NvcGUuZHJhZ1N0YXR1cyA9IHRydWU7XG5cblx0XHRcdFxuXHRcdH1cblx0fVxufSAvL2VuZCBub3RlY2FyZHMgZGlyZWN0aXZlXG5cbmFuZ3VsYXJcblx0Lm1vZHVsZSgnbm90ZXMnKVxuXHQuZGlyZWN0aXZlKCdub3RlQ2FyZCcsIG5vdGVDYXJkKVxuXG5mdW5jdGlvbiBub3RlQ2FyZCgpIHtcblxuXHR2YXIgdGVtcERhdGEgPSB7fTtcblx0dmFyIHRlbXBOb3RlID0gbnVsbDtcblxuXHRyZXR1cm57XG5cdFx0cmVzdHJpY3Q6ICdBRScsXG5cdFx0c2NvcGU6IHtcblx0XHRcdG5vdGU6IFwiPVwiLFxuXHRcdFx0bm90ZXM6IFwiPVwiXG5cdFx0fSxcblx0XHRyZXBsYWNlOiB0cnVlLFxuXHRcdHRyYW5zY2x1ZGU6IGZhbHNlLFxuXHRcdHRlbXBsYXRlVXJsOiBcImNvbXBvbmVudHMvbm90ZXMvdmlld3Mvbm90ZXMuaXRlbXMudmlldy5odG1sXCIsXG5cdFx0bGluazogZnVuY3Rpb24oc2NvcGUsZWxlbWVudCxhdHRycyl7XG5cdFx0XHQvLyQoIFwiI3NvcnRhYmxlXCIgKS5zb3J0YWJsZSgpO1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhzY29wZSlcblx0XHRcdC8vY29uc29sZS5sb2coZWxlbWVudClcblx0XHRcdC8vY29uc29sZS5sb2coYXR0cnMpXG5cdFx0XHQvL2VsZW1lbnQuc29ydGFibGUoKTtcblx0XHRcdC8vY29uc29sZS5sb2coc2NvcGUubm90ZXMpXG5cdFx0XHQvL3Njb3BlLiR3YXRjaCgnbm90ZXMnLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAvLyBhbGwgdGhlIGNvZGUgaGVyZS4uLlxuICAgIFx0XHRcbiAgICBcdFx0XG5cdFx0XHRcblxuXHRcdFx0ZWxlbWVudC5zb3J0YWJsZSh7XG5cdFx0XHRcdGNvbm5lY3RXaXRoOiBcIi5jb25uZWN0ZWRTb3J0YWJsZVwiLFxuXHRcdCAgICAgICAvL3BsYWNlaG9sZGVyOiBcInVpLXN0YXRlLWhpZ2hsaWdodFwiLFxuXHRcdCAgICAgICAgc3RhcnQ6IGZ1bmN0aW9uKGV2ZW50LCB1aSkge1xuXHRcdCAgICAgICAgXHRjb25zb2xlLmxvZyhcIlNUQVJUIFNUQVJUIFNUQVJUIFNUQVJUIFNUQVJUXCIpXG5cdFx0ICAgICAgICBcdGNvbnNvbGUubG9nKGVsZW1lbnQpXG5cdFx0ICAgICAgICBcdGNvbnNvbGUubG9nKHRlbXBEYXRhKVxuXHRcdCAgICAgICAgXHRcblxuXHRcdCAgICAgICAgXHR0ZW1wRGF0YS5zdGFydE5vdGUgPSBhbmd1bGFyLmNvcHkoc2NvcGUubm90ZSk7XG5cdFx0ICAgICAgICBcdHRlbXBEYXRhLnN0YXJ0Tm90ZUluZGV4ID0gYXR0cnMubm90ZWluZGV4O1xuXHRcdFx0XHRcdHRlbXBEYXRhLnN0YXJ0Tm90ZUl0ZW1JbmRleCA9IHVpLml0ZW0uaW5kZXgoKTtcblx0XHRcdFx0XHR0ZW1wRGF0YS5zdGFydE5vdGVJdGVtQ29udGVudCA9IHRlbXBEYXRhLnN0YXJ0Tm90ZS5pdGVtc1t0ZW1wRGF0YS5zdGFydE5vdGVJdGVtSW5kZXhdO1xuXHRcdCAgIFx0XHRcdFxuXHRcdCAgIFx0XHRcdHRlbXBOb3RlID0gYW5ndWxhci5jb3B5KHNjb3BlLm5vdGUpXG5cdFx0ICAgXHRcdFx0Y29uc29sZS5sb2codGVtcE5vdGUpXG5cblx0XHQgICAgICAgIH0sXG5cdFx0ICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uKGV2ZW50LCB1aSkge1xuXG5cdFx0ICAgICAgIC8vIGNvbnNvbGUubG9nKHNjb3BlLnRlbXBEYXRhKVx0XG5cdCAgICAgICAgIFx0aWYgKCF1aS5zZW5kZXIpIHtcdFx0ICAgICAgIFxuXHRcdFx0ICAgICAgICAgY29uc29sZS5sb2coXCJVUERBVEUgVVBEQVRFIFVQREFURSBVUERBVEUgVVBEQVRFIElOU0lERSBJRlwiIClcblxuXHRcdFx0ICAgICAgICBcblx0XHRcdFx0XHRcdFx0XHQgICAgICAgICBcblxuXHRcdFx0XHRcdHZhciBzdGFydF9wb3MgPSB0ZW1wRGF0YS5zdGFydE5vdGVJdGVtSW5kZXg7XG5cdFx0XHRcdFx0dmFyIGVuZF9wb3MgPSB1aS5pdGVtLmluZGV4KCk7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coc3RhcnRfcG9zICsgJyAtICcgKyBlbmRfcG9zKTtcblxuXHRcdFx0XHRcdHRlbXBOb3RlLml0ZW1zLnNwbGljZShzdGFydF9wb3MsMSlcblx0XHRcdFx0XHR0ZW1wTm90ZS5pdGVtcy5zcGxpY2UoZW5kX3BvcywwLCB0ZW1wRGF0YS5zdGFydE5vdGVJdGVtQ29udGVudClcblx0XHRcdFx0XHQvL3Njb3BlLm5vdGUgPSB0ZW1wTm90ZVxuXHRcdFx0XHRcdHNjb3BlLm5vdGVzW3RlbXBEYXRhLnN0YXJ0Tm90ZUluZGV4XSA9IHRlbXBOb3RlO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKHNjb3BlLm5vdGVzKVxuXG5cdFx0XHRcdFx0dmFyIHJhc3QgPSB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJhZHNAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiczFcIixcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJsYXVuc2RyeVwiLCBcImFwc3BseSBqb2JzXCIsIFwiZ3N5bVwiIF0sXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMS8xLzIyMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIxLzIyLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3pzZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgICAgIH1cblxuXHRcdFx0XHRcdC8vc2NvcGUubm90ZXNbMF0uaXRlbXMucHVzaChcIlBVQ0tTXCIpXG5cblx0XHRcdFx0XHRzY29wZS4kYXBwbHkoKTtcblxuXHRcdCAgIC8vICAgICAgICAgLy9jb25zb2xlLmxvZyhzY29wZS5ub3Rlcylcblx0XHRcdCAgICB9ICAgXG5cdFx0ICAgICAgICAgICBcblx0XHQgICAgICAgIH0sIC8vZW5kIHVwZGF0ZVxuXHRcdCAgICAgICAgcmVjZWl2ZTogZnVuY3Rpb24oZXZlbnQsIHVpKXtcblx0XHQgICAgICAgIFx0Y29uc29sZS5sb2coXCJSRUNFSVZFIFJFQ0VJVkUgUkVDRUlWRSBSRUNFSVZFIFJFQ0VJVkVcIilcblx0XHQgICAgICAgIFx0Y29uc29sZS5sb2codGVtcERhdGEpXG5cblx0XHQgICAgICAgIFx0dGVtcERhdGEuZW5kTm90ZSA9IGFuZ3VsYXIuY29weShzY29wZS5ub3RlKTtcblx0XHQgICAgICAgIFx0dGVtcERhdGEuZW5kTm90ZUluZGV4ID0gYXR0cnMubm90ZWluZGV4O1xuXHRcdFx0XHRcdHRlbXBEYXRhLmVuZE5vdGVJdGVtSW5kZXggPSB1aS5pdGVtLmluZGV4KCk7XG5cblx0XHRcdFx0XHRcblxuXHRcdFx0XHRcdCAgLy9jb25zb2xlLmxvZyhcInJlbW92aW5nIGl0ZW06IFwiICsgc2NvcGUubm90ZXNbbm90ZU9yaWdpbkluZGV4XS5pdGVtc1tzdGFydF9wb3NdKTtcblx0XHQgICAgICAgICAgIHRlbXBEYXRhLnN0YXJ0Tm90ZS5pdGVtcy5zcGxpY2UodGVtcERhdGEuc3RhcnROb3RlSXRlbUluZGV4LDEpXG5cdFx0XHQgICAgICAgdGVtcERhdGEuZW5kTm90ZS5pdGVtcy5zcGxpY2UodGVtcERhdGEuZW5kTm90ZUl0ZW1JbmRleCwwLHRlbXBEYXRhLnN0YXJ0Tm90ZUl0ZW1Db250ZW50KVxuXHRcdFx0ICAgICAgIGNvbnNvbGUubG9nKHRlbXBEYXRhKVxuXG5cdFx0XHQgICAgICAgc2NvcGUubm90ZXNbdGVtcERhdGEuc3RhcnROb3RlSW5kZXhdID0gdGVtcERhdGEuc3RhcnROb3RlO1xuXHRcdFx0ICAgICAgIHNjb3BlLm5vdGVzW3RlbXBEYXRhLmVuZE5vdGVJbmRleF0gPSB0ZW1wRGF0YS5lbmROb3RlO1xuXHQgICAgICAgICAgIFx0XG5cdCAgICAgICAgICAgXHRcdGNvbnNvbGUubG9nKHRlbXBEYXRhLnN0YXJ0Tm90ZS5pdGVtcylcblx0ICAgICAgICAgICBcdFx0Y29uc29sZS5sb2codGVtcERhdGEuZW5kTm90ZS5pdGVtcylcblxuXHRcdCAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImFkZGluZyBhZnRlciBwb3NpdGlvbjogXCIgKyBlbmRfcG9zKVxuXHRcdCAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImFkZGluZyBhZnRlcjogXCIgKyBzY29wZS5ub3Rlc1tub3RlRGVzdGluYXRpb25JbmRleF0uaXRlbXNbZW5kX3Bvc10pXG5cdFx0ICAgICAgICAgICAvL3Njb3BlLm5vdGVzW25vdGVEZXN0aW5hdGlvbkluZGV4XS5pdGVtcy5zcGxpY2UoZW5kX3BvcywwLCBzdGFydEl0ZW0pXG5cblx0XHQgICAgICAgIFx0Ly9zY29wZS50ZW1wRGF0YSA9IFwicHJhd25zXCI7XG5cdFx0ICAgICAgICBcdFxuXHRcdCAgICAgICAgXHRcblx0XHQgICAgICAgIFx0Ly8gY29uc29sZS5sb2codGVtcERhdGEpXG5cdFx0ICAgICAgICBcdC8vIC8vY29uc29sZS5sb2coc2NvcGUubm90ZSk7XG5cdFx0ICAgICAgICBcdHZhciByYXN0ID0ge1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyYWRzQG5qaXQuZWR1XCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcInMxXCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwibGF1bnNkcnlcIiwgXCJhcHNwbHkgam9ic1wiLCBcImdzeW1cIiBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjEvMS8yMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMS8yMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96c2UuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9XG5cdFx0ICAgICAgICBcdFxuXHRcdCAgICAgICAgICAgc2NvcGUuJGFwcGx5KCk7XG5cdFx0XG5cblx0XHQgICAgICAgIH1cblxuXHRcdCAgICB9KTsgLy8gZW5kIHNvcnRhYmxlXG5cblx0XHQgLy8gIH0pOyAvL2VuZCB3YXRjaFxuXG5cblxuXHRcdH0sXG5cdFx0Y29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKXtcblxuXHRcdFx0JHNjb3BlLm1vb3NlID0gXCJkaW5nXCJcblx0XHRcdCRzY29wZS5kZWxldGVJdGVtID0gZnVuY3Rpb24ocGFyZW50SW5kZXgsIGluZGV4KXtcblx0XHRcdFx0Y29uc29sZS5sb2cocGFyZW50SW5kZXgpXG5cdFx0XHRcdGNvbnNvbGUubG9nKGluZGV4KVxuXHRcdFx0XHQkc2NvcGUubm90ZXNbcGFyZW50SW5kZXhdLml0ZW1zLnNwbGljZShpbmRleCwxKVxuXG5cdFx0XHR9XG5cblx0XHRcdCRzY29wZS5yYW5kb21JZCA9IGZ1bmN0aW9uKGl0ZW0pe1xuICAgXHRcdFx0IHJldHVybiBcIklEXCIgKyBpdGVtICsgKE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiA5OTkpICsgMSkpO1xuXHRcdFx0fVxuXHRcdFx0Ly9hbGVydChcImNvbnRyb2xsZXJcIik7XG5cdFx0XHQvLyAkc2NvcGUuZG9ncyA9ICRzY29wZS5kYXRhICsgXCJkb2dzXCI7XG5cdFx0XHQvLyBpZigkc2NvcGUuZHJhZ2dhYmxlKVxuXHRcdFx0Ly8gXHQkc2NvcGUuZHJhZ1N0YXR1cyA9IGZhbHNlO1xuXHRcdFx0Ly8gZWxzZSAkc2NvcGUuZHJhZ1N0YXR1cyA9IHRydWU7XG5cblx0XHRcdGNvbnNvbGUubG9nKCRzY29wZSlcblxuXHRcdFx0XG5cdFx0fVxuXHR9XG59IC8vZW5kIG5vdGVjYXJkIGRpcmVjdGl2ZVxuXG5cblxuXG5cbiIsIihmdW5jdGlvbigpe1xuXHQndXNlIHN0cmljdCdcblxuXHRhbmd1bGFyXG4gICAgXHQubW9kdWxlKCdub3RlcycpXG4gICAgXHQuZmFjdG9yeSgnbm90ZXNTZXJ2aWNlJywgbm90ZXNTZXJ2aWNlKTtcblxuICAgIG5vdGVzU2VydmljZS4kaW5qZWN0ID0gWyckaHR0cCddXG5cbiAgICBmdW5jdGlvbiBub3Rlc1NlcnZpY2UoJGh0dHApIHtcbiAgICBcdHZhciBzZXJ2aWNlID0ge1xuXG4gICAgICAgICAgICBnZXROb3RlOiBnZXROb3RlLFxuICAgICAgICAgICAgZ2V0Tm90ZXM6IGdldE5vdGVzLFxuICAgICAgICAgICAgc2F2ZU5vdGVzOiBzYXZlTm90ZXNcblxuXG4gICAgXHR9O1xuXG4gICAgXHRyZXR1cm4gc2VydmljZTtcblxuICAgIFx0Ly8vLy8vLy8vLy8vXG5cbiAgICAgICAgLy8gZ2V0cyBhIHNpbmdsZSBub3RlXG4gICAgICAgIGZ1bmN0aW9uIGdldE5vdGUgKCkge1xuXG4gICAgICAgICAgICB2YXIgbm90ZSA9IHtcbiAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyQG5qaXQuZWR1XCIsXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwidG9kb1wiLFxuICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwibGF1bmRyeVwiLCBcImFwcGx5IGpvYnNcIiwgXCJneW1cIiBdLFxuICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMS8xLzIwMTZcIixcbiAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMS8yLzIwMTZcIixcbiAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvemUuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG5vdGU7XG5cbiAgICAgICAgfSAvL2VuZCBnZXROb3RlKClcblxuXG4gICAgICAgIC8vIGdldHMgYWxsIG5vdGVzXG4gICAgICAgIGZ1bmN0aW9uIGdldE5vdGVzICgpIHtcblxuICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnaHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaS9ub3Rlcy9nZXROb3Rlcycse2VtYWlsOlwibW9pekBnbWFpbC5jb21cIn0pXG4gICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIG5vdGVzID0gW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMkBuaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCIxXCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwibGF1bmRyeVwiLCBcImFwcGx5IGpvYnNcIiwgXCJneW1cIiBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjEvMS8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIxLzIvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvemUuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMkBuaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCIyXCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwiaHRtbDUgZHJhZyBhbmQgZHJvcFwiLCBcInNvY2tldC5pb1wiLCBcIm5vZGVqc1wiIF0sXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMi8xLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjIvMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96ZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyQG5qaXQuZWR1XCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIjNcIixcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJib3NlIGhlYWRwaG9uZXNcIiwgXCIyMDE2IGhvbmRhIGdyaWxsXCIsIFwic29saWQgc3RhdGUgaGFyZCBkcml2ZVwiIF0sXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMS8xLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjEvMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96ZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyQG5qaXQuZWR1XCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIjRcIixcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJsYXVuZHJ5XCIsIFwiYXBwbHkgam9ic1wiLCBcImd5bVwiIF0sXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMS8xLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjEvMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96ZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyQG5qaXQuZWR1XCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIjVcIixcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJodG1sNSBkcmFnIGFuZCBkcm9wXCIsIFwic29ja2V0LmlvXCIsIFwibm9kZWpzXCIgXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIyLzEvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMi8yLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3plLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiNlwiLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImJvc2UgaGVhZHBob25lc1wiLCBcIjIwMTYgaG9uZGEgZ3JpbGxcIiwgXCJzb2xpZCBzdGF0ZSBoYXJkIGRyaXZlXCIgXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIxLzEvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMS8yLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3plLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiN1wiLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImxhdW5kcnlcIiwgXCJhcHBseSBqb2JzXCIsIFwiZ3ltXCIsXCJib3NlIGhlYWRwaG9uZXNcIiwgXCIyMDE2IGhvbmRhIGdyaWxsXCIsIFwic29saWQgc3RhdGUgaGFyZCBkcml2ZVwiICBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjEvMS8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIxLzIvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvemUuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMkBuaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCI4XCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwiaHRtbDUgZHJhZyBhbmQgZHJvcFwiLCBcInNvY2tldC5pb1wiLCBcIm5vZGVqc1wiIF0sXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMi8xLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjIvMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96ZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyQG5qaXQuZWR1XCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIjlcIixcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJib3NlIGhlYWRwaG9uZXNcIiwgXCIyMDE2IGhvbmRhIGdyaWxsXCIsIFwic29saWQgc3RhdGUgaGFyZCBkcml2ZVwiLFwiaHRtbDUgZHJhZyBhbmQgZHJvcFwiLCBcInNvY2tldC5pb1wiLCBcIm5vZGVqc1wiICBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjEvMS8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIxLzIvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvemUuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdIC8vZW5kIG5vdGVzIGFycmF5XG5cbiAgICAgICAgICAgIC8vcmV0dXJuIG5vdGVzXG4gICAgICAgIH0gLy9lbmQgZ2V0IG5vdGVzXG5cbiAgICAgICAgZnVuY3Rpb24gc2F2ZU5vdGVzKG5vdGVzKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnaHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaS9ub3Rlcy91cGRhdGVOb3Rlcycse2VtYWlsOlwibW9pekBnbWFpbC5jb21cIixub3Rlczogbm90ZXN9KVxuICAgICAgICB9XG5cblxuXG4gICAgfVxuXG5cdFxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCdcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnbm90ZXMnKVxuXHRcdC5jb250cm9sbGVyKCdub3Rlc0N0cmwnLCBub3Rlc0N0cmwpXG5cblx0bm90ZXNDdHJsLiRpbmplY3QgPSBbJ25vdGVzU2VydmljZSddXG5cblx0ZnVuY3Rpb24gbm90ZXNDdHJsKG5vdGVzU2VydmljZSkge1xuXG5cdFx0Y29uc29sZS5sb2coXCJub3RlcyBjdHJsXCIpO1xuXG5cdFx0Ly9jb25zb2xlLmxvZyggbm90ZXNTZXJ2aWNlLmdldE5vdGVzKCkgKVxuXHRcdFxuXHQgICAgdmFyIHZtID0gdGhpcztcblxuXHQgICAgdm0ubm90ZXMgPSBub3Rlc1NlcnZpY2UuZ2V0Tm90ZXMoKTtcblx0ICAgIHZtLmRyYWdkYXRhID0ge3N0YXJ0Tm90ZVBvczogbnVsbCwgIHN0YXJ0SXRlbVBvczogbnVsbCwgZW5kTm90ZVBvczogbnVsbCwgZW5kSXRlbVBvczogbnVsbH1cblx0ICAgIC8vY29uc29sZS5sb2codm0ubm90ZXNbMF0uaXRlbXNbMF0pXG5cblxuXHQgICAgdm0uZHJhZ3N0YXJ0ID0gZnVuY3Rpb24gKCkge1xuXHQgICAgXHRjb25zb2xlLmxvZyhcImRyYWcgc3RhcnRlZFwiKVxuXHQgICAgfVxuXG5cdCAgICB2bS5nb3RvU2Vzc2lvbiA9IGdvdG9TZXNzaW9uO1xuXHQgICAgdm0ucmVmcmVzaCA9IHJlZnJlc2g7XG5cdCAgICB2bS5zZWFyY2ggPSBzZWFyY2g7XG5cdCAgICB2bS5zZXNzaW9ucyA9IFtdO1xuXHQgICAgdm0udGl0bGUgPSAnbm90ZXMnO1xuXG5cblx0ICAgIHZtLmFsZXJ0TGlzdCA9IGZ1bmN0aW9uKCl7XG5cdCAgICBcdHZtLmxpc3QgPSBbXVxuXHQgICAgXHRhbmd1bGFyLmZvckVhY2godm0ubm90ZXMsIGZ1bmN0aW9uKG5vdGUpIHtcblx0XHRcdCAgLy9jb25zb2xlLmxvZyhub3RlLnRpdGxlKTtcblx0XHRcdCAgdm0ubGlzdC5wdXNoKG5vdGUudGl0bGUpXG5cdFx0XHR9KTtcblx0XHRcdGNvbnNvbGUubG9nKHZtLmxpc3QpXG5cdCAgICB9XG5cblxuXG5cdCAgICAvLy8vLy8vLy8vLy9cblxuXHQgICAgZnVuY3Rpb24gZ290b1Nlc3Npb24oKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIHJlZnJlc2goKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIHNlYXJjaCgpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblx0fVxuXG59KSgpO1xuXG5cbiIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdub3RlcycpXG4gICAgLmRpcmVjdGl2ZSgnbm90ZUNhcmQnLCBub3RlQ2FyZCk7XG5cbmZ1bmN0aW9uIG5vdGVDYXJkKCkge1xuXHRyZXR1cm57XG5cdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRzY29wZToge1xuXHRcdFx0ZGF0YTogXCI9XCIsXG5cdFx0XHRkcmFnZ2FibGU6IFwiPVwiXG5cdFx0fSxcblx0XHRyZXBsYWNlOiB0cnVlLFxuXHRcdHRlbXBsYXRlOiBcIjxoMT57e2RvZ3N9fXt7ZHJhZ1N0YXR1c319PC9oMT5cIixcblx0XHRsaW5rOiBmdW5jdGlvbihzY29wZSxlbGVtZW50KXtcblx0XHRcdGVsZW1lbnQuY2xpY2soZnVuY3Rpb24oKXtcblx0XHRcdFx0Y29uc29sZS5sb2coZWxlbWVudClcblx0XHRcdFx0ZWxlbWVudFswXS5kcmFnZ2FibGUgPSB0cnVlO1xuXHRcdFx0fSlcblx0XHR9LFxuXHRcdGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSl7XG5cdFx0XHQvL2FsZXJ0KFwiY29udHJvbGxlclwiKTtcblx0XHRcdCRzY29wZS5kb2dzID0gJHNjb3BlLmRhdGEgKyBcImRvZ3NcIjtcblx0XHRcdGlmKCRzY29wZS5kcmFnZ2FibGUpXG5cdFx0XHRcdCRzY29wZS5kcmFnU3RhdHVzID0gZmFsc2U7XG5cdFx0XHRlbHNlICRzY29wZS5kcmFnU3RhdHVzID0gdHJ1ZTtcblxuXHRcdFx0XG5cdFx0fVxuXHR9XG59XG5cblxuXG4vLyBhbmd1bGFyXG4vLyAgICAgLm1vZHVsZSgnbm90ZXMnKVxuLy8gICAgIC5kaXJlY3RpdmUoJ25vdGVDYXJkJywgbm90ZUNhcmQpO1xuXG4vLyBmdW5jdGlvbiBub3RlQ2FyZCgpIHtcbi8vIFx0cmV0dXJue1xuLy8gXHRcdHJlc3RyaWN0OiAnRScsXG4vLyBcdFx0Y29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKXtcbi8vIFx0XHRcdGFsZXJ0KFwiY29udHJvbGxlclwiKTtcbi8vIFx0XHRcdGNvbnNvbGUubG9nKCdkb2cnKVxuLy8gXHRcdH0sXG4vLyBcdFx0dGVtcGxhdGVVcmw6ICcnLFxuLy8gXHRcdHJlcGxhY2U6IHRydWVcbi8vIFx0XHQvLyBzY29wZToge31cbi8vIFx0fVxuLy8gfSIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdub3RlcycpXG4gICAgLmRpcmVjdGl2ZSgnbm90ZUNhcmRzJywgbm90ZUNhcmRzKVxuICAgIFxuXG5mdW5jdGlvbiBub3RlQ2FyZHMoKSB7XG5cdHJldHVybntcblx0XHRyZXN0cmljdDogJ0FFJyxcblx0XHRzY29wZToge1xuXHRcdFx0bm90ZXM6IFwiPVwiLFxuXHRcdFx0ZHJhZ2RhdGE6IFwiPVwiXG5cdFx0fSxcblx0XHRyZXBsYWNlOiBmYWxzZSxcblx0XHR0cmFuc2NsdWRlOiB0cnVlLFxuXHRcdHRlbXBsYXRlVXJsOiBcImNvbXBvbmVudHMvbm90ZXMvdmlld3Mvbm90ZS5kaXJlY3RpdmUudmlldy5odG1sXCIsXG5cdFx0bGluazogZnVuY3Rpb24oc2NvcGUsZWxlbWVudCxhdHRycyl7XG5cdFx0XHQvLyQoIFwiI3NvcnRhYmxlXCIgKS5zb3J0YWJsZSgpO1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhzY29wZSlcblx0XHRcdC8vY29uc29sZS5sb2coZWxlbWVudClcblx0XHRcdC8vY29uc29sZS5sb2coYXR0cnMpXG5cdFx0XHQvL2VsZW1lbnQuc29ydGFibGUoKTtcblx0XHRcdC8vY29uc29sZS5sb2coc2NvcGUubm90ZXMpXG5cdFx0XHRzY29wZS5kb2dzID0gZnVuY3Rpb24obm90ZSl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKG5vdGUpXG5cdFx0XHR9XG5cblx0XHRcdGVsZW1lbnQuc29ydGFibGUoe1xuXHRcdCAgICAgICAvLyBwbGFjZWhvbGRlcjogXCJ1aS1zdGF0ZS1oaWdobGlnaHRcIixcblxuXHRcdCAgICAgICAgc3RhcnQ6IGZ1bmN0aW9uKGV2ZW50LCB1aSkge1xuXHRcdCAgICAgICAgICAgIHZhciBzdGFydF9wb3MgPSB1aS5pdGVtLmluZGV4KCk7XG5cdFx0ICAgICAgICAgICAgdWkuaXRlbS5kYXRhKCdzdGFydF9wb3MnLCBzdGFydF9wb3MpO1xuXHRcdCAgICAgICAgICAgIGNvbnNvbGUubG9nKHNjb3BlLmRyYWdkYXRhKVxuXHRcdCAgICAgICAgICAgIC8vY29uc29sZS5sb2coYXR0cnMuZHJhZ2RhdGEpXG5cdFx0ICAgICAgICB9LFxuXHRcdCAgICAgICAgdXBkYXRlOiBmdW5jdGlvbihldmVudCwgdWkpIHtcblx0XHQgICAgICAgICAgICB2YXIgc3RhcnRfcG9zID0gdWkuaXRlbS5kYXRhKCdzdGFydF9wb3MnKTtcblx0XHQgICAgICAgICAgICB2YXIgZW5kX3BvcyA9IHVpLml0ZW0uaW5kZXgoKTtcblx0XHQgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHN0YXJ0X3BvcyArICcgLSAnICsgZW5kX3Bvcyk7XG5cdFx0ICAgICAgICAgIFxuXHRcdCAgICAgICAgICB2YXIgc3RhcnRJdGVtID0gc2NvcGUubm90ZXNbc3RhcnRfcG9zXTtcblx0XHQgICAgICAgICAgIHNjb3BlLm5vdGVzLnNwbGljZShzdGFydF9wb3MsMSlcblx0XHQgICAgICAgICAgIHNjb3BlLm5vdGVzLnNwbGljZShlbmRfcG9zLDAsIHN0YXJ0SXRlbSlcblx0XHQgICAgICAgICAgIHNjb3BlLiRhcHBseSgpO1xuXG5cdFx0ICAgICAgICAgICAvL2NvbnNvbGUubG9nKHNjb3BlLm5vdGVzKVxuXHRcdCAgICAgICAgICAgXG5cdFx0ICAgICAgICAgICBcblx0XHQgICAgICAgIH1cblx0XHQgICAgfSk7IC8vIGVuZCBzb3J0YWJsZVxuXG5cdFx0ICAgXG5cblx0XHQgICAgY29uc29sZS5sb2coZWxlbWVudClcblxuXG5cdFx0fSxcblx0XHRjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpe1xuXHRcdFx0Ly9hbGVydChcImNvbnRyb2xsZXJcIik7XG5cdFx0XHQvLyAkc2NvcGUuZG9ncyA9ICRzY29wZS5kYXRhICsgXCJkb2dzXCI7XG5cdFx0XHQvLyBpZigkc2NvcGUuZHJhZ2dhYmxlKVxuXHRcdFx0Ly8gXHQkc2NvcGUuZHJhZ1N0YXR1cyA9IGZhbHNlO1xuXHRcdFx0Ly8gZWxzZSAkc2NvcGUuZHJhZ1N0YXR1cyA9IHRydWU7XG5cblx0XHRcdFxuXHRcdH1cblx0fVxufSAvL2VuZCBub3RlY2FyZHMgZGlyZWN0aXZlXG5cbmFuZ3VsYXJcblx0Lm1vZHVsZSgnbm90ZXMnKVxuXHQuZGlyZWN0aXZlKCdub3RlQ2FyZCcsIG5vdGVDYXJkKVxuXG5mdW5jdGlvbiBub3RlQ2FyZCgpIHtcblx0cmV0dXJue1xuXHRcdHJlc3RyaWN0OiAnQUUnLFxuXHRcdHNjb3BlOiB7XG5cdFx0XHRub3RlOiBcIj1cIixcblx0XHRcdG5vdGVzOiBcIj1cIixcblx0XHRcdGRyYWdkYXRhOiBcIj1cIlxuXHRcdH0sXG5cdFx0cmVwbGFjZTogdHJ1ZSxcblx0XHR0cmFuc2NsdWRlOiBmYWxzZSxcblx0XHR0ZW1wbGF0ZVVybDogXCJjb21wb25lbnRzL25vdGVzL3ZpZXdzL25vdGVzLml0ZW1zLnZpZXcuaHRtbFwiLFxuXHRcdGxpbms6IGZ1bmN0aW9uKHNjb3BlLGVsZW1lbnQsYXR0cnMpe1xuXHRcdFx0Ly8kKCBcIiNzb3J0YWJsZVwiICkuc29ydGFibGUoKTtcblx0XHRcdC8vY29uc29sZS5sb2coc2NvcGUpXG5cdFx0XHRjb25zb2xlLmxvZyhlbGVtZW50KVxuXHRcdFx0Ly9jb25zb2xlLmxvZyhhdHRycylcblx0XHRcdC8vZWxlbWVudC5zb3J0YWJsZSgpO1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhzY29wZS5ub3Rlcylcblx0XHRcdFxuXG5cdFx0XHRlbGVtZW50LnNvcnRhYmxlKHtcblx0XHQgICAgICAgLy9wbGFjZWhvbGRlcjogXCJ1aS1zdGF0ZS1oaWdobGlnaHRcIixcblx0XHQgICAgICAgY29ubmVjdFdpdGg6IFwiLmNvbm5lY3RlZFNvcnRhYmxlXCIsXG5cblx0XHQgICAgICAgIHN0YXJ0OiBmdW5jdGlvbihldmVudCwgdWkpIHtcblx0XHQgICAgICAgIFx0Y29uc29sZS5sb2coXCJTVEFSVCBGVU5DVElPTiBTVEFSVCBGVU5DVElPTiBTVEFSVCBGVU5DVElPTiBTVEFSVCBGVU5DVElPTiBcIilcblx0XHQgICAgICAgIFx0Y29uc29sZS5sb2coXCJTVEFSVCBGVU5DVElPTiBTVEFSVCBGVU5DVElPTiBTVEFSVCBGVU5DVElPTiBTVEFSVCBGVU5DVElPTiBcIilcblx0XHQgIFx0XHRcdFxuXHRcdCAgXHRcdFx0Ly9jbGVhciBkcmFnZGF0YSBmcm9tIG5vdGVzLmNvbnRyb2xsZXJcblx0XHQgICAgICAgXHRcdHNjb3BlLmRyYWdkYXRhID0ge3N0YXJ0Tm90ZVBvczogbnVsbCwgIHN0YXJ0SXRlbVBvczogbnVsbCwgZW5kTm90ZVBvczogbnVsbCwgZW5kSXRlbVBvczogbnVsbH1cblx0XHQgICAgICAgXHRcdFxuXG5cdFx0ICAgICAgIFx0XHQvL3NldCBzdGFydCBub3RlIGFuZCBzdGFydCBpdGVtIHBvc2l0aW9uXG5cdFx0ICAgICAgICBcdHNjb3BlLmRyYWdkYXRhLnN0YXJ0Tm90ZVBvcyA9IGF0dHJzLm5vdGVpbmRleDtcblx0XHQgICAgICAgICAgICBzY29wZS5kcmFnZGF0YS5zdGFydEl0ZW1Qb3MgPSB1aS5pdGVtLmluZGV4KCk7XG5cdFx0ICAgICAgICAgICAgLy9sb2cgZGF0YVxuXG5cdFx0ICAgICAgICAgICAgIHZhciBzdGFydF9wb3MgPSB1aS5pdGVtLmluZGV4KCk7XG4gICAgICAgICAgXHRcdFx0IHVpLml0ZW0uZGF0YSgnc3RhcnRfcG9zJywgc3RhcnRfcG9zKTtcblx0XHQgICAgICAgICAgICAvL3Njb3BlLiRhcHBseSgpO1xuXHRcdCAgICAgICAgICAgIGNvbnNvbGUubG9nKHNjb3BlLmRyYWdkYXRhKVxuXG5cblx0XHQgICAgICAgIH0sXG5cdFx0ICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uKGV2ZW50LCB1aSkge1xuXHRcdCAgICAgICAgXHQvL29ubHkgZm9yIGNoYW5nZXMgd2l0aGluIG93biBsaXN0XG5cdFx0ICAgICAgICBcdGNvbnNvbGUubG9nKFwiVVBEQVRFIEZVTkNUSU9OIFVQREFURSBGVU5DVElPTiBVUERBVEUgRlVOQ1RJT04gVVBEQVRFIEZVTkNUSU9OIFwiKVxuXHRcdCAgICAgICAgXHRjb25zb2xlLmxvZyhcIlVQREFURSBGVU5DVElPTiBVUERBVEUgRlVOQ1RJT04gVVBEQVRFIEZVTkNUSU9OIFVQREFURSBGVU5DVElPTiBcIilcblxuXHRcdFx0ICAgICAgICBzY29wZS5kcmFnZGF0YS5lbmRJdGVtUG9zID0gdWkuaXRlbS5pbmRleCgpO1xuXG5cblx0XHQgICAgICAgIFx0XHRjb25zb2xlLmxvZyhcIkVYRUNVVElORyBVUERBVEUgRlVOQ1RJT04gRVhFQ1VUSU5HIFVQREFURSBGVU5DVElPTiBFWEVDVVRJTkcgVVBEQVRFIEZVTkNUSU9OXCIpXG5cdFx0ICAgICAgICBcdFx0Y29uc29sZS5sb2coc2NvcGUuZHJhZ2RhdGEpXG5cblx0XHRcdCAgICAgICAgICAgdmFyIHN0YXJ0SXRlbSA9IHNjb3BlLm5vdGUuaXRlbXNbc2NvcGUuZHJhZ2RhdGEuc3RhcnRJdGVtUG9zXTtcblxuXHRcdFx0ICAgICAgICAgICB2YXIgc3RhcnRfcG9zID0gdWkuaXRlbS5kYXRhKCdzdGFydF9wb3MnKTtcbiAgICAgICAgICBcdFx0XHQgICB2YXIgZW5kX3BvcyA9IHVpLml0ZW0uaW5kZXgoKTtcblxuXHRcdFx0ICAgICAgICAgICBzY29wZS5ub3RlLml0ZW1zLnNwbGljZShzdGFydF9wb3MsMSlcbiAgICAgICAgICBcdFx0XHQgICBzY29wZS5ub3RlLml0ZW1zLnNwbGljZShlbmRfcG9zLDAsIHN0YXJ0SXRlbSlcblx0XHRcdCAgICAgICAgICAgc2NvcGUuJGFwcGx5KCk7XHRcblxuXHRcdCAgICAgICAgICAgXG5cdFx0ICAgICAgICB9LC8vZW5kIHVwZGF0ZVxuXHRcdCAgICAgICAgIGRvZzogZnVuY3Rpb24oZXZlbnQsIHVpKSB7XG5cdFx0ICAgICAgICAgXHRjb25zb2xlLmxvZyhcIlJFQ0VJVkUgRlVOQ1RJT04gUkVDRUlWRSBGVU5DVElPTiBSRUNFSVZFIEZVTkNUSU9OIFJFQ0VJVkUgRlVOQ1RJT04gXCIpXG5cdFx0ICAgICAgICBcdGNvbnNvbGUubG9nKFwiUkVDRUlWRSBGVU5DVElPTiBSRUNFSVZFIEZVTkNUSU9OIFJFQ0VJVkUgRlVOQ1RJT04gUkVDRUlWRSBGVU5DVElPTiBcIilcblx0XHQgICAgICAgIFx0Y29uc29sZS5sb2coc2NvcGUuZHJhZ2RhdGEpXG5cdFx0ICAgICAgICBcdGNvbnNvbGUubG9nKGF0dHJzLm5vdGVpbmRleClcblxuXHRcdCAgICAgICAgXHQgICB2YXIgc3RhcnRJdGVtID0gc2NvcGUubm90ZS5pdGVtc1tzY29wZS5kcmFnZGF0YS5zdGFydEl0ZW1Qb3NdO1xuXHRcdCAgICAgICAgXHQgICB2YXIgc3RhcnROb3RlUG9zID0gc2NvcGUuZHJhZ2RhdGEuc3RhcnROb3RlUG9zO1xuXHRcdCAgICAgICAgXHQgICBzY29wZS5kcmFnZGF0YS5lbmRJdGVtUG9zID0gdWkuaXRlbS5pbmRleCgpO1xuXHRcdCAgICAgICAgXHQgICBzY29wZS5kcmFnZGF0YS5lbmROb3RlUG9zID0gYXR0cnMubm90ZWluZGV4O1xuXG5cdFx0ICAgICAgICBcdCAgIGNvbnNvbGUubG9nKHN0YXJ0Tm90ZVBvcylcblx0XHRcdCAgICAgICAgICAgc2NvcGUubm90ZXNbc3RhcnROb3RlUG9zXS5pdGVtcy5zcGxpY2Uoc2NvcGUuZHJhZ2RhdGEuc3RhcnRJdGVtUG9zLDEpXG5cdFx0XHQgICAgICAgICAgIHNjb3BlLm5vdGVzW3Njb3BlLmRyYWdkYXRhLmVuZE5vdGVQb3NdLml0ZW1zLnNwbGljZShzY29wZS5kcmFnZGF0YS5lbmRJdGVtUG9zLDAsIHN0YXJ0SXRlbSlcblx0XHRcdCAgICAgICAgICAgXG5cblxuXHRcdFx0ICAgICAgICAgICBzY29wZS4kYXBwbHkoKTtcblxuXG5cdFx0ICAgICAgICBcdFxuXHRcdCAgICAgICAgfSwvL2VuZCByZWNlaXZlXG5cblxuXHRcdCAgICB9KTsgLy8gZW5kIHNvcnRhYmxlXG5cdFx0XG5cdFx0fSxcblx0XHRjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpe1xuXHRcdFx0Ly9hbGVydChcImNvbnRyb2xsZXJcIik7XG5cdFx0XHQvLyAkc2NvcGUuZG9ncyA9ICRzY29wZS5kYXRhICsgXCJkb2dzXCI7XG5cdFx0XHQvLyBpZigkc2NvcGUuZHJhZ2dhYmxlKVxuXHRcdFx0Ly8gXHQkc2NvcGUuZHJhZ1N0YXR1cyA9IGZhbHNlO1xuXHRcdFx0Ly8gZWxzZSAkc2NvcGUuZHJhZ1N0YXR1cyA9IHRydWU7XG5cblx0XHRcdFx0XG5cdFx0fVxuXHR9XG59IC8vZW5kIG5vdGVjYXJkIGRpcmVjdGl2ZVxuXG5cblxuXG5cbiIsIihmdW5jdGlvbigpe1xuXHQndXNlIHN0cmljdCdcblxuXHRhbmd1bGFyXG4gICAgXHQubW9kdWxlKCdub3RlcycpXG4gICAgXHQuZmFjdG9yeSgnbm90ZXNTZXJ2aWNlJywgbm90ZXNTZXJ2aWNlKTtcblxuICAgIG5vdGVzU2VydmljZS4kaW5qZWN0ID0gW11cblxuICAgIGZ1bmN0aW9uIG5vdGVzU2VydmljZSgpIHtcbiAgICBcdHZhciBzZXJ2aWNlID0ge1xuXG4gICAgICAgICAgICBnZXROb3RlOiBnZXROb3RlLFxuICAgICAgICAgICAgZ2V0Tm90ZXM6IGdldE5vdGVzXG5cblxuICAgIFx0fTtcblxuICAgIFx0cmV0dXJuIHNlcnZpY2U7XG5cbiAgICBcdC8vLy8vLy8vLy8vL1xuXG4gICAgICAgIC8vIGdldHMgYSBzaW5nbGUgbm90ZVxuICAgICAgICBmdW5jdGlvbiBnZXROb3RlICgpIHtcblxuICAgICAgICAgICAgdmFyIG5vdGUgPSB7XG4gICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMkBuaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgIHRpdGxlOiBcInRvZG9cIixcbiAgICAgICAgICAgICAgICBpdGVtczogWyBcImxhdW5kcnlcIiwgXCJhcHBseSBqb2JzXCIsIFwiZ3ltXCIgXSxcbiAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjEvMS8yMDE2XCIsXG4gICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjEvMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3plLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBub3RlO1xuXG4gICAgICAgIH0gLy9lbmQgZ2V0Tm90ZSgpXG5cblxuICAgICAgICAvLyBnZXRzIGFsbCBub3Rlc1xuICAgICAgICBmdW5jdGlvbiBnZXROb3RlcyAoKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBub3RlcyA9IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiMVwiLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImxhdW5kcnlcIiwgXCJhcHBseSBqb2JzXCIsIFwiZ3ltXCIgXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIxLzEvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMS8yLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3plLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiMlwiLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImh0bWw1IGRyYWcgYW5kIGRyb3BcIiwgXCJzb2NrZXQuaW9cIiwgXCJub2RlanNcIiBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjIvMS8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIyLzIvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvemUuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMkBuaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCIzXCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwiYm9zZSBoZWFkcGhvbmVzXCIsIFwiMjAxNiBob25kYSBncmlsbFwiLCBcInNvbGlkIHN0YXRlIGhhcmQgZHJpdmVcIiBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjEvMS8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIxLzIvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvemUuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMkBuaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCI0XCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwibGF1bmRyeVwiLCBcImFwcGx5IGpvYnNcIiwgXCJneW1cIiBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjEvMS8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIxLzIvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvemUuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMkBuaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCI1XCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwiaHRtbDUgZHJhZyBhbmQgZHJvcFwiLCBcInNvY2tldC5pb1wiLCBcIm5vZGVqc1wiIF0sXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMi8xLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjIvMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96ZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyQG5qaXQuZWR1XCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIjZcIixcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJib3NlIGhlYWRwaG9uZXNcIiwgXCIyMDE2IGhvbmRhIGdyaWxsXCIsIFwic29saWQgc3RhdGUgaGFyZCBkcml2ZVwiIF0sXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMS8xLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjEvMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96ZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyQG5qaXQuZWR1XCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIjdcIixcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJsYXVuZHJ5XCIsIFwiYXBwbHkgam9ic1wiLCBcImd5bVwiLFwiYm9zZSBoZWFkcGhvbmVzXCIsIFwiMjAxNiBob25kYSBncmlsbFwiLCBcInNvbGlkIHN0YXRlIGhhcmQgZHJpdmVcIiAgXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIxLzEvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMS8yLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3plLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICAgICAgfSAgXG4gICAgICAgICAgICBdIC8vZW5kIG5vdGVzIGFycmF5XG5cbiAgICAgICAgICAgIHJldHVybiBub3Rlc1xuICAgICAgICB9XG5cblxuXG4gICAgfVxuXG5cdFxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCdcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnbm90aWZ5Jylcblx0XHQuY29udHJvbGxlcignbm90aWZ5Q3RybCcsIG5vdGlmeUN0cmwpXG5cblx0Ly8gbm90aWZ5Q3RybC4kaW5qZWN0ID0gW11cblxuXHRmdW5jdGlvbiBub3RpZnlDdHJsKCkge1xuXG5cdCAgICB2YXIgdm0gPSB0aGlzO1xuXG5cdCAgICB2bS5nb3RvU2Vzc2lvbiA9IGdvdG9TZXNzaW9uO1xuXHQgICAgdm0ucmVmcmVzaCA9IHJlZnJlc2g7XG5cdCAgICB2bS5zZWFyY2ggPSBzZWFyY2g7XG5cdCAgICB2bS5zZXNzaW9ucyA9IFtdO1xuXHQgICAgdm0udGl0bGUgPSAnbm90aWZ5JztcblxuXHQgICAgLy8vLy8vLy8vLy8vXG5cblx0ICAgIFxuXG5cdCAgICBmdW5jdGlvbiBnb3RvU2Vzc2lvbigpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gcmVmcmVzaCgpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gc2VhcmNoKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXHR9XG5cbn0pKCk7XG5cblxuIiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ25vdGlmeScpXG4gICAgLmRpcmVjdGl2ZSgnbm90aWZ5Jywgbm90aWZ5KVxuXG4gICAgbm90aWZ5LiRpbmplY3QgPSBbJ25vdGlmeVNlcnZpY2UnLCckcm9vdFNjb3BlJywnJHRpbWVvdXQnXVxuICAgIFxuXG5mdW5jdGlvbiBub3RpZnkoKSB7XG5cdHJldHVybntcblx0XHRyZXN0cmljdDogJ0FFJyxcblx0XHR0ZW1wbGF0ZTogJzxsaSBuZy1yZXBlYXQ9XCJpdGVtIGluIG5vdGlmeUxpc3RcIj57e2l0ZW19fTwvbGk+Jyxcblx0XHRsaW5rOiBmdW5jdGlvbihzY29wZSxlbGVtZW50LGF0dHJzKXtcblxuXHRcdHZhciBsaSA9IGFuZ3VsYXIuZWxlbWVudChlbGVtZW50LmNoaWxkcmVuKClbMF0pXG5cdFx0Y29uc29sZS5sb2cobGkpXG5cdFx0XG5cdFx0YW5pbWF0ZURvd24gPSBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdhbmltYXRpbmcnKVxuICAgICAgICAgICAgJCh0aGlzKS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICB0b3A6ICcrPTk5J1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgYW5pbWF0ZVJpZ2h0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIFx0Y29uc29sZS5sb2coJ2FuaW1hdGluZycpXG4gICAgICAgICAgICAkKHRoaXMpLmFuaW1hdGUoe1xuICAgICAgICAgICAgXHRcbiAgICAgICAgICAgICAgICBsZWZ0OiAnKz01MCdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgICQobGkpLm9uKCdjbGljaycsIGFuaW1hdGVSaWdodCk7XG4gICAgICAgLy8gJChsaSkub24oJ2NsaWNrJywgYW5pbWF0ZVJpZ2h0KTsgIFxuXHRcdCAgICAgXHRcdFxuXHRcdFx0XG5cdFx0XHQgICAgXG5cblxuXG5cdFx0fSxcblx0XHRjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUsbm90aWZ5U2VydmljZSwkcm9vdFNjb3BlLCR0aW1lb3V0KXtcblx0XHRcdGNvbnNvbGUubG9nKCdub3RpZnkgZGlyZWN0aXZlJylcblx0XHRcdFxuXHRcdFx0JHNjb3BlLm5vdGlmeUxpc3QgPSBbXCJkb2dzXCIsXCJjYXRzXCJdO1x0XHRcdFxuXG5cdFx0XHQgJHJvb3RTY29wZS4kb24oJ3B1c2hlZCcsZnVuY3Rpb24oZXZlbnQsbWVzc2FnZSl7XG5cdFx0XHQgXHRjb25zb2xlLmxvZyhcImRpcmVjdGl2ZTogcmVjZWl2aW5nXCIpO1xuXHRcdFx0IFx0JHNjb3BlLm5vdGlmeUxpc3QucHVzaChtZXNzYWdlLmRhdGEpO1xuXHRcdFx0IFx0XHRcdFx0IFx0JHNjb3BlLiRhcHBseSgpO1xuXHRcdFx0IFx0Ly8gJHRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdCBcdC8vIFx0JHNjb3BlLmRhdGEgPSBudWxsO1xuXHRcdFx0IFx0Ly8gfSwzMDAwKVxuXG5cdFx0XHQgfSlcblx0XHRcdFxuXHRcdH1cblx0fVxufSAvL2VuZCBub3RpZnkgZGlyZWN0aXZlXG4iLCIoZnVuY3Rpb24oKXtcbiAgICAndXNlIHN0cmljdCdcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnbm90aWZ5JylcbiAgICAgICAgLmZhY3RvcnkoJ25vdGlmeVNlcnZpY2UnLCBub3RpZnlTZXJ2aWNlKTtcblxuICAgIG5vdGlmeVNlcnZpY2UuJGluamVjdCA9IFsnJHJvb3RTY29wZSddXG5cbiAgICBmdW5jdGlvbiBub3RpZnlTZXJ2aWNlKCRyb290U2NvcGUpIHtcbiAgICAgICAgdmFyIHNlcnZpY2UgPSB7XG5cbiAgICAgICAgICAgIHB1c2g6IHB1c2gsXG5cblxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBzZXJ2aWNlO1xuXG4gICAgICAgIC8vLy8vLy8vLy8vL1xuXG4gICAgICAgIGZ1bmN0aW9uIHB1c2gobWVzc2FnZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJwdXNoaW5nIGZyb20gc2VydmljZVwiKTtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGVtaXQoXCJwdXNoZWRcIiwgbWVzc2FnZSk7XG5cbiAgICAgICAgfVxuXG5cblxuICAgIH1cblxuICAgIFxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCdcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgncmVnaXN0ZXInKVxuXHRcdC5jb250cm9sbGVyKCdyZWdpc3RlckN0cmwnLCByZWdpc3RlckN0cmwpXG5cblx0cmVnaXN0ZXJDdHJsLmluamVjdCA9IFsndG9hc3RyJywnJGh0dHAnLCdyZWdpc3RlclNlcnZpY2UnXVxuXG5cdGZ1bmN0aW9uIHJlZ2lzdGVyQ3RybCh0b2FzdHIsJGh0dHAscmVnaXN0ZXJTZXJ2aWNlKSB7XG5cblx0ICAgIHZhciB2bSA9IHRoaXM7XG5cblx0ICAgIHZtLmZvcm0gPSB7fVxuXHQgICAgdm0uc3VibWl0U3RhdHVzID0gXCJcIjtcblx0ICAgIHZtLnN1Ym1pdEZvcm0gPSBzdWJtaXRGb3JtO1xuXHQgICAgXG5cdCAgICAvL2Rpc3BsYXkgaW5mbyBvbiBsb2FkXG5cdCAgICBpbmZvKCk7XG5cblx0ICAgIC8vLy8vLy8vLy8vL1xuXG5cdCAgICBmdW5jdGlvbiBzdWJtaXRGb3JtKGlzVmFsaWQpIHtcblx0ICAgIFx0XG5cdCAgICBcdGNvbnNvbGUubG9nKHZtLmZvcm0pO1xuXHQgICAgXHRcblx0ICAgIFx0Ly8gY2hlY2sgdG8gbWFrZSBzdXJlIHRoZSBmb3JtIGlzIGNvbXBsZXRlbHkgdmFsaWRcblx0XHQgICAgaWYgKGlzVmFsaWQpIHtcblx0XHQgICAgICBjb25zb2xlLmxvZyhcIlZhbGlkIEZvcm1cIik7XG5cdFx0ICAgICAgc2VuZEZvcm0odm0uZm9ybSk7XG5cdFx0ICAgIH1cblx0ICAgIH1cblxuXHQgICAgLy9zZW5kcyBmb3JtIHRvIGFwaVxuXHQgICAgZnVuY3Rpb24gc2VuZEZvcm0oZm9ybSkge1xuXHRcdFx0cmVnaXN0ZXJTZXJ2aWNlLm5ld1VzZXIodm0sZm9ybSlcblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gaW5mbygpIHtcblx0ICAgICAgLyogKi9cblx0ICAgICAgY29uc29sZS5sb2coXCJyZWdpc3RlciBjb250cm9sbGVyXCIpXG5cdCAgICB9XG5cblx0fVxuXG59KSgpO1xuXG5cbiIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdyZWdpc3RlcicpXG4gICAgLmRpcmVjdGl2ZSgncmVnaXN0ZXJEaXInLCByZWdpc3RlckRpcik7XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyRGlyKCkge1xuXHRyZXR1cm57XG5cdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHR0ZW1wbGF0ZVVybDogJycsXG5cdFx0cmVwbGFjZTogdHJ1ZVxuXHRcdC8vIHNjb3BlOiB7fVxuXHR9XG59IiwiKGZ1bmN0aW9uKCl7XG5cdCd1c2Ugc3RyaWN0J1xuXG5cdGFuZ3VsYXJcbiAgICBcdC5tb2R1bGUoJ3JlZ2lzdGVyJylcbiAgICBcdC5mYWN0b3J5KCdyZWdpc3RlclNlcnZpY2UnLCByZWdpc3RlclNlcnZpY2UpO1xuXG4gICAgcmVnaXN0ZXJTZXJ2aWNlLmluamVjdCA9IFsnJGh0dHAnLCd0b2FzdHInLCdhdXRoU2VydmljZScsJyRzdGF0ZScsJyRyb290U2NvcGUnXVxuXG4gICAgZnVuY3Rpb24gcmVnaXN0ZXJTZXJ2aWNlKCRodHRwLHRvYXN0cixhdXRoU2VydmljZSwkc3RhdGUsJHJvb3RTY29wZSkge1xuICAgIFx0dmFyIHNlcnZpY2UgPSB7XG5cbiAgICAgICAgICAgIG5ld1VzZXI6IG5ld1VzZXIsXG4gICAgXHRcdGVycm9yOiBlcnJvcixcbiAgICBcdFx0aW5mbzogaW5mbyxcbiAgICBcdFx0c3VjY2Vzczogc3VjY2Vzc1xuXG4gICAgXHR9O1xuXG4gICAgXHRyZXR1cm4gc2VydmljZTtcblxuICAgIFx0Ly8vLy8vLy8vLy8vXG5cbiAgICAgICAgZnVuY3Rpb24gbmV3VXNlcih2bSwgZm9ybSkge1xuICAgICAgICAgICAgJGh0dHAucG9zdCgnaHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaS91c2Vycy9uZXdVc2VyJywgZm9ybSlcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlcykge1xuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgYXV0aFNlcnZpY2Uuc2V0VG9rZW4ocmVzLmRhdGEudG9rZW4pO1xuXG4gICAgICAgICAgICAgIC8vdG9hc3RcbiAgICAgICAgICAgICAgdG9hc3RyLnN1Y2Nlc3MoJ1lvdSBhcmUgbm93IG15IEJldGEhJyk7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG5cbiAgICAgICAgICAgICAgLy9jaGFuZ2Ugc3RhdHVzIG9uIHZpZXdcbiAgICAgICAgICAgICAgdm0uc3VibWl0U3RhdHVzID0gXCJTdWNjZXNzXCI7XG4gICAgICAgICAgICAgXG4gICAgICAgICAgICAgIC8vZW1wdHkgZm9ybVxuICAgICAgICAgICAgICB2bS5mb3JtID0gXCJcIjtcblxuICAgICAgICAgICAgICAvL3JlZGlyZWN0XG4gICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLm1lbWJlcnMnKTtcblxuICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRlbWl0KFwibG9nZ2VkSW5cIik7XG5cbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgICB0b2FzdHIuZXJyb3IoJ0ZhaWxlZDogJyArIGVyci5kYXRhKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICBcdGZ1bmN0aW9uIGVycm9yKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBpbmZvKCkge1xuXHQgICAgICAvKiAqL1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwicmVnaXN0ZXJTZXJ2aWNlXCIpO1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBzdWNjZXNzKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXG5cbiAgICB9XG5cblx0XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0J1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCdzYW1wbGUnKVxuXHRcdC5jb250cm9sbGVyKCdzYW1wbGVDdHJsJywgc2FtcGxlQ3RybClcblxuXHRzYW1wbGVDdHJsLiRpbmplY3QgPSBbXVxuXG5cdGZ1bmN0aW9uIHNhbXBsZUN0cmwoKSB7XG5cblx0ICAgIHZhciB2bSA9IHRoaXM7XG5cblx0ICAgIHZtLmdvdG9TZXNzaW9uID0gZ290b1Nlc3Npb247XG5cdCAgICB2bS5yZWZyZXNoID0gcmVmcmVzaDtcblx0ICAgIHZtLnNlYXJjaCA9IHNlYXJjaDtcblx0ICAgIHZtLnNlc3Npb25zID0gW107XG5cdCAgICB2bS50aXRsZSA9ICdTYW1wbGUnO1xuXG5cdCAgICAvLy8vLy8vLy8vLy9cblxuXHQgICAgZnVuY3Rpb24gZ290b1Nlc3Npb24oKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIHJlZnJlc2goKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIHNlYXJjaCgpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblx0fVxuXG59KSgpO1xuXG5cbiIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdzYW1wbGUnKVxuICAgIC5kaXJlY3RpdmUoJ3NhbXBsZURpcicsIHNhbXBsZURpcik7XG5cbmZ1bmN0aW9uIHNhbXBsZURpcigpIHtcblx0cmV0dXJue1xuXHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0dGVtcGxhdGVVcmw6ICcnLFxuXHRcdHJlcGxhY2U6IHRydWVcblx0XHQvLyBzY29wZToge31cblx0fVxufSIsIihmdW5jdGlvbigpe1xuXHQndXNlIHN0cmljdCdcblxuXHRhbmd1bGFyXG4gICAgXHQubW9kdWxlKCdzYW1wbGUnKVxuICAgIFx0LmZhY3RvcnkoJ3NhbXBsZVNlcnZpY2UnLCBzYW1wbGVTZXJ2aWNlKTtcblxuICAgIHNhbXBsZVNlcnZpY2UuJGluamVjdCA9IFtdXG5cbiAgICBmdW5jdGlvbiBzYW1wbGVTZXJ2aWNlKCkge1xuICAgIFx0dmFyIHNlcnZpY2UgPSB7XG5cbiAgICBcdFx0ZXJyb3I6IGVycm9yLFxuICAgIFx0XHRpbmZvOiBpbmZvLFxuICAgIFx0XHRzdWNjZXNzOiBzdWNjZXNzXG5cbiAgICBcdH07XG5cbiAgICBcdHJldHVybiBzZXJ2aWNlO1xuXG4gICAgXHQvLy8vLy8vLy8vLy9cblxuICAgIFx0ZnVuY3Rpb24gZXJyb3IoKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIGluZm8oKSB7XG5cdCAgICAgIC8qICovXG4gICAgICAgICAgY29uc29sZS5sb2coXCJzYW1wbGVTZXJ2aWNlXCIpO1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBzdWNjZXNzKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXG5cbiAgICB9XG5cblx0XG5cbn0pKCk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
