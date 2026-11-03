const path = require('path');
const express = require('express');
const { formatUptime } = require('./utils');
const pkg = require('../package.json');

const app = express();

// Serves public/index.html at "/" (on Vercel, public/ is also served by the CDN)
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api/info', (req, res) => {
  res.json({ message: 'DevOps midterm app is running', version: pkg.version });
});

app.get('/health', (req, res) => {
  const mem = process.memoryUsage();
  res.status(200).json({
    status: 'ok',
    service: pkg.name,
    version: pkg.version,
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'development',
    commit: (process.env.VERCEL_GIT_COMMIT_SHA || 'local').slice(0, 7),
    region: process.env.VERCEL_REGION || 'local',
    node: process.version,
    uptime: formatUptime(process.uptime()),
    uptimeSeconds: Math.floor(process.uptime()),
    memory: {
      rssMB: Math.round(mem.rss / 1024 / 1024),
      heapUsedMB: Math.round(mem.heapUsed / 1024 / 1024),
    },
    checks: { app: 'ok' },
    timestamp: new Date().toISOString(),
  });
});

module.exports = app;
