'use client';

import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBD-5n5uT_QdPDvWgPSUEcESCUJ4UK1H6s",
  authDomain: "blockchain-ledger.firebaseapp.com",
  projectId: "blockchain-ledger",
  storageBucket: "blockchain-ledger.firebasestorage.app",
  messagingSenderId: "1014190154955",
  appId: "1:1014190154955:web:54464550af2928f214274e",
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// 브라우저 환경에서만 messaging 초기화
export const initMessaging = () => {
  if (typeof window !== "undefined" && typeof window.navigator !== "undefined") {
    return getMessaging(app);
  }
  return null;
};

// FCM 토큰 요청 함수
export const requestFCMToken = async () => {
  try {
    const messaging = initMessaging();
    if (!messaging) return null;

    // 브라우저 알림 권한 요청
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("알림 권한이 거부되었습니다.");
      return null;
    }

    // FCM 토큰 발급
    const token = await getToken(messaging, {
      vapidKey: "BFEQZonyqygHNGMuttPdcuPc0y6LhYVpKPEQOPRV4SWwIrwLpXc1KMrb7qKjwitlxAjKsyl-MYEZDS2I671aQMk",
    });

    if (!token) {
      console.log("FCM 토큰을 발급받을 수 없습니다.");
      return null;
    }

    // 토큰 반환 (DB에 저장하는 로직은 호출 측에서 처리)
    return token;
  } catch (error) {
    console.error("FCM 토큰 발급 오류:", error);
    return null;
  }
};