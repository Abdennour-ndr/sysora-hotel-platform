import React, { useState, useEffect } from 'react'
import { 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  Play, 
  Building, 
  Users, 
  Calendar, 
  CreditCard,
  Settings,
  Sparkles,
  Target,
  Clock,
  X
} from 'lucide-react'

const OnboardingWizard = ({ isOpen, onClose, onComplete, user, hotel }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState(new Set())
  const [isPlaying, setIsPlaying] = useState(false)

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to Sysora!',
      subtitle: `Let's get ${hotel?.name || 'your hotel'} up and running`,
      icon: Sparkles,
      color: 'from-purple-500 to-purple-600',
      content: 'welcome'
    },
    {
      id: 'rooms',
      title: 'Add Your First Rooms',
      subtitle: 'Set up your room inventory',
      icon: Building,
      color: 'from-blue-500 to-blue-600',
      content: 'rooms',
      action: 'Add Sample Rooms'
    },
    {
      id: 'guests',
      title: 'Guest Management',
      subtitle: 'Learn how to manage your guests',
      icon: Users,
      color: 'from-green-500 to-green-600',
      content: 'guests',
      action: 'Add Sample Guest'
    },
    {
      id: 'reservations',
      title: 'Create Reservations',
      subtitle: 'Start taking bookings',
      icon: Calendar,
      color: 'from-orange-500 to-orange-600',
      content: 'reservations',
      action: 'Create Sample Booking'
    },
    {
      id: 'payments',
      title: 'Payment Processing',
      subtitle: 'Handle payments efficiently',
      icon: CreditCard,
      color: 'from-emerald-500 to-emerald-600',
      content: 'payments',
      action: 'Process Sample Payment'
    },
    {
      id: 'complete',
      title: 'You\'re All Set!',
      subtitle: 'Your hotel management system is ready',
      icon: Target,
      color: 'from-sysora-mint to-emerald-500',
      content: 'complete'
    }
  ]

  const currentStepData = steps[currentStep]

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps(prev => new Set([...prev, currentStep]))
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleStepAction = async () => {
    const step = steps[currentStep]
    
    try {
      switch (step.id) {
        case 'rooms':
          await createSampleRooms()
          break
        case 'guests':
          await createSampleGuest()
          break
        case 'reservations':
          await createSampleReservation()
          break
        case 'payments':
          await processSamplePayment()
          break
        default:
          break
      }
      
      setCompletedSteps(prev => new Set([...prev, currentStep]))
      setTimeout(nextStep, 1000)
    } catch (error) {
      console.error('Error in step action:', error)
    }
  }

  const createSampleRooms = async () => {
    const token = localStorage.getItem('sysora_token')
    const sampleRooms = [
      {
        number: '101',
        type: 'Single',
        price: 8000,
        status: 'available',
        description: 'Comfortable single room with city view'
      },
      {
        number: '201',
        type: 'Double',
        price: 12000,
        status: 'available', 
        description: 'Spacious double room with balcony'
      },
      {
        number: '301',
        type: 'Suite',
        price: 20000,
        status: 'available',
        description: 'Luxury suite with premium amenities'
      }
    ]

    for (const room of sampleRooms) {
      await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/rooms`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(room)
      })
    }
  }

  const createSampleGuest = async () => {
    const token = localStorage.getItem('sysora_token')
    const sampleGuest = {
      firstName: 'Ahmed',
      lastName: 'Benali',
      email: 'ahmed.benali@example.com',
      phone: '+213 555 123 456',
      nationality: 'Algerian',
      idNumber: 'ID123456789'
    }

    await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/customers`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sampleGuest)
    })
  }

  const createSampleReservation = async () => {
    const token = localStorage.getItem('sysora_token')
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dayAfter = new Date(today)
    dayAfter.setDate(dayAfter.getDate() + 3)

    const sampleReservation = {
      guestName: 'Ahmed Benali',
      guestEmail: 'ahmed.benali@example.com',
      guestPhone: '+213 555 123 456',
      roomNumber: '201',
      checkIn: tomorrow.toISOString().split('T')[0],
      checkOut: dayAfter.toISOString().split('T')[0],
      totalAmount: 24000,
      status: 'confirmed'
    }

    await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/reservations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sampleReservation)
    })
  }

  const processSamplePayment = async () => {
    // This would integrate with the payment system
    // For now, we'll just simulate the action
    return new Promise(resolve => setTimeout(resolve, 1000))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-sysora-midnight rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-sysora-midnight">Hotel Setup Wizard</h2>
              <p className="text-sm text-gray-600">Step {currentStep + 1} of {steps.length}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-sysora-light/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-sysora-midnight">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
            </span>
            <span className="text-sm text-gray-600">
              {steps.length - currentStep - 1} steps remaining
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-sysora-mint to-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default OnboardingWizard
