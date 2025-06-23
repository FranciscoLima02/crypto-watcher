import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from "firebase/auth";
import { toast } from "react-toastify";
import LogoHeader from "../components/LogoHeader";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !password || !displayName) {
      toast.warn("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
      toast.success("Account created successfully!");
      navigate("/");
    } catch (error) {
      let errorMessage = "An unknown error occurred.";
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "This email address is already in use.";
          break;
        case "auth/invalid-email":
          errorMessage = "The email address is not valid.";
          break;
        case "auth/weak-password":
          errorMessage = "The password is too weak. It must be at least 6 characters long.";
          break;
        default:
          errorMessage = `Error during registration: ${error.message}`;
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Signed up with Google successfully!");
      navigate("/");
    } catch (error) {
      toast.error(`Google Sign-Up failed: ${error.message}`);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col items-center justify-center bg-gradient-to-tr from-black via-gray-950 to-[#140022] p-4">
      <LogoHeader />
      <div className="w-full max-w-sm bg-[#1b001f] rounded-xl shadow-2xl p-6 border-2 border-[#ff33ff50]">
        <h2 className="text-2xl font-bold text-center text-[#ff33ff] mb-4">
          Create an Account
        </h2>
        <form onSubmit={handleRegister} className="space-y-4">
          {/* Display Name */}
          <div>
            <label
              htmlFor="displayName"
              className="block mb-1 text-xs font-medium text-gray-400"
            >
              Display Name
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full p-2 bg-[#2e003b] text-white rounded-md border border-[#555] focus:ring-2 focus:ring-[#ff33ff] focus:outline-none"
              placeholder="Your Name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block mb-1 text-xs font-medium text-gray-400"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 bg-[#2e003b] text-white rounded-md border border-[#555] focus:ring-2 focus:ring-[#ff33ff] focus:outline-none"
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block mb-1 text-xs font-medium text-gray-400"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 bg-[#2e003b] text-white rounded-md border border-[#555] focus:ring-2 focus:ring-[#ff33ff] focus:outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full py-2 px-4 bg-[#ff33ff] text-black font-bold rounded-md hover:bg-opacity-90 transition-all disabled:bg-gray-600 disabled:text-gray-400"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {/* OR Separator */}
        <div className="my-4 flex items-center">
          <div className="flex-grow border-t border-gray-600"></div>
          <span className="mx-3 text-xs text-gray-400">OR</span>
          <div className="flex-grow border-t border-gray-600"></div>
        </div>

        {/* Google Sign-In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading || googleLoading}
          className="w-full py-2 px-4 bg-white text-gray-800 font-bold rounded-md hover:bg-gray-200 transition-all flex items-center justify-center gap-2 disabled:bg-gray-400"
        >
          {googleLoading ? "Connecting..." : "Sign up with Google"}
        </button>

        {/* Link to Login */}
        <p className="mt-4 text-center text-xs text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-[#ff33ff] hover:text-cyan-400"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
