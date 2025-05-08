<script setup>
import { ref, computed } from 'vue';
import { spellfumbleJson, spellfumbleOptions } from '@/rolemaster/utils/fumbleTables.js';
import { notification } from 'ant-design-vue';
import { h } from 'vue';

const selectedType = ref('Channeling'); // 預設為 'Channeling'

const selectedTableData = computed(() => {
  const data = [];
  const categoryData = spellfumbleJson[selectedType.value];

  Object.keys(categoryData).forEach(category => {
    categoryData[category].forEach(item => {
      const existingItem = data.find(d => d.min === item.min && d.max === item.max);
      if (existingItem) {
        existingItem[category] = item.description;
      } else {
        data.push({
          min: item.min,
          max: item.max,
          range: `${item.min}-${item.max}`,
          [category]: item.description
        });
      }
    });
  });

  return data;
});

function isClient() {
  return typeof window !== 'undefined';
}

function copyToClipboard(text) {
  if (isClient()) {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Copied to clipboard:', text);
      notification.success({
        message: '複製成功',
        description: `已複製內容: ${text}`,
        placement: 'topRight',
      });
    });
  }
}

function renderCell(text) {
  return h(
    'span',
    {
      style: { cursor: 'pointer' },
      onClick: () => {
        copyToClipboard(text);
      },
    },
    text
  );
}

const tableColumns = computed(() => {
  const categoryData = spellfumbleJson[selectedType.value];
  const titleMapping = {
    element: '元素（E）',
    force: '原力（F）',
    information: '情報（I）',
    util: '實用（U）',
  };
  return [
    { title: '範圍', dataIndex: 'range', key: 'range', width: 100 },
    ...Object.keys(categoryData).map(category => ({
      title: titleMapping[category] || category,
      dataIndex: category,
      key: category,
      customRender: ({ text }) => text ? renderCell(text) : ''
    }))
  ];
});
</script>

<template>
  <div class="container">
    <div class="switch-container">
      <a-select v-model:value="selectedType" style="width: 200px">
        <a-select-option v-for="option in spellfumbleOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </a-select-option>
      </a-select>
    </div>

    <div v-if="selectedTableData.length" class="table-container">
      <a-table :dataSource="selectedTableData" :columns="tableColumns" rowKey="range" :pagination="false" bordered />
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

.switch-container {
  padding-top: 20px;
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