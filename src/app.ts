import { Recipe, RecipeInstance, TagsEnum } from "./utils/types.js";
import { recipes } from "./data/recipes.js";
import { Tags } from "./Classes/Tags.js";
import { DOMBuilder } from "./Classes/DOMBuilder.js";
import { Search } from "./Classes/Search.js";

//DOM elements
const tagSelectors: HTMLDetailsElement[] = [...document.querySelectorAll("details")];
const recipesContainer: HTMLDivElement = document.querySelector(".recipes");
const mainSearchInput: HTMLInputElement = document.querySelector("form input[type=search]");
const selectedTagsContainer: HTMLElement = document.querySelector(".selected-tags");

//Dom builder instances
const recipesBuilder = new DOMBuilder(recipesContainer);
const selectedTagsBuilder = new DOMBuilder(selectedTagsContainer);

/** Main class */
class App {
  private _mainSearchInput: HTMLInputElement;

  private _initialRecipes: RecipeInstance[] = [];

  private search: Search;
  private recipesBuilder: DOMBuilder;
  private selectedTagsBuilder: DOMBuilder;

  private readonly _minLengthInput: number;
  private readonly _error: HTMLElement;

  constructor(
    recipes: Recipe[],
    recipesBuilder: DOMBuilder,
    selectedTagsContainer: DOMBuilder,
    mainSearchInput: HTMLInputElement,
    minLengthInput: number
  ) {
    this._mainSearchInput = mainSearchInput;
    this.recipesBuilder = recipesBuilder;
    this.selectedTagsBuilder = selectedTagsContainer;
    this._minLengthInput = minLengthInput;
    this._error = this.recipesBuilder.buildError(
      " Aucune recette ne correspond à votre critère... vous pouvez chercher « tarte aux pommes », « poisson », etc."
    );
    this.init();
  }

  /** Generate recipes into the dom and store the DOM and the recipe element in initial array s*/
  initRecipesDisplay(): void {
    recipes.map((recipe) => {
      this._initialRecipes.push({
        obj: recipe,
        DOM: this.recipesBuilder.buildRecipeDOM(recipe),
      });
    });
  }

  /** Create tag selector instances and set available tags */
  initTagSelectors() {
    const ingredientTagSelector = new Tags(
      TagsEnum.ing,
      this.search,
      tagSelectors,
      selectedTagsContainer
    );
    const applianceTagSelector = new Tags(
      TagsEnum.app,
      this.search,
      tagSelectors,
      selectedTagsContainer
    );
    const utensilsTagSelector = new Tags(
      TagsEnum.ut,
      this.search,
      tagSelectors,
      selectedTagsContainer
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
    this._mainSearchInput.addEventListener("input", (e: InputEvent) => {
      e.preventDefault();
      this.search.mainSearch(e.currentTarget as HTMLInputElement);
    });
  }

  /** Hide or display 'no recipes" error */
  handleError(e: CustomEvent) {
    this._error.style.display = e.detail === 0 ? "block" : "none";
  }

  init() {
    this.initRecipesDisplay();
    //Need to init recipes before search
    this.search = new Search(this._initialRecipes, this._minLengthInput);
    this.initMainSearch();
    this.initTagSelectors();

    window.addEventListener("filter", this.handleError.bind(this));
  }
}

new App(recipes, recipesBuilder, selectedTagsBuilder, mainSearchInput, 3);
