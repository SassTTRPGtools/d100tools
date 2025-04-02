<script setup>
import { ref, computed, watch } from 'vue';
import { spellTables, CraftSpellTables } from '@/rolemaster/utils/spellTables.js';

// 確保初始值與伺服器端渲染一致
const selectedBase = ref("SanctifierBase");
const formulaData = ref({
  itemLevel: null,
  extraCost: null,
  craftingSpells: [], // 修改為陣列以支援多選
  otherSpell: [],
  domainSpells: [], // 新增領域法術的陣列
  itemBonus: null,
});

const craftingSpellOptions = ref([]); // 原 mainSpellOptions
const styleSpellOptions = ref([]); // 原 otherSpellOptions
const otherSpellOptions = ref([]); // 原 domainSpellOptions
const showCraftingTooltip = ref(false);
const showStyleTooltip = ref(false); // 原 showOtherTooltip
const showOtherTooltip = ref(false); // 新增對應其他法術的 tooltip
const tooltipContent = ref('');

const padLevel = (level) => level.toString().padStart(2, '0'); // 新增補零函數

const updateCraftingSpellOptions = (base) => { // 原 updateSpellOptions
  if (!base || !spellTables[base]) {
    craftingSpellOptions.value = [];
  } else {
    craftingSpellOptions.value = spellTables[base]
      .filter(spell => spell.spellName && spell.spellName.includes('#'))
      .map(spell => ({
        value: spell.spellName,
        label: `${padLevel(spell.level)}. ${spell.spellName}`, // 使用補零函數
        level: spell.level,
        details: `${spell.level || '未知'}. ${spell.spellName}（範圍：${spell.areaOfEffect || '未知'}；持續時間：${spell.duration || '未知'}；射程：${spell.range || '未知'}；類型：${spell.type || '未知'}）：${spell.details || '無描述'}`,
      }));
  }
};

const updateStyleSpellOptions = (base) => { // 原 updateOtherSpellOptions
  if (!base || !spellTables[base]) {
    styleSpellOptions.value = [];
  } else {
    styleSpellOptions.value = spellTables[base]
      .filter(spell => spell.spellName && !spell.spellName.includes('#') && spell.level > 0)
      .map(spell => ({
        value: spell.spellName,
        label: `${padLevel(spell.level)}. ${spell.spellName}`, // 使用補零函數
        level: spell.level,
        details: `${spell.level || '未知'}. ${spell.spellName}（範圍：${spell.areaOfEffect || '未知'}；持續時間：${spell.duration || '未知'}；射程：${spell.range || '未知'}；類型：${spell.type || '未知'}）：${spell.details || '無描述'}`,
      }));
  }
};

const updateOtherSpellOptions = (base) => { // 原 updateDomainSpellOptions
  if (!base || !CraftSpellTables[base]) {
    otherSpellOptions.value = [];
  } else {
    const allSpells = Object.values(CraftSpellTables[base]).flat();
    otherSpellOptions.value = allSpells
      .filter(spell => spell.spellName && spell.level > 0) // 新增篩選條件：level > 0
      .map(spell => ({
        value: spell.spellName,
        label: `${padLevel(spell.level)}. ${spell.spellName}`, // 使用補零函數
        level: spell.level,
        details: `${spell.level || '未知'}. ${spell.spellName}（範圍：${spell.areaOfEffect || '未知'}；持續時間：${spell.duration || '未知'}；射程：${spell.range || '未知'}；類型：${spell.type || '未知'}）：${spell.details || '無描述'}`,
      }));
  }
};

// 初始化選項
updateCraftingSpellOptions(selectedBase.value);
updateStyleSpellOptions(selectedBase.value);
updateOtherSpellOptions(selectedBase.value);

watch(selectedBase, (newBase) => {
  // 清空下拉選單中的參數
  formulaData.value.craftingSpells = [];
  formulaData.value.otherSpell = [];
  dynamicOtherSpells.value = [{ id: Date.now(), selectedSpells: [] }];

  // 更新選項
  updateCraftingSpellOptions(newBase);
  updateStyleSpellOptions(newBase);
  updateOtherSpellOptions(newBase);
});

