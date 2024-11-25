import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { redirect } from "next/navigation";

const AdminProtected = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    if (user) {
      const isAdminUser = user?.role === "admin";
      if (isAdminUser) {
        setIsAdmin(true);
      } else {
        redirect("/");
      }
    } else {
      redirect("/");
    }
  }, [user]);

  if (isAdmin === null) {
    return null;
  }

  return isAdmin ? <>{children}</> : null;
};

export default AdminProtected;
