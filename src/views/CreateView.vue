<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import supabase from "@/api/supabase";
import type { CreateRecipeDTO } from "@/api/types";

const router = useRouter();

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

  const { data, error } = await supabase.from("recipes").insert({
    title: formValue.title,
    method: formValue.method,
    rating: formValue.rating,
  });

  if (error) {
    formError.value = "Supabase error: " + error.message;
    return;
  }

  if (data) {
    formError.value = "";
    router.push("/");
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
