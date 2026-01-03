<template>
  <div class="step">
    <h2>{{ completed ? 'Project Generated!' : 'Generating Project...' }}</h2>
    <p class="description">
      {{ completed ? 'Your project is ready to use!' : 'Please wait while we set up your project.' }}
    </p>

    <div class="progress-list">
      <div
        v-for="step in steps"
        :key="step.id"
        class="progress-item"
        :class="step.status"
      >
        <div class="progress-icon">
          <span v-if="step.status === 'completed'">✓</span>
          <span v-else-if="step.status === 'error'">✗</span>
          <span v-else-if="step.status === 'in-progress'" class="spinner">⟳</span>
          <span v-else>○</span>
        </div>
        <div class="progress-details">
          <div class="progress-message">{{ step.message }}</div>
          <div v-if="step.error" class="progress-error">{{ step.error }}</div>
        </div>
      </div>
    </div>

    <div v-if="completed" class="success-box">
      <h3>🎉 Success!</h3>
      <p>Your project has been created at:</p>
      <code>{{ props.data.targetDirectory }}</code>
      <p class="next-steps">
        <strong>Next steps:</strong><br>
        1. Open the project in your IDE<br>
        2. Run the <strong>"First Time Setup"</strong> task in your IDE<br>
        <small style="color: #666; margin-top: 0.5rem; display: block;">
          This will initialize the GUI submodule, install dependencies, configure CMake, and build the plugin
        </small>
      </p>
    </div>

    <div v-if="error" class="error-box">
      <h3>❌ Error</h3>
      <p>{{ error }}</p>
    </div>

    <div class="actions">
      <button
        v-if="!started"
        @click="startGeneration"
        class="btn btn-primary"
      >
        Start Generation
      </button>
      <button
        v-if="completed"
        @click="emit('back')"
        class="btn btn-secondary"
      >
        Create Another Project
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{ data: any }>()
const emit = defineEmits<{ next: [data: any]; back: [] }>()

const started = ref(false)
const completed = ref(false)
const error = ref('')

const steps = ref([
  ...(props.data.githubSkipped ? [] : [
    { id: 'create-plugin-repo', message: 'Creating plugin repository...', status: 'pending' },
    { id: 'create-gui-repo', message: 'Creating GUI repository...', status: 'pending' },
  ]),
  { id: 'clone-plugin', message: 'Cloning plugin template...', status: 'pending' },
  { id: 'add-submodule', message: 'Adding GUI submodule...', status: 'pending' },
  { id: 'configure', message: 'Updating project configuration...', status: 'pending' },
  { id: 'install-gui', message: 'Installing GUI dependencies...', status: 'pending' },
  { id: 'ide-config', message: 'Generating IDE configurations...', status: 'pending' },
])

async function startGeneration() {
  started.value = true

  try {
    // Step 1-2: Create repositories (only if authenticated)
    if (!props.data.githubSkipped) {
      await updateStep('create-plugin-repo', 'in-progress')
      await createRepository('plugin')
      await updateStep('create-plugin-repo', 'completed')

      await updateStep('create-gui-repo', 'in-progress')
      await createRepository('gui')
      await updateStep('create-gui-repo', 'completed')
    }

    // Step 3-8: Generate project
    const config = {
      framework: props.data.framework,
      pluginName: props.data.pluginName,
      pluginId: props.data.pluginId,
      company: props.data.company,
      manufacturerCode: props.data.manufacturerCode,
      pluginCode: props.data.pluginCode,
      subtypeCode: props.data.subtypeCode,
      // Use GitHub URLs if authenticated, otherwise use public template URLs
      pluginRepoUrl: props.data.githubSkipped 
        ? 'https://github.com/artqcid/wogd-juce-template'
        : `https://github.com/${props.data.githubUser.login}/${props.data.pluginRepo}`,
      guiRepoUrl: props.data.githubSkipped
        ? `https://github.com/artqcid/wogd-juce-template-gui-${props.data.framework}`
        : `https://github.com/${props.data.githubUser.login}/${props.data.guiRepo}`,
      targetDirectory: props.data.targetDirectory,
      ide: props.data.ide,
      localOnly: props.data.githubSkipped,
    }

    // Listen for progress updates
    ;(window as any).electronAPI.project.onProgress((progress: any) => {
      const step = steps.value.find((s) => s.id === progress.step)
      if (step) {
        step.status = progress.status
        step.message = progress.message
        if (progress.error) {
          step.error = progress.error
        }
      }
    })

    const result = await (window as any).electronAPI.project.generate(config)

    if (result.success) {
      completed.value = true
    } else {
      error.value = result.error || 'Unknown error'
    }
  } catch (err: any) {
    error.value = err.message
  }
}

async function createRepository(type: 'plugin' | 'gui') {
  const templateRepo = type === 'plugin' 
    ? 'wogd-juce-template'
    : `wogd-juce-template-gui-${props.data.framework}`

  const repoName = type === 'plugin' ? props.data.pluginRepo : props.data.guiRepo

  const result = await (window as any).electronAPI.github.createFromTemplate({
    templateOwner: 'artqcid',
    templateRepo,
    owner: props.data.githubUser.login,
    name: repoName,
    description: `${type === 'plugin' ? 'Plugin' : 'GUI'} for ${props.data.pluginName}`,
    private: false,
  })

  if (!result.success) {
    throw new Error(result.error)
  }

  // Wait a bit for GitHub to finish setting up the repo
  await new Promise((resolve) => setTimeout(resolve, 2000))
}

async function updateStep(id: string, status: string) {
  const step = steps.value.find((s) => s.id === id)
  if (step) {
    step.status = status
  }
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

.progress-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1.5rem 0;
}

.progress-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  background: #f5f5f5;
  transition: all 0.3s;
}

.progress-item.in-progress {
  background: #fff9e6;
  border: 2px solid #ffd700;
}

.progress-item.completed {
  background: #e6ffe6;
  border: 2px solid #4caf50;
}

.progress-item.error {
  background: #ffe6e6;
  border: 2px solid #f44336;
}

.progress-icon {
  font-size: 1.5rem;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  display: inline-block;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.progress-details {
  flex: 1;
}

.progress-message {
  font-weight: 600;
  color: #333;
}

.progress-error {
  margin-top: 0.5rem;
  color: #c33;
  font-size: 0.85rem;
}

.success-box,
.error-box {
  padding: 1.5rem;
  border-radius: 8px;
  margin: 1rem 0;
}

.success-box {
  background: #e6ffe6;
  border: 2px solid #4caf50;
}

.error-box {
  background: #ffe6e6;
  border: 2px solid #f44336;
}

.success-box h3,
.error-box h3 {
  margin: 0 0 1rem;
  color: #333;
}

.success-box code {
  display: block;
  padding: 0.5rem;
  background: white;
  border-radius: 4px;
  margin: 0.5rem 0;
  font-family: 'Courier New', monospace;
}

.next-steps {
  margin-top: 1rem;
  line-height: 1.8;
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
