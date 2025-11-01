<template>
  <div class="container mx-auto px-4">
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2">📊 Reports & Analytics</h1>
      <p class="text-gray-600">View consultation reports and analytics</p>
    </div>

    <!-- Filter Controls -->
    <div class="card bg-base-100 shadow-xl mb-8">
      <div class="card-body">
        <h2 class="card-title mb-4">Filter Options</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Date Range</span>
            </label>
            <select v-model="filters.dateRange" class="select select-bordered">
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          
          <div class="form-control" v-if="filters.dateRange === 'custom'">
            <label class="label">
              <span class="label-text">Start Date</span>
            </label>
            <input 
              v-model="filters.startDate"
              type="date" 
              class="input input-bordered"
            />
          </div>
          
          <div class="form-control" v-if="filters.dateRange === 'custom'">
            <label class="label">
              <span class="label-text">End Date</span>
            </label>
            <input 
              v-model="filters.endDate"
              type="date" 
              class="input input-bordered"
            />
          </div>
          
          <div class="form-control">
            <label class="label">
              <span class="label-text">Status</span>
            </label>
            <select v-model="filters.status" class="select select-bordered">
              <option value="">All Status</option>
              <option value="completed">Completed</option>
              <option value="draft">Draft</option>
              <option value="in-progress">In Progress</option>
            </select>
          </div>
        </div>
        
        <div class="flex gap-4 mt-4">
          <button @click="applyFilters" class="btn btn-primary">
            🔍 Apply Filters
          </button>
          <button @click="resetFilters" class="btn btn-outline">
            🔄 Reset
          </button>
          <button @click="exportReport" class="btn btn-success">
            📥 Export Excel
          </button>
        </div>
      </div>
    </div>

    <!-- Summary Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="stat bg-base-100 shadow-xl rounded-lg">
        <div class="stat-figure text-primary">
          <div class="text-3xl">🩺</div>
        </div>
        <div class="stat-title">Total Consultations</div>
        <div class="stat-value text-primary">{{ summaryStats.totalConsultations }}</div>
        <div class="stat-desc">{{ getPercentageChange(summaryStats.consultationsChange) }}</div>
      </div>
      
      <div class="stat bg-base-100 shadow-xl rounded-lg">
        <div class="stat-figure text-success">
          <div class="text-3xl">💰</div>
        </div>
        <div class="stat-title">Total Revenue</div>
        <div class="stat-value text-success">{{ formatPrice(summaryStats.totalRevenue) }}</div>
        <div class="stat-desc">{{ getPercentageChange(summaryStats.revenueChange) }}</div>
      </div>
      
      <div class="stat bg-base-100 shadow-xl rounded-lg">
        <div class="stat-figure text-info">
          <div class="text-3xl">📄</div>
        </div>
        <div class="stat-title">Certificates Issued</div>
        <div class="stat-value text-info">{{ summaryStats.certificatesIssued }}</div>
        <div class="stat-desc">{{ getPercentageChange(summaryStats.certificatesChange) }}</div>
      </div>
      
      <div class="stat bg-base-100 shadow-xl rounded-lg">
        <div class="stat-figure text-accent">
          <div class="text-3xl">⚡</div>
        </div>
        <div class="stat-title">Avg. Time</div>
        <div class="stat-value text-accent">{{ summaryStats.averageTime }}</div>
        <div class="stat-desc">{{ getPercentageChange(summaryStats.timeChange) }}</div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- Revenue Chart -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h3 class="card-title">Revenue Trend</h3>
          <div class="h-64 bg-gray-50 rounded flex items-center justify-center">
            <div class="text-center text-gray-500">
              <div class="text-4xl mb-2">📈</div>
              <p>Revenue chart would be rendered here</p>
              <p class="text-sm">(Integration with Chart.js or similar)</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Service Distribution -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h3 class="card-title">Service Distribution</h3>
          <div class="h-64 bg-gray-50 rounded flex items-center justify-center">
            <div class="text-center text-gray-500">
              <div class="text-4xl mb-2">🥧</div>
              <p>Service distribution pie chart</p>
              <p class="text-sm">(Most popular services)</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Consultations Table -->
    <div class="card bg-base-100 shadow-xl mb-8">
      <div class="card-body">
        <div class="flex justify-between items-center mb-4">
          <h2 class="card-title">Consultation Records</h2>
          <div class="flex gap-2">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search patients..."
              class="input input-bordered input-sm"
            />
            <button @click="refreshData" class="btn btn-ghost btn-sm">
              🔄
            </button>
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="table table-zebra w-full">
            <thead>
              <tr>
                <th>
                  <button @click="sortBy('caseId')" class="btn btn-ghost btn-xs">
                    Case ID {{ getSortIcon('caseId') }}
                  </button>
                </th>
                <th>
                  <button @click="sortBy('patientName')" class="btn btn-ghost btn-xs">
                    Patient {{ getSortIcon('patientName') }}
                  </button>
                </th>
                <th>
                  <button @click="sortBy('date')" class="btn btn-ghost btn-xs">
                    Date {{ getSortIcon('date') }}
                  </button>
                </th>
                <th>Diagnosis</th>
                <th>
                  <button @click="sortBy('total')" class="btn btn-ghost btn-xs">
                    Amount {{ getSortIcon('total') }}
                  </button>
                </th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="consultation in paginatedConsultations" :key="consultation.id">
                <td class="font-mono">{{ consultation.caseId }}</td>
                <td>
                  <div>
                    <div class="font-medium">{{ consultation.patient.fullName }}</div>
                    <div class="text-sm text-gray-500">{{ consultation.patient.nationality }}</div>
                  </div>
                </td>
                <td>{{ formatDate(consultation.createdAt) }}</td>
                <td class="max-w-xs truncate">{{ consultation.medical.diagnosis || 'N/A' }}</td>
                <td class="font-mono">{{ formatPrice(consultation.billing.total || 0) }}</td>
                <td>
                  <div class="badge" :class="getStatusClass(consultation.status)">
                    {{ consultation.status }}
                  </div>
                </td>
                <td>
                  <div class="flex gap-1">
                    <button 
                      @click="viewConsultation(consultation)"
                      class="btn btn-ghost btn-xs"
                      title="View Details"
                    >
                      👁️
                    </button>
                    <button 
                      v-if="consultation.certificate?.number"
                      @click="downloadCertificate(consultation)"
                      class="btn btn-ghost btn-xs"
                      title="Download Certificate"
                    >
                      📄
                    </button>
                    <button 
                      v-if="consultation.billing?.receiptNumber"
                      @click="downloadReceipt(consultation)"
                      class="btn btn-ghost btn-xs"
                      title="Download Receipt"
                    >
                      🧾
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredConsultations.length === 0">
                <td colspan="7" class="text-center text-gray-500 py-8">
                  No consultations found matching your criteria
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div class="flex justify-between items-center mt-4" v-if="totalPages > 1">
          <div class="text-sm text-gray-500">
            Showing {{ (currentPage - 1) * pageSize + 1 }} to {{ Math.min(currentPage * pageSize, filteredConsultations.length) }} 
            of {{ filteredConsultations.length }} consultations
          </div>
          
          <div class="join">
            <button 
              @click="currentPage = Math.max(1, currentPage - 1)"
              class="join-item btn btn-sm"
              :disabled="currentPage === 1"
            >
              « Previous
            </button>
            
            <button 
              v-for="page in visiblePages" 
              :key="page"
              @click="currentPage = page"
              class="join-item btn btn-sm"
              :class="{ 'btn-active': page === currentPage }"
            >
              {{ page }}
            </button>
            
            <button 
              @click="currentPage = Math.min(totalPages, currentPage + 1)"
              class="join-item btn btn-sm"
              :disabled="currentPage === totalPages"
            >
              Next »
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="card bg-primary text-primary-content">
        <div class="card-body items-center text-center">
          <h3 class="card-title">🏥 Insurance Claims</h3>
          <p>Generate insurance claim reports</p>
          <button @click="generateInsuranceReport" class="btn btn-accent">
            Generate Report
          </button>
        </div>
      </div>
      
      <div class="card bg-secondary text-secondary-content">
        <div class="card-body items-center text-center">
          <h3 class="card-title">📊 Analytics</h3>
          <p>Detailed analytics dashboard</p>
          <button @click="openAnalytics" class="btn btn-primary">
            View Analytics
          </button>
        </div>
      </div>
      
      <div class="card bg-accent text-accent-content">
        <div class="card-body items-center text-center">
          <h3 class="card-title">💾 Data Export</h3>
          <p>Export all data for backup</p>
          <button @click="exportAllData" class="btn btn-info">
            Export Data
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { format } from 'date-fns'
import { useConsultationStore } from '@/stores/consultation'

