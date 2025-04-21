"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/authProvider/authContext";
import "./signin.css"; // Custom CSS module

interface errorObject {
  email : string;
  password : string;
  message : string;
}

interface signInState {
  email : string;
  password : string;
  loading : boolean;
}

const SignInPage = () => {
  const { attemptAuth, myUserDetails, lastError } = useAuth();
  const [state , setState] = useState<signInState>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<errorObject>({ email: "", password: "", messages: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: "", password: "", messages: "" };

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    // Password validation
    if (!password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setError(newErrors);
    return isValid;
  };

  useEffect(() => {
    isUserLogin()
  }, [JSON.stringify(myUserDetails)])

  const isUserLogin = () => {
    const token = localStorage.getItem("sessId");
    if (token) {
      // setIsRedirect(true);
      const role = localStorage.getItem("role");
      // SetUserRole(typeof role == 'string' ?  role : "");
      if(typeof role == 'string' && role =="user") router.push("/user-dashboard");
      if(typeof role == 'string' && role =="admin") router.push("/admin-dashboard");
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }
    // setError({ email: "", password: "" });

    await attemptAuth(email, password);

    setLoading(false);
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="title">Sign In</h2>
        {lastError && <p className="error">{lastError}</p>}
        <form onSubmit={handleSubmit}>
          <div className="inputGroup">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input"
            />
            {error.email && <p className="error">{error.email}</p>}
          </div>
          <div className="inputGroup">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input"
            />
            {error.password && <p className="error">{error.password}</p>}
          </div>
          <button type="submit" className="button" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignInPage;
