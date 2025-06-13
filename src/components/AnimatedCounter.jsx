import { useState, useEffect, useRef } from 'react'

const AnimatedCounter = ({ 
  end, 
  duration = 2000, 
  prefix = '', 
  suffix = '', 
  decimals = 0,
  separator = '',
  startOnView = true 
}) => {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const counterRef = useRef(null)

  // Intersection Observer to trigger animation when in view
  useEffect(() => {
    if (!startOnView) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true)
          setHasAnimated(true)
        }
      },
      { threshold: 0.3 }
    )

    if (counterRef.current) {
      observer.observe(counterRef.current)
    }

    return () => observer.disconnect()
  }, [startOnView, hasAnimated])

  // Counter animation with realistic increments
  useEffect(() => {
    if (!isVisible) return

    let startTime = null
    let animationFrame = null

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)

      // Add some randomness for more realistic counting
      const baseCount = Math.floor(easeOutQuart * end)
      const randomOffset = progress < 0.95 ? Math.floor(Math.random() * 3) : 0
      const currentCount = Math.min(baseCount + randomOffset, end)

      setCount(currentCount)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      } else {
        setCount(end)
      }
    }

    // Add a small delay to make it feel more natural
    const delay = Math.random() * 500
    const timeoutId = setTimeout(() => {
      animationFrame = requestAnimationFrame(animate)
    }, delay)

    return () => {
      clearTimeout(timeoutId)
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [isVisible, end, duration])

  // Format number with separators
  const formatNumber = (num) => {
    if (separator && num >= 1000) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator)
    }
    return num.toFixed(decimals)
  }

  return (
    <span
      ref={counterRef}
      className={`tabular-nums counter-transition ${isVisible ? 'counter-animating' : ''}`}
    >
      {prefix}{formatNumber(count)}{suffix}
    </span>
  )
}

export default AnimatedCounter
