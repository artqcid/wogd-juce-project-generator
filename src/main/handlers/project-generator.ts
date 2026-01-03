import simpleGit, { SimpleGit } from 'simple-git'
import { spawn } from 'child_process'
import * as path from 'path'
import * as fs from 'fs'

export interface ProjectConfig {
  framework: 'vue' | 'react' | 'angular' | 'vanilla' | 'svelte' | 'custom'
  pluginName: string
  pluginId: string
  company: string
  manufacturerCode: string
  pluginCode: string
  subtypeCode: string
  pluginRepoUrl: string
  guiRepoUrl: string
  targetDirectory: string
  ide: 'vscode' | 'clion' | 'visual-studio' | 'xcode' | 'cli' | 'all'
}

export interface ProgressUpdate {
  step: string
  status: 'pending' | 'in-progress' | 'completed' | 'error'
  message: string
  error?: string
}

export class ProjectGenerator {
  private git: SimpleGit | null = null

  async generateProject(
    config: ProjectConfig,
    onProgress: (progress: ProgressUpdate) => void
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Step 1: Clone plugin repository
      onProgress({
        step: 'clone-plugin',
        status: 'in-progress',
        message: 'Cloning plugin repository...',
      })
      await this.cloneRepository(config.pluginRepoUrl, config.targetDirectory)
      onProgress({
        step: 'clone-plugin',
        status: 'completed',
        message: 'Plugin repository cloned',
      })

      this.git = simpleGit(config.targetDirectory)

      // Step 2: Add GUI submodule
      onProgress({
        step: 'add-submodule',
        status: 'in-progress',
        message: 'Adding GUI submodule...',
      })
      await this.git.submoduleAdd(config.guiRepoUrl, 'gui')
      await this.git.submoduleUpdate(['--init', '--recursive'])
      onProgress({
        step: 'add-submodule',
        status: 'completed',
        message: 'GUI submodule added',
      })

      // Step 3: Update project configuration
      onProgress({
        step: 'configure',
        status: 'in-progress',
        message: 'Updating project configuration...',
      })
      await this.updateProjectConfig(config)
      onProgress({
        step: 'configure',
        status: 'completed',
        message: 'Project configured',
      })

      // Step 4: Install GUI dependencies
      onProgress({
        step: 'install-gui',
        status: 'in-progress',
        message: 'Installing GUI dependencies...',
      })
      await this.runCommand('npm', ['install'], path.join(config.targetDirectory, 'gui'))
      onProgress({
        step: 'install-gui',
        status: 'completed',
        message: 'GUI dependencies installed',
      })

      // Step 5: Generate IDE configurations
      onProgress({
        step: 'ide-config',
        status: 'in-progress',
        message: 'Generating IDE configurations...',
      })
      await this.generateIDEConfig(config)
      onProgress({
        step: 'ide-config',
        status: 'completed',
        message: 'IDE configurations generated',
      })

      return { success: true }
    } catch (error: any) {
      onProgress({
        step: 'error',
        status: 'error',
        message: 'Project generation failed',
        error: error.message,
      })
      return { success: false, error: error.message }
    }
  }

  private async cloneRepository(url: string, targetPath: string): Promise<void> {
    const git = simpleGit()
    await git.clone(url, targetPath)
  }

  private async updateProjectConfig(config: ProjectConfig): Promise<void> {
    const configPath = path.join(config.targetDirectory, 'project-config.json')
    
    const projectConfig = {
      plugin: {
        name: config.pluginName,
        id: config.pluginId,
        company: config.company,
        codes: {
          manufacturer: config.manufacturerCode,
          plugin: config.pluginCode,
          subtype: config.subtypeCode,
        },
      },
      gui: {
        framework: config.framework,
        repository: config.guiRepoUrl,
      },
    }

    fs.writeFileSync(configPath, JSON.stringify(projectConfig, null, 2))
  }

  private async generateIDEConfig(config: ProjectConfig): Promise<void> {
    // Generate workspace file for VS Code
    if (config.ide === 'vscode' || config.ide === 'all') {
      const workspacePath = path.join(config.targetDirectory, `${config.pluginId}.code-workspace`)
      const workspace = {
        folders: [
          { path: 'gui', name: 'GUI' },
          { path: 'plugin', name: 'Plugin' },
          { path: '.', name: config.pluginName },
        ],
        settings: {},
      }
      fs.writeFileSync(workspacePath, JSON.stringify(workspace, null, 2))
    }

    // Visual Studio configuration
    if (config.ide === 'visual-studio' || config.ide === 'all') {
      const vsDir = path.join(config.targetDirectory, 'plugin', '.vs')
      if (!fs.existsSync(vsDir)) {
        fs.mkdirSync(vsDir, { recursive: true })
      }
      const launchConfig = {
        version: '0.2.1',
        defaults: {},
        configurations: [
          {
            type: 'default',
            project: 'CMakeLists.txt',
            projectTarget: `${config.pluginId}_Standalone.exe`,
            name: `${config.pluginName} Standalone`,
          },
        ],
      }
      fs.writeFileSync(path.join(vsDir, 'launch.vs.json'), JSON.stringify(launchConfig, null, 2))
    }

    // Xcode configuration (macOS only)
    if ((config.ide === 'xcode' || config.ide === 'all') && process.platform === 'darwin') {
      await this.runCommand('cmake', ['-G', 'Xcode', '-B', 'build-xcode'], path.join(config.targetDirectory, 'plugin'))
    }
  }

  private runCommand(command: string, args: string[], cwd: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const process = spawn(command, args, { cwd, shell: true })
      
      let stderr = ''
      process.stderr?.on('data', (data) => {
        stderr += data.toString()
      })

      process.on('close', (code) => {
        if (code === 0) {
          resolve()
        } else {
          reject(new Error(`Command failed: ${command} ${args.join(' ')}\n${stderr}`))
        }
      })

      process.on('error', (error) => {
        reject(error)
      })
    })
  }
}
