// src/utils/sw-utils.ts
// Utility for registering service worker and replacing placeholder values with actual environment variables

export const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        // First, fetch the service worker file
        const response = await fetch('/firebase-messaging-sw.js');
        let swContent = await response.text();
        
        // Replace placeholder values with actual environment variables
        swContent = swContent
          .replace('REPLACE_WITH_YOUR_API_KEY', process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '')
          .replace('REPLACE_WITH_YOUR_AUTH_DOMAIN', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '')
          .replace('REPLACE_WITH_YOUR_PROJECT_ID', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '')
          .replace('REPLACE_WITH_YOUR_STORAGE_BUCKET', process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '')
          .replace('REPLACE_WITH_YOUR_MESSAGING_SENDER_ID', process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '')
          .replace('REPLACE_WITH_YOUR_APP_ID', process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '');
        
        // Create a blob with the modified content
        const blob = new Blob([swContent], { type: 'application/javascript' });
        const swUrl = URL.createObjectURL(blob);
        
        // Register the service worker with the blob URL
        const registration = await navigator.serviceWorker.register(swUrl, { scope: '/' });
        
        console.log('Service Worker registered with scope:', registration.scope);
        return registration;
      } catch (error) {
        console.error('Service Worker registration failed:', error);
        return null;
      }
    } else {
      console.warn('Service workers are not supported in this browser');
      return null;
    }
  };
  
  // Unregister service worker (useful for debugging)
  export const unregisterServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          const unregistered = await registration.unregister();
          if (unregistered) {
            console.log('Service Worker unregistered successfully');
          } else {
            console.log('Service Worker unregistration failed');
          }
          return unregistered;
        }
        return false;
      } catch (error) {
        console.error('Error unregistering Service Worker:', error);
        return false;
      }
    }
    return false;
  };