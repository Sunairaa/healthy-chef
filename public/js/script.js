document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("healthy-chef JS imported successfully!");
  },
  false
);
const apiKey = '6htf03n46hsW3piW88qt8gDIpAha0ewMtWfshMqC';
const ingredients = document.getElementById('inputIngredients');
const ingredientsList = document.getElementById('datalistOptions');
let option;
ingredients.addEventListener('input', () => {
  axios
    .get(`https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${apiKey}&query=${ingredients.value}&pageSize=5`)
    .then(response => {
      ingredientsList.innerHTML = '';
      console.log('Response from API is: ', response.data.foods);
      for(let i = 0; i < response.data.foods.length; i++) {
        option = document.createElement('option');
        option.setAttribute('value', response.data.foods[i].fdcId);
        option.textContent = response.data.foods[i].description;
        ingredientsList.appendChild(option);
      }
    })
    .catch(err => console.log(err));
  // alert("hello");
})
