importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCIwdw0suzS6hfZb-jAJzqlsAAyy9qe1ro",
  authDomain: "crypto-watcher-c9354.firebaseapp.com",
  projectId: "crypto-watcher-c9354",
  storageBucket: "crypto-watcher-c9354.appspot.com",
  messagingSenderId: "563751265346",
  appId: "1:563751265346:web:7b23fec302a5aa1cbeb9db",
  measurementId: "G-6414V1MXX4"
});

const messaging = firebase.messaging();

// Mostra notificações quando recebidas em background
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png'
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
}); 