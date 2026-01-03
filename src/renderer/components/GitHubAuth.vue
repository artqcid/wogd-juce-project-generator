<template>
  <div class="step">
    <h2>Connect to GitHub (Optional)</h2>
    <p class="description">
      Sign in to automatically create GitHub repositories, or skip this step to work locally only.
    </p>

    <div class="form">
      <div v-if="!authenticated && !showTokenInput && !showDeviceFlow" class="oauth-section">
        <button
          @click="startOAuthFlow"
          :disabled="loading"
          class="btn btn-primary btn-large"
        >
          {{ loading ? 'Opening browser...' : '🔐 Sign in with GitHub' }}
        </button>

        <p v-if="loading" class="loading-text">
          Please authorize the app in your browser
        </p>

        <div class="skip-section">
          <p class="skip-text">Don't need GitHub repositories?</p>
          <button @click="skipGitHub" class="btn btn-secondary btn-large">
            📁 Work Locally Only
          </button>
          <small class="skip-info">
            You can still clone the templates and work offline. You just won't create GitHub repositories.
          </small>
        </div>

        <button @click="showDeviceFlow = true" class="btn-link">
          Having trouble? Try alternative sign in
        </button>
      </div>

      <div v-if="showDeviceFlow && !authenticated && !showTokenInput" class="oauth-section">
        <button
          @click="startDeviceFlowAuth"
          :disabled="loading"
          class="btn btn-primary btn-large"
        >
          {{ loading ? 'Waiting for authorization...' : '🔐 Sign in with Device Code' }}
        </button>

        <div v-if="deviceCode" class="device-code-box">
          <p><strong>Follow these steps:</strong></p>
          <ol>
            <li>Click the button below to open GitHub</li>
            <li>Enter this code: <code class="user-code">{{ userCode }}</code></li>
            <li>Authorize the app</li>
          </ol>
          <button @click="openGitHub" class="btn btn-secondary">
            Open GitHub Authorization
          </button>
        </div>

        <button @click="showDeviceFlow = false" class="btn-link">
          ← Back to standard sign in
        </button>
      </div>

      <div v-if="showTokenInput && !authenticated" class="token-section">
        <div class="form-group">
          <label for="token">GitHub Token</label>
          <input
            id="token"
            v-model="token"
            type="password"
            placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
          />
          <small>
            <a href="https://github.com/settings/tokens/new?scopes=repo" target="_blank">
              Create a token
            </a>
            with 'repo' scope
          </small>
        </div>

        <button
          @click="authenticateWithToken"
          :disabled="!token || loading"
          class="btn btn-primary"
        >
          {{ loading ? 'Authenticating...' : 'Connect' }}
        </button>

        <button @click="showTokenInput = false; showDeviceFlow = false" class="btn-link">
          ← Back to OAuth sign in
        </button>
      </div>

      <div v-if="error" class="error">{{ error }}</div>
      <div v-if="authenticated" class="success">
        ✓ Authenticated as {{ user?.login }}
      </div>
      <div v-if="skipped" class="info">
        ℹ️ Working locally - GitHub repository creation will be skipped
      </div>

      <div v-if="authenticated || skipped" class="actions">
        <button @click="handleNext" class="btn btn-primary">
          Next →
        </button>
      </div>

      <div v-if="!authenticated && !showTokenInput" class="token-link-section">
        <button @click="showTokenInput = true; showDeviceFlow = false" class="btn-link-small">
          Or use a Personal Access Token
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ data: any }>()
const emit = defineEmits<{ next: [data: any]; back: [] }>()

const token = ref(props.data.githubToken || '')
const authenticated = ref(false)
const skipped = ref(props.data.githubSkipped || false)
const user = ref<any>(null)
const loading = ref(false)
const error = ref('')
const showTokenInput = ref(false)
const showDeviceFlow = ref(false)
const deviceCode = ref('')
const userCode = ref('')
const verificationUri = ref('')

function skipGitHub() {
  skipped.value = true
}

