// Firebase
import { db } from "@/lib/firebase";
import { arrayUnion, arrayRemove, doc, updateDoc } from "firebase/firestore";
import { getMessaging, getToken } from "firebase/messaging";

// Types
import { userRoleEnum } from "@/types";

// Runs only on client components
async function issueToken(): Promise<string | null> {
    const messaging = getMessaging();
    try {
        const token = await getToken(messaging, { vapidKey: process.env.FIREBASE_VAPID_KEY, });
        return token;
    } catch (error) { return null; }
}

export async function issueFcmToken(userRole: userRoleEnum) {
    const docRef = doc(db, "fcmToken", userRole);

    const savedToken = localStorage.getItem('fcmToken');
    if (savedToken) {
        await updateDoc(docRef, {
            list: arrayRemove(savedToken),
        }).then(() => {
            localStorage.removeItem('fcmtoken');
        });
    }

    const newToken = await issueToken();
    if (newToken) {
        await updateDoc(docRef, {
            list: arrayUnion(newToken),
        }).then(() => {
            localStorage.setItem('fcmToken', newToken);
        });
    }
}

export async function removeFcmToken(userRole: userRoleEnum) {
    const docRef = doc(db, "fcmToken", userRole);

    const savedToken = localStorage.getItem('fcmToken');
    if (savedToken) {
        await updateDoc(docRef, {
            list: arrayRemove(savedToken),
        }).then(() => {
            localStorage.removeItem('fcmtoken');
        });
    }
}
