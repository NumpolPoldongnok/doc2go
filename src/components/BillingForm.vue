<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold mb-6">💰 Billing & Receipt</h2>

    <!-- Service Selection -->
    <div class="medical-advice-card">
      <h3 class="text-lg font-semibold mb-4">Services Provided</h3>
      
      <div class="overflow-x-auto">
        <table class="table table-zebra w-full">
          <thead>
            <tr>
              <th>Service</th>
              <th>Description</th>
              <th>Price (THB)</th>
              <th>Qty</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="service in availableServices" :key="service.id">
              <td>{{ service.name }}</td>
              <td class="text-sm text-gray-600">{{ service.description }}</td>
              <td class="font-mono">{{ formatPrice(service.price) }}</td>
              <td>
                <input 
                  v-model.number="service.quantity"
                  type="number" 
                  min="0"
                  max="10"
                  class="input input-bordered input-sm w-16"
                  @change="updateServiceQuantity(service)"
                />
              </td>
              <td class="font-mono font-bold">
                {{ formatPrice(service.price * (service.quantity || 0)) }}
              </td>
              <td>
                <button 
                  v-if="service.quantity > 0"
                  @click="removeService(service)"
                  class="btn btn-circle btn-xs btn-error"
                >
                  ✕
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Selected Services Summary -->
    <div class="medical-advice-card" v-if="selectedServices.length > 0">
      <h3 class="text-lg font-semibold mb-4">Bill Summary</h3>
      
      <div class="overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr>
              <th>Service</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="service in selectedServices" :key="service.id">
              <td>{{ service.name }}</td>
              <td>{{ service.quantity }}</td>
              <td class="font-mono">{{ formatPrice(service.price) }}</td>
              <td class="font-mono">{{ formatPrice(service.total) }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="font-bold">
              <td colspan="3">Subtotal</td>
              <td class="font-mono">{{ formatPrice(subtotal) }}</td>
            </tr>
            <tr>
              <td colspan="3">VAT (7%)</td>
              <td class="font-mono">{{ formatPrice(vatAmount) }}</td>
            </tr>
            <tr class="font-bold text-lg">
              <td colspan="3">Total Amount</td>
              <td class="font-mono text-primary">{{ formatPrice(totalAmount) }}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- Payment Information -->
    <div class="medical-advice-card">
      <h3 class="text-lg font-semibold mb-4">Payment Information</h3>
      
      <div class="field-group">
        <div class="form-control">
          <label class="label">
            <span class="label-text">Payment Method</span>
          </label>
          <select 
            v-model="localBilling.paymentMethod"
            class="select select-bordered w-full"
          >
            <option value="">Select payment method</option>
            <option value="cash">Cash</option>
            <option value="credit_card">Credit Card</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="insurance">Insurance Direct Billing</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div class="form-control">
          <label class="label">
            <span class="label-text">Payment Status</span>
          </label>
          <select 
            v-model="paymentStatus"
            class="select select-bordered w-full"
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="partial">Partial Payment</option>
            <option value="insurance_pending">Insurance Pending</option>
          </select>
        </div>
      </div>

      <div class="form-control" v-if="localBilling.paymentMethod === 'insurance'">
        <label class="label">
          <span class="label-text">Insurance Company</span>
        </label>
        <select 
          v-model="insuranceCompany"
          class="select select-bordered w-full"
        >
          <option value="">Select insurance company</option>
          <option value="axa">AXA Insurance</option>
          <option value="allianz">Allianz Travel</option>
          <option value="tune">Tune Protect</option>
          <option value="msig">MSIG Insurance</option>
          <option value="other">Other</option>
        </select>
      </div>
    </div>

    <!-- Receipt Generation -->
    <div class="medical-advice-card">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Official Receipt</h3>
        <button 
          @click="generateReceipt"
          class="btn btn-primary"
          :disabled="!canGenerateReceipt"
        >
          🧾 Generate Receipt
        </button>
      </div>

      <!-- Receipt Preview -->
      <div 
        v-if="localBilling.receiptNumber"
        id="receipt-preview"
        class="certificate-preview border-2 border-success"
      >
        <div class="text-center mb-6">
          <div class="text-2xl font-bold text-primary">🩺 DOCTOR2GO</div>
          <div class="text-lg font-semibold">OFFICIAL RECEIPT</div>
          <div class="text-sm text-gray-600">Tax Invoice / Receipt</div>
        </div>

        <div class="border-t-2 border-b-2 border-primary py-2 mb-4">
          <div class="flex justify-between">
            <div class="font-mono">Receipt No: {{ localBilling.receiptNumber }}</div>
            <div>Date: {{ formatDate(new Date()) }}</div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-8 mb-6">
          <div>
            <strong>Bill To:</strong><br>
            {{ patient?.fullName || '[Patient Name]' }}<br>
            {{ patient?.hotel || '[Hotel/Address]' }}<br>
            Room: {{ patient?.roomNo || '[Room]' }}<br>
            Contact: {{ patient?.contactNo || '[Phone]' }}
          </div>
          <div>
            <strong>Service Provider:</strong><br>
            Doctor2GO Co., Ltd.<br>
            123 Medical Street<br>
            Bangkok 10110, Thailand<br>
            Tax ID: 0123456789012
          </div>
        </div>

        <table class="table table-bordered w-full mb-6">
          <thead>
            <tr class="bg-primary text-primary-content">
              <th>Description</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="service in selectedServices" :key="service.id">
              <td>{{ service.name }}</td>
              <td class="text-center">{{ service.quantity }}</td>
              <td class="text-right font-mono">{{ formatPrice(service.price) }}</td>
              <td class="text-right font-mono">{{ formatPrice(service.total) }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" class="text-right font-bold">Subtotal:</td>
              <td class="text-right font-mono">{{ formatPrice(subtotal) }}</td>
            </tr>
            <tr>
              <td colspan="3" class="text-right">VAT (7%):</td>
              <td class="text-right font-mono">{{ formatPrice(vatAmount) }}</td>
            </tr>
            <tr class="font-bold">
              <td colspan="3" class="text-right text-lg">Total Amount:</td>
              <td class="text-right font-mono text-lg text-primary">{{ formatPrice(totalAmount) }}</td>
            </tr>
          </tfoot>
        </table>

        <div class="flex justify-between items-center">
          <div>
            <strong>Payment Method:</strong> {{ getPaymentMethodLabel(localBilling.paymentMethod) }}<br>
            <strong>Payment Status:</strong> 
            <span :class="getPaymentStatusClass(paymentStatus)">
              {{ getPaymentStatusLabel(paymentStatus) }}
            </span>
          </div>
          
          <div class="text-center">
            <canvas 
              ref="receiptQrCanvas" 
              width="80" 
              height="80"
              class="border"
            ></canvas>
            <div class="text-xs mt-1">
              Verify Receipt
            </div>
          </div>
        </div>

        <div class="text-center mt-6 text-xs text-gray-500">
          This is an official receipt generated by Doctor2GO digital system.<br>
          For verification, scan QR code or visit: doctor2go.net/verify
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex gap-4" v-if="localBilling.receiptNumber">
      <button @click="downloadReceiptPDF" class="btn btn-success">
        📥 Download Receipt
      </button>
      <button @click="emailReceipt" class="btn btn-primary">
        📧 Email Receipt
      </button>
      <button @click="sendToInsurance" class="btn btn-accent" v-if="localBilling.paymentMethod === 'insurance'">
        🏥 Send to Insurance
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import QRCode from 'qrcode'
import { format } from 'date-fns'

const props = defineProps({
  billing: {
    type: Object,
    default: () => ({})
  },
  patient: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:billing'])

// Refs
const receiptQrCanvas = ref(null)

// Local state
const localBilling = ref({
  services: [],
  subtotal: 0,
  vat: 0,
  total: 0,
  paymentMethod: '',
  receiptNumber: '',
  receiptQrCode: '',
  ...props.billing
})

const paymentStatus = ref('pending')
const insuranceCompany = ref('')

// Available services
const availableServices = ref([
  {
    id: 1,
    name: 'Doctor On-Site Consultation',
    description: 'Medical consultation at hotel/accommodation',
    price: 2500,
    quantity: 0
  },
  {
    id: 2,
    name: 'Nursing Fee',
    description: 'Nursing care and assistance',
    price: 800,
    quantity: 0
  },
  {
    id: 3,
    name: 'Basic Procedure Fee',
    description: 'Minor medical procedures',
    price: 1200,
    quantity: 0
  },
  {
    id: 4,
    name: 'Medication & Supplies',
    description: 'Prescribed medications and medical supplies',
    price: 500,
    quantity: 0
  },
  {
    id: 5,
    name: 'Medical Certificate Fee',
    description: 'Official medical certificate issuance',
    price: 300,
    quantity: 0
  },
  {
    id: 6,
    name: 'Emergency Call Fee',
    description: 'After-hours or emergency consultation',
    price: 1000,
    quantity: 0
  }
])

// Computed properties
const selectedServices = computed(() => {
  return availableServices.value
    .filter(service => service.quantity > 0)
    .map(service => ({
      ...service,
      total: service.price * service.quantity
    }))
})

const subtotal = computed(() => {
  return selectedServices.value.reduce((sum, service) => sum + service.total, 0)
})

const vatAmount = computed(() => {
  return Math.round(subtotal.value * 0.07)
})

const totalAmount = computed(() => {
  return subtotal.value + vatAmount.value
})

const canGenerateReceipt = computed(() => {
  return selectedServices.value.length > 0 && 
         localBilling.value.paymentMethod &&
         paymentStatus.value
})

// Methods
const updateServiceQuantity = (service) => {
  if (service.quantity < 0) service.quantity = 0
  updateBilling()
}

const removeService = (service) => {
  service.quantity = 0
  updateBilling()
}

const updateBilling = () => {
  localBilling.value.services = selectedServices.value
  localBilling.value.subtotal = subtotal.value
  localBilling.value.vat = vatAmount.value
  localBilling.value.total = totalAmount.value
  
  emit('update:billing', localBilling.value)
}

const generateReceipt = async () => {
  if (!canGenerateReceipt.value) return
  
  // Generate receipt number
  const year = new Date().getFullYear()
  const sequence = String(Math.floor(Math.random() * 999999) + 1).padStart(6, '0')
  localBilling.value.receiptNumber = `DRG-${year}-${sequence}`
  
  // Generate QR code for receipt verification
  const verifyUrl = `https://doctor2go.net/verify?receipt=${localBilling.value.receiptNumber}`
  
  try {
    const canvas = receiptQrCanvas.value
    if (canvas) {
      await QRCode.toCanvas(canvas, verifyUrl, {
        width: 80,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
    }
    localBilling.value.receiptQrCode = verifyUrl
  } catch (error) {
    console.error('QR Code generation failed:', error)
  }
  
  updateBilling()
  alert('🧾 Receipt generated successfully!')
}

const formatPrice = (amount) => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB'
  }).format(amount)
}

const formatDate = (date) => {
  return format(new Date(date), 'MMM dd, yyyy HH:mm')
}

const getPaymentMethodLabel = (method) => {
  const labels = {
    cash: 'Cash',
    credit_card: 'Credit Card',
    bank_transfer: 'Bank Transfer',
    insurance: 'Insurance Direct Billing',
    other: 'Other'
  }
  return labels[method] || method
}

const getPaymentStatusLabel = (status) => {
  const labels = {
    pending: 'Pending Payment',
    paid: 'Paid',
    partial: 'Partial Payment',
    insurance_pending: 'Insurance Processing'
  }
  return labels[status] || status
}

const getPaymentStatusClass = (status) => {
  const classes = {
    pending: 'badge badge-warning',
    paid: 'badge badge-success',
    partial: 'badge badge-info',
    insurance_pending: 'badge badge-accent'
  }
  return classes[status] || 'badge'
}

const downloadReceiptPDF = () => {
  // Mock PDF download
  alert('📥 Receipt PDF download started (mock)')
}

const emailReceipt = () => {
  const email = props.patient?.email
  if (email) {
    alert(`📧 Receipt sent to ${email} (mock)`)
  } else {
    alert('⚠️ No email address provided for patient')
  }
}

const sendToInsurance = () => {
  if (insuranceCompany.value) {
    alert(`🏥 Receipt sent to ${insuranceCompany.value} for processing (mock)`)
  } else {
    alert('⚠️ Please select insurance company first')
  }
}

// Watch for changes
watch(
  [subtotal, vatAmount, totalAmount],
  () => {
    updateBilling()
  }
)

watch(
  () => props.billing,
  (newBilling) => {
    Object.assign(localBilling.value, newBilling)
  },
  { immediate: true }
)
</script>