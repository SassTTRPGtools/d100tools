<script setup>
import { ref, onMounted, watch } from 'vue';
import { useCureStore } from '@/stores/cureStore';
import { usePlayerStore } from '@/stores/playerStore'; // 新增引入 usePlayerStore
import { message } from 'ant-design-vue'; // 引入 Ant Design 的訊息提示

const activeTab = ref(0);
const cureStore = useCureStore();
const playerStore = usePlayerStore(); // 使用玩家狀態管理
const injuryCategories = [
  { value: 'bone', label: '骨骼' },
  { value: 'cut_burn', label: '割傷和燒傷' },
  { value: 'muscle_tendon', label: '肌肉/肌腱' },
  { value: 'organ', label: '器官' },
  { value: 'poison_disease', label: '毒物/疾病' },
  { value: 'skin_tissue', label: '皮膚/組織' },
];

const injuryTable = [
  { range: '< 0', bone: 10, cut_burn: 12, muscle_tendon: 15, organ: 20, poison_disease: 25, skin_tissue: 5 },
  { range: '1-50', bone: 8, cut_burn: 10, muscle_tendon: 12, organ: 16, poison_disease: 20, skin_tissue: 4 },
  { range: '51-75', bone: 6, cut_burn: 8, muscle_tendon: 9, organ: 12, poison_disease: 15, skin_tissue: 3 },
  { range: '76-100', bone: 4, cut_burn: 6, muscle_tendon: 7, organ: 8, poison_disease: 10, skin_tissue: 2 },
  { range: '101-125', bone: 3, cut_burn: 4, muscle_tendon: 5, organ: 6, poison_disease: 8, skin_tissue: 2 },
  { range: '126-175', bone: 2, cut_burn: 2, muscle_tendon: 3, organ: 4, poison_disease: 5, skin_tissue: 1 },
  { range: '176+', bone: 1, cut_burn: 1, muscle_tendon: 1, organ: 2, poison_disease: 3, skin_tissue: 1 },
];

// 在組件掛載時加載數據並設置第一個分頁為默認顯示
onMounted(() => {
  if (typeof window !== 'undefined' && window.localStorage) {
    cureStore.loadFromLocalStorage(); // 確保 localStorage 僅在瀏覽器環境中使用
  }
  activeTab.value = 0; // 設置第一個分頁為默認顯示
  initializeEntries();

  // 確保在頁面初始化時設置監聽器
  const currentEntries = cureStore.players[activeTab.value]?.symbolEntries || [];
  setupEntryWatchers(currentEntries);
});

function initializeEntries() {
  cureStore.players.forEach(player => {
    player.symbolEntries.forEach(entry => {
      if (entry.isHeadInjury === undefined) {
        entry.isHeadInjury = false; // 初始化 isHeadInjury 屬性
      }
    });

    // 初始化時計算 totalInjury
console.log(player.symbolEntries);

    player.totalInjury = player.symbolEntries.reduce((sum, entry) => {
      const match = ((entry.text.match(/-\d+/) && !entry.text.includes('💦') && !entry.text.includes('💫') && !entry.text.includes('🩸')))?entry.text.match(/-?\d+/):0;
      return sum + (match ? parseInt(match[0], 10) : 0);
    }, 0);
  });
}

function getSeverity(entryText) {
  
  const injuryMatch = entryText.match(/-?\d+/);
  if (injuryMatch) {
    const injuryValue = parseInt(injuryMatch[0]);
    if (injuryValue <= -1 && injuryValue >= -20) {
      return '輕度';
    } else if (injuryValue <= -21 && injuryValue >= -40) {
      return '中度';
    } else if (injuryValue < -40) {
      return '重度';
    }
  }

  return '無';
}

function filterRelevantEntries(entries) {
  return entries.filter(entry =>     
    (entry.text.match(/-\d+/) && !entry.text.includes('💦') && !entry.text.includes('💫') && !entry.text.includes('🩸'))
  );
}

