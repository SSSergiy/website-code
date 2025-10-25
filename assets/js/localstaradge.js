const DARK = 'dark'
const LIGHT = 'light'

export default function switchThemeColor() {
  const themeSwitch = document.querySelector('#switch')
  
  // Если переключателя нет на странице, выходим
  if (!themeSwitch) {
    return;
  }
  
  const currentTheme = localStorage.getItem('theme-color')
  currentTheme === DARK ? setThemeColor(themeSwitch, true, DARK) : setThemeColor(themeSwitch, false, LIGHT)

  themeSwitch.addEventListener('change', event => {
    event.target.checked ? setTheme(DARK) : setTheme(LIGHT)
  })
}

function setThemeColor(themeSwitch, boolean, themeColor) {
  themeSwitch.checked = boolean
  document.documentElement.setAttribute('data-theme', themeColor)
}

function setTheme(theme) {
  localStorage.setItem('theme-color', theme)
  document.documentElement.setAttribute('data-theme', theme)
}