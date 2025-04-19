import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getAnalytics } from "firebase/analytics";
import axiosClient from "./axiosClient";

const firebaseConfig = {
    apiKey: "AIzaSyAWlQ0p6HfM5ZxygVmE4nGiB42udvduxao",
    authDomain: "tennis-tournament-5de3c.firebaseapp.com",
    projectId: "tennis-tournament-5de3c",
    storageBucket: "tennis-tournament-5de3c.firebasestorage.app",
    messagingSenderId: "228880444207",
    appId: "1:228880444207:web:72b5af7e3b4daa38904fda",
    measurementId: "G-HF1CDPSSPS"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const messaging = getMessaging(app);

const requestNotificationPermission = async () => {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
        const token = await getToken(messaging, {
            vapidKey: "BKhQhbmbmEeXW4AiDtwDoG0rMXM8YUfVYeys6ytwHa_jm1Lc5WEtIsRXNCRlo5FUb1HdDWsazgeP7oJ5loM-DTk"
        });
        if (token) {
            axiosClient.put("/v1/user/update/fcmToken", {
                fcmToken: token
            });
        }
    }
}
export { messaging, getToken, onMessage, analytics, requestNotificationPermission };

