"use client";
import { useState, useEffect , FC } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/authProvider/authContext";
import "./signin.css"; // Custom CSS module

interface ErrorObject {
  email : string;
  password : string;
  message : string;
}

interface SignInState {
  email : string;
  password : string;
  loading : boolean;
}

export enum UserRole {
  User = "user",
  Admin = "admin",
}

const SignInPage: FC = () => {
  const { attemptAuth, myUserDetails, lastError } = useAuth();
  const [state , setState] = useState<SignInState>({email: "", password: "", loading: false});
  const [error, setError] = useState<ErrorObject>({ email: "", password: "", message: "" });
  const router = useRouter();

  const validateForm = () => {
    let isValid = true;
    const newErrors : ErrorObject = { email: "", password: "", message: "" };

    // Email validation
    if (!state?.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(state.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    // Password validation
    if (!state?.password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (state?.password.length < 6) {
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
      const role  = localStorage.getItem("role") as UserRole | null;
      if(typeof role == 'string' && role == UserRole.User) router.push("/user-dashboard");
      if(typeof role == 'string' && role == UserRole.Admin) router.push("/admin-dashboard");
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState({...state, loading: true});

    if (!validateForm()) {
      setState({...state, loading: false});
      return;
    }
    const email = state?.email;
    const password = state?.password;

    await attemptAuth(email, password);
    setState({...state, loading: false});
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
              value={state?.email}
              onChange={(e) => setState({...state, email: e.target.value})}
              required
              className="input"
            />
            {error.email && <p className="error">{error.email}</p>}
          </div>
          <div className="inputGroup">
            <label>Password</label>
            <input
              type="password"
              value={state?.password}
              onChange={(e) => setState({...state, password: e.target.value})}
              required
              className="input"
            />
            {error.password && <p className="error">{error.password}</p>}
          </div>
          <button type="submit" className="button" disabled={state?.loading}>
            {state?.loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignInPage;
