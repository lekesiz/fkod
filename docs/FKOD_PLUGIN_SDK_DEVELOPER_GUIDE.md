# F-KOD Plugin SDK - Complete Developer Guide

## Getting Started with F-KOD Plugin Development

### Installation

```bash
# Install F-KOD CLI
npm install -g @fkod/cli

# Create new plugin
fkod-cli create my-awesome-plugin
cd my-awesome-plugin

# Install dependencies
npm install
```

### Project Structure

```
my-awesome-plugin/
├── plugin.json              # Plugin metadata
├── manifest.json            # Plugin configuration
├── src/
│   ├── index.js            # Plugin entry point
│   ├── components/         # React components
│   ├── hooks/              # Custom hooks
│   ├── utils/              # Utility functions
│   └── styles/             # CSS files
├── backend/
│   ├── routes.js           # API routes
│   ├── models.js           # Database models
│   └── services.js         # Business logic
├── tests/
│   ├── unit.test.js
│   ├── integration.test.js
│   └── e2e.test.js
├── docs/
│   ├── README.md
│   ├── INSTALLATION.md
│   ├── CONFIGURATION.md
│   └── API.md
└── package.json
```

---

## Plugin Metadata (plugin.json)

```json
{
  "id": "my-awesome-plugin",
  "name": "My Awesome Plugin",
  "version": "1.0.0",
  "description": "A brief description of what your plugin does",
  "author": {
    "name": "Your Name",
    "email": "your.email@example.com",
    "url": "https://yourwebsite.com"
  },
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourname/my-awesome-plugin"
  },
  "icon": "https://example.com/icon.png",
  "banner": "https://example.com/banner.png",
  "category": "integration",
  "tags": ["crm", "sales", "integration"],
  "permissions": [
    "read:users",
    "read:courses",
    "write:courses",
    "read:analytics"
  ],
  "settings": {
    "apiKey": {
      "type": "string",
      "label": "API Key",
      "required": true,
      "secret": true
    },
    "enableFeature": {
      "type": "boolean",
      "label": "Enable Advanced Feature",
      "default": false
    },
    "webhookUrl": {
      "type": "string",
      "label": "Webhook URL",
      "required": false
    }
  },
  "pricing": {
    "model": "free",
    "price": 0,
    "currency": "USD"
  }
}
```

---

## Plugin Development

### Basic Plugin Example

```javascript
// src/index.js
import { createPlugin, registerComponent, registerRoute } from '@fkod/sdk';
import Dashboard from './components/Dashboard';
import { handleWebhook } from './backend/routes';

const plugin = createPlugin({
  id: 'my-awesome-plugin',
  name: 'My Awesome Plugin',
  version: '1.0.0'
});

// Register UI component
plugin.registerComponent('dashboard-widget', Dashboard);

// Register API route
plugin.registerRoute('POST', '/webhook', handleWebhook);

// Register hook
plugin.registerHook('user:created', async (user) => {
  console.log('New user created:', user);
});

export default plugin;
```

### Using Plugin Hooks

```javascript
import { usePluginSettings, usePluginData, useNotification } from '@fkod/sdk';

function MyComponent() {
  // Get plugin settings
  const settings = usePluginSettings();
  
  // Get plugin data
  const [data, setData] = usePluginData('my-data');
  
  // Show notification
  const { notify } = useNotification();
  
  const handleClick = async () => {
    try {
      const result = await fetch('/api/my-endpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: 'test' })
      });
      
      notify('Success!', 'success');
    } catch (error) {
      notify('Error: ' + error.message, 'error');
    }
  };
  
  return (
    <div>
      <h2>My Plugin</h2>
      <button onClick={handleClick}>Click me</button>
    </div>
  );
}

export default MyComponent;
```

### Backend API Routes

