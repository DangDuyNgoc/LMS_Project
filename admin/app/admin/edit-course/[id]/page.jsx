"use client";
import React from "react";
import AdminSidebar from "../../../components/Admin/sidebar/AdminSidebar";
import Header from '../../../../app/utils/Header';
import DashboardHeader from '../../../../app/components/Admin/DashboardHeader';
import EditCourse from "../../../components/Admin/Course/EditCourse";

const page = ({params}) => {
  const id = params?.id;
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
        <div className="w-[100%]">
          <DashboardHeader />
          <EditCourse id={id}/>
        </div>
      </div>
    </div>
  );
};

export default page;
