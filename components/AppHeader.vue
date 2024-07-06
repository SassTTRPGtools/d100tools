<template>
  <nav class="bg-white shadow-md">
    <div class="max-w-6xl mx-auto px-4">
      <div class="flex justify-between">
        <div class="flex space-x-4">
          <!-- logo -->
          <div>
            <a href="/" class="flex items-center py-5 px-2 text-gray-700 hover:text-gray-900">
              <span class="font-bold">回首頁</span>
            </a>
          </div>
          <!-- primary nav -->
          <div class="hidden md:flex items-center space-x-1">
            <a href="/character/stat" class="py-5 px-3 text-gray-700 hover:text-gray-900">角色創建</a>
            <a href="#" class="py-5 px-3 text-gray-700 hover:text-gray-900">Careers</a>
            <a href="#" class="py-5 px-3 text-gray-700 hover:text-gray-900">Blog</a>
            <a href="#" class="py-5 px-3 text-gray-700 hover:text-gray-900">Contact Us</a>
          </div>
        </div>
        <!-- mobile button goes here -->
        <div class="md:hidden flex items-center">
          <button @click="isOpen = !isOpen" class="md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                 stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <!-- mobile menu -->
    <div class="md:hidden" :class="isOpen ? 'block' : 'hidden'">
      <a href="/character/stat" class="block py-2 px-4 text-sm hover:bg-gray-200">角色創建</a>
      <a href="#" class="block py-2 px-4 text-sm hover:bg-gray-200">Careers</a>
      <a href="#" class="block py-2 px-4 text-sm hover:bg-gray-200">Blog</a>
      <a href="#" class="block py-2 px-4 text-sm hover:bg-gray-200">Contact Us</a>
    </div>
  </nav>
</template>
<script>
export default {
  data() {
    return {
      isOpen: false,
    }
  },
  methods: {
  },
  mounted() {
  }
}
</script>