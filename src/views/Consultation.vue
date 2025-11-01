<template>
  <div class="container mx-auto px-4">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2">🩺 Medical Consultation</h1>
      <p class="text-gray-600">Doctor2GO Digital Form System</p>
    </div>

    <!-- Step Indicator -->
    <div class="step-indicator mb-8">
      <div class="flex items-center w-full">
        <div 
          v-for="step in steps" 
          :key="step.number"
          class="flex items-center"
          :class="{ 'flex-1': step.number < steps.length }"
        >
          <div 
            class="step-circle"
            :class="{
              'step-active': currentStep === step.number,
              'step-completed': currentStep > step.number,
              'step-pending': currentStep < step.number
            }"
          >
            {{ step.number }}
          </div>
          <div class="ml-3 mr-6">
            <div class="font-medium">{{ step.title }}</div>
            <div class="text-sm text-gray-500">{{ step.description }}</div>
          </div>
          <div 
            v-if="step.number < steps.length" 
            class="flex-1 h-1 bg-gray-200 mx-4"
            :class="{ 'bg-success': currentStep > step.number }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Form Content -->
    <div class="form-section">
      <!-- Step 1: Patient Information -->
      <PatientForm 
        v-if="currentStep === 1" 
        :patient="currentConsultation?.patient"
        @update:patient="updatePatient"
      />
      
      <!-- Step 2: Medical Record -->
      <MedicalRecordForm 
        v-if="currentStep === 2" 
        :medical="currentConsultation?.medical"
        @update:medical="updateMedical"
      />
      
      <!-- Step 3: Certificate Generation -->
      <CertificateForm 
        v-if="currentStep === 3" 
        :consultation="currentConsultation"
        @update:certificate="updateCertificate"
      />
      
      <!-- Step 4: Billing & Receipt -->
      <BillingForm 
        v-if="currentStep === 4" 
        :billing="currentConsultation?.billing"
        :patient="currentConsultation?.patient"
        @update:billing="updateBilling"
      />
    </div>

    <!-- Navigation -->
    <div class="flex justify-between mt-8">
      <button 
        @click="previousStep"
        class="btn btn-outline"
        :disabled="currentStep === 1"
      >
        ← Previous
      </button>
      
      <div class="flex gap-4">
        <button 
          @click="saveDraft"
          class="btn btn-ghost"
        >
          💾 Save Draft
        </button>
        
        <button 
          v-if="currentStep < 4"
          @click="nextStep"
          class="btn btn-primary"
          :disabled="!canProceed"
        >
          Next →
        </button>
        
        <button 
          v-if="currentStep === 4"
          @click="completeConsultation"
          class="btn btn-success"
          :disabled="!canComplete"
        >
          ✅ Complete Consultation
        </button>
      </div>
    </div>

    <!-- Save success indicator -->
    <div v-if="showSaveSuccess" class="toast toast-end">
      <div class="alert alert-success">
        <span>✅ Saved</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useConsultationStore } from '@/stores/consultation'
import PatientForm from '@/components/PatientForm.vue'
import MedicalRecordForm from '@/components/MedicalRecordForm.vue'
import CertificateForm from '@/components/CertificateForm.vue'
import BillingForm from '@/components/BillingForm.vue'

const router = useRouter()
const consultationStore = useConsultationStore()

const showSaveSuccess = ref(false)

// Computed properties
const currentStep = computed(() => consultationStore.currentStep)
const currentConsultation = computed(() => consultationStore.currentConsultation)

const steps = [
  { 
    number: 1, 
    title: 'Patient Information', 
    description: 'Basic details & contact' 
  },
  { 
    number: 2, 
    title: 'Medical Record', 
    description: 'Diagnosis & treatment' 
  },
  { 
    number: 3, 
    title: 'Medical Certificate', 
    description: 'Generate certificate' 
  },
  { 
    number: 4, 
    title: 'Billing & Receipt', 
    description: 'Calculate & payment' 
  }
]

const canProceed = computed(() => {
  if (!currentConsultation.value) return false
  
  switch (currentStep.value) {
    case 1:
      const patient = currentConsultation.value.patient
      return patient.fullName && patient.gender && patient.age
    case 2:
      const medical = currentConsultation.value.medical
      return medical.diagnosis && medical.cause
    case 3:
      return currentConsultation.value.certificate.number
    case 4:
      return currentConsultation.value.billing.total > 0
    default:
      return false
  }
})

const canComplete = computed(() => {
  return canProceed.value && 
         currentConsultation.value?.billing.services.length > 0
})

// Methods
const updatePatient = (patientData) => {
  if (currentConsultation.value) {
    currentConsultation.value.patient = { ...patientData }
  }
}

const updateMedical = (medicalData) => {
  if (currentConsultation.value) {
    currentConsultation.value.medical = { ...medicalData }
  }
}

const updateCertificate = (certificateData) => {
  if (currentConsultation.value) {
    currentConsultation.value.certificate = { ...certificateData }
  }
}

const updateBilling = (billingData) => {
  if (currentConsultation.value) {
    currentConsultation.value.billing = { ...billingData }
  }
}

const nextStep = () => {
  consultationStore.nextStep()
}

const previousStep = () => {
  consultationStore.previousStep()
}

const saveDraft = () => {
  consultationStore.saveConsultation()
  showSaveSuccess.value = true
  setTimeout(() => {
    showSaveSuccess.value = false
  }, 2000)
}

const completeConsultation = () => {
  consultationStore.completeConsultation()
  showSaveSuccess.value = true
  setTimeout(() => {
    showSaveSuccess.value = false
    router.push('/')
  }, 1500)
}

// Auto-save with debouncing
let saveTimeout = null
const debouncedSave = () => {
  if (saveTimeout) clearTimeout(saveTimeout)
  
  isAutoSaving.value = true
  saveTimeout = setTimeout(() => {
    consultationStore.saveConsultation()
    isAutoSaving.value = false
    
    // Show success indicator briefly
    showSaveSuccess.value = true
    setTimeout(() => {
      showSaveSuccess.value = false
    }, 1500)
  }, 1000) // Reduced from 2000ms to 1000ms for faster response
}

// Initialize consultation if none exists
onMounted(() => {
  if (!currentConsultation.value) {
    consultationStore.initializeConsultation()
  }
})

// Remove auto-save watcher since we don't want auto-save anymore
</script>