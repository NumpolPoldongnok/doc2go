<template>
  <div id="app" class="min-h-screen bg-base-200">
    <!-- Offline Indicator -->
    <div v-if="!isOnline" class="offline-indicator">
      📡 Offline Mode
    </div>

    <!-- Navigation -->
    <div class="navbar bg-primary text-primary-content shadow-lg">
      <div class="navbar-start">
        <div class="dropdown">
          <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16"></path>
            </svg>
          </div>
          <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><router-link to="/" class="text-base-content">🏠 Home</router-link></li>
            <li><router-link to="/consultation" class="text-base-content">🩺 New Consultation</router-link></li>
            <li><router-link to="/verify" class="text-base-content">🔍 Verify Documents</router-link></li>
            <li><router-link to="/reports" class="text-base-content">📊 Reports</router-link></li>
          </ul>
        </div>
        <router-link to="/" class="btn btn-ghost text-xl">
          🩺 Doctor2GO
        </router-link>
      </div>
      
      <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal px-1">
          <li><router-link to="/" class="btn btn-ghost">🏠 Home</router-link></li>
          <li><router-link to="/consultation" class="btn btn-ghost">🩺 New Consultation</router-link></li>
          <li><router-link to="/verify" class="btn btn-ghost">🔍 Verify</router-link></li>
          <li><router-link to="/reports" class="btn btn-ghost">📊 Reports</router-link></li>
        </ul>
      </div>
      
      <div class="navbar-end">
        <div class="badge badge-accent">
          {{ consultationStore.totalConsultations }} Cases
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <router-view />
    </main>

    <!-- Sync Status -->
    <div class="sync-status">
      <div v-if="syncStatus.syncing" class="alert alert-info">
        <svg class="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
        Syncing data...
      </div>
      <div v-else-if="syncStatus.lastSync" class="text-sm text-gray-500">
        Last sync: {{ formatDate(syncStatus.lastSync) }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useConsultationStore } from '@/stores/consultation'
import { useStorageStore } from '@/stores/storage'
import { format } from 'date-fns'

const consultationStore = useConsultationStore()
const storageStore = useStorageStore()

const isOnline = ref(navigator.onLine)
const syncStatus = ref({
  syncing: false,
  lastSync: null
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
    syncStatus.value.lastSync = new Date()
  } catch (error) {
    console.error('Sync failed:', error)
  } finally {
    syncStatus.value.syncing = false
  }
}

const formatDate = (date) => {
  return format(new Date(date), 'MMM dd, HH:mm')
}
</script>