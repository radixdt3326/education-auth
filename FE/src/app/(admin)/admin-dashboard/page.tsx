"use client";

import { JSX, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isUserloggedIn } from "@/utils/isLoggedin";
import { useAuth } from "@/contexts/authProvider/authContext";
import { useApi } from '@/contexts/apiProvider/apiContext'
import "./admin-dashboard.css"
import { AuthContextType, myUserDetails } from "@/types/type";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const Dashboard = ():JSX.Element => {
  const router:AppRouterInstance = useRouter();
  const [user, setUser] = useState<myUserDetails | null>(null);
  const { logout } : Pick<AuthContextType, 'logout' > = useAuth();

  const api = useApi();

  const getData = async () : Promise<void> => {
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