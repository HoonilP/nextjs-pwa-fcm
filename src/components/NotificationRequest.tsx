'use client';

import { useEffect, useState } from "react";
import { doc, getFirestore, setDoc, arrayUnion, getDoc } from "firebase/firestore";
import { requestFCMToken } from "../lib/firebase";

interface NotificationRequestProps {
  onSuccess?: () => void;
}

const NotificationRequest = ({ onSuccess }: NotificationRequestProps) => {
  const [permission, setPermission] = useState<NotificationPermission | "default">("default");
  const [loading, setLoading] = useState(false);

  // 현재 권한 상태 확인
  useEffect(() => {
    if (typeof Notification !== "undefined") {
      setPermission(Notification.permission);
    }
  }, []);

  // 토큰을 Firestore에 저장하는 함수
  const saveTokenToFirestore = async (token: string) => {
    try {
      const db = getFirestore();
      const tokenRef = doc(db, "subscribe", "tokens");
      
      // 기존 토큰 목록 확인
      const docSnap = await getDoc(tokenRef);
      
      if (docSnap.exists()) {
        // 이미 목록이 있으면 토큰 추가 (중복 없이)
        const tokenList = docSnap.data()?.list || [];
        if (!tokenList.includes(token)) {
          await setDoc(tokenRef, {
            list: arrayUnion(token)
          }, { merge: true });
        }
      } else {
        // 목록이 없으면
        await setDoc(tokenRef, {
          list: [token]
        });
      }
      
      console.log("토큰이 성공적으로 저장되었습니다.");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("토큰 저장 중 오류:", error);
    }
  };

  // 알림 권한 요청 및 토큰 처리
  const requestPermission = async () => {
    setLoading(true);
    
    try {
      // FCM 토큰 요청
      const token = await requestFCMToken();
      
      if (token) {
        // 토큰 저장
        await saveTokenToFirestore(token);
        setPermission("granted");
      } else {
        // 토큰을 받지 못했을 때 권한 상태 업데이트
        setPermission(Notification.permission);
      }
    } catch (error) {
      console.error("알림 권한 요청 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  // 이미 권한이 부여된 경우 버튼 표시하지 않음
  if (permission === "granted") {
    return <div className="text-green-600">알림이 활성화되었습니다.</div>;
  }

  // 권한이 거부된 경우 안내 메시지
  if (permission === "denied") {
    return (
      <div className="text-red-600">
        알림이 차단되었습니다. 브라우저 설정에서 알림 권한을 변경해주세요.
      </div>
    );
  }

  // 권한 요청 버튼
  return (
    <button
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
      onClick={requestPermission}
      disabled={loading}
    >
      {loading ? "처리 중..." : "웹 푸시 알림 받기"}
    </button>
  );
};

export default NotificationRequest;