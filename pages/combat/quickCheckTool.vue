<script setup>
import { ref, computed, h, watch, nextTick, onMounted } from 'vue';
import { message, notification, Modal } from 'ant-design-vue';
import PlayerStatus from '@/components/PlayerStatus.vue'; // 新增導入 PlayerStatus 組件
import { atkTables, atkOptions, atkSizeTables } from '@/rolemaster/utils/attackTables.js';
import { critTables, critSeverityOptions, critKeyMapping, hitLocationMapping } from '@/rolemaster/utils/critTables.js';
import { parseInput, calculatePlayerStats, calculateTotalReduction } from '@/utils/parser.js'; // 引入重複函數
import { usePlayerStore } from '@/stores/playerStore';
import { useCureStore } from '@/stores/cureStore';
import { useFavoritesStore } from '@/stores/favoritesStore'; // 新增導入 favoritesStore

const cureStore = useCureStore();
const playerStore = usePlayerStore();
const favoritesStore = useFavoritesStore(); // 使用 Pinia 的 favoritesStore
const selectedCategory = ref(atkOptions[0].category);
const selectedSubCategory = ref(atkOptions[0].options[0].value);
const selectedAttackerSize = ref('Medium');
const selectedTargetSize = ref('Medium');
const selectedATValue = ref(1);
const attackRoll = ref('');
const critResult = ref('');
const activeTab = ref(playerStore.activePlayerIndex); // 新增：控制目前啟用的分頁
const applyToWound = ref(true); // 新增開關控制是否應用於傷勢紀錄表
const enableAddToWound = ref(false); // 新增開關控制是否啟用 addToWound
const critAdjustment = ref(0); // 新增重擊微調的狀態

const isModalVisible = ref(false); // 控制外跳視窗的顯示
const jsonInput = ref(''); // 儲存用戶輸入的 JSON

function openJsonModal() {
  isModalVisible.value = true;
}

function handleJsonSubmit() {
  loadJSON(jsonInput.value);
  isModalVisible.value = false;
  jsonInput.value = ''; // 清空輸入框
}

onMounted(() => {
  if (typeof window !== 'undefined' && window.localStorage) {
    activeTab.value = playerStore.activePlayerIndex;
  }
  playerStore.players.forEach(player => {
    calculatePlayerStats(player); // 自動計算玩家狀態
  });

  const urlParams = new URLSearchParams(window.location.search);
  const dataParam = urlParams.get('data');
  if (dataParam) {
    const parsedData = JSON.parse(decodeURIComponent(dataParam));
    if (parsedData.players) {
      playerStore.players = parsedData.players;
    }
    if (parsedData.favorites) {
      favoritesStore.favorites = parsedData.favorites;
    }
    message.success('已從連結載入玩家狀態和我的最愛');
  }
});

const tableData = ref([]);

// 計算 selectedAttackerSize 與 selectedTargetSize 之間的差值
const sizeDifference = computed(() => {
  const attackerSizeAdjustment = atkSizeTables[selectedAttackerSize.value].sizeAdjustment;
  const targetSizeAdjustment = atkSizeTables[selectedTargetSize.value].sizeAdjustment;
  return attackerSizeAdjustment - targetSizeAdjustment;
});

// 計算 multiplier
const multiplier = computed(() => {
  const baseSize = 'Medium';
  const baseIndex = Object.keys(atkSizeTables).indexOf(baseSize);
  let newIndex = baseIndex + sizeDifference.value;

  if (newIndex < 0) {
    newIndex = 0;
  } else if (newIndex >= Object.keys(atkSizeTables).length) {
    newIndex = Object.keys(atkSizeTables).length - 1;
  }

  const newSize = Object.keys(atkSizeTables)[newIndex];
  return atkSizeTables[newSize].multiplier;
});