const handleMouseEnter = (details, type) => {
  tooltipContent.value = details || '';
  if (type === 'craftingSpells') {
    showCraftingTooltip.value = true;
  } else if (type === 'styleSpells') {
    showStyleTooltip.value = true;
  } else if (type === 'otherSpells') {
    showOtherTooltip.value = true;
  }
};

const handleMouseLeave = (type) => {
  if (type === 'craftingSpells') {
    showCraftingTooltip.value = false;
  } else if (type === 'styleSpells') {
    showStyleTooltip.value = false;
  } else if (type === 'otherSpells') {
    showOtherTooltip.value = false;
  }
};

const calculateItemLevel = computed(() => {
  const craftingMaxLevel = Math.max(
    ...formulaData.value.craftingSpells.map(spellName => {
      let parts = spellName.split(' ');
      let result = parts.pop();
      const spell = craftingSpellOptions.value.find(option => option.value === result);
      return spell?.level || 0;
    }),
    0
  );

  const otherMaxLevel = Math.max(
    ...formulaData.value.otherSpell.map(spellName => {
      let parts = spellName.split(' ');
      let result = parts.pop();
      const spell = styleSpellOptions.value.find(option => option.value === result);
      return spell?.level || 0;
    }),
    0
  );

  const domainMaxLevel = Math.max(
    ...dynamicOtherSpells.value.flatMap(spellGroup =>
      spellGroup.selectedSpells.map(spellName => {
        let parts = spellName.split(' ');
        let result = parts.pop();
        const spell = otherSpellOptions.value.find(option => option.value === result);
        return spell?.level || 0;
      })
    ),
    0
  );

  return Math.max(craftingMaxLevel, otherMaxLevel, domainMaxLevel);
});

const mainData = computed(() => {
  const craftingSpellCost = formulaData.value.craftingSpells.reduce((acc, spellName) => {
    let parts = spellName.split(' ');
    let result = parts.pop();
    const spell = craftingSpellOptions.value.find(option => option.value === result);
    return acc + parseFloat(spell?.level || 0);
  }, 0);

  const otherSpellCost = formulaData.value.otherSpell.reduce((acc, spellName) => {
    let parts = spellName.split(' ');
    let result = parts.pop();
    const spell = styleSpellOptions.value.find(option => option.value === result);
    return acc + parseFloat(spell?.level || 0);
  }, 0);

  const domainSpellsCost = dynamicOtherSpells.value.reduce((acc, spellGroup) => {
    return acc + spellGroup.selectedSpells.reduce((groupAcc, spellName) => {
      let parts = spellName.split(' ');
      let result = parts.pop();
      const spell = otherSpellOptions.value.find(option => option.value === result);
      return groupAcc + parseFloat(spell?.level || 0);
    }, 0);
  }, 0);

  const itemLevel = parseFloat(formulaData.value.itemLevel) || 0;
  const extraCost = parseFloat(formulaData.value.extraCost) || 0;
  const itemBonus = parseFloat(formulaData.value.itemBonus) || 0;

  const dailyPP = craftingSpellCost + otherSpellCost + domainSpellsCost;
  const batchDailyPP = (craftingSpellCost * 5) + otherSpellCost + domainSpellsCost;

  const finalWorkDays = Math.max(0, Math.ceil((dailyPP - itemBonus) / 2));

  const costPrice = (itemLevel * finalWorkDays) + extraCost;

  const baseMarketValue = costPrice + (finalWorkDays * (Math.floor(dailyPP / 40) + 2));

  const batchSellingPrice = baseMarketValue / 5;
  const batchCostPrice = costPrice / 5;

  return [
    {
      key: '1',
      itemLevel,
      extraCost,
      dailyPP,
      finalWorkDays,
      baseMarketValue,
      costPrice,
      batchDailyPP,
      batchSellingPrice,
      batchCostPrice,
    },
  ];
});

