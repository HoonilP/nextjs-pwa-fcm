importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

firebase.initializeApp({
	apiKey: "AIzaSyBD-5n5uT_QdPDvWgPSUEcESCUJ4UK1H6s",
	authDomain: "blockchain-ledger.firebaseapp.com",
	projectId: "blockchain-ledger",
	storageBucket: "blockchain-ledger.firebasestorage.app",
	messagingSenderId: "1014190154955",
	appId: "1:1014190154955:web:54464550af2928f214274e",
});

const messaging = firebase.messaging();

self.addEventListener("push", function (event) {
	if (event.data) {
		const data = event.data.json().data;
		const options = {
			body: data.body,
			icon: data.image,
			image: data.image,
			vibrate: [200, 100, 200],
			data: { click_action: data.click_action, },
		};

		event.waitUntil( self.registration.showNotification(data.title, options) );
	} else {
		alert("This push event has no data.");
	}
});

self.addEventListener("notificationclick", function (event) {
	event.preventDefault();
	event.notification.close();

	const urlToOpen = event.notification.data.click_action;

	const promiseChain = clients
		.matchAll({
			type: "window",
			includeUncontrolled: true,
		})
		.then(function (windowClients) {
			let matchingClient = null;

			for (let i = 0; i < windowClients.length; i++) {
				const windowClient = windowClients[i];
				if (windowClient.url.includes(urlToOpen)) {
					matchingClient = windowClient;
					break;
				}
			}

			if (matchingClient) {
				return matchingClient.focus();
			} else {
				return clients.openWindow(urlToOpen);
			}
		});

	event.waitUntil(promiseChain);
});