'use client';

// Context
import { useUser } from "@/context/UserProvider";

// FCM
import { issueFcmToken } from "@/utils/fcmToken";

// React
import { useEffect } from "react";

export default function Home() {
    // UserContext
    const { username, userRole } = useUser();

    // FCM Token
    useEffect(() => {
        issueFcmToken(userRole);
    }, []);

    return (
        <div>
            <div>
                Home Page
            </div>
            <div>
                최근 알림
            </div>
            <div>
                승인 요청 상태(Pending, Success, Failed)
            </div>
            <div>
                장부내역 (Scroll Pagination)
            </div>
        </div>
    );
}