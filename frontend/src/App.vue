<template>
  <div class="min-h-screen bg-gray-100">
    <div
      :class="[
        'transition-transform duration-300 ease-in-out',
        isSidebarOpen ? 'translate-x-64' : 'translate-x-0'
      ]"
    >
      <Nav v-if="showNav" @toggleSidebar="toggleSidebar" />
      <router-view />
    </div>
    <Sidebar :isOpen="isSidebarOpen" @toggle="toggleSidebar" />
  </div>
</template>


<script setup>
defineOptions({
  name: 'App'
})

// Input components
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import Nav from './components/Nav.vue';
import Sidebar from './components/Sidebar.vue';

const route = useRoute();
const showNav = computed(() =>
  ['/lobby'].includes(route.path)
);
const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
  console.log('App: Sidebar is now', isSidebarOpen.value ? 'open' : 'closed');
};
</script>

<style>
/* App.vue 组件内部的样式 */
/* 为了在组件内部使用 @apply，Tailwind v4 推荐使用 @reference */
/* 如果你的全局 style.css 有自定义的 @theme，你可能需要引用它，例如 @reference "./style.css"; */
/* 如果只是用 Tailwind 默认的原子类，可以直接引用 "tailwindcss" */
@reference "tailwindcss";

.component-btn {
  @apply bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-150;
  /* 紫色背景，白色文字，圆角，阴影等 */
}

/* 你也可以在这里直接使用 Tailwind 原子类，它们应该总是有效的 */
.direct-tailwind-class {
  @apply text-blue-700; /* 示例：给 h1 附加额外的原子类 */
}
</style>
