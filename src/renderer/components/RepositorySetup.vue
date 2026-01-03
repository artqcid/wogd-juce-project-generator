<template>
  <div class="step">
    <h2>{{ props.data.githubSkipped ? 'Project Location' : 'Repository Setup' }}</h2>
    <p class="description">
      {{ props.data.githubSkipped 
        ? 'Choose where your project will be created locally.' 
        : 'Configure where your project will be created and name your repositories.' }}
    </p>

    <div class="form">
      <div class="form-group">
        <label for="targetDir">Base Directory</label>
        <div class="dir-input">
          <input
            id="targetDir"
            v-model="form.baseDirectory"
            type="text"
            placeholder="C:\Projects"
            readonly
          />
          <button @click="selectDirectory" class="btn-browse">Browse...</button>
        </div>
        <small v-if="form.baseDirectory && props.data.pluginId">
          Project will be created in: <strong>{{ finalPath }}</strong>
        </small>
      </div>

      <div v-if="!props.data.githubSkipped" class="form-group">
        <label for="pluginRepo">Plugin Repository Name</label>
        <input
          id="pluginRepo"
          v-model="form.pluginRepo"
          type="text"
          placeholder="my-awesome-plugin"
        />
        <small>Will be created from wogd-juce-template</small>
      </div>

      <div v-if="!props.data.githubSkipped" class="form-group">
        <label for="guiRepo">GUI Repository Name</label>
        <input
          id="guiRepo"
          v-model="form.guiRepo"
          type="text"
          placeholder="my-awesome-plugin-gui"
        />
        <small>Will be created from wogd-juce-template-gui-{{ props.data.framework }}</small>
      </div>
    </div>

    <div class="actions">
      <button @click="emit('back')" class="btn btn-secondary">
        ← Back
      </button>
      <button
        @click="handleNext"
        :disabled="!isValid"
        class="btn btn-primary"
      >
        Next →
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import * as path from 'path'

const props = defineProps<{ data: any }>()
const emit = defineEmits<{ next: [data: any]; back: [] }>()

const form = ref({
  baseDirectory: props.data.baseDirectory || '',
  pluginRepo: props.data.pluginRepo || '',
  guiRepo: props.data.guiRepo || '',
})

const finalPath = computed(() => {
  if (!form.value.baseDirectory || !props.data.pluginId) return ''
  return `${form.value.baseDirectory}\\${props.data.pluginId}`
})

const isValid = computed(() => {
  if (props.data.githubSkipped) {
    // Only need base directory for local mode
    return form.value.baseDirectory.length > 0
  }
  // Need all fields for GitHub mode
  return (
    form.value.baseDirectory.length > 0 &&
    form.value.pluginRepo.length > 0 &&
    form.value.guiRepo.length > 0
  )
})

async function selectDirectory() {
  const dir = await (window as any).electronAPI.fs.selectDirectory()
  if (dir) {
    form.value.baseDirectory = dir
  }
}

function handleNext() {
  emit('next', {
    ...form.value,
    targetDirectory: finalPath.value,
  })
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

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: 600;
  color: #333;
}

input {
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: #667eea;
}

input[readonly] {
  background: #f5f5f5;
  cursor: not-allowed;
}

small {
  color: #666;
  font-size: 0.85rem;
}

small strong {
  color: #2563eb;
  font-family: monospace;
}

.dir-input {
  display: flex;
  gap: 0.5rem;
}

.dir-input input {
  flex: 1;
}

.btn-browse {
  padding: 0.75rem 1.5rem;
  border: 2px solid #667eea;
  border-radius: 6px;
  background: white;
  color: #667eea;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-browse:hover {
  background: #667eea;
  color: white;
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

.btn-primary:hover:not(:disabled) {
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

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
