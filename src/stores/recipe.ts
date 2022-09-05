import { defineStore } from "pinia";
import supabase from "@/api/supabase";
import type { OrderType, Recipe } from "@/api/types";

export type RecipeState = {
  loaded: boolean;
  recipes: Recipe[];
  fetchError: string | null;
}

export const useRecipeStore = defineStore({
  id: "counter",
  state: () => ({
    loaded: false,
    recipes: <Recipe[]>[],
    fetchError: null,
  } as RecipeState),
  actions: {
    async fetch(order: OrderType) {
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .order(order, { ascending: true });

      if (error) {
        this.fetchError = error.message;
        this.recipes = [];
      }

      if (data) {
        this.loaded = true;
        this.recipes = data;
      }
    },
    add(recipe: Recipe) {
      this.recipes = [...this.recipes, recipe];
    },
    async delete(recipeId: number) {
      await supabase.from("recipes").delete().eq("id", recipeId);
      this.recipes = this.recipes.filter(r => r.id !== recipeId);
    },
    update(recipe: Recipe) {
      this.recipes = this.recipes.map(r => {
        if (r.id === recipe.id) {
          return recipe;
        }
        return r;
      })
    }
  },
});
