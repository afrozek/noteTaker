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

	navCtrl.inject = ['$window','$rootScope']

	function navCtrl($window, $rootScope) {
		
		//console.log('nav controller');

	    var vm = this;
	    vm.displayName = $window.sessionStorage.getItem('username');
	    $rootScope.$on('loggedIn',function(){
	    	vm.displayName = $window.sessionStorage.getItem('username');
	    })
	    


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
      'auth'
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
                        $window.sessionStorage.setItem('username', userLoginData.email);
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
            $window.sessionStorage.setItem('userToken',token);
	    }

	    function getToken () {
            var token = $window.sessionStorage.getItem('userToken');
            return token;
	    }

	    function clearToken () {
            $window.sessionStorage.removeItem('userToken');
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

	notesCtrl.$inject = ['notesService','$scope','$http','toastr','$window']

	function notesCtrl(notesService,$scope, $http, toastr, $window) {
		var vm = this;
		console.log("notes ballsout");

		vm.getNotesList = function(){
			notesService.getNotesList().then(function(data){
				console.log(data);
				vm.allNotes = data.data.notes;
				console.log(vm.allNotes);
			})
		}
		vm.getNotesList();
		vm.activeNotes = [];
		vm.getSingleNote = getSingleNote;


		vm.saveNote = saveNote;
		vm.deleteNote = deleteNote;
		vm.updateNoteContent = updateNoteContent;
		vm.updateNoteTitle = updateNoteTitle;
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


		

		function getNotesList() {
			
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

	    		notesService.getNotesList().then(function(data){
	    			// push new note to active notes
	    			vm.allNotes = data.data.notes;
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

	   
		function saveNote() {

		}


		function updateNote() {

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

    notesService.$inject = ['$http','$window','authService']

    function notesService($http, $window, authService) {

        
    	var service = { 
            getNotesList: getNotesList,
            getSingleNote: getSingleNote,
            saveAllNotes: saveAllNotes,
            addNewNote: addNewNote,
            updateNoteContent: updateNoteContent,
            updateNoteTitle: updateNoteTitle,
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

            // create new note object
            var newNote = {title:"untitled",content:"sample content","sharedWith":[{"user": "auk2@njit.edu", "canEdit": false}]};
            
            return $http.post('http://localhost:3000/api/notes/addNote',{token: token, note: newNote})
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUuanMiLCJjb250cm9sbGVycy9hcHAuY29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2FwcC5ob21lLmNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9hcHAubG9naW4uY29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2FwcC5uYXYuY29udHJvbGxlci5qcyIsImRpcmVjdGl2ZXMvc2VsZWN0VGV4dC5kaXJlY3RpdmUuanMiLCJyb3V0ZXMvYXBwLnJvdXRlcy5qcyIsImF1dGgvYXV0aC5tb2R1bGUuanMiLCJidWRnZXQvYnVkZ2V0Lm1vZHVsZS5qcyIsIm1lbWJlcnMvbWVtYmVycy5tb2R1bGUuanMiLCJub3Rlcy9ub3Rlcy5tb2R1bGUuanMiLCJub3RpZnkvbm90aWZ5Lm1vZHVsZS5qcyIsInJlZ2lzdGVyL3JlZ2lzdGVyLm1vZHVsZS5qcyIsInNhbXBsZUNvbXBvbmVudC9zYW1wbGUubW9kdWxlLmpzIiwiYXV0aC9zZXJ2aWNlcy9hdXRoLnNlcnZpY2UuaW50ZXJjZXB0b3IuanMiLCJhdXRoL3NlcnZpY2VzL2F1dGguc2VydmljZS5qcyIsImJ1ZGdldC9jb250cm9sbGVycy9idWRnZXQuY29udHJvbGxlci5qcyIsImJ1ZGdldC9kaXJlY3RpdmVzL25vdGVzLmRpcmVjdGl2ZS5iYWNrdXAuanMiLCJidWRnZXQvZGlyZWN0aXZlcy9ub3Rlcy5kaXJlY3RpdmUuanMiLCJidWRnZXQvc2VydmljZXMvYnVkZ2V0LnNlcnZpY2UuanMiLCJtZW1iZXJzL2NvbnRyb2xsZXJzL21lbWJlcnMuY29udHJvbGxlci5qcyIsIm1lbWJlcnMvc2VydmljZXMvbWVtYmVycy5zZXJ2aWNlLmpzIiwibm90ZXMvY29udHJvbGxlcnMvbm90ZXMuY29udHJvbGxlci5qcyIsIm5vdGVzL2RpcmVjdGl2ZXMvbm90ZXMuZGlyZWN0aXZlLmJhY2t1cC5qcyIsIm5vdGVzL2RpcmVjdGl2ZXMvbm90ZXMuZGlyZWN0aXZlLmpzIiwibm90ZXMvc2VydmljZXMvbm90ZXMuc2VydmljZS5qcyIsIm5vdGlmeS9jb250cm9sbGVycy9ub3RpZnkuY29udHJvbGxlci5qcyIsIm5vdGlmeS9kaXJlY3RpdmVzL25vdGlmeS5kaXJlY3RpdmUuanMiLCJub3RpZnkvc2VydmljZXMvbm90aWZ5LnNlcnZpY2UuanMiLCJyZWdpc3Rlci9jb250cm9sbGVycy9yZWdpc3Rlci5jb250cm9sbGVyLmpzIiwicmVnaXN0ZXIvZGlyZWN0aXZlcy9yZWdpc3Rlci5kaXJlY3RpdmUuanMiLCJyZWdpc3Rlci9zZXJ2aWNlcy9yZWdpc3Rlci5zZXJ2aWNlLmpzIiwic2FtcGxlQ29tcG9uZW50L2NvbnRyb2xsZXJzL3NhbXBsZS5jb250cm9sbGVyLmpzIiwic2FtcGxlQ29tcG9uZW50L2RpcmVjdGl2ZXMvc2FtcGxlLmRpcmVjdGl2ZS5qcyIsInNhbXBsZUNvbXBvbmVudC9zZXJ2aWNlcy9zYW1wbGUuc2VydmljZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7XG4gICAgJ3VzZSBzdHJpY3QnXG5cbmFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAnLCBbXG4gICAgICAgICdhdXRoJyxcbiAgICBcdCd1aS5yb3V0ZXInLFxuICAgIFx0J25nQW5pbWF0ZScsXG4gICAgXHQnc2FtcGxlJyxcbiAgICBcdCdyZWdpc3RlcicsXG4gICAgXHQndG9hc3RyJyxcbiAgICBcdCdtZW1iZXJzJyxcbiAgICBcdCdub3RlcycsXG4gICAgICAgICdidWRnZXQnLFxuICAgICAgICAnY2hhcnQuanMnLFxuICAgICAgICAnbm90aWZ5JyxcbiAgICAgICAgJ3VpLnRpbnltY2UnXG4gICAgXSlcblxuLy8gLmNvbmZpZyhmdW5jdGlvbigkaHR0cFByb3ZpZGVyKSB7XG5cbi8vICAgICAvLyBhdHRhY2ggb3VyIGF1dGggaW50ZXJjZXB0b3IgdG8gdGhlIGh0dHAgcmVxdWVzdHNcbi8vICAgICAkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKCdhdXRoSW50ZXJjZXB0b3InKTtcblxuLy8gfSlcblxuXG4ucnVuKFsnJHJvb3RTY29wZScsJyRzdGF0ZScsJ2F1dGhTZXJ2aWNlJywnJHEnLGZ1bmN0aW9uKCRyb290U2NvcGUsICRzdGF0ZSwgYXV0aFNlcnZpY2UgLCRxKSB7XG4gICAgYXV0aFNlcnZpY2UuaW5mbygpO1xuXG4gICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZUVycm9yJywgZnVuY3Rpb24gKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zLCBlcnJvcikge1xuICAgICAgICAgICBcbiAgICAgICAgICAvLyBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNUQVRFIENIQU5HRSBFUlJPUiBFUlJPUiBFUlJPUiBFUlJPUkVSUk9SXCIpO1xuICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5ob21lJylcbiAgICAgICAgXG4gICAgICB9KTtcblxuICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdGFydCcsIGZ1bmN0aW9uIChldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcykge1xuICAgIC8vYXV0aFNlcnZpY2UuaW5mbygpO1xuICAgIC8vYXV0aFNlcnZpY2UuaXNBdXRob3JpemVkKCBldmVudCwgZnJvbVN0YXRlLCB0b1N0YXRlKTtcbiAgICAvL2NvbnNvbGUubG9nKFwic3RhdGUgY2hhbmdpbmdcIik7XG4gICAgLy9jb25zb2xlLmxvZyh0b1N0YXRlKVxuXG4gICAgICAgIGlmKHRvU3RhdGUuZGF0YS5wZXJtaXNzaW9uID09PSB0cnVlKXtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJuZWVkIHBlcm1pc3Npb25cIik7XG4gICAgICAgICAgICAvL3RvU3RhdGUucmVzb2x2ZSA9IHRvU3RhdGUucmVzb2x2ZSB8fCB7fTtcbiAgICAgICAgICAgIC8vdG9TdGF0ZS5yZXNvbHZlID0ge307XG5cbiAgICAgICAgICAgIC8vY2hlY2sgdG8gc2VlIGlmIHRoZXJlIHdhcyBhIHJlc29sdmUgYWxyZWFkeSBhZGRlZFxuICAgICAgICAgICAgaWYoIXRvU3RhdGUucmVzb2x2ZS5hdXRob3JpemF0aW9uUmVzb2x2ZXIpe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdhZGRpbmcgYXV0aCByZXNvbHZlcicpO1xuICAgICAgICAgICAgICAgIC8vYWRkIHJlc29sdmVyXG4gICAgICAgICAgICAgICAgdG9TdGF0ZS5yZXNvbHZlLmF1dGhvcml6YXRpb25SZXNvbHZlciA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXV0aFNlcnZpY2UuaXNBdXRob3JpemVkKGV2ZW50LCBmcm9tU3RhdGUsIHRvU3RhdGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwianVzdCBhZGRlZDogXCIpXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyh0b1N0YXRlLnJlc29sdmUuYXV0aG9yaXphdGlvblJlc29sdmVyKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAvL2p1c3QgdG8gc2hvdyB0aGF0IHRoZSByZXNvbHZlciB3YXMgYWxyZWFkeSBhZGRlZFxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2codG9TdGF0ZS5yZXNvbHZlLmF1dGhvcml6YXRpb25SZXNvbHZlcilcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IC8vZW5kIGlmIG5lZWRzIHBlcm1pc3Npb25cblxuXG4gICAgfSk7IC8vZW5kIHJvb3RTY29wZS4kb25cblxuXG4gICAgXG5cbn1dKTsgLy9lbmQgLnJ1blxuXG5cblxuXG5cbn0pKCk7IC8vZW5kIGlmZmVcblxuIiwiKGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCdcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnYXBwJylcblx0XHQuY29udHJvbGxlcignYXBwQ3RybCcsIGFwcEN0cmwpXG5cblx0YXBwQ3RybC4kaW5qZWN0ID0gWydzYW1wbGVTZXJ2aWNlJywnYXV0aFNlcnZpY2UnLCckc3RhdGUnLCckaHR0cCcsJ3RvYXN0cicsJyRyb290U2NvcGUnLCdub3RpZnlTZXJ2aWNlJ11cblxuXHRmdW5jdGlvbiBhcHBDdHJsKHNhbXBsZVNlcnZpY2UsYXV0aFNlcnZpY2UsJHN0YXRlLCAkaHR0cCwgdG9hc3RyLCAkcm9vdFNjb3BlLG5vdGlmeVNlcnZpY2UpIHtcblxuXHRcdCB2YXIgdm0gPSB0aGlzO1xuXG5cdFx0IC8vIG9uIGluaXRpYWwgbG9hZFxuXHRcdCAvLyB1c2VyIGxvZ2luIHN0YXR1c1xuXHRcdCB2bS5pc0xvZ2dlZCA9IGF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCh2bSk7XG5cblx0XHQgJHJvb3RTY29wZS4kb24oJ2xvZ2dlZEluJyxmdW5jdGlvbigpe1xuXHRcdCBcdHZtLmlzTG9nZ2VkID0gdHJ1ZTtcblx0XHQgfSlcblxuXHRcdCAkcm9vdFNjb3BlLiRvbignbG9nZ2VkT3V0JyxmdW5jdGlvbigpe1xuXHRcdCBcdHZtLmlzTG9nZ2VkID0gZmFsc2U7XG5cdFx0IH0pXG5cblx0XHQgdmFyIG1lc3NhZ2UgPSB7ZGF0YSA6IFwicm9vc3RzXCJ9O1xuXHRcdCAvL25vdGlmeVNlcnZpY2UucHVzaCggbWVzc2FnZSk7XG5cblx0XHQgLy9hbGVydChcIndhdGNoaW5nXCIpO1xuXG5cblx0fSAvL2VuZCBhcHBDdHJsXG5cbn0pKCk7O1xuXG5cbiIsIihmdW5jdGlvbigpIHtcblx0J3VzZSBzdHJpY3QnXG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ2FwcCcpXG5cdFx0LmNvbnRyb2xsZXIoJ2hvbWVDdHJsJywgaG9tZUN0cmwpXG5cdFx0LmNvbnRyb2xsZXIoJ3BhcmVudEN0cmwnLCBwYXJlbnRDdHJsKVxuXG5cdGhvbWVDdHJsLmluamVjdCA9IFsnc2FtcGxlU2VydmljZScsJyRzY29wZSddXG5cblx0ZnVuY3Rpb24gaG9tZUN0cmwoc2FtcGxlU2VydmljZSwgJHNjb3BlKSB7XG5cdFx0XG5cdFx0c2FtcGxlU2VydmljZS5pbmZvKCk7XG5cblx0ICAgIHZhciB2bSA9IHRoaXM7XG5cblx0ICAgIHZtLmdvdG9TZXNzaW9uID0gZ290b1Nlc3Npb247XG5cdCAgICB2bS5yZWZyZXNoID0gcmVmcmVzaDtcblx0ICAgIHZtLnNlYXJjaCA9IHNlYXJjaDtcblx0ICAgIHZtLnNlc3Npb25zID0gW107XG5cdCAgICB2bS50ZXN0ID0gJ3Rlc3QnO1xuXG5cdCAgICAvLy8vLy8vLy8vLy9cblxuXHQgICAgLy8gJHNjb3BlLiRvbignZG9ncycsIGZ1bmN0aW9uICgpIHtcblx0ICAgIC8vIFx0Y29uc29sZS5sb2coXCJyZWNlaXZlZFwiKVxuXHQgICAgLy8gfSk7XG5cblx0ICAgIGZ1bmN0aW9uIGdvdG9TZXNzaW9uKCkge1xuXG5cdFx0fVxuXG5cdCAgICBmdW5jdGlvbiByZWZyZXNoKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBzZWFyY2goKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cdH0gLy8gZW5kIGhvbWVDdHJsXG5cblx0cGFyZW50Q3RybC5pbmplY3QgPSBbJ3NhbXBsZVNlcnZpY2UnLCckc2NvcGUnXVxuXG5cdGZ1bmN0aW9uIHBhcmVudEN0cmwoJHNjb3BlKSB7XG5cdFx0XG5cdCAgICB2YXIgdm0gPSB0aGlzO1xuXHQgICAgLy9jb25zb2xlLmxvZyhcInBhcmVudFwiKVxuXG5cdCAgIC8vICRzY29wZS4kZW1pdCgnZG9ncycsJ3NvbWUgZGF0YScpO1xuXG5cblx0fSAvLyBlbmQgcGFyZW50Q3RybFxuXG59KSgpO1xuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG4iLCJcdChmdW5jdGlvbigpe1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCdhcHAnKVxuXHRcdC5jb250cm9sbGVyKFwibG9naW5DdHJsXCIsIGxvZ2luQ3RybClcblxuXHRsb2dpbkN0cmwuJGluamVjdCA9IFsnJHNjb3BlJywnc2FtcGxlU2VydmljZScsJ2F1dGhTZXJ2aWNlJywnJHN0YXRlJywnJGh0dHAnLCd0b2FzdHInXVxuXG5cdGZ1bmN0aW9uIGxvZ2luQ3RybCgkc2NvcGUsc2FtcGxlU2VydmljZSxhdXRoU2VydmljZSwkc3RhdGUsICRodHRwLCB0b2FzdHIpIHtcblx0XHQvL3NhbXBsZVNlcnZpY2UuaW5mbygpO1xuXHRcdC8vY29uc29sZS5sb2coXCJsb2dpbkN0cmxcIilcblxuXHQgICAgdmFyIHZtID0gdGhpcztcblx0ICAgIHZtLnVzZXIgPSBcIlwiXG5cdCAgICB2bS5sb2dpbkZvcm0gPSBcIlwiO1xuXHQgICAgXG5cdCAgICB2bS5sb2dpbiA9IGxvZ2luO1xuXHQgICAgdm0ubG9nb3V0ID0gbG9nb3V0O1xuXG5cdCAgICAvLy8vLy8vLy8vLy9cblxuXHQgICAgZnVuY3Rpb24gbG9naW4oKSB7XG5cdCAgICBcdGF1dGhTZXJ2aWNlLmxvZ2luKHZtLnVzZXIsJ2FwcC5ub3RlcycpXG5cdFx0XHR2bS51c2VyID0gXCJcIjtcblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gbG9nb3V0KCkge1xuXHQgICAgXHRjb25zb2xlLmxvZyhcImxvZ2dpbmcgb3V0Li4uXCIpXG5cdCAgICBcdGF1dGhTZXJ2aWNlLmxvZ291dCgpO1xuXHQgICAgfVxuXG5cblx0fSAvL2VuZCBsb2dpbkN0cmxcblxuXG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCdcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnYXBwJylcblx0XHQuY29udHJvbGxlcignbmF2Q3RybCcsIG5hdkN0cmwpXG5cblx0bmF2Q3RybC5pbmplY3QgPSBbJyR3aW5kb3cnLCckcm9vdFNjb3BlJ11cblxuXHRmdW5jdGlvbiBuYXZDdHJsKCR3aW5kb3csICRyb290U2NvcGUpIHtcblx0XHRcblx0XHQvL2NvbnNvbGUubG9nKCduYXYgY29udHJvbGxlcicpO1xuXG5cdCAgICB2YXIgdm0gPSB0aGlzO1xuXHQgICAgdm0uZGlzcGxheU5hbWUgPSAkd2luZG93LnNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ3VzZXJuYW1lJyk7XG5cdCAgICAkcm9vdFNjb3BlLiRvbignbG9nZ2VkSW4nLGZ1bmN0aW9uKCl7XG5cdCAgICBcdHZtLmRpc3BsYXlOYW1lID0gJHdpbmRvdy5zZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCd1c2VybmFtZScpO1xuXHQgICAgfSlcblx0ICAgIFxuXG5cblx0ICAgIHZtLmxvZ2dlZEluID0gdHJ1ZTtcblx0ICAgIHZtLmdvdG9TZXNzaW9uID0gZ290b1Nlc3Npb247XG5cdCAgICB2bS5yZWZyZXNoID0gcmVmcmVzaDtcblx0ICAgIHZtLnNlYXJjaCA9IHNlYXJjaDtcblx0ICAgIHZtLnNlc3Npb25zID0gW107XG5cdCAgICB2bS50aXRsZSA9ICdOYXYnO1xuXHQgICAgLy8kc2NvcGUudGl0bGUgPSBcIm1vdXNlXCI7XG5cblx0ICAgIC8vLy8vLy8vLy8vL1xuXG5cdCAgICBmdW5jdGlvbiBnb3RvU2Vzc2lvbigpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gcmVmcmVzaCgpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gc2VhcmNoKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXHR9XG5cbn0pKCk7XG5cblxuIiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcCcpXG4gICAgLmRpcmVjdGl2ZSgnc2VsZWN0VGV4dCcsIHNlbGVjdFRleHQpXG4gICAgXG4gICAgc2VsZWN0VGV4dC4kaW5qZWN0ID0gWyckd2luZG93J11cblxuZnVuY3Rpb24gc2VsZWN0VGV4dCgkd2luZG93KXtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgIGVsZW1lbnQuYmluZCgnY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoISR3aW5kb3cuZ2V0U2VsZWN0aW9uKCkudG9TdHJpbmcoKSkge1xuICAgICAgICB0aGlzLnNldFNlbGVjdGlvblJhbmdlKHRoaXMudmFsdWUubGVuZ3RoLCB0aGlzLnZhbHVlLmxlbmd0aClcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn1cblxuXG4iLCJcbmFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuXHQuY29uZmlnKFsnJHVybFJvdXRlclByb3ZpZGVyJywnJHN0YXRlUHJvdmlkZXInLCckaHR0cFByb3ZpZGVyJyxmdW5jdGlvbigkdXJsUm91dGVyUHJvdmlkZXIsJHN0YXRlUHJvdmlkZXIsJGh0dHBQcm92aWRlcil7XG5cdFx0XG5cdFx0JHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnaG9tZScpO1xuXHRcdC8vc3RhdGVzXG5cdFx0JHN0YXRlUHJvdmlkZXJcblxuXHRcdC5kZWNvcmF0b3IoJ3BhdGgnLCBmdW5jdGlvbihzdGF0ZSwgcGFyZW50Rm4pIHtcblx0XHRcdC8vY29uc29sZS5sb2coXCJjb25maWd1cmluZyBzdGF0ZXNcIilcdFxuXHRcdFx0aWYgKHN0YXRlLnNlbGYucmVzb2x2ZSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHN0YXRlLnNlbGYucmVzb2x2ZSA9IHt9O1xuXHRcdFx0XHRzdGF0ZS5yZXNvbHZlID0gc3RhdGUuc2VsZi5yZXNvbHZlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHBhcmVudEZuKHN0YXRlKTtcbiAgICAgICAgIH0pXG5cblx0XHQuc3RhdGUoJ2FwcCcse1xuXHRcdFx0YWJzdHJhY3Q6IHRydWUsXG5cdFx0XHR0ZW1wbGF0ZVVybDonYXBwL3ZpZXdzL2FwcC52aWV3Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ2FwcEN0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAnYXBwJ1xuXG5cdFx0fSlcblxuXHRcdC5zdGF0ZSgnYXBwLmhvbWUnLHtcblx0XHRcdHVybDogJy9ob21lJyxcblx0XHRcdHRlbXBsYXRlVXJsOidhcHAvdmlld3MvYXBwLmhvbWUuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnaG9tZUN0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAnaG9tZScsXG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdHBlcm1pc3Npb246IGZhbHNlLFxuXHRcdFx0XHRwZXJtaXNzaW9uTGV2ZWw6IFsnZXZlcnlvbmUnXVxuXHRcdFx0fVxuXHRcdH0pXG5cblx0XHQuc3RhdGUoJ2FwcC5yZWdpc3Rlcicse1xuXHRcdFx0dXJsOiAnL3JlZ2lzdGVyJyxcblx0XHRcdHRlbXBsYXRlVXJsOidjb21wb25lbnRzL3JlZ2lzdGVyL3ZpZXdzL3JlZ2lzdGVyLnZpZXcuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAncmVnaXN0ZXJDdHJsJyxcblx0XHRcdGNvbnRyb2xsZXJBczogJ3JlZ2lzdGVyJyxcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0cGVybWlzc2lvbjogZmFsc2UsXG5cdFx0XHRcdHBlcm1pc3Npb25MZXZlbDogWydldmVyeW9uZSddXG5cdFx0XHR9XG5cdFx0fSlcblxuXHRcdC5zdGF0ZSgnYXBwLm1lbWJlcnMnLHtcblx0XHRcdHVybDogJy9tZW1iZXJzJyxcblx0XHRcdHRlbXBsYXRlVXJsOidjb21wb25lbnRzL21lbWJlcnMvdmlld3MvbWVtYmVycy5ob21lLmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ21lbWJlcnNDdHJsJyxcblx0XHRcdGNvbnRyb2xsZXJBczogJ21lbWJlcnMnLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRwZXJtaXNzaW9uOiB0cnVlLFxuXHRcdFx0XHRwZXJtaXNzaW9uTGV2ZWw6IFsnYWRtaW4nLCdtZW1iZXInXVxuXHRcdFx0fVxuXHRcdH0pXG5cblx0XHQuc3RhdGUoJ2FwcC5ub3Rlcycse1xuXHRcdFx0dXJsOiAnL25vdGVzJyxcblx0XHRcdHRlbXBsYXRlVXJsOidjb21wb25lbnRzL25vdGVzL3ZpZXdzL25vdGVzLnZpZXcuaHRtbCcsXG5cblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0cGVybWlzc2lvbjogdHJ1ZSxcblx0XHRcdFx0cGVybWlzc2lvbkxldmVsOiBbJ2FkbWluJywnbWVtYmVyJ11cblx0XHRcdH1cblx0XHR9KVxuXG5cdFx0LnN0YXRlKCdhcHAuYnVkZ2V0Jyx7XG5cdFx0XHR1cmw6ICcvYnVkZ2V0Jyxcblx0XHRcdHRlbXBsYXRlVXJsOidjb21wb25lbnRzL2J1ZGdldC92aWV3cy9idWRnZXQudmlldy5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdidWRnZXRDdHJsJyxcblx0XHRcdGNvbnRyb2xsZXJBczogJ2J1ZGdldCcsXG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdHBlcm1pc3Npb246IHRydWUsXG5cdFx0XHRcdHBlcm1pc3Npb25MZXZlbDogWydhZG1pbiddXG5cdFx0XHR9XG5cdFx0fSlcblxuXHRcdC8vJGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaCgnYXV0aEludGVyY2VwdG9yJyk7XG5cblxuXG5cdH1dKTtcblxuIiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ2F1dGgnLCBbXG4gICAgICBcbiAgICBdKTsiLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgnYnVkZ2V0JywgW1xuICAgICAgJ2NoYXJ0LmpzJ1xuICAgIF0pOyIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdtZW1iZXJzJywgW1xuICAgICAgXG4gICAgXSk7IiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ25vdGVzJywgW1xuICAgICAgJ2F1dGgnXG4gICAgXSk7IiwiKGZ1bmN0aW9uKCl7XG5cdCd1c2Ugc3RyaWN0J1xuXG5hbmd1bGFyXG5cdC5tb2R1bGUoJ25vdGlmeScsIFtcblx0ICBcblx0XSk7XG5cbn0pKCk7XG5cblxuIiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ3JlZ2lzdGVyJywgW1xuICAgIFx0J2F1dGgnXG4gICAgXSk7IiwiKGZ1bmN0aW9uKCl7XG5cdCd1c2Ugc3RyaWN0J1xuXG5hbmd1bGFyXG5cdC5tb2R1bGUoJ3NhbXBsZScsIFtcblx0ICBcblx0XSk7XG5cbn0pKCk7XG5cbiIsIihmdW5jdGlvbigpe1xuICAgICd1c2Ugc3RyaWN0J1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhdXRoJylcbiAgICAgICAgLmZhY3RvcnkoJ2F1dGhJbnRlcmNlcHRvcicsIGF1dGhJbnRlcmNlcHRvcik7XG5cbiAgICBhdXRoSW50ZXJjZXB0b3IuJGluamVjdCA9IFsnYXV0aFNlcnZpY2UnXVxuXG4gICAgZnVuY3Rpb24gYXV0aEludGVyY2VwdG9yKGF1dGhTZXJ2aWNlKSB7XG5cblxuXG4gICAgICAgIHZhciBzZXJ2aWNlID0ge1xuXG4gICAgICAgICAgICByZXF1ZXN0OiByZXF1ZXN0LFxuICAgICAgICAgICAgcmVzcG9uc2U6IHJlc3BvbnNlXG5cbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gc2VydmljZTtcblxuICAgICAgICAvLy8vLy8vLy8vLy9cblxuICAgICAgICBmdW5jdGlvbiByZXF1ZXN0KGNvbmZpZykge1xuXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiYXV0aEludGVyY2VwdG9yIHJlcXVlc3QgZnVuY3Rpb25cIilcblxuICAgICAgICAgICAgdmFyIHRva2VuID0gYXV0aFNlcnZpY2UuZ2V0VG9rZW4oKTtcblxuICAgICAgICAgICAgaWYodG9rZW4pe1xuICAgICAgICAgICAgICAgIGNvbmZpZy5oZWFkZXJzLnRva2VuID0gdG9rZW47XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ0b2tlbiBwcmVzZW50XCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5vIHRva2VuXCIpO1xuICAgICAgICAgICAgfSAgICBcbiAgICAgICAgICAgIHJldHVybiBjb25maWc7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiByZXNwb25zZShyZXNwb25zZSkge1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImF1dGhJbnRlcmNlcHRvciByZXNwb25zZSBmdW5jdGlvblwiKVxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICB9XG5cbiAgICB9IC8vZW5kIGF1dGhJbnRlcmNlcHRvclxuXG4gICAgXG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0Ly8ndXNlIHN0cmljdCdcblxuXHRhbmd1bGFyXG4gICAgXHQubW9kdWxlKCdhdXRoJyxbXSlcbiAgICBcdC5mYWN0b3J5KCdhdXRoU2VydmljZScsIGF1dGhTZXJ2aWNlKTtcblxuICAgIGF1dGhTZXJ2aWNlLiRpbmplY3QgPSBbJyR3aW5kb3cnLCckaHR0cCcsJ3RvYXN0cicsJyRzdGF0ZScsJyRyb290U2NvcGUnLCckbG9jYXRpb24nLCckcSddO1xuXG4gICAgZnVuY3Rpb24gYXV0aFNlcnZpY2UoJHdpbmRvdywkaHR0cCx0b2FzdHIsJHN0YXRlLCRyb290U2NvcGUsJGxvY2F0aW9uLCRxKSB7XG5cbiAgICBcblxuICAgIFx0dmFyIHNlcnZpY2UgPSB7XG5cbiAgICAgICAgICAgIGluZm86IGluZm8sXG5cbiAgICAgICAgICAgIGxvZ2luOiBsb2dpbixcbiAgICAgICAgICAgIGxvZ291dDogbG9nb3V0LFxuXG4gICAgXHRcdHNldFRva2VuOiBzZXRUb2tlbixcbiAgICAgICAgICAgIGdldFRva2VuOiBnZXRUb2tlbixcbiAgICBcdFx0Y2xlYXJUb2tlbjogY2xlYXJUb2tlbixcblxuICAgICAgICAgICAgaXNBdXRoZW50aWNhdGVkOiBpc0F1dGhlbnRpY2F0ZWQsIC8vIHZlcmlmaWVzIHRva2VuXG4gICAgICAgICAgICBpc0F1dGhvcml6ZWQ6IGlzQXV0aG9yaXplZCAvLyB2ZXJpZmllcyByb3V0ZSBwZXJtaXNzaW9uc1xuXG4gICAgXHR9O1xuXG4gICAgXHRyZXR1cm4gc2VydmljZTtcblxuICAgIFx0Ly8vLy8vLy8vLy8vXG5cbiAgICAgICAgZnVuY3Rpb24gaW5mbyAoKSB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiYXV0aCBzZXJ2aWNlXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmVkaXJlY3QgdGFrZXMgcm91dGUgc3RyaW5nIGllLiAnYXBwLmhvbWUnXG4gICAgICAgIGZ1bmN0aW9uIGxvZ2luICh1c2VyTG9naW5EYXRhLCByZWRpcmVjdCkge1xuICAgICAgICAgICAgJGh0dHAucG9zdCgnaHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaS91c2Vycy9sb2dpbicsIHVzZXJMb2dpbkRhdGEpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzKXtcbiAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgICAgICAgICAgICAgICBpZihyZXMuc3RhdHVzID09IDIwMCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAkd2luZG93LnNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ3VzZXJuYW1lJywgdXNlckxvZ2luRGF0YS5lbWFpbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUb2tlbihyZXMuZGF0YS50b2tlbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRlbWl0KFwibG9nZ2VkSW5cIik7ICBcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvYXN0ci5zdWNjZXNzKHJlcy5kYXRhLm1lc3NhZ2UpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0eXBlb2YocmVkaXJlY3QpICE9IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKHJlZGlyZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgICAgICAgICAgdG9hc3RyLmVycm9yKGVyci5kYXRhLm1lc3NhZ2UpXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycilcbiAgICAgICAgICAgICAgICB9KVxuXG5cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGxvZ291dCAoKSB7XG4gICAgICAgICAgICBjbGVhclRva2VuKCk7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRlbWl0KFwibG9nZ2VkT3V0XCIpO1xuICAgICAgICAgICAgJHN0YXRlLmdvKFwiYXBwLmhvbWVcIik7XG4gICAgICAgICAgICB0b2FzdHIuc3VjY2VzcyhcIllvdSBoYXZlIGJlZW4gbG9nZ2VkIG91dFwiKTtcbiAgICAgICAgfVxuXG5cblxuICAgIFx0ZnVuY3Rpb24gc2V0VG9rZW4gKHRva2VuKSB7XG4gICAgICAgICAgICAkd2luZG93LnNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ3VzZXJUb2tlbicsdG9rZW4pO1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBnZXRUb2tlbiAoKSB7XG4gICAgICAgICAgICB2YXIgdG9rZW4gPSAkd2luZG93LnNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ3VzZXJUb2tlbicpO1xuICAgICAgICAgICAgcmV0dXJuIHRva2VuO1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBjbGVhclRva2VuICgpIHtcbiAgICAgICAgICAgICR3aW5kb3cuc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbSgndXNlclRva2VuJyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygncmFiYml0cycpXG5cdCAgICB9XG5cbiAgICAgICAgLy9iYXNpY2FsbHkgYXJlIHRoZXkgbG9nZ2VkIGluXG4gICAgICAgIGZ1bmN0aW9uIGlzQXV0aGVudGljYXRlZCAoKSB7XG5cbiAgICAgICAgICAgIHZhciB0b2tlbiA9IGdldFRva2VuKCk7XG4gICAgICAgICAgICBpZih0b2tlbil7XG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnaHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaS91c2Vycy9hdXRob3JpemUnLHt0b2tlbjp0b2tlbn0pXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2cocmVzKVxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2F1dGhvcml6aW5nLi4nKVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIHJlcy5kYXRhLnN1Y2Nlc3MgPT0gdHJ1ZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9hc3RyLnN1Y2Nlc3MoXCJBdXRoZW50aWNhdGlvbiBTdWNjZXNzIVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQXV0aGVudGljYXRpb24gU3VjY2VzcyFcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRlbWl0KFwibG9nZ2VkSW5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IFxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy90b2FzdHIuZXJyb3IoXCJBdXRoZW50aWNhdGlvbiBGYWlsZWRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkF1dGhlbnRpY2F0aW9uIEZhaWxlZFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxmdW5jdGlvbihlcnIpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9hc3RyLmVycm9yKGVyci5kYXRhKVxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgLy90b2FzdHIuZXJyb3IoXCJhdXRoZW50aWNhdGlvbiBmYWlsZWQsIG5vIHRva2VuIHByZXNlbnRcIilcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImF1dGhlbnRpY2F0aW9uIGZhaWxlZCwgbm8gdG9rZW4gcHJlc2VudFwiKVxuICAgICAgICAgICAgfSBcbiAgICAgICAgICAgXG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBpc0F1dGhvcml6ZWQgKGV2ZW50LCBmcm9tU3RhdGUsIHRvU3RhdGUpIHtcbiAgICAgICAgICAgICAgICAvL3JldHVybiAkcS5yZWplY3QoKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInJ1bm5pbmcgaXMgYXV0aG9yaXplZFwiKVxuXG4gICAgICAgICAgICAgICAgLy9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHZhciB0b2tlbiA9IGdldFRva2VuKCk7XG4gICAgICAgICAgICAgICAgdmFyIHVzZXJsZXZlbCA9IG51bGw7XG4gICAgICAgICAgICAgICAgdmFyIHByb2NlZWQgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIGlmKHRva2VuKXtcbiAgICAgICAgICAgICAgICAgIC8vICByZXR1cm4gJHEucmVqZWN0O1xuICAgICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCdodHRwOi8vbG9jYWxob3N0OjMwMDAvYXBpL3VzZXJzL2F1dGhvcml6ZScse3Rva2VuOnRva2VufSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnYXV0aG9yaXppbmcuLicpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoIHJlcy5kYXRhLnN1Y2Nlc3MgPT0gdHJ1ZSAmJiByZXMuZGF0YS5wcm9maWxlLnVzZXJMZXZlbCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMuZGF0YS5wcm9maWxlLnVzZXJMZXZlbClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlckxldmVsID0gcmVzLmRhdGEucHJvZmlsZS51c2VyTGV2ZWw7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2xvb3AgdGhyb3VnaCBwZXJtaXNzaW9uIGxpc3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpPTA7IGkgPCB0b1N0YXRlLmRhdGEucGVybWlzc2lvbkxldmVsLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2lmIGN1cnJlbnQgdXNlcmxldmVsIG1hdGNoZXMgcGVybWlzc2lvbiBsZXZlbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vdGhlbiBzZXQgcHJvY2VlZCB0byB0cnVlIGFuZCBicmVhayB0aGUgZm9yIGxvb3AgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJjdXJyZW50IGxvb3AgaSA6IFwiICsgdG9TdGF0ZS5kYXRhLnBlcm1pc3Npb25MZXZlbFtpXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih1c2VyTGV2ZWwgPT0gdG9TdGF0ZS5kYXRhLnBlcm1pc3Npb25MZXZlbFtpXSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInBlcm1pc3Npb24gbWF0Y2hcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2V0dGluZyBwcm9jZWVkIHRydWVcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2NlZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3JldHVybiB0b2FzdHIuc3VjY2VzcyhcInByb2NlZWRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJrZWVwIGxvb2tpbmdcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2V0dGluZyBwcm9jZWVkIGZhbHNlXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9jZWVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0vL2VuZCBmb3IgbG9vcCAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSAvLyBlbmQgaWYgcHJvZmlsZSByZXR1cm5lZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGVsc2Ugbm8gcHJvZmlsZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvYXN0ci5lcnJvcihcImJhZCByZXF1ZXN0XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2NlZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImxhc3QgY2hlY2tcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihwcm9jZWVkID09IGZhbHNlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJJVFMgRkFMU0VcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5ob21lJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSAvL2VuZCB0aGVuXG4gICAgICAgICAgICAgICAgfS8vZW5kIGlmIHRva2VuXG5cbiAgICAgICAgICAgICAgICAvL2Vsc2Ugbm8gdG9rZW4gXG4gICAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgdG9hc3RyLmVycm9yKFwibm8gdG9rZW4gcHJlc2VudFwiKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIFxuXG4gICAgICAgIH0vL2VuZCBpc0F1dGhvcml6ZWRcbiAgICAgICAgXG5cbiAgICB9Ly9lbmQgYXV0aFNlcnZpY2VcblxuICAgIFxuXG5cblxuXHRcblxufSkoKTsgLy9lbmQgaWZmZVxuXG5cbiIsIihmdW5jdGlvbigpIHtcblx0J3VzZSBzdHJpY3QnXG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ2J1ZGdldCcpXG5cdFx0LmNvbnRyb2xsZXIoJ2J1ZGdldEN0cmwnLCBidWRnZXRDdHJsKVxuXG5cdGJ1ZGdldEN0cmwuJGluamVjdCA9IFsnJHNjb3BlJywnJGh0dHAnLCd0b2FzdHInXVxuXG5cdGZ1bmN0aW9uIGJ1ZGdldEN0cmwoJHNjb3BlLCAkaHR0cCwgdG9hc3RyKSB7XG5cdFx0Y29uc29sZS5sb2coJ2xvYWRlZCBidWRnZXRDdHJsJyk7XG5cdFxuXHRcdC8vICRzY29wZS5NYXRoID0gd2luZG93Lk1hdGg7XG5cblx0XHQgICAgXG5cblxuICBcdFx0XHQvLyBpbmNvbWVcbiAgXHRcdFx0JHNjb3BlLmluY29tZSA9IHt9XG4gIFx0XHRcdCRzY29wZS5pbmNvbWUubW9udGhseSA9IDQ1MDA7XG5cbiAgXHRcdFx0Ly8gYmlsbHNcbiAgXHRcdFx0JHNjb3BlLmJpbGxzID1bXVxuICBcdFx0XHQkc2NvcGUuYmlsbHMgPSBbXG4gIFx0XHRcdFx0e25hbWU6XCJyZW50XCIsIGNvc3Q6IDI1MDB9LFxuICBcdFx0XHRcdHtuYW1lOlwidXRpbGl0aWVzXCIsIGNvc3Q6IDIwMH0sXG4gIFx0XHRcdFx0e25hbWU6XCJjYXIgaW5zdXJhbmNlXCIsIGNvc3Q6IDE1MH0sXG4gIFx0XHRcdFx0e25hbWU6XCJjYXIgcGF5bWVudFwiLCBjb3N0OiAyNTB9LFxuICBcdFx0XHRcdHtuYW1lOlwiZ2FzXCIsIGNvc3Q6IDEwMH0sXG4gIFx0XHRcdFx0e25hbWU6XCJneW0gbWVtYmVyc2hpcFwiLCBjb3N0OiA1MH0sXG4gIFx0XHRcdFx0e25hbWU6XCJjZWxsIHBob25lXCIsIGNvc3Q6IDgwfSxcblxuICBcdFx0XHRdXG5cbiAgICAgICAgXG5cbiAgXHRcdFx0JHNjb3BlLmFkZE5ld0JpbGwgPSBmdW5jdGlvbigpe1xuICBcdFx0XHRcdCRzY29wZS5iaWxscy5wdXNoKHtuYW1lOiAkc2NvcGUubmV3QmlsbE5hbWUsIGNvc3Q6IDAgfSlcbiAgXHRcdFx0XHQkc2NvcGUubmV3QmlsbE5hbWUgPSBcIlwiO1xuICBcdFx0XHR9XG5cbiAgXHRcdFx0JHNjb3BlLnJlbW92ZUJpbGxJdGVtID0gZnVuY3Rpb24oaW5kZXgpe1xuICBcdFx0XHRcdCRzY29wZS5iaWxscy5zcGxpY2UoaW5kZXgsMSk7XG4gIFx0XHRcdH1cblxuICBcdFx0XHQvL2J1ZGdldCBpdGVtc1xuICBcdFx0XHQkc2NvcGUuYnVkZ2V0SXRlbXMgPSBbXTtcbiAgXHRcdFx0JHNjb3BlLmJ1ZGdldEl0ZW1zID0gW1xuICBcdFx0XHRcdHtuYW1lOiBcImVhdCBvdXRcIiwgYnVkZ2V0OiAxMDAsIHNwZW50OiAzMCB9LFxuICBcdFx0XHRcdHtuYW1lOiBcImNsb3RoaW5nXCIsIGJ1ZGdldDogMjAwLCBzcGVudDogOTB9XG4gIFx0XHRcdF1cblxuICBcdFx0XHQkc2NvcGUuYWRkTmV3QnVkZ2V0SXRlbSA9IGZ1bmN0aW9uKCl7XG4gIFx0XHRcdFx0JHNjb3BlLmJ1ZGdldEl0ZW1zLnB1c2goe25hbWU6ICRzY29wZS5uZXdCdWRnZXRJdGVtTmFtZSwgYnVkZ2V0OiAwLCBzcGVudDogMCB9KVxuICBcdFx0XHRcdCRzY29wZS5uZXdCdWRnZXRJdGVtTmFtZSA9IFwiXCI7XG4gIFx0XHRcdH1cblxuICAgICAgICAkc2NvcGUucHVyY2hhc2VzID0gW11cbiAgICAgICAgJHNjb3BlLnB1cmNoYXNlcyA9IFt7Y2F0ZWdvcnk6IFwiZWF0IG91dFwifV1cblxuICAgICAgICAkc2NvcGUuYWRkUHVyY2hhc2VJdGVtID0gZnVuY3Rpb24oKXtcblxuICAgICAgICB9XG5cblxuICAgICAgICAkc2NvcGUubW9udGhseU92ZXJ2aWV3ID0ge307XG4gICAgICAgICRzY29wZS5tb250aGx5T3ZlcnZpZXcuYmlsbHNUb3RhbCA9IDA7XG4gICAgICAgICRzY29wZS5tb250aGx5T3ZlcnZpZXcuYnVkZ2V0VG90YWwgPSAwO1xuICAgICAgICAkc2NvcGUubW9udGhseU92ZXJ2aWV3LmJ1ZGdldFNwZW50VG90YWwgPSAwO1xuICAgICAgICAkc2NvcGUubW9udGhseU92ZXJ2aWV3LnRvdGFsRXN0aW1hdGVkRXhwZW5kaXR1cmUgPSAwO1xuXG4gICAgICAgIFxuICAgICAgICAkc2NvcGUuY2FsY3VsYXRlQmlsbHNUb3RhbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciB0b3RhbCA9IDA7XG4gICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8ICRzY29wZS5iaWxscy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICB0b3RhbCA9IHRvdGFsICsgJHNjb3BlLmJpbGxzW2ldLmNvc3Q7XG4gICAgICAgICAgfVxuICAgICAgICAgICRzY29wZS5tb250aGx5T3ZlcnZpZXcuYmlsbHNUb3RhbCA9IHRvdGFsO1xuICAgICAgICAgICRzY29wZS5jYWxjdWxhdGVUb3RhbEV4cGVuZGl0dXJlKClcbiAgICAgICAgICByZXR1cm4gdG90YWw7XG4gICAgICAgIH1cblxuICAgICAgICBcblxuICAgICAgICAkc2NvcGUuY2FsY3VsYXRlQnVkZ2V0VG90YWwgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgdG90YWwgPSAwO1xuICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCAkc2NvcGUuYnVkZ2V0SXRlbXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgdG90YWwgPSB0b3RhbCArICRzY29wZS5idWRnZXRJdGVtc1tpXS5idWRnZXQ7XG4gICAgICAgICAgfVxuICAgICAgICAgICRzY29wZS5tb250aGx5T3ZlcnZpZXcuYnVkZ2V0VG90YWwgPSB0b3RhbDtcbiAgICAgICAgICAkc2NvcGUuY2FsY3VsYXRlVG90YWxFeHBlbmRpdHVyZSgpXG4gICAgICAgICAgcmV0dXJuIHRvdGFsOyAgICAgICBcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5jYWxjdWxhdGVCdWRnZXRTcGVudFRvdGFsID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIHRvdGFsID0gMDtcbiAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgJHNjb3BlLmJ1ZGdldEl0ZW1zLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIHRvdGFsID0gdG90YWwgKyAkc2NvcGUuYnVkZ2V0SXRlbXNbaV0uc3BlbnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgICRzY29wZS5tb250aGx5T3ZlcnZpZXcuYnVkZ2V0U3BlbnRUb3RhbCA9IHRvdGFsO1xuICAgICAgICAgIC8vJHNjb3BlLmNhbGN1bGF0ZVRvdGFsRXhwZW5kaXR1cmUoKVxuICAgICAgICAgIHJldHVybiB0b3RhbDsgICAgICAgXG4gICAgICAgIH1cblxuICAgICAgICBcblxuXG5cbiAgICAgICAkc2NvcGUuJHdhdGNoKFwiYmlsbHNcIiwgJHNjb3BlLmNhbGN1bGF0ZUJpbGxzVG90YWwsIHRydWUpXG4gICAgICAgJHNjb3BlLiR3YXRjaChcImJ1ZGdldEl0ZW1zXCIsICRzY29wZS5jYWxjdWxhdGVCdWRnZXRUb3RhbCwgdHJ1ZSlcbiAgICAgICAkc2NvcGUuJHdhdGNoKFwiYnVkZ2V0SXRlbXNcIiwgJHNjb3BlLmNhbGN1bGF0ZUJ1ZGdldFNwZW50VG90YWwsIHRydWUpXG5cbiAgICAgLy8gJHNjb3BlLiR3YXRjaChcImJ1ZGdldEl0ZW1zXCIsICRzY29wZS5jYWxjdWxhdGVCdWRnZXRUb3RhbCwgdHJ1ZSlcblxuXG4gICAgICAgICRzY29wZS5jYWxjdWxhdGVUb3RhbEV4cGVuZGl0dXJlID0gZnVuY3Rpb24gICgpIHtcbiAgICAgICAgICAgICAkc2NvcGUubW9udGhseU92ZXJ2aWV3LnRvdGFsRXN0aW1hdGVkRXhwZW5kaXR1cmUgPSAkc2NvcGUubW9udGhseU92ZXJ2aWV3LmJpbGxzVG90YWwgKyAkc2NvcGUubW9udGhseU92ZXJ2aWV3LmJ1ZGdldFRvdGFsO1xuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLmNhbGN1bGF0ZUJpbGxzVG90YWwoKTtcbiAgICAgICAgJHNjb3BlLmNhbGN1bGF0ZUJ1ZGdldFRvdGFsKCk7XG4gICAgICAgICRzY29wZS5jYWxjdWxhdGVCdWRnZXRTcGVudFRvdGFsKCk7XG4gICAgICAgICRzY29wZS5jYWxjdWxhdGVUb3RhbEV4cGVuZGl0dXJlKCk7XG5cbiAgICAgICAgJHNjb3BlLmxhYmVscyA9IFtcIkJpbGxzXCIsIFwiQnVkZ2V0XCIsIFwiUmVtYWluaW5nXCJdO1xuICAgICAgICAkc2NvcGUuZGF0YSA9IFskc2NvcGUubW9udGhseU92ZXJ2aWV3LmJpbGxzVG90YWwsXG4gICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5tb250aGx5T3ZlcnZpZXcuYnVkZ2V0VG90YWwsXG4gICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5pbmNvbWUubW9udGhseSAtICRzY29wZS5tb250aGx5T3ZlcnZpZXcudG90YWxFc3RpbWF0ZWRFeHBlbmRpdHVyZV07XG5cblxuXG5cblxuXHR9XG5cbn0pKCk7XG5cblxuIiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ25vdGVzJylcbiAgICAuZGlyZWN0aXZlKCdub3RlQ2FyZCcsIG5vdGVDYXJkKTtcblxuZnVuY3Rpb24gbm90ZUNhcmQoKSB7XG5cdHJldHVybntcblx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdHNjb3BlOiB7XG5cdFx0XHRkYXRhOiBcIj1cIixcblx0XHRcdGRyYWdnYWJsZTogXCI9XCJcblx0XHR9LFxuXHRcdHJlcGxhY2U6IHRydWUsXG5cdFx0dGVtcGxhdGU6IFwiPGgxPnt7ZG9nc319e3tkcmFnU3RhdHVzfX08L2gxPlwiLFxuXHRcdGxpbms6IGZ1bmN0aW9uKHNjb3BlLGVsZW1lbnQpe1xuXHRcdFx0ZWxlbWVudC5jbGljayhmdW5jdGlvbigpe1xuXHRcdFx0XHRjb25zb2xlLmxvZyhlbGVtZW50KVxuXHRcdFx0XHRlbGVtZW50WzBdLmRyYWdnYWJsZSA9IHRydWU7XG5cdFx0XHR9KVxuXHRcdH0sXG5cdFx0Y29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKXtcblx0XHRcdC8vYWxlcnQoXCJjb250cm9sbGVyXCIpO1xuXHRcdFx0JHNjb3BlLmRvZ3MgPSAkc2NvcGUuZGF0YSArIFwiZG9nc1wiO1xuXHRcdFx0aWYoJHNjb3BlLmRyYWdnYWJsZSlcblx0XHRcdFx0JHNjb3BlLmRyYWdTdGF0dXMgPSBmYWxzZTtcblx0XHRcdGVsc2UgJHNjb3BlLmRyYWdTdGF0dXMgPSB0cnVlO1xuXG5cdFx0XHRcblx0XHR9XG5cdH1cbn1cblxuXG5cbi8vIGFuZ3VsYXJcbi8vICAgICAubW9kdWxlKCdub3RlcycpXG4vLyAgICAgLmRpcmVjdGl2ZSgnbm90ZUNhcmQnLCBub3RlQ2FyZCk7XG5cbi8vIGZ1bmN0aW9uIG5vdGVDYXJkKCkge1xuLy8gXHRyZXR1cm57XG4vLyBcdFx0cmVzdHJpY3Q6ICdFJyxcbi8vIFx0XHRjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpe1xuLy8gXHRcdFx0YWxlcnQoXCJjb250cm9sbGVyXCIpO1xuLy8gXHRcdFx0Y29uc29sZS5sb2coJ2RvZycpXG4vLyBcdFx0fSxcbi8vIFx0XHR0ZW1wbGF0ZVVybDogJycsXG4vLyBcdFx0cmVwbGFjZTogdHJ1ZVxuLy8gXHRcdC8vIHNjb3BlOiB7fVxuLy8gXHR9XG4vLyB9IiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ25vdGVzJylcbiAgICAuZGlyZWN0aXZlKCdub3RlQ2FyZHMnLCBub3RlQ2FyZHMpXG5cblxuICAgIFxuXG5mdW5jdGlvbiBub3RlQ2FyZHMoKSB7XG5cdHJldHVybntcblx0XHRyZXN0cmljdDogJ0FFJyxcblx0XHRzY29wZToge1xuXHRcdFx0bm90ZXM6IFwiPVwiLFxuXHRcdFx0bmV3SXRlbTogXCI9XCJcblx0XHR9LFxuXHRcdHJlcGxhY2U6IGZhbHNlLFxuXHRcdHRyYW5zY2x1ZGU6IGZhbHNlLFxuXHRcdHRlbXBsYXRlVXJsOiBcImNvbXBvbmVudHMvbm90ZXMvdmlld3Mvbm90ZS5kaXJlY3RpdmUudmlldy5odG1sXCIsXG5cdFx0bGluazogZnVuY3Rpb24oc2NvcGUsZWxlbWVudCxhdHRycyl7XG5cdFx0XHQvLyQoIFwiI3NvcnRhYmxlXCIgKS5zb3J0YWJsZSgpO1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhzY29wZSlcblx0XHRcdC8vY29uc29sZS5sb2coZWxlbWVudClcblx0XHRcdC8vY29uc29sZS5sb2coYXR0cnMpXG5cdFx0XHQvL2VsZW1lbnQuc29ydGFibGUoKTtcblx0XHRcdC8vY29uc29sZS5sb2coc2NvcGUubm90ZXMpXG5cdFx0XHRzY29wZS5kb2dzID0gZnVuY3Rpb24obm90ZSl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKG5vdGUpXG5cdFx0XHR9XG5cblxuXHRcdFx0ZWxlbWVudC5zb3J0YWJsZSh7XG5cdFx0ICAgICAgIC8vIHBsYWNlaG9sZGVyOiBcInVpLXN0YXRlLWhpZ2hsaWdodFwiLFxuXHRcdCAgICAgICAgc3RhcnQ6IGZ1bmN0aW9uKGV2ZW50LCB1aSkge1xuXHRcdCAgICAgICAgICAgIHZhciBzdGFydF9wb3MgPSB1aS5pdGVtLmluZGV4KCk7XG5cdFx0ICAgICAgICAgICAgdWkuaXRlbS5kYXRhKCdzdGFydF9wb3MnLCBzdGFydF9wb3MpO1xuXHRcdCAgICAgICAgfSxcblx0XHQgICAgICAgIHVwZGF0ZTogZnVuY3Rpb24oZXZlbnQsIHVpKSB7XG5cdFx0ICAgICAgICAgICAgdmFyIHN0YXJ0X3BvcyA9IHVpLml0ZW0uZGF0YSgnc3RhcnRfcG9zJyk7XG5cdFx0ICAgICAgICAgICAgdmFyIGVuZF9wb3MgPSB1aS5pdGVtLmluZGV4KCk7XG5cdFx0ICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhzdGFydF9wb3MgKyAnIC0gJyArIGVuZF9wb3MpO1xuXHRcdCAgICAgICAgICBcblx0XHQgICAgICAgICAgdmFyIHN0YXJ0SXRlbSA9IHNjb3BlLm5vdGVzW3N0YXJ0X3Bvc107XG5cdFx0ICAgICAgICAgICBzY29wZS5ub3Rlcy5zcGxpY2Uoc3RhcnRfcG9zLDEpXG5cdFx0ICAgICAgICAgICBzY29wZS5ub3Rlcy5zcGxpY2UoZW5kX3BvcywwLCBzdGFydEl0ZW0pXG5cdFx0ICAgICAgICAgICBzY29wZS4kYXBwbHkoKTtcblxuXHRcdCAgICAgICAgICAgLy9jb25zb2xlLmxvZyhzY29wZS5ub3Rlcylcblx0XHQgICAgICAgICAgIFxuXHRcdCAgICAgICAgICAgXG5cdFx0ICAgICAgICB9XG5cdFx0ICAgIH0pOyAvLyBlbmQgc29ydGFibGVcblxuXHRcdCAgIFxuXG5cdFx0ICAgIGNvbnNvbGUubG9nKGVsZW1lbnQpXG5cblxuXHRcdH0sXG5cdFx0Y29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKXtcblx0XHRcdCRzY29wZS5mb3JtID17fVxuXHRcdFx0JHNjb3BlLmFkZEl0ZW0gPSBmdW5jdGlvbihpbmRleCxpdGVtKXtcblx0XHRcdFx0Ly9hbGVydChpbmRleClcblx0XHRcdFx0Y29uc29sZS5sb2coJHNjb3BlLm5ld0l0ZW0pXG5cdFx0XHRcdCRzY29wZS5ub3Rlc1tpbmRleF0uaXRlbXMucHVzaChpdGVtKVxuXHRcdFx0XHQkc2NvcGUuZm9ybSA9IHt9XG5cdFx0XHRcdC8vY29uc29sZS5sb2coJHNjb3BlLm5vdGVzW2luZGV4XS5pdGVtcylcblx0XHRcdH1cblxuXHRcdFx0JHNjb3BlLmRlbGV0ZU5vdGUgPSBmdW5jdGlvbihpbmRleCl7XG5cdFx0XHRcdCRzY29wZS5ub3Rlcy5zcGxpY2UoaW5kZXgsMSk7XG5cdFx0XHR9XG5cblxuXHRcdFx0Ly9hbGVydChcImNvbnRyb2xsZXJcIik7XG5cdFx0XHQvLyAkc2NvcGUuZG9ncyA9ICRzY29wZS5kYXRhICsgXCJkb2dzXCI7XG5cdFx0XHQvLyBpZigkc2NvcGUuZHJhZ2dhYmxlKVxuXHRcdFx0Ly8gXHQkc2NvcGUuZHJhZ1N0YXR1cyA9IGZhbHNlO1xuXHRcdFx0Ly8gZWxzZSAkc2NvcGUuZHJhZ1N0YXR1cyA9IHRydWU7XG5cblx0XHRcdFxuXHRcdH1cblx0fVxufSAvL2VuZCBub3RlY2FyZHMgZGlyZWN0aXZlXG5cbmFuZ3VsYXJcblx0Lm1vZHVsZSgnbm90ZXMnKVxuXHQuZGlyZWN0aXZlKCdub3RlQ2FyZCcsIG5vdGVDYXJkKVxuXG5mdW5jdGlvbiBub3RlQ2FyZCgpIHtcblxuXHR2YXIgdGVtcERhdGEgPSB7fTtcblx0dmFyIHRlbXBOb3RlID0gbnVsbDtcblxuXHRyZXR1cm57XG5cdFx0cmVzdHJpY3Q6ICdBRScsXG5cdFx0c2NvcGU6IHtcblx0XHRcdG5vdGU6IFwiPVwiLFxuXHRcdFx0bm90ZXM6IFwiPVwiXG5cdFx0fSxcblx0XHRyZXBsYWNlOiB0cnVlLFxuXHRcdHRyYW5zY2x1ZGU6IGZhbHNlLFxuXHRcdHRlbXBsYXRlVXJsOiBcImNvbXBvbmVudHMvbm90ZXMvdmlld3Mvbm90ZXMuaXRlbXMudmlldy5odG1sXCIsXG5cdFx0bGluazogZnVuY3Rpb24oc2NvcGUsZWxlbWVudCxhdHRycyl7XG5cdFx0XHQvLyQoIFwiI3NvcnRhYmxlXCIgKS5zb3J0YWJsZSgpO1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhzY29wZSlcblx0XHRcdC8vY29uc29sZS5sb2coZWxlbWVudClcblx0XHRcdC8vY29uc29sZS5sb2coYXR0cnMpXG5cdFx0XHQvL2VsZW1lbnQuc29ydGFibGUoKTtcblx0XHRcdC8vY29uc29sZS5sb2coc2NvcGUubm90ZXMpXG5cdFx0XHQvL3Njb3BlLiR3YXRjaCgnbm90ZXMnLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAvLyBhbGwgdGhlIGNvZGUgaGVyZS4uLlxuICAgIFx0XHRcbiAgICBcdFx0XG5cdFx0XHRcblxuXHRcdFx0ZWxlbWVudC5zb3J0YWJsZSh7XG5cdFx0XHRcdGNvbm5lY3RXaXRoOiBcIi5jb25uZWN0ZWRTb3J0YWJsZVwiLFxuXHRcdCAgICAgICAvL3BsYWNlaG9sZGVyOiBcInVpLXN0YXRlLWhpZ2hsaWdodFwiLFxuXHRcdCAgICAgICAgc3RhcnQ6IGZ1bmN0aW9uKGV2ZW50LCB1aSkge1xuXHRcdCAgICAgICAgXHRjb25zb2xlLmxvZyhcIlNUQVJUIFNUQVJUIFNUQVJUIFNUQVJUIFNUQVJUXCIpXG5cdFx0ICAgICAgICBcdGNvbnNvbGUubG9nKGVsZW1lbnQpXG5cdFx0ICAgICAgICBcdGNvbnNvbGUubG9nKHRlbXBEYXRhKVxuXHRcdCAgICAgICAgXHRcblxuXHRcdCAgICAgICAgXHR0ZW1wRGF0YS5zdGFydE5vdGUgPSBhbmd1bGFyLmNvcHkoc2NvcGUubm90ZSk7XG5cdFx0ICAgICAgICBcdHRlbXBEYXRhLnN0YXJ0Tm90ZUluZGV4ID0gYXR0cnMubm90ZWluZGV4O1xuXHRcdFx0XHRcdHRlbXBEYXRhLnN0YXJ0Tm90ZUl0ZW1JbmRleCA9IHVpLml0ZW0uaW5kZXgoKTtcblx0XHRcdFx0XHR0ZW1wRGF0YS5zdGFydE5vdGVJdGVtQ29udGVudCA9IHRlbXBEYXRhLnN0YXJ0Tm90ZS5pdGVtc1t0ZW1wRGF0YS5zdGFydE5vdGVJdGVtSW5kZXhdO1xuXHRcdCAgIFx0XHRcdFxuXHRcdCAgIFx0XHRcdHRlbXBOb3RlID0gYW5ndWxhci5jb3B5KHNjb3BlLm5vdGUpXG5cdFx0ICAgXHRcdFx0Y29uc29sZS5sb2codGVtcE5vdGUpXG5cblx0XHQgICAgICAgIH0sXG5cdFx0ICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uKGV2ZW50LCB1aSkge1xuXG5cdFx0ICAgICAgIC8vIGNvbnNvbGUubG9nKHNjb3BlLnRlbXBEYXRhKVx0XG5cdCAgICAgICAgIFx0aWYgKCF1aS5zZW5kZXIpIHtcdFx0ICAgICAgIFxuXHRcdFx0ICAgICAgICAgY29uc29sZS5sb2coXCJVUERBVEUgVVBEQVRFIFVQREFURSBVUERBVEUgVVBEQVRFIElOU0lERSBJRlwiIClcblxuXHRcdFx0ICAgICAgICBcblx0XHRcdFx0XHRcdFx0XHQgICAgICAgICBcblxuXHRcdFx0XHRcdHZhciBzdGFydF9wb3MgPSB0ZW1wRGF0YS5zdGFydE5vdGVJdGVtSW5kZXg7XG5cdFx0XHRcdFx0dmFyIGVuZF9wb3MgPSB1aS5pdGVtLmluZGV4KCk7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coc3RhcnRfcG9zICsgJyAtICcgKyBlbmRfcG9zKTtcblxuXHRcdFx0XHRcdHRlbXBOb3RlLml0ZW1zLnNwbGljZShzdGFydF9wb3MsMSlcblx0XHRcdFx0XHR0ZW1wTm90ZS5pdGVtcy5zcGxpY2UoZW5kX3BvcywwLCB0ZW1wRGF0YS5zdGFydE5vdGVJdGVtQ29udGVudClcblx0XHRcdFx0XHQvL3Njb3BlLm5vdGUgPSB0ZW1wTm90ZVxuXHRcdFx0XHRcdHNjb3BlLm5vdGVzW3RlbXBEYXRhLnN0YXJ0Tm90ZUluZGV4XSA9IHRlbXBOb3RlO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKHNjb3BlLm5vdGVzKVxuXG5cdFx0XHRcdFx0dmFyIHJhc3QgPSB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJhZHNAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiczFcIixcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJsYXVuc2RyeVwiLCBcImFwc3BseSBqb2JzXCIsIFwiZ3N5bVwiIF0sXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMS8xLzIyMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIxLzIyLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3pzZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgICAgIH1cblxuXHRcdFx0XHRcdC8vc2NvcGUubm90ZXNbMF0uaXRlbXMucHVzaChcIlBVQ0tTXCIpXG5cblx0XHRcdFx0XHRzY29wZS4kYXBwbHkoKTtcblxuXHRcdCAgIC8vICAgICAgICAgLy9jb25zb2xlLmxvZyhzY29wZS5ub3Rlcylcblx0XHRcdCAgICB9ICAgXG5cdFx0ICAgICAgICAgICBcblx0XHQgICAgICAgIH0sIC8vZW5kIHVwZGF0ZVxuXHRcdCAgICAgICAgcmVjZWl2ZTogZnVuY3Rpb24oZXZlbnQsIHVpKXtcblx0XHQgICAgICAgIFx0Y29uc29sZS5sb2coXCJSRUNFSVZFIFJFQ0VJVkUgUkVDRUlWRSBSRUNFSVZFIFJFQ0VJVkVcIilcblx0XHQgICAgICAgIFx0Y29uc29sZS5sb2codGVtcERhdGEpXG5cblx0XHQgICAgICAgIFx0dGVtcERhdGEuZW5kTm90ZSA9IGFuZ3VsYXIuY29weShzY29wZS5ub3RlKTtcblx0XHQgICAgICAgIFx0dGVtcERhdGEuZW5kTm90ZUluZGV4ID0gYXR0cnMubm90ZWluZGV4O1xuXHRcdFx0XHRcdHRlbXBEYXRhLmVuZE5vdGVJdGVtSW5kZXggPSB1aS5pdGVtLmluZGV4KCk7XG5cblx0XHRcdFx0XHRcblxuXHRcdFx0XHRcdCAgLy9jb25zb2xlLmxvZyhcInJlbW92aW5nIGl0ZW06IFwiICsgc2NvcGUubm90ZXNbbm90ZU9yaWdpbkluZGV4XS5pdGVtc1tzdGFydF9wb3NdKTtcblx0XHQgICAgICAgICAgIHRlbXBEYXRhLnN0YXJ0Tm90ZS5pdGVtcy5zcGxpY2UodGVtcERhdGEuc3RhcnROb3RlSXRlbUluZGV4LDEpXG5cdFx0XHQgICAgICAgdGVtcERhdGEuZW5kTm90ZS5pdGVtcy5zcGxpY2UodGVtcERhdGEuZW5kTm90ZUl0ZW1JbmRleCwwLHRlbXBEYXRhLnN0YXJ0Tm90ZUl0ZW1Db250ZW50KVxuXHRcdFx0ICAgICAgIGNvbnNvbGUubG9nKHRlbXBEYXRhKVxuXG5cdFx0XHQgICAgICAgc2NvcGUubm90ZXNbdGVtcERhdGEuc3RhcnROb3RlSW5kZXhdID0gdGVtcERhdGEuc3RhcnROb3RlO1xuXHRcdFx0ICAgICAgIHNjb3BlLm5vdGVzW3RlbXBEYXRhLmVuZE5vdGVJbmRleF0gPSB0ZW1wRGF0YS5lbmROb3RlO1xuXHQgICAgICAgICAgIFx0XG5cdCAgICAgICAgICAgXHRcdGNvbnNvbGUubG9nKHRlbXBEYXRhLnN0YXJ0Tm90ZS5pdGVtcylcblx0ICAgICAgICAgICBcdFx0Y29uc29sZS5sb2codGVtcERhdGEuZW5kTm90ZS5pdGVtcylcblxuXHRcdCAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImFkZGluZyBhZnRlciBwb3NpdGlvbjogXCIgKyBlbmRfcG9zKVxuXHRcdCAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImFkZGluZyBhZnRlcjogXCIgKyBzY29wZS5ub3Rlc1tub3RlRGVzdGluYXRpb25JbmRleF0uaXRlbXNbZW5kX3Bvc10pXG5cdFx0ICAgICAgICAgICAvL3Njb3BlLm5vdGVzW25vdGVEZXN0aW5hdGlvbkluZGV4XS5pdGVtcy5zcGxpY2UoZW5kX3BvcywwLCBzdGFydEl0ZW0pXG5cblx0XHQgICAgICAgIFx0Ly9zY29wZS50ZW1wRGF0YSA9IFwicHJhd25zXCI7XG5cdFx0ICAgICAgICBcdFxuXHRcdCAgICAgICAgXHRcblx0XHQgICAgICAgIFx0Ly8gY29uc29sZS5sb2codGVtcERhdGEpXG5cdFx0ICAgICAgICBcdC8vIC8vY29uc29sZS5sb2coc2NvcGUubm90ZSk7XG5cdFx0ICAgICAgICBcdHZhciByYXN0ID0ge1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyYWRzQG5qaXQuZWR1XCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcInMxXCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwibGF1bnNkcnlcIiwgXCJhcHNwbHkgam9ic1wiLCBcImdzeW1cIiBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjEvMS8yMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMS8yMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96c2UuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9XG5cdFx0ICAgICAgICBcdFxuXHRcdCAgICAgICAgICAgc2NvcGUuJGFwcGx5KCk7XG5cdFx0XG5cblx0XHQgICAgICAgIH1cblxuXHRcdCAgICB9KTsgLy8gZW5kIHNvcnRhYmxlXG5cblx0XHQgLy8gIH0pOyAvL2VuZCB3YXRjaFxuXG5cblxuXHRcdH0sXG5cdFx0Y29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKXtcblxuXHRcdFx0JHNjb3BlLm1vb3NlID0gXCJkaW5nXCJcblx0XHRcdCRzY29wZS5kZWxldGVJdGVtID0gZnVuY3Rpb24ocGFyZW50SW5kZXgsIGluZGV4KXtcblx0XHRcdFx0Y29uc29sZS5sb2cocGFyZW50SW5kZXgpXG5cdFx0XHRcdGNvbnNvbGUubG9nKGluZGV4KVxuXHRcdFx0XHQkc2NvcGUubm90ZXNbcGFyZW50SW5kZXhdLml0ZW1zLnNwbGljZShpbmRleCwxKVxuXG5cdFx0XHR9XG5cblx0XHRcdCRzY29wZS5yYW5kb21JZCA9IGZ1bmN0aW9uKGl0ZW0pe1xuICAgXHRcdFx0IHJldHVybiBcIklEXCIgKyBpdGVtICsgKE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiA5OTkpICsgMSkpO1xuXHRcdFx0fVxuXHRcdFx0Ly9hbGVydChcImNvbnRyb2xsZXJcIik7XG5cdFx0XHQvLyAkc2NvcGUuZG9ncyA9ICRzY29wZS5kYXRhICsgXCJkb2dzXCI7XG5cdFx0XHQvLyBpZigkc2NvcGUuZHJhZ2dhYmxlKVxuXHRcdFx0Ly8gXHQkc2NvcGUuZHJhZ1N0YXR1cyA9IGZhbHNlO1xuXHRcdFx0Ly8gZWxzZSAkc2NvcGUuZHJhZ1N0YXR1cyA9IHRydWU7XG5cblx0XHRcdGNvbnNvbGUubG9nKCRzY29wZSlcblxuXHRcdFx0XG5cdFx0fVxuXHR9XG59IC8vZW5kIG5vdGVjYXJkIGRpcmVjdGl2ZVxuXG5cblxuXG5cbiIsIihmdW5jdGlvbigpe1xuXHQndXNlIHN0cmljdCdcblxuXHRhbmd1bGFyXG4gICAgXHQubW9kdWxlKCdidWRnZXQnKVxuICAgIFx0LmZhY3RvcnkoJ2J1ZGdldFNlcnZpY2UnLCBidWRnZXRTZXJ2aWNlKTtcblxuICAgIGJ1ZGdldFNlcnZpY2UuJGluamVjdCA9IFsnJGh0dHAnXVxuXG4gICAgZnVuY3Rpb24gYnVkZ2V0U2VydmljZSgkaHR0cCkge1xuICAgIFx0dmFyIHNlcnZpY2UgPSB7XG5cbiAgICAgICAgICAgIGdldE5vdGU6IGdldE5vdGUsXG4gICAgICAgICAgICBnZXROb3RlczogZ2V0Tm90ZXMsXG4gICAgICAgICAgICBzYXZlTm90ZXM6IHNhdmVOb3Rlc1xuXG5cbiAgICBcdH07XG5cbiAgICBcdHJldHVybiBzZXJ2aWNlO1xuXG4gICAgXHQvLy8vLy8vLy8vLy9cblxuICAgICAgICAvLyBnZXRzIGEgc2luZ2xlIG5vdGVcbiAgICAgICAgZnVuY3Rpb24gZ2V0Tm90ZSAoKSB7XG5cbiAgICAgICAgICAgIHZhciBub3RlID0ge1xuICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJ0b2RvXCIsXG4gICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJsYXVuZHJ5XCIsIFwiYXBwbHkgam9ic1wiLCBcImd5bVwiIF0sXG4gICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIxLzEvMjAxNlwiLFxuICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIxLzIvMjAxNlwiLFxuICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96ZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbm90ZTtcblxuICAgICAgICB9IC8vZW5kIGdldE5vdGUoKVxuXG5cbiAgICAgICAgLy8gZ2V0cyBhbGwgbm90ZXNcbiAgICAgICAgZnVuY3Rpb24gZ2V0Tm90ZXMgKCkge1xuXG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCdodHRwOi8vbG9jYWxob3N0OjMwMDAvYXBpL25vdGVzL2dldE5vdGVzJyx7ZW1haWw6XCJtb2l6QGdtYWlsLmNvbVwifSlcbiAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgIFxuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgbm90ZXMgPSBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyQG5qaXQuZWR1XCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIjFcIixcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJsYXVuZHJ5XCIsIFwiYXBwbHkgam9ic1wiLCBcImd5bVwiIF0sXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMS8xLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjEvMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96ZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyQG5qaXQuZWR1XCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIjJcIixcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJodG1sNSBkcmFnIGFuZCBkcm9wXCIsIFwic29ja2V0LmlvXCIsIFwibm9kZWpzXCIgXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIyLzEvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMi8yLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3plLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiM1wiLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImJvc2UgaGVhZHBob25lc1wiLCBcIjIwMTYgaG9uZGEgZ3JpbGxcIiwgXCJzb2xpZCBzdGF0ZSBoYXJkIGRyaXZlXCIgXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIxLzEvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMS8yLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3plLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiNFwiLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImxhdW5kcnlcIiwgXCJhcHBseSBqb2JzXCIsIFwiZ3ltXCIgXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIxLzEvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMS8yLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3plLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiNVwiLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImh0bWw1IGRyYWcgYW5kIGRyb3BcIiwgXCJzb2NrZXQuaW9cIiwgXCJub2RlanNcIiBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjIvMS8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIyLzIvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvemUuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMkBuaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCI2XCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwiYm9zZSBoZWFkcGhvbmVzXCIsIFwiMjAxNiBob25kYSBncmlsbFwiLCBcInNvbGlkIHN0YXRlIGhhcmQgZHJpdmVcIiBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjEvMS8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIxLzIvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvemUuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMkBuaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCI3XCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwibGF1bmRyeVwiLCBcImFwcGx5IGpvYnNcIiwgXCJneW1cIixcImJvc2UgaGVhZHBob25lc1wiLCBcIjIwMTYgaG9uZGEgZ3JpbGxcIiwgXCJzb2xpZCBzdGF0ZSBoYXJkIGRyaXZlXCIgIF0sXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMS8xLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjEvMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96ZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyQG5qaXQuZWR1XCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIjhcIixcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJodG1sNSBkcmFnIGFuZCBkcm9wXCIsIFwic29ja2V0LmlvXCIsIFwibm9kZWpzXCIgXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIyLzEvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMi8yLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3plLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiOVwiLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImJvc2UgaGVhZHBob25lc1wiLCBcIjIwMTYgaG9uZGEgZ3JpbGxcIiwgXCJzb2xpZCBzdGF0ZSBoYXJkIGRyaXZlXCIsXCJodG1sNSBkcmFnIGFuZCBkcm9wXCIsIFwic29ja2V0LmlvXCIsIFwibm9kZWpzXCIgIF0sXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMS8xLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjEvMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96ZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF0gLy9lbmQgbm90ZXMgYXJyYXlcblxuICAgICAgICAgICAgLy9yZXR1cm4gbm90ZXNcbiAgICAgICAgfSAvL2VuZCBnZXQgbm90ZXNcblxuICAgICAgICBmdW5jdGlvbiBzYXZlTm90ZXMobm90ZXMpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCdodHRwOi8vbG9jYWxob3N0OjMwMDAvYXBpL25vdGVzL3VwZGF0ZU5vdGVzJyx7ZW1haWw6XCJtb2l6QGdtYWlsLmNvbVwiLG5vdGVzOiBub3Rlc30pXG4gICAgICAgIH1cblxuXG5cbiAgICB9XG5cblx0XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0J1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCdtZW1iZXJzJylcblx0XHQuY29udHJvbGxlcignbWVtYmVyc0N0cmwnLCBtZW1iZXJzQ3RybClcblxuXHRtZW1iZXJzQ3RybC4kaW5qZWN0ID0gWyckaHR0cCddXG5cblx0ZnVuY3Rpb24gbWVtYmVyc0N0cmwoJGh0dHApIHtcblxuXHQgICAgdmFyIHZtID0gdGhpcztcblxuXHQgICAgdm0ubWVtYmVyc0NvbnRlbnQgPSBtZW1iZXJzQ29udGVudCgpO1xuXHQgICAgdm0uZ290b1Nlc3Npb24gPSBnb3RvU2Vzc2lvbjtcblx0ICAgIHZtLnJlZnJlc2ggPSByZWZyZXNoO1xuXHQgICAgdm0uc2VhcmNoID0gc2VhcmNoO1xuXHQgICAgdm0uc2Vzc2lvbnMgPSBbXTtcblx0ICAgIHZtLnRpdGxlID0gJ21lbWJlcnMnO1xuXG5cdCAgICAvLy8vLy8vLy8vLy9cblxuXHQgICAgZnVuY3Rpb24gbWVtYmVyc0NvbnRlbnQoKXtcblx0ICAgIFx0IC8vICRodHRwLmdldCgnaHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaS91c2Vycy9hbGwnKVxuXHQgICAgXHRcdC8vIC50aGVuKGZ1bmN0aW9uKHJlcyl7XG5cdCAgICBcdFx0Ly8gXHRjb25zb2xlLmxvZyhyZXMuZGF0YSlcblx0ICAgIFx0XHQvLyBcdHZtLm1lbWJlcnNDb250ZW50ID0gcmVzLmRhdGE7XG5cdCAgICBcdFx0Ly8gfSxcblx0ICAgIFx0XHQvLyBmdW5jdGlvbihlcnIpe1xuXHQgICAgXHRcdC8vIFx0Y29uc29sZS5sb2coZXJyLnN0YXR1cyArIFwiIFwiICsgZXJyLnN0YXR1c1RleHQpO1xuXHQgICAgXHRcdC8vIFx0dm0ubWVtYmVyc0NvbnRlbnQgPSBlcnIuZGF0YTtcblx0ICAgIFx0XHQvLyB9KVxuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBnb3RvU2Vzc2lvbigpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gcmVmcmVzaCgpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gc2VhcmNoKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXHR9XG5cbn0pKCk7XG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cdCd1c2Ugc3RyaWN0J1xuXG5cdGFuZ3VsYXJcbiAgICBcdC5tb2R1bGUoJ3NhbXBsZScpXG4gICAgXHQuZmFjdG9yeSgnc2FtcGxlU2VydmljZScsIHNhbXBsZVNlcnZpY2UpO1xuXG4gICAvLyBzYW1wbGVTZXJ2aWNlLmluamVjdCA9IFsnJ11cblxuICAgIGZ1bmN0aW9uIHNhbXBsZVNlcnZpY2UoKSB7XG4gICAgXHR2YXIgc2VydmljZSA9IHtcblxuICAgIFx0XHRlcnJvcjogZXJyb3IsXG4gICAgXHRcdGluZm86IGluZm8sXG4gICAgXHRcdHN1Y2Nlc3M6IHN1Y2Nlc3NcblxuICAgIFx0fTtcblxuICAgIFx0cmV0dXJuIHNlcnZpY2U7XG5cbiAgICBcdC8vLy8vLy8vLy8vL1xuXG4gICAgXHRmdW5jdGlvbiBlcnJvcigpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gaW5mbygpIHtcblx0ICAgICAgLyogKi9cbiAgICAgICAgICAvL2NvbnNvbGUubG9nKFwic2FtcGxlU2VydmljZVwiKTtcblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gc3VjY2VzcygpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblxuXG4gICAgfVxuXG5cdFxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCdcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnbm90ZXMnKVxuXHRcdC5jb250cm9sbGVyKCdub3Rlc0N0cmwnLCBub3Rlc0N0cmwpXG5cblx0bm90ZXNDdHJsLiRpbmplY3QgPSBbJ25vdGVzU2VydmljZScsJyRzY29wZScsJyRodHRwJywndG9hc3RyJywnJHdpbmRvdyddXG5cblx0ZnVuY3Rpb24gbm90ZXNDdHJsKG5vdGVzU2VydmljZSwkc2NvcGUsICRodHRwLCB0b2FzdHIsICR3aW5kb3cpIHtcblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdGNvbnNvbGUubG9nKFwibm90ZXMgYmFsbHNvdXRcIik7XG5cblx0XHR2bS5nZXROb3Rlc0xpc3QgPSBmdW5jdGlvbigpe1xuXHRcdFx0bm90ZXNTZXJ2aWNlLmdldE5vdGVzTGlzdCgpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKGRhdGEpO1xuXHRcdFx0XHR2bS5hbGxOb3RlcyA9IGRhdGEuZGF0YS5ub3Rlcztcblx0XHRcdFx0Y29uc29sZS5sb2codm0uYWxsTm90ZXMpO1xuXHRcdFx0fSlcblx0XHR9XG5cdFx0dm0uZ2V0Tm90ZXNMaXN0KCk7XG5cdFx0dm0uYWN0aXZlTm90ZXMgPSBbXTtcblx0XHR2bS5nZXRTaW5nbGVOb3RlID0gZ2V0U2luZ2xlTm90ZTtcblxuXG5cdFx0dm0uc2F2ZU5vdGUgPSBzYXZlTm90ZTtcblx0XHR2bS5kZWxldGVOb3RlID0gZGVsZXRlTm90ZTtcblx0XHR2bS51cGRhdGVOb3RlQ29udGVudCA9IHVwZGF0ZU5vdGVDb250ZW50O1xuXHRcdHZtLnVwZGF0ZU5vdGVUaXRsZSA9IHVwZGF0ZU5vdGVUaXRsZTtcblx0XHR2bS5uZXdOb3RlID0gbmV3Tm90ZTtcblxuXHRcdHZtLmFjdGl2YXRlID0gYWN0aXZhdGU7XG5cdFx0dm0uY2xvc2VUYWIgPSBjbG9zZVRhYjtcblx0XHRcblx0XHR2bS5zaG93TGlzdCA9IHRydWU7XG5cdFx0dm0uZ3JpZE1vZGUgPSB0cnVlO1xuXG4gIFxuXHQgIFx0JHNjb3BlLnRpbnltY2VPcHRpb25zID0ge1xuXHRcdCAgICBwbHVnaW5zOiAnbGluayBpbWFnZSBjb2RlJyxcblx0XHQgICAgdG9vbGJhcjogJ3VuZG8gcmVkbyB8IGJvbGQgaXRhbGljIHwgYWxpZ25sZWZ0IGFsaWduY2VudGVyIGFsaWducmlnaHQgfCBjb2RlIHwgcGFzdGUnXG5cdFx0ICB9O1xuXG5cdFx0JHNjb3BlLnRpdGxlID0gXCJyYXRzdHNcIjtcblx0XHQkc2NvcGUuZG9ncyA9XCJmcm9hZHNhc2RmYWRzZ3NcIlxuXHRcdHZtLnRpbnltY2VNb2RlbCA9ICdJbml0aWFsIGNvbnNkc2R0ZW50JztcblxuXG5cdFx0XG5cblx0XHRmdW5jdGlvbiBnZXROb3Rlc0xpc3QoKSB7XG5cdFx0XHRcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBnZXRTaW5nbGVOb3RlKG5vdGVJZCkge1xuXHRcdFx0IG5vdGVzU2VydmljZS5nZXRTaW5nbGVOb3RlKG5vdGVJZCkudGhlbihmdW5jdGlvbigpe1xuXHRcdFx0IFx0cmV0dXJuIGRhdGEuZGF0YTtcblx0XHRcdCB9KVxuXG5cdFx0fVxuXG5cblx0ICAgIGZ1bmN0aW9uIGFjdGl2YXRlKG5vdGVJZCkge1xuXHQgICAgXHR2YXIgcGVybWlzc2lvblRvQWN0aXZhdGUgPSB0cnVlO1xuICAgIFx0XHQvLyBjaGVja3MgaWYgdGFiIGFscmVhZHkgb3BlblxuICAgIFx0XHRpZih2bS5hY3RpdmVOb3Rlcy5sZW5ndGggPiAwICYmIHZtLmFjdGl2ZU5vdGVzLmxlbmd0aCAhPT0gNCApe1xuICAgIFx0XHRcdGNvbnNvbGUubG9nKCdsb29waW5nJylcblx0ICAgIFx0XHRhbmd1bGFyLmZvckVhY2godm0uYWN0aXZlTm90ZXMsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdCAgICBcdFx0XHRjb25zb2xlLmxvZyh2YWx1ZS5faWQudG9TdHJpbmcoKSk7XG5cdCAgICBcdFx0XHRjb25zb2xlLmxvZyhub3RlSWQudG9TdHJpbmcoKSk7XG5cdFx0XHRcdCAgaWYodmFsdWUuX2lkLnRvU3RyaW5nKCkgPT0gbm90ZUlkLnRvU3RyaW5nKCkpe1xuXHRcdFx0XHQgIFx0cGVybWlzc2lvblRvQWN0aXZhdGUgPSBmYWxzZTtcblx0XHRcdFx0ICBcdHRvYXN0ci5lcnJvcihcIldob29wcyEgTG9va3MgbGlrZSB0aGlzIG5vdGUgaXMgYWxyZWFkeSBvcGVuXCIpXG5cdFx0XHRcdCAgfVxuXHRcdFx0XHR9KTsvL2VuZCBmb3JlYWNoXG5cdFx0XHR9XG5cdFx0ICAgIGlmKHZtLmFjdGl2ZU5vdGVzLmxlbmd0aCA9PSA0KXtcblx0XHQgICAgXHRcdGNvbnNvbGUubG9nKFwiY2hlY2tpbmcgbWF4XCIpO1xuXHRcdCAgICBcdFx0cGVybWlzc2lvblRvQWN0aXZhdGUgPSBmYWxzZTtcblx0XHQgICAgXHRcdHRvYXN0ci5lcnJvcihcIldob29wcyEgTG9va3MgbGlrZSB5b3UgaGF2ZSByZWFjaGVkIHRoZSBtYXggbnVtYmVyIG9mIHRhYnMoNClcIilcblx0XHQgICAgfVxuXHRcdFxuXHQgICAgXHRpZihwZXJtaXNzaW9uVG9BY3RpdmF0ZSA9PSB0cnVlKXtcblx0XHRcdCAgXHRjb25zb2xlLmxvZyhcImVsc2UgcHVzaGluZ1wiKTtcblx0XHRcdCAgXHRjb25zb2xlLmxvZyhub3RlSWQpXG5cdFx0XHQgIFx0bm90ZXNTZXJ2aWNlLmdldFNpbmdsZU5vdGUobm90ZUlkKS50aGVuKGZ1bmN0aW9uKHJlcyl7XG5cdFx0XHQgIFx0XHR2YXIgbm90ZSA9IHJlcy5kYXRhLmRhdGE7XG5cdFx0XHQgIFx0XHR2bS5hY3RpdmVOb3Rlcy5wdXNoKG5vdGUpO1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKHZtLmFjdGl2ZU5vdGVzKVxuXHRcdFx0ICBcdH0pXG5cdFx0XHQgIFx0XG5cdFx0XHR9IFxuXHQgICAgXHRcblx0ICAgIH0gLy9lbmQgZnVuY3Rpb24gYWN0aXZhdGVcblxuXHQgICAgZnVuY3Rpb24gY2xvc2VUYWIoaW5kZXgpIHtcblx0ICAgICAgdm0uYWN0aXZlTm90ZXMuc3BsaWNlKGluZGV4LDEpO1xuXHQgICAgICBjb25zb2xlLmxvZyh2bS5hY3RpdmVOb3RlcylcblxuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBuZXdOb3RlKCkge1xuXHQgICAgXHQvLyBmaXJzdCBjaGVjayBpZiBhY3RpdmUgbm90ZXMgaXMgZnVsbFxuXHQgICAgXHRpZih2bS5hY3RpdmVOb3Rlcy5sZW5ndGggPT0gNCl7XG5cdCAgICBcdFx0cmV0dXJuIHRvYXN0ci5lcnJvcihcIldob29wcyEgUGxlYXNlIGNsb3NlIGEgdGFiIGJlZm9yZSBjcmVhdGluZyBhIG5ldyBub3RlXCIpO1xuXHQgICAgXHR9XG5cblx0ICAgIFx0XG5cdCAgICBcdC8vIGdldCB0b2tlblxuXHQgICAgXHR2YXIgdG9rZW4gPSAkd2luZG93LnNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ3VzZXJUb2tlbicpO1xuXG5cdCAgICBcdC8vIHNlbmQgbmV3IG5vdGUgb2JqZWN0XG5cdCAgICBcdG5vdGVzU2VydmljZS5hZGROZXdOb3RlKCkudGhlbihmdW5jdGlvbihkYXRhKXtcblx0ICAgIFx0XHRjb25zb2xlLmxvZyhkYXRhKTtcblxuXHQgICAgXHRcdG5vdGVzU2VydmljZS5nZXROb3Rlc0xpc3QoKS50aGVuKGZ1bmN0aW9uKGRhdGEpe1xuXHQgICAgXHRcdFx0Ly8gcHVzaCBuZXcgbm90ZSB0byBhY3RpdmUgbm90ZXNcblx0ICAgIFx0XHRcdHZtLmFsbE5vdGVzID0gZGF0YS5kYXRhLm5vdGVzO1xuXHRcdCAgICBcdFx0dmFyIG5ld05vdGVJbmRleCA9IHZtLmFsbE5vdGVzLmxlbmd0aC0xO1xuXHRcdCAgICBcdFx0YWN0aXZhdGUodm0uYWxsTm90ZXNbbmV3Tm90ZUluZGV4XSk7XG5cdFx0ICAgIFx0XHQvL3Njcm9sbCB0byB0aGUgbmV3IG5vdGVcblx0ICAgIFx0XHRcdHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gXCJub3RlcyNcIiArIHZtLmFsbE5vdGVzW25ld05vdGVJbmRleF0uX2lkO1xuXG5cdFx0ICAgIFx0XHQvLyBsb2cgbmV3IGFjdGl2ZSBub3Rlc1xuXHRcdCAgICBcdFx0Y29uc29sZS5sb2codm0uYWN0aXZlTm90ZXMpO1xuXHQgICAgXHRcdH0pXG5cdCAgICBcdFx0XG5cdCAgICBcdFx0XG5cdCAgICBcdH0pO1xuXHRcdFx0XG5cdCAgICBcdFxuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiB1cGRhdGVOb3RlQ29udGVudChub3RlSWQsIG5vdGVDb250ZW50KSB7XG5cblx0ICAgIFx0bm90ZXNTZXJ2aWNlLnVwZGF0ZU5vdGVDb250ZW50KG5vdGVJZCwgbm90ZUNvbnRlbnQpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG5cdCAgICBcdFx0Y29uc29sZS5sb2coZGF0YSk7XG5cdCAgICBcdFx0aWYoZGF0YS5kYXRhLm5Nb2RpZmllZCA9PSAxKXtcblx0ICAgIFx0XHRcdHRvYXN0ci5zdWNjZXNzKFwiTm90ZSBTYXZlZCFcIilcblx0ICAgIFx0XHR9XG5cdCAgICBcdH0pXG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIHVwZGF0ZU5vdGVUaXRsZShub3RlSWQsIG5vdGVUaXRsZSkge1xuXG5cdCAgICBcdG5vdGVzU2VydmljZS51cGRhdGVOb3RlVGl0bGUobm90ZUlkLCBub3RlVGl0bGUpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG5cdCAgICBcdFx0Y29uc29sZS5sb2coZGF0YSk7XG5cdCAgICBcdFx0aWYoZGF0YS5kYXRhLm5Nb2RpZmllZCA9PSAxKXtcblx0ICAgIFx0XHRcdHZtLmdldE5vdGVzTGlzdCgpO1xuXHQgICAgXHRcdH1cblx0ICAgIFx0fSlcblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gZGVsZXRlTm90ZShub3RlSWQsaW5kZXgpe1xuXHQgICAgXHRjb25zb2xlLmxvZygnZGVsZXRpbmcnKVxuXHQgICAgXHRub3Rlc1NlcnZpY2UuZGVsZXRlTm90ZShub3RlSWQpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG5cdCAgICBcdFx0aWYoZGF0YS5kYXRhLm5Nb2RpZmllZCA9PSAxKXtcblx0ICAgIFx0XHRcdGNsb3NlVGFiKGluZGV4KVxuXHQgICAgXHRcdFx0dG9hc3RyLnN1Y2Nlc3MoXCJOb3RlIERlbGV0ZWQhXCIpXG5cdCAgICBcdFx0XHR2bS5nZXROb3Rlc0xpc3QoKTtcblx0ICAgIFx0XHR9XG5cdCAgICBcdFx0XG5cdCAgICBcdH0pO1xuXHQgICAgXHRcblx0ICAgIH1cblxuXHQgICBcblx0XHRmdW5jdGlvbiBzYXZlTm90ZSgpIHtcblxuXHRcdH1cblxuXG5cdFx0ZnVuY3Rpb24gdXBkYXRlTm90ZSgpIHtcblxuXHRcdH1cblxuXHR9XG5cbn0pKCk7XG5cblxuIiwiLy8gYW5ndWxhclxuLy8gICAgIC5tb2R1bGUoJ25vdGVzJylcbi8vICAgICAuZGlyZWN0aXZlKCdub3RlQ2FyZCcsIG5vdGVDYXJkKTtcblxuLy8gZnVuY3Rpb24gbm90ZUNhcmQoKSB7XG4vLyBcdHJldHVybntcbi8vIFx0XHRyZXN0cmljdDogJ0UnLFxuLy8gXHRcdHNjb3BlOiB7XG4vLyBcdFx0XHRkYXRhOiBcIj1cIixcbi8vIFx0XHRcdGRyYWdnYWJsZTogXCI9XCJcbi8vIFx0XHR9LFxuLy8gXHRcdHJlcGxhY2U6IHRydWUsXG4vLyBcdFx0dGVtcGxhdGU6IFwiPGgxPnt7ZG9nc319e3tkcmFnU3RhdHVzfX08L2gxPlwiLFxuLy8gXHRcdGxpbms6IGZ1bmN0aW9uKHNjb3BlLGVsZW1lbnQpe1xuLy8gXHRcdFx0ZWxlbWVudC5jbGljayhmdW5jdGlvbigpe1xuLy8gXHRcdFx0XHRjb25zb2xlLmxvZyhlbGVtZW50KVxuLy8gXHRcdFx0XHRlbGVtZW50WzBdLmRyYWdnYWJsZSA9IHRydWU7XG4vLyBcdFx0XHR9KVxuLy8gXHRcdH0sXG4vLyBcdFx0Y29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKXtcbi8vIFx0XHRcdC8vYWxlcnQoXCJjb250cm9sbGVyXCIpO1xuLy8gXHRcdFx0JHNjb3BlLmRvZ3MgPSAkc2NvcGUuZGF0YSArIFwiZG9nc1wiO1xuLy8gXHRcdFx0aWYoJHNjb3BlLmRyYWdnYWJsZSlcbi8vIFx0XHRcdFx0JHNjb3BlLmRyYWdTdGF0dXMgPSBmYWxzZTtcbi8vIFx0XHRcdGVsc2UgJHNjb3BlLmRyYWdTdGF0dXMgPSB0cnVlO1xuXG5cdFx0XHRcbi8vIFx0XHR9XG4vLyBcdH1cbi8vIH1cblxuXG5cbi8vIC8vIGFuZ3VsYXJcbi8vIC8vICAgICAubW9kdWxlKCdub3RlcycpXG4vLyAvLyAgICAgLmRpcmVjdGl2ZSgnbm90ZUNhcmQnLCBub3RlQ2FyZCk7XG5cbi8vIC8vIGZ1bmN0aW9uIG5vdGVDYXJkKCkge1xuLy8gLy8gXHRyZXR1cm57XG4vLyAvLyBcdFx0cmVzdHJpY3Q6ICdFJyxcbi8vIC8vIFx0XHRjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpe1xuLy8gLy8gXHRcdFx0YWxlcnQoXCJjb250cm9sbGVyXCIpO1xuLy8gLy8gXHRcdFx0Y29uc29sZS5sb2coJ2RvZycpXG4vLyAvLyBcdFx0fSxcbi8vIC8vIFx0XHR0ZW1wbGF0ZVVybDogJycsXG4vLyAvLyBcdFx0cmVwbGFjZTogdHJ1ZVxuLy8gLy8gXHRcdC8vIHNjb3BlOiB7fVxuLy8gLy8gXHR9XG4vLyAvLyB9IiwiLy8gYW5ndWxhclxuLy8gICAgIC5tb2R1bGUoJ25vdGVzJylcbi8vICAgICAuZGlyZWN0aXZlKCdub3RlQ2FyZHMnLCBub3RlQ2FyZHMpXG5cblxuICAgIFxuXG4vLyBmdW5jdGlvbiBub3RlQ2FyZHMoKSB7XG4vLyBcdHJldHVybntcbi8vIFx0XHRyZXN0cmljdDogJ0FFJyxcbi8vIFx0XHRzY29wZToge1xuLy8gXHRcdFx0bm90ZXM6IFwiPVwiLFxuLy8gXHRcdFx0bmV3SXRlbTogXCI9XCJcbi8vIFx0XHR9LFxuLy8gXHRcdHJlcGxhY2U6IGZhbHNlLFxuLy8gXHRcdHRyYW5zY2x1ZGU6IGZhbHNlLFxuLy8gXHRcdHRlbXBsYXRlVXJsOiBcImNvbXBvbmVudHMvbm90ZXMvdmlld3Mvbm90ZS5kaXJlY3RpdmUudmlldy5odG1sXCIsXG4vLyBcdFx0bGluazogZnVuY3Rpb24oc2NvcGUsZWxlbWVudCxhdHRycyl7XG4vLyBcdFx0XHQvLyQoIFwiI3NvcnRhYmxlXCIgKS5zb3J0YWJsZSgpO1xuLy8gXHRcdFx0Ly9jb25zb2xlLmxvZyhzY29wZSlcbi8vIFx0XHRcdC8vY29uc29sZS5sb2coZWxlbWVudClcbi8vIFx0XHRcdC8vY29uc29sZS5sb2coYXR0cnMpXG4vLyBcdFx0XHQvL2VsZW1lbnQuc29ydGFibGUoKTtcbi8vIFx0XHRcdC8vY29uc29sZS5sb2coc2NvcGUubm90ZXMpXG4vLyBcdFx0XHRzY29wZS5kb2dzID0gZnVuY3Rpb24obm90ZSl7XG4vLyBcdFx0XHRcdGNvbnNvbGUubG9nKG5vdGUpXG4vLyBcdFx0XHR9XG5cblxuLy8gXHRcdFx0ZWxlbWVudC5zb3J0YWJsZSh7XG4vLyBcdFx0ICAgICAgIC8vIHBsYWNlaG9sZGVyOiBcInVpLXN0YXRlLWhpZ2hsaWdodFwiLFxuLy8gXHRcdCAgICAgICAgc3RhcnQ6IGZ1bmN0aW9uKGV2ZW50LCB1aSkge1xuLy8gXHRcdCAgICAgICAgICAgIHZhciBzdGFydF9wb3MgPSB1aS5pdGVtLmluZGV4KCk7XG4vLyBcdFx0ICAgICAgICAgICAgdWkuaXRlbS5kYXRhKCdzdGFydF9wb3MnLCBzdGFydF9wb3MpO1xuLy8gXHRcdCAgICAgICAgfSxcbi8vIFx0XHQgICAgICAgIHVwZGF0ZTogZnVuY3Rpb24oZXZlbnQsIHVpKSB7XG4vLyBcdFx0ICAgICAgICAgICAgdmFyIHN0YXJ0X3BvcyA9IHVpLml0ZW0uZGF0YSgnc3RhcnRfcG9zJyk7XG4vLyBcdFx0ICAgICAgICAgICAgdmFyIGVuZF9wb3MgPSB1aS5pdGVtLmluZGV4KCk7XG4vLyBcdFx0ICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhzdGFydF9wb3MgKyAnIC0gJyArIGVuZF9wb3MpO1xuXHRcdCAgICAgICAgICBcbi8vIFx0XHQgICAgICAgICAgdmFyIHN0YXJ0SXRlbSA9IHNjb3BlLm5vdGVzW3N0YXJ0X3Bvc107XG4vLyBcdFx0ICAgICAgICAgICBzY29wZS5ub3Rlcy5zcGxpY2Uoc3RhcnRfcG9zLDEpXG4vLyBcdFx0ICAgICAgICAgICBzY29wZS5ub3Rlcy5zcGxpY2UoZW5kX3BvcywwLCBzdGFydEl0ZW0pXG4vLyBcdFx0ICAgICAgICAgICBzY29wZS4kYXBwbHkoKTtcblxuLy8gXHRcdCAgICAgICAgICAgLy9jb25zb2xlLmxvZyhzY29wZS5ub3Rlcylcblx0XHQgICAgICAgICAgIFxuXHRcdCAgICAgICAgICAgXG4vLyBcdFx0ICAgICAgICB9XG4vLyBcdFx0ICAgIH0pOyAvLyBlbmQgc29ydGFibGVcblxuXHRcdCAgIFxuXG4vLyBcdFx0ICAgIGNvbnNvbGUubG9nKGVsZW1lbnQpXG5cblxuLy8gXHRcdH0sXG4vLyBcdFx0Y29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKXtcbi8vIFx0XHRcdCRzY29wZS5mb3JtID17fVxuLy8gXHRcdFx0JHNjb3BlLmFkZEl0ZW0gPSBmdW5jdGlvbihpbmRleCxpdGVtKXtcbi8vIFx0XHRcdFx0Ly9hbGVydChpbmRleClcbi8vIFx0XHRcdFx0Y29uc29sZS5sb2coJHNjb3BlLm5ld0l0ZW0pXG4vLyBcdFx0XHRcdCRzY29wZS5ub3Rlc1tpbmRleF0uaXRlbXMucHVzaChpdGVtKVxuLy8gXHRcdFx0XHQkc2NvcGUuZm9ybSA9IHt9XG4vLyBcdFx0XHRcdC8vY29uc29sZS5sb2coJHNjb3BlLm5vdGVzW2luZGV4XS5pdGVtcylcbi8vIFx0XHRcdH1cblxuLy8gXHRcdFx0JHNjb3BlLmRlbGV0ZU5vdGUgPSBmdW5jdGlvbihpbmRleCl7XG4vLyBcdFx0XHRcdCRzY29wZS5ub3Rlcy5zcGxpY2UoaW5kZXgsMSk7XG4vLyBcdFx0XHR9XG5cblxuLy8gXHRcdFx0Ly9hbGVydChcImNvbnRyb2xsZXJcIik7XG4vLyBcdFx0XHQvLyAkc2NvcGUuZG9ncyA9ICRzY29wZS5kYXRhICsgXCJkb2dzXCI7XG4vLyBcdFx0XHQvLyBpZigkc2NvcGUuZHJhZ2dhYmxlKVxuLy8gXHRcdFx0Ly8gXHQkc2NvcGUuZHJhZ1N0YXR1cyA9IGZhbHNlO1xuLy8gXHRcdFx0Ly8gZWxzZSAkc2NvcGUuZHJhZ1N0YXR1cyA9IHRydWU7XG5cblx0XHRcdFxuLy8gXHRcdH1cbi8vIFx0fVxuLy8gfSAvL2VuZCBub3RlY2FyZHMgZGlyZWN0aXZlXG5cbi8vIGFuZ3VsYXJcbi8vIFx0Lm1vZHVsZSgnbm90ZXMnKVxuLy8gXHQuZGlyZWN0aXZlKCdub3RlQ2FyZCcsIG5vdGVDYXJkKVxuXG4vLyBmdW5jdGlvbiBub3RlQ2FyZCgpIHtcblxuLy8gXHR2YXIgdGVtcERhdGEgPSB7fTtcbi8vIFx0dmFyIHRlbXBOb3RlID0gbnVsbDtcblxuLy8gXHRyZXR1cm57XG4vLyBcdFx0cmVzdHJpY3Q6ICdBRScsXG4vLyBcdFx0c2NvcGU6IHtcbi8vIFx0XHRcdG5vdGU6IFwiPVwiLFxuLy8gXHRcdFx0bm90ZXM6IFwiPVwiXG4vLyBcdFx0fSxcbi8vIFx0XHRyZXBsYWNlOiB0cnVlLFxuLy8gXHRcdHRyYW5zY2x1ZGU6IGZhbHNlLFxuLy8gXHRcdHRlbXBsYXRlVXJsOiBcImNvbXBvbmVudHMvbm90ZXMvdmlld3Mvbm90ZXMuaXRlbXMudmlldy5odG1sXCIsXG4vLyBcdFx0bGluazogZnVuY3Rpb24oc2NvcGUsZWxlbWVudCxhdHRycyl7XG4vLyBcdFx0XHQvLyQoIFwiI3NvcnRhYmxlXCIgKS5zb3J0YWJsZSgpO1xuLy8gXHRcdFx0Ly9jb25zb2xlLmxvZyhzY29wZSlcbi8vIFx0XHRcdC8vY29uc29sZS5sb2coZWxlbWVudClcbi8vIFx0XHRcdC8vY29uc29sZS5sb2coYXR0cnMpXG4vLyBcdFx0XHQvL2VsZW1lbnQuc29ydGFibGUoKTtcbi8vIFx0XHRcdC8vY29uc29sZS5sb2coc2NvcGUubm90ZXMpXG4vLyBcdFx0XHQvL3Njb3BlLiR3YXRjaCgnbm90ZXMnLCBmdW5jdGlvbigpIHtcblxuLy8gICAgICAgICAvLyBhbGwgdGhlIGNvZGUgaGVyZS4uLlxuICAgIFx0XHRcbiAgICBcdFx0XG5cdFx0XHRcblxuLy8gXHRcdFx0ZWxlbWVudC5zb3J0YWJsZSh7XG4vLyBcdFx0XHRcdGNvbm5lY3RXaXRoOiBcIi5jb25uZWN0ZWRTb3J0YWJsZVwiLFxuLy8gXHRcdCAgICAgICAvL3BsYWNlaG9sZGVyOiBcInVpLXN0YXRlLWhpZ2hsaWdodFwiLFxuLy8gXHRcdCAgICAgICAgc3RhcnQ6IGZ1bmN0aW9uKGV2ZW50LCB1aSkge1xuLy8gXHRcdCAgICAgICAgXHRjb25zb2xlLmxvZyhcIlNUQVJUIFNUQVJUIFNUQVJUIFNUQVJUIFNUQVJUXCIpXG4vLyBcdFx0ICAgICAgICBcdGNvbnNvbGUubG9nKGVsZW1lbnQpXG4vLyBcdFx0ICAgICAgICBcdGNvbnNvbGUubG9nKHRlbXBEYXRhKVxuXHRcdCAgICAgICAgXHRcblxuLy8gXHRcdCAgICAgICAgXHR0ZW1wRGF0YS5zdGFydE5vdGUgPSBhbmd1bGFyLmNvcHkoc2NvcGUubm90ZSk7XG4vLyBcdFx0ICAgICAgICBcdHRlbXBEYXRhLnN0YXJ0Tm90ZUluZGV4ID0gYXR0cnMubm90ZWluZGV4O1xuLy8gXHRcdFx0XHRcdHRlbXBEYXRhLnN0YXJ0Tm90ZUl0ZW1JbmRleCA9IHVpLml0ZW0uaW5kZXgoKTtcbi8vIFx0XHRcdFx0XHR0ZW1wRGF0YS5zdGFydE5vdGVJdGVtQ29udGVudCA9IHRlbXBEYXRhLnN0YXJ0Tm90ZS5pdGVtc1t0ZW1wRGF0YS5zdGFydE5vdGVJdGVtSW5kZXhdO1xuXHRcdCAgIFx0XHRcdFxuLy8gXHRcdCAgIFx0XHRcdHRlbXBOb3RlID0gYW5ndWxhci5jb3B5KHNjb3BlLm5vdGUpXG4vLyBcdFx0ICAgXHRcdFx0Y29uc29sZS5sb2codGVtcE5vdGUpXG5cbi8vIFx0XHQgICAgICAgIH0sXG4vLyBcdFx0ICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uKGV2ZW50LCB1aSkge1xuXG4vLyBcdFx0ICAgICAgIC8vIGNvbnNvbGUubG9nKHNjb3BlLnRlbXBEYXRhKVx0XG4vLyBcdCAgICAgICAgIFx0aWYgKCF1aS5zZW5kZXIpIHtcdFx0ICAgICAgIFxuLy8gXHRcdFx0ICAgICAgICAgY29uc29sZS5sb2coXCJVUERBVEUgVVBEQVRFIFVQREFURSBVUERBVEUgVVBEQVRFIElOU0lERSBJRlwiIClcblxuXHRcdFx0ICAgICAgICBcblx0XHRcdFx0XHRcdFx0XHQgICAgICAgICBcblxuLy8gXHRcdFx0XHRcdHZhciBzdGFydF9wb3MgPSB0ZW1wRGF0YS5zdGFydE5vdGVJdGVtSW5kZXg7XG4vLyBcdFx0XHRcdFx0dmFyIGVuZF9wb3MgPSB1aS5pdGVtLmluZGV4KCk7XG4vLyBcdFx0XHRcdFx0Y29uc29sZS5sb2coc3RhcnRfcG9zICsgJyAtICcgKyBlbmRfcG9zKTtcblxuLy8gXHRcdFx0XHRcdHRlbXBOb3RlLml0ZW1zLnNwbGljZShzdGFydF9wb3MsMSlcbi8vIFx0XHRcdFx0XHR0ZW1wTm90ZS5pdGVtcy5zcGxpY2UoZW5kX3BvcywwLCB0ZW1wRGF0YS5zdGFydE5vdGVJdGVtQ29udGVudClcbi8vIFx0XHRcdFx0XHQvL3Njb3BlLm5vdGUgPSB0ZW1wTm90ZVxuLy8gXHRcdFx0XHRcdHNjb3BlLm5vdGVzW3RlbXBEYXRhLnN0YXJ0Tm90ZUluZGV4XSA9IHRlbXBOb3RlO1xuXHRcdFx0XHRcdFxuLy8gXHRcdFx0XHRcdGNvbnNvbGUubG9nKHNjb3BlLm5vdGVzKVxuXG4vLyBcdFx0XHRcdFx0dmFyIHJhc3QgPSB7XG4vLyAgICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJhZHNAbmppdC5lZHVcIixcbi8vICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiczFcIixcbi8vICAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJsYXVuc2RyeVwiLCBcImFwc3BseSBqb2JzXCIsIFwiZ3N5bVwiIF0sXG4vLyAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMS8xLzIyMDE2XCIsXG4vLyAgICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIxLzIyLzIwMTZcIixcbi8vICAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3pzZS5ha0BnbWFpbC5jb21cIlxuLy8gICAgICAgICAgICAgICAgIH1cblxuLy8gXHRcdFx0XHRcdC8vc2NvcGUubm90ZXNbMF0uaXRlbXMucHVzaChcIlBVQ0tTXCIpXG5cbi8vIFx0XHRcdFx0XHRzY29wZS4kYXBwbHkoKTtcblxuLy8gXHRcdCAgIC8vICAgICAgICAgLy9jb25zb2xlLmxvZyhzY29wZS5ub3Rlcylcbi8vIFx0XHRcdCAgICB9ICAgXG5cdFx0ICAgICAgICAgICBcbi8vIFx0XHQgICAgICAgIH0sIC8vZW5kIHVwZGF0ZVxuLy8gXHRcdCAgICAgICAgcmVjZWl2ZTogZnVuY3Rpb24oZXZlbnQsIHVpKXtcbi8vIFx0XHQgICAgICAgIFx0Y29uc29sZS5sb2coXCJSRUNFSVZFIFJFQ0VJVkUgUkVDRUlWRSBSRUNFSVZFIFJFQ0VJVkVcIilcbi8vIFx0XHQgICAgICAgIFx0Y29uc29sZS5sb2codGVtcERhdGEpXG5cbi8vIFx0XHQgICAgICAgIFx0dGVtcERhdGEuZW5kTm90ZSA9IGFuZ3VsYXIuY29weShzY29wZS5ub3RlKTtcbi8vIFx0XHQgICAgICAgIFx0dGVtcERhdGEuZW5kTm90ZUluZGV4ID0gYXR0cnMubm90ZWluZGV4O1xuLy8gXHRcdFx0XHRcdHRlbXBEYXRhLmVuZE5vdGVJdGVtSW5kZXggPSB1aS5pdGVtLmluZGV4KCk7XG5cblx0XHRcdFx0XHRcblxuLy8gXHRcdFx0XHRcdCAgLy9jb25zb2xlLmxvZyhcInJlbW92aW5nIGl0ZW06IFwiICsgc2NvcGUubm90ZXNbbm90ZU9yaWdpbkluZGV4XS5pdGVtc1tzdGFydF9wb3NdKTtcbi8vIFx0XHQgICAgICAgICAgIHRlbXBEYXRhLnN0YXJ0Tm90ZS5pdGVtcy5zcGxpY2UodGVtcERhdGEuc3RhcnROb3RlSXRlbUluZGV4LDEpXG4vLyBcdFx0XHQgICAgICAgdGVtcERhdGEuZW5kTm90ZS5pdGVtcy5zcGxpY2UodGVtcERhdGEuZW5kTm90ZUl0ZW1JbmRleCwwLHRlbXBEYXRhLnN0YXJ0Tm90ZUl0ZW1Db250ZW50KVxuLy8gXHRcdFx0ICAgICAgIGNvbnNvbGUubG9nKHRlbXBEYXRhKVxuXG4vLyBcdFx0XHQgICAgICAgc2NvcGUubm90ZXNbdGVtcERhdGEuc3RhcnROb3RlSW5kZXhdID0gdGVtcERhdGEuc3RhcnROb3RlO1xuLy8gXHRcdFx0ICAgICAgIHNjb3BlLm5vdGVzW3RlbXBEYXRhLmVuZE5vdGVJbmRleF0gPSB0ZW1wRGF0YS5lbmROb3RlO1xuXHQgICAgICAgICAgIFx0XG4vLyBcdCAgICAgICAgICAgXHRcdGNvbnNvbGUubG9nKHRlbXBEYXRhLnN0YXJ0Tm90ZS5pdGVtcylcbi8vIFx0ICAgICAgICAgICBcdFx0Y29uc29sZS5sb2codGVtcERhdGEuZW5kTm90ZS5pdGVtcylcblxuLy8gXHRcdCAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImFkZGluZyBhZnRlciBwb3NpdGlvbjogXCIgKyBlbmRfcG9zKVxuLy8gXHRcdCAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImFkZGluZyBhZnRlcjogXCIgKyBzY29wZS5ub3Rlc1tub3RlRGVzdGluYXRpb25JbmRleF0uaXRlbXNbZW5kX3Bvc10pXG4vLyBcdFx0ICAgICAgICAgICAvL3Njb3BlLm5vdGVzW25vdGVEZXN0aW5hdGlvbkluZGV4XS5pdGVtcy5zcGxpY2UoZW5kX3BvcywwLCBzdGFydEl0ZW0pXG5cbi8vIFx0XHQgICAgICAgIFx0Ly9zY29wZS50ZW1wRGF0YSA9IFwicHJhd25zXCI7XG5cdFx0ICAgICAgICBcdFxuXHRcdCAgICAgICAgXHRcbi8vIFx0XHQgICAgICAgIFx0Ly8gY29uc29sZS5sb2codGVtcERhdGEpXG4vLyBcdFx0ICAgICAgICBcdC8vIC8vY29uc29sZS5sb2coc2NvcGUubm90ZSk7XG4vLyBcdFx0ICAgICAgICBcdHZhciByYXN0ID0ge1xuLy8gICAgICAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyYWRzQG5qaXQuZWR1XCIsXG4vLyAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcInMxXCIsXG4vLyAgICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwibGF1bnNkcnlcIiwgXCJhcHNwbHkgam9ic1wiLCBcImdzeW1cIiBdLFxuLy8gICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjEvMS8yMjAxNlwiLFxuLy8gICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMS8yMi8yMDE2XCIsXG4vLyAgICAgICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96c2UuYWtAZ21haWwuY29tXCJcbi8vICAgICAgICAgICAgICAgICB9XG5cdFx0ICAgICAgICBcdFxuLy8gXHRcdCAgICAgICAgICAgc2NvcGUuJGFwcGx5KCk7XG5cdFx0XG5cbi8vIFx0XHQgICAgICAgIH1cblxuLy8gXHRcdCAgICB9KTsgLy8gZW5kIHNvcnRhYmxlXG5cbi8vIFx0XHQgLy8gIH0pOyAvL2VuZCB3YXRjaFxuXG5cblxuLy8gXHRcdH0sXG4vLyBcdFx0Y29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKXtcblxuLy8gXHRcdFx0JHNjb3BlLm1vb3NlID0gXCJkaW5nXCJcbi8vIFx0XHRcdCRzY29wZS5kZWxldGVJdGVtID0gZnVuY3Rpb24ocGFyZW50SW5kZXgsIGluZGV4KXtcbi8vIFx0XHRcdFx0Y29uc29sZS5sb2cocGFyZW50SW5kZXgpXG4vLyBcdFx0XHRcdGNvbnNvbGUubG9nKGluZGV4KVxuLy8gXHRcdFx0XHQkc2NvcGUubm90ZXNbcGFyZW50SW5kZXhdLml0ZW1zLnNwbGljZShpbmRleCwxKVxuXG4vLyBcdFx0XHR9XG5cbi8vIFx0XHRcdCRzY29wZS5yYW5kb21JZCA9IGZ1bmN0aW9uKGl0ZW0pe1xuLy8gICAgXHRcdFx0IHJldHVybiBcIklEXCIgKyBpdGVtICsgKE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiA5OTkpICsgMSkpO1xuLy8gXHRcdFx0fVxuLy8gXHRcdFx0Ly9hbGVydChcImNvbnRyb2xsZXJcIik7XG4vLyBcdFx0XHQvLyAkc2NvcGUuZG9ncyA9ICRzY29wZS5kYXRhICsgXCJkb2dzXCI7XG4vLyBcdFx0XHQvLyBpZigkc2NvcGUuZHJhZ2dhYmxlKVxuLy8gXHRcdFx0Ly8gXHQkc2NvcGUuZHJhZ1N0YXR1cyA9IGZhbHNlO1xuLy8gXHRcdFx0Ly8gZWxzZSAkc2NvcGUuZHJhZ1N0YXR1cyA9IHRydWU7XG5cbi8vIFx0XHRcdGNvbnNvbGUubG9nKCRzY29wZSlcblxuXHRcdFx0XG4vLyBcdFx0fVxuLy8gXHR9XG4vLyB9IC8vZW5kIG5vdGVjYXJkIGRpcmVjdGl2ZVxuXG5cblxuXG5cbiIsIihmdW5jdGlvbigpe1xuXHQndXNlIHN0cmljdCdcblxuXHRhbmd1bGFyXG4gICAgXHQubW9kdWxlKCdub3RlcycpXG4gICAgXHQuZmFjdG9yeSgnbm90ZXNTZXJ2aWNlJywgbm90ZXNTZXJ2aWNlKTtcblxuICAgIG5vdGVzU2VydmljZS4kaW5qZWN0ID0gWyckaHR0cCcsJyR3aW5kb3cnLCdhdXRoU2VydmljZSddXG5cbiAgICBmdW5jdGlvbiBub3Rlc1NlcnZpY2UoJGh0dHAsICR3aW5kb3csIGF1dGhTZXJ2aWNlKSB7XG5cbiAgICAgICAgXG4gICAgXHR2YXIgc2VydmljZSA9IHsgXG4gICAgICAgICAgICBnZXROb3Rlc0xpc3Q6IGdldE5vdGVzTGlzdCxcbiAgICAgICAgICAgIGdldFNpbmdsZU5vdGU6IGdldFNpbmdsZU5vdGUsXG4gICAgICAgICAgICBzYXZlQWxsTm90ZXM6IHNhdmVBbGxOb3RlcyxcbiAgICAgICAgICAgIGFkZE5ld05vdGU6IGFkZE5ld05vdGUsXG4gICAgICAgICAgICB1cGRhdGVOb3RlQ29udGVudDogdXBkYXRlTm90ZUNvbnRlbnQsXG4gICAgICAgICAgICB1cGRhdGVOb3RlVGl0bGU6IHVwZGF0ZU5vdGVUaXRsZSxcbiAgICAgICAgICAgIGRlbGV0ZU5vdGU6IGRlbGV0ZU5vdGUsXG4gICAgICAgICAgICAvLyB1cGRhdGVOb3RlVGl0bGU6IHVwZGF0ZU5vdGVUaXRsZSxcbiAgICAgICAgICAgIC8vIHVwZGF0ZU5vdGVDb250ZW50OiB1cGRhdGVOb3RlXG4gICAgXHR9O1xuXG4gICAgXHRyZXR1cm4gc2VydmljZTtcblxuICAgIFx0Ly8vLy8vLy8vLy8vXG5cbiAgICAgICAgXG4gICAgICAgICAgICBcbiAgICAgICAgXG4gICAgICBcbiAgICAgICAgLy8gZ2V0cyBub3RlcyBsaXN0LCBleGNsdWRlcyB0aGUgYWN0dWFsIG5vdGUgY29udGVudFxuICAgICAgICBmdW5jdGlvbiBnZXROb3Rlc0xpc3QgKCkge1xuICAgICAgICAgICAgdmFyIHRva2VuID0gYXV0aFNlcnZpY2UuZ2V0VG9rZW4oKTtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCdodHRwOi8vbG9jYWxob3N0OjMwMDAvYXBpL25vdGVzL2dldEFsbE5vdGVzTWV0YScse3Rva2VuOiB0b2tlbn0pO1xuICAgICAgICB9IC8vZW5kIGdldE5vdGUoKVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldFNpbmdsZU5vdGUobm90ZUlkKSB7XG4gICAgICAgICAgICB2YXIgdG9rZW4gPSBhdXRoU2VydmljZS5nZXRUb2tlbigpO1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGkvbm90ZXMvZ2V0U2luZ2xlTm90ZScse3Rva2VuOiB0b2tlbiwgbm90ZUlkOiBub3RlSWR9KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gYWRkTmV3Tm90ZSAoKSB7XG4gICAgICAgICAgICB2YXIgdG9rZW4gPSBhdXRoU2VydmljZS5nZXRUb2tlbigpO1xuXG4gICAgICAgICAgICAvLyBjcmVhdGUgbmV3IG5vdGUgb2JqZWN0XG4gICAgICAgICAgICB2YXIgbmV3Tm90ZSA9IHt0aXRsZTpcInVudGl0bGVkXCIsY29udGVudDpcInNhbXBsZSBjb250ZW50XCIsXCJzaGFyZWRXaXRoXCI6W3tcInVzZXJcIjogXCJhdWsyQG5qaXQuZWR1XCIsIFwiY2FuRWRpdFwiOiBmYWxzZX1dfTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGkvbm90ZXMvYWRkTm90ZScse3Rva2VuOiB0b2tlbiwgbm90ZTogbmV3Tm90ZX0pXG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB1cGRhdGVOb3RlQ29udGVudChub3RlSWQsIG5vdGVDb250ZW50KSB7XG4gICAgICAgICAgICB2YXIgdG9rZW4gPSBhdXRoU2VydmljZS5nZXRUb2tlbigpO1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGkvbm90ZXMvdXBkYXRlTm90ZUNvbnRlbnQnLHt0b2tlbjogdG9rZW4sIG5vdGVJZDogbm90ZUlkLCBub3RlQ29udGVudDpub3RlQ29udGVudH0pO1xuXG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB1cGRhdGVOb3RlVGl0bGUobm90ZUlkLCBub3RlVGl0bGUpIHtcbiAgICAgICAgICAgIHZhciB0b2tlbiA9IGF1dGhTZXJ2aWNlLmdldFRva2VuKCk7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnaHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaS9ub3Rlcy91cGRhdGVOb3RlVGl0bGUnLHt0b2tlbjogdG9rZW4sIG5vdGVJZDogbm90ZUlkLCBub3RlVGl0bGU6bm90ZVRpdGxlfSk7XG4gICAgICAgIH1cblxuXG5cbiAgICAgICAgZnVuY3Rpb24gZGVsZXRlTm90ZShub3RlSWQpIHtcbiAgICAgICAgICAgIHZhciB0b2tlbiA9IGF1dGhTZXJ2aWNlLmdldFRva2VuKCk7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnaHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaS9ub3Rlcy9kZWxldGVOb3RlJyx7dG9rZW46IHRva2VuLCBub3RlSWQ6IG5vdGVJZH0pO1xuXG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzYXZlQWxsTm90ZXMobm90ZXMpIHtcbiAgICAgICAgICAgIHZhciB0b2tlbiA9IGF1dGhTZXJ2aWNlLmdldFRva2VuKCk7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnaHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaS9ub3Rlcy91cGRhdGVOb3Rlcycse2VtYWlsOlwibW9pekBnbWFpbC5jb21cIixub3Rlczogbm90ZXN9KVxuICAgICAgICB9XG5cblxuXG4gICAgfVxuXG5cdFxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCdcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnbm90aWZ5Jylcblx0XHQuY29udHJvbGxlcignbm90aWZ5Q3RybCcsIG5vdGlmeUN0cmwpXG5cblx0Ly8gbm90aWZ5Q3RybC4kaW5qZWN0ID0gW11cblxuXHRmdW5jdGlvbiBub3RpZnlDdHJsKCkge1xuXG5cdCAgICB2YXIgdm0gPSB0aGlzO1xuXG5cdCAgICB2bS5nb3RvU2Vzc2lvbiA9IGdvdG9TZXNzaW9uO1xuXHQgICAgdm0ucmVmcmVzaCA9IHJlZnJlc2g7XG5cdCAgICB2bS5zZWFyY2ggPSBzZWFyY2g7XG5cdCAgICB2bS5zZXNzaW9ucyA9IFtdO1xuXHQgICAgdm0udGl0bGUgPSAnbm90aWZ5JztcblxuXHQgICAgLy8vLy8vLy8vLy8vXG5cblx0ICAgIFxuXG5cdCAgICBmdW5jdGlvbiBnb3RvU2Vzc2lvbigpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gcmVmcmVzaCgpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gc2VhcmNoKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXHR9XG5cbn0pKCk7XG5cblxuIiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ25vdGlmeScpXG4gICAgLmRpcmVjdGl2ZSgnbm90aWZ5Jywgbm90aWZ5KVxuXG4gICAgbm90aWZ5LiRpbmplY3QgPSBbJ25vdGlmeVNlcnZpY2UnLCckcm9vdFNjb3BlJywnJHRpbWVvdXQnXVxuICAgIFxuXG5mdW5jdGlvbiBub3RpZnkoKSB7XG5cdHJldHVybntcblx0XHRyZXN0cmljdDogJ0FFJyxcblx0XHR0ZW1wbGF0ZTogJzxsaSBuZy1yZXBlYXQ9XCJpdGVtIGluIG5vdGlmeUxpc3RcIj57e2l0ZW19fTwvbGk+Jyxcblx0XHRsaW5rOiBmdW5jdGlvbihzY29wZSxlbGVtZW50LGF0dHJzKXtcblxuXHRcdHZhciBsaSA9IGFuZ3VsYXIuZWxlbWVudChlbGVtZW50LmNoaWxkcmVuKClbMF0pXG5cdFx0Y29uc29sZS5sb2cobGkpXG5cdFx0XG5cdFx0YW5pbWF0ZURvd24gPSBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdhbmltYXRpbmcnKVxuICAgICAgICAgICAgJCh0aGlzKS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICB0b3A6ICcrPTk5J1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgYW5pbWF0ZVJpZ2h0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIFx0Y29uc29sZS5sb2coJ2FuaW1hdGluZycpXG4gICAgICAgICAgICAkKHRoaXMpLmFuaW1hdGUoe1xuICAgICAgICAgICAgXHRcbiAgICAgICAgICAgICAgICBsZWZ0OiAnKz01MCdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgICQobGkpLm9uKCdjbGljaycsIGFuaW1hdGVSaWdodCk7XG4gICAgICAgLy8gJChsaSkub24oJ2NsaWNrJywgYW5pbWF0ZVJpZ2h0KTsgIFxuXHRcdCAgICAgXHRcdFxuXHRcdFx0XG5cdFx0XHQgICAgXG5cblxuXG5cdFx0fSxcblx0XHRjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUsbm90aWZ5U2VydmljZSwkcm9vdFNjb3BlLCR0aW1lb3V0KXtcblx0XHRcdGNvbnNvbGUubG9nKCdub3RpZnkgZGlyZWN0aXZlJylcblx0XHRcdFxuXHRcdFx0JHNjb3BlLm5vdGlmeUxpc3QgPSBbXCJkb2dzXCIsXCJjYXRzXCJdO1x0XHRcdFxuXG5cdFx0XHQgJHJvb3RTY29wZS4kb24oJ3B1c2hlZCcsZnVuY3Rpb24oZXZlbnQsbWVzc2FnZSl7XG5cdFx0XHQgXHRjb25zb2xlLmxvZyhcImRpcmVjdGl2ZTogcmVjZWl2aW5nXCIpO1xuXHRcdFx0IFx0JHNjb3BlLm5vdGlmeUxpc3QucHVzaChtZXNzYWdlLmRhdGEpO1xuXHRcdFx0IFx0XHRcdFx0IFx0JHNjb3BlLiRhcHBseSgpO1xuXHRcdFx0IFx0Ly8gJHRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdCBcdC8vIFx0JHNjb3BlLmRhdGEgPSBudWxsO1xuXHRcdFx0IFx0Ly8gfSwzMDAwKVxuXG5cdFx0XHQgfSlcblx0XHRcdFxuXHRcdH1cblx0fVxufSAvL2VuZCBub3RpZnkgZGlyZWN0aXZlXG4iLCIoZnVuY3Rpb24oKXtcbiAgICAndXNlIHN0cmljdCdcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnbm90aWZ5JylcbiAgICAgICAgLmZhY3RvcnkoJ25vdGlmeVNlcnZpY2UnLCBub3RpZnlTZXJ2aWNlKTtcblxuICAgIG5vdGlmeVNlcnZpY2UuJGluamVjdCA9IFsnJHJvb3RTY29wZSddXG5cbiAgICBmdW5jdGlvbiBub3RpZnlTZXJ2aWNlKCRyb290U2NvcGUpIHtcbiAgICAgICAgdmFyIHNlcnZpY2UgPSB7XG5cbiAgICAgICAgICAgIHB1c2g6IHB1c2gsXG5cblxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBzZXJ2aWNlO1xuXG4gICAgICAgIC8vLy8vLy8vLy8vL1xuXG4gICAgICAgIGZ1bmN0aW9uIHB1c2gobWVzc2FnZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJwdXNoaW5nIGZyb20gc2VydmljZVwiKTtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGVtaXQoXCJwdXNoZWRcIiwgbWVzc2FnZSk7XG5cbiAgICAgICAgfVxuXG5cblxuICAgIH1cblxuICAgIFxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCdcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgncmVnaXN0ZXInKVxuXHRcdC5jb250cm9sbGVyKCdyZWdpc3RlckN0cmwnLCByZWdpc3RlckN0cmwpXG5cblx0cmVnaXN0ZXJDdHJsLmluamVjdCA9IFsndG9hc3RyJywnJGh0dHAnLCdyZWdpc3RlclNlcnZpY2UnXVxuXG5cdGZ1bmN0aW9uIHJlZ2lzdGVyQ3RybCh0b2FzdHIsJGh0dHAscmVnaXN0ZXJTZXJ2aWNlKSB7XG5cblx0ICAgIHZhciB2bSA9IHRoaXM7XG5cblx0ICAgIHZtLmZvcm0gPSB7fVxuXHQgICAgdm0uc3VibWl0U3RhdHVzID0gXCJcIjtcblx0ICAgIHZtLnN1Ym1pdEZvcm0gPSBzdWJtaXRGb3JtO1xuXHQgICAgXG5cdCAgICAvL2Rpc3BsYXkgaW5mbyBvbiBsb2FkXG5cdCAgICBpbmZvKCk7XG5cblx0ICAgIC8vLy8vLy8vLy8vL1xuXG5cdCAgICBmdW5jdGlvbiBzdWJtaXRGb3JtKGlzVmFsaWQpIHtcblx0ICAgIFx0XG5cdCAgICBcdGNvbnNvbGUubG9nKHZtLmZvcm0pO1xuXHQgICAgXHRcblx0ICAgIFx0Ly8gY2hlY2sgdG8gbWFrZSBzdXJlIHRoZSBmb3JtIGlzIGNvbXBsZXRlbHkgdmFsaWRcblx0XHQgICAgaWYgKGlzVmFsaWQpIHtcblx0XHQgICAgICBjb25zb2xlLmxvZyhcIlZhbGlkIEZvcm1cIik7XG5cdFx0ICAgICAgc2VuZEZvcm0odm0uZm9ybSk7XG5cdFx0ICAgIH1cblx0ICAgIH1cblxuXHQgICAgLy9zZW5kcyBmb3JtIHRvIGFwaVxuXHQgICAgZnVuY3Rpb24gc2VuZEZvcm0oZm9ybSkge1xuXHRcdFx0cmVnaXN0ZXJTZXJ2aWNlLm5ld1VzZXIodm0sZm9ybSlcblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gaW5mbygpIHtcblx0ICAgICAgLyogKi9cblx0ICAgICAgY29uc29sZS5sb2coXCJyZWdpc3RlciBjb250cm9sbGVyXCIpXG5cdCAgICB9XG5cblx0fVxuXG59KSgpO1xuXG5cbiIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdyZWdpc3RlcicpXG4gICAgLmRpcmVjdGl2ZSgncmVnaXN0ZXJEaXInLCByZWdpc3RlckRpcik7XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyRGlyKCkge1xuXHRyZXR1cm57XG5cdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHR0ZW1wbGF0ZVVybDogJycsXG5cdFx0cmVwbGFjZTogdHJ1ZVxuXHRcdC8vIHNjb3BlOiB7fVxuXHR9XG59IiwiKGZ1bmN0aW9uKCl7XG5cdCd1c2Ugc3RyaWN0J1xuXG5cdGFuZ3VsYXJcbiAgICBcdC5tb2R1bGUoJ3JlZ2lzdGVyJylcbiAgICBcdC5mYWN0b3J5KCdyZWdpc3RlclNlcnZpY2UnLCByZWdpc3RlclNlcnZpY2UpO1xuXG4gICAgcmVnaXN0ZXJTZXJ2aWNlLmluamVjdCA9IFsnJGh0dHAnLCd0b2FzdHInLCdhdXRoU2VydmljZScsJyRzdGF0ZScsJyRyb290U2NvcGUnXVxuXG4gICAgZnVuY3Rpb24gcmVnaXN0ZXJTZXJ2aWNlKCRodHRwLHRvYXN0cixhdXRoU2VydmljZSwkc3RhdGUsJHJvb3RTY29wZSkge1xuICAgIFx0dmFyIHNlcnZpY2UgPSB7XG5cbiAgICAgICAgICAgIG5ld1VzZXI6IG5ld1VzZXIsXG4gICAgXHRcdGVycm9yOiBlcnJvcixcbiAgICBcdFx0aW5mbzogaW5mbyxcbiAgICBcdFx0c3VjY2Vzczogc3VjY2Vzc1xuXG4gICAgXHR9O1xuXG4gICAgXHRyZXR1cm4gc2VydmljZTtcblxuICAgIFx0Ly8vLy8vLy8vLy8vXG5cbiAgICAgICAgZnVuY3Rpb24gbmV3VXNlcih2bSwgZm9ybSkge1xuICAgICAgICAgICAgJGh0dHAucG9zdCgnaHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaS91c2Vycy9uZXdVc2VyJywgZm9ybSlcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlcykge1xuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgYXV0aFNlcnZpY2Uuc2V0VG9rZW4ocmVzLmRhdGEudG9rZW4pO1xuICAgICAgICAgICAgICBcblxuICAgICAgICAgICAgICAvL3RvYXN0XG4gICAgICAgICAgICAgIHRvYXN0ci5zdWNjZXNzKCdZb3UgYXJlIG5vdyBteSBCZXRhIScpO1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xuXG4gICAgICAgICAgICAgIC8vY2hhbmdlIHN0YXR1cyBvbiB2aWV3XG4gICAgICAgICAgICAgIHZtLnN1Ym1pdFN0YXR1cyA9IFwiU3VjY2Vzc1wiO1xuICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAvL2VtcHR5IGZvcm1cbiAgICAgICAgICAgICAgdm0uZm9ybSA9IFwiXCI7XG5cbiAgICAgICAgICAgICAgLy9yZWRpcmVjdFxuICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5tZW1iZXJzJyk7XG5cbiAgICAgICAgICAgICAgJHJvb3RTY29wZS4kZW1pdChcImxvZ2dlZEluXCIpO1xuXG4gICAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgICAgdG9hc3RyLmVycm9yKCdGYWlsZWQ6ICcgKyBlcnIuZGF0YSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgXHRmdW5jdGlvbiBlcnJvcigpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gaW5mbygpIHtcblx0ICAgICAgLyogKi9cbiAgICAgICAgICBjb25zb2xlLmxvZyhcInJlZ2lzdGVyU2VydmljZVwiKTtcblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gc3VjY2VzcygpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblxuXG4gICAgfVxuXG5cdFxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCdcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnc2FtcGxlJylcblx0XHQuY29udHJvbGxlcignc2FtcGxlQ3RybCcsIHNhbXBsZUN0cmwpXG5cblx0c2FtcGxlQ3RybC4kaW5qZWN0ID0gW11cblxuXHRmdW5jdGlvbiBzYW1wbGVDdHJsKCkge1xuXG5cdCAgICB2YXIgdm0gPSB0aGlzO1xuXG5cdCAgICB2bS5nb3RvU2Vzc2lvbiA9IGdvdG9TZXNzaW9uO1xuXHQgICAgdm0ucmVmcmVzaCA9IHJlZnJlc2g7XG5cdCAgICB2bS5zZWFyY2ggPSBzZWFyY2g7XG5cdCAgICB2bS5zZXNzaW9ucyA9IFtdO1xuXHQgICAgdm0udGl0bGUgPSAnU2FtcGxlJztcblxuXHQgICAgLy8vLy8vLy8vLy8vXG5cblx0ICAgIGZ1bmN0aW9uIGdvdG9TZXNzaW9uKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiByZWZyZXNoKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBzZWFyY2goKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cdH1cblxufSkoKTtcblxuXG4iLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgnc2FtcGxlJylcbiAgICAuZGlyZWN0aXZlKCdzYW1wbGVEaXInLCBzYW1wbGVEaXIpO1xuXG5mdW5jdGlvbiBzYW1wbGVEaXIoKSB7XG5cdHJldHVybntcblx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdHRlbXBsYXRlVXJsOiAnJyxcblx0XHRyZXBsYWNlOiB0cnVlXG5cdFx0Ly8gc2NvcGU6IHt9XG5cdH1cbn0iLCIoZnVuY3Rpb24oKXtcblx0J3VzZSBzdHJpY3QnXG5cblx0YW5ndWxhclxuICAgIFx0Lm1vZHVsZSgnc2FtcGxlJylcbiAgICBcdC5mYWN0b3J5KCdzYW1wbGVTZXJ2aWNlJywgc2FtcGxlU2VydmljZSk7XG5cbiAgICBzYW1wbGVTZXJ2aWNlLiRpbmplY3QgPSBbXVxuXG4gICAgZnVuY3Rpb24gc2FtcGxlU2VydmljZSgpIHtcbiAgICBcdHZhciBzZXJ2aWNlID0ge1xuXG4gICAgXHRcdGVycm9yOiBlcnJvcixcbiAgICBcdFx0aW5mbzogaW5mbyxcbiAgICBcdFx0c3VjY2Vzczogc3VjY2Vzc1xuXG4gICAgXHR9O1xuXG4gICAgXHRyZXR1cm4gc2VydmljZTtcblxuICAgIFx0Ly8vLy8vLy8vLy8vXG5cbiAgICBcdGZ1bmN0aW9uIGVycm9yKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBpbmZvKCkge1xuXHQgICAgICAvKiAqL1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwic2FtcGxlU2VydmljZVwiKTtcblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gc3VjY2VzcygpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblxuXG4gICAgfVxuXG5cdFxuXG59KSgpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
