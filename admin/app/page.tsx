"use client";
import Header from "./utils/Header";
import { useState } from "react";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import Verification from "./components/Auth/Verification";

export default function Home() {
  const [route, setRoute] = useState("Login");
  return (
    <div>
      <Header
        title="ELearning"
        description="ELearning is a platform for students to learn"
        keywords="Programming, ReactJS"
      />

      <div className="w-[90%] md:w-[420px] m-auto h-screen flex items-center justify-center">
        {route === "Login" && <Login setRoute={setRoute} />}
        {route === "Sign-up" && <Signup setRoute={setRoute} />}
        {route === "Verification" && <Verification setRoute={setRoute} />}
      </div>
    </div>
  );
}
