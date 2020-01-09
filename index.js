 import React, { Component } from "react";
import { render } from "react-dom";
import "./style.css";
class App extends Component {
  constructor() {
    super();
    this.state = {
      find: "",
      recipy: {},
      image: "",
      loadstate: null
    };
  }
  setName = event => {
    this.setState({
      find: event.target.value
    });
  };
  getRecipee = async () => {
    this.setState({
      loadstate: "Loading"
    });
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${this.state.find}`
    );
    const myJson = await response.json();
    console.log("myJson", myJson);
    if (myJson.meals == null) {
      this.setState({
        loadstate: "Loading_Failed"
      });
    }
    var ingredients = myJson.meals.map(this.getIngredients);
    var measures = myJson.meals.map(this.getMeasuress);
    this.setState({
      recipy: myJson.meals[0],
      image: myJson.meals[0].strMealThumb,
      loadstate: "Loading_Done",
      ingredients: ingredients,
      measures: measures
    });
    console.log(this.state.recipy);
  };
  
  toggleKu = event => {
    if (event.target.style.color == "black") event.target.style.color = "red";
    else event.target.style.color = "black";
  };
  getIngredients = object => {
    var keys = Object.keys(object);
    console.log(keys);
    var ingredients = [];
    for (var i = 0; i < keys.length; i++) {
      if (keys[i].indexOf("strIngredient") != -1) {
        if (object["" + keys[i]] != null && object["" + keys[i]].length > 0)
          ingredients.push(object["" + keys[i]]);
      }
    }
    console.log(ingredients);
    return ingredients;
  };
  
  getMeasuress = object => {
    var keys = Object.keys(object);
    console.log(keys);
    var measures = [];
    for (var i = 0; i < keys.length; i++) {
      if (keys[i].indexOf("strMeasure") != -1) {
        if (object["" + keys[i]] != null && object["" + keys[i]].length > 0)
          measures.push(object["" + keys[i]]);
      }
    }
    console.log(measures);
    return measures;
  };

  printIngredients = (value, index) => {
    console.log(this.state);
    return (
      <p>
        {value} ---- {this.state.measures[0][index]}
      </p>
    );
  };
  render() {
    return (
      <div id="parent">
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.2/css/all.css"
        />
        <div id="header">
          <h1 id="head">Recipe Finder</h1>
          <center>
            <input
              onChange={() => this.setName(event)}
              value={this.state.find}
              placeholder="Enter the Name of the Dish"
            />
            <span>
              <button onClick={this.getRecipee}>Get Recipes</button>
            </span>
            <br />
            <br />
            {this.state.loadstate == null ? (
              <h2>Type a Dish Name to find for it's ingredients</h2>
            ) : (
              ""
            )}
          </center>
        </div>
        {this.state.loadstate == "Loading_Failed" ? (
          <h1>No Data Has been received.</h1>
        ) : (
          ""
        )}
        {this.state.loadstate == "Loading" ? <h1>Loading....</h1> : ""}
        {this.state.loadstate == "Loading_Done" ? (
          <div id="container">
            <div id="header1">
              <div />
              <div>
                <h1 id="main">{this.state.recipy.strMeal}</h1>
              </div>
              <div>
                <i
                  id="heart"
                  className="far fa-heart"
                  onClick={this.toggleKu}
                />
              </div>
            </div>
            <div id="description">
              <div id="left">
                <img src={this.state.image} />
              </div>
              <div id="right">
                <i>Category of the Meal - </i>
                {this.state.recipy.strCategory}
                <br />
                <i>Area of the Meal - </i>
                {this.state.recipy.strArea}
                <br />
                <br />
                <i>Ingredients</i>
                <div id="ingredient">
                  {this.state.ingredients[0].map(this.printIngredients)}
                </div>
                <i>
                  <center>Recipe</center>
                </i>
                <div id="recipe">{this.state.recipy.strInstructions}</div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}
render(<App />, document.getElementById("root"));
