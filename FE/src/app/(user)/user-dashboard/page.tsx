"use client";

import { useEffect, useState , FC, JSX } from "react";
import { useRouter } from "next/navigation";
import { isUserloggedIn } from "@/utils/isLoggedin";
import { useAuth } from "@/contexts/authProvider/authContext";
import { useApi } from '@/contexts/apiProvider/apiContext'
import "./user-dashboard.css"
import { AuthContextType, myUserDetails } from "@/types/type";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const Dashboard:FC = ():JSX.Element => {
  const router : AppRouterInstance = useRouter();
  const [user, setUser] = useState<myUserDetails | null>(null);
  const { logout } : Pick<AuthContextType, 'logout' > = useAuth();

  const api = useApi()

  const getData = async () : Promise<void> => {
    const result:myUserDetails = await api("GET", "user/user-dashboard/" + localStorage.getItem("userId"));
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
