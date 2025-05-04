import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
	apiKey: "AIzaSyBD-5n5uT_QdPDvWgPSUEcESCUJ4UK1H6s",
	authDomain: "blockchain-ledger.firebaseapp.com",
	projectId: "blockchain-ledger",
	storageBucket: "blockchain-ledger.firebasestorage.app",
	messagingSenderId: "1014190154955",
	appId: "1:1014190154955:web:54464550af2928f214274e",
	measurementId: "G-BSSG941WH0"
};

const app = initializeApp(firebaseConfig);

if (typeof window !== "undefined" && typeof window.navigator !== "undefined") {
	try {
		const messaging = getMessaging(app);

		if (localStorage.getItem("notificationPermission") === "unsupport") {
			localStorage.removeItem("notificationPermission");
		}
	} catch (error) {
		console.error(error);
		localStorage.setItem("notificationPermission", "unsupport");
	}
}

export const db = getFirestore(app);