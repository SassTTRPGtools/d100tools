<script setup>
import { ref, computed, h, watch } from 'vue';
import { critTables, critOptions, hitLocationMapping } from '@/rolemaster/utils/critTables.js';
import { usePlayerStore } from '@/stores/playerStore'; // 引入玩家狀態管理

const playerStore = usePlayerStore(); // 使用玩家狀態管理
const physicalCategories = [
  { value: 'Krush', label: '鈍擊' },
  { value: 'Puncture', label: '穿刺' },
  { value: 'Slash', label: '揮砍' },
  { value: 'Strikes', label: '打擊' },
  { value: 'Sweeps', label: '橫掃&摔投' },
  { value: 'Unbalance', label: '不平衡' },
  { value: 'Impact', label: '衝擊' },
  { value: 'Subdual', label: '制伏' },
  { value: 'Grapple', label: '擒拿' }
];

const elementalCategories = [
  { value: 'Heat', label: '熱量' },
  { value: 'Cold', label: '寒冷' },
  { value: 'Electricity', label: '閃電' },
  { value: 'Holy', label: '神聖' },
  { value: 'Stream', label: '蒸氣' },
  { value: 'Acid', label: '強酸' }
];

const selectedCategory = ref('Krush');
const applyToWound = ref(false); // 新增開關控制是否應用於傷勢紀錄表

const selectedTableData = computed(() => {
  return critTables[selectedCategory.value];
});

const selectedCategoryLabel = computed(() => {
  const category = [...physicalCategories, ...elementalCategories].find(option => option.value === selectedCategory.value);
  return category ? category.label : '';
});

const tableData = computed(() => {
  if (selectedTableData.value) {
    const severityLevels = ['A', 'B', 'C', 'D', 'E'];
    const data = [];

    severityLevels.forEach(severity => {
      selectedTableData.value[severity].forEach(item => {
        const existingItem = data.find(d => d.min === item.min && d.max === item.max);
        if (existingItem) {
          existingItem[severity] = item.description;
        } else {
            const location = Object.keys(hitLocationMapping).find(range => {
            const [min, max] = range.split('-').map(Number);
            return item.min >= min && item.max <= max;
            }) || '未知部位';

            data.push({
            min: item.min,
            max: item.max,
            range: `${item.min}-${item.max}`,
            location: hitLocationMapping[location],
            [severity]: item.description
            });
        }
      });
    });

    return data;
  }
  return [];
});

function addToWound(entry) {
  if (applyToWound.value && playerStore.activePlayerIndex !== null) {
    const activePlayer = playerStore.players[playerStore.activePlayerIndex];
    activePlayer.symbolEntries.push({ text: entry });
    console.log('已新增至傷勢紀錄表:', entry); // 顯示新增訊息
  }
}

// 新增檢查 window 是否定義的工具函數
function isClient() {
  return typeof window !== 'undefined';
}

// 修改 copyToClipboard 函數，避免 SSR 問題
function copyToClipboard(text) {
  if (isClient()) { // 確保只有在客戶端執行
    navigator.clipboard.writeText(text).then(() => {
      console.log('Copied to clipboard:', text);
      alert(`已複製內容: ${text}`); // 顯示複製成功提示
      addToWound(text); // 模擬 addEntry 並寫回 playerStore
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

// 修改 watch 的部分，避免 SSR 問題
watch(
  () => playerStore.players,
  (newPlayers) => {
    if (isClient()) { // 確保只有在客戶端執行
      console.log('玩家狀態已更新:', newPlayers);
    }
  },
  { deep: true }
);
</script>

<template>
  <div class="container">
    <div class="button-container">
      <h3>物理類型</h3>
      <div class="button-group">
        <a-button
          v-for="option in physicalCategories"
          :key="option.value"
          @click="selectedCategory = option.value"
          :type="selectedCategory === option.value ? 'primary' : 'default'"
        >
          {{ option.label }}
        </a-button>
      </div>
      <h3>元素表</h3>
      <div class="button-group">
        <a-button
          v-for="option in elementalCategories"
          :key="option.value"
          @click="selectedCategory = option.value"
          :type="selectedCategory === option.value ? 'primary' : 'default'"
        >
          {{ option.label }}
        </a-button>
      </div>
    </div>
    <a-card class="info-card">
      ✊+X : X 傷害, 🩸X: 流血 X /輪, 💦 (-X): 疲勞減值, 🛠️ (-X): 損壞檢定, -X: 受傷減值, X 💫 [-xx]: 眩暈 X 輪及減值[-xx], 😵: 失衡, 🌊 X’: 擊退, 👎: 擊倒/伏地, 🕸️: 擒拿 X%, ✴️(X): 額外重擊, 💀: 目標瀕死或被擊敗
      <div class="switch-container">
        <a-switch v-model:checked="applyToWound" /> 將重擊應用於傷勢紀錄表
        <div v-if="playerStore.activePlayerIndex !== null">
          <h4>目前啟用的玩家分頁：{{ playerStore.players[playerStore.activePlayerIndex].tabTitle }}</h4>
          <ul>
            <li v-for="(entry, index) in playerStore.players[playerStore.activePlayerIndex].symbolEntries" :key="index">
              {{ entry.text }}
            </li>
          </ul>
        </div>
      </div>
    </a-card>
    <div v-if="selectedTableData" class="table-container">
      <h3>{{ selectedCategoryLabel }}表（嚴重度）</h3>
      <a-table
        :dataSource="tableData"
        :columns="[
          { title: '部位', dataIndex: 'location', key: 'location', width: 100 },
          { title: '範圍', dataIndex: 'range', key: 'range', width: 100 },
          { title: 'A', dataIndex: 'A', key: 'A', customRender: ({ text }) => renderCell(text) },
          { title: 'B', dataIndex: 'B', key: 'B', customRender: ({ text }) => renderCell(text) },
          { title: 'C', dataIndex: 'C', key: 'C', customRender: ({ text }) => renderCell(text) },
          { title: 'D', dataIndex: 'D', key: 'D', customRender: ({ text }) => renderCell(text) },
          { title: 'E', dataIndex: 'E', key: 'E', customRender: ({ text }) => renderCell(text) }
        ]"
        rowKey="range"
        :pagination="false"
        bordered
      />
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

.info-card {
  margin-bottom: 20px;
  text-align: center;
}

.button-container {
  width: 80%;
  margin-bottom: 20px;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.table-container {
  width: 70%;
}

.switch-container {
  margin-top: 10px;
  text-align: center;
}

h3 {
  text-align: center;
}

.ant-table th,
.ant-table td {
  text-align: center;
}
</style>