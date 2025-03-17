<script setup>
import { ref, computed, watch } from 'vue';
import { spellTables, spellOptions } from '@/rolemaster/utils/spellTables.js';
import { Tabs, TabPane, Button, message } from 'ant-design-vue';

const selectedCategory = ref(spellOptions[0].options[0].value);
const selectedSpellList = ref('');
const selectedSpell = computed(() => {
  return spellTables[selectedCategory.value] || [];
});

const tableColumns = [
  { title: '細節', dataIndex: 'details', key: 'details', width: 800 },
];

const formatDetails = (spell) => {
  if (spell.level === 0) {
    return spell.details;
  }
  return `${spell.level}. ${spell.spellName}（範圍：${spell.areaOfEffect}；持續時間：${spell.duration}；射程：${spell.range}；類型：${spell.type}）：${spell.details}`;
};

const tableData = computed(() => {
  if (selectedSpell.value.length > 0) {
    const data = selectedSpell.value.map(spell => ({
      spellList: spell.spellList,
      spellName: spell.spellName,
      details: formatDetails(spell),
      level: spell.level,
    }));
    return data;
  }
  return [];
});

const filteredTableData = computed(() => {
  if (selectedSpellList.value) {
    return tableData.value.filter(row => row.spellList === selectedSpellList.value && row.level !== 0);
  }
  return tableData.value.filter(row => row.level !== 0);
});

const levelZeroDetails = computed(() => {
  if (selectedSpellList.value) {
    const levelZeroSpell = tableData.value.find(spell => spell.spellList === selectedSpellList.value && spell.level === 0);
    return levelZeroSpell ? levelZeroSpell.details : '';
  }
  return '';
});

// Watch for changes in tableData to set the default selectedSpellList
watch(tableData, (newTableData) => {
  if (newTableData.length > 0) {
    selectedSpellList.value = newTableData[0].spellList;
  }
}, { immediate: true });

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    message.success('已複製');
  }).catch(err => {
    message.error('複製失敗');
  });
};
</script>

<template>
  <div class="container">
    <div class="controls-container">
      <div class="button-container">
        <div v-for="category in spellOptions" :key="category.category">
          <h3>{{ category.category }}</h3>
          <div class="button-group">
            <a-button
              v-for="option in category.options"
              :key="option.value"
              @click="() => selectedCategory = option.value"
              :type="selectedCategory === option.value ? 'primary' : 'default'"
            >
              {{ option.label }}
            </a-button>
          </div>
        </div>
      </div>
    </div>

    <a-tabs v-model:activeKey="selectedSpellList" centered>
      <a-tab-pane
        v-for="spellList in [...new Set(tableData.map(row => row.spellList))]"
        :key="spellList"
        :tab="spellList"
      >
        <div class="content-container">
          <div v-if="levelZeroDetails" class="level-zero-details">
            <p>{{ levelZeroDetails }}</p>
          </div>
          <div v-if="filteredTableData.length > 0" class="table-container">
            <table class="min-w-full divide-y divide-gray-200 border">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    v-for="column in tableColumns"
                    :key="column.key"
                    scope="col"
                    class="px-2 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border"
                  >
                    {{ column.title }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(row, index) in filteredTableData" :key="index">
                  <td
                    v-for="column in tableColumns"
                    :key="column.key"
                    class="px-2 py-1 text-sm text-gray-500 text-center border"                    
                    @click="column.dataIndex === 'details' && copyToClipboard(row[column.dataIndex])"
                  >
                    {{ row[column.dataIndex] }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
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

.content-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.table-container {
  flex: 1;
  width: 80%;
}

.level-zero-details {
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #e5e7eb;
  background-color: #f9fafb;
  width: 80%;
}

h3 {
  text-align: center;
}

th, td {
  padding: 4px 8px;
  border: 1px solid #e5e7eb;
}

td {
  word-wrap: break-word;
  text-align: left;
  cursor: pointer;
}
</style>