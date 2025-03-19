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
let firstSelected = null;

const showEnhancements = ref(false);
const selectedEnhancement = ref(null); // 用於存儲選中的強化選項
const enhancementCount = ref(2); // 強化次數變數

const growthTable = ref([
  { range: "1-6", dice: "d3-1" },
  { range: "7-8", dice: "d3" },
  { range: "9-18", dice: "d6" },
  { range: "19-81", dice: "d10" },
  { range: "82-90", dice: "d6" },
  { range: "91-92", dice: "d3" },
  { range: "93-99", dice: "d3-1" },
]);

let growthAttempts = ref([]); // 記錄每次成長的結果
const diceResults = ref([]); // 用於存儲擲骰結果

function resetGrowthAttempts() {
  // 還原成長過程中的變化
  growthAttempts.value.forEach(({ id, originalTempValue }) => {
    const item = items.value.find((i) => i.id === id);
    if (item) {
      item.TempValue = originalTempValue;
    }
  });
  growthAttempts.value = [];
}

function applyGrowth(item) {
  const originalTempValue = item.TempValue;

  // 根據屬性成長表選擇骰子
  const range = growthTable.value.find((entry) => {
    const [min, max] = entry.range.split('-').map(Number);
    return item.TempValue >= min && item.TempValue <= max;
  });

  if (!range) return;

  const Roller = new DiceRoller();
  Roller.roll(range.dice);

  const rollResult = Roller.total;
  const newTempValue = Math.min(item.TempValue + rollResult, item.PotentValue);

  // 更新臨時屬性值
  item.TempValue = newTempValue;

  // 記錄成長過程
  growthAttempts.value.push({ id: item.id, originalTempValue });

  // 記錄擲骰結果
  diceResults.value.push(`${item.str} ${originalTempValue} -> ${range.dice} = ${rollResult} -> ${newTempValue}`);

  console.log(`屬性成長: ${item.str}, 骰子: ${range.dice}, 結果: ${rollResult}, 新臨時值: ${newTempValue}`);

  // 如果成長次數達到 2 次，顯示完成訊息並清空選擇
  if (growthAttempts.value.length >= 2) {
    $swal.fire({
      title: "完成強化",
      text: "已完成此強化的屬性成長。",
      icon: "success",
    }).then(() => {
      selectedEnhancement.value = null; // 清空選擇
      enhancementCount.value--; // 減少強化次數
      diceResults.value = []; // 清空擲骰結果
    });
  }
}

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
  showEnhancements.value = true; // 擲骰完成後顯示選項

  console.log("showEnhancements:", showEnhancements.value);
console.log("items:", items.value);
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

function swapAttributes(item) {

    if (!firstSelected) {
      // 記錄第一個被點選的屬性並添加高亮樣式
      firstSelected = item;
      item.isHighlighted = true;
    } else {
      // 第二次點選，交換屬性值
      const secondSelected = item;

      // 交換 PotentValue 和 TempValue
      const tempPotent = firstSelected.PotentValue;
      const tempTemp = firstSelected.TempValue;

      firstSelected.PotentValue = secondSelected.PotentValue;
      firstSelected.TempValue = secondSelected.TempValue;

      secondSelected.PotentValue = tempPotent;
      secondSelected.TempValue = tempTemp;

      // 清除選中狀態與高亮樣式
      firstSelected.isHighlighted = false;
      firstSelected = null;
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
      // 重置屬性值
      items.value.forEach(function (item) {
        item.PotentValue = 0;
        item.TempValue = 0;
        delete item.enhancementUsed; // 移除強化的鎖定
        delete item.enhancementUsedFor85; // 清空 enhancementUsedFor85
        delete item.enhancementUsedFor90; // 清空 enhancementUsedFor90
        delete item.enhancementUsedText; // 清空 enhancementUsedText
      });

      // 重置強化次數
      enhancementCount.value = 2;

      $swal.fire({
        title: "清除!",
        text: "結果已清空。",
        icon: "success"
      });
    }
  });
}

function canShowEnhancements() {
  // 檢查是否所有屬性都沒有需要重骰的情況
  console.log("canShowEnhancements:", items.value.every(item => item.TempValue >= 11));
  return items.value.every(item => item.TempValue >= 11);
}

