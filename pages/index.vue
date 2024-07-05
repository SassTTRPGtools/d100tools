<script setup lang="ts">
const version = 2 + 1
</script>

<template>
  <div>
    <h1>Home page</h1>
    <NuxtLink to="/about">About page</NuxtLink>
    <div class="hello">
      Hello Nuxt {{ version }}!
    </div>
  </div>
</template>