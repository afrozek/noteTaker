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