const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

let requestCount = 0;
let startTime = Date.now();

// Middleware to count requests
router.use((req, res, next) => {
  requestCount++;
  next();
});

router.get('/health', async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: dbStatus,
      memory: process.memoryUsage(),
      version: process.version
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      message: error.message
    });
  }
});

router.get('/metrics', (req, res) => {
  const uptime = Math.floor((Date.now() - startTime) / 1000);
  const memUsage = process.memoryUsage();
  
  const metrics = `
# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total ${requestCount}

# HELP process_uptime_seconds Process uptime in seconds
# TYPE process_uptime_seconds gauge
process_uptime_seconds ${uptime}

# HELP process_memory_usage_bytes Memory usage in bytes
# TYPE process_memory_usage_bytes gauge
process_memory_usage_bytes{type="rss"} ${memUsage.rss}
process_memory_usage_bytes{type="heapTotal"} ${memUsage.heapTotal}
process_memory_usage_bytes{type="heapUsed"} ${memUsage.heapUsed}
process_memory_usage_bytes{type="external"} ${memUsage.external}

# HELP nodejs_version Node.js version info
# TYPE nodejs_version gauge
nodejs_version{version="${process.version}"} 1
`;

  res.set('Content-Type', 'text/plain');
  res.send(metrics.trim());
});

module.exports = router;