angular
    .module('notify')
    .directive('notify', notify)

    notify.$inject = ['notifyService','$rootScope','$timeout']
    

function notify() {
	return{
		restrict: 'AE',
		scope: {
			// notes: "=",
			// newItem: "="
		},
		replace: false,
		transclude: false,
		// templateUrl: "components/notes/views/note.directive.view.html",
		template: "<h1>{{data}}</h1>",
		link: function(scope,element,attrs){

			// scope.dogs = function(note){
			// 	console.log(note)
			// }   

		   console.log(element)


		},
		controller: function($scope,notifyService,$rootScope,$timeout){
			console.log('notify directive')
			$scope.data = null;			

			 $rootScope.$on('pushed',function(event,message){
			 	console.log("directive: receiving");
			 	$scope.data = message.data;
			 	$scope.$apply();
			 	$timeout(function(){
			 		$scope.data = "";
			 	},3000)
			 })
			
		}
	}
} //end notify directive
