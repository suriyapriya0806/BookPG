# PG Booking Platform — Frontend Codebase

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18, Vite 5 |
| Routing | react-router-dom v6 |
| HTTP | Axios (pointed at `http://localhost:5000/api`) |
| Real-time | socket.io-client |
| Icons | lucide-react |
| Styling | Tailwind CSS 3 |
| Auth | localStorage-based (dev-only), no OAuth/Firebase |

---

## Project Structure

```
frontend/src/
├── api/
│   ├── apiConfig.js          # Export: USE_MOCK = true flag
│   └── mockApi.js            # Orphaned mock API (not called from UI)
├── components/
│   ├── admin/
│   │   └── BranchImage.jsx   # Admin branch image display component
│   ├── booking/
│   │   └── BedGrid.jsx       # Bed grid layout component
│   ├── layout/
│   │   ├── DashboardLayout.jsx  # Sidebar + topbar layout for admin/warden/user dashboards
│   │   └── PublicLayout.jsx     # Public navbar + footer layout
│   └── ui/
│       ├── Badge.jsx          # Status badge component
│       ├── Button.jsx         # Styled button (primary/secondary variants)
│       ├── Card.jsx           # Card wrapper
│       ├── Input.jsx          # Form input with label
│       ├── SectionHeader.jsx  # Section heading component
│       └── StatCard.jsx       # Dashboard stat card (label + value)
├── context/
│   ├── AuthContext.jsx        # Auth state: login(logiId, password), logout, user, token
│   └── ThemeContext.jsx       # Light/dark theme toggle (localStorage)
├── data/
│   ├── adminBeds.js           # BED_STATUSES, defaultBeds, loadBeds, saveBeds
│   ├── adminBlockNotifications.js  # Block notification localStorage layer
│   ├── adminBookings.js       # BOOKING_STATUSES, defaultBookings, loadBookings, saveBookings
│   ├── adminBranches.js       # defaultBranches (9 branches), loadBranches, saveBranches
│   ├── adminPayments.js       # PAYMENT_TYPES, PAYMENT_METHODS, defaultPayments, loadPayments
│   ├── adminResidents.js      # RESIDENT_STATUSES, defaultResidents, loadResidents, saveResidents
│   ├── adminRooms.js          # defaultRooms, ROOM_AMENITIES, loadRooms, saveRooms
│   ├── adminWardens.js        # defaultWardens, WARDEN_STATUSES, loadWardens, saveWardens
│   ├── bookingFlow.js         # exploreBranches, featuredPgBranches, bookingRooms, formatCurrency
│   ├── complaints.js          # COMPLAINT_STATUSES, defaultComplaints, loadComplaints, saveComplaints
│   ├── fallback.js            # sampleBranches, sampleRooms, sampleBeds (legacy)
│   └── landing.js             # featuredPgs, popularBranches, amenities, testimonials, faqs
├── design/
│   └── tokens.js              # Design tokens (colors, spacing, typography)
├── lib/
│   ├── computeAmountDue.js    # Amount due calculation logic
│   ├── liveAvailability.js    # useLiveAvailability hook, bed/room status bridging (RESERVED→Blocked)
│   ├── liveBlocks.js          # addBlockNotification, useLiveBlockNotifications hook
│   └── livePayments.js        # savePaymentRecord, calculatePaymentAnalytics, useLivePayments hook, receipt printing
├── pages/
│   ├── admin/
│   │   ├── AdminDashboard.jsx     # Dashboard: stat cards, block notifications, payment notifications
│   │   ├── BedsPage.jsx           # Manage beds (CRUD)
│   │   ├── BookingsPage.jsx       # Bookings list + ConfirmDialog + WalkInDialog + RejectDialog + AssignWardenDialog
│   │   ├── BranchDetailsPage.jsx  # Single branch detail view
│   │   ├── BranchesPage.jsx       # Manage branches (CRUD)
│   │   ├── ManagementPage.jsx     # Management dashboard
│   │   ├── PaymentsPage.jsx       # Payments list, stats, charts, monthly rent tracking
│   │   ├── ReportsPage.jsx        # Reports with filters, charts
│   │   ├── ResidentsPage.jsx      # Resident management
│   │   ├── RoomsPage.jsx          # Room management
│   │   ├── SettingsPage.jsx       # General + booking + payment + branch settings
│   │   └── WardensPage.jsx        # Warden management
│   ├── complaints/
│   │   └── ComplaintsPage.jsx     # Complaint management (all roles)
│   ├── guest/
│   │   ├── BedSelection.jsx       # LIVE: RedBus-style individual bed selection with SVG illustrations (194 lines)
│   │   ├── BedSelectionPage5.jsx  # STUB: older design version, NOT routed
│   │   ├── Booking.jsx            # LIVE: Phone + move-in date only, no payment, calls POST /bookings (71 lines)
│   │   ├── BookingDetails.jsx     # LEGACY: Full form + Aadhaar upload + payment navigation (262 lines)
│   │   ├── BookingFormPage7.jsx   # STUB: older design version, NOT routed
│   │   ├── BookingStatus.jsx      # LIVE: Shows "Bed Blocked Successfully" with booking reference (137 lines)
│   │   ├── BranchListing.jsx      # LIVE: Branch cards with Google Maps embed + "Get Directions"
│   │   ├── BranchListingPage2.jsx # STUB: older design version, NOT routed
│   │   ├── FeaturedBranches.jsx   # LIVE: Featured branches grid
│   │   ├── GuestLoginPage6.jsx    # STUB: Google/Facebook buttons but NO onClick handlers, NOT routed (232 lines)
│   │   ├── Home.jsx               # LIVE: Landing page with hero, featured branches, amenities, testimonials, FAQ
│   │   ├── Payment.jsx            # LEGACY: Payment page (₹0 scaffold), only reachable via old BookingDetails flow
│   │   ├── RoomDetails.jsx        # LIVE: Room listing with AC/Non-AC + sharing type filters, real-time availability
│   │   └── RoomDetailsPage4.jsx   # STUB: older design version, NOT routed
│   ├── user/
│   │   └── UserDashboard.jsx      # User dashboard
│   ├── warden/
│   │   ├── OccupancyPage.jsx      # Branch occupancy view
│   │   ├── WardenDashboard.jsx    # Warden dashboard: stat cards, recent collections, pending rent
│   │   ├── WardenPaymentsPage.jsx # Branch-scoped payment recording with receipt printing
│   │   └── WardenResidentsPage.jsx # Branch residents with check-in workflow
│   └── Login.jsx               # Email/password login (Admin, Warden, User roles)
├── routes/
│   ├── ProtectedRoute.jsx      # Route guard: redirects to /login if not authenticated
│   └── roleRoutes.js           # ROLES enum, dashboard path constants
├── services/
│   ├── api.js                  # Axios instance with Bearer token interceptor
│   ├── authService.js          # authenticate(): 3 hardcoded dev accounts (admin, warden WD001, user)
│   └── socket.js               # Socket.io client singleton
├── types/
│   └── entities.js             # JSDoc typedefs: Branch, Room, Bed, Guest, Booking, Payment, Complaint
├── App.jsx                     # Route definitions (93 lines)
├── index.css                   # Tailwind directives + custom styles
└── main.jsx                    # Entry point: BrowserRouter > ThemeProvider > AuthProvider > App
```

