export type OrderType = "created_at" | "rating" | "title";

export interface CreateRecipeDTO {
  title: string;
  method: string;
  rating: number;
}

export interface Recipe extends CreateRecipeDTO {
  id: number;
}
