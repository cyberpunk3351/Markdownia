<template>
  <div class="flex min-h-screen flex-col gap-4 p-6">
    <header class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-white">Markdown Explorer</h1>
        <p class="text-sm text-slate-400">Browse project content and preview markdown.</p>
      </div>
      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="refreshTree"
          class="rounded-md border border-slate-600 px-3 py-2 text-xs text-slate-300 hover:text-white"
        >
          Refresh
        </button>
        <button
          type="button"
          @click="logout"
          class="rounded-md bg-red-500 px-4 py-2 text-xs font-semibold text-white hover:bg-red-400"
        >
          Logout
        </button>
      </div>
    </header>

    <SearchBar
      v-model="searchQuery"
      @search="runSearch"
      @clear="clearSearch"
    />

    <main class="flex flex-1 gap-4 overflow-hidden">
      <section class="flex-[0_0_20%] overflow-y-auto rounded-lg bg-surface-lighter p-4">
        <h2 class="mb-3 text-sm font-semibold text-slate-300 uppercase tracking-wide">Files</h2>
        <p v-if="treeLoading" class="text-xs text-slate-400">Loading tree...</p>
        <p v-else-if="!fileTree.length" class="text-xs text-slate-400">No markdown files found.</p>
        <FileTree
          v-else
          :nodes="fileTree"
          :selected="selectedPath"
          @select="selectFile"
        />
      </section>
      <section class="flex-[0_0_70%]">
        <MarkdownViewer
          :file="currentFile"
          :search-results="searchResults"
          :query="searchQuery"
          @open="selectFile"
        />
      </section>
    </main>

    <p v-if="errorMessage" class="rounded-md border border-red-600 bg-red-950 px-3 py-2 text-xs text-red-200">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { api, setToken } from '@/api/client';
import FileTree from '@/components/FileTree.vue';
import MarkdownViewer from '@/components/MarkdownViewer.vue';
import SearchBar from '@/components/SearchBar.vue';

const fileTree = ref([]);
const treeLoading = ref(false);
const selectedPath = ref('');
const currentFile = ref(null);
const errorMessage = ref('');
const searchQuery = ref('');
const searchResults = ref([]);
const router = useRouter();

onMounted(() => {
  refreshTree();
});

async function refreshTree() {
  treeLoading.value = true;
  errorMessage.value = '';
  try {
    const { data } = await api.get('/files/tree');
    fileTree.value = data.tree || [];
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Failed to load directory tree';
    if (error.response?.status === 401) {
      logout();
    }
  } finally {
    treeLoading.value = false;
  }
}

async function selectFile(path) {
  if (!path) return;
  try {
    const { data } = await api.get('/files/content', {
      params: { path },
    });
    selectedPath.value = data.path;
    currentFile.value = data;
    searchQuery.value = '';
    searchResults.value = [];
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Unable to load file';
    if (error.response?.status === 401) {
      logout();
    }
  }
}

async function runSearch(query) {
  const trimmed = query.trim();
  searchQuery.value = trimmed;
  if (!trimmed) {
    searchResults.value = [];
    return;
  }
  try {
    const { data } = await api.get('/files/search', {
      params: { q: trimmed },
    });
    searchResults.value = data.results || [];
    currentFile.value = null;
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Search failed';
    if (error.response?.status === 401) {
      logout();
    }
  }
}

function clearSearch() {
  searchQuery.value = '';
  searchResults.value = [];
}

function logout() {
  setToken('');
  router.replace({ name: 'login' });
}
</script>
