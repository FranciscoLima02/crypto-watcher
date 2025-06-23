import React, { createContext, useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { useAuth } from "./AuthContext";
import { checkAlert } from "../utils/checkAndNotify";

export const AlertsContext = createContext({
  alerts: [],
  addAlert: async () => {},
  removeAlert: async () => {},
});

export function AlertsProvider({ children }) {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (!user) {
      setAlerts([]);
      return;
    }

    const alertsRef = collection(db, "users", user.uid, "alerts");
    const q = query(alertsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const alertsData = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setAlerts(alertsData);
      },
      (error) => {
        console.error("Error loading alerts:", error);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const addAlert = async (alertData) => {
    if (!user) return;
    try {
      // 1. Add the alert to Firestore
      const alertsRef = collection(db, "users", user.uid, "alerts");
      const newDocRef = await addDoc(alertsRef, { ...alertData, createdAt: new Date() });
      
      // 2. Create the complete object for the new alert (with the ID)
      const newAlert = { id: newDocRef.id, ...alertData };

      // 3. Perform an immediate check
      // The onSnapshot listener will remove the alert from the local list if it's triggered and deleted.
      await checkAlert(newAlert, user.uid);

    } catch (error) {
      console.error("Error adding or checking alert:", error);
    }
  };

  const removeAlert = async (alertId) => {
    if (!user) return;
    const alertDocRef = doc(db, "users", user.uid, "alerts", alertId);
    await deleteDoc(alertDocRef);
  };

  return (
    <AlertsContext.Provider value={{ alerts, addAlert, removeAlert }}>
      {children}
    </AlertsContext.Provider>
  );
}
