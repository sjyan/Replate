<?php

require_once('orm/Recipe.php');
require_once('orm/Category.php');

$path_components = explode('/', $_SERVER['PATH_INFO']);


if ($_SERVER['REQUEST_METHOD'] == "GET") {
  // GET means either instance look up, index generation, or deletion

  // Following matches instance URL in form
  // /recipe.php/<id>
  
  if((count($path_components >=2) && $path_components[1] !="")){
  	
  	//id should be integer
  	$recipe_id = intval($path_components[1]);
  	$recipe = Recipe::findByID($recipe_id);
  	
  	if($recipe == null) {
  		//recipe not in database
  		header("HTTP/1.0 404 Not Found");
  		print("Recipe id: " . $recipe_id . " not found.");
  		exit();
  	}
  	
  	//successful lookup
  	//Generate JSON response
  	header("Content-type: application/json");
  	print($recipe->getJSON());
  	exit();
  }
  
  //id not specified
  // /recipe.php
  header("Content-type: applicaiton/json");
  print(json_encode(Recipe::getALLIDs()));
  exit();
  
} else if ($_SERVER['REQUEST_METHOD'] == "POST") {
	//only handle creating new recipes
	if(!isset($_REQUEST['name'])) {
	    header("HTTP/1.0 400 Bad Request");
	    print("Missing recipe name");
	    exit();
	}
	
	$recipe_name = trim($_REQUEST['name']);
	
	if($recipe_name == ""){
	    header("HTTP/1.0 400 Bad Request");
	    print("Bad title");
	    exit();
	}
	
	if(!isset($_REQUEST['category'])) {
	    header("HTTP/1.0 400 Bad Request");
	    print("Missing category");
	    exit();
	}
	
	$category = trim($_REQUEST['category']);
	
	if(!isset($_REQUEST['ingredients'])) {
	    header("HTTP/1.0 400 Bad Request");
	    print("Missing ingredients");
	    exit();
	}
	
	$ingredients = json_decode($_REQUEST['ingredients']);
	
	//
	
	if($ingredients == null){
	    header("HTTP/1.0 400 Bad Request");
	    print("Empty ingredients");
	    exit();
	}
	
	if(!isset($_REQUEST['imagesrc'])) {
		header("HTTP/1.0 400 Bad Request");
		print("Missing image source");
		exit();
	}
	
	$image_url = $_REQUEST['imagesrc'];
	
	if(!isset($_REQUEST['iwidth'])) {
		header("HTTP/1.0 400 Bad Request");
		print("Missing image width");
		exit();
	}
	
	if(!isset($_REQUEST['iheight'])) {
		header("HTTP/1.0 400 Bad Request");
		print("Missing image height");
		exit();
	}
	
	$image_width = $_REQUEST['iwidth'];
	$image_height = $_REQUEST['iheight'];
	
	if(!isset($_REQUEST['yield'])) {
		header("HTTP/1.0 400 Bad Request");
		print("Missing recipe yield");
		exit();
	}
	
	$yield = $_REQUEST['yield'];
	
	$cat_id = Category::getCategoryIDByName($category);
	var_dump($cat_id);
	
	
	
	//need to get category id
	//need to insert into image and get new id
	//need to insert into recipe and get new id
	//need to insert into recipeingredient 
	
	
// Category (id (PRIMARY), name)
// Ingredient (id (PRIMARY), name, price, serving, measurement)
// Image (id (PRIMARY), url, height, width)
// RecipeIngredient (Junction) (ingredient_id (FOREIGN), recipe_id (FOREIGN), serving_recipe)
// Recipe (id (PRIMARY), category_id (FOREIGN), image_id (FOREIGN), name, yield)
	
	
	
	
	
	
}