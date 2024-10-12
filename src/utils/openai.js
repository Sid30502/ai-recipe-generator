import axios from "axios";

const API_KEY = "your-openai-api-key";

const generateRecipe = async (ingredients, mealType) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/completions",
      {
        model: "text-davinci-003",
        prompt: `Suggest a recipe for ${mealType} using the following ingredients: ${ingredients.join(", ")}.`,
        max_tokens: 150,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );
    return response.data.choices[0].text;
  } catch (error) {
    console.error("Error generating recipe:", error);
    return "Failed to generate recipe.";
  }
};
 
const getNutritionalInfo = async (recipe) => {
    const response = await axios.get(`https://api.spoonacular.com/recipes/summary?apiKey=YOUR_API_KEY&query=${recipe}`);
    return response.data;
  };
  
const getRecipeImage = async (recipeName) => {
    const response = await axios.get(`https://api.unsplash.com/search/photos?query=${recipeName}&client_id=YOUR_UNSPLASH_API_KEY`);
    return response.data.results[0].urls.small;
  };
  

export default generateRecipe;