const consultationStore = useConsultationStore()

// Reactive state
const filters = ref({
  dateRange: 'month',
  startDate: '',
  endDate: '',
  status: ''
})

const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const sortField = ref('date')
const sortDirection = ref('desc')

// Computed properties
const consultations = computed(() => consultationStore.consultations)

const filteredConsultations = computed(() => {
  let result = consultations.value

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(consultation => 
      consultation.patient.fullName?.toLowerCase().includes(query) ||
      consultation.caseId?.toLowerCase().includes(query) ||
      consultation.medical.diagnosis?.toLowerCase().includes(query)
    )
  }

  // Apply status filter
  if (filters.value.status) {
    result = result.filter(consultation => consultation.status === filters.value.status)
  }

  // Apply date filter
  result = result.filter(consultation => {
    const consultationDate = new Date(consultation.createdAt)
    const now = new Date()
    
    switch (filters.value.dateRange) {
      case 'today':
        return consultationDate.toDateString() === now.toDateString()
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        return consultationDate >= weekAgo
      case 'month':
        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
        return consultationDate >= monthAgo
      case 'quarter':
        const quarterAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
        return consultationDate >= quarterAgo
      case 'year':
        const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
        return consultationDate >= yearAgo
      case 'custom':
        if (filters.value.startDate && filters.value.endDate) {
          return consultationDate >= new Date(filters.value.startDate) && 
                 consultationDate <= new Date(filters.value.endDate)
        }
        return true
      default:
        return true
    }
  })

  // Apply sorting
  result.sort((a, b) => {
    let aValue, bValue
    
    switch (sortField.value) {
      case 'caseId':
        aValue = a.caseId || ''
        bValue = b.caseId || ''
        break
      case 'patientName':
        aValue = a.patient.fullName || ''
        bValue = b.patient.fullName || ''
        break
      case 'date':
        aValue = new Date(a.createdAt)
        bValue = new Date(b.createdAt)
        break
      case 'total':
        aValue = a.billing.total || 0
        bValue = b.billing.total || 0
        break
      default:
        return 0
    }
    
    if (aValue < bValue) return sortDirection.value === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection.value === 'asc' ? 1 : -1
    return 0
  })

  return result
})

