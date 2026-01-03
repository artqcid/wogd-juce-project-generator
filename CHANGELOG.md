# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-03

### Added
- Initial release of WOGD JUCE Project Generator
- 🔐 GitHub OAuth integration with Device Flow authentication
- 📁 Local mode for offline project generation
- 🎨 Multi-framework support (Vue.js, React, Angular, Svelte, Vanilla JS)
- 🔧 IDE configuration generation (VS Code, CLion, Visual Studio, Xcode)
- ⚙️ Automated project setup workflow
  - Git repository creation from templates
  - Submodule management
  - npm dependency installation
  - CMake configuration
  - IDE workspace generation
- 🎯 Plugin configuration wizard
  - Plugin name and company name
  - Manufacturer code (4 characters)
  - Plugin code (4 characters)
  - Audio Unit subtype selection (aufx, aumi, aumu, aumf)
- 💻 Cross-platform support (Windows, macOS, Linux)
- 🎨 Modern blue gradient UI theme
- ⌨️ F12 DevTools toggle in development mode
- 📂 Automatic project directory creation based on plugin ID
- 🔄 Real-time progress tracking during generation

### Features
- **GitHub OAuth Options:**
  - Standard OAuth flow (automatic browser authentication)
  - Device code flow (manual code entry)
  - Personal Access Token fallback
  
- **Local Mode:**
  - Clone public templates without GitHub authentication
  - Skip repository creation
  - Work completely offline

- **Smart Validation:**
  - Required field checking
  - 4-character code validation
  - Repository name availability checking

- **Progress Visualization:**
  - Step-by-step status updates
  - Error handling with detailed messages
  - Success confirmation with next steps

### Technical Details
- Built with Electron 28.2.0
- Vue.js 3.4.15 with Composition API
- TypeScript 5.3.3 for type safety
- Vite 5.0.12 for fast development
- ESLint 9.15.0 with flat config
- Octokit for GitHub API integration
- simple-git for Git operations
- electron-builder for cross-platform packaging

### Known Issues
- GitHub OAuth requires port 3000 to be available
- Electron doesn't support hot reload (manual Ctrl+R required)
- 6 moderate npm security vulnerabilities (non-critical dependencies)

### Dependencies
- Node.js 18+
- Git
- CMake (for building generated projects)
- C++ compiler (MSVC/Xcode/GCC)

[1.0.0]: https://github.com/artqcid/wogd-juce-project-generator/releases/tag/v1.0.0
