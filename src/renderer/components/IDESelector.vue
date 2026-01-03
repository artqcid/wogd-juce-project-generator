<template>
  <div class="step">
    <h2>Choose IDE</h2>
    <p class="description">
      Select your preferred development environment.
    </p>

    <div class="ides">
      <div
        v-for="ide in ides"
        :key="ide.id"
        class="ide-card"
        :class="{ selected: selectedIDE === ide.id, untested: ide.untested }"
        @click="selectedIDE = ide.id"
      >
        <div class="ide-icon">{{ ide.icon }}</div>
        <div class="ide-name">{{ ide.name }}</div>
        <div class="ide-desc">{{ ide.description }}</div>
        <div v-if="ide.untested" class="untested-badge">⚠️ Untested</div>
      </div>
    </div>

    <div class="actions">
      <button @click="emit('back')" class="btn btn-secondary">
        ← Back
      </button>
      <button @click="handleNext" class="btn btn-primary">
        Generate Project →
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ data: any }>()
const emit = defineEmits<{ next: [data: any]; back: [] }>()

const selectedIDE = ref(props.data.ide || 'vscode')

const ides = [
  {
    id: 'vscode',
    name: 'VS Code',
    icon: '💻',
    description: 'Pre-configured workspace with tasks',
  },
  {
    id: 'clion',
    name: 'CLion',
    icon: '🔧',
    description: 'JetBrains CMake-based IDE',
  },
  {
    id: 'visual-studio',
    name: 'Visual Studio',
    icon: '🪟',
    description: 'Windows native IDE',
  },
  {
    id: 'xcode',
    name: 'Xcode',
    icon: '🍎',
    description: 'macOS native IDE',
    untested: true,
  },
  {
    id: 'cli',
    name: 'Command Line',
    icon: '⌨️',
    description: 'Manual commands only',
  },
]

function handleNext() {
  emit('next', { ide: selectedIDE.value })
}
</script>

<style scoped>
.step {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

h2 {
  margin: 0;
  color: #333;
}

.description {
  margin: 0;
  color: #666;
  line-height: 1.6;
}

.ides {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
}

.ide-card {
  padding: 1.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
  position: relative;
}

.ide-card:hover {
  border-color: #667eea;
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.ide-card.selected {
  border-color: #667eea;
  background: #f0f4ff;
}

.ide-card.untested {
  border-color: #ffa500;
}

.ide-card.untested:hover {
  border-color: #ff8c00;
}

.ide-icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.ide-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.ide-desc {
  font-size: 0.85rem;
  color: #666;
}

.untested-badge {
  margin-top: 0.5rem;
  padding: 0.25rem 0.5rem;
  background: #fff3cd;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #856404;
}

.actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: linear-gradient(180deg, #1e3a8a 0%, #3b82f6 100%);
  color: white;
}

.btn-primary:hover {
  background: linear-gradient(180deg, #1e40af 0%, #2563eb 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
}

.btn-secondary {
  background: #e0e0e0;
  color: #333;
}

.btn-secondary:hover {
  background: #d0d0d0;
}
</style>
