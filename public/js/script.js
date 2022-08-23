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
const addIngredientBtn = document.getElementById("add-ingredient-btn");

let option;
let apiResponse;
let deleteBtns = document.querySelectorAll(".deleteIngredientBtn");

ingredients.addEventListener("input", async () => {
  try {
    const response = await axios.get(
      `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${apiKey}&query=${ingredients.value}&pageSize=1`
    );
    apiResponse = response.data.foods;
    addIngredientBtn.disabled = false;
    ingredientsList.innerHTML = "";
    //console.log("Response from API is: ", response.data.foods);
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

addIngredientBtn.addEventListener('click', () => {
  addIngredient(apiResponse);
  ingredients.value = "";
  addIngredientBtn.disabled = true;
})

// ingredients.addEventListener('keypress', (e) => {
//   if (e.keyCode === 13) {
//     addIngredient(apiResponse);
//     // ingredients.value = "";
//   }
  
// });

function addIngredient(apiResponse) {
  // console.log(apiResponse);
  //create Div for each ingredient and append to parent div
  const ingredientsDataItem = document.createElement("li");
  ingredientsData.appendChild(ingredientsDataItem);

  //create input for selected name
  const inputIngredientName = document.createElement("input");
  inputIngredientName.setAttribute("value", apiResponse[0].description);
  ingredientsDataItem.appendChild(inputIngredientName);

  //create input for user to select quantity
  const inputIngredientQuantity = document.createElement("input");
  inputIngredientQuantity.setAttribute("placeholder", "quantity");
  inputIngredientQuantity.setAttribute("type", "number");
  ingredientsDataItem.appendChild(inputIngredientQuantity);

  //create hidden input to retrieve id
  const inputIngredientId = document.createElement("input");
  inputIngredientId.setAttribute("hidden", true);
  inputIngredientId.setAttribute("value", apiResponse[0].fdcId);
  ingredientsDataItem.appendChild(inputIngredientId);

  const deleteBtn = document.createElement("button");
  deleteBtn.setAttribute("type", "button");
  deleteBtn.setAttribute("class", "deleteIngredientBtn");
  deleteBtn.textContent = "-";
  ingredientsDataItem.appendChild(deleteBtn);

  handleDelete(deleteBtn);
}

function handleDelete(deleteBtn) {
  deleteBtn.addEventListener("click", () => {
    deleteBtn.parentElement.remove();
  });
}


document.getElementById("form").onkeypress = function(e) {
  var key = e.charCode || e.keyCode || 0;     
  if (key == 13) {
    e.preventDefault();
  }
} 

// function submitButtonClick(event) {
//   event.preventDefault();
//   //other stuff you want to do instead...
// } 