import { GetObjectCommand, ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3';
import nunjucks from 'nunjucks';
import { join } from 'path';

// Конфигурация R2 (те же переменные что в GitHub Actions)
const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_PUBLIC_URL = 'https://pub-a6698d33e75a45ebb75c9b00d0c3ce2a.r2.dev';

// Настройка Nunjucks (используем те же шаблоны что в Eleventy!)
const templatesPath = join(process.cwd(), 'src/_includes');
nunjucks.configure(templatesPath, {
  autoescape: true,
  noCache: true // Всегда свежие шаблоны
});

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

// Функция для получения списка изображений
async function listImages(clientId) {
  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: `clients/${clientId}/images/`,
    });
    
    const response = await r2Client.send(command);
    
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

// Используем ТЕ ЖЕ Nunjucks шаблоны что в Eleventy!
// НЕТ дублирования HTML - один источник истины ✅

// Главная функция - Cloudflare Pages Function
export async function onRequest(context) {
  const { clientId } = context.params;
  
  try {
    // Читаем данные из R2
    console.log(`🎯 Preview for client: ${clientId}`);
    const config = await getJsonFromR2(`clients/${clientId}/data/config.json`);
    
    if (!config) {
      return new Response(`
        <html>
          <body style="font-family: sans-serif; padding: 50px; text-align: center;">
            <h1>❌ Конфигурация не найдена</h1>
            <p>Клиент <code>${clientId}</code> не существует или не настроен.</p>
            <p>Создайте файл <code>config.json</code> в админке.</p>
          </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' },
        status: 404
      });
    }
    
    const images = await listImages(clientId);
    
    // Подготовка данных для шаблона (как в Eleventy)
    const client = {
      id: clientId,
      ...config,
      images: images
    };
    
    const site = config.site;
    const hero = config.hero || {};
    
    // Рендерим компоненты используя ТЕ ЖЕ .njk файлы что в Eleventy
    const headerHtml = nunjucks.render('components/header.njk', { site });
    const heroHtml = nunjucks.render('components/hero.njk', { site, hero });
    const footerHtml = nunjucks.render('components/footer.njk', { site });
    
    // Контент секции (как в clients.njk)
    let contentHtml = '';
    if (client.pages) {
      contentHtml = '<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">';
      for (const page of client.pages) {
        if (page.published) {
          contentHtml += `
            <section id="${page.slug}" class="mb-16">
              <h2 class="text-3xl font-bold text-gray-900 mb-6">${page.title}</h2>
              <div class="prose prose-lg max-w-none">
                ${page.content}
              </div>
            </section>
          `;
        }
      }
      contentHtml += '</div>';
    }
    
    // Галерея
    let galleryHtml = '';
    if (images && images.length > 0) {
      galleryHtml = `
        <section class="py-16">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">Галерея</h2>
            <div class="image-gallery">
              ${images.map(image => `
                <div class="gallery-item fade-in">
                  <img src="${R2_PUBLIC_URL}/clients/${clientId}/images/${image}" 
                       alt="${image}" loading="lazy">
                </div>
              `).join('')}
            </div>
          </div>
        </section>
      `;
    }
    
    // Features
    let featuresHtml = '';
    if (client.features && client.features.length > 0) {
      featuresHtml = `
        <section class="bg-gray-50 py-16">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">Наши преимущества</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              ${client.features.map(feature => `
                <div class="bg-white p-6 rounded-lg shadow-sm">
                  ${feature.icon ? `<div class="text-4xl mb-4">${feature.icon}</div>` : ''}
                  <h3 class="text-xl font-semibold text-gray-900 mb-2">${feature.title}</h3>
                  <p class="text-gray-600">${feature.description}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </section>
      `;
    }
    
    // Генерируем HTML (используя те же шаблоны!)
    const html = `
      <!DOCTYPE html>
      <html lang="ru">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${site.title} - Preview</title>
        <meta name="description" content="${site.description}">
        
        <!-- Tailwind CSS CDN -->
        <script src="https://cdn.tailwindcss.com"></script>
        
        <!-- Custom CSS -->
        <link rel="stylesheet" href="/assets/css/style.css">
        
        <style>
          /* Preview Banner */
          .preview-banner {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px;
            text-align: center;
            font-weight: 600;
            z-index: 9999;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          body {
            padding-top: 48px;
          }
        </style>
      </head>
      <body class="antialiased">
        <!-- Preview Banner -->
        <div class="preview-banner">
          👁️ РЕЖИМ ПРЕДПРОСМОТРА | Обновите страницу чтобы увидеть последние изменения
        </div>
        
        ${headerHtml}
        
        <main>
          ${heroHtml}
          ${contentHtml}
          ${galleryHtml}
          ${featuresHtml}
        </main>
        
        ${footerHtml}
        
        <script type="module" src="/assets/js/main.js"></script>
      </body>
      </html>
    `;
    
    return new Response(html, {
      headers: { 
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate', // Всегда свежие данные
        'X-Robots-Tag': 'noindex' // Не индексировать preview
      }
    });
    
  } catch (error) {
    console.error('Preview error:', error);
    
    return new Response(`
      <html>
        <body style="font-family: sans-serif; padding: 50px; text-align: center;">
          <h1>⚠️ Ошибка генерации preview</h1>
          <p>${error.message}</p>
          <p style="color: gray; font-size: 12px;">Проверьте настройки R2 и конфигурацию клиента.</p>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' },
      status: 500
    });
  }
}

