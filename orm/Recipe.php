<?php

$path_components = explode('/', $_SERVER['PATH_INFO']);

if($_SERVER['REQUEST_METHOD'] == "GET") {
	if((count($path_components) >= 2) &&
		($path_components[1] != "")) {
		
		$recipe_id = intval($path_components[1]);
		$recipe = Recipe::findByID($recipe_id);
		
		if($recipe == null) {
			header("HTTP/1.0 404 Not Found");
			print("Recipe ID: " . $recipe_id . " not found");
			exit();
		}
		
		if(isset($_REQUEST['DELETE'])) {
			// Deny
		}
		
		header("Content-type: application/json");
		print($recipe->getJSON());
		exit();
	}
	
	header("Content-type: application/json");
	$min = $_REQUEST['min']; 
	$max = $_REQUEST['max'];
	print(json_encode(Recipe::findByPriceRange($min, $max)));
	exit;
	
} else if($_SERVER['REQUEST_METHOD'] == "POST") {
	if((count($path_components) >= 2) &&
		($path_components[1] != "")) {
		
		// check if recipe null
		// update JSON recipe by id
	} else {
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
		
		if($category == ""){
		    header("HTTP/1.0 400 Bad Request");
		    print("Bad category");
		    exit();
		}
		
		if(!isset($_REQUEST['ingredients'])) {
		    header("HTTP/1.0 400 Bad Request");
		    print("Missing ingredients");
		    exit();
		}
		
		$ingredients = json_encode($_REQUEST['ingredients']);
		
		
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
		
		$image_url = trim($_REQUEST['imagesrc']);
		
		if(!isset($_REQUEST['yield'])) {
			header("HTTP/1.0 400 Bad Request");
			print("Missing recipe yield");
			exit();
		}
		
		$recipe_yield = intval($_REQUEST['yield']);
	
		require_once('../orm/Category.php');
		$cat_id = Category::getCategoryIDByName($category);
		$img_id = Recipe::insertImage($image_url);
		$recipe_id = Recipe::insertRecipe($cat_id, $img_id, $recipe_name, $recipe_yield);
		
		foreach($ingredients as $ingredient){
			$ingredient_id = Recipe::getIngredientID(mb_strtolower($ingredient[0], 'UTF-8'));
			$ingredient_size = $ingredient[1];
			Recipe::insertRecipeIngredient($recipe_id, $ingredient_id, $ingredient_size);
		}
		
		$success_insert = array();
		$success_alert["success"] = 1;
		
		header("Content-type: application/json");
		print(json_encode($success_insert));
		exit();
	}
}

header("HTTP/1.0 400 Bad Request");
print("Did not understand URL");

class Recipe {
	private $id;
	private $name;
	private $image;
	private $category;
	private $ingredients;
	private $yield;
	private $cost;

	private function __construct($id, $name, $image, $category, $ingredients, $yield, $cost) {
		$this->id = $id;
		$this->name = $name;
		$this->image = $image;
		$this->category = $category;
		$this->ingredients = $ingredients;
		$this->yield = $yield;
		$this->cost = $cost;
	}
	
