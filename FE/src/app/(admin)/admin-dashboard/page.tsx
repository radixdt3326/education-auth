"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isUserloggedIn } from "@/utils/isLoggedin";
import { useAuth } from "@/contexts/authProvider/authContext";
import { useApi } from '@/contexts/apiProvider/apiContext'
import "./admin-dashboard.css"
import { myUserDetails } from "@/types/type";

const Dashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState<myUserDetails | null>(null);
  const { logout } = useAuth();

  const api = useApi();

  const getData = async () => {
    const result : myUserDetails = await api("GET", "admin/admin-dashboard/" + localStorage.getItem("userId"));
    setUser(result);
  }

  useEffect(() => {
    if (!isUserloggedIn("admin")) router.push("/")
    getData();
  }, [router]);

  return (
    <div className="dashboard-container">
      <h1>Welcome to Admin Dashboard </h1>
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