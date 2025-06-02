<script setup>
import { ref, computed, watchEffect, watch } from 'vue';
import { atkTables, atkOptions, atkSizeTables } from '@/rolemaster/utils/attackTables.js';
import { critSeverityOptions } from '@/rolemaster/utils/critTables.js';

const selectedCategory = ref(atkOptions[0].category);
const selectedSubCategory = ref(atkOptions[0].options[0].value);
const selectedSize = ref('Medium'); // 預設為中型

// 監聽 selectedCategory 的變化，並自動更新 selectedSubCategory
watch(selectedCategory, (newCategory) => {
  const category = atkOptions.find(option => option.category === newCategory);
  if (category && category.options.length > 0) {
    selectedSubCategory.value = category.options[0].value;
  }
});

const selectedTableData = computed(() => {
  return atkTables[selectedSubCategory.value];
});

const getCritSeverity = (description, size) => {
  const severityMap = critSeverityOptions.map(option => option.value);
  const sizeAdjustment = atkSizeTables[size].sizeAdjustment;

  let descriptionLetter;
  if (isNaN(description)) {
    descriptionLetter = description.slice(-2, -1);
    let currentlyIndex = severityMap.indexOf(descriptionLetter);
    let newIndex = severityMap.indexOf(descriptionLetter);

    newIndex += sizeAdjustment;

    if (newIndex < 0) {
      newIndex = 0;
    } else if (newIndex > 10) {
      newIndex = 10;
    }

    return description.replace(severityMap[currentlyIndex], severityMap[newIndex]);
  } else {
    return description;
  }
};

const tableData = computed(() => {
  if (selectedTableData.value) {
    const data = [];
    const ranges = new Set();
    const multiplier = atkSizeTables[selectedSize.value].multiplier;

    for (const [key, value] of Object.entries(selectedTableData.value)) {
      for (const [range, description] of Object.entries(value)) {
        if (!ranges.has(range)) {
          ranges.add(range);
          data.push({ range });
        }
        const row = data.find(d => d.range === range);
        const numericValue = parseFloat(description);

        const newValue = Math.ceil(numericValue * multiplier);
        row[key] = getCritSeverity(description.replace(numericValue, newValue), selectedSize.value);
      }
    }
    return data;
  }
  return [];
});

const tableColumns = computed(() => {
  return [
    { title: '範圍', dataIndex: 'range', key: 'range', width: 50 },
    ...Array.from({ length: 10 }, (_, i) => ({
      title: `${i + 1}`,
      dataIndex: `${i + 1}`,
      key: `${i + 1}`,
      width: 40
    }))
  ];
});

const images = import.meta.glob('/public/ATKTableImage/*.webp', { query: '?url', import: 'default' });

const imageSrc = ref('');

watchEffect(async () => {
  const imageName = selectedSubCategory.value.replace(/\s+/g, '') + '.webp';
  if (images[`/public/ATKTableImage/${imageName}`]) {
    imageSrc.value = await images[`/public/ATKTableImage/${imageName}`]();
  } else {
    imageSrc.value = '';
  }
});
</script>

<template>
  <div class="w-full min-h-screen flex flex-col items-center justify-start bg-gray-50 py-8">
    <div class="flex flex-col items-center w-full mb-8">
      <div class="flex gap-4 mb-4">
        <a-select v-model:value="selectedCategory" class="w-52">
          <a-select-option v-for="option in atkOptions" :key="option.category" :value="option.category">
            {{ option.category }}
          </a-select-option>
        </a-select>
        <a-select v-model:value="selectedSubCategory" class="w-96">
          <a-select-option
            v-for="option in atkOptions.find(option => option.category === selectedCategory)?.options || []"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </a-select-option>
        </a-select>
      </div>
    </div>
    <div class="flex flex-row w-full max-w-7xl justify-center items-start gap-8">
      <img :src="imageSrc" alt="Attack Table Image" class="pt-12 mr-4 max-h-[1000px] rounded shadow" />
      <div v-if="selectedTableData" class="flex-1">
        <div class="flex justify-end mb-4">
          <a-select v-model:value="selectedSize" class="w-52">
            <a-select-option v-for="(size, key) in atkSizeTables" :key="key" :value="key">
              {{ size.label }}
            </a-select-option>
          </a-select>
        </div>
        <div class="overflow-x-auto rounded-lg shadow bg-white">
          <table class="min-w-full divide-y divide-gray-200 border">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-2 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">範圍</th>
                <th v-for="column in tableColumns.slice(1)" :key="column.key" scope="col" class="px-2 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">{{ column.title }}</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(row, index) in tableData" :key="row.range" :class="{'bg-gray-100': Math.floor(index / 3) % 2 === 0}">
                <td class="px-2 py-1 whitespace-nowrap text-sm text-gray-500 text-center border">{{ row.range }}</td>
                <td v-for="column in tableColumns.slice(1)" :key="column.key" class="px-2 py-1 whitespace-nowrap text-sm text-gray-500 text-center border">{{ row[column.dataIndex] }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-gray-100 {
  background-color: #f3f4f6;
}
</style>