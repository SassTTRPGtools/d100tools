<script setup>
import { ref, computed } from 'vue';
import { critTables, critOptions } from '@/rolemaster/utils/critTables.js';

const selectedCategory = ref('Krush');
const selectedsecondCategory = ref('A');
const inputValue = ref(0);

const critSeverityOptions = [
  { value: 'A', label: 'A' },
  { value: 'B', label: 'B' },
  { value: 'C', label: 'C' },
  { value: 'D', label: 'D' },
  { value: 'E', label: 'E' },
];


const filteredData = computed(() => {
  const selectedData = critTables[selectedCategory.value];
  if (selectedData && selectedData[selectedsecondCategory.value]) {
    const secondSelectedData = selectedData[selectedsecondCategory.value];
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
      console.error(`critTables[${selectedCategory.value}][${selectedsecondCategory.value}] is not an array.`);
      return [];
    }
  } else {
    console.error(`critTables[${selectedCategory.value}] or critTables[${selectedCategory.value}][${selectedsecondCategory.value}] is undefined.`);
    return [];
  }
});

const selectedCategoryLabel = computed(() => {
  const category = critOptions.find(option => option.value === selectedCategory.value);
  return category ? category.label : '';
});
</script>
<template>
  <div style="display: flex; justify-content: center; padding-top: 20px;">
    <div>
      <a-space direction="vertical">
        <a-form-item label="選擇重擊表：">
          <a-select v-model:value="selectedCategory" :dropdownStyle="{ width: '400px' }">
            <a-select-option v-for="option in critOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="選擇嚴重度：">
          <a-select v-model:value="selectedsecondCategory">
            <a-select-option v-for="option in critSeverityOptions" :key="option.value" :value="option.value">
              {{ option.value }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="輸入數字：">
          <a-input-number v-model:value="inputValue" />
        </a-form-item>
      </a-space>
    </div>
  </div>
  
  <h3>{{ selectedCategoryLabel }}</h3>
      <a-list bordered>
        <a-list-item v-for="(item, index) in filteredData" :key="index">
          {{ item.description }}
        </a-list-item>
      </a-list>
</template>

<style scoped></style>