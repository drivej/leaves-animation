# Local Testing Guide

## Quick Start (Easiest)

We've created a test app for you! Just run:

```bash
./test-local.sh
```

This will:
1. Install dependencies in the test-app
2. Start a Vite dev server
3. Open at http://localhost:5173

## Manual Testing Methods

### Method 1: Using the Built-in Test App

```bash
cd test-app
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

**What you should see:**
- Falling leaves and snowflakes
- A girl sprite in the middle
- Mouse movement creates wind effects
- Smooth 60fps animation

---

### Method 2: npm link (For Active Development)

This creates a symlink so changes are reflected immediately.

**Step 1: Link the package**
```bash
# In the leaves directory
npm link
```

**Step 2: Create a new test project**
```bash
# Somewhere else
npm create vite@latest my-test-app -- --template react-ts
cd my-test-app
npm install
npm link leaves-and-snow
```

**Step 3: Use it**
```tsx
// src/App.tsx
import { LeavesAndSnowReact } from 'leaves-and-snow'

function App() {
  return <LeavesAndSnowReact width={800} height={600} />
}
```

**Step 4: Run**
```bash
npm run dev
```

**To unlink:**
```bash
npm unlink leaves-and-snow
```

---

### Method 3: Local File Install

```bash
# Create a test project
npm create vite@latest my-test-app -- --template react-ts
cd my-test-app

# Install from local path
npm install /Users/jasoncontento/lab/flash-portfolio/leaves

# Use it in src/App.tsx
# Then run
npm run dev
```

---

## What to Test

### ✅ Basic Functionality
- [ ] Component renders without errors
- [ ] Leaves and snowflakes appear
- [ ] Animation runs smoothly (60fps)
- [ ] Mouse movement affects particles

### ✅ Props
- [ ] `width` prop works correctly
- [ ] `height` prop works correctly
- [ ] `className` prop applies to container
- [ ] `style` prop applies to container

### ✅ Responsive Behavior
- [ ] Resize window - animation adapts
- [ ] Different screen sizes work

### ✅ Performance
- [ ] No memory leaks (check DevTools)
- [ ] Smooth animation with 200+ particles
- [ ] WebGL is being used (check console)

### ✅ TypeScript
- [ ] No TypeScript errors
- [ ] Props are properly typed
- [ ] Autocomplete works in IDE

### ✅ Cleanup
- [ ] Component unmounts cleanly
- [ ] No errors in console on unmount
- [ ] Canvas is removed from DOM

---

## Troubleshooting

### "Cannot find module 'leaves-and-snow'"

**Solution:** Make sure you've installed the package:
```bash
npm install
```

### Assets not loading

**Solution:** Check that Vite is running and configured correctly. The assets should be bundled automatically.

### TypeScript errors

**Solution:** 
```bash
# Restart TypeScript server in VSCode
# Or reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Performance issues

**Solution:**
- Check WebGL is enabled in browser
- Open DevTools Performance tab
- Look for console warnings

---

## Testing Checklist Before Push

- [ ] Test app runs without errors
- [ ] All animations work smoothly
- [ ] No console errors or warnings
- [ ] TypeScript compiles without errors
- [ ] Assets load correctly
- [ ] Component unmounts cleanly
- [ ] Works in Chrome, Firefox, Safari
- [ ] Responsive behavior works
- [ ] README is accurate
- [ ] package.json is correct

---

## Next Steps

Once local testing passes:

1. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add React wrapper for leaves-and-snow"
   ```

2. **Push to GitHub**
   ```bash
   git push origin main
   ```

3. **Test GitHub install**
   ```bash
   npm install github:yourusername/yourrepo#main
   ```

4. **Create a release tag (optional)**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

