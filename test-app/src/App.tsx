import { LeavesAndSnowReact } from 'leaves-and-snow'
import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="app">
      <LeavesAndSnowReact 
        width={dimensions.width} 
        height={dimensions.height}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: -1
        }}
      />
      
      <div className="content">
        <h1>🍂 Leaves and Snow Test 🍂</h1>
        <p>Move your mouse to create wind effects!</p>
        <div className="info">
          <p>Width: {dimensions.width}px</p>
          <p>Height: {dimensions.height}px</p>
        </div>
      </div>
    </div>
  )
}

export default App