const paginatedConsultations = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredConsultations.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredConsultations.value.length / pageSize.value))

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const summaryStats = computed(() => {
  const completed = consultations.value.filter(c => c.status === 'completed')
  const totalRevenue = completed.reduce((sum, c) => sum + (c.billing.total || 0), 0)
  const certificatesIssued = completed.filter(c => c.certificate?.number).length
  
  return {
    totalConsultations: consultations.value.length,
    consultationsChange: '+12%',
    totalRevenue,
    revenueChange: '+8%',
    certificatesIssued,
    certificatesChange: '+15%',
    averageTime: '28 min',
    timeChange: '-5 min'
  }
})

// Methods
const applyFilters = () => {
  currentPage.value = 1 // Reset to first page when filtering
}

const resetFilters = () => {
  filters.value = {
    dateRange: 'month',
    startDate: '',
    endDate: '',
    status: ''
  }
  searchQuery.value = ''
  currentPage.value = 1
}

const sortBy = (field) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'desc'
  }
}

const getSortIcon = (field) => {
  if (sortField.value !== field) return '↕️'
  return sortDirection.value === 'asc' ? '↑' : '↓'
}

const getStatusClass = (status) => {
  switch (status) {
    case 'completed': return 'badge-success'
    case 'draft': return 'badge-warning'
    case 'in-progress': return 'badge-info'
    default: return 'badge-ghost'
  }
}

const getPercentageChange = (change) => {
  const isPositive = change.startsWith('+')
  return isPositive ? `${change} from last period` : `${change} from last period`
}

const formatDate = (dateString) => {
  return format(new Date(dateString), 'MMM dd, yyyy')
}

const formatPrice = (amount) => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB'
  }).format(amount)
}

const viewConsultation = (consultation) => {
  alert(`View consultation details for ${consultation.caseId}`)
}

const downloadCertificate = (consultation) => {
  alert(`Download certificate ${consultation.certificate.number}`)
}

const downloadReceipt = (consultation) => {
  alert(`Download receipt ${consultation.billing.receiptNumber}`)
}

const exportReport = () => {
  const data = consultationStore.exportData()
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `doctor2go-report-${format(new Date(), 'yyyy-MM-dd')}.json`
  link.click()
  URL.revokeObjectURL(url)
}

const generateInsuranceReport = () => {
  alert('🏥 Insurance claim report generated (mock)')
}

const openAnalytics = () => {
  alert('📊 Analytics dashboard would open here')
}

const exportAllData = () => {
  exportReport()
}

const refreshData = () => {
  consultationStore.loadFromStorage()
  alert('🔄 Data refreshed')
}

// Initialize
onMounted(() => {
  consultationStore.loadFromStorage()
})
</script>