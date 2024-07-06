<script setup>
import {Container, Draggable} from "vue3-smooth-dnd";
import {DiceRoll, DiceRoller, exportFormats} from '@dice-roller/rpg-dice-roller';


import {ref} from 'vue'

const items = ref([
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

const onDrop = (dropResult) => {
  items.value = applyDrag(items.value, dropResult);
};

const applyDrag = (arr, dragResult) => {
  const {removedIndex, addedIndex, payload} = dragResult;

  if (removedIndex === null && addedIndex === null) return arr;

  const result = [...arr]; // Copy to avoid mutation
  let itemToAdd = payload;

  if (removedIndex !== null) {
    itemToAdd = result.splice(removedIndex, 1)[0];
  }

  if (addedIndex !== null) {
    result.splice(addedIndex, 0, itemToAdd);
  }

  return result;
};

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

}
//TODO
/**
 * 1. 重骰任何低於 11 的值
 * 2. 把強化規則還有替換規則加進去
 * 然後，你能選擇以下任意2項強化（boosts）（或一項選兩次）：
 * 將任何一項屬性的臨時與潛能改為 56/78（如果比較有利的話）。
 * 將你的最高臨時屬性替換為 90，並將其潛能提高 10（最多 100）。 如果潛能比臨時低，則將潛能屬性提升到與臨時屬性相同。
 * 將第二高的臨時屬性替換為 85，並將其潛力提高 10（最多 100）。 如果潛能比臨時低，則將潛能屬性提升到與臨時屬性相同。
 * 為相同或兩個不同的屬性進行兩次屬性成長擲骰（參見下一節）。
 * 3. 完成交換功能
 */

</script>

<template>
  <div class="w-full flex justify-center items-center py-6">
    <div class="max-w-sm flex items-center pb-2">
      <button
          class="flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded"
          type="button" @click="generateState">
        擲骰
      </button>
    </div>
  </div>
  <Container @drop="onDrop">
    <Draggable v-for="(item, index) in items" :key="item.id">
      <form class="w-full flex justify-center py-2">
        <button
            class="w-20 flex-shrink-0 bg-black hover:bg-slate-500 border-black hover:border-slate-500 text-sm border-4 text-white  rounded"
            type="button">
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
              class="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
              type="text" :value="item.TempValue">
        </div>
        <button
            class="w-20 flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white  rounded"
            type="button">
          臨時
        </button>
      </form>
    </Draggable>
  </Container>
</template>

<style scoped>

</style>