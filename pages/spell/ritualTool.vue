<script setup>
import { reactive, computed, onMounted } from "vue";
import { message } from "ant-design-vue"; // 引入 Ant Design 的提示功能
import {
  ritualParameters,
  bloodParameters,
  investingTimeParameters,
  ritualModifiersParameters
} from "@/rolemaster/utils/ritualTables";

// 合併所有參數群組
const parameterGroups = [
  ...ritualParameters,
];

// 使用 reactive 管理選擇的值
const selectedValues = reactive({});
const additionalInputs = reactive({}); // 用於存儲次數輸入框的值
const severityAdjustment = reactive({ initial: -30, modified: -30 }); // 嚴重度調整的初始與修改值，修改嚴重度預設為 B (-60)
const durationAdjustment = reactive({ initial: "", modified: "" }); // 改變持續時間的初始與修改值

// 新增 reactive 狀態以存儲 n 的值和計算結果
const ppInputs = reactive({}); // 用於存儲 n 的值
// 修改 ppResults，確保未輸入內容時顯示為 0
const ppResults = computed(() => {
  const results = { totalAdjustment: 0 };
  Object.keys(ppInputs).forEach((key) => {
    const n = ppInputs[key] || 0; // 預設為 0
    const adjustment = 3 * n; // 目前調整值為 3n
    results[key] = {
      pp: n ** 2, // +n²PP
      adjustment,
    };
    results.totalAdjustment += adjustment; // 累加調整值
  });
  return results;
});

// 新增 reactive 狀態以存儲法術列表等級與法術等級
const spellLevels = reactive({
  spellListLevel: null, // 法術列表等級
  spellLevel: null, // 法術等級
});

// 計算相對等級的調整值
const relativeLevelAdjustment = computed(() => {
    // { value: 1, label: "施法者等級＞法術等級的每級 +1" },
    // { value: -5, label: "施法者等級＜法術等級的每級 -5" }
  const { spellListLevel, spellLevel } = spellLevels;
  if (spellListLevel !== null && spellLevel !== null) {
    if (spellListLevel > spellLevel) {
      return (spellListLevel - spellLevel) * 1; // 每級 *1
    } else {
      return (spellLevel - spellListLevel) * -5; // 每級 *-5
    }
  }
  return 0; // 預設為 0
});

// 初始化 selectedValues 和 additionalInputs
onMounted(() => {
  parameterGroups.forEach(group => {
    selectedValues[group.mainKey] = null;
    additionalInputs[group.mainKey] = null;
  });
});

// 計算目前調整值
const adjustmentResults = computed(() => {
  const results = {};
  parameterGroups.forEach(group => {
    if (group.mainKey === "severityAdjustment") {
      // 嚴重度調整的特殊計算
      if (severityAdjustment.initial !== null && severityAdjustment.modified !== null) {
        results[group.mainKey] = severityAdjustment.modified - severityAdjustment.initial;
      } else {
        results[group.mainKey] = null;
      }
    } else {
      const selectedValue = selectedValues[group.mainKey];
      const multiplier = additionalInputs[group.mainKey] || 1; // 默認倍數為 1
      if (selectedValue !== null) {
        results[group.mainKey] = selectedValue * multiplier;
      } else {
        results[group.mainKey] = null;
      }
    }
  });
  return results;
});


// 計算耐力檢定結果
const enduranceCheckResults = computed(() => {

  const selectedValue = selectedValues["castingTime"];

  if (selectedValue !== null) {
    // 修正：訪問 investingTimeParameters[0].options 陣列
    const matchedOption = investingTimeParameters[0].options.find(
      (option) => option.value === selectedValue
    );
    return matchedOption && matchedOption.note
      ? matchedOption.note
      : "無";
  }
  return null;
});

// 計算施法時間的調整值
const castingTimeAdjustment = computed(() => {

  const selectedValue = selectedValues["castingTime"];
  return selectedValue !== undefined ? selectedValue : 0;
});

// 新增 reactive 狀態以存儲法術列表等級與法術等級
const spellKnowledgeLevels = reactive({
  spellListLevel: null, // 法術列表等級
  spellLevel: null, // 法術等級
});

// 計算施法者該法術的列表等級＞法術等級的每級調整值
const spellKnowledgeAdjustment = computed(() => {
  const { spellListLevel, spellLevel } = spellKnowledgeLevels;
  if (spellListLevel !== null && spellLevel !== null) {
    return (spellListLevel - spellLevel) * 1; // 每級 *1
  }
  return 0; // 預設為 0
});

