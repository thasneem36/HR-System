import React, { useState } from "react";
import UserRolesManagement from "../Components/UserRolesManagement";
import RoleChangeLog from "../Components/RoleChangeLog";
import "../Components/UserRolesPage.css";
import Header from "../navBar/Header";


const UserRolesPage = () => {
  const [activeTab, setActiveTab] = useState("manage"); // Default to Manage tab
  const [roleChangeLog, setRoleChangeLog] = useState([]); // Ensure it's always an array

  return (
    <div className="container">
      <Header />
      <h2>User Roles Management</h2>

      <div className="tab-buttons">
        <button
          className={activeTab === "manage" ? "active" : ""}
          onClick={() => setActiveTab("manage")}
        >
          Manage
        </button>
        <button
          className={activeTab === "logs" ? "active" : ""}
          onClick={() => setActiveTab("logs")}
        >
          Logs
        </button>
      </div>

      {activeTab === "manage" ? (
        <UserRolesManagement setRoleChangeLog={setRoleChangeLog} />
      ) : (
        <RoleChangeLog roleChangeLog={roleChangeLog} />
      )}
    </div>

  );
};

export default UserRolesPage;