function calculateRecovery(value, category, isHeadInjury, severity, entryText) {

  const injuryMatch = entryText.match(/-?\d+/);
  const injuryValue = injuryMatch ? Math.abs(parseInt(injuryMatch[0])) : 0;

  const range = injuryTable.find(row => {
    if (row.range === '< 0') {
      return value < 0;
    }
    const [min, max] = row.range.includes('+') ? [176, Infinity] : row.range.split('-').map(Number);
    return value >= min && value <= max;
  });

  if (!range || !category) return { recoveryDays: 0, dailyRecovery: 0 };

  const baseValue = range[category];
  let recoveryDays = baseValue;
  if (isHeadInjury) recoveryDays *= 2;
  if (severity === '中度') recoveryDays *= 5;
  if (severity === '重度') recoveryDays *= 10;


  let dailyRecovery = Math.ceil(injuryValue / recoveryDays);

  // 如果每日恢復減值為 1，且恢復天數大於受傷減值，將恢復天數設為受傷減值
  if (dailyRecovery === 1 && recoveryDays > injuryValue) {
    recoveryDays = injuryValue;
  }

  // 如果恢復天數乘以每日恢復減值超過受傷減值，調整恢復天數
  if (recoveryDays * dailyRecovery > injuryValue) {
    recoveryDays = Math.ceil(injuryValue / dailyRecovery);
  }

  return { recoveryDays, dailyRecovery };
}


function updateIsHeadInjury(playerIndex, entryIndex, isHeadInjury) {
  const player = cureStore.players[playerIndex];
  if (player && player.symbolEntries[entryIndex]) {
    player.symbolEntries[entryIndex].isHeadInjury = isHeadInjury; // 更新數據
    cureStore.saveToLocalStorage(); // 儲存更新的數據
  }
}

function resetCureStore() {
  if (typeof window !== 'undefined' && window.localStorage) {
    cureStore.$state = { ...playerStore.$state }; // 重設為 playerStore 的狀態
    activeTab.value = playerStore.getActivePlayerIndex(); // 使用 getActivePlayerIndex 設定當前分頁
    cureStore.saveToLocalStorage();
  }
}

function addSpecialInjury(playerIndex, injuryText) {
  const player = cureStore.players[playerIndex];
  const injuryValue = parseInt(injuryText, 10);

  if (!injuryText || isNaN(injuryValue)) {
    message.error('請輸入有效的數值！');
    return;
  }

  if (injuryValue > player.excessFatigue) {
    message.error('輸入的數值超過了特殊受傷減值的上限！');
    return;
  }

  player.symbolEntries.push({
    text: `-${injuryValue}`, // 將數值轉為負數並新增到 entry.text
    value: "",
    category: null,
    isHeadInjury: false,
    recovery: { recoveryDays: 0, dailyRecovery: 0 },
  });

  player.excessFatigue -= injuryValue; // 扣減特殊受傷減值

  // 重新計算 totalInjury
  player.totalInjury = player.symbolEntries.reduce((sum, entry) => {
    const match = entry.text.match(/-?\d+/);
    return sum + (match ? parseInt(match[0], 10) : 0);
  }, 0);

  cureStore.saveToLocalStorage(); // 儲存更新的 cureStore 狀態
  newInjuryText.value = ''; // 清空輸入框
  message.success('特殊受傷減值已成功新增！');
}

function addManualInjury(playerIndex, injuryText, category) {
  const player = cureStore.players[playerIndex];
  const injuryValue = parseInt(injuryText, 10);

  if (!injuryText || isNaN(injuryValue) || !category) {
    message.error('請輸入有效的數值和選擇分類！');
    return;
  }

  player.symbolEntries.push({
    text: `-${injuryValue}`, // 將數值轉為負數並新增到 entry.text
    value: injuryValue,
    category: category,
    isHeadInjury: false,
    recovery: { recoveryDays: 0, dailyRecovery: 0 },
  });

  // 重新計算 totalInjury
  player.totalInjury = player.symbolEntries.reduce((sum, entry) => {
    const match = entry.text.match(/-?\d+/);
    return sum + (match ? parseInt(match[0], 10) : 0);
  }, 0);

  cureStore.saveToLocalStorage(); // 儲存更新的 cureStore 狀態
  manualInjuryText.value = ''; // 清空輸入框
  manualInjuryCategory.value = null; // 清空分類選擇
  message.success('手動新增傷勢分類成功！');
}

const newInjuryText = ref('');
const manualInjuryText = ref('');
const manualInjuryCategory = ref(null);

// 監聽每個 entry 的 category、isHeadInjury、entry.text 和 entry.value，並重新計算恢復數據
function setupEntryWatchers(entries) {
  entries.forEach(entry => {
    watch(
      [() => entry.category, () => entry.isHeadInjury, () => entry.text, () => entry.value],
      () => {
        const severity = getSeverity(entry.text);
        entry.recovery = calculateRecovery(entry.value, entry.category, entry.isHeadInjury, severity, entry.text);
      },
      { immediate: true }
    );
  });
}

