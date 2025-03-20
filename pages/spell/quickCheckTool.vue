<script setup>
import { ref, computed, watch, onMounted, h } from 'vue';
import { spellTables, spellOptions } from '@/rolemaster/utils/spellTables.js';
import { Tabs, TabPane, Button, message, Modal, Input, Select, Collapse } from 'ant-design-vue';

const selectedCategory = ref(spellOptions[0].category);
const selectedOption = ref(spellOptions[0].options[0].value);
const selectedSpellList = ref('');
const favoriteSpellLists = ref([]);

// 載入最愛法術列表，檢查 URL 中是否有 favorites 參數
onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const favoritesParam = urlParams.get('favorites');
  if (favoritesParam) {
    try {
      const importedFavorites = JSON.parse(decodeURIComponent(favoritesParam));
      if (Array.isArray(importedFavorites)) {
        favoriteSpellLists.value = importedFavorites;
        localStorage.setItem('favoriteSpellLists', JSON.stringify(favoriteSpellLists.value));        
      }
    } catch (error) {
      message.error('URL 中的最愛法術列表格式無效');
    }
  } else {
    const savedFavorites = localStorage.getItem('favoriteSpellLists');
    if (savedFavorites) {
      favoriteSpellLists.value = JSON.parse(savedFavorites);
    }
  }
});

const selectedSpell = computed(() => {
  return spellTables[selectedOption.value] || [];
});

const tableColumns = [
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
    const currentSpellListExists = newTableData.some(row => row.spellList === selectedSpellList.value);
    if (!currentSpellListExists) {
      selectedSpellList.value = newTableData[0].spellList;
    }
  }
}, { immediate: true });

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    message.success('已複製');
  }).catch(err => {
    message.error('複製失敗');
  });
};

const addToFavorites = () => {
  if (!favoriteSpellLists.value.includes(selectedSpellList.value)) {
    favoriteSpellLists.value.push(selectedSpellList.value);
    localStorage.setItem('favoriteSpellLists', JSON.stringify(favoriteSpellLists.value));
    message.success('已加入最愛');
  } else {
    message.info('已在最愛中');
  }
};

const clearFavorites = () => {
  favoriteSpellLists.value = [];
  localStorage.removeItem('favoriteSpellLists');
  message.success('已清除所有最愛');
};

// 修改導出最愛功能
const exportFavorites = () => {
  const baseUrl = window.location.origin + window.location.pathname;
  const favoritesUrl = `${baseUrl}?favorites=${encodeURIComponent(JSON.stringify(favoriteSpellLists.value))}`;
  navigator.clipboard.writeText(favoritesUrl).then(() => {
    message.success('URL 已複製');
  }).catch(() => {
    message.error('複製失敗');
  });
};

const selectFavoriteSpellList = (spellList) => {
  let found = false;
  for (const category of spellOptions) {
    for (const option of category.options) {
      const spells = spellTables[option.value] || [];
      if (spells.some(spell => spell.spellList === spellList)) {        
        selectedCategory.value = category.category;
        selectedOption.value = option.value;       
        selectedSpellList.value = spellList;     
        found = true;
        break;
      }
    }
    if (found) break;
  }
  if (!found) {
    message.error('找不到該法術列表');
  }
};
</script>

<template>
  <div class="container">
    <a-collapse style="width: 80%;" accordion>
      <a-collapse-panel key="1" header="選擇法術類別和選項">
        <div class="controls-container">
          <div class="select-container">
            <a-select v-model:value="selectedCategory" style="width: 200px;">
              <a-select-option v-for="category in spellOptions" :key="category.category" :value="category.category">
                {{ category.category }}
              </a-select-option>
            </a-select>
          </div>
          <div class="button-container">
            <div v-for="(category,index) in spellOptions" :key="index">
              <div class="button-group" v-if="category.category === selectedCategory">
                <a-button
                  v-for="option in category.options"
                  :key="option.value"
                  @click="() => selectedOption = option.value"
                  :type="selectedOption === option.value ? 'primary' : 'default'"
                >
                  {{ option.label }}
                </a-button>
              </div>
            </div>
          </div>
        </div>

        <div class="action-buttons">
      <a-button @click="addToFavorites" type="primary" style="margin-bottom: 20px;">
        加入最愛
      </a-button>
      <a-button @click="clearFavorites" type="primary" danger style="margin-bottom: 20px;">
        清除所有最愛
      </a-button>
      <a-button @click="exportFavorites" type="default" style="margin-bottom: 20px;">
        導出最愛
      </a-button>
    </div>
      </a-collapse-panel>
    </a-collapse>



    <div class="favorites-container">
      <h3>最愛法術列表</h3>
      <div class="button-group">
        <a-button
          v-for="spellList in favoriteSpellLists"
          :key="spellList"
          @click="() => selectFavoriteSpellList(spellList)"
        >
          {{ spellList }}
        </a-button>
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
                    :style="{ 'max-width': column.dataIndex === 'details' ? '80%' : 'auto', 'word-wrap': 'break-word' }"
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

.select-container {
  margin-bottom: 20px;
}

.button-container {
  width: 100%;
  margin-bottom: 20px;
  text-align: center;
}

.button-group {
    padding-top: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.favorites-container {
    padding-top: 20px;
  width: 100%;
  margin-bottom: 20px;
  text-align: center;
}

.action-buttons {
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