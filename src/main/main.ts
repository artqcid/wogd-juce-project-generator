import { app, BrowserWindow, ipcMain } from 'electron'
import * as path from 'path'
import { GitHubHandler } from './handlers/github-handler'
import { ProjectGenerator } from './handlers/project-generator'

let mainWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    title: 'WOGD JUCE Project Generator',
    autoHideMenuBar: true,
  })

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()

    // F12 to toggle DevTools (development only)
    mainWindow.webContents.on('before-input-event', (event, input) => {
      if (input.key === 'F12') {
        if (mainWindow?.webContents.isDevToolsOpened()) {
          mainWindow.webContents.closeDevTools()
        } else {
          mainWindow?.webContents.openDevTools()
        }
        event.preventDefault()
      }
    })
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(() => {
  createWindow()
  registerIpcHandlers()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

function registerIpcHandlers() {
  const githubHandler = new GitHubHandler()
  const projectGenerator = new ProjectGenerator()

  // GitHub API handlers
  ipcMain.handle('github:startOAuthFlow', async () => {
    return await githubHandler.startOAuthFlow()
  })

  ipcMain.handle('github:getUserInfo', async () => {
    return await githubHandler.getUserInfo()
  })

  ipcMain.handle('github:authenticate', async (_, token: string) => {
    return await githubHandler.authenticate(token)
  })

  ipcMain.handle('github:startDeviceFlow', async () => {
    return await githubHandler.startDeviceFlow()
  })

  ipcMain.handle('github:pollForToken', async (_, data: { deviceCode: string; interval: number }) => {
    return await githubHandler.pollForToken(data.deviceCode, data.interval)
  })

  ipcMain.handle('github:createFromTemplate', async (_, data: any) => {
    return await githubHandler.createRepositoryFromTemplate(data)
  })

  ipcMain.handle('github:checkRepoExists', async (_, data: any) => {
    return await githubHandler.checkRepositoryExists(data.owner, data.repo)
  })

  // Project generation handlers
  ipcMain.handle('project:generate', async (_, config: any) => {
    return await projectGenerator.generateProject(config, (progress) => {
      mainWindow?.webContents.send('project:progress', progress)
    })
  })

  // File system handlers
  ipcMain.handle('fs:selectDirectory', async () => {
    const { dialog } = require('electron')
    const result = await dialog.showOpenDialog(mainWindow!, {
      properties: ['openDirectory', 'createDirectory'],
    })
    return result.filePaths[0]
  })
}
