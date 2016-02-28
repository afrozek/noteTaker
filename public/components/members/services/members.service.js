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

	

})()
