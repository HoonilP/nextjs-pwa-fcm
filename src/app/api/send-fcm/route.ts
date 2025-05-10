import { NextRequest, NextResponse } from "next/server";
import * as admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin";
import { MulticastMessage } from "firebase-admin/messaging";

interface NotificationData {
    data: {
        title: string;
        body: string;
        image: string;
        click_action: string;
    }
}

const sendFCMNotification = async (data: NotificationData) => {
    const serviceAccount: ServiceAccount = {
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    };

    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    }

    const db = admin.firestore();
    let tokenList: string[] = [];

    try {
        const docRefs = ['admin', 'commitee', 'student'];
        for (const role of docRefs) {
            const docSnap = await db.collection('fcmToken').doc(role).get();
            if (docSnap.exists) {
                tokenList = [...tokenList, ...(docSnap.data()?.list || [])];
            }
        }
    } catch (error) {
        console.error("토큰 목록 가져오기 오류:", error);
    }

    if (tokenList.length === 0) {
        console.log("푸시를 전송할 토큰이 없습니다.");
        return { success: false, message: "No tokens available" };
    }

    try {
        const message: MulticastMessage = {
            data: data.data,
            tokens: tokenList
        };

        const response = await admin
            .messaging()
            .sendEachForMulticast(message);

        return {
            success: true,
            successCount: response.successCount,
            failureCount: response.failureCount,
        };
    } catch (error) {
        console.error("푸시 전송 오류:", error);
        return { success: false, error };
    }
};

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { message } = body;

        if (!message) {
            return NextResponse.json(
                { error: "Message data is required" },
                { status: 400 }
            );
        }

        const result = await sendFCMNotification(message);
        return NextResponse.json({ result });
    } catch (error) {
        console.error("API 오류:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}