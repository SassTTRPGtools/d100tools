<script setup>
import { DiceRoller, exportFormats } from '@dice-roller/rpg-dice-roller';
import { reactive, ref } from 'vue';
import jsonData from '@/rolemaster/combatdata/fumble.json';


</script>
<template>
  <div>
    {{ jsonData }}
  </div>
</template>

<style scoped></style>