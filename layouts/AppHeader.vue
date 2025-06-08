<script setup>
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
const drawerVisible = ref(false)
const openDrawer = () => { drawerVisible.value = true }
const closeDrawer = () => { drawerVisible.value = false }

const menuItems = [
  { key: 'index', title: '回首頁', link: '/' },
  { key: 'character', title: '角色創建', link: '/character/stat' },
  {
    key: 'combat', title: '戰鬥', children: [
      { key: 'combat-tool', title: '戰鬥快查工具', link: '/combat/quickCheckTool' },
      { key: 'attack', title: '攻擊表', link: '/combat/attack' },
      { key: 'critical', title: '重擊表', link: '/combat/critical' },
      {
        key: 'combat-sheet', title: '紀錄表', children: [
          { key: 'sheet-wound', title: '傷勢紀錄表', link: '/combat/wound' },
          { key: 'sheet-cure', title: '治療傷勢表', link: '/combat/cure' },
        ]
      }
    ]
  },
  {
    key: 'fumbles', title: '犯蠢表格', children: [
      { key: 'fumble', title: '戰鬥犯蠢表', link: '/fumble/fumble' },
      { key: 'spellfumble', title: '法術犯蠢表', link: '/fumble/spellfumble' },
      { key: 'alchemicalfumble', title: '煉金犯蠢表', link: '/fumble/alchemicalfumble' },
    ]
  },
  {
    key: 'spell', title: '法術', children: [
      { key: 'spell-tool', title: '法術快查工具', link: '/spell/quickCheckTool' },
      { key: 'spell-list', title: '法術查詢', link: '/spell/spellList' },
      { key: 'spell-ritual', title: '儀式計算表', link: '/spell/ritualTool' },
    ]
  },
  {
    key: 'treasure', title: '寶藏法則', children: [
      { key: 'treasure-craft', title: '煉金製作表', link: '/treasure/craft' },
      { key: 'treasure-item', title: '冒險裝備', link: '/treasure/item' },
    ]
  },
  {
    key: 'experimental', title: '實驗功能', children: [
      { key: 'sheet-import', title: '角色表導入', link: '/sheet/import' },
    ]
  },
]

// 新增：追蹤選單選中狀態
const route = useRoute()
const selectedKey = ref('index')

function findMenuKeyByPath(path, items = menuItems) {
  // 僅精確比對 path，不允許 /character/stat 匹配 / 這種情況
  for (const item of items) {
    if (item.link === path) return item.key
    if (item.children) {
      const found = findMenuKeyByPath(path, item.children)
      if (found) return found
    }
  }
  return undefined
}

// 初始化與路由變化時自動同步選中
watchEffect(() => {
  const key = findMenuKeyByPath(route.path)
  if (key) selectedKey.value = key
})
</script>
<template>
  <div>
    <!-- 手機漢堡按鈕 -->
    <a-button class="mobile-menu-btn" type="text" @click="openDrawer">
      <template #icon>
        <span style="font-size: 2rem;">☰</span>
      </template>
    </a-button>
    <!-- 桌機橫向選單 -->
    <a-menu mode="horizontal" class="desktop-menu" :style="{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }" :selectedKeys="[selectedKey]">
      <template v-for="item in menuItems" :key="item.key">
        <template v-if="item.children">
          <a-sub-menu :key="item.key">
            <template #title>
              <span>{{ item.title }}</span>
            </template>
            <template v-for="child in item.children" :key="child.key">
              <template v-if="child.children">
                <a-sub-menu :key="child.key">
                  <template #title>
                    <span>{{ child.title }}</span>
                  </template>
                  <template v-for="sub in child.children" :key="sub.key">
                    <a-menu-item>
                      <NuxtLink :to="sub.link" @click="selectedKey = sub.key">{{ sub.title }}</NuxtLink>
                    </a-menu-item>
                  </template>
                </a-sub-menu>
              </template>
              <template v-else>
                <a-menu-item>
                  <NuxtLink :to="child.link" @click="selectedKey = child.key">{{ child.title }}</NuxtLink>
                </a-menu-item>
              </template>
            </template>
          </a-sub-menu>
        </template>
        <template v-else>
          <a-menu-item>
            <NuxtLink :to="item.link" @click="selectedKey = item.key">{{ item.title }}</NuxtLink>
          </a-menu-item>
        </template>
      </template>
    </a-menu>
    <!-- 手機 Drawer 選單 -->
    <a-drawer v-model:open="drawerVisible" placement="left" width="80vw" :closable="true" @close="closeDrawer" :bodyStyle="{ padding:0 }">
      <a-menu mode="inline" style="border: none;" :selectedKeys="[selectedKey]">
        <template v-for="item in menuItems" :key="item.key">
          <template v-if="item.children">
            <a-sub-menu :key="item.key">
              <template #title>
                <span>{{ item.title }}</span>
              </template>
              <template v-for="child in item.children" :key="child.key">
                <template v-if="child.children">
                  <a-sub-menu :key="child.key">
                    <template #title>
                      <span>{{ child.title }}</span>
                    </template>
                    <template v-for="sub in child.children" :key="sub.key">
                      <a-menu-item>
                        <NuxtLink :to="sub.link" @click="selectedKey = sub.key">{{ sub.title }}</NuxtLink>
                      </a-menu-item>
                    </template>
                  </a-sub-menu>
                </template>
                <template v-else>
                  <a-menu-item>
                    <NuxtLink :to="child.link" @click="selectedKey = child.key">{{ child.title }}</NuxtLink>
                  </a-menu-item>
                </template>
              </template>
            </a-sub-menu>
          </template>
          <template v-else>
            <a-menu-item>
              <NuxtLink :to="item.link" @click="selectedKey = item.key">{{ item.title }}</NuxtLink>
            </a-menu-item>
          </template>
        </template>
      </a-menu>
    </a-drawer>
  </div>
</template>
<style scoped>
.ant-menu {
  padding: 0 24px;
}

.ant-menu-item a {
  color: #333;
}

.ant-menu-item a:hover {
  color: #1890ff;
}
.mobile-menu-btn {
  display: none;
  position: absolute;
  left: 12px;
  top: 10px;
  z-index: 1001;
  background: transparent;
  border: none;
  box-shadow: none;
}
@media (max-width: 600px) {
  .desktop-menu {
    display: none !important;
  }
  .mobile-menu-btn {
    display: block !important;
  }
}
</style>