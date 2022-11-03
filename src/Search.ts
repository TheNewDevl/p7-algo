import { cleanString } from "./utils/domFns.js";
import { RecipeInstance, TagsEnum } from "./types.js";

export class Search {
  private readonly _minlengthInput: number;

  private readonly unfilteredRecipes: RecipeInstance[];
  private filteredRecipes: RecipeInstance[] = [];

  private isMainFiltered: boolean;
  private isTagFiltered: boolean;

  ingredients = [];
  appliance = [];
  utensils = [];

  constructor(unfilteredRecipes: RecipeInstance[], minLengthInput: number) {
    this.unfilteredRecipes = unfilteredRecipes;
    this._minlengthInput = minLengthInput;
    this.isMainFiltered = false;
    this.isTagFiltered = false;
    this._init();
  }

  private _displayAllRecipes() {
    this.unfilteredRecipes.map((r) => (r.DOM.dataset.display = "shown"));
  }

  mainSearch(currentTarget: HTMLInputElement) {
    //Remove spaces
    const inputValue: string = cleanString(currentTarget.value);
    //true if input length > minLengthInput
    const isValidInput: boolean = inputValue.length >= this._minlengthInput;

    //handles cases where the length of the input is not valid
    if (this.isMainFiltered && !isValidInput) {
      this._displayAllRecipes();
      this.isMainFiltered = false;
      this._handleAvailableTags();
      this._dispatchEvent();
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

    this.isMainFiltered = true;

    this._handleAvailableTags();
    this._dispatchEvent();
  }

  searchByTag(e: MouseEvent) {
    const liTarget = e.currentTarget as HTMLLIElement;
    console.log(this);

    const value: string = liTarget.dataset.tagvalue;
    const tagType: string = liTarget.dataset.tagtype;

    //create an insensitive regex to test values
    const reg = new RegExp(value, "i");

    //handle filter depending on tag type
    const filterHandler = (recipe: RecipeInstance) => {
      let isFounded: boolean = false;

      if (tagType === TagsEnum.app) {
        isFounded = reg.test(recipe.obj.appliance);
      } else if (tagType === TagsEnum.ut) {
        for (const utensil of recipe.obj.utensils) {
          if (reg.test(utensil)) {
            isFounded = true;
            break;
          }
          for (const ingredient of recipe.obj.ingredients) {
            if (reg.test(ingredient.unit)) {
              isFounded = true;
              break;
            }
          }
        }
      } else if (tagType === TagsEnum.ing) {
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
    this.filteredRecipes = this[
      this.isTagFiltered || this.isMainFiltered ? "filteredRecipes" : "unfilteredRecipes"
    ].filter((recipe) => filterHandler(recipe));

    this.isTagFiltered = true;

    this._handleAvailableTags();
    this._dispatchEvent();
  }

  /** While user type text, filter the list items using the givent value*/
  filterTagList(e: InputEvent, items: HTMLElement[]): void {
    const target = e.currentTarget as HTMLInputElement;
    const reg: RegExp = new RegExp(target.value, "i");
    items.map((li) => {
      li.dataset.display = reg.test(li.dataset.tagvalue) ? "shown" : "hidden";
    });
  }

  /** Retrieve available tags from available recipes*/
  private _handleAvailableTags() {
    this.ingredients = [];
    this.appliance = [];
    this.utensils = [];

    this[this.isTagFiltered || this.isMainFiltered ? "filteredRecipes" : "unfilteredRecipes"].map(
      (r) => {
        //appliance
        if (!this.appliance.includes(r.obj.appliance)) {
          this.appliance.push(r.obj.appliance);
        }
        //utensils
        r.obj.utensils.map((u) => {
          if (!this.utensils.includes(cleanString(u))) {
            this.utensils.push(cleanString(u));
          }
        });
        //ingredients
        r.obj.ingredients.forEach((i) => {
          if (!this.ingredients.includes(cleanString(i.ingredient))) {
            this.ingredients.push(cleanString(i.ingredient));
          }
        });
      }
    );
  }

  private _dispatchEvent() {
    const event = new CustomEvent("filter", { detail: this.filteredRecipes });
    window.dispatchEvent(event);
  }

  private _init() {
    this._handleAvailableTags();
  }
}
