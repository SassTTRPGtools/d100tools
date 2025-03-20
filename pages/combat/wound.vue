<script setup>
import { ref, watch, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { usePlayerStore } from '@/stores/playerStore';
import { useCureStore } from '@/stores/cureStore';

const activeTab = ref(0);
const playerStore = usePlayerStore();
const cureStore = useCureStore();

// 在組件掛載時加載數據並設置第一個分頁為默認顯示
onMounted(() => {
  if (typeof window !== 'undefined' && window.localStorage) {
    activeTab.value = playerStore.activePlayerIndex; // 設置第一個分頁為默認顯示
  }
});

watch(
  () => activeTab.value,
  (newIndex) => {
    playerStore.setActivePlayerIndex(newIndex); // 更新目前啟用的玩家分頁索引
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

function parseInput(input) {
  const regex = /([^\s,]+(?:\[\-?\d+\])?)/g;
  const matches = input.match(regex);
  const ignoreEmojis = ['✊', '🛠️', '😵', '🌊', '👎', '🕸️', '✴️', '💀'];
  const symbols = matches ? matches.filter(match => !ignoreEmojis.some(emoji => match.includes(emoji))) : [];
  return { symbols: symbols.map(symbol => symbol.replace(/,$/, '')) };
}

function removeSymbolEntry(playerIndex, entryIndex) {
  const player = playerStore.players[playerIndex];
  player.symbolEntries.splice(entryIndex, 1);
  calculatePlayerStats(player);
}

function calculatePlayerStats(player) {
  calculateDizzyStacks(player);
  calculateFatigue(player);
  calculateInjury(player);
  calculateBleeding(player);
}

function calculateDizzyStacks(player) {
  player.dizzyStacks75 = 0;
  player.dizzyStacks50 = 0;
  player.dizzyStacks25 = 0;
  player.symbolEntries.forEach(entry => {
    const match75 = entry.text.match(/(\d*)💫\[-75\]/);
    const match50 = entry.text.match(/(\d*)💫\[-50\]/);
    const match25 = entry.text.match(/(\d*)💫\[-25\]/);
    if (match75) {
      player.dizzyStacks75 += match75[1] ? parseInt(match75[1]) : 1;
    }
    if (match50) {
      player.dizzyStacks50 += match50[1] ? parseInt(match50[1]) : 1;
    }
    if (match25) {
      player.dizzyStacks25 += match25[1] ? parseInt(match25[1]) : 1;
    }
  });
}

function calculateFatigue(player) {
  let currentTotalFatigue = 0;
  let currentExcessFatigue = 0;
  player.symbolEntries.forEach(entry => {
    const match = entry.text.match(/💦\((\-?\d+)\)/);
    if (match) {
      const value = parseInt(match[1]);
      if (currentTotalFatigue + value >= -50) {
        currentTotalFatigue += value;
      } else {
        const remainingValue = -50 - currentTotalFatigue;
        currentTotalFatigue = -50;
        currentExcessFatigue += Math.abs(value - remainingValue);
      }
    }
  });
  player.totalFatigue = currentTotalFatigue;
  player.excessFatigue = currentExcessFatigue;
}

function calculateInjury(player) {
  let currentTotalInjury = 0;
  player.symbolEntries.forEach(entry => {
    if (!entry.text.includes('💦') && !entry.text.includes('💫')) {
      const match = entry.text.match(/-\d+/);
      if (match) {
        currentTotalInjury += parseInt(match[0]);
      }
    }
  });
  player.totalInjury = currentTotalInjury;
}

function calculateBleeding(player) {
  let currentTotalBleeding = 0;
  player.symbolEntries.forEach(entry => {
    const match = entry.text.match(/🩸(\d+)/);
    if (match) {
      currentTotalBleeding += parseInt(match[1]);
    }
  });
  player.totalBleeding = currentTotalBleeding;
}

function calculateTotalReduction(player) {
  let dizzyReduction = 0;
  if (player.dizzyStacks75 > 0) {
    dizzyReduction = -75;
  } else if (player.dizzyStacks50 > 0) {
    dizzyReduction = -50;
  } else if (player.dizzyStacks25 > 0) {
    dizzyReduction = -25;
  }
  return player.totalFatigue + player.totalInjury + -(player.excessFatigue) + dizzyReduction;
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

function clearAll(playerIndex) {
  playerStore.clearPlayerData(playerIndex);
}

function updateTabTitle(playerIndex, newTitle) {
  playerStore.players[playerIndex].tabTitle = newTitle;
}

function endCombat() {
  if (typeof window !== 'undefined' && window.localStorage) {
    cureStore.players = JSON.parse(JSON.stringify(playerStore.players)); // 深拷貝資料
    cureStore.saveToLocalStorage();
  }
  playerStore.players.forEach((_, index) => playerStore.clearPlayerData(index)); // 清空 playerStore
}
</script>

<template>
  <div class="layout">
    {{playerStore.activePlayerIndex}}
    <!-- 左側區塊 -->
    <div class="sidebar">
      <h2 class="text-xl font-bold mb-4">玩家狀態</h2>
      <ul>
        <li
          v-for="(player, index) in playerStore.players"
          :key="index"
          class="player-summary"
          @click="activeTab = index"
        >
          <div>{{ player.tabTitle }}</div>
          <div>總減值：{{ calculateTotalReduction(player) }}</div>
          <div>流血：{{ player.totalBleeding }}🩸/每輪</div>
        </li>
      </ul>
    </div>

    <!-- 中間區塊 -->
    <div class="main-content">
      <div class="flex flex-row">
<div><a-button type="primary" class="mb-4 mt-4" @click="endTurn">結束回合</a-button></div>
<div class="pl-4"><a-button type="primary" danger class="mb-4 mt-4" @click="endCombat">結束戰鬥</a-button></div>
      </div>
      
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
                @change="updateTabTitle(index, player.tabTitle)"
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
