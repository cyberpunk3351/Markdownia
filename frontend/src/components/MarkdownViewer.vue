<template>
  <div class="h-full overflow-y-auto rounded-lg bg-surface-lighter p-6 shadow-inner">
    <div v-if="queryActive" class="space-y-4">
      <h2 class="text-lg font-semibold text-white">Search results for "{{ query }}"</h2>
      <p v-if="!enhancedResults.length" class="text-sm text-slate-400">No matches found.</p>
      <ul v-else class="space-y-3">
        <li
          v-for="result in enhancedResults"
          :key="result.path"
          class="rounded-md border border-slate-700 bg-surface px-4 py-3"
        >
          <button
            type="button"
            class="w-full text-left"
            @click="$emit('open', result.path)"
          >
            <p class="text-sm font-semibold text-white">{{ result.name }}</p>
            <div
              v-if="result.highlightedSnippet"
              class="prose prose-sm prose-invert mt-1 text-xs text-slate-300"
              v-html="result.highlightedSnippet"
            ></div>
          </button>
        </li>
      </ul>
    </div>
    <div v-else-if="file" class="space-y-4">
      <header class="flex items-start justify-between gap-4">
        <div>
          <h2 class="text-xl font-semibold text-white">{{ file.name }}</h2>
          <p v-if="file.updatedAt" class="text-xs text-slate-400">
            Updated {{ formattedUpdatedAt }}
          </p>
        </div>
      </header>
      <div v-if="sanitizedHtml" class="prose prose-invert max-w-none" v-html="sanitizedHtml" />
      <p v-else class="text-sm text-slate-400">This file has no content.</p>
    </div>
    <div v-else class="flex h-full items-center justify-center text-sm text-slate-500">
      Select a markdown file to preview it here.
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

defineEmits(['open']);

const props = defineProps({
  file: {
    type: Object,
    default: null,
  },
  searchResults: {
    type: Array,
    default: () => [],
  },
  query: {
    type: String,
    default: '',
  },
});

const queryActive = computed(() => props.query.trim().length > 0);

const sanitizedHtml = computed(() => {
  if (!props.file || !props.file.content) {
    return '';
  }
  const html = marked.parse(props.file.content);
  return DOMPurify.sanitize(html);
});

const formattedUpdatedAt = computed(() => {
  if (!props.file || !props.file.updatedAt) {
    return '';
  }
  const date = new Date(props.file.updatedAt);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return date.toLocaleString();
});

const enhancedResults = computed(() =>
  props.searchResults.map((result) => ({
    ...result,
    highlightedSnippet: highlightSnippet(result.snippet || ''),
  }))
);

function highlightSnippet(snippet) {
  if (!snippet) {
    return '';
  }
  const query = props.query.trim();
  if (!query) {
    return DOMPurify.sanitize(snippet);
  }
  const safeQuery = escapeRegExp(query);
  const regex = new RegExp(`(${safeQuery})`, 'gi');
  const html = snippet.replace(regex, '<mark>$1</mark>');
  return DOMPurify.sanitize(html);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
</script>

<style scoped>
.prose :where(code):not(:where([class~="not-prose"] *)) {
  background-color: rgba(15, 23, 42, 0.6);
  padding: 0.15rem 0.3rem;
  border-radius: 0.25rem;
  font-size: 0.85em;
}
.prose pre {
  background-color: rgba(15, 23, 42, 0.8);
  border-radius: 0.5rem;
  padding: 1rem;
}
mark {
  @apply bg-blue-500/30 text-slate-100;
}
</style>
