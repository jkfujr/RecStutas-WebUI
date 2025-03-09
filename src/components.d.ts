declare module 'vue' {
  export interface GlobalComponents {
    NAlert: typeof import('naive-ui')['NAlert']
    NavHeader: typeof import('./src/components/NavHeader.vue')['default']
    NButton: typeof import('naive-ui')['NButton']
    NCard: typeof import('naive-ui')['NCard']
    NConfigProvider: typeof import('naive-ui')['NConfigProvider']
    NDialogProvider: typeof import('naive-ui')['NDialogProvider']
    NIcon: typeof import('naive-ui')['NIcon']
    NLoadingBarProvider: typeof import('naive-ui')['NLoadingBarProvider']
    NMenu: typeof import('naive-ui')['NMenu']
    NMessageProvider: typeof import('naive-ui')['NMessageProvider']
    NNotificationProvider: typeof import('naive-ui')['NNotificationProvider']
    NSpin: typeof import('naive-ui')['NSpin']
    NTag: typeof import('naive-ui')['NTag']
    RoomDetail: typeof import('./src/components/RoomDetail.vue')['default']
    RoomList: typeof import('./src/components/RoomList.vue')['default']
    RouterLink: typeof import('vue-router')['RouterLink']
    RouterView: typeof import('vue-router')['RouterView']
  }
} 