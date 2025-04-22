"use client";

import { useEffect, useState , FC } from "react";
import { useRouter } from "next/navigation";
import { isUserloggedIn } from "@/utils/isLoggedin";
import { useAuth } from "@/contexts/authProvider/authContext";
import { useApi } from '@/contexts/apiProvider/apiContext'
import "./user-dashboard.css"

const Dashboard:FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<any | null>(null);
  const { logout } = useAuth();

  const api = useApi()

  const getData = async () => {
    const result = await api("GET", "user/user-dashboard/" + localStorage.getItem("userId"));
    setUser(result);
  }

  useEffect(() => {
    if (!isUserloggedIn("user")) router.push("/")
    getData();
  }, [router]);

  return (
    <div className="dashboard-container">
      <h1>Welcome to User Dashboard </h1>
      {user ? <p>Logged in as: {user.useremail}</p> : <p>Loading...</p>}
      <button
        onClick={async () => {
          await logout(() => router.push("/"));
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
