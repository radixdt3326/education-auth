'use client'
import "./about.css";
import React, { JSX, useEffect, useState } from "react";
import { useApi } from '../../contexts/apiProvider/apiContext'
import axios from "axios";
import apiBaseOrigin from "@/utils/apiBaseOrigin";

const About: React.FC = ():JSX.Element => {

  const [data, setData] = useState<string>("");

  const api = useApi()

  const getData = async () => {
    console.log(apiBaseOrigin,"--> apibaseorigin")
    console.log("env-->",process.env.NEXT_PUBLIC_API_URL )
    const apiUrl = `http://${apiBaseOrigin || process.env.NEXT_PUBLIC_API_URL }`;
    const config = {
      method: 'GET',
      url: apiUrl ,
      headers: {
        // "X-CSRF" : "Y",
        "X-SESSID" : "1234",
        'Authorization': 'test',
        'Content-Type': 'application/json',
      },
      credentials:'include',
      data : {}
    };
    const result = await axios(config);
    console.log(result);
    // setData(result.message);
  }

  useEffect(() => {
    getData();
  }, [])

  return (
    <div className="about-container">
      <p>{data}</p>
    </div>
  );
};

export default About;
