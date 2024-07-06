<script setup>
  import {DiceRollerRenderless} from '@dice-roller/vue';
</script>

<template>
  <div class="w-full flex justify-center items-center py-6">
    <img class="w-8" src="https://dice-roller.github.io/documentation/hero.svg">
    <span class="pl-2 text-lg font-bold">更多用法見 <a class="text-blue-400 underline"
                                                       href="https://dice-roller.github.io/documentation/guide/#features"
                                                       target="_blank">RPG Dice Roller</a></span>
  </div>
  <DiceRollerRenderless v-slot="{ currentNotation, error, output, roll, on, bind }">
    <form class="w-full flex justify-center">
      <div class="max-w-sm flex items-center border-b border-teal-500 pb-2">
        <input
            class="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            type="text"
            v-on="on" v-bind="bind" placeholder="e.g. 1d100">
        <button
            class="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
            type="button" @click="roll">
          確定
        </button>
      </div>
    </form>
    <div class="w-full flex justify-center py-6 font-bold">
      <output v-if="output">{{ output }}</output>
    </div>
    <div class="text-center text-red-500 text-xs italic" v-if="error">{{ error }}</div>
  </DiceRollerRenderless>
</template>