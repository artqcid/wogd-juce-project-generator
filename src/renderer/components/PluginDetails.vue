<template>
  <div class="step">
    <h2>Plugin Details</h2>
    <p class="description">
      Configure your audio plugin settings.
    </p>

    <div class="form">
      <div class="form-group">
        <label for="pluginName">Plugin Name</label>
        <input
          id="pluginName"
          v-model="form.pluginName"
          type="text"
          placeholder="My Awesome Plugin"
        />
      </div>

      <div class="form-group">
        <label for="company">Company Name</label>
        <input
          id="company"
          v-model="form.company"
          type="text"
          placeholder="My Company"
        />
      </div>

      <div class="codes-grid">
        <div class="form-group">
          <label for="manufacturerCode">Manufacturer Code</label>
          <input
            id="manufacturerCode"
            v-model="form.manufacturerCode"
            type="text"
            placeholder="ABCD"
            maxlength="4"
            @input="toUpperCase('manufacturerCode')"
          />
          <small>4 characters</small>
        </div>

        <div class="form-group">
          <label for="pluginCode">Plugin Code</label>
          <input
            id="pluginCode"
            v-model="form.pluginCode"
            type="text"
            placeholder="ABCD"
            maxlength="4"
            @input="toUpperCase('pluginCode')"
          />
          <small>4 characters</small>
        </div>

        <div class="form-group">
          <label for="subtypeCode">Subtype Code</label>
          <select
            id="subtypeCode"
            v-model="form.subtypeCode"
          >
            <option value="aufx">aufx - Audio Effect</option>
            <option value="aumi">aumi - Instrument/Synth</option>
            <option value="aumu">aumu - Music Effect</option>
            <option value="aumf">aumf - MIDI Effect</option>
          </select>
          <small>Only for Audio Unit (macOS)</small>
        </div>
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

const props = defineProps<{ data: any }>()
const emit = defineEmits<{ next: [data: any]; back: [] }>()

const form = ref({
  pluginName: props.data.pluginName || '',
  company: props.data.company || '',
  manufacturerCode: props.data.manufacturerCode || '',
  pluginCode: props.data.pluginCode || '',
  subtypeCode: props.data.subtypeCode || 'aufx',
})

const isValid = computed(() => {
  return (
    form.value.pluginName.length > 0 &&
    form.value.company.length > 0 &&
    form.value.manufacturerCode.length === 4 &&
    form.value.pluginCode.length === 4 &&
    form.value.subtypeCode.length === 4
  )
})

function toUpperCase(field: keyof typeof form.value) {
  form.value[field] = form.value[field].toUpperCase()
}

function handleNext() {
  const pluginId = form.value.pluginName.replace(/\s+/g, '_')
  emit('next', { ...form.value, pluginId })
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

select {
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
  background: white;
  cursor: pointer;
}

select:focus {
  outline: none;
  border-color: #2563eb;
}

small {
  color: #666;
  font-size: 0.85rem;
}

.codes-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
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
