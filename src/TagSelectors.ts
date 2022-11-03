import { DOMBuilder } from "./DOMBuilder.js";
import { TagsEnum } from "./types.js";
import { Search } from "./Search";

export class TagSelector {
  private _detailElement: HTMLDetailsElement;
  private _summaryElement: HTMLElement;
  private _closeBtn: HTMLImageElement;
  private _input: HTMLInputElement;

  private readonly _UL: HTMLUListElement;
  private readonly _type: TagsEnum;
  //private readonly _eventCb: (e: MouseEvent) => void;
  private readonly searchInstance: Search;
  private domBuilder: DOMBuilder;

  private items: string[];

  constructor(
    type: TagsEnum,
    _tagSelector: HTMLDetailsElement,
    // cb: (e: MouseEvent) => void,
    searchInstance,
    items: string[]
  ) {
    this._detailElement = _tagSelector;
    this._summaryElement = _tagSelector.querySelector("summary");
    this._closeBtn = _tagSelector.querySelector("img");
    this._input = _tagSelector.querySelector("input");

    this._UL = this._detailElement.querySelector("ul");
    // this._eventCb = cb;
    this.searchInstance = searchInstance;
    this._type = type;
    this.domBuilder = new DOMBuilder(this._UL);
    this.items = items;
    this._init();
  }

  updateItems(items: string[]) {
    this.items = items;
    this._displayAvailableTags();
  }

  private _displayAvailableTags() {
    this._UL.innerHTML = "";
    this.items.map((i) => {
      const li = this.domBuilder.buildTagSelectorLiItem(this._type, i);
      li.addEventListener("click", this.searchInstance.searchByTag);
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
    this._displayAvailableTags();
    this._filterListItems();
  }
}
