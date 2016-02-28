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

})()


