<script setup>
import { ref, computed, h } from 'vue';
import { AlchemicalJson, AlchemicalFumbleOptions } from '@/rolemaster/utils/fumbleTables.js';
import { notification } from 'ant-design-vue';

const selectedType = ref(AlchemicalFumbleOptions[0].value);

const selectedTableData = computed(() => {
  const data = [];
  const categoryData = AlchemicalJson[selectedType.value] || [];
  categoryData.forEach(item => {
    data.push({
      min: item.min,
      max: item.max,
      range: item.min === item.max ? `${item.min}` : `${item.min}-${item.max}`,
      description: item.description
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
      class: 'cursor-pointer hover:text-blue-600 transition',
      onClick: () => {
        copyToClipboard(text);
      },
    },
    text
  );
}

const tableColumns = [
  { title: '範圍', dataIndex: 'range', key: 'range', width: 100 },
  {
    title: '說明',
    dataIndex: 'description',
    key: 'description',
    customRender: ({ text }) => text ? renderCell(text) : ''
  }
];
</script>

<template>
  <div class="w-full min-h-screen flex flex-col items-center justify-start bg-gray-50 py-8">
    <h2 class="text-3xl font-bold text-center mb-8 tracking-wide text-gray-800">煉金法術失敗表</h2>
    <div class="mb-8 flex flex-col items-center w-full">
      <a-select v-model:value="selectedType" class="w-56" size="large">
        <a-select-option v-for="option in AlchemicalFumbleOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </a-select-option>
      </a-select>
    </div>
    <div v-if="selectedTableData.length" class="w-full max-w-3xl bg-white rounded-lg shadow-md p-4">
      <a-table
        :dataSource="selectedTableData"
        :columns="tableColumns"
        rowKey="range"
        :pagination="false"
        bordered
        class="alchemical-table"
      />
      <div class="text-xs text-gray-400 mt-2 text-right">* 點擊說明可複製內容</div>
    </div>
  </div>
</template>

<style scoped>
.alchemical-table :deep(.ant-table) {
  width: 100%;
}
.alchemical-table :deep(.ant-table th),
.alchemical-table :deep(.ant-table td) {
  text-align: center;
  vertical-align: middle;
}
</style>