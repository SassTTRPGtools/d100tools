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
  }),
  actions: {
    loadFromLocalStorage() {
      const savedPlayers = localStorage.getItem('players');
      if (savedPlayers) {
        this.players = JSON.parse(savedPlayers);
      }
    },
    saveToLocalStorage() {
      localStorage.setItem('players', JSON.stringify(this.players));
    },
    clearPlayerData(playerIndex) {
      this.players[playerIndex] = {
        tabTitle: `玩家 ${playerIndex + 1}`,
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
  },
});
