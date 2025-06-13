import { useState, useEffect } from 'react'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [hotel, setHotel] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check for existing authentication on component mount
    checkAuthStatus()
  }, [])

  const checkAuthStatus = () => {
    try {
      const storedToken = localStorage.getItem('sysora_token')
      const storedUser = localStorage.getItem('sysora_user')
      const storedHotel = localStorage.getItem('sysora_hotel')

      if (storedToken && storedUser && storedHotel) {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
        setHotel(JSON.parse(storedHotel))
        setIsAuthenticated(true)
      }
    } catch (error) {
      console.error('Error checking auth status:', error)
      // Clear invalid data
      logout()
    } finally {
      setIsLoading(false)
    }
  }

  const login = (authData) => {
    try {
      const { token: newToken, user: newUser, hotel: newHotel } = authData

      // Store in localStorage
      localStorage.setItem('sysora_token', newToken)
      localStorage.setItem('sysora_user', JSON.stringify(newUser))
      localStorage.setItem('sysora_hotel', JSON.stringify(newHotel))

      // Update state
      setToken(newToken)
      setUser(newUser)
      setHotel(newHotel)
      setIsAuthenticated(true)

      return true
    } catch (error) {
      console.error('Error during login:', error)
      return false
    }
  }

  const logout = () => {
    try {
      // Clear localStorage
      localStorage.removeItem('sysora_token')
      localStorage.removeItem('sysora_user')
      localStorage.removeItem('sysora_hotel')
      localStorage.removeItem('sysora_temp_password')

      // Reset state
      setToken(null)
      setUser(null)
      setHotel(null)
      setIsAuthenticated(false)

      return true
    } catch (error) {
      console.error('Error during logout:', error)
      return false
    }
  }

  const updateUser = (updatedUser) => {
    try {
      localStorage.setItem('sysora_user', JSON.stringify(updatedUser))
      setUser(updatedUser)
      return true
    } catch (error) {
      console.error('Error updating user:', error)
      return false
    }
  }

  const updateHotel = (updatedHotel) => {
    try {
      localStorage.setItem('sysora_hotel', JSON.stringify(updatedHotel))
      setHotel(updatedHotel)
      return true
    } catch (error) {
      console.error('Error updating hotel:', error)
      return false
    }
  }

  const getAuthHeaders = () => {
    if (!token) return {}
    
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }

  const isOwner = () => {
    return user?.role === 'owner'
  }

  const isAdmin = () => {
    return user?.role === 'admin'
  }

  const isManager = () => {
    return user?.role === 'manager'
  }

  const hasPermission = (permission) => {
    if (!user?.permissions) return false
    
    // Owner has all permissions
    if (user.role === 'owner') return true
    
    // Check specific permission
    return user.permissions.includes(permission) || user.permissions.includes('all')
  }

  const getWorkspaceUrl = () => {
    if (!hotel?.subdomain) return null
    return `https://${hotel.subdomain}.sysora.app`
  }

  const redirectToDashboard = () => {
    if (hotel?.subdomain) {
      window.location.href = `/dashboard?subdomain=${hotel.subdomain}`
    }
  }

  return {
    // State
    user,
    hotel,
    token,
    isLoading,
    isAuthenticated,
    
    // Actions
    login,
    logout,
    updateUser,
    updateHotel,
    checkAuthStatus,
    
    // Utilities
    getAuthHeaders,
    isOwner,
    isAdmin,
    isManager,
    hasPermission,
    getWorkspaceUrl,
    redirectToDashboard
  }
}

export default useAuth
