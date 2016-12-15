angular.module('dogRenting')

.controller('registrationController', registrationController);

registrationController.$inject = ['$scope', '$rootScope', 'AUTH_EVENTS', 'RegService', 'Flash'];

function registrationController($scope, $rootScope, AUTH_EVENTS, RegService, Flash)
{
	$scope.registrationData = {
		userEmail: '',
		userName: '',
		userPassword: '',
		action: 'createUser'
	};

	$scope.register= function(registrationData){
		RegService.register(registrationData).then(function (user){
			$rootScope.$broadcast(AUTH_EVENTS.registrationSuccess);
			$scope.setCurrentUser(user);
			$scope.setLoggedIn(user);
			Flash.create('success', "You have registered successfully!", 'custom-class');
		}, function() {
			$rootScope.$broadcast(AUTH_EVENTS.registrationFailed);
		});
	}
}