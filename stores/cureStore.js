import { defineStore } from 'pinia';

export const useCureStore = defineStore('cureStore', {
  state: () => ({
    players: []
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
