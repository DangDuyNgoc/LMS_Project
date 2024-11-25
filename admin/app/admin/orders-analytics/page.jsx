"use client";
import React from "react";
import Header from "../../utils/Header";
import AdminSidebar from "../../components/Admin/sidebar/AdminSidebar";
import DashboardHeader from "../../components/Admin/DashboardHeader";
import OrderAnalytics from '../../components/Admin/Analytics/OrderAnalytics.jsx';
const page = () => {
  return (
    <div>
      <Header
        title="ELearning - Admin"
        description="ELearning is a platform for students to learn and get help from teachers"
        keywords="Programming, ReactJS"
      />

      <div className="flex">
        <div className="1500px:w-[16%] w-1/5">
          <AdminSidebar />
        </div>
        <div className="w-[85%]">
          <DashboardHeader />
          <OrderAnalytics />
        </div>
      </div>
    </div>
  );
};

export default page;
