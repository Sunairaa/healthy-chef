document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("healthy-chef JS imported successfully!");
  },
  false
);
const apiKey = "6htf03n46hsW3piW88qt8gDIpAha0ewMtWfshMqC";
const ingredients = document.getElementById("inputIngredients");
const ingredientsList = document.getElementById("datalistOptions");
const ingredientsData = document.getElementById("ingredientsData");
let option;
let apiResponse;
ingredients.addEventListener("input", async () => {
  try {
    const response = await axios.get(
      `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${apiKey}&query=${ingredients.value}&pageSize=1`
    );
    apiResponse = response.data.foods;
    ingredientsList.innerHTML = "";
    console.log("Response from API is: ", response.data.foods);
    for (let i = 0; i < response.data.foods.length; i++) {
      option = document.createElement("option");
      option.setAttribute("value", response.data.foods[i].fdcId);
      option.textContent = response.data.foods[i].description;
      ingredientsList.appendChild(option);
    }
  } catch (err) {
    console.log(err);
  }
});

ingredients.addEventListener("keypress", (e) => {
  if (e.keyCode === 13) {
    console.log("enter");
    showIngredientsInputs(apiResponse);
  }
});

function showIngredientsInputs(apiResponse) {
  console.log(apiResponse);
  //create Div for each ingredient and append to parent div
  const ingredientsDataDiv = document.createElement("div");
  ingredientsData.appendChild(ingredientsDataDiv);

  //create input for selected name
  const inputIngredientName = document.createElement("input");
  inputIngredientName.setAttribute("value", apiResponse[0].description);
  ingredientsDataDiv.appendChild(inputIngredientName);

  //create input for user to select quantity
  const inputIngredientQuantity = document.createElement("input");
  inputIngredientQuantity.setAttribute("placeholder", "quantity");
  inputIngredientQuantity.setAttribute("type", "number");
  ingredientsDataDiv.appendChild(inputIngredientQuantity);

  //create hiden input to retrieve id
  const inputIngredientId = document.createElement("input");
  // inputIngredientId.setAttribute("hidden");
  inputIngredientId.setAttribute("value", apiResponse[0].fdcId);
  ingredientsDataDiv.appendChild(inputIngredientId);

  const deletebtn = document.createElement("button");
  deletebtn.setAttribute("type", "submit");
  deletebtn.textContent = "-";
  ingredientsDataDiv.appendChild(deletebtn);
}