```javascript
// backend/routes.js
import express from 'express';
import { authenticate, authorize } from '@fkod/sdk/middleware';

const router = express.Router();

// Protected route
router.post('/webhook', authenticate, authorize('write:courses'), async (req, res) => {
  try {
    const { data } = req.body;
    
    // Process data
    const result = await processData(data);
    
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

---

## SDK API Reference

### Core Functions

#### `createPlugin(config)`
Create a new plugin instance.

```javascript
const plugin = createPlugin({
  id: 'my-plugin',
  name: 'My Plugin',
  version: '1.0.0',
  description: 'My awesome plugin',
  author: 'Developer Name',
  permissions: ['read:users', 'write:courses']
});
```

#### `plugin.registerComponent(name, component)`
Register a React component.

```javascript
plugin.registerComponent('dashboard-widget', MyComponent);
```

#### `plugin.registerRoute(method, path, handler)`
Register an API route.

```javascript
plugin.registerRoute('POST', '/my-endpoint', async (req, res) => {
  res.json({ success: true });
});
```

#### `plugin.registerHook(event, handler)`
Register an event hook.

```javascript
plugin.registerHook('user:created', async (user) => {
  console.log('User created:', user);
});
```

### React Hooks

#### `usePluginSettings()`
Get plugin settings.

```javascript
const settings = usePluginSettings();
console.log(settings.apiKey);
```

#### `usePluginData(key)`
Get/set plugin data.

```javascript
const [data, setData] = usePluginData('my-data');
setData({ ...data, updated: true });
```

#### `useNotification()`
Show notifications.

```javascript
const { notify } = useNotification();
notify('Success!', 'success');
notify('Error occurred', 'error');
```

#### `useModal()`
Show modals.

```javascript
const { showModal } = useModal();
showModal({
  title: 'Confirm Action',
  content: 'Are you sure?',
  buttons: ['Cancel', 'Confirm']
});
```

#### `useAuth()`
Get authentication info.

```javascript
const { user, permissions } = useAuth();
console.log(user.id, permissions);
```

---

## Testing Your Plugin

### Unit Tests

```javascript
// tests/unit.test.js
import { render, screen } from '@testing-library/react';
import MyComponent from '../src/components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('My Plugin')).toBeInTheDocument();
  });
});
```

### Integration Tests

```javascript
// tests/integration.test.js
import request from 'supertest';
import app from '../backend/app';

describe('Plugin API', () => {
  it('handles webhook correctly', async () => {
    const response = await request(app)
      .post('/api/webhook')
      .send({ data: 'test' });
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- unit.test.js
```

---

## Submitting Your Plugin

### Pre-Submission Checklist

- [x] Plugin works correctly
- [x] All tests pass
- [x] Documentation complete
- [x] No security vulnerabilities
- [x] Performance optimized
- [x] Code follows style guide
- [x] Screenshots/demo provided

### Submission Process

```bash
# Build plugin
npm run build

# Package plugin
fkod-cli package

# Submit to marketplace
fkod-cli submit

# Follow review process
# - Code review (3-5 days)
# - Security review (2-3 days)
# - Publication
```

---

## Best Practices

### Security

- Always validate user input
- Use HTTPS for external requests
- Store secrets in plugin settings
- Never log sensitive data
- Implement rate limiting

### Performance

- Optimize database queries
- Use caching when possible
- Minimize bundle size
- Lazy load components
- Use pagination for large datasets

### Code Quality

- Write unit tests (80%+ coverage)
- Follow coding standards
- Use TypeScript for type safety
- Document your code
- Use meaningful variable names

### User Experience

- Provide clear error messages
- Show loading states
- Implement undo/redo
- Provide helpful documentation
- Test on multiple browsers

---

## Resources

- [F-KOD Documentation](https://docs.fkod.com)
- [SDK Reference](https://sdk.fkod.com)
- [Community Forum](https://forum.fkod.com)
- [Developer Events](https://events.fkod.com)
- [Support](https://support.fkod.com)

---

**Status:** ✅ **F-KOD PLUGIN SDK - DEVELOPER GUIDE COMPLETE**

**Repository:** https://github.com/lekesiz/fkod  
**Prepared by:** Manus AI  
**Date:** June 5, 2026
