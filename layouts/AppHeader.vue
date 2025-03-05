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