// 新增 reactive 狀態以存儲每個額外法術的數量
const extraSpells = reactive({
  count: null, // 額外法術數量
});

// 計算每個額外法術的調整值
const extraSpellAdjustment = computed(() => {
  const count = extraSpells.count || 0; // 預設為 0
  return count * -25; // 每個額外法術 *-25
});

// 新增 reactive 狀態以存儲吉兆與凶兆的選擇值
const omenSelections = reactive({
  goodOmens: {}, // 吉兆情況
  badOmens: {}, // 凶兆情況
});

// 計算吉兆與凶兆的調整值總計
const omenAdjustment = computed(() => {
  const goodOmenTotal = Object.values(omenSelections.goodOmens).reduce((sum, value) => sum + (value || 0), 0);
  const badOmenTotal = Object.values(omenSelections.badOmens).reduce((sum, value) => sum + (value || 0), 0);
  return goodOmenTotal + badOmenTotal;
});

// 提取 knowledgeOfSpellList 的參數
const knowledgeOfSpellList = ritualModifiersParameters.find(
  (param) => param.mainKey === "knowledgeOfSpellList"
);

const spellListType = ritualModifiersParameters.find(
  (param) => param.mainKey === "spellListType"
);

const PPSources = ritualModifiersParameters.find(
  (param) => param.mainKey === "PPSources"
);

const castingTime = investingTimeParameters.find((param) => param.mainKey === "castingTime");

const bloodinvestment = bloodParameters.find((param) => param.mainKey === "investment");
const bloodcritical = bloodParameters.find((param) => param.mainKey === "critical");

// 計算每個區塊的目前調整值總計
const ritualMagicTotalAdjustment = computed(() => {
  return (
    (relativeLevelAdjustment.value || 0) +
    (selectedValues["knowledgeOfSpellList"] || 0) +
    spellKnowledgeAdjustment.value +
    extraSpellAdjustment.value +
    (selectedValues["spellListType"] || 0) +
    (selectedValues["PPSources"] || 0) +
    omenAdjustment.value
  );
});

const resourceInvestmentTotalAdjustment = computed(() => {
  return (
    (ppResults["extraPP"]?.adjustment || 0) +
    castingTimeAdjustment.value +
    (selectedValues["bloodinvestment"] || 0) +
    (selectedValues["bloodcritical"] || 0)
  );
});

const spellParametersTotalAdjustment = computed(() => {
  return Object.values(adjustmentResults.value).reduce(
    (sum, value) => sum + (value || 0),
    0
  );
});

// 計算最終調整值
const finalAdjustment = computed(() => {
  return (
    ritualMagicTotalAdjustment.value +
    resourceInvestmentTotalAdjustment.value +
    spellParametersTotalAdjustment.value
  );
});

// 複製最終調整值到剪貼簿的函數
const copyFinalAdjustment = async () => {
  try {
    await navigator.clipboard.writeText(finalAdjustment.value.toString());
    message.success("最終調整值已複製到剪貼簿！");
  } catch (err) {
    message.error("複製失敗，請重試！");
  }
};

// 重置所有變數的函數
const resetAllVariables = () => {
  Object.keys(selectedValues).forEach(key => (selectedValues[key] = null));
  Object.keys(additionalInputs).forEach(key => (additionalInputs[key] = null));
  Object.keys(ppInputs).forEach(key => (ppInputs[key] = null));
  Object.keys(omenSelections.goodOmens).forEach(key => (omenSelections.goodOmens[key] = null));
  Object.keys(omenSelections.badOmens).forEach(key => (omenSelections.badOmens[key] = null));
  extraSpells.count = null;
  spellLevels.spellListLevel = null;
  spellLevels.spellLevel = null;
  spellKnowledgeLevels.spellListLevel = null;
  spellKnowledgeLevels.spellLevel = null;
  severityAdjustment.initial = -30;
  severityAdjustment.modified = -30;
  durationAdjustment.initial = "";
  durationAdjustment.modified = "";
};

const getParameterLabel = (key) => {
  const group = parameterGroups.find((group) => group.mainKey === key);
  return group ? group.label : key;
};

