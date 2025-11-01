<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Status Indicator -->
    <div v-if="!isOnline" class="status-offline">
      📡 Offline
    </div>
    <div v-else class="status-online">
      ✓ Online
    </div>

    <!-- Minimal Navigation -->
    <nav class="navbar-minimal">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <router-link to="/" class="flex items-center space-x-2 text-xl font-semibold text-gray-900">
            <span>🩺</span>
            <span>Doctor2GO</span>
          </router-link>
          
          <!-- Navigation Links -->
          <div class="hidden md:flex items-center space-x-8">
            <router-link 
              to="/" 
              class="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
              :class="{ 'text-blue-600': $route.path === '/' }"
            >
              Dashboard
            </router-link>
            <router-link 
              to="/consultation" 
              class="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
              :class="{ 'text-blue-600': $route.path === '/consultation' }"
            >
              New Consultation
            </router-link>
            <router-link 
              to="/verify" 
              class="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
              :class="{ 'text-blue-600': $route.path === '/verify' }"
            >
              Verify
            </router-link>
            <router-link 
              to="/reports" 
              class="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
              :class="{ 'text-blue-600': $route.path === '/reports' }"
            >
              Reports
            </router-link>
          </div>
          
          <!-- Stats Badge -->
          <div class="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
            {{ consultationStore.totalConsultations }} Cases
          </div>
          
          <!-- Mobile Menu Button -->
          <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden p-2">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
        
        <!-- Mobile Menu -->
        <div v-if="mobileMenuOpen" class="md:hidden py-4 space-y-2">
          <router-link to="/" class="block px-3 py-2 text-gray-600 hover:text-gray-900">Dashboard</router-link>
          <router-link to="/consultation" class="block px-3 py-2 text-gray-600 hover:text-gray-900">New Consultation</router-link>
          <router-link to="/verify" class="block px-3 py-2 text-gray-600 hover:text-gray-900">Verify</router-link>
          <router-link to="/reports" class="block px-3 py-2 text-gray-600 hover:text-gray-900">Reports</router-link>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-view />
    </main>

    <!-- Sync Status -->
    <div v-if="syncStatus.syncing" class="toast-minimal">
      <div class="flex items-center space-x-2">
        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        <span>Syncing...</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useConsultationStore } from '@/stores/consultation'
import { useStorageStore } from '@/stores/storage'

const consultationStore = useConsultationStore()
const storageStore = useStorageStore()

const isOnline = ref(navigator.onLine)
const mobileMenuOpen = ref(false)
const syncStatus = ref({
  syncing: false,
  lastSync: null as string | null
})

onMounted(() => {
  // Initialize stores
  consultationStore.loadFromStorage()
  
  // Listen for online/offline events
  window.addEventListener('online', () => {
    isOnline.value = true
    handleOnlineSync()
  })
  
  window.addEventListener('offline', () => {
    isOnline.value = false
  })
  
  // Auto-sync when online
  if (isOnline.value) {
    handleOnlineSync()
  }
})

const handleOnlineSync = async () => {
  syncStatus.value.syncing = true
  try {
    await storageStore.syncPendingData()
    syncStatus.value.lastSync = new Date().toISOString()
  } catch (error) {
    console.error('Sync failed:', error)
  } finally {
    syncStatus.value.syncing = false
  }
}
</script>