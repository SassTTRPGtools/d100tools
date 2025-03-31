import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useFavoritesStore = defineStore('favorites', {
  persist: true, // 啟用持久化
  state: () => ({
    favorites: {
      player: [],
      npc: []
    }
  }),
  actions: {
    addFavorite(type, favorite) {
      this.favorites[type].push(favorite);
    },
    clearFavorites() {
      this.favorites.player = [];
      this.favorites.npc = [];
    }
  }
});
