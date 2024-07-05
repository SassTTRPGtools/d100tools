<script setup lang="ts">
const version = 2 + 1
</script>

<template>
  <div>
    <h1>Home page</h1>
    <NuxtLink to="/about">About page</NuxtLink>
    <h1 class="text-3xl font-bold underline">
      Hello Nuxt {{ version }}!
    </h1>
  </div>
</template>