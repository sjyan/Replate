<?php

$path_components = explode('/', $_SERVER['PATH_INFO']);

if($_SERVER['REQUEST_METHOD'] == "GET") {
	header("Content-type: application/json");
	print(json_encode(Category::getAllCategories()));
	exit;
}

header("HTTP/1.0 400 Bad Request");
print("Did not understand URL");

class Category {
	private $id;
	private $name;
	
	private function __construct($id, $name){
		$this->id = $id;
		$this->name = $name;
	} 
	
	public function getAllCategories() {
		$conn = new mysqli("classroom.cs.unc.edu", "tlwu", "timisabutt", "tlwudb");
		$result = $conn->query("
			SELECT id, cat_name
			FROM Category
		");
		
		$categories = array();
		
		if($result) {
			while($row = $result->fetch_assoc()){
				$categories[intval($row['id'])] = $row['cat_name'];
			}
		}
		
		return $categories;
	}
	
	public function getCategoryIDByName($name){
		$conn = new mysqli("classroom.cs.unc.edu", "tlwu", "timisabutt", "tlwudb");
		
		$result = $conn->query("
			SELECT id
			FROM Category
			WHERE cat_name='$name'
		");
	
		
		if($result){
			$category = $result->fetch_assoc();
			$category = $category['id'];
		}
		
		return $category;
	}
	
}