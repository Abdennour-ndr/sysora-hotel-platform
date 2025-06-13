# Sysora Platform

A complete hotel management SaaS platform with landing page and full-featured dashboard. Built with React, Node.js, Express, MongoDB, and Tailwind CSS.

## 🚀 Features

### Landing Page
- **Modern Design**: Clean, professional design with Sysora brand colors
- **Fully Responsive**: Mobile-first design that works on all devices
- **Interactive Signup**: Complete hotel registration flow with subdomain validation
- **Real-time Subdomain Check**: Instant availability checking
- **Performance Optimized**: Built with Vite for fast development and production builds

### Hotel Management System
- **Dashboard**: Comprehensive overview with real-time statistics
- **Room Management**: Add, edit, and manage hotel rooms with status tracking
- **Guest Management**: Complete guest profiles with loyalty programs and VIP status
- **Reservation System**: Full booking management with status tracking and payments
- **User Management**: Role-based access control with permissions
- **Multi-tenant**: Each hotel gets its own workspace with custom subdomain

### Advanced Features (NEW!)
- **Service Management**: Complete service catalog with pricing and scheduling
- **Service Requests**: Guest service requests with staff assignment and tracking
- **Payment Processing**: Full payment management with multiple methods and refunds
- **Custom Theming**: Hotel-specific branding with custom colors and logos
- **Dashboard Customization**: Personalized dashboard layouts and widgets
- **Multi-language Support**: Arabic and English interface support

### Technical Features
- **RESTful API**: Complete backend API with authentication
- **JWT Authentication**: Secure token-based authentication
- **MongoDB Database**: Scalable NoSQL database with optimized schemas
- **File Upload**: Logo and document upload with secure storage
- **Real-time Updates**: Live dashboard updates
- **Responsive Design**: Works on all devices
- **RTL Support**: Ready for Arabic and other RTL languages
- **Dynamic Theming**: CSS variables for real-time theme changes

## 🎨 Brand Identity

- **Colors**:
  - Midnight Blue: `#002D5B`
  - Mint: `#2EC4B6`
  - Light Background: `#F9FAFB`
- **Typography**: Inter & Poppins
- **Design**: 2xl rounded corners, subtle shadows

## 🛠️ Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sysora-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start MongoDB**
   - **Windows**: Start MongoDB service or run `mongod.exe`
   - **macOS**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongod`

4. **Start the platform**
   ```bash
   npm run dev
   ```
   This will start both frontend (port 3000) and backend (port 5000)

5. **Access the application**
   - Landing Page: `http://localhost:3000`
   - API: `http://localhost:5000`
   - Dashboard: `http://localhost:3000/dashboard` (after registration)

### Alternative: Start services separately

```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

## 🛠️ Available Scripts

- `npm run dev` - Start both frontend and backend
- `npm run dev:frontend` - Start frontend only (port 3000)
- `npm run dev:backend` - Start backend only (port 5000)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm start` - Start production server

## 🚀 Quick Demo

1. Visit `http://localhost:3000`
2. Click "Get Started" or "Create Hotel Account"
3. Fill in the registration form with your details
4. Note the temporary password shown in the console
5. Access the dashboard at `http://localhost:3000/dashboard`
6. Explore the hotel management features

## 📁 Project Structure

```
sysora-platform/
├── src/                         # Frontend source code
│   ├── components/              # React components
│   │   ├── HeroSection.jsx      # Landing page hero
│   │   ├── FeaturedModule.jsx   # Hotel module showcase
│   │   ├── SignupForm.jsx       # Registration form
│   │   └── ...                  # Other components
│   ├── pages/                   # Page components
│   │   └── Dashboard.jsx        # Hotel dashboard
│   ├── App.jsx                  # Main app with routing
│   ├── main.jsx                 # React entry point
│   └── index.css                # Global styles
├── server/                      # Backend source code
│   ├── models/                  # MongoDB models
│   │   ├── Hotel.js             # Hotel schema
│   │   ├── User.js              # User schema
│   │   ├── Room.js              # Room schema
│   │   ├── Guest.js             # Guest schema
│   │   └── Reservation.js       # Reservation schema
│   ├── routes/                  # API routes
│   │   ├── auth.js              # Authentication routes
│   │   ├── hotels.js            # Hotel management
│   │   ├── rooms.js             # Room management
│   │   ├── guests.js            # Guest management
│   │   └── reservations.js      # Reservation management
│   ├── middleware/              # Express middleware
│   │   └── auth.js              # Authentication middleware
│   └── index.js                 # Server entry point
├── .env                         # Environment variables
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

## 🔧 API Documentation

### Authentication Endpoints

#### Register Hotel
```http
POST /api/auth/register-hotel
Content-Type: application/json

