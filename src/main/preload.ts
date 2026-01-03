import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  // GitHub API
  github: {
    startOAuthFlow: () => ipcRenderer.invoke('github:startOAuthFlow'),
    getUserInfo: () => ipcRenderer.invoke('github:getUserInfo'),
    authenticate: (token: string) => ipcRenderer.invoke('github:authenticate', token),
    startDeviceFlow: () => ipcRenderer.invoke('github:startDeviceFlow'),
    pollForToken: (deviceCode: string, interval: number) => 
      ipcRenderer.invoke('github:pollForToken', { deviceCode, interval }),
    createFromTemplate: (data: any) => ipcRenderer.invoke('github:createFromTemplate', data),
    checkRepoExists: (data: any) => ipcRenderer.invoke('github:checkRepoExists', data),
  },

  // Project generation
  project: {
    generate: (config: any) => ipcRenderer.invoke('project:generate', config),
    onProgress: (callback: (progress: any) => void) => {
      ipcRenderer.on('project:progress', (_, progress) => callback(progress))
    },
  },

  // File system
  fs: {
    selectDirectory: () => ipcRenderer.invoke('fs:selectDirectory'),
  },
})

export {}
