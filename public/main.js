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

		vm.getNotes = getNotes();
		vm.allNotes = null;
		vm.activeNotes = [];
		vm.getSingleNote = getSingleNote;

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

		function getSingleNote(noteId) {
			var token = $window.localStorage.getItem('userToken');
			return $http.post('http://localhost:3000/api/notes/getSingleNote',{token: token, noteId: noteId});

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
			  	getSingleNote(noteId).then(function(res){
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUuanMiLCJjb250cm9sbGVycy9hcHAuY29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2FwcC5ob21lLmNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9hcHAubG9naW4uY29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2FwcC5uYXYuY29udHJvbGxlci5qcyIsImRpcmVjdGl2ZXMvc2VsZWN0VGV4dC5kaXJlY3RpdmUuanMiLCJyb3V0ZXMvYXBwLnJvdXRlcy5qcyIsImF1dGgvYXV0aC5tb2R1bGUuanMiLCJidWRnZXQvYnVkZ2V0Lm1vZHVsZS5qcyIsIm1lbWJlcnMvbWVtYmVycy5tb2R1bGUuanMiLCJub3Rlcy9ub3Rlcy5tb2R1bGUuanMiLCJub3RpZnkvbm90aWZ5Lm1vZHVsZS5qcyIsInJlZ2lzdGVyL3JlZ2lzdGVyLm1vZHVsZS5qcyIsInNhbXBsZUNvbXBvbmVudC9zYW1wbGUubW9kdWxlLmpzIiwiYXV0aC9zZXJ2aWNlcy9hdXRoLnNlcnZpY2UuaW50ZXJjZXB0b3IuanMiLCJhdXRoL3NlcnZpY2VzL2F1dGguc2VydmljZS5qcyIsImJ1ZGdldC9jb250cm9sbGVycy9idWRnZXQuY29udHJvbGxlci5qcyIsImJ1ZGdldC9kaXJlY3RpdmVzL25vdGVzLmRpcmVjdGl2ZS5iYWNrdXAuanMiLCJidWRnZXQvZGlyZWN0aXZlcy9ub3Rlcy5kaXJlY3RpdmUuanMiLCJidWRnZXQvc2VydmljZXMvYnVkZ2V0LnNlcnZpY2UuanMiLCJtZW1iZXJzL2NvbnRyb2xsZXJzL21lbWJlcnMuY29udHJvbGxlci5qcyIsIm1lbWJlcnMvc2VydmljZXMvbWVtYmVycy5zZXJ2aWNlLmpzIiwibm90ZXMvY29udHJvbGxlcnMvbm90ZXMuY29udHJvbGxlci5qcyIsIm5vdGVzL2RpcmVjdGl2ZXMvbm90ZXMuZGlyZWN0aXZlLmJhY2t1cC5qcyIsIm5vdGVzL2RpcmVjdGl2ZXMvbm90ZXMuZGlyZWN0aXZlLmpzIiwibm90ZXMvc2VydmljZXMvbm90ZXMuc2VydmljZS5qcyIsIm5vdGlmeS9jb250cm9sbGVycy9ub3RpZnkuY29udHJvbGxlci5qcyIsIm5vdGlmeS9kaXJlY3RpdmVzL25vdGlmeS5kaXJlY3RpdmUuanMiLCJub3RpZnkvc2VydmljZXMvbm90aWZ5LnNlcnZpY2UuanMiLCJyZWdpc3Rlci9jb250cm9sbGVycy9yZWdpc3Rlci5jb250cm9sbGVyLmpzIiwicmVnaXN0ZXIvZGlyZWN0aXZlcy9yZWdpc3Rlci5kaXJlY3RpdmUuanMiLCJyZWdpc3Rlci9zZXJ2aWNlcy9yZWdpc3Rlci5zZXJ2aWNlLmpzIiwic2FtcGxlQ29tcG9uZW50L2NvbnRyb2xsZXJzL3NhbXBsZS5jb250cm9sbGVyLmpzIiwic2FtcGxlQ29tcG9uZW50L2RpcmVjdGl2ZXMvc2FtcGxlLmRpcmVjdGl2ZS5qcyIsInNhbXBsZUNvbXBvbmVudC9zZXJ2aWNlcy9zYW1wbGUuc2VydmljZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtcbiAgICAndXNlIHN0cmljdCdcblxuYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcCcsIFtcbiAgICAgICAgJ2F1dGgnLFxuICAgIFx0J3VpLnJvdXRlcicsXG4gICAgXHQnbmdBbmltYXRlJyxcbiAgICBcdCdzYW1wbGUnLFxuICAgIFx0J3JlZ2lzdGVyJyxcbiAgICBcdCd0b2FzdHInLFxuICAgIFx0J21lbWJlcnMnLFxuICAgIFx0J25vdGVzJyxcbiAgICAgICAgJ2J1ZGdldCcsXG4gICAgICAgICdjaGFydC5qcycsXG4gICAgICAgICdub3RpZnknLFxuICAgICAgICAndWkudGlueW1jZSdcbiAgICBdKVxuXG4vLyAuY29uZmlnKGZ1bmN0aW9uKCRodHRwUHJvdmlkZXIpIHtcblxuLy8gICAgIC8vIGF0dGFjaCBvdXIgYXV0aCBpbnRlcmNlcHRvciB0byB0aGUgaHR0cCByZXF1ZXN0c1xuLy8gICAgICRodHRwUHJvdmlkZXIuaW50ZXJjZXB0b3JzLnB1c2goJ2F1dGhJbnRlcmNlcHRvcicpO1xuXG4vLyB9KVxuXG5cbi5ydW4oWyckcm9vdFNjb3BlJywnJHN0YXRlJywnYXV0aFNlcnZpY2UnLCckcScsZnVuY3Rpb24oJHJvb3RTY29wZSwgJHN0YXRlLCBhdXRoU2VydmljZSAsJHEpIHtcbiAgICBhdXRoU2VydmljZS5pbmZvKCk7XG5cbiAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlRXJyb3InLCBmdW5jdGlvbiAoZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMsIGVycm9yKSB7XG4gICAgICAgICAgIFxuICAgICAgICAgIC8vIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgIGNvbnNvbGUubG9nKFwiU1RBVEUgQ0hBTkdFIEVSUk9SIEVSUk9SIEVSUk9SIEVSUk9SRVJST1JcIik7XG4gICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmhvbWUnKVxuICAgICAgICBcbiAgICAgIH0pO1xuXG4gICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN0YXJ0JywgZnVuY3Rpb24gKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zKSB7XG4gICAgLy9hdXRoU2VydmljZS5pbmZvKCk7XG4gICAgLy9hdXRoU2VydmljZS5pc0F1dGhvcml6ZWQoIGV2ZW50LCBmcm9tU3RhdGUsIHRvU3RhdGUpO1xuICAgIC8vY29uc29sZS5sb2coXCJzdGF0ZSBjaGFuZ2luZ1wiKTtcbiAgICAvL2NvbnNvbGUubG9nKHRvU3RhdGUpXG5cbiAgICAgICAgaWYodG9TdGF0ZS5kYXRhLnBlcm1pc3Npb24gPT09IHRydWUpe1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5lZWQgcGVybWlzc2lvblwiKTtcbiAgICAgICAgICAgIC8vdG9TdGF0ZS5yZXNvbHZlID0gdG9TdGF0ZS5yZXNvbHZlIHx8IHt9O1xuICAgICAgICAgICAgLy90b1N0YXRlLnJlc29sdmUgPSB7fTtcblxuICAgICAgICAgICAgLy9jaGVjayB0byBzZWUgaWYgdGhlcmUgd2FzIGEgcmVzb2x2ZSBhbHJlYWR5IGFkZGVkXG4gICAgICAgICAgICBpZighdG9TdGF0ZS5yZXNvbHZlLmF1dGhvcml6YXRpb25SZXNvbHZlcil7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2FkZGluZyBhdXRoIHJlc29sdmVyJyk7XG4gICAgICAgICAgICAgICAgLy9hZGQgcmVzb2x2ZXJcbiAgICAgICAgICAgICAgICB0b1N0YXRlLnJlc29sdmUuYXV0aG9yaXphdGlvblJlc29sdmVyID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhdXRoU2VydmljZS5pc0F1dGhvcml6ZWQoZXZlbnQsIGZyb21TdGF0ZSwgdG9TdGF0ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJqdXN0IGFkZGVkOiBcIilcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHRvU3RhdGUucmVzb2x2ZS5hdXRob3JpemF0aW9uUmVzb2x2ZXIpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgIC8vanVzdCB0byBzaG93IHRoYXQgdGhlIHJlc29sdmVyIHdhcyBhbHJlYWR5IGFkZGVkXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyh0b1N0YXRlLnJlc29sdmUuYXV0aG9yaXphdGlvblJlc29sdmVyKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gLy9lbmQgaWYgbmVlZHMgcGVybWlzc2lvblxuXG5cbiAgICB9KTsgLy9lbmQgcm9vdFNjb3BlLiRvblxuXG5cbiAgICBcblxufV0pOyAvL2VuZCAucnVuXG5cblxuXG5cblxufSkoKTsgLy9lbmQgaWZmZVxuXG4iLCIoZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0J1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCdhcHAnKVxuXHRcdC5jb250cm9sbGVyKCdhcHBDdHJsJywgYXBwQ3RybClcblxuXHRhcHBDdHJsLiRpbmplY3QgPSBbJ3NhbXBsZVNlcnZpY2UnLCdhdXRoU2VydmljZScsJyRzdGF0ZScsJyRodHRwJywndG9hc3RyJywnJHJvb3RTY29wZScsJ25vdGlmeVNlcnZpY2UnXVxuXG5cdGZ1bmN0aW9uIGFwcEN0cmwoc2FtcGxlU2VydmljZSxhdXRoU2VydmljZSwkc3RhdGUsICRodHRwLCB0b2FzdHIsICRyb290U2NvcGUsbm90aWZ5U2VydmljZSkge1xuXG5cdFx0IHZhciB2bSA9IHRoaXM7XG5cblx0XHQgLy8gb24gaW5pdGlhbCBsb2FkXG5cdFx0IC8vIHVzZXIgbG9naW4gc3RhdHVzXG5cdFx0IHZtLmlzTG9nZ2VkID0gYXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKHZtKTtcblxuXHRcdCAkcm9vdFNjb3BlLiRvbignbG9nZ2VkSW4nLGZ1bmN0aW9uKCl7XG5cdFx0IFx0dm0uaXNMb2dnZWQgPSB0cnVlO1xuXHRcdCB9KVxuXG5cdFx0ICRyb290U2NvcGUuJG9uKCdsb2dnZWRPdXQnLGZ1bmN0aW9uKCl7XG5cdFx0IFx0dm0uaXNMb2dnZWQgPSBmYWxzZTtcblx0XHQgfSlcblxuXHRcdCB2YXIgbWVzc2FnZSA9IHtkYXRhIDogXCJyb29zdHNcIn07XG5cdFx0IC8vbm90aWZ5U2VydmljZS5wdXNoKCBtZXNzYWdlKTtcblxuXHRcdCAvL2FsZXJ0KFwid2F0Y2hpbmdcIik7XG5cblxuXHR9IC8vZW5kIGFwcEN0cmxcblxufSkoKTs7XG5cblxuIiwiKGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCdcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnYXBwJylcblx0XHQuY29udHJvbGxlcignaG9tZUN0cmwnLCBob21lQ3RybClcblx0XHQuY29udHJvbGxlcigncGFyZW50Q3RybCcsIHBhcmVudEN0cmwpXG5cblx0aG9tZUN0cmwuaW5qZWN0ID0gWydzYW1wbGVTZXJ2aWNlJywnJHNjb3BlJ11cblxuXHRmdW5jdGlvbiBob21lQ3RybChzYW1wbGVTZXJ2aWNlLCAkc2NvcGUpIHtcblx0XHRcblx0XHRzYW1wbGVTZXJ2aWNlLmluZm8oKTtcblxuXHQgICAgdmFyIHZtID0gdGhpcztcblxuXHQgICAgdm0uZ290b1Nlc3Npb24gPSBnb3RvU2Vzc2lvbjtcblx0ICAgIHZtLnJlZnJlc2ggPSByZWZyZXNoO1xuXHQgICAgdm0uc2VhcmNoID0gc2VhcmNoO1xuXHQgICAgdm0uc2Vzc2lvbnMgPSBbXTtcblx0ICAgIHZtLnRlc3QgPSAndGVzdCc7XG5cblx0ICAgIC8vLy8vLy8vLy8vL1xuXG5cdCAgICAvLyAkc2NvcGUuJG9uKCdkb2dzJywgZnVuY3Rpb24gKCkge1xuXHQgICAgLy8gXHRjb25zb2xlLmxvZyhcInJlY2VpdmVkXCIpXG5cdCAgICAvLyB9KTtcblxuXHQgICAgZnVuY3Rpb24gZ290b1Nlc3Npb24oKSB7XG5cblx0XHR9XG5cblx0ICAgIGZ1bmN0aW9uIHJlZnJlc2goKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIHNlYXJjaCgpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblx0fSAvLyBlbmQgaG9tZUN0cmxcblxuXHRwYXJlbnRDdHJsLmluamVjdCA9IFsnc2FtcGxlU2VydmljZScsJyRzY29wZSddXG5cblx0ZnVuY3Rpb24gcGFyZW50Q3RybCgkc2NvcGUpIHtcblx0XHRcblx0ICAgIHZhciB2bSA9IHRoaXM7XG5cdCAgICAvL2NvbnNvbGUubG9nKFwicGFyZW50XCIpXG5cblx0ICAgLy8gJHNjb3BlLiRlbWl0KCdkb2dzJywnc29tZSBkYXRhJyk7XG5cblxuXHR9IC8vIGVuZCBwYXJlbnRDdHJsXG5cbn0pKCk7XG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cbiIsIlx0KGZ1bmN0aW9uKCl7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ2FwcCcpXG5cdFx0LmNvbnRyb2xsZXIoXCJsb2dpbkN0cmxcIiwgbG9naW5DdHJsKVxuXG5cdGxvZ2luQ3RybC4kaW5qZWN0ID0gWyckc2NvcGUnLCdzYW1wbGVTZXJ2aWNlJywnYXV0aFNlcnZpY2UnLCckc3RhdGUnLCckaHR0cCcsJ3RvYXN0ciddXG5cblx0ZnVuY3Rpb24gbG9naW5DdHJsKCRzY29wZSxzYW1wbGVTZXJ2aWNlLGF1dGhTZXJ2aWNlLCRzdGF0ZSwgJGh0dHAsIHRvYXN0cikge1xuXHRcdC8vc2FtcGxlU2VydmljZS5pbmZvKCk7XG5cdFx0Ly9jb25zb2xlLmxvZyhcImxvZ2luQ3RybFwiKVxuXG5cdCAgICB2YXIgdm0gPSB0aGlzO1xuXHQgICAgdm0udXNlciA9IFwiXCJcblx0ICAgIHZtLmxvZ2luRm9ybSA9IFwiXCI7XG5cdCAgICBcblx0ICAgIHZtLmxvZ2luID0gbG9naW47XG5cdCAgICB2bS5sb2dvdXQgPSBsb2dvdXQ7XG5cblx0ICAgIC8vLy8vLy8vLy8vL1xuXG5cdCAgICBmdW5jdGlvbiBsb2dpbigpIHtcblx0ICAgIFx0YXV0aFNlcnZpY2UubG9naW4odm0udXNlciwnYXBwLm5vdGVzJylcblx0XHRcdHZtLnVzZXIgPSBcIlwiO1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBsb2dvdXQoKSB7XG5cdCAgICBcdGNvbnNvbGUubG9nKFwibG9nZ2luZyBvdXQuLi5cIilcblx0ICAgIFx0YXV0aFNlcnZpY2UubG9nb3V0KCk7XG5cdCAgICB9XG5cblxuXHR9IC8vZW5kIGxvZ2luQ3RybFxuXG5cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0J1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCdhcHAnKVxuXHRcdC5jb250cm9sbGVyKCduYXZDdHJsJywgbmF2Q3RybClcblxuXHRuYXZDdHJsLmluamVjdCA9IFsnJ11cblxuXHRmdW5jdGlvbiBuYXZDdHJsKCkge1xuXHRcdFxuXHRcdC8vY29uc29sZS5sb2coJ25hdiBjb250cm9sbGVyJyk7XG5cblx0ICAgIHZhciB2bSA9IHRoaXM7XG5cblxuXHQgICAgdm0ubG9nZ2VkSW4gPSB0cnVlO1xuXHQgICAgdm0uZ290b1Nlc3Npb24gPSBnb3RvU2Vzc2lvbjtcblx0ICAgIHZtLnJlZnJlc2ggPSByZWZyZXNoO1xuXHQgICAgdm0uc2VhcmNoID0gc2VhcmNoO1xuXHQgICAgdm0uc2Vzc2lvbnMgPSBbXTtcblx0ICAgIHZtLnRpdGxlID0gJ05hdic7XG5cdCAgICAvLyRzY29wZS50aXRsZSA9IFwibW91c2VcIjtcblxuXHQgICAgLy8vLy8vLy8vLy8vXG5cblx0ICAgIGZ1bmN0aW9uIGdvdG9TZXNzaW9uKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiByZWZyZXNoKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBzZWFyY2goKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cdH1cblxufSkoKTtcblxuXG4iLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwJylcbiAgICAuZGlyZWN0aXZlKCdzZWxlY3RUZXh0Jywgc2VsZWN0VGV4dClcbiAgICBcbiAgICBzZWxlY3RUZXh0LiRpbmplY3QgPSBbJyR3aW5kb3cnXVxuXG5mdW5jdGlvbiBzZWxlY3RUZXh0KCR3aW5kb3cpe1xuICAgIHJldHVybiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgZWxlbWVudC5iaW5kKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghJHdpbmRvdy5nZXRTZWxlY3Rpb24oKS50b1N0cmluZygpKSB7XG4gICAgICAgIHRoaXMuc2V0U2VsZWN0aW9uUmFuZ2UodGhpcy52YWx1ZS5sZW5ndGgsIHRoaXMudmFsdWUubGVuZ3RoKVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xufVxuXG5cbiIsIlxuYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG5cdC5jb25maWcoWyckdXJsUm91dGVyUHJvdmlkZXInLCckc3RhdGVQcm92aWRlcicsJyRodHRwUHJvdmlkZXInLGZ1bmN0aW9uKCR1cmxSb3V0ZXJQcm92aWRlciwkc3RhdGVQcm92aWRlciwkaHR0cFByb3ZpZGVyKXtcblx0XHRcblx0XHQkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCdob21lJyk7XG5cdFx0Ly9zdGF0ZXNcblx0XHQkc3RhdGVQcm92aWRlclxuXG5cdFx0LmRlY29yYXRvcigncGF0aCcsIGZ1bmN0aW9uKHN0YXRlLCBwYXJlbnRGbikge1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhcImNvbmZpZ3VyaW5nIHN0YXRlc1wiKVx0XG5cdFx0XHRpZiAoc3RhdGUuc2VsZi5yZXNvbHZlID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0c3RhdGUuc2VsZi5yZXNvbHZlID0ge307XG5cdFx0XHRcdHN0YXRlLnJlc29sdmUgPSBzdGF0ZS5zZWxmLnJlc29sdmU7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcGFyZW50Rm4oc3RhdGUpO1xuICAgICAgICAgfSlcblxuXHRcdC5zdGF0ZSgnYXBwJyx7XG5cdFx0XHRhYnN0cmFjdDogdHJ1ZSxcblx0XHRcdHRlbXBsYXRlVXJsOidhcHAvdmlld3MvYXBwLnZpZXcuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnYXBwQ3RybCcsXG5cdFx0XHRjb250cm9sbGVyQXM6ICdhcHAnXG5cblx0XHR9KVxuXG5cdFx0LnN0YXRlKCdhcHAuaG9tZScse1xuXHRcdFx0dXJsOiAnL2hvbWUnLFxuXHRcdFx0dGVtcGxhdGVVcmw6J2FwcC92aWV3cy9hcHAuaG9tZS5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdob21lQ3RybCcsXG5cdFx0XHRjb250cm9sbGVyQXM6ICdob21lJyxcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0cGVybWlzc2lvbjogZmFsc2UsXG5cdFx0XHRcdHBlcm1pc3Npb25MZXZlbDogWydldmVyeW9uZSddXG5cdFx0XHR9XG5cdFx0fSlcblxuXHRcdC5zdGF0ZSgnYXBwLnJlZ2lzdGVyJyx7XG5cdFx0XHR1cmw6ICcvcmVnaXN0ZXInLFxuXHRcdFx0dGVtcGxhdGVVcmw6J2NvbXBvbmVudHMvcmVnaXN0ZXIvdmlld3MvcmVnaXN0ZXIudmlldy5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdyZWdpc3RlckN0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAncmVnaXN0ZXInLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRwZXJtaXNzaW9uOiBmYWxzZSxcblx0XHRcdFx0cGVybWlzc2lvbkxldmVsOiBbJ2V2ZXJ5b25lJ11cblx0XHRcdH1cblx0XHR9KVxuXG5cdFx0LnN0YXRlKCdhcHAubWVtYmVycycse1xuXHRcdFx0dXJsOiAnL21lbWJlcnMnLFxuXHRcdFx0dGVtcGxhdGVVcmw6J2NvbXBvbmVudHMvbWVtYmVycy92aWV3cy9tZW1iZXJzLmhvbWUuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnbWVtYmVyc0N0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAnbWVtYmVycycsXG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdHBlcm1pc3Npb246IHRydWUsXG5cdFx0XHRcdHBlcm1pc3Npb25MZXZlbDogWydhZG1pbicsJ21lbWJlciddXG5cdFx0XHR9XG5cdFx0fSlcblxuXHRcdC5zdGF0ZSgnYXBwLm5vdGVzJyx7XG5cdFx0XHR1cmw6ICcvbm90ZXMnLFxuXHRcdFx0dGVtcGxhdGVVcmw6J2NvbXBvbmVudHMvbm90ZXMvdmlld3Mvbm90ZXMudmlldy5odG1sJyxcblxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRwZXJtaXNzaW9uOiB0cnVlLFxuXHRcdFx0XHRwZXJtaXNzaW9uTGV2ZWw6IFsnYWRtaW4nLCdtZW1iZXInXVxuXHRcdFx0fVxuXHRcdH0pXG5cblx0XHQuc3RhdGUoJ2FwcC5idWRnZXQnLHtcblx0XHRcdHVybDogJy9idWRnZXQnLFxuXHRcdFx0dGVtcGxhdGVVcmw6J2NvbXBvbmVudHMvYnVkZ2V0L3ZpZXdzL2J1ZGdldC52aWV3Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ2J1ZGdldEN0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAnYnVkZ2V0Jyxcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0cGVybWlzc2lvbjogdHJ1ZSxcblx0XHRcdFx0cGVybWlzc2lvbkxldmVsOiBbJ2FkbWluJ11cblx0XHRcdH1cblx0XHR9KVxuXG5cdFx0Ly8kaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKCdhdXRoSW50ZXJjZXB0b3InKTtcblxuXG5cblx0fV0pO1xuXG4iLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXV0aCcsIFtcbiAgICAgIFxuICAgIF0pOyIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdidWRnZXQnLCBbXG4gICAgICAnY2hhcnQuanMnXG4gICAgXSk7IiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ21lbWJlcnMnLCBbXG4gICAgICBcbiAgICBdKTsiLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgnbm90ZXMnLCBbXG4gICAgICBcbiAgICBdKTsiLCIoZnVuY3Rpb24oKXtcblx0J3VzZSBzdHJpY3QnXG5cbmFuZ3VsYXJcblx0Lm1vZHVsZSgnbm90aWZ5JywgW1xuXHQgIFxuXHRdKTtcblxufSkoKTtcblxuXG4iLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgncmVnaXN0ZXInLCBbXG4gICAgXHQnYXV0aCdcbiAgICBdKTsiLCIoZnVuY3Rpb24oKXtcblx0J3VzZSBzdHJpY3QnXG5cbmFuZ3VsYXJcblx0Lm1vZHVsZSgnc2FtcGxlJywgW1xuXHQgIFxuXHRdKTtcblxufSkoKTtcblxuIiwiKGZ1bmN0aW9uKCl7XG4gICAgJ3VzZSBzdHJpY3QnXG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2F1dGgnKVxuICAgICAgICAuZmFjdG9yeSgnYXV0aEludGVyY2VwdG9yJywgYXV0aEludGVyY2VwdG9yKTtcblxuICAgIGF1dGhJbnRlcmNlcHRvci4kaW5qZWN0ID0gWydhdXRoU2VydmljZSddXG5cbiAgICBmdW5jdGlvbiBhdXRoSW50ZXJjZXB0b3IoYXV0aFNlcnZpY2UpIHtcblxuXG5cbiAgICAgICAgdmFyIHNlcnZpY2UgPSB7XG5cbiAgICAgICAgICAgIHJlcXVlc3Q6IHJlcXVlc3QsXG4gICAgICAgICAgICByZXNwb25zZTogcmVzcG9uc2VcblxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBzZXJ2aWNlO1xuXG4gICAgICAgIC8vLy8vLy8vLy8vL1xuXG4gICAgICAgIGZ1bmN0aW9uIHJlcXVlc3QoY29uZmlnKSB7XG5cbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJhdXRoSW50ZXJjZXB0b3IgcmVxdWVzdCBmdW5jdGlvblwiKVxuXG4gICAgICAgICAgICB2YXIgdG9rZW4gPSBhdXRoU2VydmljZS5nZXRUb2tlbigpO1xuXG4gICAgICAgICAgICBpZih0b2tlbil7XG4gICAgICAgICAgICAgICAgY29uZmlnLmhlYWRlcnMudG9rZW4gPSB0b2tlbjtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInRva2VuIHByZXNlbnRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibm8gdG9rZW5cIik7XG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICAgICAgcmV0dXJuIGNvbmZpZztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHJlc3BvbnNlKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiYXV0aEludGVyY2VwdG9yIHJlc3BvbnNlIGZ1bmN0aW9uXCIpXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgIH1cblxuICAgIH0gLy9lbmQgYXV0aEludGVyY2VwdG9yXG5cbiAgICBcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHQvLyd1c2Ugc3RyaWN0J1xuXG5cdGFuZ3VsYXJcbiAgICBcdC5tb2R1bGUoJ2F1dGgnLFtdKVxuICAgIFx0LmZhY3RvcnkoJ2F1dGhTZXJ2aWNlJywgYXV0aFNlcnZpY2UpO1xuXG4gICAgYXV0aFNlcnZpY2UuJGluamVjdCA9IFsnJHdpbmRvdycsJyRodHRwJywndG9hc3RyJywnJHN0YXRlJywnJHJvb3RTY29wZScsJyRsb2NhdGlvbicsJyRxJ107XG5cbiAgICBmdW5jdGlvbiBhdXRoU2VydmljZSgkd2luZG93LCRodHRwLHRvYXN0ciwkc3RhdGUsJHJvb3RTY29wZSwkbG9jYXRpb24sJHEpIHtcblxuICAgIFxuXG4gICAgXHR2YXIgc2VydmljZSA9IHtcblxuICAgICAgICAgICAgaW5mbzogaW5mbyxcblxuICAgICAgICAgICAgbG9naW46IGxvZ2luLFxuICAgICAgICAgICAgbG9nb3V0OiBsb2dvdXQsXG5cbiAgICBcdFx0c2V0VG9rZW46IHNldFRva2VuLFxuICAgICAgICAgICAgZ2V0VG9rZW46IGdldFRva2VuLFxuICAgIFx0XHRjbGVhclRva2VuOiBjbGVhclRva2VuLFxuXG4gICAgICAgICAgICBpc0F1dGhlbnRpY2F0ZWQ6IGlzQXV0aGVudGljYXRlZCwgLy8gdmVyaWZpZXMgdG9rZW5cbiAgICAgICAgICAgIGlzQXV0aG9yaXplZDogaXNBdXRob3JpemVkIC8vIHZlcmlmaWVzIHJvdXRlIHBlcm1pc3Npb25zXG5cbiAgICBcdH07XG5cbiAgICBcdHJldHVybiBzZXJ2aWNlO1xuXG4gICAgXHQvLy8vLy8vLy8vLy9cblxuICAgICAgICBmdW5jdGlvbiBpbmZvICgpIHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJhdXRoIHNlcnZpY2VcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyByZWRpcmVjdCB0YWtlcyByb3V0ZSBzdHJpbmcgaWUuICdhcHAuaG9tZSdcbiAgICAgICAgZnVuY3Rpb24gbG9naW4gKHVzZXJMb2dpbkRhdGEsIHJlZGlyZWN0KSB7XG4gICAgICAgICAgICAkaHR0cC5wb3N0KCdodHRwOi8vbG9jYWxob3N0OjMwMDAvYXBpL3VzZXJzL2xvZ2luJywgdXNlckxvZ2luRGF0YSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXMpe1xuICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgICAgICAgICAgICAgIGlmKHJlcy5zdGF0dXMgPT0gMjAwKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRva2VuKHJlcy5kYXRhLnRva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGVtaXQoXCJsb2dnZWRJblwiKTsgIFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9hc3RyLnN1Y2Nlc3MocmVzLmRhdGEubWVzc2FnZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHR5cGVvZihyZWRpcmVjdCkgIT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28ocmVkaXJlY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmdW5jdGlvbihlcnIpe1xuICAgICAgICAgICAgICAgICAgICB0b2FzdHIuZXJyb3IoZXJyLmRhdGEubWVzc2FnZSlcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKVxuICAgICAgICAgICAgICAgIH0pXG5cblxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gbG9nb3V0ICgpIHtcbiAgICAgICAgICAgIGNsZWFyVG9rZW4oKTtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGVtaXQoXCJsb2dnZWRPdXRcIik7XG4gICAgICAgICAgICAkc3RhdGUuZ28oXCJhcHAuaG9tZVwiKTtcbiAgICAgICAgICAgIHRvYXN0ci5zdWNjZXNzKFwiWW91IGhhdmUgYmVlbiBsb2dnZWQgb3V0XCIpO1xuICAgICAgICB9XG5cblxuXG4gICAgXHRmdW5jdGlvbiBzZXRUb2tlbiAodG9rZW4pIHtcbiAgICAgICAgICAgICR3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3VzZXJUb2tlbicsdG9rZW4pO1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBnZXRUb2tlbiAoKSB7XG4gICAgICAgICAgICB2YXIgdG9rZW4gPSAkd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKCd1c2VyVG9rZW4nKTtcbiAgICAgICAgICAgIHJldHVybiB0b2tlbjtcblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gY2xlYXJUb2tlbiAoKSB7XG4gICAgICAgICAgICAkd2luZG93LmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCd1c2VyVG9rZW4nKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdyYWJiaXRzJylcblx0ICAgIH1cblxuICAgICAgICAvL2Jhc2ljYWxseSBhcmUgdGhleSBsb2dnZWQgaW5cbiAgICAgICAgZnVuY3Rpb24gaXNBdXRoZW50aWNhdGVkICgpIHtcblxuICAgICAgICAgICAgdmFyIHRva2VuID0gZ2V0VG9rZW4oKTtcbiAgICAgICAgICAgIGlmKHRva2VuKXtcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCdodHRwOi8vbG9jYWxob3N0OjMwMDAvYXBpL3VzZXJzL2F1dGhvcml6ZScse3Rva2VuOnRva2VufSlcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhyZXMpXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnYXV0aG9yaXppbmcuLicpXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiggcmVzLmRhdGEuc3VjY2VzcyA9PSB0cnVlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2FzdHIuc3VjY2VzcyhcIkF1dGhlbnRpY2F0aW9uIFN1Y2Nlc3MhXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJBdXRoZW50aWNhdGlvbiBTdWNjZXNzIVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGVtaXQoXCJsb2dnZWRJblwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3RvYXN0ci5lcnJvcihcIkF1dGhlbnRpY2F0aW9uIEZhaWxlZFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQXV0aGVudGljYXRpb24gRmFpbGVkXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LGZ1bmN0aW9uKGVycil7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b2FzdHIuZXJyb3IoZXJyLmRhdGEpXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAvL3RvYXN0ci5lcnJvcihcImF1dGhlbnRpY2F0aW9uIGZhaWxlZCwgbm8gdG9rZW4gcHJlc2VudFwiKVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYXV0aGVudGljYXRpb24gZmFpbGVkLCBubyB0b2tlbiBwcmVzZW50XCIpXG4gICAgICAgICAgICB9IFxuICAgICAgICAgICBcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGlzQXV0aG9yaXplZCAoZXZlbnQsIGZyb21TdGF0ZSwgdG9TdGF0ZSkge1xuICAgICAgICAgICAgICAgIC8vcmV0dXJuICRxLnJlamVjdCgpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicnVubmluZyBpcyBhdXRob3JpemVkXCIpXG5cbiAgICAgICAgICAgICAgICAvL2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgdmFyIHRva2VuID0gZ2V0VG9rZW4oKTtcbiAgICAgICAgICAgICAgICB2YXIgdXNlcmxldmVsID0gbnVsbDtcbiAgICAgICAgICAgICAgICB2YXIgcHJvY2VlZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgaWYodG9rZW4pe1xuICAgICAgICAgICAgICAgICAgLy8gIHJldHVybiAkcS5yZWplY3Q7XG4gICAgICAgICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGkvdXNlcnMvYXV0aG9yaXplJyx7dG9rZW46dG9rZW59KVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdhdXRob3JpemluZy4uJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiggcmVzLmRhdGEuc3VjY2VzcyA9PSB0cnVlICYmIHJlcy5kYXRhLnByb2ZpbGUudXNlckxldmVsKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcy5kYXRhLnByb2ZpbGUudXNlckxldmVsKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyTGV2ZWwgPSByZXMuZGF0YS5wcm9maWxlLnVzZXJMZXZlbDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vbG9vcCB0aHJvdWdoIHBlcm1pc3Npb24gbGlzdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGk9MDsgaSA8IHRvU3RhdGUuZGF0YS5wZXJtaXNzaW9uTGV2ZWwubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vaWYgY3VycmVudCB1c2VybGV2ZWwgbWF0Y2hlcyBwZXJtaXNzaW9uIGxldmVsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy90aGVuIHNldCBwcm9jZWVkIHRvIHRydWUgYW5kIGJyZWFrIHRoZSBmb3IgbG9vcCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImN1cnJlbnQgbG9vcCBpIDogXCIgKyB0b1N0YXRlLmRhdGEucGVybWlzc2lvbkxldmVsW2ldKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHVzZXJMZXZlbCA9PSB0b1N0YXRlLmRhdGEucGVybWlzc2lvbkxldmVsW2ldKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicGVybWlzc2lvbiBtYXRjaFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzZXR0aW5nIHByb2NlZWQgdHJ1ZVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2VlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vcmV0dXJuIHRvYXN0ci5zdWNjZXNzKFwicHJvY2VlZFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImtlZXAgbG9va2luZ1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzZXR0aW5nIHByb2NlZWQgZmFsc2VcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2NlZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfS8vZW5kIGZvciBsb29wICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IC8vIGVuZCBpZiBwcm9maWxlIHJldHVybmVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZWxzZSBubyBwcm9maWxlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9hc3RyLmVycm9yKFwiYmFkIHJlcXVlc3RcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2VlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibGFzdCBjaGVja1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHByb2NlZWQgPT0gZmFsc2Upe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIklUUyBGQUxTRVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmhvbWUnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pIC8vZW5kIHRoZW5cbiAgICAgICAgICAgICAgICB9Ly9lbmQgaWYgdG9rZW5cblxuICAgICAgICAgICAgICAgIC8vZWxzZSBubyB0b2tlbiBcbiAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICB0b2FzdHIuZXJyb3IoXCJubyB0b2tlbiBwcmVzZW50XCIpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgXG5cbiAgICAgICAgfS8vZW5kIGlzQXV0aG9yaXplZFxuICAgICAgICBcblxuICAgIH0vL2VuZCBhdXRoU2VydmljZVxuXG4gICAgXG5cblxuXG5cdFxuXG59KSgpOyAvL2VuZCBpZmZlXG5cblxuIiwiKGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCdcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnYnVkZ2V0Jylcblx0XHQuY29udHJvbGxlcignYnVkZ2V0Q3RybCcsIGJ1ZGdldEN0cmwpXG5cblx0YnVkZ2V0Q3RybC4kaW5qZWN0ID0gWyckc2NvcGUnLCckaHR0cCcsJ3RvYXN0ciddXG5cblx0ZnVuY3Rpb24gYnVkZ2V0Q3RybCgkc2NvcGUsICRodHRwLCB0b2FzdHIpIHtcblx0XHRjb25zb2xlLmxvZygnbG9hZGVkIGJ1ZGdldEN0cmwnKTtcblx0XG5cdFx0Ly8gJHNjb3BlLk1hdGggPSB3aW5kb3cuTWF0aDtcblxuXHRcdCAgICBcblxuXG4gIFx0XHRcdC8vIGluY29tZVxuICBcdFx0XHQkc2NvcGUuaW5jb21lID0ge31cbiAgXHRcdFx0JHNjb3BlLmluY29tZS5tb250aGx5ID0gNDUwMDtcblxuICBcdFx0XHQvLyBiaWxsc1xuICBcdFx0XHQkc2NvcGUuYmlsbHMgPVtdXG4gIFx0XHRcdCRzY29wZS5iaWxscyA9IFtcbiAgXHRcdFx0XHR7bmFtZTpcInJlbnRcIiwgY29zdDogMjUwMH0sXG4gIFx0XHRcdFx0e25hbWU6XCJ1dGlsaXRpZXNcIiwgY29zdDogMjAwfSxcbiAgXHRcdFx0XHR7bmFtZTpcImNhciBpbnN1cmFuY2VcIiwgY29zdDogMTUwfSxcbiAgXHRcdFx0XHR7bmFtZTpcImNhciBwYXltZW50XCIsIGNvc3Q6IDI1MH0sXG4gIFx0XHRcdFx0e25hbWU6XCJnYXNcIiwgY29zdDogMTAwfSxcbiAgXHRcdFx0XHR7bmFtZTpcImd5bSBtZW1iZXJzaGlwXCIsIGNvc3Q6IDUwfSxcbiAgXHRcdFx0XHR7bmFtZTpcImNlbGwgcGhvbmVcIiwgY29zdDogODB9LFxuXG4gIFx0XHRcdF1cblxuICAgICAgICBcblxuICBcdFx0XHQkc2NvcGUuYWRkTmV3QmlsbCA9IGZ1bmN0aW9uKCl7XG4gIFx0XHRcdFx0JHNjb3BlLmJpbGxzLnB1c2goe25hbWU6ICRzY29wZS5uZXdCaWxsTmFtZSwgY29zdDogMCB9KVxuICBcdFx0XHRcdCRzY29wZS5uZXdCaWxsTmFtZSA9IFwiXCI7XG4gIFx0XHRcdH1cblxuICBcdFx0XHQkc2NvcGUucmVtb3ZlQmlsbEl0ZW0gPSBmdW5jdGlvbihpbmRleCl7XG4gIFx0XHRcdFx0JHNjb3BlLmJpbGxzLnNwbGljZShpbmRleCwxKTtcbiAgXHRcdFx0fVxuXG4gIFx0XHRcdC8vYnVkZ2V0IGl0ZW1zXG4gIFx0XHRcdCRzY29wZS5idWRnZXRJdGVtcyA9IFtdO1xuICBcdFx0XHQkc2NvcGUuYnVkZ2V0SXRlbXMgPSBbXG4gIFx0XHRcdFx0e25hbWU6IFwiZWF0IG91dFwiLCBidWRnZXQ6IDEwMCwgc3BlbnQ6IDMwIH0sXG4gIFx0XHRcdFx0e25hbWU6IFwiY2xvdGhpbmdcIiwgYnVkZ2V0OiAyMDAsIHNwZW50OiA5MH1cbiAgXHRcdFx0XVxuXG4gIFx0XHRcdCRzY29wZS5hZGROZXdCdWRnZXRJdGVtID0gZnVuY3Rpb24oKXtcbiAgXHRcdFx0XHQkc2NvcGUuYnVkZ2V0SXRlbXMucHVzaCh7bmFtZTogJHNjb3BlLm5ld0J1ZGdldEl0ZW1OYW1lLCBidWRnZXQ6IDAsIHNwZW50OiAwIH0pXG4gIFx0XHRcdFx0JHNjb3BlLm5ld0J1ZGdldEl0ZW1OYW1lID0gXCJcIjtcbiAgXHRcdFx0fVxuXG4gICAgICAgICRzY29wZS5wdXJjaGFzZXMgPSBbXVxuICAgICAgICAkc2NvcGUucHVyY2hhc2VzID0gW3tjYXRlZ29yeTogXCJlYXQgb3V0XCJ9XVxuXG4gICAgICAgICRzY29wZS5hZGRQdXJjaGFzZUl0ZW0gPSBmdW5jdGlvbigpe1xuXG4gICAgICAgIH1cblxuXG4gICAgICAgICRzY29wZS5tb250aGx5T3ZlcnZpZXcgPSB7fTtcbiAgICAgICAgJHNjb3BlLm1vbnRobHlPdmVydmlldy5iaWxsc1RvdGFsID0gMDtcbiAgICAgICAgJHNjb3BlLm1vbnRobHlPdmVydmlldy5idWRnZXRUb3RhbCA9IDA7XG4gICAgICAgICRzY29wZS5tb250aGx5T3ZlcnZpZXcuYnVkZ2V0U3BlbnRUb3RhbCA9IDA7XG4gICAgICAgICRzY29wZS5tb250aGx5T3ZlcnZpZXcudG90YWxFc3RpbWF0ZWRFeHBlbmRpdHVyZSA9IDA7XG5cbiAgICAgICAgXG4gICAgICAgICRzY29wZS5jYWxjdWxhdGVCaWxsc1RvdGFsID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIHRvdGFsID0gMDtcbiAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgJHNjb3BlLmJpbGxzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIHRvdGFsID0gdG90YWwgKyAkc2NvcGUuYmlsbHNbaV0uY29zdDtcbiAgICAgICAgICB9XG4gICAgICAgICAgJHNjb3BlLm1vbnRobHlPdmVydmlldy5iaWxsc1RvdGFsID0gdG90YWw7XG4gICAgICAgICAgJHNjb3BlLmNhbGN1bGF0ZVRvdGFsRXhwZW5kaXR1cmUoKVxuICAgICAgICAgIHJldHVybiB0b3RhbDtcbiAgICAgICAgfVxuXG4gICAgICAgIFxuXG4gICAgICAgICRzY29wZS5jYWxjdWxhdGVCdWRnZXRUb3RhbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciB0b3RhbCA9IDA7XG4gICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8ICRzY29wZS5idWRnZXRJdGVtcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICB0b3RhbCA9IHRvdGFsICsgJHNjb3BlLmJ1ZGdldEl0ZW1zW2ldLmJ1ZGdldDtcbiAgICAgICAgICB9XG4gICAgICAgICAgJHNjb3BlLm1vbnRobHlPdmVydmlldy5idWRnZXRUb3RhbCA9IHRvdGFsO1xuICAgICAgICAgICRzY29wZS5jYWxjdWxhdGVUb3RhbEV4cGVuZGl0dXJlKClcbiAgICAgICAgICByZXR1cm4gdG90YWw7ICAgICAgIFxuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLmNhbGN1bGF0ZUJ1ZGdldFNwZW50VG90YWwgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgdG90YWwgPSAwO1xuICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCAkc2NvcGUuYnVkZ2V0SXRlbXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgdG90YWwgPSB0b3RhbCArICRzY29wZS5idWRnZXRJdGVtc1tpXS5zcGVudDtcbiAgICAgICAgICB9XG4gICAgICAgICAgJHNjb3BlLm1vbnRobHlPdmVydmlldy5idWRnZXRTcGVudFRvdGFsID0gdG90YWw7XG4gICAgICAgICAgLy8kc2NvcGUuY2FsY3VsYXRlVG90YWxFeHBlbmRpdHVyZSgpXG4gICAgICAgICAgcmV0dXJuIHRvdGFsOyAgICAgICBcbiAgICAgICAgfVxuXG4gICAgICAgIFxuXG5cblxuICAgICAgICRzY29wZS4kd2F0Y2goXCJiaWxsc1wiLCAkc2NvcGUuY2FsY3VsYXRlQmlsbHNUb3RhbCwgdHJ1ZSlcbiAgICAgICAkc2NvcGUuJHdhdGNoKFwiYnVkZ2V0SXRlbXNcIiwgJHNjb3BlLmNhbGN1bGF0ZUJ1ZGdldFRvdGFsLCB0cnVlKVxuICAgICAgICRzY29wZS4kd2F0Y2goXCJidWRnZXRJdGVtc1wiLCAkc2NvcGUuY2FsY3VsYXRlQnVkZ2V0U3BlbnRUb3RhbCwgdHJ1ZSlcblxuICAgICAvLyAkc2NvcGUuJHdhdGNoKFwiYnVkZ2V0SXRlbXNcIiwgJHNjb3BlLmNhbGN1bGF0ZUJ1ZGdldFRvdGFsLCB0cnVlKVxuXG5cbiAgICAgICAgJHNjb3BlLmNhbGN1bGF0ZVRvdGFsRXhwZW5kaXR1cmUgPSBmdW5jdGlvbiAgKCkge1xuICAgICAgICAgICAgICRzY29wZS5tb250aGx5T3ZlcnZpZXcudG90YWxFc3RpbWF0ZWRFeHBlbmRpdHVyZSA9ICRzY29wZS5tb250aGx5T3ZlcnZpZXcuYmlsbHNUb3RhbCArICRzY29wZS5tb250aGx5T3ZlcnZpZXcuYnVkZ2V0VG90YWw7XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuY2FsY3VsYXRlQmlsbHNUb3RhbCgpO1xuICAgICAgICAkc2NvcGUuY2FsY3VsYXRlQnVkZ2V0VG90YWwoKTtcbiAgICAgICAgJHNjb3BlLmNhbGN1bGF0ZUJ1ZGdldFNwZW50VG90YWwoKTtcbiAgICAgICAgJHNjb3BlLmNhbGN1bGF0ZVRvdGFsRXhwZW5kaXR1cmUoKTtcblxuICAgICAgICAkc2NvcGUubGFiZWxzID0gW1wiQmlsbHNcIiwgXCJCdWRnZXRcIiwgXCJSZW1haW5pbmdcIl07XG4gICAgICAgICRzY29wZS5kYXRhID0gWyRzY29wZS5tb250aGx5T3ZlcnZpZXcuYmlsbHNUb3RhbCxcbiAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm1vbnRobHlPdmVydmlldy5idWRnZXRUb3RhbCxcbiAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmluY29tZS5tb250aGx5IC0gJHNjb3BlLm1vbnRobHlPdmVydmlldy50b3RhbEVzdGltYXRlZEV4cGVuZGl0dXJlXTtcblxuXG5cblxuXG5cdH1cblxufSkoKTtcblxuXG4iLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgnbm90ZXMnKVxuICAgIC5kaXJlY3RpdmUoJ25vdGVDYXJkJywgbm90ZUNhcmQpO1xuXG5mdW5jdGlvbiBub3RlQ2FyZCgpIHtcblx0cmV0dXJue1xuXHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0c2NvcGU6IHtcblx0XHRcdGRhdGE6IFwiPVwiLFxuXHRcdFx0ZHJhZ2dhYmxlOiBcIj1cIlxuXHRcdH0sXG5cdFx0cmVwbGFjZTogdHJ1ZSxcblx0XHR0ZW1wbGF0ZTogXCI8aDE+e3tkb2dzfX17e2RyYWdTdGF0dXN9fTwvaDE+XCIsXG5cdFx0bGluazogZnVuY3Rpb24oc2NvcGUsZWxlbWVudCl7XG5cdFx0XHRlbGVtZW50LmNsaWNrKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKGVsZW1lbnQpXG5cdFx0XHRcdGVsZW1lbnRbMF0uZHJhZ2dhYmxlID0gdHJ1ZTtcblx0XHRcdH0pXG5cdFx0fSxcblx0XHRjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpe1xuXHRcdFx0Ly9hbGVydChcImNvbnRyb2xsZXJcIik7XG5cdFx0XHQkc2NvcGUuZG9ncyA9ICRzY29wZS5kYXRhICsgXCJkb2dzXCI7XG5cdFx0XHRpZigkc2NvcGUuZHJhZ2dhYmxlKVxuXHRcdFx0XHQkc2NvcGUuZHJhZ1N0YXR1cyA9IGZhbHNlO1xuXHRcdFx0ZWxzZSAkc2NvcGUuZHJhZ1N0YXR1cyA9IHRydWU7XG5cblx0XHRcdFxuXHRcdH1cblx0fVxufVxuXG5cblxuLy8gYW5ndWxhclxuLy8gICAgIC5tb2R1bGUoJ25vdGVzJylcbi8vICAgICAuZGlyZWN0aXZlKCdub3RlQ2FyZCcsIG5vdGVDYXJkKTtcblxuLy8gZnVuY3Rpb24gbm90ZUNhcmQoKSB7XG4vLyBcdHJldHVybntcbi8vIFx0XHRyZXN0cmljdDogJ0UnLFxuLy8gXHRcdGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSl7XG4vLyBcdFx0XHRhbGVydChcImNvbnRyb2xsZXJcIik7XG4vLyBcdFx0XHRjb25zb2xlLmxvZygnZG9nJylcbi8vIFx0XHR9LFxuLy8gXHRcdHRlbXBsYXRlVXJsOiAnJyxcbi8vIFx0XHRyZXBsYWNlOiB0cnVlXG4vLyBcdFx0Ly8gc2NvcGU6IHt9XG4vLyBcdH1cbi8vIH0iLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgnbm90ZXMnKVxuICAgIC5kaXJlY3RpdmUoJ25vdGVDYXJkcycsIG5vdGVDYXJkcylcblxuXG4gICAgXG5cbmZ1bmN0aW9uIG5vdGVDYXJkcygpIHtcblx0cmV0dXJue1xuXHRcdHJlc3RyaWN0OiAnQUUnLFxuXHRcdHNjb3BlOiB7XG5cdFx0XHRub3RlczogXCI9XCIsXG5cdFx0XHRuZXdJdGVtOiBcIj1cIlxuXHRcdH0sXG5cdFx0cmVwbGFjZTogZmFsc2UsXG5cdFx0dHJhbnNjbHVkZTogZmFsc2UsXG5cdFx0dGVtcGxhdGVVcmw6IFwiY29tcG9uZW50cy9ub3Rlcy92aWV3cy9ub3RlLmRpcmVjdGl2ZS52aWV3Lmh0bWxcIixcblx0XHRsaW5rOiBmdW5jdGlvbihzY29wZSxlbGVtZW50LGF0dHJzKXtcblx0XHRcdC8vJCggXCIjc29ydGFibGVcIiApLnNvcnRhYmxlKCk7XG5cdFx0XHQvL2NvbnNvbGUubG9nKHNjb3BlKVxuXHRcdFx0Ly9jb25zb2xlLmxvZyhlbGVtZW50KVxuXHRcdFx0Ly9jb25zb2xlLmxvZyhhdHRycylcblx0XHRcdC8vZWxlbWVudC5zb3J0YWJsZSgpO1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhzY29wZS5ub3Rlcylcblx0XHRcdHNjb3BlLmRvZ3MgPSBmdW5jdGlvbihub3RlKXtcblx0XHRcdFx0Y29uc29sZS5sb2cobm90ZSlcblx0XHRcdH1cblxuXG5cdFx0XHRlbGVtZW50LnNvcnRhYmxlKHtcblx0XHQgICAgICAgLy8gcGxhY2Vob2xkZXI6IFwidWktc3RhdGUtaGlnaGxpZ2h0XCIsXG5cdFx0ICAgICAgICBzdGFydDogZnVuY3Rpb24oZXZlbnQsIHVpKSB7XG5cdFx0ICAgICAgICAgICAgdmFyIHN0YXJ0X3BvcyA9IHVpLml0ZW0uaW5kZXgoKTtcblx0XHQgICAgICAgICAgICB1aS5pdGVtLmRhdGEoJ3N0YXJ0X3BvcycsIHN0YXJ0X3Bvcyk7XG5cdFx0ICAgICAgICB9LFxuXHRcdCAgICAgICAgdXBkYXRlOiBmdW5jdGlvbihldmVudCwgdWkpIHtcblx0XHQgICAgICAgICAgICB2YXIgc3RhcnRfcG9zID0gdWkuaXRlbS5kYXRhKCdzdGFydF9wb3MnKTtcblx0XHQgICAgICAgICAgICB2YXIgZW5kX3BvcyA9IHVpLml0ZW0uaW5kZXgoKTtcblx0XHQgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHN0YXJ0X3BvcyArICcgLSAnICsgZW5kX3Bvcyk7XG5cdFx0ICAgICAgICAgIFxuXHRcdCAgICAgICAgICB2YXIgc3RhcnRJdGVtID0gc2NvcGUubm90ZXNbc3RhcnRfcG9zXTtcblx0XHQgICAgICAgICAgIHNjb3BlLm5vdGVzLnNwbGljZShzdGFydF9wb3MsMSlcblx0XHQgICAgICAgICAgIHNjb3BlLm5vdGVzLnNwbGljZShlbmRfcG9zLDAsIHN0YXJ0SXRlbSlcblx0XHQgICAgICAgICAgIHNjb3BlLiRhcHBseSgpO1xuXG5cdFx0ICAgICAgICAgICAvL2NvbnNvbGUubG9nKHNjb3BlLm5vdGVzKVxuXHRcdCAgICAgICAgICAgXG5cdFx0ICAgICAgICAgICBcblx0XHQgICAgICAgIH1cblx0XHQgICAgfSk7IC8vIGVuZCBzb3J0YWJsZVxuXG5cdFx0ICAgXG5cblx0XHQgICAgY29uc29sZS5sb2coZWxlbWVudClcblxuXG5cdFx0fSxcblx0XHRjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpe1xuXHRcdFx0JHNjb3BlLmZvcm0gPXt9XG5cdFx0XHQkc2NvcGUuYWRkSXRlbSA9IGZ1bmN0aW9uKGluZGV4LGl0ZW0pe1xuXHRcdFx0XHQvL2FsZXJ0KGluZGV4KVxuXHRcdFx0XHRjb25zb2xlLmxvZygkc2NvcGUubmV3SXRlbSlcblx0XHRcdFx0JHNjb3BlLm5vdGVzW2luZGV4XS5pdGVtcy5wdXNoKGl0ZW0pXG5cdFx0XHRcdCRzY29wZS5mb3JtID0ge31cblx0XHRcdFx0Ly9jb25zb2xlLmxvZygkc2NvcGUubm90ZXNbaW5kZXhdLml0ZW1zKVxuXHRcdFx0fVxuXG5cdFx0XHQkc2NvcGUuZGVsZXRlTm90ZSA9IGZ1bmN0aW9uKGluZGV4KXtcblx0XHRcdFx0JHNjb3BlLm5vdGVzLnNwbGljZShpbmRleCwxKTtcblx0XHRcdH1cblxuXG5cdFx0XHQvL2FsZXJ0KFwiY29udHJvbGxlclwiKTtcblx0XHRcdC8vICRzY29wZS5kb2dzID0gJHNjb3BlLmRhdGEgKyBcImRvZ3NcIjtcblx0XHRcdC8vIGlmKCRzY29wZS5kcmFnZ2FibGUpXG5cdFx0XHQvLyBcdCRzY29wZS5kcmFnU3RhdHVzID0gZmFsc2U7XG5cdFx0XHQvLyBlbHNlICRzY29wZS5kcmFnU3RhdHVzID0gdHJ1ZTtcblxuXHRcdFx0XG5cdFx0fVxuXHR9XG59IC8vZW5kIG5vdGVjYXJkcyBkaXJlY3RpdmVcblxuYW5ndWxhclxuXHQubW9kdWxlKCdub3RlcycpXG5cdC5kaXJlY3RpdmUoJ25vdGVDYXJkJywgbm90ZUNhcmQpXG5cbmZ1bmN0aW9uIG5vdGVDYXJkKCkge1xuXG5cdHZhciB0ZW1wRGF0YSA9IHt9O1xuXHR2YXIgdGVtcE5vdGUgPSBudWxsO1xuXG5cdHJldHVybntcblx0XHRyZXN0cmljdDogJ0FFJyxcblx0XHRzY29wZToge1xuXHRcdFx0bm90ZTogXCI9XCIsXG5cdFx0XHRub3RlczogXCI9XCJcblx0XHR9LFxuXHRcdHJlcGxhY2U6IHRydWUsXG5cdFx0dHJhbnNjbHVkZTogZmFsc2UsXG5cdFx0dGVtcGxhdGVVcmw6IFwiY29tcG9uZW50cy9ub3Rlcy92aWV3cy9ub3Rlcy5pdGVtcy52aWV3Lmh0bWxcIixcblx0XHRsaW5rOiBmdW5jdGlvbihzY29wZSxlbGVtZW50LGF0dHJzKXtcblx0XHRcdC8vJCggXCIjc29ydGFibGVcIiApLnNvcnRhYmxlKCk7XG5cdFx0XHQvL2NvbnNvbGUubG9nKHNjb3BlKVxuXHRcdFx0Ly9jb25zb2xlLmxvZyhlbGVtZW50KVxuXHRcdFx0Ly9jb25zb2xlLmxvZyhhdHRycylcblx0XHRcdC8vZWxlbWVudC5zb3J0YWJsZSgpO1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhzY29wZS5ub3Rlcylcblx0XHRcdC8vc2NvcGUuJHdhdGNoKCdub3RlcycsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIC8vIGFsbCB0aGUgY29kZSBoZXJlLi4uXG4gICAgXHRcdFxuICAgIFx0XHRcblx0XHRcdFxuXG5cdFx0XHRlbGVtZW50LnNvcnRhYmxlKHtcblx0XHRcdFx0Y29ubmVjdFdpdGg6IFwiLmNvbm5lY3RlZFNvcnRhYmxlXCIsXG5cdFx0ICAgICAgIC8vcGxhY2Vob2xkZXI6IFwidWktc3RhdGUtaGlnaGxpZ2h0XCIsXG5cdFx0ICAgICAgICBzdGFydDogZnVuY3Rpb24oZXZlbnQsIHVpKSB7XG5cdFx0ICAgICAgICBcdGNvbnNvbGUubG9nKFwiU1RBUlQgU1RBUlQgU1RBUlQgU1RBUlQgU1RBUlRcIilcblx0XHQgICAgICAgIFx0Y29uc29sZS5sb2coZWxlbWVudClcblx0XHQgICAgICAgIFx0Y29uc29sZS5sb2codGVtcERhdGEpXG5cdFx0ICAgICAgICBcdFxuXG5cdFx0ICAgICAgICBcdHRlbXBEYXRhLnN0YXJ0Tm90ZSA9IGFuZ3VsYXIuY29weShzY29wZS5ub3RlKTtcblx0XHQgICAgICAgIFx0dGVtcERhdGEuc3RhcnROb3RlSW5kZXggPSBhdHRycy5ub3RlaW5kZXg7XG5cdFx0XHRcdFx0dGVtcERhdGEuc3RhcnROb3RlSXRlbUluZGV4ID0gdWkuaXRlbS5pbmRleCgpO1xuXHRcdFx0XHRcdHRlbXBEYXRhLnN0YXJ0Tm90ZUl0ZW1Db250ZW50ID0gdGVtcERhdGEuc3RhcnROb3RlLml0ZW1zW3RlbXBEYXRhLnN0YXJ0Tm90ZUl0ZW1JbmRleF07XG5cdFx0ICAgXHRcdFx0XG5cdFx0ICAgXHRcdFx0dGVtcE5vdGUgPSBhbmd1bGFyLmNvcHkoc2NvcGUubm90ZSlcblx0XHQgICBcdFx0XHRjb25zb2xlLmxvZyh0ZW1wTm90ZSlcblxuXHRcdCAgICAgICAgfSxcblx0XHQgICAgICAgIHVwZGF0ZTogZnVuY3Rpb24oZXZlbnQsIHVpKSB7XG5cblx0XHQgICAgICAgLy8gY29uc29sZS5sb2coc2NvcGUudGVtcERhdGEpXHRcblx0ICAgICAgICAgXHRpZiAoIXVpLnNlbmRlcikge1x0XHQgICAgICAgXG5cdFx0XHQgICAgICAgICBjb25zb2xlLmxvZyhcIlVQREFURSBVUERBVEUgVVBEQVRFIFVQREFURSBVUERBVEUgSU5TSURFIElGXCIgKVxuXG5cdFx0XHQgICAgICAgIFxuXHRcdFx0XHRcdFx0XHRcdCAgICAgICAgIFxuXG5cdFx0XHRcdFx0dmFyIHN0YXJ0X3BvcyA9IHRlbXBEYXRhLnN0YXJ0Tm90ZUl0ZW1JbmRleDtcblx0XHRcdFx0XHR2YXIgZW5kX3BvcyA9IHVpLml0ZW0uaW5kZXgoKTtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhzdGFydF9wb3MgKyAnIC0gJyArIGVuZF9wb3MpO1xuXG5cdFx0XHRcdFx0dGVtcE5vdGUuaXRlbXMuc3BsaWNlKHN0YXJ0X3BvcywxKVxuXHRcdFx0XHRcdHRlbXBOb3RlLml0ZW1zLnNwbGljZShlbmRfcG9zLDAsIHRlbXBEYXRhLnN0YXJ0Tm90ZUl0ZW1Db250ZW50KVxuXHRcdFx0XHRcdC8vc2NvcGUubm90ZSA9IHRlbXBOb3RlXG5cdFx0XHRcdFx0c2NvcGUubm90ZXNbdGVtcERhdGEuc3RhcnROb3RlSW5kZXhdID0gdGVtcE5vdGU7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coc2NvcGUubm90ZXMpXG5cblx0XHRcdFx0XHR2YXIgcmFzdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMmFkc0Buaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJzMVwiLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImxhdW5zZHJ5XCIsIFwiYXBzcGx5IGpvYnNcIiwgXCJnc3ltXCIgXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIxLzEvMjIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjEvMjIvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvenNlLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICAgICAgfVxuXG5cdFx0XHRcdFx0Ly9zY29wZS5ub3Rlc1swXS5pdGVtcy5wdXNoKFwiUFVDS1NcIilcblxuXHRcdFx0XHRcdHNjb3BlLiRhcHBseSgpO1xuXG5cdFx0ICAgLy8gICAgICAgICAvL2NvbnNvbGUubG9nKHNjb3BlLm5vdGVzKVxuXHRcdFx0ICAgIH0gICBcblx0XHQgICAgICAgICAgIFxuXHRcdCAgICAgICAgfSwgLy9lbmQgdXBkYXRlXG5cdFx0ICAgICAgICByZWNlaXZlOiBmdW5jdGlvbihldmVudCwgdWkpe1xuXHRcdCAgICAgICAgXHRjb25zb2xlLmxvZyhcIlJFQ0VJVkUgUkVDRUlWRSBSRUNFSVZFIFJFQ0VJVkUgUkVDRUlWRVwiKVxuXHRcdCAgICAgICAgXHRjb25zb2xlLmxvZyh0ZW1wRGF0YSlcblxuXHRcdCAgICAgICAgXHR0ZW1wRGF0YS5lbmROb3RlID0gYW5ndWxhci5jb3B5KHNjb3BlLm5vdGUpO1xuXHRcdCAgICAgICAgXHR0ZW1wRGF0YS5lbmROb3RlSW5kZXggPSBhdHRycy5ub3RlaW5kZXg7XG5cdFx0XHRcdFx0dGVtcERhdGEuZW5kTm90ZUl0ZW1JbmRleCA9IHVpLml0ZW0uaW5kZXgoKTtcblxuXHRcdFx0XHRcdFxuXG5cdFx0XHRcdFx0ICAvL2NvbnNvbGUubG9nKFwicmVtb3ZpbmcgaXRlbTogXCIgKyBzY29wZS5ub3Rlc1tub3RlT3JpZ2luSW5kZXhdLml0ZW1zW3N0YXJ0X3Bvc10pO1xuXHRcdCAgICAgICAgICAgdGVtcERhdGEuc3RhcnROb3RlLml0ZW1zLnNwbGljZSh0ZW1wRGF0YS5zdGFydE5vdGVJdGVtSW5kZXgsMSlcblx0XHRcdCAgICAgICB0ZW1wRGF0YS5lbmROb3RlLml0ZW1zLnNwbGljZSh0ZW1wRGF0YS5lbmROb3RlSXRlbUluZGV4LDAsdGVtcERhdGEuc3RhcnROb3RlSXRlbUNvbnRlbnQpXG5cdFx0XHQgICAgICAgY29uc29sZS5sb2codGVtcERhdGEpXG5cblx0XHRcdCAgICAgICBzY29wZS5ub3Rlc1t0ZW1wRGF0YS5zdGFydE5vdGVJbmRleF0gPSB0ZW1wRGF0YS5zdGFydE5vdGU7XG5cdFx0XHQgICAgICAgc2NvcGUubm90ZXNbdGVtcERhdGEuZW5kTm90ZUluZGV4XSA9IHRlbXBEYXRhLmVuZE5vdGU7XG5cdCAgICAgICAgICAgXHRcblx0ICAgICAgICAgICBcdFx0Y29uc29sZS5sb2codGVtcERhdGEuc3RhcnROb3RlLml0ZW1zKVxuXHQgICAgICAgICAgIFx0XHRjb25zb2xlLmxvZyh0ZW1wRGF0YS5lbmROb3RlLml0ZW1zKVxuXG5cdFx0ICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiYWRkaW5nIGFmdGVyIHBvc2l0aW9uOiBcIiArIGVuZF9wb3MpXG5cdFx0ICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiYWRkaW5nIGFmdGVyOiBcIiArIHNjb3BlLm5vdGVzW25vdGVEZXN0aW5hdGlvbkluZGV4XS5pdGVtc1tlbmRfcG9zXSlcblx0XHQgICAgICAgICAgIC8vc2NvcGUubm90ZXNbbm90ZURlc3RpbmF0aW9uSW5kZXhdLml0ZW1zLnNwbGljZShlbmRfcG9zLDAsIHN0YXJ0SXRlbSlcblxuXHRcdCAgICAgICAgXHQvL3Njb3BlLnRlbXBEYXRhID0gXCJwcmF3bnNcIjtcblx0XHQgICAgICAgIFx0XG5cdFx0ICAgICAgICBcdFxuXHRcdCAgICAgICAgXHQvLyBjb25zb2xlLmxvZyh0ZW1wRGF0YSlcblx0XHQgICAgICAgIFx0Ly8gLy9jb25zb2xlLmxvZyhzY29wZS5ub3RlKTtcblx0XHQgICAgICAgIFx0dmFyIHJhc3QgPSB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJhZHNAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiczFcIixcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJsYXVuc2RyeVwiLCBcImFwc3BseSBqb2JzXCIsIFwiZ3N5bVwiIF0sXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMS8xLzIyMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIxLzIyLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3pzZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgICAgIH1cblx0XHQgICAgICAgIFx0XG5cdFx0ICAgICAgICAgICBzY29wZS4kYXBwbHkoKTtcblx0XHRcblxuXHRcdCAgICAgICAgfVxuXG5cdFx0ICAgIH0pOyAvLyBlbmQgc29ydGFibGVcblxuXHRcdCAvLyAgfSk7IC8vZW5kIHdhdGNoXG5cblxuXG5cdFx0fSxcblx0XHRjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpe1xuXG5cdFx0XHQkc2NvcGUubW9vc2UgPSBcImRpbmdcIlxuXHRcdFx0JHNjb3BlLmRlbGV0ZUl0ZW0gPSBmdW5jdGlvbihwYXJlbnRJbmRleCwgaW5kZXgpe1xuXHRcdFx0XHRjb25zb2xlLmxvZyhwYXJlbnRJbmRleClcblx0XHRcdFx0Y29uc29sZS5sb2coaW5kZXgpXG5cdFx0XHRcdCRzY29wZS5ub3Rlc1twYXJlbnRJbmRleF0uaXRlbXMuc3BsaWNlKGluZGV4LDEpXG5cblx0XHRcdH1cblxuXHRcdFx0JHNjb3BlLnJhbmRvbUlkID0gZnVuY3Rpb24oaXRlbSl7XG4gICBcdFx0XHQgcmV0dXJuIFwiSURcIiArIGl0ZW0gKyAoTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIDk5OSkgKyAxKSk7XG5cdFx0XHR9XG5cdFx0XHQvL2FsZXJ0KFwiY29udHJvbGxlclwiKTtcblx0XHRcdC8vICRzY29wZS5kb2dzID0gJHNjb3BlLmRhdGEgKyBcImRvZ3NcIjtcblx0XHRcdC8vIGlmKCRzY29wZS5kcmFnZ2FibGUpXG5cdFx0XHQvLyBcdCRzY29wZS5kcmFnU3RhdHVzID0gZmFsc2U7XG5cdFx0XHQvLyBlbHNlICRzY29wZS5kcmFnU3RhdHVzID0gdHJ1ZTtcblxuXHRcdFx0Y29uc29sZS5sb2coJHNjb3BlKVxuXG5cdFx0XHRcblx0XHR9XG5cdH1cbn0gLy9lbmQgbm90ZWNhcmQgZGlyZWN0aXZlXG5cblxuXG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cdCd1c2Ugc3RyaWN0J1xuXG5cdGFuZ3VsYXJcbiAgICBcdC5tb2R1bGUoJ2J1ZGdldCcpXG4gICAgXHQuZmFjdG9yeSgnYnVkZ2V0U2VydmljZScsIGJ1ZGdldFNlcnZpY2UpO1xuXG4gICAgYnVkZ2V0U2VydmljZS4kaW5qZWN0ID0gWyckaHR0cCddXG5cbiAgICBmdW5jdGlvbiBidWRnZXRTZXJ2aWNlKCRodHRwKSB7XG4gICAgXHR2YXIgc2VydmljZSA9IHtcblxuICAgICAgICAgICAgZ2V0Tm90ZTogZ2V0Tm90ZSxcbiAgICAgICAgICAgIGdldE5vdGVzOiBnZXROb3RlcyxcbiAgICAgICAgICAgIHNhdmVOb3Rlczogc2F2ZU5vdGVzXG5cblxuICAgIFx0fTtcblxuICAgIFx0cmV0dXJuIHNlcnZpY2U7XG5cbiAgICBcdC8vLy8vLy8vLy8vL1xuXG4gICAgICAgIC8vIGdldHMgYSBzaW5nbGUgbm90ZVxuICAgICAgICBmdW5jdGlvbiBnZXROb3RlICgpIHtcblxuICAgICAgICAgICAgdmFyIG5vdGUgPSB7XG4gICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMkBuaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgIHRpdGxlOiBcInRvZG9cIixcbiAgICAgICAgICAgICAgICBpdGVtczogWyBcImxhdW5kcnlcIiwgXCJhcHBseSBqb2JzXCIsIFwiZ3ltXCIgXSxcbiAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjEvMS8yMDE2XCIsXG4gICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjEvMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3plLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBub3RlO1xuXG4gICAgICAgIH0gLy9lbmQgZ2V0Tm90ZSgpXG5cblxuICAgICAgICAvLyBnZXRzIGFsbCBub3Rlc1xuICAgICAgICBmdW5jdGlvbiBnZXROb3RlcyAoKSB7XG5cbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGkvbm90ZXMvZ2V0Tm90ZXMnLHtlbWFpbDpcIm1vaXpAZ21haWwuY29tXCJ9KVxuICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBub3RlcyA9IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiMVwiLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImxhdW5kcnlcIiwgXCJhcHBseSBqb2JzXCIsIFwiZ3ltXCIgXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIxLzEvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMS8yLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3plLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiMlwiLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImh0bWw1IGRyYWcgYW5kIGRyb3BcIiwgXCJzb2NrZXQuaW9cIiwgXCJub2RlanNcIiBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjIvMS8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIyLzIvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvemUuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMkBuaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCIzXCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwiYm9zZSBoZWFkcGhvbmVzXCIsIFwiMjAxNiBob25kYSBncmlsbFwiLCBcInNvbGlkIHN0YXRlIGhhcmQgZHJpdmVcIiBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjEvMS8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIxLzIvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvemUuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMkBuaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCI0XCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwibGF1bmRyeVwiLCBcImFwcGx5IGpvYnNcIiwgXCJneW1cIiBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjEvMS8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIxLzIvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvemUuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMkBuaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCI1XCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwiaHRtbDUgZHJhZyBhbmQgZHJvcFwiLCBcInNvY2tldC5pb1wiLCBcIm5vZGVqc1wiIF0sXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMi8xLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjIvMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96ZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyQG5qaXQuZWR1XCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIjZcIixcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJib3NlIGhlYWRwaG9uZXNcIiwgXCIyMDE2IGhvbmRhIGdyaWxsXCIsIFwic29saWQgc3RhdGUgaGFyZCBkcml2ZVwiIF0sXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMS8xLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjEvMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96ZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyQG5qaXQuZWR1XCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIjdcIixcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJsYXVuZHJ5XCIsIFwiYXBwbHkgam9ic1wiLCBcImd5bVwiLFwiYm9zZSBoZWFkcGhvbmVzXCIsIFwiMjAxNiBob25kYSBncmlsbFwiLCBcInNvbGlkIHN0YXRlIGhhcmQgZHJpdmVcIiAgXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIxLzEvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMS8yLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3plLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiOFwiLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImh0bWw1IGRyYWcgYW5kIGRyb3BcIiwgXCJzb2NrZXQuaW9cIiwgXCJub2RlanNcIiBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjIvMS8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIyLzIvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvemUuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMkBuaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCI5XCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwiYm9zZSBoZWFkcGhvbmVzXCIsIFwiMjAxNiBob25kYSBncmlsbFwiLCBcInNvbGlkIHN0YXRlIGhhcmQgZHJpdmVcIixcImh0bWw1IGRyYWcgYW5kIGRyb3BcIiwgXCJzb2NrZXQuaW9cIiwgXCJub2RlanNcIiAgXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIxLzEvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMS8yLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3plLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXSAvL2VuZCBub3RlcyBhcnJheVxuXG4gICAgICAgICAgICAvL3JldHVybiBub3Rlc1xuICAgICAgICB9IC8vZW5kIGdldCBub3Rlc1xuXG4gICAgICAgIGZ1bmN0aW9uIHNhdmVOb3Rlcyhub3Rlcykge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGkvbm90ZXMvdXBkYXRlTm90ZXMnLHtlbWFpbDpcIm1vaXpAZ21haWwuY29tXCIsbm90ZXM6IG5vdGVzfSlcbiAgICAgICAgfVxuXG5cblxuICAgIH1cblxuXHRcblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0J3VzZSBzdHJpY3QnXG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ21lbWJlcnMnKVxuXHRcdC5jb250cm9sbGVyKCdtZW1iZXJzQ3RybCcsIG1lbWJlcnNDdHJsKVxuXG5cdG1lbWJlcnNDdHJsLiRpbmplY3QgPSBbJyRodHRwJ11cblxuXHRmdW5jdGlvbiBtZW1iZXJzQ3RybCgkaHR0cCkge1xuXG5cdCAgICB2YXIgdm0gPSB0aGlzO1xuXG5cdCAgICB2bS5tZW1iZXJzQ29udGVudCA9IG1lbWJlcnNDb250ZW50KCk7XG5cdCAgICB2bS5nb3RvU2Vzc2lvbiA9IGdvdG9TZXNzaW9uO1xuXHQgICAgdm0ucmVmcmVzaCA9IHJlZnJlc2g7XG5cdCAgICB2bS5zZWFyY2ggPSBzZWFyY2g7XG5cdCAgICB2bS5zZXNzaW9ucyA9IFtdO1xuXHQgICAgdm0udGl0bGUgPSAnbWVtYmVycyc7XG5cblx0ICAgIC8vLy8vLy8vLy8vL1xuXG5cdCAgICBmdW5jdGlvbiBtZW1iZXJzQ29udGVudCgpe1xuXHQgICAgXHQgLy8gJGh0dHAuZ2V0KCdodHRwOi8vbG9jYWxob3N0OjMwMDAvYXBpL3VzZXJzL2FsbCcpXG5cdCAgICBcdFx0Ly8gLnRoZW4oZnVuY3Rpb24ocmVzKXtcblx0ICAgIFx0XHQvLyBcdGNvbnNvbGUubG9nKHJlcy5kYXRhKVxuXHQgICAgXHRcdC8vIFx0dm0ubWVtYmVyc0NvbnRlbnQgPSByZXMuZGF0YTtcblx0ICAgIFx0XHQvLyB9LFxuXHQgICAgXHRcdC8vIGZ1bmN0aW9uKGVycil7XG5cdCAgICBcdFx0Ly8gXHRjb25zb2xlLmxvZyhlcnIuc3RhdHVzICsgXCIgXCIgKyBlcnIuc3RhdHVzVGV4dCk7XG5cdCAgICBcdFx0Ly8gXHR2bS5tZW1iZXJzQ29udGVudCA9IGVyci5kYXRhO1xuXHQgICAgXHRcdC8vIH0pXG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIGdvdG9TZXNzaW9uKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiByZWZyZXNoKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBzZWFyY2goKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cdH1cblxufSkoKTtcblxuXG4iLCIoZnVuY3Rpb24oKXtcblx0J3VzZSBzdHJpY3QnXG5cblx0YW5ndWxhclxuICAgIFx0Lm1vZHVsZSgnc2FtcGxlJylcbiAgICBcdC5mYWN0b3J5KCdzYW1wbGVTZXJ2aWNlJywgc2FtcGxlU2VydmljZSk7XG5cbiAgIC8vIHNhbXBsZVNlcnZpY2UuaW5qZWN0ID0gWycnXVxuXG4gICAgZnVuY3Rpb24gc2FtcGxlU2VydmljZSgpIHtcbiAgICBcdHZhciBzZXJ2aWNlID0ge1xuXG4gICAgXHRcdGVycm9yOiBlcnJvcixcbiAgICBcdFx0aW5mbzogaW5mbyxcbiAgICBcdFx0c3VjY2Vzczogc3VjY2Vzc1xuXG4gICAgXHR9O1xuXG4gICAgXHRyZXR1cm4gc2VydmljZTtcblxuICAgIFx0Ly8vLy8vLy8vLy8vXG5cbiAgICBcdGZ1bmN0aW9uIGVycm9yKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBpbmZvKCkge1xuXHQgICAgICAvKiAqL1xuICAgICAgICAgIC8vY29uc29sZS5sb2coXCJzYW1wbGVTZXJ2aWNlXCIpO1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBzdWNjZXNzKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXG5cbiAgICB9XG5cblx0XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0J1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCdub3RlcycpXG5cdFx0LmNvbnRyb2xsZXIoJ25vdGVzQ3RybCcsIG5vdGVzQ3RybClcblxuXHRub3Rlc0N0cmwuJGluamVjdCA9IFsnbm90ZXNTZXJ2aWNlJywnJHNjb3BlJywnJGh0dHAnLCd0b2FzdHInLCckd2luZG93J11cblxuXHRmdW5jdGlvbiBub3Rlc0N0cmwobm90ZXNTZXJ2aWNlLCRzY29wZSwgJGh0dHAsIHRvYXN0ciwgJHdpbmRvdykge1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0Y29uc29sZS5sb2coXCJub3RlcyBiYWxsc291dFwiKTtcblxuXHRcdHZtLmdldE5vdGVzID0gZ2V0Tm90ZXMoKTtcblx0XHR2bS5hbGxOb3RlcyA9IG51bGw7XG5cdFx0dm0uYWN0aXZlTm90ZXMgPSBbXTtcblx0XHR2bS5nZXRTaW5nbGVOb3RlID0gZ2V0U2luZ2xlTm90ZTtcblxuXHRcdHZtLmFkZE5vdGUgPSBhZGROb3RlO1xuXHRcdHZtLnNhdmVOb3RlID0gc2F2ZU5vdGU7XG5cdFx0dm0uZGVsZXRlTm90ZSA9IGRlbGV0ZU5vdGU7XG5cdFx0dm0udXBkYXRlTm90ZSA9IHVwZGF0ZU5vdGU7XG5cdFx0dm0ubmV3Tm90ZSA9IG5ld05vdGU7XG5cblx0XHR2bS5hY3RpdmF0ZSA9IGFjdGl2YXRlO1xuXHRcdHZtLmNsb3NlVGFiID0gY2xvc2VUYWI7XG5cdFx0XG5cdFx0dm0uc2hvd0xpc3QgPSB0cnVlO1xuXHRcdHZtLmdyaWRNb2RlID0gdHJ1ZTtcblxuXG5cdFx0XG5cdCAgICBcblx0ICAgXG5cdCAgXHQkc2NvcGUudGlueW1jZU9wdGlvbnMgPSB7XG5cdFx0ICAgIHBsdWdpbnM6ICdsaW5rIGltYWdlIGNvZGUnLFxuXHRcdCAgICB0b29sYmFyOiAndW5kbyByZWRvIHwgYm9sZCBpdGFsaWMgfCBhbGlnbmxlZnQgYWxpZ25jZW50ZXIgYWxpZ25yaWdodCB8IGNvZGUgfCBwYXN0ZSdcblx0XHQgIH07XG5cblx0XHQkc2NvcGUudGl0bGUgPSBcInJhdHN0c1wiO1xuXHRcdCRzY29wZS5kb2dzID1cImZyb2Fkc2FzZGZhZHNnc1wiXG5cdFx0dm0udGlueW1jZU1vZGVsID0gJ0luaXRpYWwgY29uc2RzZHRlbnQnO1xuXG4vLyBzYW1wbGUgbm90ZXNcblx0XHQvLyB2bS5hbGxOb3RlcyA9IFtcblx0XHQvLyBcdHt0aXRsZTpcImd1bHAgY2hlYXQgc2hlZXRcIixjb250ZW50Olwibm9udW1teSBuaWJoIGV1aXNtb2QgdGluY2lkdW50IHV0IGxhb3JlZXQgZG9sb3JlIG1hZ25hIGFsaXF1YW0gZXJhdCB2b2x1dHBhdC4gVXQgd2lzaSBlbmltIGFkIG1pbmltIHZlbmlhbSwgcXVpcyBub3N0cnVkIGV4ZXJjaSB0YXRpb24gdWxsYW1jb3JwZXIgc3VzY2lwaXQgbG9ib3J0aXMgbmlzbCB1dCBhbGlxdWlwIGV4IGVhIGNvbW1vZG8gY29uc2VxdWF0LiBEdWlzIGF1dGVtIHZlbCBldW0gaXJpdXJlIGRvbG9yIGluIGhlbmRyZXJpdCBpbiB2dWxwdXRhdGUgdmVsaXQgZXNzZSBtb2xlc3RpZSBjb25zZXF1YXQsIHZlbCBpbGx1bSBkb2xvcmUgZXUgZmV1Z2lhdCBudWxsYSBmYWNpbGlzaXMgYXQgdmVybyBlcm9zIGV0IGFjY3Vtc2FuIGV0IGl1c3RvIG9kaW8gZGlnbmlzc2ltIHF1aSBibGFuZGl0IHByYWVzZW50IGx1cHRhdHVtIHp6cmlsIGRlbGVuaXQgYXVndWUgZHVpcyBkb2xvcmUgdGUgZmV1Z2FpdCBudWxsYSBmYWNpbGlzaS4gTmFtIGxpYmVyIHRlbXBvciBjdW0gc29sdXRhIG5vYmlzIGVsZWlmZW5kIG9wdGlvbiBjb25ndWUgbmloaWwgaW1wZXJkaWV0IGRvbWluZyBpZCBxdW9kIG1hemltIHBsYWNlcmF0IGZhY2VyIHBvc3NpbSBhc3N1bS4gVHlwaSBub24gaGFiZW50IGNsYXJpdGF0ZW0gaW5zaXRhbTsgZXN0IHVzdXMgbGVnZW50aXMgaW4gaWlzIHF1aSBmYWNpdCBlb3J1bSBjbGFyaXRhdGVtLiBJbnZlc3RpZ2F0aW9uZXMgZGVtb25zdHJhdmVydW50IGxlY3RvcmVzIGxlZ2VyZSBtZSBsaXVzIHF1b2QgaWkgbGVndW50IHNhZXBpdXMuIENsYXJpdGFzIGVzdCBldGlhbSBwcm9jZXNzdXMgZHluYW1pY3VzLCBxdWkgc2VxdWl0dXIgbXV0YXRpb25lbSBjb25zdWV0dWRpdW0gbGVjdG9ydW0uIE1pcnVtIGVzdCBub3RhcmUgcXVhbSBsaXR0ZXJhIGdvdGhpY2EsIHF1YW0gbnVuYyBwdXRhbXVzIHBhcnVtIGNsYXJhbSwgYW50ZXBvc3Vlcml0IGxpdHRlcmFydW0gZm9ybWFzIGh1bWFuaXRhdGlzIHBlciBzZWFjdWxhIHFcIn0sXG5cdFx0Ly8gXHR7dGl0bGU6XCJtZXRlb3JcIixjb250ZW50Olwibm9udW1teSBuaWJoIGV1aXNtb2QgdGluY2lkdW50IHV0IGxhb3JlZXQgZG9sb3JlIG1hZ25hIG0gY29uc3VldHVkaXVtIGxlY3RvcnVtLiBNaXJ1bSBlc3Qgbm90YXJlIHF1YW0gbGl0dGVyYSBnb3RoaWNhLCBxdWFtIG51bmMgcHV0YW11cyBwYXJ1bSBjbGFyYW0sIGFudGVwb3N1ZXJpdCBsaXR0ZXJhcnVtIGZvcm1hcyBodW1hbml0YXRpcyBwZXIgc2VhY3VsYSBxXCJ9XG5cdFx0Ly8gXHQsXG5cdFx0Ly8gXHR7dGl0bGU6XCJqcXVlcnlcIixjb250ZW50Olwibm9udW1teSBuaWJoIGV1aXNtb2QgdGluY2lkdW50IHV0IGxhb3JlZXQgZG9sb3JlIG1hZ25hIG0gY29uc3VldHVkaXVtIGxlY3RvcnVtLiBNaXJ1bSBlc3Qgbm90YXJlIHF1YW0gbGl0dGVyYSBnb3RoaWNhLCBxdWFtIG51bmMgcHV0YW11cyBwYXJ1bSBjbGFyYW0sIGFudGVwb3N1ZXJpdCBsaXR0ZXJhcnVtIGZvcm1hcyBodW1hbml0YXRpcyBwZXIgc2VhY3VsYSBxXCJ9XG5cdFx0Ly8gXHQsXG5cdFx0Ly8gXHR7dGl0bGU6XCJhbmd1bGFyXCIsY29udGVudDpcIm5vbnVtbXkgbmliaCBldWlzbW9kIHRpbmNpZHVudCB1dCBsYW9yZWV0IGRvbG9yZSBtYWduYSBtIGNvbnN1ZXR1ZGl1bSBsZWN0b3J1bS4gTWlydW0gZXN0IG5vdGFyZSBxdWFtIGxpdHRlcmEgZ290aGljYSwgcXVhbSBudW5jIHB1dGFtdXMgcGFydW0gY2xhcmFtLCBhbnRlcG9zdWVyaXQgbGl0dGVyYXJ1bSBmb3JtYXMgaHVtYW5pdGF0aXMgcGVyIHNlYWN1bGEgcVwifVxuXHRcdC8vIFx0LFxuXHRcdC8vIFx0e3RpdGxlOlwic3dpZnRcIixjb250ZW50Olwibm9udW1teSBuaWJoIGV1aXNtb2QgdGluY2lkdW50IHV0IGxhb3JlZXQgZG9sb3JlIG1hZ25hIG0gY29uc3VldHVkaXVtIGxlY3RvcnVtLiBNaXJ1bSBlc3Qgbm90YXJlIHF1YW0gbGl0dGVyYSBnb3RoaWNhLCBxdWFtIG51bmMgcHV0YW11cyBwYXJ1bSBjbGFyYW0sIGFudGVwb3N1ZXJpdCBsaXR0ZXJhcnVtIGZvcm1hcyBodW1hbml0YXRpcyBwZXIgc2VhY3VsYSBxXCJ9XG5cblx0XHQvLyBdXG5cblx0XHQvL2dldHMgYWxsIG5vdGVzXG5cdFx0XG5cblx0XHRmdW5jdGlvbiBnZXROb3RlcygpIHtcblx0XHRcdHZhciB0b2tlbiA9ICR3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3VzZXJUb2tlbicpO1xuXHRcdFx0JGh0dHAucG9zdCgnaHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaS9ub3Rlcy9nZXRBbGxOb3Rlc01ldGEnLHt0b2tlbjogdG9rZW59KS50aGVuKGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0XHR2bS5hbGxOb3RlcyA9IGRhdGEuZGF0YS5ub3Rlcztcblx0XHRcdFx0Y29uc29sZS5sb2codm0uYWxsTm90ZXMpO1xuXHRcdFx0fSlcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBnZXRTaW5nbGVOb3RlKG5vdGVJZCkge1xuXHRcdFx0dmFyIHRva2VuID0gJHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndXNlclRva2VuJyk7XG5cdFx0XHRyZXR1cm4gJGh0dHAucG9zdCgnaHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaS9ub3Rlcy9nZXRTaW5nbGVOb3RlJyx7dG9rZW46IHRva2VuLCBub3RlSWQ6IG5vdGVJZH0pO1xuXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gYWRkTm90ZSgpIHtcblxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHNhdmVOb3RlKCkge1xuXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZGVsZXRlTm90ZSgpIHtcblxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHVwZGF0ZU5vdGUoKSB7XG5cblx0XHR9XG5cblx0XHRcblxuXG5cdCAgICAvLy8vLy8vLy8vLy9cblxuXHQgICAgZnVuY3Rpb24gYWN0aXZhdGUobm90ZUlkKSB7XG5cdCAgICBcdHZhciBwZXJtaXNzaW9uVG9BY3RpdmF0ZSA9IHRydWU7XG4gICAgXHRcdC8vIGNoZWNrcyBpZiB0YWIgYWxyZWFkeSBvcGVuXG4gICAgXHRcdGlmKHZtLmFjdGl2ZU5vdGVzLmxlbmd0aCA+IDAgJiYgdm0uYWN0aXZlTm90ZXMubGVuZ3RoICE9PSA0ICl7XG4gICAgXHRcdFx0Y29uc29sZS5sb2coJ2xvb3BpbmcnKVxuXHQgICAgXHRcdGFuZ3VsYXIuZm9yRWFjaCh2bS5hY3RpdmVOb3RlcywgZnVuY3Rpb24odmFsdWUpIHtcblx0ICAgIFx0XHRcdGNvbnNvbGUubG9nKHZhbHVlLl9pZC50b1N0cmluZygpKTtcblx0ICAgIFx0XHRcdGNvbnNvbGUubG9nKG5vdGVJZC50b1N0cmluZygpKTtcblx0XHRcdFx0ICBpZih2YWx1ZS5faWQudG9TdHJpbmcoKSA9PSBub3RlSWQudG9TdHJpbmcoKSl7XG5cdFx0XHRcdCAgXHRwZXJtaXNzaW9uVG9BY3RpdmF0ZSA9IGZhbHNlO1xuXHRcdFx0XHQgIFx0dG9hc3RyLmVycm9yKFwiV2hvb3BzISBMb29rcyBsaWtlIHRoaXMgbm90ZSBpcyBhbHJlYWR5IG9wZW5cIilcblx0XHRcdFx0ICB9XG5cdFx0XHRcdH0pOy8vZW5kIGZvcmVhY2hcblx0XHRcdH1cblx0XHQgICAgaWYodm0uYWN0aXZlTm90ZXMubGVuZ3RoID09IDQpe1xuXHRcdCAgICBcdFx0Y29uc29sZS5sb2coXCJjaGVja2luZyBtYXhcIik7XG5cdFx0ICAgIFx0XHRwZXJtaXNzaW9uVG9BY3RpdmF0ZSA9IGZhbHNlO1xuXHRcdCAgICBcdFx0dG9hc3RyLmVycm9yKFwiV2hvb3BzISBMb29rcyBsaWtlIHlvdSBoYXZlIHJlYWNoZWQgdGhlIG1heCBudW1iZXIgb2YgdGFicyg0KVwiKVxuXHRcdCAgICB9XG5cdFx0XG5cdCAgICBcdGlmKHBlcm1pc3Npb25Ub0FjdGl2YXRlID09IHRydWUpe1xuXHRcdFx0ICBcdGNvbnNvbGUubG9nKFwiZWxzZSBwdXNoaW5nXCIpO1xuXHRcdFx0ICBcdGNvbnNvbGUubG9nKG5vdGVJZClcblx0XHRcdCAgXHRnZXRTaW5nbGVOb3RlKG5vdGVJZCkudGhlbihmdW5jdGlvbihyZXMpe1xuXHRcdFx0ICBcdFx0dmFyIG5vdGUgPSByZXMuZGF0YS5kYXRhO1xuXHRcdFx0ICBcdFx0dm0uYWN0aXZlTm90ZXMucHVzaChub3RlKTtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyh2bS5hY3RpdmVOb3Rlcylcblx0XHRcdCAgXHR9KVxuXHRcdFx0ICBcdFxuXHRcdFx0fSBcblx0ICAgIFx0XG5cdCAgICB9IC8vZW5kIGZ1bmN0aW9uIGFjdGl2YXRlXG5cblx0ICAgIGZ1bmN0aW9uIGNsb3NlVGFiKGluZGV4KSB7XG5cdCAgICAgIHZtLmFjdGl2ZU5vdGVzLnNwbGljZShpbmRleCwxKTtcblx0ICAgICAgY29uc29sZS5sb2codm0uYWN0aXZlTm90ZXMpXG5cblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gbmV3Tm90ZSgpIHtcblx0ICAgIFx0Ly8gZmlyc3QgY2hlY2sgaWYgYWN0aXZlIG5vdGVzIGlzIGZ1bGxcblx0ICAgIFx0aWYodm0uYWN0aXZlTm90ZXMubGVuZ3RoID09IDQpe1xuXHQgICAgXHRcdHJldHVybiB0b2FzdHIuZXJyb3IoXCJXaG9vcHMhIFBsZWFzZSBjbG9zZSBhIHRhYiBiZWZvcmUgY3JlYXRpbmcgYSBuZXcgbm90ZVwiKTtcblx0ICAgIFx0fVxuXG5cdCAgICBcdC8vIGNyZWF0ZSBuZXcgbm90ZSBvYmplY3Rcblx0ICAgIFx0dmFyIG5ld05vdGUgPSB7dGl0bGU6XCJkb29nc1wiLGNvbnRlbnQ6XCJcIixcInNoYXJlZFdpdGhcIjpbe1widXNlclwiOiBcImF1azJAbmppdC5lZHVcIiwgXCJjYW5FZGl0XCI6IGZhbHNlfV19O1xuXHQgICAgXHRcblx0ICAgIFx0Ly8gZ2V0IHRva2VuXG5cdCAgICBcdHZhciB0b2tlbiA9ICR3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3VzZXJUb2tlbicpO1xuXG5cdCAgICBcdC8vIHNlbmQgbmV3IG5vdGUgb2JqZWN0XG5cdCAgICBcdCRodHRwLnBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGkvbm90ZXMvYWRkTm90ZScse3Rva2VuOiB0b2tlbiwgbm90ZTogbmV3Tm90ZX0pLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG5cdCAgICBcdFx0Y29uc29sZS5sb2coZGF0YSk7XG5cblx0ICAgIFx0XHQvLyBkYXRhIHJldHVybnMgdGhlIGxpc3Qgb2YgbmV3IG5vdGVzXG5cdCAgICBcdFx0dm0uYWxsTm90ZXMgPSBkYXRhLmRhdGEubm90ZXM7XG5cdCAgICBcdFx0XG5cdCAgICBcdFx0Ly8gcHVzaCBuZXcgbm90ZSB0byBhY3RpdmUgbm90ZXNcblx0ICAgIFx0XHR2YXIgbmV3Tm90ZUluZGV4ID0gdm0uYWxsTm90ZXMubGVuZ3RoLTE7XG5cdCAgICBcdFx0YWN0aXZhdGUodm0uYWxsTm90ZXNbbmV3Tm90ZUluZGV4XSk7XG5cblx0ICAgIFx0XHQvLyBsb2cgbmV3IGFjdGl2ZSBub3Rlc1xuXHQgICAgXHRcdGNvbnNvbGUubG9nKHZtLmFjdGl2ZU5vdGVzKTtcblx0ICAgIFx0fSk7XG5cdFx0XHRcblx0ICAgIFx0Ly9zY3JvbGwgdG8gdGhlIG5ldyBub3RlXG5cdCAgICBcdHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gXCJub3RlcyNVbnRpdGxlZFwiO1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBkZWxldGVOb3RlKG5vdGVJZCl7XG5cdCAgICBcdGNvbnNvbGUubG9nKCdkZWxldGluZycpXG5cdCAgICBcdGNvbnNvbGUubG9nKG5vdGVJZClcblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gcmVmcmVzaCgpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gc2VhcmNoKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXHR9XG5cbn0pKCk7XG5cblxuIiwiLy8gYW5ndWxhclxuLy8gICAgIC5tb2R1bGUoJ25vdGVzJylcbi8vICAgICAuZGlyZWN0aXZlKCdub3RlQ2FyZCcsIG5vdGVDYXJkKTtcblxuLy8gZnVuY3Rpb24gbm90ZUNhcmQoKSB7XG4vLyBcdHJldHVybntcbi8vIFx0XHRyZXN0cmljdDogJ0UnLFxuLy8gXHRcdHNjb3BlOiB7XG4vLyBcdFx0XHRkYXRhOiBcIj1cIixcbi8vIFx0XHRcdGRyYWdnYWJsZTogXCI9XCJcbi8vIFx0XHR9LFxuLy8gXHRcdHJlcGxhY2U6IHRydWUsXG4vLyBcdFx0dGVtcGxhdGU6IFwiPGgxPnt7ZG9nc319e3tkcmFnU3RhdHVzfX08L2gxPlwiLFxuLy8gXHRcdGxpbms6IGZ1bmN0aW9uKHNjb3BlLGVsZW1lbnQpe1xuLy8gXHRcdFx0ZWxlbWVudC5jbGljayhmdW5jdGlvbigpe1xuLy8gXHRcdFx0XHRjb25zb2xlLmxvZyhlbGVtZW50KVxuLy8gXHRcdFx0XHRlbGVtZW50WzBdLmRyYWdnYWJsZSA9IHRydWU7XG4vLyBcdFx0XHR9KVxuLy8gXHRcdH0sXG4vLyBcdFx0Y29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKXtcbi8vIFx0XHRcdC8vYWxlcnQoXCJjb250cm9sbGVyXCIpO1xuLy8gXHRcdFx0JHNjb3BlLmRvZ3MgPSAkc2NvcGUuZGF0YSArIFwiZG9nc1wiO1xuLy8gXHRcdFx0aWYoJHNjb3BlLmRyYWdnYWJsZSlcbi8vIFx0XHRcdFx0JHNjb3BlLmRyYWdTdGF0dXMgPSBmYWxzZTtcbi8vIFx0XHRcdGVsc2UgJHNjb3BlLmRyYWdTdGF0dXMgPSB0cnVlO1xuXG5cdFx0XHRcbi8vIFx0XHR9XG4vLyBcdH1cbi8vIH1cblxuXG5cbi8vIC8vIGFuZ3VsYXJcbi8vIC8vICAgICAubW9kdWxlKCdub3RlcycpXG4vLyAvLyAgICAgLmRpcmVjdGl2ZSgnbm90ZUNhcmQnLCBub3RlQ2FyZCk7XG5cbi8vIC8vIGZ1bmN0aW9uIG5vdGVDYXJkKCkge1xuLy8gLy8gXHRyZXR1cm57XG4vLyAvLyBcdFx0cmVzdHJpY3Q6ICdFJyxcbi8vIC8vIFx0XHRjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpe1xuLy8gLy8gXHRcdFx0YWxlcnQoXCJjb250cm9sbGVyXCIpO1xuLy8gLy8gXHRcdFx0Y29uc29sZS5sb2coJ2RvZycpXG4vLyAvLyBcdFx0fSxcbi8vIC8vIFx0XHR0ZW1wbGF0ZVVybDogJycsXG4vLyAvLyBcdFx0cmVwbGFjZTogdHJ1ZVxuLy8gLy8gXHRcdC8vIHNjb3BlOiB7fVxuLy8gLy8gXHR9XG4vLyAvLyB9IiwiLy8gYW5ndWxhclxuLy8gICAgIC5tb2R1bGUoJ25vdGVzJylcbi8vICAgICAuZGlyZWN0aXZlKCdub3RlQ2FyZHMnLCBub3RlQ2FyZHMpXG5cblxuICAgIFxuXG4vLyBmdW5jdGlvbiBub3RlQ2FyZHMoKSB7XG4vLyBcdHJldHVybntcbi8vIFx0XHRyZXN0cmljdDogJ0FFJyxcbi8vIFx0XHRzY29wZToge1xuLy8gXHRcdFx0bm90ZXM6IFwiPVwiLFxuLy8gXHRcdFx0bmV3SXRlbTogXCI9XCJcbi8vIFx0XHR9LFxuLy8gXHRcdHJlcGxhY2U6IGZhbHNlLFxuLy8gXHRcdHRyYW5zY2x1ZGU6IGZhbHNlLFxuLy8gXHRcdHRlbXBsYXRlVXJsOiBcImNvbXBvbmVudHMvbm90ZXMvdmlld3Mvbm90ZS5kaXJlY3RpdmUudmlldy5odG1sXCIsXG4vLyBcdFx0bGluazogZnVuY3Rpb24oc2NvcGUsZWxlbWVudCxhdHRycyl7XG4vLyBcdFx0XHQvLyQoIFwiI3NvcnRhYmxlXCIgKS5zb3J0YWJsZSgpO1xuLy8gXHRcdFx0Ly9jb25zb2xlLmxvZyhzY29wZSlcbi8vIFx0XHRcdC8vY29uc29sZS5sb2coZWxlbWVudClcbi8vIFx0XHRcdC8vY29uc29sZS5sb2coYXR0cnMpXG4vLyBcdFx0XHQvL2VsZW1lbnQuc29ydGFibGUoKTtcbi8vIFx0XHRcdC8vY29uc29sZS5sb2coc2NvcGUubm90ZXMpXG4vLyBcdFx0XHRzY29wZS5kb2dzID0gZnVuY3Rpb24obm90ZSl7XG4vLyBcdFx0XHRcdGNvbnNvbGUubG9nKG5vdGUpXG4vLyBcdFx0XHR9XG5cblxuLy8gXHRcdFx0ZWxlbWVudC5zb3J0YWJsZSh7XG4vLyBcdFx0ICAgICAgIC8vIHBsYWNlaG9sZGVyOiBcInVpLXN0YXRlLWhpZ2hsaWdodFwiLFxuLy8gXHRcdCAgICAgICAgc3RhcnQ6IGZ1bmN0aW9uKGV2ZW50LCB1aSkge1xuLy8gXHRcdCAgICAgICAgICAgIHZhciBzdGFydF9wb3MgPSB1aS5pdGVtLmluZGV4KCk7XG4vLyBcdFx0ICAgICAgICAgICAgdWkuaXRlbS5kYXRhKCdzdGFydF9wb3MnLCBzdGFydF9wb3MpO1xuLy8gXHRcdCAgICAgICAgfSxcbi8vIFx0XHQgICAgICAgIHVwZGF0ZTogZnVuY3Rpb24oZXZlbnQsIHVpKSB7XG4vLyBcdFx0ICAgICAgICAgICAgdmFyIHN0YXJ0X3BvcyA9IHVpLml0ZW0uZGF0YSgnc3RhcnRfcG9zJyk7XG4vLyBcdFx0ICAgICAgICAgICAgdmFyIGVuZF9wb3MgPSB1aS5pdGVtLmluZGV4KCk7XG4vLyBcdFx0ICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhzdGFydF9wb3MgKyAnIC0gJyArIGVuZF9wb3MpO1xuXHRcdCAgICAgICAgICBcbi8vIFx0XHQgICAgICAgICAgdmFyIHN0YXJ0SXRlbSA9IHNjb3BlLm5vdGVzW3N0YXJ0X3Bvc107XG4vLyBcdFx0ICAgICAgICAgICBzY29wZS5ub3Rlcy5zcGxpY2Uoc3RhcnRfcG9zLDEpXG4vLyBcdFx0ICAgICAgICAgICBzY29wZS5ub3Rlcy5zcGxpY2UoZW5kX3BvcywwLCBzdGFydEl0ZW0pXG4vLyBcdFx0ICAgICAgICAgICBzY29wZS4kYXBwbHkoKTtcblxuLy8gXHRcdCAgICAgICAgICAgLy9jb25zb2xlLmxvZyhzY29wZS5ub3Rlcylcblx0XHQgICAgICAgICAgIFxuXHRcdCAgICAgICAgICAgXG4vLyBcdFx0ICAgICAgICB9XG4vLyBcdFx0ICAgIH0pOyAvLyBlbmQgc29ydGFibGVcblxuXHRcdCAgIFxuXG4vLyBcdFx0ICAgIGNvbnNvbGUubG9nKGVsZW1lbnQpXG5cblxuLy8gXHRcdH0sXG4vLyBcdFx0Y29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKXtcbi8vIFx0XHRcdCRzY29wZS5mb3JtID17fVxuLy8gXHRcdFx0JHNjb3BlLmFkZEl0ZW0gPSBmdW5jdGlvbihpbmRleCxpdGVtKXtcbi8vIFx0XHRcdFx0Ly9hbGVydChpbmRleClcbi8vIFx0XHRcdFx0Y29uc29sZS5sb2coJHNjb3BlLm5ld0l0ZW0pXG4vLyBcdFx0XHRcdCRzY29wZS5ub3Rlc1tpbmRleF0uaXRlbXMucHVzaChpdGVtKVxuLy8gXHRcdFx0XHQkc2NvcGUuZm9ybSA9IHt9XG4vLyBcdFx0XHRcdC8vY29uc29sZS5sb2coJHNjb3BlLm5vdGVzW2luZGV4XS5pdGVtcylcbi8vIFx0XHRcdH1cblxuLy8gXHRcdFx0JHNjb3BlLmRlbGV0ZU5vdGUgPSBmdW5jdGlvbihpbmRleCl7XG4vLyBcdFx0XHRcdCRzY29wZS5ub3Rlcy5zcGxpY2UoaW5kZXgsMSk7XG4vLyBcdFx0XHR9XG5cblxuLy8gXHRcdFx0Ly9hbGVydChcImNvbnRyb2xsZXJcIik7XG4vLyBcdFx0XHQvLyAkc2NvcGUuZG9ncyA9ICRzY29wZS5kYXRhICsgXCJkb2dzXCI7XG4vLyBcdFx0XHQvLyBpZigkc2NvcGUuZHJhZ2dhYmxlKVxuLy8gXHRcdFx0Ly8gXHQkc2NvcGUuZHJhZ1N0YXR1cyA9IGZhbHNlO1xuLy8gXHRcdFx0Ly8gZWxzZSAkc2NvcGUuZHJhZ1N0YXR1cyA9IHRydWU7XG5cblx0XHRcdFxuLy8gXHRcdH1cbi8vIFx0fVxuLy8gfSAvL2VuZCBub3RlY2FyZHMgZGlyZWN0aXZlXG5cbi8vIGFuZ3VsYXJcbi8vIFx0Lm1vZHVsZSgnbm90ZXMnKVxuLy8gXHQuZGlyZWN0aXZlKCdub3RlQ2FyZCcsIG5vdGVDYXJkKVxuXG4vLyBmdW5jdGlvbiBub3RlQ2FyZCgpIHtcblxuLy8gXHR2YXIgdGVtcERhdGEgPSB7fTtcbi8vIFx0dmFyIHRlbXBOb3RlID0gbnVsbDtcblxuLy8gXHRyZXR1cm57XG4vLyBcdFx0cmVzdHJpY3Q6ICdBRScsXG4vLyBcdFx0c2NvcGU6IHtcbi8vIFx0XHRcdG5vdGU6IFwiPVwiLFxuLy8gXHRcdFx0bm90ZXM6IFwiPVwiXG4vLyBcdFx0fSxcbi8vIFx0XHRyZXBsYWNlOiB0cnVlLFxuLy8gXHRcdHRyYW5zY2x1ZGU6IGZhbHNlLFxuLy8gXHRcdHRlbXBsYXRlVXJsOiBcImNvbXBvbmVudHMvbm90ZXMvdmlld3Mvbm90ZXMuaXRlbXMudmlldy5odG1sXCIsXG4vLyBcdFx0bGluazogZnVuY3Rpb24oc2NvcGUsZWxlbWVudCxhdHRycyl7XG4vLyBcdFx0XHQvLyQoIFwiI3NvcnRhYmxlXCIgKS5zb3J0YWJsZSgpO1xuLy8gXHRcdFx0Ly9jb25zb2xlLmxvZyhzY29wZSlcbi8vIFx0XHRcdC8vY29uc29sZS5sb2coZWxlbWVudClcbi8vIFx0XHRcdC8vY29uc29sZS5sb2coYXR0cnMpXG4vLyBcdFx0XHQvL2VsZW1lbnQuc29ydGFibGUoKTtcbi8vIFx0XHRcdC8vY29uc29sZS5sb2coc2NvcGUubm90ZXMpXG4vLyBcdFx0XHQvL3Njb3BlLiR3YXRjaCgnbm90ZXMnLCBmdW5jdGlvbigpIHtcblxuLy8gICAgICAgICAvLyBhbGwgdGhlIGNvZGUgaGVyZS4uLlxuICAgIFx0XHRcbiAgICBcdFx0XG5cdFx0XHRcblxuLy8gXHRcdFx0ZWxlbWVudC5zb3J0YWJsZSh7XG4vLyBcdFx0XHRcdGNvbm5lY3RXaXRoOiBcIi5jb25uZWN0ZWRTb3J0YWJsZVwiLFxuLy8gXHRcdCAgICAgICAvL3BsYWNlaG9sZGVyOiBcInVpLXN0YXRlLWhpZ2hsaWdodFwiLFxuLy8gXHRcdCAgICAgICAgc3RhcnQ6IGZ1bmN0aW9uKGV2ZW50LCB1aSkge1xuLy8gXHRcdCAgICAgICAgXHRjb25zb2xlLmxvZyhcIlNUQVJUIFNUQVJUIFNUQVJUIFNUQVJUIFNUQVJUXCIpXG4vLyBcdFx0ICAgICAgICBcdGNvbnNvbGUubG9nKGVsZW1lbnQpXG4vLyBcdFx0ICAgICAgICBcdGNvbnNvbGUubG9nKHRlbXBEYXRhKVxuXHRcdCAgICAgICAgXHRcblxuLy8gXHRcdCAgICAgICAgXHR0ZW1wRGF0YS5zdGFydE5vdGUgPSBhbmd1bGFyLmNvcHkoc2NvcGUubm90ZSk7XG4vLyBcdFx0ICAgICAgICBcdHRlbXBEYXRhLnN0YXJ0Tm90ZUluZGV4ID0gYXR0cnMubm90ZWluZGV4O1xuLy8gXHRcdFx0XHRcdHRlbXBEYXRhLnN0YXJ0Tm90ZUl0ZW1JbmRleCA9IHVpLml0ZW0uaW5kZXgoKTtcbi8vIFx0XHRcdFx0XHR0ZW1wRGF0YS5zdGFydE5vdGVJdGVtQ29udGVudCA9IHRlbXBEYXRhLnN0YXJ0Tm90ZS5pdGVtc1t0ZW1wRGF0YS5zdGFydE5vdGVJdGVtSW5kZXhdO1xuXHRcdCAgIFx0XHRcdFxuLy8gXHRcdCAgIFx0XHRcdHRlbXBOb3RlID0gYW5ndWxhci5jb3B5KHNjb3BlLm5vdGUpXG4vLyBcdFx0ICAgXHRcdFx0Y29uc29sZS5sb2codGVtcE5vdGUpXG5cbi8vIFx0XHQgICAgICAgIH0sXG4vLyBcdFx0ICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uKGV2ZW50LCB1aSkge1xuXG4vLyBcdFx0ICAgICAgIC8vIGNvbnNvbGUubG9nKHNjb3BlLnRlbXBEYXRhKVx0XG4vLyBcdCAgICAgICAgIFx0aWYgKCF1aS5zZW5kZXIpIHtcdFx0ICAgICAgIFxuLy8gXHRcdFx0ICAgICAgICAgY29uc29sZS5sb2coXCJVUERBVEUgVVBEQVRFIFVQREFURSBVUERBVEUgVVBEQVRFIElOU0lERSBJRlwiIClcblxuXHRcdFx0ICAgICAgICBcblx0XHRcdFx0XHRcdFx0XHQgICAgICAgICBcblxuLy8gXHRcdFx0XHRcdHZhciBzdGFydF9wb3MgPSB0ZW1wRGF0YS5zdGFydE5vdGVJdGVtSW5kZXg7XG4vLyBcdFx0XHRcdFx0dmFyIGVuZF9wb3MgPSB1aS5pdGVtLmluZGV4KCk7XG4vLyBcdFx0XHRcdFx0Y29uc29sZS5sb2coc3RhcnRfcG9zICsgJyAtICcgKyBlbmRfcG9zKTtcblxuLy8gXHRcdFx0XHRcdHRlbXBOb3RlLml0ZW1zLnNwbGljZShzdGFydF9wb3MsMSlcbi8vIFx0XHRcdFx0XHR0ZW1wTm90ZS5pdGVtcy5zcGxpY2UoZW5kX3BvcywwLCB0ZW1wRGF0YS5zdGFydE5vdGVJdGVtQ29udGVudClcbi8vIFx0XHRcdFx0XHQvL3Njb3BlLm5vdGUgPSB0ZW1wTm90ZVxuLy8gXHRcdFx0XHRcdHNjb3BlLm5vdGVzW3RlbXBEYXRhLnN0YXJ0Tm90ZUluZGV4XSA9IHRlbXBOb3RlO1xuXHRcdFx0XHRcdFxuLy8gXHRcdFx0XHRcdGNvbnNvbGUubG9nKHNjb3BlLm5vdGVzKVxuXG4vLyBcdFx0XHRcdFx0dmFyIHJhc3QgPSB7XG4vLyAgICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJhZHNAbmppdC5lZHVcIixcbi8vICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiczFcIixcbi8vICAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJsYXVuc2RyeVwiLCBcImFwc3BseSBqb2JzXCIsIFwiZ3N5bVwiIF0sXG4vLyAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMS8xLzIyMDE2XCIsXG4vLyAgICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIxLzIyLzIwMTZcIixcbi8vICAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3pzZS5ha0BnbWFpbC5jb21cIlxuLy8gICAgICAgICAgICAgICAgIH1cblxuLy8gXHRcdFx0XHRcdC8vc2NvcGUubm90ZXNbMF0uaXRlbXMucHVzaChcIlBVQ0tTXCIpXG5cbi8vIFx0XHRcdFx0XHRzY29wZS4kYXBwbHkoKTtcblxuLy8gXHRcdCAgIC8vICAgICAgICAgLy9jb25zb2xlLmxvZyhzY29wZS5ub3Rlcylcbi8vIFx0XHRcdCAgICB9ICAgXG5cdFx0ICAgICAgICAgICBcbi8vIFx0XHQgICAgICAgIH0sIC8vZW5kIHVwZGF0ZVxuLy8gXHRcdCAgICAgICAgcmVjZWl2ZTogZnVuY3Rpb24oZXZlbnQsIHVpKXtcbi8vIFx0XHQgICAgICAgIFx0Y29uc29sZS5sb2coXCJSRUNFSVZFIFJFQ0VJVkUgUkVDRUlWRSBSRUNFSVZFIFJFQ0VJVkVcIilcbi8vIFx0XHQgICAgICAgIFx0Y29uc29sZS5sb2codGVtcERhdGEpXG5cbi8vIFx0XHQgICAgICAgIFx0dGVtcERhdGEuZW5kTm90ZSA9IGFuZ3VsYXIuY29weShzY29wZS5ub3RlKTtcbi8vIFx0XHQgICAgICAgIFx0dGVtcERhdGEuZW5kTm90ZUluZGV4ID0gYXR0cnMubm90ZWluZGV4O1xuLy8gXHRcdFx0XHRcdHRlbXBEYXRhLmVuZE5vdGVJdGVtSW5kZXggPSB1aS5pdGVtLmluZGV4KCk7XG5cblx0XHRcdFx0XHRcblxuLy8gXHRcdFx0XHRcdCAgLy9jb25zb2xlLmxvZyhcInJlbW92aW5nIGl0ZW06IFwiICsgc2NvcGUubm90ZXNbbm90ZU9yaWdpbkluZGV4XS5pdGVtc1tzdGFydF9wb3NdKTtcbi8vIFx0XHQgICAgICAgICAgIHRlbXBEYXRhLnN0YXJ0Tm90ZS5pdGVtcy5zcGxpY2UodGVtcERhdGEuc3RhcnROb3RlSXRlbUluZGV4LDEpXG4vLyBcdFx0XHQgICAgICAgdGVtcERhdGEuZW5kTm90ZS5pdGVtcy5zcGxpY2UodGVtcERhdGEuZW5kTm90ZUl0ZW1JbmRleCwwLHRlbXBEYXRhLnN0YXJ0Tm90ZUl0ZW1Db250ZW50KVxuLy8gXHRcdFx0ICAgICAgIGNvbnNvbGUubG9nKHRlbXBEYXRhKVxuXG4vLyBcdFx0XHQgICAgICAgc2NvcGUubm90ZXNbdGVtcERhdGEuc3RhcnROb3RlSW5kZXhdID0gdGVtcERhdGEuc3RhcnROb3RlO1xuLy8gXHRcdFx0ICAgICAgIHNjb3BlLm5vdGVzW3RlbXBEYXRhLmVuZE5vdGVJbmRleF0gPSB0ZW1wRGF0YS5lbmROb3RlO1xuXHQgICAgICAgICAgIFx0XG4vLyBcdCAgICAgICAgICAgXHRcdGNvbnNvbGUubG9nKHRlbXBEYXRhLnN0YXJ0Tm90ZS5pdGVtcylcbi8vIFx0ICAgICAgICAgICBcdFx0Y29uc29sZS5sb2codGVtcERhdGEuZW5kTm90ZS5pdGVtcylcblxuLy8gXHRcdCAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImFkZGluZyBhZnRlciBwb3NpdGlvbjogXCIgKyBlbmRfcG9zKVxuLy8gXHRcdCAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImFkZGluZyBhZnRlcjogXCIgKyBzY29wZS5ub3Rlc1tub3RlRGVzdGluYXRpb25JbmRleF0uaXRlbXNbZW5kX3Bvc10pXG4vLyBcdFx0ICAgICAgICAgICAvL3Njb3BlLm5vdGVzW25vdGVEZXN0aW5hdGlvbkluZGV4XS5pdGVtcy5zcGxpY2UoZW5kX3BvcywwLCBzdGFydEl0ZW0pXG5cbi8vIFx0XHQgICAgICAgIFx0Ly9zY29wZS50ZW1wRGF0YSA9IFwicHJhd25zXCI7XG5cdFx0ICAgICAgICBcdFxuXHRcdCAgICAgICAgXHRcbi8vIFx0XHQgICAgICAgIFx0Ly8gY29uc29sZS5sb2codGVtcERhdGEpXG4vLyBcdFx0ICAgICAgICBcdC8vIC8vY29uc29sZS5sb2coc2NvcGUubm90ZSk7XG4vLyBcdFx0ICAgICAgICBcdHZhciByYXN0ID0ge1xuLy8gICAgICAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyYWRzQG5qaXQuZWR1XCIsXG4vLyAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcInMxXCIsXG4vLyAgICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwibGF1bnNkcnlcIiwgXCJhcHNwbHkgam9ic1wiLCBcImdzeW1cIiBdLFxuLy8gICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjEvMS8yMjAxNlwiLFxuLy8gICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMS8yMi8yMDE2XCIsXG4vLyAgICAgICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96c2UuYWtAZ21haWwuY29tXCJcbi8vICAgICAgICAgICAgICAgICB9XG5cdFx0ICAgICAgICBcdFxuLy8gXHRcdCAgICAgICAgICAgc2NvcGUuJGFwcGx5KCk7XG5cdFx0XG5cbi8vIFx0XHQgICAgICAgIH1cblxuLy8gXHRcdCAgICB9KTsgLy8gZW5kIHNvcnRhYmxlXG5cbi8vIFx0XHQgLy8gIH0pOyAvL2VuZCB3YXRjaFxuXG5cblxuLy8gXHRcdH0sXG4vLyBcdFx0Y29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlKXtcblxuLy8gXHRcdFx0JHNjb3BlLm1vb3NlID0gXCJkaW5nXCJcbi8vIFx0XHRcdCRzY29wZS5kZWxldGVJdGVtID0gZnVuY3Rpb24ocGFyZW50SW5kZXgsIGluZGV4KXtcbi8vIFx0XHRcdFx0Y29uc29sZS5sb2cocGFyZW50SW5kZXgpXG4vLyBcdFx0XHRcdGNvbnNvbGUubG9nKGluZGV4KVxuLy8gXHRcdFx0XHQkc2NvcGUubm90ZXNbcGFyZW50SW5kZXhdLml0ZW1zLnNwbGljZShpbmRleCwxKVxuXG4vLyBcdFx0XHR9XG5cbi8vIFx0XHRcdCRzY29wZS5yYW5kb21JZCA9IGZ1bmN0aW9uKGl0ZW0pe1xuLy8gICAgXHRcdFx0IHJldHVybiBcIklEXCIgKyBpdGVtICsgKE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiA5OTkpICsgMSkpO1xuLy8gXHRcdFx0fVxuLy8gXHRcdFx0Ly9hbGVydChcImNvbnRyb2xsZXJcIik7XG4vLyBcdFx0XHQvLyAkc2NvcGUuZG9ncyA9ICRzY29wZS5kYXRhICsgXCJkb2dzXCI7XG4vLyBcdFx0XHQvLyBpZigkc2NvcGUuZHJhZ2dhYmxlKVxuLy8gXHRcdFx0Ly8gXHQkc2NvcGUuZHJhZ1N0YXR1cyA9IGZhbHNlO1xuLy8gXHRcdFx0Ly8gZWxzZSAkc2NvcGUuZHJhZ1N0YXR1cyA9IHRydWU7XG5cbi8vIFx0XHRcdGNvbnNvbGUubG9nKCRzY29wZSlcblxuXHRcdFx0XG4vLyBcdFx0fVxuLy8gXHR9XG4vLyB9IC8vZW5kIG5vdGVjYXJkIGRpcmVjdGl2ZVxuXG5cblxuXG5cbiIsIihmdW5jdGlvbigpe1xuXHQndXNlIHN0cmljdCdcblxuXHRhbmd1bGFyXG4gICAgXHQubW9kdWxlKCdub3RlcycpXG4gICAgXHQuZmFjdG9yeSgnbm90ZXNTZXJ2aWNlJywgbm90ZXNTZXJ2aWNlKTtcblxuICAgIG5vdGVzU2VydmljZS4kaW5qZWN0ID0gWyckaHR0cCddXG5cbiAgICBmdW5jdGlvbiBub3Rlc1NlcnZpY2UoJGh0dHApIHtcbiAgICBcdHZhciBzZXJ2aWNlID0ge1xuXG4gICAgICAgICAgICBnZXROb3RlOiBnZXROb3RlLFxuICAgICAgICAgICAgZ2V0Tm90ZXM6IGdldE5vdGVzLFxuICAgICAgICAgICAgc2F2ZU5vdGVzOiBzYXZlTm90ZXNcblxuXG4gICAgXHR9O1xuXG4gICAgXHRyZXR1cm4gc2VydmljZTtcblxuICAgIFx0Ly8vLy8vLy8vLy8vXG5cbiAgICAgICAgLy8gZ2V0cyBhIHNpbmdsZSBub3RlXG4gICAgICAgIGZ1bmN0aW9uIGdldE5vdGUgKCkge1xuXG4gICAgICAgICAgICB2YXIgbm90ZSA9IHtcbiAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyQG5qaXQuZWR1XCIsXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwidG9kb1wiLFxuICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwibGF1bmRyeVwiLCBcImFwcGx5IGpvYnNcIiwgXCJneW1cIiBdLFxuICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMS8xLzIwMTZcIixcbiAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMS8yLzIwMTZcIixcbiAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvemUuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG5vdGU7XG5cbiAgICAgICAgfSAvL2VuZCBnZXROb3RlKClcblxuXG4gICAgICAgIC8vIGdldHMgYWxsIG5vdGVzXG4gICAgICAgIGZ1bmN0aW9uIGdldE5vdGVzICgpIHtcblxuICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnaHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaS9ub3Rlcy9nZXROb3Rlcycse2VtYWlsOlwibW9pekBnbWFpbC5jb21cIn0pXG4gICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIG5vdGVzID0gW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMkBuaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCIxXCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwibGF1bmRyeVwiLCBcImFwcGx5IGpvYnNcIiwgXCJneW1cIiBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjEvMS8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIxLzIvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvemUuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMkBuaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCIyXCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwiaHRtbDUgZHJhZyBhbmQgZHJvcFwiLCBcInNvY2tldC5pb1wiLCBcIm5vZGVqc1wiIF0sXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMi8xLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjIvMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96ZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyQG5qaXQuZWR1XCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIjNcIixcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJib3NlIGhlYWRwaG9uZXNcIiwgXCIyMDE2IGhvbmRhIGdyaWxsXCIsIFwic29saWQgc3RhdGUgaGFyZCBkcml2ZVwiIF0sXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMS8xLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjEvMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96ZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyQG5qaXQuZWR1XCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIjRcIixcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJsYXVuZHJ5XCIsIFwiYXBwbHkgam9ic1wiLCBcImd5bVwiIF0sXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMS8xLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjEvMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96ZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyQG5qaXQuZWR1XCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIjVcIixcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJodG1sNSBkcmFnIGFuZCBkcm9wXCIsIFwic29ja2V0LmlvXCIsIFwibm9kZWpzXCIgXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIyLzEvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMi8yLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3plLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiNlwiLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImJvc2UgaGVhZHBob25lc1wiLCBcIjIwMTYgaG9uZGEgZ3JpbGxcIiwgXCJzb2xpZCBzdGF0ZSBoYXJkIGRyaXZlXCIgXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIxLzEvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMS8yLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3plLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiN1wiLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImxhdW5kcnlcIiwgXCJhcHBseSBqb2JzXCIsIFwiZ3ltXCIsXCJib3NlIGhlYWRwaG9uZXNcIiwgXCIyMDE2IGhvbmRhIGdyaWxsXCIsIFwic29saWQgc3RhdGUgaGFyZCBkcml2ZVwiICBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjEvMS8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIxLzIvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvemUuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMkBuaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCI4XCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwiaHRtbDUgZHJhZyBhbmQgZHJvcFwiLCBcInNvY2tldC5pb1wiLCBcIm5vZGVqc1wiIF0sXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMi8xLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjIvMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96ZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyQG5qaXQuZWR1XCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIjlcIixcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJib3NlIGhlYWRwaG9uZXNcIiwgXCIyMDE2IGhvbmRhIGdyaWxsXCIsIFwic29saWQgc3RhdGUgaGFyZCBkcml2ZVwiLFwiaHRtbDUgZHJhZyBhbmQgZHJvcFwiLCBcInNvY2tldC5pb1wiLCBcIm5vZGVqc1wiICBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjEvMS8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIxLzIvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvemUuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdIC8vZW5kIG5vdGVzIGFycmF5XG5cbiAgICAgICAgICAgIC8vcmV0dXJuIG5vdGVzXG4gICAgICAgIH0gLy9lbmQgZ2V0IG5vdGVzXG5cbiAgICAgICAgZnVuY3Rpb24gc2F2ZU5vdGVzKG5vdGVzKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnaHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaS9ub3Rlcy91cGRhdGVOb3Rlcycse2VtYWlsOlwibW9pekBnbWFpbC5jb21cIixub3Rlczogbm90ZXN9KVxuICAgICAgICB9XG5cblxuXG4gICAgfVxuXG5cdFxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCdcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnbm90aWZ5Jylcblx0XHQuY29udHJvbGxlcignbm90aWZ5Q3RybCcsIG5vdGlmeUN0cmwpXG5cblx0Ly8gbm90aWZ5Q3RybC4kaW5qZWN0ID0gW11cblxuXHRmdW5jdGlvbiBub3RpZnlDdHJsKCkge1xuXG5cdCAgICB2YXIgdm0gPSB0aGlzO1xuXG5cdCAgICB2bS5nb3RvU2Vzc2lvbiA9IGdvdG9TZXNzaW9uO1xuXHQgICAgdm0ucmVmcmVzaCA9IHJlZnJlc2g7XG5cdCAgICB2bS5zZWFyY2ggPSBzZWFyY2g7XG5cdCAgICB2bS5zZXNzaW9ucyA9IFtdO1xuXHQgICAgdm0udGl0bGUgPSAnbm90aWZ5JztcblxuXHQgICAgLy8vLy8vLy8vLy8vXG5cblx0ICAgIFxuXG5cdCAgICBmdW5jdGlvbiBnb3RvU2Vzc2lvbigpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gcmVmcmVzaCgpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gc2VhcmNoKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXHR9XG5cbn0pKCk7XG5cblxuIiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ25vdGlmeScpXG4gICAgLmRpcmVjdGl2ZSgnbm90aWZ5Jywgbm90aWZ5KVxuXG4gICAgbm90aWZ5LiRpbmplY3QgPSBbJ25vdGlmeVNlcnZpY2UnLCckcm9vdFNjb3BlJywnJHRpbWVvdXQnXVxuICAgIFxuXG5mdW5jdGlvbiBub3RpZnkoKSB7XG5cdHJldHVybntcblx0XHRyZXN0cmljdDogJ0FFJyxcblx0XHR0ZW1wbGF0ZTogJzxsaSBuZy1yZXBlYXQ9XCJpdGVtIGluIG5vdGlmeUxpc3RcIj57e2l0ZW19fTwvbGk+Jyxcblx0XHRsaW5rOiBmdW5jdGlvbihzY29wZSxlbGVtZW50LGF0dHJzKXtcblxuXHRcdHZhciBsaSA9IGFuZ3VsYXIuZWxlbWVudChlbGVtZW50LmNoaWxkcmVuKClbMF0pXG5cdFx0Y29uc29sZS5sb2cobGkpXG5cdFx0XG5cdFx0YW5pbWF0ZURvd24gPSBmdW5jdGlvbigpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdhbmltYXRpbmcnKVxuICAgICAgICAgICAgJCh0aGlzKS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICB0b3A6ICcrPTk5J1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgYW5pbWF0ZVJpZ2h0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIFx0Y29uc29sZS5sb2coJ2FuaW1hdGluZycpXG4gICAgICAgICAgICAkKHRoaXMpLmFuaW1hdGUoe1xuICAgICAgICAgICAgXHRcbiAgICAgICAgICAgICAgICBsZWZ0OiAnKz01MCdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgICQobGkpLm9uKCdjbGljaycsIGFuaW1hdGVSaWdodCk7XG4gICAgICAgLy8gJChsaSkub24oJ2NsaWNrJywgYW5pbWF0ZVJpZ2h0KTsgIFxuXHRcdCAgICAgXHRcdFxuXHRcdFx0XG5cdFx0XHQgICAgXG5cblxuXG5cdFx0fSxcblx0XHRjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUsbm90aWZ5U2VydmljZSwkcm9vdFNjb3BlLCR0aW1lb3V0KXtcblx0XHRcdGNvbnNvbGUubG9nKCdub3RpZnkgZGlyZWN0aXZlJylcblx0XHRcdFxuXHRcdFx0JHNjb3BlLm5vdGlmeUxpc3QgPSBbXCJkb2dzXCIsXCJjYXRzXCJdO1x0XHRcdFxuXG5cdFx0XHQgJHJvb3RTY29wZS4kb24oJ3B1c2hlZCcsZnVuY3Rpb24oZXZlbnQsbWVzc2FnZSl7XG5cdFx0XHQgXHRjb25zb2xlLmxvZyhcImRpcmVjdGl2ZTogcmVjZWl2aW5nXCIpO1xuXHRcdFx0IFx0JHNjb3BlLm5vdGlmeUxpc3QucHVzaChtZXNzYWdlLmRhdGEpO1xuXHRcdFx0IFx0XHRcdFx0IFx0JHNjb3BlLiRhcHBseSgpO1xuXHRcdFx0IFx0Ly8gJHRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdCBcdC8vIFx0JHNjb3BlLmRhdGEgPSBudWxsO1xuXHRcdFx0IFx0Ly8gfSwzMDAwKVxuXG5cdFx0XHQgfSlcblx0XHRcdFxuXHRcdH1cblx0fVxufSAvL2VuZCBub3RpZnkgZGlyZWN0aXZlXG4iLCIoZnVuY3Rpb24oKXtcbiAgICAndXNlIHN0cmljdCdcblxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnbm90aWZ5JylcbiAgICAgICAgLmZhY3RvcnkoJ25vdGlmeVNlcnZpY2UnLCBub3RpZnlTZXJ2aWNlKTtcblxuICAgIG5vdGlmeVNlcnZpY2UuJGluamVjdCA9IFsnJHJvb3RTY29wZSddXG5cbiAgICBmdW5jdGlvbiBub3RpZnlTZXJ2aWNlKCRyb290U2NvcGUpIHtcbiAgICAgICAgdmFyIHNlcnZpY2UgPSB7XG5cbiAgICAgICAgICAgIHB1c2g6IHB1c2gsXG5cblxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBzZXJ2aWNlO1xuXG4gICAgICAgIC8vLy8vLy8vLy8vL1xuXG4gICAgICAgIGZ1bmN0aW9uIHB1c2gobWVzc2FnZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJwdXNoaW5nIGZyb20gc2VydmljZVwiKTtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGVtaXQoXCJwdXNoZWRcIiwgbWVzc2FnZSk7XG5cbiAgICAgICAgfVxuXG5cblxuICAgIH1cblxuICAgIFxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCdcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgncmVnaXN0ZXInKVxuXHRcdC5jb250cm9sbGVyKCdyZWdpc3RlckN0cmwnLCByZWdpc3RlckN0cmwpXG5cblx0cmVnaXN0ZXJDdHJsLmluamVjdCA9IFsndG9hc3RyJywnJGh0dHAnLCdyZWdpc3RlclNlcnZpY2UnXVxuXG5cdGZ1bmN0aW9uIHJlZ2lzdGVyQ3RybCh0b2FzdHIsJGh0dHAscmVnaXN0ZXJTZXJ2aWNlKSB7XG5cblx0ICAgIHZhciB2bSA9IHRoaXM7XG5cblx0ICAgIHZtLmZvcm0gPSB7fVxuXHQgICAgdm0uc3VibWl0U3RhdHVzID0gXCJcIjtcblx0ICAgIHZtLnN1Ym1pdEZvcm0gPSBzdWJtaXRGb3JtO1xuXHQgICAgXG5cdCAgICAvL2Rpc3BsYXkgaW5mbyBvbiBsb2FkXG5cdCAgICBpbmZvKCk7XG5cblx0ICAgIC8vLy8vLy8vLy8vL1xuXG5cdCAgICBmdW5jdGlvbiBzdWJtaXRGb3JtKGlzVmFsaWQpIHtcblx0ICAgIFx0XG5cdCAgICBcdGNvbnNvbGUubG9nKHZtLmZvcm0pO1xuXHQgICAgXHRcblx0ICAgIFx0Ly8gY2hlY2sgdG8gbWFrZSBzdXJlIHRoZSBmb3JtIGlzIGNvbXBsZXRlbHkgdmFsaWRcblx0XHQgICAgaWYgKGlzVmFsaWQpIHtcblx0XHQgICAgICBjb25zb2xlLmxvZyhcIlZhbGlkIEZvcm1cIik7XG5cdFx0ICAgICAgc2VuZEZvcm0odm0uZm9ybSk7XG5cdFx0ICAgIH1cblx0ICAgIH1cblxuXHQgICAgLy9zZW5kcyBmb3JtIHRvIGFwaVxuXHQgICAgZnVuY3Rpb24gc2VuZEZvcm0oZm9ybSkge1xuXHRcdFx0cmVnaXN0ZXJTZXJ2aWNlLm5ld1VzZXIodm0sZm9ybSlcblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gaW5mbygpIHtcblx0ICAgICAgLyogKi9cblx0ICAgICAgY29uc29sZS5sb2coXCJyZWdpc3RlciBjb250cm9sbGVyXCIpXG5cdCAgICB9XG5cblx0fVxuXG59KSgpO1xuXG5cbiIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdyZWdpc3RlcicpXG4gICAgLmRpcmVjdGl2ZSgncmVnaXN0ZXJEaXInLCByZWdpc3RlckRpcik7XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyRGlyKCkge1xuXHRyZXR1cm57XG5cdFx0cmVzdHJpY3Q6ICdFJyxcblx0XHR0ZW1wbGF0ZVVybDogJycsXG5cdFx0cmVwbGFjZTogdHJ1ZVxuXHRcdC8vIHNjb3BlOiB7fVxuXHR9XG59IiwiKGZ1bmN0aW9uKCl7XG5cdCd1c2Ugc3RyaWN0J1xuXG5cdGFuZ3VsYXJcbiAgICBcdC5tb2R1bGUoJ3JlZ2lzdGVyJylcbiAgICBcdC5mYWN0b3J5KCdyZWdpc3RlclNlcnZpY2UnLCByZWdpc3RlclNlcnZpY2UpO1xuXG4gICAgcmVnaXN0ZXJTZXJ2aWNlLmluamVjdCA9IFsnJGh0dHAnLCd0b2FzdHInLCdhdXRoU2VydmljZScsJyRzdGF0ZScsJyRyb290U2NvcGUnXVxuXG4gICAgZnVuY3Rpb24gcmVnaXN0ZXJTZXJ2aWNlKCRodHRwLHRvYXN0cixhdXRoU2VydmljZSwkc3RhdGUsJHJvb3RTY29wZSkge1xuICAgIFx0dmFyIHNlcnZpY2UgPSB7XG5cbiAgICAgICAgICAgIG5ld1VzZXI6IG5ld1VzZXIsXG4gICAgXHRcdGVycm9yOiBlcnJvcixcbiAgICBcdFx0aW5mbzogaW5mbyxcbiAgICBcdFx0c3VjY2Vzczogc3VjY2Vzc1xuXG4gICAgXHR9O1xuXG4gICAgXHRyZXR1cm4gc2VydmljZTtcblxuICAgIFx0Ly8vLy8vLy8vLy8vXG5cbiAgICAgICAgZnVuY3Rpb24gbmV3VXNlcih2bSwgZm9ybSkge1xuICAgICAgICAgICAgJGh0dHAucG9zdCgnaHR0cDovL2xvY2FsaG9zdDozMDAwL2FwaS91c2Vycy9uZXdVc2VyJywgZm9ybSlcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlcykge1xuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgYXV0aFNlcnZpY2Uuc2V0VG9rZW4ocmVzLmRhdGEudG9rZW4pO1xuXG4gICAgICAgICAgICAgIC8vdG9hc3RcbiAgICAgICAgICAgICAgdG9hc3RyLnN1Y2Nlc3MoJ1lvdSBhcmUgbm93IG15IEJldGEhJyk7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG5cbiAgICAgICAgICAgICAgLy9jaGFuZ2Ugc3RhdHVzIG9uIHZpZXdcbiAgICAgICAgICAgICAgdm0uc3VibWl0U3RhdHVzID0gXCJTdWNjZXNzXCI7XG4gICAgICAgICAgICAgXG4gICAgICAgICAgICAgIC8vZW1wdHkgZm9ybVxuICAgICAgICAgICAgICB2bS5mb3JtID0gXCJcIjtcblxuICAgICAgICAgICAgICAvL3JlZGlyZWN0XG4gICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLm1lbWJlcnMnKTtcblxuICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRlbWl0KFwibG9nZ2VkSW5cIik7XG5cbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgICB0b2FzdHIuZXJyb3IoJ0ZhaWxlZDogJyArIGVyci5kYXRhKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICBcdGZ1bmN0aW9uIGVycm9yKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBpbmZvKCkge1xuXHQgICAgICAvKiAqL1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwicmVnaXN0ZXJTZXJ2aWNlXCIpO1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBzdWNjZXNzKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXG5cbiAgICB9XG5cblx0XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0J1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCdzYW1wbGUnKVxuXHRcdC5jb250cm9sbGVyKCdzYW1wbGVDdHJsJywgc2FtcGxlQ3RybClcblxuXHRzYW1wbGVDdHJsLiRpbmplY3QgPSBbXVxuXG5cdGZ1bmN0aW9uIHNhbXBsZUN0cmwoKSB7XG5cblx0ICAgIHZhciB2bSA9IHRoaXM7XG5cblx0ICAgIHZtLmdvdG9TZXNzaW9uID0gZ290b1Nlc3Npb247XG5cdCAgICB2bS5yZWZyZXNoID0gcmVmcmVzaDtcblx0ICAgIHZtLnNlYXJjaCA9IHNlYXJjaDtcblx0ICAgIHZtLnNlc3Npb25zID0gW107XG5cdCAgICB2bS50aXRsZSA9ICdTYW1wbGUnO1xuXG5cdCAgICAvLy8vLy8vLy8vLy9cblxuXHQgICAgZnVuY3Rpb24gZ290b1Nlc3Npb24oKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIHJlZnJlc2goKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIHNlYXJjaCgpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblx0fVxuXG59KSgpO1xuXG5cbiIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdzYW1wbGUnKVxuICAgIC5kaXJlY3RpdmUoJ3NhbXBsZURpcicsIHNhbXBsZURpcik7XG5cbmZ1bmN0aW9uIHNhbXBsZURpcigpIHtcblx0cmV0dXJue1xuXHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0dGVtcGxhdGVVcmw6ICcnLFxuXHRcdHJlcGxhY2U6IHRydWVcblx0XHQvLyBzY29wZToge31cblx0fVxufSIsIihmdW5jdGlvbigpe1xuXHQndXNlIHN0cmljdCdcblxuXHRhbmd1bGFyXG4gICAgXHQubW9kdWxlKCdzYW1wbGUnKVxuICAgIFx0LmZhY3RvcnkoJ3NhbXBsZVNlcnZpY2UnLCBzYW1wbGVTZXJ2aWNlKTtcblxuICAgIHNhbXBsZVNlcnZpY2UuJGluamVjdCA9IFtdXG5cbiAgICBmdW5jdGlvbiBzYW1wbGVTZXJ2aWNlKCkge1xuICAgIFx0dmFyIHNlcnZpY2UgPSB7XG5cbiAgICBcdFx0ZXJyb3I6IGVycm9yLFxuICAgIFx0XHRpbmZvOiBpbmZvLFxuICAgIFx0XHRzdWNjZXNzOiBzdWNjZXNzXG5cbiAgICBcdH07XG5cbiAgICBcdHJldHVybiBzZXJ2aWNlO1xuXG4gICAgXHQvLy8vLy8vLy8vLy9cblxuICAgIFx0ZnVuY3Rpb24gZXJyb3IoKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIGluZm8oKSB7XG5cdCAgICAgIC8qICovXG4gICAgICAgICAgY29uc29sZS5sb2coXCJzYW1wbGVTZXJ2aWNlXCIpO1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBzdWNjZXNzKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXG5cbiAgICB9XG5cblx0XG5cbn0pKCk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
