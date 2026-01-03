# WOGD JUCE Project Generator

Cross-platform desktop application to generate JUCE audio plugin projects from templates with multi-framework GUI support.

## Features

- 🎨 **Multi-Framework Support** - Vue.js, React, Angular, Vanilla JS, Svelte
- 🔐 **GitHub Integration** - Automatic repository creation from templates
- 🚀 **One-Click Setup** - Automated project generation and configuration
- 💻 **Multi-IDE Support** - VS Code, CLion, Visual Studio, Xcode
- 🌐 **Cross-Platform** - Windows, macOS, Linux
- ⚡ **Modern UI** - Beautiful step-by-step wizard interface

## Prerequisites

- **Node.js** 18+ and npm
- **Git** for repository operations
- **CMake** 3.25+ for plugin builds
- **GitHub Account** with Personal Access Token

## Installation

### From Source

```bash
# Clone repository
git clone https://github.com/artqcid/wogd-juce-project-generator.git
cd wogd-juce-project-generator

# Install dependencies
npm install

# Start development mode
npm run dev
```

### From Release

Download the latest release for your platform:
- Windows: `WOGD-JUCE-Project-Generator-Setup.exe` or `.exe` portable
- macOS: `WOGD-JUCE-Project-Generator.dmg`
- Linux: `WOGD-JUCE-Project-Generator.AppImage` or `.deb`

## Usage

1. **Launch Application**
   - Run the app from your application menu or terminal

2. **GitHub Authentication**
   - Create a [Personal Access Token](https://github.com/settings/tokens/new?scopes=repo) with `repo` scope
   - Paste token in the authentication step

3. **Select Framework**
   - Choose your preferred GUI framework (Vue, React, Angular, Vanilla JS, Svelte)

4. **Configure Plugin Details**
   - Plugin name and company
   - Manufacturer, plugin, and subtype codes (4 characters each)

5. **Repository Setup**
   - Select target directory for your project
   - Name your plugin and GUI repositories

6. **Choose IDE**
   - Select your development environment
   - VS Code, CLion, Visual Studio, Xcode, or CLI-only

7. **Generate Project**
   - Click "Start Generation"
   - Wait for automatic setup to complete

## Development

```bash
# Development mode (hot reload)
npm run dev

# Build for production
npm run build

# Create distribution packages
npm run dist              # All platforms
npm run dist:win          # Windows only
npm run dist:mac          # macOS only
npm run dist:linux        # Linux only

# Lint code
npm run lint

# Format code
npm run format
```

## Project Structure

```
wogd-juce-project-generator/
├── src/
│   ├── main/                    # Electron main process
│   │   ├── main.ts              # Application entry
│   │   ├── preload.ts           # Context bridge
│   │   └── handlers/
│   │       ├── github-handler.ts       # GitHub API
│   │       └── project-generator.ts    # Project generation
│   └── renderer/                # Vue.js frontend
│       ├── App.vue              # Main app component
│       ├── main.ts              # Vue entry
│       └── components/
│           ├── GitHubAuth.vue
│           ├── FrameworkSelector.vue
│           ├── PluginDetails.vue
│           ├── RepositorySetup.vue
│           ├── IDESelector.vue
│           └── ProgressView.vue
├── package.json
├── vite.config.ts
├── tsconfig.json
└── tsconfig.main.json
```

## How It Works

### 1. GitHub Repository Creation
- Uses GitHub API to create repositories from templates
- Plugin repo: `artqcid/wogd-juce-template`
- GUI repo: `artqcid/wogd-juce-template-gui-{framework}`

### 2. Local Project Setup
- Clones plugin repository to target directory
- Adds GUI repository as git submodule
- Updates `project-config.json` with your settings

### 3. Dependency Installation
- Runs `npm install` in GUI directory
- Configures CMake with `ninja-clang` preset

### 4. IDE Configuration
- **VS Code**: Generates `.code-workspace` file
- **Visual Studio**: Creates `.vs/launch.vs.json`
- **CLion**: Uses existing `CMakePresets.json`
- **Xcode**: Generates `.xcodeproj` via CMake

## Technologies

- **Electron** 28+ - Desktop application framework
- **Vue.js** 3 - Reactive UI framework
- **TypeScript** 5 - Type-safe development
- **Vite** 5 - Fast build tool
- **Octokit** - GitHub API client
- **simple-git** - Git operations
- **electron-builder** - Cross-platform packaging

## Related Projects

- [wogd-juce-template](https://github.com/artqcid/wogd-juce-template) - Main plugin template
- [wogd-juce-template-gui-vue](https://github.com/artqcid/wogd-juce-template-gui-vue) - Vue.js GUI template
- [wogd-juce-template-gui-react](https://github.com/artqcid/wogd-juce-template-gui-react) - React GUI template
- [wogd-juce-template-gui-angular](https://github.com/artqcid/wogd-juce-template-gui-angular) - Angular GUI template
- [wogd-juce-template-gui-vanilla](https://github.com/artqcid/wogd-juce-template-gui-vanilla) - Vanilla JS template
- [wogd-juce-template-gui-svelte](https://github.com/artqcid/wogd-juce-template-gui-svelte) - Svelte GUI template

## Troubleshooting

### GitHub Token Issues
- Ensure token has `repo` scope
- Token should not be expired
- Check GitHub API rate limits

### CMake Configuration Fails
- Verify CMake 3.25+ is installed
- Check Ninja and Clang are available
- Use CLI-only mode to see full error output

### Git Operations Fail
- Ensure Git is installed and in PATH
- Check repository names don't already exist
- Verify network connection to GitHub

## License

MIT

## Contributing

Contributions welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Support

- Issues: [GitHub Issues](https://github.com/artqcid/wogd-juce-project-generator/issues)
- Template Issues: [Template Repository](https://github.com/artqcid/wogd-juce-template/issues)
