import { Recipe } from "./types.js";
import { recipes } from "./data/recipes.js";
import { createEl } from "./utils/domFns.js";

class RecipeArticleDOM {
  private recipes: Recipe[];
  private recipesContainer: HTMLElement;

  constructor(recipes: Recipe[], container: HTMLElement) {
    this.recipes = recipes;
    this.recipesContainer = container;

    this.init();
  }

  private buildDOM(recipe: Recipe): HTMLElement {
    const article = createEl("article", { class: "recipe__container" });
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

    article.append(recipeDivInfo);
    recipeDivInfo.append(header, recipeDetails);
    recipeDetails.append(ingredientsList, steps);

    return article;
  }

  init() {
    this.recipes.map((r) => this.recipesContainer.appendChild(this.buildDOM(r)));
  }
}

const app = new RecipeArticleDOM(recipes, document.querySelector(".recipes"));

app.init();
