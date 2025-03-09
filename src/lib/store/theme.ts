import { defineStore } from 'pinia'
import { darkTheme } from 'naive-ui'
import type { GlobalTheme } from 'naive-ui'
import { updateGlobalServiceTheme } from '@/lib/utils/globalService'

interface ThemeState {
  isDark: boolean
  theme: GlobalTheme | null
}

export const useThemeStore = defineStore('theme', {
  state: (): ThemeState => ({
    isDark: false,
    theme: null
  }),

  getters: {
    currentTheme: (state: ThemeState) => state.isDark ? darkTheme : null
  },

  actions: {
    init() {
      // 检查本地存储的主题设置
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme) {
        this.$patch({ isDark: savedTheme === 'dark' })
      } else {
        // 如果没有本地设置，则使用系统主题
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        this.$patch({ isDark: prefersDark })
      }
      
      this.applyTheme()
      
      // 监听系统主题变化
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        // 只有在没有用户手动设置主题时，才跟随系统主题
        if (!localStorage.getItem('theme')) {
          this.$patch({ isDark: e.matches })
          this.applyTheme()
        }
      })
    },

    toggleTheme() {
      this.$patch({ isDark: !this.isDark })
      this.applyTheme()
      localStorage.setItem('theme', this.isDark ? 'dark' : 'light')
    },

    applyTheme() {
      document.documentElement.classList.toggle('dark', this.isDark)
      this.$patch({ theme: this.isDark ? darkTheme : null })
      
      // 更新全局服务的主题
      updateGlobalServiceTheme(this.isDark)
    }
  }
}) 