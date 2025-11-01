import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStorageStore = defineStore('storage', () => {
  const syncQueue = ref([])
  const lastSyncTime = ref(null)
  const isOnline = ref(navigator.onLine)
  
  // Add data to sync queue for when online
  const queueForSync = (type, data) => {
    syncQueue.value.push({
      id: Date.now(),
      type,
      data,
      timestamp: new Date().toISOString(),
      attempts: 0
    })
    saveQueueToStorage()
  }
  
  // Save sync queue to localStorage
  const saveQueueToStorage = () => {
    try {
      localStorage.setItem('doctor2go_sync_queue', JSON.stringify(syncQueue.value))
    } catch (error) {
      console.error('Failed to save sync queue:', error)
    }
  }
  
  // Load sync queue from localStorage
  const loadQueueFromStorage = () => {
    try {
      const stored = localStorage.getItem('doctor2go_sync_queue')
      if (stored) {
        syncQueue.value = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Failed to load sync queue:', error)
    }
  }
  
  // Sync pending data when online
  const syncPendingData = async () => {
    if (!isOnline.value || syncQueue.value.length === 0) return
    
    const failedItems = []
    
    for (const item of syncQueue.value) {
      try {
        await syncItem(item)
      } catch (error) {
        item.attempts++
        if (item.attempts < 3) {
          failedItems.push(item)
        }
        console.error(`Sync failed for item ${item.id}:`, error)
      }
    }
    
    syncQueue.value = failedItems
    lastSyncTime.value = new Date().toISOString()
    saveQueueToStorage()
    saveLastSyncTime()
  }
  
  // Simulate syncing individual item (replace with actual API calls)
  const syncItem = async (item) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    switch (item.type) {
      case 'consultation':
        await syncConsultation(item.data)
        break
      case 'certificate':
        await syncCertificate(item.data)
        break
      case 'receipt':
        await syncReceipt(item.data)
        break
      default:
        throw new Error(`Unknown sync type: ${item.type}`)
    }
  }
  
  // Mock API sync functions (replace with actual implementations)
  const syncConsultation = async (data) => {
    console.log('Syncing consultation:', data.id)
    // TODO: Implement actual API call
    // await api.consultations.create(data)
  }
  
  const syncCertificate = async (data) => {
    console.log('Syncing certificate:', data.number)
    // TODO: Implement actual API call
    // await api.certificates.create(data)
  }
  
  const syncReceipt = async (data) => {
    console.log('Syncing receipt:', data.number)
    // TODO: Implement actual API call
    // await api.receipts.create(data)
  }
  
  // Save last sync time
  const saveLastSyncTime = () => {
    try {
      localStorage.setItem('doctor2go_last_sync', lastSyncTime.value)
    } catch (error) {
      console.error('Failed to save last sync time:', error)
    }
  }
  
  // Load last sync time
  const loadLastSyncTime = () => {
    try {
      const stored = localStorage.getItem('doctor2go_last_sync')
      if (stored) {
        lastSyncTime.value = stored
      }
    } catch (error) {
      console.error('Failed to load last sync time:', error)
    }
  }
  
  // Export all local data
  const exportAllData = () => {
    const consultations = localStorage.getItem('doctor2go_consultations')
    const syncQueue = localStorage.getItem('doctor2go_sync_queue')
    const lastSync = localStorage.getItem('doctor2go_last_sync')
    
    return {
      consultations: consultations ? JSON.parse(consultations) : [],
      syncQueue: syncQueue ? JSON.parse(syncQueue) : [],
      lastSync,
      exportedAt: new Date().toISOString()
    }
  }
  
  // Import data (useful for data recovery)
  const importData = (data) => {
    try {
      if (data.consultations) {
        localStorage.setItem('doctor2go_consultations', JSON.stringify(data.consultations))
      }
      if (data.syncQueue) {
        localStorage.setItem('doctor2go_sync_queue', JSON.stringify(data.syncQueue))
        syncQueue.value = data.syncQueue
      }
      if (data.lastSync) {
        localStorage.setItem('doctor2go_last_sync', data.lastSync)
        lastSyncTime.value = data.lastSync
      }
    } catch (error) {
      console.error('Failed to import data:', error)
      throw error
    }
  }
  
  // Clear all local data
  const clearAllData = () => {
    localStorage.removeItem('doctor2go_consultations')
    localStorage.removeItem('doctor2go_sync_queue')
    localStorage.removeItem('doctor2go_last_sync')
    syncQueue.value = []
    lastSyncTime.value = null
  }
  
  // Initialize storage
  const initialize = () => {
    loadQueueFromStorage()
    loadLastSyncTime()
    
    // Listen for online/offline events
    window.addEventListener('online', () => {
      isOnline.value = true
      syncPendingData()
    })
    
    window.addEventListener('offline', () => {
      isOnline.value = false
    })
  }
  
  return {
    syncQueue,
    lastSyncTime,
    isOnline,
    queueForSync,
    syncPendingData,
    exportAllData,
    importData,
    clearAllData,
    initialize
  }
})