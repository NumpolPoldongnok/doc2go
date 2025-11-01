<template>
  <div class="space-y-6">
    <div class="mb-8">
      <h2 class="text-2xl font-semibold text-gray-900 mb-2">Patient Information</h2>
      <p class="text-gray-600">Enter patient details or use quick fill options</p>
    </div>
    
    <!-- Quick Fill Options -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h3 class="text-lg font-medium text-blue-900 mb-3">Quick Fill Options</h3>
      <div class="flex flex-wrap gap-3">
        <button @click="scanPassport" class="btn-minimal-outline">
          📷 Scan Passport
        </button>
        <button @click="scanHotelQR" class="btn-minimal-outline">
          🏨 Hotel QR
        </button>
        <button @click="importFromPMS" class="btn-minimal-outline">
          💻 Import PMS
        </button>
      </div>
    </div>

    <!-- Patient Details Form -->
    <div class="bg-white border border-gray-200 rounded-lg p-6">
      <!-- Basic Information -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div class="form-field">
          <label class="field-label">Full Name *</label>
          <input 
            v-model="localPatient.fullName"
            type="text" 
            placeholder="Enter patient's full name"
            class="field-input"
            required
          />
        </div>
        
        <div class="form-field">
          <label class="field-label">Gender *</label>
          <select 
            v-model="localPatient.gender"
            class="field-input"
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div class="form-field">
          <label class="field-label">Age *</label>
          <input 
            v-model="localPatient.age"
            type="number" 
            placeholder="Age"
            class="field-input"
            min="0"
            max="120"
            required
          />
        </div>
        
        <div class="form-field">
          <label class="field-label">Nationality</label>
          <select 
            v-model="localPatient.nationality"
            class="field-input"
          >
            <option value="">Select Nationality</option>
            <option v-for="country in countries" :key="country" :value="country">
              {{ country }}
            </option>
          </select>
        </div>
      </div>

      <!-- Identification -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div class="form-field">
          <label class="field-label">Passport Number</label>
          <input 
            v-model="localPatient.passportNo"
            type="text" 
            placeholder="Passport number"
            class="field-input font-mono"
          />
        </div>
        
        <div class="form-field">
          <label class="field-label">Contact Number</label>
          <input 
            v-model="localPatient.contactNo"
            type="tel" 
            placeholder="Phone number"
            class="field-input"
          />
        </div>
      </div>

      <!-- Accommodation -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div class="form-field">
          <label class="field-label">Hotel / Accommodation</label>
          <input 
            v-model="localPatient.hotel"
            type="text" 
            placeholder="Hotel name or address"
            class="field-input"
          />
        </div>
        
        <div class="form-field">
          <label class="field-label">Room Number</label>
          <input 
            v-model="localPatient.roomNo"
            type="text" 
            placeholder="Room number"
            class="field-input"
          />
        </div>
      </div>

      <!-- Contact Information -->
      <div class="form-field">
        <label class="field-label">Email Address</label>
        <input 
          v-model="localPatient.email"
          type="email" 
          placeholder="email@example.com"
          class="field-input"
        />
      </div>
    </div>

    <!-- Patient ID Display -->
    <div class="bg-green-50 border border-green-200 rounded-lg p-4" v-if="patientId">
      <div class="flex items-center justify-between">
        <span class="font-mono font-medium text-green-800">Patient ID: {{ patientId }}</span>
        <button @click="copyPatientId" class="btn-minimal-outline text-sm">
          📋 Copy
        </button>
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

interface Patient {
  fullName: string
  gender: string
  age: string
  nationality: string
  passportNo: string
  hotel: string
  roomNo: string
  contactNo: string
  email: string
}

interface Props {
  patient?: Partial<Patient>
}

interface Emits {
  'update:patient': [patient: Patient]
}

const props = withDefaults(defineProps<Props>(), {
  patient: () => ({})
})

const emit = defineEmits<Emits>()

// Local reactive copy of patient data
const localPatient = ref<Patient>({
  fullName: '',
  gender: '',
  age: '',
  nationality: '',
  passportNo: '',
  hotel: '',
  roomNo: '',
  contactNo: '',
  email: '',
  ...props.patient
})

// Countries list (simplified)
const countries: string[] = [
  'Thailand', 'United States', 'United Kingdom', 'Germany', 'France',
  'Japan', 'China', 'South Korea', 'Singapore', 'Malaysia', 'Australia',
  'Canada', 'India', 'Philippines', 'Vietnam', 'Indonesia', 'Other'
]

// Computed patient ID
const patientId = computed((): string | null => {
  if (localPatient.value.fullName && localPatient.value.passportNo) {
    const name = localPatient.value.fullName.substring(0, 3).toUpperCase()
    const passport = localPatient.value.passportNo.slice(-4)
    const timestamp = Date.now().toString().slice(-4)
    return `P-${name}${passport}${timestamp}`
  }
  return null
})

// Validation
const validationErrors = computed((): string[] => {
  const errors: string[] = []
  
  if (!localPatient.value.fullName) {
    errors.push('Full name is required')
  }
  
  if (!localPatient.value.gender) {
    errors.push('Gender is required')
  }
  
  if (!localPatient.value.age) {
    errors.push('Age is required')
  }
  
  const ageNum = parseInt(localPatient.value.age)
  if (localPatient.value.age && (ageNum < 0 || ageNum > 120)) {
    errors.push('Age must be between 0 and 120')
  }
  
  return errors
})

// Methods
const scanPassport = (): void => {
  // Mock passport scanning
  const mockPassportData: Partial<Patient> = {
    fullName: 'John Smith',
    gender: 'Male',
    age: '35',
    nationality: 'United States',
    passportNo: 'US123456789'
  }
  
  Object.assign(localPatient.value, mockPassportData)
  alert('✅ Passport scanned successfully!')
}

const scanHotelQR = (): void => {
  // Mock hotel QR scanning
  const mockHotelData: Partial<Patient> = {
    hotel: 'Grand Palace Hotel Bangkok',
    roomNo: '1205',
    contactNo: '+66-2-123-4567'
  }
  
  Object.assign(localPatient.value, mockHotelData)
  alert('✅ Hotel information imported!')
}

const importFromPMS = (): void => {
  // Mock PMS import
  const mockPMSData: Partial<Patient> = {
    fullName: 'Maria Garcia',
    gender: 'Female',
    age: '28',
    nationality: 'Spain',
    passportNo: 'ES987654321',
    hotel: 'Riverside Resort',
    roomNo: '308',
    contactNo: '+34-600-123-456',
    email: 'maria.garcia@email.com'
  }
  
  Object.assign(localPatient.value, mockPMSData)
  alert('✅ Data imported from PMS system!')
}

const copyPatientId = async (): Promise<void> => {
  if (patientId.value) {
    try {
      await navigator.clipboard.writeText(patientId.value)
      alert('Patient ID copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }
}

// Watch for changes and emit to parent
watch(
  localPatient,
  (newValue) => {
    emit('update:patient', newValue)
  },
  { deep: true }
)

// Update local data when props change
watch(
  () => props.patient,
  (newPatient) => {
    if (newPatient) {
      Object.assign(localPatient.value, newPatient)
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