<template>
  <ul class="space-y-1">
    <li v-for="node in nodes" :key="node.path">
      <div v-if="node.type === 'directory'" class="flex flex-col">
        <button
          type="button"
          class="flex items-center gap-2 rounded-md px-2 py-1 text-left text-sm text-slate-300 transition hover:bg-surface-lighter"
          :aria-expanded="isOpen(node.path)"
          @click="toggleDirectory(node.path)"
        >
          <span class="inline-block w-4 text-xs">{{ isOpen(node.path) ? '▾' : '▸' }}</span>
          <span class="font-medium">{{ node.name }}</span>
        </button>
        <transition name="fade" mode="out-in">
          <div
            v-if="isOpen(node.path) && node.children"
            class="ml-4 border-l border-slate-700 pl-3"
          >
            <FileTree
              :nodes="node.children"
              :selected="selected"
              @select="(path) => emit('select', path)"
            />
          </div>
        </transition>
      </div>
      <button
        v-else
        type="button"
        class="flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-sm transition hover:bg-surface-lighter"
        :class="{ 'bg-surface-lighter text-white shadow-inner': node.path === selected }"
        @click="emit('select', node.path)"
      >
        <span class="inline-block w-4 text-xs" aria-hidden="true">📝</span>
        <span class="truncate">{{ node.name }}</span>
      </button>
    </li>
  </ul>
</template>

<script setup>
import { reactive, watch } from 'vue';

defineOptions({ name: 'FileTree' });

const props = defineProps({
  nodes: {
    type: Array,
    default: () => [],
  },
  selected: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['select']);

const openDirectories = reactive({});

function toggleDirectory(path) {
  openDirectories[path] = !isOpen(path);
}

function isOpen(path) {
  if (openDirectories[path] === undefined) {
    openDirectories[path] = false;
  }
  return openDirectories[path];
}

function expandAncestors(selectedPath) {
  if (!selectedPath) return;
  const segments = selectedPath.split('/');
  let current = '';

  for (let i = 0; i < segments.length - 1; i += 1) {
    current = current ? `${current}/${segments[i]}` : segments[i];
    if (props.nodes.some((node) => node.path === current)) {
      openDirectories[current] = true;
    }
  }
}

watch(
  () => props.selected,
  (next) => {
    expandAncestors(next);
  },
  { immediate: true }
);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
