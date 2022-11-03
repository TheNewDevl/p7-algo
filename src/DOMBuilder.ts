import { Recipe } from "./types.js";
import { createEl } from "./utils/domFns.js";

export class DOMBuilder {
  private _container: HTMLElement;

  constructor(container: HTMLElement) {
    this._container = container;
  }

  /** Return an article recipe dom element and append it to the given container */
  buildRecipeDOM(recipe: Recipe): HTMLElement {
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

    this._appendEl(article);
    return article;
  }

  /**Append given element to the instance container*/
  private _appendEl(element: HTMLElement) {
    this._container.append(element);
  }

  buildSelectedTagDOM(type: string, value: string) {
    const tag = createEl("div", { "data-type": type, "data-value": value });
    const closeIcon = createEl("img", { alt: "remove tag", src: "../assets/close.svg" });
    tag.append(value, closeIcon);
    this._appendEl(tag);

    return tag;
  }

  buildTagSelectorLiItem(type: string, value: string) {
    const tagLi = createEl(
      "li",
      { "data-tagType": type, "data-display": "shown", "data-tagValue": value },
      value
    );

    this._appendEl(tagLi);

    return tagLi;
  }
}