---

## Route Structure (App.jsx)

### Public Routes (`PublicLayout`)

| Path | Component | Purpose |
|------|-----------|---------|
| `/` | `Home` | Landing page |
| `/login` | `Login` | Email/password auth |
| `/branches` | `BranchListing` | Branch cards with map |
| `/featured-branches` | `FeaturedBranches` | Featured branches |
| `/branches/:branchId/rooms` | `RoomDetails` | Room listing + filters |
| `/rooms/:roomId/beds` | `BedSelection` | RedBus-style bed selection |
| `/booking-details` | `BookingDetails` | **Legacy** old flow (aadhaar + payment) |
| `/booking-status` | `BookingStatus` | Booking confirmation |
| `/booking` | `Booking` | **Protected** (USER) — phone-only booking |

### User Dashboard (`/pgbooking/user`, Protected)

| Path | Component |
|------|-----------|
| `/pgbooking/user/dashboard` | `UserDashboard` |
| `/pgbooking/user/booking` | `BookingDetails` (legacy) |
| `/pgbooking/user/payment` | `Payment` (legacy) |
| `/pgbooking/user/visits` | `BookingStatus` |
| `/pgbooking/user/complaints` | `ComplaintsPage` |

### Admin Dashboard (`/pgbooking/admin`, Protected)

