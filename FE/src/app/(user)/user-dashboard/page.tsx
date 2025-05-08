"use client";

import { useEffect, useState , FC, JSX, useRef } from "react";
import { useRouter } from "next/navigation";
import { isUserloggedIn } from "@/utils/isLoggedin";
import { useAuth } from "@/contexts/authProvider/authContext";
import { useApi } from '@/contexts/apiProvider/apiContext'
import "./user-dashboard.css"
import { AuthContextType, myUserDetails, signedurlResponse } from "@/types/type";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import axios from "axios";

const Dashboard:FC = ():JSX.Element => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router : AppRouterInstance = useRouter();
  const [user, setUser] = useState<myUserDetails | null>(null);
  const { logout } : Pick<AuthContextType, 'logout' > = useAuth();

  const api = useApi()

  const getData = async () : Promise<void> => {
    const result:myUserDetails = await api("GET", "user/user-dashboard/" + localStorage.getItem("userId"));
    setUser(result);
  }

  const uploadFiles = async (e: React.FormEvent) => {

    e.preventDefault();

    const urlJSON: signedurlResponse = await api("GET", "user/user-dashboard/getSecureurl");

    const file = fileInputRef.current?.files?.[0];

    if (!file) {
      alert("Please select a file.");
      return;
    }

    const res = await axios.put(urlJSON.signedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "multipart/form-data"
      },
      body: fileInputRef.current?.files?.[0] || ""
    })

    console.log(res);

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

      <form id="imageForm">
        <input id="imageInput" type="file" ref={fileInputRef}  accept="image/*"/>
          <button onClick={uploadFiles} >Upload</button>
      </form>
      
    </div>
  );
};

export default Dashboard;
