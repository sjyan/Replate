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
	div.appendChild($("<div class='thumbnail'>"));
	div.append(this.name);
};

/*
<div class="item  col-xs-4 col-lg-4">
    <div class="thumbnail">
        <img class="group list-group-image" src="http://placehold.it/400x250/000/fff" alt="" />
        <div class="caption">
            <h4 class="group inner list-group-item-heading">
                Recipe Name</h4>
			<div class="group inner panel-group pull-right ingredients">
			  <div class="panel panel-info">
			    <div class="panel-heading clickable" id="panel1">
			      <h4 class="panel-title" data-toggle="collapse" data-target="#collapse1">
			        Ingredients List
			        <span class="pull-right"><i class="glyphicon glyphicon-chevron-down"></i></span>
			      </h4>
			    </div>
			    <div id="collapse1" class="panel-collapse collapse">
			      <ul class="list-group">
			        <li class="list-group-item">
			        	<span class="badge"> 2 cups</span>
			        	Ingredient 1
			        </li>
			        <li class="list-group-item">
			        	<span class="badge"> 1 lbs</span>
			        	Ingredient 2
			        </li>
			        <li class="list-group-item">
			        	<span class="badge"> $ 0.90</span>
			        	Ingredient 3
			        </li>
			        <li class="list-group-item">
			        	<span class="badge"> $ 0.90</span>
			        	Ingredient 3
			        </li>
			        <li class="list-group-item">
			        	<span class="badge"> $ 0.90</span>
			        	Ingredient 3
			        </li>
			        <li class="list-group-item">
			        	<span class="badge"> $ 0.90</span>
			        	Ingredient 3
			        </li>
			      </ul>
			    </div>
			  </div>
			</div>
            <div class="row">
                <div class="col-xs-12 col-md-6 pull-right">
                    <p class="lead">
                        $21.000
                        <span class="label label-success pull-right">Category</span>	
                     </p>
                </div>
            </div>
        </div>
    </div>
</div>
*/
