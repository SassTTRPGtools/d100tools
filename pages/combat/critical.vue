<script setup>
import { DiceRoller, exportFormats } from '@dice-roller/rpg-dice-roller';
import { ref, computed } from 'vue';

import KrushJson from '@/rolemaster/combatdata/CritTable/Krush.json';
import PunctureJson from '@/rolemaster/combatdata/CritTable/Puncture.json';
import SlashJson from '@/rolemaster/combatdata/CritTable/Slash.json';
import StrikesJson from '@/rolemaster/combatdata/CritTable/Strikes.json';
import SweepsJson from '@/rolemaster/combatdata/CritTable/Sweeps.json';
import UnbalanceJson from '@/rolemaster/combatdata/CritTable/Unbalance.json';
import ImpactJson from '@/rolemaster/combatdata/CritTable/Impact.json';
import GrappleJson from '@/rolemaster/combatdata/CritTable/Grapple.json';
import HeatJson from '@/rolemaster/combatdata/CritTable/Heat.json';
import ColdJson from '@/rolemaster/combatdata/CritTable/Cold.json';
import ElectricityJson from '@/rolemaster/combatdata/CritTable/Electricity.json';
import HolyJson from '@/rolemaster/combatdata/CritTable/Holy.json';
import StreamJson from '@/rolemaster/combatdata/CritTable/Stream.json';


const jsonData = {
  Krush: KrushJson,
  Puncture: PunctureJson,
  Slash: SlashJson,
  Strikes: StrikesJson,
  Sweeps: SweepsJson,
  Unbalance: UnbalanceJson,
  Impact: ImpactJson,
  Grapple: GrappleJson,
  Heat: HeatJson,
  Cold: ColdJson,
  Electricity: ElectricityJson,
  Holy: HolyJson,
  Stream: StreamJson,
};

const selectedCategory = ref('Krush');
const secondCategory = ref('A'); // 新增第二個下拉選單的選項
const inputValue = ref(0);

const categoryOptions = Object.keys(jsonData);
const secondCategoryOptions = ['A', 'B', 'C', 'D', 'E']; // 第二個下拉選單的選項

const filteredData = computed(() => {
  const selectedData = jsonData[selectedCategory.value];
  if (selectedData && selectedData[secondCategory.value]) {
    const secondSelectedData = selectedData[secondCategory.value];
    if (Array.isArray(secondSelectedData)) {
      return secondSelectedData.filter((item) => {
        if (
          typeof item.min === 'number' &&
          typeof item.max === 'number' &&
          typeof inputValue.value === 'number'
        ) {
          return inputValue.value >= item.min && inputValue.value <= item.max;
        }
        return false;
      });
    } else {
      console.error(`jsonData[${selectedCategory.value}][${secondCategory.value}] is not an array.`);
      return [];
    }
  } else {
    console.error(`jsonData[${selectedCategory.value}] or jsonData[${selectedCategory.value}][${secondCategory.value}] is undefined.`);
    return [];
  }
});
</script>
<template>
  <div style="display: flex; justify-content: center; padding-top: 20px;">
    <div>
      <a-space direction="vertical">
        <a-form-item label="選擇重擊表：">
          <a-select v-model:value="selectedCategory" :dropdownStyle="{ width: '400px' }">
            <a-select-option v-for="option in categoryOptions" :key="option" :value="option">
              {{ option }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="選擇嚴重度：">
          <a-select v-model:value="secondCategory">
            <a-select-option v-for="option in secondCategoryOptions" :key="option" :value="option">
              {{ option }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="輸入數字：">
          <a-input-number v-model:value="inputValue" />
        </a-form-item>
      </a-space>
    </div>
  </div>
  
  <h3>{{ selectedCategory }}</h3>
      <a-list bordered>
        <a-list-item v-for="(item, index) in filteredData" :key="index">
          {{ item.description }}
        </a-list-item>
      </a-list>
</template>

<style scoped></style>