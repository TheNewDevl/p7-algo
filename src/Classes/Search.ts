import { cleanString, escapeRegex } from "../utils/strings.js";
import { RecipeInstance, SelectedTags, TagsEnum } from "../utils/types.js";

export class Search {
  private readonly _minlengthInput: number;
  private readonly _unfilteredRecipes: RecipeInstance[];
  private _filteredRecipes: RecipeInstance[] = [];

  private _isMainFiltered: boolean;
  private _isTagFiltered: boolean;

  private _mainSearchValue: HTMLInputElement | null;

  readonly selectedTags: SelectedTags;
  private ingredients: string[];
  private appliance: string[];
  private utensils: string[];

  constructor(unfilteredRecipes: RecipeInstance[], minLengthInput: number) {
    this._minlengthInput = minLengthInput;
    this._unfilteredRecipes = unfilteredRecipes;
    this._isMainFiltered = false;
    this._isTagFiltered = false;
    this.selectedTags = {
      ingredients: [],
      appliance: [],
      utensils: [],
    };
    this._handleAvailableTags();
  }

  /** Main search algorithme (from user input value) */
  mainSearch(currentTarget: HTMLInputElement) {
    const inputValue: string = cleanString(currentTarget.value);
    //true if input length > minLengthInput
    const isValidInput: boolean = inputValue.length >= this._minlengthInput;

    //handles cases where the length of the input is not valid
    if (this._isMainFiltered && !isValidInput) {
      if (this._isTagFiltered) {
        this._isMainFiltered = false;
        this._isTagFiltered = false;
        this._runTagsSearch();
      } else {
        this._reset();
      }
      return;
    } else if (!isValidInput) return;

    //store input value
    this._mainSearchValue = currentTarget;

    //create an insensitive regex to test values
    const reg = new RegExp(escapeRegex(inputValue), "i");

    const filterHandler = () => {
      const listToFilter = this[this._isTagFiltered ? "_filteredRecipes" : "_unfilteredRecipes"];

      //filter conditions and handle display while filtering
      for (let i = 0; i < listToFilter.length; i++) {
        const matchName = reg.test(listToFilter[i].obj.name);
        const matchDescription = reg.test(listToFilter[i].obj.description);
        let matchIngredient = false;

        for (let x = 0; x < listToFilter[i].obj.ingredients.length; x++) {
          if (reg.test(listToFilter[i].obj.ingredients[x].ingredient)) {
            matchIngredient = true;
            break;
          }
        }

        if (matchName || matchDescription || matchIngredient) {
          const index = this._filteredRecipes.indexOf(listToFilter[i]);
          listToFilter[i].DOM.dataset.display = "shown";
          if (index === -1) {
            this._filteredRecipes.push(listToFilter[i]);
          }
        } else {
          const index = this._filteredRecipes.indexOf(listToFilter[i]);
          listToFilter[i].DOM.dataset.display = "hidden";
          if (index > -1) {
            this._filteredRecipes.splice(index, 1);
          }
        }
      }
    };

    filterHandler();

    this._isMainFiltered = true;

    this._handleAvailableTags();
    this._dispatchFilterEvent();
  }

  /*******************************************************************
   ************************** Tags Methods ***************************
   ******************************************************************* */

  /** Remove a tag from the search instance and run search algorithm */
  removeTag(el: HTMLElement) {
    const { type, value } = el.dataset;
    //remove tad from selected tags
    this.selectedTags[type] = this.selectedTags[type].filter((li) => li.dataset.tagvalue !== value);

    //let search start from initial recipes
    this._isTagFiltered = false;

    if (!this._isSelectedTagsEmpty()) {
      this._runTagsSearch();
    } else {
      this._isMainFiltered ? this.mainSearch(this._mainSearchValue) : this._reset();
    }
  }

  /** Add a tag to the search instance and run search algorithm */
  addTag(target: HTMLLIElement) {
    const tagType: string = target.dataset.tagtype;
    this.selectedTags[tagType].push(target);
    this._runTagsSearch();
  }

  /** Run tag search for every selected tag*/
  private _runTagsSearch() {
    for (const [entry] of Object.entries(this.selectedTags)) {
      this.selectedTags[entry].map((li) => this._searchByTag(li));
    }
  }

  /** Tags search algorithm */
  private _searchByTag(target: HTMLInputElement) {
    const value: string = target.dataset.tagvalue;
    const tagType: string = target.dataset.tagtype;

    //create an insensitive regex to test values
    const reg = new RegExp(escapeRegex(value), "i");

    //handle filter depending on tag type
    const filterHandler = (recipe: RecipeInstance) => {
      //let isFounded: boolean = false;
      const isFounded =
        tagType === TagsEnum.app
          ? reg.test(recipe.obj.appliance)
          : tagType === TagsEnum.ut
          ? recipe.obj.utensils.find((u) => reg.test(u))
          : recipe.obj.ingredients.find((i) => reg.test(i.ingredient));
      recipe.DOM.dataset.display = isFounded ? "shown" : "hidden";
      return isFounded;
    };

    this._filteredRecipes = this[
      this._isTagFiltered || this._isMainFiltered ? "_filteredRecipes" : "_unfilteredRecipes"
    ].filter((recipe) => filterHandler(recipe));

    this._isTagFiltered = true;

    this._handleAvailableTags();
    this._dispatchFilterEvent();
  }

  /*******************************************************************
   ******************************************************************* */

  /** Check if selected tags is empty or not */
  private _isSelectedTagsEmpty(): boolean {
    let emptyTags = [];
    for (const [entry] of Object.entries(this.selectedTags)) {
      if (this.selectedTags[entry].length === 0) {
        emptyTags.push(0);
      }
    }
    return emptyTags.length === Object.keys(this.selectedTags).length;
  }

  /** While user type text, filter the list items using the given value*/
  filterTagList(e: InputEvent, items: HTMLElement[]): HTMLElement[] {
    const target = e.currentTarget as HTMLInputElement;
    const reg: RegExp = new RegExp(escapeRegex(target.value), "ig");
    return items.filter((li) => {
      let test = reg.test(li.dataset.tagvalue);
      li.dataset.display = test ? "shown" : "hidden";
      if (test) return li;
    });
  }

  /** Retrieve available tags from available recipes*/
  private _handleAvailableTags() {
    this.ingredients = [];
    this.appliance = [];
    this.utensils = [];

    this[
      this._isTagFiltered || this._isMainFiltered ? "_filteredRecipes" : "_unfilteredRecipes"
    ].map((r) => {
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
    });
  }

  private _dispatchFilterEvent() {
    const filtered = this._isTagFiltered || this._isMainFiltered;
    const length = this[filtered ? "_filteredRecipes" : "_unfilteredRecipes"].length;
    const event = new CustomEvent("filter", { detail: length });
    window.dispatchEvent(event);
  }

  /** Reset search to the initial state and values */
  private _reset() {
    this._unfilteredRecipes.map((r) => (r.DOM.dataset.display = "shown"));
    this._filteredRecipes = [];
    this._mainSearchValue = null;
    this._isTagFiltered = false;
    this._isMainFiltered = false;

    this._handleAvailableTags();
    this._dispatchFilterEvent();
  }
}