function applyEnhancement() {
  if (selectedEnhancement.value !== "4") {
    resetGrowthAttempts(); // 還原成長過程中的變化
  }
  if (selectedEnhancement.value === "2") {
    // 找到最高臨時屬性
    const highestTemp = items.value.reduce((prev, curr) => (curr.TempValue > prev.TempValue ? curr : prev), items.value[0]);

    // 計算預期結果
    const newTempValue = 90;
    const newPotentValue = Math.min(highestTemp.PotentValue + 10, 100);

    // 顯示確認訊息
    $swal.fire({
      title: "確認強化",
      text: `將屬性「${highestTemp.str}」的臨時值替換為 ${newTempValue}，潛能值提升至 ${newPotentValue}。是否確認？`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "確定",
      cancelButtonText: "取消",
    }).then((result) => {
      if (result.isConfirmed) {
        // 更新屬性值
        highestTemp.TempValue = newTempValue;
        highestTemp.PotentValue = Math.max(highestTemp.PotentValue, newPotentValue);

        // 更新強化次數
        enhancementCount.value--;

        // 禁用該選項
        highestTemp.enhancementUsedFor90 = true;
        highestTemp.enhancementUsedText = `屬性「${highestTemp.str}」的臨時值已替換為 ${newTempValue}，潛能值提升至 ${newPotentValue}。`;

        // 清空選擇
        selectedEnhancement.value = null;
      }
    });
  } else if (selectedEnhancement.value === "3") {
    // 找到第二高臨時屬性
    const sortedItems = [...items.value].sort((a, b) => b.TempValue - a.TempValue);
    const secondHighestTemp = sortedItems[1]; // 第二高臨時屬性

    // 計算預期結果
    const newTempValue = 85;
    const newPotentValue = Math.min(secondHighestTemp.PotentValue + 10, 100);

    // 顯示確認訊息
    $swal.fire({
      title: "確認強化",
      text: `將屬性「${secondHighestTemp.str}」的臨時值替換為 ${newTempValue}，潛能值提升至 ${newPotentValue}。是否確認？`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "確定",
      cancelButtonText: "取消",
    }).then((result) => {
      if (result.isConfirmed) {
        // 更新屬性值
        secondHighestTemp.TempValue = newTempValue;
        secondHighestTemp.PotentValue = Math.max(secondHighestTemp.PotentValue, newPotentValue);

        // 更新強化次數
        enhancementCount.value--;

        // 禁用該選項
        secondHighestTemp.enhancementUsedFor85 = true;
        secondHighestTemp.enhancementUsedText = `屬性「${secondHighestTemp.str}」的臨時值已替換為 ${newTempValue}，潛能值提升至 ${newPotentValue}。`;

        // 清空選擇
        selectedEnhancement.value = null;
      }
    });
  }
}

function applyEnhancementToItem(item) {
  const newPotentValue = 78;
  const newTempValue = 56;

  $swal.fire({
    title: "確認強化",
    text: `將屬性「${item.str}」的潛能值改為 ${newPotentValue}，臨時值改為 ${newTempValue}。是否確認？`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "確定",
    cancelButtonText: "取消",
  }).then((result) => {
    if (result.isConfirmed) {
      // 更新屬性值
      item.PotentValue = newPotentValue;
      item.TempValue = newTempValue;

      // 更新強化次數
      enhancementCount.value--;

      // 清空選擇
      selectedEnhancement.value = null;

      $swal.fire({
        title: "已完成",
        text: `屬性「${item.str}」已成功強化。`,
        icon: "success",
      });
    }
  });
}

