url_base = "http://wwwp.cs.unc.edu/Courses/comp426-f15/users/tlwu/Codiad/workspace/cs426/Final";

$(document).ready(function () {
	
	var price = -1;
	var name = -1;
	
	var priceOn = false;
	var nameOn = false;
	
	$('#list').click(function(event) {
		event.preventDefault();
		$(".ingredients").css("width", "66.5%");
		$('#recipelist .item').addClass('list-group-item');
	});
	
    $('#grid').click(function(event) {
    	event.preventDefault();
    	$(".ingredients").css("width", "100%");
    	$('#recipelist .item').removeClass('list-group-item');
    	$('#recipelist .item').addClass('grid-group-item');
    });
	
	$('#relevance').click(function(event) {
		
		if (priceOn) {
			$('#price').find('span').removeClass();
    		$('#price').find('span').addClass("glyphicon glyphicon-sort");
    		price = -1;
		}
		
		if (nameOn) {
			$('#name').find('span').removeClass();
    		$('#name').find('span').addClass("glyphicon glyphicon-sort");
    		name = -1;
		}
			
	});
	
    $('#name').click(function(event) {
    	event.preventDefault();
    	
    	var span = $(this).find('span');
    	
    	if (priceOn) {
    		$('#price').find('span').removeClass();
    		$('#price').find('span').addClass("glyphicon glyphicon-sort");
    		price = -1;
    	}
    	
    	if (name < 0) {
    		span.removeClass("glyphicon glyphicon-sort");
    		span.addClass("glyphicon glyphicon-sort-by-alphabet");
    		nameOn = true;
    		name++;
    	} else if (name === 0) {
    		span.removeClass("glyphicon glyphicon-sort-by-alphabet");
    		span.addClass("glyphicon glyphicon-sort-by-alphabet-alt");
    		name++;
    	} else {
    		span.removeClass("glyphicon glyphicon-sort-by-alphabet-alt");
    		span.addClass("glyphicon glyphicon-sort");
    		nameOn = false;
    		name = -1;
    	}
    });
    
    $('#price').click(function(event) {
    	event.preventDefault();
    	
    	var span = $(this).find('span');
    	
    	if (nameOn) {
    		$('#name').find('span').removeClass();
    		$('#name').find('span').addClass("glyphicon glyphicon-sort");
    		name = -1;
    	}
    	
    	if (price < 0) {
    		span.removeClass("glyphicon glyphicon-sort");
    		span.addClass("glyphicon glyphicon-sort-by-attributes");
    		priceOn = true;
    		price++;
    	} else if (price === 0) {
    		span.removeClass("glyphicon glyphicon-sort-by-attributes");
    		span.addClass("glyphicon glyphicon-sort-by-attributes-alt");
    		price++;
    	} else {
    		span.removeClass("glyphicon glyphicon-sort-by-attributes-alt");
    		span.addClass("glyphicon glyphicon-sort");
    		priceOn = false;
    		price = -1;
    	}
    });
	
	$('.panel-collapse').on('shown.bs.collapse', function() {
		$('#panel1').find('i').removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
	});
	
	$('.panel-collapse').on('hidden.bs.collapse', function() {
		$('#panel1').find('i').removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
	});
	
	$.ajax(url_base + "/orm/Recipe.php?min=" + localStorage.getItem("min") + "&max=" + localStorage.getItem("max"),
		{type: "GET",
		dataType: "json",
			success: function(recipe_ids, status, jqXHR) {
				for(var i = 0; i < recipe_ids.length; i++) {
					console.log(recipe_ids[i]);
					load_recipes(recipe_ids[i]);
				}
			}
	});
	
	var load_recipes = function(id) {
		$.ajax(url_base + "/orm/Recipe.php/" + id,
			{type: "GET",
			dataType: "json",
				success: function(recipe_json, status, jqXHR) {
					var recipe = new Recipe(recipe_json);
					$('#recipelist').append(recipe.makeDiv());
				}
			});
	};

});

var Recipe = function(recipe_json) {
	this.id = recipe_json.id;
	this.name = recipe_json.name;
	this.imageURL = recipe_json.image[0]['img_url'];
	this.category = recipe_json.category;
	this.ingredients = recipe_json.ingredients;
	this.yield = recipe_json.yield;
	this.cost = recipe_json.cost;
};

