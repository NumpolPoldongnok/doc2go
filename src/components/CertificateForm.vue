<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold mb-6">📄 Medical Certificate Generation</h2>

    <!-- Certificate Generation Controls -->
    <div class="medical-advice-card">
      <h3 class="text-lg font-semibold mb-4">Certificate Details</h3>
      
      <div class="field-group">
        <div class="form-control">
          <label class="label">
            <span class="label-text">Certificate Number</span>
          </label>
          <div class="flex gap-2">
            <input 
              v-model="localCertificate.number"
              type="text" 
              class="input input-bordered w-full font-mono"
              :placeholder="suggestedCertNumber"
              readonly
            />
            <button 
              @click="generateCertificateNumber"
              class="btn btn-primary"
            >
              🔄 Generate
            </button>
          </div>
        </div>
        
        <div class="form-control">
          <label class="label">
            <span class="label-text">Issue Date</span>
          </label>
          <input 
            v-model="issueDate"
            type="datetime-local" 
            class="input input-bordered w-full"
          />
        </div>
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Issuing Doctor</span>
        </label>
        <select 
          v-model="selectedDoctor"
          class="select select-bordered w-full"
        >
          <option value="">Select Doctor</option>
          <option v-for="doctor in availableDoctors" :key="doctor.id" :value="doctor">
            Dr. {{ doctor.name }} - {{ doctor.specialty }}
          </option>
        </select>
      </div>
    </div>

    <!-- Certificate Preview -->
    <div class="medical-advice-card">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Certificate Preview</h3>
        <div class="flex gap-2">
          <button 
            @click="previewCertificate"
            class="btn btn-outline btn-primary"
            :disabled="!canGenerate"
          >
            👁️ Preview
          </button>
          <button 
            @click="generateCertificate"
            class="btn btn-primary"
            :disabled="!canGenerate"
          >
            📄 Generate Certificate
          </button>
        </div>
      </div>

      <!-- Certificate Template -->
      <div 
        id="certificate-preview"
        class="certificate-preview"
        :class="{ 'border-success': localCertificate.generated }"
      >
        <div class="text-center mb-6">
          <div class="text-2xl font-bold text-primary">🩺 DOCTOR2GO</div>
          <div class="text-lg font-semibold">MEDICAL CERTIFICATE</div>
          <div class="text-sm text-gray-600">Digital Medical Consultation Services</div>
        </div>

        <div class="border-t-2 border-b-2 border-primary py-4 mb-4">
          <div class="text-center font-mono text-lg">
            Certificate No: {{ localCertificate.number || 'DG-YYYY-XXXXXX' }}
          </div>
        </div>

        <div class="space-y-4 text-sm">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <strong>Patient Name:</strong><br>
              {{ consultation?.patient?.fullName || '[Patient Name]' }}
            </div>
            <div>
              <strong>Date of Examination:</strong><br>
              {{ formatDate(issueDate) }}
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <strong>Gender:</strong> {{ consultation?.patient?.gender || '[Gender]' }}
            </div>
            <div>
              <strong>Age:</strong> {{ consultation?.patient?.age || '[Age]' }} years
            </div>
          </div>

          <div>
            <strong>Nationality:</strong> {{ consultation?.patient?.nationality || '[Nationality]' }}
          </div>

          <div>
            <strong>Passport Number:</strong> {{ consultation?.patient?.passportNo || '[Passport No.]' }}
          </div>

          <div class="border-t pt-4">
            <strong>Medical Findings & Diagnosis:</strong><br>
            <div class="mt-2 p-3 bg-gray-50 rounded">
              {{ consultation?.medical?.diagnosis || '[Diagnosis will appear here]' }}
            </div>
          </div>

          <div>
            <strong>Medical Advice:</strong><br>
            <div class="mt-2 p-3 bg-gray-50 rounded">
              <div v-if="consultation?.medical?.advice?.fitToTravel" class="mb-2">
                ✅ Patient is fit to travel
              </div>
              <div v-if="consultation?.medical?.advice?.fitToFly" class="mb-2">
                ✅ Patient is fit to fly
              </div>
              <div v-else-if="consultation?.medical?.advice?.unfitToFlyUntil" class="mb-2">
                ❌ Patient is unfit to fly until {{ consultation.medical.advice.unfitToFlyUntil }}
              </div>
              <div v-if="consultation?.medical?.advice?.fitToWork" class="mb-2">
                ✅ Patient is fit to work
              </div>
              <div v-else-if="consultation?.medical?.advice?.unfitToWorkDays" class="mb-2">
                ❌ Patient is unfit to work for {{ consultation.medical.advice.unfitToWorkDays }} days
              </div>
              <div v-if="consultation?.medical?.advice?.hospitalAdmission" class="mb-2">
                🏥 Hospital admission recommended
              </div>
            </div>
          </div>

          <div v-if="consultation?.medical?.remarks">
            <strong>Additional Remarks:</strong><br>
            <div class="mt-2 p-3 bg-gray-50 rounded">
              {{ consultation.medical.remarks }}
            </div>
          </div>
        </div>

        <div class="flex justify-between items-end mt-8 pt-4 border-t">
          <div class="text-center">
            <div class="mb-2">
              <canvas 
                ref="qrCanvas" 
                width="100" 
                height="100"
                class="border"
              ></canvas>
            </div>
            <div class="text-xs">
              Verify at:<br>
              doctor2go.net/verify
            </div>
          </div>
          
          <div class="text-center">
            <div class="h-16 border-b-2 border-gray-400 mb-2 flex items-end justify-center">
              <span v-if="selectedDoctor" class="text-sm font-semibold">
                {{ selectedDoctor.signature || 'Digital Signature' }}
              </span>
            </div>
            <div class="text-sm">
              <strong>{{ selectedDoctor?.name || '[Doctor Name]' }}</strong><br>
              {{ selectedDoctor?.specialty || '[Specialty]' }}<br>
              License No: {{ selectedDoctor?.license || '[License No.]' }}
            </div>
          </div>
        </div>

        <div class="text-center mt-4 text-xs text-gray-500">
          Generated on: {{ formatDate(new Date()) }}<br>
          This certificate is digitally signed and can be verified online.
        </div>
      </div>
    </div>

    <!-- QR Code Details -->
    <div class="medical-advice-card" v-if="localCertificate.qrCode">
      <h3 class="text-lg font-semibold mb-4">Verification Details</h3>
      
      <div class="flex items-center gap-4">
        <canvas 
          ref="qrDisplayCanvas" 
          width="150" 
          height="150"
          class="border rounded"
        ></canvas>
        
        <div class="flex-1">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Verification URL</span>
            </label>
            <div class="flex gap-2">
              <input 
                :value="verificationUrl"
                type="text" 
                class="input input-bordered w-full font-mono text-sm"
                readonly
              />
              <button 
                @click="copyVerificationUrl"
                class="btn btn-outline btn-sm"
              >
                📋
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex gap-4" v-if="localCertificate.generated">
      <button @click="downloadPDF" class="btn btn-success">
        📥 Download PDF
      </button>
      <button @click="emailCertificate" class="btn btn-primary">
        📧 Email Certificate
      </button>
      <button @click="printCertificate" class="btn btn-outline">
        🖨️ Print
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import QRCode from 'qrcode'
import { format } from 'date-fns'

