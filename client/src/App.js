import React, { useState, } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import RecipeDetails from './RecipeDetails';
import './App.css';
import logo from './logo.svg'; // Assuming you have a logo

function App() {
  const [formData, setFormData] = useState({
    includeIngredients: '',
    excludeIngredients: '',
    maxTime: '',
    budget: '',
    servings: ''
  });

  const [recipes, setRecipes] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/recipes', formData);
      setRecipes(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleTryAgain = async () => {
    handleSubmit();
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Recipe App</h1>
        </header>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="includeIngredients"
            placeholder="Include Ingredients"
            value={formData.includeIngredients}
            onChange={handleChange}
          />
          <input
            type="text"
            name="excludeIngredients"
            placeholder="Exclude Ingredients"
            value={formData.excludeIngredients}
            onChange={handleChange}
          />
          <input
            type="number"
            name="maxTime"
            placeholder="Max Time"
            value={formData.maxTime}
            onChange={handleChange}
          />
          <input
            type="number"
            name="budget"
            placeholder="Budget"
            value={formData.budget}
            onChange={handleChange}
          />
          <input
            type="number"
            name="servings"
            placeholder="Servings"
            value={formData.servings}
            onChange={handleChange}
          />
          <button type="submit">Find Recipe</button>
        </form>

        <Routes>
          <Route
            path="/"
            element={
              recipes.length > 0 && (
                <div>
                  <h2>Recipes</h2>
                  {recipes.map((recipe) => (
                    <div key={recipe.id}>
                      <h3>
                        <Link to={`/recipe/${recipe.id}`}>{recipe.title}</Link>
                      </h3>
                      <img src={recipe.image} alt={recipe.title} />
                    </div>
                  ))}
                  <button onClick={handleTryAgain}>Try Again</button>
                </div>
              )
            }
          />
          <Route path="/recipe/:id" element={<RecipeDetails recipes={recipes} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

