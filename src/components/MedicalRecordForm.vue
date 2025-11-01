<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold mb-6">🏥 Medical Record</h2>

    <!-- Diagnosis Section -->
    <div class="medical-advice-card">
      <h3 class="text-lg font-semibold mb-4">Primary Diagnosis</h3>
      
      <div class="field-group">
        <div class="form-control">
          <label class="label">
            <span class="label-text">Diagnosis *</span>
          </label>
          <textarea 
            v-model="localMedical.diagnosis"
            class="textarea textarea-bordered h-24"
            placeholder="Enter primary diagnosis..."
            required
          ></textarea>
        </div>
        
        <div class="form-control">
          <label class="label">
            <span class="label-text">ICD-10 Code (Optional)</span>
          </label>
          <input 
            v-model="localMedical.icd10"
            type="text" 
            placeholder="e.g., J00.9"
            class="input input-bordered w-full font-mono"
          />
          <label class="label">
            <span class="label-text-alt">
              <button @click="showICD10Helper" class="link link-primary">
                🔍 Search ICD-10 codes
              </button>
            </span>
          </label>
        </div>
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Cause / Etiology *</span>
        </label>
        <select 
          v-model="localMedical.cause"
          class="select select-bordered w-full"
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
          class="input input-bordered w-full mt-2"
        />
      </div>
    </div>

    <!-- Treatment Section -->
    <div class="medical-advice-card">
      <h3 class="text-lg font-semibold mb-4">Treatment & Procedures</h3>
      
      <div class="form-control mb-4">
        <label class="label">
          <span class="label-text">Treatment Provided</span>
        </label>
        <textarea 
          v-model="localMedical.treatment"
          class="textarea textarea-bordered h-24"
          placeholder="Describe treatment provided..."
        ></textarea>
      </div>

      <div class="form-control mb-4">
        <label class="label">
          <span class="label-text">Medication Prescribed</span>
        </label>
        <textarea 
          v-model="localMedical.medication"
          class="textarea textarea-bordered h-20"
          placeholder="List medications with dosage..."
        ></textarea>
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Procedures Performed</span>
        </label>
        <div class="flex flex-wrap gap-2 mb-2">
          <label 
            v-for="procedure in availableProcedures" 
            :key="procedure"
            class="label cursor-pointer flex items-center gap-2"
          >
            <input 
              type="checkbox" 
              :value="procedure"
              v-model="localMedical.procedures"
              class="checkbox checkbox-primary checkbox-sm" 
            />
            <span class="label-text">{{ procedure }}</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Medical Advice Section -->
    <div class="medical-advice-card">
      <h3 class="text-lg font-semibold mb-4">Medical Advice</h3>
      
      <div class="space-y-4">
        <!-- Fit to Travel -->
        <label class="label cursor-pointer justify-start gap-4">
          <input 
            type="checkbox" 
            v-model="localMedical.advice.fitToTravel"
            class="checkbox checkbox-success" 
          />
          <span class="label-text">✈️ Fit to travel</span>
        </label>

        <!-- Fit to Fly -->
        <div class="border border-base-300 rounded-lg p-4">
          <label class="label cursor-pointer justify-start gap-4 mb-2">
            <input 
              type="checkbox" 
              v-model="localMedical.advice.fitToFly"
              class="checkbox checkbox-success" 
            />
            <span class="label-text">🛫 Fit to fly</span>
          </label>
          
          <div v-if="!localMedical.advice.fitToFly" class="ml-8">
            <label class="label">
              <span class="label-text">Unfit to fly until:</span>
            </label>
            <input 
              v-model="localMedical.advice.unfitToFlyUntil"
              type="date" 
              class="input input-bordered input-sm"
            />
          </div>
        </div>

        <!-- Fit to Work -->
        <div class="border border-base-300 rounded-lg p-4">
          <label class="label cursor-pointer justify-start gap-4 mb-2">
            <input 
              type="checkbox" 
              v-model="localMedical.advice.fitToWork"
              class="checkbox checkbox-success" 
            />
            <span class="label-text">💼 Fit to work</span>
          </label>
          
          <div v-if="!localMedical.advice.fitToWork" class="ml-8">
            <label class="label">
              <span class="label-text">Unfit to work for (days):</span>
            </label>
            <input 
              v-model="localMedical.advice.unfitToWorkDays"
              type="number" 
              min="1"
              max="365"
              class="input input-bordered input-sm w-24"
            />
            <span class="ml-2 text-sm text-gray-500">days</span>
          </div>
        </div>

        <!-- Hospital Admission -->
        <label class="label cursor-pointer justify-start gap-4">
          <input 
            type="checkbox" 
            v-model="localMedical.advice.hospitalAdmission"
            class="checkbox checkbox-error" 
          />
          <span class="label-text">🏥 Hospital admission advised</span>
        </label>
      </div>
    </div>

    <!-- Additional Notes -->
    <div class="medical-advice-card">
      <h3 class="text-lg font-semibold mb-4">Additional Notes</h3>
      
      <div class="form-control">
        <label class="label">
          <span class="label-text">Remarks / Special Instructions</span>
        </label>
        <textarea 
          v-model="localMedical.remarks"
          class="textarea textarea-bordered h-24"
          placeholder="Any additional notes, follow-up instructions, or special considerations..."
        ></textarea>
      </div>
    </div>

    <!-- Attachments Section -->
    <div class="medical-advice-card">
      <h3 class="text-lg font-semibold mb-4">Supporting Documents</h3>
      
      <div class="space-y-4">
        <div class="flex flex-wrap gap-4">
          <button @click="capturePhoto" class="btn btn-outline btn-primary">
            📷 Take Photo
          </button>
          <button @click="uploadDocument" class="btn btn-outline btn-secondary">
            📄 Upload Document
          </button>
          <button @click="attachVitalSigns" class="btn btn-outline btn-accent">
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
              class="absolute -top-2 -right-2 btn btn-circle btn-xs btn-error"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Validation Summary -->
    <div class="card bg-warning/10 border border-warning" v-if="validationErrors.length > 0">
      <div class="card-body">
        <h4 class="font-bold text-warning">Please complete the following:</h4>
        <ul class="list-disc list-inside text-sm">
          <li v-for="error in validationErrors" :key="error" class="text-warning">
            {{ error }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  medical: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:medical'])

// Local reactive copy of medical data
const localMedical = ref({
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

const availableProcedures = [
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
const validationErrors = computed(() => {
  const errors = []
  
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
const updateCauseOther = () => {
  if (localMedical.value.cause !== 'Other') {
    localMedical.value.causeOther = ''
  }
}

const showICD10Helper = () => {
  // Mock ICD-10 search - in real app would open a modal or external tool
  const commonCodes = {
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

const capturePhoto = () => {
  // Mock photo capture
  const mockPhoto = {
    type: 'photo',
    name: `Photo_${Date.now()}.jpg`,
    size: '2.1 MB',
    url: '#'
  }
  localMedical.value.attachments.push(mockPhoto)
}

const uploadDocument = () => {
  // Mock document upload
  const mockDoc = {
    type: 'document',
    name: `X-ray_${Date.now()}.pdf`,
    size: '1.5 MB',
    url: '#'
  }
  localMedical.value.attachments.push(mockDoc)
}

const attachVitalSigns = () => {
  // Mock vital signs attachment
  const mockVitals = {
    type: 'vitals',
    name: `VitalSigns_${Date.now()}.json`,
    size: '0.1 MB',
    url: '#'
  }
  localMedical.value.attachments.push(mockVitals)
}

const getAttachmentIcon = (type) => {
  switch (type) {
    case 'photo': return '📷'
    case 'document': return '📄'
    case 'vitals': return '🩺'
    default: return '📎'
  }
}

const removeAttachment = (index) => {
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
    Object.assign(localMedical.value, newMedical)
  },
  { immediate: true }
)
</script>