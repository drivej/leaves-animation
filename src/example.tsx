import React from 'react';
import { LeavesAndSnowReact } from './index';

/**
 * Example usage of LeavesAndSnowReact component
 */
export function Example() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <LeavesAndSnowReact 
        width={window.innerWidth} 
        height={window.innerHeight}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: -1
        }}
      />
      
      <div style={{ 
        position: 'relative', 
        zIndex: 1, 
        padding: '2rem',
        color: 'white',
        textAlign: 'center'
      }}>
        <h1>Leaves and Snow Animation</h1>
        <p>Move your mouse to create wind effects!</p>
      </div>
    </div>
  );
}

/**
 * Example with fixed dimensions
 */
export function FixedSizeExample() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      minHeight: '100vh',
      background: '#1a1a1a'
    }}>
      <LeavesAndSnowReact 
        width={800} 
        height={600}
        style={{
          border: '2px solid #333',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
        }}
      />
    </div>
  );
}

