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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUuanMiLCJjb250cm9sbGVycy9hcHAuY29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2FwcC5ob21lLmNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9hcHAubG9naW4uY29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2FwcC5uYXYuY29udHJvbGxlci5qcyIsImRpcmVjdGl2ZXMvc2VsZWN0VGV4dC5kaXJlY3RpdmUuanMiLCJyb3V0ZXMvYXBwLnJvdXRlcy5qcyIsImF1dGgvYXV0aC5tb2R1bGUuanMiLCJidWRnZXQvYnVkZ2V0Lm1vZHVsZS5qcyIsIm1lbWJlcnMvbWVtYmVycy5tb2R1bGUuanMiLCJub3Rlcy9ub3Rlcy5tb2R1bGUuanMiLCJub3RpZnkvbm90aWZ5Lm1vZHVsZS5qcyIsInJlZ2lzdGVyL3JlZ2lzdGVyLm1vZHVsZS5qcyIsInNhbXBsZUNvbXBvbmVudC9zYW1wbGUubW9kdWxlLmpzIiwiYXV0aC9zZXJ2aWNlcy9hdXRoLnNlcnZpY2UuaW50ZXJjZXB0b3IuanMiLCJhdXRoL3NlcnZpY2VzL2F1dGguc2VydmljZS5qcyIsImJ1ZGdldC9jb250cm9sbGVycy9idWRnZXQuY29udHJvbGxlci5qcyIsImJ1ZGdldC9kaXJlY3RpdmVzL25vdGVzLmRpcmVjdGl2ZS5iYWNrdXAuanMiLCJidWRnZXQvZGlyZWN0aXZlcy9ub3Rlcy5kaXJlY3RpdmUuanMiLCJidWRnZXQvc2VydmljZXMvYnVkZ2V0LnNlcnZpY2UuanMiLCJtZW1iZXJzL2NvbnRyb2xsZXJzL21lbWJlcnMuY29udHJvbGxlci5qcyIsIm1lbWJlcnMvc2VydmljZXMvbWVtYmVycy5zZXJ2aWNlLmpzIiwibm90ZXMvY29udHJvbGxlcnMvbm90ZXMuY29udHJvbGxlci5qcyIsIm5vdGVzL2RpcmVjdGl2ZXMvbm90ZXMuZGlyZWN0aXZlLmJhY2t1cC5qcyIsIm5vdGVzL2RpcmVjdGl2ZXMvbm90ZXMuZGlyZWN0aXZlLmpzIiwibm90ZXMvc2VydmljZXMvbm90ZXMuc2VydmljZS5qcyIsIm5vdGlmeS9jb250cm9sbGVycy9ub3RpZnkuY29udHJvbGxlci5qcyIsIm5vdGlmeS9kaXJlY3RpdmVzL25vdGlmeS5kaXJlY3RpdmUuanMiLCJub3RpZnkvc2VydmljZXMvbm90aWZ5LnNlcnZpY2UuanMiLCJyZWdpc3Rlci9jb250cm9sbGVycy9yZWdpc3Rlci5jb250cm9sbGVyLmpzIiwicmVnaXN0ZXIvZGlyZWN0aXZlcy9yZWdpc3Rlci5kaXJlY3RpdmUuanMiLCJyZWdpc3Rlci9zZXJ2aWNlcy9yZWdpc3Rlci5zZXJ2aWNlLmpzIiwic2FtcGxlQ29tcG9uZW50L2NvbnRyb2xsZXJzL3NhbXBsZS5jb250cm9sbGVyLmpzIiwic2FtcGxlQ29tcG9uZW50L2RpcmVjdGl2ZXMvc2FtcGxlLmRpcmVjdGl2ZS5qcyIsInNhbXBsZUNvbXBvbmVudC9zZXJ2aWNlcy9zYW1wbGUuc2VydmljZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtcbiAgICAndXNlIHN0cmljdCdcblxuYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcCcsIFtcbiAgICAgICAgJ2F1dGgnLFxuICAgIFx0J3VpLnJvdXRlcicsXG4gICAgXHQnbmdBbmltYXRlJyxcbiAgICBcdCdzYW1wbGUnLFxuICAgIFx0J3JlZ2lzdGVyJyxcbiAgICBcdCd0b2FzdHInLFxuICAgIFx0J21lbWJlcnMnLFxuICAgIFx0J25vdGVzJyxcbiAgICAgICAgJ2J1ZGdldCcsXG4gICAgICAgICdjaGFydC5qcycsXG4gICAgICAgICdub3RpZnknLFxuICAgICAgICAndWkudGlueW1jZSdcbiAgICBdKVxuXG4vLyAuY29uZmlnKGZ1bmN0aW9uKCRodHRwUHJvdmlkZXIpIHtcblxuLy8gICAgIC8vIGF0dGFjaCBvdXIgYXV0aCBpbnRlcmNlcHRvciB0byB0aGUgaHR0cCByZXF1ZXN0c1xuLy8gICAgICRodHRwUHJvdmlkZXIuaW50ZXJjZXB0b3JzLnB1c2goJ2F1dGhJbnRlcmNlcHRvcicpO1xuXG4vLyB9KVxuXG5cbi5ydW4oWyckcm9vdFNjb3BlJywnJHN0YXRlJywnYXV0aFNlcnZpY2UnLCckcScsZnVuY3Rpb24oJHJvb3RTY29wZSwgJHN0YXRlLCBhdXRoU2VydmljZSAsJHEpIHtcbiAgICBhdXRoU2VydmljZS5pbmZvKCk7XG5cbiAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlRXJyb3InLCBmdW5jdGlvbiAoZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMsIGVycm9yKSB7XG4gICAgICAgICAgIFxuICAgICAgICAgIC8vIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgIGNvbnNvbGUubG9nKFwiU1RBVEUgQ0hBTkdFIEVSUk9SIEVSUk9SIEVSUk9SIEVSUk9SRVJST1JcIik7XG4gICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmhvbWUnKVxuICAgICAgICBcbiAgICAgIH0pO1xuXG4gICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN0YXJ0JywgZnVuY3Rpb24gKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zKSB7XG4gICAgLy9hdXRoU2VydmljZS5pbmZvKCk7XG4gICAgLy9hdXRoU2VydmljZS5pc0F1dGhvcml6ZWQoIGV2ZW50LCBmcm9tU3RhdGUsIHRvU3RhdGUpO1xuICAgIC8vY29uc29sZS5sb2coXCJzdGF0ZSBjaGFuZ2luZ1wiKTtcbiAgICAvL2NvbnNvbGUubG9nKHRvU3RhdGUpXG5cbiAgICAgICAgaWYodG9TdGF0ZS5kYXRhLnBlcm1pc3Npb24gPT09IHRydWUpe1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5lZWQgcGVybWlzc2lvblwiKTtcbiAgICAgICAgICAgIC8vdG9TdGF0ZS5yZXNvbHZlID0gdG9TdGF0ZS5yZXNvbHZlIHx8IHt9O1xuICAgICAgICAgICAgLy90b1N0YXRlLnJlc29sdmUgPSB7fTtcblxuICAgICAgICAgICAgLy9jaGVjayB0byBzZWUgaWYgdGhlcmUgd2FzIGEgcmVzb2x2ZSBhbHJlYWR5IGFkZGVkXG4gICAgICAgICAgICBpZighdG9TdGF0ZS5yZXNvbHZlLmF1dGhvcml6YXRpb25SZXNvbHZlcil7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2FkZGluZyBhdXRoIHJlc29sdmVyJyk7XG4gICAgICAgICAgICAgICAgLy9hZGQgcmVzb2x2ZXJcbiAgICAgICAgICAgICAgICB0b1N0YXRlLnJlc29sdmUuYXV0aG9yaXphdGlvblJlc29sdmVyID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhdXRoU2VydmljZS5pc0F1dGhvcml6ZWQoZXZlbnQsIGZyb21TdGF0ZSwgdG9TdGF0ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJqdXN0IGFkZGVkOiBcIilcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHRvU3RhdGUucmVzb2x2ZS5hdXRob3JpemF0aW9uUmVzb2x2ZXIpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgIC8vanVzdCB0byBzaG93IHRoYXQgdGhlIHJlc29sdmVyIHdhcyBhbHJlYWR5IGFkZGVkXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyh0b1N0YXRlLnJlc29sdmUuYXV0aG9yaXphdGlvblJlc29sdmVyKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gLy9lbmQgaWYgbmVlZHMgcGVybWlzc2lvblxuXG5cbiAgICB9KTsgLy9lbmQgcm9vdFNjb3BlLiRvblxuXG5cbiAgICBcblxufV0pOyAvL2VuZCAucnVuXG5cblxuXG5cblxufSkoKTsgLy9lbmQgaWZmZVxuXG4iLCIoZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0J1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCdhcHAnKVxuXHRcdC5jb250cm9sbGVyKCdhcHBDdHJsJywgYXBwQ3RybClcblxuXHRhcHBDdHJsLiRpbmplY3QgPSBbJ3NhbXBsZVNlcnZpY2UnLCdhdXRoU2VydmljZScsJyRzdGF0ZScsJyRodHRwJywndG9hc3RyJywnJHJvb3RTY29wZScsJ25vdGlmeVNlcnZpY2UnXVxuXG5cdGZ1bmN0aW9uIGFwcEN0cmwoc2FtcGxlU2VydmljZSxhdXRoU2VydmljZSwkc3RhdGUsICRodHRwLCB0b2FzdHIsICRyb290U2NvcGUsbm90aWZ5U2VydmljZSkge1xuXG5cdFx0IHZhciB2bSA9IHRoaXM7XG5cblx0XHQgLy8gb24gaW5pdGlhbCBsb2FkXG5cdFx0IC8vIHVzZXIgbG9naW4gc3RhdHVzXG5cdFx0IHZtLmlzTG9nZ2VkID0gYXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKHZtKTtcblxuXHRcdCAkcm9vdFNjb3BlLiRvbignbG9nZ2VkSW4nLGZ1bmN0aW9uKCl7XG5cdFx0IFx0dm0uaXNMb2dnZWQgPSB0cnVlO1xuXHRcdCB9KVxuXG5cdFx0ICRyb290U2NvcGUuJG9uKCdsb2dnZWRPdXQnLGZ1bmN0aW9uKCl7XG5cdFx0IFx0dm0uaXNMb2dnZWQgPSBmYWxzZTtcblx0XHQgfSlcblxuXHRcdCB2YXIgbWVzc2FnZSA9IHtkYXRhIDogXCJyb29zdHNcIn07XG5cdFx0IC8vbm90aWZ5U2VydmljZS5wdXNoKCBtZXNzYWdlKTtcblxuXHRcdCAvL2FsZXJ0KFwid2F0Y2hpbmdcIik7XG5cblxuXHR9IC8vZW5kIGFwcEN0cmxcblxufSkoKTs7XG5cblxuIiwiKGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCdcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnYXBwJylcblx0XHQuY29udHJvbGxlcignaG9tZUN0cmwnLCBob21lQ3RybClcblx0XHQuY29udHJvbGxlcigncGFyZW50Q3RybCcsIHBhcmVudEN0cmwpXG5cblx0aG9tZUN0cmwuaW5qZWN0ID0gWydzYW1wbGVTZXJ2aWNlJywnJHNjb3BlJ11cblxuXHRmdW5jdGlvbiBob21lQ3RybChzYW1wbGVTZXJ2aWNlLCAkc2NvcGUpIHtcblx0XHRcblx0XHRzYW1wbGVTZXJ2aWNlLmluZm8oKTtcblxuXHQgICAgdmFyIHZtID0gdGhpcztcblxuXHQgICAgdm0uZ290b1Nlc3Npb24gPSBnb3RvU2Vzc2lvbjtcblx0ICAgIHZtLnJlZnJlc2ggPSByZWZyZXNoO1xuXHQgICAgdm0uc2VhcmNoID0gc2VhcmNoO1xuXHQgICAgdm0uc2Vzc2lvbnMgPSBbXTtcblx0ICAgIHZtLnRlc3QgPSAndGVzdCc7XG5cblx0ICAgIC8vLy8vLy8vLy8vL1xuXG5cdCAgICAvLyAkc2NvcGUuJG9uKCdkb2dzJywgZnVuY3Rpb24gKCkge1xuXHQgICAgLy8gXHRjb25zb2xlLmxvZyhcInJlY2VpdmVkXCIpXG5cdCAgICAvLyB9KTtcblxuXHQgICAgZnVuY3Rpb24gZ290b1Nlc3Npb24oKSB7XG5cblx0XHR9XG5cblx0ICAgIGZ1bmN0aW9uIHJlZnJlc2goKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIHNlYXJjaCgpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblx0fSAvLyBlbmQgaG9tZUN0cmxcblxuXHRwYXJlbnRDdHJsLmluamVjdCA9IFsnc2FtcGxlU2VydmljZScsJyRzY29wZSddXG5cblx0ZnVuY3Rpb24gcGFyZW50Q3RybCgkc2NvcGUpIHtcblx0XHRcblx0ICAgIHZhciB2bSA9IHRoaXM7XG5cdCAgICAvL2NvbnNvbGUubG9nKFwicGFyZW50XCIpXG5cblx0ICAgLy8gJHNjb3BlLiRlbWl0KCdkb2dzJywnc29tZSBkYXRhJyk7XG5cblxuXHR9IC8vIGVuZCBwYXJlbnRDdHJsXG5cbn0pKCk7XG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cbiIsIlx0KGZ1bmN0aW9uKCl7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ2FwcCcpXG5cdFx0LmNvbnRyb2xsZXIoXCJsb2dpbkN0cmxcIiwgbG9naW5DdHJsKVxuXG5cdGxvZ2luQ3RybC4kaW5qZWN0ID0gWyckc2NvcGUnLCdzYW1wbGVTZXJ2aWNlJywnYXV0aFNlcnZpY2UnLCckc3RhdGUnLCckaHR0cCcsJ3RvYXN0ciddXG5cblx0ZnVuY3Rpb24gbG9naW5DdHJsKCRzY29wZSxzYW1wbGVTZXJ2aWNlLGF1dGhTZXJ2aWNlLCRzdGF0ZSwgJGh0dHAsIHRvYXN0cikge1xuXHRcdC8vc2FtcGxlU2VydmljZS5pbmZvKCk7XG5cdFx0Ly9jb25zb2xlLmxvZyhcImxvZ2luQ3RybFwiKVxuXG5cdCAgICB2YXIgdm0gPSB0aGlzO1xuXHQgICAgdm0udXNlciA9IFwiXCJcblx0ICAgIHZtLmxvZ2luRm9ybSA9IFwiXCI7XG5cdCAgICBcblx0ICAgIHZtLmxvZ2luID0gbG9naW47XG5cdCAgICB2bS5sb2dvdXQgPSBsb2dvdXQ7XG5cblx0ICAgIC8vLy8vLy8vLy8vL1xuXG5cdCAgICBmdW5jdGlvbiBsb2dpbigpIHtcblx0ICAgIFx0YXV0aFNlcnZpY2UubG9naW4odm0udXNlciwnYXBwLm5vdGVzJylcblx0XHRcdHZtLnVzZXIgPSBcIlwiO1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBsb2dvdXQoKSB7XG5cdCAgICBcdGNvbnNvbGUubG9nKFwibG9nZ2luZyBvdXQuLi5cIilcblx0ICAgIFx0YXV0aFNlcnZpY2UubG9nb3V0KCk7XG5cdCAgICB9XG5cblxuXHR9IC8vZW5kIGxvZ2luQ3RybFxuXG5cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0J1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCdhcHAnKVxuXHRcdC5jb250cm9sbGVyKCduYXZDdHJsJywgbmF2Q3RybClcblxuXHRuYXZDdHJsLmluamVjdCA9IFsnJ11cblxuXHRmdW5jdGlvbiBuYXZDdHJsKCkge1xuXHRcdFxuXHRcdC8vY29uc29sZS5sb2coJ25hdiBjb250cm9sbGVyJyk7XG5cblx0ICAgIHZhciB2bSA9IHRoaXM7XG5cblxuXHQgICAgdm0ubG9nZ2VkSW4gPSB0cnVlO1xuXHQgICAgdm0uZ290b1Nlc3Npb24gPSBnb3RvU2Vzc2lvbjtcblx0ICAgIHZtLnJlZnJlc2ggPSByZWZyZXNoO1xuXHQgICAgdm0uc2VhcmNoID0gc2VhcmNoO1xuXHQgICAgdm0uc2Vzc2lvbnMgPSBbXTtcblx0ICAgIHZtLnRpdGxlID0gJ05hdic7XG5cdCAgICAvLyRzY29wZS50aXRsZSA9IFwibW91c2VcIjtcblxuXHQgICAgLy8vLy8vLy8vLy8vXG5cblx0ICAgIGZ1bmN0aW9uIGdvdG9TZXNzaW9uKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiByZWZyZXNoKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBzZWFyY2goKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cdH1cblxufSkoKTtcblxuXG4iLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwJylcbiAgICAuZGlyZWN0aXZlKCdzZWxlY3RUZXh0Jywgc2VsZWN0VGV4dClcbiAgICBcbiAgICBzZWxlY3RUZXh0LiRpbmplY3QgPSBbJyR3aW5kb3cnXVxuXG5mdW5jdGlvbiBzZWxlY3RUZXh0KCR3aW5kb3cpe1xuICAgIHJldHVybiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgZWxlbWVudC5iaW5kKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghJHdpbmRvdy5nZXRTZWxlY3Rpb24oKS50b1N0cmluZygpKSB7XG4gICAgICAgIHRoaXMuc2V0U2VsZWN0aW9uUmFuZ2UodGhpcy52YWx1ZS5sZW5ndGgsIHRoaXMudmFsdWUubGVuZ3RoKVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xufVxuXG5cbiIsIlxuYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG5cdC5jb25maWcoWyckdXJsUm91dGVyUHJvdmlkZXInLCckc3RhdGVQcm92aWRlcicsJyRodHRwUHJvdmlkZXInLGZ1bmN0aW9uKCR1cmxSb3V0ZXJQcm92aWRlciwkc3RhdGVQcm92aWRlciwkaHR0cFByb3ZpZGVyKXtcblx0XHRcblx0XHQkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCdob21lJyk7XG5cdFx0Ly9zdGF0ZXNcblx0XHQkc3RhdGVQcm92aWRlclxuXG5cdFx0LmRlY29yYXRvcigncGF0aCcsIGZ1bmN0aW9uKHN0YXRlLCBwYXJlbnRGbikge1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhcImNvbmZpZ3VyaW5nIHN0YXRlc1wiKVx0XG5cdFx0XHRpZiAoc3RhdGUuc2VsZi5yZXNvbHZlID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0c3RhdGUuc2VsZi5yZXNvbHZlID0ge307XG5cdFx0XHRcdHN0YXRlLnJlc29sdmUgPSBzdGF0ZS5zZWxmLnJlc29sdmU7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcGFyZW50Rm4oc3RhdGUpO1xuICAgICAgICAgfSlcblxuXHRcdC5zdGF0ZSgnYXBwJyx7XG5cdFx0XHRhYnN0cmFjdDogdHJ1ZSxcblx0XHRcdHRlbXBsYXRlVXJsOidhcHAvdmlld3MvYXBwLnZpZXcuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnYXBwQ3RybCcsXG5cdFx0XHRjb250cm9sbGVyQXM6ICdhcHAnXG5cblx0XHR9KVxuXG5cdFx0LnN0YXRlKCdhcHAuaG9tZScse1xuXHRcdFx0dXJsOiAnL2hvbWUnLFxuXHRcdFx0dGVtcGxhdGVVcmw6J2FwcC92aWV3cy9hcHAuaG9tZS5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdob21lQ3RybCcsXG5cdFx0XHRjb250cm9sbGVyQXM6ICdob21lJyxcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0cGVybWlzc2lvbjogZmFsc2UsXG5cdFx0XHRcdHBlcm1pc3Npb25MZXZlbDogWydldmVyeW9uZSddXG5cdFx0XHR9XG5cdFx0fSlcblxuXHRcdC5zdGF0ZSgnYXBwLnJlZ2lzdGVyJyx7XG5cdFx0XHR1cmw6ICcvcmVnaXN0ZXInLFxuXHRcdFx0dGVtcGxhdGVVcmw6J2NvbXBvbmVudHMvcmVnaXN0ZXIvdmlld3MvcmVnaXN0ZXIudmlldy5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6ICdyZWdpc3RlckN0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAncmVnaXN0ZXInLFxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRwZXJtaXNzaW9uOiBmYWxzZSxcblx0XHRcdFx0cGVybWlzc2lvbkxldmVsOiBbJ2V2ZXJ5b25lJ11cblx0XHRcdH1cblx0XHR9KVxuXG5cdFx0LnN0YXRlKCdhcHAubWVtYmVycycse1xuXHRcdFx0dXJsOiAnL21lbWJlcnMnLFxuXHRcdFx0dGVtcGxhdGVVcmw6J2NvbXBvbmVudHMvbWVtYmVycy92aWV3cy9tZW1iZXJzLmhvbWUuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiAnbWVtYmVyc0N0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAnbWVtYmVycycsXG5cdFx0XHRkYXRhOiB7XG5cdFx0XHRcdHBlcm1pc3Npb246IHRydWUsXG5cdFx0XHRcdHBlcm1pc3Npb25MZXZlbDogWydhZG1pbicsJ21lbWJlciddXG5cdFx0XHR9XG5cdFx0fSlcblxuXHRcdC5zdGF0ZSgnYXBwLm5vdGVzJyx7XG5cdFx0XHR1cmw6ICcvbm90ZXMnLFxuXHRcdFx0dGVtcGxhdGVVcmw6J2NvbXBvbmVudHMvbm90ZXMvdmlld3Mvbm90ZXMudmlldy5odG1sJyxcblxuXHRcdFx0ZGF0YToge1xuXHRcdFx0XHRwZXJtaXNzaW9uOiB0cnVlLFxuXHRcdFx0XHRwZXJtaXNzaW9uTGV2ZWw6IFsnYWRtaW4nLCdtZW1iZXInXVxuXHRcdFx0fVxuXHRcdH0pXG5cblx0XHQuc3RhdGUoJ2FwcC5idWRnZXQnLHtcblx0XHRcdHVybDogJy9idWRnZXQnLFxuXHRcdFx0dGVtcGxhdGVVcmw6J2NvbXBvbmVudHMvYnVkZ2V0L3ZpZXdzL2J1ZGdldC52aWV3Lmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogJ2J1ZGdldEN0cmwnLFxuXHRcdFx0Y29udHJvbGxlckFzOiAnYnVkZ2V0Jyxcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0cGVybWlzc2lvbjogdHJ1ZSxcblx0XHRcdFx0cGVybWlzc2lvbkxldmVsOiBbJ2FkbWluJ11cblx0XHRcdH1cblx0XHR9KVxuXG5cdFx0Ly8kaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKCdhdXRoSW50ZXJjZXB0b3InKTtcblxuXG5cblx0fV0pO1xuXG4iLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXV0aCcsIFtcbiAgICAgIFxuICAgIF0pOyIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdidWRnZXQnLCBbXG4gICAgICAnY2hhcnQuanMnXG4gICAgXSk7IiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ21lbWJlcnMnLCBbXG4gICAgICBcbiAgICBdKTsiLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgnbm90ZXMnLCBbXG4gICAgICBcbiAgICBdKTsiLCIoZnVuY3Rpb24oKXtcblx0J3VzZSBzdHJpY3QnXG5cbmFuZ3VsYXJcblx0Lm1vZHVsZSgnbm90aWZ5JywgW1xuXHQgIFxuXHRdKTtcblxufSkoKTtcblxuXG4iLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgncmVnaXN0ZXInLCBbXG4gICAgXHQnYXV0aCdcbiAgICBdKTsiLCIoZnVuY3Rpb24oKXtcblx0J3VzZSBzdHJpY3QnXG5cbmFuZ3VsYXJcblx0Lm1vZHVsZSgnc2FtcGxlJywgW1xuXHQgIFxuXHRdKTtcblxufSkoKTtcblxuIiwiKGZ1bmN0aW9uKCl7XG4gICAgJ3VzZSBzdHJpY3QnXG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2F1dGgnKVxuICAgICAgICAuZmFjdG9yeSgnYXV0aEludGVyY2VwdG9yJywgYXV0aEludGVyY2VwdG9yKTtcblxuICAgIGF1dGhJbnRlcmNlcHRvci4kaW5qZWN0ID0gWydhdXRoU2VydmljZSddXG5cbiAgICBmdW5jdGlvbiBhdXRoSW50ZXJjZXB0b3IoYXV0aFNlcnZpY2UpIHtcblxuXG5cbiAgICAgICAgdmFyIHNlcnZpY2UgPSB7XG5cbiAgICAgICAgICAgIHJlcXVlc3Q6IHJlcXVlc3QsXG4gICAgICAgICAgICByZXNwb25zZTogcmVzcG9uc2VcblxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBzZXJ2aWNlO1xuXG4gICAgICAgIC8vLy8vLy8vLy8vL1xuXG4gICAgICAgIGZ1bmN0aW9uIHJlcXVlc3QoY29uZmlnKSB7XG5cbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJhdXRoSW50ZXJjZXB0b3IgcmVxdWVzdCBmdW5jdGlvblwiKVxuXG4gICAgICAgICAgICB2YXIgdG9rZW4gPSBhdXRoU2VydmljZS5nZXRUb2tlbigpO1xuXG4gICAgICAgICAgICBpZih0b2tlbil7XG4gICAgICAgICAgICAgICAgY29uZmlnLmhlYWRlcnMudG9rZW4gPSB0b2tlbjtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInRva2VuIHByZXNlbnRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibm8gdG9rZW5cIik7XG4gICAgICAgICAgICB9ICAgIFxuICAgICAgICAgICAgcmV0dXJuIGNvbmZpZztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHJlc3BvbnNlKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiYXV0aEludGVyY2VwdG9yIHJlc3BvbnNlIGZ1bmN0aW9uXCIpXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgIH1cblxuICAgIH0gLy9lbmQgYXV0aEludGVyY2VwdG9yXG5cbiAgICBcblxufSkoKTtcbiIsIihmdW5jdGlvbigpe1xuXHQvLyd1c2Ugc3RyaWN0J1xuXG5cdGFuZ3VsYXJcbiAgICBcdC5tb2R1bGUoJ2F1dGgnLFtdKVxuICAgIFx0LmZhY3RvcnkoJ2F1dGhTZXJ2aWNlJywgYXV0aFNlcnZpY2UpO1xuXG4gICAgYXV0aFNlcnZpY2UuJGluamVjdCA9IFsnJHdpbmRvdycsJyRodHRwJywndG9hc3RyJywnJHN0YXRlJywnJHJvb3RTY29wZScsJyRsb2NhdGlvbicsJyRxJ107XG5cbiAgICBmdW5jdGlvbiBhdXRoU2VydmljZSgkd2luZG93LCRodHRwLHRvYXN0ciwkc3RhdGUsJHJvb3RTY29wZSwkbG9jYXRpb24sJHEpIHtcblxuICAgIFxuXG4gICAgXHR2YXIgc2VydmljZSA9IHtcblxuICAgICAgICAgICAgaW5mbzogaW5mbyxcblxuICAgICAgICAgICAgbG9naW46IGxvZ2luLFxuICAgICAgICAgICAgbG9nb3V0OiBsb2dvdXQsXG5cbiAgICBcdFx0c2V0VG9rZW46IHNldFRva2VuLFxuICAgICAgICAgICAgZ2V0VG9rZW46IGdldFRva2VuLFxuICAgIFx0XHRjbGVhclRva2VuOiBjbGVhclRva2VuLFxuXG4gICAgICAgICAgICBpc0F1dGhlbnRpY2F0ZWQ6IGlzQXV0aGVudGljYXRlZCwgLy8gdmVyaWZpZXMgdG9rZW5cbiAgICAgICAgICAgIGlzQXV0aG9yaXplZDogaXNBdXRob3JpemVkIC8vIHZlcmlmaWVzIHJvdXRlIHBlcm1pc3Npb25zXG5cbiAgICBcdH07XG5cbiAgICBcdHJldHVybiBzZXJ2aWNlO1xuXG4gICAgXHQvLy8vLy8vLy8vLy9cblxuICAgICAgICBmdW5jdGlvbiBpbmZvICgpIHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJhdXRoIHNlcnZpY2VcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyByZWRpcmVjdCB0YWtlcyByb3V0ZSBzdHJpbmcgaWUuICdhcHAuaG9tZSdcbiAgICAgICAgZnVuY3Rpb24gbG9naW4gKHVzZXJMb2dpbkRhdGEsIHJlZGlyZWN0KSB7XG4gICAgICAgICAgICAkaHR0cC5wb3N0KCdodHRwOi8vbG9jYWxob3N0OjMwMDAvYXBpL3VzZXJzL2xvZ2luJywgdXNlckxvZ2luRGF0YSlcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXMpe1xuICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgICAgICAgICAgICAgIGlmKHJlcy5zdGF0dXMgPT0gMjAwKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRva2VuKHJlcy5kYXRhLnRva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGVtaXQoXCJsb2dnZWRJblwiKTsgIFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9hc3RyLnN1Y2Nlc3MocmVzLmRhdGEubWVzc2FnZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHR5cGVvZihyZWRpcmVjdCkgIT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28ocmVkaXJlY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmdW5jdGlvbihlcnIpe1xuICAgICAgICAgICAgICAgICAgICB0b2FzdHIuZXJyb3IoZXJyLmRhdGEubWVzc2FnZSlcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKVxuICAgICAgICAgICAgICAgIH0pXG5cblxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gbG9nb3V0ICgpIHtcbiAgICAgICAgICAgIGNsZWFyVG9rZW4oKTtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGVtaXQoXCJsb2dnZWRPdXRcIik7XG4gICAgICAgICAgICAkc3RhdGUuZ28oXCJhcHAuaG9tZVwiKTtcbiAgICAgICAgICAgIHRvYXN0ci5zdWNjZXNzKFwiWW91IGhhdmUgYmVlbiBsb2dnZWQgb3V0XCIpO1xuICAgICAgICB9XG5cblxuXG4gICAgXHRmdW5jdGlvbiBzZXRUb2tlbiAodG9rZW4pIHtcbiAgICAgICAgICAgICR3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3VzZXJUb2tlbicsdG9rZW4pO1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBnZXRUb2tlbiAoKSB7XG4gICAgICAgICAgICB2YXIgdG9rZW4gPSAkd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKCd1c2VyVG9rZW4nKTtcbiAgICAgICAgICAgIHJldHVybiB0b2tlbjtcblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gY2xlYXJUb2tlbiAoKSB7XG4gICAgICAgICAgICAkd2luZG93LmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCd1c2VyVG9rZW4nKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdyYWJiaXRzJylcblx0ICAgIH1cblxuICAgICAgICAvL2Jhc2ljYWxseSBhcmUgdGhleSBsb2dnZWQgaW5cbiAgICAgICAgZnVuY3Rpb24gaXNBdXRoZW50aWNhdGVkICgpIHtcblxuICAgICAgICAgICAgdmFyIHRva2VuID0gZ2V0VG9rZW4oKTtcbiAgICAgICAgICAgIGlmKHRva2VuKXtcbiAgICAgICAgICAgICAgICAkaHR0cC5wb3N0KCdodHRwOi8vbG9jYWxob3N0OjMwMDAvYXBpL3VzZXJzL2F1dGhvcml6ZScse3Rva2VuOnRva2VufSlcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhyZXMpXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnYXV0aG9yaXppbmcuLicpXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiggcmVzLmRhdGEuc3VjY2VzcyA9PSB0cnVlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2FzdHIuc3VjY2VzcyhcIkF1dGhlbnRpY2F0aW9uIFN1Y2Nlc3MhXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJBdXRoZW50aWNhdGlvbiBTdWNjZXNzIVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGVtaXQoXCJsb2dnZWRJblwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3RvYXN0ci5lcnJvcihcIkF1dGhlbnRpY2F0aW9uIEZhaWxlZFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQXV0aGVudGljYXRpb24gRmFpbGVkXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LGZ1bmN0aW9uKGVycil7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b2FzdHIuZXJyb3IoZXJyLmRhdGEpXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAvL3RvYXN0ci5lcnJvcihcImF1dGhlbnRpY2F0aW9uIGZhaWxlZCwgbm8gdG9rZW4gcHJlc2VudFwiKVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYXV0aGVudGljYXRpb24gZmFpbGVkLCBubyB0b2tlbiBwcmVzZW50XCIpXG4gICAgICAgICAgICB9IFxuICAgICAgICAgICBcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGlzQXV0aG9yaXplZCAoZXZlbnQsIGZyb21TdGF0ZSwgdG9TdGF0ZSkge1xuICAgICAgICAgICAgICAgIC8vcmV0dXJuICRxLnJlamVjdCgpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicnVubmluZyBpcyBhdXRob3JpemVkXCIpXG5cbiAgICAgICAgICAgICAgICAvL2V2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgdmFyIHRva2VuID0gZ2V0VG9rZW4oKTtcbiAgICAgICAgICAgICAgICB2YXIgdXNlcmxldmVsID0gbnVsbDtcbiAgICAgICAgICAgICAgICB2YXIgcHJvY2VlZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgaWYodG9rZW4pe1xuICAgICAgICAgICAgICAgICAgLy8gIHJldHVybiAkcS5yZWplY3Q7XG4gICAgICAgICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGkvdXNlcnMvYXV0aG9yaXplJyx7dG9rZW46dG9rZW59KVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdhdXRob3JpemluZy4uJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiggcmVzLmRhdGEuc3VjY2VzcyA9PSB0cnVlICYmIHJlcy5kYXRhLnByb2ZpbGUudXNlckxldmVsKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcy5kYXRhLnByb2ZpbGUudXNlckxldmVsKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyTGV2ZWwgPSByZXMuZGF0YS5wcm9maWxlLnVzZXJMZXZlbDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vbG9vcCB0aHJvdWdoIHBlcm1pc3Npb24gbGlzdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGk9MDsgaSA8IHRvU3RhdGUuZGF0YS5wZXJtaXNzaW9uTGV2ZWwubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vaWYgY3VycmVudCB1c2VybGV2ZWwgbWF0Y2hlcyBwZXJtaXNzaW9uIGxldmVsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy90aGVuIHNldCBwcm9jZWVkIHRvIHRydWUgYW5kIGJyZWFrIHRoZSBmb3IgbG9vcCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImN1cnJlbnQgbG9vcCBpIDogXCIgKyB0b1N0YXRlLmRhdGEucGVybWlzc2lvbkxldmVsW2ldKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHVzZXJMZXZlbCA9PSB0b1N0YXRlLmRhdGEucGVybWlzc2lvbkxldmVsW2ldKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicGVybWlzc2lvbiBtYXRjaFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzZXR0aW5nIHByb2NlZWQgdHJ1ZVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2VlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vcmV0dXJuIHRvYXN0ci5zdWNjZXNzKFwicHJvY2VlZFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImtlZXAgbG9va2luZ1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzZXR0aW5nIHByb2NlZWQgZmFsc2VcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2NlZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfS8vZW5kIGZvciBsb29wICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IC8vIGVuZCBpZiBwcm9maWxlIHJldHVybmVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZWxzZSBubyBwcm9maWxlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9hc3RyLmVycm9yKFwiYmFkIHJlcXVlc3RcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2VlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibGFzdCBjaGVja1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHByb2NlZWQgPT0gZmFsc2Upe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIklUUyBGQUxTRVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmhvbWUnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pIC8vZW5kIHRoZW5cbiAgICAgICAgICAgICAgICB9Ly9lbmQgaWYgdG9rZW5cblxuICAgICAgICAgICAgICAgIC8vZWxzZSBubyB0b2tlbiBcbiAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICB0b2FzdHIuZXJyb3IoXCJubyB0b2tlbiBwcmVzZW50XCIpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgXG5cbiAgICAgICAgfS8vZW5kIGlzQXV0aG9yaXplZFxuICAgICAgICBcblxuICAgIH0vL2VuZCBhdXRoU2VydmljZVxuXG4gICAgXG5cblxuXG5cdFxuXG59KSgpOyAvL2VuZCBpZmZlXG5cblxuIiwiKGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCdcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnYnVkZ2V0Jylcblx0XHQuY29udHJvbGxlcignYnVkZ2V0Q3RybCcsIGJ1ZGdldEN0cmwpXG5cblx0YnVkZ2V0Q3RybC4kaW5qZWN0ID0gWyckc2NvcGUnLCckaHR0cCcsJ3RvYXN0ciddXG5cblx0ZnVuY3Rpb24gYnVkZ2V0Q3RybCgkc2NvcGUsICRodHRwLCB0b2FzdHIpIHtcblx0XHRjb25zb2xlLmxvZygnbG9hZGVkIGJ1ZGdldEN0cmwnKTtcblx0XG5cdFx0Ly8gJHNjb3BlLk1hdGggPSB3aW5kb3cuTWF0aDtcblxuXHRcdCAgICBcblxuXG4gIFx0XHRcdC8vIGluY29tZVxuICBcdFx0XHQkc2NvcGUuaW5jb21lID0ge31cbiAgXHRcdFx0JHNjb3BlLmluY29tZS5tb250aGx5ID0gNDUwMDtcblxuICBcdFx0XHQvLyBiaWxsc1xuICBcdFx0XHQkc2NvcGUuYmlsbHMgPVtdXG4gIFx0XHRcdCRzY29wZS5iaWxscyA9IFtcbiAgXHRcdFx0XHR7bmFtZTpcInJlbnRcIiwgY29zdDogMjUwMH0sXG4gIFx0XHRcdFx0e25hbWU6XCJ1dGlsaXRpZXNcIiwgY29zdDogMjAwfSxcbiAgXHRcdFx0XHR7bmFtZTpcImNhciBpbnN1cmFuY2VcIiwgY29zdDogMTUwfSxcbiAgXHRcdFx0XHR7bmFtZTpcImNhciBwYXltZW50XCIsIGNvc3Q6IDI1MH0sXG4gIFx0XHRcdFx0e25hbWU6XCJnYXNcIiwgY29zdDogMTAwfSxcbiAgXHRcdFx0XHR7bmFtZTpcImd5bSBtZW1iZXJzaGlwXCIsIGNvc3Q6IDUwfSxcbiAgXHRcdFx0XHR7bmFtZTpcImNlbGwgcGhvbmVcIiwgY29zdDogODB9LFxuXG4gIFx0XHRcdF1cblxuICAgICAgICBcblxuICBcdFx0XHQkc2NvcGUuYWRkTmV3QmlsbCA9IGZ1bmN0aW9uKCl7XG4gIFx0XHRcdFx0JHNjb3BlLmJpbGxzLnB1c2goe25hbWU6ICRzY29wZS5uZXdCaWxsTmFtZSwgY29zdDogMCB9KVxuICBcdFx0XHRcdCRzY29wZS5uZXdCaWxsTmFtZSA9IFwiXCI7XG4gIFx0XHRcdH1cblxuICBcdFx0XHQkc2NvcGUucmVtb3ZlQmlsbEl0ZW0gPSBmdW5jdGlvbihpbmRleCl7XG4gIFx0XHRcdFx0JHNjb3BlLmJpbGxzLnNwbGljZShpbmRleCwxKTtcbiAgXHRcdFx0fVxuXG4gIFx0XHRcdC8vYnVkZ2V0IGl0ZW1zXG4gIFx0XHRcdCRzY29wZS5idWRnZXRJdGVtcyA9IFtdO1xuICBcdFx0XHQkc2NvcGUuYnVkZ2V0SXRlbXMgPSBbXG4gIFx0XHRcdFx0e25hbWU6IFwiZWF0IG91dFwiLCBidWRnZXQ6IDEwMCwgc3BlbnQ6IDMwIH0sXG4gIFx0XHRcdFx0e25hbWU6IFwiY2xvdGhpbmdcIiwgYnVkZ2V0OiAyMDAsIHNwZW50OiA5MH1cbiAgXHRcdFx0XVxuXG4gIFx0XHRcdCRzY29wZS5hZGROZXdCdWRnZXRJdGVtID0gZnVuY3Rpb24oKXtcbiAgXHRcdFx0XHQkc2NvcGUuYnVkZ2V0SXRlbXMucHVzaCh7bmFtZTogJHNjb3BlLm5ld0J1ZGdldEl0ZW1OYW1lLCBidWRnZXQ6IDAsIHNwZW50OiAwIH0pXG4gIFx0XHRcdFx0JHNjb3BlLm5ld0J1ZGdldEl0ZW1OYW1lID0gXCJcIjtcbiAgXHRcdFx0fVxuXG4gICAgICAgICRzY29wZS5wdXJjaGFzZXMgPSBbXVxuICAgICAgICAkc2NvcGUucHVyY2hhc2VzID0gW3tjYXRlZ29yeTogXCJlYXQgb3V0XCJ9XVxuXG4gICAgICAgICRzY29wZS5hZGRQdXJjaGFzZUl0ZW0gPSBmdW5jdGlvbigpe1xuXG4gICAgICAgIH1cblxuXG4gICAgICAgICRzY29wZS5tb250aGx5T3ZlcnZpZXcgPSB7fTtcbiAgICAgICAgJHNjb3BlLm1vbnRobHlPdmVydmlldy5iaWxsc1RvdGFsID0gMDtcbiAgICAgICAgJHNjb3BlLm1vbnRobHlPdmVydmlldy5idWRnZXRUb3RhbCA9IDA7XG4gICAgICAgICRzY29wZS5tb250aGx5T3ZlcnZpZXcuYnVkZ2V0U3BlbnRUb3RhbCA9IDA7XG4gICAgICAgICRzY29wZS5tb250aGx5T3ZlcnZpZXcudG90YWxFc3RpbWF0ZWRFeHBlbmRpdHVyZSA9IDA7XG5cbiAgICAgICAgXG4gICAgICAgICRzY29wZS5jYWxjdWxhdGVCaWxsc1RvdGFsID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIHRvdGFsID0gMDtcbiAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgJHNjb3BlLmJpbGxzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIHRvdGFsID0gdG90YWwgKyAkc2NvcGUuYmlsbHNbaV0uY29zdDtcbiAgICAgICAgICB9XG4gICAgICAgICAgJHNjb3BlLm1vbnRobHlPdmVydmlldy5iaWxsc1RvdGFsID0gdG90YWw7XG4gICAgICAgICAgJHNjb3BlLmNhbGN1bGF0ZVRvdGFsRXhwZW5kaXR1cmUoKVxuICAgICAgICAgIHJldHVybiB0b3RhbDtcbiAgICAgICAgfVxuXG4gICAgICAgIFxuXG4gICAgICAgICRzY29wZS5jYWxjdWxhdGVCdWRnZXRUb3RhbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciB0b3RhbCA9IDA7XG4gICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8ICRzY29wZS5idWRnZXRJdGVtcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICB0b3RhbCA9IHRvdGFsICsgJHNjb3BlLmJ1ZGdldEl0ZW1zW2ldLmJ1ZGdldDtcbiAgICAgICAgICB9XG4gICAgICAgICAgJHNjb3BlLm1vbnRobHlPdmVydmlldy5idWRnZXRUb3RhbCA9IHRvdGFsO1xuICAgICAgICAgICRzY29wZS5jYWxjdWxhdGVUb3RhbEV4cGVuZGl0dXJlKClcbiAgICAgICAgICByZXR1cm4gdG90YWw7ICAgICAgIFxuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLmNhbGN1bGF0ZUJ1ZGdldFNwZW50VG90YWwgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgdG90YWwgPSAwO1xuICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCAkc2NvcGUuYnVkZ2V0SXRlbXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgdG90YWwgPSB0b3RhbCArICRzY29wZS5idWRnZXRJdGVtc1tpXS5zcGVudDtcbiAgICAgICAgICB9XG4gICAgICAgICAgJHNjb3BlLm1vbnRobHlPdmVydmlldy5idWRnZXRTcGVudFRvdGFsID0gdG90YWw7XG4gICAgICAgICAgLy8kc2NvcGUuY2FsY3VsYXRlVG90YWxFeHBlbmRpdHVyZSgpXG4gICAgICAgICAgcmV0dXJuIHRvdGFsOyAgICAgICBcbiAgICAgICAgfVxuXG4gICAgICAgIFxuXG5cblxuICAgICAgICRzY29wZS4kd2F0Y2goXCJiaWxsc1wiLCAkc2NvcGUuY2FsY3VsYXRlQmlsbHNUb3RhbCwgdHJ1ZSlcbiAgICAgICAkc2NvcGUuJHdhdGNoKFwiYnVkZ2V0SXRlbXNcIiwgJHNjb3BlLmNhbGN1bGF0ZUJ1ZGdldFRvdGFsLCB0cnVlKVxuICAgICAgICRzY29wZS4kd2F0Y2goXCJidWRnZXRJdGVtc1wiLCAkc2NvcGUuY2FsY3VsYXRlQnVkZ2V0U3BlbnRUb3RhbCwgdHJ1ZSlcblxuICAgICAvLyAkc2NvcGUuJHdhdGNoKFwiYnVkZ2V0SXRlbXNcIiwgJHNjb3BlLmNhbGN1bGF0ZUJ1ZGdldFRvdGFsLCB0cnVlKVxuXG5cbiAgICAgICAgJHNjb3BlLmNhbGN1bGF0ZVRvdGFsRXhwZW5kaXR1cmUgPSBmdW5jdGlvbiAgKCkge1xuICAgICAgICAgICAgICRzY29wZS5tb250aGx5T3ZlcnZpZXcudG90YWxFc3RpbWF0ZWRFeHBlbmRpdHVyZSA9ICRzY29wZS5tb250aGx5T3ZlcnZpZXcuYmlsbHNUb3RhbCArICRzY29wZS5tb250aGx5T3ZlcnZpZXcuYnVkZ2V0VG90YWw7XG4gICAgICAgIH1cblxuICAgICAgICAkc2NvcGUuY2FsY3VsYXRlQmlsbHNUb3RhbCgpO1xuICAgICAgICAkc2NvcGUuY2FsY3VsYXRlQnVkZ2V0VG90YWwoKTtcbiAgICAgICAgJHNjb3BlLmNhbGN1bGF0ZUJ1ZGdldFNwZW50VG90YWwoKTtcbiAgICAgICAgJHNjb3BlLmNhbGN1bGF0ZVRvdGFsRXhwZW5kaXR1cmUoKTtcblxuICAgICAgICAkc2NvcGUubGFiZWxzID0gW1wiQmlsbHNcIiwgXCJCdWRnZXRcIiwgXCJSZW1haW5pbmdcIl07XG4gICAgICAgICRzY29wZS5kYXRhID0gWyRzY29wZS5tb250aGx5T3ZlcnZpZXcuYmlsbHNUb3RhbCxcbiAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm1vbnRobHlPdmVydmlldy5idWRnZXRUb3RhbCxcbiAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmluY29tZS5tb250aGx5IC0gJHNjb3BlLm1vbnRobHlPdmVydmlldy50b3RhbEVzdGltYXRlZEV4cGVuZGl0dXJlXTtcblxuXG5cblxuXG5cdH1cblxufSkoKTtcblxuXG4iLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgnbm90ZXMnKVxuICAgIC5kaXJlY3RpdmUoJ25vdGVDYXJkJywgbm90ZUNhcmQpO1xuXG5mdW5jdGlvbiBub3RlQ2FyZCgpIHtcblx0cmV0dXJue1xuXHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0c2NvcGU6IHtcblx0XHRcdGRhdGE6IFwiPVwiLFxuXHRcdFx0ZHJhZ2dhYmxlOiBcIj1cIlxuXHRcdH0sXG5cdFx0cmVwbGFjZTogdHJ1ZSxcblx0XHR0ZW1wbGF0ZTogXCI8aDE+e3tkb2dzfX17e2RyYWdTdGF0dXN9fTwvaDE+XCIsXG5cdFx0bGluazogZnVuY3Rpb24oc2NvcGUsZWxlbWVudCl7XG5cdFx0XHRlbGVtZW50LmNsaWNrKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKGVsZW1lbnQpXG5cdFx0XHRcdGVsZW1lbnRbMF0uZHJhZ2dhYmxlID0gdHJ1ZTtcblx0XHRcdH0pXG5cdFx0fSxcblx0XHRjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpe1xuXHRcdFx0Ly9hbGVydChcImNvbnRyb2xsZXJcIik7XG5cdFx0XHQkc2NvcGUuZG9ncyA9ICRzY29wZS5kYXRhICsgXCJkb2dzXCI7XG5cdFx0XHRpZigkc2NvcGUuZHJhZ2dhYmxlKVxuXHRcdFx0XHQkc2NvcGUuZHJhZ1N0YXR1cyA9IGZhbHNlO1xuXHRcdFx0ZWxzZSAkc2NvcGUuZHJhZ1N0YXR1cyA9IHRydWU7XG5cblx0XHRcdFxuXHRcdH1cblx0fVxufVxuXG5cblxuLy8gYW5ndWxhclxuLy8gICAgIC5tb2R1bGUoJ25vdGVzJylcbi8vICAgICAuZGlyZWN0aXZlKCdub3RlQ2FyZCcsIG5vdGVDYXJkKTtcblxuLy8gZnVuY3Rpb24gbm90ZUNhcmQoKSB7XG4vLyBcdHJldHVybntcbi8vIFx0XHRyZXN0cmljdDogJ0UnLFxuLy8gXHRcdGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSl7XG4vLyBcdFx0XHRhbGVydChcImNvbnRyb2xsZXJcIik7XG4vLyBcdFx0XHRjb25zb2xlLmxvZygnZG9nJylcbi8vIFx0XHR9LFxuLy8gXHRcdHRlbXBsYXRlVXJsOiAnJyxcbi8vIFx0XHRyZXBsYWNlOiB0cnVlXG4vLyBcdFx0Ly8gc2NvcGU6IHt9XG4vLyBcdH1cbi8vIH0iLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgnbm90ZXMnKVxuICAgIC5kaXJlY3RpdmUoJ25vdGVDYXJkcycsIG5vdGVDYXJkcylcblxuXG4gICAgXG5cbmZ1bmN0aW9uIG5vdGVDYXJkcygpIHtcblx0cmV0dXJue1xuXHRcdHJlc3RyaWN0OiAnQUUnLFxuXHRcdHNjb3BlOiB7XG5cdFx0XHRub3RlczogXCI9XCIsXG5cdFx0XHRuZXdJdGVtOiBcIj1cIlxuXHRcdH0sXG5cdFx0cmVwbGFjZTogZmFsc2UsXG5cdFx0dHJhbnNjbHVkZTogZmFsc2UsXG5cdFx0dGVtcGxhdGVVcmw6IFwiY29tcG9uZW50cy9ub3Rlcy92aWV3cy9ub3RlLmRpcmVjdGl2ZS52aWV3Lmh0bWxcIixcblx0XHRsaW5rOiBmdW5jdGlvbihzY29wZSxlbGVtZW50LGF0dHJzKXtcblx0XHRcdC8vJCggXCIjc29ydGFibGVcIiApLnNvcnRhYmxlKCk7XG5cdFx0XHQvL2NvbnNvbGUubG9nKHNjb3BlKVxuXHRcdFx0Ly9jb25zb2xlLmxvZyhlbGVtZW50KVxuXHRcdFx0Ly9jb25zb2xlLmxvZyhhdHRycylcblx0XHRcdC8vZWxlbWVudC5zb3J0YWJsZSgpO1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhzY29wZS5ub3Rlcylcblx0XHRcdHNjb3BlLmRvZ3MgPSBmdW5jdGlvbihub3RlKXtcblx0XHRcdFx0Y29uc29sZS5sb2cobm90ZSlcblx0XHRcdH1cblxuXG5cdFx0XHRlbGVtZW50LnNvcnRhYmxlKHtcblx0XHQgICAgICAgLy8gcGxhY2Vob2xkZXI6IFwidWktc3RhdGUtaGlnaGxpZ2h0XCIsXG5cdFx0ICAgICAgICBzdGFydDogZnVuY3Rpb24oZXZlbnQsIHVpKSB7XG5cdFx0ICAgICAgICAgICAgdmFyIHN0YXJ0X3BvcyA9IHVpLml0ZW0uaW5kZXgoKTtcblx0XHQgICAgICAgICAgICB1aS5pdGVtLmRhdGEoJ3N0YXJ0X3BvcycsIHN0YXJ0X3Bvcyk7XG5cdFx0ICAgICAgICB9LFxuXHRcdCAgICAgICAgdXBkYXRlOiBmdW5jdGlvbihldmVudCwgdWkpIHtcblx0XHQgICAgICAgICAgICB2YXIgc3RhcnRfcG9zID0gdWkuaXRlbS5kYXRhKCdzdGFydF9wb3MnKTtcblx0XHQgICAgICAgICAgICB2YXIgZW5kX3BvcyA9IHVpLml0ZW0uaW5kZXgoKTtcblx0XHQgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHN0YXJ0X3BvcyArICcgLSAnICsgZW5kX3Bvcyk7XG5cdFx0ICAgICAgICAgIFxuXHRcdCAgICAgICAgICB2YXIgc3RhcnRJdGVtID0gc2NvcGUubm90ZXNbc3RhcnRfcG9zXTtcblx0XHQgICAgICAgICAgIHNjb3BlLm5vdGVzLnNwbGljZShzdGFydF9wb3MsMSlcblx0XHQgICAgICAgICAgIHNjb3BlLm5vdGVzLnNwbGljZShlbmRfcG9zLDAsIHN0YXJ0SXRlbSlcblx0XHQgICAgICAgICAgIHNjb3BlLiRhcHBseSgpO1xuXG5cdFx0ICAgICAgICAgICAvL2NvbnNvbGUubG9nKHNjb3BlLm5vdGVzKVxuXHRcdCAgICAgICAgICAgXG5cdFx0ICAgICAgICAgICBcblx0XHQgICAgICAgIH1cblx0XHQgICAgfSk7IC8vIGVuZCBzb3J0YWJsZVxuXG5cdFx0ICAgXG5cblx0XHQgICAgY29uc29sZS5sb2coZWxlbWVudClcblxuXG5cdFx0fSxcblx0XHRjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpe1xuXHRcdFx0JHNjb3BlLmZvcm0gPXt9XG5cdFx0XHQkc2NvcGUuYWRkSXRlbSA9IGZ1bmN0aW9uKGluZGV4LGl0ZW0pe1xuXHRcdFx0XHQvL2FsZXJ0KGluZGV4KVxuXHRcdFx0XHRjb25zb2xlLmxvZygkc2NvcGUubmV3SXRlbSlcblx0XHRcdFx0JHNjb3BlLm5vdGVzW2luZGV4XS5pdGVtcy5wdXNoKGl0ZW0pXG5cdFx0XHRcdCRzY29wZS5mb3JtID0ge31cblx0XHRcdFx0Ly9jb25zb2xlLmxvZygkc2NvcGUubm90ZXNbaW5kZXhdLml0ZW1zKVxuXHRcdFx0fVxuXG5cdFx0XHQkc2NvcGUuZGVsZXRlTm90ZSA9IGZ1bmN0aW9uKGluZGV4KXtcblx0XHRcdFx0JHNjb3BlLm5vdGVzLnNwbGljZShpbmRleCwxKTtcblx0XHRcdH1cblxuXG5cdFx0XHQvL2FsZXJ0KFwiY29udHJvbGxlclwiKTtcblx0XHRcdC8vICRzY29wZS5kb2dzID0gJHNjb3BlLmRhdGEgKyBcImRvZ3NcIjtcblx0XHRcdC8vIGlmKCRzY29wZS5kcmFnZ2FibGUpXG5cdFx0XHQvLyBcdCRzY29wZS5kcmFnU3RhdHVzID0gZmFsc2U7XG5cdFx0XHQvLyBlbHNlICRzY29wZS5kcmFnU3RhdHVzID0gdHJ1ZTtcblxuXHRcdFx0XG5cdFx0fVxuXHR9XG59IC8vZW5kIG5vdGVjYXJkcyBkaXJlY3RpdmVcblxuYW5ndWxhclxuXHQubW9kdWxlKCdub3RlcycpXG5cdC5kaXJlY3RpdmUoJ25vdGVDYXJkJywgbm90ZUNhcmQpXG5cbmZ1bmN0aW9uIG5vdGVDYXJkKCkge1xuXG5cdHZhciB0ZW1wRGF0YSA9IHt9O1xuXHR2YXIgdGVtcE5vdGUgPSBudWxsO1xuXG5cdHJldHVybntcblx0XHRyZXN0cmljdDogJ0FFJyxcblx0XHRzY29wZToge1xuXHRcdFx0bm90ZTogXCI9XCIsXG5cdFx0XHRub3RlczogXCI9XCJcblx0XHR9LFxuXHRcdHJlcGxhY2U6IHRydWUsXG5cdFx0dHJhbnNjbHVkZTogZmFsc2UsXG5cdFx0dGVtcGxhdGVVcmw6IFwiY29tcG9uZW50cy9ub3Rlcy92aWV3cy9ub3Rlcy5pdGVtcy52aWV3Lmh0bWxcIixcblx0XHRsaW5rOiBmdW5jdGlvbihzY29wZSxlbGVtZW50LGF0dHJzKXtcblx0XHRcdC8vJCggXCIjc29ydGFibGVcIiApLnNvcnRhYmxlKCk7XG5cdFx0XHQvL2NvbnNvbGUubG9nKHNjb3BlKVxuXHRcdFx0Ly9jb25zb2xlLmxvZyhlbGVtZW50KVxuXHRcdFx0Ly9jb25zb2xlLmxvZyhhdHRycylcblx0XHRcdC8vZWxlbWVudC5zb3J0YWJsZSgpO1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhzY29wZS5ub3Rlcylcblx0XHRcdC8vc2NvcGUuJHdhdGNoKCdub3RlcycsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIC8vIGFsbCB0aGUgY29kZSBoZXJlLi4uXG4gICAgXHRcdFxuICAgIFx0XHRcblx0XHRcdFxuXG5cdFx0XHRlbGVtZW50LnNvcnRhYmxlKHtcblx0XHRcdFx0Y29ubmVjdFdpdGg6IFwiLmNvbm5lY3RlZFNvcnRhYmxlXCIsXG5cdFx0ICAgICAgIC8vcGxhY2Vob2xkZXI6IFwidWktc3RhdGUtaGlnaGxpZ2h0XCIsXG5cdFx0ICAgICAgICBzdGFydDogZnVuY3Rpb24oZXZlbnQsIHVpKSB7XG5cdFx0ICAgICAgICBcdGNvbnNvbGUubG9nKFwiU1RBUlQgU1RBUlQgU1RBUlQgU1RBUlQgU1RBUlRcIilcblx0XHQgICAgICAgIFx0Y29uc29sZS5sb2coZWxlbWVudClcblx0XHQgICAgICAgIFx0Y29uc29sZS5sb2codGVtcERhdGEpXG5cdFx0ICAgICAgICBcdFxuXG5cdFx0ICAgICAgICBcdHRlbXBEYXRhLnN0YXJ0Tm90ZSA9IGFuZ3VsYXIuY29weShzY29wZS5ub3RlKTtcblx0XHQgICAgICAgIFx0dGVtcERhdGEuc3RhcnROb3RlSW5kZXggPSBhdHRycy5ub3RlaW5kZXg7XG5cdFx0XHRcdFx0dGVtcERhdGEuc3RhcnROb3RlSXRlbUluZGV4ID0gdWkuaXRlbS5pbmRleCgpO1xuXHRcdFx0XHRcdHRlbXBEYXRhLnN0YXJ0Tm90ZUl0ZW1Db250ZW50ID0gdGVtcERhdGEuc3RhcnROb3RlLml0ZW1zW3RlbXBEYXRhLnN0YXJ0Tm90ZUl0ZW1JbmRleF07XG5cdFx0ICAgXHRcdFx0XG5cdFx0ICAgXHRcdFx0dGVtcE5vdGUgPSBhbmd1bGFyLmNvcHkoc2NvcGUubm90ZSlcblx0XHQgICBcdFx0XHRjb25zb2xlLmxvZyh0ZW1wTm90ZSlcblxuXHRcdCAgICAgICAgfSxcblx0XHQgICAgICAgIHVwZGF0ZTogZnVuY3Rpb24oZXZlbnQsIHVpKSB7XG5cblx0XHQgICAgICAgLy8gY29uc29sZS5sb2coc2NvcGUudGVtcERhdGEpXHRcblx0ICAgICAgICAgXHRpZiAoIXVpLnNlbmRlcikge1x0XHQgICAgICAgXG5cdFx0XHQgICAgICAgICBjb25zb2xlLmxvZyhcIlVQREFURSBVUERBVEUgVVBEQVRFIFVQREFURSBVUERBVEUgSU5TSURFIElGXCIgKVxuXG5cdFx0XHQgICAgICAgIFxuXHRcdFx0XHRcdFx0XHRcdCAgICAgICAgIFxuXG5cdFx0XHRcdFx0dmFyIHN0YXJ0X3BvcyA9IHRlbXBEYXRhLnN0YXJ0Tm90ZUl0ZW1JbmRleDtcblx0XHRcdFx0XHR2YXIgZW5kX3BvcyA9IHVpLml0ZW0uaW5kZXgoKTtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhzdGFydF9wb3MgKyAnIC0gJyArIGVuZF9wb3MpO1xuXG5cdFx0XHRcdFx0dGVtcE5vdGUuaXRlbXMuc3BsaWNlKHN0YXJ0X3BvcywxKVxuXHRcdFx0XHRcdHRlbXBOb3RlLml0ZW1zLnNwbGljZShlbmRfcG9zLDAsIHRlbXBEYXRhLnN0YXJ0Tm90ZUl0ZW1Db250ZW50KVxuXHRcdFx0XHRcdC8vc2NvcGUubm90ZSA9IHRlbXBOb3RlXG5cdFx0XHRcdFx0c2NvcGUubm90ZXNbdGVtcERhdGEuc3RhcnROb3RlSW5kZXhdID0gdGVtcE5vdGU7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coc2NvcGUubm90ZXMpXG5cblx0XHRcdFx0XHR2YXIgcmFzdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMmFkc0Buaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJzMVwiLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImxhdW5zZHJ5XCIsIFwiYXBzcGx5IGpvYnNcIiwgXCJnc3ltXCIgXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIxLzEvMjIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjEvMjIvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvenNlLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICAgICAgfVxuXG5cdFx0XHRcdFx0Ly9zY29wZS5ub3Rlc1swXS5pdGVtcy5wdXNoKFwiUFVDS1NcIilcblxuXHRcdFx0XHRcdHNjb3BlLiRhcHBseSgpO1xuXG5cdFx0ICAgLy8gICAgICAgICAvL2NvbnNvbGUubG9nKHNjb3BlLm5vdGVzKVxuXHRcdFx0ICAgIH0gICBcblx0XHQgICAgICAgICAgIFxuXHRcdCAgICAgICAgfSwgLy9lbmQgdXBkYXRlXG5cdFx0ICAgICAgICByZWNlaXZlOiBmdW5jdGlvbihldmVudCwgdWkpe1xuXHRcdCAgICAgICAgXHRjb25zb2xlLmxvZyhcIlJFQ0VJVkUgUkVDRUlWRSBSRUNFSVZFIFJFQ0VJVkUgUkVDRUlWRVwiKVxuXHRcdCAgICAgICAgXHRjb25zb2xlLmxvZyh0ZW1wRGF0YSlcblxuXHRcdCAgICAgICAgXHR0ZW1wRGF0YS5lbmROb3RlID0gYW5ndWxhci5jb3B5KHNjb3BlLm5vdGUpO1xuXHRcdCAgICAgICAgXHR0ZW1wRGF0YS5lbmROb3RlSW5kZXggPSBhdHRycy5ub3RlaW5kZXg7XG5cdFx0XHRcdFx0dGVtcERhdGEuZW5kTm90ZUl0ZW1JbmRleCA9IHVpLml0ZW0uaW5kZXgoKTtcblxuXHRcdFx0XHRcdFxuXG5cdFx0XHRcdFx0ICAvL2NvbnNvbGUubG9nKFwicmVtb3ZpbmcgaXRlbTogXCIgKyBzY29wZS5ub3Rlc1tub3RlT3JpZ2luSW5kZXhdLml0ZW1zW3N0YXJ0X3Bvc10pO1xuXHRcdCAgICAgICAgICAgdGVtcERhdGEuc3RhcnROb3RlLml0ZW1zLnNwbGljZSh0ZW1wRGF0YS5zdGFydE5vdGVJdGVtSW5kZXgsMSlcblx0XHRcdCAgICAgICB0ZW1wRGF0YS5lbmROb3RlLml0ZW1zLnNwbGljZSh0ZW1wRGF0YS5lbmROb3RlSXRlbUluZGV4LDAsdGVtcERhdGEuc3RhcnROb3RlSXRlbUNvbnRlbnQpXG5cdFx0XHQgICAgICAgY29uc29sZS5sb2codGVtcERhdGEpXG5cblx0XHRcdCAgICAgICBzY29wZS5ub3Rlc1t0ZW1wRGF0YS5zdGFydE5vdGVJbmRleF0gPSB0ZW1wRGF0YS5zdGFydE5vdGU7XG5cdFx0XHQgICAgICAgc2NvcGUubm90ZXNbdGVtcERhdGEuZW5kTm90ZUluZGV4XSA9IHRlbXBEYXRhLmVuZE5vdGU7XG5cdCAgICAgICAgICAgXHRcblx0ICAgICAgICAgICBcdFx0Y29uc29sZS5sb2codGVtcERhdGEuc3RhcnROb3RlLml0ZW1zKVxuXHQgICAgICAgICAgIFx0XHRjb25zb2xlLmxvZyh0ZW1wRGF0YS5lbmROb3RlLml0ZW1zKVxuXG5cdFx0ICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiYWRkaW5nIGFmdGVyIHBvc2l0aW9uOiBcIiArIGVuZF9wb3MpXG5cdFx0ICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiYWRkaW5nIGFmdGVyOiBcIiArIHNjb3BlLm5vdGVzW25vdGVEZXN0aW5hdGlvbkluZGV4XS5pdGVtc1tlbmRfcG9zXSlcblx0XHQgICAgICAgICAgIC8vc2NvcGUubm90ZXNbbm90ZURlc3RpbmF0aW9uSW5kZXhdLml0ZW1zLnNwbGljZShlbmRfcG9zLDAsIHN0YXJ0SXRlbSlcblxuXHRcdCAgICAgICAgXHQvL3Njb3BlLnRlbXBEYXRhID0gXCJwcmF3bnNcIjtcblx0XHQgICAgICAgIFx0XG5cdFx0ICAgICAgICBcdFxuXHRcdCAgICAgICAgXHQvLyBjb25zb2xlLmxvZyh0ZW1wRGF0YSlcblx0XHQgICAgICAgIFx0Ly8gLy9jb25zb2xlLmxvZyhzY29wZS5ub3RlKTtcblx0XHQgICAgICAgIFx0dmFyIHJhc3QgPSB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJhZHNAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiczFcIixcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJsYXVuc2RyeVwiLCBcImFwc3BseSBqb2JzXCIsIFwiZ3N5bVwiIF0sXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMS8xLzIyMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIxLzIyLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3pzZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgICAgIH1cblx0XHQgICAgICAgIFx0XG5cdFx0ICAgICAgICAgICBzY29wZS4kYXBwbHkoKTtcblx0XHRcblxuXHRcdCAgICAgICAgfVxuXG5cdFx0ICAgIH0pOyAvLyBlbmQgc29ydGFibGVcblxuXHRcdCAvLyAgfSk7IC8vZW5kIHdhdGNoXG5cblxuXG5cdFx0fSxcblx0XHRjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpe1xuXG5cdFx0XHQkc2NvcGUubW9vc2UgPSBcImRpbmdcIlxuXHRcdFx0JHNjb3BlLmRlbGV0ZUl0ZW0gPSBmdW5jdGlvbihwYXJlbnRJbmRleCwgaW5kZXgpe1xuXHRcdFx0XHRjb25zb2xlLmxvZyhwYXJlbnRJbmRleClcblx0XHRcdFx0Y29uc29sZS5sb2coaW5kZXgpXG5cdFx0XHRcdCRzY29wZS5ub3Rlc1twYXJlbnRJbmRleF0uaXRlbXMuc3BsaWNlKGluZGV4LDEpXG5cblx0XHRcdH1cblxuXHRcdFx0JHNjb3BlLnJhbmRvbUlkID0gZnVuY3Rpb24oaXRlbSl7XG4gICBcdFx0XHQgcmV0dXJuIFwiSURcIiArIGl0ZW0gKyAoTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIDk5OSkgKyAxKSk7XG5cdFx0XHR9XG5cdFx0XHQvL2FsZXJ0KFwiY29udHJvbGxlclwiKTtcblx0XHRcdC8vICRzY29wZS5kb2dzID0gJHNjb3BlLmRhdGEgKyBcImRvZ3NcIjtcblx0XHRcdC8vIGlmKCRzY29wZS5kcmFnZ2FibGUpXG5cdFx0XHQvLyBcdCRzY29wZS5kcmFnU3RhdHVzID0gZmFsc2U7XG5cdFx0XHQvLyBlbHNlICRzY29wZS5kcmFnU3RhdHVzID0gdHJ1ZTtcblxuXHRcdFx0Y29uc29sZS5sb2coJHNjb3BlKVxuXG5cdFx0XHRcblx0XHR9XG5cdH1cbn0gLy9lbmQgbm90ZWNhcmQgZGlyZWN0aXZlXG5cblxuXG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cdCd1c2Ugc3RyaWN0J1xuXG5cdGFuZ3VsYXJcbiAgICBcdC5tb2R1bGUoJ2J1ZGdldCcpXG4gICAgXHQuZmFjdG9yeSgnYnVkZ2V0U2VydmljZScsIGJ1ZGdldFNlcnZpY2UpO1xuXG4gICAgYnVkZ2V0U2VydmljZS4kaW5qZWN0ID0gWyckaHR0cCddXG5cbiAgICBmdW5jdGlvbiBidWRnZXRTZXJ2aWNlKCRodHRwKSB7XG4gICAgXHR2YXIgc2VydmljZSA9IHtcblxuICAgICAgICAgICAgZ2V0Tm90ZTogZ2V0Tm90ZSxcbiAgICAgICAgICAgIGdldE5vdGVzOiBnZXROb3RlcyxcbiAgICAgICAgICAgIHNhdmVOb3Rlczogc2F2ZU5vdGVzXG5cblxuICAgIFx0fTtcblxuICAgIFx0cmV0dXJuIHNlcnZpY2U7XG5cbiAgICBcdC8vLy8vLy8vLy8vL1xuXG4gICAgICAgIC8vIGdldHMgYSBzaW5nbGUgbm90ZVxuICAgICAgICBmdW5jdGlvbiBnZXROb3RlICgpIHtcblxuICAgICAgICAgICAgdmFyIG5vdGUgPSB7XG4gICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMkBuaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgIHRpdGxlOiBcInRvZG9cIixcbiAgICAgICAgICAgICAgICBpdGVtczogWyBcImxhdW5kcnlcIiwgXCJhcHBseSBqb2JzXCIsIFwiZ3ltXCIgXSxcbiAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjEvMS8yMDE2XCIsXG4gICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjEvMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3plLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBub3RlO1xuXG4gICAgICAgIH0gLy9lbmQgZ2V0Tm90ZSgpXG5cblxuICAgICAgICAvLyBnZXRzIGFsbCBub3Rlc1xuICAgICAgICBmdW5jdGlvbiBnZXROb3RlcyAoKSB7XG5cbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGkvbm90ZXMvZ2V0Tm90ZXMnLHtlbWFpbDpcIm1vaXpAZ21haWwuY29tXCJ9KVxuICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBub3RlcyA9IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiMVwiLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImxhdW5kcnlcIiwgXCJhcHBseSBqb2JzXCIsIFwiZ3ltXCIgXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIxLzEvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMS8yLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3plLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiMlwiLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImh0bWw1IGRyYWcgYW5kIGRyb3BcIiwgXCJzb2NrZXQuaW9cIiwgXCJub2RlanNcIiBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjIvMS8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIyLzIvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvemUuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMkBuaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCIzXCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwiYm9zZSBoZWFkcGhvbmVzXCIsIFwiMjAxNiBob25kYSBncmlsbFwiLCBcInNvbGlkIHN0YXRlIGhhcmQgZHJpdmVcIiBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjEvMS8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIxLzIvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvemUuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMkBuaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCI0XCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwibGF1bmRyeVwiLCBcImFwcGx5IGpvYnNcIiwgXCJneW1cIiBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjEvMS8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIxLzIvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvemUuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMkBuaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCI1XCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwiaHRtbDUgZHJhZyBhbmQgZHJvcFwiLCBcInNvY2tldC5pb1wiLCBcIm5vZGVqc1wiIF0sXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMi8xLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjIvMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96ZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyQG5qaXQuZWR1XCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIjZcIixcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJib3NlIGhlYWRwaG9uZXNcIiwgXCIyMDE2IGhvbmRhIGdyaWxsXCIsIFwic29saWQgc3RhdGUgaGFyZCBkcml2ZVwiIF0sXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMS8xLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjEvMi8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIHNoYXJlZFdpdGg6IFwiYS5mcm96ZS5ha0BnbWFpbC5jb21cIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogXCJhdWsyQG5qaXQuZWR1XCIsXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIjdcIixcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJsYXVuZHJ5XCIsIFwiYXBwbHkgam9ic1wiLCBcImd5bVwiLFwiYm9zZSBoZWFkcGhvbmVzXCIsIFwiMjAxNiBob25kYSBncmlsbFwiLCBcInNvbGlkIHN0YXRlIGhhcmQgZHJpdmVcIiAgXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIxLzEvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMS8yLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3plLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJAbmppdC5lZHVcIixcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiOFwiLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImh0bWw1IGRyYWcgYW5kIGRyb3BcIiwgXCJzb2NrZXQuaW9cIiwgXCJub2RlanNcIiBdLFxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEYXRlOiBcIjIvMS8yMDE2XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIyLzIvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvemUuYWtAZ21haWwuY29tXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMkBuaml0LmVkdVwiLFxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCI5XCIsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbIFwiYm9zZSBoZWFkcGhvbmVzXCIsIFwiMjAxNiBob25kYSBncmlsbFwiLCBcInNvbGlkIHN0YXRlIGhhcmQgZHJpdmVcIixcImh0bWw1IGRyYWcgYW5kIGRyb3BcIiwgXCJzb2NrZXQuaW9cIiwgXCJub2RlanNcIiAgXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIxLzEvMjAxNlwiLFxuICAgICAgICAgICAgICAgICAgICBsYXN0TW9kaWZpZWQ6IFwiMS8yLzIwMTZcIixcbiAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3plLmFrQGdtYWlsLmNvbVwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXSAvL2VuZCBub3RlcyBhcnJheVxuXG4gICAgICAgICAgICAvL3JldHVybiBub3Rlc1xuICAgICAgICB9IC8vZW5kIGdldCBub3Rlc1xuXG4gICAgICAgIGZ1bmN0aW9uIHNhdmVOb3Rlcyhub3Rlcykge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGkvbm90ZXMvdXBkYXRlTm90ZXMnLHtlbWFpbDpcIm1vaXpAZ21haWwuY29tXCIsbm90ZXM6IG5vdGVzfSlcbiAgICAgICAgfVxuXG5cblxuICAgIH1cblxuXHRcblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0J3VzZSBzdHJpY3QnXG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ21lbWJlcnMnKVxuXHRcdC5jb250cm9sbGVyKCdtZW1iZXJzQ3RybCcsIG1lbWJlcnNDdHJsKVxuXG5cdG1lbWJlcnNDdHJsLiRpbmplY3QgPSBbJyRodHRwJ11cblxuXHRmdW5jdGlvbiBtZW1iZXJzQ3RybCgkaHR0cCkge1xuXG5cdCAgICB2YXIgdm0gPSB0aGlzO1xuXG5cdCAgICB2bS5tZW1iZXJzQ29udGVudCA9IG1lbWJlcnNDb250ZW50KCk7XG5cdCAgICB2bS5nb3RvU2Vzc2lvbiA9IGdvdG9TZXNzaW9uO1xuXHQgICAgdm0ucmVmcmVzaCA9IHJlZnJlc2g7XG5cdCAgICB2bS5zZWFyY2ggPSBzZWFyY2g7XG5cdCAgICB2bS5zZXNzaW9ucyA9IFtdO1xuXHQgICAgdm0udGl0bGUgPSAnbWVtYmVycyc7XG5cblx0ICAgIC8vLy8vLy8vLy8vL1xuXG5cdCAgICBmdW5jdGlvbiBtZW1iZXJzQ29udGVudCgpe1xuXHQgICAgXHQgLy8gJGh0dHAuZ2V0KCdodHRwOi8vbG9jYWxob3N0OjMwMDAvYXBpL3VzZXJzL2FsbCcpXG5cdCAgICBcdFx0Ly8gLnRoZW4oZnVuY3Rpb24ocmVzKXtcblx0ICAgIFx0XHQvLyBcdGNvbnNvbGUubG9nKHJlcy5kYXRhKVxuXHQgICAgXHRcdC8vIFx0dm0ubWVtYmVyc0NvbnRlbnQgPSByZXMuZGF0YTtcblx0ICAgIFx0XHQvLyB9LFxuXHQgICAgXHRcdC8vIGZ1bmN0aW9uKGVycil7XG5cdCAgICBcdFx0Ly8gXHRjb25zb2xlLmxvZyhlcnIuc3RhdHVzICsgXCIgXCIgKyBlcnIuc3RhdHVzVGV4dCk7XG5cdCAgICBcdFx0Ly8gXHR2bS5tZW1iZXJzQ29udGVudCA9IGVyci5kYXRhO1xuXHQgICAgXHRcdC8vIH0pXG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIGdvdG9TZXNzaW9uKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiByZWZyZXNoKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBzZWFyY2goKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cdH1cblxufSkoKTtcblxuXG4iLCIoZnVuY3Rpb24oKXtcblx0J3VzZSBzdHJpY3QnXG5cblx0YW5ndWxhclxuICAgIFx0Lm1vZHVsZSgnc2FtcGxlJylcbiAgICBcdC5mYWN0b3J5KCdzYW1wbGVTZXJ2aWNlJywgc2FtcGxlU2VydmljZSk7XG5cbiAgIC8vIHNhbXBsZVNlcnZpY2UuaW5qZWN0ID0gWycnXVxuXG4gICAgZnVuY3Rpb24gc2FtcGxlU2VydmljZSgpIHtcbiAgICBcdHZhciBzZXJ2aWNlID0ge1xuXG4gICAgXHRcdGVycm9yOiBlcnJvcixcbiAgICBcdFx0aW5mbzogaW5mbyxcbiAgICBcdFx0c3VjY2Vzczogc3VjY2Vzc1xuXG4gICAgXHR9O1xuXG4gICAgXHRyZXR1cm4gc2VydmljZTtcblxuICAgIFx0Ly8vLy8vLy8vLy8vXG5cbiAgICBcdGZ1bmN0aW9uIGVycm9yKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBpbmZvKCkge1xuXHQgICAgICAvKiAqL1xuICAgICAgICAgIC8vY29uc29sZS5sb2coXCJzYW1wbGVTZXJ2aWNlXCIpO1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBzdWNjZXNzKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXG5cbiAgICB9XG5cblx0XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0J1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCdub3RlcycpXG5cdFx0LmNvbnRyb2xsZXIoJ25vdGVzQ3RybCcsIG5vdGVzQ3RybClcblxuXHRub3Rlc0N0cmwuJGluamVjdCA9IFsnbm90ZXNTZXJ2aWNlJywnJHNjb3BlJywnJGh0dHAnLCd0b2FzdHInLCckd2luZG93J11cblxuXHRmdW5jdGlvbiBub3Rlc0N0cmwobm90ZXNTZXJ2aWNlLCRzY29wZSwgJGh0dHAsIHRvYXN0ciwgJHdpbmRvdykge1xuXHRcdHZhciB2bSA9IHRoaXM7XG5cdFx0Y29uc29sZS5sb2coXCJub3RlcyBiYWxsc291dFwiKTtcblxuXHRcdHZtLmdldE5vdGVzID0gZ2V0Tm90ZXNMaXN0KCk7XG5cdFx0dm0uYWxsTm90ZXMgPSBudWxsO1xuXHRcdHZtLmFjdGl2ZU5vdGVzID0gW107XG5cdFx0Ly92bS5nZXRTaW5nbGVOb3RlID0gZ2V0U2luZ2xlTm90ZTtcblxuXG5cdFx0dm0uc2F2ZU5vdGUgPSBzYXZlTm90ZTtcblx0XHR2bS5kZWxldGVOb3RlID0gZGVsZXRlTm90ZTtcblx0XHR2bS51cGRhdGVOb3RlID0gdXBkYXRlTm90ZTtcblx0XHR2bS5uZXdOb3RlID0gbmV3Tm90ZTtcblxuXHRcdHZtLmFjdGl2YXRlID0gYWN0aXZhdGU7XG5cdFx0dm0uY2xvc2VUYWIgPSBjbG9zZVRhYjtcblx0XHRcblx0XHR2bS5zaG93TGlzdCA9IHRydWU7XG5cdFx0dm0uZ3JpZE1vZGUgPSB0cnVlO1xuXG4gIFxuXHQgIFx0JHNjb3BlLnRpbnltY2VPcHRpb25zID0ge1xuXHRcdCAgICBwbHVnaW5zOiAnbGluayBpbWFnZSBjb2RlJyxcblx0XHQgICAgdG9vbGJhcjogJ3VuZG8gcmVkbyB8IGJvbGQgaXRhbGljIHwgYWxpZ25sZWZ0IGFsaWduY2VudGVyIGFsaWducmlnaHQgfCBjb2RlIHwgcGFzdGUnXG5cdFx0ICB9O1xuXG5cdFx0JHNjb3BlLnRpdGxlID0gXCJyYXRzdHNcIjtcblx0XHQkc2NvcGUuZG9ncyA9XCJmcm9hZHNhc2RmYWRzZ3NcIlxuXHRcdHZtLnRpbnltY2VNb2RlbCA9ICdJbml0aWFsIGNvbnNkc2R0ZW50JztcblxuXG5cdFx0XG5cblx0XHRmdW5jdGlvbiBnZXROb3Rlc0xpc3QoKSB7XG5cdFx0XHRub3Rlc1NlcnZpY2UuZ2V0Tm90ZXNMaXN0KCkudGhlbihmdW5jdGlvbihkYXRhKXtcblx0XHRcdFx0dm0uYWxsTm90ZXMgPSBkYXRhLmRhdGEubm90ZXM7XG5cdFx0XHRcdC8vY29uc29sZS5sb2codm0uYWxsTm90ZXMpO1xuXHRcdFx0fSlcblx0XHR9XG5cblx0XHQvLyBmdW5jdGlvbiBnZXRTaW5nbGVOb3RlKG5vdGVJZCkge1xuXHRcdC8vIFx0IG5vdGVzU2VydmljZS5nZXRTaW5nbGVOb3RlKG5vdGVJZCkudGhlbihmdW5jdGlvbigpe1xuXHRcdC8vIFx0IFx0cmV0dXJuIGRhdGEuZGF0YTtcblx0XHQvLyBcdCB9KVxuXG5cdFx0Ly8gfVxuXG5cblx0ICAgIGZ1bmN0aW9uIGFjdGl2YXRlKG5vdGVJZCkge1xuXHQgICAgXHR2YXIgcGVybWlzc2lvblRvQWN0aXZhdGUgPSB0cnVlO1xuICAgIFx0XHQvLyBjaGVja3MgaWYgdGFiIGFscmVhZHkgb3BlblxuICAgIFx0XHRpZih2bS5hY3RpdmVOb3Rlcy5sZW5ndGggPiAwICYmIHZtLmFjdGl2ZU5vdGVzLmxlbmd0aCAhPT0gNCApe1xuICAgIFx0XHRcdGNvbnNvbGUubG9nKCdsb29waW5nJylcblx0ICAgIFx0XHRhbmd1bGFyLmZvckVhY2godm0uYWN0aXZlTm90ZXMsIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdCAgICBcdFx0XHRjb25zb2xlLmxvZyh2YWx1ZS5faWQudG9TdHJpbmcoKSk7XG5cdCAgICBcdFx0XHRjb25zb2xlLmxvZyhub3RlSWQudG9TdHJpbmcoKSk7XG5cdFx0XHRcdCAgaWYodmFsdWUuX2lkLnRvU3RyaW5nKCkgPT0gbm90ZUlkLnRvU3RyaW5nKCkpe1xuXHRcdFx0XHQgIFx0cGVybWlzc2lvblRvQWN0aXZhdGUgPSBmYWxzZTtcblx0XHRcdFx0ICBcdHRvYXN0ci5lcnJvcihcIldob29wcyEgTG9va3MgbGlrZSB0aGlzIG5vdGUgaXMgYWxyZWFkeSBvcGVuXCIpXG5cdFx0XHRcdCAgfVxuXHRcdFx0XHR9KTsvL2VuZCBmb3JlYWNoXG5cdFx0XHR9XG5cdFx0ICAgIGlmKHZtLmFjdGl2ZU5vdGVzLmxlbmd0aCA9PSA0KXtcblx0XHQgICAgXHRcdGNvbnNvbGUubG9nKFwiY2hlY2tpbmcgbWF4XCIpO1xuXHRcdCAgICBcdFx0cGVybWlzc2lvblRvQWN0aXZhdGUgPSBmYWxzZTtcblx0XHQgICAgXHRcdHRvYXN0ci5lcnJvcihcIldob29wcyEgTG9va3MgbGlrZSB5b3UgaGF2ZSByZWFjaGVkIHRoZSBtYXggbnVtYmVyIG9mIHRhYnMoNClcIilcblx0XHQgICAgfVxuXHRcdFxuXHQgICAgXHRpZihwZXJtaXNzaW9uVG9BY3RpdmF0ZSA9PSB0cnVlKXtcblx0XHRcdCAgXHRjb25zb2xlLmxvZyhcImVsc2UgcHVzaGluZ1wiKTtcblx0XHRcdCAgXHRjb25zb2xlLmxvZyhub3RlSWQpXG5cdFx0XHQgIFx0bm90ZXNTZXJ2aWNlLmdldFNpbmdsZU5vdGUobm90ZUlkKS50aGVuKGZ1bmN0aW9uKHJlcyl7XG5cdFx0XHQgIFx0XHR2YXIgbm90ZSA9IHJlcy5kYXRhLmRhdGE7XG5cdFx0XHQgIFx0XHR2bS5hY3RpdmVOb3Rlcy5wdXNoKG5vdGUpO1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKHZtLmFjdGl2ZU5vdGVzKVxuXHRcdFx0ICBcdH0pXG5cdFx0XHQgIFx0XG5cdFx0XHR9IFxuXHQgICAgXHRcblx0ICAgIH0gLy9lbmQgZnVuY3Rpb24gYWN0aXZhdGVcblxuXHQgICAgZnVuY3Rpb24gY2xvc2VUYWIoaW5kZXgpIHtcblx0ICAgICAgdm0uYWN0aXZlTm90ZXMuc3BsaWNlKGluZGV4LDEpO1xuXHQgICAgICBjb25zb2xlLmxvZyh2bS5hY3RpdmVOb3RlcylcblxuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBuZXdOb3RlKCkge1xuXHQgICAgXHQvLyBmaXJzdCBjaGVjayBpZiBhY3RpdmUgbm90ZXMgaXMgZnVsbFxuXHQgICAgXHRpZih2bS5hY3RpdmVOb3Rlcy5sZW5ndGggPT0gNCl7XG5cdCAgICBcdFx0cmV0dXJuIHRvYXN0ci5lcnJvcihcIldob29wcyEgUGxlYXNlIGNsb3NlIGEgdGFiIGJlZm9yZSBjcmVhdGluZyBhIG5ldyBub3RlXCIpO1xuXHQgICAgXHR9XG5cblx0ICAgIFx0XG5cdCAgICBcdC8vIGdldCB0b2tlblxuXHQgICAgXHR2YXIgdG9rZW4gPSAkd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKCd1c2VyVG9rZW4nKTtcblxuXHQgICAgXHQvLyBzZW5kIG5ldyBub3RlIG9iamVjdFxuXHQgICAgXHRub3Rlc1NlcnZpY2UuYWRkTmV3Tm90ZSgpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG5cdCAgICBcdFx0Y29uc29sZS5sb2coZGF0YSk7XG5cblx0ICAgIFx0XHRub3Rlc1NlcnZpY2UuZ2V0Tm90ZXNMaXN0KCkudGhlbihmdW5jdGlvbihkYXRhKXtcblx0ICAgIFx0XHRcdC8vIHB1c2ggbmV3IG5vdGUgdG8gYWN0aXZlIG5vdGVzXG5cdCAgICBcdFx0XHR2bS5hbGxOb3RlcyA9IGRhdGEuZGF0YS5ub3Rlcztcblx0XHQgICAgXHRcdHZhciBuZXdOb3RlSW5kZXggPSB2bS5hbGxOb3Rlcy5sZW5ndGgtMTtcblx0XHQgICAgXHRcdGFjdGl2YXRlKHZtLmFsbE5vdGVzW25ld05vdGVJbmRleF0pO1xuXHRcdCAgICBcdFx0Ly9zY3JvbGwgdG8gdGhlIG5ldyBub3RlXG5cdCAgICBcdFx0XHR3aW5kb3cubG9jYXRpb24uaGFzaCA9IFwibm90ZXMjXCIgKyB2bS5hbGxOb3Rlc1tuZXdOb3RlSW5kZXhdLl9pZDtcblxuXHRcdCAgICBcdFx0Ly8gbG9nIG5ldyBhY3RpdmUgbm90ZXNcblx0XHQgICAgXHRcdGNvbnNvbGUubG9nKHZtLmFjdGl2ZU5vdGVzKTtcblx0ICAgIFx0XHR9KVxuXHQgICAgXHRcdFxuXHQgICAgXHRcdFxuXHQgICAgXHR9KTtcblx0XHRcdFxuXHQgICAgXHRcblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gZGVsZXRlTm90ZShub3RlSWQsaW5kZXgpe1xuXHQgICAgXHRjb25zb2xlLmxvZygnZGVsZXRpbmcnKVxuXHQgICAgXHRub3Rlc1NlcnZpY2UuZGVsZXRlTm90ZShub3RlSWQpLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG5cdCAgICBcdFx0aWYoZGF0YS5kYXRhLm5Nb2RpZmllZCA9PSAxKXtcblx0ICAgIFx0XHRcdGNsb3NlVGFiKGluZGV4KVxuXHQgICAgXHRcdFx0dG9hc3RyLnN1Y2Nlc3MoXCJOb3RlIERlbGV0ZWRcIilcblx0ICAgIFx0XHRcdGdldE5vdGVzTGlzdCgpO1xuXHQgICAgXHRcdH1cblx0ICAgIFx0XHRcblx0ICAgIFx0fSk7XG5cdCAgICBcdFxuXHQgICAgfVxuXG5cdCAgIFxuXHRcdGZ1bmN0aW9uIHNhdmVOb3RlKCkge1xuXG5cdFx0fVxuXG5cblx0XHRmdW5jdGlvbiB1cGRhdGVOb3RlKCkge1xuXG5cdFx0fVxuXG5cdH1cblxufSkoKTtcblxuXG4iLCIvLyBhbmd1bGFyXG4vLyAgICAgLm1vZHVsZSgnbm90ZXMnKVxuLy8gICAgIC5kaXJlY3RpdmUoJ25vdGVDYXJkJywgbm90ZUNhcmQpO1xuXG4vLyBmdW5jdGlvbiBub3RlQ2FyZCgpIHtcbi8vIFx0cmV0dXJue1xuLy8gXHRcdHJlc3RyaWN0OiAnRScsXG4vLyBcdFx0c2NvcGU6IHtcbi8vIFx0XHRcdGRhdGE6IFwiPVwiLFxuLy8gXHRcdFx0ZHJhZ2dhYmxlOiBcIj1cIlxuLy8gXHRcdH0sXG4vLyBcdFx0cmVwbGFjZTogdHJ1ZSxcbi8vIFx0XHR0ZW1wbGF0ZTogXCI8aDE+e3tkb2dzfX17e2RyYWdTdGF0dXN9fTwvaDE+XCIsXG4vLyBcdFx0bGluazogZnVuY3Rpb24oc2NvcGUsZWxlbWVudCl7XG4vLyBcdFx0XHRlbGVtZW50LmNsaWNrKGZ1bmN0aW9uKCl7XG4vLyBcdFx0XHRcdGNvbnNvbGUubG9nKGVsZW1lbnQpXG4vLyBcdFx0XHRcdGVsZW1lbnRbMF0uZHJhZ2dhYmxlID0gdHJ1ZTtcbi8vIFx0XHRcdH0pXG4vLyBcdFx0fSxcbi8vIFx0XHRjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpe1xuLy8gXHRcdFx0Ly9hbGVydChcImNvbnRyb2xsZXJcIik7XG4vLyBcdFx0XHQkc2NvcGUuZG9ncyA9ICRzY29wZS5kYXRhICsgXCJkb2dzXCI7XG4vLyBcdFx0XHRpZigkc2NvcGUuZHJhZ2dhYmxlKVxuLy8gXHRcdFx0XHQkc2NvcGUuZHJhZ1N0YXR1cyA9IGZhbHNlO1xuLy8gXHRcdFx0ZWxzZSAkc2NvcGUuZHJhZ1N0YXR1cyA9IHRydWU7XG5cblx0XHRcdFxuLy8gXHRcdH1cbi8vIFx0fVxuLy8gfVxuXG5cblxuLy8gLy8gYW5ndWxhclxuLy8gLy8gICAgIC5tb2R1bGUoJ25vdGVzJylcbi8vIC8vICAgICAuZGlyZWN0aXZlKCdub3RlQ2FyZCcsIG5vdGVDYXJkKTtcblxuLy8gLy8gZnVuY3Rpb24gbm90ZUNhcmQoKSB7XG4vLyAvLyBcdHJldHVybntcbi8vIC8vIFx0XHRyZXN0cmljdDogJ0UnLFxuLy8gLy8gXHRcdGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSl7XG4vLyAvLyBcdFx0XHRhbGVydChcImNvbnRyb2xsZXJcIik7XG4vLyAvLyBcdFx0XHRjb25zb2xlLmxvZygnZG9nJylcbi8vIC8vIFx0XHR9LFxuLy8gLy8gXHRcdHRlbXBsYXRlVXJsOiAnJyxcbi8vIC8vIFx0XHRyZXBsYWNlOiB0cnVlXG4vLyAvLyBcdFx0Ly8gc2NvcGU6IHt9XG4vLyAvLyBcdH1cbi8vIC8vIH0iLCIvLyBhbmd1bGFyXG4vLyAgICAgLm1vZHVsZSgnbm90ZXMnKVxuLy8gICAgIC5kaXJlY3RpdmUoJ25vdGVDYXJkcycsIG5vdGVDYXJkcylcblxuXG4gICAgXG5cbi8vIGZ1bmN0aW9uIG5vdGVDYXJkcygpIHtcbi8vIFx0cmV0dXJue1xuLy8gXHRcdHJlc3RyaWN0OiAnQUUnLFxuLy8gXHRcdHNjb3BlOiB7XG4vLyBcdFx0XHRub3RlczogXCI9XCIsXG4vLyBcdFx0XHRuZXdJdGVtOiBcIj1cIlxuLy8gXHRcdH0sXG4vLyBcdFx0cmVwbGFjZTogZmFsc2UsXG4vLyBcdFx0dHJhbnNjbHVkZTogZmFsc2UsXG4vLyBcdFx0dGVtcGxhdGVVcmw6IFwiY29tcG9uZW50cy9ub3Rlcy92aWV3cy9ub3RlLmRpcmVjdGl2ZS52aWV3Lmh0bWxcIixcbi8vIFx0XHRsaW5rOiBmdW5jdGlvbihzY29wZSxlbGVtZW50LGF0dHJzKXtcbi8vIFx0XHRcdC8vJCggXCIjc29ydGFibGVcIiApLnNvcnRhYmxlKCk7XG4vLyBcdFx0XHQvL2NvbnNvbGUubG9nKHNjb3BlKVxuLy8gXHRcdFx0Ly9jb25zb2xlLmxvZyhlbGVtZW50KVxuLy8gXHRcdFx0Ly9jb25zb2xlLmxvZyhhdHRycylcbi8vIFx0XHRcdC8vZWxlbWVudC5zb3J0YWJsZSgpO1xuLy8gXHRcdFx0Ly9jb25zb2xlLmxvZyhzY29wZS5ub3Rlcylcbi8vIFx0XHRcdHNjb3BlLmRvZ3MgPSBmdW5jdGlvbihub3RlKXtcbi8vIFx0XHRcdFx0Y29uc29sZS5sb2cobm90ZSlcbi8vIFx0XHRcdH1cblxuXG4vLyBcdFx0XHRlbGVtZW50LnNvcnRhYmxlKHtcbi8vIFx0XHQgICAgICAgLy8gcGxhY2Vob2xkZXI6IFwidWktc3RhdGUtaGlnaGxpZ2h0XCIsXG4vLyBcdFx0ICAgICAgICBzdGFydDogZnVuY3Rpb24oZXZlbnQsIHVpKSB7XG4vLyBcdFx0ICAgICAgICAgICAgdmFyIHN0YXJ0X3BvcyA9IHVpLml0ZW0uaW5kZXgoKTtcbi8vIFx0XHQgICAgICAgICAgICB1aS5pdGVtLmRhdGEoJ3N0YXJ0X3BvcycsIHN0YXJ0X3Bvcyk7XG4vLyBcdFx0ICAgICAgICB9LFxuLy8gXHRcdCAgICAgICAgdXBkYXRlOiBmdW5jdGlvbihldmVudCwgdWkpIHtcbi8vIFx0XHQgICAgICAgICAgICB2YXIgc3RhcnRfcG9zID0gdWkuaXRlbS5kYXRhKCdzdGFydF9wb3MnKTtcbi8vIFx0XHQgICAgICAgICAgICB2YXIgZW5kX3BvcyA9IHVpLml0ZW0uaW5kZXgoKTtcbi8vIFx0XHQgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHN0YXJ0X3BvcyArICcgLSAnICsgZW5kX3Bvcyk7XG5cdFx0ICAgICAgICAgIFxuLy8gXHRcdCAgICAgICAgICB2YXIgc3RhcnRJdGVtID0gc2NvcGUubm90ZXNbc3RhcnRfcG9zXTtcbi8vIFx0XHQgICAgICAgICAgIHNjb3BlLm5vdGVzLnNwbGljZShzdGFydF9wb3MsMSlcbi8vIFx0XHQgICAgICAgICAgIHNjb3BlLm5vdGVzLnNwbGljZShlbmRfcG9zLDAsIHN0YXJ0SXRlbSlcbi8vIFx0XHQgICAgICAgICAgIHNjb3BlLiRhcHBseSgpO1xuXG4vLyBcdFx0ICAgICAgICAgICAvL2NvbnNvbGUubG9nKHNjb3BlLm5vdGVzKVxuXHRcdCAgICAgICAgICAgXG5cdFx0ICAgICAgICAgICBcbi8vIFx0XHQgICAgICAgIH1cbi8vIFx0XHQgICAgfSk7IC8vIGVuZCBzb3J0YWJsZVxuXG5cdFx0ICAgXG5cbi8vIFx0XHQgICAgY29uc29sZS5sb2coZWxlbWVudClcblxuXG4vLyBcdFx0fSxcbi8vIFx0XHRjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpe1xuLy8gXHRcdFx0JHNjb3BlLmZvcm0gPXt9XG4vLyBcdFx0XHQkc2NvcGUuYWRkSXRlbSA9IGZ1bmN0aW9uKGluZGV4LGl0ZW0pe1xuLy8gXHRcdFx0XHQvL2FsZXJ0KGluZGV4KVxuLy8gXHRcdFx0XHRjb25zb2xlLmxvZygkc2NvcGUubmV3SXRlbSlcbi8vIFx0XHRcdFx0JHNjb3BlLm5vdGVzW2luZGV4XS5pdGVtcy5wdXNoKGl0ZW0pXG4vLyBcdFx0XHRcdCRzY29wZS5mb3JtID0ge31cbi8vIFx0XHRcdFx0Ly9jb25zb2xlLmxvZygkc2NvcGUubm90ZXNbaW5kZXhdLml0ZW1zKVxuLy8gXHRcdFx0fVxuXG4vLyBcdFx0XHQkc2NvcGUuZGVsZXRlTm90ZSA9IGZ1bmN0aW9uKGluZGV4KXtcbi8vIFx0XHRcdFx0JHNjb3BlLm5vdGVzLnNwbGljZShpbmRleCwxKTtcbi8vIFx0XHRcdH1cblxuXG4vLyBcdFx0XHQvL2FsZXJ0KFwiY29udHJvbGxlclwiKTtcbi8vIFx0XHRcdC8vICRzY29wZS5kb2dzID0gJHNjb3BlLmRhdGEgKyBcImRvZ3NcIjtcbi8vIFx0XHRcdC8vIGlmKCRzY29wZS5kcmFnZ2FibGUpXG4vLyBcdFx0XHQvLyBcdCRzY29wZS5kcmFnU3RhdHVzID0gZmFsc2U7XG4vLyBcdFx0XHQvLyBlbHNlICRzY29wZS5kcmFnU3RhdHVzID0gdHJ1ZTtcblxuXHRcdFx0XG4vLyBcdFx0fVxuLy8gXHR9XG4vLyB9IC8vZW5kIG5vdGVjYXJkcyBkaXJlY3RpdmVcblxuLy8gYW5ndWxhclxuLy8gXHQubW9kdWxlKCdub3RlcycpXG4vLyBcdC5kaXJlY3RpdmUoJ25vdGVDYXJkJywgbm90ZUNhcmQpXG5cbi8vIGZ1bmN0aW9uIG5vdGVDYXJkKCkge1xuXG4vLyBcdHZhciB0ZW1wRGF0YSA9IHt9O1xuLy8gXHR2YXIgdGVtcE5vdGUgPSBudWxsO1xuXG4vLyBcdHJldHVybntcbi8vIFx0XHRyZXN0cmljdDogJ0FFJyxcbi8vIFx0XHRzY29wZToge1xuLy8gXHRcdFx0bm90ZTogXCI9XCIsXG4vLyBcdFx0XHRub3RlczogXCI9XCJcbi8vIFx0XHR9LFxuLy8gXHRcdHJlcGxhY2U6IHRydWUsXG4vLyBcdFx0dHJhbnNjbHVkZTogZmFsc2UsXG4vLyBcdFx0dGVtcGxhdGVVcmw6IFwiY29tcG9uZW50cy9ub3Rlcy92aWV3cy9ub3Rlcy5pdGVtcy52aWV3Lmh0bWxcIixcbi8vIFx0XHRsaW5rOiBmdW5jdGlvbihzY29wZSxlbGVtZW50LGF0dHJzKXtcbi8vIFx0XHRcdC8vJCggXCIjc29ydGFibGVcIiApLnNvcnRhYmxlKCk7XG4vLyBcdFx0XHQvL2NvbnNvbGUubG9nKHNjb3BlKVxuLy8gXHRcdFx0Ly9jb25zb2xlLmxvZyhlbGVtZW50KVxuLy8gXHRcdFx0Ly9jb25zb2xlLmxvZyhhdHRycylcbi8vIFx0XHRcdC8vZWxlbWVudC5zb3J0YWJsZSgpO1xuLy8gXHRcdFx0Ly9jb25zb2xlLmxvZyhzY29wZS5ub3Rlcylcbi8vIFx0XHRcdC8vc2NvcGUuJHdhdGNoKCdub3RlcycsIGZ1bmN0aW9uKCkge1xuXG4vLyAgICAgICAgIC8vIGFsbCB0aGUgY29kZSBoZXJlLi4uXG4gICAgXHRcdFxuICAgIFx0XHRcblx0XHRcdFxuXG4vLyBcdFx0XHRlbGVtZW50LnNvcnRhYmxlKHtcbi8vIFx0XHRcdFx0Y29ubmVjdFdpdGg6IFwiLmNvbm5lY3RlZFNvcnRhYmxlXCIsXG4vLyBcdFx0ICAgICAgIC8vcGxhY2Vob2xkZXI6IFwidWktc3RhdGUtaGlnaGxpZ2h0XCIsXG4vLyBcdFx0ICAgICAgICBzdGFydDogZnVuY3Rpb24oZXZlbnQsIHVpKSB7XG4vLyBcdFx0ICAgICAgICBcdGNvbnNvbGUubG9nKFwiU1RBUlQgU1RBUlQgU1RBUlQgU1RBUlQgU1RBUlRcIilcbi8vIFx0XHQgICAgICAgIFx0Y29uc29sZS5sb2coZWxlbWVudClcbi8vIFx0XHQgICAgICAgIFx0Y29uc29sZS5sb2codGVtcERhdGEpXG5cdFx0ICAgICAgICBcdFxuXG4vLyBcdFx0ICAgICAgICBcdHRlbXBEYXRhLnN0YXJ0Tm90ZSA9IGFuZ3VsYXIuY29weShzY29wZS5ub3RlKTtcbi8vIFx0XHQgICAgICAgIFx0dGVtcERhdGEuc3RhcnROb3RlSW5kZXggPSBhdHRycy5ub3RlaW5kZXg7XG4vLyBcdFx0XHRcdFx0dGVtcERhdGEuc3RhcnROb3RlSXRlbUluZGV4ID0gdWkuaXRlbS5pbmRleCgpO1xuLy8gXHRcdFx0XHRcdHRlbXBEYXRhLnN0YXJ0Tm90ZUl0ZW1Db250ZW50ID0gdGVtcERhdGEuc3RhcnROb3RlLml0ZW1zW3RlbXBEYXRhLnN0YXJ0Tm90ZUl0ZW1JbmRleF07XG5cdFx0ICAgXHRcdFx0XG4vLyBcdFx0ICAgXHRcdFx0dGVtcE5vdGUgPSBhbmd1bGFyLmNvcHkoc2NvcGUubm90ZSlcbi8vIFx0XHQgICBcdFx0XHRjb25zb2xlLmxvZyh0ZW1wTm90ZSlcblxuLy8gXHRcdCAgICAgICAgfSxcbi8vIFx0XHQgICAgICAgIHVwZGF0ZTogZnVuY3Rpb24oZXZlbnQsIHVpKSB7XG5cbi8vIFx0XHQgICAgICAgLy8gY29uc29sZS5sb2coc2NvcGUudGVtcERhdGEpXHRcbi8vIFx0ICAgICAgICAgXHRpZiAoIXVpLnNlbmRlcikge1x0XHQgICAgICAgXG4vLyBcdFx0XHQgICAgICAgICBjb25zb2xlLmxvZyhcIlVQREFURSBVUERBVEUgVVBEQVRFIFVQREFURSBVUERBVEUgSU5TSURFIElGXCIgKVxuXG5cdFx0XHQgICAgICAgIFxuXHRcdFx0XHRcdFx0XHRcdCAgICAgICAgIFxuXG4vLyBcdFx0XHRcdFx0dmFyIHN0YXJ0X3BvcyA9IHRlbXBEYXRhLnN0YXJ0Tm90ZUl0ZW1JbmRleDtcbi8vIFx0XHRcdFx0XHR2YXIgZW5kX3BvcyA9IHVpLml0ZW0uaW5kZXgoKTtcbi8vIFx0XHRcdFx0XHRjb25zb2xlLmxvZyhzdGFydF9wb3MgKyAnIC0gJyArIGVuZF9wb3MpO1xuXG4vLyBcdFx0XHRcdFx0dGVtcE5vdGUuaXRlbXMuc3BsaWNlKHN0YXJ0X3BvcywxKVxuLy8gXHRcdFx0XHRcdHRlbXBOb3RlLml0ZW1zLnNwbGljZShlbmRfcG9zLDAsIHRlbXBEYXRhLnN0YXJ0Tm90ZUl0ZW1Db250ZW50KVxuLy8gXHRcdFx0XHRcdC8vc2NvcGUubm90ZSA9IHRlbXBOb3RlXG4vLyBcdFx0XHRcdFx0c2NvcGUubm90ZXNbdGVtcERhdGEuc3RhcnROb3RlSW5kZXhdID0gdGVtcE5vdGU7XG5cdFx0XHRcdFx0XG4vLyBcdFx0XHRcdFx0Y29uc29sZS5sb2coc2NvcGUubm90ZXMpXG5cbi8vIFx0XHRcdFx0XHR2YXIgcmFzdCA9IHtcbi8vICAgICAgICAgICAgICAgICAgICAgb3duZXI6IFwiYXVrMmFkc0Buaml0LmVkdVwiLFxuLy8gICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJzMVwiLFxuLy8gICAgICAgICAgICAgICAgICAgICBpdGVtczogWyBcImxhdW5zZHJ5XCIsIFwiYXBzcGx5IGpvYnNcIiwgXCJnc3ltXCIgXSxcbi8vICAgICAgICAgICAgICAgICAgICAgY3JlYXRlRGF0ZTogXCIxLzEvMjIwMTZcIixcbi8vICAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkOiBcIjEvMjIvMjAxNlwiLFxuLy8gICAgICAgICAgICAgICAgICAgICBzaGFyZWRXaXRoOiBcImEuZnJvenNlLmFrQGdtYWlsLmNvbVwiXG4vLyAgICAgICAgICAgICAgICAgfVxuXG4vLyBcdFx0XHRcdFx0Ly9zY29wZS5ub3Rlc1swXS5pdGVtcy5wdXNoKFwiUFVDS1NcIilcblxuLy8gXHRcdFx0XHRcdHNjb3BlLiRhcHBseSgpO1xuXG4vLyBcdFx0ICAgLy8gICAgICAgICAvL2NvbnNvbGUubG9nKHNjb3BlLm5vdGVzKVxuLy8gXHRcdFx0ICAgIH0gICBcblx0XHQgICAgICAgICAgIFxuLy8gXHRcdCAgICAgICAgfSwgLy9lbmQgdXBkYXRlXG4vLyBcdFx0ICAgICAgICByZWNlaXZlOiBmdW5jdGlvbihldmVudCwgdWkpe1xuLy8gXHRcdCAgICAgICAgXHRjb25zb2xlLmxvZyhcIlJFQ0VJVkUgUkVDRUlWRSBSRUNFSVZFIFJFQ0VJVkUgUkVDRUlWRVwiKVxuLy8gXHRcdCAgICAgICAgXHRjb25zb2xlLmxvZyh0ZW1wRGF0YSlcblxuLy8gXHRcdCAgICAgICAgXHR0ZW1wRGF0YS5lbmROb3RlID0gYW5ndWxhci5jb3B5KHNjb3BlLm5vdGUpO1xuLy8gXHRcdCAgICAgICAgXHR0ZW1wRGF0YS5lbmROb3RlSW5kZXggPSBhdHRycy5ub3RlaW5kZXg7XG4vLyBcdFx0XHRcdFx0dGVtcERhdGEuZW5kTm90ZUl0ZW1JbmRleCA9IHVpLml0ZW0uaW5kZXgoKTtcblxuXHRcdFx0XHRcdFxuXG4vLyBcdFx0XHRcdFx0ICAvL2NvbnNvbGUubG9nKFwicmVtb3ZpbmcgaXRlbTogXCIgKyBzY29wZS5ub3Rlc1tub3RlT3JpZ2luSW5kZXhdLml0ZW1zW3N0YXJ0X3Bvc10pO1xuLy8gXHRcdCAgICAgICAgICAgdGVtcERhdGEuc3RhcnROb3RlLml0ZW1zLnNwbGljZSh0ZW1wRGF0YS5zdGFydE5vdGVJdGVtSW5kZXgsMSlcbi8vIFx0XHRcdCAgICAgICB0ZW1wRGF0YS5lbmROb3RlLml0ZW1zLnNwbGljZSh0ZW1wRGF0YS5lbmROb3RlSXRlbUluZGV4LDAsdGVtcERhdGEuc3RhcnROb3RlSXRlbUNvbnRlbnQpXG4vLyBcdFx0XHQgICAgICAgY29uc29sZS5sb2codGVtcERhdGEpXG5cbi8vIFx0XHRcdCAgICAgICBzY29wZS5ub3Rlc1t0ZW1wRGF0YS5zdGFydE5vdGVJbmRleF0gPSB0ZW1wRGF0YS5zdGFydE5vdGU7XG4vLyBcdFx0XHQgICAgICAgc2NvcGUubm90ZXNbdGVtcERhdGEuZW5kTm90ZUluZGV4XSA9IHRlbXBEYXRhLmVuZE5vdGU7XG5cdCAgICAgICAgICAgXHRcbi8vIFx0ICAgICAgICAgICBcdFx0Y29uc29sZS5sb2codGVtcERhdGEuc3RhcnROb3RlLml0ZW1zKVxuLy8gXHQgICAgICAgICAgIFx0XHRjb25zb2xlLmxvZyh0ZW1wRGF0YS5lbmROb3RlLml0ZW1zKVxuXG4vLyBcdFx0ICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiYWRkaW5nIGFmdGVyIHBvc2l0aW9uOiBcIiArIGVuZF9wb3MpXG4vLyBcdFx0ICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiYWRkaW5nIGFmdGVyOiBcIiArIHNjb3BlLm5vdGVzW25vdGVEZXN0aW5hdGlvbkluZGV4XS5pdGVtc1tlbmRfcG9zXSlcbi8vIFx0XHQgICAgICAgICAgIC8vc2NvcGUubm90ZXNbbm90ZURlc3RpbmF0aW9uSW5kZXhdLml0ZW1zLnNwbGljZShlbmRfcG9zLDAsIHN0YXJ0SXRlbSlcblxuLy8gXHRcdCAgICAgICAgXHQvL3Njb3BlLnRlbXBEYXRhID0gXCJwcmF3bnNcIjtcblx0XHQgICAgICAgIFx0XG5cdFx0ICAgICAgICBcdFxuLy8gXHRcdCAgICAgICAgXHQvLyBjb25zb2xlLmxvZyh0ZW1wRGF0YSlcbi8vIFx0XHQgICAgICAgIFx0Ly8gLy9jb25zb2xlLmxvZyhzY29wZS5ub3RlKTtcbi8vIFx0XHQgICAgICAgIFx0dmFyIHJhc3QgPSB7XG4vLyAgICAgICAgICAgICAgICAgICAgIG93bmVyOiBcImF1azJhZHNAbmppdC5lZHVcIixcbi8vICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiczFcIixcbi8vICAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFsgXCJsYXVuc2RyeVwiLCBcImFwc3BseSBqb2JzXCIsIFwiZ3N5bVwiIF0sXG4vLyAgICAgICAgICAgICAgICAgICAgIGNyZWF0ZURhdGU6IFwiMS8xLzIyMDE2XCIsXG4vLyAgICAgICAgICAgICAgICAgICAgIGxhc3RNb2RpZmllZDogXCIxLzIyLzIwMTZcIixcbi8vICAgICAgICAgICAgICAgICAgICAgc2hhcmVkV2l0aDogXCJhLmZyb3pzZS5ha0BnbWFpbC5jb21cIlxuLy8gICAgICAgICAgICAgICAgIH1cblx0XHQgICAgICAgIFx0XG4vLyBcdFx0ICAgICAgICAgICBzY29wZS4kYXBwbHkoKTtcblx0XHRcblxuLy8gXHRcdCAgICAgICAgfVxuXG4vLyBcdFx0ICAgIH0pOyAvLyBlbmQgc29ydGFibGVcblxuLy8gXHRcdCAvLyAgfSk7IC8vZW5kIHdhdGNoXG5cblxuXG4vLyBcdFx0fSxcbi8vIFx0XHRjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUpe1xuXG4vLyBcdFx0XHQkc2NvcGUubW9vc2UgPSBcImRpbmdcIlxuLy8gXHRcdFx0JHNjb3BlLmRlbGV0ZUl0ZW0gPSBmdW5jdGlvbihwYXJlbnRJbmRleCwgaW5kZXgpe1xuLy8gXHRcdFx0XHRjb25zb2xlLmxvZyhwYXJlbnRJbmRleClcbi8vIFx0XHRcdFx0Y29uc29sZS5sb2coaW5kZXgpXG4vLyBcdFx0XHRcdCRzY29wZS5ub3Rlc1twYXJlbnRJbmRleF0uaXRlbXMuc3BsaWNlKGluZGV4LDEpXG5cbi8vIFx0XHRcdH1cblxuLy8gXHRcdFx0JHNjb3BlLnJhbmRvbUlkID0gZnVuY3Rpb24oaXRlbSl7XG4vLyAgICBcdFx0XHQgcmV0dXJuIFwiSURcIiArIGl0ZW0gKyAoTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIDk5OSkgKyAxKSk7XG4vLyBcdFx0XHR9XG4vLyBcdFx0XHQvL2FsZXJ0KFwiY29udHJvbGxlclwiKTtcbi8vIFx0XHRcdC8vICRzY29wZS5kb2dzID0gJHNjb3BlLmRhdGEgKyBcImRvZ3NcIjtcbi8vIFx0XHRcdC8vIGlmKCRzY29wZS5kcmFnZ2FibGUpXG4vLyBcdFx0XHQvLyBcdCRzY29wZS5kcmFnU3RhdHVzID0gZmFsc2U7XG4vLyBcdFx0XHQvLyBlbHNlICRzY29wZS5kcmFnU3RhdHVzID0gdHJ1ZTtcblxuLy8gXHRcdFx0Y29uc29sZS5sb2coJHNjb3BlKVxuXG5cdFx0XHRcbi8vIFx0XHR9XG4vLyBcdH1cbi8vIH0gLy9lbmQgbm90ZWNhcmQgZGlyZWN0aXZlXG5cblxuXG5cblxuIiwiKGZ1bmN0aW9uKCl7XG5cdCd1c2Ugc3RyaWN0J1xuXG5cdGFuZ3VsYXJcbiAgICBcdC5tb2R1bGUoJ25vdGVzJylcbiAgICBcdC5mYWN0b3J5KCdub3Rlc1NlcnZpY2UnLCBub3Rlc1NlcnZpY2UpO1xuXG4gICAgbm90ZXNTZXJ2aWNlLiRpbmplY3QgPSBbJyRodHRwJywnJHdpbmRvdyddXG5cbiAgICBmdW5jdGlvbiBub3Rlc1NlcnZpY2UoJGh0dHAsJHdpbmRvdykge1xuXG4gICAgICAgIHZhciB0b2tlbiA9IGdldFRva2VuKCk7XG4gICAgXHR2YXIgc2VydmljZSA9IHtcbiAgICAgICAgICAgIGdldFRva2VuOiBnZXRUb2tlbiwgXG4gICAgICAgICAgICBnZXROb3Rlc0xpc3Q6IGdldE5vdGVzTGlzdCxcbiAgICAgICAgICAgIGdldFNpbmdsZU5vdGU6IGdldFNpbmdsZU5vdGUsXG4gICAgICAgICAgICBzYXZlQWxsTm90ZXM6IHNhdmVBbGxOb3RlcyxcbiAgICAgICAgICAgIGFkZE5ld05vdGU6IGFkZE5ld05vdGUsXG4gICAgICAgICAgICBkZWxldGVOb3RlOiBkZWxldGVOb3RlLFxuICAgICAgICAgICAgLy8gdXBkYXRlTm90ZVRpdGxlOiB1cGRhdGVOb3RlVGl0bGUsXG4gICAgICAgICAgICAvLyB1cGRhdGVOb3RlQ29udGVudDogdXBkYXRlTm90ZVxuICAgIFx0fTtcblxuICAgIFx0cmV0dXJuIHNlcnZpY2U7XG5cbiAgICBcdC8vLy8vLy8vLy8vL1xuXG4gICAgICAgIGZ1bmN0aW9uIGdldFRva2VuKCkge1xuICAgICAgICAgICAgcmV0dXJuICR3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3VzZXJUb2tlbicpO1xuICAgICAgICB9XG4gICAgICBcbiAgICAgICAgLy8gZ2V0cyBub3RlcyBsaXN0LCBleGNsdWRlcyB0aGUgYWN0dWFsIG5vdGUgY29udGVudFxuICAgICAgICBmdW5jdGlvbiBnZXROb3Rlc0xpc3QgKCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGkvbm90ZXMvZ2V0QWxsTm90ZXNNZXRhJyx7dG9rZW46IHRva2VufSk7XG4gICAgICAgIH0gLy9lbmQgZ2V0Tm90ZSgpXG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0U2luZ2xlTm90ZShub3RlSWQpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCdodHRwOi8vbG9jYWxob3N0OjMwMDAvYXBpL25vdGVzL2dldFNpbmdsZU5vdGUnLHt0b2tlbjogdG9rZW4sIG5vdGVJZDogbm90ZUlkfSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGFkZE5ld05vdGUgKCkge1xuXG4gICAgICAgICAgICAvLyBjcmVhdGUgbmV3IG5vdGUgb2JqZWN0XG4gICAgICAgICAgICB2YXIgbmV3Tm90ZSA9IHt0aXRsZTpcImZyb29zdFwiLGNvbnRlbnQ6XCJzb21lIGNvbnRlbnRcIixcInNoYXJlZFdpdGhcIjpbe1widXNlclwiOiBcImF1azJAbmppdC5lZHVcIiwgXCJjYW5FZGl0XCI6IGZhbHNlfV19O1xuICAgICAgICAgICAgXG4gICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCdodHRwOi8vbG9jYWxob3N0OjMwMDAvYXBpL25vdGVzL2FkZE5vdGUnLHt0b2tlbjogdG9rZW4sIG5vdGU6IG5ld05vdGV9KVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZGVsZXRlTm90ZShub3RlSWQpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCdodHRwOi8vbG9jYWxob3N0OjMwMDAvYXBpL25vdGVzL2RlbGV0ZU5vdGUnLHt0b2tlbjogdG9rZW4sIG5vdGVJZDogbm90ZUlkfSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNhdmVBbGxOb3Rlcyhub3Rlcykge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGkvbm90ZXMvdXBkYXRlTm90ZXMnLHtlbWFpbDpcIm1vaXpAZ21haWwuY29tXCIsbm90ZXM6IG5vdGVzfSlcbiAgICAgICAgfVxuXG5cblxuICAgIH1cblxuXHRcblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0J3VzZSBzdHJpY3QnXG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ25vdGlmeScpXG5cdFx0LmNvbnRyb2xsZXIoJ25vdGlmeUN0cmwnLCBub3RpZnlDdHJsKVxuXG5cdC8vIG5vdGlmeUN0cmwuJGluamVjdCA9IFtdXG5cblx0ZnVuY3Rpb24gbm90aWZ5Q3RybCgpIHtcblxuXHQgICAgdmFyIHZtID0gdGhpcztcblxuXHQgICAgdm0uZ290b1Nlc3Npb24gPSBnb3RvU2Vzc2lvbjtcblx0ICAgIHZtLnJlZnJlc2ggPSByZWZyZXNoO1xuXHQgICAgdm0uc2VhcmNoID0gc2VhcmNoO1xuXHQgICAgdm0uc2Vzc2lvbnMgPSBbXTtcblx0ICAgIHZtLnRpdGxlID0gJ25vdGlmeSc7XG5cblx0ICAgIC8vLy8vLy8vLy8vL1xuXG5cdCAgICBcblxuXHQgICAgZnVuY3Rpb24gZ290b1Nlc3Npb24oKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIHJlZnJlc2goKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIHNlYXJjaCgpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblx0fVxuXG59KSgpO1xuXG5cbiIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdub3RpZnknKVxuICAgIC5kaXJlY3RpdmUoJ25vdGlmeScsIG5vdGlmeSlcblxuICAgIG5vdGlmeS4kaW5qZWN0ID0gWydub3RpZnlTZXJ2aWNlJywnJHJvb3RTY29wZScsJyR0aW1lb3V0J11cbiAgICBcblxuZnVuY3Rpb24gbm90aWZ5KCkge1xuXHRyZXR1cm57XG5cdFx0cmVzdHJpY3Q6ICdBRScsXG5cdFx0dGVtcGxhdGU6ICc8bGkgbmctcmVwZWF0PVwiaXRlbSBpbiBub3RpZnlMaXN0XCI+e3tpdGVtfX08L2xpPicsXG5cdFx0bGluazogZnVuY3Rpb24oc2NvcGUsZWxlbWVudCxhdHRycyl7XG5cblx0XHR2YXIgbGkgPSBhbmd1bGFyLmVsZW1lbnQoZWxlbWVudC5jaGlsZHJlbigpWzBdKVxuXHRcdGNvbnNvbGUubG9nKGxpKVxuXHRcdFxuXHRcdGFuaW1hdGVEb3duID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRjb25zb2xlLmxvZygnYW5pbWF0aW5nJylcbiAgICAgICAgICAgICQodGhpcykuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgdG9wOiAnKz05OSdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIGFuaW1hdGVSaWdodCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBcdGNvbnNvbGUubG9nKCdhbmltYXRpbmcnKVxuICAgICAgICAgICAgJCh0aGlzKS5hbmltYXRlKHtcbiAgICAgICAgICAgIFx0XG4gICAgICAgICAgICAgICAgbGVmdDogJys9NTAnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICAkKGxpKS5vbignY2xpY2snLCBhbmltYXRlUmlnaHQpO1xuICAgICAgIC8vICQobGkpLm9uKCdjbGljaycsIGFuaW1hdGVSaWdodCk7ICBcblx0XHQgICAgIFx0XHRcblx0XHRcdFxuXHRcdFx0ICAgIFxuXG5cblxuXHRcdH0sXG5cdFx0Y29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlLG5vdGlmeVNlcnZpY2UsJHJvb3RTY29wZSwkdGltZW91dCl7XG5cdFx0XHRjb25zb2xlLmxvZygnbm90aWZ5IGRpcmVjdGl2ZScpXG5cdFx0XHRcblx0XHRcdCRzY29wZS5ub3RpZnlMaXN0ID0gW1wiZG9nc1wiLFwiY2F0c1wiXTtcdFx0XHRcblxuXHRcdFx0ICRyb290U2NvcGUuJG9uKCdwdXNoZWQnLGZ1bmN0aW9uKGV2ZW50LG1lc3NhZ2Upe1xuXHRcdFx0IFx0Y29uc29sZS5sb2coXCJkaXJlY3RpdmU6IHJlY2VpdmluZ1wiKTtcblx0XHRcdCBcdCRzY29wZS5ub3RpZnlMaXN0LnB1c2gobWVzc2FnZS5kYXRhKTtcblx0XHRcdCBcdFx0XHRcdCBcdCRzY29wZS4kYXBwbHkoKTtcblx0XHRcdCBcdC8vICR0aW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHQgXHQvLyBcdCRzY29wZS5kYXRhID0gbnVsbDtcblx0XHRcdCBcdC8vIH0sMzAwMClcblxuXHRcdFx0IH0pXG5cdFx0XHRcblx0XHR9XG5cdH1cbn0gLy9lbmQgbm90aWZ5IGRpcmVjdGl2ZVxuIiwiKGZ1bmN0aW9uKCl7XG4gICAgJ3VzZSBzdHJpY3QnXG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ25vdGlmeScpXG4gICAgICAgIC5mYWN0b3J5KCdub3RpZnlTZXJ2aWNlJywgbm90aWZ5U2VydmljZSk7XG5cbiAgICBub3RpZnlTZXJ2aWNlLiRpbmplY3QgPSBbJyRyb290U2NvcGUnXVxuXG4gICAgZnVuY3Rpb24gbm90aWZ5U2VydmljZSgkcm9vdFNjb3BlKSB7XG4gICAgICAgIHZhciBzZXJ2aWNlID0ge1xuXG4gICAgICAgICAgICBwdXNoOiBwdXNoLFxuXG5cbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gc2VydmljZTtcblxuICAgICAgICAvLy8vLy8vLy8vLy9cblxuICAgICAgICBmdW5jdGlvbiBwdXNoKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicHVzaGluZyBmcm9tIHNlcnZpY2VcIik7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRlbWl0KFwicHVzaGVkXCIsIG1lc3NhZ2UpO1xuXG4gICAgICAgIH1cblxuXG5cbiAgICB9XG5cbiAgICBcblxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0J3VzZSBzdHJpY3QnXG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ3JlZ2lzdGVyJylcblx0XHQuY29udHJvbGxlcigncmVnaXN0ZXJDdHJsJywgcmVnaXN0ZXJDdHJsKVxuXG5cdHJlZ2lzdGVyQ3RybC5pbmplY3QgPSBbJ3RvYXN0cicsJyRodHRwJywncmVnaXN0ZXJTZXJ2aWNlJ11cblxuXHRmdW5jdGlvbiByZWdpc3RlckN0cmwodG9hc3RyLCRodHRwLHJlZ2lzdGVyU2VydmljZSkge1xuXG5cdCAgICB2YXIgdm0gPSB0aGlzO1xuXG5cdCAgICB2bS5mb3JtID0ge31cblx0ICAgIHZtLnN1Ym1pdFN0YXR1cyA9IFwiXCI7XG5cdCAgICB2bS5zdWJtaXRGb3JtID0gc3VibWl0Rm9ybTtcblx0ICAgIFxuXHQgICAgLy9kaXNwbGF5IGluZm8gb24gbG9hZFxuXHQgICAgaW5mbygpO1xuXG5cdCAgICAvLy8vLy8vLy8vLy9cblxuXHQgICAgZnVuY3Rpb24gc3VibWl0Rm9ybShpc1ZhbGlkKSB7XG5cdCAgICBcdFxuXHQgICAgXHRjb25zb2xlLmxvZyh2bS5mb3JtKTtcblx0ICAgIFx0XG5cdCAgICBcdC8vIGNoZWNrIHRvIG1ha2Ugc3VyZSB0aGUgZm9ybSBpcyBjb21wbGV0ZWx5IHZhbGlkXG5cdFx0ICAgIGlmIChpc1ZhbGlkKSB7XG5cdFx0ICAgICAgY29uc29sZS5sb2coXCJWYWxpZCBGb3JtXCIpO1xuXHRcdCAgICAgIHNlbmRGb3JtKHZtLmZvcm0pO1xuXHRcdCAgICB9XG5cdCAgICB9XG5cblx0ICAgIC8vc2VuZHMgZm9ybSB0byBhcGlcblx0ICAgIGZ1bmN0aW9uIHNlbmRGb3JtKGZvcm0pIHtcblx0XHRcdHJlZ2lzdGVyU2VydmljZS5uZXdVc2VyKHZtLGZvcm0pXG5cdCAgICB9XG5cblx0ICAgIGZ1bmN0aW9uIGluZm8oKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICAgIGNvbnNvbGUubG9nKFwicmVnaXN0ZXIgY29udHJvbGxlclwiKVxuXHQgICAgfVxuXG5cdH1cblxufSkoKTtcblxuXG4iLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgncmVnaXN0ZXInKVxuICAgIC5kaXJlY3RpdmUoJ3JlZ2lzdGVyRGlyJywgcmVnaXN0ZXJEaXIpO1xuXG5mdW5jdGlvbiByZWdpc3RlckRpcigpIHtcblx0cmV0dXJue1xuXHRcdHJlc3RyaWN0OiAnRScsXG5cdFx0dGVtcGxhdGVVcmw6ICcnLFxuXHRcdHJlcGxhY2U6IHRydWVcblx0XHQvLyBzY29wZToge31cblx0fVxufSIsIihmdW5jdGlvbigpe1xuXHQndXNlIHN0cmljdCdcblxuXHRhbmd1bGFyXG4gICAgXHQubW9kdWxlKCdyZWdpc3RlcicpXG4gICAgXHQuZmFjdG9yeSgncmVnaXN0ZXJTZXJ2aWNlJywgcmVnaXN0ZXJTZXJ2aWNlKTtcblxuICAgIHJlZ2lzdGVyU2VydmljZS5pbmplY3QgPSBbJyRodHRwJywndG9hc3RyJywnYXV0aFNlcnZpY2UnLCckc3RhdGUnLCckcm9vdFNjb3BlJ11cblxuICAgIGZ1bmN0aW9uIHJlZ2lzdGVyU2VydmljZSgkaHR0cCx0b2FzdHIsYXV0aFNlcnZpY2UsJHN0YXRlLCRyb290U2NvcGUpIHtcbiAgICBcdHZhciBzZXJ2aWNlID0ge1xuXG4gICAgICAgICAgICBuZXdVc2VyOiBuZXdVc2VyLFxuICAgIFx0XHRlcnJvcjogZXJyb3IsXG4gICAgXHRcdGluZm86IGluZm8sXG4gICAgXHRcdHN1Y2Nlc3M6IHN1Y2Nlc3NcblxuICAgIFx0fTtcblxuICAgIFx0cmV0dXJuIHNlcnZpY2U7XG5cbiAgICBcdC8vLy8vLy8vLy8vL1xuXG4gICAgICAgIGZ1bmN0aW9uIG5ld1VzZXIodm0sIGZvcm0pIHtcbiAgICAgICAgICAgICRodHRwLnBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGkvdXNlcnMvbmV3VXNlcicsIGZvcm0pXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIGF1dGhTZXJ2aWNlLnNldFRva2VuKHJlcy5kYXRhLnRva2VuKTtcblxuICAgICAgICAgICAgICAvL3RvYXN0XG4gICAgICAgICAgICAgIHRvYXN0ci5zdWNjZXNzKCdZb3UgYXJlIG5vdyBteSBCZXRhIScpO1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xuXG4gICAgICAgICAgICAgIC8vY2hhbmdlIHN0YXR1cyBvbiB2aWV3XG4gICAgICAgICAgICAgIHZtLnN1Ym1pdFN0YXR1cyA9IFwiU3VjY2Vzc1wiO1xuICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAvL2VtcHR5IGZvcm1cbiAgICAgICAgICAgICAgdm0uZm9ybSA9IFwiXCI7XG5cbiAgICAgICAgICAgICAgLy9yZWRpcmVjdFxuICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5tZW1iZXJzJyk7XG5cbiAgICAgICAgICAgICAgJHJvb3RTY29wZS4kZW1pdChcImxvZ2dlZEluXCIpO1xuXG4gICAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgICAgdG9hc3RyLmVycm9yKCdGYWlsZWQ6ICcgKyBlcnIuZGF0YSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgXHRmdW5jdGlvbiBlcnJvcigpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gaW5mbygpIHtcblx0ICAgICAgLyogKi9cbiAgICAgICAgICBjb25zb2xlLmxvZyhcInJlZ2lzdGVyU2VydmljZVwiKTtcblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gc3VjY2VzcygpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblxuXG4gICAgfVxuXG5cdFxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCdcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnc2FtcGxlJylcblx0XHQuY29udHJvbGxlcignc2FtcGxlQ3RybCcsIHNhbXBsZUN0cmwpXG5cblx0c2FtcGxlQ3RybC4kaW5qZWN0ID0gW11cblxuXHRmdW5jdGlvbiBzYW1wbGVDdHJsKCkge1xuXG5cdCAgICB2YXIgdm0gPSB0aGlzO1xuXG5cdCAgICB2bS5nb3RvU2Vzc2lvbiA9IGdvdG9TZXNzaW9uO1xuXHQgICAgdm0ucmVmcmVzaCA9IHJlZnJlc2g7XG5cdCAgICB2bS5zZWFyY2ggPSBzZWFyY2g7XG5cdCAgICB2bS5zZXNzaW9ucyA9IFtdO1xuXHQgICAgdm0udGl0bGUgPSAnU2FtcGxlJztcblxuXHQgICAgLy8vLy8vLy8vLy8vXG5cblx0ICAgIGZ1bmN0aW9uIGdvdG9TZXNzaW9uKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiByZWZyZXNoKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBzZWFyY2goKSB7XG5cdCAgICAgIC8qICovXG5cdCAgICB9XG5cdH1cblxufSkoKTtcblxuXG4iLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgnc2FtcGxlJylcbiAgICAuZGlyZWN0aXZlKCdzYW1wbGVEaXInLCBzYW1wbGVEaXIpO1xuXG5mdW5jdGlvbiBzYW1wbGVEaXIoKSB7XG5cdHJldHVybntcblx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdHRlbXBsYXRlVXJsOiAnJyxcblx0XHRyZXBsYWNlOiB0cnVlXG5cdFx0Ly8gc2NvcGU6IHt9XG5cdH1cbn0iLCIoZnVuY3Rpb24oKXtcblx0J3VzZSBzdHJpY3QnXG5cblx0YW5ndWxhclxuICAgIFx0Lm1vZHVsZSgnc2FtcGxlJylcbiAgICBcdC5mYWN0b3J5KCdzYW1wbGVTZXJ2aWNlJywgc2FtcGxlU2VydmljZSk7XG5cbiAgICBzYW1wbGVTZXJ2aWNlLiRpbmplY3QgPSBbXVxuXG4gICAgZnVuY3Rpb24gc2FtcGxlU2VydmljZSgpIHtcbiAgICBcdHZhciBzZXJ2aWNlID0ge1xuXG4gICAgXHRcdGVycm9yOiBlcnJvcixcbiAgICBcdFx0aW5mbzogaW5mbyxcbiAgICBcdFx0c3VjY2Vzczogc3VjY2Vzc1xuXG4gICAgXHR9O1xuXG4gICAgXHRyZXR1cm4gc2VydmljZTtcblxuICAgIFx0Ly8vLy8vLy8vLy8vXG5cbiAgICBcdGZ1bmN0aW9uIGVycm9yKCkge1xuXHQgICAgICAvKiAqL1xuXHQgICAgfVxuXG5cdCAgICBmdW5jdGlvbiBpbmZvKCkge1xuXHQgICAgICAvKiAqL1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwic2FtcGxlU2VydmljZVwiKTtcblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gc3VjY2VzcygpIHtcblx0ICAgICAgLyogKi9cblx0ICAgIH1cblxuXG4gICAgfVxuXG5cdFxuXG59KSgpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
