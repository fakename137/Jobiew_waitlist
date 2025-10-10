# Jobiew Branding & Metadata

This document outlines the branding assets and metadata configuration for the Jobiew waitlist application.

## Favicon & Icons

### Main Icon (`/src/app/icon.svg`)
- **Format**: SVG
- **Size**: 100x100 viewBox
- **Design**: Modern "J" lettermark with gold accent
- **Usage**: Browser favicon, PWA icon
- **Auto-generated sizes**: Next.js automatically generates multiple sizes

### Apple Icon (`/src/app/apple-icon.svg`)
- **Format**: SVG
- **Size**: 180x180 viewBox
- **Design**: iOS-optimized version with rounded corners
- **Usage**: iOS home screen icon, Safari pinned tab

### Open Graph Image (`/src/app/opengraph-image.svg`)
- **Format**: SVG
- **Size**: 1200x630px
- **Usage**: Social media previews (Facebook, LinkedIn)
- **Features**: Logo, tagline, CTA badge

### Twitter Image (`/src/app/twitter-image.svg`)
- **Format**: SVG
- **Size**: 1200x630px
- **Usage**: Twitter card previews
- **Design**: Centered layout optimized for Twitter

## Metadata Configuration

Located in `/src/app/layout.tsx`:

### SEO Metadata
```typescript
title: "Jobiew - Find Your Dream Job 10x Faster | AI-Powered Job Search"
description: "Join the Jobiew waitlist for early access to AI-powered job hunting..."
keywords: ["job search", "AI jobs", "career", "job hunting", "recruitment", "AI agent", "employment"]
```

### Open Graph
- **Title**: Jobiew - AI-Powered Job Search Platform
- **Description**: Find your dream job 10x faster with AI-powered job hunting
- **Type**: website
- **Locale**: en_US
- **Image**: Auto-generated from opengraph-image.svg

### Twitter Card
- **Card Type**: summary_large_image
- **Title**: Jobiew - Find Your Dream Job 10x Faster
- **Description**: AI-powered job hunting platform
- **Image**: Auto-generated from twitter-image.svg

### PWA Configuration (`/public/manifest.json`)
```json
{
  "name": "Jobiew - AI-Powered Job Search",
  "short_name": "Jobiew",
  "theme_color": "#000000",
  "background_color": "#0a0a0a"
}
```

## Brand Colors

### Primary Colors
- **Black**: `#000000` - Primary brand color, buttons, headers
- **Dark Gray**: `#0a0a0a` - Background gradients
- **Gold Accent**: `#FFD700` - CTAs, highlights, brand accent

### Text Colors
- **White**: `#FFFFFF` - Primary text on dark backgrounds
- **Light Gray**: `#999999` - Secondary text
- **Medium Gray**: `#666666` - Tertiary text

## Design Elements

### Logo Mark
- Modern, minimalist "J" letterform
- Geometric construction with rounded terminals
- Gold accent dot representing AI/technology
- Vertical bars suggesting progress/growth

### Typography
- **Primary Font**: Geist Sans (system-ui fallback)
- **Weights Used**: Regular (400), Medium (500), Bold (700), Black (900)
- **Style**: Clean, modern, tech-forward

### Visual Style
- Dark mode first design
- Glassmorphism effects
- Subtle grid patterns
- Floating animations
- Gradient backgrounds

## Next.js Icon Generation

Next.js automatically generates multiple icon sizes from the SVG sources:

**Generated Sizes**:
- favicon: 16x16, 32x32
- apple-touch-icon: 180x180
- android-chrome: 192x192, 512x512

**File Locations**:
- Source files: `/src/app/*.svg`
- Generated files: `/.next/static/media/`
- Public assets: `/public/icon.svg`, `/public/manifest.json`

## Testing

### Browser Tab Icon
Check that the favicon appears correctly in:
- Chrome/Edge/Brave
- Firefox
- Safari

### Social Media Cards
Test social sharing on:
- Facebook Sharing Debugger
- Twitter Card Validator
- LinkedIn Post Inspector

### Mobile
Verify on:
- iOS Safari (home screen icon)
- Android Chrome (PWA installation)
- Various mobile browsers

## Updating Icons

To update the brand icons:

1. Edit the SVG files in `/src/app/`
2. Maintain the viewBox dimensions
3. Keep the design scalable (avoid fine details)
4. Test at multiple sizes
5. Rebuild the app: `npm run build`

## Resources

- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/file-conventions/metadata)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [PWA Manifest](https://web.dev/add-manifest/)

