const { storageClient, bucketName, storageType } = require('../config/storage');
const { addFileJob } = require('../config/queue');

const uploadFile = async (file) => {
  try {
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}-${file.originalname}`;
    
    if (storageType === 'S3') {
      await storageClient.upload({
        Bucket: bucketName,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
        Metadata: {
          'original-name': file.originalname
        }
      }).promise();
    } else {
      await storageClient.putObject(bucketName, fileName, file.buffer, file.size, {
        'Content-Type': file.mimetype,
        'Original-Name': file.originalname
      });
    }

    // Queue background job for file processing
    await addFileJob({
      filename: fileName,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype
    });

    return {
      fileName,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      url: `/api/files/${fileName}`
    };
  } catch (error) {
    console.error('File upload error:', error);
    throw new Error('Failed to upload file');
  }
};

const deleteFile = async (fileName) => {
  try {
    if (storageType === 'S3') {
      await storageClient.deleteObject({
        Bucket: bucketName,
        Key: fileName
      }).promise();
    } else {
      await storageClient.removeObject(bucketName, fileName);
    }
  } catch (error) {
    console.error('File delete error:', error);
    throw new Error('Failed to delete file');
  }
};

const getFileUrl = async (fileName) => {
  try {
    if (storageType === 'S3') {
      return storageClient.getSignedUrl('getObject', {
        Bucket: bucketName,
        Key: fileName,
        Expires: 24 * 60 * 60
      });
    } else {
      return await storageClient.presignedGetObject(bucketName, fileName, 24 * 60 * 60);
    }
  } catch (error) {
    console.error('Get file URL error:', error);
    throw new Error('Failed to get file URL');
  }
};

const streamFile = async (fileName) => {
  try {
    if (storageType === 'S3') {
      const result = await storageClient.getObject({
        Bucket: bucketName,
        Key: fileName
      }).promise();
      return result.Body;
    } else {
      return await storageClient.getObject(bucketName, fileName);
    }
  } catch (error) {
    console.error('Stream file error:', error);
    throw new Error('File not found');
  }
};

module.exports = { uploadFile, deleteFile, getFileUrl, streamFile };