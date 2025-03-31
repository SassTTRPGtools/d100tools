<script setup>
import { ref, computed, watch } from 'vue';
import { spellTables, spellOptions } from '@/rolemaster/utils/spellTables.js';
import { Tabs, TabPane, Button, message, AutoComplete } from 'ant-design-vue';

const selectedSpell = computed(() => {
  return Object.values(spellTables).flat() || [];
});

const searchQuery = ref('');

const tableColumns = [
  { title: '主法表', dataIndex: 'mainList', key: 'mainList', width: '10%' },
  { title: '次法表', dataIndex: 'spellList', key: 'spellList', width: '10%' },
  { title: '細節', dataIndex: 'details', key: 'details', width: '80%' },
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
      mainList: spell.mainList,
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
  const query = searchQuery.value.toLowerCase();

  // 搜尋 spellTables 的所有內容
  const allSpells = Object.values(spellTables).flat();

  const baseData = allSpells.filter(spell => spell.level !== 0);

  if (query) {
    return baseData
      .filter(spell => {
      const details = formatDetails(spell).toLowerCase();
      const mainList = spell.mainList.toLowerCase();
      const spellList = spell.spellList.toLowerCase();
      return details.includes(query) || mainList.includes(query) || spellList.includes(query);
      })
      .map(spell => ({
      mainList: spell.mainList,
      spellList: spell.spellList,
      details: formatDetails(spell),
      level: spell.level,
      }));
    }

  return baseData.map(spell => ({
    mainList: spell.mainList,
    spellList: spell.spellList,
    details: formatDetails(spell),
    level: spell.level,
  }));
});

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    message.success('已複製');
  }).catch(err => {
    message.error('複製失敗');
  });
};

const autoCompleteOptions = computed(() => {
  const allSpells = Object.values(spellTables).flat();
  const uniqueSpellNames = Array.from(new Set(allSpells.map(spell => spell.spellName)));
  return uniqueSpellNames.map(spellName => ({
    value: spellName,
    label: spellName,
  }));
});

const handleSelect = (value) => {
  searchQuery.value = value;
};

const handleTableClick = (value) => {
  searchQuery.value = value;
};
</script>

<template>
  <div class="container">
    <div class="controls-container">
      <a-auto-complete
        v-model:value="searchQuery"
        :options="autoCompleteOptions"
        @select="handleSelect"
        placeholder="搜尋細節"
        style="width: 300px; margin-bottom: 20px;"
      />
    </div>
    <div class="content-container">
      <div v-if="filteredTableData.length > 0" class="table-container">
        <table class="min-w-full divide-y divide-gray-200 border">
          <thead class="bg-gray-50">
            <tr>
              <th
                v-for="column in tableColumns"
                :key="column.key"
                scope="col"
                class="px-2 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border"
                :style="{ width: column.width }"
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
                @click="column.dataIndex === 'details' 
                  ? copyToClipboard(row[column.dataIndex]) 
                  : (column.dataIndex === 'mainList' || column.dataIndex === 'spellList') && handleTableClick(row[column.dataIndex])"
              >
                {{ row[column.dataIndex] }}
              </td>
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
  margin-bottom: 20px; /* 新增與表格的間隔 */
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