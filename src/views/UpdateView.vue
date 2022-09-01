<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import type { Recipe } from "@/api/types";
import supabase from "@/api/supabase";

const router = useRouter();
const formError = ref("");
const loading = ref(true);

const id = ref(router.currentRoute.value.params.id);

const formValue: Recipe = reactive<Recipe>({
  id: 0,
  title: "",
  method: "",
  rating: 0,
});

onMounted(async () => {
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("id", id.value);

  if (error) {
    router.push("/");
  }

  if (data) {
    formValue.id = data[0].id;
    formValue.title = data[0].title;
    formValue.method = data[0].method;
    formValue.rating = data[0].rating;
  }
  loading.value = false;
});

const handleSubmit = async (e: Event) => {
  e.preventDefault();

  if (!formValue.title || !formValue.method || !formValue.rating) {
    formError.value = "Please fill in all the fields correctly";
    return;
  }

  const { data, error } = await supabase
    .from("recipes")
    .update({
      title: formValue.title,
      method: formValue.method,
      rating: formValue.rating,
    })
    .eq("id", formValue.id);

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
