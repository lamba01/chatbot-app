import { useState } from "react";
import { auth, googleProvider } from "../config/firebaseConfig";
import { useNavigate } from "react-router-dom";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State for error messages
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  // Google Sign-In
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      alert("Signed in with Google!");
    } catch (error) {
      setError("Failed to sign in with Google. Try again.");
      console.error(error.message);
    }
  };

  // Email/Password Sign-In or Signup
  const handleAuth = async () => {
    setError(""); // Reset error message before each attempt
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Signed in successfully!");
      } else {
        if (password.length < 6) {
          setError("Password must be at least 6 characters long.");
          return;
        }
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Account created successfully!");
      }
      navigate("/");
    } catch (error) {
      switch (error.code) {
        case "auth/invalid-email":
          setError("Invalid email format.");
          break;
        case "auth/user-not-found":
          setError("No account found with this email.");
          break;
        case "auth/wrong-password":
          setError("Incorrect password. Try again.");
          break;
        case "auth/email-already-in-use":
          setError("Email is already registered.");
          break;
        case "auth/weak-password":
          setError("Password is too weak. Use at least 6 characters.");
          break;
        default:
          setError("Something went wrong. Try again.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <h2 className="text-2xl font-bold">{isLogin ? "Sign In" : "Sign Up"}</h2>
      <input
        type="email"
        placeholder="Email"
        className="border p-2 rounded w-80"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="border p-2 rounded w-80"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="text-red-500">{error}</p>}{" "}
      {/* Display errors here */}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleAuth}
      >
        {isLogin ? "Sign In" : "Sign Up"}
      </button>
      <button
        className="bg-red-500 text-white px-4 py-2 rounded"
        onClick={signInWithGoogle}
      >
        Sign In with Google
      </button>
      <p
        className="text-blue-600 cursor-pointer"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin
          ? "Need an account? Sign up"
          : "Already have an account? Sign in"}
      </p>
    </div>
  );
}

export default Auth;
