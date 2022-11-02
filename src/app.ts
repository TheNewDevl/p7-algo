import { Recipe, RecipeInstance } from "./types.js";
import { recipes } from "./data/recipes.js";
import { cleanString, createEl } from "./utils/domFns.js";
import { TagSelector } from "./TagSelectors.js";

const tagSelectors = document.querySelectorAll("details");

class RecipeArticleDOM {
  private unfilteredRecipes: RecipeInstance[] = [];
  private recipesContainer: HTMLElement;
  private filteredRecipes: RecipeInstance[] = [];
  private isFiltered: boolean;

  private utensilsTagList = [];
  private ingredientsTagList = [];
  private applianceTagList = [];

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
    const inputValue: string = cleanString(currentTarget.value);
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

    this.handleAvailableTags();
  }

  tagsFilter(e: MouseEvent) {
    const liTarget = e.currentTarget as HTMLLIElement;

    const value: string = liTarget.dataset.tagvalue;
    const tagType: string = liTarget.dataset.tagtype;

    //create an insensitive regex to test values
    const reg = new RegExp(value, "i");

    //handle filter depending on tag type
    const filterHandler = (recipe: RecipeInstance) => {
      let isFounded: boolean = false;

      if (tagType === "appliance") {
        isFounded = reg.test(recipe.obj.appliance);
      } else if (tagType === "utensils") {
        for (const utensil of recipe.obj.utensils) {
          if (reg.test(utensil)) {
            isFounded = true;
            isFounded && console.log("OK");
            break;
          }
          for (const ingredient of recipe.obj.ingredients) {
            if (reg.test(ingredient.unit)) {
              isFounded = true;
              break;
            }
          }
        }
      } else if (tagType === "ingredients") {
        for (const ingredient of recipe.obj.ingredients) {
          if (reg.test(ingredient.ingredient)) {
            isFounded = true;
            break;
          }
        }
      }
      recipe.DOM.dataset.display = isFounded ? "shown" : "hidden";

      return isFounded;
    };

    this.filteredRecipes = this[this.isFiltered ? "filteredRecipes" : "unfilteredRecipes"].filter(
      (recipe) => filterHandler(recipe)
    );

    this.isFiltered = true;
    this.handleAvailableTags();
  }

  /**
   * Set the available tags, from this.filteredRecipes or unfilteredRecipes depending on isFiltered boolean
   */
  handleAvailableTags() {
    const applianceTagContainer = document.querySelector(".tags__list--appliance");
    const ingredientTagContainer = document.querySelector(".tags__list--ingredients");
    const utensilsTagContainer = document.querySelector(".tags__list--utensils");

    applianceTagContainer.innerHTML = "";
    ingredientTagContainer.innerHTML = "";
    utensilsTagContainer.innerHTML = "";

    this.applianceTagList = [];
    this.ingredientsTagList = [];
    this.utensilsTagList = [];
    //Retrieve available tags
    this[this.isFiltered ? "filteredRecipes" : "unfilteredRecipes"].map((r) => {
      //appliance
      if (!this.applianceTagList.includes(r.obj.appliance)) {
        this.applianceTagList.push(r.obj.appliance);

        /*   this.applianceTagList.map((i) => {
             /!*  const tagLi = createEl(
                 "li",
                 { "data-tagType": "appliance", "data-display": "shown", "data-tagValue": i },
                 i
               );
               tagLi.addEventListener("click", this.tagsFilter.bind(this));*!/
             /!*this.applianceTagList.push({
               value: r.obj.appliance,
               DOM: tagLi,
             });*!/
             //  applianceTagContainer.append(tagLi);
           });*/
      }
      //utensils
      r.obj.utensils.map((u) => {
        if (!this.utensilsTagList.includes(cleanString(u))) {
          this.utensilsTagList.push(cleanString(u));
        }
      });
      //ingredients
      r.obj.ingredients.forEach((i) => {
        if (!this.ingredientsTagList.includes(cleanString(i.ingredient))) {
          this.ingredientsTagList.push(cleanString(i.ingredient));
        }
      });
    });

    //Display available tags
    //const ingredientTagContainer = document.querySelector(".tags__list--ingredients");

    this.ingredientsTagList.map((i) => {
      const tagLi = createEl(
        "li",
        { "data-tagType": "ingredients", "data-display": "shown", "data-tagValue": i },
        i
      );
      tagLi.addEventListener("click", this.tagsFilter.bind(this));

      ingredientTagContainer.append(tagLi);
    });

    //const applianceTagContainer = document.querySelector(".tags__list--appliance");
    this.applianceTagList.map((i) => {
      const tagLi = createEl(
        "li",
        { "data-tagType": "appliance", "data-display": "shown", "data-tagValue": i },
        i
      );
      tagLi.addEventListener("click", this.tagsFilter.bind(this));

      applianceTagContainer.append(tagLi);
    });

    //const utensilsTagContainer = document.querySelector(".tags__list--utensils");
    this.utensilsTagList.map((i) => {
      const tagLi = createEl(
        "li",
        { "data-tagType": "utensils", "data-display": "shown", "data-tagValue": i },
        i
      );
      tagLi.addEventListener("click", this.tagsFilter.bind(this));
      utensilsTagContainer.append(tagLi);
    });
  }

  init() {
    tagSelectors.forEach((tagSelector) => new TagSelector(tagSelector));

    recipes.map((recipe) => {
      const recipeDOM = this.buildRecipeDOM(recipe);
      this.unfilteredRecipes.push({
        obj: recipe,
        DOM: recipeDOM,
      });

      this.recipesContainer.append(recipeDOM);
    });
    this.setAvailableTags();
  }
}

const app = new RecipeArticleDOM(recipes, document.querySelector(".recipes"), 3);
