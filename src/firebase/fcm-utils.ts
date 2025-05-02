// src/firebase/fcm-utils.ts
import { messaging } from '../lib/firebase';
import { getToken, onMessage } from 'firebase/messaging';

// The public VAPID key must be set in your Firebase project settings
// and exposed through environment variables
const PUBLIC_VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

// Function to request notification permission and get FCM token
export const requestNotificationPermission = async (): Promise<string | null> => {
  try {
    if (!messaging) {
      console.error("Firebase messaging is not initialized");
      return null;
    }

    console.log("Requesting notification permission...");
    
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log("Notification permission denied");
      return null;
    }
    
    console.log("Notification permission granted");
    
    // Get FCM token
    const currentToken = await getToken(messaging, { vapidKey: PUBLIC_VAPID_KEY });
    
    if (currentToken) {
      console.log("FCM Token:", currentToken);
      return currentToken;
    } else {
      console.log("Failed to generate FCM token");
      return null;
    }
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return null;
  }
};

// Check if notification permission is granted
export const checkNotificationPermission = (): string => {
  if (typeof Notification === 'undefined') {
    return 'unsupported';
  }
  
  return Notification.permission;
};

// Set up foreground message handler
export const setupForegroundMessageHandler = (callback: (payload: any) => void) => {
  if (!messaging) {
    console.error("Firebase messaging is not initialized");
    return;
  }

  return onMessage(messaging, (payload) => {
    console.log("Message received in the foreground:", payload);
    callback(payload);
  });
};

// Save FCM token to user's document in Firestore
export const saveFcmToken = async (token: string) => {
  try {
    const tokenData = {
      token,
      createdAt: new Date(),
      platform: 'web',
      device: navigator.userAgent,
    };
    
    // You'll need to implement this function to save to Firestore
    return tokenData;
  } catch (error) {
    console.error("Error saving FCM token:", error);
    return null;
  }
};