Recipe.prototype.makeDiv = function() {
	
	var ingredient_list = [];
	for(var i = 0; i < this.ingredients.length; i++) {
		ingredient_list.push({
			name: this.ingredients[i]['ingredient_name'],
			price: this.ingredients[i]['serving_recipe'] / this.ingredients[i]['ingredient_serving'] *
						this.ingredients[i]['ingredient_price']
		});
	}
	
	// var id = this.id;
	
	// var list = $('#list[id=' + id + ']');
	// var list = document.getElementById('list' + this.id);
	for(var i = 0; i < ingredient_list.length; i++) {
		$('.list-group').append('<li class="list-group-item"><span class="badge">$' + ingredient_list[i].price.toFixed(2)  + '</span>' + ingredient_list[i].name +'</li>');
	}
	

	var div = $("<div class='item  col-xs-4 col-lg-4'> id='" + this.id + "'").append(
	$("<div class='thumbnail'>").append(
		$("<img class='group list-group-image no-resize' src='" + this.imageURL + "' width='400' height='250'>"),
		$("<div class='caption'>").append(

			$("<h4 class='group inner list-group-item-heading'>" + this.name + "</h4>"),
			$("<div class='group inner panel-group pull-right ingredients'>").append(

				$("<div class='panel panel-info'>").append(
					$("<div class='panel-heading clickable' id='panel" + this.id + "'>").append(
						$("<h4 class='panel-title' data-toggle='collapse' data-target='#collapse" + this.id + "'>Ingredients List</h4>").append(
							$("<span class='pull-right'>").append(
								$("<i class='glyphicon glyphicon-chevron-down'>")))),

					$("<div id='collapse" + this.id + "' class='panel-collapse collapse'>").append(
						$("<ul class='list-group' id='list" + this.id + "' >"))
					)),

			$("<div class='row'>").append(
				$("<div class='col-xs-12 col-md-6 pull-right'>").append(
					$("<p class='lead'>$" + this.cost.toFixed(2) + " </p>").append(
						$("<span class='label label-success pull-right'>" + this.category + "</span>")))))));
	
	// var div = $("<div  id='" + this.id + "' class='item  col-xs-4 col-lg-4''></div>").append(
	// 				$("<div class='thumbnail'></div>").append(
	// 					$("<img class='group list-group-image' src='" + this.imageURL + "' alt='' />") ,
	// 						$("<div class='caption'></div>").append(
	// 							$("<h4 class='group inner list-group-item-heading'>" + this.name + "</h4>").append(
	// 							    $("<span class='pull-right'>").append(
	// 							        $("<i class='glyphicon glyphicon-chevron-down'>"))))));
	
	// 	div.append($("<div class='caption'></div>").append(
	// 		$("<h4 class='group inner list-group-item-heading'>" + this.name + "</h4>")));
	// div.append($("<div class='group inner panel-group pull-right ingredients'></div>").append(
	// 				$("<div class='panel panel-info'></div>")).append(
	// 					$("<div class='panel-heading clickable' id='panel1'></div>").append(
	// 						$("<h4 class='panel-title' data-toggle='collapse' data-target='#collapse1'>Ingredients List" +
	// 						"<span class='pull-right'><i class='glyphicon glyphicon-chevron-down'></i></span></h4>"))));
	// div.append($("<div id='collapse1' class='panel-collapse collapse'>").append(
	// 				$("<ul class='list-group'>")));
	
					
	/*
	var html = "	<div id='recipelist'> " +
						"<div class='item  col-xs-4 col-lg-4'>'"+
				           " <div class='thumbnail'>" +
				                "<img class='group list-group-image' src=' <<< RECIPE IMAGE>>>' alt='' />" +
				                "<div class='caption'>" +
				                   " <h4 class='group inner list-group-item-heading'>" +
				                     "   <<< RECIPE NAME >>> </h4> " +
									"<div class='group inner panel-group pull-right ingredients'>" +
									  "<div class='panel panel-info'>" +
									    "<div class='panel-heading clickable' id='panel1'>" +
									      "<h4 class='panel-title' data-toggle='collapse' data-target='#collapse1'>" +
									        "Ingredients List <<< INGREDIENT LIST >>>" +
									        "<span class='pull-right'><i class='glyphicon glyphicon-chevron-down'></i></span>"+
									    "  </h4>" +
									   " </div>" +
									    "<div id='collapse1' class='panel-collapse collapse'>" +
									      "<ul class='list-group'>" +
									       " <li class='list-group-item'>" +
									        	<span class='badge'> <<< INGREDIENT_1 COST >>></span>
									        	<<< INGREDIENT_1 NAME >>>
									        </li>
									      </ul>
									    </div>
									  </div>
									</div>
				                    <div class='row'>
				                        <div class='col-xs-12 col-md-6 pull-right'>
				                            <p class='lead'>
				                                <<< RECIPE_TOTAL_COST >>>
				                                <span class='label label-success pull-right'><<< RECIPE CATEGORY >>> </span>	
				                             </p>
				                        </div>
				                    </div>
				                </div>
				            </div>
						</div>
				';
				
	*/
	return div;
};



				