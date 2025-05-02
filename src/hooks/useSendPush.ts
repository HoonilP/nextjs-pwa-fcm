'use client';

import axios from "axios";
import { useState } from "react";

interface PushOptions {
  title: string;
  body: string;
  click_action: string;
  image?: string;
}

const useSendPush = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendPush = async ({
    title,
    body,
    click_action,
    image = "icons/icon512_rounded.png", // 기본 이미지
  }: PushOptions) => {
    setLoading(true);
    setError(null);

    try {
      // 푸시 메시지 데이터 구성 (data 메시지 타입으로 통합)
      const message = {
        data: {
          title,
          body,
          image,
          click_action
        }
      };

      // API 호출
      const response = await axios.request({
        method: "POST",
        url: `/api/send-fcm`,
        data: { message },
      });

      setLoading(false);
      return response.data;
    } catch (err) {
      console.error("푸시 전송 오류:", err);
      setError("푸시 발송 중 오류가 발생했습니다.");
      setLoading(false);
      return null;
    }
  };

  return { sendPush, loading, error };
};

export default useSendPush;