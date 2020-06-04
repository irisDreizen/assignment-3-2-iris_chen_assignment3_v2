const axios = require("axios");
const api_url = "https://api.spoonacular.com/recipes";
const api_key = "apiKey=570f1120b25b4810b76edcbba14a0fb7";

// *********search for recipe*************
function extractQureryParams(query_params, search_params){
    console.log("i'm in extractQureryParams");
    const params_list = ["diet","cuisine","intolerence"];
    params_list.forEach((param) => {
        if(query_params[param]){
            search_params[param] = query_params[param];
        }
    });
}

async function searchForRecipes(search_params){
    console.log("i'm in searchForRecipe");
    console.log(search_params);
    let search_response = await axios.get(
        `${api_url}/search?${api_key}`,
        {
            params: search_params,
        }
    );
    const recipes_id_list = extractSearchResultsIds(search_response);
    let info_array = await getRecipesInfo(recipes_id_list);
    return info_array;
}

function extractSearchResultsIds(search_response){
    console.log("i'm in extractSearchResultsIds");
    console.log(search_response.data.results);
    let recipes = search_response.data.results;
    recipes_id_list = [];
    recipes.map((recipe) => {
        recipes_id_list.push(recipe.id);
    });
    console.log("recipe id list is:" + recipes_id_list);
    return recipes_id_list;
}


// ********get three random recipes**********

async function searchForRandomRecipes(search_params){
    console.log("i'm in searchForRandomRecipes");
    console.log(search_params);
    let search_response = await axios.get(
        `${api_url}/random?${api_key}`,
        {
            params: search_params,
        }
    );
    console.log("search response parameters:");
    console.log(search_response);
    const recipes_id_list = extractSearchResultsIds_random(search_response);
    let info_array = await getRecipesInfo(recipes_id_list);
    return info_array;
}

function extractSearchResultsIds_random(search_response){
    console.log("i'm in extractSearchResultsIds");
    console.log(search_response.data.recipes);
    let recipes = search_response.data.recipes;
    recipes_id_list = [];
    recipes.map((recipe) => {
        recipes_id_list.push(recipe.id);
    });
    console.log("recipe id list is:" + recipes_id_list);
    return recipes_id_list;
}

// ***********get full recipe by id***************
async function searchForRecipesByID(search_params){
    console.log("i'm in searchForRecipe, id is");
    console.log(search_params.id);
    console.log("url of api is:");
    console.log( `${api_url}/${search_params.id}/information?${api_key}`);

    recipes_id_list = [];
    recipes_id_list.push(search_params.id);

    console.log("recipes_id_list is:"+recipes_id_list);

    recipes_id_list.map((id) => 
    promises.push(axios.get(`${api_url}/${id}/information?${api_key}`))
    );
    let info_response = await Promise.all(promises);
    console.log("info response is:");
    console.log(info_response);
    relevantRecipes = extractSearchResultsData_fullRecipe(info_response);
    return relevantRecipes;
}



// ********parsing data for recipe preview*************

async function getRecipesInfo(recipes_id_list){
    let promises = [];
    console.log("recipe ids are:" + recipes_id_list);
    recipes_id_list.map((id) => 
    promises.push(axios.get(`${api_url}/${id}/information?${api_key}`))
    );
    let info_response1 = await Promise.all(promises);
    console.log("i'm in getRecipesInfo");
    relevantRecipes = extractSearchResultsData(info_response1);
    return relevantRecipes;
}
function extractSearchResultsData(recipes_Info){
    return recipes_Info.map((recipe_info) => {
        const {
            id,
            title,
            readyInMinutes,
            aggregateLikes,
            vegetarian,
            vegan,
            glutenFree,
            image,
        } = recipe_info.data;
        return {
            id: id,
            title: title,
            readyInMinutes: readyInMinutes,
            aggregateLikes: aggregateLikes,
            vegetarian: vegetarian,
            vegan: vegan,
            glutenFree: glutenFree,
            image: image,
        };
    });
}




// ********parsing data for full recipe*************
async function getRecipesInfo_fullRecipe(recipes_id_list){
    let promises = [];
    recipes_id_list.map((id) => 
    promises.push(axios.get(`${api_url}/${id}/information?${api_key}`))
    );
    let info_response1 = await Promise.all(promises);
    console.log("i'm in getRecipesInfo");
    relevantRecipes = extractSearchResultsData_fullRecipe(info_response1);
    return relevantRecipes;
}

function extractSearchResultsData_fullRecipe(recipes_Info){
    return recipes_Info.map((recipe_info) => {
        const {
            id,
            title,
            readyInMinutes,
            aggregateLikes,
            vegetarian,
            vegan,
            glutenFree,
            image,
            extendedIngredients,
            instructions,
            servings,

        } = recipe_info.data;


        return {
            id: id,
            title: title,
            readyInMinutes: readyInMinutes,
            aggregateLikes: aggregateLikes,
            vegetarian: vegetarian,
            vegan: vegan,
            glutenFree: glutenFree,
            image: image,
            Ingredients: getOnlyIngrediants(extendedIngredients),
            instructions: instructions,
            servings: servings,
        };
    });
}

function getOnlyIngrediants(fullIngrediants){
    return fullIngrediants.map((ingrediant_info) => {
        const {
            original,
        } = ingrediant_info;


        return {
            name_and_amount: original,
        };
    });
}

exports.extractQureryParams = extractQureryParams;
exports.searchForRecipes = searchForRecipes;
exports.searchForRandomRecipes = searchForRandomRecipes;
exports.searchForRecipesByID = searchForRecipesByID;
exports.getRecipesInfo_fullRecipe = getRecipesInfo_fullRecipe;