'use client'
import "./about.css";
import React, { useEffect, useState } from "react";
import { useApi } from '../../contexts/apiProvider/apiContext'

const About: React.FC = () => {

  const [data, setData] = useState("");

  const api = useApi()

  const getData = async () => {
    const result = await api("GET", "public/about")
    setData(result.message);
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
