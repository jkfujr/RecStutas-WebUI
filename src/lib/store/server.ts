import { defineStore } from 'pinia'
import { fetchServers } from '@/lib/utils/api'
import type { RecServer, RoomData } from '@/lib/types/api'
import { useRoomStore } from './room'
import { useRoomUtils } from '@/lib/utils/useRoomUtils'

interface ServerState {
  servers: RecServer[]
  loading: boolean
  error: string | null
  lastUpdated: Date | null
}

export const useServerStore = defineStore('server', {
  state: (): ServerState => ({
    servers: [],
    loading: false,
    error: null,
    lastUpdated: null
  }),

  getters: {
    lastUpdatedText: (state) => {
      if (!state.lastUpdated) return '未更新'
      return state.lastUpdated.toLocaleTimeString()
    },

    filteredServers: (state) => (type: 'all' | 'recheme' | 'blrec') => {
      if (type === 'all') return state.servers
      return state.servers.filter((server: RecServer) => server.recType === type)
    },

    serverStats: (state) => {
      const roomStore = useRoomStore()
      const { isStreaming, isRecording } = useRoomUtils()
      return state.servers.map((server: RecServer) => {
        const rooms = roomStore.rooms.filter((room: RoomData) => 
          room.recServer.recHost === server.recHost
        )
        const stats = {
          totalRooms: rooms.length,
          streamingRooms: rooms.filter((room: RoomData) => isStreaming(room)).length,
          recordingRooms: rooms.filter((room: RoomData) => isRecording(room)).length
        }

        return {
          ...server,
          ...stats
        }
      })
    }
  },

  actions: {
    async fetchServers() {
      if (this.loading) return

      this.loading = true
      this.error = null

      try {
        const servers = await fetchServers()
        this.servers = servers
        this.lastUpdated = new Date()
      } catch (error) {
        console.error('Failed to fetch servers:', error)
        this.error = (error as Error).message
      } finally {
        this.loading = false
      }
    }
  }
}) 