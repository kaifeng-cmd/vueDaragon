<template>
  <div class="mb-4">
    <label :for="uniqueId" class="block text-sm font-medium text-gray-700">{{ label }}</label>
    <input
      :id="uniqueId"
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
      class="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
      :required="required"
    />
  </div>
</template>

<script>
export default {
  name: 'InputField',
  props: {
    id: {
      type: String,
      required: true, // 强制提供唯一 ID
    },
    label: String,
    type: {
      type: String,
      default: 'text',
    },
    modelValue: String,
    placeholder: String,
    required: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  computed: {
    uniqueId() {
      // 确保 ID 唯一，例如添加组件实例的随机后缀
      return `${this.id}-${Math.random().toString(36).substr(2, 9)}`;
    },
  },
};
</script>