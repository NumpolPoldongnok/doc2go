<template>
  <div id="app" class="min-h-screen bg-blue-50 dark:bg-gray-900 transition-colors duration-200">
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
          <router-link to="/" class="flex items-center space-x-2 text-xl font-semibold text-black dark:text-gray-100">
            <span>🩺</span>
            <span>Doctor2GO</span>
          </router-link>
          
          <!-- Navigation Links -->
          <div class="hidden md:flex items-center space-x-8">
            <router-link 
              to="/" 
              class="text-black dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 px-3 py-2 text-sm font-medium transition-colors"
              :class="{ 'text-blue-600 dark:text-blue-400': $route.path === '/' }"
            >
              Dashboard
            </router-link>
            <router-link 
              to="/consultation" 
              class="text-black dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 px-3 py-2 text-sm font-medium transition-colors"
              :class="{ 'text-blue-600 dark:text-blue-400': $route.path === '/consultation' }"
            >
              New Consultation
            </router-link>
            <router-link 
              to="/verify" 
              class="text-black dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 px-3 py-2 text-sm font-medium transition-colors"
              :class="{ 'text-blue-600 dark:text-blue-400': $route.path === '/verify' }"
            >
              Verify
            </router-link>
            <router-link 
              to="/reports" 
              class="text-black dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 px-3 py-2 text-sm font-medium transition-colors"
              :class="{ 'text-blue-600 dark:text-blue-400': $route.path === '/reports' }"
            >
              Reports
            </router-link>
            
            <!-- Theme Toggle Button -->
            <button
              @click="toggleTheme"
              class="theme-toggle"
              :title="isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
            >
              <span v-if="isDark()">☀️</span>
              <span v-else>🌙</span>
            </button>
          </div>
          
          <!-- Stats Badge -->
          <div class="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
            {{ consultationStore.totalConsultations }} Cases
          </div>
          
                    <!-- Mobile Menu Button -->
          <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden p-2 text-black dark:text-gray-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
        
        <!-- Mobile Menu -->
        <div v-if="mobileMenuOpen" class="md:hidden py-4 space-y-2">
          <router-link to="/" class="block px-3 py-2 text-black dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100">Dashboard</router-link>
          <router-link to="/consultation" class="block px-3 py-2 text-black dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100">New Consultation</router-link>
          <router-link to="/verify" class="block px-3 py-2 text-black dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100">Verify</router-link>
          <router-link to="/reports" class="block px-3 py-2 text-black dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100">Reports</router-link>
          <button
            @click="toggleTheme"
            class="block w-full text-left px-3 py-2 text-black dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
          >
            <span v-if="isDark()">☀️ Light Mode</span>
            <span v-else>🌙 Dark Mode</span>
          </button>
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
import { useTheme } from '@/composables/useTheme'

const consultationStore = useConsultationStore()
const storageStore = useStorageStore()
const { toggleTheme, isDark, initTheme } = useTheme()

const isOnline = ref(navigator.onLine)
const mobileMenuOpen = ref(false)
const syncStatus = ref({
  syncing: false,
  lastSync: null as string | null
})

onMounted(() => {
  // Initialize theme
  initTheme()
  
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