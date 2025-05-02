'use client';

import { useState } from "react";
import useSendPush from "@/hooks/useSendPush";

export default function AdminPushPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("/");
  const { sendPush, loading, error } = useSendPush();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !body) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }
    
    try {
      const result = await sendPush({
        title,
        body,
        click_action: url,
      });
      
      if (result?.result?.success) {
        alert(`푸시 알림이 성공적으로 발송되었습니다! (성공: ${result.result.successCount}, 실패: ${result.result.failureCount})`);
        // 폼 초기화
        setTitle("");
        setBody("");
        setUrl("/");
      } else {
        alert("푸시 알림 발송에 실패했습니다.");
      }
    } catch (err) {
      console.error("푸시 발송 오류:", err);
      alert("푸시 알림 발송 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">푸시 알림 발송</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
              제목
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="알림 제목을 입력하세요"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="body" className="block text-gray-700 font-medium mb-2">
              내용
            </label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
              placeholder="알림 내용을 입력하세요"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="url" className="block text-gray-700 font-medium mb-2">
              이동 URL
            </label>
            <input
              type="text"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="알림 클릭 시 이동할 URL"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "발송 중..." : "푸시 알림 발송하기"}
          </button>
          
          {error && (
            <div className="mt-4 text-red-500">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}