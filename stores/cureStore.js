import { defineStore } from 'pinia';

export const useCureStore = defineStore('cureStore', {
  state: () => ({
    players: [] // 每個玩家的數據中包含 specialInjuryReduction
  }),
  actions: {
    loadFromLocalStorage() {
      const savedPlayers = localStorage.getItem('curePlayers');
      if (savedPlayers) {
        this.players = JSON.parse(savedPlayers);
      }
    },
    saveToLocalStorage() {
      localStorage.setItem('curePlayers', JSON.stringify(this.players));
    },
    clearData() {
      this.players = [];
      this.saveToLocalStorage();
    }
  }
});
