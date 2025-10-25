const { GetObjectCommand, ListObjectsV2Command, S3Client } = require('@aws-sdk/client-s3');

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

console.log(`🔧 CLIENT_ID: ${CLIENT_ID}`);
console.log(`🔧 BUCKET_NAME: ${BUCKET_NAME}`);

// Функция для получения JSON из R2
async function getJsonFromR2(key) {
  try {
    console.log(`🔍 Loading from R2: ${key}`);
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });
    
    const response = await s3Client.send(command);
    const str = await response.Body.transformToString();
    const data = JSON.parse(str);
    console.log(`✅ Loaded ${key}:`, data ? 'SUCCESS' : 'EMPTY');
    return data;
  } catch (error) {
    console.error(`❌ Error loading ${key}:`, error.message);
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
module.exports = async function() {
  if (!CLIENT_ID) {
    console.error('❌ CLIENT_ID не установлен! Используем fallback данные');
    return {
      id: 'demo',
      site: {
        title: 'Demo Site',
        description: 'Please configure CLIENT_ID in .env'
      },
      theme: {},
      navigation: null,
      seo: null,
      adminConfig: null,
      sections: [],
      pages: [],
      images: [],
      buildImageUrl: () => null
    };
  }

  console.log(`🔄 Loading data for client: ${CLIENT_ID}`);
  console.log(`🔧 Environment:`, {
    BUCKET_NAME: BUCKET_NAME ? 'SET' : 'NOT SET',
    CLIENT_ID: CLIENT_ID ? 'SET' : 'NOT SET',
    R2_ENDPOINT: process.env.R2_ENDPOINT ? 'SET' : 'NOT SET'
  });
  
  // Загружаем content.json из R2
  let contentData = await getJsonFromR2(`clients/${CLIENT_ID}/data/content.json`);
  
  // Если R2 не работает, используем статические данные для тестирования
  if (!contentData) {
    console.log(`🔄 Using static test data...`);
    contentData = {
      pages: {
        home: {
          id: "home",
          title: "Главная страница",
          slug: "/",
          status: "published",
          sections: [
            {
              id: "hero-1",
              type: "hero",
              values: {
                title: "Добро пожаловать на наш сайт",
                subtitle: "Мы создаем удивительные веб-решения",
                backgroundImage: "",
                buttonText: "Узнать больше",
                buttonLink: "/about"
              }
            }
          ]
        },
        about: {
          id: "about",
          title: "О нас",
          slug: "/about",
          status: "published",
          sections: [
            {
              id: "text-1",
              type: "text",
              values: {
                content: "Мы - команда профессионалов, которая занимается созданием современных веб-решений уже более 5 лет.",
                alignment: "left"
              }
            }
          ]
        }
      }
    };
  }
  
  // Логируем статус загрузки content.json
  if (!contentData) {
    console.warn(`⚠️ content.json not found for client: ${CLIENT_ID}`);
  }
  
  // Обрабатываем данные из content.json
  let pages = [];
  let sections = [];
  
  if (contentData && contentData.pages) {
    // Преобразуем объект pages в массив и обрабатываем каждую страницу
    pages = Object.values(contentData.pages).map(page => ({
      ...page,
      sections: page.sections ? page.sections.map(section => ({
        type: section.type,
        id: section.id,
        enabled: true,
        data: section.values || {}
      })) : []
    }));
    
    console.log(`📄 Processed pages:`, pages.length);
    
    // Находим главную страницу для sections
    const homePage = pages.find(p => p.slug === '/') || pages[0];
    console.log(`🏠 Home page:`, homePage?.slug, homePage?.sections?.length || 0, 'sections');
    
    if (homePage && homePage.sections) {
      sections = homePage.sections;
    }
  } else {
    console.log(`❌ No contentData or pages found`);
  }
  
  // Загружаем список изображений
  const images = await listImages(CLIENT_ID);
  
  console.log(`✅ Loaded data for client: ${CLIENT_ID}`);
  console.log(`   - Images: ${images.length}`);
  console.log(`   - Pages: ${pages.length}`);
  console.log(`   - Title: ${pages[0]?.title || settings?.site?.title || 'N/A'}`);
  console.log(`   - Sections: ${sections.length}`);
  console.log(`   - Sections types:`, sections.map(s => s.type));
  console.log(`   - Pages slugs:`, pages.map(p => p.slug));
  console.log(`   - Pages with sections:`, pages.map(p => `${p.slug}(${p.sections?.length || 0})`));
  
  // 🔒 БЕЗОПАСНО: Функция для построения URL изображений через API
  const buildImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    
    // Если это уже полный R2 URL, извлекаем имя файла
    if (imageUrl.includes('r2.dev')) {
      const fileName = imageUrl.split('/').pop();
      const baseUrl = process.env.SITE_BASE_URL ;
      return `${baseUrl}/api/images/clients/${CLIENT_ID}/images/${fileName}`;
    }
    
    // Если это уже относительный путь, используем как есть
    const baseUrl = process.env.SITE_BASE_URL ;
    return `${baseUrl}/api/images/clients/${CLIENT_ID}/images/${imageUrl}`;
  };

  const result = {
    id: CLIENT_ID,
    site: { 
      title: pages[0]?.title || 'Site', 
      description: pages[0]?.description || 'Описание сайта',
      logo: null,
      social: []
    },
    theme: {},
    navigation: null,
    seo: null,
    adminConfig: null,
    sections,
    pages: pages,
    images: images,
    buildImageUrl
  };
  
  // Добавляем данные страниц в глобальный контекст
  result.pages.forEach(page => {
    result[page.slug.replace('/', '') || 'index'] = page;
  });
  
  console.log(`🎯 Final result:`, {
    id: result.id,
    pagesCount: result.pages.length,
    sectionsCount: result.sections.length
  });
  
  // Принудительно возвращаем данные
  return result;
}

