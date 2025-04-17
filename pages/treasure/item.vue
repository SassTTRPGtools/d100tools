<script setup>
import { ref, computed } from 'vue';
import { Tabs, Table, Checkbox, message } from 'ant-design-vue';

// 引入 rolemaster\itemdata 的 JSON 資料
import toolsAndEquipment from '@/rolemaster/itemdata/tools_and_equipment.json';
import instruments from '@/rolemaster/itemdata/instruments.json';
import foodItems from '@/rolemaster/itemdata/food_items.json';
import clothingAndAccessories from '@/rolemaster/itemdata/clothing_and_accessories.json';
import weapons from '@/rolemaster/itemdata/weapon.json';

// 整理資料到 Tabs
const itemData = {
  '工具與設備': toolsAndEquipment,
  '樂器': instruments,
  '食物': foodItems,
  '服飾與配件': clothingAndAccessories,
  '武器': weapons,
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
  return items.map(item => ({
    ...item,
    name: item.notes ? `${item.name} / ${item.notes}` : item.name,
  }));
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
  return selectedItems.value.reduce((sum, item) => sum + (item.price || 0), 0);
});

const totalWeight = computed(() => {
  return selectedItems.value.reduce((sum, item) => sum + (item.weight || 0), 0);
});
</script>

<template>
  <div class="flex gap-4 pt-6 px-8">
    <!-- 左邊區塊 -->
    <div class="flex-1">

      <a-tabs v-model:activeKey="activeTab">
        <a-tab-pane v-for="(items, tab) in itemData" :key="tab" :tab="tab">
          <a-table :dataSource="items" rowKey="original" :pagination="false">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'checkbox'">
                <a-checkbox
                  :checked="selectedItems.some(item => item.original === record.original)"
                  @change="e => handleCheckboxChange(record, e.target.checked)"
                />
              </template>
            </template>
            <a-table-column title="選擇" key="checkbox" width="80" />
            <a-table-column title="名稱" dataIndex="name" key="name" width="150" />
            <a-table-column title="#" dataIndex="quantity" key="quantity" width="100" />
            <a-table-column title="價格" dataIndex="price" key="price" width="100" />
            <a-table-column title="重量" dataIndex="weight" key="weight" width="100" />
            <a-table-column title="犯蠢閾值" dataIndex="threshold" key="threshold" width="120" />
            <a-table-column title="強度" dataIndex="strength" key="strength" width="100" />
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </div>

    <!-- 右邊區塊 -->
    <div class="flex-1 pt-4">
      <div class="mt-4">       
        <div class="flex justify-between">
            <a-button type="primary" @click="copySelectedItemsToClipboard">複製到剪貼簿</a-button>
          <div>總價格: {{ totalPrice }}</div>
          <div>總重量: {{ totalWeight }}</div>
        </div>
      </div>
      <a-table :dataSource="selectedItems" rowKey="original" :pagination="false">
        <a-table-column title="名稱" dataIndex="name" key="name" width="150" />
        <a-table-column title="#" dataIndex="quantity" key="quantity" width="100" />
        <a-table-column title="價格" dataIndex="price" key="price" width="100" />
        <a-table-column title="重量" dataIndex="weight" key="weight" width="100" />
        <a-table-column title="犯蠢閾值" dataIndex="threshold" key="threshold" width="120" />
        <a-table-column title="強度" dataIndex="strength" key="strength" width="100" />
      </a-table>

    </div>
  </div>
</template>