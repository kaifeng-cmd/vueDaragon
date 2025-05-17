<template>
    <TransitionRoot as="template" :show="isOpen">
      <Dialog as="div" class="fixed inset-0 z-50" @close="toggle">
        <div class="fixed inset-y-0 left-0 flex max-w-full">
          <TransitionChild
            enter="transform transition ease-in-out duration-300"
            enter-from="-translate-x-full"
            enter-to="translate-x-0"
            leave="transform transition ease-in-out duration-300"
            leave-from="translate-x-0"
            leave-to="-translate-x-full"
          >
            <DialogPanel class="w-64 bg-white shadow-xl h-screen">
              <div class="flex flex-col h-full overflow-y-auto py-6">
                <div class="px-4 sm:px-6">
                  <div class="flex items-center justify-between">
                    <DialogTitle class="text-lg font-medium text-gray-900">Menu</DialogTitle>
                    <button
                      type="button"
                      class="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                      @click="toggle"
                    >
                      <span class="sr-only">Close sidebar</span>
                      <X class="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <div class="relative mt-6 flex-1 px-4 sm:px-6">
                  <nav class="space-y-1">
                    <router-link
                      v-for="item in sidebarItems"
                      :key="item.name"
                      :to="item.href"
                      class="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    >
                      <component :is="item.icon" class="mr-3 h-6 w-6 text-gray-400" aria-hidden="true" />
                      {{ item.name }}
                    </router-link>
                  </nav>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>
  </template>
  
  <script setup>
  import { watch } from 'vue';
  import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue';
  import { X, Home, Users, Folder, Calendar, BarChart } from 'lucide-vue-next';
  
  const props = defineProps({
    isOpen: Boolean,
  });
  const emit = defineEmits(['toggle']);
  
  const sidebarItems = [
    { name: 'Dashboard', href: '/lobby', icon: Home },
    { name: 'Team', href: '#', icon: Users },
    { name: 'Projects', href: '#', icon: Folder },
    { name: 'Calendar', href: '#', icon: Calendar },
    { name: 'Reports', href: '#', icon: BarChart },
  ];
  
  const toggle = () => {
    console.log('Sidebar: Toggling sidebar');
    emit('toggle');
  };
  
  watch(
    () => props.isOpen,
    (newValue) => {
      console.log('Sidebar: isOpen changed to', newValue);
    }
  );
  </script>