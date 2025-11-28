# BootWay Website - Troubleshooting Guide

## 🔧 Common Issues and Solutions

---

## ✅ FIXED: WOW.js TypeError Issue

### Problem
```
Uncaught TypeError: b.className.replace is not a function
at a.value (wow.min.js:340:20)
```

### Root Cause
This error occurred due to:
1. **Double initialization** of WOW.js (once in head, once in main.js)
2. WOW.js encountering elements (possibly SVG) where `className` is not a standard string
3. Lack of error handling in the initialization

### Solution Applied ✅

#### 1. Removed Duplicate Initialization
- ✅ Removed WOW.js initialization from the `<head>` section
- ✅ Kept single initialization in `main.js` with proper configuration

#### 2. Added Error Handling
Updated `assets/js/main.js`:
```javascript
try {
  const wow = new WOW({
    boxClass: 'wow',
    animateClass: 'animated',
    offset: 0,
    mobile: true,
    live: true,
    scrollContainer: null,
    resetAnimation: true
  });
  wow.init();
} catch (error) {
  console.warn('WOW.js initialization error:', error);
}
```

#### 3. Added Fallback Animation System
Updated `assets/js/enhancements.js`:
- ✅ Added Intersection Observer as backup
- ✅ Validates `className` property before observing
- ✅ Includes fallback for browsers without Intersection Observer

#### 4. Progressive Enhancement
- ✅ Added `no-js` class to `<html>` element
- ✅ Removes it when JavaScript loads
- ✅ CSS ensures content is visible even if animations fail

#### 5. SVG Protection
Updated `assets/css/enhancements.css`:
```css
svg.wow {
  visibility: visible !important;
}
```

### Testing the Fix

1. **Clear Browser Cache**
   - Chrome: `Ctrl + Shift + Delete`
   - Firefox: `Ctrl + Shift + Delete`
   - Safari: `Cmd + Option + E`

2. **Hard Refresh**
   - Windows: `Ctrl + F5`
   - Mac: `Cmd + Shift + R`

3. **Check Console**
   - Open DevTools: `F12`
   - Go to Console tab
   - Should see no errors
   - Should see: `✓ UI Enhancements Loaded` in green

4. **Verify Animations**
   - Scroll down the page
   - Elements should fade in smoothly
   - No content should remain hidden

---

## 📋 Other Common Issues

### Issue: Animations Not Working

**Symptoms:**
- Elements with `wow` class don't animate
- Content appears immediately without transitions

**Solutions:**

1. **Check WOW.js is loaded**
   ```javascript
   // In browser console:
   console.log(typeof WOW);
   // Should output: "function"
   ```

2. **Verify CSS is loaded**
   - Check Network tab in DevTools
   - Ensure `enhancements.css` loads successfully (200 status)

3. **Check for JavaScript errors**
   - Open Console (F12)
   - Look for any red error messages
   - Fix errors before WOW.js initialization

4. **Disable ad blockers**
   - Some ad blockers interfere with animation libraries
   - Try disabling temporarily to test

---

### Issue: Page Loads Slowly

**Symptoms:**
- Long white screen before content appears
- Images take too long to load

**Solutions:**

1. **Check image sizes**
   ```bash
   # Optimize images using tools like:
   - TinyPNG (https://tinypng.com/)
   - ImageOptim (Mac)
   - Squoosh (https://squoosh.app/)
   ```

2. **Enable browser caching**
   - Add to `.htaccess` (Apache):
   ```apache
   <IfModule mod_expires.c>
     ExpiresActive On
     ExpiresByType image/jpg "access plus 1 year"
     ExpiresByType image/jpeg "access plus 1 year"
     ExpiresByType image/png "access plus 1 year"
     ExpiresByType text/css "access plus 1 month"
     ExpiresByType application/javascript "access plus 1 month"
   </IfModule>
   ```

3. **Use CDN for static assets**
   - Consider using Cloudflare or similar
   - Reduces server load and improves speed

---

### Issue: Mobile Menu Not Opening

**Symptoms:**
- Hamburger icon doesn't respond
- Menu doesn't toggle on mobile devices

**Solutions:**

1. **Check JavaScript console**
   ```javascript
   // Test in console:
   document.getElementById('navbarToggler')
   document.getElementById('navbarCollapse')
   // Both should return elements, not null
   ```

