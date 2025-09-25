const Queue = require('bull');

const emailQueue = new Queue('email processing', process.env.REDIS_URL || 'redis://localhost:6379');
const fileQueue = new Queue('file processing', process.env.REDIS_URL || 'redis://localhost:6379');

const addEmailJob = async (emailData) => {
  return await emailQueue.add('send-notification', emailData);
};

const addFileJob = async (fileData) => {
  return await fileQueue.add('process-upload', fileData);
};

module.exports = { emailQueue, fileQueue, addEmailJob, addFileJob };