const getAttackOutcome = (attackType, atValue, attackRoll) => {
  const table = atkTables[attackType];
  if (!table) return '無效的攻擊類型';

  const ranges = Object.keys(table[atValue]).map(range => range.split('-').map(Number));
  const minRange = Math.min(...ranges.map(range => range[0]));
  const maxRange = Math.max(...ranges.map(range => range[1]));

  if (attackRoll < minRange) attackRoll = minRange;
  if (attackRoll > maxRange) attackRoll = maxRange;

  const row = Object.entries(table[atValue]).find(([range]) => {
    const [min, max] = range.split('-').map(Number);
    return min <= attackRoll && max >= attackRoll;
  });

  if (!row) return '無結果';

  const severityMap = critSeverityOptions.map(option => option.value);
  const sizeAdjustment = sizeDifference.value;

  let description = row[1];
  let numericValue = parseFloat(description);
  const newValue = Math.ceil(numericValue * multiplier.value);

  description = description.replace(numericValue, newValue);

  let descriptionLetter = description.slice(-2, -1);
  let currentlyIndex = severityMap.indexOf(descriptionLetter);
  let newIndex = severityMap.indexOf(descriptionLetter);

  newIndex += sizeAdjustment + critAdjustment.value; // 加入 critAdjustment 的影響

  if (newIndex < 0) {
    newIndex = 0;
  } else if (newIndex > 10) {
    newIndex = 10;
  }

  return description.replace(severityMap[currentlyIndex], severityMap[newIndex]);
};

const getCritOutcome = (critResult, attackOutcome) => {
  if (!isNaN(attackOutcome)) return '無重擊結果';

  const critType = attackOutcome.slice(-2, -1);
  const critTableKey = attackOutcome.slice(-1);
  const critTable = critKeyMapping[critTableKey];

  if (!critTable) return '無效的重擊表';

  const severityLevels = critSeverityOptions.find(option => option.value === critType).label.split('+');
  const critOutcomes = severityLevels.map(level => {
    (level === 'Z')? level = 'A': level;
    let critData = critTable[level];
    let critRow = critData.find(row => row.min <= critResult && row.max >= critResult);

    // 當 critType 是 Z 時，根據 hitLocationMapping 的結果來取更差的結果
    if (critType === 'Z' && critRow) {
      const location = Object.entries(hitLocationMapping).find(([range]) => {
        const [min, max] = range.split('-').map(Number);
        return min <= critResult && max >= critResult;
      })?.[1];

      if (location) {
        const worseCritResult = Object.keys(hitLocationMapping).reverse().find(key => {
          const [min, max] = key.split('-').map(Number);
          return hitLocationMapping[key] === location && max < critResult;
        });

        if (worseCritResult) {
          const originalCritRow = critRow;
          critRow = critData.find(row => {
            const [min, max] = worseCritResult.split('-').map(Number);
            return row.min <= max && row.max >= min;
          });

          if (critRow) {
            return `${level} (修改為: ${worseCritResult}): ${critRow.description} `;
          }
        }
      }
    }

    return critRow ? `${level}: ${critRow.description}` : `${level}: 無結果`;
  });

  return critOutcomes.join('🔷');
};

const addRow = () => {
  if (!attackRoll.value || !critResult.value) {
    message.warning('攻擊值和重擊值為必填項目');
    return;
  }

  const attackOutcome = getAttackOutcome(selectedSubCategory.value, selectedATValue.value, parseInt(attackRoll.value, 10));
  const critOutcome = getCritOutcome(parseInt(critResult.value, 10), attackOutcome);

  const sizeDifferenceText = sizeDifference.value < 0
    ? `大 ${Math.abs(sizeDifference.value)} 級`
    : `小 ${sizeDifference.value} 級`;

  const newRow = {
    attackType: atkOptions.find(option => option.category === selectedCategory.value)?.options.find(sub => sub.value === selectedSubCategory.value)?.label || selectedSubCategory.value,
    attackerSize: atkSizeTables[selectedAttackerSize.value].label,
    atValue: selectedATValue.value,
    targetSize: atkSizeTables[selectedTargetSize.value].label,
    sizeDifferenceText: sizeDifferenceText,
    attackRoll: attackRoll.value,
    critResult: critResult.value,
    attackOutcome: attackOutcome,
    critOutcome: "✊"+attackOutcome+"🔷"+ critOutcome
  };

  tableData.value.unshift(newRow); // 新增結果在最前面

  // 新增條件：若啟用 enableAddToWound，則自動將結果新增至傷勢紀錄表
  if (enableAddToWound.value) {
    addToWound(newRow.critOutcome);
  }
  copyToClipboard(newRow.critOutcome);
};

