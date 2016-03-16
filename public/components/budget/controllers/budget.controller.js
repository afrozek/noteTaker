(function() {
	'use strict'

	angular
		.module('budget')
		.controller('budgetCtrl', budgetCtrl)

	budgetCtrl.$inject = ['$scope','$http','toastr']

	function budgetCtrl($scope, $http, toastr) {
		console.log('loaded budgetCtrl');
	

		 $scope.labels = ["Bills", "Budget", "Remaining"];
  			$scope.data = [300, 500, 200];


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







	}

})()


