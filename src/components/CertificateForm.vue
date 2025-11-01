<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Certificate Generation</h3>
    
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-black dark:text-gray-200 mb-1">Certificate Number</label>
        <div class="flex gap-2">
          <input
            v-model="certificateNumber"
            type="text"
            placeholder="DG-2024-XXXXXX"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-md"
            readonly
          />
          <button
            @click="generateNumber"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Generate
          </button>
        </div>
      </div>

      <div v-if="certificateNumber" class="mt-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700">
        <h4 class="font-medium mb-2 text-gray-900 dark:text-white">Certificate Preview</h4>
        <p class="text-black dark:text-gray-200">Certificate No: {{ certificateNumber }}</p>
        <p class="text-black dark:text-gray-200">Patient: {{ consultation?.patient?.fullName || 'N/A' }}</p>
        <p class="text-black dark:text-gray-200">Date: {{ new Date().toLocaleDateString() }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Certificate {
  number?: string
  type?: string
  validDays?: number
}

interface Consultation {
  patient?: {
    fullName?: string
  }
}

const props = defineProps<{
  data: Certificate
  consultation?: Consultation
}>()

const emit = defineEmits<{
  'update:data': [value: Certificate]
}>()

const certificateNumber = ref<string>(props.data?.number || '')

const generateNumber = () => {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 999999).toString().padStart(6, '0')
  certificateNumber.value = `DG-${year}-${random}`
  
  emit('update:data', {
    ...(props.data || {}),
    number: certificateNumber.value
  })
}
</script>