const clearData = () => {
  tableData.value = [];
};

function addToWound(entry) {
  if (enableAddToWound.value && playerStore.activePlayerIndex !== null) {
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
  } else {
    console.warn('addToWound 功能未啟用或無效的玩家索引');
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
    });
  }
}

function saveAndCopyJSON() {
  const dataToSave = {
    players: playerStore.players,
    favorites: favoritesStore.favorites,
  };
  const jsonString = JSON.stringify(dataToSave, null, 2); // 格式化 JSON
  copyToClipboard(jsonString);
  notification.success({
    message: 'JSON 已複製',
    description: '玩家狀態和我的最愛已儲存並複製到剪貼簿',
    placement: 'topRight',
  });
}

function loadJSON(jsonString) {
  try {
    const parsedData = JSON.parse(jsonString);
    if (parsedData.players) {
      playerStore.players = parsedData.players;
    }
    if (parsedData.favorites) {
      favoritesStore.favorites = parsedData.favorites;
    }
    message.success('已成功載入 JSON 資料');
  } catch (error) {
    message.error('載入 JSON 失敗，請檢查格式是否正確');
    console.error('JSON 載入錯誤:', error);
  }
}

function renderCritOutcomeCell(text) {
  return h(
    'span',
    {
      style: { cursor: 'pointer' },
      onClick: () => copyToClipboard(text),
    },
    text
  );
}

function endTurn() {
  playerStore.players.forEach(reduceDizzyStack);
}

function reduceDizzyStack(player) {
  const priorities = [
    { regex: /(\d*)💫\[-75\]/, stack: 'dizzyStacks75' },
    { regex: /(\d*)💫\[-50\]/, stack: 'dizzyStacks50' },
    { regex: /(\d*)💫\[-25\]/, stack: 'dizzyStacks25' }
  ];

  for (const { regex } of priorities) {
    const entryIndex = player.symbolEntries.findIndex(entry => regex.test(entry.text));
    if (entryIndex !== -1) {
      updateDizzyStack(player, entryIndex, regex);
      return;
    }
  }
}

function updateDizzyStack(player, entryIndex, regex) {
  const entry = player.symbolEntries[entryIndex];
  const match = entry.text.match(regex);
  const count = match[1] ? parseInt(match[1]) : 1;

  if (count > 1) {
    entry.text = entry.text.replace(/^\d*/, count - 1);
  } else {
    player.symbolEntries.splice(entryIndex, 1);
  }
  calculatePlayerStats(player);
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
}

// 新增我的最愛功能
const addFavorite = (type) => {
  const newFavorite = {
    category: selectedCategory.value,
    subCategory: selectedSubCategory.value,
    attackerSize: selectedAttackerSize.value,
    atValue: selectedATValue.value,
    targetSize: selectedTargetSize.value
  };
  favoritesStore.addFavorite(type, newFavorite); // 使用 Pinia 的方法
  message.success(`${type === 'player' ? '玩家' : 'NPC'} 我的最愛已新增`);
};

const applyFavorite = (favorite) => {
  let found = false;
  for (const category of atkOptions) {
    if (category.category === favorite.category) {
      selectedCategory.value = category.category;
      const subCategory = category.options.find(option => option.value === favorite.subCategory);
      if (subCategory) {
        selectedSubCategory.value = ''; // 先清空以確保 Vue 監測到變更
        nextTick(() => { // 使用 nextTick 確保 DOM 更新後再設置值
          selectedSubCategory.value = subCategory.value;
        });
        selectedAttackerSize.value = favorite.attackerSize;
        selectedATValue.value = favorite.atValue;
        selectedTargetSize.value = favorite.targetSize;
        found = true;
        console.log('已套用我的最愛:', selectedSubCategory.value, selectedAttackerSize.value, selectedATValue.value, selectedTargetSize.value);

        break;
      }
    }
  }
  if (!found) {
    message.error('找不到該我的最愛設定');
  }
};

