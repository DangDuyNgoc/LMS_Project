"use client";
import React from "react";
import Header from "./../../utils/Header";
import AdminSidebar from "../../components/Admin/sidebar/AdminSidebar";
import DashboardHero from "../../components/Admin/DashboardHero";
import AdminProtected from "@/app/hooks/adminProtected";
import EditCategories from "../../components/Admin/Customization/EditCategories";

const page = () => {
  return (
    <div>
      <AdminProtected>
        <Header
          title="ELearning - Admin"
          description="ELearning is a platform for students to learn and get help from teachers"
          keywords="Programming, ReactJS"
        />
        <div className="flex h-screen">
          <div className="15000px:w-[16%] w-1/5">
            <AdminSidebar />
          </div>
          <div className="w-[85%]">
            <DashboardHero />
            <EditCategories />
          </div>
        </div>
      </AdminProtected>
    </div>
  );
};

export default page;
