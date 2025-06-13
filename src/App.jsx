import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './styles/customization.css'
import LandingPageWrapper from './components/LandingPageWrapper'
import Dashboard from './pages/Dashboard'
import AdminDashboardWrapper from './components/AdminDashboardWrapper'
import AdminLogin from './pages/AdminLogin'
import PricingPage from './pages/PricingPage'
import Customization from './pages/Customization'
import HotelDemo from './pages/HotelDemo'
import SettingsIntegrated from './pages/hotel/SettingsIntegrated'
import ImageDiagnostic from './components/ImageDiagnostic'
import ModernToastContainer from './components/ModernToast'
import ThemeProvider from './components/ThemeProvider'
import { FeatureAccessProvider } from './hooks/useFeatureAccess.jsx'
import { LanguageProvider } from './contexts/LanguageContext'




function App() {
  return (
    <LanguageProvider>
      <Router>
        <FeatureAccessProvider>
            <Routes>
              <Route path="/" element={<LandingPageWrapper />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/dashboard" element={
                <ThemeProvider>
                  <Dashboard />
                </ThemeProvider>
              } />
              <Route path="/admin" element={
                <ThemeProvider>
                  <AdminDashboardWrapper />
                </ThemeProvider>
              } />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/customization" element={
                <ThemeProvider>
                  <Customization />
                </ThemeProvider>
              } />
              <Route path="/settings" element={
                <ThemeProvider>
                  <SettingsIntegrated />
                </ThemeProvider>
              } />
              <Route path="/hotel-demo" element={<HotelDemo />} />
              <Route path="/image-diagnostic" element={
                <ThemeProvider>
                  <ImageDiagnostic />
                </ThemeProvider>
              } />
            </Routes>
            <ModernToastContainer />
          </FeatureAccessProvider>
        </Router>
    </LanguageProvider>
  )
}

export default App
