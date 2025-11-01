<template>
  <div class="container mx-auto px-4">
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2">🔍 Document Verification</h1>
      <p class="text-gray-600">Verify the authenticity of Doctor2GO certificates and receipts</p>
    </div>

    <!-- QR Code Scanner -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">📱 Scan QR Code</h2>
          <p class="text-gray-600 mb-4">Use your device camera to scan the QR code on the document</p>
          
          <div class="text-center">
            <div class="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4">
              <div class="text-6xl text-gray-400 mb-4">📷</div>
              <p class="text-gray-500">Camera preview will appear here</p>
            </div>
            
            <button @click="startQRScanner" class="btn btn-primary">
              📷 Start QR Scanner
            </button>
          </div>
        </div>
      </div>

      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">⌨️ Manual Entry</h2>
          <p class="text-gray-600 mb-4">Enter the document number manually</p>
          
          <div class="form-control mb-4">
            <label class="label">
              <span class="label-text">Document Type</span>
            </label>
            <select 
              v-model="verificationForm.type"
              class="select select-bordered w-full"
            >
              <option value="">Select document type</option>
              <option value="certificate">Medical Certificate</option>
              <option value="receipt">Receipt</option>
            </select>
          </div>

          <div class="form-control mb-4">
            <label class="label">
              <span class="label-text">Document Number</span>
            </label>
            <input 
              v-model="verificationForm.number"
              type="text" 
              placeholder="e.g., DG-2024-123456 or DRG-2024-789012"
              class="input input-bordered w-full font-mono"
            />
          </div>

          <button 
            @click="verifyDocument"
            class="btn btn-primary w-full"
            :disabled="!verificationForm.type || !verificationForm.number"
            :class="{ 'loading': verifying }"
          >
            {{ verifying ? 'Verifying...' : '🔍 Verify Document' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Verification Result -->
    <div v-if="verificationResult" class="card bg-base-100 shadow-xl mb-8">
      <div class="card-body">
        <div class="flex items-center justify-between mb-4">
          <h2 class="card-title">Verification Result</h2>
          <div 
            class="badge badge-lg"
            :class="verificationResult.valid ? 'badge-success' : 'badge-error'"
          >
            {{ verificationResult.valid ? '✅ Valid' : '❌ Invalid' }}
          </div>
        </div>

        <div v-if="verificationResult.valid" class="space-y-4">
          <!-- Document Details -->
          <div class="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 class="font-semibold text-green-800 mb-3">Document Information</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Document Number:</strong><br>
                <span class="font-mono">{{ verificationResult.document.number }}</span>
              </div>
              <div>
                <strong>Issue Date:</strong><br>
                {{ formatDate(verificationResult.document.issueDate) }}
              </div>
              <div>
                <strong>Document Type:</strong><br>
                {{ verificationResult.document.type }}
              </div>
              <div>
                <strong>Status:</strong><br>
                <span class="badge badge-success">Active</span>
              </div>
            </div>
          </div>

          <!-- Patient Information (for certificates) -->
          <div v-if="verificationResult.document.type === 'Medical Certificate'" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 class="font-semibold text-blue-800 mb-3">Patient Information</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Patient Name:</strong><br>
                {{ verificationResult.document.patientName }}
              </div>
              <div>
                <strong>Examination Date:</strong><br>
                {{ formatDate(verificationResult.document.examinationDate) }}
              </div>
              <div>
                <strong>Diagnosis:</strong><br>
                {{ verificationResult.document.diagnosis }}
              </div>
              <div>
                <strong>Issuing Doctor:</strong><br>
                {{ verificationResult.document.doctor }}
              </div>
            </div>

            <div v-if="verificationResult.document.medicalAdvice" class="mt-4">
              <strong>Medical Advice:</strong>
              <ul class="list-disc list-inside mt-2 text-sm">
                <li v-for="advice in verificationResult.document.medicalAdvice" :key="advice">
                  {{ advice }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Billing Information (for receipts) -->
          <div v-if="verificationResult.document.type === 'Receipt'" class="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 class="font-semibold text-purple-800 mb-3">Billing Information</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Patient Name:</strong><br>
                {{ verificationResult.document.patientName }}
              </div>
              <div>
                <strong>Total Amount:</strong><br>
                <span class="font-mono font-bold">{{ formatPrice(verificationResult.document.totalAmount) }}</span>
              </div>
              <div>
                <strong>Payment Method:</strong><br>
                {{ verificationResult.document.paymentMethod }}
              </div>
              <div>
                <strong>Payment Status:</strong><br>
                <span class="badge badge-success">{{ verificationResult.document.paymentStatus }}</span>
              </div>
            </div>

            <div v-if="verificationResult.document.services" class="mt-4">
              <strong>Services:</strong>
              <div class="overflow-x-auto mt-2">
                <table class="table table-sm">
                  <thead>
                    <tr>
                      <th>Service</th>
                      <th>Qty</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="service in verificationResult.document.services" :key="service.name">
                      <td>{{ service.name }}</td>
                      <td>{{ service.quantity }}</td>
                      <td class="font-mono">{{ formatPrice(service.total) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Verification Details -->
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 class="font-semibold text-gray-800 mb-3">Verification Details</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Verified At:</strong><br>
                {{ formatDate(new Date()) }}
              </div>
              <div>
                <strong>Digital Signature:</strong><br>
                <span class="badge badge-success">Valid</span>
              </div>
              <div>
                <strong>Document Hash:</strong><br>
                <span class="font-mono text-xs">{{ verificationResult.document.hash }}</span>
              </div>
              <div>
                <strong>Issuing System:</strong><br>
                Doctor2GO Digital Platform
              </div>
            </div>
          </div>
        </div>

        <div v-else class="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 class="font-semibold text-red-800 mb-3">Verification Failed</h3>
          <p class="text-red-700">{{ verificationResult.error }}</p>
          
          <div class="mt-4">
            <h4 class="font-semibold text-red-800">Possible reasons:</h4>
            <ul class="list-disc list-inside text-red-700 text-sm mt-2">
              <li>Document number is incorrect or doesn't exist</li>
              <li>Document has been revoked or expired</li>
              <li>Document is not issued by Doctor2GO</li>
              <li>System connectivity issues</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Verifications -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title mb-4">Recent Verifications</h2>
        
        <div class="overflow-x-auto">
          <table class="table table-zebra w-full">
            <thead>
              <tr>
                <th>Document Number</th>
                <th>Type</th>
                <th>Verified At</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="verification in recentVerifications" :key="verification.id">
                <td class="font-mono">{{ verification.documentNumber }}</td>
                <td>{{ verification.type }}</td>
                <td>{{ formatDate(verification.verifiedAt) }}</td>
                <td>
                  <div 
                    class="badge"
                    :class="verification.valid ? 'badge-success' : 'badge-error'"
                  >
                    {{ verification.valid ? 'Valid' : 'Invalid' }}
                  </div>
                </td>
                <td>
                  <button 
                    @click="showVerificationDetails(verification)"
                    class="btn btn-ghost btn-xs"
                  >
                    View Details
                  </button>
                </td>
              </tr>
              <tr v-if="recentVerifications.length === 0">
                <td colspan="5" class="text-center text-gray-500">
                  No recent verifications
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { format } from 'date-fns'

// Reactive state
const verificationForm = ref({
  type: '',
  number: ''
})

const verifying = ref(false)
const verificationResult = ref(null)
const recentVerifications = ref([])

// Methods
const startQRScanner = () => {
  // Mock QR scanner - in real app would use camera API
  alert('📷 QR Scanner would open here (camera permission required)')
  
  // Simulate scanning a QR code
  setTimeout(() => {
    const mockQRData = 'https://doctor2go.net/verify?cert=DG-2024-123456'
    const url = new URL(mockQRData)
    const documentNumber = url.searchParams.get('cert') || url.searchParams.get('receipt')
    const documentType = url.searchParams.get('cert') ? 'certificate' : 'receipt'
    
    verificationForm.value.number = documentNumber
    verificationForm.value.type = documentType
    
    verifyDocument()
  }, 2000)
}

const verifyDocument = async () => {
  if (!verificationForm.value.type || !verificationForm.value.number) return
  
  verifying.value = true
  verificationResult.value = null
  
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock verification result
    const mockResult = generateMockVerificationResult()
    verificationResult.value = mockResult
    
    // Add to recent verifications
    recentVerifications.value.unshift({
      id: Date.now(),
      documentNumber: verificationForm.value.number,
      type: verificationForm.value.type,
      verifiedAt: new Date().toISOString(),
      valid: mockResult.valid
    })
    
    // Keep only last 10 verifications
    if (recentVerifications.value.length > 10) {
      recentVerifications.value = recentVerifications.value.slice(0, 10)
    }
    
    saveRecentVerifications()
    
  } catch (error) {
    console.error('Verification failed:', error)
    verificationResult.value = {
      valid: false,
      error: 'Verification service is currently unavailable. Please try again later.'
    }
  } finally {
    verifying.value = false
  }
}

const generateMockVerificationResult = () => {
  const isValid = Math.random() > 0.2 // 80% chance of valid result
  
  if (!isValid) {
    return {
      valid: false,
      error: 'Document not found or has been revoked.'
    }
  }
  
  if (verificationForm.value.type === 'certificate') {
    return {
      valid: true,
      document: {
        number: verificationForm.value.number,
        type: 'Medical Certificate',
        issueDate: new Date('2024-11-01').toISOString(),
        examinationDate: new Date('2024-11-01').toISOString(),
        patientName: 'John Smith',
        diagnosis: 'Viral upper respiratory tract infection',
        doctor: 'Dr. Sarah Johnson, MD',
        medicalAdvice: [
          'Patient is fit to travel',
          'Fit to fly after 24 hours',
          'Recommended rest for 2-3 days'
        ],
        hash: 'sha256:a1b2c3d4e5f6789012345678901234567890'
      }
    }
  } else {
    return {
      valid: true,
      document: {
        number: verificationForm.value.number,
        type: 'Receipt',
        issueDate: new Date('2024-11-01').toISOString(),
        patientName: 'John Smith',
        totalAmount: 3300,
        paymentMethod: 'Credit Card',
        paymentStatus: 'Paid',
        services: [
          { name: 'Doctor On-Site Consultation', quantity: 1, total: 2500 },
          { name: 'Medical Certificate Fee', quantity: 1, total: 300 },
          { name: 'Medication & Supplies', quantity: 1, total: 500 }
        ],
        hash: 'sha256:b2c3d4e5f6789012345678901234567890ab'
      }
    }
  }
}

const showVerificationDetails = (verification) => {
  verificationForm.value.number = verification.documentNumber
  verificationForm.value.type = verification.type
  verifyDocument()
}

const formatDate = (dateString) => {
  return format(new Date(dateString), 'MMM dd, yyyy HH:mm')
}

const formatPrice = (amount) => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB'
  }).format(amount)
}

const saveRecentVerifications = () => {
  try {
    localStorage.setItem('doctor2go_recent_verifications', JSON.stringify(recentVerifications.value))
  } catch (error) {
    console.error('Failed to save recent verifications:', error)
  }
}

const loadRecentVerifications = () => {
  try {
    const stored = localStorage.getItem('doctor2go_recent_verifications')
    if (stored) {
      recentVerifications.value = JSON.parse(stored)
    }
  } catch (error) {
    console.error('Failed to load recent verifications:', error)
  }
}

// Initialize
onMounted(() => {
  loadRecentVerifications()
})
</script>