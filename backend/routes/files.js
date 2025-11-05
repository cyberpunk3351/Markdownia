const express = require('express');
const { ensureMarkdownPath } = require('../utils/readMarkdown');

function createFilesRouter(contentStore) {
  const router = express.Router();

  router.get('/tree', (_req, res) => {
    res.json({ tree: contentStore.getTree() });
  });

  router.get('/content', (req, res) => {
    const relativePath = req.query.path;

    if (!relativePath) {
      return res.status(400).json({ message: 'Query parameter "path" is required' });
    }

    try {
      const safePath = ensureMarkdownPath(relativePath);
      const file = contentStore.getFile(safePath);
      res.json(file);
    } catch (error) {
      res.status(error.status || 404).json({ message: error.message });
    }
  });

  router.get('/search', (req, res) => {
    const query = String(req.query.q || '').trim();
    if (!query) {
      return res.json({ results: [] });
    }

    const results = contentStore.search(query);
    res.json({ results });
  });

  return router;
}

module.exports = { createFilesRouter };
