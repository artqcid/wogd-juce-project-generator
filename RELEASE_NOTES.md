# Release Notes Template for v1.0.0

## 🎉 WOGD JUCE Project Generator v1.0.0

We're excited to announce the first release of **WOGD JUCE Project Generator** - a desktop application that makes creating JUCE audio plugins with modern web GUIs quick and easy!

### ✨ What's New

**🔐 Flexible GitHub Authentication**
- Sign in with GitHub OAuth (automatic browser flow)
- Alternative device code flow for restricted environments
- Personal Access Token fallback
- **New:** Work completely offline with local mode!

**🎨 Multi-Framework Support**
Choose from 5 popular web frameworks for your plugin GUI:
- Vue.js
- React  
- Angular
- Svelte
- Vanilla JavaScript

**⚙️ Full Automation**
The generator handles everything:
- ✅ Creates GitHub repositories from templates
- ✅ Clones plugin template
- ✅ Adds GUI submodule
- ✅ Updates project configuration
- ✅ Installs npm dependencies
- ✅ Configures CMake
- ✅ Generates IDE workspace files

**🔧 IDE Integration**
Generate project files for:
- VS Code (multi-root workspace)
- CLion
- Visual Studio
- Xcode
- Command Line

**💻 Cross-Platform**
Works on Windows, macOS, and Linux

### 📦 Installation

**Windows:**
- `WOGD-JUCE-Project-Generator-Setup-1.0.0.exe` - Installer
- `WOGD-JUCE-Project-Generator-1.0.0.exe` - Portable

**macOS:**
- `WOGD-JUCE-Project-Generator-1.0.0.dmg`

**Linux:**
- `WOGD-JUCE-Project-Generator-1.0.0.AppImage`
- `wogd-juce-project-generator_1.0.0_amd64.deb`

### 🚀 Quick Start

1. Launch the application
2. Choose authentication method (or skip for local mode)
3. Select your GUI framework
4. Configure plugin details (name, codes, subtype)
5. Choose target directory
6. Select your IDE
7. Click "Start Generation" and wait for completion!

### 📋 Requirements

- **Node.js** 18+ (for generated projects)
- **Git**
- **CMake** 3.25+
- **C++ Compiler** (MSVC/Xcode/GCC/Clang)

### 🔗 Related Projects

This generator works with:
- [WOGD JUCE Template](https://github.com/artqcid/wogd-juce-template) - The base plugin template
- [JUCE Framework](https://juce.com/) - Cross-platform audio plugin framework

### 🐛 Known Issues

- OAuth requires port 3000 to be available
- Hot reload requires manual Ctrl+R in Electron
- Some npm dependencies have security advisories (non-critical)

### 🙏 Credits

Built with:
- Electron
- Vue.js 3
- TypeScript
- Vite
- GitHub REST API (Octokit)

---

**Full Changelog**: https://github.com/artqcid/wogd-juce-project-generator/blob/main/CHANGELOG.md

**Feedback & Issues**: https://github.com/artqcid/wogd-juce-project-generator/issues
