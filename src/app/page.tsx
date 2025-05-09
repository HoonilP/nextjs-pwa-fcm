'use client';

import { delay } from "@/utils/delay";
// Components: UI
// import { Button } from "@/components/ui/button";

// Firebase
// import { db } from "@/lib/firebase";
// import { arrayUnion, doc, updateDoc } from "firebase/firestore";
// import { getMessaging, getToken } from "firebase/messaging";

// React
import Image from "next/image"
import { useRouter } from "next/navigation";
import { useEffect } from "react";
// import Link from "next/link";

export default function Home() {
	// const uploadToken = async (currentToken: string) => {
	// 	const docRef = doc(db, "subscribe", "tokens");
	// 	await updateDoc(docRef, {
	// 		list: arrayUnion(currentToken),
	// 	}).then(() => {
	// 		localStorage.setItem("notificationPermission", "true");
	// 	}).catch((error) => {
	// 		console.log(error);
	// 		window.alert(
	// 			"서버 연결에 실패하였습니다.\n잠시 후 다시 시도해 주세요."
	// 		);
	// 		return;
	// 	});
	// };

	// const handleGetToken = () => {
	// 	const messaging = getMessaging();

	// 	getToken(messaging, {
	// 		vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
	// 	}).then(async (currentToken) => {
	// 		if (!currentToken) {
	// 			alert('토큰 발급 실패');
	// 		} else {
	// 			uploadToken(currentToken);
	// 			alert('토큰 발급 성공');
	// 		}
	// 	}).catch((error) => {
	// 		console.log(error)
	// 	});
	// }

	// const handleRequestPermission = () => {
	// 	Notification.requestPermission().then((permission) => {
	// 		if (permission !== 'granted') {
	// 			alert('푸시 거부됨');
	// 		} else {
	// 			alert('푸시 승인됨');
	// 		}
	// 	})
	// }

	const router = useRouter();
	useEffect(() => {
		delay(2000);
		router.push('/home');
	}, []);

	return (
		// <div className="h-screen flex justify-center items-center">
		// 	<Button onClick={handleRequestPermission} className="text-white bg-red-900">Request Permission</Button>
		// 	<Button onClick={handleGetToken} className="text-white bg-red-900">토큰 발급</Button>

		// 	<Link href="/admin">Admin Page</Link>
		// </div>

		<div className="flex justify-center items-center h-screen">
			<Image src="/favicon.ico" width={0} height={0} alt="Logo" style={{ width: 150, height: "auto" }} priority />
		</div>
	);
}