function copyStatsToClipboard() {
  const statsText = items.value.map(item => `${item.PotentValue}\t${item.TempValue}`).join('\n'); // 使用 TAB 分隔
  navigator.clipboard.writeText(statsText).then(() => {
    $swal.fire({
      title: "已複製",
      text: "屬性數值已複製到剪貼簿，可直接貼到 EXCEL。",
      icon: "success",
    });
  }).catch(err => {
    console.error("複製失敗:", err);
    $swal.fire({
      title: "錯誤",
      text: "無法複製到剪貼簿，請重試。",
      icon: "error",
    });
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
          <a-button type="primary" @click="copyStatsToClipboard">複製數值</a-button>
        </a-space>
      </a-col>
    </a-row>

    <!-- 新增說明文字 -->
    <a-row justify="center" style="padding-top: 10px;">
      <a-col :span="24" style="text-align: center;">
        <p>提示：點選潛能屬性框可以交換屬性，屬性可以任意調換。</p>
      </a-col>
    </a-row>

    <a-row justify="center" style="padding-top: 20px;">
      <!-- 左側區塊：顯示擲骰結果 -->
      <a-col :span="6" v-if="selectedEnhancement === '4'" class="dice-results-container">
        <h3>擲骰結果</h3>
        <ul>
          <li v-for="(result, index) in diceResults" :key="index">{{ result }}</li>
        </ul>
      </a-col>

      <!-- 中間區塊：屬性列表 -->
      <a-col :span="12">
        <a-row justify="center" v-for="(item) in items" :key="item.id" style="padding-top: 10px;">
          <a-form :layout="'inline'">
            <a-form-item :label="item.str + ' (潛能)'">
              <a-input :value="item.PotentValue" 
                       @click="swapAttributes(item)" 
                       :class="{ highlighted: item.isHighlighted, lowPotent: selectedEnhancement === '1' && item.PotentValue < 78 }" />
            </a-form-item>
            <a-form-item label="臨時">
              <a-input :value="item.TempValue" 
                       :style="{ color: item.TempValue < 11 ? 'red' : 'inherit' }" 
                       :class="{ lowTemp: selectedEnhancement === '1' && item.TempValue < 56 }" />
            </a-form-item>
            <a-form-item>
              <a-button :type="item.TempValue < 11 ? 'primary' : 'text'" :danger="item.TempValue < 11 ? true : false"
                @click="singleReroll(item.id)">
                {{ item.TempValue < 11 ? '重骰' : '' }} </a-button>
            </a-form-item>
            <a-form-item v-if="selectedEnhancement === '1'">
              <a-button type="primary" @click="applyEnhancementToItem(item)">應用 78/56</a-button>
            </a-form-item>
            <a-form-item v-if="selectedEnhancement === '4'">
              <a-button type="primary" @click="applyGrowth(item)">屬性成長</a-button>
            </a-form-item>
          </a-form>
        </a-row>
      </a-col>

      <!-- 右側區塊：屬性成長表 -->
      <a-col :span="6" v-if="selectedEnhancement === '4'" class="growth-table-container">
        <h3>屬性成長表</h3>
        <a-table :data-source="growthTable" :pagination="false" bordered>
          <a-table-column title="屬性區間" data-index="range" key="range" :dataIndex="'range'" />
          <a-table-column title="骰子" data-index="dice" key="dice" :dataIndex="'dice'" />
        </a-table>
      </a-col>
    </a-row>

    <a-row justify="center" v-if="showEnhancements && canShowEnhancements()" style="padding-top: 20px;">
      <a-col :span="24" style="text-align: center;">
        <p>你還能選擇 {{ enhancementCount }} 次強化：</p>
        <a-form>
          <a-form-item>
            <a-radio-group v-model:value="selectedEnhancement" @change="applyEnhancement" :disabled="enhancementCount === 0">
              <a-row style="padding: 10px 0;">
                <a-col>
                  <a-radio value="1">將任何一項屬性的潛能/臨時改為78/56。</a-radio>
                </a-col>
              </a-row>
              <a-row style="padding: 10px 0;">
                <a-col>
                  <a-radio value="2" :disabled="items.some((item) => item.enhancementUsedFor90)">
                    {{
                      items.find((item) => item.enhancementUsedFor90)?.enhancementUsedText ||
                      "將你的最高臨時屬性替換為 90，並將其潛能提高 10（最多 100）。 如果潛能比臨時低，則將潛能屬性提升到與臨時屬性相同。（僅一次）"
                    }}
                  </a-radio>
                </a-col>
              </a-row>
              <a-row style="padding: 10px 0;">
                <a-col>
                  <a-radio value="3" :disabled="items.some((item) => item.enhancementUsedFor85)">
                    {{
                      items.find((item) => item.enhancementUsedFor85)?.enhancementUsedText ||
                      "將第二高的臨時屬性替換為 85，並將其潛力提高 10（最多 100）。 如果潛能比臨時低，則將潛能屬性提升到與臨時屬性相同。（僅一次）"
                    }}
                  </a-radio>
                </a-col>
              </a-row>
              <a-row style="padding: 10px 0;">
                <a-col>
                  <a-radio value="4">為相同或兩個不同的屬性進行兩次屬性成長擲骰。</a-radio>
                </a-col>
              </a-row>
            </a-radio-group>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>

  </div>
</template>

<style scoped>
/* 高亮樣式 */
.highlighted {
  border: 2px solid #ff9800;
  background-color: #ff9800;
}

/* 潛能值低於 78 的高亮樣式 */
.lowPotent {
  border: 2px solid #f44336;
  background-color: #fdd;
}

/* 臨時值低於 56 的高亮樣式 */
.lowTemp {
  border: 2px solid #2196f3;
  background-color: #dbeeff;
}

/* 屬性成長表容器樣式 */
.growth-table-container {
  padding-right: 20px;
  border-right: 1px solid #ddd;
}

/* 擲骰結果容器樣式 */
.dice-results-container {
  padding-left: 20px;
  border-left: 1px solid #ddd;
}
</style>