// 清空我的最愛功能
const clearFavorites = () => {
  favoritesStore.clearFavorites(); // 使用 Pinia 的方法
  message.success('所有我的最愛已清空');
};

// 監聽 selectedCategory 的變化，並自動更新 selectedSubCategory
watch(selectedCategory, (newCategory) => {
  const category = atkOptions.find(option => option.category === newCategory);
  if (category && category.options.length > 0) {
    selectedSubCategory.value = category.options[0].value;
  }
});
</script>

<template>
  <div class="flex flex-row gap-5">
    <!-- 左側區塊 -->
    <template v-if="enableAddToWound">
      <PlayerStatus
        :applyToWound="applyToWound"
        :activeTab="activeTab"
        @update:activeTab="activeTab = $event"
        @endCombat="endCombat"
        @endTurn="endTurn"
      />
    </template>
    <template v-else>
      <div class="w-64 p-5 transition-opacity">
      </div>
    </template>
    <!-- 中間區塊 -->
    <div class="container">
      <!-- 新增開關 -->
      <a-switch
        v-model:checked="enableAddToWound"
        checked-children="啟用傷勢紀錄"
        un-checked-children="停用傷勢紀錄"
        style="margin-bottom: 20px"
      />
      <template v-if="enableAddToWound">
      <div class="button-row">
        <a-button type="default" @click="saveAndCopyJSON">複製 JSON</a-button>
        <div style="width: 20px; display: inline-block;"></div>
        <a-button type="default" @click="openJsonModal">載入 JSON</a-button>
      </div>      
      <a-modal
        v-model:visible="isModalVisible"
        title="載入 JSON"
        @ok="handleJsonSubmit"
        @cancel="() => { isModalVisible = false; jsonInput = ''; }"
      >
        <a-textarea
          v-model:value="jsonInput"
          rows="10"
          placeholder="請輸入 JSON 資料"
        />
      </a-modal>
      </template>
      <div class="controls-container">
        <div class="select-group">
          大分類
          <a-select v-model:value="selectedCategory" style="width: 200px">
            <a-select-option v-for="option in atkOptions" :key="option.category" :value="option.category">
              {{ option.category }}
            </a-select-option>
          </a-select>
          小分類
          <a-select v-model:value="selectedSubCategory" style="width: 400px">
            <a-select-option
              v-for="option in atkOptions.find(option => option.category === selectedCategory)?.options || []"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </a-select-option>
          </a-select>
        </div>
        <div class="select-group">
          攻擊者
          <a-select v-model:value="selectedAttackerSize" style="width: 200px">            
            <a-select-option v-for="(size, key) in atkSizeTables" :key="key" :value="key">
              {{ size.label }}
            </a-select-option>
          </a-select>
          AT
          <a-select v-model:value="selectedATValue" style="width: 200px">
            
            <a-select-option v-for="n in 10" :key="n" :value="n">
              {{ n }}
            </a-select-option>
          </a-select>
          目標
          <a-select v-model:value="selectedTargetSize" style="width: 200px">            
            <a-select-option v-for="(size, key) in atkSizeTables" :key="key" :value="key">
              {{ size.label }}
            </a-select-option>
          </a-select>
          重擊微調
          <a-select v-model:value="critAdjustment" style="width: 200px">
            <a-select-option v-for="n in 11" :key="6 - n" :value="6 - n">
              {{ 6 - n >= 0 ? `+${6 - n}` : 6 - n }}
            </a-select-option>
          </a-select>
        </div>
        <div class="input-group">
          <a-input v-model:value="attackRoll" placeholder="攻擊值" style="width: 200px" required />
          <a-input v-model:value="critResult" placeholder="重擊值" style="width: 200px" required />
          <a-button type="primary" @click="addRow">確定</a-button>
          <a-button type="danger" @click="clearData">清空</a-button>
        </div>
      </div>

      <a-card class="info-card">
        ✊+X : X 傷害, 🩸X: 流血 X /輪, 💦 (-X): 疲勞減值, 🛠️ (-X): 損壞檢定, -X: 受傷減值, X 💫 [-xx]: 眩暈 X 輪及減值[-xx], 😵: 失衡, 🌊 X’: 擊退, 👎: 擊倒/伏地, 🕸️: 擒拿 X%, ✴️(X): 額外重擊, 💀: 目標瀕死或被擊敗
      </a-card>
      <div class="table-container">
        <a-table
          :dataSource="tableData"
          :columns="[
            { title: '攻擊', dataIndex: 'attackType', key: 'attackType', width: 120 },
            { title: '攻擊者', dataIndex: 'attackerSize', key: 'attackerSize', width: 80  },
            { title: 'AT', dataIndex: 'atValue', key: 'atValue' , width: 80 },
            { title: '目標', dataIndex: 'targetSize', key: 'targetSize' , width: 80 },
            { title: '兩者差距', dataIndex: 'sizeDifferenceText', key: 'sizeDifferenceText' , width: 120 },
            { title: '攻擊值', dataIndex: 'attackRoll', key: 'attackRoll', width: 80  },
            { title: '重擊值', dataIndex: 'critResult', key: 'critResult', width: 80  },
            { title: '傷害結果', dataIndex: 'critOutcome', key: 'critOutcome', customRender: ({ text }) => renderCritOutcomeCell(text) }
          ]"
          rowKey="attackType"
          :pagination="false"
          bordered
        />
      </div>
    </div>
    <!-- 右側區塊 -->
    <template v-if="enableAddToWound">
      <div class="favorites-container">
        <div class="favorites-header">
          <h3>新增我的最愛</h3>
          <div class="button-row">          
            <a-button type="primary" @click="addFavorite('player')">玩家</a-button>
            <a-button type="primary" @click="addFavorite('npc')">NPC</a-button>
            <a-button type="primary" danger @click="clearFavorites">清空最愛</a-button>          
          </div>
        </div>
        <a-collapse>
          <a-collapse-panel key="player" header="玩家我的最愛">
            <ul>
              <li v-for="(favorite, index) in favoritesStore.favorites.player" :key="'player-' + index">
                <a @click="applyFavorite(favorite)">
                  {{ atkOptions.find(option => option.category === favorite.category)?.options.find(sub => sub.value === favorite.subCategory)?.label || favorite.subCategory }}
                  ({{ atkSizeTables[favorite.attackerSize]?.label || favorite.attackerSize }})
                </a>
              </li>
            </ul>
          </a-collapse-panel>
          <a-collapse-panel key="npc" header="NPC 我的最愛">
            <ul>
              <li v-for="(favorite, index) in favoritesStore.favorites.npc" :key="'npc-' + index">
                <a @click="applyFavorite(favorite)">
                  {{ atkOptions.find(option => option.category === favorite.category)?.options.find(sub => sub.value === favorite.subCategory)?.label || favorite.subCategory }}
                  ({{ atkSizeTables[favorite.attackerSize]?.label || favorite.attackerSize }})
                </a>
              </li>
            </ul>
          </a-collapse-panel>
        </a-collapse>
      </div>
    </template>
    <template v-else>
      <div class="w-96 p-5 transition-opacity">
      </div>
    </template>
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

.select-group, .input-group {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.table-container {
  width: 100%;
}

.ant-table th,
.ant-table td {
  text-align: center;
}

.info-card {
  margin-bottom: 20px;
  text-align: center;
}

.favorites-container {
  display: flex;
  flex-direction: column;
  align-items: center; /* 置中 */
  width: 20%;
  padding: 20px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.favorites-header {
  text-align: center;
  margin-bottom: 10px;
}

.button-row {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.favorites-list ul {
  list-style: none;
  padding: 0;
}

.favorites-list li {
  margin-bottom: 5px;
}

.favorites-list a {
  color: #1890ff;
  cursor: pointer;
  text-decoration: underline;
}

.ant-collapse {
  width: 100%;
}
</style>