const getOptionLabel = (key, value) => {
  // 特殊處理：嚴重度調整
  if (key === "severityAdjustment") {
    const initialLabel = parameterGroups
      .find(group => group.mainKey === key)
      ?.options.find(option => option.value === severityAdjustment.initial)?.label || severityAdjustment.initial;
    const modifiedLabel = parameterGroups
      .find(group => group.mainKey === key)
      ?.options.find(option => option.value === severityAdjustment.modified)?.label || severityAdjustment.modified;
    return `初始嚴重度: ${initialLabel}, 修改嚴重度: ${modifiedLabel}`;
  }

  // 特殊處理：改變持續時間
  if (key === "changeDurationPerLevel") {
    const initialLabel = parameterGroups
      .find(group => group.mainKey === key)
      ?.options.find(option => option.value === durationAdjustment.initial)?.label || durationAdjustment.initial;
    const modifiedLabel = parameterGroups
      .find(group => group.mainKey === key)
      ?.options.find(option => option.value === durationAdjustment.modified)?.label || durationAdjustment.modified;
    return `初始時間: ${initialLabel}, 修改時間: ${modifiedLabel}`;
  }

  // 一般處理
  const group = parameterGroups.find((group) => group.mainKey === key);
  if (group && group.options) {
    const option = group.options.find((option) => option.value === value);
    return option ? option.label : value;
  }
  return value;
};

