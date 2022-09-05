<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import supabase from "@/api/supabase";
import type { CreateRecipeDTO } from "@/api/types";
import { useRecipeStore } from "@/stores/recipe";

const router = useRouter();
const recipeStore = useRecipeStore();

const formError = ref("");
const formValue: CreateRecipeDTO = reactive<CreateRecipeDTO>({
  title: "",
  method: "",
  rating: 0,
});

const handleSubmit = async (e: Event) => {
  e.preventDefault();

  if (!formValue.title || !formValue.method || !formValue.rating) {
    formError.value = "Please fill in all the fields correctly";
    return;
  }
  
  await recipeStore.add(formValue);
  if (!recipeStore.actionError) {
    formError.value = "";
    router.push("/");
  } else {
    formError.value = recipeStore.actionError;
  }
};
</script>

<template>
  <div class="page create">
    <form @submit="handleSubmit">
      <label for="title">Title:</label>
      <input type="text" id="title" required v-model="formValue.title" />

      <label for="method">Method:</label>
      <textarea id="method" required v-model="formValue.method" />

      <label for="rating">Rating:</label>
      <input
        type="number"
        id="rating"
        min="1"
        max="5"
        v-model="formValue.rating"
      />

      <button>Create Recipe</button>

      <p class="error" v-if="formError">{{ formError }}</p>
    </form>
  </div>
</template>
