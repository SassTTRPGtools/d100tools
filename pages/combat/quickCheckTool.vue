<script setup>
import { ref, computed } from 'vue';
import { message } from 'ant-design-vue';
import { atkTables, atkOptions, atkSizeTables } from '@/rolemaster/utils/attackTables.js';
import { critTables, critSeverityOptions, critKeyMapping, hitLocationMapping } from '@/rolemaster/utils/critTables.js';

const selectedCategory = ref(atkOptions[0].category);
const selectedSubCategory = ref(atkOptions[0].options[0].value);
const selectedAttackerSize = ref('Medium');
const selectedTargetSize = ref('Medium');
const selectedATValue = ref(1);
const attackRoll = ref('');
const critResult = ref('');

const subCategories = computed(() => {
  const category = atkOptions.find(option => option.category === selectedCategory.value);
  return category ? category.options : [];
});

const tableData = ref([]);

// 計算 selectedAttackerSize 與 selectedTargetSize 之間的差值
const sizeDifference = computed(() => {
  const attackerSizeAdjustment = atkSizeTables[selectedAttackerSize.value].sizeAdjustment;
  const targetSizeAdjustment = atkSizeTables[selectedTargetSize.value].sizeAdjustment;
  return attackerSizeAdjustment - targetSizeAdjustment;
});

// 計算 multiplier
const multiplier = computed(() => {
  const baseSize = 'Medium';
  const baseIndex = Object.keys(atkSizeTables).indexOf(baseSize);
  let newIndex = baseIndex + sizeDifference.value;

  if (newIndex < 0) {
    newIndex = 0;
  } else if (newIndex >= Object.keys(atkSizeTables).length) {
    newIndex = Object.keys(atkSizeTables).length - 1;
  }

  const newSize = Object.keys(atkSizeTables)[newIndex];
  return atkSizeTables[newSize].multiplier;
});

const getAttackOutcome = (attackType, atValue, attackRoll) => {
  const table = atkTables[attackType];
  if (!table) return '無效的攻擊類型';

  const ranges = Object.keys(table[atValue]).map(range => range.split('-').map(Number));
  const minRange = Math.min(...ranges.map(range => range[0]));
  const maxRange = Math.max(...ranges.map(range => range[1]));

  if (attackRoll < minRange) attackRoll = minRange;
  if (attackRoll > maxRange) attackRoll = maxRange;

  const row = Object.entries(table[atValue]).find(([range]) => {
    const [min, max] = range.split('-').map(Number);
    return min <= attackRoll && max >= attackRoll;
  });

  if (!row) return '無結果';

  const severityMap = critSeverityOptions.map(option => option.value);
  const sizeAdjustment = sizeDifference.value;

  let description = row[1];
  let numericValue = parseFloat(description);
  const newValue = Math.ceil(numericValue * multiplier.value);

  description = description.replace(numericValue, newValue);

  let descriptionLetter = description.slice(-2, -1);
  let currentlyIndex = severityMap.indexOf(descriptionLetter);
  let newIndex = severityMap.indexOf(descriptionLetter);

  newIndex += sizeAdjustment;

  if (newIndex < 0) {
    newIndex = 0;
  } else if (newIndex > 10) {
    newIndex = 10;
  }

  return description.replace(severityMap[currentlyIndex], severityMap[newIndex]);
};

const getCritOutcome = (critResult, attackOutcome) => {
  if (!isNaN(attackOutcome)) return '無重擊結果';

  const critType = attackOutcome.slice(-2, -1);
  const critTableKey = attackOutcome.slice(-1);
  const critTable = critKeyMapping[critTableKey];

  if (!critTable) return '無效的重擊表';

  const severityLevels = critSeverityOptions.find(option => option.value === critType).label.split('+');
  const critOutcomes = severityLevels.map(level => {
    (level === 'Z')? level = 'A': level;
    let critData = critTable[level];
    let critRow = critData.find(row => row.min <= critResult && row.max >= critResult);

    // 當 critType 是 Z 時，根據 hitLocationMapping 的結果來取更差的結果
    if (critType === 'Z' && critRow) {
      const location = Object.entries(hitLocationMapping).find(([range]) => {
        const [min, max] = range.split('-').map(Number);
        return min <= critResult && max >= critResult;
      })?.[1];

      if (location) {
        const worseCritResult = Object.keys(hitLocationMapping).reverse().find(key => {
          const [min, max] = key.split('-').map(Number);
          return hitLocationMapping[key] === location && max < critResult;
        });

        if (worseCritResult) {
          const originalCritRow = critRow;
          critRow = critData.find(row => {
            const [min, max] = worseCritResult.split('-').map(Number);
            return row.min <= max && row.max >= min;
          });

          if (critRow) {
            return `${level} (修改為: ${worseCritResult}): ${critRow.description} `;
          }
        }
      }
    }

    return critRow ? `${level}: ${critRow.description}` : `${level}: 無結果`;
  });

  return critOutcomes.join('🔷');
};

