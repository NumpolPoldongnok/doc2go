<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Billing & Services</h3>
    
    <div class="space-y-6">
      <!-- Available Services -->
      <div>
        <h4 class="font-medium mb-3 text-gray-900 dark:text-white">Available Services</h4>
        <div class="space-y-2">
          <div v-for="service in availableServices" :key="service.id" 
               class="flex justify-between items-center p-3 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800">
            <div>
              <span class="font-medium text-black dark:text-white">{{ service.name }}</span>
              <span class="text-sm text-gray-600 dark:text-gray-400 ml-2">{{ service.description }}</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="font-mono">{{ formatPrice(service.price) }}</span>
              <button
                @click="addService(service)"
                class="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Selected Services -->
      <div v-if="selectedServices.length > 0">
        <h4 class="font-medium mb-3">Selected Services</h4>
        <div class="space-y-2">
          <div v-for="service in selectedServices" :key="service.id" 
               class="flex justify-between items-center p-3 bg-blue-50 border border-blue-200 rounded">
            <div>
              <span class="font-medium">{{ service.name }}</span>
              <span class="text-sm text-gray-500 ml-2">× {{ service.quantity }}</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="font-mono">{{ formatPrice(service.total || 0) }}</span>
              <button
                @click="removeService(service.id)"
                class="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        </div>

        <!-- Billing Summary -->
        <div class="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h4 class="font-medium mb-3">Billing Summary</h4>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span>Subtotal:</span>
              <span class="font-mono">{{ formatPrice(subtotal) }}</span>
            </div>
            <div class="flex justify-between text-sm text-gray-600">
              <span>VAT (7%):</span>
              <span class="font-mono">{{ formatPrice(vatAmount) }}</span>
            </div>
            <hr class="my-2">
            <div class="flex justify-between font-semibold text-lg">
              <span>Total:</span>
              <span class="font-mono">{{ formatPrice(totalAmount) }}</span>
            </div>
          </div>
        </div>

        <!-- Payment Method -->
        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
          <select v-model="paymentMethod" class="w-full px-3 py-2 border border-gray-300 rounded-md">
            <option value="">Select payment method</option>
            <option value="cash">Cash</option>
            <option value="card">Credit/Debit Card</option>
            <option value="insurance">Insurance</option>
          </select>
        </div>

        <!-- Actions -->
        <div class="flex gap-2 mt-6">
          <button
            @click="generateReceipt"
            class="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Generate Receipt
          </button>
          <button
            @click="clearBilling"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Service {
  id: string
  name: string
  description: string
  price: number
  quantity?: number
  total?: number
}

interface Billing {
  services: Service[]
  subtotal: number
  vatAmount: number
  total: number
  paymentMethod: string
}

const props = defineProps<{
  data: Billing
}>()

const emit = defineEmits<{
  'update:data': [value: Billing]
}>()

// Available medical services
const availableServices = ref<Service[]>([
  { id: '1', name: 'Consultation', description: 'General consultation', price: 500 },
  { id: '2', name: 'Medical Certificate', description: 'Official medical certificate', price: 200 },
  { id: '3', name: 'Blood Pressure Check', description: 'Basic vital signs', price: 100 },
  { id: '4', name: 'Temperature Check', description: 'Body temperature measurement', price: 50 },
  { id: '5', name: 'Basic Health Screening', description: 'Comprehensive health check', price: 1000 }
])

const selectedServices = ref<Service[]>([...props.data.services || []])
const paymentMethod = ref<string>(props.data.paymentMethod || '')

// Computed values
const subtotal = computed(() => {
  return selectedServices.value.reduce((sum, service) => sum + (service.total || service.price), 0)
})

const vatAmount = computed(() => {
  return subtotal.value * 0.07
})

const totalAmount = computed(() => {
  return subtotal.value + vatAmount.value
})

// Methods
const formatPrice = (amount: number): string => {
  return `฿${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
}

const addService = (service: Service) => {
  const existingService = selectedServices.value.find(s => s.id === service.id)
  if (existingService) {
    existingService.quantity = (existingService.quantity || 1) + 1
    existingService.total = existingService.price * existingService.quantity
  } else {
    selectedServices.value.push({
      ...service,
      quantity: 1,
      total: service.price
    })
  }
  updateBilling()
}

const removeService = (serviceId: string) => {
  selectedServices.value = selectedServices.value.filter(s => s.id !== serviceId)
  updateBilling()
}

const generateReceipt = () => {
  if (selectedServices.value.length === 0 || !paymentMethod.value) {
    alert('Please select services and payment method')
    return
  }
  
  // In a real app, this would generate a PDF receipt
  alert(`Receipt generated! Total: ${formatPrice(totalAmount.value)}`)
}

const clearBilling = () => {
  selectedServices.value = []
  paymentMethod.value = ''
  updateBilling()
}

const updateBilling = () => {
  const billing: Billing = {
    services: selectedServices.value,
    subtotal: subtotal.value,
    vatAmount: vatAmount.value,
    total: totalAmount.value,
    paymentMethod: paymentMethod.value
  }
  emit('update:data', billing)
}

// Watch for external changes
import { watch } from 'vue'

watch(paymentMethod, () => {
  updateBilling()
})
</script>
