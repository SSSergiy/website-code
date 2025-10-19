import { GetObjectCommand, ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3';

// Инициализация R2 клиента
const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME;
const CLIENT_ID = process.env.CLIENT_ID;

// Функция для получения JSON из R2
async function getJsonFromR2(key) {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });
    
    const response = await s3Client.send(command);
    const str = await response.Body.transformToString();
    return JSON.parse(str);
  } catch (error) {
    console.error(`Error loading ${key}:`, error.message);
    return null;
  }
}

// Функция для получения списка изображений
async function listImages(clientId) {
  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: `clients/${clientId}/images/`,
    });
    
    const response = await s3Client.send(command);
    
    if (!response.Contents || response.Contents.length === 0) {
      return [];
    }
    
    return response.Contents
      .map(item => item.Key.split('/').pop())
      .filter(name => name && !name.startsWith('.'));
  } catch (error) {
    console.error('Error listing images:', error.message);
    return [];
  }
}

// Экспорт данных клиента для Eleventy
export default async function() {
  if (!CLIENT_ID) {
    console.error('❌ CLIENT_ID не установлен! Проверьте .env файл');
    return {
      id: 'demo',
      site: {
        title: 'Demo Site',
        description: 'Please configure CLIENT_ID in .env'
      },
      images: []
    };
  }

  console.log(`🔄 Loading data for client: ${CLIENT_ID}`);
  
  // Загружаем config.json клиента
  const config = await getJsonFromR2(`clients/${CLIENT_ID}/data/config.json`);
  
  if (!config) {
    console.error(`❌ Config not found for client: ${CLIENT_ID}`);
    return {
      id: CLIENT_ID,
      site: {
        title: 'Site Not Configured',
        description: 'Please upload config.json via admin panel'
      },
      images: []
    };
  }
  
  // Загружаем список изображений
  const images = await listImages(CLIENT_ID);
  
  console.log(`✅ Loaded data for client: ${CLIENT_ID}`);
  console.log(`   - Images: ${images.length}`);
  console.log(`   - Title: ${config.site?.title || 'N/A'}`);
  
  return {
    id: CLIENT_ID,
    ...config,
    images: images
  };
}

