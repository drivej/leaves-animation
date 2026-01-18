# Installation Guide

## 📦 Install from GitHub

```bash
npm install github:drivej/leaves-animation
```

Or add to your `package.json`:

```json
{
  "dependencies": {
    "@drivej/leaves-animation": "github:drivej/leaves-animation"
  }
}
```

---

## 🚀 Usage

### **Default Import (Recommended)**

```tsx
import LeavesAndSnowReact from '@drivej/leaves-animation';

function App() {
  return (
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
  );
}
```

### **Named Import**

```tsx
import { LeavesAndSnowReact } from '@drivej/leaves-animation';

function App() {
  return <LeavesAndSnowReact width={800} height={600} />;
}
```

---

## 📋 Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `width` | `number` | ✅ Yes | Canvas width in pixels |
| `height` | `number` | ✅ Yes | Canvas height in pixels |
| `className` | `string` | ❌ No | CSS class for container |
| `style` | `React.CSSProperties` | ❌ No | Inline styles for container |

---

## 💡 Examples

### Full-Screen Background

```tsx
import { useEffect, useState } from 'react';
import LeavesAndSnowReact from '@drivej/leaves-animation';

function App() {
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
    <>
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
        <h1>Your Content Here</h1>
      </div>
    </>
  );
}
```

### Fixed Size Container

```tsx
import LeavesAndSnowReact from '@drivej/leaves-animation';

function App() {
  return (
    <div style={{ width: '800px', height: '600px', position: 'relative' }}>
      <LeavesAndSnowReact width={800} height={600} />
    </div>
  );
}
```

---

## 🔧 TypeScript Support

Full TypeScript support included:

```tsx
import LeavesAndSnowReact, { LeavesAndSnowReactProps } from '@drivej/leaves-animation';

const props: LeavesAndSnowReactProps = {
  width: 800,
  height: 600,
  className: 'my-animation',
  style: { position: 'absolute' }
};

<LeavesAndSnowReact {...props} />
```

---

## 🎨 Features

- ✅ Beautiful falling leaves and snowflakes
- ✅ Interactive mouse wind effects
- ✅ Smooth 60fps WebGL animation
- ✅ Fully responsive
- ✅ TypeScript support
- ✅ Zero configuration

---

## 📝 License

MIT

