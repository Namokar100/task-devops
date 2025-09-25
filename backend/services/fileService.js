const { minioClient, bucketName } = require('../config/minio');
const { addFileJob } = require('../config/queue');

const uploadFile = async (file) => {
  try {
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}-${file.originalname}`;
    
    await minioClient.putObject(bucketName, fileName, file.buffer, file.size, {
      'Content-Type': file.mimetype,
      'Original-Name': file.originalname
    });

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
    await minioClient.removeObject(bucketName, fileName);
  } catch (error) {
    console.error('File delete error:', error);
    throw new Error('Failed to delete file');
  }
};

const getFileUrl = async (fileName) => {
  try {
    return await minioClient.presignedGetObject(bucketName, fileName, 24 * 60 * 60); // 24 hours
  } catch (error) {
    console.error('Get file URL error:', error);
    throw new Error('Failed to get file URL');
  }
};

const streamFile = async (fileName) => {
  try {
    return await minioClient.getObject(bucketName, fileName);
  } catch (error) {
    console.error('Stream file error:', error);
    throw new Error('File not found');
  }
};

module.exports = { uploadFile, deleteFile, getFileUrl, streamFile };