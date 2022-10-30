import { Recipe, RecipeInstance } from "./types.js";
import { recipes } from "./data/recipes.js";
import { createEl } from "./utils/domFns.js";

class RecipeArticleDOM {
  private unfilteredRecipes: RecipeInstance[] = [];
  private recipesContainer: HTMLElement;
  private filteredRecipes: RecipeInstance[] = [];
  private isFiltered: boolean;

  minLengthInput: number;

  constructor(recipes: Recipe[], container: HTMLElement, minLengthInput: number) {
    this.recipesContainer = container;
    this.minLengthInput = minLengthInput;
    this.init();

    //set input search event
    document.querySelector("form input[type=search]").addEventListener("input", (e: InputEvent) => {
      e.preventDefault();
      this.filterRecipes(e.currentTarget as HTMLInputElement);
    });

    this.isFiltered = false;
  }

  private buildRecipeDOM(recipe: Recipe): HTMLElement {
    const article = createEl("article", { class: "recipe__container", "data-display": "shown" });
    const recipeDivInfo = createEl("div", { class: "recipe" });
    const recipeDetails = createEl("div", { class: "recipe__details" });

    //duration
    const timerImg = createEl("img", { alt: "time icon", src: "../assets/time.svg" });
    const duration = createEl("p");
    duration.append(timerImg, createEl("span", {}, `${recipe.time} min`));

    //header
    const header = createEl("header", { class: "recipe__header" });
    header.append(createEl("h2", { class: "recipe__header__name" }, recipe.name), duration);

    //recipe description
    const steps = createEl(
      "p",
      { class: "recipe__details__col recipe__details__col--right" },
      recipe.description
    );

    //ingredients container
    const ingredientsList = createEl("div", {
      class: "recipe__details__col recipe__details__col--left",
    });

    //map ingredients list and display it depending on recipe data
    recipe.ingredients.map((i) => {
      const ingredientItem = createEl("p", { class: "ingredient" });
      ingredientItem.append(
        createEl("strong", {}, `${i.ingredient}${i.quantity ? ": " : " "}`),
        i.quantity ? `${i.quantity}` : "",
        i.unit ? `${i.unit.length > 2 ? " " : ""}${i.unit}` : ""
      );
      ingredientsList.append(ingredientItem);
    });

    //Recipe img container
    const imgContainer = createEl("div", { class: "recipe__img" });

    article.append(imgContainer, recipeDivInfo);
    recipeDivInfo.append(header, recipeDetails);
    recipeDetails.append(ingredientsList, steps);

    return article;
  }

  removeDisplayNone() {
    this.unfilteredRecipes.map((r) => (r.DOM.dataset.display = "shown"));
  }

  filterRecipes(currentTarget: HTMLInputElement) {
    //Remove spaces
    const inputValue: string = currentTarget.value.trim().toLowerCase();
    //true if input length > minLengthInput
    const isValidInput: boolean = inputValue.length >= this.minLengthInput;

    //handles cases where the length of the input is not valid
    if (this.isFiltered && !isValidInput) {
      this.removeDisplayNone();
      this.isFiltered = false;
      return;
    } else if (!isValidInput) return;

    //create an insensitive regex to test values
    const reg = new RegExp(inputValue, "i");

    //filter conditions and handle display while filtering
    const filterHandler = (recipe: RecipeInstance) => {
      //test name first & separately will return quickly and give better performances
      const isFounded =
        reg.test(recipe.obj.name) ||
        reg.test(recipe.obj.description) ||
        recipe.obj.ingredients.find((i) => reg.test(i.ingredient));
      //handle display
      recipe.DOM.dataset.display = isFounded ? "shown" : "hidden";
      return isFounded;
    };

    this.filteredRecipes = this.unfilteredRecipes.filter((recipe) => filterHandler(recipe));

    this.isFiltered = true;
  }

  init() {
    recipes.map((recipe) => {
      const recipeDOM = this.buildRecipeDOM(recipe);
      this.unfilteredRecipes.push({
        obj: recipe,
        DOM: recipeDOM,
      });

      this.recipesContainer.append(recipeDOM);
    });
  }
}

const app = new RecipeArticleDOM(recipes, document.querySelector(".recipes"), 3);
