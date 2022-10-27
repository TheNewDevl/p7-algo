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
