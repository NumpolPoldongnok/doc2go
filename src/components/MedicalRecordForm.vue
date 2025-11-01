<template>
  <div class="space-y-6">
    <div class="mb-8">
      <h2 class="text-2xl font-semibold text-gray-900 mb-2">Medical Record</h2>
      <p class="text-gray-600">Document diagnosis, treatment, and medical advice</p>
    </div>

    <!-- Diagnosis Section -->
    <div class="bg-white border border-gray-200 rounded-lg p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Primary Diagnosis</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div class="form-field">
          <label class="field-label">Diagnosis *</label>
          <textarea 
            v-model="localMedical.diagnosis"
            class="field-textarea"
            placeholder="Enter primary diagnosis..."
            rows="3"
            required
          ></textarea>
        </div>
        
        <div class="form-field">
          <label class="field-label">ICD-10 Code (Optional)</label>
          <input 
            v-model="localMedical.icd10"
            type="text" 
            placeholder="e.g., J00.9"
            class="field-input font-mono"
          />
          <button @click="showICD10Helper" class="text-blue-600 hover:text-blue-700 text-sm mt-1">
            🔍 Search ICD-10 codes
          </button>
        </div>
      </div>

      <div class="form-field">
        <label class="field-label">Cause / Etiology *</label>
        <select 
          v-model="localMedical.cause"
          class="field-input"
          @change="updateCauseOther"
          required
        >
          <option value="">Select cause</option>
          <option value="Viral infection">Viral infection</option>
          <option value="Bacterial infection">Bacterial infection</option>
          <option value="Slip & fall injury">Slip & fall injury</option>
          <option value="Food poisoning">Food poisoning</option>
          <option value="Heat exhaustion">Heat exhaustion</option>
          <option value="Motion sickness">Motion sickness</option>
          <option value="Allergic reaction">Allergic reaction</option>
          <option value="Chronic condition flare-up">Chronic condition flare-up</option>
          <option value="Other">Other (specify)</option>
        </select>
        
        <input 
          v-if="localMedical.cause === 'Other'"
          v-model="localMedical.causeOther"
          type="text" 
          placeholder="Please specify the cause"
          class="field-input mt-2"
        />
      </div>
    </div>

    <!-- Treatment Section -->
    <div class="bg-white border border-gray-200 rounded-lg p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Treatment & Procedures</h3>
      
      <div class="space-y-4">
        <div class="form-field">
          <label class="field-label">Treatment Provided</label>
          <textarea 
            v-model="localMedical.treatment"
            class="field-textarea"
            placeholder="Describe treatment provided..."
            rows="3"
          ></textarea>
        </div>

        <div class="form-field">
          <label class="field-label">Medication Prescribed</label>
          <textarea 
            v-model="localMedical.medication"
            class="field-textarea"
            placeholder="List medications with dosage..."
            rows="2"
          ></textarea>
        </div>

        <div class="form-field">
          <label class="field-label">Procedures Performed</label>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
            <label 
              v-for="procedure in availableProcedures" 
              :key="procedure"
              class="flex items-center space-x-2 cursor-pointer"
            >
              <input 
                type="checkbox" 
                :value="procedure"
                v-model="localMedical.procedures"
                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
              />
              <span class="text-sm text-gray-700">{{ procedure }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Medical Advice Section -->
    <div class="bg-white border border-gray-200 rounded-lg p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Medical Advice</h3>
      
      <div class="space-y-4">
        <!-- Fit to Travel -->
        <label class="flex items-center space-x-3 cursor-pointer">
          <input 
            type="checkbox" 
            v-model="localMedical.advice.fitToTravel"
            class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500" 
          />
          <span class="text-sm text-gray-700">✈️ Fit to travel</span>
        </label>

        <!-- Fit to Fly -->
        <div class="border border-gray-200 rounded-lg p-4">
          <label class="flex items-center space-x-3 cursor-pointer mb-2">
            <input 
              type="checkbox" 
              v-model="localMedical.advice.fitToFly"
              class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500" 
            />
            <span class="text-sm text-gray-700">🛫 Fit to fly</span>
          </label>
          
          <div v-if="!localMedical.advice.fitToFly" class="ml-7">
            <label class="field-label text-sm">Unfit to fly until:</label>
            <input 
              v-model="localMedical.advice.unfitToFlyUntil"
              type="date" 
              class="field-input text-sm"
            />
          </div>
        </div>

        <!-- Fit to Work -->
        <div class="border border-gray-200 rounded-lg p-4">
          <label class="flex items-center space-x-3 cursor-pointer mb-2">
            <input 
              type="checkbox" 
              v-model="localMedical.advice.fitToWork"
              class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500" 
            />
            <span class="text-sm text-gray-700">💼 Fit to work</span>
          </label>
          
          <div v-if="!localMedical.advice.fitToWork" class="ml-7 flex items-center space-x-2">
            <label class="field-label text-sm">Unfit to work for:</label>
            <input 
              v-model="localMedical.advice.unfitToWorkDays"
              type="number" 
              min="1"
              max="365"
              class="field-input text-sm w-20"
            />
            <span class="text-sm text-gray-500">days</span>
          </div>
        </div>

        <!-- Hospital Admission -->
        <label class="flex items-center space-x-3 cursor-pointer">
          <input 
            type="checkbox" 
            v-model="localMedical.advice.hospitalAdmission"
            class="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" 
          />
          <span class="text-sm text-gray-700">🏥 Hospital admission advised</span>
        </label>
      </div>
    </div>

    <!-- Additional Notes -->
    <div class="bg-white border border-gray-200 rounded-lg p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Additional Notes</h3>
      
      <div class="form-field">
        <label class="field-label">Remarks / Special Instructions</label>
        <textarea 
          v-model="localMedical.remarks"
          class="field-textarea"
          placeholder="Any additional notes, follow-up instructions, or special considerations..."
          rows="3"
        ></textarea>
      </div>
    </div>

    <!-- Supporting Documents -->
    <div class="bg-white border border-gray-200 rounded-lg p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Supporting Documents</h3>
      
      <div class="space-y-4">
        <div class="flex flex-wrap gap-3">
          <button @click="capturePhoto" class="btn-minimal-outline">
            📷 Take Photo
          </button>
          <button @click="uploadDocument" class="btn-minimal-outline">
            📄 Upload Document
          </button>
          <button @click="attachVitalSigns" class="btn-minimal-outline">
            🩺 Attach Vital Signs
          </button>
        </div>
        
        <!-- Attachment Preview -->
        <div v-if="localMedical.attachments.length > 0" class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div 
            v-for="(attachment, index) in localMedical.attachments" 
            :key="index"
            class="relative border-2 border-dashed border-gray-300 rounded-lg p-4 text-center"
          >
            <div class="text-2xl mb-2">{{ getAttachmentIcon(attachment.type) }}</div>
            <div class="text-sm font-medium">{{ attachment.name }}</div>
            <div class="text-xs text-gray-500">{{ attachment.size }}</div>
            <button 
              @click="removeAttachment(index)"
              class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Validation Summary -->
    <div class="bg-amber-50 border border-amber-200 rounded-lg p-4" v-if="validationErrors.length > 0">
      <h4 class="font-medium text-amber-800 mb-2">Please complete the following:</h4>
      <ul class="list-disc list-inside text-sm text-amber-700 space-y-1">
        <li v-for="error in validationErrors" :key="error">
          {{ error }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface MedicalAdvice {
  fitToTravel: boolean
  fitToFly: boolean
  unfitToFlyUntil: string
  fitToWork: boolean
  unfitToWorkDays: string
  hospitalAdmission: boolean
}

interface Attachment {
  type: string
  name: string
  size: string
  url?: string
}

interface Medical {
  diagnosis: string
  icd10: string
  cause: string
  causeOther: string
  treatment: string
  medication: string
  procedures: string[]
  advice: MedicalAdvice
  remarks: string
  attachments: Attachment[]
}

interface Props {
  medical?: Partial<Medical>
}

interface Emits {
  'update:medical': [medical: Medical]
}

const props = withDefaults(defineProps<Props>(), {
  medical: () => ({})
})

const emit = defineEmits<Emits>()

// Local reactive copy of medical data
const localMedical = ref<Medical>({
  diagnosis: '',
  icd10: '',
  cause: '',
  causeOther: '',
  treatment: '',
  medication: '',
  procedures: [],
  advice: {
    fitToTravel: false,
    fitToFly: false,
    unfitToFlyUntil: '',
    fitToWork: false,
    unfitToWorkDays: '',
    hospitalAdmission: false
  },
  remarks: '',
  attachments: [],
  ...props.medical
})

const availableProcedures: string[] = [
  'Physical examination',
  'Vital signs monitoring',
  'Blood pressure check',
  'Temperature measurement',
  'Wound cleaning & dressing',
  'Injection/IV administration',
  'Oxygen therapy',
  'ECG recording',
  'Blood glucose test',
  'Rapid diagnostic test'
]

// Validation
const validationErrors = computed((): string[] => {
  const errors: string[] = []
  
  if (!localMedical.value.diagnosis) {
    errors.push('Primary diagnosis is required')
  }
  
  if (!localMedical.value.cause) {
    errors.push('Cause/etiology is required')
  }
  
  if (localMedical.value.cause === 'Other' && !localMedical.value.causeOther) {
    errors.push('Please specify the cause when "Other" is selected')
  }
  
  return errors
})

// Methods
const updateCauseOther = (): void => {
  if (localMedical.value.cause !== 'Other') {
    localMedical.value.causeOther = ''
  }
}

const showICD10Helper = (): void => {
  // Mock ICD-10 search - in real app would open a modal or external tool
  const commonCodes: Record<string, string> = {
    'J00.9': 'Acute nasopharyngitis, unspecified',
    'K59.00': 'Constipation, unspecified',
    'R50.9': 'Fever, unspecified',
    'S90.90': 'Unspecified superficial injury of foot',
    'T78.40': 'Allergy, unspecified'
  }
  
  const selectedCode = prompt(
    'Common ICD-10 codes:\n' + 
    Object.entries(commonCodes).map(([code, desc]) => `${code}: ${desc}`).join('\n') +
    '\n\nEnter code:'
  )
  
  if (selectedCode && commonCodes[selectedCode]) {
    localMedical.value.icd10 = selectedCode
  }
}

const capturePhoto = (): void => {
  // Mock photo capture
  const mockPhoto: Attachment = {
    type: 'photo',
    name: `Photo_${Date.now()}.jpg`,
    size: '2.1 MB',
    url: '#'
  }
  localMedical.value.attachments.push(mockPhoto)
}

const uploadDocument = (): void => {
  // Mock document upload
  const mockDoc: Attachment = {
    type: 'document',
    name: `X-ray_${Date.now()}.pdf`,
    size: '1.5 MB',
    url: '#'
  }
  localMedical.value.attachments.push(mockDoc)
}

const attachVitalSigns = (): void => {
  // Mock vital signs attachment
  const mockVitals: Attachment = {
    type: 'vitals',
    name: `VitalSigns_${Date.now()}.json`,
    size: '0.1 MB',
    url: '#'
  }
  localMedical.value.attachments.push(mockVitals)
}

const getAttachmentIcon = (type: string): string => {
  switch (type) {
    case 'photo': return '📷'
    case 'document': return '📄'
    case 'vitals': return '🩺'
    default: return '📎'
  }
}

const removeAttachment = (index: number): void => {
  localMedical.value.attachments.splice(index, 1)
}

// Watch for changes and emit to parent
watch(
  localMedical,
  (newValue) => {
    emit('update:medical', newValue)
  },
  { deep: true }
)

// Update local data when props change
watch(
  () => props.medical,
  (newMedical) => {
    if (newMedical) {
      Object.assign(localMedical.value, newMedical)
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.form-field {
  display: flex;
  flex-direction: column;
}

.field-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.field-input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: border-color 0.2s;
  background-color: white;
}

.field-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.field-textarea {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: border-color 0.2s;
  background-color: white;
  resize: vertical;
}

.field-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.btn-minimal-outline {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: white;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-minimal-outline:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  background-color: #f8fafc;
}
</style>