// 當 activeTab 改變時，重新設置監聽器
watch(
  () => activeTab.value,
  () => {
    const currentEntries = cureStore.players[activeTab.value]?.symbolEntries || [];
    setupEntryWatchers(currentEntries); // 當 activeTab 改變時重新設置監聽器
  },
  { immediate: true } // 確保在頁面初始化時立即執行
);
</script>

<template>
  <div class="layout">
    <!-- 左側區塊 -->
    <div class="sidebar">
      <button @click="resetCureStore" class="reset-button">重新設定</button> <!-- 新增按鈕 -->
      <h2 class="text-xl font-bold mb-4">玩家狀態</h2>
      <ul>
        <li
          v-for="(player, index) in cureStore.players"
          :key="index"
          class="player-summary"
          @click="activeTab = index"
        >
          <div>{{ player.tabTitle }}</div>
          <div>受傷減值：{{ player.totalInjury }}</div>
        </li>
      </ul>
    </div>

    <!-- 中間區塊 -->
    <div class="main-content">
      <div v-if="cureStore.players[activeTab]" class="injury-details">
        <h2 class="text-xl font-bold mb-4">傷勢分類</h2>
        <div class="special-injury-section" v-if="cureStore.players[activeTab].excessFatigue">
          <div class="flex items-center gap-4 mb-4">
            <span>特殊受傷減值：{{ cureStore.players[activeTab].excessFatigue || 0 }}</span>
            <a-input
              v-model:value="newInjuryText"
              placeholder="輸入拆分的受傷減值"
              class="injury-input"
            />
            <button
              @click="addSpecialInjury(activeTab, newInjuryText)"
              class="add-injury-button"
            >
              新增
            </button>
          </div>
        </div>
        <div class="manual-injury-section">
          <h3 class="text-lg font-bold mb-2">手動新增傷勢分類</h3>
          <div class="flex items-center gap-4 mb-4">
            <a-input
              v-model:value="manualInjuryText"
              placeholder="輸入傷勢數值"
              class="injury-input"
            />
            <a-select
              v-model:value="manualInjuryCategory"
              :options="injuryCategories"
              placeholder="選擇分類"
              class="injury-category-select"
            />
            <button
              @click="addManualInjury(activeTab, manualInjuryText, manualInjuryCategory)"
              class="add-injury-button"
            >
              新增
            </button>
          </div>
        </div>
        <ul>
          <li
            v-for="(entry, index) in filterRelevantEntries(cureStore.players[activeTab].symbolEntries)"
            :key="cureStore.players[activeTab].symbolEntries.indexOf(entry)"
            class="injury-entry"
          >
            <div class="flex items-center gap-4">
              <span>{{ entry.text }}</span>
              <a-select
                v-model:value="entry.category"
                :options="injuryCategories"
                placeholder="選擇類型"
                class="injury-category-select"
              />
              <span>{{ getSeverity(entry.text) }}</span>
              <a-switch
                :checked="entry.isHeadInjury"
                @change="updateIsHeadInjury(activeTab, cureStore.players[activeTab].symbolEntries.indexOf(entry), $event)"
              >
              </a-switch>
              <span>頭部受傷</span>
              <a-input-number
                v-model:value="entry.value"
                placeholder="輸入數值"
              />
              <span>恢復天數：{{ entry.recovery?.recoveryDays || 0 }}</span>
              <span v-if="!entry.text.includes('🩸')">每日恢復減值：{{ entry.recovery?.dailyRecovery || 0 }}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: row;
  gap: 20px;
}

.sidebar {
  width: 250px;
  background-color: #f9f9f9;
  padding: 20px;
  border-right: 1px solid #ddd;
}

.sidebar h2 {
  margin-bottom: 10px;
}

.player-summary {
  cursor: pointer;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  transition: background-color 0.3s;
  line-height: 1.5;
}

.player-summary:hover {
  background-color: #f0f0f0;
}

.main-content {
  flex: 1;
  padding: 20px;
}

.injury-details {
  background-color: #fff;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.injury-entry {
  margin-bottom: 10px;
}

.injury-category-select {
  width: 200px;
}

.reset-button {
  display: block;
  margin-bottom: 10px;
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
}

.reset-button:hover {
  background-color: #0056b3;
}

.special-injury-section {
  margin-bottom: 20px;
}

.manual-injury-section {
  margin-bottom: 20px;
}

.injury-input {
  width: 300px;
}

.add-injury-button {
  padding: 5px 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-injury-button:hover {
  background-color: #218838;
}

.summary {
  margin-top: 20px;
}
</style>
