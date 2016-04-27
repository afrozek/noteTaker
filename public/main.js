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

		vm.getNotes = getNotesList();
		vm.allNotes = null;
		vm.activeNotes = [];
		//vm.getSingleNote = getSingleNote;


		vm.saveNote = saveNote;
		vm.deleteNote = deleteNote;
		vm.updateNoteContent = updateNoteContent;
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
			notesService.getNotesList().then(function(data){
				vm.allNotes = data.data.notes;
				//console.log(vm.allNotes);
			})
		}

		// function getSingleNote(noteId) {
		// 	 notesService.getSingleNote(noteId).then(function(){
		// 	 	return data.data;
		// 	 })

		// }


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
	    	var token = $window.localStorage.getItem('userToken');

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
	    	})
	    }

	    function deleteNote(noteId,index){
	    	console.log('deleting')
	    	notesService.deleteNote(noteId).then(function(data){
	    		if(data.data.nModified == 1){
	    			closeTab(index)
	    			toastr.success("Note Deleted")
	    			getNotesList();
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

    notesService.$inject = ['$http','$window']

    function notesService($http,$window) {

        var token = getToken();
    	var service = {
            getToken: getToken, 
            getNotesList: getNotesList,
            getSingleNote: getSingleNote,
            saveAllNotes: saveAllNotes,
            addNewNote: addNewNote,
            updateNoteContent: updateNoteContent,
            deleteNote: deleteNote,
            // updateNoteTitle: updateNoteTitle,
            // updateNoteContent: updateNote
    	};

    	return service;

    	////////////

        function getToken() {
            return $window.localStorage.getItem('userToken');
        }
      
        // gets notes list, excludes the actual note content
        function getNotesList () {
            return $http.post('http://localhost:3000/api/notes/getAllNotesMeta',{token: token});
        } //end getNote()

        function getSingleNote(noteId) {
            return $http.post('http://localhost:3000/api/notes/getSingleNote',{token: token, noteId: noteId});

        }

        function addNewNote () {

            // create new note object
            var newNote = {title:"froost",content:"some content","sharedWith":[{"user": "auk2@njit.edu", "canEdit": false}]};
            
           return $http.post('http://localhost:3000/api/notes/addNote',{token: token, note: newNote})
        }

         function updateNoteContent(noteId, noteContent) {
            return $http.post('http://localhost:3000/api/notes/updateNoteContent',{token: token, noteId: noteId, noteContent:noteContent});

        }

        function deleteNote(noteId) {
            return $http.post('http://localhost:3000/api/notes/deleteNote',{token: token, noteId: noteId});

        }

        function saveAllNotes(notes) {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUuanMiLCJjb250cm9sbGVycy9hcHAuY29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2FwcC5ob21lLmNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9hcHAubG9naW4uY29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2FwcC5uYXYuY29udHJvbGxlci5qcyIsImRpcmVjdGl2ZXMvc2VsZWN0VGV4dC5kaXJlY3RpdmUuanMiLCJyb3V0ZXMvYXBwLnJvdXRlcy5qcyIsImF1dGgvYXV0aC5tb2R1bGUuanMiLCJidWRnZXQvYnVkZ2V0Lm1vZHVsZS5qcyIsIm1lbWJlcnMvbWVtYmVycy5tb2R1bGUuanMiLCJub3Rlcy9ub3Rlcy5tb2R1bGUuanMiLCJub3RpZnkvbm90aWZ5Lm1vZHVsZS5qcyIsInJlZ2lzdGVyL3JlZ2lzdGVyLm1vZHVsZS5qcyIsInNhbXBsZUNvbXBvbmVudC9zYW1wbGUubW9kdWxlLmpzIiwiYXV0aC9zZXJ2aWNlcy9hdXRoLnNlcnZpY2UuaW50ZXJjZXB0b3IuanMiLCJhdXRoL3NlcnZpY2VzL2F1dGguc2VydmljZS5qcyIsImJ1ZGdldC9jb250cm9sbGVycy9idWRnZXQuY29udHJvbGxlci5qcyIsImJ1ZGdldC9kaXJlY3RpdmVzL25vdGVzLmRpcmVjdGl2ZS5iYWNrdXAuanMiLCJidWRnZXQvZGlyZWN0aXZlcy9ub3Rlcy5kaXJlY3RpdmUuanMiLCJidWRnZXQvc2VydmljZXMvYnVkZ2V0LnNlcnZpY2UuanMiLCJtZW1iZXJzL2NvbnRyb2xsZXJzL21lbWJlcnMuY29udHJvbGxlci5qcyIsIm1lbWJlcnMvc2VydmljZXMvbWVtYmVycy5zZXJ2aWNlLmpzIiwibm90ZXMvY29udHJvbGxlcnMvbm90ZXMuY29udHJvbGxlci5qcyIsIm5vdGVzL2RpcmVjdGl2ZXMvbm90ZXMuZGlyZWN0aXZlLmJhY2t1cC5qcyIsIm5vdGVzL2RpcmVjdGl2ZXMvbm90ZXMuZGlyZWN0aXZlLmpzIiwibm90ZXMvc2VydmljZXMvbm90ZXMuc2VydmljZS5qcyIsIm5vdGlmeS9jb250cm9sbGVycy9ub3RpZnkuY29udHJvbGxlci5qcyIsIm5vdGlmeS9kaXJlY3RpdmVzL25vdGlmeS5kaXJlY3RpdmUuanMiLCJub3RpZnkvc2VydmljZXMvbm90aWZ5LnNlcnZpY2UuanMiLCJyZWdpc3Rlci9jb250cm9sbGVycy9yZWdpc3Rlci5jb250cm9sbGVyLmpzIiwicmVnaXN0ZXIvZGlyZWN0aXZlcy9yZWdpc3Rlci5kaXJlY3RpdmUuanMiLCJyZWdpc3Rlci9zZXJ2aWNlcy9yZWdpc3Rlci5zZXJ2aWNlLmpzIiwic2FtcGxlQ29tcG9uZW50L2NvbnRyb2xsZXJzL3NhbXBsZS5jb250cm9sbGVyLmpzIiwic2FtcGxlQ29tcG9uZW50L2RpcmVjdGl2ZXMvc2FtcGxlLmRpcmVjdGl2ZS5qcyIsInNhbXBsZUNvbXBvbmVudC9zZXJ2aWNlcy9zYW1wbGUuc2VydmljZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe1xuICAgICd1c2Ugc3RyaWN0J1xuXG5hbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwJywgW1xuICAgICAgICAnYXV0aCcsXG4gICAgXHQndWkucm91dGVyJyxcbiAgICBcdCduZ0FuaW1hdGUnLFxuICAgIFx0J3NhbXBsZScsXG4gICAgXHQncmVnaXN0ZXInLFxuICAgIFx0J3RvYXN0cicsXG4gICAgXHQnbWVtYmVycycsXG4gICAgXHQnbm90ZXMnLFxuICAgICAgICAnYnVkZ2V0JyxcbiAgICAgICAgJ2NoYXJ0LmpzJyxcbiAgICAgICAgJ25vdGlmeScsXG4gICAgICAgICd1aS50aW55bWNlJ1xuICAgIF0pXG5cbi8vIC5jb25maWcoZnVuY3Rpb24oJGh0dHBQcm92aWRlcikge1xuXG4vLyAgICAgLy8gYXR0YWNoIG91ciBhdXRoIGludGVyY2VwdG9yIHRvIHRoZSBodHRwIHJlcXVlc3RzXG4vLyAgICAgJGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaCgnYXV0aEludGVyY2VwdG9yJyk7XG5cbi8vIH0pXG5cblxuLnJ1bihbJyRyb290U2NvcGUnLCckc3RhdGUnLCdhdXRoU2VydmljZScsJyRxJyxmdW5jdGlvbigkcm9vdFNjb3BlLCAkc3RhdGUsIGF1dGhTZXJ2aWNlICwkcSkge1xuICAgIGF1dGhTZXJ2aWNlLmluZm8oKTtcblxuICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VFcnJvcicsIGZ1bmN0aW9uIChldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcywgZXJyb3IpIHtcbiAgICAgICAgICAgXG4gICAgICAgICAgLy8gZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgY29uc29sZS5sb2coXCJTVEFURSBDSEFOR0UgRVJST1IgRVJST1IgRVJST1IgRVJST1JFUlJPUlwiKTtcbiAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAuaG9tZScpXG4gICAgICAgIFxuICAgICAgfSk7XG5cbiAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3RhcnQnLCBmdW5jdGlvbiAoZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpIHtcbiAgICAvL2F1dGhTZXJ2aWNlLmluZm8oKTtcbiAgICAvL2F1dGhTZXJ2aWNlLmlzQXV0aG9yaXplZCggZXZlbnQsIGZyb21TdGF0ZSwgdG9TdGF0ZSk7XG4gICAgLy9jb25zb2xlLmxvZyhcInN0YXRlIGNoYW5naW5nXCIpO1xuICAgIC8vY29uc29sZS5sb2codG9TdGF0ZSlcblxuICAgICAgICBpZih0b1N0YXRlLmRhdGEucGVybWlzc2lvbiA9PT0gdHJ1ZSl7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibmVlZCBwZXJtaXNzaW9uXCIpO1xuICAgICAgICAgICAgLy90b1N0YXRlLnJlc29sdmUgPSB0b1N0YXRlLnJlc29sdmUgfHwge307XG4gICAgICAgICAgICAvL3RvU3RhdGUucmVzb2x2ZSA9IHt9O1xuXG4gICAgICAgICAgICAvL2NoZWNrIHRvIHNlZSBpZiB0aGVyZSB3YXMgYSByZXNvbHZlIGFscmVhZHkgYWRkZWRcbiAgICAgICAgICAgIGlmKCF0b1N0YXRlLnJlc29sdmUuYXV0aG9yaXphdGlvblJlc29sdmVyKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnYWRkaW5nIGF1dGggcmVzb2x2ZXInKTtcbiAgICAgICAgICAgICAgICAvL2FkZCByZXNvbHZlclxuICAgICAgICAgICAgICAgIHRvU3RhdGUucmVzb2x2ZS5hdXRob3JpemF0aW9uUmVzb2x2ZXIgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGF1dGhTZXJ2aWNlLmlzQXV0aG9yaXplZChldmVudCwgZnJvbVN0YXRlLCB0b1N0YXRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImp1c3QgYWRkZWQ6IFwiKVxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2codG9TdGF0ZS5yZXNvbHZlLmF1dGhvcml6YXRpb25SZXNvbHZlcilcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgLy9qdXN0IHRvIHNob3cgdGhhdCB0aGUgcmVzb2x2ZXIgd2FzIGFscmVhZHkgYWRkZWRcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHRvU3RhdGUucmVzb2x2ZS5hdXRob3JpemF0aW9uUmVzb2x2ZXIpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSAvL2VuZCBpZiBuZWVkcyBwZXJtaXNzaW9uXG5cblxuICAgIH0pOyAvL2VuZCByb290U2NvcGUuJG9uXG5cblxuICAgIFxuXG59XSk7IC8vZW5kIC5ydW5cblxuXG5cblxuXG59KSgpOyAvL2VuZCBpZmZlXG5cbiIsIihmdW5jdGlvbigpIHtcblx0J3VzZSBzdHJpY3QnXG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ2FwcCcpXG5cdFx0LmNvbnRyb2xsZXIoJ2FwcEN0cmwnLCBhcHBDdHJsKVxuXG5cdGFwcEN0cmwuJGluamVjdCA9IFsnc2FtcGxlU2VydmljZScsJ2F1dGhTZXJ2aWNlJywnJHN0YXRlJywnJGh0dHAnLCd0b2FzdHInLCckcm9vdFNjb3BlJywnbm90aWZ5U2VydmljZSddXG5cblx0ZnVuY3Rpb24gYXBwQ3RybChzYW1wbGVTZXJ2aWNlLGF1dGhTZXJ2aWNlLCRzdGF0ZSwgJGh0dHAsIHRvYXN0ciwgJHJvb3RTY29wZSxub3RpZnlTZXJ2aWNlKSB7XG5cblx0XHQgdmFyIHZtID0gdGhpcztcblxuXHRcdCAvLyBvbiBpbml0aWFsIGxvYWRcblx0XHQgLy8gdXNlciBsb2dpbiBzdGF0dXNcblx0XHQgdm0uaXNMb2dnZWQgPSBhdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQodm0pO1xuXG5cdFx0ICRyb290U2NvcGUuJG9uKCdsb2dnZWRJbicsZnVuY3Rpb24oKXtcblx0XHQgXHR2bS5pc0xvZ2dlZCA9IHRydWU7XG5cdFx0IH0pXG5cblx0XHQgJHJvb3RTY29wZS4kb24oJ2xvZ2dlZE91dCcsZnVuY3Rpb24oKXtcblx0XHQgXHR2bS5pc0xvZ2dlZCA9IGZhbHNlO1xuXHRcdCB9KVxuXG5cdFx0IHZhciBtZXNzYWdlID0ge2RhdGEgOiBcInJvb3N0c1wifTtcblx0XHQgLy9ub3RpZnlTZXJ2aWNlLnB1c2goIG1lc3NhZ2UpO1xuXG5cdFx0IC8vYWxlcnQoXCJ3YXRjaGluZ1wiKTtcblxuXG5cdH0gLy9lbmQgYXBwQ3RybFxuXG59KSgpOztcblxuXG4iLCIoZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0J1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCdhcHAnKVxuXHRcdC5jb250cm9sbGVyKCdob21lQ3RybCcsIGhvbWVDdHJsKVxuXHRcdC5jb250cm9sbGVyKCdwYXJlbnRDdHJsJywgcGFyZW50Q3RybClcblxuXHRob21lQ3RybC5pbmplY3QgPSBbJ3NhbXBsZVNlcnZpY2UnLCckc2NvcGUnXVxuXG5cdGZ1bmN0aW9uIGhvbWVDdHJsKHNhbXBsZVNlcnZpY2UsICRzY29wZSkge1xuXHRcdFxuXHRcdHNhbXBsZVNlcnZpY2UuaW5mbygpO1xuXG5cdCAgICB2YXIgdm0gPSB0aGlzO1xuXG5cdCAgICB2bS5nb3RvU2Vzc2lvbiA9IGdvdG9TZXNzaW9uO1xuXHQgICAgdm0ucmVmcmVzaCA9IHJlZnJlc2g7XG5cdCAgICB2bS5zZWFyY2ggPSBzZWFyY2g7XG5cdCAgICB2bS5zZXNzaW9ucyA9IFtdO1xuXHQgICAgdm0udGVzdCA9ICd0ZXN0JztcblxuXHQgICAgLy8vLy8vLy8vLy8vXG5cblx0ICAgIC8vICRzY29wZS4kb24oJ2RvZ3MnLCBmdW5jdGlvbiAoKSB7XG5cdCAgICAvLyBcdGNvbnNvbGUubG9nKFwicmVjZWl2ZWRcIilcblx0ICAgIC8vIH0pO1xuXG5cdCAgICBmdW5jdGlvbiBnb3RvU2Vzc2lvbigpIHtcblxuXHRcdH1cblxuXHQgICAgZnVuY3Rpb24gcmVmcmVzaCgpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gc2VhcmNoKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXHR9IC8vIGVuZCBob21lQ3RybFxuXG5cdHBhcmVudEN0cmwuaW5qZWN0ID0gWydzYW1wbGVTZXJ2aWNlJywnJHNjb3BlJ11cblxuXHRmdW5jdGlvbiBwYXJlbnRDdHJsKCRzY29wZSkge1xuXHRcdFxuXHQgICAgdmFyIHZtID0gdGhpcztcblx0ICAgIC8vY29uc29sZS5sb2coXCJwYXJlbnRcIilcblxuXHQgICAvLyAkc2NvcGUuJGVtaXQoJ2RvZ3MnLCdzb21lIGRhdGEnKTtcblxuXG5cdH0gLy8gZW5kIHBhcmVudEN0cmxcblxufSkoKTtcblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuIiwiXHQoZnVuY3Rpb24oKXtcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnYXBwJylcblx0XHQuY29udHJvbGxlcihcImxvZ2luQ3RybFwiLCBsb2dpbkN0cmwpXG5cblx0bG9naW5DdHJsLiRpbmplY3QgPSBbJyRzY29wZScsJ3NhbXBsZVNlcnZpY2UnLCdhdXRoU2VydmljZScsJyRzdGF0ZScsJyRodHRwJywndG9hc3RyJ11cblxuXHRmdW5jdGlvbiBsb2dpbkN0cmwoJHNjb3BlLHNhbXBsZVNlcnZpY2UsYXV0aFNlcnZpY2UsJHN0YXRlLCAkaHR0cCwgdG9hc3RyKSB7XG5cdFx0Ly9zYW1wbGVTZXJ2aWNlLmluZm8oKTtcblx0XHQvL2NvbnNvbGUubG9nKFwibG9naW5DdHJsXCIpXG5cblx0ICAgIHZhciB2bSA9IHRoaXM7XG5cdCAgICB2bS51c2VyID0gXCJcIlxuXHQgICAgdm0ubG9naW5Gb3JtID0gXCJcIjtcblx0ICAgIFxuXHQgICAgdm0ubG9naW4gPSBsb2dpbjtcblx0ICAgIHZtLmxvZ291dCA9IGxvZ291dDtcblxuXHQgICAgLy8vLy8vLy8vLy8vXG5cblx0ICAgIGZ1bmN0aW9uIGxvZ2luKCkge1xuXHQgICAgXHRhdXRoU2VydmljZS5sb2dpbih2bS51c2VyLCdhcHAubm90ZXMnKVxuXHRcdFx0dm0udXNlciA9IFwiXCI7XG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIGxvZ291dCgpIHtcblx0ICAgIFx0Y29uc29sZS5sb2coXCJsb2dnaW5nIG91dC4uLlwiKVxuXHQgICAgXHRhdXRoU2VydmljZS5sb2dvdXQoKTtcblx0ICAgIH1cblxuXG5cdH0gLy9lbmQgbG9naW5DdHJsXG5cblxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcblx0J3VzZSBzdHJpY3QnXG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ2FwcCcpXG5cdFx0LmNvbnRyb2xsZXIoJ25hdkN0cmwnLCBuYXZDdHJsKVxuXG5cdG5hdkN0cmwuaW5qZWN0ID0gWycnXVxuXG5cdGZ1bmN0aW9uIG5hdkN0cmwoKSB7XG5cdFx0XG5cdFx0Ly9jb25zb2xlLmxvZygnbmF2IGNvbnRyb2xsZXInKTtcblxuXHQgICAgdmFyIHZtID0gdGhpcztcblxuXG5cdCAgICB2bS5sb2dnZWRJbiA9IHRydWU7XG5cdCAgICB2bS5nb3RvU2Vzc2lvbiA9IGdvdG9TZXNzaW9uO1xuXHQgICAgdm0ucmVmcmVzaCA9IHJlZnJlc2g7XG5cdCAgICB2bS5zZWFyY2ggPSBzZWFyY2g7XG5cdCAgICB2bS5zZXNzaW9ucyA9IFtdO1xuXHQgICAgdm0udGl0bGUgPSAnTmF2Jztcblx0ICAgIC8vJHNjb3BlLnRpdGxlID0gXCJtb3VzZVwiO1xuXG5cdCAgICAvLy8vLy8vLy8vLy9cblxuXHQgICAgZnVuY3Rpb24gZ290b1Nlc3Npb24oKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIHJlZnJlc2goKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIHNlYXJjaCgpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblx0fVxuXG59KSgpO1xuXG5cbiIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAnKVxuICAgIC5kaXJlY3RpdmUoJ3NlbGVjdFRleHQnLCBzZWxlY3RUZXh0KVxuICAgIFxuICAgIHNlbGVjdFRleHQuJGluamVjdCA9IFsnJHdpbmRvdyddXG5cbmZ1bmN0aW9uIHNlbGVjdFRleHQoJHdpbmRvdyl7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICBlbGVtZW50LmJpbmQoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCEkd2luZG93LmdldFNlbGVjdGlvbigpLnRvU3RyaW5nKCkpIHtcbiAgICAgICAgdGhpcy5zZXRTZWxlY3Rpb25SYW5nZSh0aGlzLnZhbHVlLmxlbmd0aCwgdGhpcy52YWx1ZS5sZW5ndGgpXG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59XG5cblxuIiwiXG5hbmd1bGFyLm1vZHVsZSgnYXBwJylcblx0LmNvbmZpZyhbJyR1cmxSb3V0ZXJQcm92aWRlcicsJyRzdGF0ZVByb3ZpZGVyJywnJGh0dHBQcm92aWRlcicsZnVuY3Rpb24oJHVybFJvdXRlclByb3ZpZGVyLCRzdGF0ZVByb3ZpZGVyLCRodHRwUHJvdmlkZXIpe1xuXHRcdFxuXHRcdCR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJ2hvbWUnKTtcblx0XHQvL3N0YXRlc1xuXHRcdCRzdGF0ZVByb3ZpZGVyXG5cblx0XHQuZGVjb3JhdG9yKCdwYXRoJywgZnVuY3Rpb24oc3RhdGUsIHBhcmVudEZuKSB7XG5cdFx0XHQvL2NvbnNvbGUubG9nKFwiY29uZmlndXJpbmcgc3RhdGVzXCIpXHRcblx0XHRcdGlmIChzdGF0ZS5zZWxmLnJlc29sdmUgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRzdGF0ZS5zZWxmLnJlc29sdmUgPSB7fTtcblx0XHRcdFx0c3RhdGUucmVzb2x2ZSA9IHN0YXRlLnNlbGYucmVzb2x2ZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBwYXJlbnRGbihzdGF0ZSk7XG4gICAgICAgICB9KVxuXG5cdFx0LnN0YXRlKCdhcHAnLHtcblx0XHRcdGFic3RyYWN0OiB0cnVlLFxuXHRcdFx0dGVtcGxhdGVVcmw6J2FwcC92aWV3cy9hcHAudmlldy5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdhcHBDdHJsJyxcblx0XHRcdGNvbnRyb2xsZXJBczogJ2FwcCdcblxuXHRcdH0pXG5cblx0XHQuc3RhdGUoJ2FwcC5ob21lJyx7XG5cdFx0XHR1cmw6ICcvaG9tZScsXG5cdFx0XHR0ZW1wbGF0ZVVybDonYXBwL3ZpZXdzL2FwcC5ob21lLmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ2hvbWVDdHJsJyxcblx0XHRcdGNvbnRyb2xsZXJBczogJ2hvbWUnLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRwZXJtaXNzaW9uOiBmYWxzZSxcblx0XHRcdFx0cGVybWlzc2lvbkxldmVsOiBbJ2V2ZXJ5b25lJ11cblx0XHRcdH1cblx0XHR9KVxuXG5cdFx0LnN0YXRlKCdhcHAucmVnaXN0ZXInLHtcblx0XHRcdHVybDogJy9yZWdpc3RlcicsXG5cdFx0XHR0ZW1wbGF0ZVVybDonY29tcG9uZW50cy9yZWdpc3Rlci92aWV3cy9yZWdpc3Rlci52aWV3Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ3JlZ2lzdGVyQ3RybCcsXG5cdFx0XHRjb250cm9sbGVyQXM6ICdyZWdpc3RlcicsXG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdHBlcm1pc3Npb246IGZhbHNlLFxuXHRcdFx0XHRwZXJtaXNzaW9uTGV2ZWw6IFsnZXZlcnlvbmUnXVxuXHRcdFx0fVxuXHRcdH0pXG5cblx0XHQuc3RhdGUoJ2FwcC5tZW1iZXJzJyx7XG5cdFx0XHR1cmw6ICcvbWVtYmVycycsXG5cdFx0XHR0ZW1wbGF0ZVVybDonY29tcG9uZW50cy9tZW1iZXJzL3ZpZXdzL21lbWJlcnMuaG9tZS5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdtZW1iZXJzQ3RybCcsXG5cdFx0XHRjb250cm9sbGVyQXM6ICdtZW1iZXJzJyxcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0cGVybWlzc2lvbjogdHJ1ZSxcblx0XHRcdFx0cGVybWlzc2lvbkxldmVsOiBbJ2FkbWluJywnbWVtYmVyJ11cblx0XHRcdH1cblx0XHR9KVxuXG5cdFx0LnN0YXRlKCdhcHAubm90ZXMnLHtcblx0XHRcdHVybDogJy9ub3RlcycsXG5cdFx0XHR0ZW1wbGF0ZVVybDonY29tcG9uZW50cy9ub3Rlcy92aWV3cy9ub3Rlcy52aWV3Lmh0bWwnLFxuXG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdHBlcm1pc3Npb246IHRydWUsXG5cdFx0XHRcdHBlcm1pc3Npb25MZXZlbDogWydhZG1pbicsJ21lbWJlciddXG5cdFx0XHR9XG5cdFx0fSlcblxuXHRcdC5zdGF0ZSgnYXBwLmJ1ZGdldCcse1xuXHRcdFx0dXJsOiAnL2J1ZGdldCcsXG5cdFx0XHR0ZW1wbGF0ZVVybDonY29tcG9uZW50cy9idWRnZXQvdmlld3MvYnVkZ2V0LnZpZXcuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnYnVkZ2V0Q3RybCcsXG5cdFx0XHRjb250cm9sbGVyQXM6ICdidWRnZXQnLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRwZXJtaXNzaW9uOiB0cnVlLFxuXHRcdFx0XHRwZXJtaXNzaW9uTGV2ZWw6IFsnYWRtaW4nXVxuXHRcdFx0fVxuXHRcdH0pXG5cblx0XHQvLyRodHRwUHJvdmlkZXIuaW50ZXJjZXB0b3JzLnB1c2goJ2F1dGhJbnRlcmNlcHRvcicpO1xuXG5cblxuXHR9XSk7XG5cbiIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdhdXRoJywgW1xuICAgICAgXG4gICAgXSk7IiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ2J1ZGdldCcsIFtcbiAgICAgICdjaGFydC5qcydcbiAgICBdKTsiLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgnbWVtYmVycycsIFtcbiAgICAgIFxuICAgIF0pOyIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdub3RlcycsIFtcbiAgICAgIFxuICAgIF0pOyIsIihmdW5jdGlvbigpe1xuXHQndXNlIHN0cmljdCdcblxuYW5ndWxhclxuXHQubW9kdWxlKCdub3RpZnknLCBbXG5cdCAgXG5cdF0pO1xuXG59KSgpO1xuXG5cbiIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdyZWdpc3RlcicsIFtcbiAgICBcdCdhdXRoJ1xuICAgIF0pOyIsIihmdW5jdGlvbigpe1xuXHQndXNlIHN0cmljdCdcblxuYW5ndWxhclxuXHQubW9kdWxlKCdzYW1wbGUnLCBbXG5cdCAgXG5cdF0pO1xuXG59KSgpO1xuXG4iLCIoZnVuY3Rpb24oKXtcbiAgICAndXNlIHN0cmljdCdcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXV0aCcpXG4gICAgICAgIC5mYWN0b3J5KCdhdXRoSW50ZXJjZXB0b3InLCBhdXRoSW50ZXJjZXB0b3IpO1xuXG4gICAgYXV0aEludGVyY2VwdG9yLiRpbmplY3QgPSBbJ2F1dGhTZXJ2aWNlJ11cblxuICAgIGZ1bmN0aW9uIGF1dGhJbnRlcmNlcHRvcihhdXRoU2VydmljZSkge1xuXG5cblxuICAgICAgICB2YXIgc2VydmljZSA9IHtcblxuICAgICAgICAgICAgcmVxdWVzdDogcmVxdWVzdCxcbiAgICAgICAgICAgIHJlc3BvbnNlOiByZXNwb25zZVxuXG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIHNlcnZpY2U7XG5cbiAgICAgICAgLy8vLy8vLy8vLy8vXG5cbiAgICAgICAgZnVuY3Rpb24gcmVxdWVzdChjb25maWcpIHtcblxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImF1dGhJbnRlcmNlcHRvciByZXF1ZXN0IGZ1bmN0aW9uXCIpXG5cbiAgICAgICAgICAgIHZhciB0b2tlbiA9IGF1dGhTZXJ2aWNlLmdldFRva2VuKCk7XG5cbiAgICAgICAgICAgIGlmKHRva2VuKXtcbiAgICAgICAgICAgICAgICBjb25maWcuaGVhZGVycy50b2tlbiA9IHRva2VuO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidG9rZW4gcHJlc2VudFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJubyB0b2tlblwiKTtcbiAgICAgICAgICAgIH0gICAgXG4gICAgICAgICAgICByZXR1cm4gY29uZmlnO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcmVzcG9uc2UocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJhdXRoSW50ZXJjZXB0b3IgcmVzcG9uc2UgZnVuY3Rpb25cIilcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfVxuXG4gICAgfSAvL2VuZCBhdXRoSW50ZXJjZXB0b3JcblxuICAgIFxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCl7XG5cdC8vJ3VzZSBzdHJpY3QnXG5cblx0YW5ndWxhclxuICAgIFx0Lm1vZHVsZSgnYXV0aCcsW10pXG4gICAgXHQuZmFjdG9yeSgnYXV0aFNlcnZpY2UnLCBhdXRoU2VydmljZSk7XG5cbiAgICBhdXRoU2VydmljZS4kaW5qZWN0ID0gWyckd2luZG93JywnJGh0dHAnLCd0b2FzdHInLCckc3RhdGUnLCckcm9vdFNjb3BlJywnJGxvY2F0aW9uJywnJHEnXTtcblxuICAgIGZ1bmN0aW9uIGF1dGhTZXJ2aWNlKCR3aW5kb3csJGh0dHAsdG9hc3RyLCRzdGF0ZSwkcm9vdFNjb3BlLCRsb2NhdGlvbiwkcSkge1xuXG4gICAgXG5cbiAgICBcdHZhciBzZXJ2aWNlID0ge1xuXG4gICAgICAgICAgICBpbmZvOiBpbmZvLFxuXG4gICAgICAgICAgICBsb2dpbjogbG9naW4sXG4gICAgICAgICAgICBsb2dvdXQ6IGxvZ291dCxcblxuICAgIFx0XHRzZXRUb2tlbjogc2V0VG9rZW4sXG4gICAgICAgICAgICBnZXRUb2tlbjogZ2V0VG9rZW4sXG4gICAgXHRcdGNsZWFyVG9rZW46IGNsZWFyVG9rZW4sXG5cbiAgICAgICAgICAgIGlzQXV0aGVudGljYXRlZDogaXNBdXRoZW50aWNhdGVkLCAvLyB2ZXJpZmllcyB0b2tlblxuICAgICAgICAgICAgaXNBdXRob3JpemVkOiBpc0F1dGhvcml6ZWQgLy8gdmVyaWZpZXMgcm91dGUgcGVybWlzc2lvbnNcblxuICAgIFx0fTtcblxuICAgIFx0cmV0dXJuIHNlcnZpY2U7XG5cbiAgICBcdC8vLy8vLy8vLy8vL1xuXG4gICAgICAgIGZ1bmN0aW9uIGluZm8gKCkge1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImF1dGggc2VydmljZVwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHJlZGlyZWN0IHRha2VzIHJvdXRlIHN0cmluZyBpZS4gJ2FwcC5ob21lJ1xuICAgICAgICBmdW5jdGlvbiBsb2dpbiAodXNlckxvZ2luRGF0YSwgcmVkaXJlY3QpIHtcbiAgICAgICAgICAgICRodHRwLnBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGkvdXNlcnMvbG9naW4nLCB1c2VyTG9naW5EYXRhKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlcyl7XG4gICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzKTtcbiAgICAgICAgICAgICAgICAgICAgaWYocmVzLnN0YXR1cyA9PSAyMDApe1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VG9rZW4ocmVzLmRhdGEudG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kZW1pdChcImxvZ2dlZEluXCIpOyAgXG4gICAgICAgICAgICAgICAgICAgICAgICB0b2FzdHIuc3VjY2VzcyhyZXMuZGF0YS5tZXNzYWdlKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYodHlwZW9mKHJlZGlyZWN0KSAhPSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhyZWRpcmVjdClcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVycil7XG4gICAgICAgICAgICAgICAgICAgIHRvYXN0ci5lcnJvcihlcnIuZGF0YS5tZXNzYWdlKVxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpXG4gICAgICAgICAgICAgICAgfSlcblxuXG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBsb2dvdXQgKCkge1xuICAgICAgICAgICAgY2xlYXJUb2tlbigpO1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kZW1pdChcImxvZ2dlZE91dFwiKTtcbiAgICAgICAgICAgICRzdGF0ZS5nbyhcImFwcC5ob21lXCIpO1xuICAgICAgICAgICAgdG9hc3RyLnN1Y2Nlc3MoXCJZb3UgaGF2ZSBiZWVuIGxvZ2dlZCBvdXRcIik7XG4gICAgICAgIH1cblxuXG5cbiAgICBcdGZ1bmN0aW9uIHNldFRva2VuICh0b2tlbikge1xuICAgICAgICAgICAgJHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndXNlclRva2VuJyx0b2tlbik7XG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIGdldFRva2VuICgpIHtcbiAgICAgICAgICAgIHZhciB0b2tlbiA9ICR3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3VzZXJUb2tlbicpO1xuICAgICAgICAgICAgcmV0dXJuIHRva2VuO1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBjbGVhclRva2VuICgpIHtcbiAgICAgICAgICAgICR3aW5kb3cubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3VzZXJUb2tlbicpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3JhYmJpdHMnKVxuXHQgICAgfVxuXG4gICAgICAgIC8vYmFzaWNhbGx5IGFyZSB0aGV5IGxvZ2dlZCBpblxuICAgICAgICBmdW5jdGlvbiBpc0F1dGhlbnRpY2F0ZWQgKCkge1xuXG4gICAgICAgICAgICB2YXIgdG9rZW4gPSBnZXRUb2tlbigpO1xuICAgICAgICAgICAgaWYodG9rZW4pe1xuICAgICAgICAgICAgICAgICRodHRwLnBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGkvdXNlcnMvYXV0aG9yaXplJyx7dG9rZW46dG9rZW59KVxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHJlcylcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdhdXRob3JpemluZy4uJylcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCByZXMuZGF0YS5zdWNjZXNzID09IHRydWUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvYXN0ci5zdWNjZXNzKFwiQXV0aGVudGljYXRpb24gU3VjY2VzcyFcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkF1dGhlbnRpY2F0aW9uIFN1Y2Nlc3MhXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kZW1pdChcImxvZ2dlZEluXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vdG9hc3RyLmVycm9yKFwiQXV0aGVudGljYXRpb24gRmFpbGVkXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJBdXRoZW50aWNhdGlvbiBGYWlsZWRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvYXN0ci5lcnJvcihlcnIuZGF0YSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgIC8vdG9hc3RyLmVycm9yKFwiYXV0aGVudGljYXRpb24gZmFpbGVkLCBubyB0b2tlbiBwcmVzZW50XCIpXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJhdXRoZW50aWNhdGlvbiBmYWlsZWQsIG5vIHRva2VuIHByZXNlbnRcIilcbiAgICAgICAgICAgIH0gXG4gICAgICAgICAgIFxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaXNBdXRob3JpemVkIChldmVudCwgZnJvbVN0YXRlLCB0b1N0YXRlKSB7XG4gICAgICAgICAgICAgICAgLy9yZXR1cm4gJHEucmVqZWN0KCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJydW5uaW5nIGlzIGF1dGhvcml6ZWRcIilcblxuICAgICAgICAgICAgICAgIC8vZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB2YXIgdG9rZW4gPSBnZXRUb2tlbigpO1xuICAgICAgICAgICAgICAgIHZhciB1c2VybGV2ZWwgPSBudWxsO1xuICAgICAgICAgICAgICAgIHZhciBwcm9jZWVkID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICBpZih0b2tlbil7XG4gICAgICAgICAgICAgICAgICAvLyAgcmV0dXJuICRxLnJlamVjdDtcbiAgICAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnaHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaS91c2Vycy9hdXRob3JpemUnLHt0b2tlbjp0b2tlbn0pXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2F1dGhvcml6aW5nLi4nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCByZXMuZGF0YS5zdWNjZXNzID09IHRydWUgJiYgcmVzLmRhdGEucHJvZmlsZS51c2VyTGV2ZWwpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzLmRhdGEucHJvZmlsZS51c2VyTGV2ZWwpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJMZXZlbCA9IHJlcy5kYXRhLnByb2ZpbGUudXNlckxldmVsO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9sb29wIHRocm91Z2ggcGVybWlzc2lvbiBsaXN0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaT0wOyBpIDwgdG9TdGF0ZS5kYXRhLnBlcm1pc3Npb25MZXZlbC5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9pZiBjdXJyZW50IHVzZXJsZXZlbCBtYXRjaGVzIHBlcm1pc3Npb24gbGV2ZWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3RoZW4gc2V0IHByb2NlZWQgdG8gdHJ1ZSBhbmQgYnJlYWsgdGhlIGZvciBsb29wIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY3VycmVudCBsb29wIGkgOiBcIiArIHRvU3RhdGUuZGF0YS5wZXJtaXNzaW9uTGV2ZWxbaV0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYodXNlckxldmVsID09IHRvU3RhdGUuZGF0YS5wZXJtaXNzaW9uTGV2ZWxbaV0pe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJwZXJtaXNzaW9uIG1hdGNoXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInNldHRpbmcgcHJvY2VlZCB0cnVlXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9jZWVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9yZXR1cm4gdG9hc3RyLnN1Y2Nlc3MoXCJwcm9jZWVkXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwia2VlcCBsb29raW5nXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInNldHRpbmcgcHJvY2VlZCBmYWxzZVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2VlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9ICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9Ly9lbmQgZm9yIGxvb3AgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gLy8gZW5kIGlmIHByb2ZpbGUgcmV0dXJuZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBlbHNlIG5vIHByb2ZpbGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2FzdHIuZXJyb3IoXCJiYWQgcmVxdWVzdFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9jZWVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJsYXN0IGNoZWNrXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYocHJvY2VlZCA9PSBmYWxzZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSVRTIEZBTFNFXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAuaG9tZScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSkgLy9lbmQgdGhlblxuICAgICAgICAgICAgICAgIH0vL2VuZCBpZiB0b2tlblxuXG4gICAgICAgICAgICAgICAgLy9lbHNlIG5vIHRva2VuIFxuICAgICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgICAgIHRvYXN0ci5lcnJvcihcIm5vIHRva2VuIHByZXNlbnRcIilcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICBcblxuICAgICAgICB9Ly9lbmQgaXNBdXRob3JpemVkXG4gICAgICAgIFxuXG4gICAgfS8vZW5kIGF1dGhTZXJ2aWNlXG5cbiAgICBcblxuXG5cblx0XG5cbn0pKCk7IC8vZW5kIGlmZmVcblxuXG4iLCIoZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0J1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCdidWRnZXQnKVxuXHRcdC5jb250cm9sbGVyKCdidWRnZXRDdHJsJywgYnVkZ2V0Q3RybClcblxuXHRidWRnZXRDdHJsLiRpbmplY3QgPSBbJyRzY29wZScsJyRodHRwJywndG9hc3RyJ11cblxuXHRmdW5jdGlvbiBidWRnZXRDdHJsKCRzY29wZSwgJGh0dHAsIHRvYXN0cikge1xuXHRcdGNvbnNvbGUubG9nKCdsb2FkZWQgYnVkZ2V0Q3RybCcpO1xuXHRcblx0XHQvLyAkc2NvcGUuTWF0aCA9IHdpbmRvdy5NYXRoO1xuXG5cdFx0ICAgIFxuXG5cbiAgXHRcdFx0Ly8gaW5jb21lXG4gIFx0XHRcdCRzY29wZS5pbmNvbWUgPSB7fVxuICBcdFx0XHQkc2NvcGUuaW5jb21lLm1vbnRobHkgPSA0NTAwO1xuXG4gIFx0XHRcdC8vIGJpbGxzXG4gIFx0XHRcdCRzY29wZS5iaWxscyA9W11cbiAgXHRcdFx0JHNjb3BlLmJpbGxzID0gW1xuICBcdFx0XHRcdHtuYW1lOlwicmVudFwiLCBjb3N0OiAyNTAwfSxcbiAgXHRcdFx0XHR7bmFtZTpcInV0aWxpdGllc1wiLCBjb3N0OiAyMDB9LFxuICBcdFx0XHRcdHtuYW1lOlwiY2FyIGluc3VyYW5jZVwiLCBjb3N0OiAxNTB9LFxuICBcdFx0XHRcdHtuYW1lOlwiY2FyIHBheW1lbnRcIiwgY29zdDogMjUwfSxcbiAgXHRcdFx0XHR7bmFtZTpcImdhc1wiLCBjb3N0OiAxMDB9LFxuICBcdFx0XHRcdHtuYW1lOlwiZ3ltIG1lbWJlcnNoaXBcIiwgY29zdDogNTB9LFxuICBcdFx0XHRcdHtuYW1lOlwiY2VsbCBwaG9uZVwiLCBjb3N0OiA4MH0sXG5cbiAgXHRcdFx0XVxuXG4gICAgICAgIFxuXG4gIFx0XHRcdCRzY29wZS5hZGROZXdCaWxsID0gZnVuY3Rpb24oKXtcbiAgXHRcdFx0XHQkc2NvcGUuYmlsbHMucHVzaCh7bmFtZTogJHNjb3BlLm5ld0JpbGxOYW1lLCBjb3N0OiAwIH0pXG4gIFx0XHRcdFx0JHNjb3BlLm5ld0JpbGxOYW1lID0gXCJcIjtcbiAgXHRcdFx0fVxuXG4gIFx0XHRcdCRzY29wZS5yZW1vdmVCaWxsSXRlbSA9IGZ1bmN0aW9uKGluZGV4KXtcbiAgXHRcdFx0XHQkc2NvcGUuYmlsbHMuc3BsaWNlKGluZGV4LDEpO1xuICBcdFx0XHR9XG5cbiAgXHRcdFx0Ly9idWRnZXQgaXRlbXNcbiAgXHRcdFx0JHNjb3BlLmJ1ZGdldEl0ZW1zID0gW107XG4gIFx0XHRcdCRzY29wZS5idWRnZXRJdGVtcyA9IFtcbiAgXHRcdFx0XHR7bmFtZTogXCJlYXQgb3V0XCIsIGJ1ZGdldDogMTAwLCBzcGVudDogMzAgfSxcbiAgXHRcdFx0XHR7bmFtZTogXCJjbG90aGluZ1wiLCBidWRnZXQ6IDIwMCwgc3BlbnQ6IDkwfVxuICBcdFx0XHRdXG5cbiAgXHRcdFx0JHNjb3BlLmFkZE5ld0J1ZGdldEl0ZW0gPSBmdW5jdGlvbigpe1xuICBcdFx0XHRcdCRzY29wZS5idWRnZXRJdGVtcy5wdXNoKHtuYW1lOiAkc2NvcGUubmV3QnVkZ2V0SXRlbU5hbWUsIGJ1ZGdldDogMCwgc3BlbnQ6IDAgfSlcbiAgXHRcdFx0XHQkc2NvcGUubmV3QnVkZ2V0SXRlbU5hbWUgPSBcIlwiO1xuICBcdFx0XHR9XG5cbiAgICAgICAgJHNjb3BlLnB1cmNoYXNlcyA9IFtdXG4gICAgICAgICRzY29wZS5wdXJjaGFzZXMgPSBbe2NhdGVnb3J5OiBcImVhdCBvdXRcIn1dXG5cbiAgICAgICAgJHNjb3BlLmFkZFB1cmNoYXNlSXRlbSA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgfVxuXG5cbiAgICAgICAgJHNjb3BlLm1vbnRobHlPdmVydmlldyA9IHt9O1xuICAgICAgICAkc2NvcGUubW9udGhseU92ZXJ2aWV3LmJpbGxzVG90YWwgPSAwO1xuICAgICAgICAkc2NvcGUubW9udGhseU92ZXJ2aWV3LmJ1ZGdldFRvdGFsID0gMDtcbiAgICAgICAgJHNjb3BlLm1vbnRobHlPdmVydmlldy5idWRnZXRTcGVudFRvdGFsID0gMDtcbiAgICAgICAgJHNjb3BlLm1vbnRobHlPdmVydmlldy50b3RhbEVzdGltYXRlZEV4cGVuZGl0dXJlID0gMDtcblxuICAgICAgICBcbiAgICAgICAgJHNjb3BlLmNhbGN1bGF0ZUJpbGxzVG90YWwgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgdG90YWwgPSAwO1xuICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCAkc2NvcGUuYmlsbHMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgdG90YWwgPSB0b3RhbCArICRzY29wZS5iaWxsc1tpXS5jb3N0O1xuICAgICAgICAgIH1cbiAgICAgICAgICAkc2NvcGUubW9udGhseU92ZXJ2aWV3LmJpbGxzVG90YWwgPSB0b3RhbDtcbiAgICAgICAgICAkc2NvcGUuY2FsY3VsYXRlVG90YWxFeHBlbmRpdHVyZSgpXG4gICAgICAgICAgcmV0dXJuIHRvdGFsO1xuICAgICAgICB9XG5cbiAgICAgICAgXG5cbiAgICAgICAgJHNjb3BlLmNhbGN1bGF0ZUJ1ZGdldFRvdGFsID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIHRvdGFsID0gMDtcbiAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgJHNjb3BlLmJ1ZGdldEl0ZW1zLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIHRvdGFsID0gdG90YWwgKyAkc2NvcGUuYnVkZ2V0SXRlbXNbaV0uYnVkZ2V0O1xuICAgICAgICAgIH1cbiAgICAgICAgICAkc2NvcGUubW9udGhseU92ZXJ2aWV3LmJ1ZGdldFRvdGFsID0gdG90YWw7XG4gICAgICAgICAgJHNjb3BlLmNhbGN1bGF0ZVRvdGFsRXhwZW5kaXR1cmUoKVxuICAgICAgICAgIHJldHVybiB0b3RhbDsgICAgICAgXG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuY2FsY3VsYXRlQnVkZ2V0U3BlbnRUb3RhbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciB0b3RhbCA9IDA7XG4gICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8ICRzY29wZS5idWRnZXRJdGVtcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICB0b3RhbCA9IHRvdGFsICsgJHNjb3BlLmJ1ZGdldEl0ZW1zW2ldLnNwZW50O1xuICAgICAgICAgIH1cbiAgICAgICAgICAkc2NvcGUubW9udGhseU92ZXJ2aWV3LmJ1ZGdldFNwZW50VG90YWwgPSB0b3RhbDtcbiAgICAgICAgICAvLyRzY29wZS5jYWxjdWxhdGVUb3RhbEV4cGVuZGl0dXJlKClcbiAgICAgICAgICByZXR1cm4gdG90YWw7ICAgICAgIFxuICAgICAgICB9XG5cbiAgICAgICAgXG5cblxuXG4gICAgICAgJHNjb3BlLiR3YXRjaChcImJpbGxzXCIsICRzY29wZS5jYWxjdWxhdGVCaWxsc1RvdGFsLCB0cnVlKVxuICAgICAgICRzY29wZS4kd2F0Y2goXCJidWRnZXRJdGVtc1wiLCAkc2NvcGUuY2FsY3VsYXRlQnVkZ2V0VG90YWwsIHRydWUpXG4gICAgICAgJHNjb3BlLiR3YXRjaChcImJ1ZGdldEl0ZW1zXCIsICRzY29wZS5jYWxjdWxhdGVCdWRnZXRTcGVudFRvdGFsLCB0cnVlKVxuXG4gICAgIC8vICRzY29wZS4kd2F0Y2goXCJidWRnZXRJdGVtc1wiLCAkc2NvcGUuY2FsY3VsYXRlQnVkZ2V0VG90YWwsIHRydWUpXG5cblxuICAgICAgICAkc2NvcGUuY2FsY3VsYXRlVG90YWxFeHBlbmRpdHVyZSA9IGZ1bmN0aW9uICAoKSB7XG4gICAgICAgICAgICAgJHNjb3BlLm1vbnRobHlPdmVydmlldy50b3RhbEVzdGltYXRlZEV4cGVuZGl0dXJlID0gJHNjb3BlLm1vbnRobHlPdmVydmlldy5iaWxsc1RvdGFsICsgJHNjb3BlLm1vbnRobHlPdmVydmlldy5idWRnZXRUb3RhbDtcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5jYWxjdWxhdGVCaWxsc1RvdGFsKCk7XG4gICAgICAgICRzY29wZS5jYWxjdWxhdGVCdWRnZXRUb3RhbCgpO1xuICAgICAgICAkc2NvcGUuY2FsY3VsYXRlQnVkZ2V0U3BlbnRUb3RhbCgpO1xuICAgICAgICAkc2NvcGUuY2FsY3VsYXRlVG90YWxFeHBlbmRpdHVyZSgpO1xuXG4gICAgICAgICRzY29wZS5sYWJlbHMgPSBbXCJCaWxsc1wiLCBcIkJ1ZGdldFwiLCBcIlJlbWFpbmluZ1wiXTtcbiAgICAgICAgJHNjb3BlLmRhdGEgPSBbJHNjb3BlLm1vbnRobHlPdmVydmlldy5iaWxsc1RvdGFsLFxuICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUubW9udGhseU92ZXJ2aWV3LmJ1ZGdldFRvdGFsLFxuICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuaW5jb21lLm1vbnRobHkgLSAkc2NvcGUubW9udGhseU92ZXJ2aWV3LnRvdGFsRXN0aW1hdGVkRXhwZW5kaXR1cmVdO1xuXG5cblxuXG5cblx0fVxuXG59KSgpO1xuXG5cbiIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdub3RlcycpXG4gICAgLmRpcmVjdGl2ZSgnbm90ZUNhcmQnLCBub3RlQ2FyZCk7XG5cbmZ1bmN0aW9uIG5vdGVDYXJkKCkge1xuXHRyZXR1cm57XG5cdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHRzY29wZToge1xuXHRcdFx0ZGF0YTogXCI9XCIsXG5cdFx0XHRkcmFnZ2FibGU6IFwiPVwiXG5cdFx0fSxcblx0XHRyZXBsYWNlOiB0cnVlLFxuXHRcdHRlbXBsYXRlOiBcIjxoMT57e2RvZ3N9fXt7ZHJhZ1N0YXR1c319PC9oMT5cIixcblx0XHRsaW5rOiBmdW5jdGlvbihzY29wZSxlbGVtZW50KXtcblx0XHRcdGVsZW1lbnQuY2xpY2soZnVuY3Rpb24oKXtcblx0XHRcdFx0Y29uc29sZS5sb2coZWxlbWVudClcblx0XHRcdFx0ZWxlbWVudFswXS5kcmFnZ2FibGUgPSB0cnVlO1xuXHRcdFx0fSlcblx0XHR9LFxuXHRcdGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSl7XG5cdFx0XHQvL2FsZXJ0KFwiY29udHJvbGxlclwiKTtcblx0XHRcdCRzY29wZS5kb2dzID0gJHNjb3BlLmRhdGEgKyBcImRvZ3NcIjtcblx0XHRcdGlmKCRzY29wZS5kcmFnZ2FibGUpXG5cdFx0XHRcdCRzY29wZS5kcmFnU3RhdHVzID0gZmFsc2U7XG5cdFx0XHRlbHNlICRzY29wZS5kcmFnU3RhdHVzID0gdHJ1ZTtcblxuXHRcdFx0XG5cdFx0fVxuXHR9XG59XG5cblxuXG4vLyBhbmd1bGFyXG4vLyAgICAgLm1vZHVsZSgnbm90ZXMnKVxuLy8gICAgIC5kaXJlY3RpdmUoJ25vdGVDYXJkJywgbm90ZUNhcmQpO1xuXG4vLyBmdW5jdGlvbiBub3RlQ2FyZCgpIHtcbi8vIFx0cmV0dXJue1xuLy8gXHRcdHJlc3RyaWN0OiAnRScsXG4vLyBcdFx0Y29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKXtcbi8vIFx0XHRcdGFsZXJ0KFwiY29udHJvbGxlclwiKTtcbi8vIFx0XHRcdGNvbnNvbGUubG9nKCdkb2cnKVxuLy8gXHRcdH0sXG4vLyBcdFx0dGVtcGxhdGVVcmw6ICcnLFxuLy8gXHRcdHJlcGxhY2U6IHRydWVcbi8vIFx0XHQvLyBzY29wZToge31cbi8vIFx0fVxuLy8gfSIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdub3RlcycpXG4gICAgLmRpcmVjdGl2ZSgnbm90ZUNhcmRzJywgbm90ZUNhcmRzKVxuXG5cbiAgICBcblxuZnVuY3Rpb24gbm90ZUNhcmRzKCkge1xuXHRyZXR1cm57XG5cdFx0cmVzdHJpY3Q6ICdBRScsXG5cdFx0c2NvcGU6IHtcblx0XHRcdG5vdGVzOiBcIj1cIixcblx0XHRcdG5ld0l0ZW06IFwiPVwiXG5cdFx0fSxcblx0XHRyZXBsYWNlOiBmYWxzZSxcblx0XHR0cmFuc2NsdWRlOiBmYWxzZSxcblx0XHR0ZW1wbGF0ZVVybDogXCJjb21wb25lbnRzL25vdGVzL3ZpZXdzL25vdGUuZGlyZWN0aXZlLnZpZXcuaHRtbFwiLFxuXHRcdGxpbms6IGZ1bmN0aW9uKHNjb3BlLGVsZW1lbnQsYXR0cnMpe1xuXHRcdFx0Ly8kKCBcIiNzb3J0YWJsZVwiICkuc29ydGFibGUoKTtcblx0XHRcdC8vY29uc29sZS5sb2coc2NvcGUpXG5cdFx0XHQvL2NvbnNvbGUubG9nKGVsZW1lbnQpXG5cdFx0XHQvL2NvbnNvbGUubG9nKGF0dHJzKVxuXHRcdFx0Ly9lbGVtZW50LnNvcnRhYmxlKCk7XG5cdFx0XHQvL2NvbnNvbGUubG9nKHNjb3BlLm5vdGVzKVxuXHRcdFx0c2NvcGUuZG9ncyA9IGZ1bmN0aW9uKG5vdGUpe1xuXHRcdFx0XHRjb25zb2xlLmxvZyhub3RlKVxuXHRcdFx0fVxuXG5cblx0XHRcdGVsZW1lbnQuc29ydGFibGUoe1xuXHRcdCAgICAgICAvLyBwbGFjZWhvbGRlcjogXCJ1aS1zdGF0ZS1oaWdobGlnaHRcIixcblx0XHQgICAgICAgIHN0YXJ0OiBmdW5jdGlvbihldmVudCwgdWkpIHtcblx0XHQgICAgICAgICAgICB2YXIgc3RhcnRfcG9zID0gdWkuaXRlbS5pbmRleCgpO1xuXHRcdCAgICAgICAgICAgIHVpLml0ZW0uZGF0YSgnc3RhcnRfcG9zJywgc3RhcnRfcG9zKTtcblx0XHQgICAgICAgIH0sXG5cdFx0ICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uKGV2ZW50LCB1aSkge1xuXHRcdCAgICAgICAgICAgIHZhciBzdGFydF9wb3MgPSB1aS5pdGVtLmRhdGEoJ3N0YXJ0X3BvcycpO1xuXHRcdCAgICAgICAgICAgIHZhciBlbmRfcG9zID0gdWkuaXRlbS5pbmRleCgpO1xuXHRcdCAgICAgICAgICAgIC8vY29uc29sZS5sb2coc3RhcnRfcG9zICsgJyAtICcgKyBlbmRfcG9zKTtcblx0XHQgICAgICAgICAgXG5cdFx0ICAgICAgICAgIHZhciBzdGFydEl0ZW0gPSBzY29wZS5ub3Rlc1tzdGFydF9wb3NdO1xuXHRcdCAgICAgICAgICAgc2NvcGUubm90ZXMuc3BsaWNlKHN0YXJ0X3BvcywxKVxuXHRcdCAgICAgICAgICAgc2NvcGUubm90ZXMuc3BsaWNlKGVuZF9wb3MsMCwgc3RhcnRJdGVtKVxuXHRcdCAgICAgICAgICAgc2NvcGUuJGFwcGx5KCk7XG5cblx0XHQgICAgICAgICAgIC8vY29uc29sZS5sb2coc2NvcGUubm90ZXMpXG5cdFx0ICAgICAgICAgICBcblx0XHQgICAgICAgICAgIFxuXHRcdCAgICAgICAgfVxuXHRcdCAgICB9KTsgLy8gZW5kIHNvcnRhYmxlXG5cblx0XHQgICBcblxuXHRcdCAgICBjb25zb2xlLmxvZyhlbGVtZW50KVxuXG5cblx0XHR9LFxuXHRcdGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSl7XG5cdFx0XHQkc2NvcGUuZm9ybSA9e31cblx0XHRcdCRzY29wZS5hZGRJdGVtID0gZnVuY3Rpb24oaW5kZXgsaXRlbSl7XG5cdFx0XHRcdC8vYWxlcnQoaW5kZXgpXG5cdFx0XHRcdGNvbnNvbGUubG9nKCRzY29wZS5uZXdJdGVtKVxuXHRcdFx0XHQkc2NvcGUubm90ZXNbaW5kZXhdLml0ZW1zLnB1c2goaXRlbSlcblx0XHRcdFx0JHNjb3BlLmZvcm0gPSB7fVxuXHRcdFx0XHQvL2NvbnNvbGUubG9nKCRzY29wZS5ub3Rlc1tpbmRleF0uaXRlbXMpXG5cdFx0XHR9XG5cblx0XHRcdCRzY29wZS5kZWxldGVOb3RlID0gZnVuY3Rpb24oaW5kZXgpe1xuXHRcdFx0XHQkc2NvcGUubm90ZXMuc3BsaWNlKGluZGV4LDEpO1xuXHRcdFx0fVxuXG5cblx0XHRcdC8vYWxlcnQoXCJjb250cm9sbGVyXCIpO1xuXHRcdFx0Ly8gJHNjb3BlLmRvZ3MgPSAkc2NvcGUuZGF0YSArIFwiZG9nc1wiO1xuXHRcdFx0Ly8gaWYoJHNjb3BlLmRyYWdnYWJsZSlcblx0XHRcdC8vIFx0JHNjb3BlLmRyYWdTdGF0dXMgPSBmYWxzZTtcblx0XHRcdC8vIGVsc2UgJHNjb3BlLmRyYWdTdGF0dXMgPSB0cnVlO1xuXG5cdFx0XHRcblx0XHR9XG5cdH1cbn0gLy9lbmQgbm90ZWNhcmRzIGRpcmVjdGl2ZVxuXG5hbmd1bGFyXG5cdC5tb2R1bGUoJ25vdGVzJylcblx0LmRpcmVjdGl2ZSgnbm90ZUNhcmQnLCBub3RlQ2FyZClcblxuZnVuY3Rpb24gbm90ZUNhcmQoKSB7XG5cblx0dmFyIHRlbXBEYXRhID0ge307XG5cdHZhciB0ZW1wTm90ZSA9IG51bGw7XG5cblx0cmV0dXJue1xuXHRcdHJlc3RyaWN0OiAnQUUnLFxuXHRcdHNjb3BlOiB7XG5cdFx0XHRub3RlOiBcIj1cIixcblx0XHRcdG5vdGVzOiBcIj1cIlxuXHRcdH0sXG5cdFx0cmVwbGFjZTogdHJ1ZSxcblx0XHR0cmFuc2NsdWRlOiBmYWxzZSxcblx0XHR0ZW1wbGF0ZVVybDogXCJjb21wb25lbnRzL25vdGVzL3ZpZXdzL25vdGVzLml0ZW1zLnZpZXcuaHRtbFwiLFxuXHRcdGxpbms6IGZ1bmN0aW9uKHNjb3BlLGVsZW1lbnQsYXR0cnMpe1xuXHRcdFx0Ly8kKCBcIiNzb3J0YWJsZVwiICkuc29ydGFibGUoKTtcblx0XHRcdC8vY29uc29sZS5sb2coc2NvcGUpXG5cdFx0XHQvL2NvbnNvbGUubG9nKGVsZW1lbnQpXG5cdFx0XHQvL2NvbnNvbGUubG9nKGF0dHJzKVxuXHRcdFx0Ly9lbGVtZW50LnNvcnRhYmxlKCk7XG5cdFx0XHQvL2NvbnNvbGUubG9nKHNjb3BlLm5vdGVzKVxuXHRcdFx0Ly9zY29wZS4kd2F0Y2goJ25vdGVzJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgLy8gYWxsIHRoZSBjb2RlIGhlcmUuLi5cbiAgICBcdFx0XG4gICAgXHRcdFxuXHRcdFx0XG5cblx0XHRcdGVsZW1lbnQuc29ydGFibGUoe1xuXHRcdFx0XHRjb25uZWN0V2l0aDogXCIuY29ubmVjdGVkU29ydGFibGVcIixcblx0XHQgICAgICAgLy9wbGFjZWhvbGRlcjogXCJ1aS1zdGF0ZS1oaWdobGlnaHRcIixcblx0XHQgICAgICAgIHN0YXJ0OiBmdW5jdGlvbihldmVudCwgdWkpIHtcblx0XHQgICAgICAgIFx0Y29uc29sZS5sb2coXCJTVEFSVCBTVEFSVCBTVEFSVCBTVEFSVCBTVEFSVFwiKVxuXHRcdCAgICAgICAgXHRjb25zb2xlLmxvZyhlbGVtZW50KVxuXHRcdCAgICAgICAgXHRjb25zb2xlLmxvZyh0ZW1wRGF0YSlcblx0XHQgICAgICAgIFx0XG5cblx0XHQgICAgICAgIFx0dGVtcERhdGEuc3RhcnROb3RlID0gYW5ndWxhci5jb3B5KHNjb3BlLm5vdGUpO1xuXHRcdCAgICAgICAgXHR0ZW1wRGF0YS5zdGFydE5vdGVJbmRleCA9IGF0dHJzLm5vdGVpbmRleDtcblx0XHRcdFx0XHR0ZW1wRGF0YS5zdGFydE5vdGVJdGVtSW5kZXggPSB1aS5pdGVtLmluZGV4KCk7XG5cdFx0XHRcdFx0dGVtcERhdGEuc3RhcnROb3RlSXRlbUNvbnRlbnQgPSB0ZW1wRGF0YS5zdGFydE5vdGUuaXRlbXNbdGVtcERhdGEuc3RhcnROb3RlSXRlbUluZGV4XTtcblx0XHQgICBcdFx0XHRcblx0XHQgICBcdFx0XHR0ZW1wTm90ZSA9IGFuZ3VsYXIuY29weShzY29wZS5ub3RlKVxuXHRcdCAgIFx0XHRcdGNvbnNvbGUubG9nKHRlbXBOb3RlKVxuXG5cdFx0ICAgICAgICB9LFxuXHRcdCAgICAgICAgdXBkYXRlOiBmdW5jdGlvbihldmVudCwgdWkpIHtcblxuXHRcdCAgICAgICAvLyBjb25zb2xlLmxvZyhzY29wZS50ZW1wRGF0YSlcdFxuXHQgICAgICAgICBcdGlmICghdWkuc2VuZGVyKSB7XHRcdCAgICAgICBcblx0XHRcdCAgICAgICAgIGNvbnNvbGUubG9nKFwiVVBEQVRFIFVQREFURSBVUERBVEUgVVBEQVRFIFVQREFURSBJTlNJREUgSUZcIiApXG5cblx0XHRcdCAgICAgICAgXG5cdFx0XHRcdFx0XHRcdFx0ICAgICAgICAgXG5cblx0XHRcdFx0XHR2YXIgc3RhcnRfcG9zID0gdGVtcERhdGEuc3RhcnROb3RlSXRlbUluZGV4O1xuXHRcdFx0XHRcdHZhciBlbmRfcG9zID0gdWkuaXRlbS5pbmRleCgpO1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKHN0YXJ0X3BvcyArICcgLSAnICsgZW5kX3Bvcyk7XG5cblx0XHRcdFx0XHR0ZW1wTm90ZS5pdGVtcy5zcGxpY2Uoc3RhcnRfcG9zLDEpXG5cdFx0XHRcdFx0dGVtcE5vdGUuaXRlbXMuc3BsaWNlKGVuZF9wb3MsMCwgdGVtcERhdGEuc3RhcnROb3RlSXRlbUNvbnRlbnQpXG5cdFx0XHRcdFx0Ly9zY29wZS5ub3RlID0gdGVtcE5vdGVcblx0XHRcdFx0XHRzY29wZS5ub3Rlc1t0ZW1wRGF0YS5zdGFydE5vdGVJbmRleF0gPSB0ZW1wTm90ZTtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhzY29wZS5ub3RlcylcblxuXHRcdFx0XHRcdHZhciByYXN0ID0ge1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyYWRzQG5qaXQuZWR1XCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcInMxXCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwibGF1bnNkcnlcIiwgXCJhcHNwbHkgam9ic1wiLCBcImdzeW1cIiBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjEvMS8yMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMS8yMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96c2UuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9XG5cblx0XHRcdFx0XHQvL3Njb3BlLm5vdGVzWzBdLml0ZW1zLnB1c2goXCJQVUNLU1wiKVxuXG5cdFx0XHRcdFx0c2NvcGUuJGFwcGx5KCk7XG5cblx0XHQgICAvLyAgICAgICAgIC8vY29uc29sZS5sb2coc2NvcGUubm90ZXMpXG5cdFx0XHQgICAgfSAgIFxuXHRcdCAgICAgICAgICAgXG5cdFx0ICAgICAgICB9LCAvL2VuZCB1cGRhdGVcblx0XHQgICAgICAgIHJlY2VpdmU6IGZ1bmN0aW9uKGV2ZW50LCB1aSl7XG5cdFx0ICAgICAgICBcdGNvbnNvbGUubG9nKFwiUkVDRUlWRSBSRUNFSVZFIFJFQ0VJVkUgUkVDRUlWRSBSRUNFSVZFXCIpXG5cdFx0ICAgICAgICBcdGNvbnNvbGUubG9nKHRlbXBEYXRhKVxuXG5cdFx0ICAgICAgICBcdHRlbXBEYXRhLmVuZE5vdGUgPSBhbmd1bGFyLmNvcHkoc2NvcGUubm90ZSk7XG5cdFx0ICAgICAgICBcdHRlbXBEYXRhLmVuZE5vdGVJbmRleCA9IGF0dHJzLm5vdGVpbmRleDtcblx0XHRcdFx0XHR0ZW1wRGF0YS5lbmROb3RlSXRlbUluZGV4ID0gdWkuaXRlbS5pbmRleCgpO1xuXG5cdFx0XHRcdFx0XG5cblx0XHRcdFx0XHQgIC8vY29uc29sZS5sb2coXCJyZW1vdmluZyBpdGVtOiBcIiArIHNjb3BlLm5vdGVzW25vdGVPcmlnaW5JbmRleF0uaXRlbXNbc3RhcnRfcG9zXSk7XG5cdFx0ICAgICAgICAgICB0ZW1wRGF0YS5zdGFydE5vdGUuaXRlbXMuc3BsaWNlKHRlbXBEYXRhLnN0YXJ0Tm90ZUl0ZW1JbmRleCwxKVxuXHRcdFx0ICAgICAgIHRlbXBEYXRhLmVuZE5vdGUuaXRlbXMuc3BsaWNlKHRlbXBEYXRhLmVuZE5vdGVJdGVtSW5kZXgsMCx0ZW1wRGF0YS5zdGFydE5vdGVJdGVtQ29udGVudClcblx0XHRcdCAgICAgICBjb25zb2xlLmxvZyh0ZW1wRGF0YSlcblxuXHRcdFx0ICAgICAgIHNjb3BlLm5vdGVzW3RlbXBEYXRhLnN0YXJ0Tm90ZUluZGV4XSA9IHRlbXBEYXRhLnN0YXJ0Tm90ZTtcblx0XHRcdCAgICAgICBzY29wZS5ub3Rlc1t0ZW1wRGF0YS5lbmROb3RlSW5kZXhdID0gdGVtcERhdGEuZW5kTm90ZTtcblx0ICAgICAgICAgICBcdFxuXHQgICAgICAgICAgIFx0XHRjb25zb2xlLmxvZyh0ZW1wRGF0YS5zdGFydE5vdGUuaXRlbXMpXG5cdCAgICAgICAgICAgXHRcdGNvbnNvbGUubG9nKHRlbXBEYXRhLmVuZE5vdGUuaXRlbXMpXG5cblx0XHQgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJhZGRpbmcgYWZ0ZXIgcG9zaXRpb246IFwiICsgZW5kX3Bvcylcblx0XHQgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJhZGRpbmcgYWZ0ZXI6IFwiICsgc2NvcGUubm90ZXNbbm90ZURlc3RpbmF0aW9uSW5kZXhdLml0ZW1zW2VuZF9wb3NdKVxuXHRcdCAgICAgICAgICAgLy9zY29wZS5ub3Rlc1tub3RlRGVzdGluYXRpb25JbmRleF0uaXRlbXMuc3BsaWNlKGVuZF9wb3MsMCwgc3RhcnRJdGVtKVxuXG5cdFx0ICAgICAgICBcdC8vc2NvcGUudGVtcERhdGEgPSBcInByYXduc1wiO1xuXHRcdCAgICAgICAgXHRcblx0XHQgICAgICAgIFx0XG5cdFx0ICAgICAgICBcdC8vIGNvbnNvbGUubG9nKHRlbXBEYXRhKVxuXHRcdCAgICAgICAgXHQvLyAvL2NvbnNvbGUubG9nKHNjb3BlLm5vdGUpO1xuXHRcdCAgICAgICAgXHR2YXIgcmFzdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMmFkc0Buaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJzMVwiLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImxhdW5zZHJ5XCIsIFwiYXBzcGx5IGpvYnNcIiwgXCJnc3ltXCIgXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIxLzEvMjIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjEvMjIvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvenNlLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICAgICAgfVxuXHRcdCAgICAgICAgXHRcblx0XHQgICAgICAgICAgIHNjb3BlLiRhcHBseSgpO1xuXHRcdFxuXG5cdFx0ICAgICAgICB9XG5cblx0XHQgICAgfSk7IC8vIGVuZCBzb3J0YWJsZVxuXG5cdFx0IC8vICB9KTsgLy9lbmQgd2F0Y2hcblxuXG5cblx0XHR9LFxuXHRcdGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSl7XG5cblx0XHRcdCRzY29wZS5tb29zZSA9IFwiZGluZ1wiXG5cdFx0XHQkc2NvcGUuZGVsZXRlSXRlbSA9IGZ1bmN0aW9uKHBhcmVudEluZGV4LCBpbmRleCl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKHBhcmVudEluZGV4KVxuXHRcdFx0XHRjb25zb2xlLmxvZyhpbmRleClcblx0XHRcdFx0JHNjb3BlLm5vdGVzW3BhcmVudEluZGV4XS5pdGVtcy5zcGxpY2UoaW5kZXgsMSlcblxuXHRcdFx0fVxuXG5cdFx0XHQkc2NvcGUucmFuZG9tSWQgPSBmdW5jdGlvbihpdGVtKXtcbiAgIFx0XHRcdCByZXR1cm4gXCJJRFwiICsgaXRlbSArIChNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogOTk5KSArIDEpKTtcblx0XHRcdH1cblx0XHRcdC8vYWxlcnQoXCJjb250cm9sbGVyXCIpO1xuXHRcdFx0Ly8gJHNjb3BlLmRvZ3MgPSAkc2NvcGUuZGF0YSArIFwiZG9nc1wiO1xuXHRcdFx0Ly8gaWYoJHNjb3BlLmRyYWdnYWJsZSlcblx0XHRcdC8vIFx0JHNjb3BlLmRyYWdTdGF0dXMgPSBmYWxzZTtcblx0XHRcdC8vIGVsc2UgJHNjb3BlLmRyYWdTdGF0dXMgPSB0cnVlO1xuXG5cdFx0XHRjb25zb2xlLmxvZygkc2NvcGUpXG5cblx0XHRcdFxuXHRcdH1cblx0fVxufSAvL2VuZCBub3RlY2FyZCBkaXJlY3RpdmVcblxuXG5cblxuXG4iLCIoZnVuY3Rpb24oKXtcblx0J3VzZSBzdHJpY3QnXG5cblx0YW5ndWxhclxuICAgIFx0Lm1vZHVsZSgnYnVkZ2V0JylcbiAgICBcdC5mYWN0b3J5KCdidWRnZXRTZXJ2aWNlJywgYnVkZ2V0U2VydmljZSk7XG5cbiAgICBidWRnZXRTZXJ2aWNlLiRpbmplY3QgPSBbJyRodHRwJ11cblxuICAgIGZ1bmN0aW9uIGJ1ZGdldFNlcnZpY2UoJGh0dHApIHtcbiAgICBcdHZhciBzZXJ2aWNlID0ge1xuXG4gICAgICAgICAgICBnZXROb3RlOiBnZXROb3RlLFxuICAgICAgICAgICAgZ2V0Tm90ZXM6IGdldE5vdGVzLFxuICAgICAgICAgICAgc2F2ZU5vdGVzOiBzYXZlTm90ZXNcblxuXG4gICAgXHR9O1xuXG4gICAgXHRyZXR1cm4gc2VydmljZTtcblxuICAgIFx0Ly8vLy8vLy8vLy8vXG5cbiAgICAgICAgLy8gZ2V0cyBhIHNpbmdsZSBub3RlXG4gICAgICAgIGZ1bmN0aW9uIGdldE5vdGUgKCkge1xuXG4gICAgICAgICAgICB2YXIgbm90ZSA9IHtcbiAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyQG5qaXQuZWR1XCIsXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwidG9kb1wiLFxuICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwibGF1bmRyeVwiLCBcImFwcGx5IGpvYnNcIiwgXCJneW1cIiBdLFxuICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMS8xLzIwMTZcIixcbiAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMS8yLzIwMTZcIixcbiAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvemUuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG5vdGU7XG5cbiAgICAgICAgfSAvL2VuZCBnZXROb3RlKClcblxuXG4gICAgICAgIC8vIGdldHMgYWxsIG5vdGVzXG4gICAgICAgIGZ1bmN0aW9uIGdldE5vdGVzICgpIHtcblxuICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnaHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaS9ub3Rlcy9nZXROb3Rlcycse2VtYWlsOlwibW9pekBnbWFpbC5jb21cIn0pXG4gICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIG5vdGVzID0gW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMkBuaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCIxXCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwibGF1bmRyeVwiLCBcImFwcGx5IGpvYnNcIiwgXCJneW1cIiBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjEvMS8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIxLzIvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvemUuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMkBuaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCIyXCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwiaHRtbDUgZHJhZyBhbmQgZHJvcFwiLCBcInNvY2tldC5pb1wiLCBcIm5vZGVqc1wiIF0sXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMi8xLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjIvMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96ZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyQG5qaXQuZWR1XCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIjNcIixcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJib3NlIGhlYWRwaG9uZXNcIiwgXCIyMDE2IGhvbmRhIGdyaWxsXCIsIFwic29saWQgc3RhdGUgaGFyZCBkcml2ZVwiIF0sXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMS8xLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjEvMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96ZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyQG5qaXQuZWR1XCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIjRcIixcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJsYXVuZHJ5XCIsIFwiYXBwbHkgam9ic1wiLCBcImd5bVwiIF0sXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMS8xLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjEvMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96ZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyQG5qaXQuZWR1XCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIjVcIixcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJodG1sNSBkcmFnIGFuZCBkcm9wXCIsIFwic29ja2V0LmlvXCIsIFwibm9kZWpzXCIgXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIyLzEvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMi8yLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3plLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiNlwiLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImJvc2UgaGVhZHBob25lc1wiLCBcIjIwMTYgaG9uZGEgZ3JpbGxcIiwgXCJzb2xpZCBzdGF0ZSBoYXJkIGRyaXZlXCIgXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIxLzEvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMS8yLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3plLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiN1wiLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImxhdW5kcnlcIiwgXCJhcHBseSBqb2JzXCIsIFwiZ3ltXCIsXCJib3NlIGhlYWRwaG9uZXNcIiwgXCIyMDE2IGhvbmRhIGdyaWxsXCIsIFwic29saWQgc3RhdGUgaGFyZCBkcml2ZVwiICBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjEvMS8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIxLzIvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvemUuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMkBuaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCI4XCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwiaHRtbDUgZHJhZyBhbmQgZHJvcFwiLCBcInNvY2tldC5pb1wiLCBcIm5vZGVqc1wiIF0sXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMi8xLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjIvMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96ZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyQG5qaXQuZWR1XCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIjlcIixcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJib3NlIGhlYWRwaG9uZXNcIiwgXCIyMDE2IGhvbmRhIGdyaWxsXCIsIFwic29saWQgc3RhdGUgaGFyZCBkcml2ZVwiLFwiaHRtbDUgZHJhZyBhbmQgZHJvcFwiLCBcInNvY2tldC5pb1wiLCBcIm5vZGVqc1wiICBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjEvMS8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIxLzIvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvemUuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdIC8vZW5kIG5vdGVzIGFycmF5XG5cbiAgICAgICAgICAgIC8vcmV0dXJuIG5vdGVzXG4gICAgICAgIH0gLy9lbmQgZ2V0IG5vdGVzXG5cbiAgICAgICAgZnVuY3Rpb24gc2F2ZU5vdGVzKG5vdGVzKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnaHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaS9ub3Rlcy91cGRhdGVOb3Rlcycse2VtYWlsOlwibW9pekBnbWFpbC5jb21cIixub3Rlczogbm90ZXN9KVxuICAgICAgICB9XG5cblxuXG4gICAgfVxuXG5cdFxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCdcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnbWVtYmVycycpXG5cdFx0LmNvbnRyb2xsZXIoJ21lbWJlcnNDdHJsJywgbWVtYmVyc0N0cmwpXG5cblx0bWVtYmVyc0N0cmwuJGluamVjdCA9IFsnJGh0dHAnXVxuXG5cdGZ1bmN0aW9uIG1lbWJlcnNDdHJsKCRodHRwKSB7XG5cblx0ICAgIHZhciB2bSA9IHRoaXM7XG5cblx0ICAgIHZtLm1lbWJlcnNDb250ZW50ID0gbWVtYmVyc0NvbnRlbnQoKTtcblx0ICAgIHZtLmdvdG9TZXNzaW9uID0gZ290b1Nlc3Npb247XG5cdCAgICB2bS5yZWZyZXNoID0gcmVmcmVzaDtcblx0ICAgIHZtLnNlYXJjaCA9IHNlYXJjaDtcblx0ICAgIHZtLnNlc3Npb25zID0gW107XG5cdCAgICB2bS50aXRsZSA9ICdtZW1iZXJzJztcblxuXHQgICAgLy8vLy8vLy8vLy8vXG5cblx0ICAgIGZ1bmN0aW9uIG1lbWJlcnNDb250ZW50KCl7XG5cdCAgICBcdCAvLyAkaHR0cC5nZXQoJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGkvdXNlcnMvYWxsJylcblx0ICAgIFx0XHQvLyAudGhlbihmdW5jdGlvbihyZXMpe1xuXHQgICAgXHRcdC8vIFx0Y29uc29sZS5sb2cocmVzLmRhdGEpXG5cdCAgICBcdFx0Ly8gXHR2bS5tZW1iZXJzQ29udGVudCA9IHJlcy5kYXRhO1xuXHQgICAgXHRcdC8vIH0sXG5cdCAgICBcdFx0Ly8gZnVuY3Rpb24oZXJyKXtcblx0ICAgIFx0XHQvLyBcdGNvbnNvbGUubG9nKGVyci5zdGF0dXMgKyBcIiBcIiArIGVyci5zdGF0dXNUZXh0KTtcblx0ICAgIFx0XHQvLyBcdHZtLm1lbWJlcnNDb250ZW50ID0gZXJyLmRhdGE7XG5cdCAgICBcdFx0Ly8gfSlcblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gZ290b1Nlc3Npb24oKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIHJlZnJlc2goKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIHNlYXJjaCgpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblx0fVxuXG59KSgpO1xuXG5cbiIsIihmdW5jdGlvbigpe1xuXHQndXNlIHN0cmljdCdcblxuXHRhbmd1bGFyXG4gICAgXHQubW9kdWxlKCdzYW1wbGUnKVxuICAgIFx0LmZhY3RvcnkoJ3NhbXBsZVNlcnZpY2UnLCBzYW1wbGVTZXJ2aWNlKTtcblxuICAgLy8gc2FtcGxlU2VydmljZS5pbmplY3QgPSBbJyddXG5cbiAgICBmdW5jdGlvbiBzYW1wbGVTZXJ2aWNlKCkge1xuICAgIFx0dmFyIHNlcnZpY2UgPSB7XG5cbiAgICBcdFx0ZXJyb3I6IGVycm9yLFxuICAgIFx0XHRpbmZvOiBpbmZvLFxuICAgIFx0XHRzdWNjZXNzOiBzdWNjZXNzXG5cbiAgICBcdH07XG5cbiAgICBcdHJldHVybiBzZXJ2aWNlO1xuXG4gICAgXHQvLy8vLy8vLy8vLy9cblxuICAgIFx0ZnVuY3Rpb24gZXJyb3IoKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIGluZm8oKSB7XG5cdCAgICAgIC8qICovXG4gICAgICAgICAgLy9jb25zb2xlLmxvZyhcInNhbXBsZVNlcnZpY2VcIik7XG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIHN1Y2Nlc3MoKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cblxuICAgIH1cblxuXHRcblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0J3VzZSBzdHJpY3QnXG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ25vdGVzJylcblx0XHQuY29udHJvbGxlcignbm90ZXNDdHJsJywgbm90ZXNDdHJsKVxuXG5cdG5vdGVzQ3RybC4kaW5qZWN0ID0gWydub3Rlc1NlcnZpY2UnLCckc2NvcGUnLCckaHR0cCcsJ3RvYXN0cicsJyR3aW5kb3cnXVxuXG5cdGZ1bmN0aW9uIG5vdGVzQ3RybChub3Rlc1NlcnZpY2UsJHNjb3BlLCAkaHR0cCwgdG9hc3RyLCAkd2luZG93KSB7XG5cdFx0dmFyIHZtID0gdGhpcztcblx0XHRjb25zb2xlLmxvZyhcIm5vdGVzIGJhbGxzb3V0XCIpO1xuXG5cdFx0dm0uZ2V0Tm90ZXMgPSBnZXROb3Rlc0xpc3QoKTtcblx0XHR2bS5hbGxOb3RlcyA9IG51bGw7XG5cdFx0dm0uYWN0aXZlTm90ZXMgPSBbXTtcblx0XHQvL3ZtLmdldFNpbmdsZU5vdGUgPSBnZXRTaW5nbGVOb3RlO1xuXG5cblx0XHR2bS5zYXZlTm90ZSA9IHNhdmVOb3RlO1xuXHRcdHZtLmRlbGV0ZU5vdGUgPSBkZWxldGVOb3RlO1xuXHRcdHZtLnVwZGF0ZU5vdGVDb250ZW50ID0gdXBkYXRlTm90ZUNvbnRlbnQ7XG5cdFx0dm0ubmV3Tm90ZSA9IG5ld05vdGU7XG5cblx0XHR2bS5hY3RpdmF0ZSA9IGFjdGl2YXRlO1xuXHRcdHZtLmNsb3NlVGFiID0gY2xvc2VUYWI7XG5cdFx0XG5cdFx0dm0uc2hvd0xpc3QgPSB0cnVlO1xuXHRcdHZtLmdyaWRNb2RlID0gdHJ1ZTtcblxuICBcblx0ICBcdCRzY29wZS50aW55bWNlT3B0aW9ucyA9IHtcblx0XHQgICAgcGx1Z2luczogJ2xpbmsgaW1hZ2UgY29kZScsXG5cdFx0ICAgIHRvb2xiYXI6ICd1bmRvIHJlZG8gfCBib2xkIGl0YWxpYyB8IGFsaWdubGVmdCBhbGlnbmNlbnRlciBhbGlnbnJpZ2h0IHwgY29kZSB8IHBhc3RlJ1xuXHRcdCAgfTtcblxuXHRcdCRzY29wZS50aXRsZSA9IFwicmF0c3RzXCI7XG5cdFx0JHNjb3BlLmRvZ3MgPVwiZnJvYWRzYXNkZmFkc2dzXCJcblx0XHR2bS50aW55bWNlTW9kZWwgPSAnSW5pdGlhbCBjb25zZHNkdGVudCc7XG5cblxuXHRcdFxuXG5cdFx0ZnVuY3Rpb24gZ2V0Tm90ZXNMaXN0KCkge1xuXHRcdFx0bm90ZXNTZXJ2aWNlLmdldE5vdGVzTGlzdCgpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRcdHZtLmFsbE5vdGVzID0gZGF0YS5kYXRhLm5vdGVzO1xuXHRcdFx0XHQvL2NvbnNvbGUubG9nKHZtLmFsbE5vdGVzKTtcblx0XHRcdH0pXG5cdFx0fVxuXG5cdFx0Ly8gZnVuY3Rpb24gZ2V0U2luZ2xlTm90ZShub3RlSWQpIHtcblx0XHQvLyBcdCBub3Rlc1NlcnZpY2UuZ2V0U2luZ2xlTm90ZShub3RlSWQpLnRoZW4oZnVuY3Rpb24oKXtcblx0XHQvLyBcdCBcdHJldHVybiBkYXRhLmRhdGE7XG5cdFx0Ly8gXHQgfSlcblxuXHRcdC8vIH1cblxuXG5cdCAgICBmdW5jdGlvbiBhY3RpdmF0ZShub3RlSWQpIHtcblx0ICAgIFx0dmFyIHBlcm1pc3Npb25Ub0FjdGl2YXRlID0gdHJ1ZTtcbiAgICBcdFx0Ly8gY2hlY2tzIGlmIHRhYiBhbHJlYWR5IG9wZW5cbiAgICBcdFx0aWYodm0uYWN0aXZlTm90ZXMubGVuZ3RoID4gMCAmJiB2bS5hY3RpdmVOb3Rlcy5sZW5ndGggIT09IDQgKXtcbiAgICBcdFx0XHRjb25zb2xlLmxvZygnbG9vcGluZycpXG5cdCAgICBcdFx0YW5ndWxhci5mb3JFYWNoKHZtLmFjdGl2ZU5vdGVzLCBmdW5jdGlvbih2YWx1ZSkge1xuXHQgICAgXHRcdFx0Y29uc29sZS5sb2codmFsdWUuX2lkLnRvU3RyaW5nKCkpO1xuXHQgICAgXHRcdFx0Y29uc29sZS5sb2cobm90ZUlkLnRvU3RyaW5nKCkpO1xuXHRcdFx0XHQgIGlmKHZhbHVlLl9pZC50b1N0cmluZygpID09IG5vdGVJZC50b1N0cmluZygpKXtcblx0XHRcdFx0ICBcdHBlcm1pc3Npb25Ub0FjdGl2YXRlID0gZmFsc2U7XG5cdFx0XHRcdCAgXHR0b2FzdHIuZXJyb3IoXCJXaG9vcHMhIExvb2tzIGxpa2UgdGhpcyBub3RlIGlzIGFscmVhZHkgb3BlblwiKVxuXHRcdFx0XHQgIH1cblx0XHRcdFx0fSk7Ly9lbmQgZm9yZWFjaFxuXHRcdFx0fVxuXHRcdCAgICBpZih2bS5hY3RpdmVOb3Rlcy5sZW5ndGggPT0gNCl7XG5cdFx0ICAgIFx0XHRjb25zb2xlLmxvZyhcImNoZWNraW5nIG1heFwiKTtcblx0XHQgICAgXHRcdHBlcm1pc3Npb25Ub0FjdGl2YXRlID0gZmFsc2U7XG5cdFx0ICAgIFx0XHR0b2FzdHIuZXJyb3IoXCJXaG9vcHMhIExvb2tzIGxpa2UgeW91IGhhdmUgcmVhY2hlZCB0aGUgbWF4IG51bWJlciBvZiB0YWJzKDQpXCIpXG5cdFx0ICAgIH1cblx0XHRcblx0ICAgIFx0aWYocGVybWlzc2lvblRvQWN0aXZhdGUgPT0gdHJ1ZSl7XG5cdFx0XHQgIFx0Y29uc29sZS5sb2coXCJlbHNlIHB1c2hpbmdcIik7XG5cdFx0XHQgIFx0Y29uc29sZS5sb2cobm90ZUlkKVxuXHRcdFx0ICBcdG5vdGVzU2VydmljZS5nZXRTaW5nbGVOb3RlKG5vdGVJZCkudGhlbihmdW5jdGlvbihyZXMpe1xuXHRcdFx0ICBcdFx0dmFyIG5vdGUgPSByZXMuZGF0YS5kYXRhO1xuXHRcdFx0ICBcdFx0dm0uYWN0aXZlTm90ZXMucHVzaChub3RlKTtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyh2bS5hY3RpdmVOb3Rlcylcblx0XHRcdCAgXHR9KVxuXHRcdFx0ICBcdFxuXHRcdFx0fSBcblx0ICAgIFx0XG5cdCAgICB9IC8vZW5kIGZ1bmN0aW9uIGFjdGl2YXRlXG5cblx0ICAgIGZ1bmN0aW9uIGNsb3NlVGFiKGluZGV4KSB7XG5cdCAgICAgIHZtLmFjdGl2ZU5vdGVzLnNwbGljZShpbmRleCwxKTtcblx0ICAgICAgY29uc29sZS5sb2codm0uYWN0aXZlTm90ZXMpXG5cblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gbmV3Tm90ZSgpIHtcblx0ICAgIFx0Ly8gZmlyc3QgY2hlY2sgaWYgYWN0aXZlIG5vdGVzIGlzIGZ1bGxcblx0ICAgIFx0aWYodm0uYWN0aXZlTm90ZXMubGVuZ3RoID09IDQpe1xuXHQgICAgXHRcdHJldHVybiB0b2FzdHIuZXJyb3IoXCJXaG9vcHMhIFBsZWFzZSBjbG9zZSBhIHRhYiBiZWZvcmUgY3JlYXRpbmcgYSBuZXcgbm90ZVwiKTtcblx0ICAgIFx0fVxuXG5cdCAgICBcdFxuXHQgICAgXHQvLyBnZXQgdG9rZW5cblx0ICAgIFx0dmFyIHRva2VuID0gJHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndXNlclRva2VuJyk7XG5cblx0ICAgIFx0Ly8gc2VuZCBuZXcgbm90ZSBvYmplY3Rcblx0ICAgIFx0bm90ZXNTZXJ2aWNlLmFkZE5ld05vdGUoKS50aGVuKGZ1bmN0aW9uKGRhdGEpe1xuXHQgICAgXHRcdGNvbnNvbGUubG9nKGRhdGEpO1xuXG5cdCAgICBcdFx0bm90ZXNTZXJ2aWNlLmdldE5vdGVzTGlzdCgpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG5cdCAgICBcdFx0XHQvLyBwdXNoIG5ldyBub3RlIHRvIGFjdGl2ZSBub3Rlc1xuXHQgICAgXHRcdFx0dm0uYWxsTm90ZXMgPSBkYXRhLmRhdGEubm90ZXM7XG5cdFx0ICAgIFx0XHR2YXIgbmV3Tm90ZUluZGV4ID0gdm0uYWxsTm90ZXMubGVuZ3RoLTE7XG5cdFx0ICAgIFx0XHRhY3RpdmF0ZSh2bS5hbGxOb3Rlc1tuZXdOb3RlSW5kZXhdKTtcblx0XHQgICAgXHRcdC8vc2Nyb2xsIHRvIHRoZSBuZXcgbm90ZVxuXHQgICAgXHRcdFx0d2luZG93LmxvY2F0aW9uLmhhc2ggPSBcIm5vdGVzI1wiICsgdm0uYWxsTm90ZXNbbmV3Tm90ZUluZGV4XS5faWQ7XG5cblx0XHQgICAgXHRcdC8vIGxvZyBuZXcgYWN0aXZlIG5vdGVzXG5cdFx0ICAgIFx0XHRjb25zb2xlLmxvZyh2bS5hY3RpdmVOb3Rlcyk7XG5cdCAgICBcdFx0fSlcblx0ICAgIFx0XHRcblx0ICAgIFx0XHRcblx0ICAgIFx0fSk7XG5cdFx0XHRcblx0ICAgIFx0XG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIHVwZGF0ZU5vdGVDb250ZW50KG5vdGVJZCwgbm90ZUNvbnRlbnQpIHtcblxuXHQgICAgXHRub3Rlc1NlcnZpY2UudXBkYXRlTm90ZUNvbnRlbnQobm90ZUlkLCBub3RlQ29udGVudCkudGhlbihmdW5jdGlvbihkYXRhKXtcblx0ICAgIFx0XHRjb25zb2xlLmxvZyhkYXRhKTtcblx0ICAgIFx0fSlcblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gZGVsZXRlTm90ZShub3RlSWQsaW5kZXgpe1xuXHQgICAgXHRjb25zb2xlLmxvZygnZGVsZXRpbmcnKVxuXHQgICAgXHRub3Rlc1NlcnZpY2UuZGVsZXRlTm90ZShub3RlSWQpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG5cdCAgICBcdFx0aWYoZGF0YS5kYXRhLm5Nb2RpZmllZCA9PSAxKXtcblx0ICAgIFx0XHRcdGNsb3NlVGFiKGluZGV4KVxuXHQgICAgXHRcdFx0dG9hc3RyLnN1Y2Nlc3MoXCJOb3RlIERlbGV0ZWRcIilcblx0ICAgIFx0XHRcdGdldE5vdGVzTGlzdCgpO1xuXHQgICAgXHRcdH1cblx0ICAgIFx0XHRcblx0ICAgIFx0fSk7XG5cdCAgICBcdFxuXHQgICAgfVxuXG5cdCAgIFxuXHRcdGZ1bmN0aW9uIHNhdmVOb3RlKCkge1xuXG5cdFx0fVxuXG5cblx0XHRmdW5jdGlvbiB1cGRhdGVOb3RlKCkge1xuXG5cdFx0fVxuXG5cdH1cblxufSkoKTtcblxuXG4iLCIvLyBhbmd1bGFyXG4vLyAgICAgLm1vZHVsZSgnbm90ZXMnKVxuLy8gICAgIC5kaXJlY3RpdmUoJ25vdGVDYXJkJywgbm90ZUNhcmQpO1xuXG4vLyBmdW5jdGlvbiBub3RlQ2FyZCgpIHtcbi8vIFx0cmV0dXJue1xuLy8gXHRcdHJlc3RyaWN0OiAnRScsXG4vLyBcdFx0c2NvcGU6IHtcbi8vIFx0XHRcdGRhdGE6IFwiPVwiLFxuLy8gXHRcdFx0ZHJhZ2dhYmxlOiBcIj1cIlxuLy8gXHRcdH0sXG4vLyBcdFx0cmVwbGFjZTogdHJ1ZSxcbi8vIFx0XHR0ZW1wbGF0ZTogXCI8aDE+e3tkb2dzfX17e2RyYWdTdGF0dXN9fTwvaDE+XCIsXG4vLyBcdFx0bGluazogZnVuY3Rpb24oc2NvcGUsZWxlbWVudCl7XG4vLyBcdFx0XHRlbGVtZW50LmNsaWNrKGZ1bmN0aW9uKCl7XG4vLyBcdFx0XHRcdGNvbnNvbGUubG9nKGVsZW1lbnQpXG4vLyBcdFx0XHRcdGVsZW1lbnRbMF0uZHJhZ2dhYmxlID0gdHJ1ZTtcbi8vIFx0XHRcdH0pXG4vLyBcdFx0fSxcbi8vIFx0XHRjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpe1xuLy8gXHRcdFx0Ly9hbGVydChcImNvbnRyb2xsZXJcIik7XG4vLyBcdFx0XHQkc2NvcGUuZG9ncyA9ICRzY29wZS5kYXRhICsgXCJkb2dzXCI7XG4vLyBcdFx0XHRpZigkc2NvcGUuZHJhZ2dhYmxlKVxuLy8gXHRcdFx0XHQkc2NvcGUuZHJhZ1N0YXR1cyA9IGZhbHNlO1xuLy8gXHRcdFx0ZWxzZSAkc2NvcGUuZHJhZ1N0YXR1cyA9IHRydWU7XG5cblx0XHRcdFxuLy8gXHRcdH1cbi8vIFx0fVxuLy8gfVxuXG5cblxuLy8gLy8gYW5ndWxhclxuLy8gLy8gICAgIC5tb2R1bGUoJ25vdGVzJylcbi8vIC8vICAgICAuZGlyZWN0aXZlKCdub3RlQ2FyZCcsIG5vdGVDYXJkKTtcblxuLy8gLy8gZnVuY3Rpb24gbm90ZUNhcmQoKSB7XG4vLyAvLyBcdHJldHVybntcbi8vIC8vIFx0XHRyZXN0cmljdDogJ0UnLFxuLy8gLy8gXHRcdGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSl7XG4vLyAvLyBcdFx0XHRhbGVydChcImNvbnRyb2xsZXJcIik7XG4vLyAvLyBcdFx0XHRjb25zb2xlLmxvZygnZG9nJylcbi8vIC8vIFx0XHR9LFxuLy8gLy8gXHRcdHRlbXBsYXRlVXJsOiAnJyxcbi8vIC8vIFx0XHRyZXBsYWNlOiB0cnVlXG4vLyAvLyBcdFx0Ly8gc2NvcGU6IHt9XG4vLyAvLyBcdH1cbi8vIC8vIH0iLCIvLyBhbmd1bGFyXG4vLyAgICAgLm1vZHVsZSgnbm90ZXMnKVxuLy8gICAgIC5kaXJlY3RpdmUoJ25vdGVDYXJkcycsIG5vdGVDYXJkcylcblxuXG4gICAgXG5cbi8vIGZ1bmN0aW9uIG5vdGVDYXJkcygpIHtcbi8vIFx0cmV0dXJue1xuLy8gXHRcdHJlc3RyaWN0OiAnQUUnLFxuLy8gXHRcdHNjb3BlOiB7XG4vLyBcdFx0XHRub3RlczogXCI9XCIsXG4vLyBcdFx0XHRuZXdJdGVtOiBcIj1cIlxuLy8gXHRcdH0sXG4vLyBcdFx0cmVwbGFjZTogZmFsc2UsXG4vLyBcdFx0dHJhbnNjbHVkZTogZmFsc2UsXG4vLyBcdFx0dGVtcGxhdGVVcmw6IFwiY29tcG9uZW50cy9ub3Rlcy92aWV3cy9ub3RlLmRpcmVjdGl2ZS52aWV3Lmh0bWxcIixcbi8vIFx0XHRsaW5rOiBmdW5jdGlvbihzY29wZSxlbGVtZW50LGF0dHJzKXtcbi8vIFx0XHRcdC8vJCggXCIjc29ydGFibGVcIiApLnNvcnRhYmxlKCk7XG4vLyBcdFx0XHQvL2NvbnNvbGUubG9nKHNjb3BlKVxuLy8gXHRcdFx0Ly9jb25zb2xlLmxvZyhlbGVtZW50KVxuLy8gXHRcdFx0Ly9jb25zb2xlLmxvZyhhdHRycylcbi8vIFx0XHRcdC8vZWxlbWVudC5zb3J0YWJsZSgpO1xuLy8gXHRcdFx0Ly9jb25zb2xlLmxvZyhzY29wZS5ub3Rlcylcbi8vIFx0XHRcdHNjb3BlLmRvZ3MgPSBmdW5jdGlvbihub3RlKXtcbi8vIFx0XHRcdFx0Y29uc29sZS5sb2cobm90ZSlcbi8vIFx0XHRcdH1cblxuXG4vLyBcdFx0XHRlbGVtZW50LnNvcnRhYmxlKHtcbi8vIFx0XHQgICAgICAgLy8gcGxhY2Vob2xkZXI6IFwidWktc3RhdGUtaGlnaGxpZ2h0XCIsXG4vLyBcdFx0ICAgICAgICBzdGFydDogZnVuY3Rpb24oZXZlbnQsIHVpKSB7XG4vLyBcdFx0ICAgICAgICAgICAgdmFyIHN0YXJ0X3BvcyA9IHVpLml0ZW0uaW5kZXgoKTtcbi8vIFx0XHQgICAgICAgICAgICB1aS5pdGVtLmRhdGEoJ3N0YXJ0X3BvcycsIHN0YXJ0X3Bvcyk7XG4vLyBcdFx0ICAgICAgICB9LFxuLy8gXHRcdCAgICAgICAgdXBkYXRlOiBmdW5jdGlvbihldmVudCwgdWkpIHtcbi8vIFx0XHQgICAgICAgICAgICB2YXIgc3RhcnRfcG9zID0gdWkuaXRlbS5kYXRhKCdzdGFydF9wb3MnKTtcbi8vIFx0XHQgICAgICAgICAgICB2YXIgZW5kX3BvcyA9IHVpLml0ZW0uaW5kZXgoKTtcbi8vIFx0XHQgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHN0YXJ0X3BvcyArICcgLSAnICsgZW5kX3Bvcyk7XG5cdFx0ICAgICAgICAgIFxuLy8gXHRcdCAgICAgICAgICB2YXIgc3RhcnRJdGVtID0gc2NvcGUubm90ZXNbc3RhcnRfcG9zXTtcbi8vIFx0XHQgICAgICAgICAgIHNjb3BlLm5vdGVzLnNwbGljZShzdGFydF9wb3MsMSlcbi8vIFx0XHQgICAgICAgICAgIHNjb3BlLm5vdGVzLnNwbGljZShlbmRfcG9zLDAsIHN0YXJ0SXRlbSlcbi8vIFx0XHQgICAgICAgICAgIHNjb3BlLiRhcHBseSgpO1xuXG4vLyBcdFx0ICAgICAgICAgICAvL2NvbnNvbGUubG9nKHNjb3BlLm5vdGVzKVxuXHRcdCAgICAgICAgICAgXG5cdFx0ICAgICAgICAgICBcbi8vIFx0XHQgICAgICAgIH1cbi8vIFx0XHQgICAgfSk7IC8vIGVuZCBzb3J0YWJsZVxuXG5cdFx0ICAgXG5cbi8vIFx0XHQgICAgY29uc29sZS5sb2coZWxlbWVudClcblxuXG4vLyBcdFx0fSxcbi8vIFx0XHRjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpe1xuLy8gXHRcdFx0JHNjb3BlLmZvcm0gPXt9XG4vLyBcdFx0XHQkc2NvcGUuYWRkSXRlbSA9IGZ1bmN0aW9uKGluZGV4LGl0ZW0pe1xuLy8gXHRcdFx0XHQvL2FsZXJ0KGluZGV4KVxuLy8gXHRcdFx0XHRjb25zb2xlLmxvZygkc2NvcGUubmV3SXRlbSlcbi8vIFx0XHRcdFx0JHNjb3BlLm5vdGVzW2luZGV4XS5pdGVtcy5wdXNoKGl0ZW0pXG4vLyBcdFx0XHRcdCRzY29wZS5mb3JtID0ge31cbi8vIFx0XHRcdFx0Ly9jb25zb2xlLmxvZygkc2NvcGUubm90ZXNbaW5kZXhdLml0ZW1zKVxuLy8gXHRcdFx0fVxuXG4vLyBcdFx0XHQkc2NvcGUuZGVsZXRlTm90ZSA9IGZ1bmN0aW9uKGluZGV4KXtcbi8vIFx0XHRcdFx0JHNjb3BlLm5vdGVzLnNwbGljZShpbmRleCwxKTtcbi8vIFx0XHRcdH1cblxuXG4vLyBcdFx0XHQvL2FsZXJ0KFwiY29udHJvbGxlclwiKTtcbi8vIFx0XHRcdC8vICRzY29wZS5kb2dzID0gJHNjb3BlLmRhdGEgKyBcImRvZ3NcIjtcbi8vIFx0XHRcdC8vIGlmKCRzY29wZS5kcmFnZ2FibGUpXG4vLyBcdFx0XHQvLyBcdCRzY29wZS5kcmFnU3RhdHVzID0gZmFsc2U7XG4vLyBcdFx0XHQvLyBlbHNlICRzY29wZS5kcmFnU3RhdHVzID0gdHJ1ZTtcblxuXHRcdFx0XG4vLyBcdFx0fVxuLy8gXHR9XG4vLyB9IC8vZW5kIG5vdGVjYXJkcyBkaXJlY3RpdmVcblxuLy8gYW5ndWxhclxuLy8gXHQubW9kdWxlKCdub3RlcycpXG4vLyBcdC5kaXJlY3RpdmUoJ25vdGVDYXJkJywgbm90ZUNhcmQpXG5cbi8vIGZ1bmN0aW9uIG5vdGVDYXJkKCkge1xuXG4vLyBcdHZhciB0ZW1wRGF0YSA9IHt9O1xuLy8gXHR2YXIgdGVtcE5vdGUgPSBudWxsO1xuXG4vLyBcdHJldHVybntcbi8vIFx0XHRyZXN0cmljdDogJ0FFJyxcbi8vIFx0XHRzY29wZToge1xuLy8gXHRcdFx0bm90ZTogXCI9XCIsXG4vLyBcdFx0XHRub3RlczogXCI9XCJcbi8vIFx0XHR9LFxuLy8gXHRcdHJlcGxhY2U6IHRydWUsXG4vLyBcdFx0dHJhbnNjbHVkZTogZmFsc2UsXG4vLyBcdFx0dGVtcGxhdGVVcmw6IFwiY29tcG9uZW50cy9ub3Rlcy92aWV3cy9ub3Rlcy5pdGVtcy52aWV3Lmh0bWxcIixcbi8vIFx0XHRsaW5rOiBmdW5jdGlvbihzY29wZSxlbGVtZW50LGF0dHJzKXtcbi8vIFx0XHRcdC8vJCggXCIjc29ydGFibGVcIiApLnNvcnRhYmxlKCk7XG4vLyBcdFx0XHQvL2NvbnNvbGUubG9nKHNjb3BlKVxuLy8gXHRcdFx0Ly9jb25zb2xlLmxvZyhlbGVtZW50KVxuLy8gXHRcdFx0Ly9jb25zb2xlLmxvZyhhdHRycylcbi8vIFx0XHRcdC8vZWxlbWVudC5zb3J0YWJsZSgpO1xuLy8gXHRcdFx0Ly9jb25zb2xlLmxvZyhzY29wZS5ub3Rlcylcbi8vIFx0XHRcdC8vc2NvcGUuJHdhdGNoKCdub3RlcycsIGZ1bmN0aW9uKCkge1xuXG4vLyAgICAgICAgIC8vIGFsbCB0aGUgY29kZSBoZXJlLi4uXG4gICAgXHRcdFxuICAgIFx0XHRcblx0XHRcdFxuXG4vLyBcdFx0XHRlbGVtZW50LnNvcnRhYmxlKHtcbi8vIFx0XHRcdFx0Y29ubmVjdFdpdGg6IFwiLmNvbm5lY3RlZFNvcnRhYmxlXCIsXG4vLyBcdFx0ICAgICAgIC8vcGxhY2Vob2xkZXI6IFwidWktc3RhdGUtaGlnaGxpZ2h0XCIsXG4vLyBcdFx0ICAgICAgICBzdGFydDogZnVuY3Rpb24oZXZlbnQsIHVpKSB7XG4vLyBcdFx0ICAgICAgICBcdGNvbnNvbGUubG9nKFwiU1RBUlQgU1RBUlQgU1RBUlQgU1RBUlQgU1RBUlRcIilcbi8vIFx0XHQgICAgICAgIFx0Y29uc29sZS5sb2coZWxlbWVudClcbi8vIFx0XHQgICAgICAgIFx0Y29uc29sZS5sb2codGVtcERhdGEpXG5cdFx0ICAgICAgICBcdFxuXG4vLyBcdFx0ICAgICAgICBcdHRlbXBEYXRhLnN0YXJ0Tm90ZSA9IGFuZ3VsYXIuY29weShzY29wZS5ub3RlKTtcbi8vIFx0XHQgICAgICAgIFx0dGVtcERhdGEuc3RhcnROb3RlSW5kZXggPSBhdHRycy5ub3RlaW5kZXg7XG4vLyBcdFx0XHRcdFx0dGVtcERhdGEuc3RhcnROb3RlSXRlbUluZGV4ID0gdWkuaXRlbS5pbmRleCgpO1xuLy8gXHRcdFx0XHRcdHRlbXBEYXRhLnN0YXJ0Tm90ZUl0ZW1Db250ZW50ID0gdGVtcERhdGEuc3RhcnROb3RlLml0ZW1zW3RlbXBEYXRhLnN0YXJ0Tm90ZUl0ZW1JbmRleF07XG5cdFx0ICAgXHRcdFx0XG4vLyBcdFx0ICAgXHRcdFx0dGVtcE5vdGUgPSBhbmd1bGFyLmNvcHkoc2NvcGUubm90ZSlcbi8vIFx0XHQgICBcdFx0XHRjb25zb2xlLmxvZyh0ZW1wTm90ZSlcblxuLy8gXHRcdCAgICAgICAgfSxcbi8vIFx0XHQgICAgICAgIHVwZGF0ZTogZnVuY3Rpb24oZXZlbnQsIHVpKSB7XG5cbi8vIFx0XHQgICAgICAgLy8gY29uc29sZS5sb2coc2NvcGUudGVtcERhdGEpXHRcbi8vIFx0ICAgICAgICAgXHRpZiAoIXVpLnNlbmRlcikge1x0XHQgICAgICAgXG4vLyBcdFx0XHQgICAgICAgICBjb25zb2xlLmxvZyhcIlVQREFURSBVUERBVEUgVVBEQVRFIFVQREFURSBVUERBVEUgSU5TSURFIElGXCIgKVxuXG5cdFx0XHQgICAgICAgIFxuXHRcdFx0XHRcdFx0XHRcdCAgICAgICAgIFxuXG4vLyBcdFx0XHRcdFx0dmFyIHN0YXJ0X3BvcyA9IHRlbXBEYXRhLnN0YXJ0Tm90ZUl0ZW1JbmRleDtcbi8vIFx0XHRcdFx0XHR2YXIgZW5kX3BvcyA9IHVpLml0ZW0uaW5kZXgoKTtcbi8vIFx0XHRcdFx0XHRjb25zb2xlLmxvZyhzdGFydF9wb3MgKyAnIC0gJyArIGVuZF9wb3MpO1xuXG4vLyBcdFx0XHRcdFx0dGVtcE5vdGUuaXRlbXMuc3BsaWNlKHN0YXJ0X3BvcywxKVxuLy8gXHRcdFx0XHRcdHRlbXBOb3RlLml0ZW1zLnNwbGljZShlbmRfcG9zLDAsIHRlbXBEYXRhLnN0YXJ0Tm90ZUl0ZW1Db250ZW50KVxuLy8gXHRcdFx0XHRcdC8vc2NvcGUubm90ZSA9IHRlbXBOb3RlXG4vLyBcdFx0XHRcdFx0c2NvcGUubm90ZXNbdGVtcERhdGEuc3RhcnROb3RlSW5kZXhdID0gdGVtcE5vdGU7XG5cdFx0XHRcdFx0XG4vLyBcdFx0XHRcdFx0Y29uc29sZS5sb2coc2NvcGUubm90ZXMpXG5cbi8vIFx0XHRcdFx0XHR2YXIgcmFzdCA9IHtcbi8vICAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMmFkc0Buaml0LmVkdVwiLFxuLy8gICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJzMVwiLFxuLy8gICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImxhdW5zZHJ5XCIsIFwiYXBzcGx5IGpvYnNcIiwgXCJnc3ltXCIgXSxcbi8vICAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIxLzEvMjIwMTZcIixcbi8vICAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjEvMjIvMjAxNlwiLFxuLy8gICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvenNlLmFrQGdtYWlsLmNvbVwiXG4vLyAgICAgICAgICAgICAgICAgfVxuXG4vLyBcdFx0XHRcdFx0Ly9zY29wZS5ub3Rlc1swXS5pdGVtcy5wdXNoKFwiUFVDS1NcIilcblxuLy8gXHRcdFx0XHRcdHNjb3BlLiRhcHBseSgpO1xuXG4vLyBcdFx0ICAgLy8gICAgICAgICAvL2NvbnNvbGUubG9nKHNjb3BlLm5vdGVzKVxuLy8gXHRcdFx0ICAgIH0gICBcblx0XHQgICAgICAgICAgIFxuLy8gXHRcdCAgICAgICAgfSwgLy9lbmQgdXBkYXRlXG4vLyBcdFx0ICAgICAgICByZWNlaXZlOiBmdW5jdGlvbihldmVudCwgdWkpe1xuLy8gXHRcdCAgICAgICAgXHRjb25zb2xlLmxvZyhcIlJFQ0VJVkUgUkVDRUlWRSBSRUNFSVZFIFJFQ0VJVkUgUkVDRUlWRVwiKVxuLy8gXHRcdCAgICAgICAgXHRjb25zb2xlLmxvZyh0ZW1wRGF0YSlcblxuLy8gXHRcdCAgICAgICAgXHR0ZW1wRGF0YS5lbmROb3RlID0gYW5ndWxhci5jb3B5KHNjb3BlLm5vdGUpO1xuLy8gXHRcdCAgICAgICAgXHR0ZW1wRGF0YS5lbmROb3RlSW5kZXggPSBhdHRycy5ub3RlaW5kZXg7XG4vLyBcdFx0XHRcdFx0dGVtcERhdGEuZW5kTm90ZUl0ZW1JbmRleCA9IHVpLml0ZW0uaW5kZXgoKTtcblxuXHRcdFx0XHRcdFxuXG4vLyBcdFx0XHRcdFx0ICAvL2NvbnNvbGUubG9nKFwicmVtb3ZpbmcgaXRlbTogXCIgKyBzY29wZS5ub3Rlc1tub3RlT3JpZ2luSW5kZXhdLml0ZW1zW3N0YXJ0X3Bvc10pO1xuLy8gXHRcdCAgICAgICAgICAgdGVtcERhdGEuc3RhcnROb3RlLml0ZW1zLnNwbGljZSh0ZW1wRGF0YS5zdGFydE5vdGVJdGVtSW5kZXgsMSlcbi8vIFx0XHRcdCAgICAgICB0ZW1wRGF0YS5lbmROb3RlLml0ZW1zLnNwbGljZSh0ZW1wRGF0YS5lbmROb3RlSXRlbUluZGV4LDAsdGVtcERhdGEuc3RhcnROb3RlSXRlbUNvbnRlbnQpXG4vLyBcdFx0XHQgICAgICAgY29uc29sZS5sb2codGVtcERhdGEpXG5cbi8vIFx0XHRcdCAgICAgICBzY29wZS5ub3Rlc1t0ZW1wRGF0YS5zdGFydE5vdGVJbmRleF0gPSB0ZW1wRGF0YS5zdGFydE5vdGU7XG4vLyBcdFx0XHQgICAgICAgc2NvcGUubm90ZXNbdGVtcERhdGEuZW5kTm90ZUluZGV4XSA9IHRlbXBEYXRhLmVuZE5vdGU7XG5cdCAgICAgICAgICAgXHRcbi8vIFx0ICAgICAgICAgICBcdFx0Y29uc29sZS5sb2codGVtcERhdGEuc3RhcnROb3RlLml0ZW1zKVxuLy8gXHQgICAgICAgICAgIFx0XHRjb25zb2xlLmxvZyh0ZW1wRGF0YS5lbmROb3RlLml0ZW1zKVxuXG4vLyBcdFx0ICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiYWRkaW5nIGFmdGVyIHBvc2l0aW9uOiBcIiArIGVuZF9wb3MpXG4vLyBcdFx0ICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiYWRkaW5nIGFmdGVyOiBcIiArIHNjb3BlLm5vdGVzW25vdGVEZXN0aW5hdGlvbkluZGV4XS5pdGVtc1tlbmRfcG9zXSlcbi8vIFx0XHQgICAgICAgICAgIC8vc2NvcGUubm90ZXNbbm90ZURlc3RpbmF0aW9uSW5kZXhdLml0ZW1zLnNwbGljZShlbmRfcG9zLDAsIHN0YXJ0SXRlbSlcblxuLy8gXHRcdCAgICAgICAgXHQvL3Njb3BlLnRlbXBEYXRhID0gXCJwcmF3bnNcIjtcblx0XHQgICAgICAgIFx0XG5cdFx0ICAgICAgICBcdFxuLy8gXHRcdCAgICAgICAgXHQvLyBjb25zb2xlLmxvZyh0ZW1wRGF0YSlcbi8vIFx0XHQgICAgICAgIFx0Ly8gLy9jb25zb2xlLmxvZyhzY29wZS5ub3RlKTtcbi8vIFx0XHQgICAgICAgIFx0dmFyIHJhc3QgPSB7XG4vLyAgICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJhZHNAbmppdC5lZHVcIixcbi8vICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiczFcIixcbi8vICAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJsYXVuc2RyeVwiLCBcImFwc3BseSBqb2JzXCIsIFwiZ3N5bVwiIF0sXG4vLyAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMS8xLzIyMDE2XCIsXG4vLyAgICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIxLzIyLzIwMTZcIixcbi8vICAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3pzZS5ha0BnbWFpbC5jb21cIlxuLy8gICAgICAgICAgICAgICAgIH1cblx0XHQgICAgICAgIFx0XG4vLyBcdFx0ICAgICAgICAgICBzY29wZS4kYXBwbHkoKTtcblx0XHRcblxuLy8gXHRcdCAgICAgICAgfVxuXG4vLyBcdFx0ICAgIH0pOyAvLyBlbmQgc29ydGFibGVcblxuLy8gXHRcdCAvLyAgfSk7IC8vZW5kIHdhdGNoXG5cblxuXG4vLyBcdFx0fSxcbi8vIFx0XHRjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpe1xuXG4vLyBcdFx0XHQkc2NvcGUubW9vc2UgPSBcImRpbmdcIlxuLy8gXHRcdFx0JHNjb3BlLmRlbGV0ZUl0ZW0gPSBmdW5jdGlvbihwYXJlbnRJbmRleCwgaW5kZXgpe1xuLy8gXHRcdFx0XHRjb25zb2xlLmxvZyhwYXJlbnRJbmRleClcbi8vIFx0XHRcdFx0Y29uc29sZS5sb2coaW5kZXgpXG4vLyBcdFx0XHRcdCRzY29wZS5ub3Rlc1twYXJlbnRJbmRleF0uaXRlbXMuc3BsaWNlKGluZGV4LDEpXG5cbi8vIFx0XHRcdH1cblxuLy8gXHRcdFx0JHNjb3BlLnJhbmRvbUlkID0gZnVuY3Rpb24oaXRlbSl7XG4vLyAgICBcdFx0XHQgcmV0dXJuIFwiSURcIiArIGl0ZW0gKyAoTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIDk5OSkgKyAxKSk7XG4vLyBcdFx0XHR9XG4vLyBcdFx0XHQvL2FsZXJ0KFwiY29udHJvbGxlclwiKTtcbi8vIFx0XHRcdC8vICRzY29wZS5kb2dzID0gJHNjb3BlLmRhdGEgKyBcImRvZ3NcIjtcbi8vIFx0XHRcdC8vIGlmKCRzY29wZS5kcmFnZ2FibGUpXG4vLyBcdFx0XHQvLyBcdCRzY29wZS5kcmFnU3RhdHVzID0gZmFsc2U7XG4vLyBcdFx0XHQvLyBlbHNlICRzY29wZS5kcmFnU3RhdHVzID0gdHJ1ZTtcblxuLy8gXHRcdFx0Y29uc29sZS5sb2coJHNjb3BlKVxuXG5cdFx0XHRcbi8vIFx0XHR9XG4vLyBcdH1cbi8vIH0gLy9lbmQgbm90ZWNhcmQgZGlyZWN0aXZlXG5cblxuXG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cdCd1c2Ugc3RyaWN0J1xuXG5cdGFuZ3VsYXJcbiAgICBcdC5tb2R1bGUoJ25vdGVzJylcbiAgICBcdC5mYWN0b3J5KCdub3Rlc1NlcnZpY2UnLCBub3Rlc1NlcnZpY2UpO1xuXG4gICAgbm90ZXNTZXJ2aWNlLiRpbmplY3QgPSBbJyRodHRwJywnJHdpbmRvdyddXG5cbiAgICBmdW5jdGlvbiBub3Rlc1NlcnZpY2UoJGh0dHAsJHdpbmRvdykge1xuXG4gICAgICAgIHZhciB0b2tlbiA9IGdldFRva2VuKCk7XG4gICAgXHR2YXIgc2VydmljZSA9IHtcbiAgICAgICAgICAgIGdldFRva2VuOiBnZXRUb2tlbiwgXG4gICAgICAgICAgICBnZXROb3Rlc0xpc3Q6IGdldE5vdGVzTGlzdCxcbiAgICAgICAgICAgIGdldFNpbmdsZU5vdGU6IGdldFNpbmdsZU5vdGUsXG4gICAgICAgICAgICBzYXZlQWxsTm90ZXM6IHNhdmVBbGxOb3RlcyxcbiAgICAgICAgICAgIGFkZE5ld05vdGU6IGFkZE5ld05vdGUsXG4gICAgICAgICAgICB1cGRhdGVOb3RlQ29udGVudDogdXBkYXRlTm90ZUNvbnRlbnQsXG4gICAgICAgICAgICBkZWxldGVOb3RlOiBkZWxldGVOb3RlLFxuICAgICAgICAgICAgLy8gdXBkYXRlTm90ZVRpdGxlOiB1cGRhdGVOb3RlVGl0bGUsXG4gICAgICAgICAgICAvLyB1cGRhdGVOb3RlQ29udGVudDogdXBkYXRlTm90ZVxuICAgIFx0fTtcblxuICAgIFx0cmV0dXJuIHNlcnZpY2U7XG5cbiAgICBcdC8vLy8vLy8vLy8vL1xuXG4gICAgICAgIGZ1bmN0aW9uIGdldFRva2VuKCkge1xuICAgICAgICAgICAgcmV0dXJuICR3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3VzZXJUb2tlbicpO1xuICAgICAgICB9XG4gICAgICBcbiAgICAgICAgLy8gZ2V0cyBub3RlcyBsaXN0LCBleGNsdWRlcyB0aGUgYWN0dWFsIG5vdGUgY29udGVudFxuICAgICAgICBmdW5jdGlvbiBnZXROb3Rlc0xpc3QgKCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGkvbm90ZXMvZ2V0QWxsTm90ZXNNZXRhJyx7dG9rZW46IHRva2VufSk7XG4gICAgICAgIH0gLy9lbmQgZ2V0Tm90ZSgpXG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0U2luZ2xlTm90ZShub3RlSWQpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCdodHRwOi8vbG9jYWxob3N0OjMwMDAvYXBpL25vdGVzL2dldFNpbmdsZU5vdGUnLHt0b2tlbjogdG9rZW4sIG5vdGVJZDogbm90ZUlkfSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGFkZE5ld05vdGUgKCkge1xuXG4gICAgICAgICAgICAvLyBjcmVhdGUgbmV3IG5vdGUgb2JqZWN0XG4gICAgICAgICAgICB2YXIgbmV3Tm90ZSA9IHt0aXRsZTpcImZyb29zdFwiLGNvbnRlbnQ6XCJzb21lIGNvbnRlbnRcIixcInNoYXJlZFdpdGhcIjpbe1widXNlclwiOiBcImF1azJAbmppdC5lZHVcIiwgXCJjYW5FZGl0XCI6IGZhbHNlfV19O1xuICAgICAgICAgICAgXG4gICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCdodHRwOi8vbG9jYWxob3N0OjMwMDAvYXBpL25vdGVzL2FkZE5vdGUnLHt0b2tlbjogdG9rZW4sIG5vdGU6IG5ld05vdGV9KVxuICAgICAgICB9XG5cbiAgICAgICAgIGZ1bmN0aW9uIHVwZGF0ZU5vdGVDb250ZW50KG5vdGVJZCwgbm90ZUNvbnRlbnQpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCdodHRwOi8vbG9jYWxob3N0OjMwMDAvYXBpL25vdGVzL3VwZGF0ZU5vdGVDb250ZW50Jyx7dG9rZW46IHRva2VuLCBub3RlSWQ6IG5vdGVJZCwgbm90ZUNvbnRlbnQ6bm90ZUNvbnRlbnR9KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZGVsZXRlTm90ZShub3RlSWQpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCdodHRwOi8vbG9jYWxob3N0OjMwMDAvYXBpL25vdGVzL2RlbGV0ZU5vdGUnLHt0b2tlbjogdG9rZW4sIG5vdGVJZDogbm90ZUlkfSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNhdmVBbGxOb3Rlcyhub3Rlcykge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGkvbm90ZXMvdXBkYXRlTm90ZXMnLHtlbWFpbDpcIm1vaXpAZ21haWwuY29tXCIsbm90ZXM6IG5vdGVzfSlcbiAgICAgICAgfVxuXG5cblxuICAgIH1cblxuXHRcblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0J3VzZSBzdHJpY3QnXG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ25vdGlmeScpXG5cdFx0LmNvbnRyb2xsZXIoJ25vdGlmeUN0cmwnLCBub3RpZnlDdHJsKVxuXG5cdC8vIG5vdGlmeUN0cmwuJGluamVjdCA9IFtdXG5cblx0ZnVuY3Rpb24gbm90aWZ5Q3RybCgpIHtcblxuXHQgICAgdmFyIHZtID0gdGhpcztcblxuXHQgICAgdm0uZ290b1Nlc3Npb24gPSBnb3RvU2Vzc2lvbjtcblx0ICAgIHZtLnJlZnJlc2ggPSByZWZyZXNoO1xuXHQgICAgdm0uc2VhcmNoID0gc2VhcmNoO1xuXHQgICAgdm0uc2Vzc2lvbnMgPSBbXTtcblx0ICAgIHZtLnRpdGxlID0gJ25vdGlmeSc7XG5cblx0ICAgIC8vLy8vLy8vLy8vL1xuXG5cdCAgICBcblxuXHQgICAgZnVuY3Rpb24gZ290b1Nlc3Npb24oKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIHJlZnJlc2goKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIHNlYXJjaCgpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblx0fVxuXG59KSgpO1xuXG5cbiIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdub3RpZnknKVxuICAgIC5kaXJlY3RpdmUoJ25vdGlmeScsIG5vdGlmeSlcblxuICAgIG5vdGlmeS4kaW5qZWN0ID0gWydub3RpZnlTZXJ2aWNlJywnJHJvb3RTY29wZScsJyR0aW1lb3V0J11cbiAgICBcblxuZnVuY3Rpb24gbm90aWZ5KCkge1xuXHRyZXR1cm57XG5cdFx0cmVzdHJpY3Q6ICdBRScsXG5cdFx0dGVtcGxhdGU6ICc8bGkgbmctcmVwZWF0PVwiaXRlbSBpbiBub3RpZnlMaXN0XCI+e3tpdGVtfX08L2xpPicsXG5cdFx0bGluazogZnVuY3Rpb24oc2NvcGUsZWxlbWVudCxhdHRycyl7XG5cblx0XHR2YXIgbGkgPSBhbmd1bGFyLmVsZW1lbnQoZWxlbWVudC5jaGlsZHJlbigpWzBdKVxuXHRcdGNvbnNvbGUubG9nKGxpKVxuXHRcdFxuXHRcdGFuaW1hdGVEb3duID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zb2xlLmxvZygnYW5pbWF0aW5nJylcbiAgICAgICAgICAgICQodGhpcykuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgdG9wOiAnKz05OSdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIGFuaW1hdGVSaWdodCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBcdGNvbnNvbGUubG9nKCdhbmltYXRpbmcnKVxuICAgICAgICAgICAgJCh0aGlzKS5hbmltYXRlKHtcbiAgICAgICAgICAgIFx0XG4gICAgICAgICAgICAgICAgbGVmdDogJys9NTAnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAkKGxpKS5vbignY2xpY2snLCBhbmltYXRlUmlnaHQpO1xuICAgICAgIC8vICQobGkpLm9uKCdjbGljaycsIGFuaW1hdGVSaWdodCk7ICBcblx0XHQgICAgIFx0XHRcblx0XHRcdFxuXHRcdFx0ICAgIFxuXG5cblxuXHRcdH0sXG5cdFx0Y29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlLG5vdGlmeVNlcnZpY2UsJHJvb3RTY29wZSwkdGltZW91dCl7XG5cdFx0XHRjb25zb2xlLmxvZygnbm90aWZ5IGRpcmVjdGl2ZScpXG5cdFx0XHRcblx0XHRcdCRzY29wZS5ub3RpZnlMaXN0ID0gW1wiZG9nc1wiLFwiY2F0c1wiXTtcdFx0XHRcblxuXHRcdFx0ICRyb290U2NvcGUuJG9uKCdwdXNoZWQnLGZ1bmN0aW9uKGV2ZW50LG1lc3NhZ2Upe1xuXHRcdFx0IFx0Y29uc29sZS5sb2coXCJkaXJlY3RpdmU6IHJlY2VpdmluZ1wiKTtcblx0XHRcdCBcdCRzY29wZS5ub3RpZnlMaXN0LnB1c2gobWVzc2FnZS5kYXRhKTtcblx0XHRcdCBcdFx0XHRcdCBcdCRzY29wZS4kYXBwbHkoKTtcblx0XHRcdCBcdC8vICR0aW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHQgXHQvLyBcdCRzY29wZS5kYXRhID0gbnVsbDtcblx0XHRcdCBcdC8vIH0sMzAwMClcblxuXHRcdFx0IH0pXG5cdFx0XHRcblx0XHR9XG5cdH1cbn0gLy9lbmQgbm90aWZ5IGRpcmVjdGl2ZVxuIiwiKGZ1bmN0aW9uKCl7XG4gICAgJ3VzZSBzdHJpY3QnXG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ25vdGlmeScpXG4gICAgICAgIC5mYWN0b3J5KCdub3RpZnlTZXJ2aWNlJywgbm90aWZ5U2VydmljZSk7XG5cbiAgICBub3RpZnlTZXJ2aWNlLiRpbmplY3QgPSBbJyRyb290U2NvcGUnXVxuXG4gICAgZnVuY3Rpb24gbm90aWZ5U2VydmljZSgkcm9vdFNjb3BlKSB7XG4gICAgICAgIHZhciBzZXJ2aWNlID0ge1xuXG4gICAgICAgICAgICBwdXNoOiBwdXNoLFxuXG5cbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gc2VydmljZTtcblxuICAgICAgICAvLy8vLy8vLy8vLy9cblxuICAgICAgICBmdW5jdGlvbiBwdXNoKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicHVzaGluZyBmcm9tIHNlcnZpY2VcIik7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRlbWl0KFwicHVzaGVkXCIsIG1lc3NhZ2UpO1xuXG4gICAgICAgIH1cblxuXG5cbiAgICB9XG5cbiAgICBcblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0J3VzZSBzdHJpY3QnXG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ3JlZ2lzdGVyJylcblx0XHQuY29udHJvbGxlcigncmVnaXN0ZXJDdHJsJywgcmVnaXN0ZXJDdHJsKVxuXG5cdHJlZ2lzdGVyQ3RybC5pbmplY3QgPSBbJ3RvYXN0cicsJyRodHRwJywncmVnaXN0ZXJTZXJ2aWNlJ11cblxuXHRmdW5jdGlvbiByZWdpc3RlckN0cmwodG9hc3RyLCRodHRwLHJlZ2lzdGVyU2VydmljZSkge1xuXG5cdCAgICB2YXIgdm0gPSB0aGlzO1xuXG5cdCAgICB2bS5mb3JtID0ge31cblx0ICAgIHZtLnN1Ym1pdFN0YXR1cyA9IFwiXCI7XG5cdCAgICB2bS5zdWJtaXRGb3JtID0gc3VibWl0Rm9ybTtcblx0ICAgIFxuXHQgICAgLy9kaXNwbGF5IGluZm8gb24gbG9hZFxuXHQgICAgaW5mbygpO1xuXG5cdCAgICAvLy8vLy8vLy8vLy9cblxuXHQgICAgZnVuY3Rpb24gc3VibWl0Rm9ybShpc1ZhbGlkKSB7XG5cdCAgICBcdFxuXHQgICAgXHRjb25zb2xlLmxvZyh2bS5mb3JtKTtcblx0ICAgIFx0XG5cdCAgICBcdC8vIGNoZWNrIHRvIG1ha2Ugc3VyZSB0aGUgZm9ybSBpcyBjb21wbGV0ZWx5IHZhbGlkXG5cdFx0ICAgIGlmIChpc1ZhbGlkKSB7XG5cdFx0ICAgICAgY29uc29sZS5sb2coXCJWYWxpZCBGb3JtXCIpO1xuXHRcdCAgICAgIHNlbmRGb3JtKHZtLmZvcm0pO1xuXHRcdCAgICB9XG5cdCAgICB9XG5cblx0ICAgIC8vc2VuZHMgZm9ybSB0byBhcGlcblx0ICAgIGZ1bmN0aW9uIHNlbmRGb3JtKGZvcm0pIHtcblx0XHRcdHJlZ2lzdGVyU2VydmljZS5uZXdVc2VyKHZtLGZvcm0pXG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIGluZm8oKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICAgIGNvbnNvbGUubG9nKFwicmVnaXN0ZXIgY29udHJvbGxlclwiKVxuXHQgICAgfVxuXG5cdH1cblxufSkoKTtcblxuXG4iLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgncmVnaXN0ZXInKVxuICAgIC5kaXJlY3RpdmUoJ3JlZ2lzdGVyRGlyJywgcmVnaXN0ZXJEaXIpO1xuXG5mdW5jdGlvbiByZWdpc3RlckRpcigpIHtcblx0cmV0dXJue1xuXHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0dGVtcGxhdGVVcmw6ICcnLFxuXHRcdHJlcGxhY2U6IHRydWVcblx0XHQvLyBzY29wZToge31cblx0fVxufSIsIihmdW5jdGlvbigpe1xuXHQndXNlIHN0cmljdCdcblxuXHRhbmd1bGFyXG4gICAgXHQubW9kdWxlKCdyZWdpc3RlcicpXG4gICAgXHQuZmFjdG9yeSgncmVnaXN0ZXJTZXJ2aWNlJywgcmVnaXN0ZXJTZXJ2aWNlKTtcblxuICAgIHJlZ2lzdGVyU2VydmljZS5pbmplY3QgPSBbJyRodHRwJywndG9hc3RyJywnYXV0aFNlcnZpY2UnLCckc3RhdGUnLCckcm9vdFNjb3BlJ11cblxuICAgIGZ1bmN0aW9uIHJlZ2lzdGVyU2VydmljZSgkaHR0cCx0b2FzdHIsYXV0aFNlcnZpY2UsJHN0YXRlLCRyb290U2NvcGUpIHtcbiAgICBcdHZhciBzZXJ2aWNlID0ge1xuXG4gICAgICAgICAgICBuZXdVc2VyOiBuZXdVc2VyLFxuICAgIFx0XHRlcnJvcjogZXJyb3IsXG4gICAgXHRcdGluZm86IGluZm8sXG4gICAgXHRcdHN1Y2Nlc3M6IHN1Y2Nlc3NcblxuICAgIFx0fTtcblxuICAgIFx0cmV0dXJuIHNlcnZpY2U7XG5cbiAgICBcdC8vLy8vLy8vLy8vL1xuXG4gICAgICAgIGZ1bmN0aW9uIG5ld1VzZXIodm0sIGZvcm0pIHtcbiAgICAgICAgICAgICRodHRwLnBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGkvdXNlcnMvbmV3VXNlcicsIGZvcm0pXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIGF1dGhTZXJ2aWNlLnNldFRva2VuKHJlcy5kYXRhLnRva2VuKTtcblxuICAgICAgICAgICAgICAvL3RvYXN0XG4gICAgICAgICAgICAgIHRvYXN0ci5zdWNjZXNzKCdZb3UgYXJlIG5vdyBteSBCZXRhIScpO1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xuXG4gICAgICAgICAgICAgIC8vY2hhbmdlIHN0YXR1cyBvbiB2aWV3XG4gICAgICAgICAgICAgIHZtLnN1Ym1pdFN0YXR1cyA9IFwiU3VjY2Vzc1wiO1xuICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAvL2VtcHR5IGZvcm1cbiAgICAgICAgICAgICAgdm0uZm9ybSA9IFwiXCI7XG5cbiAgICAgICAgICAgICAgLy9yZWRpcmVjdFxuICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5tZW1iZXJzJyk7XG5cbiAgICAgICAgICAgICAgJHJvb3RTY29wZS4kZW1pdChcImxvZ2dlZEluXCIpO1xuXG4gICAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgICAgdG9hc3RyLmVycm9yKCdGYWlsZWQ6ICcgKyBlcnIuZGF0YSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgXHRmdW5jdGlvbiBlcnJvcigpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gaW5mbygpIHtcblx0ICAgICAgLyogKi9cbiAgICAgICAgICBjb25zb2xlLmxvZyhcInJlZ2lzdGVyU2VydmljZVwiKTtcblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gc3VjY2VzcygpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblxuXG4gICAgfVxuXG5cdFxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCdcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnc2FtcGxlJylcblx0XHQuY29udHJvbGxlcignc2FtcGxlQ3RybCcsIHNhbXBsZUN0cmwpXG5cblx0c2FtcGxlQ3RybC4kaW5qZWN0ID0gW11cblxuXHRmdW5jdGlvbiBzYW1wbGVDdHJsKCkge1xuXG5cdCAgICB2YXIgdm0gPSB0aGlzO1xuXG5cdCAgICB2bS5nb3RvU2Vzc2lvbiA9IGdvdG9TZXNzaW9uO1xuXHQgICAgdm0ucmVmcmVzaCA9IHJlZnJlc2g7XG5cdCAgICB2bS5zZWFyY2ggPSBzZWFyY2g7XG5cdCAgICB2bS5zZXNzaW9ucyA9IFtdO1xuXHQgICAgdm0udGl0bGUgPSAnU2FtcGxlJztcblxuXHQgICAgLy8vLy8vLy8vLy8vXG5cblx0ICAgIGZ1bmN0aW9uIGdvdG9TZXNzaW9uKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiByZWZyZXNoKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBzZWFyY2goKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cdH1cblxufSkoKTtcblxuXG4iLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgnc2FtcGxlJylcbiAgICAuZGlyZWN0aXZlKCdzYW1wbGVEaXInLCBzYW1wbGVEaXIpO1xuXG5mdW5jdGlvbiBzYW1wbGVEaXIoKSB7XG5cdHJldHVybntcblx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdHRlbXBsYXRlVXJsOiAnJyxcblx0XHRyZXBsYWNlOiB0cnVlXG5cdFx0Ly8gc2NvcGU6IHt9XG5cdH1cbn0iLCIoZnVuY3Rpb24oKXtcblx0J3VzZSBzdHJpY3QnXG5cblx0YW5ndWxhclxuICAgIFx0Lm1vZHVsZSgnc2FtcGxlJylcbiAgICBcdC5mYWN0b3J5KCdzYW1wbGVTZXJ2aWNlJywgc2FtcGxlU2VydmljZSk7XG5cbiAgICBzYW1wbGVTZXJ2aWNlLiRpbmplY3QgPSBbXVxuXG4gICAgZnVuY3Rpb24gc2FtcGxlU2VydmljZSgpIHtcbiAgICBcdHZhciBzZXJ2aWNlID0ge1xuXG4gICAgXHRcdGVycm9yOiBlcnJvcixcbiAgICBcdFx0aW5mbzogaW5mbyxcbiAgICBcdFx0c3VjY2Vzczogc3VjY2Vzc1xuXG4gICAgXHR9O1xuXG4gICAgXHRyZXR1cm4gc2VydmljZTtcblxuICAgIFx0Ly8vLy8vLy8vLy8vXG5cbiAgICBcdGZ1bmN0aW9uIGVycm9yKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBpbmZvKCkge1xuXHQgICAgICAvKiAqL1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwic2FtcGxlU2VydmljZVwiKTtcblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gc3VjY2VzcygpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblxuXG4gICAgfVxuXG5cdFxuXG59KSgpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