async function startOAuthFlow() {
  loading.value = true
  error.value = ''

  try {
    const result = await (window as any).electronAPI.github.startOAuthFlow()
    if (result.success) {
      // Get user info
      const userResult = await (window as any).electronAPI.github.getUserInfo()
      if (userResult.success) {
        authenticated.value = true
        user.value = userResult.user
      }
    } else {
      error.value = result.error || 'OAuth flow failed'
    }
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

async function startDeviceFlowAuth() {
  loading.value = true
  error.value = ''

  try {
    const result = await (window as any).electronAPI.github.startDeviceFlow()
    if (result.success) {
      deviceCode.value = result.data.device_code
      userCode.value = result.data.user_code
      verificationUri.value = result.data.verification_uri
      
      // Automatically open GitHub
      window.open(verificationUri.value, '_blank')
      
      // Start polling for token
      pollForToken(result.data.device_code, result.data.interval)
    } else {
      error.value = result.error || 'Failed to start OAuth flow'
      loading.value = false
    }
  } catch (err: any) {
    error.value = err.message
    loading.value = false
  }
}

async function pollForToken(code: string, interval: number) {
  const poll = async () => {
    const result = await (window as any).electronAPI.github.pollForToken(code, interval)
    
    if (result.success) {
      authenticated.value = true
      user.value = result.data.user
      token.value = result.data.token
      loading.value = false
    } else if (result.error === 'pending') {
      // Keep polling
      setTimeout(poll, interval * 1000)
    } else {
      error.value = result.error || 'Authorization failed'
      loading.value = false
      deviceCode.value = ''
      userCode.value = ''
    }
  }
  
  poll()
}

function openGitHub() {
  window.open(verificationUri.value, '_blank')
}

async function authenticateWithToken() {
  loading.value = true
  error.value = ''

  try {
    const result = await (window as any).electronAPI.github.authenticate(token.value)
    if (result.success) {
      authenticated.value = true
      user.value = result.user
    } else {
      error.value = result.error || 'Authentication failed'
    }
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

function handleNext() {
  emit('next', {
    githubToken: token.value,
    githubUser: user.value,
    githubSkipped: skipped.value,
    githubAuthenticated: authenticated.value,
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
  color: #000;
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
  color: #000;
}

input {
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  color: #000;
  background: #fff;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: #2563eb;
}

input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

small {
  color: #000;
  font-size: 0.85rem;
}

small a {
  color: #2563eb;
  text-decoration: none;
}

small a:hover {
  text-decoration: underline;
}

.error {
  padding: 0.75rem;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 6px;
  color: #c33;
}

.success {
  padding: 0.75rem;
  background: #efe;
  border: 1px solid #cfc;
  border-radius: 6px;
  color: #363;
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

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.oauth-section,
.token-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.btn-large {
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
}

.btn-secondary {
  background: linear-gradient(180deg, #0f766e 0%, #14b8a6 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-secondary:hover {
  background: linear-gradient(180deg, #0d9488 0%, #2dd4bf 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(20, 184, 166, 0.4);
}

.btn-link {
  background: none;
  border: none;
  color: #2563eb;
  text-decoration: underline;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0.5rem;
}

.btn-link:hover {
  color: #1e40af;
}

.device-code-box {
  background: #f0f9ff;
  border: 2px solid #bfdbfe;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1rem 0;
  width: 100%;
  max-width: 500px;
}

.device-code-box p {
  margin: 0 0 0.75rem 0;
  color: #000;
}

.device-code-box ol {
  margin: 0.5rem 0 1rem 1.5rem;
  padding: 0;
  color: #000;
}

.device-code-box li {
  margin-bottom: 0.5rem;
}

.user-code {
  background: #1e3a8a;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 1.2rem;
  font-weight: bold;
  letter-spacing: 0.1em;
  font-family: 'Courier New', monospace;
}

.loading-text {
  color: #2563eb;
  font-weight: 500;
  margin: 0;
}

.token-link-section {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
  text-align: center;
}

.btn-link-small {
  background: none;
  border: none;
  color: #6b7280;
  text-decoration: none;
  cursor: pointer;
  font-size: 0.85rem;
  padding: 0.5rem;
}

.btn-link-small:hover {
  color: #2563eb;
  text-decoration: underline;
}

.skip-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.skip-text {
  margin: 0;
  color: #000;
  font-size: 0.95rem;
  font-weight: 500;
}

.skip-info {
  color: #6b7280;
  font-size: 0.85rem;
  text-align: center;
  max-width: 400px;
  margin: 0;
}

.info {
  padding: 0.75rem;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 6px;
  color: #1e40af;
}
</style>