const props = defineProps({
  consultation: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:certificate'])

// Refs
const qrCanvas = ref(null)
const qrDisplayCanvas = ref(null)

// Local state
const localCertificate = ref({
  number: '',
  qrCode: '',
  digitalSignature: '',
  generatedAt: null,
  generated: false,
  ...props.consultation?.certificate
})

const issueDate = ref(format(new Date(), "yyyy-MM-dd'T'HH:mm"))
const selectedDoctor = ref(null)

// Available doctors (mock data)
const availableDoctors = [
  {
    id: 1,
    name: 'Sarah Johnson',
    specialty: 'General Practice',
    license: 'GP-2024-001',
    signature: 'Dr. S. Johnson'
  },
  {
    id: 2,
    name: 'Michael Chen',
    specialty: 'Emergency Medicine',
    license: 'EM-2024-002',
    signature: 'Dr. M. Chen'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    specialty: 'Family Medicine',
    license: 'FM-2024-003',
    signature: 'Dr. E. Rodriguez'
  }
]

// Computed properties
const suggestedCertNumber = computed(() => {
  const year = new Date().getFullYear()
  const sequence = String(Math.floor(Math.random() * 999999) + 1).padStart(6, '0')
  return `DG-${year}-${sequence}`
})

const canGenerate = computed(() => {
  return props.consultation?.patient?.fullName && 
         props.consultation?.medical?.diagnosis &&
         selectedDoctor.value
})

const verificationUrl = computed(() => {
  return localCertificate.value.number 
    ? `https://doctor2go.net/verify?cert=${localCertificate.value.number}`
    : ''
})

// Methods
const generateCertificateNumber = () => {
  localCertificate.value.number = suggestedCertNumber.value
}

const generateQRCode = async (text) => {
  try {
    const canvas = qrCanvas.value
    if (canvas) {
      await QRCode.toCanvas(canvas, text, {
        width: 100,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
    }
    
    const displayCanvas = qrDisplayCanvas.value
    if (displayCanvas) {
      await QRCode.toCanvas(displayCanvas, text, {
        width: 150,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
    }
  } catch (error) {
    console.error('QR Code generation failed:', error)
  }
}

const previewCertificate = () => {
  if (!localCertificate.value.number) {
    generateCertificateNumber()
  }
  
  // Generate QR code for verification
  if (localCertificate.value.number) {
    const verifyUrl = `https://doctor2go.net/verify?cert=${localCertificate.value.number}`
    generateQRCode(verifyUrl)
    localCertificate.value.qrCode = verifyUrl
  }
}

const generateCertificate = () => {
  if (!canGenerate.value) return
  
  if (!localCertificate.value.number) {
    generateCertificateNumber()
  }
  
  // Generate QR code
  const verifyUrl = `https://doctor2go.net/verify?cert=${localCertificate.value.number}`
  generateQRCode(verifyUrl)
  
  // Update certificate data
  localCertificate.value.qrCode = verifyUrl
  localCertificate.value.generatedAt = new Date().toISOString()
  localCertificate.value.generated = true
  localCertificate.value.digitalSignature = selectedDoctor.value?.signature || 'Digital Signature'
  
  // Emit update
  emit('update:certificate', localCertificate.value)
  
  alert('✅ Medical certificate generated successfully!')
}

const downloadPDF = async () => {
  // Mock PDF generation - in real app would use jsPDF
  const link = document.createElement('a')
  link.href = '#'
  link.download = `medical-certificate-${localCertificate.value.number}.pdf`
  link.click()
  
  alert('📥 PDF download started (mock)')
}

const emailCertificate = () => {
  const email = props.consultation?.patient?.email
  if (email) {
    alert(`📧 Certificate sent to ${email} (mock)`)
  } else {
    alert('⚠️ No email address provided for patient')
  }
}

const printCertificate = () => {
  window.print()
}

const copyVerificationUrl = () => {
  navigator.clipboard.writeText(verificationUrl.value)
  alert('📋 Verification URL copied to clipboard!')
}

const formatDate = (date) => {
  return format(new Date(date), 'MMM dd, yyyy HH:mm')
}

// Initialize
onMounted(() => {
  if (availableDoctors.length > 0) {
    selectedDoctor.value = availableDoctors[0]
  }
})

// Watch for changes
watch(
  localCertificate,
  (newValue) => {
    emit('update:certificate', newValue)
  },
  { deep: true }
)
</script>