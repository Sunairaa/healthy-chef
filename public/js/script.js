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
let deleteBtns = document.querySelectorAll(".deleteIngredientBtn");
const items = [];

addDeleteEventListener();
ingredients.addEventListener("input", async () => {
  let element_input = document.getElementById('inputIngredients');
  let element_datalist = document.getElementById('datalistOptions');
  let opSelected = element_datalist.querySelector(`[value="${element_input.value}"]`);
  if (opSelected != null) {
    addIngredientBtn.disabled = false;
  }
});

addIngredientBtn.addEventListener('click', () => {
  let element_input = document.getElementById('inputIngredients');
  let element_datalist = document.getElementById('datalistOptions');
  let opSelected = element_datalist.querySelector(`[value="${element_input.value}"]`);
  let id = opSelected.getAttribute('data-value');
  let title = opSelected.getAttribute('value');

  addIngredient(id, title);
  ingredients.value = "";
  addIngredientBtn.disabled = true;
})

function addIngredient(id, title) {
  //create Div for each ingredient and append to parent div
  const ingredientsDataItem = document.createElement("li");
  ingredientsDataItem.setAttribute("class", "ingredient");
  ingredientsData.appendChild(ingredientsDataItem);

  //create input for selected name
  const inputIngredientName = document.createElement("input");
  inputIngredientName.setAttribute("value", title);
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
  inputIngredientId.setAttribute("value", id);
  ingredientsDataItem.appendChild(inputIngredientId);

  const deleteBtn = document.createElement("button");
  deleteBtn.setAttribute("type", "button");
  deleteBtn.setAttribute("class", "deleteIngredientBtn");
  deleteBtn.textContent = "-";
  ingredientsDataItem.appendChild(deleteBtn);
  
  handleDelete(deleteBtn);
}

function addDeleteEventListener() {
  deleteBtns = document.querySelectorAll('.deleteIngredientBtn');
  deleteBtns.forEach((btn) => {
     handleDelete(btn)
  });
}

function handleDelete(deleteBtn) {
  deleteBtn.addEventListener("click", () => {
    deleteBtn.parentElement.remove();
  });
}


// prevent to submit form on enter key press
document.getElementById("createForm").onkeypress = function(e) {
  var key = e.charCode || e.keyCode || 0;     
  if (key == 13) {
    e.preventDefault();
  }
} 

createRecipeBtn.addEventListener('click', () => {
  const items = document.querySelectorAll('.ingredient')
  let itemsArray = []

  items.forEach((item) => {
    let _id = item.childNodes[3].value;
    let id = item.childNodes[2].value;
    let name = item.childNodes[0].value;
    let quantity = item.childNodes[1].value;
    const itemObj = {
      "id": id,
      "name": name,
      "quantity": quantity
    }
    if(_id != '') {
      itemObj._id = _id;
    }
    itemsArray.push(itemObj)
  })
  let ingredientsInput = document.getElementById("inputIngredientsPair");
  ingredientsInput.value = JSON.stringify(itemsArray);

  document.getElementById("createForm").submit();
})