const mainColumns = [
  { title: '工作日（每日PP）', dataIndex: 'dailyPP', key: 'dailyPP' },
  { title: '最終工作日', dataIndex: 'finalWorkDays', key: 'finalWorkDays' },
  { title: '基礎市場價值', dataIndex: 'baseMarketValue', key: 'baseMarketValue' },
  { title: '成本價', dataIndex: 'costPrice', key: 'costPrice' },
  { title: '批次（每日PP）', dataIndex: 'batchDailyPP', key: 'batchDailyPP' },
  { title: '批次售價', dataIndex: 'batchSellingPrice', key: 'batchSellingPrice' },
  { title: '批次成本價', dataIndex: 'batchCostPrice', key: 'batchCostPrice' },
];

const materialData = ref([
  { key: '1', grade: '劣質', durability: '可變', workability: '可變', bonus: '可變', extraCost: 'x0.75' },
  { key: '2', grade: '普通', durability: '+0', workability: '+0', bonus: '+0', extraCost: '+0' },
  { key: '3', grade: '優良', durability: '+5', workability: '-5', bonus: '+10', extraCost: '+40' },
  { key: '4', grade: '優良+', durability: '+10', workability: '-10', bonus: '+15', extraCost: '+100' },
  { key: '5', grade: '稀有', durability: '+15', workability: '-15', bonus: '+20', extraCost: '+200' },
  { key: '6', grade: '稀有+', durability: '+20', workability: '-20', bonus: '+30', extraCost: '+400' },
  { key: '7', grade: '史詩', durability: '+25', workability: '-30', bonus: '+40', extraCost: '+3000' },
  { key: '8', grade: '傳說', durability: '+50', workability: '-50', bonus: '+80', extraCost: '+6000' },
]);

const materialColumns = [
  { title: '材料等級', dataIndex: 'grade', key: 'grade' },
  { title: '耐久度', dataIndex: 'durability', key: 'durability' },
  { title: '加工性', dataIndex: 'workability', key: 'workability' },
  { title: '加值', dataIndex: 'bonus', key: 'bonus' },
  { title: '額外成本', dataIndex: 'extraCost', key: 'extraCost' },
];

const dynamicOtherSpells = ref([{ id: Date.now(), selectedSpells: [] }]); // 動態法術列表

const addOtherSpellDropdown = () => {
  dynamicOtherSpells.value.push({ id: Date.now(), selectedSpells: [] });
};

const removeOtherSpellDropdown = (id) => {
  dynamicOtherSpells.value = dynamicOtherSpells.value.filter(spell => spell.id !== id);
};

const isMaterialModalVisible = ref(false); // 控制 Modal 顯示的狀態

const showMaterialModal = () => {
  isMaterialModalVisible.value = true;
};

const hideMaterialModal = () => {
  isMaterialModalVisible.value = false;
};

</script>

