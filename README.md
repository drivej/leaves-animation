# Leaves and Snow 🍂❄️

A beautiful falling leaves and snow particle animation built with PixiJS, featuring atmospheric depth effects and interactive wind physics.

## Features

- 🎨 Beautiful particle animations with leaves and snowflakes
- 🌫️ Atmospheric perspective depth effects
- 🖱️ Interactive mouse/pointer-based wind physics
- ⚡ High performance with WebGL rendering
- ⚛️ React component support
- 📦 TypeScript support
- 🎯 Configurable dimensions

## Installation

### From GitHub (npm/yarn/pnpm)

```bash
npm install github:yourusername/yourrepo#main
# or
yarn add github:yourusername/yourrepo#main
# or
pnpm add github:yourusername/yourrepo#main
```

### From Local Path (for development)

```bash
npm install /path/to/leaves
```

## Usage

### React Component (Recommended)

```tsx
import { LeavesAndSnowReact } from 'leaves-and-snow';

function App() {
  return (
    <div>
      <LeavesAndSnowReact 
        width={800} 
        height={600}
        className="my-animation"
        style={{ border: '1px solid #ccc' }}
      />
    </div>
  );
}
```

### Vanilla JavaScript

```javascript
import { LeavesAndSnow } from 'leaves-and-snow';

const animation = new LeavesAndSnow({
  width: 800,
  height: 600,
  container: document.getElementById('my-container')
});

// Clean up when done
animation.destroy();
```

## API

### React Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `width` | `number` | Yes | Width of the animation canvas in pixels |
| `height` | `number` | Yes | Height of the animation canvas in pixels |
| `className` | `string` | No | CSS class name for the container div |
| `style` | `React.CSSProperties` | No | Inline styles for the container div |

### Vanilla JS Constructor Options

```typescript
interface LeavesAndSnowOptions {
  width?: number;      // Canvas width (default: window.innerWidth)
  height?: number;     // Canvas height (default: window.innerHeight)
  container?: HTMLElement; // Container element (default: document.body)
}
```

## Assets

The package includes the following assets that will be bundled by Vite:
- `assets/leaf.png` - Leaf texture
- `assets/autumn_sky.png` - Background sky texture
- `assets/fall_woman.png` - Character sprite

These assets are automatically imported and bundled when you use the component.

## Development

### Project Structure

```
leaves/
├── assets/              # Image assets
├── Leaf.js             # Leaf particle class
├── Snowflake.js        # Snowflake particle class
├── LeavesAndSnow.js    # Main animation class
├── LeavesAndSnowReact.tsx  # React wrapper component
├── Pointer.js          # Mouse/pointer tracking
├── utils.js            # Utility functions
├── index.ts            # Main entry point
└── package.json        # Package configuration
```

## Performance

- Uses WebGL for hardware-accelerated rendering
- Optimized particle system (200+ particles at 60fps)
- Depth-based tinting instead of expensive blur filters
- Efficient cleanup and memory management

## Browser Support

Works in all modern browsers that support:
- WebGL
- ES6 Modules
- PixiJS v8

## License

MIT

## Credits

Built with [PixiJS](https://pixijs.com/)

