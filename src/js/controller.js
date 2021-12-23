import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
// import icons from '../img/icons.svg'; //parcel 1jjkki
// c
import 'core-js/stable'; //// polyfilling everything else
import 'regenerator-runtime/runtime'; ///polyfilling async await

if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1); // hash
    if (!id) return;
    //1) Loading recipe
    //response from api
    // render spinner
    recipeView.renderSpinner();

    // load recipe

    await model.loadRecipe(id);

    //2)Rendering the recipe
    // this would also be possible : const recipeView = new recipeView(model.state.recipe)
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    //1) get search query
    const query = searchView.getQuery();

    if (!query) return;
    //2) Load search results
    await model.loadSearchResults(query);
    resultsView._clear();
    //3) render all resaults is the first one
    // resultsView.render(model.state.search.results);
    //4) this renders the searched results
    resultsView.render(model.getSearchResultsPage());
    //5)) initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  //1) render new results
  resultsView.render(model.getSearchResultsPage(goToPage));
  //1) render new buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //update recipe servings (in state)
  model.updateServings(newServings);
  //update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  model.addBookmark(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
};
init();

// window.addEventListener('hashchange', showRecipe);
// window.addEventListener('load', showRecipe); // we can add these 2 together because they similar. DRY code