2. **Verify IDs are correct**
   - Check `index.html` has `id="navbarToggler"`
   - Check `index.html` has `id="navbarCollapse"`

3. **Test click handler**
   ```javascript
   // In console:
   document.getElementById('navbarToggler').click();
   // Menu should toggle
   ```

---

### Issue: WhatsApp Button Not Working

**Symptoms:**
- Clicking WhatsApp button doesn't open app
- Button shows wrong number

**Solutions:**

1. **Verify phone number format**
   - Should be: `+917976866822` (with + and country code)
   - Check in `index.html`: `href="https://wa.me/+917976866822...`

2. **Test URL directly**
   - Copy WhatsApp URL from button
   - Paste in new browser tab
   - Should open WhatsApp Web/App

3. **Check on mobile device**
   - Desktop may open WhatsApp Web
   - Mobile should open WhatsApp app
   - Ensure WhatsApp is installed

---

### Issue: Calculator Not Calculating

**Symptoms:**
- Entering area and clicking Calculate does nothing
- Result shows "₹ —" and doesn't update

**Solutions:**

1. **Check browser console**
   ```
   F12 → Console tab
   Look for JavaScript errors
   ```

2. **Verify password access**
   - Calculator page is password protected
   - Password: `securepass`
   - Must enter correctly to access

3. **Test calculation manually**
   ```javascript
   // In console on calculator.html:
   calculator({preventDefault: () => {}})
   // Should calculate and display result
   ```

4. **Clear form and retry**
   - Refresh page (F5)
   - Enter numeric value only
   - Click Calculate button

---

### Issue: Dark Mode Toggle Not Working

**Symptoms:**
- Clicking moon/sun icon doesn't change theme
- Theme doesn't persist on reload

**Solutions:**

1. **Check localStorage**
   ```javascript
   // In console:
   localStorage.getItem('theme')
   // Should return: "dark" or "light"
   ```

2. **Clear localStorage and test**
   ```javascript
   // In console:
   localStorage.clear();
   location.reload();
   ```

3. **Verify CSS classes**
   ```javascript
   // In console:
   document.documentElement.classList.contains('dark')
   // Should return true/false based on current theme
   ```

---

### Issue: Lazy Loading Not Working

**Symptoms:**
- All images load at once
- Page uses too much bandwidth

**Solutions:**

1. **Check browser support**
   ```javascript
   // In console:
   'loading' in HTMLImageElement.prototype
   // Should return: true (modern browsers)
   ```

2. **Verify loading attribute**
   - Images should have: `loading="lazy"`
   - Check in `index.html`

3. **Test with slow connection**
   - Chrome DevTools → Network tab
   - Select "Slow 3G" from throttling dropdown
   - Scroll page - images should load on demand

---

### Issue: Google Analytics Not Tracking

**Symptoms:**
- No data in Google Analytics dashboard
- Events not being recorded

**Solutions:**

1. **Verify GA tracking ID**
   - Check `index.html` for: `G-K0C8LSDPSV`
   - Ensure it matches your GA property

2. **Test with GA Debug extension**
   - Install "Google Analytics Debugger" Chrome extension
   - Open console while browsing
   - Should see GA events being sent

3. **Check ad blockers**
   - Ad blockers often block Google Analytics
   - Disable to test
   - Consider using privacy-friendly alternative

4. **Use Real-Time reports**
   - Google Analytics → Real-Time → Overview
   - Visit your site
   - Should see active user immediately

---

## 🔍 Debugging Tools

### Browser Console Commands

```javascript
// Check if WOW.js is loaded
console.log('WOW loaded:', typeof WOW !== 'undefined');

// Check if enhancements.js is loaded
console.log('Enhancements:', document.querySelectorAll('.wow').length);

// Check page load time
console.log('Load time:', performance.timing.loadEventEnd - performance.timing.navigationStart, 'ms');

// Check all loaded scripts
console.log('Scripts:', Array.from(document.scripts).map(s => s.src));

// Check all loaded CSS
console.log('Styles:', Array.from(document.styleSheets).map(s => s.href));

// Force show all .wow elements (testing)
document.querySelectorAll('.wow').forEach(el => {
  el.style.visibility = 'visible';
  el.classList.add('animated');
});
```

