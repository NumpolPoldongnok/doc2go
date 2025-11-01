# Copilot Instructions for Doctor2GO

## Project Overview
Doctor2GO is a Vue 3 + DaisyUI offline-first medical consultation system for generating certificates and receipts. The app enables doctors to conduct on-site consultations, create medical records, generate certificates with QR verification, and issue receipts - all while working offline with automatic data sync.

## Architecture & Key Components

### Vue 3 Architecture
- **Composition API**: All components use `<script setup>` with reactive refs and computed properties
- **Pinia Stores**: Centralized state management for consultations and offline storage
- **Vue Router**: Hash-based routing for SPA navigation
- **Component Structure**: Form components nested within workflow views

### State Management Pattern
```javascript
// Stores follow this pattern:
const useConsultationStore = defineStore('consultation', () => {
  const state = ref(initialData)
  const computed = computed(() => derivedData)
  const actions = () => { /* mutations */ }
  return { state, computed, actions }
})
```

### Offline-First Data Flow
1. **Local Storage**: Primary data persistence (`localStorage`)
2. **Sync Queue**: Pending operations stored for when online
3. **Auto-sync**: Background sync when connection restored
4. **Export/Import**: JSON-based data backup/restore

## Development Workflow

### Essential Commands
```bash
npm run dev          # Development server with hot reload
npm run build        # Production build with Vite
npm run preview      # Preview production build locally
npm run lint         # ESLint with Vue plugin
```

### Component Development Pattern
1. Create reactive local state with `ref()`
2. Watch props and emit updates to parent
3. Use DaisyUI classes for styling
4. Implement validation with computed properties
5. Auto-save with debounced watchers

## Code Patterns & Conventions

### Form Component Pattern
```vue
<script setup>
// Props/emits declaration
const props = defineProps({ data: Object })
const emit = defineEmits(['update:data'])

// Local reactive copy for v-model
const localData = ref({ ...props.data })

// Watch for changes and emit
watch(localData, (newValue) => {
  emit('update:data', newValue)
}, { deep: true })
</script>
```

### DaisyUI Class Conventions
- `.medical-advice-card`: Consistent card styling for form sections
- `.field-group`: Grid layout for form fields (responsive)
- `.certificate-preview`: Print-ready document preview
- Custom theme: `doctor2go` with medical color palette

### QR Code Integration
- Use `qrcode` library with canvas elements
- Verification URLs: `doctor2go.net/verify?cert={number}`
- Generate during certificate/receipt creation
- Support both display and scanning (mock implementation)

### Local Storage Strategy
```javascript
// Consistent naming convention
const STORAGE_KEYS = {
  consultations: 'doctor2go_consultations',
  syncQueue: 'doctor2go_sync_queue',
  lastSync: 'doctor2go_last_sync'
}
```

## Key Files & Directories

### Critical Architecture Files
- `src/stores/consultation.js`: Core business logic for consultation workflow
- `src/stores/storage.js`: Offline storage and sync management
- `src/App.vue`: Main layout with offline indicators and navigation
- `src/views/Consultation.vue`: 4-step consultation workflow orchestration

### Form Components (Data Entry)
- `src/components/PatientForm.vue`: Patient demographics with auto-fill mock
- `src/components/MedicalRecordForm.vue`: Diagnosis, treatment, medical advice
- `src/components/CertificateForm.vue`: Certificate generation with QR codes
- `src/components/BillingForm.vue`: Service billing with VAT calculation

### Views (Page Components)
- `src/views/Home.vue`: Dashboard with statistics and quick actions
- `src/views/Verify.vue`: QR code scanning and document verification
- `src/views/Reports.vue`: Analytics, filtering, and data export

### Configuration
- `tailwind.config.js`: DaisyUI theme customization
- `vite.config.js`: Build configuration and path aliases
- `package.json`: Dependencies include Vue 3, DaisyUI, QRcode, jsPDF

## External Dependencies

### Core UI Stack
- **DaisyUI 4.4+**: Component library built on Tailwind CSS
- **Vue 3.4+**: Composition API with `<script setup>`
- **Pinia 2.1+**: Vue 3 state management (replaces Vuex)

### Document Generation
- **qrcode**: QR code generation for verification
- **jsPDF**: PDF generation for certificates/receipts
- **html2canvas**: HTML to image conversion for PDF embedding

### Utilities
- **date-fns**: Date formatting and manipulation
- **uuid**: Unique ID generation for consultations
- **Vue Router 4**: SPA routing

## Testing Strategy

### Mock Data Approach
The app uses comprehensive mock data for offline development:
- **Patient auto-fill**: Simulated passport scanning, hotel QR, PMS import
- **ICD-10 helper**: Mock diagnosis code lookup
- **Verification system**: Simulated document verification responses
- **Service pricing**: Realistic Thai medical service costs

### Manual Testing Scenarios
1. **Offline workflow**: Complete consultation without network
2. **Data persistence**: Browser refresh should preserve state
3. **Form validation**: Required fields and business rules
4. **QR generation**: Verify codes are scannable
5. **Responsive design**: Test on mobile/tablet viewports

## Debugging & Troubleshooting

### Common Issues
- **LocalStorage full**: Check browser storage limits (usually 10MB)
- **QR canvas errors**: Ensure canvas refs are mounted before QR generation
- **DaisyUI classes not applying**: Verify Tailwind/DaisyUI build process
- **Form validation**: Check computed validation errors in dev tools

### Development Tools
- Vue DevTools for component inspection and Pinia state
- Browser Application tab for localStorage inspection
- Network tab to test offline functionality
- Console for auto-save and sync debugging

### Data Recovery
```javascript
// Export data for backup
const data = consultationStore.exportData()

// Import data for recovery
consultationStore.importData(jsonData)
```

---
*Focus on the offline-first consultation workflow and DaisyUI component patterns when contributing to this codebase.*