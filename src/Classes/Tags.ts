import { DOMBuilder } from "./DOMBuilder.js";
import { TagsEnum } from "./types.js";
import { Search } from "./Search";

export class TagSelector {
  private _detailElement: HTMLDetailsElement;
  private _summaryElement: HTMLElement;
  private _closeBtn: HTMLImageElement;
  private _input: HTMLInputElement;
  private _LIElements: HTMLElement[] = [];

  private readonly _UL: HTMLUListElement;
  private readonly _type: TagsEnum;
  private readonly searchInstance: Search;
  private domBuilder: DOMBuilder;
  private selectedTagsBuilder: DOMBuilder;

  constructor(
    type: TagsEnum,
    _tagSelector: HTMLDetailsElement,
    searchInstance,
    selectedTagsBuilder: DOMBuilder
  ) {
    this._detailElement = _tagSelector;
    this._summaryElement = _tagSelector.querySelector("summary");
    this._closeBtn = _tagSelector.querySelector("img");
    this._input = _tagSelector.querySelector("input");

    this._UL = this._detailElement.querySelector("ul");
    this.searchInstance = searchInstance;
    this._type = type;
    this.domBuilder = new DOMBuilder(this._UL);
    this.selectedTagsBuilder = selectedTagsBuilder;
    this._init();
  }

  private _filterTags() {
    this._input.addEventListener("input", (e: InputEvent) => {
      this.searchInstance.filterTagList(e, this._LIElements);
    });
  }

  removeSelectedTag() {}

  createSelectedTag(target: HTMLLIElement) {
    const value: string = target.dataset.tagvalue;
    const type: string = target.dataset.tagtype;

    const selectedTagDOM = this.selectedTagsBuilder.buildSelectedTagDOM(type, value);
    selectedTagDOM.querySelector("button").addEventListener("click", () => {
      this.searchInstance.removeTag(selectedTagDOM);
      selectedTagDOM.remove();
    });

    this.searchInstance.addTag(target);

    return selectedTagDOM;
  }

  /** Generate available tag items from the search instance available tags list */
  updateAvailableTags() {
    this._UL.innerHTML = "";
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
  }

  /**close all tag selectors*/
  private _closeTagSelectors(e) {
    e.preventDefault();
    e.stopPropagation();
    this._input.removeEventListener("click", this._stopPropagation);
    this._input.removeEventListener("keydown", this._stopPropagation);

    this._detailElement.removeAttribute("open");

    document.body.removeEventListener("click", this._closeTagSelectors.bind(this));
  }

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

  private _init() {
    // apply open click event
    this._detailElement.addEventListener("click", (e) => {
      if (this._detailElement.attributes.hasOwnProperty("open")) {
        this._closeTagSelectors(e);
      } else {
        this._openTagSelector(e);
      }
    });
    // apply btn click close event
    this.updateAvailableTags();

    this._filterTags();
  }
}