	public function create($name, $image, $category, $ingredients, $yield, $cost) {
		$conn = new mysqli("classroom.cs.unc.edu", "tlwu", "timisabutt", "tlwudb");
		$recipe_queue = $conn->query("
			INSERT INTO RecipeQueue VALUES(
				0,
				" . "'" . $conn->real_escape_string($name) . "' ,
				" . "'" . $conn->real_escape_string($category) . "' 
			)
		");
		
		if($image['url']) {
			$image_queue = $conn->query("
				INSERT INTO ImageQueue Values(
				0,
				" . "'" . $conn->real_escape_string($image['url']) . "' ,
				0
				)
			");
		}
		
		// check if ingredient in database
		while($row = each($ingredients)) {
			$ingredient_name = $row['name'];
			$ingredient_name_insensitive = $ingredient_name->strtoupper();
			$ingredient_exists = $conn->query("
				SELECT *
				FROM Ingredient
				WHERE UPPER(Ingredient.name) = " . $ingredient_name
			);
			
			if(!$ingredient_exists) {
				$ingredients_queue = $conn->query("
					INSERT INTO IngredientsQueue Values(
						0,
						" . "'" . $conn->real_escape_string($ingredient_name) . "' ,
						" . "'" . $row['serving_size'] . "' ,
						0
					)
				");
			}
		}
		
		// ingredients -> [{ingredient_name, ingredient_serving_size}]


		
		if($result) {
			$id = $conn.insert_id;
			return new Recipe($id, $image, $category, $ingredients, $yield, $cost);
		}
		
		return null;
	}
	
	public function findByPriceRange($min, $max) {
		$conn = new mysqli("classroom.cs.unc.edu", "tlwu", "timisabutt", "tlwudb");
		
		$result = $conn->query("
			SELECT Prices.id
			FROM (SELECT Recipe.id AS id, SUM(Ingredient.ingredient_price 
					* (RecipeIngredient.serving_recipe / Ingredient.ingredient_serving)) AS recipe_price
				 FROM Ingredient, RecipeIngredient, Recipe
				 WHERE Ingredient.id = RecipeIngredient.ingredient_id AND RecipeIngredient.recipe_id = Recipe.id
				 GROUP BY RecipeIngredient.recipe_id) AS Prices
			WHERE Prices.recipe_price >= " . $min . " AND Prices.recipe_price <= " . $max
		);
		
		$ids = array();
		if($result) {
			while($row = $result->fetch_assoc()) {
				$ids[] = intval($row['id']);
			}
		}
		
		return $ids;
	}
	
	public function findByID($id) {
		$conn = new mysqli("classroom.cs.unc.edu", "tlwu", "timisabutt", "tlwudb");
		$info = $conn->query("
			SELECT Recipe.id, Recipe.recipe_name, Category.cat_name, Recipe.recipe_yield
			FROM Recipe, Category
			WHERE Recipe.category_id = Category.id AND Recipe.id = " . $id
		);
		
		
		$image = $conn->query("
			SELECT Image.img_url, Image.img_height, Image.img_width
			FROM Image, Recipe
			WHERE Image.id = Recipe.image_id AND Recipe.id = " . $id
		);
		
		$ingredients = $conn->query("
			SELECT Ingredient.ingredient_name, Ingredient.ingredient_serving, Ingredient.ingredient_price, RecipeIngredient.serving_recipe
			FROM Ingredient, RecipeIngredient
			WHERE RecipeIngredient.ingredient_id = Ingredient.id AND RecipeIngredient.recipe_id = " . $id
		);
			
		// helper query for price calculation
		$servings = $conn->query("
			SELECT Ingredient.ingredient_price, Ingredient.ingredient_serving, RecipeIngredient.serving_recipe
			FROM RecipeIngredient, Ingredient
			WHERE Ingredient.id = RecipeIngredient.ingredient_id AND RecipeIngredient.recipe_id = " . $id 
		);

		if($info) {
			if($info->num_rows == 0) {
				return null;
			}

			$info = $info->fetch_assoc();
			$image_info = array();
				while($row = $image->fetch_assoc()) {
					$image_info[] = $row;
				}
				
			$ingredients_info = array();
				while($row = $ingredients->fetch_assoc()) {
					$ingredients_info[] = $row;
				}
				
			$price = 0;
			while($row = $servings->fetch_assoc()) {
				$price += $row['ingredient_price'] * ($row['serving_recipe'] / $row['ingredient_serving']);
			}

			return new Recipe(
				intval($info['id']),
				$info['recipe_name'],
				$image_info,
				$info['cat_name'],
				$ingredients_info,
				intval($info['recipe_yield']),
				$price
			);
		}

		return null;
	}
	
	public function findAllIDs() {
		$conn = new mysqli("classroom.cs.unc.edu", "tlwu", "timisabutt", "tlwudb");
		$result = $conn->query("
			SELECT id
			FROM Recipe
		");
		
		$ids = array();
		if($result) {
			while($row = $result->fetch_assoc()) {
				$ids[] = intval($row['id']);
			}
		}
		
		return $ids;
	}
	
	public function update() {
		$conn = new mysqli("classroom.cs.unc.edu", "tlwu", "timisabutt", "tlwudb");
		$image_url = $this->image['url'];
		
		// update image
		$result = $conn->query("
			UPDATE Recipe SET
			Recipe.image_id = " . $conn->real_escape_string($image_url) . "
			WHERE Recipe.id = " . $this->id
		);
		
		return $result;
	}
	
	public function getJSON() {
		$json_obj = array(
			'id' => $this->id,
			'name' => $this->name,
			'image' => $this->image,
			'category' => $this->category,
			'ingredients' => $this->ingredients,
			'yield' => $this->yield,
			'cost' => $this->cost
		);
		
		return json_encode($json_obj);
	}
	
	public function setImageURL($url) {
		$this->image['url'] = $url;
		$this->update();
	}
	
	public function insertImage($image_url){
		$conn = new mysqli("classroom.cs.unc.edu", "tlwu", "timisabutt", "tlwudb");
		$result = $conn->query("
			INSERT INTO Image(img_url, img_height, img_width) VALUES('$image_url', NULL , NULL)
		");
		
		$image_id = null;
		
		if($result){
			$image_id = $conn->insert_id;
		}
		
		return $image_id;
	}
	
	public function insertRecipe($cat_id, $img_id, $name, $yield){
		$conn = new mysqli("classroom.cs.unc.edu", "tlwu", "timisabutt", "tlwudb");
		$result = $conn->query("
			INSERT INTO Recipe(recipe_name, category_id, image_id, recipe_yield) VALUES('$name','$cat_id','$img_id','$yield')
		");
		
		$recipe_id = null;
		
		if($result){
			$recipe_id = $conn->insert_id;
		}
		
		return $recipe_id;
	}
	
	public function insertRecipeIngredient($recipe_id, $ingredient_id, $serving_recipe){
		$conn = new mysqli("classroom.cs.unc.edu", "tlwu", "timisabutt", "tlwudb");
		
		$result = $conn->query("
			INSERT INTO RecipeIngredient(ingredient_id, recipe_id, serving_recipe) VALUES('$ingredient_id','$recipe_id','$serving_recipe')
		");
	}
	
	public function getIngredientID($ingredient_name){
		$conn = new mysqli("classroom.cs.unc.edu", "tlwu", "timisabutt", "tlwudb");
		
		$result = $conn->query("
			SELECT id FROM Ingredient
			WHERE ingredient_name='$ingredient_name'
		");
		
		$ingredient_id = null;
		
		if($result){
			$row = $result->fetch_assoc(); 
			$ingredient_id = $row['id'];
			print($ingredient_id);
		}
		
		return $ingredient_id;
	}
}

?>