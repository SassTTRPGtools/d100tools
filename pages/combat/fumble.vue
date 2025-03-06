<script setup>
import { ref, computed } from 'vue';
import { fumbleJson, fumbleOptions } from '@/rolemaster/utils/fumbleTables.js';

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

const tableColumns = computed(() => {
  const categories = selectedType.value ? meleeCategories : rangedCategories;
  return [
    { title: '範圍', dataIndex: 'range', key: 'range', width: 100 },
    ...categories.map(category => ({
      title: fumbleOptions.find(option => option.value === category).label,
      dataIndex: category,
      key: category,
      customCell: (record) => ({ children: record[category] || '' })
    }))
  ];
});
</script>

<template>
  <div class="container">
    <div class="switch-container">
      <a-switch
        checked-children="近戰"
        un-checked-children="遠程"
        v-model:checked="selectedType"
      />
    </div>

    <div v-if="selectedTableData.length" class="table-container">
      <h3>{{ selectedType ? '近戰犯蠢表' : '遠程犯蠢表' }}</h3>
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