import 'dotenv/config';

export default function(eleventyConfig) {
  // Копируем статические файлы
  eleventyConfig.addPassthroughCopy({ "src/assets/js": "assets/js" });
  eleventyConfig.addPassthroughCopy({ "src/assets/scss": "assets/scss" });
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  eleventyConfig.addPassthroughCopy({ "src/fonts": "fonts" });

  // Фильтр для форматирования даты
  eleventyConfig.addFilter("formatDate", (date) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  });

  // Глобальные данные
  eleventyConfig.addGlobalData("buildTime", new Date().toISOString());

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: false
  };
}

