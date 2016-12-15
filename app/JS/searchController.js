angular.module('magicCards')

.controller('userController', userController);

function userController($scope, CardRequester)
{
	$scope.title = "Dog Rent";
	$scope.userName = '';
	
	
}