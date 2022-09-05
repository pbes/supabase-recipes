<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import type { Recipe } from "@/api/types";
import supabase from "@/api/supabase";
import { useRecipeStore } from "@/stores/recipe";

const router = useRouter();
const formError = ref("");
const loading = ref(true);

const id = ref(router.currentRoute.value.params.id);
const recipeStore = useRecipeStore();

const formValue: Recipe = reactive<Recipe>({
  id: 0,
  title: "",
  method: "",
  rating: 0,
});

onMounted(async () => {
  let data: Recipe | undefined;
  if (recipeStore.loaded) {
    data = recipeStore.recipes.find((r) => r.id === Number(id.value));
  }

  if (!data) {
    recipeStore.fetch('created_at');
    router.push("/");
  }

  if (data) {
    formValue.id = data.id;
    formValue.title = data.title;
    formValue.method = data.method;
    formValue.rating = data.rating;
  }
  loading.value = false;
});

const handleSubmit = async (e: Event) => {
  e.preventDefault();

  if (!formValue.title || !formValue.method || !formValue.rating) {
    formError.value = "Please fill in all the fields correctly";
    return;
  }

  await recipeStore.update(formValue);
  if (!recipeStore.actionError) {
    formError.value = "";
    router.push("/");
  } else {
    formError.value = recipeStore.actionError;
  }
};
</script>

<template>
  <div class="page create" v-if="!loading">
    <form @submit="handleSubmit">
      <label for="title">Title:</label>
      <input type="text" id="title" v-model="formValue.title" />

      <label for="method">Method:</label>
      <textarea id="method" v-model="formValue.method" />

      <label for="rating">Rating:</label>
      <input type="number" id="rating" v-model="formValue.rating" />

      <button>Update Recipe</button>

      <p class="error" v-if="formError">{{ formError }}</p>
    </form>
  </div>
</template>
