const fs = require('fs/promises');
const path = require('path');
const chokidar = require('chokidar');

function isMarkdownFile(filePath) {
  return path.extname(filePath).toLowerCase() === '.md';
}

function normalizeRelative(filepath) {
  return filepath.split(path.sep).join('/');
}

function ensureMarkdownPath(relativePath) {
  if (typeof relativePath !== 'string') {
    const error = new Error('Invalid path');
    error.status = 400;
    throw error;
  }

  if (relativePath.includes('..')) {
    const error = new Error('Path traversal is not allowed');
    error.status = 403;
    throw error;
  }

  if (!relativePath.toLowerCase().endsWith('.md')) {
    const error = new Error('Only markdown files can be requested');
    error.status = 400;
    throw error;
  }

  return normalizeRelative(relativePath);
}

async function readFileContent(fullPath) {
  const buffer = await fs.readFile(fullPath);
  return buffer.toString('utf8');
}

const FRONT_MATTER_REGEX = /^---\s*\n([\s\S]*?)\n---\s*\n?/;

function stripFrontMatter(rawContent) {
  const match = rawContent.match(FRONT_MATTER_REGEX);
  if (!match) {
    return { body: rawContent, frontMatter: null };
  }

  const body = rawContent.slice(match[0].length);
  return { body, frontMatter: match[1] };
}

async function walkDirectory(rootDir, currentDir = rootDir) {
  const entries = await fs.readdir(currentDir, { withFileTypes: true });
  const nodes = [];
  const filesMap = new Map();

  const sortedEntries = entries.sort((a, b) => a.name.localeCompare(b.name));

  for (const entry of sortedEntries) {
    const absolutePath = path.join(currentDir, entry.name);
    const relative = normalizeRelative(path.relative(rootDir, absolutePath));

    if (entry.isDirectory()) {
      const { tree, files } = await walkDirectory(rootDir, absolutePath);
      if (tree.length > 0) {
        nodes.push({
          name: entry.name,
          path: relative,
          type: 'directory',
          children: tree,
        });
      }
      for (const [key, value] of files.entries()) {
        filesMap.set(key, value);
      }
    } else if (entry.isFile() && isMarkdownFile(entry.name)) {
      const rawContent = await readFileContent(absolutePath);
      const { body: content, frontMatter } = stripFrontMatter(rawContent);
      const stats = await fs.stat(absolutePath);
      filesMap.set(relative, {
        name: entry.name,
        path: relative,
        content,
        frontMatter,
        updatedAt: stats.mtimeMs,
      });
      nodes.push({
        name: entry.name,
        path: relative,
        type: 'file',
      });
    }
  }

  nodes.sort((a, b) => {
    if (a.type === b.type) {
      return a.name.localeCompare(b.name);
    }
    return a.type === 'directory' ? -1 : 1;
  });

  return { tree: nodes, files: filesMap };
}

function createContentStore(rootDir) {
  const absoluteRoot = path.resolve(rootDir);
  let tree = [];
  let files = new Map();
  let rebuildPromise = rebuild();

  const watcher = chokidar.watch(absoluteRoot, {
    ignoreInitial: true,
    awaitWriteFinish: true,
  });

  watcher.on('all', (event, filePath) => {
    if (!filePath) return;
    if (event === 'add' || event === 'change' || event === 'unlink') {
      if (!isMarkdownFile(filePath)) {
        return;
      }
    }
    rebuildPromise = rebuild();
  });

  async function rebuild() {
    try {
      const exists = await fs.stat(absoluteRoot).catch(() => null);
      if (!exists) {
        await fs.mkdir(absoluteRoot, { recursive: true });
      }
      const { tree: newTree, files: newFiles } = await walkDirectory(absoluteRoot);
      tree = newTree;
      files = newFiles;
    } catch (error) {
      console.error('Failed to rebuild content index', error);
    }
  }

  function getTree() {
    return tree;
  }

  function getFile(relativePath) {
    const normalized = normalizeRelative(relativePath);
    if (!files.has(normalized)) {
      const error = new Error('File not found');
      error.status = 404;
      throw error;
    }
    const file = files.get(normalized);
    return {
      name: file.name,
      path: file.path,
      content: file.content,
      updatedAt: file.updatedAt,
    };
  }

  function search(term) {
    const needle = term.toLowerCase();
    const results = [];

    for (const file of files.values()) {
      const nameMatch = file.name.toLowerCase().includes(needle);
      const contentIndex = file.content.toLowerCase().indexOf(needle);

      if (!nameMatch && contentIndex === -1) {
        continue;
      }

      let snippet = '';
      if (contentIndex >= 0) {
        const start = Math.max(contentIndex - 40, 0);
        const end = Math.min(contentIndex + needle.length + 40, file.content.length);
        snippet = file.content.slice(start, end).replace(/\s+/g, ' ');
        if (start > 0) snippet = `...${snippet}`;
        if (end < file.content.length) snippet = `${snippet}...`;
      }

      results.push({
        name: file.name,
        path: file.path,
        snippet,
      });
    }

    return results.sort((a, b) => a.name.localeCompare(b.name));
  }

  async function ready() {
    await rebuildPromise;
  }

  async function dispose() {
    await watcher.close();
  }

  return {
    ready,
    getTree,
    getFile,
    search,
    dispose,
  };
}

module.exports = {
  createContentStore,
  ensureMarkdownPath,
};
