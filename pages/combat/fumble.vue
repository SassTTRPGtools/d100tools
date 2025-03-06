<script setup>
import { DiceRoller, exportFormats } from '@dice-roller/rpg-dice-roller';
import { reactive, ref } from 'vue';
import jsonData from '@/rolemaster/combatdata/fumble.json';


const secondCategoryOptions = [
  { value: 'OneHandedWeapons', label: '單手武器' },
  { value: 'TwoHandedWeapons', label: '雙手武器' },
  { value: 'Animal', label: '動物' },
  { value: 'MountedCombat', label: '騎乘戰鬥' },
  { value: 'Unarmed', label: '無武裝' },
  { value: 'BowsAndCrossbows', label: '弓弩類' },
  { value: 'Sling', label: '投石索' },
  { value: 'Throwing', label: '投擲' },
  { value: 'ElementalBolt', label: '元素箭' },
  { value: 'ElementalSphereCone', label: '元素球／錐形' },
];

const selectedCategory = ref(secondCategoryOptions[0].value);
const rollResult = ref(null);
const fumbleResult = ref(null);

const rollDice = () => {
  const roller = new DiceRoller();
  const roll = roller.roll('1d100');
  rollResult.value = roll.total;
  findFumbleResult();
};

const findFumbleResult = () => {
  const category = jsonData[selectedCategory.value];
  if (category) {
    fumbleResult.value = category.find(
      (item) => rollResult.value >= item.min && rollResult.value <= item.max
    );
  }
};

</script>


<template>
  <div class="container">
    <div class="form-container">
      <a-form-item label="犯蠢結果表：">
        <a-select v-model:value="selectedCategory" style="width: 200px">
          <a-select-option v-for="option in secondCategoryOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-button type="primary" @click="rollDice">Roll Dice</a-button>
    </div>
    <div v-if="rollResult !== null" class="result">
      <p>Roll Result: {{ rollResult }}</p>
      <p v-if="fumbleResult">Fumble Result: {{ fumbleResult.description }}</p>
      <p v-else>No result found.</p>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100vh;
  padding-top: 20px;
}

.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.result {
  text-align: center;
  margin-top: 20px;
}
</style>