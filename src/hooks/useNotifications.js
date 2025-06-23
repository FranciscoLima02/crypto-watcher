import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  query,
  onSnapshot,
  updateDoc,
  doc,
  where,
  getDocs,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    const colRef = collection(db, 'users', user.uid, 'notifications');
    const q = query(colRef, orderBy('createdAt', 'desc'));

    const unsub = onSnapshot(q, snap => {
      const newNotifications = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setNotifications(newNotifications);
      const newUnreadCount = newNotifications.filter(n => !n.read).length;
      setUnreadCount(newUnreadCount);
    });

    return unsub;
  }, [user]);

  const markAsRead = useCallback(
    async id => {
      if (!user) return;
      const docRef = doc(db, 'users', user.uid, 'notifications', id);
      await updateDoc(docRef, { read: true });
    },
    [user]
  );

  const markAllAsRead = useCallback(async () => {
    if (!user) return;
    const colRef = collection(db, 'users', user.uid, 'notifications');
    const q = query(colRef, where('read', '==', false));
    const snap = await getDocs(q);
    const promises = snap.docs.map(d =>
      updateDoc(d.ref, { read: true })
    );
    await Promise.all(promises);
  }, [user]);

  return { notifications, unreadCount, markAsRead, markAllAsRead };
} 