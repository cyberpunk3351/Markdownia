<template>
  <form @submit.prevent="onSubmit" class="flex items-center gap-2">
    <input
      v-model="localQuery"
      type="search"
      placeholder="Search filenames or content"
      class="flex-1 rounded-md bg-surface-lighter border border-slate-700 px-3 py-2 text-sm text-gray-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-surface-accent"
    />
    <button
      type="submit"
      class="rounded-md bg-surface-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
    >
      Search
    </button>
    <button
      v-if="localQuery"
      type="button"
      @click="clearQuery"
      class="rounded-md border border-slate-600 px-3 py-2 text-xs text-slate-300 hover:text-white"
    >
      Clear
    </button>
  </form>
</template>

<script setup>
import { onBeforeUnmount, ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  delay: {
    type: Number,
    default: 250,
  },
});

const emit = defineEmits(['update:modelValue', 'search', 'clear']);

const localQuery = ref(props.modelValue);
let timerId = null;

watch(
  () => props.modelValue,
  (value) => {
    if (value !== localQuery.value) {
      localQuery.value = value;
    }
  }
);

watch(localQuery, (value) => {
  emit('update:modelValue', value);
  scheduleSearch(value);
});

function scheduleSearch(value) {
  if (timerId) {
    clearTimeout(timerId);
  }
  timerId = setTimeout(() => {
    emit('search', value);
  }, props.delay);
}

function onSubmit() {
  if (timerId) {
    clearTimeout(timerId);
    timerId = null;
  }
  emit('search', localQuery.value);
}

function clearQuery() {
  localQuery.value = '';
  emit('clear');
}

onBeforeUnmount(() => {
  if (timerId) {
    clearTimeout(timerId);
  }
});
</script>
