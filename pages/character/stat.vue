<script setup>
import {Container, Draggable} from "vue3-smooth-dnd";
import {DiceRoller, exportFormats} from '@dice-roller/rpg-dice-roller';
import {ref} from 'vue'


//TODO
/**
 * 1. 把強化規則還有替換規則加進去
 * 然後，你能選擇以下任意2項強化（boosts）（或一項選兩次）：
 * 將任何一項屬性的潛能與臨時改為 78/56（如果比較有利的話）。
 * 將你的最高臨時屬性替換為 90，並將其潛能提高 10（最多 100）。 如果潛能比臨時低，則將潛能屬性提升到與臨時屬性相同。
 * 將第二高的臨時屬性替換為 85，並將其潛力提高 10（最多 100）。 如果潛能比臨時低，則將潛能屬性提升到與臨時屬性相同。
 */


let items = ref([
  {id: 1, stat: "Ag", str: "靈巧", PotentValue: 0, TempValue: 0},
  {id: 2, stat: "Co", str: "體質", PotentValue: 0, TempValue: 0},
  {id: 3, stat: "Em", str: "同理心", PotentValue: 0, TempValue: 0},
  {id: 4, stat: "In", str: "直覺", PotentValue: 0, TempValue: 0},
  {id: 5, stat: "Me", str: "記憶", PotentValue: 0, TempValue: 0},
  {id: 6, stat: "Pr", str: "存在感", PotentValue: 0, TempValue: 0},
  {id: 7, stat: "Qu", str: "迅捷", PotentValue: 0, TempValue: 0},
  {id: 8, stat: "Re", str: "推理", PotentValue: 0, TempValue: 0},
  {id: 9, stat: "SD", str: "自律", PotentValue: 0, TempValue: 0},
  {id: 10, stat: "St", str: "力量", PotentValue: 0, TempValue: 0},
]);

let oriItems;

function generateState() {
  const Roller = new DiceRoller();
  Roller.roll(
      '3d100kh2',
      '3d100kh2',
      '3d100kh2',
      '3d100kh2',
      '3d100kh2',
      '3d100kh2',
      '3d100kh2',
      '3d100kh2',
      '3d100kh2',
      '3d100kh2'
  );

  const jsonString = Roller.export(exportFormats.OBJECT);
  const finalRes = [];

  jsonString.log.forEach(function (item, index) {
    const rolls = item.rolls[0].rolls;
    const filteredRolls = rolls.filter(roll => roll.modifierFlags !== "d");

    filteredRolls.sort((a, b) => b.calculationValue - a.calculationValue);
    finalRes[index] = filteredRolls;

    items.value[index].PotentValue = finalRes[index][0].calculationValue;
    items.value[index].TempValue = finalRes[index][1].calculationValue;
  });

  oriItems = ref(JSON.parse(JSON.stringify(items.value)));
}

function singleReroll(id) {
  if (items.value[id - 1].TempValue < 11) {
    const Roller = new DiceRoller();
    Roller.roll('1d100');

    const jsonString = Roller.export(exportFormats.OBJECT);
    const finalRes = [];

    jsonString.log.forEach(function (item, index) {
      const PotentValue = items.value[id - 1].PotentValue;
      const TempValue = item.rolls[0].rolls[0].calculationValue;

      const filteredRolls = [PotentValue, TempValue];
      filteredRolls.sort((a, b) => b - a);

      items.value[id - 1].PotentValue = filteredRolls[0];
      items.value[id - 1].TempValue = filteredRolls[1];
    });
  }
}

function clearStats() {
  if (confirm("確定要清空結果嗎？")) {
    resetSwap();
    items.value.forEach(function (item, index) {
      items.value[index].PotentValue = 0;
      items.value[index].TempValue = 0;
    });
  }

}

const swapStats = ref([
  {id: 1, stat: "currently", value: 0},
  {id: 2, stat: "max", value: 2},
]);

const swapChangeStatsId = ref([
  {id: 1, stat: "original", value: 0},
  {id: 2, stat: "altered", value: 0},
]);


function resetSwap() {
  console.log(oriItems.value,"|||resetSwap");
  swapStats.value[0].value = 0;
  items.value = JSON.parse(JSON.stringify(oriItems.value));
  clearChangeAndSettingSwap();
}

function clearChangeAndSettingSwap() {

  swapChangeStatsId.value.forEach(function (item, index) {
    swapChangeStatsId.value[index].value = 0;
  });

}

