// API для прокси изображений (для статического сайта)
export default async function handler(req, res) {
  const { path } = req.query;
  const imagePath = Array.isArray(path) ? path.join('/') : path;
  
  try {
    // 🔒 БЕЗОПАСНО: Разрешаем только изображения
    if (imagePath.includes('data/') || imagePath.endsWith('.json')) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Перенаправляем на R2
    const r2Url = `https://pub-${process.env.R2_ACCOUNT_ID}.r2.dev/${imagePath}`;
    
    res.redirect(302, r2Url);
  } catch (error) {
    console.error('Error proxying image:', error);
    res.status(500).json({ error: 'Failed to load image' });
  }
}
