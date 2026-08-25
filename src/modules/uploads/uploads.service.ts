import { Injectable, Logger } from '@nestjs/common';

export type StorageProviderType = 'cloudinary' | 'aws_s3' | 'azure_blob';

@Injectable()
export class UploadsService {
  private readonly logger = new Logger(UploadsService.name);

  get activeProvider(): StorageProviderType {
    return (process.env.STORAGE_PROVIDER || 'cloudinary').toLowerCase() as StorageProviderType;
  }

  async getSignedUploadUrl(folder = 'sri-anvaya/documents', fileName?: string) {
    const provider = this.activeProvider;

    if (provider === 'cloudinary') {
      const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
      const apiKey = process.env.CLOUDINARY_API_KEY;
      const apiSecret = process.env.CLOUDINARY_API_SECRET;

      if (cloudName && apiKey && apiSecret) {
        const cloudinary = require('cloudinary').v2;
        const timestamp = Math.round(new Date().getTime() / 1000);
        const signature = cloudinary.utils.api_sign_request(
          { timestamp, folder },
          apiSecret,
        );
        return {
          provider: 'cloudinary',
          uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
          timestamp,
          signature,
          apiKey,
          folder,
        };
      }
    } else if (provider === 'aws_s3') {
      const bucket = process.env.AWS_S3_BUCKET || 'sri-anvaya-vault';
      const region = process.env.AWS_REGION || 'ap-south-1';
      const safeKey = `${folder}/${Date.now()}_${fileName || 'document.pdf'}`;
      return {
        provider: 'aws_s3',
        bucket,
        region,
        key: safeKey,
        uploadUrl: `https://${bucket}.s3.${region}.amazonaws.com/${safeKey}`,
        method: 'PUT',
        headers: {
          'x-amz-server-side-encryption': 'AES256',
        },
      };
    } else if (provider === 'azure_blob') {
      const account = process.env.AZURE_STORAGE_ACCOUNT || 'srianvayastorage';
      const container = process.env.AZURE_STORAGE_CONTAINER || 'pitru-records';
      const safeBlob = `${folder}/${Date.now()}_${fileName || 'document.pdf'}`;
      return {
        provider: 'azure_blob',
        account,
        container,
        blobName: safeBlob,
        uploadUrl: `https://${account}.blob.core.windows.net/${container}/${safeBlob}`,
        method: 'PUT',
        headers: {
          'x-ms-blob-type': 'BlockBlob',
        },
      };
    }

    // Local / Simulation fallback
    return {
      provider: 'local_simulation',
      uploadUrl: '/api/uploads/mock-upload',
      timestamp: Date.now(),
      folder,
      isMock: true,
    };
  }

  async deleteFile(publicId: string) {
    const provider = this.activeProvider;
    if (provider === 'cloudinary' && process.env.CLOUDINARY_CLOUD_NAME) {
      const cloudinary = require('cloudinary').v2;
      return cloudinary.uploader.destroy(publicId);
    }
    return { result: 'ok', deletedFrom: provider, id: publicId };
  }
}
