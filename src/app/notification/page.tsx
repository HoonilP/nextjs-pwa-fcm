'use client';

import NotificationRequest from "@/components/NotificationRequest";

export default function NotificationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">웹 푸시 알림 설정</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <p className="mb-4">
          이 사이트의 최신 소식과 업데이트를 웹 푸시 알림으로 받아보세요.
        </p>
        
        <NotificationRequest 
          onSuccess={() => alert('알림 설정이 완료되었습니다!')} 
        />
      </div>
    </div>
  );
}