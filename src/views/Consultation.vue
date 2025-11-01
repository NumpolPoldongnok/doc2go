<template>
  <div class="max-w-4xl mx-auto p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl min-h-screen">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Medical Consultation</h1>
      <p class="text-gray-600 dark:text-gray-300">Complete the consultation workflow</p>
    </div>

    <!-- Minimal Step Indicator -->
    <div class="step-indicator">
      <div 
        v-for="step in steps" 
        :key="step.number"
        class="flex items-center"
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
        <div class="ml-3 hidden sm:block">
          <div class="text-sm font-medium text-gray-900">{{ step.title }}</div>
        </div>
        <div 
          v-if="step.number < steps.length" 
          class="w-16 h-px bg-gray-200 mx-4"
          :class="{ 'bg-green-400': currentStep > step.number }"
        ></div>
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
        :data="currentConsultation?.certificate || {}"
        :consultation="currentConsultation"
        @update:data="updateCertificate"
      />
      
      <!-- Step 4: Billing & Receipt -->
      <BillingForm 
        v-if="currentStep === 4" 
        :data="currentConsultation?.billing || { services: [], subtotal: 0, vatAmount: 0, total: 0, paymentMethod: '' }"
        @update:data="updateBilling"
      />
    </div>

    <!-- Navigation -->
    <div class="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
      <button 
        @click="previousStep"
        class="btn-secondary-minimal"
        :disabled="currentStep === 1"
        :class="{ 'opacity-50 cursor-not-allowed': currentStep === 1 }"
      >
        ← Previous
      </button>
      
      <div class="flex items-center space-x-4">
        <button 
          @click="saveDraft"
          class="btn-secondary-minimal"
        >
          💾 Save Draft
        </button>
        
        <button 
          v-if="currentStep < 4"
          @click="nextStep"
          class="btn-primary-minimal"
          :disabled="!canProceed"
          :class="{ 'opacity-50 cursor-not-allowed': !canProceed }"
        >
          Next →
        </button>
        
        <button 
          v-if="currentStep === 4"
          @click="completeConsultation"
          class="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
          :disabled="!canComplete"
          :class="{ 'opacity-50 cursor-not-allowed': !canComplete }"
        >
          ✓ Complete
        </button>
      </div>
    </div>

    <!-- Save success indicator -->
    <div v-if="showSaveSuccess" class="toast-minimal">
      <div class="flex items-center space-x-2 text-green-700">
        <span>✓</span>
        <span>Saved</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useConsultationStore } from '@/stores/consultation.ts'
import PatientForm from '@/components/PatientForm.vue'
import MedicalRecordForm from '@/components/MedicalRecordForm.vue'
import CertificateForm from '@/components/CertificateForm.vue'
import BillingForm from '@/components/BillingForm.vue'

interface Step {
  number: number
  title: string
}

const router = useRouter()
const consultationStore = useConsultationStore()

const showSaveSuccess = ref(false)

// Computed properties
const currentStep = computed(() => consultationStore.currentStep)
const currentConsultation = computed(() => consultationStore.currentConsultation)

const steps: Step[] = [
  { number: 1, title: 'Patient Info' },
  { number: 2, title: 'Medical Record' },
  { number: 3, title: 'Certificate' },
  { number: 4, title: 'Billing' }
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
         (currentConsultation.value?.billing?.services?.length || 0) > 0
})

// Methods
const updatePatient = (patientData: any) => {
  if (currentConsultation.value) {
    currentConsultation.value.patient = { ...patientData }
  }
}

const updateMedical = (medicalData: any) => {
  if (currentConsultation.value) {
    currentConsultation.value.medical = { ...medicalData }
  }
}

const updateCertificate = (certificateData: any) => {
  if (currentConsultation.value) {
    currentConsultation.value.certificate = { ...certificateData }
  }
}

const updateBilling = (billingData: any) => {
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

// Initialize consultation if none exists
onMounted(() => {
  if (!currentConsultation.value) {
    consultationStore.initializeConsultation()
  }
})

// Remove auto-save watcher since we don't want auto-save anymore
</script>

<style scoped>
.step-indicator {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
}

.step-circle {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 500;
}

.step-pending {
  background-color: #e5e7eb;
  color: #6b7280;
}

.step-active {
  background-color: #3b82f6;
  color: white;
}

.step-completed {
  background-color: #10b981;
  color: white;
}

.form-section {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.btn-primary-minimal {
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: none;
  cursor: pointer;
}

.btn-primary-minimal:hover {
  background-color: #2563eb;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.btn-secondary-minimal {
  background-color: #f3f4f6;
  color: #374151;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s;
  border: 1px solid #d1d5db;
  cursor: pointer;
}

.btn-secondary-minimal:hover {
  background-color: #e5e7eb;
}

.toast-minimal {
  position: fixed;
  top: 1rem;
  right: 1rem;
  background-color: #d1fae5;
  border: 1px solid #a7f3d0;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  z-index: 50;
}
</style>