const AWS = require('aws-sdk');
const Minio = require('minio');

// Storage configuration based on environment
const storageType = process.env.STORAGE_TYPE || 'MINIO';

let storageClient;
let bucketName;

if (storageType === 'S3') {
  // AWS S3 Configuration
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'us-east-1'
  });
  
  storageClient = new AWS.S3();
  bucketName = process.env.S3_BUCKET || 'task-manager-files';
  
  console.log('Using AWS S3 for file storage');
} else {
  // MinIO Configuration (fallback)
  storageClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT?.split(':')[0] || 'localhost',
    port: parseInt(process.env.MINIO_ENDPOINT?.split(':')[1]) || 9000,
    useSSL: false,
    accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
    secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin123'
  });
  bucketName = process.env.MINIO_BUCKET || 'task-files';
  
  console.log('Using MinIO for file storage');
}

const initializeStorage = async () => {
  try {
    if (storageType === 'S3') {
      // Check if S3 bucket exists
      try {
        await storageClient.headBucket({ Bucket: bucketName }).promise();
        console.log(`S3 bucket ${bucketName} exists`);
      } catch (error) {
        if (error.statusCode === 404) {
          await storageClient.createBucket({ Bucket: bucketName }).promise();
          console.log(`S3 bucket ${bucketName} created`);
        }
      }
    } else {
      // MinIO bucket check
      const exists = await storageClient.bucketExists(bucketName);
      if (!exists) {
        await storageClient.makeBucket(bucketName, 'us-east-1');
        console.log(`MinIO bucket ${bucketName} created`);
      }
    }
    console.log('Storage initialized successfully');
  } catch (error) {
    console.error('Storage initialization error:', error);
  }
};

module.exports = { storageClient, bucketName, storageType, initializeStorage };