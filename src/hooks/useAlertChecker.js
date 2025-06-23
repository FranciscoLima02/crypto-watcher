import { useEffect, useRef } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { checkAlert } from "../utils/checkAndNotify";

const CHECK_INTERVAL = 60000; // 60 seconds

export default function useAlertChecker() {
  const { user } = useAuth();
  const isChecking = useRef(false);

  useEffect(() => {
    if (!user) {
      return;
    }

    const checkAllAlerts = async () => {
      if (isChecking.current) return;
      isChecking.current = true;

      try {
        const alertsRef = collection(db, "users", user.uid, "alerts");
        const snapshot = await getDocs(alertsRef);
        const alerts = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

        if (alerts.length === 0) return;
        
        console.log(`Checking ${alerts.length} alerts...`);

        for (const alert of alerts) {
          await checkAlert(alert, user.uid);
        }
      } catch (error) {
        console.error("Error while bulk checking alerts:", error);
      } finally {
        isChecking.current = false;
      }
    };

    // Request notification permission on first load
    if (Notification.permission === "default") {
        Notification.requestPermission();
    }

    const intervalId = setInterval(checkAllAlerts, CHECK_INTERVAL);
    
    // Cleanup interval on component unmount or user change
    return () => clearInterval(intervalId);

  }, [user]);
} 