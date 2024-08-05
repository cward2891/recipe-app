const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;
const SPOONACULAR_API_KEY = '102527709cfd4f53a084cd643c23374d';
const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com';

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'build')));

app.post('/api/recipes', async (req, res) => {
  const { includeIngredients, excludeIngredients, maxTime, budget, servings } = req.body;

  try {
    const response = await axios.get('https://api.spoonacular.com/recipes/complexSearch', {
      params: {
        includeIngredients,
        excludeIngredients,
        maxReadyTime: maxTime,
        maxPrice: budget,
        number: servings,
        apiKey: SPOONACULAR_API_KEY
      }
    });
    res.json(response.data.results);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Proxy endpoint to get recipes
app.get('/api/recipes', async (req, res) => {
  try {
    const response = await axios.get(`${SPOONACULAR_BASE_URL}/recipes/random?number=10&apiKey=${SPOONACULAR_API_KEY}`);
    res.json(response.data.recipes);
  } catch (error) {
    res.status(500).send('Error fetching recipes');
  }
});

// Proxy endpoint to get a specific recipe by ID
app.get('/api/recipes/:id', async (req, res) => {
  const recipeId = req.params.id;
  try {
    const response = await axios.get(`${SPOONACULAR_BASE_URL}/recipes/${recipeId}/information?apiKey=${SPOONACULAR_API_KEY}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error fetching recipe details');
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
