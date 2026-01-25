import { useState, useEffect } from 'react'
import Header from './components/Header'
import GameScene from './components/GameScene'
import { initializeTheme } from './utils/themeLoader'
import './styles/App.css'

function App() {
  const [gameStage, setGameStage] = useState(0)
  const [userLocation, setUserLocation] = useState(null)
  const [themeLoaded, setThemeLoaded] = useState(false)

  // Initialize theme system on app load
  useEffect(() => {
    async function loadAppTheme() {
      try {
        // Load the classic theme by default
        // In the future, this could be: initializeTheme(userPreferredTheme)
        await initializeTheme('classic', { apply: true })
        setThemeLoaded(true)
      } catch (error) {
        console.error('Failed to load theme:', error)
        setThemeLoaded(true) // Continue anyway with browser defaults
      }
    }
    loadAppTheme()
  }, [])

  // Get user's approximate location for altitude-based calculations
  useEffect(() => {
    // In production, this would use geolocation API
    setUserLocation({
      altitude: 0,
      latitude: 0,
      longitude: 0
    })
  }, [])

  return (
    <div className="app">
      {themeLoaded && (
        <>
          <Header />
          <div className="game-container">
            <GameScene 
              stage={gameStage} 
              location={userLocation}
              onStageChange={setGameStage}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default App
