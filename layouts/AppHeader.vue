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
        <a-sub-menu key="weapons">
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