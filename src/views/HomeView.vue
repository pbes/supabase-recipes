<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import type { OrderType } from "@/api/types";
import RecipeCard from "../components/RecipeCard.vue";
import { useRecipeStore } from "@/stores/recipe";

const ordering = ref<OrderType>("created_at");
const recipeStore = useRecipeStore();

onMounted(() => {
  // TODO we can remove this condition and force refresh on every mount
  if (!recipeStore.loaded) {
    refresh();
  }
});

watch(ordering, () => {
  refresh();
});

const setOrderBy = (type: OrderType) => {
  ordering.value = type;
};

const handleDelete = async (id: number) => {
  recipeStore.delete(id);
};

const refresh = () => {
  recipeStore.fetch(ordering.value);
};

// Prerequisites: supabase, .env values are set, recipes table is created
</script>

<template>
  <main>
    <div class="page home">
      <p class="error" v-if="recipeStore.fetchError">{{ recipeStore.fetchError }}</p>
      <div class="recipes">
        <div class="order-by">
          <p>Order by:</p>
          <button @click="setOrderBy('created_at')">Time Created</button>
          <button @click="setOrderBy('title')">Title</button>
          <button @click="setOrderBy('rating')">Rating</button>
        </div>
        <template v-if="recipeStore.recipes">
          <div class="recipe-grid">
            <RecipeCard
              v-for="recipe in recipeStore.recipes"
              :key="recipe.id"
              :recipe="recipe"
              @delete="handleDelete"
            />
          </div>
        </template>
      </div>
    </div>
  </main>
</template>
