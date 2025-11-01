# 🩺 Doctor2GO - Medical Certificate & Receipt Issuance System

A Vue 3 + DaisyUI offline-first web application for managing medical consultations, generating certificates, and issuing receipts for on-site medical services.

## 🚀 Features

### Core Functionality
- **📋 Patient Consultation Management** - Complete digital form system
- **🏥 Medical Record Creation** - Diagnosis, treatment, and medical advice
- **📄 Certificate Generation** - Digital medical certificates with QR verification
- **💰 Billing & Receipts** - Automated invoicing with VAT calculation
- **🔍 Document Verification** - QR code and manual verification system
- **📊 Reports & Analytics** - Comprehensive reporting dashboard

### Technical Features
- **📱 Offline-First Design** - Works without internet connection
- **💾 Local Storage** - Data persistence with automatic sync
- **🎨 Modern UI** - Beautiful DaisyUI components with responsive design
- **📱 Mobile Friendly** - Optimized for tablets and mobile devices
- **🔄 Auto-Save** - Automatic draft saving during form completion

## 🛠️ Tech Stack

- **Frontend**: Vue 3 + Composition API
- **UI Framework**: DaisyUI + Tailwind CSS
- **State Management**: Pinia
- **Routing**: Vue Router
- **QR Codes**: qrcode library
- **PDF Generation**: jsPDF + html2canvas
- **Build Tool**: Vite
- **Storage**: Local Storage + IndexedDB (future)

## 📁 Project Structure

```
src/
├── components/           # Reusable components
│   ├── PatientForm.vue      # Patient information form
│   ├── MedicalRecordForm.vue # Medical diagnosis & treatment
│   ├── CertificateForm.vue   # Certificate generation
│   └── BillingForm.vue       # Billing & receipt system
├── views/               # Page components
│   ├── Home.vue             # Dashboard & overview
│   ├── Consultation.vue     # Main consultation workflow
│   ├── Verify.vue           # Document verification
│   └── Reports.vue          # Analytics & reporting
├── stores/              # Pinia state management
│   ├── consultation.js      # Consultation data & workflow
│   └── storage.js           # Offline storage & sync
├── router/              # Vue Router configuration
└── style.css           # Global styles & DaisyUI customization
```

## 🔄 Consultation Workflow

### Step 1: Patient Information
- Basic demographics and contact details
- Auto-fill from passport scan, hotel QR, or PMS integration
- Patient ID generation

### Step 2: Medical Record
- Primary diagnosis with ICD-10 coding
- Treatment, medication, and procedures
- Medical advice (fit to travel/fly/work)
- Supporting document attachments

### Step 3: Certificate Generation
- Automated certificate creation
- QR code for verification
- Digital signature integration
- PDF export capabilities

### Step 4: Billing & Receipt
- Service selection and pricing
- VAT calculation (7%)
- Multiple payment methods
- Official receipt generation

## 💾 Data Management

### Local Storage Strategy
- **Consultations**: `doctor2go_consultations`
- **Sync Queue**: `doctor2go_sync_queue` 
- **Last Sync**: `doctor2go_last_sync`
- **Recent Verifications**: `doctor2go_recent_verifications`

### Offline Capabilities
- Complete consultation workflow available offline
- Automatic data queuing for sync when online
- Local data persistence across browser sessions
- Export/import functionality for data backup

## 🔍 Document Verification

### QR Code System
- **Certificates**: `https://doctor2go.net/verify?cert=DG-YYYY-XXXXXX`
- **Receipts**: `https://doctor2go.net/verify?receipt=DRG-YYYY-XXXXXX`

### Verification Features
- QR code scanning (camera integration)
- Manual document number entry
- Real-time verification status
- Document authenticity checking
- Verification history tracking

## 🎨 UI/UX Features

### DaisyUI Theme: `doctor2go`
- **Primary**: `#0066cc` (Medical Blue)
- **Secondary**: `#00cc66` (Medical Green)
- **Accent**: `#f59e0b` (Warning Orange)

### Responsive Design
- Mobile-first approach
- Tablet optimization for on-site use
- Desktop dashboard view
- Print-friendly layouts

### Accessibility
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- High contrast color scheme

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/doctor2go/doc2go.git
cd doc2go

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Development Workflow

```bash
# Development with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📱 Usage

### Starting a New Consultation
1. Navigate to **New Consultation**
2. Complete the 4-step workflow:
   - Patient Information
   - Medical Record
   - Certificate Generation  
   - Billing & Receipt

### Document Verification
1. Go to **Verify Documents**
2. Scan QR code or enter document number manually
3. View verification results and document details

### Reports & Analytics
1. Access **Reports** section
2. Apply filters (date range, status, etc.)
3. View statistics and export data

## 🔧 Configuration

### Environment Variables
```env
VITE_API_BASE_URL=https://api.doctor2go.net
VITE_VERIFY_BASE_URL=https://doctor2go.net/verify
VITE_COMPANY_NAME=Doctor2GO Co., Ltd.
VITE_TAX_ID=0123456789012
```

### Local Storage Configuration
- Maximum storage: 10MB per domain
- Auto-cleanup: Remove data older than 1 year
- Sync frequency: Every 5 minutes when online

## 🧪 Testing

### Mock Data
The application includes comprehensive mock data for:
- Sample patients and consultations
- ICD-10 code helpers
- Doctor profiles
- Service pricing
- Verification responses

### Testing Scenarios
- Offline consultation workflow
- QR code generation and scanning
- Document verification
- Data export/import
- Responsive design

## 🔄 Future Enhancements

### Phase 2 Features
- [ ] Real-time camera QR scanning
- [ ] Biometric authentication
- [ ] Insurance API integration
- [ ] Multi-language support (Thai/English)
- [ ] Advanced analytics dashboard

### Integration Points
- [ ] Hospital PMS systems
- [ ] Insurance company APIs
- [ ] Government health databases
- [ ] Cloud storage providers
- [ ] SMS/Email services

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- Email: support@doctor2go.net
- Documentation: https://docs.doctor2go.net
- Issues: https://github.com/doctor2go/doc2go/issues

---

Made with ❤️ by the Doctor2GO Team