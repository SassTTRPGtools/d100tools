<script setup>
import { ref, computed } from 'vue';
import { critTables, critOptions, hitLocationMapping } from '@/rolemaster/utils/critTables.js';

const physicalCategories = [
  { value: 'Krush', label: '鈍擊' },
  { value: 'Puncture', label: '穿刺' },
  { value: 'Slash', label: '揮砍' },
  { value: 'Strikes', label: '打擊' },
  { value: 'Sweeps', label: '橫掃&摔投' },
  { value: 'Unbalance', label: '不平衡' },
  { value: 'Impact', label: '衝擊' },
  { value: 'Subdual', label: '制伏' },
  { value: 'Grapple', label: '擒拿' }
];

const elementalCategories = [
  { value: 'Heat', label: '熱量' },
  { value: 'Cold', label: '寒冷' },
  { value: 'Electricity', label: '閃電' },
  { value: 'Holy', label: '神聖' },
  { value: 'Stream', label: '蒸氣' },
  { value: 'Acid', label: '強酸' }
];

const selectedCategory = ref('Krush');

const selectedTableData = computed(() => {
  return critTables[selectedCategory.value];
});

const selectedCategoryLabel = computed(() => {
  const category = [...physicalCategories, ...elementalCategories].find(option => option.value === selectedCategory.value);
  return category ? category.label : '';
});

const tableData = computed(() => {
  if (selectedTableData.value) {
    const severityLevels = ['A', 'B', 'C', 'D', 'E'];
    const data = [];

    severityLevels.forEach(severity => {
      selectedTableData.value[severity].forEach(item => {
        const existingItem = data.find(d => d.min === item.min && d.max === item.max);
        if (existingItem) {
          existingItem[severity] = item.description;
        } else {
          data.push({
            min: item.min,
            max: item.max,
            range: `${item.min}-${item.max}`,
            location: hitLocationMapping[item.min] || '未知部位',
            [severity]: item.description
          });
        }
      });
    });

    return data;
  }
  return [];
});
</script>

<template>
  <div class="container">
    <div class="button-container">
      <h3>物理類型</h3>
      <div class="button-group">
        <a-button
          v-for="option in physicalCategories"
          :key="option.value"
          @click="selectedCategory = option.value"
          :type="selectedCategory === option.value ? 'primary' : 'default'"
        >
          {{ option.label }}
        </a-button>
      </div>
      <h3>元素表</h3>
      <div class="button-group">
        <a-button
          v-for="option in elementalCategories"
          :key="option.value"
          @click="selectedCategory = option.value"
          :type="selectedCategory === option.value ? 'primary' : 'default'"
        >
          {{ option.label }}
        </a-button>
      </div>
    </div>

    <div v-if="selectedTableData" class="table-container">
      <h3>{{ selectedCategoryLabel }}表（嚴重度）</h3>
      <a-table :dataSource="tableData" :columns="[
        { title: '部位', dataIndex: 'location', key: 'location', width: 100 },
        { title: '範圍', dataIndex: 'range', key: 'range', width: 100 },
        { title: 'A', dataIndex: 'A', key: 'A' },
        { title: 'B', dataIndex: 'B', key: 'B' },
        { title: 'C', dataIndex: 'C', key: 'C' },
        { title: 'D', dataIndex: 'D', key: 'D' },
        { title: 'E', dataIndex: 'E', key: 'E' }
      ]" rowKey="range" :pagination="false" bordered />
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

.button-container {
  width: 80%;
  margin-bottom: 20px;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.table-container {
  width: 70%;
}

h3 {
  text-align: center;
}

.ant-table th,
.ant-table td {
  text-align: center;
}
</style>