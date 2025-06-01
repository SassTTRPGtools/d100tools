<script setup>
import { ref, computed } from 'vue';
import { Tabs, Table, Checkbox, message, InputNumber } from 'ant-design-vue';

// 引入 rolemaster\itemdata 的 JSON 資料
import toolsAndEquipment from '@/rolemaster/itemdata/tools_and_equipment.json';
import instruments from '@/rolemaster/itemdata/instruments.json';
import foodItems from '@/rolemaster/itemdata/food_items.json';
import clothingAndAccessories from '@/rolemaster/itemdata/clothing_and_accessories.json';
import weapons from '@/rolemaster/itemdata/weapon.json';
import armor from '@/rolemaster/itemdata/armor.json';

// 整理資料到 Tabs
const itemData = {
  '工具與設備': toolsAndEquipment,
  '樂器': instruments,
  '食物': foodItems,
  '服飾與配件': clothingAndAccessories,
  '武器': weapons,
  '盔甲': armor,
};

const activeTab = ref('工具與設備');
const selectedItems = ref([]);

// 處理勾選事件
const handleCheckboxChange = (record, checked) => {
  if (checked) {
    selectedItems.value.push(record);
  } else {
    selectedItems.value = selectedItems.value.filter(item => item.original !== record.original);
  }
};

// 處理名稱與備註合併
const mergeNameAndNotes = (items) => {
  return items.map(item => {
    if (item.length) {
      return {
        ...item,
        name: `${item.name} / 長度${item.length}' / ${item.notes}`,
      };
    } 
    else if (item.notes) {
      return {
        ...item,
        name: `${item.name} / ${item.notes}`,
      };
    } 
    else {
      return {
        ...item,
        name: item.name,
      };
    }
  });
};

// 合併資料
Object.keys(itemData).forEach(key => {
  itemData[key] = mergeNameAndNotes(itemData[key]);
});

// 新增複製功能
const copySelectedItemsToClipboard = () => {
  const statsText = selectedItems.value
    .map(item => `${item.name}\t${item.quantity}\t${item.price}\t${item.weight}\t${item.threshold}\t${item.strength}`)
    .join('\n'); // 使用 TAB 分隔
  navigator.clipboard.writeText(statsText).then(() => {
    message.success("已複製到剪貼簿，可直接貼到 EXCEL。");
  }).catch(err => {
    console.error("複製失敗:", err);
    message.error("無法複製到剪貼簿，請重試。");
  });
};

// 計算總價格與總重量
const totalPrice = computed(() => {
  // 計算總價格並四捨五入到小數點第五位
  const sum = selectedItems.value.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  return Math.round(sum * 100000) / 100000;
});

const totalWeight = computed(() => {
  return selectedItems.value.reduce((sum, item) => {
    if (typeof item.weight === 'string' && item.weight.includes('%')) {
      return sum; // 忽略重量是字串且包含百分比的項目
    }
    return sum + (item.weight || 0) * (item.quantity || 1);
  }, 0);
});

// 處理數量變更
const handleQuantityChange = (record, value) => {
  const idx = selectedItems.value.findIndex(item => item.original === record.original);
  if (idx !== -1) {
    selectedItems.value[idx].quantity = value;
  }
};

const dungeonExplorerKit = [
  { original: '背包', name: '背包', quantity: 1, price: 0.2, weight: 3, strength: 25 },
  { original: '口糧', name: '口糧', quantity: 7, price: 0.05, weight: 2.6, strength: 0 },
  { original: '火炬', name: "火炬 / 照亮 10'R，6 小時。", quantity: 7, price: 0.003, weight: 1, strength: 35 },
  { original: '輕型撬棍', name: '輕型撬棍', quantity: 1, price: 0.6, weight: 3, strength: 75 },
  { original: '錘子', name: '錘子', quantity: 1, price: 1, weight: 1, strength: 65 },
  { original: '岩釘', name: '岩釘', quantity: 10, price: 0.2, weight: 0.25, strength: 65 },
  { original: '大水袋', name: '大水袋', quantity: 1, price: 0.02, weight: 0.75, strength: 25 },
  { original: '打火石', name: '打火石', quantity: 1, price: 0.1, weight: 0.5, strength: 100 },
  { original: '火鐮袋', name: '火鐮袋', quantity: 1, price: 0.02, weight: 0.25, strength: 60 },
  { original: '標準繩索', name: "標準繩索 / 麻。 50' 長。", quantity: 1, price: 0.4, weight: 5, strength: 25 },
  { original: '10呎長桿', name: '10呎長桿', quantity: 1, price: 0.05, weight: 7, strength: 30 }
];