const addRow = () => {
  if (!attackRoll.value || !critResult.value) {
    message.warning('攻擊值和重擊值為必填項目');
    return;
  }

  const attackOutcome = getAttackOutcome(selectedSubCategory.value, selectedATValue.value, parseInt(attackRoll.value, 10));
  const critOutcome = getCritOutcome(parseInt(critResult.value, 10), attackOutcome);

  const sizeDifferenceText = sizeDifference.value < 0
    ? `大 ${Math.abs(sizeDifference.value)} 級`
    : `小 ${sizeDifference.value} 級`;

  const newRow = {
    attackType: subCategories.value.find(option => option.value === selectedSubCategory.value).label,
    attackerSize: atkSizeTables[selectedAttackerSize.value].label,
    atValue: selectedATValue.value,
    targetSize: atkSizeTables[selectedTargetSize.value].label,
    sizeDifferenceText: sizeDifferenceText,
    attackRoll: attackRoll.value,
    critResult: critResult.value,
    attackOutcome: attackOutcome,
    critOutcome: critOutcome
  };
  tableData.value.unshift(newRow); // 新增結果在最前面
};

const clearData = () => {
  tableData.value = [];
};
</script>

<template>
  <div class="container">
    <div class="controls-container">
        <div class="select-group">
        <a-select v-model:value="selectedCategory" style="width: 200px" @change="selectedSubCategory = subCategories.value[0].value">
          <a-select-option v-for="option in atkOptions" :key="option.category" :value="option.category">
            {{ option.category }}
          </a-select-option>
        </a-select>
        <div class="button-group">
          <a-button
            v-for="option in subCategories"
            :key="option.value"
            :type="selectedSubCategory === option.value ? 'primary' : 'default'"
            @click="selectedSubCategory = option.value" style="margin-left: 10px"
          >
            {{ option.label }}
          </a-button>
        </div>
      </div>
      <div class="select-group">
        <a-select v-model:value="selectedAttackerSize" style="width: 200px">
          <a-select-option v-for="(size, key) in atkSizeTables" :key="key" :value="key">
            {{ size.label }}
          </a-select-option>
        </a-select>
        <a-select v-model:value="selectedATValue" style="width: 200px">
          <a-select-option v-for="n in 10" :key="n" :value="n">
            {{ n }}
          </a-select-option>
        </a-select>
        <a-select v-model:value="selectedTargetSize" style="width: 200px">
          <a-select-option v-for="(size, key) in atkSizeTables" :key="key" :value="key">
            {{ size.label }}
          </a-select-option>
        </a-select>
      </div>
      <div class="input-group">
        <a-input v-model:value="attackRoll" placeholder="攻擊值" style="width: 200px" required />
        <a-input v-model:value="critResult" placeholder="重擊值" style="width: 200px" required />
        <a-button type="primary" @click="addRow">確定</a-button>
        <a-button type="danger" @click="clearData">清空</a-button>
      </div>
    </div>

    <a-card class="info-card">
      ✊+X : X 傷害, 🩸X: 流血 X /輪, 💦 (-X): 疲勞減值, 🛠️ (-X): 損壞檢定, -X: 受傷減值, X 💫 [-xx]: 眩暈 X 輪及減值[-xx], 😵: 失衡, 🌊 X’: 擊退, 👎: 擊倒/伏地, 🕸️: 擒拿 X%, ✴️(X): 額外重擊, 💀: 目標瀕死或被擊敗
    </a-card>
    <div class="table-container">
      <a-table :dataSource="tableData" :columns="[
        { title: '攻擊', dataIndex: 'attackType', key: 'attackType', width: 120 },
        { title: '攻擊者', dataIndex: 'attackerSize', key: 'attackerSize', width: 80  },
        { title: 'AT', dataIndex: 'atValue', key: 'atValue' , width: 80 },
        { title: '目標', dataIndex: 'targetSize', key: 'targetSize' , width: 80 },
        { title: '兩者差距', dataIndex: 'sizeDifferenceText', key: 'sizeDifferenceText' , width: 120 },
        { title: '攻擊值', dataIndex: 'attackRoll', key: 'attackRoll', width: 80  },
        { title: '重擊值', dataIndex: 'critResult', key: 'critResult', width: 80  },
        { title: '攻擊結果', dataIndex: 'attackOutcome', key: 'attackOutcome' , width: 100 },
        { title: '重擊結果', dataIndex: 'critOutcome', key: 'critOutcome', scopedSlots: { customRender: 'critOutcome' } }
      ]" rowKey="attackType" :pagination="false" bordered>
        <template #critOutcome="{ text }">
          <div v-html="text"></div>
        </template>
      </a-table>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20px;
}

.controls-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 20px;
}

.select-group, .input-group {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.table-container {
  width: 100%;
}

.ant-table th,
.ant-table td {
  text-align: center;
}

.info-card {
  margin-bottom: 20px;
  text-align: center;
}
</style>