| Path | Component |
|------|-----------|
| `/pgbooking/admin/dashboard` | `AdminDashboard` |
| `/pgbooking/admin/branches` | `BranchesPage` |
| `/pgbooking/admin/branches/:branchId` | `BranchDetailsPage` |
| `/pgbooking/admin/rooms` | `RoomsPage` |
| `/pgbooking/admin/beds` | `BedsPage` |
| `/pgbooking/admin/bookings` | `BookingsPage` (confirm + walk-in) |
| `/pgbooking/admin/residents` | `ResidentsPage` |
| `/pgbooking/admin/wardens` | `WardensPage` |
| `/pgbooking/admin/payments` | `PaymentsPage` |
| `/pgbooking/admin/reports` | `ReportsPage` |
| `/pgbooking/admin/complaints` | `ComplaintsPage` |
| `/pgbooking/admin/settings` | `SettingsPage` |

### Warden Dashboard (`/pgbooking/warden`, Protected)

| Path | Component |
|------|-----------|
| `/pgbooking/warden/dashboard` | `WardenDashboard` |
| `/pgbooking/warden/residents` | `WardenResidentsPage` |
| `/pgbooking/warden/payments` | `WardenPaymentsPage` |
| `/pgbooking/warden/occupancy` | `OccupancyPage` |
| `/pgbooking/warden/complaints` | `ComplaintsPage` |

---

## Data Models

### Enums

```javascript
// adminBookings.js
BOOKING_STATUSES = ["Blocked", "Confirmed", "Rejected", "Cancelled", "Checked In", "Expired"]
PAYMENT_STATUSES = ["Pending", "Paid", "Refunded"]

// adminBeds.js
BED_STATUSES = ["Available", "Occupied", "Blocked", "Maintenance"]

// adminResidents.js
RESIDENT_STATUSES = ["Pending Check-In", "Active", "Vacating", "Checked Out"]

// adminPayments.js
PAYMENT_TYPES = ["Booking Token", "Security Deposit", "Monthly Rent", "Electricity Charges", "Other Charges", "Refund", "Fine"]
PAYMENT_METHODS = ["Cash", "UPI", "Card", "Bank Transfer"]
PAYMENT_STATUSES = ["Paid", "Pending", "Overdue", "Partial", "Refunded"]

// complaints.js
COMPLAINT_STATUSES = ["New", "Assigned", "In Progress", "Waiting for Resident", "Resolved", "Closed", "Escalated"]

// roleRoutes.js
ROLES = { USER: "USER", WARDEN: "WARDEN", ADMIN: "ADMIN" }
```

### JSDoc Type Definitions (entities.js)

```javascript
AuthProvider = "google" | "facebook" | "local"    // Google/Facebook defined but NOT implemented
BookingStatus = "blocked" | "confirmed" | "rejected" | "cancelled" | "checked_in" | "expired"
BedStatus = "available" | "blocked" | "booked" | "occupied" | "maintenance"
PaymentMethod = "upi" | "card" | "cash" | "bank_transfer" | "mock"
```

### Branch Shape (bookingFlow.js)

```javascript
{
  id: "anna-nagar-pg",           // Unique branch ID
  name: "Anna Nagar PG",
  addressLines: ["...", "..."],
  startingPrice: 14500,          // in ₹
  rating: "4.9",
  contactNumber: "+91 90000 01414",
  latitude: 13.0878,             // For Google Maps
  longitude: 80.2089,
  fullAddress: "...",
  googleMapsUrl: "...",
  image: "https://images.unsplash.com/...",
  gallery: ["..."],
  facilities: ["WiFi", "Housekeeping", ...],
  occupancy: { totalRooms: 150, bookedRooms: 120, availableRooms: 30 }
}
```

### Booking Shape (adminBookings.js)

