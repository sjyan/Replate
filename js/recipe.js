$(document).ready( function() {
	var InputField = React.createClass(
		{
			render: function() {
				var labelName = this.props.labelName;
				var defaultValue = this.props.defaultValue;
				return (
					<div className={this.props.className}>
						<label>{labelName}</label>
						<input 
							className="form-control"
							placeholder={labelName}
							onChange={this.props.save}
							id={this.props.id}
						/>
					</div>
				);
			}
		}
	);
	
	var Categories = React.createClass(
		{
			render: function() {
				return (
					<select className={this.props.className} onChange={this.props.save} id={this.props.id}>
						{this.props.categories.map(function(cat, i){
							return (
								<option value={cat}> 
									{cat}
								</option>
							)
						})}
					</select>
				)
			}
		}
	);
	
	var IngredientRow = React.createClass(
		{
			render: function () {
				var ingredientsAvailable = this.props.ingredientsAvailable;
				var ingredientAdded = this.props.ingredientAdded;
				var id = this.props.id;
				if (this.props.id == "newRow") {
					return (
						<div>
							<input onChange={this.props.addRow} id="input" value={""}>
							</input>
							<label>
								cup
							</label>
							<select onChange={this.props.addRow} id="select" select={"butter,cup"}>
								{ingredientsAvailable.map(function(ingr, i){
									return (
										<option value={ingr}>
											{ingr[0]}
										</option>
									)
								})}
							</select>
						</div>
					)
				} else {
					return (
						<div>
							<input id={id} className="input" onChange={this.props.save} value={ingredientAdded['input']}>
								
							</input>
							<label>
								{ingredientAdded['select'].substr(ingredientAdded['select'].indexOf(",") + 1)}
							</label>
								<select id={id} className="select" selected={ingredientAdded[select]} onChange={this.props.save}>
								{ingredientsAvailable.map(function(ingr, i){
									return (
										<option value={ingr}> 
											{ingr[0]}
										</option>
									)
								})}
							</select>
						</div>
					)
				}
			}
		}
	);
	
	var Ingredients = React.createClass(
		{
			render: function() {
				var ingredientsAvailable = this.props.ingredientsAvailable;
				var ingredientsAdded = this.props.ingredientsAdded;
				return (
					<div className={this.props.className}>
						<label>Ingredients</label>
						{ingredientsAdded.map(function(ingredient, i) {
							return (
								<IngredientRow
									ingredientsAvailable={this.props.ingredientsAvailable}
									ingredientAdded={ingredient}
									id={i}
									save={this.props.save}
								/>
							)	
						}.bind(this))}
						<IngredientRow
							ingredientsAvailable={this.props.ingredientsAvailable}
							addRow={this.props.addRow}
							id="newRow"
						/>
					</div>
				)
			}
		}
	);
	
	var Form = React.createClass(
		{
			componentDidMount: function() {
				var cats = [];
				$.get(this.props.getCategories, function(result) {
					if (this.isMounted()) {
						for (var key in result) {
							if (result.hasOwnProperty(key)) {
								cats.push(result[key]);
							}
						}
						this.setState({
							categories: cats	
						});		
					}
				}.bind(this));
				
				var ingr = []
				$.get(this.props.getIngredients, function(result) {
					result.map(function(ingredientUnitsPair) {
						ingr.push(ingredientUnitsPair);
					});
					this.setState({
						ingredientsAvailable: ingr
					});
				}.bind(this))
			
			},
			
			addRow: function(event) {
				var newRow = {};
				if (event.target.id == "input") {
					newRow['input'] = event.target.value;
					newRow['select'] = "butter,cup"
				} else if (event.target.id == "select") {
					newRow['select'] = event.target.value;
					newRow['input'] = "";
				}
				this.setState(function(state) {
					state.ingredientsAdded.push(newRow);
				});
			},
			
			save: function(event) {
				this.setState(function(state) {
					if (event.target.id == 'imageUrl') {
						state.imageUrl = event.target.value;
					} else if (event.target.id == 'name') {
						state.name = event.target.value;
					} else if (event.target.id == 'category') {
						state.category = event.target.value;
					} else if (event.target.id == 'yield') {
						state.yield = event.target.value;
					} else {
						state.ingredientsAdded[event.target.id][event.target.className]	= event.target.value;
					}		
				});
				// console.log(this.state)
				// var s = {data : this.state.ingredientsAdded}
				// console.log($.param(s))
			},
			
			getInitialState: function() {
				return {
					name: "",
					imageUrl: "",
					category: "",
					categories: [],
					ingredientsAvailable: [],
					ingredientsAdded: [],
					yield: ""
				}	
			},
			
			submit: function(e) {
				var ingredientsData = [];
				this.state.ingredientsAdded.map(function(ingredient) {
					var ingredientName = ingredient['select'].substring(0,ingredient['select'].indexOf(","));
					var ingredientTuple = [];
					ingredientTuple.push(ingredientName);
					ingredientTuple.push(ingredient['input'] || 0);
					ingredientsData.push(ingredientTuple);
				});
				
				ingredientsData = JSON.stringify(ingredientsData);
				var data = {
    				name: this.state.name,
    				category: this.state.category,
    				imagesrc: this.state.imageUrl,
    				yield: this.state.yield,
    				ingredients: ingredientsData
  				}
  				$.ajax({
				    type: 'POST',
				    url: 'http://wwwp.cs.unc.edu/Courses/comp426-f15/users/tlwu/Codiad/workspace/cs426/Final/orm/Recipe.php',
				    data: data
				 }).fail(function(e){
				 	console.log(e)
				 });
			},
			
			render: function() {
				return (
				<form className="form-inline" onSubmit={this.submit}>
					<h1 className="jumbotron">Submit your Recipe here!</h1>
					<InputField 
						id="name"
						className="form-group"
						save={this.save}
						labelName="Recipe Name"
					/>
					<br/>
					<InputField 
						id="imageUrl"
						save={this.save}
						className="form-group"
						labelName="Image URL"
					/>
					<br/>
					<label>Category</label>
					<Categories 
						save={this.save}
						id="category"
						categories={this.state.categories}
						className="categories form-control"
					/>	
					<br/>
					<Ingredients
						ingredientsAdded={this.state.ingredientsAdded}
						ingredientsAvailable={this.state.ingredientsAvailable}
						addRow={this.addRow}
						save={this.save}
					/>
					<br/>
					<InputField
						id="yield"
						save={this.save}
						labelName="Servings Per Recipe"
						className="form-group"
					/>
					<br/>
					<button className="btn btn-default">
						Submit Request
					</button>
				</form>
				)
			}
		}
	);
	ReactDOM.render(<Form 
			getCategories="http://wwwp.cs.unc.edu/Courses/comp426-f15/users/tlwu/Codiad/workspace/cs426/Final/orm/Category.php"
			getIngredients="http://wwwp.cs.unc.edu/Courses/comp426-f15/users/tlwu/Codiad/workspace/cs426/Final/orm/RecipeIngredient.php"/>,
			document.getElementById("target"));	
});