<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <div class="hero bg-gradient-to-r from-primary to-secondary text-white py-16">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <h1 class="text-5xl font-bold">🩺 Doctor2GO</h1>
          <p class="py-6 text-lg">
            Digital Medical Certificate & Receipt Issuance System
          </p>
          <router-link to="/consultation" class="btn btn-accent btn-lg">
            Start New Consultation
          </router-link>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="container mx-auto px-4 -mt-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body items-center text-center">
            <h2 class="card-title text-3xl">{{ totalConsultations }}</h2>
            <p class="text-gray-600">Total Consultations</p>
          </div>
        </div>
        
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body items-center text-center">
            <h2 class="card-title text-3xl">{{ todayConsultations }}</h2>
            <p class="text-gray-600">Today's Consultations</p>
          </div>
        </div>
        
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body items-center text-center">
            <h2 class="card-title text-3xl">{{ pendingSyncCount }}</h2>
            <p class="text-gray-600">Pending Sync</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="container mx-auto px-4 mb-12">
      <h2 class="text-2xl font-bold mb-6">Quick Actions</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <router-link to="/consultation" class="card bg-accent text-accent-content hover:shadow-xl transition-shadow">
          <div class="card-body items-center text-center">
            <div class="text-4xl mb-2">🩺</div>
            <h3 class="card-title">New Consultation</h3>
            <p>Start a new patient consultation</p>
          </div>
        </router-link>
        
        <router-link to="/verify" class="card bg-secondary text-secondary-content hover:shadow-xl transition-shadow">
          <div class="card-body items-center text-center">
            <div class="text-4xl mb-2">🔍</div>
            <h3 class="card-title">Verify Documents</h3>
            <p>Verify certificates & receipts</p>
          </div>
        </router-link>
        
        <router-link to="/reports" class="card bg-accent text-accent-content hover:shadow-xl transition-shadow">
          <div class="card-body items-center text-center">
            <div class="text-4xl mb-2">📊</div>
            <h3 class="card-title">View Reports</h3>
            <p>Generate consultation reports</p>
          </div>
        </router-link>
        
        <div @click="handleDataSync" class="card bg-info text-info-content hover:shadow-xl transition-shadow cursor-pointer">
          <div class="card-body items-center text-center">
            <div class="text-4xl mb-2">
              <span v-if="!syncing">☁️</span>
              <span v-else class="loading loading-spinner loading-md"></span>
            </div>
            <h3 class="card-title">Sync Data</h3>
            <p>{{ syncing ? 'Syncing...' : 'Backup to cloud' }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Consultations -->
    <div class="container mx-auto px-4 mb-12">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">Recent Consultations</h2>
        <router-link to="/reports" class="btn btn-outline btn-sm">View All</router-link>
      </div>
      
      <div class="overflow-x-auto">
        <table class="table table-zebra w-full">
          <thead>
            <tr>
              <th>Case ID</th>
              <th>Patient Name</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="consultation in recentConsultations" :key="consultation.id">
              <td class="font-mono">{{ consultation.caseId }}</td>
              <td>{{ consultation.patient.fullName || 'Unknown' }}</td>
              <td>{{ formatDate(consultation.createdAt) }}</td>
              <td>
                <div class="badge" :class="getStatusClass(consultation.status)">
                  {{ consultation.status }}
                </div>
              </td>
              <td>
                <div class="flex gap-2">
                  <button 
                    @click="viewConsultation(consultation.id)"
                    class="btn btn-sm btn-outline"
                  >
                    View
                  </button>
                  <button 
                    @click="downloadCertificate(consultation.id)"
                    class="btn btn-sm btn-primary"
                    :disabled="consultation.status !== 'completed'"
                  >
                    📄 Cert
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="consultations.length === 0">
              <td colspan="5" class="text-center text-gray-500 py-8">
                No consultations yet. <router-link to="/consultation" class="link link-primary">Start your first consultation</router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useConsultationStore } from '@/stores/consultation'
import { useStorageStore } from '@/stores/storage'
import { format } from 'date-fns'

const router = useRouter()
const consultationStore = useConsultationStore()
const storageStore = useStorageStore()

const syncing = ref(false)

// Computed properties
const totalConsultations = computed(() => consultationStore.totalConsultations)
const todayConsultations = computed(() => consultationStore.todayConsultations)
const consultations = computed(() => consultationStore.consultations)
const pendingSyncCount = computed(() => storageStore.syncQueue.length)

const recentConsultations = computed(() => {
  return consultations.value
    .slice(-10)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

// Methods
const formatDate = (dateString) => {
  return format(new Date(dateString), 'MMM dd, yyyy HH:mm')
}

const getStatusClass = (status) => {
  switch (status) {
    case 'completed': return 'badge-success'
    case 'draft': return 'badge-warning'
    case 'in-progress': return 'badge-info'
    default: return 'badge-ghost'
  }
}

const viewConsultation = (id) => {
  consultationStore.loadConsultation(id)
  router.push('/consultation')
}

const downloadCertificate = (id) => {
  // TODO: Implement certificate download
  console.log('Download certificate for:', id)
}

const handleDataSync = async () => {
  if (syncing.value) return
  
  syncing.value = true
  try {
    await storageStore.syncPendingData()
  } catch (error) {
    console.error('Sync failed:', error)
  } finally {
    syncing.value = false
  }
}

onMounted(() => {
  consultationStore.loadFromStorage()
  storageStore.initialize()
})
</script>