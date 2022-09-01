<script setup lang="ts">
import type { Recipe } from "@/api/types";
import type { PropType } from "vue";
import { toRef } from "vue";
import { RouterLink } from "vue-router";

const emit = defineEmits(["delete"]);

const props = defineProps({
  recipe: {
    type: Object as PropType<Recipe>,
    required: true,
  },
});

const handleDelete = (id: number) => {
  emit("delete", id);
};

const recipe = toRef(props, "recipe");
</script>

<template>
  <div class="recipe-card">
    <h3>{{ recipe.title }}</h3>
    <p>{{ recipe.method }}</p>
    <div class="rating">{{ recipe.rating }}</div>
    <div class="buttons">
      <RouterLink :to="'/' + recipe.id">
        <i class="material-icons">edit</i>
      </RouterLink>
      <i
        class="material-icons"
        @click="
          {
            handleDelete(recipe.id);
          }
        "
        >delete</i
      >
    </div>
  </div>
</template>
>
