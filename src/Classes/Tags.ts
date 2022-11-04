import { DOMBuilder } from "./DOMBuilder.js";
import { TagsEnum } from "../utils/types.js";
import { Search } from "./Search";

export class Tags {
  //DOM elements
  private readonly _detailElement: HTMLDetailsElement;
  private readonly _summaryElement: HTMLElement;
  private readonly _input: HTMLInputElement;
  private readonly _LIElements: HTMLElement[] = [];
  private readonly _UL: HTMLUListElement;

  //Ingredients, appliances or utensils
  private readonly _type: TagsEnum;

  //classes instances
  private readonly _searchInstance: Search;
  private readonly _availableTagBuilder: DOMBuilder;
  private readonly _selectedTagsBuilder: DOMBuilder;
  private _error: HTMLElement;

  constructor(
    type: TagsEnum,
    searchInstance,
    tagSelectors: HTMLDetailsElement[],
    selectedTagContainer: HTMLElement
  ) {
    this._type = type;

    this._detailElement = tagSelectors.find((t) => t.className === this._type);
    this._summaryElement = this._detailElement.querySelector("summary");
    this._input = this._detailElement.querySelector("input");
    this._UL = this._detailElement.querySelector("ul");

    this._searchInstance = searchInstance;
    this._availableTagBuilder = new DOMBuilder(this._UL);
    this._selectedTagsBuilder = new DOMBuilder(selectedTagContainer);

    this._error = this._availableTagBuilder.buildError(
      "Oups, aucun filtre ne correspond à votre saisie."
    );

    this._init();
  }

  /** Remove selected tag from document and call search removeTag method */
  private _removeTag(tag: HTMLElement): void {
    this._searchInstance.removeTag(tag);
    tag.remove();
  }

  /** Create a selected tag, add a click event that will call the remove tag method */
  private _createSelectedTag(target: HTMLLIElement) {
    const value: string = target.dataset.tagvalue;
    const type: string = target.dataset.tagtype;

    //Create element
    const selectedTagDOM = this._selectedTagsBuilder.buildSelectedTagDOM(type, value);

    //Add close event listener
    selectedTagDOM
      .querySelector("button")
      .addEventListener("click", () => this._removeTag(selectedTagDOM));

    //Update search instance
    this._searchInstance.addTag(target);
  }

  /** Generate available tag items from the search instance available tags list */
  updateAvailableTags() {
    this._LIElements.forEach((li) => li.remove());

    this._searchInstance[this._type].map((i) => {
      const li = this._availableTagBuilder.buildTagSelectorLiItem(this._type, i);
      //store element to be able to filter
      this._LIElements.push(li);
      //add create tag event listener
      li.addEventListener("click", (e) => {
        //if already selected, return
        const target = e.currentTarget as HTMLLIElement;
        const value = target.dataset.tagvalue;
        const selectedTagsFilterLength = this._searchInstance.selectedTags[this._type].filter(
          (i) => value === i.dataset.tagvalue
        ).length;
        if (selectedTagsFilterLength > 0) return;

        this._createSelectedTag(target);
      });
    });

    this._handleError(this._searchInstance[this._type].length);
  }

  /** Close tag selector and remove event listeners */
  private _closeTagSelectors(e) {
    e.preventDefault();
    e.stopPropagation();
    this._detailElement.removeAttribute("open");

    this._input.removeEventListener("click", this._stopPropagation);
    this._input.removeEventListener("keydown", this._stopPropagation);
    document.body.removeEventListener("click", this._closeTagSelectors.bind(this));
  }

  /** Prevent unexpected closing of the details element */
  private _stopPropagation(e) {
    e.stopPropagation();
    if (e.code === "Space") {
      const target = e.currentTarget as HTMLInputElement;
      e.preventDefault();
      target.value = `${target.value} `;
    }
  }

  /**Open the tag selector target*/
  private _openTagSelector(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    //close other details elements
    document.querySelectorAll("details").forEach((d) => {
      d.querySelector("input").removeEventListener("click", this._stopPropagation);
      d.querySelector("input").removeEventListener("keydown", this._stopPropagation);
      d.removeAttribute("open");
    });

    this._detailElement.toggleAttribute("open");

    //prevent close collapse
    this._input.addEventListener("click", this._stopPropagation);
    this._input.addEventListener("keydown", this._stopPropagation);

    document.body.addEventListener("click", this._closeTagSelectors.bind(this));
  }

  /** Hide or display 'no tags" error depending on length */
  private _handleError(length: number) {
    this._error.style.display = length === 0 ? "block" : "none";
  }

  private _init() {
    // Handle open and close detail element
    this._detailElement.addEventListener("click", (e) => {
      if (this._detailElement.attributes.hasOwnProperty("open")) {
        this._closeTagSelectors(e);
      } else {
        this._openTagSelector(e);
      }
    });

    this.updateAvailableTags();

    //input filter event listener
    this._input.addEventListener("input", (e: InputEvent) => {
      const result = this._searchInstance.filterTagList(e, this._LIElements);
      this._handleError(result.length);
    });

    //if a filter is detected, reset this input value
    window.addEventListener("filter", () => {
      this._input.value = "";
    });
  }
}