<template>
  <a-layout>
    <a-layout-content style="padding: 24px">
      <a-row :gutter="16">
        <a-col span="24" style="text-align: center; margin-bottom: 24px;">
          <a-button type="primary" @click="showMaterialModal">顯示材料概估表</a-button>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <!-- 左側：成品計算與製作公式 -->
        <a-col span="12">
          <!-- 成品計算 -->
          <a-card title="成品計算" style="margin-bottom: 24px;">
            <a-row :gutter="16">
              <!-- 最終工作日 -->
              <a-col span="24" style="text-align: center; margin-bottom: 16px;">
                <a-statistic
                  title="最終工作日"
                  :value="mainData[0]?.finalWorkDays || 0"
                  :valueStyle="{ fontSize: '24px', fontWeight: 'bold' }"
                />
              </a-col>
              <!-- 工作日、基礎市場價值、成本價 -->
              <a-col span="8">
                <a-statistic title="工作日（每日PP）" :value="mainData[0]?.dailyPP || 0" />
              </a-col>
              <a-col span="8">
                <a-statistic title="基礎市場價值" :value="mainData[0]?.baseMarketValue || 0" />
              </a-col>
              <a-col span="8">
                <a-statistic title="成本價" :value="mainData[0]?.costPrice || 0" />
              </a-col>
              <!-- 批次相關 -->
              <a-col span="8">
                <a-statistic title="批次（每日PP）" :value="mainData[0]?.batchDailyPP || 0" />
              </a-col>
              <a-col span="8">
                <a-statistic title="批次售價" :value="mainData[0]?.batchSellingPrice || 0" />
              </a-col>
              <a-col span="8">
                <a-statistic title="批次成本價" :value="mainData[0]?.batchCostPrice || 0" />
              </a-col>
            </a-row>
          </a-card>
          <!-- 製作公式 -->
          <a-card title="製作公式">
            <a-form :model="formulaData" layout="horizontal">
              <a-form-item label="選擇製作風格">
                <a-select v-model:value="selectedBase" placeholder="請選擇製作風格">
                  <a-select-option value="SanctifierBase">聖化術士</a-select-option>
                  <a-select-option value="AdeptBase">煉金術士</a-select-option>
                  <a-select-option value="PsychographerBase">心能術士</a-select-option>
                </a-select>
              </a-form-item>
              <a-row :gutter="16">
                <a-col span="8">
                  <a-form-item label="物品等級">
                    <a-input v-model:value="calculateItemLevel" disabled />
                  </a-form-item>
                </a-col>
                <a-col span="8">
                  <a-form-item label="額外成本">
                    <a-input v-model:value="formulaData.extraCost" />
                  </a-form-item>
                </a-col>
                <a-col span="8">
                  <a-form-item label="物品加值">
                    <a-input v-model:value="formulaData.itemBonus" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-form-item label="加工法術">
                <a-select
                  v-model:value="formulaData.craftingSpells"
                  mode="multiple"
                  placeholder="請選擇加工法術"
                  style="width: 100%;"
                >
                  <a-select-option
                    v-for="spell in craftingSpellOptions"
                    :key="spell.value"
                    :value="spell.label"
                  >
                    <template #default>
                      <div
                        @mouseenter="handleMouseEnter(spell.details, 'craftingSpells')"
                        @mouseleave="handleMouseLeave('craftingSpells')"
                      >
                      {{ spell.label }}
                      </div>
                    </template>
                  </a-select-option>
                </a-select>
                <div
                  v-if="showCraftingTooltip"
                  class="absolute bg-gray-100 border border-gray-300 p-2 rounded shadow-lg"
                  style="z-index: 1000; max-width: 600px; right: -620px; top: 0;"
                >
                  {{ tooltipContent }}
                </div>
              </a-form-item>
              <a-form-item label="風格法術">
                <a-select
                  v-model:value="formulaData.otherSpell"
                  mode="multiple"
                  placeholder="請選擇風格法術"
                  style="width: 100%;"
                >
                  <a-select-option
                    v-for="spell in styleSpellOptions"
                    :key="spell.value"
                    :value="spell.label"
                  >
                    <template #default>
                      <div
                        @mouseenter="handleMouseEnter(spell.details, 'styleSpells')"
                        @mouseleave="handleMouseLeave('styleSpells')"
                      >
                      {{ spell.label }}
                      </div>
                    </template>
                  </a-select-option>
                </a-select>
                <div
                  v-if="showStyleTooltip"
                  class="absolute bg-gray-100 border border-gray-300 p-2 rounded shadow-lg"
                  style="z-index: 1000; max-width: 600px; right: -620px; top: 0;"
                >
                  {{ tooltipContent }}
                </div>
              </a-form-item>
              <a-form-item label="其他法術">
                <div v-for="(spellGroup, index) in dynamicOtherSpells" :key="spellGroup.id" style="margin-bottom: 16px;">
                  <a-select
                    v-model:value="spellGroup.selectedSpells"
                    mode="multiple"
                    placeholder="請選擇其他法術"
                    style="width: 80%;"
                  >
                    <a-select-option
                      v-for="spell in otherSpellOptions"
                      :key="spell.value"
                      :value="spell.label"
                    >
                      <template #default>
                        <div
                          @mouseenter="handleMouseEnter(spell.details, 'otherSpells')"
                          @mouseleave="handleMouseLeave('otherSpells')"
                        >
                        {{ spell.label }}
                        </div>
                      </template>
                    </a-select-option>
                  </a-select>
                  <a-button
                    type="danger"
                    @click="removeOtherSpellDropdown(spellGroup.id)"
                    style="margin-left: 8px;"
                  >
                    刪除
                  </a-button>
                </div>
                <a-button type="primary" @click="addOtherSpellDropdown">新增下拉選單</a-button>
                <div
                  v-if="showOtherTooltip"
                  class="absolute bg-gray-100 border border-gray-300 p-2 rounded shadow-lg"
                  style="z-index: 1000; max-width: 600px; right: -620px; top: 0;"
                >
                  {{ tooltipContent }}
                </div>
              </a-form-item>
            </a-form>
          </a-card>
        </a-col>
        <!-- 右側：成品內容 -->
        <a-col span="12">
          <a-card title="成品內容">
            <a-row :gutter="16">
              <!-- 加工法術區塊 -->
              <a-col span="24" class="crafting-spells-block">
                <h3 class="crafting-title">加工法術</h3>
                <ul>
                  <li v-for="spell in formulaData.craftingSpells" :key="spell">
                    <strong>{{ spell }}</strong>
                    <p>{{ craftingSpellOptions.find(option => option.label === spell)?.details }}</p>
                  </li>
                </ul>
              </a-col>
              <!-- 風格法術區塊 -->
              <a-col span="24" class="style-spells-block">
                <h3 class="style-title">風格法術</h3>
                <ul>
                  <li v-for="spell in formulaData.otherSpell" :key="spell">
                    <strong>{{ spell }}</strong>
                    <p>{{ styleSpellOptions.find(option => option.label === spell)?.details }}</p>
                  </li>
                </ul>
              </a-col>
              <!-- 其他法術區塊 -->
              <a-col span="24" class="other-spells-block">
                <h3 class="other-title">其他法術</h3>
                <ul>
                  <li
                    v-for="spellGroup in dynamicOtherSpells"
                    :key="spellGroup.id"
                  >
                    <ul>
                      <li
                        v-for="spell in spellGroup.selectedSpells"
                        :key="spell"
                      >
                        <strong>{{ spell }}</strong>
                        <p>{{ otherSpellOptions.find(option => option.label === spell)?.details }}</p>
                      </li>
                    </ul>
                  </li>
                </ul>
              </a-col>
            </a-row>
          </a-card>
        </a-col>
      </a-row>
    </a-layout-content>
  </a-layout>

  <!-- 材料概估表 Modal -->
  <a-modal
    v-model:visible="isMaterialModalVisible"
    title="材料概估表"
    @ok="hideMaterialModal"
    @cancel="hideMaterialModal"
    width="800px"
  >
    <a-table
      :columns="materialColumns"
      :dataSource="materialData"
      bordered
      :pagination="false"
    />
  </a-modal>
</template>

<style>
/* 可根據需求調整樣式 */
.absolute {
  position: absolute;
}

.crafting-spells-block {
  background-color: #e6f7ff; /* 淺藍色 */
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.crafting-title {
  color: #1890ff; /* 藍色 */
}

.style-spells-block {
  background-color: #fffbe6; /* 淺黃色 */
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.style-title {
  color: #faad14; /* 黃色 */
}

.other-spells-block {
  background-color: #f6ffed; /* 淺綠色 */
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.other-title {
  color: #52c41a; /* 綠色 */
}
</style>