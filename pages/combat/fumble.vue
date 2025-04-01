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
  <div class="container">
    <a-card class="info-card">
      ✊+X : X 傷害, 🩸X: 流血 X /輪, 💦 (-X): 疲勞減值, 🛠️ (-X): 損壞檢定, -X: 受傷減值, X 💫 [-xx]: 眩暈 X 輪及減值[-xx], 😵: 失衡, 🌊 X’: 擊退, 👎: 擊倒/伏地, 🕸️: 擒拿 X%, ✴️(X): 額外重擊, 💀: 目標瀕死或被擊敗
    </a-card>

    <div class="switch-container">
      <a-switch
        checked-children="近戰犯蠢表"
        un-checked-children="遠程犯蠢表"
        v-model:checked="selectedType"
      />
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