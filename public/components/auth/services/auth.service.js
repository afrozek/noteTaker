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