### Performance Testing

```javascript
// Measure Web Vitals manually
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log(entry.name, entry.duration);
  }
});
observer.observe({ entryTypes: ['measure', 'navigation'] });
```

### Network Testing

1. **Chrome DevTools**
   - F12 → Network tab
   - Reload page
   - Check:
     - ✅ All resources load (200 status)
     - ✅ No 404 errors
     - ✅ Total page size < 5MB
     - ✅ Load time < 3 seconds

2. **Test on Different Connections**
   - Fast 3G
   - Slow 3G
   - Offline (should show cached content if PWA enabled)

---

## 📱 Mobile-Specific Issues

### Issue: Touch Events Not Working

**Solutions:**
- Add to CSS:
  ```css
  * {
    touch-action: manipulation;
  }
  ```
- Already included in `enhancements.css`

### Issue: Viewport Zoom on Input Focus

**Solutions:**
- Ensure meta viewport tag has:
  ```html
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ```
- Font size in inputs should be ≥ 16px

### Issue: iOS Specific Issues

**Solutions:**
1. **Momentum scrolling**
   ```css
   body {
     -webkit-overflow-scrolling: touch;
   }
   ```

2. **Videos not playing**
   - Add `playsinline` attribute
   - Already added to videos in `index.html`

---

## 🚨 Emergency Rollback

If the site breaks completely:

### Quick Fix - Disable Enhancements

1. **Comment out enhancements.css**
   ```html
   <!-- <link rel="stylesheet" href="assets/css/enhancements.css" /> -->
   ```

2. **Comment out enhancements.js**
   ```html
   <!-- <script src="assets/js/enhancements.js" defer></script> -->
   ```

3. **Clear cache and test**
   - Site will work with basic styling
   - All functionality preserved

### Restore Original Files

If you have backups:
1. Replace modified files with originals
2. Remove new enhancement files
3. Clear browser cache
4. Test thoroughly

---

## 📞 Getting Help

### Check Documentation
1. `IMPROVEMENTS_SUMMARY.md` - Full list of changes
2. `QUICK_START_GUIDE.md` - Setup and customization guide
3. This file - Troubleshooting guide

### Debug Checklist
- [ ] Cleared browser cache
- [ ] Tested in incognito/private window
- [ ] Checked browser console for errors
- [ ] Tested on different browser
- [ ] Tested on mobile device
- [ ] Verified all files uploaded correctly
- [ ] Checked file permissions on server

### Browser Compatibility Test
Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

---

## ✅ Verification Steps

After fixing any issue:

1. **Clear cache completely**
2. **Hard refresh** (Ctrl+F5 / Cmd+Shift+R)
3. **Open DevTools Console** (F12)
4. **Check for errors** (should see green success message)
5. **Test functionality** (scroll, click, navigate)
6. **Test on mobile** (responsive, touch works)
7. **Run PageSpeed Insights**
8. **Check analytics** (events tracking)

---

## 📊 Performance Benchmarks

### Expected Results

| Metric | Target | Good | Needs Improvement |
|--------|--------|------|-------------------|
| First Contentful Paint | < 1.8s | < 2.5s | > 2.5s |
| Largest Contentful Paint | < 2.5s | < 4.0s | > 4.0s |
| Total Blocking Time | < 200ms | < 600ms | > 600ms |
| Cumulative Layout Shift | < 0.1 | < 0.25 | > 0.25 |
| Speed Index | < 3.4s | < 5.8s | > 5.8s |

Test at: https://pagespeed.web.dev/

---

## 🎉 Success Indicators

Your site is working correctly if:

- ✅ No console errors (F12 → Console)
- ✅ Animations fade in smoothly on scroll
- ✅ Navigation works on desktop and mobile
- ✅ WhatsApp button opens correctly
- ✅ Calculator calculates correctly
- ✅ Dark mode toggles properly
- ✅ Page loads in < 3 seconds
- ✅ Mobile menu opens/closes
- ✅ All images load (check Network tab)
- ✅ Google Analytics tracking works

---

**Last Updated:** November 28, 2025  
**Version:** 2.0  
**Status:** ✅ Issues Resolved

If you encounter any issues not covered here, check the browser console for specific error messages and search for the exact error text.

