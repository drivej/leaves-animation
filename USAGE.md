# Usage Guide

## Quick Start

### 1. Install from GitHub

```bash
npm install github:yourusername/yourrepo
```

Replace `yourusername/yourrepo` with your actual GitHub username and repository name.

### 2. Use in Your React App

```tsx
import { LeavesAndSnowReact } from 'leaves-and-snow';

function App() {
  return (
    <LeavesAndSnowReact width={800} height={600} />
  );
}
```

## Installation Methods

### Method 1: Direct GitHub Install

```bash
npm install github:username/repo#branch
```

### Method 2: Package.json Dependency

Add to your `package.json`:

```json
{
  "dependencies": {
    "leaves-and-snow": "github:username/repo#main"
  }
}
```

Then run:
```bash
npm install
```

### Method 3: Specific Commit/Tag

```bash
npm install github:username/repo#v1.0.0
npm install github:username/repo#commit-hash
```

## Vite Configuration

If you're using Vite (recommended), no additional configuration is needed! Vite will automatically:
- Bundle the TypeScript/JavaScript files
- Process and optimize the image assets
- Handle ESM imports

### Example Vite Project Setup

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // No special config needed for leaves-and-snow!
})
```

## Advanced Usage

### Fullscreen Background

```tsx
import { LeavesAndSnowReact } from 'leaves-and-snow';

function App() {
  return (
    <>
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
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Your content here */}
      </div>
    </>
  );
}
```

### Responsive Container

```tsx
import { LeavesAndSnowReact } from 'leaves-and-snow';
import { useState, useEffect } from 'react';

function ResponsiveAnimation() {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <LeavesAndSnowReact 
      width={dimensions.width} 
      height={dimensions.height}
    />
  );
}
```

### Vanilla JavaScript (No React)

```javascript
import { LeavesAndSnow } from 'leaves-and-snow/vanilla';

const container = document.getElementById('animation-container');

const animation = new LeavesAndSnow({
  width: 800,
  height: 600,
  container: container
});

// Later, when you want to clean up:
animation.destroy();
```

## Troubleshooting

### Assets Not Loading

If assets aren't loading, make sure:
1. You're using a bundler that supports asset imports (Vite, Webpack 5+, etc.)
2. Your bundler is configured to handle `.png` files
3. The package was installed correctly with all files

### TypeScript Errors

If you see TypeScript errors:
1. Make sure `@types/react` is installed
2. Check that your `tsconfig.json` includes the package
3. Try restarting your TypeScript server

### Performance Issues

If you experience performance issues:
1. Check that WebGL is enabled in your browser
2. Reduce the number of particles (modify the source if needed)
3. Ensure hardware acceleration is enabled

## Asset Credits

The package includes:
- Leaf texture (`assets/leaf.png`)
- Sky background (`assets/autumn_sky.png`)
- Character sprite (`assets/fall_woman.png`)

All assets are bundled automatically by Vite.

