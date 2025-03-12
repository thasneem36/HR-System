import { useState } from "react";
import ManageUserAccounts from "./ManageUserAccounts";
import AccessControl from "./AccessControl";
import SecuritySettings from "./SecuritySettings";
import Header from "../navBar/Header";

const UserRolesPage = () => {
  const [activeTab, setActiveTab] = useState("manage");

  return (
    <div className="p-6">
      <Header/>
      <h2 className="text-xl font-semibold mb-4">User Roles & Permissions Page</h2>

      {/* Tabs */}
      <div className="flex border-b mb-4">
        <button
          className={`p-2 px-4 ${activeTab === "manage" ? "bg-red-600 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("manage")}
        >
          Manage User Accounts
        </button>
        <button
          className={`p-2 px-4 ${activeTab === "access" ? "bg-gray-400 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("access")}
        >
          Access Control
        </button>
        <button
          className={`p-2 px-4 ${activeTab === "security" ? "bg-gray-400 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("security")}
        >
          Security Settings
        </button>
      </div>

      {/* Render Active Tab Content */}
      {activeTab === "manage" && <ManageUserAccounts />}
      {activeTab === "access" && <AccessControl />}
      {activeTab === "security" && <SecuritySettings />}
    </div>
  );
};

export default UserRolesPage;
