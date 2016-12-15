angular.module('magicCards')

.controller('homeController', homeController);

homeController.$inject = ['$scope'];

function homeController($scope, USER_ROLES, AuthService)
{
	$scope.message = "Welcome";
	
}