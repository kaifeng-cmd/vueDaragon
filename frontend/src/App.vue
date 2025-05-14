<template>
  <div id="app" class="p-8">
    <h1 class="text-2xl font-bold mb-4 direct-tailwind-class">直接使用 Tailwind 原子类</h1>
    <p class="mb-6">这个标题应该有 Tailwind 的样式（例如，字体大小、粗细、下边距）。</p>

    <h2 class="text-xl font-semibold mb-2">测试来自 style.css 的全局 @apply 类：</h2>
    <button class="global-btn">全局按钮 (来自 style.css)</button>
    <p class="mt-2 text-sm text-gray-600">
      这个按钮的样式应该由 <code>src/style.css</code> 中的 <code>.global-btn</code> 定义。
      它应该有绿色背景。
    </p>

    <h2 class="text-xl font-semibold mb-2 mt-8">测试组件内部的 @apply 类：</h2>
    <button class="component-btn">组件内部按钮 (来自 App.vue)</button>
    <p class="mt-2 text-sm text-gray-600">
      这个按钮的样式应该由 <code>App.vue</code> 的 <code>&lt;style&gt;</code> 块中的 <code>.component-btn</code> 定义。
      它应该有紫色背景。
    </p>

    <div class="mt-8 p-4 border border-dashed border-gray-400 rounded-md">
      <h3 class="font-semibold">HTML 基础样式测试：</h3>
      <p>请检查整个页面的 HTML 标签是否应用了 <code>src/style.css</code> 中定义的 <code>background-color</code> (应该是浅灰色 <code>bg-slate-100</code>) 和 <code>color</code> (应该是深灰色 <code>text-slate-800</code>)。</p>
    </div>
  </div>
  <DefaultLayout />
  <SignLogBox />
  <reset />
</template>

<script setup>
defineOptions({
  name: 'App'
})

// Input components
import SignLogBox from './components/signLogBox.vue'
import reset from './components/ResetPassword.vue'
import DefaultLayout from './layouts/DefaultLayout.vue';
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