// 實作 addDungeonExplorerKit 方法
const addDungeonExplorerKit = () => {
  dungeonExplorerKit.forEach(item => {
    if (!selectedItems.value.some(selected => selected.original === item.original)) {
      selectedItems.value.push({ ...item });
    }
  });
};

const explorerKit = [
  { original: '背包', name: '背包', quantity: 1, price: 0.2, weight: 3, strength: 25 },
  { original: '口糧', name: '口糧', quantity: 7, price: 0.05, weight: 2.6, strength: 0 },
  { original: '火炬', name: "火炬 / 照亮 10'R，6 小時。", quantity: 7, price: 0.003, weight: 1, strength: 35 },
  { original: '大水袋', name: '大水袋', quantity: 1, price: 0.02, weight: 0.75, strength: 25 },
  { original: '打火石', name: '打火石', quantity: 1, price: 0.1, weight: 0.5, strength: 100 },
  { original: '火鐮袋', name: '火鐮袋', quantity: 1, price: 0.02, weight: 0.25, strength: 60 },
  { original: '標準繩索', name: "標準繩索 / 麻。 50' 長。", quantity: 1, price: 0.4, weight: 5, strength: 25 },
  { original: '輕睡袋', name: '輕睡袋', quantity: 1, price: 0.2, weight: 5, strength: 50 },
  { original: '烹飪鍋', name: '烹飪鍋', quantity: 1, price: 0.7, weight: 2.5, strength: 80 },
  { original: '金屬碗', name: '金屬碗', quantity: 1, price: 0.2, weight: 1, strength: 65 },
  { original: '湯勺', name: '湯勺', quantity: 1, price: 0.03, weight: 0.5, strength: 20 }
];

// 實作 addExplorerKit 方法
const addExplorerKit = () => {
  explorerKit.forEach(item => {
    if (!selectedItems.value.some(selected => selected.original === item.original)) {
      selectedItems.value.push({ ...item });
    }
  });
};

const thiefKit = [
  { original: '背包', name: '背包', quantity: 1, price: 0.2, weight: 3, strength: 25 },
  { original: '口糧', name: '口糧', quantity: 3, price: 0.05, weight: 2.6, strength: 0 },
  { original: '標準繩索', name: "標準繩索 / 麻。 50' 長。", quantity: 1, price: 0.4, weight: 5, strength: 25 },
  { original: '大水袋', name: '大水袋', quantity: 1, price: 0.02, weight: 0.75, strength: 25 },
  { original: '打火石', name: '打火石', quantity: 1, price: 0.1, weight: 0.5, strength: 100 },
  { original: '火鐮袋', name: '火鐮袋', quantity: 1, price: 0.02, weight: 0.25, strength: 60 },
  { original: '輕型撬棍', name: '輕型撬棍', quantity: 1, price: 0.6, weight: 3, strength: 75 },
  { original: '錘子', name: '錘子', quantity: 1, price: 1, weight: 1, strength: 65 },
  { original: '岩釘', name: '岩釘', quantity: 10, price: 0.2, weight: 0.25, strength: 65 },
  { original: '蠟燭', name: "蠟燭 / 蠟或牛脂。 點燃 10'R ，燃燒 2 小時。", quantity: 5, price: 0.04, weight: 0.25, strength: 30 },
  { original: '油瓶', name: "油瓶 / 包括 1 品脫燈油（相當於 6 小時）。", quantity: 2, price: 0.3, weight: 1, strength: 5 },
  { original: '提燈', name: "提燈 / 光源 25'R。 防風。", quantity: 1, price: 1.2, weight: 1.5, strength: 10 },
  { original: '撬鎖工具', name: '撬鎖工具 / 幾個小工具。', quantity: 1, price: 1, weight: 0.2, strength: 15 }
];

