<script setup>
import { ref, watch, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { usePlayerStore } from '@/stores/playerStore';
import { useCureStore } from '@/stores/cureStore';
import { parseInput, calculatePlayerStats } from '@/utils/parser.js'; // 引入缺少的函數
import PlayerStatus from '@/components/PlayerStatus.vue'; // 新增：導入 PlayerStatus 組件

const activeTab = ref(0);
const playerStore = usePlayerStore();
const cureStore = useCureStore();

onMounted(() => {
  if (typeof window !== 'undefined' && window.localStorage) {
    activeTab.value = playerStore.activePlayerIndex;
  }
  playerStore.players.forEach(player => {
    calculatePlayerStats(player);
  });
});

watch(
  () => activeTab.value,
  (newIndex) => {
    playerStore.setActivePlayerIndex(newIndex);
    console.log('目前啟用的玩家分頁索引已更新:', newIndex);
  }
);

function addEntry() {
  const player = playerStore.players[playerStore.activePlayerIndex];
  const parsedResults = parseInput(player.inputText);
  if (parsedResults.symbols.length === 0) {
    message.warning('請輸入有效的傷勢描述');
    return;
  }
  parsedResults.symbols.forEach(result => {
    player.symbolEntries.push({ text: result });
  });
  calculatePlayerStats(player);
  player.inputText = '';
}

function removeSymbolEntry(playerIndex, entryIndex) {
  const player = playerStore.players[playerIndex];
  player.symbolEntries.splice(entryIndex, 1);
  calculatePlayerStats(player);
}

function clearAll(playerIndex) {
  playerStore.clearPlayerData(playerIndex);
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

const applyToWound = ref(true);
</script>

<template>
  <div class="layout">
    <!-- 左側區塊 -->
    <PlayerStatus
      :applyToWound="applyToWound"
      :activeTab="activeTab"
      @update:activeTab="activeTab = $event"
      @endCombat="endCombat"
      @endTurn="endTurn"
    />

    <!-- 中間區塊 -->
    <div class="main-content">
      <a-tabs v-model:activeKey="activeTab" type="card" class="player-tabs">
        <a-tab-pane
          v-for="(player, index) in playerStore.players"
          :key="index"
          :tab="player.tabTitle"
        >
          <a-card class="p-4">
            <div class="mb-4">
              <a-input
                v-model:value="player.tabTitle"
                placeholder="修改分頁標題"
                @change="playerStore.updateTabTitle(index, player.tabTitle)"
                class="mb-4"
              />
            </div>
            <div class="mb-4">
              <h2 class="text-xl font-bold mb-2">眩暈狀態：{{ player.dizzyStacks75 }}💫[-75]、{{ player.dizzyStacks50 }}💫[-50]、{{ player.dizzyStacks25 }}💫[-25]</h2>
            </div>
            <div class="mb-4">
              <h2 class="text-xl font-bold mb-2">累計疲勞減值：{{ player.totalFatigue }}</h2>
            </div>
            <div class="mb-4">
              <h2 class="text-xl font-bold mb-2">累計受傷減值：{{ player.totalInjury + -(player.excessFatigue) }}（超出的疲勞減值 {{ -(player.excessFatigue) }}）</h2>
              <p v-if="player.totalInjury + -(player.excessFatigue) <= -50 && player.totalInjury + -(player.excessFatigue) > -100">角色有麻煩，且應進行相應的扮演。</p>
              <p v-if="player.totalInjury + -(player.excessFatigue) <= -100 && player.totalInjury + -(player.excessFatigue) > -200">角色陷入嚴重困境。任何行動（移動、攻擊、施法或任何體力活）都會導致該輪需進行耐力檢定。直到總減值降低到低於 -100。你需要好好坐下來休息，任何行動都會讓事情變得更糟。</p>
              <p v-if="player.totalInjury + -(player.excessFatigue) <= -200 && player.totalInjury + -(player.excessFatigue) > -300">角色因累積的傷害而瀕死，就算靜止不動也必須每輪進行耐力檢定。直到總減值降低 -200 以下。</p>
              <p v-if="player.totalInjury + -(player.excessFatigue) <= -300">角色將因系統性休克而在下個結算階段死亡。</p>
            </div>
            <div class="mb-4">
              <h2 class="text-xl font-bold mb-2">累計流血：{{ player.totalBleeding }}🩸/每輪流血</h2>
            </div>
            <div class="mb-4 buttons">
              <a-button type="primary" danger class="ml-2" @click="clearAll(index)">全部清空</a-button>
            </div>
            <h1 class="text-2xl font-bold mb-4">傷勢狀態記錄</h1>
            <a-input
              v-model:value="player.inputText"
              @pressEnter="addEntry()"
              placeholder="輸入傷勢描述..."
              class="mb-4"
            />
            <div class="flex flex-col gap-2">
              <div v-for="(item, idx) in player.symbolEntries" :key="idx" class="flex justify-between items-center bg-gray-100 p-2 rounded shadow">
                <span class="text-gray-800">{{ item.text }}</span>
                <button
                  class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  @click="removeSymbolEntry(index, idx)"
                >
                  刪除
                </button>
              </div>
            </div>
          </a-card>
        </a-tab-pane>
      </a-tabs>
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

.player-tabs {
  width: 100%;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}
</style>
