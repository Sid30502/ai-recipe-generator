import React, { useState } from "react";
import generateRecipe from "../utils/openai";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const RecipeGenerator = () => {
  const [ingredients, setIngredients] = useState([]);
  const [input, setInput] = useState("");
  const [recipe, setRecipe] = useState("");
  const [mealType, setMealType] = useState("Breakfast");
  const [favorites, setFavorites] = useState([]);
  const [nutritionInfo, setNutritionInfo] = useState(null);
  const [shoppingList, setShoppingList] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [weeklyPlan, setWeeklyPlan] = useState({});

  const handleAddIngredient = () => {
    if (input.trim()) {
      setIngredients([...ingredients, input.trim()]);
      setInput("");
    }
  };

  const handleGenerateRecipe = async () => {
    const result = await generateRecipe(ingredients, mealType);
    setRecipe(result);
    const nutrition = await getNutritionInfo(result); // Assuming getNutritionInfo is a function that fetches nutrition info
    setNutritionInfo(nutrition);
    const image = await recipeImage(result); // Assuming recipeImage is a function that fetches the image
    setRecipeImage(image);
  };

  const handleSaveFavorite = () => {
    if (recipe) setFavorites([...favorites, recipe]);
  };

  const handleVoiceInput = () => {
    const recognition = new window.SpeechRecognition();
    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setInput(spokenText);
    };
    recognition.start();
  };

  const addToShoppingList = (ingredient) => {
    setShoppingList([...shoppingList, ingredient]);
  };
  const generateWeeklyPlan = async () => {
    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    const plan = {};
    for (const day of days) {
      plan[day] = await generateRecipe(ingredients, "Lunch");
    }
    setWeeklyPlan(plan);
  };

  const firebaseConfig = {
    apiKey: "your-firebase-api-key",
    authDomain: "your-project-id.firebaseapp.com",
  };
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  const handleShareRecipe = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Check out this recipe!",
        text: recipe,
        url: window.location.href,
      });
    } else {
      alert("Sharing is not supported on this device.");
    }
  };

  const provider = new GoogleAuthProvider();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      // User signed in successfully
      const user = result.user;
      console.log("User info:", user);
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const Login = () => {
    const provider = new GoogleAuthProvider();
  
    const handleLogin = async () => {
      try {
        const result = await signInWithPopup(auth, provider);
        // User signed in successfully
        const user = result.user;
        console.log("User info:", user);
      } catch (error) {
        console.error("Error during login:", error);
      }
    };
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-5">AI Recipe Generator</h1>

      <div className="mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-2 rounded mr-2"
          placeholder="Enter an ingredient"
        />
        <button
          onClick={handleAddIngredient}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Ingredient
        </button>
      </div>

      <div className="mb-4">
        <h2 className="text-xl">Ingredients:</h2>
        <ul className="list-disc pl-6">
          {ingredients.map((ing, index) => (
            <li key={index}>{ing}</li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <label className="block text-lg mb-2">Select Meal Type:</label>
        <select
          value={mealType}
          onChange={(e) => setMealType(e.target.value)}
          className="border p-2 rounded"
        >
          <option>Breakfast</option>
          <option>Lunch</option>
          <option>Dinner</option>
          <option>Snack</option>
        </select>
      </div>

      <button
        onClick={handleGenerateRecipe}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
      >
        Generate Recipe
      </button>

      {recipe && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Generated Recipe:</h2>
          <p className="bg-gray-100 p-4 rounded">{recipe}</p>
          <button
            onClick={handleSaveFavorite}
            className="bg-yellow-500 text-white px-4 py-2 rounded mt-2"
          >
            Save to Favorites
          </button>
        </div>
      )}

      {favorites.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold">Favorite Recipes:</h2>
          <ul className="list-disc pl-6">
            {favorites.map((fav, index) => (
              <li key={index}>{fav}</li>
            ))}
          </ul>
        </div>
      )}
      {nutritionInfo && (
        <div>
          <h3>Nutritional Information:</h3>
          <p>Calories: {nutritionInfo.calories}</p>
          {/* Add more fields as needed */}
        </div>
      )}

      <button
        onClick={handleVoiceInput}
        className="bg-purple-500 text-white px-4 py-2 rounded ml-2"
      >
        🎤 Speak
      </button>

      <div>
        <h2 className="text-xl font-semibold">Shopping List:</h2>
        <ul className="list-disc pl-6">
          {shoppingList.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <button
        onClick={() => addToShoppingList(ing)}
        className="bg-red-500 text-white px-2 py-1 rounded ml-2"
      >
        Add to Shopping List
      </button>

      <button
        onClick={() => setDarkMode(!darkMode)}
        className="bg-gray-800 text-white px-4 py-2 rounded"
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>

      <div
        className={darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}
      >
        {/* App content */}
      </div>

      {recipeImage && (
        <img src={recipeImage} alt="Recipe" className="w-full rounded" />
      )}

      <button
        onClick={generateWeeklyPlan}
        className="bg-blue-700 text-white px-4 py-2 rounded"
      >
        Generate Weekly Plan
      </button>

      {Object.keys(weeklyPlan).length > 0 && (
        <div>
          <h2 className="text-xl font-semibold">Weekly Meal Plan:</h2>
          <ul className="list-disc pl-6">
            {Object.entries(weeklyPlan).map(([day, recipe]) => (
              <li key={day}>
                {day}: {recipe}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Login with Google
      </button>

      <button
        onClick={handleShareRecipe}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Share Recipe
      </button>
    </div>
  );
}
};

export default RecipeGenerator;
