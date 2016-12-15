angular.module('magicCards')

.controller('inventoryController', inventoryController);

inventoryController.$inject = ['$scope', 'InventoryManager', 'Flash', 'CardRequester', '$location', '$cookies', '$http'];

function inventoryController($scope, InventoryManager, Flash, CardRequester, $location, $cookies, $http)
{
	$scope.inventory;

	$scope.requestData = {
		count : "0",
		cardId : 0,
		action: ''		
	};

	$scope.addCardData = function(cardID){
		$scope.requestData.cardID = cardID;
		$scope.requestData.action = "addInv";
		$scope.inventoryTransaction($scope.requestData);
	};

	$scope.subCardData = function(cardID){
		$scope.requestData.cardID = cardID;
		$scope.requestData.action = "subInv";
		$scope.inventoryTransaction($scope.requestData);
	};

	$scope.inventoryTransaction = function(requestData){
		InventoryManager.modify(requestData).then(function(result){
			if(result.data.result == "Success"){
				Flash.create('success', "The card was successfully added to your inventory!", 'custom-class');
			}
			else{
				Flash.create('danger', "The card was not added to your inventory because" + result.data.result + ".", 'custom-class');
			}
		});
	};

	$scope.getInventory = function(){
		var invReqData = {
			action:'getInv',
			userId : $cookies.get('userId')
		};
		$http({
			method: 'POST',
			url:'app/PHP/dataRetriever.php',
			data: invReqData
		})
		.then(function(res){
			var options = res.data;
			var optionString = "cards?";
			for(var i = 0; i < options.length; i++){
				optionString += "multiverseid=" + options[i].cardId + "&";
			}
			CardRequester.makeRequest(optionString).then(function(data){
				$scope.inventory = data;
				console.log($scope.inventory);
				// Loop through inventory and match the count to the id.
				for(var j = 0; j < $scope.inventory.length; j++){
					for(var k = 0; k < options.length; k++){
						if($scope.inventory[j].editions[0].multiverse_id == options[k].cardId){
							$scope.inventory[j].count = options[k].count;
						}
					}
				}
				console.log($scope.inventory);
			});
		});		
	};

	$scope.getImageSource = function(editions){
		for(var i = 0; i < editions.length; i++){
			if(editions[i].image_url != "https://image.deckbrew.com/mtg/multiverseid/0.jpg"){
				return editions[i].image_url;
			}
		}

		return "https://image.deckbrew.com/mtg/multiverseid/0.jpg";
	}

	if($location.path() == "/myCards"){
		$scope.getInventory();
	}
}