```javascript
{
  id: "BK0001",
  customerName: "Rahul Kumar",
  phone: "9876542101",
  email: "...",
  branchId: "anna-nagar",
  branchName: "Anna Nagar",
  roomId: "anna-101",
  roomNumber: "101",
  bedId: "anna-101-bed-a",
  bedName: "Bed A",
  bookingStatus: "Blocked",       // One of BOOKING_STATUSES
  paymentStatus: "Paid",          // One of PAYMENT_STATUSES
  paymentMethod: "UPI",
  bookingDate: "2026-07-18",
  moveInDate: "2026-08-01",
  assignedWardenId: "",
  rejectionReason: ""
}
```

### Bed Shape (adminBeds.js)

```javascript
{
  id: "anna-101-bed-a",
  branchId: "anna-nagar",
  branchName: "Anna Nagar",
  roomId: "anna-101",
  roomNumber: "101",
  bedName: "Bed A",
  status: "Available",            // One of BED_STATUSES
  currentResident: "",
  bookingId: "",
  checkInDate: "",
  checkOutDate: "",
  description: "..."
}
```

---

## Key Flows

### Guest Flow (ACTIVE)

```
Home → BranchListing (map embed) → RoomDetails (AC/Non-AC + sharing filters) →
BedSelection (individual bed pick, RedBus-style) → Login (email/password) →
Booking (phone + move-in date only, no payment) → BookingStatus ("Bed Blocked Successfully")
```

**No payment required online. Guest creates a BLOCKED booking. Admin follows up in person.**

### Admin Notification Flow

```
Guest clicks "Block Bed" in Booking.jsx
  → api.post("/bookings") creates BLOCKED booking in backend
  → addBlockNotification(user, data) saves to localStorage (pg_block_notifications)
  → AdminDashboard "Recently Blocked Beds" card reactively updates via custom event
```

### Admin Confirm + Payment Flow

```
Admin opens BookingsPage → clicks confirm (ShieldCheck icon) on a BLOCKED booking
  → ConfirmDialog opens asking for: Amount, Payment Method (Cash/UPI/Bank Transfer), Reference
  → handleConfirm sets status→Confirmed, paymentStatus→Paid
  → Bed stays Blocked (occupied by the booking)
```

### Admin Walk-In Flow

```
Admin clicks "New Booking" button on BookingsPage
  → WalkInDialog opens with: Name, Phone, Branch→Room→Bed cascade, Move-in date, Amount, Payment Method
  → handleWalkInSave creates CONFIRMED booking + PAID payment + marks bed as Blocked
```

### Warden Payment Flow

```
Warden opens WardenPaymentsPage → clicks "Collect Payment"
  → CollectPaymentModal: Resident, Payment Type (Rent/Deposit/etc), Amount, Method (Cash/UPI/Card/Bank Transfer)
  → savePaymentRecord saves to localStorage (pg_admin_payments)
  → Receipt prints in new window (printable)
```

### Admin Payments View

```
PaymentsPage shows:
  - Stat cards: Total Revenue, Today's Collection, Pending Payments, Overdue Payments
  - Monthly Rent Tracking: per-resident rent due status (Paid/Partial/Overdue/Pending)
  - Filterable table: by branch, payment type, method, status, month
  - Charts: Monthly Revenue, Occupancy, Payment Status
```

---

## Branches (Static Data)

9 branches hardcoded in `bookingFlow.js` and `adminBranches.js`:

| ID | Name | Status |
|----|------|--------|
| anna-nagar | Anna Nagar | Active |
| virugambakkam | Virugambakkam | Active |
| tambaram | Tambaram | Active |
| velachery | Velachery | Active |
| porur | Porur | Inactive |
| guindy | Guindy | Active |
| t-nagar | T Nagar | Active |
| medavakkam | Medavakkam | Inactive |
| sholinganallur | Sholinganallur | Active |

**Adding a new branch requires code changes** in `bookingFlow.js` and `adminBranches.js` — no runtime UI.

---

## Currency

All prices use `₹` (Indian Rupees) with `en-IN` locale. Zero occurrences of `$` or `USD` in frontend.

```javascript
// bookingFlow.js:402
export const formatCurrency = (amount) => `₹${amount.toLocaleString("en-IN")}`;
```

---

## Auth System (Dev-Only)

**3 hardcoded accounts in authService.js:**

