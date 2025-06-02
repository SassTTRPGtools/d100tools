<script setup>
import { ref, computed, h, watch, onMounted } from 'vue';
import { critTables, critOptions, hitLocationMapping } from '@/rolemaster/utils/critTables.js';
import { usePlayerStore } from '@/stores/playerStore';
import { useCureStore } from '@/stores/cureStore';
import { notification } from 'ant-design-vue';
import { parseInput, calculatePlayerStats, calculateTotalReduction } from '@/utils/parser.js'; // 引入重複函數
import { useRouter } from 'vue-router';
import PlayerStatus from '@/components/PlayerStatus.vue'; // 引入新的組件

const runtimeConfig = useRuntimeConfig();
const cureStore = useCureStore();
const playerStore = usePlayerStore();
const router = useRouter();

const activeTab = ref(0); // 新增：控制目前啟用的分頁

onMounted(() => {
  if (typeof window !== 'undefined' && window.localStorage) {
    activeTab.value = playerStore.activePlayerIndex;
  }
  playerStore.players.forEach(player => {
    calculatePlayerStats(player); // 自動計算玩家狀態
  });
});

watch(
  () => activeTab.value,
  (newIndex) => {
    playerStore.setActivePlayerIndex(newIndex);
    console.log('目前啟用的玩家分頁索引已更新:', newIndex);
  }
);

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
  if (playerStore.activePlayerIndex !== null) {
    const activePlayer = playerStore.players[playerStore.activePlayerIndex];
    const parsedResults = parseInput(entry);
    if (parsedResults.symbols.length === 0) {
      console.warn('無有效的傷勢描述');
      return;
    }
    parsedResults.symbols.forEach(result => {
      activePlayer.symbolEntries.push({ text: result });
    });
    calculatePlayerStats(activePlayer); // 更新玩家狀態
    console.log('已新增至傷勢紀錄表:', parsedResults.symbols);
  }
}

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
      addToWound(text);
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

function endTurn() {
  playerStore.players.forEach(player => {
    reduceDizzyStack(player);
  });
  
}

function reduceDizzyStack(player) {
  const priorities = [
    { regex: /(\d*)💫\[-75\]/, stack: 'dizzyStacks75' },
    { regex: /(\d*)💫\[-50\]/, stack: 'dizzyStacks50' },
    { regex: /(\d*)💫\[-25\]/, stack: 'dizzyStacks25' }
  ];

  for (const priority of priorities) {
    for (let i = 0; i < player.symbolEntries.length; i++) {
      const match = player.symbolEntries[i].text.match(priority.regex);
      if (match) {
        let count = match[1] ? parseInt(match[1]) : 1;
        if (count > 1) {
          player.symbolEntries[i].text = player.symbolEntries[i].text.replace(/^\d*/, count - 1);
        } else {
          player.symbolEntries.splice(i, 1);
        }
        calculatePlayerStats(player);
        return;
      }
    }
  }
}

function endCombat() {
  if (typeof window !== 'undefined' && window.localStorage) {
    cureStore.players = JSON.parse(JSON.stringify(playerStore.players)); // 深拷貝資料
    cureStore.players.forEach((player, index) => {
      const excessFatigueReduction = Math.max(0, -player.excessFatigue); // 計算超出的疲勞減值
      player.specialInjuryReduction = excessFatigueReduction; // 儲存到 specialInjuryReduction
    });
    cureStore.saveToLocalStorage();
  }
  playerStore.players.forEach((_, index) => playerStore.clearPlayerData(index)); // 清空 playerStore
  router.push('/combat/cure'); // 跳轉到 /combat/cure 頁面
}
</script>

<template>
  <div class="flex flex-row gap-5">
    <!-- 左側區塊 -->
    <PlayerStatus
      :applyToWound="applyToWound"
      :activeTab="activeTab"
      @update:activeTab="activeTab = $event"
      @endCombat="endCombat"
      @endTurn="endTurn"
    />
    <!-- 中間區塊 -->
    <div class="flex-1 p-5">
      <div class="flex flex-col items-center justify-center w-full p-5">
        <div class="w-full flex flex-col items-center">
          <div class="w-full max-w-2xl mb-6">
            <h3 class="text-lg font-bold text-center mb-2">物理類型</h3>
            <div class="flex flex-wrap justify-center gap-2 mb-4">
              <a-button
                v-for="option in physicalCategories"
                :key="option.value"
                @click="selectedCategory = option.value"
                :type="selectedCategory === option.value ? 'primary' : 'default'"
              >
                {{ option.label }}
              </a-button>
            </div>
            <h3 class="text-lg font-bold text-center mb-2">元素表</h3>
            <div class="flex flex-wrap justify-center gap-2 mb-4">
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
          <a-card class="w-full max-w-2xl mb-6 text-sm text-gray-700 bg-white shadow rounded-lg p-4 text-center">
            ✊+X : X 傷害, 🩸X: 流血 X /輪, 💦 (-X): 疲勞減值, 🛠️ (-X): 損壞檢定, -X: 受傷減值, X 💫 [-xx]: 眩暈 X 輪及減值[-xx], 😵: 失衡, 🌊 X’: 擊退, 👎: 擊倒/伏地, 🕸️: 擒拿 X%, ✴️(X): 額外重擊, 💀: 目標瀕死或被擊敗
            <div class="flex items-center justify-center mt-2">
              <a-switch v-model:checked="applyToWound" class="mr-2" />
              <span class="text-xs text-gray-500">將重擊應用於傷勢紀錄表</span>
            </div>
          </a-card>
          <div v-if="selectedTableData" class="w-full max-w-5xl bg-white rounded-lg shadow-md p-4">
            <h3 class="text-lg font-bold text-center mb-4">{{ selectedCategoryLabel }}表（嚴重度）</h3>
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
              class="critical-table"
            />
            <div class="text-xs text-gray-400 mt-2 text-right">* 點擊說明可複製內容</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.critical-table :deep(.ant-table) {
  width: 100%;
}
.critical-table :deep(.ant-table th),
.critical-table :deep(.ant-table td) {
  text-align: center;
  vertical-align: middle;
}
</style>