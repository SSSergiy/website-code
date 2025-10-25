// Импортируем функцию переключения темы
import switchThemeColor from './localstaradge.js';

// Инициализируем переключение темы
switchThemeColor();

// Мобильное меню
document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuButton = document.querySelector('[data-mobile-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
});