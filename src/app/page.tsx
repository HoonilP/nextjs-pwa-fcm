'use client';

import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import { doc, getFirestore, setDoc, arrayUnion } from "firebase/firestore";

export default function Home() {
	const [tokenLoading, setTokenLoading] = useState(false);
	const [tokenStatus, setTokenStatus] = useState<string | null>(null);

	// Firebase 초기화는 클라이언트 사이드에서만 실행
	useEffect(() => {
		// 이미 초기화되었는지 확인
		if (typeof window !== 'undefined' && !window.firebase) {
			const firebaseConfig = {
				apiKey: "AIzaSyBD-5n5uT_QdPDvWgPSUEcESCUJ4UK1H6s",
				authDomain: "blockchain-ledger.firebaseapp.com",
				projectId: "blockchain-ledger",
				storageBucket: "blockchain-ledger.firebasestorage.app",
				messagingSenderId: "1014190154955",
				appId: "1:1014190154955:web:54464550af2928f214274e",
			};

			// Firebase 앱 초기화
			const app = initializeApp(firebaseConfig);

			// 전역 변수에 저장 (중복 초기화 방지)
			window.firebase = { app };
		}
	}, []);

	// 토큰을 Firestore에 저장하는 함수
	const saveTokenToFirestore = async (token: string) => {
		try {
			const app = window.firebase?.app;
			if (!app) return;

			const db = getFirestore(app);
			const tokenRef = doc(db, "subscribe", "tokens");

			// 토큰 저장
			await setDoc(tokenRef, {
				list: arrayUnion(token)
			}, { merge: true });

			setTokenStatus("토큰이 성공적으로 저장되었습니다.");
		} catch (error) {
			console.error("토큰 저장 오류:", error);
			setTokenStatus("토큰 저장 중 오류가 발생했습니다.");
		}
	};

	function handleAllowNotification() {
		setTokenLoading(true);
		setTokenStatus(null);

		Notification.requestPermission().then((permission) => {
			if (permission === "granted") { // 조건이 반대로 되어 있었음
				console.log('푸시 알림 granted');

				// 브라우저 환경 확인
				if (typeof window !== 'undefined' && window.firebase?.app) {
					const messaging = getMessaging(window.firebase.app);

					getToken(messaging, {
						vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
					})
						.then(async (currentToken) => {
							if (!currentToken) {
								// 토큰 생성 불가시 처리
								setTokenStatus("토큰을 발급받을 수 없습니다. 브라우저 설정을 확인해주세요.");
							} else {
								// 토큰을 받았다면 저장
								await saveTokenToFirestore(currentToken);
							}
							setTokenLoading(false);
						})
						.catch((error) => {
							console.error("FCM 토큰 발급 오류:", error);
							setTokenStatus("FCM 토큰 발급 중 오류가 발생했습니다.");
							setTokenLoading(false);
						});
				}
			} else {
				console.log('푸시 알림 denied');
				setTokenStatus("푸시 알림 권한이 거부되었습니다.");
				setTokenLoading(false);
			}
		});
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-screen p-4">
			<h1 className="text-2xl font-bold mb-6">FCM 웹 푸시 알림 테스트</h1>

			<button
				onClick={handleAllowNotification}
				disabled={tokenLoading}
				className="mb-4"
			>
				{tokenLoading ? "처리 중..." : "푸시 알림 권한 요청"}
			</button>

			{tokenStatus && (
				<p className={tokenStatus.includes('오류') || tokenStatus.includes('거부')
					? "text-red-500"
					: "text-green-500"
				}>
					{tokenStatus}
				</p>
			)}
		</div>
	);
}

// TypeScript Window 인터페이스 확장
declare global {
	interface Window {
		firebase?: {
			app: any;
		};
	}
}