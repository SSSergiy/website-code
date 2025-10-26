// Простой JavaScript для статического сайта

// Навигация между страницами
document.addEventListener('DOMContentLoaded', function() {
  // Обработка кликов по ссылкам
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (!link) return;
    
    const href = link.getAttribute('href');
    if (!href) return;
    
    // Только для локальных ссылок
    if (href.startsWith('/') && !href.startsWith('//')) {
      e.preventDefault();
      window.location.href = href;
    }
  });
  
  // Простая анимация появления секций
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });
  
  // Показываем секции с задержкой
  setTimeout(() => {
    sections.forEach((section, index) => {
      setTimeout(() => {
        section.style.opacity = '1';
        section.style.transform = 'translateY(0)';
      }, index * 200);
    });
  }, 100);
});
