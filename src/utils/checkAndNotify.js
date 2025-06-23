import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { fetchCoinTicker } from "./coinPaprika";
import { toast } from "react-toastify";

/**
 * Checks a single alert, notifies if triggered, and deletes it from Firestore.
 * @param {object} alert - The alert object from Firestore (including the 'id').
 * @param {string} userId - The Firebase user's UID.
 * @returns {Promise<boolean>} - Returns `true` if the alert was triggered, otherwise `false`.
 */
export async function checkAlert(alert, userId) {
    const { coinId, condition, targetPrice, symbol, id: alertId } = alert;

    // Basic validation
    if (!coinId || !condition || !targetPrice || !userId || !alertId) return false;

    // 1. Fetch the current price
    let currentPrice = null;
    try {
        const res = await fetchCoinTicker(coinId);
        currentPrice = res.data?.quotes?.USD?.price ?? null;
    } catch (e) {
        console.error(`Error fetching price for ${coinId}:`, e.message);
        return false; // Do not proceed if price fetch fails
    }

    if (currentPrice === null) return false;

    // 2. Check the condition
    let triggered = false;
    if (condition === "gte" && currentPrice >= targetPrice) {
        triggered = true;
    } else if (condition === "lte" && currentPrice <= targetPrice) {
        triggered = true;
    }

    // 3. If triggered, notify and delete
    if (triggered) {
        const priceFormatted = currentPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        const targetFormatted = targetPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        
        const message = `Price of ${symbol} reached ${targetFormatted}. Current price: ${priceFormatted}.`;

        console.log(`ALERT TRIGGERED: ${symbol} ${condition} ${targetFormatted}`);

        // Browser Notification
        if (Notification.permission === "granted") {
            new Notification("Price Alert Triggered!", {
                body: message,
                icon: "/logo192.png",
            });
        }

        // In-page Toast Notification
        toast.success(message, {
             position: "top-right",
             autoClose: 10000, // 10 seconds
             hideProgressBar: false,
             closeOnClick: true,
             pauseOnHover: true,
             draggable: true,
        });

        // Delete the alert so it doesn't trigger again
        const alertDocRef = doc(db, "users", userId, "alerts", alertId);
        await deleteDoc(alertDocRef);

        return true;
    }

    return false;
} 