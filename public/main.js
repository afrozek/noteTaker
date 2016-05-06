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
            updateNoteTags: updateNoteTags,
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
            
            return $http.post('http://localhost:3000/api/notes/addNote',{token: token})
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

        function updateNoteTags(noteId, noteTagsArray) {
            var token = authService.getToken();
           return $http.post('http://localhost:3000/api/notes/updateNoteTags',{token: token, noteId: noteId, tags: noteTagsArray })
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUuanMiLCJjb250cm9sbGVycy9hcHAuY29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2FwcC5ob21lLmNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9hcHAubG9naW4uY29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2FwcC5uYXYuY29udHJvbGxlci5qcyIsImRpcmVjdGl2ZXMvc2VsZWN0VGV4dC5kaXJlY3RpdmUuanMiLCJyb3V0ZXMvYXBwLnJvdXRlcy5qcyIsInNhbXBsZUNvbXBvbmVudC9kaXJlY3RpdmVzL3NhbXBsZS5kaXJlY3RpdmUuanMiLCJhdXRoL2F1dGgubW9kdWxlLmpzIiwiYnVkZ2V0L2J1ZGdldC5tb2R1bGUuanMiLCJtZW1iZXJzL21lbWJlcnMubW9kdWxlLmpzIiwibm90ZXMvbm90ZXMubW9kdWxlLmpzIiwibm90aWZ5L25vdGlmeS5tb2R1bGUuanMiLCJyZWdpc3Rlci9yZWdpc3Rlci5tb2R1bGUuanMiLCJzYW1wbGVDb21wb25lbnQvc2FtcGxlLm1vZHVsZS5qcyIsImF1dGgvc2VydmljZXMvYXV0aC5zZXJ2aWNlLmludGVyY2VwdG9yLmpzIiwiYXV0aC9zZXJ2aWNlcy9hdXRoLnNlcnZpY2UuanMiLCJidWRnZXQvY29udHJvbGxlcnMvYnVkZ2V0LmNvbnRyb2xsZXIuanMiLCJidWRnZXQvZGlyZWN0aXZlcy9ub3Rlcy5kaXJlY3RpdmUuYmFja3VwLmpzIiwiYnVkZ2V0L2RpcmVjdGl2ZXMvbm90ZXMuZGlyZWN0aXZlLmpzIiwiYnVkZ2V0L3NlcnZpY2VzL2J1ZGdldC5zZXJ2aWNlLmpzIiwibWVtYmVycy9jb250cm9sbGVycy9tZW1iZXJzLmNvbnRyb2xsZXIuanMiLCJtZW1iZXJzL3NlcnZpY2VzL21lbWJlcnMuc2VydmljZS5qcyIsIm5vdGVzL2NvbnRyb2xsZXJzL25vdGVzLmNvbnRyb2xsZXIuanMiLCJub3Rlcy9kaXJlY3RpdmVzL25vdGVzLmRpcmVjdGl2ZS5iYWNrdXAuanMiLCJub3Rlcy9kaXJlY3RpdmVzL25vdGVzLmRpcmVjdGl2ZS5qcyIsIm5vdGVzL3NlcnZpY2VzL25vdGVzLnNlcnZpY2UuanMiLCJub3RpZnkvY29udHJvbGxlcnMvbm90aWZ5LmNvbnRyb2xsZXIuanMiLCJub3RpZnkvZGlyZWN0aXZlcy9ub3RpZnkuZGlyZWN0aXZlLmpzIiwibm90aWZ5L3NlcnZpY2VzL25vdGlmeS5zZXJ2aWNlLmpzIiwicmVnaXN0ZXIvY29udHJvbGxlcnMvcmVnaXN0ZXIuY29udHJvbGxlci5qcyIsInJlZ2lzdGVyL2RpcmVjdGl2ZXMvcmVnaXN0ZXIuZGlyZWN0aXZlLmpzIiwicmVnaXN0ZXIvc2VydmljZXMvcmVnaXN0ZXIuc2VydmljZS5qcyIsInNhbXBsZUNvbXBvbmVudC9jb250cm9sbGVycy9zYW1wbGUuY29udHJvbGxlci5qcyIsInNhbXBsZUNvbXBvbmVudC9zZXJ2aWNlcy9zYW1wbGUuc2VydmljZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4T0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7XG4gICAgJ3VzZSBzdHJpY3QnXG5cbmFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAnLCBbXG4gICAgICAgICdhdXRoJyxcbiAgICBcdCd1aS5yb3V0ZXInLFxuICAgIFx0J25nQW5pbWF0ZScsXG4gICAgXHQnc2FtcGxlJyxcbiAgICBcdCdyZWdpc3RlcicsXG4gICAgXHQndG9hc3RyJyxcbiAgICBcdCdtZW1iZXJzJyxcbiAgICBcdCdub3RlcycsXG4gICAgICAgICdidWRnZXQnLFxuICAgICAgICAnY2hhcnQuanMnLFxuICAgICAgICAnbm90aWZ5JyxcbiAgICAgICAgJ3VpLnRpbnltY2UnXG4gICAgXSlcblxuLy8gLmNvbmZpZyhmdW5jdGlvbigkaHR0cFByb3ZpZGVyKSB7XG5cbi8vICAgICAvLyBhdHRhY2ggb3VyIGF1dGggaW50ZXJjZXB0b3IgdG8gdGhlIGh0dHAgcmVxdWVzdHNcbi8vICAgICAkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKCdhdXRoSW50ZXJjZXB0b3InKTtcblxuLy8gfSlcblxuXG4ucnVuKFsnJHJvb3RTY29wZScsJyRzdGF0ZScsJ2F1dGhTZXJ2aWNlJywnJHEnLGZ1bmN0aW9uKCRyb290U2NvcGUsICRzdGF0ZSwgYXV0aFNlcnZpY2UgLCRxKSB7XG4gICAgYXV0aFNlcnZpY2UuaW5mbygpO1xuXG4gICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZUVycm9yJywgZnVuY3Rpb24gKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zLCBlcnJvcikge1xuICAgICAgICAgICBcbiAgICAgICAgICAvLyBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNUQVRFIENIQU5HRSBFUlJPUiBFUlJPUiBFUlJPUiBFUlJPUkVSUk9SXCIpO1xuICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5ob21lJylcbiAgICAgICAgXG4gICAgICB9KTtcblxuICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdGFydCcsIGZ1bmN0aW9uIChldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcykge1xuICAgIC8vYXV0aFNlcnZpY2UuaW5mbygpO1xuICAgIC8vYXV0aFNlcnZpY2UuaXNBdXRob3JpemVkKCBldmVudCwgZnJvbVN0YXRlLCB0b1N0YXRlKTtcbiAgICAvL2NvbnNvbGUubG9nKFwic3RhdGUgY2hhbmdpbmdcIik7XG4gICAgLy9jb25zb2xlLmxvZyh0b1N0YXRlKVxuXG4gICAgICAgIGlmKHRvU3RhdGUuZGF0YS5wZXJtaXNzaW9uID09PSB0cnVlKXtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJuZWVkIHBlcm1pc3Npb25cIik7XG4gICAgICAgICAgICAvL3RvU3RhdGUucmVzb2x2ZSA9IHRvU3RhdGUucmVzb2x2ZSB8fCB7fTtcbiAgICAgICAgICAgIC8vdG9TdGF0ZS5yZXNvbHZlID0ge307XG5cbiAgICAgICAgICAgIC8vY2hlY2sgdG8gc2VlIGlmIHRoZXJlIHdhcyBhIHJlc29sdmUgYWxyZWFkeSBhZGRlZFxuICAgICAgICAgICAgaWYoIXRvU3RhdGUucmVzb2x2ZS5hdXRob3JpemF0aW9uUmVzb2x2ZXIpe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdhZGRpbmcgYXV0aCByZXNvbHZlcicpO1xuICAgICAgICAgICAgICAgIC8vYWRkIHJlc29sdmVyXG4gICAgICAgICAgICAgICAgdG9TdGF0ZS5yZXNvbHZlLmF1dGhvcml6YXRpb25SZXNvbHZlciA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXV0aFNlcnZpY2UuaXNBdXRob3JpemVkKGV2ZW50LCBmcm9tU3RhdGUsIHRvU3RhdGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwianVzdCBhZGRlZDogXCIpXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyh0b1N0YXRlLnJlc29sdmUuYXV0aG9yaXphdGlvblJlc29sdmVyKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAvL2p1c3QgdG8gc2hvdyB0aGF0IHRoZSByZXNvbHZlciB3YXMgYWxyZWFkeSBhZGRlZFxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2codG9TdGF0ZS5yZXNvbHZlLmF1dGhvcml6YXRpb25SZXNvbHZlcilcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IC8vZW5kIGlmIG5lZWRzIHBlcm1pc3Npb25cblxuXG4gICAgfSk7IC8vZW5kIHJvb3RTY29wZS4kb25cblxuXG4gICAgXG5cbn1dKTsgLy9lbmQgLnJ1blxuXG5cblxuXG5cbn0pKCk7IC8vZW5kIGlmZmVcblxuIiwiKGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCdcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnYXBwJylcblx0XHQuY29udHJvbGxlcignYXBwQ3RybCcsIGFwcEN0cmwpXG5cblx0YXBwQ3RybC4kaW5qZWN0ID0gWydzYW1wbGVTZXJ2aWNlJywnYXV0aFNlcnZpY2UnLCckc3RhdGUnLCckaHR0cCcsJ3RvYXN0cicsJyRyb290U2NvcGUnLCdub3RpZnlTZXJ2aWNlJ11cblxuXHRmdW5jdGlvbiBhcHBDdHJsKHNhbXBsZVNlcnZpY2UsYXV0aFNlcnZpY2UsJHN0YXRlLCAkaHR0cCwgdG9hc3RyLCAkcm9vdFNjb3BlLG5vdGlmeVNlcnZpY2UpIHtcblxuXHRcdCB2YXIgdm0gPSB0aGlzO1xuXG5cdFx0IC8vIG9uIGluaXRpYWwgbG9hZFxuXHRcdCAvLyB1c2VyIGxvZ2luIHN0YXR1c1xuXHRcdCB2bS5pc0xvZ2dlZCA9IGF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCh2bSk7XG5cblx0XHQgJHJvb3RTY29wZS4kb24oJ2xvZ2dlZEluJyxmdW5jdGlvbigpe1xuXHRcdCBcdHZtLmlzTG9nZ2VkID0gdHJ1ZTtcblx0XHQgfSlcblxuXHRcdCAkcm9vdFNjb3BlLiRvbignbG9nZ2VkT3V0JyxmdW5jdGlvbigpe1xuXHRcdCBcdHZtLmlzTG9nZ2VkID0gZmFsc2U7XG5cdFx0IH0pXG5cblx0XHQgdmFyIG1lc3NhZ2UgPSB7ZGF0YSA6IFwicm9vc3RzXCJ9O1xuXHRcdCAvL25vdGlmeVNlcnZpY2UucHVzaCggbWVzc2FnZSk7XG5cblx0XHQgLy9hbGVydChcIndhdGNoaW5nXCIpO1xuXG5cblx0fSAvL2VuZCBhcHBDdHJsXG5cbn0pKCk7O1xuXG5cbiIsIihmdW5jdGlvbigpIHtcblx0J3VzZSBzdHJpY3QnXG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ2FwcCcpXG5cdFx0LmNvbnRyb2xsZXIoJ2hvbWVDdHJsJywgaG9tZUN0cmwpXG5cdFx0LmNvbnRyb2xsZXIoJ3BhcmVudEN0cmwnLCBwYXJlbnRDdHJsKVxuXG5cdGhvbWVDdHJsLmluamVjdCA9IFsnc2FtcGxlU2VydmljZScsJyRzY29wZSddXG5cblx0ZnVuY3Rpb24gaG9tZUN0cmwoc2FtcGxlU2VydmljZSwgJHNjb3BlKSB7XG5cdFx0XG5cdFx0c2FtcGxlU2VydmljZS5pbmZvKCk7XG5cblx0ICAgIHZhciB2bSA9IHRoaXM7XG5cblx0ICAgIHZtLmdvdG9TZXNzaW9uID0gZ290b1Nlc3Npb247XG5cdCAgICB2bS5yZWZyZXNoID0gcmVmcmVzaDtcblx0ICAgIHZtLnNlYXJjaCA9IHNlYXJjaDtcblx0ICAgIHZtLnNlc3Npb25zID0gW107XG5cdCAgICB2bS50ZXN0ID0gJ3Rlc3QnO1xuXG5cdCAgICAvLy8vLy8vLy8vLy9cblxuXHQgICAgLy8gJHNjb3BlLiRvbignZG9ncycsIGZ1bmN0aW9uICgpIHtcblx0ICAgIC8vIFx0Y29uc29sZS5sb2coXCJyZWNlaXZlZFwiKVxuXHQgICAgLy8gfSk7XG5cblx0ICAgIGZ1bmN0aW9uIGdvdG9TZXNzaW9uKCkge1xuXG5cdFx0fVxuXG5cdCAgICBmdW5jdGlvbiByZWZyZXNoKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBzZWFyY2goKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cdH0gLy8gZW5kIGhvbWVDdHJsXG5cblx0cGFyZW50Q3RybC5pbmplY3QgPSBbJ3NhbXBsZVNlcnZpY2UnLCckc2NvcGUnXVxuXG5cdGZ1bmN0aW9uIHBhcmVudEN0cmwoJHNjb3BlKSB7XG5cdFx0XG5cdCAgICB2YXIgdm0gPSB0aGlzO1xuXHQgICAgLy9jb25zb2xlLmxvZyhcInBhcmVudFwiKVxuXG5cdCAgIC8vICRzY29wZS4kZW1pdCgnZG9ncycsJ3NvbWUgZGF0YScpO1xuXG5cblx0fSAvLyBlbmQgcGFyZW50Q3RybFxuXG59KSgpO1xuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG4iLCJcdChmdW5jdGlvbigpe1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCdhcHAnKVxuXHRcdC5jb250cm9sbGVyKFwibG9naW5DdHJsXCIsIGxvZ2luQ3RybClcblxuXHRsb2dpbkN0cmwuJGluamVjdCA9IFsnJHNjb3BlJywnc2FtcGxlU2VydmljZScsJ2F1dGhTZXJ2aWNlJywnJHN0YXRlJywnJGh0dHAnLCd0b2FzdHInXVxuXG5cdGZ1bmN0aW9uIGxvZ2luQ3RybCgkc2NvcGUsc2FtcGxlU2VydmljZSxhdXRoU2VydmljZSwkc3RhdGUsICRodHRwLCB0b2FzdHIpIHtcblx0XHQvL3NhbXBsZVNlcnZpY2UuaW5mbygpO1xuXHRcdC8vY29uc29sZS5sb2coXCJsb2dpbkN0cmxcIilcblxuXHQgICAgdmFyIHZtID0gdGhpcztcblx0ICAgIHZtLnVzZXIgPSBcIlwiXG5cdCAgICB2bS5sb2dpbkZvcm0gPSBcIlwiO1xuXHQgICAgXG5cdCAgICB2bS5sb2dpbiA9IGxvZ2luO1xuXHQgICAgdm0ubG9nb3V0ID0gbG9nb3V0O1xuXG5cdCAgICAvLy8vLy8vLy8vLy9cblxuXHQgICAgZnVuY3Rpb24gbG9naW4oKSB7XG5cdCAgICBcdGF1dGhTZXJ2aWNlLmxvZ2luKHZtLnVzZXIsJ2FwcC5ub3RlcycpXG5cdFx0XHR2bS51c2VyID0gXCJcIjtcblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gbG9nb3V0KCkge1xuXHQgICAgXHRjb25zb2xlLmxvZyhcImxvZ2dpbmcgb3V0Li4uXCIpXG5cdCAgICBcdGF1dGhTZXJ2aWNlLmxvZ291dCgpO1xuXHQgICAgfVxuXG5cblx0fSAvL2VuZCBsb2dpbkN0cmxcblxuXG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCdcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnYXBwJylcblx0XHQuY29udHJvbGxlcignbmF2Q3RybCcsIG5hdkN0cmwpXG5cblx0bmF2Q3RybC5pbmplY3QgPSBbJyR3aW5kb3cnLCckcm9vdFNjb3BlJ11cblxuXHRmdW5jdGlvbiBuYXZDdHJsKCR3aW5kb3csICRyb290U2NvcGUpIHtcblx0XHRcblx0XHQvL2NvbnNvbGUubG9nKCduYXYgY29udHJvbGxlcicpO1xuXG5cdCAgICB2YXIgdm0gPSB0aGlzO1xuXHQgICAgdm0uZGlzcGxheU5hbWUgPSAkd2luZG93LnNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ3VzZXJuYW1lJyk7XG5cdCAgICAkcm9vdFNjb3BlLiRvbignbG9nZ2VkSW4nLGZ1bmN0aW9uKCl7XG5cdCAgICBcdHZtLmRpc3BsYXlOYW1lID0gJHdpbmRvdy5zZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCd1c2VybmFtZScpO1xuXHQgICAgfSlcblx0ICAgIFxuXG5cblx0ICAgIHZtLmxvZ2dlZEluID0gdHJ1ZTtcblx0ICAgIHZtLmdvdG9TZXNzaW9uID0gZ290b1Nlc3Npb247XG5cdCAgICB2bS5yZWZyZXNoID0gcmVmcmVzaDtcblx0ICAgIHZtLnNlYXJjaCA9IHNlYXJjaDtcblx0ICAgIHZtLnNlc3Npb25zID0gW107XG5cdCAgICB2bS50aXRsZSA9ICdOYXYnO1xuXHQgICAgLy8kc2NvcGUudGl0bGUgPSBcIm1vdXNlXCI7XG5cblx0ICAgIC8vLy8vLy8vLy8vL1xuXG5cdCAgICBmdW5jdGlvbiBnb3RvU2Vzc2lvbigpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gcmVmcmVzaCgpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gc2VhcmNoKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXHR9XG5cbn0pKCk7XG5cblxuIiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcCcpXG4gICAgLmRpcmVjdGl2ZSgnc2VsZWN0VGV4dCcsIHNlbGVjdFRleHQpXG4gICAgXG4gICAgc2VsZWN0VGV4dC4kaW5qZWN0ID0gWyckd2luZG93J11cblxuZnVuY3Rpb24gc2VsZWN0VGV4dCgkd2luZG93KXtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgIGVsZW1lbnQuYmluZCgnY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoISR3aW5kb3cuZ2V0U2VsZWN0aW9uKCkudG9TdHJpbmcoKSkge1xuICAgICAgICB0aGlzLnNldFNlbGVjdGlvblJhbmdlKHRoaXMudmFsdWUubGVuZ3RoLCB0aGlzLnZhbHVlLmxlbmd0aClcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn1cblxuXG4iLCJcbmFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuXHQuY29uZmlnKFsnJHVybFJvdXRlclByb3ZpZGVyJywnJHN0YXRlUHJvdmlkZXInLCckaHR0cFByb3ZpZGVyJyxmdW5jdGlvbigkdXJsUm91dGVyUHJvdmlkZXIsJHN0YXRlUHJvdmlkZXIsJGh0dHBQcm92aWRlcil7XG5cdFx0XG5cdFx0JHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnaG9tZScpO1xuXHRcdC8vc3RhdGVzXG5cdFx0JHN0YXRlUHJvdmlkZXJcblxuXHRcdC5kZWNvcmF0b3IoJ3BhdGgnLCBmdW5jdGlvbihzdGF0ZSwgcGFyZW50Rm4pIHtcblx0XHRcdC8vY29uc29sZS5sb2coXCJjb25maWd1cmluZyBzdGF0ZXNcIilcdFxuXHRcdFx0aWYgKHN0YXRlLnNlbGYucmVzb2x2ZSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdHN0YXRlLnNlbGYucmVzb2x2ZSA9IHt9O1xuXHRcdFx0XHRzdGF0ZS5yZXNvbHZlID0gc3RhdGUuc2VsZi5yZXNvbHZlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHBhcmVudEZuKHN0YXRlKTtcbiAgICAgICAgIH0pXG5cblx0XHQuc3RhdGUoJ2FwcCcse1xuXHRcdFx0YWJzdHJhY3Q6IHRydWUsXG5cdFx0XHR0ZW1wbGF0ZVVybDonYXBwL3ZpZXdzL2FwcC52aWV3Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ2FwcEN0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAnYXBwJ1xuXG5cdFx0fSlcblxuXHRcdC5zdGF0ZSgnYXBwLmhvbWUnLHtcblx0XHRcdHVybDogJy9ob21lJyxcblx0XHRcdHRlbXBsYXRlVXJsOidhcHAvdmlld3MvYXBwLmhvbWUuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnaG9tZUN0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAnaG9tZScsXG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdHBlcm1pc3Npb246IGZhbHNlLFxuXHRcdFx0XHRwZXJtaXNzaW9uTGV2ZWw6IFsnZXZlcnlvbmUnXVxuXHRcdFx0fVxuXHRcdH0pXG5cblx0XHQuc3RhdGUoJ2FwcC5yZWdpc3Rlcicse1xuXHRcdFx0dXJsOiAnL3JlZ2lzdGVyJyxcblx0XHRcdHRlbXBsYXRlVXJsOidjb21wb25lbnRzL3JlZ2lzdGVyL3ZpZXdzL3JlZ2lzdGVyLnZpZXcuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAncmVnaXN0ZXJDdHJsJyxcblx0XHRcdGNvbnRyb2xsZXJBczogJ3JlZ2lzdGVyJyxcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0cGVybWlzc2lvbjogZmFsc2UsXG5cdFx0XHRcdHBlcm1pc3Npb25MZXZlbDogWydldmVyeW9uZSddXG5cdFx0XHR9XG5cdFx0fSlcblxuXHRcdC5zdGF0ZSgnYXBwLm1lbWJlcnMnLHtcblx0XHRcdHVybDogJy9tZW1iZXJzJyxcblx0XHRcdHRlbXBsYXRlVXJsOidjb21wb25lbnRzL21lbWJlcnMvdmlld3MvbWVtYmVycy5ob21lLmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ21lbWJlcnNDdHJsJyxcblx0XHRcdGNvbnRyb2xsZXJBczogJ21lbWJlcnMnLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRwZXJtaXNzaW9uOiB0cnVlLFxuXHRcdFx0XHRwZXJtaXNzaW9uTGV2ZWw6IFsnYWRtaW4nLCdtZW1iZXInXVxuXHRcdFx0fVxuXHRcdH0pXG5cblx0XHQuc3RhdGUoJ2FwcC5ub3Rlcycse1xuXHRcdFx0dXJsOiAnL25vdGVzJyxcblx0XHRcdHRlbXBsYXRlVXJsOidjb21wb25lbnRzL25vdGVzL3ZpZXdzL25vdGVzLnZpZXcuaHRtbCcsXG5cblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0cGVybWlzc2lvbjogdHJ1ZSxcblx0XHRcdFx0cGVybWlzc2lvbkxldmVsOiBbJ2FkbWluJywnbWVtYmVyJ11cblx0XHRcdH1cblx0XHR9KVxuXG5cdFx0LnN0YXRlKCdhcHAuYnVkZ2V0Jyx7XG5cdFx0XHR1cmw6ICcvYnVkZ2V0Jyxcblx0XHRcdHRlbXBsYXRlVXJsOidjb21wb25lbnRzL2J1ZGdldC92aWV3cy9idWRnZXQudmlldy5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdidWRnZXRDdHJsJyxcblx0XHRcdGNvbnRyb2xsZXJBczogJ2J1ZGdldCcsXG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdHBlcm1pc3Npb246IHRydWUsXG5cdFx0XHRcdHBlcm1pc3Npb25MZXZlbDogWydhZG1pbiddXG5cdFx0XHR9XG5cdFx0fSlcblxuXHRcdC8vJGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaCgnYXV0aEludGVyY2VwdG9yJyk7XG5cblxuXG5cdH1dKTtcblxuIiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ3NhbXBsZScpXG4gICAgLmRpcmVjdGl2ZSgnc2FtcGxlRGlyJywgc2FtcGxlRGlyKTtcblxuZnVuY3Rpb24gc2FtcGxlRGlyKCkge1xuXHRyZXR1cm57XG5cdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHR0ZW1wbGF0ZVVybDogJycsXG5cdFx0cmVwbGFjZTogdHJ1ZVxuXHRcdC8vIHNjb3BlOiB7fVxuXHR9XG59IiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ2F1dGgnLCBbXG4gICAgICBcbiAgICBdKTsiLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgnYnVkZ2V0JywgW1xuICAgICAgJ2NoYXJ0LmpzJ1xuICAgIF0pOyIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdtZW1iZXJzJywgW1xuICAgICAgXG4gICAgXSk7IiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ25vdGVzJywgW1xuICAgICAgJ2F1dGgnXG4gICAgXSk7IiwiKGZ1bmN0aW9uKCl7XG5cdCd1c2Ugc3RyaWN0J1xuXG5hbmd1bGFyXG5cdC5tb2R1bGUoJ25vdGlmeScsIFtcblx0ICBcblx0XSk7XG5cbn0pKCk7XG5cblxuIiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ3JlZ2lzdGVyJywgW1xuICAgIFx0J2F1dGgnXG4gICAgXSk7IiwiKGZ1bmN0aW9uKCl7XG5cdCd1c2Ugc3RyaWN0J1xuXG5hbmd1bGFyXG5cdC5tb2R1bGUoJ3NhbXBsZScsIFtcblx0ICBcblx0XSk7XG5cbn0pKCk7XG5cbiIsIihmdW5jdGlvbigpe1xuICAgICd1c2Ugc3RyaWN0J1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhdXRoJylcbiAgICAgICAgLmZhY3RvcnkoJ2F1dGhJbnRlcmNlcHRvcicsIGF1dGhJbnRlcmNlcHRvcik7XG5cbiAgICBhdXRoSW50ZXJjZXB0b3IuJGluamVjdCA9IFsnYXV0aFNlcnZpY2UnXVxuXG4gICAgZnVuY3Rpb24gYXV0aEludGVyY2VwdG9yKGF1dGhTZXJ2aWNlKSB7XG5cblxuXG4gICAgICAgIHZhciBzZXJ2aWNlID0ge1xuXG4gICAgICAgICAgICByZXF1ZXN0OiByZXF1ZXN0LFxuICAgICAgICAgICAgcmVzcG9uc2U6IHJlc3BvbnNlXG5cbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gc2VydmljZTtcblxuICAgICAgICAvLy8vLy8vLy8vLy9cblxuICAgICAgICBmdW5jdGlvbiByZXF1ZXN0KGNvbmZpZykge1xuXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiYXV0aEludGVyY2VwdG9yIHJlcXVlc3QgZnVuY3Rpb25cIilcblxuICAgICAgICAgICAgdmFyIHRva2VuID0gYXV0aFNlcnZpY2UuZ2V0VG9rZW4oKTtcblxuICAgICAgICAgICAgaWYodG9rZW4pe1xuICAgICAgICAgICAgICAgIGNvbmZpZy5oZWFkZXJzLnRva2VuID0gdG9rZW47XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ0b2tlbiBwcmVzZW50XCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5vIHRva2VuXCIpO1xuICAgICAgICAgICAgfSAgICBcbiAgICAgICAgICAgIHJldHVybiBjb25maWc7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiByZXNwb25zZShyZXNwb25zZSkge1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImF1dGhJbnRlcmNlcHRvciByZXNwb25zZSBmdW5jdGlvblwiKVxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICB9XG5cbiAgICB9IC8vZW5kIGF1dGhJbnRlcmNlcHRvclxuXG4gICAgXG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKXtcblx0Ly8ndXNlIHN0cmljdCdcblxuXHRhbmd1bGFyXG4gICAgXHQubW9kdWxlKCdhdXRoJyxbXSlcbiAgICBcdC5mYWN0b3J5KCdhdXRoU2VydmljZScsIGF1dGhTZXJ2aWNlKTtcblxuICAgIGF1dGhTZXJ2aWNlLiRpbmplY3QgPSBbJyR3aW5kb3cnLCckaHR0cCcsJ3RvYXN0cicsJyRzdGF0ZScsJyRyb290U2NvcGUnLCckbG9jYXRpb24nLCckcSddO1xuXG4gICAgZnVuY3Rpb24gYXV0aFNlcnZpY2UoJHdpbmRvdywkaHR0cCx0b2FzdHIsJHN0YXRlLCRyb290U2NvcGUsJGxvY2F0aW9uLCRxKSB7XG5cbiAgICBcblxuICAgIFx0dmFyIHNlcnZpY2UgPSB7XG5cbiAgICAgICAgICAgIGluZm86IGluZm8sXG5cbiAgICAgICAgICAgIGxvZ2luOiBsb2dpbixcbiAgICAgICAgICAgIGxvZ291dDogbG9nb3V0LFxuXG4gICAgXHRcdHNldFRva2VuOiBzZXRUb2tlbixcbiAgICAgICAgICAgIGdldFRva2VuOiBnZXRUb2tlbixcbiAgICBcdFx0Y2xlYXJUb2tlbjogY2xlYXJUb2tlbixcblxuICAgICAgICAgICAgaXNBdXRoZW50aWNhdGVkOiBpc0F1dGhlbnRpY2F0ZWQsIC8vIHZlcmlmaWVzIHRva2VuXG4gICAgICAgICAgICBpc0F1dGhvcml6ZWQ6IGlzQXV0aG9yaXplZCAvLyB2ZXJpZmllcyByb3V0ZSBwZXJtaXNzaW9uc1xuXG4gICAgXHR9O1xuXG4gICAgXHRyZXR1cm4gc2VydmljZTtcblxuICAgIFx0Ly8vLy8vLy8vLy8vXG5cbiAgICAgICAgZnVuY3Rpb24gaW5mbyAoKSB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiYXV0aCBzZXJ2aWNlXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmVkaXJlY3QgdGFrZXMgcm91dGUgc3RyaW5nIGllLiAnYXBwLmhvbWUnXG4gICAgICAgIGZ1bmN0aW9uIGxvZ2luICh1c2VyTG9naW5EYXRhLCByZWRpcmVjdCkge1xuICAgICAgICAgICAgJGh0dHAucG9zdCgnaHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaS91c2Vycy9sb2dpbicsIHVzZXJMb2dpbkRhdGEpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzKXtcbiAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgICAgICAgICAgICAgICBpZihyZXMuc3RhdHVzID09IDIwMCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAkd2luZG93LnNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ3VzZXJuYW1lJywgdXNlckxvZ2luRGF0YS5lbWFpbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUb2tlbihyZXMuZGF0YS50b2tlbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRlbWl0KFwibG9nZ2VkSW5cIik7ICBcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvYXN0ci5zdWNjZXNzKHJlcy5kYXRhLm1lc3NhZ2UpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0eXBlb2YocmVkaXJlY3QpICE9IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKHJlZGlyZWN0KVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgICAgICAgICAgdG9hc3RyLmVycm9yKGVyci5kYXRhLm1lc3NhZ2UpXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycilcbiAgICAgICAgICAgICAgICB9KVxuXG5cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGxvZ291dCAoKSB7XG4gICAgICAgICAgICBjbGVhclRva2VuKCk7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRlbWl0KFwibG9nZ2VkT3V0XCIpO1xuICAgICAgICAgICAgJHN0YXRlLmdvKFwiYXBwLmhvbWVcIik7XG4gICAgICAgICAgICB0b2FzdHIuc3VjY2VzcyhcIllvdSBoYXZlIGJlZW4gbG9nZ2VkIG91dFwiKTtcbiAgICAgICAgfVxuXG5cblxuICAgIFx0ZnVuY3Rpb24gc2V0VG9rZW4gKHRva2VuKSB7XG4gICAgICAgICAgICAkd2luZG93LnNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ3VzZXJUb2tlbicsdG9rZW4pO1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBnZXRUb2tlbiAoKSB7XG4gICAgICAgICAgICB2YXIgdG9rZW4gPSAkd2luZG93LnNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ3VzZXJUb2tlbicpO1xuICAgICAgICAgICAgcmV0dXJuIHRva2VuO1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBjbGVhclRva2VuICgpIHtcbiAgICAgICAgICAgICR3aW5kb3cuc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbSgndXNlclRva2VuJyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygncmFiYml0cycpXG5cdCAgICB9XG5cbiAgICAgICAgLy9iYXNpY2FsbHkgYXJlIHRoZXkgbG9nZ2VkIGluXG4gICAgICAgIGZ1bmN0aW9uIGlzQXV0aGVudGljYXRlZCAoKSB7XG5cbiAgICAgICAgICAgIHZhciB0b2tlbiA9IGdldFRva2VuKCk7XG4gICAgICAgICAgICBpZih0b2tlbil7XG4gICAgICAgICAgICAgICAgJGh0dHAucG9zdCgnaHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaS91c2Vycy9hdXRob3JpemUnLHt0b2tlbjp0b2tlbn0pXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2cocmVzKVxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2F1dGhvcml6aW5nLi4nKVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIHJlcy5kYXRhLnN1Y2Nlc3MgPT0gdHJ1ZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9hc3RyLnN1Y2Nlc3MoXCJBdXRoZW50aWNhdGlvbiBTdWNjZXNzIVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQXV0aGVudGljYXRpb24gU3VjY2VzcyFcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRlbWl0KFwibG9nZ2VkSW5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IFxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy90b2FzdHIuZXJyb3IoXCJBdXRoZW50aWNhdGlvbiBGYWlsZWRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkF1dGhlbnRpY2F0aW9uIEZhaWxlZFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxmdW5jdGlvbihlcnIpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9hc3RyLmVycm9yKGVyci5kYXRhKVxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgLy90b2FzdHIuZXJyb3IoXCJhdXRoZW50aWNhdGlvbiBmYWlsZWQsIG5vIHRva2VuIHByZXNlbnRcIilcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImF1dGhlbnRpY2F0aW9uIGZhaWxlZCwgbm8gdG9rZW4gcHJlc2VudFwiKVxuICAgICAgICAgICAgfSBcbiAgICAgICAgICAgXG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBpc0F1dGhvcml6ZWQgKGV2ZW50LCBmcm9tU3RhdGUsIHRvU3RhdGUpIHtcbiAgICAgICAgICAgICAgICAvL3JldHVybiAkcS5yZWplY3QoKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInJ1bm5pbmcgaXMgYXV0aG9yaXplZFwiKVxuXG4gICAgICAgICAgICAgICAgLy9ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHZhciB0b2tlbiA9IGdldFRva2VuKCk7XG4gICAgICAgICAgICAgICAgdmFyIHVzZXJsZXZlbCA9IG51bGw7XG4gICAgICAgICAgICAgICAgdmFyIHByb2NlZWQgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIGlmKHRva2VuKXtcbiAgICAgICAgICAgICAgICAgIC8vICByZXR1cm4gJHEucmVqZWN0O1xuICAgICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCdodHRwOi8vbG9jYWxob3N0OjMwMDAvYXBpL3VzZXJzL2F1dGhvcml6ZScse3Rva2VuOnRva2VufSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnYXV0aG9yaXppbmcuLicpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoIHJlcy5kYXRhLnN1Y2Nlc3MgPT0gdHJ1ZSAmJiByZXMuZGF0YS5wcm9maWxlLnVzZXJMZXZlbCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMuZGF0YS5wcm9maWxlLnVzZXJMZXZlbClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlckxldmVsID0gcmVzLmRhdGEucHJvZmlsZS51c2VyTGV2ZWw7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2xvb3AgdGhyb3VnaCBwZXJtaXNzaW9uIGxpc3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpPTA7IGkgPCB0b1N0YXRlLmRhdGEucGVybWlzc2lvbkxldmVsLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2lmIGN1cnJlbnQgdXNlcmxldmVsIG1hdGNoZXMgcGVybWlzc2lvbiBsZXZlbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vdGhlbiBzZXQgcHJvY2VlZCB0byB0cnVlIGFuZCBicmVhayB0aGUgZm9yIGxvb3AgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJjdXJyZW50IGxvb3AgaSA6IFwiICsgdG9TdGF0ZS5kYXRhLnBlcm1pc3Npb25MZXZlbFtpXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih1c2VyTGV2ZWwgPT0gdG9TdGF0ZS5kYXRhLnBlcm1pc3Npb25MZXZlbFtpXSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInBlcm1pc3Npb24gbWF0Y2hcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2V0dGluZyBwcm9jZWVkIHRydWVcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2NlZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3JldHVybiB0b2FzdHIuc3VjY2VzcyhcInByb2NlZWRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJrZWVwIGxvb2tpbmdcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2V0dGluZyBwcm9jZWVkIGZhbHNlXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9jZWVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0vL2VuZCBmb3IgbG9vcCAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSAvLyBlbmQgaWYgcHJvZmlsZSByZXR1cm5lZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGVsc2Ugbm8gcHJvZmlsZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvYXN0ci5lcnJvcihcImJhZCByZXF1ZXN0XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2NlZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImxhc3QgY2hlY2tcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihwcm9jZWVkID09IGZhbHNlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJJVFMgRkFMU0VcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5ob21lJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSAvL2VuZCB0aGVuXG4gICAgICAgICAgICAgICAgfS8vZW5kIGlmIHRva2VuXG5cbiAgICAgICAgICAgICAgICAvL2Vsc2Ugbm8gdG9rZW4gXG4gICAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgdG9hc3RyLmVycm9yKFwibm8gdG9rZW4gcHJlc2VudFwiKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIFxuXG4gICAgICAgIH0vL2VuZCBpc0F1dGhvcml6ZWRcbiAgICAgICAgXG5cbiAgICB9Ly9lbmQgYXV0aFNlcnZpY2VcblxuICAgIFxuXG5cblxuXHRcblxufSkoKTsgLy9lbmQgaWZmZVxuXG5cbiIsIihmdW5jdGlvbigpIHtcblx0J3VzZSBzdHJpY3QnXG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ2J1ZGdldCcpXG5cdFx0LmNvbnRyb2xsZXIoJ2J1ZGdldEN0cmwnLCBidWRnZXRDdHJsKVxuXG5cdGJ1ZGdldEN0cmwuJGluamVjdCA9IFsnJHNjb3BlJywnJGh0dHAnLCd0b2FzdHInXVxuXG5cdGZ1bmN0aW9uIGJ1ZGdldEN0cmwoJHNjb3BlLCAkaHR0cCwgdG9hc3RyKSB7XG5cdFx0Y29uc29sZS5sb2coJ2xvYWRlZCBidWRnZXRDdHJsJyk7XG5cdFxuXHRcdC8vICRzY29wZS5NYXRoID0gd2luZG93Lk1hdGg7XG5cblx0XHQgICAgXG5cblxuICBcdFx0XHQvLyBpbmNvbWVcbiAgXHRcdFx0JHNjb3BlLmluY29tZSA9IHt9XG4gIFx0XHRcdCRzY29wZS5pbmNvbWUubW9udGhseSA9IDQ1MDA7XG5cbiAgXHRcdFx0Ly8gYmlsbHNcbiAgXHRcdFx0JHNjb3BlLmJpbGxzID1bXVxuICBcdFx0XHQkc2NvcGUuYmlsbHMgPSBbXG4gIFx0XHRcdFx0e25hbWU6XCJyZW50XCIsIGNvc3Q6IDI1MDB9LFxuICBcdFx0XHRcdHtuYW1lOlwidXRpbGl0aWVzXCIsIGNvc3Q6IDIwMH0sXG4gIFx0XHRcdFx0e25hbWU6XCJjYXIgaW5zdXJhbmNlXCIsIGNvc3Q6IDE1MH0sXG4gIFx0XHRcdFx0e25hbWU6XCJjYXIgcGF5bWVudFwiLCBjb3N0OiAyNTB9LFxuICBcdFx0XHRcdHtuYW1lOlwiZ2FzXCIsIGNvc3Q6IDEwMH0sXG4gIFx0XHRcdFx0e25hbWU6XCJneW0gbWVtYmVyc2hpcFwiLCBjb3N0OiA1MH0sXG4gIFx0XHRcdFx0e25hbWU6XCJjZWxsIHBob25lXCIsIGNvc3Q6IDgwfSxcblxuICBcdFx0XHRdXG5cbiAgICAgICAgXG5cbiAgXHRcdFx0JHNjb3BlLmFkZE5ld0JpbGwgPSBmdW5jdGlvbigpe1xuICBcdFx0XHRcdCRzY29wZS5iaWxscy5wdXNoKHtuYW1lOiAkc2NvcGUubmV3QmlsbE5hbWUsIGNvc3Q6IDAgfSlcbiAgXHRcdFx0XHQkc2NvcGUubmV3QmlsbE5hbWUgPSBcIlwiO1xuICBcdFx0XHR9XG5cbiAgXHRcdFx0JHNjb3BlLnJlbW92ZUJpbGxJdGVtID0gZnVuY3Rpb24oaW5kZXgpe1xuICBcdFx0XHRcdCRzY29wZS5iaWxscy5zcGxpY2UoaW5kZXgsMSk7XG4gIFx0XHRcdH1cblxuICBcdFx0XHQvL2J1ZGdldCBpdGVtc1xuICBcdFx0XHQkc2NvcGUuYnVkZ2V0SXRlbXMgPSBbXTtcbiAgXHRcdFx0JHNjb3BlLmJ1ZGdldEl0ZW1zID0gW1xuICBcdFx0XHRcdHtuYW1lOiBcImVhdCBvdXRcIiwgYnVkZ2V0OiAxMDAsIHNwZW50OiAzMCB9LFxuICBcdFx0XHRcdHtuYW1lOiBcImNsb3RoaW5nXCIsIGJ1ZGdldDogMjAwLCBzcGVudDogOTB9XG4gIFx0XHRcdF1cblxuICBcdFx0XHQkc2NvcGUuYWRkTmV3QnVkZ2V0SXRlbSA9IGZ1bmN0aW9uKCl7XG4gIFx0XHRcdFx0JHNjb3BlLmJ1ZGdldEl0ZW1zLnB1c2goe25hbWU6ICRzY29wZS5uZXdCdWRnZXRJdGVtTmFtZSwgYnVkZ2V0OiAwLCBzcGVudDogMCB9KVxuICBcdFx0XHRcdCRzY29wZS5uZXdCdWRnZXRJdGVtTmFtZSA9IFwiXCI7XG4gIFx0XHRcdH1cblxuICAgICAgICAkc2NvcGUucHVyY2hhc2VzID0gW11cbiAgICAgICAgJHNjb3BlLnB1cmNoYXNlcyA9IFt7Y2F0ZWdvcnk6IFwiZWF0IG91dFwifV1cblxuICAgICAgICAkc2NvcGUuYWRkUHVyY2hhc2VJdGVtID0gZnVuY3Rpb24oKXtcblxuICAgICAgICB9XG5cblxuICAgICAgICAkc2NvcGUubW9udGhseU92ZXJ2aWV3ID0ge307XG4gICAgICAgICRzY29wZS5tb250aGx5T3ZlcnZpZXcuYmlsbHNUb3RhbCA9IDA7XG4gICAgICAgICRzY29wZS5tb250aGx5T3ZlcnZpZXcuYnVkZ2V0VG90YWwgPSAwO1xuICAgICAgICAkc2NvcGUubW9udGhseU92ZXJ2aWV3LmJ1ZGdldFNwZW50VG90YWwgPSAwO1xuICAgICAgICAkc2NvcGUubW9udGhseU92ZXJ2aWV3LnRvdGFsRXN0aW1hdGVkRXhwZW5kaXR1cmUgPSAwO1xuXG4gICAgICAgIFxuICAgICAgICAkc2NvcGUuY2FsY3VsYXRlQmlsbHNUb3RhbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciB0b3RhbCA9IDA7XG4gICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8ICRzY29wZS5iaWxscy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICB0b3RhbCA9IHRvdGFsICsgJHNjb3BlLmJpbGxzW2ldLmNvc3Q7XG4gICAgICAgICAgfVxuICAgICAgICAgICRzY29wZS5tb250aGx5T3ZlcnZpZXcuYmlsbHNUb3RhbCA9IHRvdGFsO1xuICAgICAgICAgICRzY29wZS5jYWxjdWxhdGVUb3RhbEV4cGVuZGl0dXJlKClcbiAgICAgICAgICByZXR1cm4gdG90YWw7XG4gICAgICAgIH1cblxuICAgICAgICBcblxuICAgICAgICAkc2NvcGUuY2FsY3VsYXRlQnVkZ2V0VG90YWwgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgdG90YWwgPSAwO1xuICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCAkc2NvcGUuYnVkZ2V0SXRlbXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgdG90YWwgPSB0b3RhbCArICRzY29wZS5idWRnZXRJdGVtc1tpXS5idWRnZXQ7XG4gICAgICAgICAgfVxuICAgICAgICAgICRzY29wZS5tb250aGx5T3ZlcnZpZXcuYnVkZ2V0VG90YWwgPSB0b3RhbDtcbiAgICAgICAgICAkc2NvcGUuY2FsY3VsYXRlVG90YWxFeHBlbmRpdHVyZSgpXG4gICAgICAgICAgcmV0dXJuIHRvdGFsOyAgICAgICBcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5jYWxjdWxhdGVCdWRnZXRTcGVudFRvdGFsID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIHRvdGFsID0gMDtcbiAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgJHNjb3BlLmJ1ZGdldEl0ZW1zLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIHRvdGFsID0gdG90YWwgKyAkc2NvcGUuYnVkZ2V0SXRlbXNbaV0uc3BlbnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgICRzY29wZS5tb250aGx5T3ZlcnZpZXcuYnVkZ2V0U3BlbnRUb3RhbCA9IHRvdGFsO1xuICAgICAgICAgIC8vJHNjb3BlLmNhbGN1bGF0ZVRvdGFsRXhwZW5kaXR1cmUoKVxuICAgICAgICAgIHJldHVybiB0b3RhbDsgICAgICAgXG4gICAgICAgIH1cblxuICAgICAgICBcblxuXG5cbiAgICAgICAkc2NvcGUuJHdhdGNoKFwiYmlsbHNcIiwgJHNjb3BlLmNhbGN1bGF0ZUJpbGxzVG90YWwsIHRydWUpXG4gICAgICAgJHNjb3BlLiR3YXRjaChcImJ1ZGdldEl0ZW1zXCIsICRzY29wZS5jYWxjdWxhdGVCdWRnZXRUb3RhbCwgdHJ1ZSlcbiAgICAgICAkc2NvcGUuJHdhdGNoKFwiYnVkZ2V0SXRlbXNcIiwgJHNjb3BlLmNhbGN1bGF0ZUJ1ZGdldFNwZW50VG90YWwsIHRydWUpXG5cbiAgICAgLy8gJHNjb3BlLiR3YXRjaChcImJ1ZGdldEl0ZW1zXCIsICRzY29wZS5jYWxjdWxhdGVCdWRnZXRUb3RhbCwgdHJ1ZSlcblxuXG4gICAgICAgICRzY29wZS5jYWxjdWxhdGVUb3RhbEV4cGVuZGl0dXJlID0gZnVuY3Rpb24gICgpIHtcbiAgICAgICAgICAgICAkc2NvcGUubW9udGhseU92ZXJ2aWV3LnRvdGFsRXN0aW1hdGVkRXhwZW5kaXR1cmUgPSAkc2NvcGUubW9udGhseU92ZXJ2aWV3LmJpbGxzVG90YWwgKyAkc2NvcGUubW9udGhseU92ZXJ2aWV3LmJ1ZGdldFRvdGFsO1xuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLmNhbGN1bGF0ZUJpbGxzVG90YWwoKTtcbiAgICAgICAgJHNjb3BlLmNhbGN1bGF0ZUJ1ZGdldFRvdGFsKCk7XG4gICAgICAgICRzY29wZS5jYWxjdWxhdGVCdWRnZXRTcGVudFRvdGFsKCk7XG4gICAgICAgICRzY29wZS5jYWxjdWxhdGVUb3RhbEV4cGVuZGl0dXJlKCk7XG5cbiAgICAgICAgJHNjb3BlLmxhYmVscyA9IFtcIkJpbGxzXCIsIFwiQnVkZ2V0XCIsIFwiUmVtYWluaW5nXCJdO1xuICAgICAgICAkc2NvcGUuZGF0YSA9IFskc2NvcGUubW9udGhseU92ZXJ2aWV3LmJpbGxzVG90YWwsXG4gICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5tb250aGx5T3ZlcnZpZXcuYnVkZ2V0VG90YWwsXG4gICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5pbmNvbWUubW9udGhseSAtICRzY29wZS5tb250aGx5T3ZlcnZpZXcudG90YWxFc3RpbWF0ZWRFeHBlbmRpdHVyZV07XG5cblxuXG5cblxuXHR9XG5cbn0pKCk7XG5cblxuIiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ25vdGVzJylcbiAgICAuZGlyZWN0aXZlKCdub3RlQ2FyZCcsIG5vdGVDYXJkKTtcblxuZnVuY3Rpb24gbm90ZUNhcmQoKSB7XG5cdHJldHVybntcblx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdHNjb3BlOiB7XG5cdFx0XHRkYXRhOiBcIj1cIixcblx0XHRcdGRyYWdnYWJsZTogXCI9XCJcblx0XHR9LFxuXHRcdHJlcGxhY2U6IHRydWUsXG5cdFx0dGVtcGxhdGU6IFwiPGgxPnt7ZG9nc319e3tkcmFnU3RhdHVzfX08L2gxPlwiLFxuXHRcdGxpbms6IGZ1bmN0aW9uKHNjb3BlLGVsZW1lbnQpe1xuXHRcdFx0ZWxlbWVudC5jbGljayhmdW5jdGlvbigpe1xuXHRcdFx0XHRjb25zb2xlLmxvZyhlbGVtZW50KVxuXHRcdFx0XHRlbGVtZW50WzBdLmRyYWdnYWJsZSA9IHRydWU7XG5cdFx0XHR9KVxuXHRcdH0sXG5cdFx0Y29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKXtcblx0XHRcdC8vYWxlcnQoXCJjb250cm9sbGVyXCIpO1xuXHRcdFx0JHNjb3BlLmRvZ3MgPSAkc2NvcGUuZGF0YSArIFwiZG9nc1wiO1xuXHRcdFx0aWYoJHNjb3BlLmRyYWdnYWJsZSlcblx0XHRcdFx0JHNjb3BlLmRyYWdTdGF0dXMgPSBmYWxzZTtcblx0XHRcdGVsc2UgJHNjb3BlLmRyYWdTdGF0dXMgPSB0cnVlO1xuXG5cdFx0XHRcblx0XHR9XG5cdH1cbn1cblxuXG5cbi8vIGFuZ3VsYXJcbi8vICAgICAubW9kdWxlKCdub3RlcycpXG4vLyAgICAgLmRpcmVjdGl2ZSgnbm90ZUNhcmQnLCBub3RlQ2FyZCk7XG5cbi8vIGZ1bmN0aW9uIG5vdGVDYXJkKCkge1xuLy8gXHRyZXR1cm57XG4vLyBcdFx0cmVzdHJpY3Q6ICdFJyxcbi8vIFx0XHRjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpe1xuLy8gXHRcdFx0YWxlcnQoXCJjb250cm9sbGVyXCIpO1xuLy8gXHRcdFx0Y29uc29sZS5sb2coJ2RvZycpXG4vLyBcdFx0fSxcbi8vIFx0XHR0ZW1wbGF0ZVVybDogJycsXG4vLyBcdFx0cmVwbGFjZTogdHJ1ZVxuLy8gXHRcdC8vIHNjb3BlOiB7fVxuLy8gXHR9XG4vLyB9IiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ25vdGVzJylcbiAgICAuZGlyZWN0aXZlKCdub3RlQ2FyZHMnLCBub3RlQ2FyZHMpXG5cblxuICAgIFxuXG5mdW5jdGlvbiBub3RlQ2FyZHMoKSB7XG5cdHJldHVybntcblx0XHRyZXN0cmljdDogJ0FFJyxcblx0XHRzY29wZToge1xuXHRcdFx0bm90ZXM6IFwiPVwiLFxuXHRcdFx0bmV3SXRlbTogXCI9XCJcblx0XHR9LFxuXHRcdHJlcGxhY2U6IGZhbHNlLFxuXHRcdHRyYW5zY2x1ZGU6IGZhbHNlLFxuXHRcdHRlbXBsYXRlVXJsOiBcImNvbXBvbmVudHMvbm90ZXMvdmlld3Mvbm90ZS5kaXJlY3RpdmUudmlldy5odG1sXCIsXG5cdFx0bGluazogZnVuY3Rpb24oc2NvcGUsZWxlbWVudCxhdHRycyl7XG5cdFx0XHQvLyQoIFwiI3NvcnRhYmxlXCIgKS5zb3J0YWJsZSgpO1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhzY29wZSlcblx0XHRcdC8vY29uc29sZS5sb2coZWxlbWVudClcblx0XHRcdC8vY29uc29sZS5sb2coYXR0cnMpXG5cdFx0XHQvL2VsZW1lbnQuc29ydGFibGUoKTtcblx0XHRcdC8vY29uc29sZS5sb2coc2NvcGUubm90ZXMpXG5cdFx0XHRzY29wZS5kb2dzID0gZnVuY3Rpb24obm90ZSl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKG5vdGUpXG5cdFx0XHR9XG5cblxuXHRcdFx0ZWxlbWVudC5zb3J0YWJsZSh7XG5cdFx0ICAgICAgIC8vIHBsYWNlaG9sZGVyOiBcInVpLXN0YXRlLWhpZ2hsaWdodFwiLFxuXHRcdCAgICAgICAgc3RhcnQ6IGZ1bmN0aW9uKGV2ZW50LCB1aSkge1xuXHRcdCAgICAgICAgICAgIHZhciBzdGFydF9wb3MgPSB1aS5pdGVtLmluZGV4KCk7XG5cdFx0ICAgICAgICAgICAgdWkuaXRlbS5kYXRhKCdzdGFydF9wb3MnLCBzdGFydF9wb3MpO1xuXHRcdCAgICAgICAgfSxcblx0XHQgICAgICAgIHVwZGF0ZTogZnVuY3Rpb24oZXZlbnQsIHVpKSB7XG5cdFx0ICAgICAgICAgICAgdmFyIHN0YXJ0X3BvcyA9IHVpLml0ZW0uZGF0YSgnc3RhcnRfcG9zJyk7XG5cdFx0ICAgICAgICAgICAgdmFyIGVuZF9wb3MgPSB1aS5pdGVtLmluZGV4KCk7XG5cdFx0ICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhzdGFydF9wb3MgKyAnIC0gJyArIGVuZF9wb3MpO1xuXHRcdCAgICAgICAgICBcblx0XHQgICAgICAgICAgdmFyIHN0YXJ0SXRlbSA9IHNjb3BlLm5vdGVzW3N0YXJ0X3Bvc107XG5cdFx0ICAgICAgICAgICBzY29wZS5ub3Rlcy5zcGxpY2Uoc3RhcnRfcG9zLDEpXG5cdFx0ICAgICAgICAgICBzY29wZS5ub3Rlcy5zcGxpY2UoZW5kX3BvcywwLCBzdGFydEl0ZW0pXG5cdFx0ICAgICAgICAgICBzY29wZS4kYXBwbHkoKTtcblxuXHRcdCAgICAgICAgICAgLy9jb25zb2xlLmxvZyhzY29wZS5ub3Rlcylcblx0XHQgICAgICAgICAgIFxuXHRcdCAgICAgICAgICAgXG5cdFx0ICAgICAgICB9XG5cdFx0ICAgIH0pOyAvLyBlbmQgc29ydGFibGVcblxuXHRcdCAgIFxuXG5cdFx0ICAgIGNvbnNvbGUubG9nKGVsZW1lbnQpXG5cblxuXHRcdH0sXG5cdFx0Y29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKXtcblx0XHRcdCRzY29wZS5mb3JtID17fVxuXHRcdFx0JHNjb3BlLmFkZEl0ZW0gPSBmdW5jdGlvbihpbmRleCxpdGVtKXtcblx0XHRcdFx0Ly9hbGVydChpbmRleClcblx0XHRcdFx0Y29uc29sZS5sb2coJHNjb3BlLm5ld0l0ZW0pXG5cdFx0XHRcdCRzY29wZS5ub3Rlc1tpbmRleF0uaXRlbXMucHVzaChpdGVtKVxuXHRcdFx0XHQkc2NvcGUuZm9ybSA9IHt9XG5cdFx0XHRcdC8vY29uc29sZS5sb2coJHNjb3BlLm5vdGVzW2luZGV4XS5pdGVtcylcblx0XHRcdH1cblxuXHRcdFx0JHNjb3BlLmRlbGV0ZU5vdGUgPSBmdW5jdGlvbihpbmRleCl7XG5cdFx0XHRcdCRzY29wZS5ub3Rlcy5zcGxpY2UoaW5kZXgsMSk7XG5cdFx0XHR9XG5cblxuXHRcdFx0Ly9hbGVydChcImNvbnRyb2xsZXJcIik7XG5cdFx0XHQvLyAkc2NvcGUuZG9ncyA9ICRzY29wZS5kYXRhICsgXCJkb2dzXCI7XG5cdFx0XHQvLyBpZigkc2NvcGUuZHJhZ2dhYmxlKVxuXHRcdFx0Ly8gXHQkc2NvcGUuZHJhZ1N0YXR1cyA9IGZhbHNlO1xuXHRcdFx0Ly8gZWxzZSAkc2NvcGUuZHJhZ1N0YXR1cyA9IHRydWU7XG5cblx0XHRcdFxuXHRcdH1cblx0fVxufSAvL2VuZCBub3RlY2FyZHMgZGlyZWN0aXZlXG5cbmFuZ3VsYXJcblx0Lm1vZHVsZSgnbm90ZXMnKVxuXHQuZGlyZWN0aXZlKCdub3RlQ2FyZCcsIG5vdGVDYXJkKVxuXG5mdW5jdGlvbiBub3RlQ2FyZCgpIHtcblxuXHR2YXIgdGVtcERhdGEgPSB7fTtcblx0dmFyIHRlbXBOb3RlID0gbnVsbDtcblxuXHRyZXR1cm57XG5cdFx0cmVzdHJpY3Q6ICdBRScsXG5cdFx0c2NvcGU6IHtcblx0XHRcdG5vdGU6IFwiPVwiLFxuXHRcdFx0bm90ZXM6IFwiPVwiXG5cdFx0fSxcblx0XHRyZXBsYWNlOiB0cnVlLFxuXHRcdHRyYW5zY2x1ZGU6IGZhbHNlLFxuXHRcdHRlbXBsYXRlVXJsOiBcImNvbXBvbmVudHMvbm90ZXMvdmlld3Mvbm90ZXMuaXRlbXMudmlldy5odG1sXCIsXG5cdFx0bGluazogZnVuY3Rpb24oc2NvcGUsZWxlbWVudCxhdHRycyl7XG5cdFx0XHQvLyQoIFwiI3NvcnRhYmxlXCIgKS5zb3J0YWJsZSgpO1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhzY29wZSlcblx0XHRcdC8vY29uc29sZS5sb2coZWxlbWVudClcblx0XHRcdC8vY29uc29sZS5sb2coYXR0cnMpXG5cdFx0XHQvL2VsZW1lbnQuc29ydGFibGUoKTtcblx0XHRcdC8vY29uc29sZS5sb2coc2NvcGUubm90ZXMpXG5cdFx0XHQvL3Njb3BlLiR3YXRjaCgnbm90ZXMnLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAvLyBhbGwgdGhlIGNvZGUgaGVyZS4uLlxuICAgIFx0XHRcbiAgICBcdFx0XG5cdFx0XHRcblxuXHRcdFx0ZWxlbWVudC5zb3J0YWJsZSh7XG5cdFx0XHRcdGNvbm5lY3RXaXRoOiBcIi5jb25uZWN0ZWRTb3J0YWJsZVwiLFxuXHRcdCAgICAgICAvL3BsYWNlaG9sZGVyOiBcInVpLXN0YXRlLWhpZ2hsaWdodFwiLFxuXHRcdCAgICAgICAgc3RhcnQ6IGZ1bmN0aW9uKGV2ZW50LCB1aSkge1xuXHRcdCAgICAgICAgXHRjb25zb2xlLmxvZyhcIlNUQVJUIFNUQVJUIFNUQVJUIFNUQVJUIFNUQVJUXCIpXG5cdFx0ICAgICAgICBcdGNvbnNvbGUubG9nKGVsZW1lbnQpXG5cdFx0ICAgICAgICBcdGNvbnNvbGUubG9nKHRlbXBEYXRhKVxuXHRcdCAgICAgICAgXHRcblxuXHRcdCAgICAgICAgXHR0ZW1wRGF0YS5zdGFydE5vdGUgPSBhbmd1bGFyLmNvcHkoc2NvcGUubm90ZSk7XG5cdFx0ICAgICAgICBcdHRlbXBEYXRhLnN0YXJ0Tm90ZUluZGV4ID0gYXR0cnMubm90ZWluZGV4O1xuXHRcdFx0XHRcdHRlbXBEYXRhLnN0YXJ0Tm90ZUl0ZW1JbmRleCA9IHVpLml0ZW0uaW5kZXgoKTtcblx0XHRcdFx0XHR0ZW1wRGF0YS5zdGFydE5vdGVJdGVtQ29udGVudCA9IHRlbXBEYXRhLnN0YXJ0Tm90ZS5pdGVtc1t0ZW1wRGF0YS5zdGFydE5vdGVJdGVtSW5kZXhdO1xuXHRcdCAgIFx0XHRcdFxuXHRcdCAgIFx0XHRcdHRlbXBOb3RlID0gYW5ndWxhci5jb3B5KHNjb3BlLm5vdGUpXG5cdFx0ICAgXHRcdFx0Y29uc29sZS5sb2codGVtcE5vdGUpXG5cblx0XHQgICAgICAgIH0sXG5cdFx0ICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uKGV2ZW50LCB1aSkge1xuXG5cdFx0ICAgICAgIC8vIGNvbnNvbGUubG9nKHNjb3BlLnRlbXBEYXRhKVx0XG5cdCAgICAgICAgIFx0aWYgKCF1aS5zZW5kZXIpIHtcdFx0ICAgICAgIFxuXHRcdFx0ICAgICAgICAgY29uc29sZS5sb2coXCJVUERBVEUgVVBEQVRFIFVQREFURSBVUERBVEUgVVBEQVRFIElOU0lERSBJRlwiIClcblxuXHRcdFx0ICAgICAgICBcblx0XHRcdFx0XHRcdFx0XHQgICAgICAgICBcblxuXHRcdFx0XHRcdHZhciBzdGFydF9wb3MgPSB0ZW1wRGF0YS5zdGFydE5vdGVJdGVtSW5kZXg7XG5cdFx0XHRcdFx0dmFyIGVuZF9wb3MgPSB1aS5pdGVtLmluZGV4KCk7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coc3RhcnRfcG9zICsgJyAtICcgKyBlbmRfcG9zKTtcblxuXHRcdFx0XHRcdHRlbXBOb3RlLml0ZW1zLnNwbGljZShzdGFydF9wb3MsMSlcblx0XHRcdFx0XHR0ZW1wTm90ZS5pdGVtcy5zcGxpY2UoZW5kX3BvcywwLCB0ZW1wRGF0YS5zdGFydE5vdGVJdGVtQ29udGVudClcblx0XHRcdFx0XHQvL3Njb3BlLm5vdGUgPSB0ZW1wTm90ZVxuXHRcdFx0XHRcdHNjb3BlLm5vdGVzW3RlbXBEYXRhLnN0YXJ0Tm90ZUluZGV4XSA9IHRlbXBOb3RlO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKHNjb3BlLm5vdGVzKVxuXG5cdFx0XHRcdFx0dmFyIHJhc3QgPSB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJhZHNAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiczFcIixcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJsYXVuc2RyeVwiLCBcImFwc3BseSBqb2JzXCIsIFwiZ3N5bVwiIF0sXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMS8xLzIyMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIxLzIyLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3pzZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgICAgIH1cblxuXHRcdFx0XHRcdC8vc2NvcGUubm90ZXNbMF0uaXRlbXMucHVzaChcIlBVQ0tTXCIpXG5cblx0XHRcdFx0XHRzY29wZS4kYXBwbHkoKTtcblxuXHRcdCAgIC8vICAgICAgICAgLy9jb25zb2xlLmxvZyhzY29wZS5ub3Rlcylcblx0XHRcdCAgICB9ICAgXG5cdFx0ICAgICAgICAgICBcblx0XHQgICAgICAgIH0sIC8vZW5kIHVwZGF0ZVxuXHRcdCAgICAgICAgcmVjZWl2ZTogZnVuY3Rpb24oZXZlbnQsIHVpKXtcblx0XHQgICAgICAgIFx0Y29uc29sZS5sb2coXCJSRUNFSVZFIFJFQ0VJVkUgUkVDRUlWRSBSRUNFSVZFIFJFQ0VJVkVcIilcblx0XHQgICAgICAgIFx0Y29uc29sZS5sb2codGVtcERhdGEpXG5cblx0XHQgICAgICAgIFx0dGVtcERhdGEuZW5kTm90ZSA9IGFuZ3VsYXIuY29weShzY29wZS5ub3RlKTtcblx0XHQgICAgICAgIFx0dGVtcERhdGEuZW5kTm90ZUluZGV4ID0gYXR0cnMubm90ZWluZGV4O1xuXHRcdFx0XHRcdHRlbXBEYXRhLmVuZE5vdGVJdGVtSW5kZXggPSB1aS5pdGVtLmluZGV4KCk7XG5cblx0XHRcdFx0XHRcblxuXHRcdFx0XHRcdCAgLy9jb25zb2xlLmxvZyhcInJlbW92aW5nIGl0ZW06IFwiICsgc2NvcGUubm90ZXNbbm90ZU9yaWdpbkluZGV4XS5pdGVtc1tzdGFydF9wb3NdKTtcblx0XHQgICAgICAgICAgIHRlbXBEYXRhLnN0YXJ0Tm90ZS5pdGVtcy5zcGxpY2UodGVtcERhdGEuc3RhcnROb3RlSXRlbUluZGV4LDEpXG5cdFx0XHQgICAgICAgdGVtcERhdGEuZW5kTm90ZS5pdGVtcy5zcGxpY2UodGVtcERhdGEuZW5kTm90ZUl0ZW1JbmRleCwwLHRlbXBEYXRhLnN0YXJ0Tm90ZUl0ZW1Db250ZW50KVxuXHRcdFx0ICAgICAgIGNvbnNvbGUubG9nKHRlbXBEYXRhKVxuXG5cdFx0XHQgICAgICAgc2NvcGUubm90ZXNbdGVtcERhdGEuc3RhcnROb3RlSW5kZXhdID0gdGVtcERhdGEuc3RhcnROb3RlO1xuXHRcdFx0ICAgICAgIHNjb3BlLm5vdGVzW3RlbXBEYXRhLmVuZE5vdGVJbmRleF0gPSB0ZW1wRGF0YS5lbmROb3RlO1xuXHQgICAgICAgICAgIFx0XG5cdCAgICAgICAgICAgXHRcdGNvbnNvbGUubG9nKHRlbXBEYXRhLnN0YXJ0Tm90ZS5pdGVtcylcblx0ICAgICAgICAgICBcdFx0Y29uc29sZS5sb2codGVtcERhdGEuZW5kTm90ZS5pdGVtcylcblxuXHRcdCAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImFkZGluZyBhZnRlciBwb3NpdGlvbjogXCIgKyBlbmRfcG9zKVxuXHRcdCAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImFkZGluZyBhZnRlcjogXCIgKyBzY29wZS5ub3Rlc1tub3RlRGVzdGluYXRpb25JbmRleF0uaXRlbXNbZW5kX3Bvc10pXG5cdFx0ICAgICAgICAgICAvL3Njb3BlLm5vdGVzW25vdGVEZXN0aW5hdGlvbkluZGV4XS5pdGVtcy5zcGxpY2UoZW5kX3BvcywwLCBzdGFydEl0ZW0pXG5cblx0XHQgICAgICAgIFx0Ly9zY29wZS50ZW1wRGF0YSA9IFwicHJhd25zXCI7XG5cdFx0ICAgICAgICBcdFxuXHRcdCAgICAgICAgXHRcblx0XHQgICAgICAgIFx0Ly8gY29uc29sZS5sb2codGVtcERhdGEpXG5cdFx0ICAgICAgICBcdC8vIC8vY29uc29sZS5sb2coc2NvcGUubm90ZSk7XG5cdFx0ICAgICAgICBcdHZhciByYXN0ID0ge1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyYWRzQG5qaXQuZWR1XCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcInMxXCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwibGF1bnNkcnlcIiwgXCJhcHNwbHkgam9ic1wiLCBcImdzeW1cIiBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjEvMS8yMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMS8yMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96c2UuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9XG5cdFx0ICAgICAgICBcdFxuXHRcdCAgICAgICAgICAgc2NvcGUuJGFwcGx5KCk7XG5cdFx0XG5cblx0XHQgICAgICAgIH1cblxuXHRcdCAgICB9KTsgLy8gZW5kIHNvcnRhYmxlXG5cblx0XHQgLy8gIH0pOyAvL2VuZCB3YXRjaFxuXG5cblxuXHRcdH0sXG5cdFx0Y29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKXtcblxuXHRcdFx0JHNjb3BlLm1vb3NlID0gXCJkaW5nXCJcblx0XHRcdCRzY29wZS5kZWxldGVJdGVtID0gZnVuY3Rpb24ocGFyZW50SW5kZXgsIGluZGV4KXtcblx0XHRcdFx0Y29uc29sZS5sb2cocGFyZW50SW5kZXgpXG5cdFx0XHRcdGNvbnNvbGUubG9nKGluZGV4KVxuXHRcdFx0XHQkc2NvcGUubm90ZXNbcGFyZW50SW5kZXhdLml0ZW1zLnNwbGljZShpbmRleCwxKVxuXG5cdFx0XHR9XG5cblx0XHRcdCRzY29wZS5yYW5kb21JZCA9IGZ1bmN0aW9uKGl0ZW0pe1xuICAgXHRcdFx0IHJldHVybiBcIklEXCIgKyBpdGVtICsgKE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiA5OTkpICsgMSkpO1xuXHRcdFx0fVxuXHRcdFx0Ly9hbGVydChcImNvbnRyb2xsZXJcIik7XG5cdFx0XHQvLyAkc2NvcGUuZG9ncyA9ICRzY29wZS5kYXRhICsgXCJkb2dzXCI7XG5cdFx0XHQvLyBpZigkc2NvcGUuZHJhZ2dhYmxlKVxuXHRcdFx0Ly8gXHQkc2NvcGUuZHJhZ1N0YXR1cyA9IGZhbHNlO1xuXHRcdFx0Ly8gZWxzZSAkc2NvcGUuZHJhZ1N0YXR1cyA9IHRydWU7XG5cblx0XHRcdGNvbnNvbGUubG9nKCRzY29wZSlcblxuXHRcdFx0XG5cdFx0fVxuXHR9XG59IC8vZW5kIG5vdGVjYXJkIGRpcmVjdGl2ZVxuXG5cblxuXG5cbiIsIihmdW5jdGlvbigpe1xuXHQndXNlIHN0cmljdCdcblxuXHRhbmd1bGFyXG4gICAgXHQubW9kdWxlKCdidWRnZXQnKVxuICAgIFx0LmZhY3RvcnkoJ2J1ZGdldFNlcnZpY2UnLCBidWRnZXRTZXJ2aWNlKTtcblxuICAgIGJ1ZGdldFNlcnZpY2UuJGluamVjdCA9IFsnJGh0dHAnXVxuXG4gICAgZnVuY3Rpb24gYnVkZ2V0U2VydmljZSgkaHR0cCkge1xuICAgIFx0dmFyIHNlcnZpY2UgPSB7XG5cbiAgICAgICAgICAgIGdldE5vdGU6IGdldE5vdGUsXG4gICAgICAgICAgICBnZXROb3RlczogZ2V0Tm90ZXMsXG4gICAgICAgICAgICBzYXZlTm90ZXM6IHNhdmVOb3Rlc1xuXG5cbiAgICBcdH07XG5cbiAgICBcdHJldHVybiBzZXJ2aWNlO1xuXG4gICAgXHQvLy8vLy8vLy8vLy9cblxuICAgICAgICAvLyBnZXRzIGEgc2luZ2xlIG5vdGVcbiAgICAgICAgZnVuY3Rpb24gZ2V0Tm90ZSAoKSB7XG5cbiAgICAgICAgICAgIHZhciBub3RlID0ge1xuICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJ0b2RvXCIsXG4gICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJsYXVuZHJ5XCIsIFwiYXBwbHkgam9ic1wiLCBcImd5bVwiIF0sXG4gICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIxLzEvMjAxNlwiLFxuICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIxLzIvMjAxNlwiLFxuICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96ZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbm90ZTtcblxuICAgICAgICB9IC8vZW5kIGdldE5vdGUoKVxuXG5cbiAgICAgICAgLy8gZ2V0cyBhbGwgbm90ZXNcbiAgICAgICAgZnVuY3Rpb24gZ2V0Tm90ZXMgKCkge1xuXG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCdodHRwOi8vbG9jYWxob3N0OjMwMDAvYXBpL25vdGVzL2dldE5vdGVzJyx7ZW1haWw6XCJtb2l6QGdtYWlsLmNvbVwifSlcbiAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgIFxuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgbm90ZXMgPSBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyQG5qaXQuZWR1XCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIjFcIixcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJsYXVuZHJ5XCIsIFwiYXBwbHkgam9ic1wiLCBcImd5bVwiIF0sXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMS8xLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjEvMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96ZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyQG5qaXQuZWR1XCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIjJcIixcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJodG1sNSBkcmFnIGFuZCBkcm9wXCIsIFwic29ja2V0LmlvXCIsIFwibm9kZWpzXCIgXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIyLzEvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMi8yLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3plLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiM1wiLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImJvc2UgaGVhZHBob25lc1wiLCBcIjIwMTYgaG9uZGEgZ3JpbGxcIiwgXCJzb2xpZCBzdGF0ZSBoYXJkIGRyaXZlXCIgXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIxLzEvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMS8yLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3plLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiNFwiLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImxhdW5kcnlcIiwgXCJhcHBseSBqb2JzXCIsIFwiZ3ltXCIgXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIxLzEvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMS8yLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3plLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiNVwiLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImh0bWw1IGRyYWcgYW5kIGRyb3BcIiwgXCJzb2NrZXQuaW9cIiwgXCJub2RlanNcIiBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjIvMS8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIyLzIvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvemUuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMkBuaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCI2XCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwiYm9zZSBoZWFkcGhvbmVzXCIsIFwiMjAxNiBob25kYSBncmlsbFwiLCBcInNvbGlkIHN0YXRlIGhhcmQgZHJpdmVcIiBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjEvMS8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIxLzIvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvemUuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMkBuaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCI3XCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwibGF1bmRyeVwiLCBcImFwcGx5IGpvYnNcIiwgXCJneW1cIixcImJvc2UgaGVhZHBob25lc1wiLCBcIjIwMTYgaG9uZGEgZ3JpbGxcIiwgXCJzb2xpZCBzdGF0ZSBoYXJkIGRyaXZlXCIgIF0sXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMS8xLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjEvMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96ZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyQG5qaXQuZWR1XCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIjhcIixcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJodG1sNSBkcmFnIGFuZCBkcm9wXCIsIFwic29ja2V0LmlvXCIsIFwibm9kZWpzXCIgXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIyLzEvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMi8yLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3plLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiOVwiLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImJvc2UgaGVhZHBob25lc1wiLCBcIjIwMTYgaG9uZGEgZ3JpbGxcIiwgXCJzb2xpZCBzdGF0ZSBoYXJkIGRyaXZlXCIsXCJodG1sNSBkcmFnIGFuZCBkcm9wXCIsIFwic29ja2V0LmlvXCIsIFwibm9kZWpzXCIgIF0sXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMS8xLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjEvMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96ZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF0gLy9lbmQgbm90ZXMgYXJyYXlcblxuICAgICAgICAgICAgLy9yZXR1cm4gbm90ZXNcbiAgICAgICAgfSAvL2VuZCBnZXQgbm90ZXNcblxuICAgICAgICBmdW5jdGlvbiBzYXZlTm90ZXMobm90ZXMpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCdodHRwOi8vbG9jYWxob3N0OjMwMDAvYXBpL25vdGVzL3VwZGF0ZU5vdGVzJyx7ZW1haWw6XCJtb2l6QGdtYWlsLmNvbVwiLG5vdGVzOiBub3Rlc30pXG4gICAgICAgIH1cblxuXG5cbiAgICB9XG5cblx0XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0J1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCdtZW1iZXJzJylcblx0XHQuY29udHJvbGxlcignbWVtYmVyc0N0cmwnLCBtZW1iZXJzQ3RybClcblxuXHRtZW1iZXJzQ3RybC4kaW5qZWN0ID0gWyckaHR0cCddXG5cblx0ZnVuY3Rpb24gbWVtYmVyc0N0cmwoJGh0dHApIHtcblxuXHQgICAgdmFyIHZtID0gdGhpcztcblxuXHQgICAgdm0ubWVtYmVyc0NvbnRlbnQgPSBtZW1iZXJzQ29udGVudCgpO1xuXHQgICAgdm0uZ290b1Nlc3Npb24gPSBnb3RvU2Vzc2lvbjtcblx0ICAgIHZtLnJlZnJlc2ggPSByZWZyZXNoO1xuXHQgICAgdm0uc2VhcmNoID0gc2VhcmNoO1xuXHQgICAgdm0uc2Vzc2lvbnMgPSBbXTtcblx0ICAgIHZtLnRpdGxlID0gJ21lbWJlcnMnO1xuXG5cdCAgICAvLy8vLy8vLy8vLy9cblxuXHQgICAgZnVuY3Rpb24gbWVtYmVyc0NvbnRlbnQoKXtcblx0ICAgIFx0IC8vICRodHRwLmdldCgnaHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaS91c2Vycy9hbGwnKVxuXHQgICAgXHRcdC8vIC50aGVuKGZ1bmN0aW9uKHJlcyl7XG5cdCAgICBcdFx0Ly8gXHRjb25zb2xlLmxvZyhyZXMuZGF0YSlcblx0ICAgIFx0XHQvLyBcdHZtLm1lbWJlcnNDb250ZW50ID0gcmVzLmRhdGE7XG5cdCAgICBcdFx0Ly8gfSxcblx0ICAgIFx0XHQvLyBmdW5jdGlvbihlcnIpe1xuXHQgICAgXHRcdC8vIFx0Y29uc29sZS5sb2coZXJyLnN0YXR1cyArIFwiIFwiICsgZXJyLnN0YXR1c1RleHQpO1xuXHQgICAgXHRcdC8vIFx0dm0ubWVtYmVyc0NvbnRlbnQgPSBlcnIuZGF0YTtcblx0ICAgIFx0XHQvLyB9KVxuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBnb3RvU2Vzc2lvbigpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gcmVmcmVzaCgpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gc2VhcmNoKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXHR9XG5cbn0pKCk7XG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cdCd1c2Ugc3RyaWN0J1xuXG5cdGFuZ3VsYXJcbiAgICBcdC5tb2R1bGUoJ3NhbXBsZScpXG4gICAgXHQuZmFjdG9yeSgnc2FtcGxlU2VydmljZScsIHNhbXBsZVNlcnZpY2UpO1xuXG4gICAvLyBzYW1wbGVTZXJ2aWNlLmluamVjdCA9IFsnJ11cblxuICAgIGZ1bmN0aW9uIHNhbXBsZVNlcnZpY2UoKSB7XG4gICAgXHR2YXIgc2VydmljZSA9IHtcblxuICAgIFx0XHRlcnJvcjogZXJyb3IsXG4gICAgXHRcdGluZm86IGluZm8sXG4gICAgXHRcdHN1Y2Nlc3M6IHN1Y2Nlc3NcblxuICAgIFx0fTtcblxuICAgIFx0cmV0dXJuIHNlcnZpY2U7XG5cbiAgICBcdC8vLy8vLy8vLy8vL1xuXG4gICAgXHRmdW5jdGlvbiBlcnJvcigpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gaW5mbygpIHtcblx0ICAgICAgLyogKi9cbiAgICAgICAgICAvL2NvbnNvbGUubG9nKFwic2FtcGxlU2VydmljZVwiKTtcblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gc3VjY2VzcygpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblxuXG4gICAgfVxuXG5cdFxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCdcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnbm90ZXMnKVxuXHRcdC5jb250cm9sbGVyKCdub3Rlc0N0cmwnLCBub3Rlc0N0cmwpXG5cblx0bm90ZXNDdHJsLiRpbmplY3QgPSBbJ25vdGVzU2VydmljZScsJyRzY29wZScsJyRodHRwJywndG9hc3RyJywnJHdpbmRvdycsJyRyb290U2NvcGUnXVxuXG5cdGZ1bmN0aW9uIG5vdGVzQ3RybChub3Rlc1NlcnZpY2UsJHNjb3BlLCAkaHR0cCwgdG9hc3RyLCAkd2luZG93LCRyb290U2NvcGUpIHtcblx0XHR2YXIgdm0gPSB0aGlzO1xuXHRcdGNvbnNvbGUubG9nKFwibm90ZXMgYmFsbHNvdXRcIik7XG5cblx0XHR2bS5nZXROb3Rlc0xpc3QgPSBnZXROb3Rlc0xpc3Q7XG5cblx0XHR2bS5nZXROb3Rlc0xpc3QoKTtcblx0XHR2bS5hY3RpdmVOb3RlcyA9IFtdO1xuXHRcdHZtLmdldFNpbmdsZU5vdGUgPSBnZXRTaW5nbGVOb3RlO1xuXG5cblx0XHR2bS5zYXZlTm90ZSA9IHNhdmVOb3RlO1xuXHRcdHZtLmRlbGV0ZU5vdGUgPSBkZWxldGVOb3RlO1xuXHRcdHZtLnVwZGF0ZU5vdGVDb250ZW50ID0gdXBkYXRlTm90ZUNvbnRlbnQ7XG5cdFx0dm0udXBkYXRlTm90ZVRpdGxlID0gdXBkYXRlTm90ZVRpdGxlO1xuXHRcdHZtLm5ld05vdGUgPSBuZXdOb3RlO1xuXHRcdHZtLmFkZFRhZyA9IGFkZFRhZztcblx0XHR2bS5kZWxldGVUYWcgPSBkZWxldGVUYWc7XG5cblx0XHR2bS5hY3RpdmF0ZSA9IGFjdGl2YXRlO1xuXHRcdHZtLmNsb3NlVGFiID0gY2xvc2VUYWI7XG5cdFx0XG5cdFx0dm0uc2hvd0xpc3QgPSB0cnVlO1xuXHRcdHZtLmdyaWRNb2RlID0gdHJ1ZTtcblx0XHR2bS50b2dnbGVUYWdzID0gZmFsc2U7XG5cbiAgXG5cdCAgXHQkc2NvcGUudGlueW1jZU9wdGlvbnMgPSB7XG5cdFx0ICAgIHBsdWdpbnM6ICdsaW5rIGltYWdlIGNvZGUnLFxuXHRcdCAgICB0b29sYmFyOiAndW5kbyByZWRvIHwgYm9sZCBpdGFsaWMgfCBhbGlnbmxlZnQgYWxpZ25jZW50ZXIgYWxpZ25yaWdodCB8IGNvZGUgfCBwYXN0ZSdcblx0XHQgIH07XG5cblx0XHQkc2NvcGUudGl0bGUgPSBcInJhdHN0c1wiO1xuXHRcdCRzY29wZS5kb2dzID1cImZyb2Fkc2FzZGZhZHNnc1wiXG5cdFx0dm0udGlueW1jZU1vZGVsID0gJ0luaXRpYWwgY29uc2RzZHRlbnQnO1xuXG5cblx0XHRcblxuXHRcdGZ1bmN0aW9uIGdldE5vdGVzTGlzdCgpIHtcblx0XHRcdFx0dm0uYWxsTm90ZXMgPSBbXTtcblx0XHRcdFx0Y29uc29sZS5sb2codm0uYWxsTm90ZXMpXG5cdFx0XHRcdG5vdGVzU2VydmljZS5nZXROb3Rlc0xpc3QoKS50aGVuKGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0XHRcdHZtLmFsbE5vdGVzID0gW107XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0JHJvb3RTY29wZS4kYXBwbHkoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coXCJ1cGRhdGluZ1wiKVxuXHRcdFx0XHRcdFx0XHR2bS5hbGxOb3RlcyA9IGRhdGEuZGF0YS5ub3Rlcztcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2codm0uYWxsTm90ZXMpO1xuXHRcdFx0XHRcdFx0fSlcdFxuXHRcdFx0XHRcdH0sIDEwMDApXG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0Y29uc29sZS5sb2codm0uYWxsTm90ZXMpO1xuXHRcdFx0XHR9KVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGdldFNpbmdsZU5vdGUobm90ZUlkKSB7XG5cdFx0XHQgbm90ZXNTZXJ2aWNlLmdldFNpbmdsZU5vdGUobm90ZUlkKS50aGVuKGZ1bmN0aW9uKCl7XG5cdFx0XHQgXHRyZXR1cm4gZGF0YS5kYXRhO1xuXHRcdFx0IH0pXG5cblx0XHR9XG5cblxuXHQgICAgZnVuY3Rpb24gYWN0aXZhdGUobm90ZUlkKSB7XG5cdCAgICBcdHZhciBwZXJtaXNzaW9uVG9BY3RpdmF0ZSA9IHRydWU7XG4gICAgXHRcdC8vIGNoZWNrcyBpZiB0YWIgYWxyZWFkeSBvcGVuXG4gICAgXHRcdGlmKHZtLmFjdGl2ZU5vdGVzLmxlbmd0aCA+IDAgJiYgdm0uYWN0aXZlTm90ZXMubGVuZ3RoICE9PSA0ICl7XG4gICAgXHRcdFx0Y29uc29sZS5sb2coJ2xvb3BpbmcnKVxuXHQgICAgXHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5hY3RpdmVOb3RlcywgZnVuY3Rpb24odmFsdWUpIHtcblx0ICAgIFx0XHRcdGNvbnNvbGUubG9nKHZhbHVlLl9pZC50b1N0cmluZygpKTtcblx0ICAgIFx0XHRcdGNvbnNvbGUubG9nKG5vdGVJZC50b1N0cmluZygpKTtcblx0XHRcdFx0ICBpZih2YWx1ZS5faWQudG9TdHJpbmcoKSA9PSBub3RlSWQudG9TdHJpbmcoKSl7XG5cdFx0XHRcdCAgXHRwZXJtaXNzaW9uVG9BY3RpdmF0ZSA9IGZhbHNlO1xuXHRcdFx0XHQgIFx0dG9hc3RyLmVycm9yKFwiV2hvb3BzISBMb29rcyBsaWtlIHRoaXMgbm90ZSBpcyBhbHJlYWR5IG9wZW5cIilcblx0XHRcdFx0ICB9XG5cdFx0XHRcdH0pOy8vZW5kIGZvcmVhY2hcblx0XHRcdH1cblx0XHQgICAgaWYodm0uYWN0aXZlTm90ZXMubGVuZ3RoID09IDQpe1xuXHRcdCAgICBcdFx0Y29uc29sZS5sb2coXCJjaGVja2luZyBtYXhcIik7XG5cdFx0ICAgIFx0XHRwZXJtaXNzaW9uVG9BY3RpdmF0ZSA9IGZhbHNlO1xuXHRcdCAgICBcdFx0dG9hc3RyLmVycm9yKFwiV2hvb3BzISBMb29rcyBsaWtlIHlvdSBoYXZlIHJlYWNoZWQgdGhlIG1heCBudW1iZXIgb2YgdGFicyg0KVwiKVxuXHRcdCAgICB9XG5cdFx0XG5cdCAgICBcdGlmKHBlcm1pc3Npb25Ub0FjdGl2YXRlID09IHRydWUpe1xuXHRcdFx0ICBcdGNvbnNvbGUubG9nKFwiZWxzZSBwdXNoaW5nXCIpO1xuXHRcdFx0ICBcdGNvbnNvbGUubG9nKG5vdGVJZClcblx0XHRcdCAgXHRub3Rlc1NlcnZpY2UuZ2V0U2luZ2xlTm90ZShub3RlSWQpLnRoZW4oZnVuY3Rpb24ocmVzKXtcblx0XHRcdCAgXHRcdHZhciBub3RlID0gcmVzLmRhdGEuZGF0YTtcblx0XHRcdCAgXHRcdHZtLmFjdGl2ZU5vdGVzLnB1c2gobm90ZSk7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2codm0uYWN0aXZlTm90ZXMpXG5cdFx0XHQgIFx0fSlcblx0XHRcdCAgXHRcblx0XHRcdH0gXG5cdCAgICBcdFxuXHQgICAgfSAvL2VuZCBmdW5jdGlvbiBhY3RpdmF0ZVxuXG5cdCAgICBmdW5jdGlvbiBjbG9zZVRhYihpbmRleCkge1xuXHQgICAgICB2bS5hY3RpdmVOb3Rlcy5zcGxpY2UoaW5kZXgsMSk7XG5cdCAgICAgIGNvbnNvbGUubG9nKHZtLmFjdGl2ZU5vdGVzKVxuXG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIG5ld05vdGUoKSB7XG5cdCAgICBcdC8vIGZpcnN0IGNoZWNrIGlmIGFjdGl2ZSBub3RlcyBpcyBmdWxsXG5cdCAgICBcdGlmKHZtLmFjdGl2ZU5vdGVzLmxlbmd0aCA9PSA0KXtcblx0ICAgIFx0XHRyZXR1cm4gdG9hc3RyLmVycm9yKFwiV2hvb3BzISBQbGVhc2UgY2xvc2UgYSB0YWIgYmVmb3JlIGNyZWF0aW5nIGEgbmV3IG5vdGVcIik7XG5cdCAgICBcdH1cblxuXHQgICAgXHRcblx0ICAgIFx0Ly8gZ2V0IHRva2VuXG5cdCAgICBcdHZhciB0b2tlbiA9ICR3aW5kb3cuc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgndXNlclRva2VuJyk7XG5cblx0ICAgIFx0Ly8gc2VuZCBuZXcgbm90ZSBvYmplY3Rcblx0ICAgIFx0bm90ZXNTZXJ2aWNlLmFkZE5ld05vdGUoKS50aGVuKGZ1bmN0aW9uKGRhdGEpe1xuXHQgICAgXHRcdGNvbnNvbGUubG9nKGRhdGEpO1xuXG5cdCAgICBcdFx0bm90ZXNTZXJ2aWNlLmdldE5vdGVzTGlzdCgpLnRoZW4oZnVuY3Rpb24oZGF0YTIpe1xuXHQgICAgXHRcdFx0Ly8gcHVzaCBuZXcgbm90ZSB0byBhY3RpdmUgbm90ZXNcblx0ICAgIFx0XHRcdGNvbnNvbGUubG9nKGRhdGEyKVxuXHQgICAgXHRcdFx0dm0uYWxsTm90ZXMgPSBkYXRhMi5kYXRhLm5vdGVzO1xuXHRcdCAgICBcdFx0dmFyIG5ld05vdGVJbmRleCA9IHZtLmFsbE5vdGVzLmxlbmd0aC0xO1xuXHRcdCAgICBcdFx0YWN0aXZhdGUodm0uYWxsTm90ZXNbbmV3Tm90ZUluZGV4XSk7XG5cdFx0ICAgIFx0XHQvL3Njcm9sbCB0byB0aGUgbmV3IG5vdGVcblx0ICAgIFx0XHRcdHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gXCJub3RlcyNcIiArIHZtLmFsbE5vdGVzW25ld05vdGVJbmRleF0uX2lkO1xuXG5cdFx0ICAgIFx0XHQvLyBsb2cgbmV3IGFjdGl2ZSBub3Rlc1xuXHRcdCAgICBcdFx0Y29uc29sZS5sb2codm0uYWN0aXZlTm90ZXMpO1xuXHQgICAgXHRcdH0pXG5cdCAgICBcdFx0XG5cdCAgICBcdFx0XG5cdCAgICBcdH0pO1xuXHRcdFx0XG5cdCAgICBcdFxuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiB1cGRhdGVOb3RlQ29udGVudChub3RlSWQsIG5vdGVDb250ZW50KSB7XG5cblx0ICAgIFx0bm90ZXNTZXJ2aWNlLnVwZGF0ZU5vdGVDb250ZW50KG5vdGVJZCwgbm90ZUNvbnRlbnQpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG5cdCAgICBcdFx0Y29uc29sZS5sb2coZGF0YSk7XG5cdCAgICBcdFx0aWYoZGF0YS5kYXRhLm5Nb2RpZmllZCA9PSAxKXtcblx0ICAgIFx0XHRcdHRvYXN0ci5zdWNjZXNzKFwiTm90ZSBTYXZlZCFcIilcblx0ICAgIFx0XHR9XG5cdCAgICBcdH0pXG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIHVwZGF0ZU5vdGVUaXRsZShub3RlSWQsIG5vdGVUaXRsZSkge1xuXG5cdCAgICBcdG5vdGVzU2VydmljZS51cGRhdGVOb3RlVGl0bGUobm90ZUlkLCBub3RlVGl0bGUpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG5cdCAgICBcdFx0Y29uc29sZS5sb2coZGF0YSk7XG5cdCAgICBcdFx0aWYoZGF0YS5kYXRhLm5Nb2RpZmllZCA9PSAxKXtcblx0ICAgIFx0XHRcdHZtLmdldE5vdGVzTGlzdCgpO1xuXHQgICAgXHRcdH1cblx0ICAgIFx0fSlcblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gZGVsZXRlTm90ZShub3RlSWQsaW5kZXgpe1xuXHQgICAgXHRjb25zb2xlLmxvZygnZGVsZXRpbmcnKVxuXHQgICAgXHRub3Rlc1NlcnZpY2UuZGVsZXRlTm90ZShub3RlSWQpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG5cdCAgICBcdFx0aWYoZGF0YS5kYXRhLm5Nb2RpZmllZCA9PSAxKXtcblx0ICAgIFx0XHRcdGNsb3NlVGFiKGluZGV4KVxuXHQgICAgXHRcdFx0dG9hc3RyLnN1Y2Nlc3MoXCJOb3RlIERlbGV0ZWQhXCIpXG5cdCAgICBcdFx0XHR2bS5nZXROb3Rlc0xpc3QoKTtcblx0ICAgIFx0XHR9XG5cdCAgICBcdFx0XG5cdCAgICBcdH0pO1xuXHQgICAgXHRcblx0ICAgIH1cblxuXG5cdCAgICBcblxuXHQgICAgZnVuY3Rpb24gYWRkVGFnKG5vdGVJZCwgbm90ZVRhZ3NBcnJheSl7XG5cdCAgICBcdGlmKHZtLm5ld1RhZ05hbWUgPT0gXCJcIiB8fCB2bS5uZXdUYWdOYW1lID09IHVuZGVmaW5lZCB8fCB2bS5uZXdUYWdOYW1lID09IG51bGwpe1xuXHQgICAgXHRcdHRvYXN0ci5lcnJvcihcIlBsZWFzZSBlbnRlciBhIHRhZyBuYW1lXCIpXG5cdCAgICBcdH1cblx0ICAgIFx0ZWxzZXtcblx0XHQgICAgXHRub3RlVGFnc0FycmF5LnB1c2godm0ubmV3VGFnTmFtZSlcblx0XHQgICAgXHRcblx0XHQgICAgXHRub3Rlc1NlcnZpY2UudXBkYXRlTm90ZVRhZ3Mobm90ZUlkLCBub3RlVGFnc0FycmF5KS50aGVuKGZ1bmN0aW9uKHJlcyl7XG5cdFx0ICAgIFx0XHQvLyBjb25zb2xlLmxvZyhyZXMuZGF0YS5uTW9kaWZpZWQpO1xuXHRcdCAgICBcdFx0aWYocmVzLmRhdGEubk1vZGlmaWVkID09IDEpe1xuXHRcdCAgICBcdFx0XHR0b2FzdHIuc3VjY2VzcyhcIkFkZGVkIFwiICsgdm0ubmV3VGFnTmFtZSArIFwiIGFzIGEgdGFnIVwiKVxuXHRcdCAgICBcdFx0XHR2bS5uZXdUYWdOYW1lID0gXCJcIjtcblx0XHQgICAgXHRcdH1cblx0XHQgICAgXHRcdGVsc2V7XG5cdFx0ICAgIFx0XHRcdHRvYXN0ci5lcnJvcihcIldob29wcyEsIFNvbWV0aGluZyB3ZW50IHdyb25nLCB0YWdzIG5vdCB1cGRhdGVkXCIpO1xuXHRcdCAgICBcdFx0fVxuXHRcdCAgICBcdH0pXG5cdCAgICBcdH1cblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gZGVsZXRlVGFnKG5vdGVJZCwgbm90ZVRhZ3NBcnJheSwgaW5kZXgpe1xuXHQgICAgXHRub3RlVGFnc0FycmF5LnNwbGljZShpbmRleCwgMSk7XG5cdCAgICBcdFxuXHQgICAgXHRub3Rlc1NlcnZpY2UudXBkYXRlTm90ZVRhZ3Mobm90ZUlkLCBub3RlVGFnc0FycmF5KS50aGVuKGZ1bmN0aW9uKHJlcyl7XG5cdCAgICBcdFx0Ly8gY29uc29sZS5sb2cocmVzLmRhdGEubk1vZGlmaWVkKTtcblx0ICAgIFx0XHRpZihyZXMuZGF0YS5uTW9kaWZpZWQgPT0gMSl7XG5cdCAgICBcdFx0XHR0b2FzdHIuc3VjY2VzcyhcIlJlbW92ZWQgVGFnIVwiKVxuXHQgICAgXHRcdH1cblx0ICAgIFx0XHRlbHNle1xuXHQgICAgXHRcdFx0dG9hc3RyLmVycm9yKFwiV2hvb3BzISwgU29tZXRoaW5nIHdlbnQgd3JvbmcsIGNhbm5vdCByZW1vdmUgdGFnXCIpO1xuXHQgICAgXHRcdH1cblx0ICAgIFx0fSlcblx0ICAgIH1cblxuXHQgICAgXG5cdCAgIFxuXHRcdGZ1bmN0aW9uIHNhdmVOb3RlKCkge1xuXG5cdFx0fVxuXG5cblx0XHRmdW5jdGlvbiB1cGRhdGVOb3RlKCkge1xuXG5cdFx0fVxuXG5cdH1cblxufSkoKTtcblxuXG4iLCIvLyBhbmd1bGFyXG4vLyAgICAgLm1vZHVsZSgnbm90ZXMnKVxuLy8gICAgIC5kaXJlY3RpdmUoJ25vdGVDYXJkJywgbm90ZUNhcmQpO1xuXG4vLyBmdW5jdGlvbiBub3RlQ2FyZCgpIHtcbi8vIFx0cmV0dXJue1xuLy8gXHRcdHJlc3RyaWN0OiAnRScsXG4vLyBcdFx0c2NvcGU6IHtcbi8vIFx0XHRcdGRhdGE6IFwiPVwiLFxuLy8gXHRcdFx0ZHJhZ2dhYmxlOiBcIj1cIlxuLy8gXHRcdH0sXG4vLyBcdFx0cmVwbGFjZTogdHJ1ZSxcbi8vIFx0XHR0ZW1wbGF0ZTogXCI8aDE+e3tkb2dzfX17e2RyYWdTdGF0dXN9fTwvaDE+XCIsXG4vLyBcdFx0bGluazogZnVuY3Rpb24oc2NvcGUsZWxlbWVudCl7XG4vLyBcdFx0XHRlbGVtZW50LmNsaWNrKGZ1bmN0aW9uKCl7XG4vLyBcdFx0XHRcdGNvbnNvbGUubG9nKGVsZW1lbnQpXG4vLyBcdFx0XHRcdGVsZW1lbnRbMF0uZHJhZ2dhYmxlID0gdHJ1ZTtcbi8vIFx0XHRcdH0pXG4vLyBcdFx0fSxcbi8vIFx0XHRjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpe1xuLy8gXHRcdFx0Ly9hbGVydChcImNvbnRyb2xsZXJcIik7XG4vLyBcdFx0XHQkc2NvcGUuZG9ncyA9ICRzY29wZS5kYXRhICsgXCJkb2dzXCI7XG4vLyBcdFx0XHRpZigkc2NvcGUuZHJhZ2dhYmxlKVxuLy8gXHRcdFx0XHQkc2NvcGUuZHJhZ1N0YXR1cyA9IGZhbHNlO1xuLy8gXHRcdFx0ZWxzZSAkc2NvcGUuZHJhZ1N0YXR1cyA9IHRydWU7XG5cblx0XHRcdFxuLy8gXHRcdH1cbi8vIFx0fVxuLy8gfVxuXG5cblxuLy8gLy8gYW5ndWxhclxuLy8gLy8gICAgIC5tb2R1bGUoJ25vdGVzJylcbi8vIC8vICAgICAuZGlyZWN0aXZlKCdub3RlQ2FyZCcsIG5vdGVDYXJkKTtcblxuLy8gLy8gZnVuY3Rpb24gbm90ZUNhcmQoKSB7XG4vLyAvLyBcdHJldHVybntcbi8vIC8vIFx0XHRyZXN0cmljdDogJ0UnLFxuLy8gLy8gXHRcdGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSl7XG4vLyAvLyBcdFx0XHRhbGVydChcImNvbnRyb2xsZXJcIik7XG4vLyAvLyBcdFx0XHRjb25zb2xlLmxvZygnZG9nJylcbi8vIC8vIFx0XHR9LFxuLy8gLy8gXHRcdHRlbXBsYXRlVXJsOiAnJyxcbi8vIC8vIFx0XHRyZXBsYWNlOiB0cnVlXG4vLyAvLyBcdFx0Ly8gc2NvcGU6IHt9XG4vLyAvLyBcdH1cbi8vIC8vIH0iLCIvLyBhbmd1bGFyXG4vLyAgICAgLm1vZHVsZSgnbm90ZXMnKVxuLy8gICAgIC5kaXJlY3RpdmUoJ25vdGVDYXJkcycsIG5vdGVDYXJkcylcblxuXG4gICAgXG5cbi8vIGZ1bmN0aW9uIG5vdGVDYXJkcygpIHtcbi8vIFx0cmV0dXJue1xuLy8gXHRcdHJlc3RyaWN0OiAnQUUnLFxuLy8gXHRcdHNjb3BlOiB7XG4vLyBcdFx0XHRub3RlczogXCI9XCIsXG4vLyBcdFx0XHRuZXdJdGVtOiBcIj1cIlxuLy8gXHRcdH0sXG4vLyBcdFx0cmVwbGFjZTogZmFsc2UsXG4vLyBcdFx0dHJhbnNjbHVkZTogZmFsc2UsXG4vLyBcdFx0dGVtcGxhdGVVcmw6IFwiY29tcG9uZW50cy9ub3Rlcy92aWV3cy9ub3RlLmRpcmVjdGl2ZS52aWV3Lmh0bWxcIixcbi8vIFx0XHRsaW5rOiBmdW5jdGlvbihzY29wZSxlbGVtZW50LGF0dHJzKXtcbi8vIFx0XHRcdC8vJCggXCIjc29ydGFibGVcIiApLnNvcnRhYmxlKCk7XG4vLyBcdFx0XHQvL2NvbnNvbGUubG9nKHNjb3BlKVxuLy8gXHRcdFx0Ly9jb25zb2xlLmxvZyhlbGVtZW50KVxuLy8gXHRcdFx0Ly9jb25zb2xlLmxvZyhhdHRycylcbi8vIFx0XHRcdC8vZWxlbWVudC5zb3J0YWJsZSgpO1xuLy8gXHRcdFx0Ly9jb25zb2xlLmxvZyhzY29wZS5ub3Rlcylcbi8vIFx0XHRcdHNjb3BlLmRvZ3MgPSBmdW5jdGlvbihub3RlKXtcbi8vIFx0XHRcdFx0Y29uc29sZS5sb2cobm90ZSlcbi8vIFx0XHRcdH1cblxuXG4vLyBcdFx0XHRlbGVtZW50LnNvcnRhYmxlKHtcbi8vIFx0XHQgICAgICAgLy8gcGxhY2Vob2xkZXI6IFwidWktc3RhdGUtaGlnaGxpZ2h0XCIsXG4vLyBcdFx0ICAgICAgICBzdGFydDogZnVuY3Rpb24oZXZlbnQsIHVpKSB7XG4vLyBcdFx0ICAgICAgICAgICAgdmFyIHN0YXJ0X3BvcyA9IHVpLml0ZW0uaW5kZXgoKTtcbi8vIFx0XHQgICAgICAgICAgICB1aS5pdGVtLmRhdGEoJ3N0YXJ0X3BvcycsIHN0YXJ0X3Bvcyk7XG4vLyBcdFx0ICAgICAgICB9LFxuLy8gXHRcdCAgICAgICAgdXBkYXRlOiBmdW5jdGlvbihldmVudCwgdWkpIHtcbi8vIFx0XHQgICAgICAgICAgICB2YXIgc3RhcnRfcG9zID0gdWkuaXRlbS5kYXRhKCdzdGFydF9wb3MnKTtcbi8vIFx0XHQgICAgICAgICAgICB2YXIgZW5kX3BvcyA9IHVpLml0ZW0uaW5kZXgoKTtcbi8vIFx0XHQgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHN0YXJ0X3BvcyArICcgLSAnICsgZW5kX3Bvcyk7XG5cdFx0ICAgICAgICAgIFxuLy8gXHRcdCAgICAgICAgICB2YXIgc3RhcnRJdGVtID0gc2NvcGUubm90ZXNbc3RhcnRfcG9zXTtcbi8vIFx0XHQgICAgICAgICAgIHNjb3BlLm5vdGVzLnNwbGljZShzdGFydF9wb3MsMSlcbi8vIFx0XHQgICAgICAgICAgIHNjb3BlLm5vdGVzLnNwbGljZShlbmRfcG9zLDAsIHN0YXJ0SXRlbSlcbi8vIFx0XHQgICAgICAgICAgIHNjb3BlLiRhcHBseSgpO1xuXG4vLyBcdFx0ICAgICAgICAgICAvL2NvbnNvbGUubG9nKHNjb3BlLm5vdGVzKVxuXHRcdCAgICAgICAgICAgXG5cdFx0ICAgICAgICAgICBcbi8vIFx0XHQgICAgICAgIH1cbi8vIFx0XHQgICAgfSk7IC8vIGVuZCBzb3J0YWJsZVxuXG5cdFx0ICAgXG5cbi8vIFx0XHQgICAgY29uc29sZS5sb2coZWxlbWVudClcblxuXG4vLyBcdFx0fSxcbi8vIFx0XHRjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpe1xuLy8gXHRcdFx0JHNjb3BlLmZvcm0gPXt9XG4vLyBcdFx0XHQkc2NvcGUuYWRkSXRlbSA9IGZ1bmN0aW9uKGluZGV4LGl0ZW0pe1xuLy8gXHRcdFx0XHQvL2FsZXJ0KGluZGV4KVxuLy8gXHRcdFx0XHRjb25zb2xlLmxvZygkc2NvcGUubmV3SXRlbSlcbi8vIFx0XHRcdFx0JHNjb3BlLm5vdGVzW2luZGV4XS5pdGVtcy5wdXNoKGl0ZW0pXG4vLyBcdFx0XHRcdCRzY29wZS5mb3JtID0ge31cbi8vIFx0XHRcdFx0Ly9jb25zb2xlLmxvZygkc2NvcGUubm90ZXNbaW5kZXhdLml0ZW1zKVxuLy8gXHRcdFx0fVxuXG4vLyBcdFx0XHQkc2NvcGUuZGVsZXRlTm90ZSA9IGZ1bmN0aW9uKGluZGV4KXtcbi8vIFx0XHRcdFx0JHNjb3BlLm5vdGVzLnNwbGljZShpbmRleCwxKTtcbi8vIFx0XHRcdH1cblxuXG4vLyBcdFx0XHQvL2FsZXJ0KFwiY29udHJvbGxlclwiKTtcbi8vIFx0XHRcdC8vICRzY29wZS5kb2dzID0gJHNjb3BlLmRhdGEgKyBcImRvZ3NcIjtcbi8vIFx0XHRcdC8vIGlmKCRzY29wZS5kcmFnZ2FibGUpXG4vLyBcdFx0XHQvLyBcdCRzY29wZS5kcmFnU3RhdHVzID0gZmFsc2U7XG4vLyBcdFx0XHQvLyBlbHNlICRzY29wZS5kcmFnU3RhdHVzID0gdHJ1ZTtcblxuXHRcdFx0XG4vLyBcdFx0fVxuLy8gXHR9XG4vLyB9IC8vZW5kIG5vdGVjYXJkcyBkaXJlY3RpdmVcblxuLy8gYW5ndWxhclxuLy8gXHQubW9kdWxlKCdub3RlcycpXG4vLyBcdC5kaXJlY3RpdmUoJ25vdGVDYXJkJywgbm90ZUNhcmQpXG5cbi8vIGZ1bmN0aW9uIG5vdGVDYXJkKCkge1xuXG4vLyBcdHZhciB0ZW1wRGF0YSA9IHt9O1xuLy8gXHR2YXIgdGVtcE5vdGUgPSBudWxsO1xuXG4vLyBcdHJldHVybntcbi8vIFx0XHRyZXN0cmljdDogJ0FFJyxcbi8vIFx0XHRzY29wZToge1xuLy8gXHRcdFx0bm90ZTogXCI9XCIsXG4vLyBcdFx0XHRub3RlczogXCI9XCJcbi8vIFx0XHR9LFxuLy8gXHRcdHJlcGxhY2U6IHRydWUsXG4vLyBcdFx0dHJhbnNjbHVkZTogZmFsc2UsXG4vLyBcdFx0dGVtcGxhdGVVcmw6IFwiY29tcG9uZW50cy9ub3Rlcy92aWV3cy9ub3Rlcy5pdGVtcy52aWV3Lmh0bWxcIixcbi8vIFx0XHRsaW5rOiBmdW5jdGlvbihzY29wZSxlbGVtZW50LGF0dHJzKXtcbi8vIFx0XHRcdC8vJCggXCIjc29ydGFibGVcIiApLnNvcnRhYmxlKCk7XG4vLyBcdFx0XHQvL2NvbnNvbGUubG9nKHNjb3BlKVxuLy8gXHRcdFx0Ly9jb25zb2xlLmxvZyhlbGVtZW50KVxuLy8gXHRcdFx0Ly9jb25zb2xlLmxvZyhhdHRycylcbi8vIFx0XHRcdC8vZWxlbWVudC5zb3J0YWJsZSgpO1xuLy8gXHRcdFx0Ly9jb25zb2xlLmxvZyhzY29wZS5ub3Rlcylcbi8vIFx0XHRcdC8vc2NvcGUuJHdhdGNoKCdub3RlcycsIGZ1bmN0aW9uKCkge1xuXG4vLyAgICAgICAgIC8vIGFsbCB0aGUgY29kZSBoZXJlLi4uXG4gICAgXHRcdFxuICAgIFx0XHRcblx0XHRcdFxuXG4vLyBcdFx0XHRlbGVtZW50LnNvcnRhYmxlKHtcbi8vIFx0XHRcdFx0Y29ubmVjdFdpdGg6IFwiLmNvbm5lY3RlZFNvcnRhYmxlXCIsXG4vLyBcdFx0ICAgICAgIC8vcGxhY2Vob2xkZXI6IFwidWktc3RhdGUtaGlnaGxpZ2h0XCIsXG4vLyBcdFx0ICAgICAgICBzdGFydDogZnVuY3Rpb24oZXZlbnQsIHVpKSB7XG4vLyBcdFx0ICAgICAgICBcdGNvbnNvbGUubG9nKFwiU1RBUlQgU1RBUlQgU1RBUlQgU1RBUlQgU1RBUlRcIilcbi8vIFx0XHQgICAgICAgIFx0Y29uc29sZS5sb2coZWxlbWVudClcbi8vIFx0XHQgICAgICAgIFx0Y29uc29sZS5sb2codGVtcERhdGEpXG5cdFx0ICAgICAgICBcdFxuXG4vLyBcdFx0ICAgICAgICBcdHRlbXBEYXRhLnN0YXJ0Tm90ZSA9IGFuZ3VsYXIuY29weShzY29wZS5ub3RlKTtcbi8vIFx0XHQgICAgICAgIFx0dGVtcERhdGEuc3RhcnROb3RlSW5kZXggPSBhdHRycy5ub3RlaW5kZXg7XG4vLyBcdFx0XHRcdFx0dGVtcERhdGEuc3RhcnROb3RlSXRlbUluZGV4ID0gdWkuaXRlbS5pbmRleCgpO1xuLy8gXHRcdFx0XHRcdHRlbXBEYXRhLnN0YXJ0Tm90ZUl0ZW1Db250ZW50ID0gdGVtcERhdGEuc3RhcnROb3RlLml0ZW1zW3RlbXBEYXRhLnN0YXJ0Tm90ZUl0ZW1JbmRleF07XG5cdFx0ICAgXHRcdFx0XG4vLyBcdFx0ICAgXHRcdFx0dGVtcE5vdGUgPSBhbmd1bGFyLmNvcHkoc2NvcGUubm90ZSlcbi8vIFx0XHQgICBcdFx0XHRjb25zb2xlLmxvZyh0ZW1wTm90ZSlcblxuLy8gXHRcdCAgICAgICAgfSxcbi8vIFx0XHQgICAgICAgIHVwZGF0ZTogZnVuY3Rpb24oZXZlbnQsIHVpKSB7XG5cbi8vIFx0XHQgICAgICAgLy8gY29uc29sZS5sb2coc2NvcGUudGVtcERhdGEpXHRcbi8vIFx0ICAgICAgICAgXHRpZiAoIXVpLnNlbmRlcikge1x0XHQgICAgICAgXG4vLyBcdFx0XHQgICAgICAgICBjb25zb2xlLmxvZyhcIlVQREFURSBVUERBVEUgVVBEQVRFIFVQREFURSBVUERBVEUgSU5TSURFIElGXCIgKVxuXG5cdFx0XHQgICAgICAgIFxuXHRcdFx0XHRcdFx0XHRcdCAgICAgICAgIFxuXG4vLyBcdFx0XHRcdFx0dmFyIHN0YXJ0X3BvcyA9IHRlbXBEYXRhLnN0YXJ0Tm90ZUl0ZW1JbmRleDtcbi8vIFx0XHRcdFx0XHR2YXIgZW5kX3BvcyA9IHVpLml0ZW0uaW5kZXgoKTtcbi8vIFx0XHRcdFx0XHRjb25zb2xlLmxvZyhzdGFydF9wb3MgKyAnIC0gJyArIGVuZF9wb3MpO1xuXG4vLyBcdFx0XHRcdFx0dGVtcE5vdGUuaXRlbXMuc3BsaWNlKHN0YXJ0X3BvcywxKVxuLy8gXHRcdFx0XHRcdHRlbXBOb3RlLml0ZW1zLnNwbGljZShlbmRfcG9zLDAsIHRlbXBEYXRhLnN0YXJ0Tm90ZUl0ZW1Db250ZW50KVxuLy8gXHRcdFx0XHRcdC8vc2NvcGUubm90ZSA9IHRlbXBOb3RlXG4vLyBcdFx0XHRcdFx0c2NvcGUubm90ZXNbdGVtcERhdGEuc3RhcnROb3RlSW5kZXhdID0gdGVtcE5vdGU7XG5cdFx0XHRcdFx0XG4vLyBcdFx0XHRcdFx0Y29uc29sZS5sb2coc2NvcGUubm90ZXMpXG5cbi8vIFx0XHRcdFx0XHR2YXIgcmFzdCA9IHtcbi8vICAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMmFkc0Buaml0LmVkdVwiLFxuLy8gICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJzMVwiLFxuLy8gICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImxhdW5zZHJ5XCIsIFwiYXBzcGx5IGpvYnNcIiwgXCJnc3ltXCIgXSxcbi8vICAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIxLzEvMjIwMTZcIixcbi8vICAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjEvMjIvMjAxNlwiLFxuLy8gICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvenNlLmFrQGdtYWlsLmNvbVwiXG4vLyAgICAgICAgICAgICAgICAgfVxuXG4vLyBcdFx0XHRcdFx0Ly9zY29wZS5ub3Rlc1swXS5pdGVtcy5wdXNoKFwiUFVDS1NcIilcblxuLy8gXHRcdFx0XHRcdHNjb3BlLiRhcHBseSgpO1xuXG4vLyBcdFx0ICAgLy8gICAgICAgICAvL2NvbnNvbGUubG9nKHNjb3BlLm5vdGVzKVxuLy8gXHRcdFx0ICAgIH0gICBcblx0XHQgICAgICAgICAgIFxuLy8gXHRcdCAgICAgICAgfSwgLy9lbmQgdXBkYXRlXG4vLyBcdFx0ICAgICAgICByZWNlaXZlOiBmdW5jdGlvbihldmVudCwgdWkpe1xuLy8gXHRcdCAgICAgICAgXHRjb25zb2xlLmxvZyhcIlJFQ0VJVkUgUkVDRUlWRSBSRUNFSVZFIFJFQ0VJVkUgUkVDRUlWRVwiKVxuLy8gXHRcdCAgICAgICAgXHRjb25zb2xlLmxvZyh0ZW1wRGF0YSlcblxuLy8gXHRcdCAgICAgICAgXHR0ZW1wRGF0YS5lbmROb3RlID0gYW5ndWxhci5jb3B5KHNjb3BlLm5vdGUpO1xuLy8gXHRcdCAgICAgICAgXHR0ZW1wRGF0YS5lbmROb3RlSW5kZXggPSBhdHRycy5ub3RlaW5kZXg7XG4vLyBcdFx0XHRcdFx0dGVtcERhdGEuZW5kTm90ZUl0ZW1JbmRleCA9IHVpLml0ZW0uaW5kZXgoKTtcblxuXHRcdFx0XHRcdFxuXG4vLyBcdFx0XHRcdFx0ICAvL2NvbnNvbGUubG9nKFwicmVtb3ZpbmcgaXRlbTogXCIgKyBzY29wZS5ub3Rlc1tub3RlT3JpZ2luSW5kZXhdLml0ZW1zW3N0YXJ0X3Bvc10pO1xuLy8gXHRcdCAgICAgICAgICAgdGVtcERhdGEuc3RhcnROb3RlLml0ZW1zLnNwbGljZSh0ZW1wRGF0YS5zdGFydE5vdGVJdGVtSW5kZXgsMSlcbi8vIFx0XHRcdCAgICAgICB0ZW1wRGF0YS5lbmROb3RlLml0ZW1zLnNwbGljZSh0ZW1wRGF0YS5lbmROb3RlSXRlbUluZGV4LDAsdGVtcERhdGEuc3RhcnROb3RlSXRlbUNvbnRlbnQpXG4vLyBcdFx0XHQgICAgICAgY29uc29sZS5sb2codGVtcERhdGEpXG5cbi8vIFx0XHRcdCAgICAgICBzY29wZS5ub3Rlc1t0ZW1wRGF0YS5zdGFydE5vdGVJbmRleF0gPSB0ZW1wRGF0YS5zdGFydE5vdGU7XG4vLyBcdFx0XHQgICAgICAgc2NvcGUubm90ZXNbdGVtcERhdGEuZW5kTm90ZUluZGV4XSA9IHRlbXBEYXRhLmVuZE5vdGU7XG5cdCAgICAgICAgICAgXHRcbi8vIFx0ICAgICAgICAgICBcdFx0Y29uc29sZS5sb2codGVtcERhdGEuc3RhcnROb3RlLml0ZW1zKVxuLy8gXHQgICAgICAgICAgIFx0XHRjb25zb2xlLmxvZyh0ZW1wRGF0YS5lbmROb3RlLml0ZW1zKVxuXG4vLyBcdFx0ICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiYWRkaW5nIGFmdGVyIHBvc2l0aW9uOiBcIiArIGVuZF9wb3MpXG4vLyBcdFx0ICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiYWRkaW5nIGFmdGVyOiBcIiArIHNjb3BlLm5vdGVzW25vdGVEZXN0aW5hdGlvbkluZGV4XS5pdGVtc1tlbmRfcG9zXSlcbi8vIFx0XHQgICAgICAgICAgIC8vc2NvcGUubm90ZXNbbm90ZURlc3RpbmF0aW9uSW5kZXhdLml0ZW1zLnNwbGljZShlbmRfcG9zLDAsIHN0YXJ0SXRlbSlcblxuLy8gXHRcdCAgICAgICAgXHQvL3Njb3BlLnRlbXBEYXRhID0gXCJwcmF3bnNcIjtcblx0XHQgICAgICAgIFx0XG5cdFx0ICAgICAgICBcdFxuLy8gXHRcdCAgICAgICAgXHQvLyBjb25zb2xlLmxvZyh0ZW1wRGF0YSlcbi8vIFx0XHQgICAgICAgIFx0Ly8gLy9jb25zb2xlLmxvZyhzY29wZS5ub3RlKTtcbi8vIFx0XHQgICAgICAgIFx0dmFyIHJhc3QgPSB7XG4vLyAgICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJhZHNAbmppdC5lZHVcIixcbi8vICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiczFcIixcbi8vICAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJsYXVuc2RyeVwiLCBcImFwc3BseSBqb2JzXCIsIFwiZ3N5bVwiIF0sXG4vLyAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMS8xLzIyMDE2XCIsXG4vLyAgICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIxLzIyLzIwMTZcIixcbi8vICAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3pzZS5ha0BnbWFpbC5jb21cIlxuLy8gICAgICAgICAgICAgICAgIH1cblx0XHQgICAgICAgIFx0XG4vLyBcdFx0ICAgICAgICAgICBzY29wZS4kYXBwbHkoKTtcblx0XHRcblxuLy8gXHRcdCAgICAgICAgfVxuXG4vLyBcdFx0ICAgIH0pOyAvLyBlbmQgc29ydGFibGVcblxuLy8gXHRcdCAvLyAgfSk7IC8vZW5kIHdhdGNoXG5cblxuXG4vLyBcdFx0fSxcbi8vIFx0XHRjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpe1xuXG4vLyBcdFx0XHQkc2NvcGUubW9vc2UgPSBcImRpbmdcIlxuLy8gXHRcdFx0JHNjb3BlLmRlbGV0ZUl0ZW0gPSBmdW5jdGlvbihwYXJlbnRJbmRleCwgaW5kZXgpe1xuLy8gXHRcdFx0XHRjb25zb2xlLmxvZyhwYXJlbnRJbmRleClcbi8vIFx0XHRcdFx0Y29uc29sZS5sb2coaW5kZXgpXG4vLyBcdFx0XHRcdCRzY29wZS5ub3Rlc1twYXJlbnRJbmRleF0uaXRlbXMuc3BsaWNlKGluZGV4LDEpXG5cbi8vIFx0XHRcdH1cblxuLy8gXHRcdFx0JHNjb3BlLnJhbmRvbUlkID0gZnVuY3Rpb24oaXRlbSl7XG4vLyAgICBcdFx0XHQgcmV0dXJuIFwiSURcIiArIGl0ZW0gKyAoTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIDk5OSkgKyAxKSk7XG4vLyBcdFx0XHR9XG4vLyBcdFx0XHQvL2FsZXJ0KFwiY29udHJvbGxlclwiKTtcbi8vIFx0XHRcdC8vICRzY29wZS5kb2dzID0gJHNjb3BlLmRhdGEgKyBcImRvZ3NcIjtcbi8vIFx0XHRcdC8vIGlmKCRzY29wZS5kcmFnZ2FibGUpXG4vLyBcdFx0XHQvLyBcdCRzY29wZS5kcmFnU3RhdHVzID0gZmFsc2U7XG4vLyBcdFx0XHQvLyBlbHNlICRzY29wZS5kcmFnU3RhdHVzID0gdHJ1ZTtcblxuLy8gXHRcdFx0Y29uc29sZS5sb2coJHNjb3BlKVxuXG5cdFx0XHRcbi8vIFx0XHR9XG4vLyBcdH1cbi8vIH0gLy9lbmQgbm90ZWNhcmQgZGlyZWN0aXZlXG5cblxuXG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cdCd1c2Ugc3RyaWN0J1xuXG5cdGFuZ3VsYXJcbiAgICBcdC5tb2R1bGUoJ25vdGVzJylcbiAgICBcdC5mYWN0b3J5KCdub3Rlc1NlcnZpY2UnLCBub3Rlc1NlcnZpY2UpO1xuXG4gICAgbm90ZXNTZXJ2aWNlLiRpbmplY3QgPSBbJyRodHRwJywnJHdpbmRvdycsJ2F1dGhTZXJ2aWNlJ11cblxuICAgIGZ1bmN0aW9uIG5vdGVzU2VydmljZSgkaHR0cCwgJHdpbmRvdywgYXV0aFNlcnZpY2UpIHtcblxuICAgICAgICBcbiAgICBcdHZhciBzZXJ2aWNlID0geyBcbiAgICAgICAgICAgIGdldE5vdGVzTGlzdDogZ2V0Tm90ZXNMaXN0LFxuICAgICAgICAgICAgZ2V0U2luZ2xlTm90ZTogZ2V0U2luZ2xlTm90ZSxcbiAgICAgICAgICAgIHNhdmVBbGxOb3Rlczogc2F2ZUFsbE5vdGVzLFxuICAgICAgICAgICAgYWRkTmV3Tm90ZTogYWRkTmV3Tm90ZSxcbiAgICAgICAgICAgIHVwZGF0ZU5vdGVDb250ZW50OiB1cGRhdGVOb3RlQ29udGVudCxcbiAgICAgICAgICAgIHVwZGF0ZU5vdGVUaXRsZTogdXBkYXRlTm90ZVRpdGxlLFxuICAgICAgICAgICAgdXBkYXRlTm90ZVRhZ3M6IHVwZGF0ZU5vdGVUYWdzLFxuICAgICAgICAgICAgZGVsZXRlTm90ZTogZGVsZXRlTm90ZSxcbiAgICAgICAgICAgIC8vIHVwZGF0ZU5vdGVUaXRsZTogdXBkYXRlTm90ZVRpdGxlLFxuICAgICAgICAgICAgLy8gdXBkYXRlTm90ZUNvbnRlbnQ6IHVwZGF0ZU5vdGVcbiAgICBcdH07XG5cbiAgICBcdHJldHVybiBzZXJ2aWNlO1xuXG4gICAgXHQvLy8vLy8vLy8vLy9cblxuICAgICAgICBcbiAgICAgICAgICAgIFxuICAgICAgICBcbiAgICAgIFxuICAgICAgICAvLyBnZXRzIG5vdGVzIGxpc3QsIGV4Y2x1ZGVzIHRoZSBhY3R1YWwgbm90ZSBjb250ZW50XG4gICAgICAgIGZ1bmN0aW9uIGdldE5vdGVzTGlzdCAoKSB7XG4gICAgICAgICAgICB2YXIgdG9rZW4gPSBhdXRoU2VydmljZS5nZXRUb2tlbigpO1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGkvbm90ZXMvZ2V0QWxsTm90ZXNNZXRhJyx7dG9rZW46IHRva2VufSk7XG4gICAgICAgIH0gLy9lbmQgZ2V0Tm90ZSgpXG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0U2luZ2xlTm90ZShub3RlSWQpIHtcbiAgICAgICAgICAgIHZhciB0b2tlbiA9IGF1dGhTZXJ2aWNlLmdldFRva2VuKCk7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnaHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaS9ub3Rlcy9nZXRTaW5nbGVOb3RlJyx7dG9rZW46IHRva2VuLCBub3RlSWQ6IG5vdGVJZH0pO1xuXG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBhZGROZXdOb3RlICgpIHtcbiAgICAgICAgICAgIHZhciB0b2tlbiA9IGF1dGhTZXJ2aWNlLmdldFRva2VuKCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCdodHRwOi8vbG9jYWxob3N0OjMwMDAvYXBpL25vdGVzL2FkZE5vdGUnLHt0b2tlbjogdG9rZW59KVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlTm90ZUNvbnRlbnQobm90ZUlkLCBub3RlQ29udGVudCkge1xuICAgICAgICAgICAgdmFyIHRva2VuID0gYXV0aFNlcnZpY2UuZ2V0VG9rZW4oKTtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCdodHRwOi8vbG9jYWxob3N0OjMwMDAvYXBpL25vdGVzL3VwZGF0ZU5vdGVDb250ZW50Jyx7dG9rZW46IHRva2VuLCBub3RlSWQ6IG5vdGVJZCwgbm90ZUNvbnRlbnQ6bm90ZUNvbnRlbnR9KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlTm90ZVRpdGxlKG5vdGVJZCwgbm90ZVRpdGxlKSB7XG4gICAgICAgICAgICB2YXIgdG9rZW4gPSBhdXRoU2VydmljZS5nZXRUb2tlbigpO1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGkvbm90ZXMvdXBkYXRlTm90ZVRpdGxlJyx7dG9rZW46IHRva2VuLCBub3RlSWQ6IG5vdGVJZCwgbm90ZVRpdGxlOm5vdGVUaXRsZX0pO1xuICAgICAgICB9XG5cblxuXG4gICAgICAgIGZ1bmN0aW9uIGRlbGV0ZU5vdGUobm90ZUlkKSB7XG4gICAgICAgICAgICB2YXIgdG9rZW4gPSBhdXRoU2VydmljZS5nZXRUb2tlbigpO1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGkvbm90ZXMvZGVsZXRlTm90ZScse3Rva2VuOiB0b2tlbiwgbm90ZUlkOiBub3RlSWR9KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2F2ZUFsbE5vdGVzKG5vdGVzKSB7XG4gICAgICAgICAgICB2YXIgdG9rZW4gPSBhdXRoU2VydmljZS5nZXRUb2tlbigpO1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGkvbm90ZXMvdXBkYXRlTm90ZXMnLHtlbWFpbDpcIm1vaXpAZ21haWwuY29tXCIsbm90ZXM6IG5vdGVzfSlcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZU5vdGVUYWdzKG5vdGVJZCwgbm90ZVRhZ3NBcnJheSkge1xuICAgICAgICAgICAgdmFyIHRva2VuID0gYXV0aFNlcnZpY2UuZ2V0VG9rZW4oKTtcbiAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGkvbm90ZXMvdXBkYXRlTm90ZVRhZ3MnLHt0b2tlbjogdG9rZW4sIG5vdGVJZDogbm90ZUlkLCB0YWdzOiBub3RlVGFnc0FycmF5IH0pXG4gICAgICAgIH1cblxuXG5cbiAgICB9XG5cblx0XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0J1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCdub3RpZnknKVxuXHRcdC5jb250cm9sbGVyKCdub3RpZnlDdHJsJywgbm90aWZ5Q3RybClcblxuXHQvLyBub3RpZnlDdHJsLiRpbmplY3QgPSBbXVxuXG5cdGZ1bmN0aW9uIG5vdGlmeUN0cmwoKSB7XG5cblx0ICAgIHZhciB2bSA9IHRoaXM7XG5cblx0ICAgIHZtLmdvdG9TZXNzaW9uID0gZ290b1Nlc3Npb247XG5cdCAgICB2bS5yZWZyZXNoID0gcmVmcmVzaDtcblx0ICAgIHZtLnNlYXJjaCA9IHNlYXJjaDtcblx0ICAgIHZtLnNlc3Npb25zID0gW107XG5cdCAgICB2bS50aXRsZSA9ICdub3RpZnknO1xuXG5cdCAgICAvLy8vLy8vLy8vLy9cblxuXHQgICAgXG5cblx0ICAgIGZ1bmN0aW9uIGdvdG9TZXNzaW9uKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiByZWZyZXNoKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBzZWFyY2goKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cdH1cblxufSkoKTtcblxuXG4iLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgnbm90aWZ5JylcbiAgICAuZGlyZWN0aXZlKCdub3RpZnknLCBub3RpZnkpXG5cbiAgICBub3RpZnkuJGluamVjdCA9IFsnbm90aWZ5U2VydmljZScsJyRyb290U2NvcGUnLCckdGltZW91dCddXG4gICAgXG5cbmZ1bmN0aW9uIG5vdGlmeSgpIHtcblx0cmV0dXJue1xuXHRcdHJlc3RyaWN0OiAnQUUnLFxuXHRcdHRlbXBsYXRlOiAnPGxpIG5nLXJlcGVhdD1cIml0ZW0gaW4gbm90aWZ5TGlzdFwiPnt7aXRlbX19PC9saT4nLFxuXHRcdGxpbms6IGZ1bmN0aW9uKHNjb3BlLGVsZW1lbnQsYXR0cnMpe1xuXG5cdFx0dmFyIGxpID0gYW5ndWxhci5lbGVtZW50KGVsZW1lbnQuY2hpbGRyZW4oKVswXSlcblx0XHRjb25zb2xlLmxvZyhsaSlcblx0XHRcblx0XHRhbmltYXRlRG93biA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0Y29uc29sZS5sb2coJ2FuaW1hdGluZycpXG4gICAgICAgICAgICAkKHRoaXMpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgIHRvcDogJys9OTknXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICBhbmltYXRlUmlnaHQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgXHRjb25zb2xlLmxvZygnYW5pbWF0aW5nJylcbiAgICAgICAgICAgICQodGhpcykuYW5pbWF0ZSh7XG4gICAgICAgICAgICBcdFxuICAgICAgICAgICAgICAgIGxlZnQ6ICcrPTUwJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgJChsaSkub24oJ2NsaWNrJywgYW5pbWF0ZVJpZ2h0KTtcbiAgICAgICAvLyAkKGxpKS5vbignY2xpY2snLCBhbmltYXRlUmlnaHQpOyAgXG5cdFx0ICAgICBcdFx0XG5cdFx0XHRcblx0XHRcdCAgICBcblxuXG5cblx0XHR9LFxuXHRcdGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSxub3RpZnlTZXJ2aWNlLCRyb290U2NvcGUsJHRpbWVvdXQpe1xuXHRcdFx0Y29uc29sZS5sb2coJ25vdGlmeSBkaXJlY3RpdmUnKVxuXHRcdFx0XG5cdFx0XHQkc2NvcGUubm90aWZ5TGlzdCA9IFtcImRvZ3NcIixcImNhdHNcIl07XHRcdFx0XG5cblx0XHRcdCAkcm9vdFNjb3BlLiRvbigncHVzaGVkJyxmdW5jdGlvbihldmVudCxtZXNzYWdlKXtcblx0XHRcdCBcdGNvbnNvbGUubG9nKFwiZGlyZWN0aXZlOiByZWNlaXZpbmdcIik7XG5cdFx0XHQgXHQkc2NvcGUubm90aWZ5TGlzdC5wdXNoKG1lc3NhZ2UuZGF0YSk7XG5cdFx0XHQgXHRcdFx0XHQgXHQkc2NvcGUuJGFwcGx5KCk7XG5cdFx0XHQgXHQvLyAkdGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0IFx0Ly8gXHQkc2NvcGUuZGF0YSA9IG51bGw7XG5cdFx0XHQgXHQvLyB9LDMwMDApXG5cblx0XHRcdCB9KVxuXHRcdFx0XG5cdFx0fVxuXHR9XG59IC8vZW5kIG5vdGlmeSBkaXJlY3RpdmVcbiIsIihmdW5jdGlvbigpe1xuICAgICd1c2Ugc3RyaWN0J1xuXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdub3RpZnknKVxuICAgICAgICAuZmFjdG9yeSgnbm90aWZ5U2VydmljZScsIG5vdGlmeVNlcnZpY2UpO1xuXG4gICAgbm90aWZ5U2VydmljZS4kaW5qZWN0ID0gWyckcm9vdFNjb3BlJ11cblxuICAgIGZ1bmN0aW9uIG5vdGlmeVNlcnZpY2UoJHJvb3RTY29wZSkge1xuICAgICAgICB2YXIgc2VydmljZSA9IHtcblxuICAgICAgICAgICAgcHVzaDogcHVzaCxcblxuXG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIHNlcnZpY2U7XG5cbiAgICAgICAgLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgZnVuY3Rpb24gcHVzaChtZXNzYWdlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInB1c2hpbmcgZnJvbSBzZXJ2aWNlXCIpO1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kZW1pdChcInB1c2hlZFwiLCBtZXNzYWdlKTtcblxuICAgICAgICB9XG5cblxuXG4gICAgfVxuXG4gICAgXG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0J1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCdyZWdpc3RlcicpXG5cdFx0LmNvbnRyb2xsZXIoJ3JlZ2lzdGVyQ3RybCcsIHJlZ2lzdGVyQ3RybClcblxuXHRyZWdpc3RlckN0cmwuaW5qZWN0ID0gWyd0b2FzdHInLCckaHR0cCcsJ3JlZ2lzdGVyU2VydmljZSddXG5cblx0ZnVuY3Rpb24gcmVnaXN0ZXJDdHJsKHRvYXN0ciwkaHR0cCxyZWdpc3RlclNlcnZpY2UpIHtcblxuXHQgICAgdmFyIHZtID0gdGhpcztcblxuXHQgICAgdm0uZm9ybSA9IHt9XG5cdCAgICB2bS5zdWJtaXRTdGF0dXMgPSBcIlwiO1xuXHQgICAgdm0uc3VibWl0Rm9ybSA9IHN1Ym1pdEZvcm07XG5cdCAgICBcblx0ICAgIC8vZGlzcGxheSBpbmZvIG9uIGxvYWRcblx0ICAgIGluZm8oKTtcblxuXHQgICAgLy8vLy8vLy8vLy8vXG5cblx0ICAgIGZ1bmN0aW9uIHN1Ym1pdEZvcm0oaXNWYWxpZCkge1xuXHQgICAgXHRcblx0ICAgIFx0Y29uc29sZS5sb2codm0uZm9ybSk7XG5cdCAgICBcdFxuXHQgICAgXHQvLyBjaGVjayB0byBtYWtlIHN1cmUgdGhlIGZvcm0gaXMgY29tcGxldGVseSB2YWxpZFxuXHRcdCAgICBpZiAoaXNWYWxpZCkge1xuXHRcdCAgICAgIGNvbnNvbGUubG9nKFwiVmFsaWQgRm9ybVwiKTtcblx0XHQgICAgICBzZW5kRm9ybSh2bS5mb3JtKTtcblx0XHQgICAgfVxuXHQgICAgfVxuXG5cdCAgICAvL3NlbmRzIGZvcm0gdG8gYXBpXG5cdCAgICBmdW5jdGlvbiBzZW5kRm9ybShmb3JtKSB7XG5cdFx0XHRyZWdpc3RlclNlcnZpY2UubmV3VXNlcih2bSxmb3JtKVxuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBpbmZvKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgICBjb25zb2xlLmxvZyhcInJlZ2lzdGVyIGNvbnRyb2xsZXJcIilcblx0ICAgIH1cblxuXHR9XG5cbn0pKCk7XG5cblxuIiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ3JlZ2lzdGVyJylcbiAgICAuZGlyZWN0aXZlKCdyZWdpc3RlckRpcicsIHJlZ2lzdGVyRGlyKTtcblxuZnVuY3Rpb24gcmVnaXN0ZXJEaXIoKSB7XG5cdHJldHVybntcblx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdHRlbXBsYXRlVXJsOiAnJyxcblx0XHRyZXBsYWNlOiB0cnVlXG5cdFx0Ly8gc2NvcGU6IHt9XG5cdH1cbn0iLCIoZnVuY3Rpb24oKXtcblx0J3VzZSBzdHJpY3QnXG5cblx0YW5ndWxhclxuICAgIFx0Lm1vZHVsZSgncmVnaXN0ZXInKVxuICAgIFx0LmZhY3RvcnkoJ3JlZ2lzdGVyU2VydmljZScsIHJlZ2lzdGVyU2VydmljZSk7XG5cbiAgICByZWdpc3RlclNlcnZpY2UuaW5qZWN0ID0gWyckaHR0cCcsJ3RvYXN0cicsJ2F1dGhTZXJ2aWNlJywnJHN0YXRlJywnJHJvb3RTY29wZSddXG5cbiAgICBmdW5jdGlvbiByZWdpc3RlclNlcnZpY2UoJGh0dHAsdG9hc3RyLGF1dGhTZXJ2aWNlLCRzdGF0ZSwkcm9vdFNjb3BlKSB7XG4gICAgXHR2YXIgc2VydmljZSA9IHtcblxuICAgICAgICAgICAgbmV3VXNlcjogbmV3VXNlcixcbiAgICBcdFx0ZXJyb3I6IGVycm9yLFxuICAgIFx0XHRpbmZvOiBpbmZvLFxuICAgIFx0XHRzdWNjZXNzOiBzdWNjZXNzXG5cbiAgICBcdH07XG5cbiAgICBcdHJldHVybiBzZXJ2aWNlO1xuXG4gICAgXHQvLy8vLy8vLy8vLy9cblxuICAgICAgICBmdW5jdGlvbiBuZXdVc2VyKHZtLCBmb3JtKSB7XG4gICAgICAgICAgICAkaHR0cC5wb3N0KCdodHRwOi8vbG9jYWxob3N0OjMwMDAvYXBpL3VzZXJzL25ld1VzZXInLCBmb3JtKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgICBhdXRoU2VydmljZS5zZXRUb2tlbihyZXMuZGF0YS50b2tlbik7XG4gICAgICAgICAgICAgIFxuXG4gICAgICAgICAgICAgIC8vdG9hc3RcbiAgICAgICAgICAgICAgdG9hc3RyLnN1Y2Nlc3MoJ1lvdSBhcmUgbm93IG15IEJldGEhJyk7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG5cbiAgICAgICAgICAgICAgLy9jaGFuZ2Ugc3RhdHVzIG9uIHZpZXdcbiAgICAgICAgICAgICAgdm0uc3VibWl0U3RhdHVzID0gXCJTdWNjZXNzXCI7XG4gICAgICAgICAgICAgXG4gICAgICAgICAgICAgIC8vZW1wdHkgZm9ybVxuICAgICAgICAgICAgICB2bS5mb3JtID0gXCJcIjtcblxuICAgICAgICAgICAgICAvL3JlZGlyZWN0XG4gICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLm1lbWJlcnMnKTtcblxuICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRlbWl0KFwibG9nZ2VkSW5cIik7XG5cbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgICB0b2FzdHIuZXJyb3IoJ0ZhaWxlZDogJyArIGVyci5kYXRhKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICBcdGZ1bmN0aW9uIGVycm9yKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBpbmZvKCkge1xuXHQgICAgICAvKiAqL1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwicmVnaXN0ZXJTZXJ2aWNlXCIpO1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBzdWNjZXNzKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXG5cbiAgICB9XG5cblx0XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0J1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCdzYW1wbGUnKVxuXHRcdC5jb250cm9sbGVyKCdzYW1wbGVDdHJsJywgc2FtcGxlQ3RybClcblxuXHRzYW1wbGVDdHJsLiRpbmplY3QgPSBbXVxuXG5cdGZ1bmN0aW9uIHNhbXBsZUN0cmwoKSB7XG5cblx0ICAgIHZhciB2bSA9IHRoaXM7XG5cblx0ICAgIHZtLmdvdG9TZXNzaW9uID0gZ290b1Nlc3Npb247XG5cdCAgICB2bS5yZWZyZXNoID0gcmVmcmVzaDtcblx0ICAgIHZtLnNlYXJjaCA9IHNlYXJjaDtcblx0ICAgIHZtLnNlc3Npb25zID0gW107XG5cdCAgICB2bS50aXRsZSA9ICdTYW1wbGUnO1xuXG5cdCAgICAvLy8vLy8vLy8vLy9cblxuXHQgICAgZnVuY3Rpb24gZ290b1Nlc3Npb24oKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIHJlZnJlc2goKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIHNlYXJjaCgpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblx0fVxuXG59KSgpO1xuXG5cbiIsIihmdW5jdGlvbigpe1xuXHQndXNlIHN0cmljdCdcblxuXHRhbmd1bGFyXG4gICAgXHQubW9kdWxlKCdzYW1wbGUnKVxuICAgIFx0LmZhY3RvcnkoJ3NhbXBsZVNlcnZpY2UnLCBzYW1wbGVTZXJ2aWNlKTtcblxuICAgIHNhbXBsZVNlcnZpY2UuJGluamVjdCA9IFtdXG5cbiAgICBmdW5jdGlvbiBzYW1wbGVTZXJ2aWNlKCkge1xuICAgIFx0dmFyIHNlcnZpY2UgPSB7XG5cbiAgICBcdFx0ZXJyb3I6IGVycm9yLFxuICAgIFx0XHRpbmZvOiBpbmZvLFxuICAgIFx0XHRzdWNjZXNzOiBzdWNjZXNzXG5cbiAgICBcdH07XG5cbiAgICBcdHJldHVybiBzZXJ2aWNlO1xuXG4gICAgXHQvLy8vLy8vLy8vLy9cblxuICAgIFx0ZnVuY3Rpb24gZXJyb3IoKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIGluZm8oKSB7XG5cdCAgICAgIC8qICovXG4gICAgICAgICAgY29uc29sZS5sb2coXCJzYW1wbGVTZXJ2aWNlXCIpO1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBzdWNjZXNzKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXG5cbiAgICB9XG5cblx0XG5cbn0pKCk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
