<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import type { Ref } from "vue";
import supabase from "@/api/supabase";
import type { OrderType, Recipe } from "@/api/types";
import RecipeCard from "../components/RecipeCard.vue";

const recipes: Ref<Recipe[]> = ref<Recipe[]>([]);
const fetchError = ref("");
const ordering = ref<OrderType>("created_at");

onMounted(() => {
  refresh(ordering.value);
});

watch(ordering, () => {
  refresh(ordering.value);
});

const refresh = async (order: OrderType) => {
  fetchError.value = "";
  const ascending = order === "created_at" || order === "title";

  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .order(order, { ascending: ascending });

  if (error) {
    fetchError.value = "Supabase error: " + error.message;
    return;
  }

  if (data) {
    recipes.value = data;
  }
};

const setOrderBy = (type: OrderType) => {
  ordering.value = type;
};

const handleDelete = async (id: number) => {
  await supabase.from("recipes").delete().eq("id", id);
  refresh(ordering.value);
};

// Prerequisites: supabase, .env values are set, recipes table is created
</script>

<template>
  <main>
    <div class="page home">
      <p class="error" v-if="fetchError">{{ fetchError }}</p>
      <div class="recipes">
        <div class="order-by">
          <p>Order by:</p>
          <button @click="setOrderBy('created_at')">Time Created</button>
          <button @click="setOrderBy('title')">Title</button>
          <button @click="setOrderBy('rating')">Rating</button>
        </div>
        <template v-if="recipes">
          <div class="recipe-grid">
            <RecipeCard
              v-for="recipe in recipes"
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
