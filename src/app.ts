import { Recipe, RecipeInstance, TagsEnum } from "./types.js";
import { recipes } from "./data/recipes.js";
import { TagSelector } from "./TagSelectors.js";
import { DOMBuilder } from "./DOMBuilder.js";
import { Search } from "./Search.js";

const tagSelectors: HTMLDetailsElement[] = [...document.querySelectorAll("details")];
const recipesContainer: HTMLDivElement = document.querySelector(".recipes");
const mainSearchInput: HTMLInputElement = document.querySelector("form input[type=search]");
const selectedTagsContainer: HTMLElement = document.querySelector(".selected-tags");

const recipesBuilder = new DOMBuilder(recipesContainer);
const selectedTagsBuilder = new DOMBuilder(selectedTagsContainer);

class App {
  private mainSearchInput: HTMLInputElement;
  private initialRecipes: RecipeInstance[] = [];

  private search: Search;
  recipesBuilder: DOMBuilder;
  selectedTagsBuilder: DOMBuilder;
  minLengthInput: number;

  constructor(
    recipes: Recipe[],
    recipesBuilder: DOMBuilder,
    selectedTagsContainer: DOMBuilder,
    mainSearchInput: HTMLInputElement,
    minLengthInput: number
  ) {
    this.mainSearchInput = mainSearchInput;
    this.recipesBuilder = recipesBuilder;
    this.selectedTagsBuilder = selectedTagsContainer;
    this.minLengthInput = minLengthInput;
    this.init();
  }

  /** Generate recipes into the dom and store the DOM and the recipe element in initial array s*/
  initRecipesDisplay(): void {
    recipes.map((recipe) => {
      this.initialRecipes.push({
        obj: recipe,
        DOM: this.recipesBuilder.buildRecipeDOM(recipe),
      });
    });
  }

  /** Create tag selector instances and set available tags */
  initTagSelectors() {
    const ingredientTagSelector = new TagSelector(
      TagsEnum.ing,
      tagSelectors.find((t) => t.className === "ingredients"),
      this.search
    );
    const applianceTagSelector = new TagSelector(
      TagsEnum.app,
      tagSelectors.find((t) => t.className === "appliance"),
      this.search
    );
    const utensilsTagSelector = new TagSelector(
      TagsEnum.ut,
      tagSelectors.find((t) => t.className === "utensils"),
      this.search
    );

    // catch filter custom event to update available tags
    window.addEventListener("filter", () => {
      ingredientTagSelector.updateAvailableTags();
      applianceTagSelector.updateAvailableTags();
      utensilsTagSelector.updateAvailableTags();
    });
  }

  /** set input search event */
  initMainSearch() {
    this.mainSearchInput.addEventListener("input", (e: InputEvent) => {
      e.preventDefault();
      this.search.mainSearch(e.currentTarget as HTMLInputElement);
    });
  }

  init() {
    this.initRecipesDisplay();

    this.search = new Search(this.initialRecipes, this.minLengthInput);
    this.initMainSearch();
    this.initTagSelectors();
  }
}

new App(recipes, recipesBuilder, selectedTagsBuilder, mainSearchInput, 3);
