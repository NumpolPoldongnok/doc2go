import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { format } from 'date-fns'

// Types
interface Patient {
  fullName: string
  gender: string
  age: string
  nationality: string
  passportNo: string
  hotel: string
  roomNo: string
  contactNo: string
  email: string
}

interface MedicalAdvice {
  fitToTravel: boolean
  fitToFly: boolean
  unfitToFlyUntil: string
  fitToWork: boolean
  unfitToWorkDays: string
  hospitalAdmission: boolean
}

interface Medical {
  diagnosis: string
  icd10: string
  cause: string
  treatment: string
  medication: string
  procedures: string[]
  advice: MedicalAdvice
  remarks: string
  attachments: string[]
}

interface Certificate {
  number: string
  qrCode: string
  digitalSignature: string
  generatedAt: string | null
}

interface Service {
  id: string
  name: string
  price: number
  quantity: number
}

interface Billing {
  services: Service[]
  subtotal: number
  vat: number
  total: number
  paymentMethod: string
  receiptNumber: string
  receiptQrCode: string
}

interface Consultation {
  id: string
  caseId: string
  createdAt: string
  updatedAt: string
  status: 'draft' | 'completed' | 'cancelled'
  completedAt?: string
  patient: Patient
  medical: Medical
  certificate: Certificate
  billing: Billing
}

export const useConsultationStore = defineStore('consultation', () => {
  // State
  const consultations = ref<Consultation[]>([])
  const currentConsultation = ref<Consultation | null>(null)
  const currentStep = ref<number>(1)
  
  // Getters
  const totalConsultations = computed(() => consultations.value.length)
  const todayConsultations = computed(() => {
    const today = format(new Date(), 'yyyy-MM-dd')
    return consultations.value.filter(c => 
      format(new Date(c.createdAt), 'yyyy-MM-dd') === today
    ).length
  })
  
  // Actions
  const initializeConsultation = () => {
    currentConsultation.value = {
      id: uuidv4(),
      caseId: generateCaseId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft',
      
      // Step 1: Patient Info
      patient: {
        fullName: '',
        gender: '',
        age: '',
        nationality: '',
        passportNo: '',
        hotel: '',
        roomNo: '',
        contactNo: '',
        email: ''
      },
      
      // Step 2: Medical Record
      medical: {
        diagnosis: '',
        icd10: '',
        cause: '',
        treatment: '',
        medication: '',
        procedures: [],
        advice: {
          fitToTravel: false,
          fitToFly: false,
          unfitToFlyUntil: '',
          fitToWork: false,
          unfitToWorkDays: '',
          hospitalAdmission: false
        },
        remarks: '',
        attachments: []
      },
      
      // Step 3: Certificate
      certificate: {
        number: '',
        qrCode: '',
        digitalSignature: '',
        generatedAt: null
      },
      
      // Step 4: Billing
      billing: {
        services: [],
        subtotal: 0,
        vat: 0,
        total: 0,
        paymentMethod: '',
        receiptNumber: '',
        receiptQrCode: ''
      }
    }
    
    currentStep.value = 1
  }
  
  const generateCaseId = () => {
    const year = new Date().getFullYear()
    const sequence = String(consultations.value.length + 1).padStart(6, '0')
    return `DG-${year}-${sequence}`
  }
  
  const saveConsultation = () => {
    if (!currentConsultation.value) return
    
    currentConsultation.value.updatedAt = new Date().toISOString()
    
    const existingIndex = consultations.value.findIndex(
      c => c.id === currentConsultation.value!.id
    )
    
    if (existingIndex !== -1) {
      consultations.value[existingIndex] = { ...currentConsultation.value }
    } else {
      consultations.value.push({ ...currentConsultation.value })
    }
    
    saveToStorage()
  }
  
  const completeConsultation = () => {
    if (!currentConsultation.value) return
    
    currentConsultation.value.status = 'completed'
    currentConsultation.value.completedAt = new Date().toISOString()
    saveConsultation()
  }
  
  const nextStep = () => {
    if (currentStep.value < 4) {
      currentStep.value++
      saveConsultation() // Auto-save on step change
    }
  }
  
  const previousStep = () => {
    if (currentStep.value > 1) {
      currentStep.value--
    }
  }
  
  const goToStep = (step: number) => {
    if (step >= 1 && step <= 4) {
      currentStep.value = step
    }
  }
  
  const loadConsultation = (id: string) => {
    const consultation = consultations.value.find(c => c.id === id)
    if (consultation) {
      currentConsultation.value = { ...consultation }
      currentStep.value = 1
    }
  }
  
  const deleteConsultation = (id: string) => {
    consultations.value = consultations.value.filter(c => c.id !== id)
    saveToStorage()
  }
  
  const saveToStorage = () => {
    try {
      localStorage.setItem('doctor2go_consultations', JSON.stringify(consultations.value))
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }
  }
  
  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem('doctor2go_consultations')
      if (stored) {
        consultations.value = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error)
    }
  }
  
  const exportData = () => {
    return {
      consultations: consultations.value,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    }
  }
  
  const importData = (data: any) => {
    if (data.consultations && Array.isArray(data.consultations)) {
      consultations.value = data.consultations
      saveToStorage()
    }
  }
  
  return {
    // State
    consultations,
    currentConsultation,
    currentStep,
    
    // Getters
    totalConsultations,
    todayConsultations,
    
    // Actions
    initializeConsultation,
    saveConsultation,
    completeConsultation,
    nextStep,
    previousStep,
    goToStep,
    loadConsultation,
    deleteConsultation,
    saveToStorage,
    loadFromStorage,
    exportData,
    importData
  }
})