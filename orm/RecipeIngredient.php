<?php

$path_components = explode('/', $_SERVER['PATH_INFO']);

if($_SERVER['REQUEST_METHOD'] == "GET") {
	header("Content-type: application/json");
	print(json_encode(RecipeIngredient::getAllIngredients()));
	exit;
}

header("HTTP/1.0 400 Bad Request");
print("Did not understand URL");

class RecipeIngredient {
	
	public function getAllIngredients(){
		$conn = new mysqli("classroom.cs.unc.edu", "tlwu", "timisabutt", "tlwudb");
		$result = $conn->query("
			SELECT Ingredient.ingredient_name, Ingredient.measurement
			FROM Ingredient
		");
		
		$ingredients = array();
		
		if($result){
				while($row = $result->fetch_assoc()){
					$ingredients[] = array($row['ingredient_name'], $row['measurement']);	
				}
		}
		
		return $ingredients;
	}
	
	
	
}