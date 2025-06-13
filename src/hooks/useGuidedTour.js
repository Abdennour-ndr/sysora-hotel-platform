import { useState, useEffect } from 'react';

export const useGuidedTour = () => {
  const [showTour, setShowTour] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    // Check if user has completed or skipped the tour
    const tourCompleted = localStorage.getItem('sysora_tour_completed');
    const tourSkipped = localStorage.getItem('sysora_tour_skipped');
    const userFirstLogin = localStorage.getItem('sysora_first_login');
    
    // Check if this is a new user (first time logging in)
    if (!userFirstLogin) {
      localStorage.setItem('sysora_first_login', 'true');
      setIsNewUser(true);
    }
    
    // Show tour if user hasn't completed or skipped it and it's their first login
    if (!tourCompleted && !tourSkipped && (!userFirstLogin || isNewUser)) {
      // Delay showing tour to let the dashboard load
      const timer = setTimeout(() => {
        setShowTour(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isNewUser]);

  const startTour = () => {
    setShowTour(true);
  };

  const closeTour = () => {
    setShowTour(false);
  };

  const completeTour = () => {
    localStorage.setItem('sysora_tour_completed', 'true');
    setShowTour(false);
  };

  const resetTour = () => {
    localStorage.removeItem('sysora_tour_completed');
    localStorage.removeItem('sysora_tour_skipped');
    localStorage.removeItem('sysora_first_login');
    setShowTour(true);
  };

  return {
    showTour,
    isNewUser,
    startTour,
    closeTour,
    completeTour,
    resetTour
  };
};
