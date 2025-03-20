<script setup>
import { computed, ref } from 'vue';
import { usePlayerStore } from '@/stores/playerStore';
import { calculateTotalReduction } from '@/utils/parser.js';

const props = defineProps({
  applyToWound: Boolean,
  activeTab: Number,
});

const emit = defineEmits(['update:activeTab', 'endCombat', 'endTurn']);

const playerStore = usePlayerStore();

const players = computed(() => playerStore.players);

function setActiveTab(index) {
  playerStore.activePlayerIndex = index; // 儲存到 playerStore
  emit('update:activeTab', index);
}

function editTabTitle(player, index) {
  editingIndex.value = index;
  editedTitle.value = player.tabTitle;
}

function saveTabTitle(player, index) {
  if (editedTitle.value.trim() === '') return; // 禁止空白
  playerStore.players[index].tabTitle = editedTitle.value;
  editingIndex.value = null;
}

function cancelEdit() {
  editingIndex.value = null;
}

const editingIndex = ref(null);
const editedTitle = ref('');
</script>

<template>
  <div
    class="w-64 bg-gray-100 p-5 border-r border-gray-300 transition-opacity"
    :class="{ 'opacity-0 pointer-events-none': !applyToWound }"
  >
    <template v-if="applyToWound">
      <a-button type="primary" danger class="mb-4" @click="$emit('endCombat')">結束戰鬥</a-button>
      <h2 class="text-xl font-bold mb-4">玩家狀態</h2>
      <ul>
        <li
          v-for="(player, index) in players"
          :key="index"
          class="cursor-pointer p-2 border-b border-gray-300 hover:bg-gray-200"
          :class="{ 'bg-blue-200': applyToWound && activeTab === index }"
          @click="setActiveTab(index)"
        >
          <div v-if="editingIndex === index" class="flex items-center">
            <a-input
              v-model:value="editedTitle"
              class="flex-1"
            />
            <SaveOutlined class="icon-spacing" @click="saveTabTitle(player, index)" />
            <CloseSquareOutlined class="icon-spacing" @click="cancelEdit" />
          </div>
          <div v-else>
            {{ player.tabTitle }}
            <EditOutlined  @click="editTabTitle(player, index)"/>
          </div>
          <div>
            總減值：
            {{ calculateTotalReduction(player) }}
            <span v-if="player.dizzyStacks75 || player.dizzyStacks50 || player.dizzyStacks25">💫</span>
          </div>
          <div>流血：{{ player.totalBleeding }}🩸/每輪</div>
        </li>
      </ul>
      <a-button type="primary" class="mt-4" @click="$emit('endTurn')">結束回合</a-button>
    </template>
  </div>
</template>

<style scoped>
/* ...existing styles for the left sidebar... */
.icon-spacing {
  margin-left: 8px; /* 調整圖標與輸入框之間的距離 */
  vertical-align: middle; /* 確保圖標與輸入框在同一行 */
}
.flex {
  display: flex;
}
.items-center {
  align-items: center;
}
.flex-1 {
  flex: 1;
}
</style>
