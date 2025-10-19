import { GetObjectCommand, ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

// Загружаем переменные окружения
dotenv.config();

// Конфигурация R2
const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME;

// Функция для получения JSON из R2
async function getJsonFromR2(key) {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });
    
    const response = await r2Client.send(command);
    const content = await response.Body.transformToString();
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error getting ${key}:`, error);
    return null;
  }
}

// Функция для получения списка изображений клиента
async function listImages(clientId) {
  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: `clients/${clientId}/images/`,
    });
    
    const response = await r2Client.send(command);
    
    // Извлекаем имена файлов
    const images = (response.Contents || [])
      .map(item => {
        const match = item.Key.match(/images\/([^\/]+)$/);
        return match ? match[1] : null;
      })
      .filter(Boolean);
    
    return images;
  } catch (error) {
    console.error(`Error listing images for ${clientId}:`, error);
    return [];
  }
}

// Функция для получения списка клиентов
async function listClients() {
  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: 'clients/',
      Delimiter: '/',
    });
    
    const response = await r2Client.send(command);
    
    // Извлекаем userId из CommonPrefixes
    const clientIds = (response.CommonPrefixes || [])
      .map(prefix => {
        const match = prefix.Prefix.match(/clients\/([^\/]+)\//);
        return match ? match[1] : null;
      })
      .filter(Boolean);
    
    return clientIds;
  } catch (error) {
    console.error('Error listing clients:', error);
    return [];
  }
}

// Главная функция экспорта
export default async function() {
  const specificClientId = process.env.CLIENT_ID;
  
  // Если указан конкретный клиент - билдим только его
  if (specificClientId) {
    console.log(`🎯 Building ONLY client: ${specificClientId}`);
    
    const config = await getJsonFromR2(`clients/${specificClientId}/data/config.json`);
    
    if (!config) {
      console.error(`❌ Config not found for client: ${specificClientId}`);
      return [];
    }
    
    const images = await listImages(specificClientId);
    
    console.log(`✅ Loaded data for client: ${specificClientId}`);
    
    return [{
      id: specificClientId,
      ...config,
      images: images
    }];
  }
  
  // Иначе билдим всех клиентов
  console.log('🔨 Loading ALL clients from R2...');
  
  const clientIds = await listClients();
  console.log(`Found ${clientIds.length} clients`);
  
  const clients = [];
  
  for (const clientId of clientIds) {
    console.log(`Loading data for client: ${clientId}`);
    
    // Загружаем config.json клиента
    const config = await getJsonFromR2(`clients/${clientId}/data/config.json`);
    
    if (config) {
      // Загружаем список изображений
      const images = await listImages(clientId);
      
      clients.push({
        id: clientId,
        ...config,
        images: images
      });
    }
  }
  
  console.log(`✅ Loaded ${clients.length} client configurations`);
  
  return clients;
}

