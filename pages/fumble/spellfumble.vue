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
  <div class="w-full min-h-screen flex flex-col items-center justify-start bg-gray-50 py-8">
    <h2 class="text-3xl font-bold text-center mb-8 tracking-wide text-gray-800">法術失敗表</h2>
    <div class="mb-8 flex flex-col items-center w-full">
      <a-select v-model:value="selectedType" class="w-56" size="large">
        <a-select-option v-for="option in spellfumbleOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </a-select-option>
      </a-select>
    </div>
    <div v-if="selectedTableData.length" class="w-full max-w-5xl bg-white rounded-lg shadow-md p-4">
      <a-table
        :dataSource="selectedTableData"
        :columns="tableColumns"
        rowKey="range"
        :pagination="false"
        bordered
        class="spellfumble-table"
      />
      <div class="text-xs text-gray-400 mt-2 text-right">* 點擊說明可複製內容</div>
    </div>
  </div>
</template>

<style scoped>
.spellfumble-table :deep(.ant-table) {
  width: 100%;
}
.spellfumble-table :deep(.ant-table th),
.spellfumble-table :deep(.ant-table td) {
  text-align: center;
  vertical-align: middle;
}
</style>