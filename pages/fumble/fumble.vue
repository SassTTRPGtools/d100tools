<script setup>
import { ref, computed } from 'vue';
import { fumbleJson, fumbleOptions } from '@/rolemaster/utils/fumbleTables.js';
import { notification } from 'ant-design-vue';
import { h } from 'vue';

const meleeCategories = ['OneHandedWeapons', 'TwoHandedWeapons', 'Animal', 'MountedCombat', 'Unarmed'];
const rangedCategories = ['BowsAndCrossbows', 'Sling', 'Throwing', 'ElementalBolt', 'ElementalSphereCone'];

const selectedType = ref(true); // true for 'melee', false for 'ranged'

const selectedTableData = computed(() => {
  const categories = selectedType.value ? meleeCategories : rangedCategories;
  const data = [];

  categories.forEach(category => {
    fumbleJson[category].forEach(item => {
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
  const categories = selectedType.value ? meleeCategories : rangedCategories;
  return [
    { title: '範圍', dataIndex: 'range', key: 'range', width: 100 },
    ...categories.map(category => ({
      title: fumbleOptions.find(option => option.value === category).label,
      dataIndex: category,
      key: category,
      customRender: ({ text }) => text ? renderCell(text) : ''
    }))
  ];
});
</script>

<template>
  <div class="w-full min-h-screen flex flex-col items-center justify-start bg-gray-50 py-8">
    <a-card class="mb-6 w-full max-w-3xl text-sm text-gray-700 bg-white shadow rounded-lg p-4">
      ✊+X : X 傷害, 🩸X: 流血 X /輪, 💦 (-X): 疲勞減值, 🛠️ (-X): 損壞檢定, -X: 受傷減值, X 💫 [-xx]: 眩暈 X 輪及減值[-xx], 😵: 失衡, 🌊 X’: 擊退, 👎: 擊倒/伏地, 🕸️: 擒拿 X%, ✴️(X): 額外重擊, 💀: 目標瀕死或被擊敗
    </a-card>
    <div class="flex flex-col items-center w-full mb-8 pt-8">
      <a-switch
        checked-children="近戰犯蠢表"
        un-checked-children="遠程犯蠢表"
        v-model:checked="selectedType"
        class="mb-4"
      />
    </div>
    <div v-if="selectedTableData.length" class="w-full max-w-5xl bg-white rounded-lg shadow-md p-4">
      <a-table
        :dataSource="selectedTableData"
        :columns="tableColumns"
        rowKey="range"
        :pagination="false"
        bordered
        class="fumble-table"
      />
      <div class="text-xs text-gray-400 mt-2 text-right">* 點擊說明可複製內容</div>
    </div>
  </div>
</template>

<style scoped>
.fumble-table :deep(.ant-table) {
  width: 100%;
}
.fumble-table :deep(.ant-table th),
.fumble-table :deep(.ant-table td) {
  text-align: center;
  vertical-align: middle;
}
</style>