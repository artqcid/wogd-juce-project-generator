<template>
  <div class="app">
    <header class="header">
      <h1>🎵 WOGD JUCE Project Generator</h1>
      <p>Create your audio plugin project with ease</p>
    </header>

    <main class="main">
      <div class="wizard">
        <!-- Progress indicator -->
        <div class="progress-steps">
          <div
            v-for="(step, index) in steps"
            :key="index"
            class="step"
            :class="{ 
              active: currentStep === index, 
              completed: currentStep > index 
            }"
          >
            <div class="step-number">{{ index + 1 }}</div>
            <div class="step-label">{{ step.label }}</div>
          </div>
        </div>

        <!-- Step content -->
        <div class="step-content">
          <component 
            :is="currentStepComponent" 
            :data="stepData"
            @next="handleNext"
            @back="handleBack"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import GitHubAuth from './components/GitHubAuth.vue'
import FrameworkSelector from './components/FrameworkSelector.vue'
import PluginDetails from './components/PluginDetails.vue'
import RepositorySetup from './components/RepositorySetup.vue'
import IDESelector from './components/IDESelector.vue'
import ProgressView from './components/ProgressView.vue'

const currentStep = ref(0)
const stepData = ref<any>({
  githubToken: '',
  githubUser: null,
  framework: 'vue',
  pluginName: '',
  company: '',
  manufacturerCode: '',
  pluginCode: '',
  subtypeCode: '',
  pluginRepo: '',
  guiRepo: '',
  targetDirectory: '',
  ide: 'vscode',
})

const steps = [
  { label: 'GitHub', component: GitHubAuth },
  { label: 'Framework', component: FrameworkSelector },
  { label: 'Plugin Details', component: PluginDetails },
  { label: 'Repositories', component: RepositorySetup },
  { label: 'IDE', component: IDESelector },
  { label: 'Generate', component: ProgressView },
]

const currentStepComponent = computed(() => steps[currentStep.value].component)

function handleNext(data: any) {
  Object.assign(stepData.value, data)
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  }
}

function handleBack() {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(180deg, #1e3a8a 0%, #3b82f6 100%);
}

.header {
  padding: 1.5rem 2rem 0.5rem;
  text-align: center;
  color: white;
}

.header h1 {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
}

.header p {
  margin: 0.5rem 0 0;
  opacity: 0.9;
}

.main {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem 2rem 2rem;
}

.wizard {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 800px;
  min-height: 500px;
  display: flex;
  flex-direction: column;
}

.progress-steps {
  display: flex;
  justify-content: space-between;
  padding: 2rem 2rem 0;
  border-bottom: 2px solid #f0f0f0;
}

.step {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding-bottom: 1rem;
  position: relative;
  transition: all 0.3s;
}

.step.active,
.step.completed {
  /* Kein opacity mehr */
}

.step:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 15px;
  left: 50%;
  width: 100%;
  height: 2px;
  background: #e0e0e0;
  z-index: -1;
}

.step.completed:not(:last-child)::after {
  background: #2563eb;
}

.step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e0e0e0;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  transition: all 0.3s;
}

.step.active .step-number {
  background: #2563eb;
  color: white;
  transform: scale(1.1);
}

.step.completed .step-number {
  background: #2563eb;
  color: white;
}

.step-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: #000;
}

.step.active .step-label {
  color: #2563eb;
  font-weight: 600;
}

.step-content {
  flex: 1;
  padding: 2rem;
  opacity: 1;
  color: #000;
}
</style>
