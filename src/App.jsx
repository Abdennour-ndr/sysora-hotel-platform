import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './styles/customization.css'
import LandingPageWrapper from './components/LandingPageWrapper'
import ModernLandingPage from './pages/landing/ModernLandingPage'
import ModernSignInPage from './pages/auth/ModernSignInPage'
import ModernSignUpPage from './pages/auth/ModernSignUpPage'
import Dashboard from './pages/Dashboard'
import ManagerDashboard from './pages/ManagerDashboard'
import ModernManagerDashboard from './pages/ModernManagerDashboard'
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

// Design System Components
import { DesignSystemDemo } from './components/examples'




function App() {
  return (
    <LanguageProvider>
      <Router>
        <FeatureAccessProvider>
            <Routes>
              <Route path="/" element={<ModernLandingPage />} />
              <Route path="/signin" element={<ModernSignInPage />} />
              <Route path="/signup" element={<ModernSignUpPage />} />
              <Route path="/old-landing" element={<LandingPageWrapper />} />
              <Route path="/design-system" element={<DesignSystemDemo />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/dashboard" element={
                <ThemeProvider>
                  <ModernManagerDashboard />
                </ThemeProvider>
              } />
              <Route path="/manager" element={
                <ThemeProvider>
                  <ModernManagerDashboard />
                </ThemeProvider>
              } />
              <Route path="/modern" element={
                <ThemeProvider>
                  <ModernManagerDashboard />
                </ThemeProvider>
              } />
              <Route path="/legacy" element={
                <ThemeProvider>
                  <Dashboard />
                </ThemeProvider>
              } />
              <Route path="/legacy-manager" element={
                <ThemeProvider>
                  <ManagerDashboard />
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
