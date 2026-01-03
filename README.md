# WOGD JUCE Project Generator

A desktop application to quickly generate JUCE audio plugin projects with modern web-based GUIs. Built with Electron and Vue.js, this generator automates the entire setup process for the [WOGD JUCE Template](https://github.com/artqcid/wogd-juce-template).

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)

## Features

- 🔐 **GitHub OAuth Integration** - Sign in with GitHub to automatically create repositories
- 📁 **Local Mode** - Work offline by cloning public templates directly
- 🎨 **Multiple GUI Frameworks** - Choose from Vue.js, React, Angular, Svelte, or Vanilla JavaScript
- 🔧 **IDE Support** - Generate configurations for VS Code, CLion, Visual Studio, or Xcode
- ⚙️ **Full Automation** - Handles Git submodules, npm install, CMake configuration, and more
- 🎯 **Plugin Configuration** - Set up manufacturer codes, plugin IDs, and Audio Unit subtypes
- 💻 **Cross-Platform** - Works on Windows, macOS, and Linux

## Built on WOGD JUCE Template

This project generator is specifically designed to work with the [WOGD JUCE Template](https://github.com/artqcid/wogd-juce-template), which provides:

- Modern JUCE audio plugin architecture
- Webview-based GUI with multiple framework options
- CMake build system
- Cross-platform support (VST3, AU, Standalone)
- Development best practices and workflows

## Prerequisites

- **Node.js** (v18 or higher)
- **Git**
- **CMake** (for building JUCE plugins)
- **C++ Compiler** (MSVC on Windows, Xcode on macOS, GCC/Clang on Linux)

## Installation

```bash
# Clone the repository
git clone https://github.com/artqcid/wogd-juce-project-generator.git
cd wogd-juce-project-generator

# Install dependencies
npm install

# Run in development mode
npm run dev
```

## Usage

### 1. Connect to GitHub (Optional)
- **Sign in with GitHub** - Automatically creates repositories from templates
- **Work Locally** - Skip GitHub and clone public templates directly

### 2. Select GUI Framework
Choose from:
- Vue.js
- React
- Angular
- Svelte
- Vanilla JavaScript

### 3. Configure Plugin Details
- Plugin Name
- Company Name
- Manufacturer Code (4 characters)
- Plugin Code (4 characters)
- Subtype Code (Audio Unit type: aufx, aumi, aumu, aumf)

### 4. Set Repository Names (GitHub mode only)
- Plugin repository name
- GUI repository name

### 5. Choose Target Directory
Select where your project will be created. The generator automatically creates a subfolder based on your plugin name.

### 6. Select IDE
- VS Code (with multi-root workspace)
- CLion
- Visual Studio
- Xcode
- Command Line Only

### 7. Generate Project
Watch as the generator:
1. Creates GitHub repositories (if authenticated)
2. Clones plugin template
3. Adds GUI submodule
4. Updates project configuration
5. Installs GUI dependencies
6. Configures CMake
7. Generates IDE workspace files

## Building from Source

```bash
# Development
npm run dev

# Build production version
npm run build

# Create distributable packages
npm run dist:win    # Windows (NSIS installer + portable)
npm run dist:mac    # macOS (DMG)
npm run dist:linux  # Linux (AppImage + deb)
```

## Project Structure

```
wogd-juce-project-generator/
├── src/
│   ├── main/                  # Electron main process
│   │   ├── main.ts           # App entry point
│   │   ├── preload.ts        # IPC bridge
│   │   └── handlers/
│   │       ├── github-handler.ts      # GitHub OAuth & API
│   │       └── project-generator.ts   # Project generation logic
│   └── renderer/             # Vue.js frontend
│       ├── App.vue           # Main wizard component
│       ├── components/       # Wizard steps
│       │   ├── GitHubAuth.vue
│       │   ├── FrameworkSelector.vue
│       │   ├── PluginDetails.vue
│       │   ├── RepositorySetup.vue
│       │   ├── IDESelector.vue
│       │   └── ProgressView.vue
│       └── style.css
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Technologies

- **Electron** - Desktop application framework
- **Vue.js 3** - Reactive UI with Composition API
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Octokit** - GitHub REST API client
- **simple-git** - Git operations

## Related Projects

- [WOGD JUCE Template](https://github.com/artqcid/wogd-juce-template) - The plugin template this generator uses
- [JUCE Framework](https://github.com/juce-framework/JUCE) - Cross-platform C++ audio plugin framework

## GitHub OAuth Setup

The app uses GitHub OAuth Device Flow for authentication. A public OAuth App Client ID is included for convenience. For production use, you may want to create your own OAuth App:

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create a new OAuth App
3. Set callback URL to `http://localhost:3000/callback`
4. Update `CLIENT_ID` in `src/main/handlers/github-handler.ts`

## Troubleshooting

### Port 3000 already in use
The OAuth callback server uses port 3000. Close any applications using this port before signing in with GitHub.

### CMake not found
Ensure CMake is installed and available in your PATH. You can install it from [cmake.org](https://cmake.org/download/).

### Hot reload not working in Electron
Electron doesn't auto-reload like browsers. Press **Ctrl+R** (or **Cmd+R** on macOS) in the Electron window to reload, or press **F12** in development mode to toggle DevTools.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**artqcid**
- GitHub: [@artqcid](https://github.com/artqcid)

## Acknowledgments

- Based on the [WOGD JUCE Template](https://github.com/artqcid/wogd-juce-template)
- Built with [JUCE](https://juce.com/) framework
- Inspired by modern web development workflows
