<template>
  <div class="step">
    <h2>Choose GUI Framework</h2>
    <p class="description">
      Select the web framework for your plugin GUI.
    </p>

    <div class="frameworks">
      <div
        v-for="fw in frameworks"
        :key="fw.id"
        class="framework-card"
        :class="{ selected: selectedFramework === fw.id }"
        @click="selectedFramework = fw.id"
      >
        <div class="framework-icon">{{ fw.icon }}</div>
        <div class="framework-name">{{ fw.name }}</div>
        <div class="framework-desc">{{ fw.description }}</div>
      </div>
    </div>

    <div class="actions">
      <button @click="emit('back')" class="btn btn-secondary">
        ← Back
      </button>
      <button @click="handleNext" class="btn btn-primary">
        Next →
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ data: any }>()
const emit = defineEmits<{ next: [data: any]; back: [] }>()

const selectedFramework = ref(props.data.framework || 'vue')

const frameworks = [
  {
    id: 'vue',
    name: 'Vue.js',
    icon: '🌟',
    description: 'Progressive framework with great DX',
  },
  {
    id: 'react',
    name: 'React',
    icon: '⚛️',
    description: 'Popular library with huge ecosystem',
  },
  {
    id: 'angular',
    name: 'Angular',
    icon: '🅰️',
    description: 'Full-featured framework by Google',
  },
  {
    id: 'vanilla',
    name: 'Vanilla JS',
    icon: '📦',
    description: 'Minimal TypeScript + Vite setup',
  },
  {
    id: 'svelte',
    name: 'Svelte',
    icon: '🔥',
    description: 'Compiled framework, smallest bundle',
  },
]

function handleNext() {
  emit('next', { framework: selectedFramework.value })
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

.frameworks {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
}

.framework-card {
  padding: 1.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
}

.framework-card:hover {
  border-color: #667eea;
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.framework-card.selected {
  border-color: #667eea;
  background: #f0f4ff;
}

.framework-icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.framework-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.framework-desc {
  font-size: 0.85rem;
  color: #666;
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
