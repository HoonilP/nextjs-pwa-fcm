'use client';

// React
import Image from "next/image"
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Util
import { delay } from "@/utils/delay";

export default function App() {
	const router = useRouter();
    useEffect(() => {
        if (typeof window !== "undefined" && "Notification" in window) {
            Notification.requestPermission().then((permission) => {
				if (permission !== 'granted') {
					console.log('푸시 거부됨');
                } else {
					console.log('푸시 승인됨');
                }
            }).catch((error) => {
				console.error("알림 권한 요청 중 오류:", error);
            });
        }

		delay(2000);
		router.push('/home');
    }, [router]);

	return (
		<div className="flex justify-center items-center h-screen">
			<Image src="/favicon.ico" width={0} height={0} alt="Logo" style={{ width: 150, height: "auto" }} priority />
		</div>
	);
}