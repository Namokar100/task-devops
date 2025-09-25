const Queue = require('bull');
const redis = require('redis');
require('dotenv').config();

// Redis connection
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// Job queues
const emailQueue = new Queue('email processing', process.env.REDIS_URL || 'redis://localhost:6379');
const fileQueue = new Queue('file processing', process.env.REDIS_URL || 'redis://localhost:6379');

// Email job processor
emailQueue.process('send-notification', async (job) => {
  const { to, subject, message } = job.data;
  console.log(`Sending email to ${to}: ${subject}`);
  // Simulate email sending
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log(`Email sent successfully to ${to}`);
  return { status: 'sent', timestamp: new Date() };
});

// File processing job processor
fileQueue.process('process-upload', async (job) => {
  const { filename, path } = job.data;
  console.log(`Processing file: ${filename}`);
  // Simulate file processing (resize, compress, etc.)
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log(`File processed successfully: ${filename}`);
  return { status: 'processed', filename, timestamp: new Date() };
});

// Error handling
emailQueue.on('failed', (job, err) => {
  console.error(`Email job ${job.id} failed:`, err);
});

fileQueue.on('failed', (job, err) => {
  console.error(`File job ${job.id} failed:`, err);
});

console.log('Worker started successfully');
console.log('Listening for jobs on email and file queues...');