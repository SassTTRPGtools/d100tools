<script setup>
import { DiceRoller, exportFormats } from '@dice-roller/rpg-dice-roller';
import { reactive, ref } from 'vue';

const items = ref([
  { id: 1, stat: "Ag", str: "靈巧", PotentValue: 0, TempValue: 0 },
  { id: 2, stat: "Co", str: "體質", PotentValue: 0, TempValue: 0 },
  { id: 3, stat: "Em", str: "同理心", PotentValue: 0, TempValue: 0 },
  { id: 4, stat: "In", str: "直覺", PotentValue: 0, TempValue: 0 },
  { id: 5, stat: "Me", str: "記憶", PotentValue: 0, TempValue: 0 },
  { id: 6, stat: "Pr", str: "存在感", PotentValue: 0, TempValue: 0 },
  { id: 7, stat: "Qu", str: "迅捷", PotentValue: 0, TempValue: 0 },
  { id: 8, stat: "Re", str: "推理", PotentValue: 0, TempValue: 0 },
  { id: 9, stat: "SD", str: "自律", PotentValue: 0, TempValue: 0 },
  { id: 10, stat: "St", str: "力量", PotentValue: 0, TempValue: 0 },
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


const { $swal } = useNuxtApp();


function clearStats() {
  $swal.fire({
    title: "你確定要清空？",
    text: "清空後就沒辦法復原！",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "確定",
    cancelButtonText: "我再想想",
  }).then((result) => {
    if (result.isConfirmed) {
      items.value.forEach(function (item, index) {
        items.value[index].PotentValue = 0;
        items.value[index].TempValue = 0;
      });

      $swal.fire({
        title: "清除!",
        text: "結果已清空。",
        icon: "success"
      });
    }
  });

}

</script>
<template>
  <div>
    <a-row justify="center" style="padding: 24px 0;">
      <a-col :span="24" style="text-align: center;">
        <a-space>
          <a-button type="primary" @click="clearStats">清空結果</a-button>
          <a-button type="primary" @click="generateState">擲骰</a-button>
        </a-space>
      </a-col>
    </a-row>

    <a-row justify="center" v-for="(item) in items" :key="item.id" style="padding-top: 10px;">
      <a-form :layout="'inline'">
        <a-form-item :label="item.str + ' (潛能)'">
          <a-input :value="item.PotentValue" />
        </a-form-item>
        <a-form-item label="臨時">
          <a-input :value="item.TempValue" :style="{ color: item.TempValue < 11 ? 'red' : 'inherit' }" />
        </a-form-item>
        <a-form-item>
          <a-button :type="item.TempValue < 11 ? 'primary' : 'text'" :danger="item.TempValue < 11 ? true : false"
            @click="singleReroll(item.id)">
            {{ item.TempValue < 11 ? '重骰' : '' }} </a-button>
        </a-form-item>
      </a-form>
    </a-row>

  </div>
</template>

<style scoped></style>