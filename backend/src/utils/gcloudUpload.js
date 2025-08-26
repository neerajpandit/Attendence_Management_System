import { Storage } from '@google-cloud/storage';
import { destFileName } from '../constants';
import { bucketName } from '../constants';

// Initialize Google Cloud Storage
const storage = new Storage({
  keyFilename: 'path-to-your-service-account-key.json', // Replace with the path to your service account key file
  projectId: 'your-project-id', // Replace with your Google Cloud project ID
});


export async function uploadFile(fileBuffer) {
  try {
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(destFileName);

    // Upload the file
    await file.save(fileBuffer, {
      metadata: {
        contentType: 'auto', // Automatically detect content type
      },
    });

    console.log(`File uploaded to ${bucketName}/${destFileName}`);

    // Make the file publicly accessible
    await file.makePublic();

    // Generate a public URL for the uploaded file
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${destFileName}`;
    return publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}