// 實作 addThiefKit 方法
const addThiefKit = () => {
  thiefKit.forEach(item => {
    if (!selectedItems.value.some(selected => selected.original === item.original)) {
      selectedItems.value.push({ ...item });
    }
  });
};

const currentWealth = ref(90);
const remainingWealth = computed(() => {
  return Math.round((currentWealth.value - totalPrice.value) * 1000) / 1000;
});
</script>

<template>
  <div class="flex gap-4 pt-6 px-8">
    <!-- 左邊區塊 -->
    <div class="flex-1">

      <a-tabs v-model:activeKey="activeTab">
        <a-tab-pane v-for="(items, tab) in itemData" :key="tab" :tab="tab">
          <a-table :dataSource="items" rowKey="original" :pagination="false" :scroll="{ y: 700, x: '100%' }">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'checkbox'">
                <a-checkbox
                  :checked="selectedItems.some(item => item.original === record.original)"
                  @change="e => handleCheckboxChange(record, e.target.checked)"
                />
              </template>
            </template>
            <a-table-column title="選擇" key="checkbox" width="7%" />
            <a-table-column title="名稱" dataIndex="name" key="name" width="30%" />
            <a-table-column title="#" dataIndex="quantity" key="quantity" width="5%" />
            <a-table-column title="價格" dataIndex="price" key="price" width="5%" />
            <a-table-column title="重量" dataIndex="weight" key="weight" width="5%" />
            <a-table-column title="犯蠢" dataIndex="threshold" key="threshold" width="5%" />
            <a-table-column title="強度" dataIndex="strength" key="strength" width="5%" />
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </div>

    <!-- 右邊區塊 -->
    <div class="flex-1 pt-4">
      <div class="mt-4">
        <div class="flex justify-between items-center">
          <div>
            <label for="current-wealth">目前財富（銀幣）:</label>
            <a-input-number
              id="current-wealth"
              v-model:value="currentWealth"
              :min="0"
              :max="9999"
              style="width: 100px; margin-left: 8px;"
            />
          </div>
          <div>剩餘財富: {{ remainingWealth }}</div>
        </div>
      </div>
      <div class="mt-4">
        <div class="flex justify-between">
          起始套裝組：
            <a-button type="default" @click="addDungeonExplorerKit">地城探險者套裝</a-button>
            <a-button type="default" @click="addExplorerKit">探索者套裝</a-button>
            <a-button type="default" @click="addThiefKit">竊賊套裝</a-button>
        </div>
      </div>
      <div class="mt-4">
        <div class="flex justify-between">
            <a-button type="primary" @click="copySelectedItemsToClipboard">複製到剪貼簿</a-button>           
          <div>總價格: {{ totalPrice }}</div>
          <div>總重量: {{ totalWeight }}</div>
          <a-button type="primary" danger @click="selectedItems = []">清空全部</a-button>
        </div>
      </div>
      <a-table :dataSource="selectedItems" rowKey="original" :pagination="false" :scroll="{ y: 600, x: '100%' }">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'quantity'">
            <a-input-number
              v-model:value="record.quantity"
              :min="0"
              :max="9999"
              style="width: 80px"
              @change="val => handleQuantityChange(record, val)"
            />
          </template>
          <template v-if="column.key === 'action'">
            <a-button type="text" danger @click="selectedItems = selectedItems.filter(item => item.original !== record.original)">✕</a-button>
          </template>
        </template>
            
            <a-table-column title="名稱" dataIndex="name" key="name" width="30%" />
            <a-table-column title="#" dataIndex="quantity" key="quantity" width="10%" />
            <a-table-column title="價格" dataIndex="price" key="price" width="5%" />
            <a-table-column title="重量" dataIndex="weight" key="weight" width="5%" />
            <a-table-column title="犯蠢" dataIndex="threshold" key="threshold" width="5%" />
            <a-table-column title="強度" dataIndex="strength" key="strength" width="5%" />
        <a-table-column title="操作" key="action" width="7%" />
      </a-table>
    </div>
  </div>
</template>