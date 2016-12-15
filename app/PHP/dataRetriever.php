<?php
	
	/* Functions for the database */
	include_once 'databaseConnector.php';
	//require_once("../config.php");
	$dbConnection;	
	// Checks for a command action being passed to this file
	if(isset($_POST['action']) && !empty($_POST['action'])) {	
	    $action = $_POST['action'];
	    commandRouter($action);
	}
	else{
		echo json_encode("Action Failed");
	}

	// passes control and any needed data to the desired function
	function commandRouter($action){
		switch($action) {
			case 'login' : loginUser(); break;
			case 'createUser': createUser(); break;
			case 'getUser': getUser(); break;			
			case 'deleteUser': deleteUser(); break;
			case 'updateUser': updateUser(); break;			
			default: break;
		}
	}

	// Creates a DatabaseConnection object
	function getConnection(){
		global $dbConnection;
		$dbConnector = new DatabaseConnector();
		$dbConnection = $dbConnector->connect();
		if($dbConnection == "Failed to connect"){
			return json_encode("Connection to the database has failed");
		}
		else{
			return json_encode("Connection successful");
		}
	}
	// Determines if the dbConnection variable has been set yet 
	function connectionExists(){
		global $dbConnection;
		if($dbConnection == null){
			return false;
		}
		else{
			return true;
		}
	}

	function loginUser(){
		global $dbConnection;
		if(!connectionExists()){
			getConnection();
		}
		$errorObject = array();
		$userEmail = $_POST['userEmail'];
		$stmt = $dbConnection->prepare("SELECT * FROM users WHERE email = '$userEmail'");
		$stmt->execute();
		if($stmt->rowCount() > 0){
			$result = $stmt->fetch(PDO::FETCH_ASSOC);
			if(verifyPassword($_POST['userPassword'], $result['passwordHash'])){
				$userData = array();
				$userData['id'] = $result['id'];
				$userData['userName'] = $result['userName'];
				$userData['userEmail'] = $result['email'];
				$userData['dateJoined'] = $result['dateJoined'];
				echo json_encode($userData);
			}
			else{			
				$errorObject['message'] = 'Incorrect password';
				echo json_encode($errorObject);
			}
		}
		else{
			$errorObject['message'] = 'Email does not exist';
			echo json_encode($errorObject);
		}
	}


	function createUser(){
		global $dbConnection;
		if(!connectionExists()){
			getConnection();
		}
		$passwordHash = getSecurePassword($_POST['userPassword']);
		$date = date('Y-m-d H:i:s');
		$userEmail = $_POST['userEmail'];
		$userName = $_POST['userName'];
		$stmt = $dbConnection->prepare("INSERT INTO users (email, userName, passwordHash, dateJoined) VALUES ('$userEmail', '$userName', '$passwordHash', '$date')");
		$stmt->execute();
		$userData = array();
		if($stmt == TRUE){			
			$userData['userName'] = $_POST['userName'];
			$userData['id'] = $dbConnection->lastInsertId();			
		}
		else{
			$userData['userName'] = 'Failure';
			$userData['id'] = -1;
		}
		echo json_encode($userData);
	}

	// Internal functions

	function getSecurePassword($password){
		return password_hash($password, PASSWORD_DEFAULT);
	}

	function verifyPassword($password, $hash){
		return password_verify($password, $hash);
	}

	
	

?>