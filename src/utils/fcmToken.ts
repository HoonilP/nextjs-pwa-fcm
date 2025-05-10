// Firebase
import { db } from "@/lib/firebase";
import { arrayUnion, arrayRemove, doc, updateDoc } from "firebase/firestore";
import { getMessaging, getToken } from "firebase/messaging";

// JWT
import { jwtDecode } from "jwt-decode";

// React
import { cookies } from "next/headers";

// Types
import { JwtData } from "@/types";
import { userRoleEnum } from "@/types";

async function issueToken(): Promise<string | null> {
    const messaging = getMessaging();
    try {
        const token = await getToken(messaging, { vapidKey: process.env.FIREBASE_VAPID_KEY, });
        return token;
    } catch (error) { return null; }
}

export async function issueFcmToken() {
    const cookieStore = await cookies();
    const access_token = cookieStore.get('access_token')?.value!;
    const decoded: JwtData = jwtDecode(access_token);
    const userRole: userRoleEnum = decoded.role;

    const roleToDocRef: Record<userRoleEnum, string> = {
        [userRoleEnum.ROLE_STUDENT]: "student",
        [userRoleEnum.ROLE_COMMITTEE]: "commitee",
        [userRoleEnum.ROLE_ADMIN]: "admin",
    };

    const docRef = doc(db, "fcmToken", roleToDocRef[userRole]);

    const savedToken = localStorage.getItem('fcmToken');
    if (savedToken) {
        await updateDoc(docRef, {
            list: arrayRemove(savedToken),
        }).then(() => {
            localStorage.removeItem('fcmtoken');
        }).catch((error) => {
            return error;
        });
    }

    const newToken = await issueToken();
    if (newToken) {
        await updateDoc(docRef, {
            list: arrayUnion(newToken),
        }).then(() => {
            localStorage.setItem('fcmToken', newToken);
        }).catch((error) => {
            return error;
        });
    }
}

export async function removeFcmToken() {
    const cookieStore = await cookies();
    const access_token = cookieStore.get('access_token')?.value!;
    const decoded: JwtData = jwtDecode(access_token);
    const userRole: userRoleEnum = decoded.role;

    const roleToDocRef: Record<userRoleEnum, string> = {
        [userRoleEnum.ROLE_STUDENT]: "student",
        [userRoleEnum.ROLE_COMMITTEE]: "commitee",
        [userRoleEnum.ROLE_ADMIN]: "admin",
    };

    const docRef = doc(db, "fcmToken", roleToDocRef[userRole]);

    const savedToken = localStorage.getItem('fcmToken');
    if (savedToken) {
        await updateDoc(docRef, {
            list: arrayRemove(savedToken),
        }).then(() => {
            localStorage.removeItem('fcmtoken');
        }).catch((error) => {
            return error;
        });
    }
}
