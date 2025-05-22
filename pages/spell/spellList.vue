<script setup>
import { onMounted, ref, computed } from 'vue';
import { spellTables } from '@/rolemaster/utils/spellTables.js';
import { message, AutoComplete } from 'ant-design-vue';

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

const filteredTableData = computed(() => {
  const query = searchQuery.value.toLowerCase();

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
  }).catch(() => {
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

const $isMobile = ref(false);
onMounted(() => {
  $isMobile.value = window.innerWidth <= 600;
  window.addEventListener('resize', () => {
    $isMobile.value = window.innerWidth <= 600;
  });
});
</script>

<template>
  <div class="container">
    <div class="controls-container">
      <a-auto-complete
        v-model:value="searchQuery"
        :options="autoCompleteOptions"
        @select="handleSelect"
        placeholder="搜尋細節"
        style="width: 100%; max-width: 300px; margin-bottom: 20px;"
      />
    </div>
    <div class="content-container">
      <div v-if="filteredTableData.length > 0" class="table-container">
        <div class="mobile-table" v-if="$isMobile">
          <div v-for="(row, index) in filteredTableData" :key="index" class="mobile-row">
            <div class="mobile-cell mainList" @click="handleTableClick(row.mainList)">
              <span class="mobile-label">主法表：</span>{{ row.mainList }}
            </div>
            <div class="mobile-cell spellList" @click="handleTableClick(row.spellList)">
              <span class="mobile-label">次法表：</span>{{ row.spellList }}
            </div>
            <div class="mobile-cell details" @click="copyToClipboard(row.details)">
              <span class="mobile-label">細節：</span>{{ row.details }}
            </div>
          </div>
        </div>
        <table v-else class="min-w-full divide-y divide-gray-200 border">
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
  padding: 10px;
}

.controls-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 10px;
  margin-bottom: 10px;
  width: 100%;
}

.controls-container .ant-select,
.controls-container .ant-input,
.controls-container .ant-select-selector {
  width: 300px !important;
  max-width: 100%;
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
  width: 100%;
  max-width: 800px;
}

/* 手機版樣式 */
.mobile-table {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
.mobile-row {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.mobile-cell {
  font-size: 15px;
  padding: 2px 0;
  word-break: break-all;
  cursor: pointer;
}
.mobile-label {
  color: #888;
  font-size: 13px;
  margin-right: 4px;
}

@media (max-width: 600px) {
  .table-container {
    width: 100%;
    max-width: 100vw;
    padding: 0;
  }
  .controls-container {
    width: 100%;
    padding: 0 4px;
  }
  .controls-container .ant-select,
  .controls-container .ant-input,
  .controls-container .ant-select-selector {
    width: 100% !important;
    min-width: 0;
  }
}
</style>