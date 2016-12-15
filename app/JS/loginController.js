angular.module('dogRenting')

.controller('loginController', loginController);

loginController.$inject = ['$scope', '$rootScope', 'AUTH_EVENTS', 'AuthService'];

function loginController($scope, $rootScope, AUTH_EVENTS, AuthService)
{
	$scope.credentials = {
		userEmail: '',
		userPassword: '',
		action: 'login'
	};

	$scope.login = function(credentials){
		AuthService.login(credentials).then(function (user){
			$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
			$scope.setCurrentUser(user);
			$scope.setLoggedIn();
		}, function() {
			$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
		});
	}

}