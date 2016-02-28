(function() {
	'use strict'

	angular
		.module('app')
		.controller('appCtrl', appCtrl)

	appCtrl.$inject = ['sampleService','authService','$state','$http','toastr','$rootScope']

	function appCtrl(sampleService,authService,$state, $http, toastr, $rootScope) {

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

	} //end appCtrl

})()


