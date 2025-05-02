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

// 푸시 이벤트 처리
self.addEventListener("push", function (event) {
	if (event.data) {
		// 데이터 메시지 구조 사용
		const data = event.data.json().data;
		const options = {
			body: data.body,
			icon: data.image,
			image: data.image,
			data: {
				click_action: data.click_action, // 클릭 이벤트용 URL
			},
		};

		event.waitUntil(
			self.registration.showNotification(data.title, options)
		);
	} else {
		console.log("This push event has no data.");
	}
});

// 클릭 이벤트 처리
self.addEventListener("notificationclick", function (event) {
	event.preventDefault();
	// 알림창 닫기
	event.notification.close();

	// 이동할 URL
	const urlToOpen = event.notification.data.click_action;

	// 클라이언트에 해당 사이트가 열려있는지 체크
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

			// 열려있다면 focus, 아니면 새로 open
			if (matchingClient) {
				return matchingClient.focus();
			} else {
				return clients.openWindow(urlToOpen);
			}
		});

	event.waitUntil(promiseChain);
});