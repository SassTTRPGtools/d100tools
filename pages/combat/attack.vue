<script setup>
import { DiceRoller, exportFormats } from '@dice-roller/rpg-dice-roller';
import { reactive, ref } from 'vue';
import jsonData from '@/rolemaster/combatdata/fumble.json';

const CategoryOptions = [
  { value: 'ArmingSword', label: '直劍' },
  { value: 'BallFire', label: '火球' },
  { value: 'BallCold', label: '冰凍球' },
  { value: 'BallLightning', label: '閃電球' },
  { value: 'BattleAxe', label: '戰斧' },
  { value: 'Beak', label: '喙擊' },
  { value: 'Bite', label: '啃咬' },
  { value: 'Bola', label: '繩球' },
  { value: 'BoltFire', label: '火焰箭' },
  { value: 'BoltIce', label: '冰箭術' },
  { value: 'BoltLightning', label: '閃電箭' },
  { value: 'BoltWater', label: '水箭術' },
  { value: 'BowLong', label: '長弓' },
  { value: 'BowShort', label: '短弓' },
  { value: 'Broadsword', label: '闊劍' },
  { value: 'Claw', label: '爪抓' },
  { value: 'Club', label: '棍棒' },
  { value: 'Crossbow', label: '十字弩' },
  { value: 'Crush', label: '粉碎' },
  { value: 'Dagger', label: '匕首' },
  { value: 'Falchion', label: '直刀' },
  { value: 'FightingStick', label: '單手棍' },
  { value: 'Flail', label: '連枷' },
  { value: 'Grapple', label: '擒拿' },
  { value: 'Horn', label: '角擊' },
  { value: 'Mace', label: '錘子' },
  { value: 'Ram', label: '撞擊' },
  { value: 'Rapier', label: '刺劍' },
  { value: 'Rock', label: '石頭' },
  { value: 'Scimitar', label: '彎刀' },
  { value: 'Shield', label: '盾牌' },
  { value: 'Sling', label: '投石索' },
  { value: 'Spear', label: '矛' },
  { value: 'Stinger', label: '刺擊' },
  { value: 'Trample', label: '踐踏' },
  { value: 'UnarmedStrikes', label: '無武裝打擊' },
  { value: 'UnarmedSweeps', label: '無武裝橫掃' },
  { value: 'WarHammer', label: '戰鎚' },
  { value: 'Whip', label: '鞭子' },
];

const selectedCategory = ref(CategoryOptions[0].value);
const rollResult = ref(null);
const fumbleResult = ref(null);

const rollDice = () => {
  const roller = new DiceRoller();
  const roll = roller.roll('1d100');
  rollResult.value = roll.total;
  findFumbleResult();
};

const findFumbleResult = () => {
  const category = jsonData[selectedCategory.value];
  if (category) {
    fumbleResult.value = category.find(
      (item) => rollResult.value >= item.min && rollResult.value <= item.max
    );
  }
};

</script>


<template>
  <div class="container">
    <div class="form-container">
      <a-form-item label="犯蠢結果表：">
        <a-select v-model:value="selectedCategory" style="width: 200px">
          <a-select-option v-for="option in CategoryOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-button type="primary" @click="rollDice">Roll Dice</a-button>
    </div>
    <div v-if="rollResult !== null" class="result">
      <p>Roll Result: {{ rollResult }}</p>
      <p v-if="fumbleResult">Fumble Result: {{ fumbleResult.description }}</p>
      <p v-else>No result found.</p>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100vh;
  padding-top: 20px;
}

.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.result {
  text-align: center;
  margin-top: 20px;
}
</style>