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


