import { defineStore } from 'pinia';

export const usePlayerStore = defineStore('playerStore', {
  state: () => ({
    players: Array.from({ length: 5 }, (_, index) => ({
      tabTitle: `玩家 ${index + 1}`,
      inputText: '',
      symbolEntries: [],
      dizzyStacks75: 0,
      dizzyStacks50: 0,
      dizzyStacks25: 0,
      totalFatigue: 0,
      excessFatigue: 0,
      totalInjury: 0,
      totalBleeding: 0,
    })),
    activePlayerIndex: 0, // 新增 activePlayerIndex
  }),
  actions: {
    clearPlayerData(playerIndex) {
      const tabTitle = this.players[playerIndex].tabTitle; // 保留 tabTitle
      this.players[playerIndex] = {
        tabTitle, // 使用保留的 tabTitle
        inputText: '',
        symbolEntries: [],
        dizzyStacks75: 0,
        dizzyStacks50: 0,
        dizzyStacks25: 0,
        totalFatigue: 0,
        excessFatigue: 0,
        totalInjury: 0,
        totalBleeding: 0,
      };
    },
    updateInjuryCategory(playerIndex, entryIndex, category) {
      this.players[playerIndex].symbolEntries[entryIndex].category = category;
    },
    setActivePlayerIndex(index) {
      this.activePlayerIndex = index;
    },
    getActivePlayerIndex() {
      return this.activePlayerIndex;
    },
    getActivePlayer() {
      return this.players[this.activePlayerIndex]; // 新增方法，取得當前活躍玩家
    },
  },
  persist: true, // 啟用持久化
});
