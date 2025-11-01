import { ref, watch } from 'vue'

export type Theme = 'light' | 'dark' | 'system'

const THEME_KEY = 'doctor2go-theme'

// สร้าง reactive theme state
const currentTheme = ref<Theme>('system')

// ฟังก์ชันสำหรับตรวจสอบ system preference
const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return 'light'
}

// ฟังก์ชันสำหรับอัปเดต HTML class
const updateHtmlClass = (theme: Theme) => {
  if (typeof document === 'undefined') return
  
  const html = document.documentElement
  
  // ลบ class เก่า
  html.classList.remove('light', 'dark')
  
  // เพิ่ม class ใหม่
  if (theme === 'system') {
    const systemTheme = getSystemTheme()
    html.classList.add(systemTheme)
  } else {
    html.classList.add(theme)
  }
}

// ฟังก์ชันสำหรับโหลด theme จาก localStorage
const loadTheme = (): Theme => {
  if (typeof window === 'undefined') return 'system'
  
  const saved = localStorage.getItem(THEME_KEY) as Theme
  return saved || 'system'
}

// ฟังก์ชันสำหรับบันทึก theme ลง localStorage
const saveTheme = (theme: Theme) => {
  if (typeof window === 'undefined') return
  
  localStorage.setItem(THEME_KEY, theme)
}

export const useTheme = () => {
  // โหลด theme ตอน initialize
  const initTheme = () => {
    currentTheme.value = loadTheme()
    updateHtmlClass(currentTheme.value)
    
    // ฟัง system theme changes
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', () => {
        if (currentTheme.value === 'system') {
          updateHtmlClass('system')
        }
      })
    }
  }
  
  // Watch theme changes
  watch(currentTheme, (newTheme) => {
    updateHtmlClass(newTheme)
    saveTheme(newTheme)
  })
  
  // ฟังก์ชันสำหรับเปลี่ยน theme
  const setTheme = (theme: Theme) => {
    currentTheme.value = theme
  }
  
  // ฟังก์ชันสำหรับ toggle ระหว่าง light/dark
  const toggleTheme = () => {
    if (currentTheme.value === 'light') {
      setTheme('dark')
    } else if (currentTheme.value === 'dark') {
      setTheme('light')
    } else {
      // ถ้าเป็น system ให้เปลี่ยนเป็น opposite ของ system
      const systemTheme = getSystemTheme()
      setTheme(systemTheme === 'light' ? 'dark' : 'light')
    }
  }
  
  // ฟังก์ชันสำหรับเช็คว่า active theme คืออะไร
  const isDark = () => {
    if (currentTheme.value === 'dark') return true
    if (currentTheme.value === 'light') return false
    return getSystemTheme() === 'dark'
  }
  
  return {
    currentTheme,
    setTheme,
    toggleTheme,
    isDark,
    initTheme
  }
}