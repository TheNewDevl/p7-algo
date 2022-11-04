export type Ingredient = {
  ingredient: string;
  quantity?: number;
  unit?: string;
};

export interface Recipe {
  id: number;
  name: string;
  servings: number;
  ingredients: Ingredient[];
  time: number;
  description: string;
  appliance: string;
  utensils: string[];
}

export interface RecipeInstance {
  obj: Recipe;
  DOM: HTMLElement;
}

export interface TagListInstance {
  obj: Recipe;
  DOM: HTMLElement;
}

export interface AttributesParam {
  [key: string]: string;
}

export enum TagsEnum {
  ing = "ingredients",
  app = "appliance",
  ut = "utensils",
}

export interface SelectedTags {
  ingredients: HTMLElement[];
  appliance: HTMLElement[];
  utensils: HTMLElement[];
}
