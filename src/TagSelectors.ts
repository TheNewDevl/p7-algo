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

  constructor(type: TagsEnum, _tagSelector: HTMLDetailsElement, searchInstance) {
    this._detailElement = _tagSelector;
    this._summaryElement = _tagSelector.querySelector("summary");
    this._closeBtn = _tagSelector.querySelector("img");
    this._input = _tagSelector.querySelector("input");

    this._UL = this._detailElement.querySelector("ul");
    this.searchInstance = searchInstance;
    this._type = type;
    this.domBuilder = new DOMBuilder(this._UL);
    this._init();
  }

  private _filterTags() {
    this._input.addEventListener("input", (e: InputEvent) => {
      this.searchInstance.filterTagList(e, this._LIElements);
    });
  }

  updateAvailableTags() {
    this._UL.innerHTML = "";
    this.searchInstance[this._type].map((i) => {
      const li = this.domBuilder.buildTagSelectorLiItem(this._type, i);
      this._LIElements.push(li);
      li.addEventListener("click", (e) => {
        this.searchInstance.searchByTag(e);
      });
    });
  }

  /**close all tag selectors*/
  private _closeTagSelectors() {
    this._detailElement.removeAttribute("open");
    document.removeEventListener("click", this._closeTagSelectors.bind(this));
  }

  /**Open the tag selector target*/
  private _openTagSelector(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    this._detailElement.toggleAttribute("open");
    document.addEventListener("click", this._closeTagSelectors.bind(this));
  }

  private _init() {
    // apply open click event
    this._summaryElement.addEventListener("click", this._openTagSelector.bind(this));
    // apply btn click close event
    this._closeBtn.addEventListener("click", (e) => {
      if (this._detailElement.getAttribute("open")) {
        e.stopPropagation();
      }
      this._closeTagSelectors.bind(this);
    });
    this.updateAvailableTags();

    this._filterTags();
  }
}
