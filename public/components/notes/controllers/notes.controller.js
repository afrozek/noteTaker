(function() {
	'use strict'

	angular
		.module('notes')
		.controller('notesCtrl', notesCtrl)

	notesCtrl.$inject = ['notesService','$scope','$http','toastr']

	function notesCtrl(notesService,$scope, $http, toastr) {
		var vm = this;
		console.log("notes ballsout");

		//console.log( notesService.getNotes() )
		
	    
	    $scope.note1 = "aldsjflkasdj";
	    console.log($scope.note1);
	  	$scope.tinymceOptions = {
		    plugins: 'link image code',
		    toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code | paste'
		  };

		$scope.title = "ratsts";
		$scope.dogs ="froadsasdfadsgs"
		vm.tinymceModel = 'Initial consdsdtent';

		vm.allNotes = [
			{title:"gulp cheat sheet",content:"nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula q"},
			{title:"javascript",content:"nonummy nibh euismod tincidunt ut laoreet dolore magna m consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula q"}

		]

		vm.activeNotes = [];


  $scope.getContent = function() {
    console.log('Editor content:', $scope.tinymceModel);
  };

  $scope.setContent = function() {
    $scope.tinymceModel = 'Time: ' + (new Date());
  };

  $scope.tinymceOptions = {
    plugins: 'link image code',
    toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code'
  };



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


