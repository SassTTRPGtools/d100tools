<script setup>
import { ref, computed, watchEffect } from 'vue';
import { atkTables, atkOptions, atkSizeTables } from '@/rolemaster/utils/attackTables.js';
import { critSeverityOptions } from '@/rolemaster/utils/critTables.js';

const selectedCategory = ref(atkOptions[0].options[0].value);
const selectedSize = ref('Medium'); // 預設為中型

const selectedTableData = computed(() => {
  return atkTables[selectedCategory.value];
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
  const imageName = selectedCategory.value.replace(/\s+/g, '') + '.webp';
  if (images[`/public/ATKTableImage/${imageName}`]) {
    imageSrc.value = await images[`/public/ATKTableImage/${imageName}`]();
  } else {
    imageSrc.value = '';
  }
});
</script>

<template>
  <div class="container">
    <div class="controls-container">
      <div class="button-container">
        <div v-for="category in atkOptions" :key="category.category">
          <h3>{{ category.category }}</h3>
          <div class="button-group">
            <a-button
              v-for="option in category.options"
              :key="option.value"
              @click="selectedCategory = option.value"
              :type="selectedCategory === option.value ? 'primary' : 'default'"
            >
              {{ option.label }}
            </a-button>
          </div>
        </div>
      </div>
    </div>

    <div class="content-container">
      <img :src="imageSrc" alt="Attack Table Image" class="attack-image" />
      <div v-if="selectedTableData" class="table-container">
        <div class="size-selector">
          <a-select v-model:value="selectedSize" style="width: 200px">
            <a-select-option v-for="(size, key) in atkSizeTables" :key="key" :value="key">
              {{ size.label }}
            </a-select-option>
          </a-select>
        </div>
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
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20px;
}

.controls-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 20px;
}

.button-container {
  width: 100%;
  margin-bottom: 20px;
  text-align: center;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.size-selector {
  margin-bottom: 20px;
  text-align: center;
}

.content-container {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
}

.attack-image {
  padding-top: 50px;
  margin-right: 20px;
  align-self: flex-start; /* 確保圖片與表格標題對齊 */
}

.table-container {
  flex: 1;
}

h3 {
  text-align: center;
}

th, td {
  padding: 4px 8px; /* 縮小表格高度的間距 */
  border: 1px solid #e5e7eb; /* 添加框線 */
}

.bg-gray-100 {
  background-color: #f3f4f6; /* 每三行用灰色背景 */
}
</style>