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
const createRecipeBtn = document.getElementById("create-recipe-btn");

let option;
let apiResponse;
let deleteBtns = document.querySelectorAll(".deleteIngredientBtn");
const items = [];

ingredients.addEventListener("input", async () => {
  try {
    const response = await axios.get(
      `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${apiKey}&query=${ingredients.value}&pageSize=1`
    );
    apiResponse = response.data.foods;
    addIngredientBtn.disabled = false;
    ingredientsList.innerHTML = "";
    for (let i = 0; i < response.data.foods.length; i++) {
      option = document.createElement("option");
      option.setAttribute("value", response.data.foods[i].lowercaseDescription);
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

function addIngredient(apiResponse) {
  //create Div for each ingredient and append to parent div
  const ingredientsDataItem = document.createElement("li");
  ingredientsDataItem.setAttribute("class", "ingredient");
  ingredientsData.appendChild(ingredientsDataItem);

  //create input for selected name
  const inputIngredientName = document.createElement("input");
  inputIngredientName.setAttribute("value", apiResponse[0].lowercaseDescription);
  ingredientsDataItem.appendChild(inputIngredientName);

  //create input for user to select quantity
  const inputIngredientQuantity = document.createElement("input");
  inputIngredientQuantity.setAttribute("placeholder", "quantity");
  inputIngredientQuantity.setAttribute("type", "number");
  ingredientsDataItem.appendChild(inputIngredientQuantity);

  //create hidden input to retrieve id
  const inputIngredientId = document.createElement("input");
  inputIngredientId.setAttribute("hidden", true);
  inputIngredientId.setAttribute("class", "item_id")
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


// prevent to submit form on enter key press
document.getElementById("form").onkeypress = function(e) {
  var key = e.charCode || e.keyCode || 0;     
  if (key == 13) {
    e.preventDefault();
  }
} 

createRecipeBtn.addEventListener('click', () => {
  const items = document.querySelectorAll('.ingredient')
  let itemsArray = []

  items.forEach((item) => {
    let id = item.childNodes[2].value;
    let name = item.childNodes[0].value;
    let quantity = item.childNodes[1].value;
    const itemObj = {
      "id": id,
      "name": name,
      "quantity": quantity
    }
    itemsArray.push(itemObj)
  })
  console.log(itemsArray)
  let ingredientsInput = document.getElementById("inputIngredientsPair");
  ingredientsInput.value = JSON.stringify(itemsArray);

  document.getElementById("form").submit();
})
