import { defineStore } from "pinia";
import supabase from "@/api/supabase";
import type { CreateRecipeDTO, OrderType, Recipe } from "@/api/types";

export type RecipeState = {
  loaded: boolean;
  recipes: Recipe[];
  fetchError: string | null;
  actionError: string | null;
}

export const useRecipeStore = defineStore({
  id: "counter",
  state: () => ({
    loaded: false,
    recipes: <Recipe[]>[],
    fetchError: null,
    actionError: null,
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
    async add(recipe: CreateRecipeDTO) {
      this.actionError = null;
      const { data, error } = await supabase.from("recipes").insert({
        title: recipe.title,
        method: recipe.method,
        rating: recipe.rating,
      });
      if (data) {
        this.recipes = [...this.recipes, data[0]];
      }

      if (error) {
        this.actionError = error.message;
      }
    },
    async delete(recipeId: number) {
      await supabase.from("recipes").delete().eq("id", recipeId);
      this.recipes = this.recipes.filter(r => r.id !== recipeId);
    },
    async update(recipe: Recipe) {
      this.actionError = null;
      const { data, error } = await supabase
        .from("recipes")
        .update({
          title: recipe.title,
          method: recipe.method,
          rating: recipe.rating,
        })
        .eq("id", recipe.id);

      if (data) {
        this.recipes = this.recipes.map(r => {
          if (r.id === recipe.id) {
            return recipe;
          }
          return r;
        })
      }

      if (error) {
        this.actionError = error.message;
      }
    }
  },
});
