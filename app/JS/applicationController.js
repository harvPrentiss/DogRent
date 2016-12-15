angular.module('dogRenting')

.controller('applicationController', applicationController);

applicationController.$inject = ['$scope', '$cookies', 'USER_ROLES', 'AuthService', 'NotifyingService'];

function applicationController($scope, $cookies, USER_ROLES, AuthService, NotifyingService)
{
	$scope.currentUser = null;
	$scope.userRoles = USER_ROLES;
	$scope.isAuthorized = AuthService.isAuthorized;
	$scope.userStatus = "none";
	$scope.loggedIn = false;
	$scope.setCurrentUser = function(user){
		$scope.currentUser = user;		
	};
	$scope.setLogin = function(){
		$scope.userStatus = "login";
	};
	$scope.setRegister = function(){
		$scope.userStatus = "register";
	};
	$scope.setLoggedIn = function(){
		$scope.userStatus = "loggedIn";
		$scope.loggedIn = true;
	};
	$scope.setNone = function(){
		$scope.userStatus = "none";
	};

	NotifyingService.subscribe($scope, function changed(){
		$scope.userStatus = "loggedIn";
		$scope.loggedIn = true;
		$scope.currentUser = $cookies.get('userName');
	});
}