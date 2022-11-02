export class TagSelector {
  private _detailElement: HTMLDetailsElement;
  private _summaryElement: HTMLElement;
  private _closeBtn: HTMLImageElement;

  constructor(_tagSelector: HTMLDetailsElement) {
    this._detailElement = _tagSelector;
    this._summaryElement = _tagSelector.querySelector("summary");
    this._closeBtn = _tagSelector.querySelector("img");
    this.init();
  }

  /**close all tag selectors*/
  closeTagSelectors() {
    this._detailElement.removeAttribute("open");
    //document.querySelectorAll("details").forEach((d) => d.removeAttribute("open"));
    document.removeEventListener("click", this.closeTagSelectors.bind(this));
  }

  /**Open the tag selector target*/
  openTagSelector(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    // this.closeTagSelectors();
    this._detailElement.toggleAttribute("open");

    document.addEventListener("click", this.closeTagSelectors.bind(this));
  }

  init() {
    // apply open click event
    this._summaryElement.addEventListener("click", this.openTagSelector.bind(this));
    // apply btn click close event
    this._closeBtn.addEventListener("click", (e) => {
      if (this._detailElement.getAttribute("open")) {
        e.stopPropagation();
      }
      this.closeTagSelectors.bind(this);
    });
  }
}