const copySpellParameters = async () => {
  try {
    const details = Object.entries(selectedValues)
      .map(([key, value]) => {
        const label = getParameterLabel(key);
        const optionLabel = getOptionLabel(key, value);
        const multiplier = additionalInputs[key] ? ` (加倍次數: ${additionalInputs[key]})` : '';
        return `${label}: ${optionLabel}${multiplier}`;
      })
      .join('\n');
    await navigator.clipboard.writeText(details);
    message.success("法術參數調整細節已複製到剪貼簿！");
  } catch (err) {
    message.error("複製失敗，請重試！");
  }
};
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">儀式計算表</h1>

            <!-- 顯示最終調整值 -->
            <div
      class="mb-6 p-4 bg-gray-100 rounded-md shadow cursor-pointer hover:bg-gray-200"
      @click="copyFinalAdjustment"
    >
      <h2 class="text-xl font-bold">
        最終調整值: <span class="text-indigo-600">{{ finalAdjustment }}</span>
      </h2>
      <p class="text-sm text-gray-500">點擊以複製最終調整值</p>
    </div>

    <!-- 顯示最終調整值 -->
    <div
      class="mb-6 p-4 bg-gray-100 rounded-md shadow cursor-pointer hover:bg-gray-200"      
      @click="copySpellParameters"
    >
      <h2 class="text-xl font-bold">
        法術參數調整細節: <span class="text-indigo-600">
          <ul>
            <li v-for="(value, key) in selectedValues" :key="key">
              {{ getParameterLabel(key) }}: {{ getOptionLabel(key, value) }}
              <span v-if="additionalInputs[key]"> (加倍次數: {{ additionalInputs[key] }})</span>
            </li>
          </ul>
        </span>
      </h2>
      <p class="text-sm text-gray-500">點擊以複製法術參數</p>
    </div>



    <div>
      <div ></div>
      <div class="p-2 flex justify-center mb-6">
        <button
        @click="resetAllVariables"
        class="px-4 py-2 bg-red-500 text-white font-semibold rounded-md shadow hover:bg-red-600"
      >
        重置所有變數
      </button>
      </div>
      <div ></div>
    </div>
    <div class="grid grid-cols-3 gap-6 mb-6">
      <!-- 左邊區塊：儀式魔法調整值總計 -->
      <div class="p-2 bg-blue-100 rounded-md shadow">
        <p class="text-lg font-medium">儀式魔法調整值總計: <span class="font-semibold">{{ ritualMagicTotalAdjustment }}</span></p>
      </div>

      <!-- 中間區塊：投資資源調整值總計 -->
      <div class="p-2 bg-green-100 rounded-md shadow">
        <p class="text-lg font-medium">投資資源調整值總計: <span class="font-semibold">{{ resourceInvestmentTotalAdjustment }}</span></p>
      </div>

      <!-- 右邊區塊：法術參數調整值總計 -->
      <div class="p-2 bg-yellow-100 rounded-md shadow">
        <p class="text-lg font-medium">法術參數調整值總計: <span class="font-semibold">{{ spellParametersTotalAdjustment }}</span></p>
      </div>
    </div>

    <!-- 使用 grid 切割畫面為三個區塊 -->
    <div class="grid grid-cols-3 gap-6">
      <!-- 左邊區塊：儀式魔法調整值 -->
      <div class="bg-blue-50 p-4 rounded-md shadow">
        <h2 class="text-2xl font-bold mb-4">儀式魔法</h2>
        <form class="space-y-6">
          <!-- 顯示相對等級輸入框與計算結果 -->
          <div class="mb-6">
            <label class="block text-lg font-medium text-gray-700 mb-2">相對等級計算；目前調整值: <span class="font-semibold">{{ relativeLevelAdjustment }}</span></label> 
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="spell-list-level" class="block text-sm font-medium text-gray-700">法術列表等級</label>
                <input
                  type="number"
                  id="spell-list-level"
                  v-model="spellLevels.spellListLevel"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="輸入法術列表等級"
                />
              </div>
              <div>
                <label for="spell-level" class="block text-sm font-medium text-gray-700">法術等級</label>
                <input
                  type="number"
                  id="spell-level"
                  v-model="spellLevels.spellLevel"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="輸入法術等級"
                />
              </div>
            </div>
            <div class="mt-4">
                <p class="text-sm text-gray-700">
                目前算法: <span class="font-semibold">{{ (relativeLevelAdjustment>0)?"施法者等級＞法術等級的每級 +1":"施法者等級＜法術等級的每級 -5" }}</span>
              </p>
            </div>
          </div>

          <!-- 顯示法術列表知識 -->
          <div class="mb-6">
            <label for="knowledge-of-spell-list" class="block text-lg font-medium text-gray-700 mb-2">
              法術列表知識；目前調整值: <span class="font-semibold">{{ selectedValues['knowledgeOfSpellList'] || 0 }}</span>
            </label>
            <select
              id="knowledge-of-spell-list"
              v-model="selectedValues['knowledgeOfSpellList']"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option :value="null" disabled>請選擇</option>
              <option
                v-for="(option, optionIndex) in knowledgeOfSpellList.options"
                :key="optionIndex"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
          <!-- 施法者該法術的列表等級＞法術等級的每級 -->
          <div class="mb-6">
            <label class="block text-lg font-medium text-gray-700 mb-2">施法者該法術的列表等級＞法術等級的每級 +1；目前調整值: <span class="font-semibold">{{ spellKnowledgeAdjustment }}</span></label>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="spell-list-level-knowledge" class="block text-sm font-medium text-gray-700">法術列表等級</label>
                <input
                  type="number"
                  id="spell-list-level-knowledge"
                  v-model="spellKnowledgeLevels.spellListLevel"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="輸入法術列表等級"
                />
              </div>
              <div>
                <label for="spell-level-knowledge" class="block text-sm font-medium text-gray-700">法術等級</label>
                <input
                  type="number"
                  id="spell-level-knowledge"
                  v-model="spellKnowledgeLevels.spellLevel"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="輸入法術等級"
                />
              </div>
            </div>
          </div>

          <!-- 每個額外法術 -->
          <div class="mb-6">
            <label for="extra-spells" class="block text-lg font-medium text-gray-700 mb-2">每個額外法術 -25；目前調整值: <span class="font-semibold">{{ extraSpellAdjustment }}</span></label>
            <input
              type="number"
              id="extra-spells"
              v-model="extraSpells.count"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="輸入額外法術數量"
            />
          </div>
          <!-- 顯示法術列表類型 -->
          <div class="mb-6">
            <label for="spell-list-type" class="block text-lg font-medium text-gray-700 mb-2">
                法術列表類型；目前調整值: <span class="font-semibold">{{ selectedValues['spellListType'] || 0 }}</span>
            </label>
            <select
              id="spell-list-type"
              v-model="selectedValues['spellListType']"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option :value="null" disabled>請選擇</option>
              <option
                v-for="(option, optionIndex) in spellListType.options"
                :key="optionIndex"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>  
          <!-- 顯示PP來源 -->
          <div class="mb-6">
            <label for="PP-Sources" class="block text-lg font-medium text-gray-700 mb-2">
                PP來源；目前調整值: <span class="font-semibold">{{ selectedValues['PPSources'] || 0 }}</span>
            </label>
            <select
              id="PP-Sources"
              v-model="selectedValues['PPSources']"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option :value="null" disabled>請選擇</option>
              <option
                v-for="(option, optionIndex) in PPSources.options"
                :key="optionIndex"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
            <div class="mt-4">
              <p class="text-sm text-gray-700">
                
              </p>
            </div>
          </div>            
          
          <!-- 吉兆情況 -->
          <div class="mb-6">
            <h2 class="text-lg font-medium text-gray-700 mb-2">吉兆情況；吉兆與凶兆調整值總計: <span class="font-semibold">{{ omenAdjustment }}</span></h2>
            <div v-for="(label, index) in ['吉兆時辰/日期', '吉兆地點', '正面預言']" :key="'good-omen-' + index" class="mb-4">
              <label :for="'good-omen-' + index" class="block text-sm font-medium text-gray-700">{{ label }}</label>
              <select
                :id="'good-omen-' + index"
                v-model="omenSelections.goodOmens[index]"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option :value="null" disabled>請選擇</option>
                <option v-for="value in [0, 5,10,15, 20,25]" :key="'good-omen-' + index + '-' + value" :value="value">
                  {{ value }}
                </option>
              </select>
            </div>
          </div>

          <!-- 凶兆情況 -->
          <div class="mb-6">
            <h2 class="text-lg font-medium text-gray-700 mb-2">凶兆情況</h2>
            <div v-for="(label, index) in ['凶兆時辰/日期', '凶兆地點', '負面預言']" :key="'bad-omen-' + index" class="mb-4">
              <label :for="'bad-omen-' + index" class="block text-sm font-medium text-gray-700">{{ label }}</label>
              <select
                :id="'bad-omen-' + index"
                v-model="omenSelections.badOmens[index]"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option :value="null" disabled>請選擇</option>
                <option v-for="value in [0,-5, -10,-15, -20,-25]" :key="'bad-omen-' + index + '-' + value" :value="value">
                  {{ value }}
                </option>
              </select>
            </div>
          </div>
        </form>

      </div>

      <!-- 中間區塊：投資資源 -->
      <div class="bg-green-50 p-4 rounded-md shadow">
        <h2 class="text-2xl font-bold mb-4">投資資源</h2>
        <form class="space-y-6">
          <!-- 顯示額外PP輸入框與計算結果 -->
          <div class="mb-6">
            <label for="extra-pp-input" class="block text-lg font-medium text-gray-700 mb-2">
              額外PP計算；目前調整值: <span class="font-semibold">{{ ppResults['extraPP']?.adjustment || 0 }}</span>
            </label>
            <input
              type="number"
              id="extra-pp-input"
              v-model="ppInputs['extraPP']"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="輸入 n 的值"
            />
            <div class="mt-4">
              <p class="text-sm text-gray-700">
                投資PP數: <span class="font-semibold">{{ ppResults['extraPP']?.pp || 0 }}</span>
              </p>
            </div>
          </div>

          <!-- 顯示施法時間 -->
          <div class="mb-6">
            <label for="casting-Time" class="block text-lg font-medium text-gray-700 mb-2">
                施法時間；目前調整值: <span class="font-semibold">{{ castingTimeAdjustment }}</span>
            </label>
            <select
              id="knowledge-of-spell-list"
              v-model="selectedValues['castingTime']"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option :value="null" disabled>請選擇</option>
              <option
                v-for="(option, optionIndex) in castingTime.options"
                :key="optionIndex"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
            <div class="mt-4">
              <p class="text-sm text-gray-700">
                          <!-- 顯示耐力檢定結果 -->
              <div v-if="enduranceCheckResults" class="mt-4">
                <p class="text-sm text-gray-700">
                  耐力檢定: 
                  <span class="font-semibold">{{ enduranceCheckResults }}</span>
                </p>
              </div>
              </p>
            </div>
          </div>

          <!-- 顯示獻血 -->
          <div class="mb-6">
            <label for="blood-investment" class="block text-lg font-medium text-gray-700 mb-2">
                獻血；目前調整值: <span class="font-semibold">{{ selectedValues['bloodinvestment'] || 0 }}</span>
            </label>
            <select
              id="blood-investment"
              v-model="selectedValues['bloodinvestment']"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option :value="null" disabled>請選擇</option>
              <option
                v-for="(option, optionIndex) in bloodinvestment.options"
                :key="optionIndex"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
            <div class="mt-4">
              <p class="text-sm text-gray-700">
                
              </p>
            </div>
          </div>
          <!-- 顯示承受重擊 -->
          <div class="mb-6">
            <label for="blood-critical" class="block text-lg font-medium text-gray-700 mb-2">
                承受重擊；目前調整值: <span class="font-semibold">{{ selectedValues['bloodcritical'] || 0 }}</span>
            </label>
            <select
              id="blood-critical"
              v-model="selectedValues['bloodcritical']"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option :value="null" disabled>請選擇</option>
              <option
                v-for="(option, optionIndex) in bloodcritical.options"
                :key="optionIndex"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
        </form>

      </div>

      <!-- 右邊區塊：法術參數 -->
      <div class="bg-yellow-50 p-4 rounded-md shadow">
        <h2 class="text-2xl font-bold mb-4">法術參數</h2>
        <form class="space-y-6">
          <div v-for="(parameterGroup, groupIndex) in parameterGroups" :key="groupIndex" class="mb-6">
            <template v-if="parameterGroup.mainKey === 'severityAdjustment'">
              <label class="block text-lg font-medium text-gray-700 mb-2">嚴重度調整；目前調整值: <span class="font-semibold">{{ adjustmentResults[parameterGroup.mainKey] }}</span></label>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label for="severity-initial" class="block text-sm font-medium text-gray-700">初始嚴重度</label>
                  <select
                    id="severity-initial"
                    v-model="severityAdjustment.initial"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option :value="null" disabled>請選擇</option>
                    <option
                      v-for="(option, optionIndex) in parameterGroup.options"
                      :key="'initial-' + optionIndex"
                      :value="option.value"
                      :disabled="option.value <= severityAdjustment.modified"
                    >
                      {{ option.label }}
                    </option>
                  </select>
                </div>
                <div>
                  <label for="severity-modified" class="block text-sm font-medium text-gray-700">修改嚴重度</label>
                  <select
                    id="severity-modified"
                    v-model="severityAdjustment.modified"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option :value="null" disabled>請選擇</option>
                    <option v-for="(option, optionIndex) in parameterGroup.options" :key="'modified-' + optionIndex" :value="option.value">
                      {{ option.label }}
                    </option>
                  </select>
                </div>
              </div>
            </template>
            <template v-else-if="parameterGroup.mainKey === 'changeDurationPerLevel'">
              <label class="block text-lg font-medium text-gray-700 mb-2">改變持續時間；目前調整值: <span class="font-semibold">{{ durationAdjustment.modified - durationAdjustment.initial }}</span></label>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label for="duration-initial" class="block text-sm font-medium text-gray-700">初始時間</label>
                  <select
                    id="duration-initial"
                    v-model="durationAdjustment.initial"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option :value="null" disabled>請選擇</option>
                    <option
                      v-for="(option, optionIndex) in parameterGroup.options"
                      :key="'initial-' + optionIndex"
                      :value="option.value"
                      :disabled="option.value <= durationAdjustment.modified"
                    >
                      {{ option.label }}
                    </option>
                  </select>
                </div>
                <div>
                  <label for="duration-modified" class="block text-sm font-medium text-gray-700">修改時間</label>
                  <select
                    id="duration-modified"
                    v-model="durationAdjustment.modified"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option :value="null" disabled>請選擇</option>
                    <option v-for="(option, optionIndex) in parameterGroup.options" :key="'modified-' + optionIndex" :value="option.value">
                      {{ option.label }}
                    </option>
                  </select>
                </div>
              </div>
            </template>
            <template v-else>
              <label :for="parameterGroup.mainKey" class="block text-lg font-medium text-gray-700 mb-2">
                {{ parameterGroup.label }}；目前調整值: <span class="font-semibold">{{ adjustmentResults[parameterGroup.mainKey] }}</span>
              </label>
              <select
                :id="parameterGroup.mainKey"
                v-model="selectedValues[parameterGroup.mainKey]"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option :value="null" disabled>請選擇</option>
                <option v-for="(option, optionIndex) in parameterGroup.options" :key="optionIndex" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
              <!-- 僅在選項的 label 包含「每次」時顯示輸入框 -->
              <div
                v-if="selectedValues[parameterGroup.mainKey] !== null && parameterGroup.options.some(option => option.label.includes('每次') && option.value === selectedValues[parameterGroup.mainKey])"
                class="mt-4"
              >
                <label :for="parameterGroup.mainKey + '-input'" class="block text-sm font-medium text-gray-700">
                  請輸入加倍次數
                </label>
                <input
                  type="number"
                  :id="parameterGroup.mainKey + '-input'"
                  v-model="additionalInputs[parameterGroup.mainKey]"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="輸入次數"
                />
              </div>

            </template>
          </div>
        </form>

      </div>
    </div>
  </div>
</template>

<style>
/* Tailwind CSS 已經內建樣式，無需額外定義 */
</style>