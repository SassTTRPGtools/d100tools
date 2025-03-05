<script setup>
import { DiceRoller, exportFormats } from '@dice-roller/rpg-dice-roller';
import { ref, computed } from 'vue';

import jsonData from '@/rolemaster/combatdata/CritTable/Krush.json';
const inputValue = ref(0);


const filteredData = computed(() => {
  const result = {};
  for (const categoryName in jsonData) {
    result[categoryName] = jsonData[categoryName].filter(
      (item) =>
        inputValue.value >= item.min && inputValue.value <= item.max
    );
  }
  return result;
});

</script>
<template>
  <div>
    <label for="roll">輸入數字：</label>
    <input type="number" id="roll" v-model.number="inputValue" />
    <div v-for="([categoryName, category], index) in Object.entries(filteredData)" :key="index">
      <h3>{{ categoryName }}</h3>
      <ul>
        <li v-for="(item, index) in category" :key="index">
          {{ item.description }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped></style>