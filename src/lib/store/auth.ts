import { defineStore } from 'pinia'
import { globalService } from '@/lib/utils/globalService'

// 定义登录响应数据的接口
interface LoginResponse {
  token?: string
  auth_required?: boolean
  message?: string
  detail?: string | object
}

interface AuthState {
  token: string | null
  authRequired: boolean
  loading: boolean
  error: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    authRequired: false,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => {
      return !state.authRequired || !!state.token
    }
  },

  actions: {
    async checkAuthStatus() {
      this.loading = true
      this.error = null
      
      try {
        const response = await fetch('/api/login')
        const data = await response.json() as LoginResponse
        this.authRequired = !!data.auth_required
        
        if (!data.auth_required) {
          return true
        }
        
        // 检查 token
        const storedToken = localStorage.getItem('auth_token')
        if (storedToken) {
          this.token = storedToken
          return true
        }
        
        return false
      } catch (error) {
        console.error('Failed to check auth status:', error)
        this.error = (error as Error).message
        return false
      } finally {
        this.loading = false
      }
    },

    async login(username: string, password: string) {
      this.loading = true
      this.error = null
      
      // 从全局服务获取消息组件，用于显示错误信息
      const { message } = globalService
      
      try {
        // 只使用 JSON 格式登录
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password })
        })
        
        // 尝试解析响应
        let data: LoginResponse = {}
        try {
          data = await response.json()
        } catch (e) {
          console.error('解析登录响应失败:', e)
        }
        
        // 处理登录结果
        if (response.ok) {
          if (data.token) {
            // 登录成功，存储 token
            this.token = data.token
            localStorage.setItem('auth_token', data.token)
            message?.success('登录成功')
            return true
          } else {
            // 服务器没有返回 token 但响应成功（可能认证未启用）
            return !data.auth_required
          }
        } else {
          // 处理登录失败
          const errorMsg = this.extractErrorMessage(data)
          throw new Error(errorMsg)
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : String(error)
        message?.error(`登录失败: ${this.error}`)
        return false
      } finally {
        this.loading = false
      }
    },
    
    // 辅助方法：从响应中提取错误信息
    extractErrorMessage(data: LoginResponse): string {
      if (!data) return '登录失败'
      
      if (data.detail) {
        return typeof data.detail === 'string' 
          ? data.detail 
          : JSON.stringify(data.detail)
      }
      
      if (data.message) {
        return data.message
      }
      
      return '登录失败'
    },

    logout() {
      this.token = null
      localStorage.removeItem('auth_token')
      globalService.message?.success('已退出登录')
    }
  }
}) 