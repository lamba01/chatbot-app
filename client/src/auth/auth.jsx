import { useState } from "react";
import { auth, googleProvider } from "../config/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  setPersistence,
  sendPasswordResetEmail,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Google Sign-In
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      alert("Signed in with Google!");
      navigate("/");
    } catch (error) {
      setError("Failed to sign in with Google. Try again.");
      console.log(error.message);
    }
  };

  // Email/Password Sign-In or Sign-Up
  const handleAuth = async () => {
    setError("");
    if (!email) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }
    setLoading(true);

    try {
      // Set session persistence based on "Remember Me"
      await setPersistence(
        auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );

      let userCredential;
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        if (rememberMe) {
          localStorage.setItem("user", JSON.stringify(userCredential.user)); // Now it's used
        }
        alert("Signed in successfully!");
      } else {
        if (password.length < 6) {
          setError("Password must be at least 6 characters long.");
          return;
        }
        userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        alert("Account created successfully!");
      }

      navigate("/");
    } catch (error) {
      console.log(error);
      switch (error.code) {
        case "auth/invalid-email":
          setError("Invalid email format.");
          break;
        case "auth/user-not-found":
          setError("No account found with this email.");
          break;
        case "auth/invalid-credential":
          setError("Incorrect email or password. Please try again");
          break;
        case "auth/email-already-in-use":
          setError("Email is already in use.");
          break;
        case "auth/weak-password":
          setError("Password is too weak. Use at least 6 characters.");
          break;
        default:
          setError("Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password Functionality
  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email to reset password.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset link sent! Check your email.");
    } catch (error) {
      setError("Failed to send reset email. Please try again.");
      console.error(error.message);
    }
  };

  return (
    <main className="flex flex-col items-center p-4 space-y-4 w-full">
      <div className="flex flex-col items-center p-4 gap-y-3 space-y-4">
        <div className="flex flex-col text-center">
          <h2 className="text-2xl font-bold">
            {isLogin ? "Log in" : "Sign Up"}
          </h2>
          <p
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? "Need an account? Sign up"
              : "Already have an account? Sign in"}
          </p>
        </div>
        <button
          className="border-2 border-gray-500 text-black w-full justify-center py-2 rounded-3xl flex items-center gap-x-2 text-center hover:bg-blue-500 cursor-pointer hover:text-white hover:border-blue-500 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out"
          onClick={signInWithGoogle}
        >
          <FcGoogle size={"1.5em"} />
          Continue with Google
        </button>
        <div className="flex items-center justify-center my-4 w-full">
          <div className="flex-1 border-t border-gray-500"></div>
          <span className="px-4 text-gray-500 text-sm">
            or continue with email
          </span>
          <div className="flex-1 border-t border-gray-500"></div>
        </div>
        <div className="flex flex-col gap-5 w-full">
          <div>
            <label htmlFor="Email" className="text-start font-medium">
              Email address
            </label>
            <input
              type="email"
              id="Email"
              placeholder="Email"
              required
              className="border mt-1 border-gray-500 p-2 px-4 rounded w-full focus:outline-none focus:ring-1 focus:ring-gray-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="Password" className="text-start font-medium">
              Password
            </label>
            <input
              type="password"
              id="Password"
              placeholder="Password"
              required
              className="border mt-1 border-gray-500 p-2 px-4 rounded w-full focus:outline-none focus:ring-1 focus:ring-gray-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex items-center justify-between w-full">
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                Remember Me
              </label>
              {isLogin && (
                <p
                  className="text-blue-600 text-sm cursor-pointer hover:underline"
                  onClick={handleForgotPassword}
                >
                  Forgot Password?
                </p>
              )}
            </div>
          </div>
        </div>
        {error && <p className="text-red-500">{error}</p>}

        <button
          className="bg-blue-500 text-white px-4 w-full py-2 rounded-3xl cursor-pointer transition-all duration-300 ease-in-out hover:bg-blue-600 hover:shadow-lg hover:scale-105 active:scale-95"
          onClick={handleAuth}
          disabled={loading}
        >
          {loading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
        </button>
      </div>
    </main>
  );
}

export default Auth;
