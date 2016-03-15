(function() {
	'use strict'

	angular
		.module('budget')
		.controller('budgetCtrl', budgetCtrl)

	budgetCtrl.$inject = ['$scope','$http','toastr']

	function budgetCtrl($scope, $http, toastr) {
		console.log('loaded budgetCtrl');
	

		 $scope.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
  			$scope.data = [300, 500, 100];






	}

})()


