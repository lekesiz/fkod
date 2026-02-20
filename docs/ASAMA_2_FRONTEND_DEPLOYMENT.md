# Aşama 2: Frontend Deployment (Vercel)

## 1. Vercel Setup

### Step 1: Create Vercel Account
- Go to https://vercel.com
- Sign up with GitHub
- Authorize Vercel

### Step 2: Import Project

```bash
# Option 1: From Vercel Dashboard
# 1. Go to Vercel Dashboard
# 2. Click "New Project"
# 3. Select GitHub repository
# 4. Configure project
# 5. Deploy

# Option 2: Using Vercel CLI
npm i -g vercel
vercel login
vercel
```

---

## 2. Configure Vercel Project

### vercel.json Configuration

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "env": [
    "VITE_API_URL",
    "VITE_APP_TITLE",
    "VITE_ANALYTICS_ID"
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache, no-store, must-revalidate"
        }
      ]
    },
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://api.fkod.com/$1"
    }
  ]
}
```

---

## 3. Environment Variables

### Set Environment Variables in Vercel

```bash
# Using Vercel CLI
vercel env add VITE_API_URL
vercel env add VITE_APP_TITLE
vercel env add VITE_ANALYTICS_ID

# Or in Vercel Dashboard:
# Settings → Environment Variables
```

### Production Environment Variables

```env
VITE_API_URL=https://api.fkod.com
VITE_APP_TITLE=F-Kod
VITE_ANALYTICS_ID=your-analytics-id
```

### Preview Environment Variables

```env
VITE_API_URL=https://api-staging.fkod.com
VITE_APP_TITLE=F-Kod (Preview)
VITE_ANALYTICS_ID=your-preview-analytics-id
```

---

## 4. Build Configuration

### Vite Build Optimization

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu']
        }
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

### package.json Build Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "analyze": "vite-plugin-visualizer"
  }
}
```

---

## 5. Deploy to Vercel

### Option 1: GitHub Integration (Recommended)

```bash
# 1. Push to GitHub
git push origin main

# 2. Vercel automatically deploys
# 3. Check deployment status in Vercel Dashboard
```

### Option 2: Using Vercel CLI

```bash
# Deploy
vercel

# Deploy to production
vercel --prod

# View deployment
vercel ls
```

### Option 3: Vercel Dashboard

```
1. Go to Vercel Dashboard
2. Click "New Project"
3. Select GitHub repository
4. Configure build settings
5. Click "Deploy"
```

---

## 6. Custom Domain

### Add Custom Domain

```bash
# Using Vercel CLI
vercel domains add fkod.com

# Or in Vercel Dashboard:
# Settings → Domains
# Add Domain
# Configure DNS
```

### DNS Configuration

```
Type: A
Name: @
Value: 76.76.19.165

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## 7. SSL/HTTPS

### Automatic SSL (Included)

```
Vercel automatically provides SSL certificates
- Valid for all *.vercel.app domains
- Valid for custom domains
- Auto-renewal
- No additional cost
```

### Verify SSL

```bash
# Check certificate
curl -I https://fkod.com

# Should show:
# HTTP/2 200
# strict-transport-security: max-age=63072000
```

---

## 8. Performance Optimization

### Image Optimization

```javascript
// Use next/image or similar
import Image from 'next/image'

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority
  quality={80}
/>
```

### Code Splitting

```javascript
// Lazy load components
import { lazy, Suspense } from 'react'

const Dashboard = lazy(() => import('./Dashboard'))

<Suspense fallback={<Loading />}>
  <Dashboard />
</Suspense>
```

### Bundle Analysis

```bash
# Analyze bundle size
npm run analyze

# Check bundle size
npm run build
# Check dist/ folder size
```

---

## 9. Monitoring & Analytics

### Vercel Analytics

```bash
# Enable in vercel.json
{
  "analytics": true
}
```

### Web Vitals

```javascript
// pages/_app.jsx
import { useReportWebVitals } from 'next/web-vitals'

export default function App() {
  useReportWebVitals((metric) => {
    console.log(metric)
  })
  
  return <Component {...pageProps} />
}
```

### Error Tracking

```bash
# Add Sentry
npm install @sentry/react

# Initialize Sentry
import * as Sentry from "@sentry/react"

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.NODE_ENV
})
```

---

## 10. Preview Deployments

### Automatic Preview Deployments

```
Every pull request automatically gets a preview deployment:
- Unique URL: https://fkod-pr-123.vercel.app
- Same as production environment
- Share with team for review
- Automatic cleanup after PR merge
```

### Preview Environment Variables

```bash
# Set different env vars for preview
vercel env add VITE_API_URL --environment preview
```

---

## 11. Rollback

### Rollback to Previous Deployment

```bash
# Using Vercel CLI
vercel rollback

# Or in Vercel Dashboard:
# Deployments → Select deployment → Promote to Production
```

---

## 12. Troubleshooting

### Build Fails

```bash
# Check build logs
vercel logs

# Common issues:
# 1. Missing environment variables
# 2. Build script error
# 3. Dependency issue

# Solution:
# 1. Check vercel.json
# 2. Check package.json build script
# 3. Run npm install locally
```

### Deployment Slow

```bash
# Optimize:
# 1. Reduce bundle size
# 2. Use code splitting
# 3. Optimize images
# 4. Enable caching

# Check:
vercel analytics
```

### 404 Errors

```bash
# Check routes
# 1. Verify file structure
# 2. Check rewrites in vercel.json
# 3. Check API proxy

# Common issue:
# SPA routing not configured
# Solution: Add rewrites for SPA
```

---

## 13. Deployment Checklist

- [ ] Vercel account created
- [ ] GitHub repository connected
- [ ] vercel.json created
- [ ] Build command configured
- [ ] Environment variables set
- [ ] Production env vars configured
- [ ] Preview env vars configured
- [ ] Custom domain added
- [ ] DNS configured
- [ ] SSL certificate verified
- [ ] Build optimization done
- [ ] Analytics enabled
- [ ] Error tracking configured
- [ ] First deployment successful
- [ ] Preview deployments working
- [ ] Performance metrics checked

---

## 14. Deployment Commands

```bash
# Setup
npm i -g vercel
vercel login

# Deploy
vercel
vercel --prod

# View deployments
vercel ls

# Rollback
vercel rollback

# View logs
vercel logs

# Environment
vercel env add VARIABLE_NAME
vercel env ls
```

---

## 15. Sonraki Adımlar

1. ✅ Frontend deployment planı oluşturuldu
2. ⏳ Vercel account oluştur
3. ⏳ GitHub repository bağla
4. ⏳ Environment variables konfigüre et
5. ⏳ Frontend deploy et
6. ⏳ Custom domain ekle
7. ⏳ SSL doğrula
8. ⏳ Performance optimize et
