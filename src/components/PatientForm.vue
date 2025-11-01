<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold mb-6">👤 Patient Information</h2>
    
    <!-- QR Scanner / Auto-fill Section -->
    <div class="card bg-base-100 border-2 border-dashed border-primary">
      <div class="card-body">
        <h3 class="card-title text-primary">Quick Fill Options</h3>
        <div class="flex flex-wrap gap-4">
          <button @click="scanPassport" class="btn btn-outline btn-primary">
            📷 Scan Passport
          </button>
          <button @click="scanHotelQR" class="btn btn-outline btn-secondary">
            🏨 Scan Hotel QR
          </button>
          <button @click="importFromPMS" class="btn btn-outline btn-accent">
            💻 Import from PMS
          </button>
        </div>
      </div>
    </div>

    <!-- Patient Details Form -->
    <div class="medical-form">
      <!-- Basic Information -->
      <div class="field-group">
        <div class="form-control">
          <label class="label">
            <span class="label-text">Full Name *</span>
          </label>
          <input 
            v-model="localPatient.fullName"
            type="text" 
            placeholder="Enter patient's full name"
            class="input input-bordered w-full"
            required
          />
        </div>
        
        <div class="form-control">
          <label class="label">
            <span class="label-text">Gender *</span>
          </label>
          <select 
            v-model="localPatient.gender"
            class="select select-bordered w-full"
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div class="field-group">
        <div class="form-control">
          <label class="label">
            <span class="label-text">Age *</span>
          </label>
          <input 
            v-model="localPatient.age"
            type="number" 
            placeholder="Age"
            class="input input-bordered w-full"
            min="0"
            max="120"
            required
          />
        </div>
        
        <div class="form-control">
          <label class="label">
            <span class="label-text">Nationality</span>
          </label>
          <select 
            v-model="localPatient.nationality"
            class="select select-bordered w-full"
          >
            <option value="">Select Nationality</option>
            <option v-for="country in countries" :key="country" :value="country">
              {{ country }}
            </option>
          </select>
        </div>
      </div>

      <!-- Identification -->
      <div class="field-group">
        <div class="form-control">
          <label class="label">
            <span class="label-text">Passport Number</span>
          </label>
          <input 
            v-model="localPatient.passportNo"
            type="text" 
            placeholder="Passport number"
            class="input input-bordered w-full font-mono"
          />
        </div>
        
        <div class="form-control">
          <label class="label">
            <span class="label-text">Contact Number</span>
          </label>
          <input 
            v-model="localPatient.contactNo"
            type="tel" 
            placeholder="Phone number"
            class="input input-bordered w-full"
          />
        </div>
      </div>

      <!-- Accommodation -->
      <div class="field-group">
        <div class="form-control">
          <label class="label">
            <span class="label-text">Hotel / Accommodation</span>
          </label>
          <input 
            v-model="localPatient.hotel"
            type="text" 
            placeholder="Hotel name or address"
            class="input input-bordered w-full"
          />
        </div>
        
        <div class="form-control">
          <label class="label">
            <span class="label-text">Room Number</span>
          </label>
          <input 
            v-model="localPatient.roomNo"
            type="text" 
            placeholder="Room number"
            class="input input-bordered w-full"
          />
        </div>
      </div>

      <!-- Contact Information -->
      <div class="form-control">
        <label class="label">
          <span class="label-text">Email Address</span>
        </label>
        <input 
          v-model="localPatient.email"
          type="email" 
          placeholder="email@example.com"
          class="input input-bordered w-full"
        />
      </div>
    </div>

    <!-- Patient ID Display -->
    <div class="alert alert-info" v-if="patientId">
      <div class="flex items-center">
        <span class="font-mono font-bold">Patient ID: {{ patientId }}</span>
        <button @click="copyPatientId" class="btn btn-sm btn-ghost ml-4">
          📋 Copy
        </button>
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
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps({
  patient: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:patient'])

// Local reactive copy of patient data
const localPatient = ref({
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
const countries = [
  'Thailand', 'United States', 'United Kingdom', 'Germany', 'France',
  'Japan', 'China', 'South Korea', 'Singapore', 'Malaysia', 'Australia',
  'Canada', 'India', 'Philippines', 'Vietnam', 'Indonesia', 'Other'
]

// Computed patient ID
const patientId = computed(() => {
  if (localPatient.value.fullName && localPatient.value.passportNo) {
    const name = localPatient.value.fullName.substring(0, 3).toUpperCase()
    const passport = localPatient.value.passportNo.substring(-4)
    const timestamp = Date.now().toString().substring(-4)
    return `P-${name}${passport}${timestamp}`
  }
  return null
})

// Validation
const validationErrors = computed(() => {
  const errors = []
  
  if (!localPatient.value.fullName) {
    errors.push('Full name is required')
  }
  
  if (!localPatient.value.gender) {
    errors.push('Gender is required')
  }
  
  if (!localPatient.value.age) {
    errors.push('Age is required')
  }
  
  if (localPatient.value.age && (localPatient.value.age < 0 || localPatient.value.age > 120)) {
    errors.push('Age must be between 0 and 120')
  }
  
  return errors
})

// Methods
const scanPassport = () => {
  // Mock passport scanning
  const mockPassportData = {
    fullName: 'John Smith',
    gender: 'Male',
    age: '35',
    nationality: 'United States',
    passportNo: 'US123456789'
  }
  
  Object.assign(localPatient.value, mockPassportData)
  alert('✅ Passport scanned successfully!')
}

const scanHotelQR = () => {
  // Mock hotel QR scanning
  const mockHotelData = {
    hotel: 'Grand Palace Hotel Bangkok',
    roomNo: '1205',
    contactNo: '+66-2-123-4567'
  }
  
  Object.assign(localPatient.value, mockHotelData)
  alert('✅ Hotel information imported!')
}

const importFromPMS = () => {
  // Mock PMS import
  const mockPMSData = {
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

const copyPatientId = () => {
  navigator.clipboard.writeText(patientId.value)
  alert('Patient ID copied to clipboard!')
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
    Object.assign(localPatient.value, newPatient)
  },
  { immediate: true }
)
</script>