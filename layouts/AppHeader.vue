<script setup>

</script>
<template>
  <div>
    <a-menu mode="horizontal" :style="{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }">
      <a-menu-item key="index">
        <NuxtLink to="/">回首頁</NuxtLink>
      </a-menu-item>
      <a-menu-item key="character">
        <NuxtLink to="/character/stat">角色創建</NuxtLink>
      </a-menu-item>
      <a-sub-menu key="combat">
        <template #title>
          <span>戰鬥</span>
        </template>
        <a-menu-item key="combat-tool">
        <NuxtLink to="/combat/quickCheckTool">戰鬥快查工具</NuxtLink>
      </a-menu-item>

        <a-sub-menu key="combat-table">
          <template #title>
            <span>相關表格</span>
          </template>
          <a-menu-item key="fumble">
            <NuxtLink to="/combat/fumble">犯蠢表</NuxtLink>
          </a-menu-item>
          <a-menu-item key="critical">
            <NuxtLink to="/combat/critical">重擊</NuxtLink>
          </a-menu-item>
          <a-menu-item key="attack">
            <NuxtLink to="/combat/attack">攻擊</NuxtLink>
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="combat-sheet">
          <template #title>
            <span>紀錄表</span>
          </template>
          <a-menu-item key="sheet-wound">
        <NuxtLink to="/combat/wound">傷勢紀錄表</NuxtLink>
      </a-menu-item>
      <a-menu-item key="sheet-cure">
        <NuxtLink to="/combat/cure">治療傷勢表</NuxtLink>
      </a-menu-item>
        </a-sub-menu>
      </a-sub-menu>
      <a-sub-menu key="spell">
        <template #title>
          <span>法術</span>
        </template>
        <a-menu-item key="spell-tool">
          <NuxtLink to="/spell/quickCheckTool">法術快查工具</NuxtLink>
        </a-menu-item>
        <a-menu-item key="spell-list">
          <NuxtLink to="/spell/spellList">法術查詢</NuxtLink>
        </a-menu-item>
        <a-menu-item key="spell-ritual">
          <NuxtLink to="/spell/ritualTool">儀式計算表</NuxtLink>
        </a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="treasure">
        <template #title>
          <span>寶藏法則</span>
        </template>
        <a-menu-item key="treasure-craft">
          <NuxtLink to="/treasure/craft">煉金製作表</NuxtLink>
        </a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="experimental">
        <template #title>
          <span>實驗功能</span>
        </template>

        <a-menu-item key="sheet-import">
        <NuxtLink to="/sheet/import">角色表導入</NuxtLink>
      </a-menu-item>

      </a-sub-menu>

    </a-menu>
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
</style>