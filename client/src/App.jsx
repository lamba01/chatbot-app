import { useState, useEffect } from "react";
import { auth } from "./config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import Auth from "./auth/auth";
import Home from "./pages/home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <p>Loading...</p>; // Prevents flashing incorrect pages

  return (
    <Routes>
      <Route path="/" element={user ? <Home /> : <Auth />} />
      <Route path="/signup" element={<Auth />} />
    </Routes>
  );
}

export default App;
