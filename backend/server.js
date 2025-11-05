const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });
if (!process.env.JWT_SECRET) {
  const fallbackEnv = path.resolve(__dirname, '../../.env');
  dotenv.config({ path: fallbackEnv });
}

const { createContentStore } = require('./utils/readMarkdown');
const authRouter = require('./routes/auth');
const { createFilesRouter } = require('./routes/files');
const { authenticateJWT } = require('./middleware/auth');

const PORT = process.env.PORT || 5000;
const rootDir = path.resolve(__dirname, '..');
const configuredContentPath = process.env.CONTENT_DIR || 'content';
const CONTENT_DIR = path.isAbsolute(configuredContentPath)
  ? configuredContentPath
  : path.resolve(rootDir, configuredContentPath);

async function bootstrap() {
  const app = express();

  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());

  app.use(rateLimit({
    windowMs: 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
  }));

  const contentStore = createContentStore(path.resolve(CONTENT_DIR));
  await contentStore.ready();

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api', authRouter);
  app.use('/api/files', authenticateJWT, createFilesRouter(contentStore));

  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
  });

  const server = app.listen(PORT, () => {
    console.log(`Backend listening on http://localhost:${PORT}`);
    console.log(`Indexing markdown from: ${CONTENT_DIR}`);
  });

  process.on('SIGINT', async () => {
    await contentStore.dispose();
    server.close(() => process.exit(0));
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