{
  "fullName": "John Doe",
  "companyName": "Grand Hotel",
  "email": "john@grandhotel.com",
  "employeeCount": "6-20",
  "subdomain": "grandhotel"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@grandhotel.com",
  "password": "temporary_password",
  "subdomain": "grandhotel"
}
```

#### Check Subdomain Availability
```http
GET /api/auth/check-subdomain/{subdomain}
```

### Hotel Management Endpoints

#### Get Dashboard Data
```http
GET /api/hotels/dashboard
Authorization: Bearer {token}
```

#### Update Hotel Profile
```http
PUT /api/hotels/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Hotel Name",
  "phone": "+1234567890",
  "address": {...}
}
```

### Room Management Endpoints

#### Get All Rooms
```http
GET /api/rooms?status=available&type=deluxe&page=1&limit=20
Authorization: Bearer {token}
```

#### Create Room
```http
POST /api/rooms
Authorization: Bearer {token}
Content-Type: application/json

{
  "number": "101",
  "type": "deluxe",
  "maxOccupancy": 2,
  "bedCount": 1,
  "basePrice": 120
}
```

### Guest Management Endpoints

#### Get All Guests
```http
GET /api/guests?search=john&page=1&limit=20
Authorization: Bearer {token}
```

#### Create Guest
```http
POST /api/guests
Authorization: Bearer {token}
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@email.com",
  "phone": "+1234567890"
}
```

### Reservation Management Endpoints

#### Get All Reservations
```http
GET /api/reservations?status=confirmed&page=1&limit=20
Authorization: Bearer {token}
```

#### Create Reservation
```http
POST /api/reservations
Authorization: Bearer {token}
Content-Type: application/json

{
  "guestId": "guest_id",
  "roomId": "room_id",
  "checkInDate": "2024-01-15",
  "checkOutDate": "2024-01-18",
  "adults": 2,
  "roomRate": 120
}
```

### Payment Management Endpoints

#### Get All Payments
```http
GET /api/payments?status=completed&page=1&limit=20
Authorization: Bearer {token}
```

#### Create Payment
```http
POST /api/payments
Authorization: Bearer {token}
Content-Type: application/json

{
  "reservationId": "reservation_id",
  "amount": 240,
  "paymentMethod": "credit_card",
  "transactionId": "txn_123456"
}
```

#### Process Refund
```http
POST /api/payments/{paymentId}/refund
Authorization: Bearer {token}
Content-Type: application/json

{
  "amount": 50,
  "reason": "Guest cancellation"
}
```

### Service Management Endpoints

#### Get All Services
```http
GET /api/services?category=room_service&isActive=true
Authorization: Bearer {token}
```

#### Create Service
```http
POST /api/services
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Room Service",
  "category": "room_service",
  "pricing": {
    "type": "fixed",
    "basePrice": 25
  },
  "estimatedDuration": 30
}
```

### Service Request Endpoints

#### Get Service Requests
```http
GET /api/service-requests?status=pending
Authorization: Bearer {token}
```

#### Create Service Request
```http
POST /api/service-requests
Authorization: Bearer {token}
Content-Type: application/json

{
  "serviceId": "service_id",
  "guestId": "guest_id",
  "requestedDateTime": "2024-01-15T14:00:00Z",
  "quantity": 1
}
```

### Customization Endpoints

#### Get Customization Settings
```http
GET /api/customization
Authorization: Bearer {token}
```

#### Update Theme Colors
```http
PUT /api/customization/theme
Authorization: Bearer {token}
Content-Type: application/json

{
  "primaryColor": "#1E40AF",
  "secondaryColor": "#10B981",
  "backgroundColor": "#FFFFFF"
}
```

#### Upload Logo
```http
POST /api/customization/logo
Authorization: Bearer {token}
Content-Type: multipart/form-data

logo: [file]
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify
1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify

## 🔗 Backend API Example

Here's a basic Flask/FastAPI endpoint structure:

### Flask Example:
```python
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/api/register-hotel', methods=['POST'])
def register_hotel():
    data = request.get_json()

    # Validate input
    required_fields = ['fullName', 'companyName', 'email', 'employeeCount', 'subdomain']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400

    # Create tenant/workspace
    # Your business logic here

    return jsonify({'success': True, 'workspace_url': f"https://{data['subdomain']}.sysora.com"})
```

### FastAPI Example:
```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

class HotelRegistration(BaseModel):
    fullName: str
    companyName: str
    email: str
    employeeCount: str
    subdomain: str

@app.post("/api/register-hotel")
async def register_hotel(registration: HotelRegistration):
    # Your business logic here
    return {"success": True, "workspace_url": f"https://{registration.subdomain}.sysora.com"}
```

## 🌐 Multi-language Support

The project is structured to support multiple languages:

1. **Add language files** in `src/locales/`
2. **Update components** to use translation keys
3. **Configure language switcher** in Footer component

## 📱 Mobile Optimization

- Mobile-first responsive design
- Touch-friendly interactive elements
- Optimized forms for mobile input
- Fast loading on mobile networks

## 🔒 Security Considerations

- Input validation on all form fields
- Subdomain validation to prevent conflicts
- HTTPS enforcement in production
- CORS configuration for API calls

## 🎯 Future Enhancements

- [ ] Add animation library (Framer Motion)
- [ ] Implement A/B testing
- [ ] Add chat support widget
- [ ] Integrate analytics tracking
- [ ] Add more language options
- [ ] Implement dark mode

## 📄 License

This project is proprietary to Sysora. All rights reserved.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support, email contact@sysora.com or visit our help center.

---

**Sysora** - Master Your Operations
