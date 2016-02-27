url_base = "http://wwwp.cs.unc.edu/Courses/comp426-f15/users/tlwu/Codiad/workspace/cs426/Final";

$(document).ready(function () {
	
	$(".categories").select2({
		placeholder: 'Category',
		width: 'resolve'
	});


	$('#findByPriceRange').click(
		function(e) {
			// handle null values for min max and category
			e.preventDefault();
			// ajax here to handle legal values
			var min = $('#min').val();
			var max = $('#max').val();
			localStorage.setItem("min", min);
			localStorage.setItem("max", max);
			window.location.replace("results.html");
			return false;
		}
	);
	
	var load_recipes = function(id) {
		$.ajax(url_base + "/orm/Recipe.php/" + id,
			{type: "GET",
			dataType: "json",
				success: function(recipe_json, status, jqXHR) {
					var recipe = new Recipe(recipe_json);
					$('#searchbar').append(recipe.makeDiv());
				}
			});
	};
	
	var Recipe = function(recipe_json) {
		this.id = recipe_json.id;
		this.name = recipe_json.name;
		this.imageURL = recipe_json.image['image_url'];
		this.category = recipe_json.category;
		this.ingredients = recipe_json.ingredients;
		this.yield = recipe_json.yield;
		this.cost = recipe_json.cost;
	};
	
	Recipe.prototype.makeDiv = function() {
		var div = $("<div class='item  col-xs-4 col-lg-4'></div>");
		// div.appendChild($("<div class='thumbnail'>"));
		div.append(this.name);
		return div;
	};

});