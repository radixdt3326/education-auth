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
    const apiUrl = `http://${apiBaseOrigin}:3000`;
    const config = {
      method: 'GET',
      url: apiUrl ,
      headers: {
        // "X-CSRF" : "Y",
        "X-SESSID" : localStorage.getItem("sessId"),
      },
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
