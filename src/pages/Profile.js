import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { auth } from "../firebase";
import { updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { toast } from "react-toastify";
import { User, Lock, Edit3 } from "lucide-react";
import { motion } from "framer-motion";

export default function Profile() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [isUpdatingPass, setIsUpdatingPass] = useState(false);

  // Update display name
  const handleNameUpdate = async (e) => {
    e.preventDefault();
    if (!displayName || displayName === user.displayName) return;
    
    setIsUpdatingName(true);
    try {
      await updateProfile(auth.currentUser, { displayName });
      toast.success("Name updated successfully!");
    } catch (error) {
      toast.error(`Error updating name: ${error.message}`);
    } finally {
      setIsUpdatingName(false);
    }
  };

  // Update password
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.warn("Please fill in both the current and new password fields.");
      return;
    }

    setIsUpdatingPass(true);
    try {
      // Re-authenticate first for security
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      
      // If re-authentication is successful, update the password
      await updatePassword(auth.currentUser, newPassword);
      
      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");

    } catch (error) {
      let errorMessage = "An unknown error occurred.";
      switch (error.code) {
        case "auth/invalid-credential":
          errorMessage = "The current password you entered is incorrect. Please try again.";
          break;
        case "auth/weak-password":
          errorMessage = "The new password is too weak. It must be at least 6 characters long.";
          break;
        case "auth/requires-recent-login":
            errorMessage = "This operation is sensitive and requires recent authentication. Please log out and log in again before retrying.";
            break;
        default:
          errorMessage = `Error updating password: ${error.message}`;
      }
      toast.error(errorMessage);
    } finally {
      setIsUpdatingPass(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl md:text-4xl text-center text-[#ff33ff] font-extrabold mb-8 flex items-center justify-center gap-3">
        <User /> Profile
      </h1>

      <div className="space-y-6 md:space-y-8">
        {/* User Information */}
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-[#24002c] to-[#1a0022] rounded-2xl shadow-2xl p-4 md:p-6 border border-[#ff33ff40]"
        >
          <h2 className="text-xl md:text-2xl font-bold text-cyan-400 mb-4">My Information</h2>
          <div className="space-y-3">
            <div className="text-gray-300 text-sm md:text-base break-all">
              <span className="font-semibold text-gray-400">Email:</span> {user?.email}
            </div>
            <form onSubmit={handleNameUpdate} className="flex flex-col sm:flex-row gap-2 items-end">
              <div className="w-full">
                <label htmlFor="displayName" className="font-semibold text-gray-400 block mb-1 text-sm md:text-base">Display Name:</label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full p-2 bg-[#2e003b] text-white border border-[#555] rounded-lg focus:ring-2 focus:ring-[#ff33ff] focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={isUpdatingName || displayName === (user?.displayName || "")}
                className="w-full sm:w-auto px-4 py-2 bg-[#ff33ff] text-black font-bold rounded-lg hover:bg-opacity-80 transition flex items-center justify-center gap-2 disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                <Edit3 size={18} /> {isUpdatingName ? "Saving..." : "Save"}
              </button>
            </form>
          </div>
        </motion.div>

        {/* Change Password */}
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-br from-[#24002c] to-[#1a0022] rounded-2xl shadow-2xl p-4 md:p-6 border border-[#ff33ff40]"
        >
          <h2 className="text-xl md:text-2xl font-bold text-cyan-400 mb-4">Change Password</h2>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div>
              <label htmlFor="currentPass" className="font-semibold text-gray-400 block mb-1 text-sm md:text-base">Current Password:</label>
              <input
                id="currentPass"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full p-2 bg-[#2e003b] text-white border border-[#555] rounded-lg focus:ring-2 focus:ring-[#ff33ff] focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="newPass" className="font-semibold text-gray-400 block mb-1 text-sm md:text-base">New Password:</label>
              <input
                id="newPass"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 bg-[#2e003b] text-white border border-[#555] rounded-lg focus:ring-2 focus:ring-[#ff33ff] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={isUpdatingPass}
              className="w-full px-4 py-2 bg-[#ff33ff] text-black font-bold rounded-lg hover:bg-opacity-80 transition flex items-center justify-center gap-2 disabled:bg-gray-600"
            >
              <Lock size={18} /> {isUpdatingPass ? "Updating..." : "Update Password"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
} 