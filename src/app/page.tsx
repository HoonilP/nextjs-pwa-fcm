'use client';

import { Button } from "@/components/ui/button";
import { getMessaging, getToken } from "firebase/messaging";
import { db } from "@/lib/firebase";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";

export default function Home() {
	const uploadToken = async (currentToken: string) => {
		const docRef = doc(db, "subscribe", "tokens");
		await updateDoc(docRef, {
			list: arrayUnion(currentToken),
		})
			.then(() => {
				localStorage.setItem("notificationPermission", "true");
			})
			.catch((error) => {
				console.log(error);
				window.alert(
					"서버 연결에 실패하였습니다.\n잠시 후 다시 시도해 주세요."
				);
				return;
			});
	};

	const handleGetToken = () => {
		const messaging = getMessaging();

		getToken(messaging, {
			vapidKey: "BFEQZonyqygHNGMuttPdcuPc0y6LhYVpKPEQOPRV4SWwIrwLpXc1KMrb7qKjwitlxAjKsyl-MYEZDS2I671aQMk",
		})
		.then(async (currentToken) => {
			if (!currentToken) {
			} else {
				console.log(currentToken)
				uploadToken(currentToken)
			}
		})
		.catch((error) => {
			console.log(error)
		});
	}

	const handleRequestPermission = () => {
		Notification.requestPermission().then((permission) => {
			if (permission !== 'granted') {
				alert('푸시 거부됨');
			} else {
				alert('푸시 승인됨');
			}
		})
	}

	return (
		<div className="h-screen flex justify-center items-center">
			<Button onClick={handleRequestPermission} className="text-white bg-red-900">Request Permission</Button>
			<Button onClick={handleGetToken} className="text-white bg-red-900">토큰 발급</Button>
		</div>
	);
}