function changeAndSettingSwap(id) {

  if (swapStats.value[0].value >= swapStats.value[1].value) {
    clearChangeAndSettingSwap();
    alert("已達交換次數上限。");
    return false;
  }

  (swapChangeStatsId.value[0].value === 0 && swapChangeStatsId.value[1].value === 0) ? swapChangeStatsId.value[0].value = id : swapChangeStatsId.value[1].value = id;

  if (swapChangeStatsId.value[0].value > 0 && swapChangeStatsId.value[1].value > 0) {
    console.log([swapChangeStatsId.value[0].value,swapChangeStatsId.value[1].value], "before");
    const [original, altered] = swapChangeStatsId.value.map(item => item.value - 1);
    let swapValues = null;
    items.value.forEach(function (item, index) {
      if (index === original) {
        swapValues = oriItems.value[altered];
        console.log()
        items.value[index].PotentValue = swapValues.PotentValue;
        items.value[index].TempValue = swapValues.TempValue;
      } else if (index === altered) {
        swapValues = oriItems.value[original];
        items.value[index].PotentValue = swapValues.PotentValue;
        items.value[index].TempValue = swapValues.TempValue;
      }
    });
    if (swapStats.value[0].value < swapStats.value[1].value) {
      swapStats.value[0].value += 1;
    }
    clearChangeAndSettingSwap();
  }

  return true;
}

</script>

<template>
  <div class="w-full flex justify-center items-center py-6">
    <div class="max-w-sm flex items-center pb-2">
      <div class="pl-3">
        <button
            class="flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded"
            type="button" @click="clearStats">
          清空結果
        </button>
      </div>
      <div class="pl-3">
        <button
            class="flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded"
            type="button" @click="generateState">
          擲骰
        </button>
      </div>
      <div class="pl-3">
        <button
            class="flex-shrink-0 bg-gray-500 hover:bg-gray-700 border-gray-500 hover:border-gray-700 text-sm border-4 text-white py-1 px-2 rounded"
            type="button" @click="resetSwap">
          重設交換次數與屬性
        </button>
      </div>
    </div>
  </div>
  <div class="flex flex-col items-center py-6">
    <div class="bg-blue-50 shadow-md rounded-md px-4 py-2 flex items-center max-w-sm">
      <span class="font-medium text-gray-800">點選屬性名稱，能夠交換屬性數值。</span>
    </div>
    <div class="max-w-sm flex items-center pb-2">
      交換屬性的次數：{{ swapStats[0].value }} / {{ swapStats[1].value }}
    </div>
    <div class="max-w-sm flex items-center pb-2">
      說明文字
    </div>
  </div>


  <form class="w-full flex justify-center py-2" v-for="(item, index) in items" :key="item.id">
    <button :class="{ 'w-20 flex-shrink-0 bg-gray-500 hover:bg-gray-700 border-gray-500 hover:border-gray-700 text-sm border-4 text-white py-1 px-2 rounded': swapChangeStatsId[0].value == item.id || swapChangeStatsId[1].value == item.id,
               'w-20 flex-shrink-0 bg-black hover:bg-slate-500 border-black hover:border-slate-500 text-sm border-4 text-white rounded': swapChangeStatsId[0].value != item.id && swapChangeStatsId[1].value != item.id }"
            type="button" @click="changeAndSettingSwap(item.id)">
      {{ item.str }}
    </button>
    <div class="max-w-sm flex items-center border-b border-teal-500 pb-2">
      <input
          class="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
          type="text" :value="item.PotentValue">
    </div>
    <button
        class="w-20 flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white  rounded"
        type="button">
      潛能
    </button>
    <div class="max-w-sm flex items-center border-b border-teal-500 pb-2">
      <input
          type="text" :value="item.TempValue" :class="{ 'appearance-none bg-transparent border-none w-full text-red-700 mr-3 py-1 px-2 leading-tight focus:outline-none': item.TempValue < 11,
               'appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none': item.TempValue >= 11 }">
    </div>
    <button
        type="button" @click="singleReroll(item.id)"
        :class="{
    'w-20 flex-shrink-0 bg-red-100 hover:bg-red-300 border-red-100 hover:border-red-300 text-sm border-4 text-red-700 rounded': item.TempValue < 11,
    'w-20 flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white rounded': item.TempValue >= 11
  }">
      {{ item.TempValue < 11 ? "重骰" : "臨時" }}
    </button>
  </form>
</template>

<style scoped>

</style>