| Role | Login ID | Password |
|------|----------|----------|
| ADMIN | `admin@pgstay.com` | `Admin@123` |
| WARDEN | `WD001` | `Temp@123` |
| USER | `user@pgstay.com` | `User@123` |

**AuthContext only supports `login(loginId, password)` — no social login methods exist.**

---

## Gap Analysis vs Business Requirements

| # | Requirement | Status | Details |
|---|-------------|--------|---------|
| 1 | Google/Facebook sign-in | ❌ Not implemented | `GuestLoginPage6.jsx` has buttons but no onClick handlers, no Firebase, no OAuth SDK, page not routed |
| 2 | Browse by AC/Non-AC, sharing type | ✅ Implemented | `RoomDetails.jsx` with working filter toggles + real-time availability |
| 3 | Branch location map | ✅ Implemented | `BranchListing.jsx` embeds Google Maps iframe per card + "Get Directions" |
| 4 | RedBus-style bed selection | ✅ Implemented | `BedSelection.jsx` individual bed cards, availability states, premium SVG |
| 5 | Guest signs in (Google/Facebook) | ❌ Not implemented | Same as #1 — no social login wired up |
| 6 | Manual confirmation by Admin | ✅ Implemented | `ConfirmDialog` in `BookingsPage.jsx` with Amount + Method + Reference |
| 7 | Admin notified on block | ✅ Implemented | `addBlockNotification()` → AdminDashboard "Recently Blocked Beds" |
| 8 | Admin walk-in booking | ✅ Implemented | `WalkInDialog` in `BookingsPage.jsx` with branch→room→bed cascade |
| 9 | Manual payment entry by Admin | ✅ Implemented | ConfirmDialog captures Amount, Method (Cash/UPI/Bank Transfer), Reference |
| 10 | Wardens log rent/deposit payments | ✅ Implemented | `WardenPaymentsPage.jsx` with CollectPaymentModal, Cash/UPI/Card/Bank Transfer |
| 11 | Admin consolidated pending payments | ✅ Implemented | `PaymentsPage.jsx` with Pending/Overdue stat cards, monthly rent tracking, filterable table |
| 12 | Add branches without rebuild | ❌ Not implemented | All branch data hardcoded in source files |
| 13 | All prices in ₹ | ✅ Implemented | All formatCurrency uses ₹ + en-IN locale |

---

## Routing Fix Applied

The guest link in `BedSelection.jsx` previously pointed to `/booking-details` (old flow with Aadhaar upload + payment, `BookingDetails.jsx:262` lines). It now points to `/booking` (new simplified phone-only flow, `Booking.jsx:71` lines) with `state={{ roomId, branchId, selectedBed }}`.

---

## localStorage Keys Used

| Key | Data | Source |
|-----|------|--------|
| `pg_token` | Auth token | AuthContext |
| `pg_user` | User object | AuthContext |
| `pg_admin_bookings` | Admin bookings | adminBookings.js |
| `pg_admin_beds` | Admin beds | adminBeds.js |
| `pg_admin_branches` | Admin branches | adminBranches.js |
| `pg_admin_payments` | Admin payments | adminPayments.js |
| `pg_admin_residents` | Admin residents | adminResidents.js |
| `pg_admin_rooms` | Admin rooms | adminRooms.js |
| `pg_admin_wardens` | Admin wardens | adminWardens.js |
| `pg_admin_amenities` | Amenities config | adminBranches.js |
| `pg_block_notifications` | Block notifications | adminBlockNotifications.js |
| `pg_payment_notifications` | Payment notifications | adminPayments.js |
| `pg_payment_rent_due_config` | Rent due date config | adminPayments.js |
| `pg_admin_room_amenities` | Room amenities | adminRooms.js |
| `pg_complaints` | Complaints | complaints.js |
| `pgstay-theme` | Theme preference | ThemeContext |

---

## Key Libraries (package.json)

- react 18.3.1, react-dom 18.3.1
- react-router-dom 6.26.1
- axios 1.7.4
- socket.io-client 4.7.5
- lucide-react 0.468.0
- tailwindcss 3.4.10, autoprefixer 10.4.20, postcss 8.4.41
- vite 5.4.2, @vitejs/plugin-react 4.3.1
