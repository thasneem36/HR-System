import { useState } from "react";
import Header from "../navBar/Header";

const ManageUserAccounts = () => {
  const users = [
    { id: "001", name: "John Doe", date: "2025-03-10", leaveType: "Sick Leave", status: "Approved" },
    { id: "002", name: "Jane Smith", date: "2025-03-12", leaveType: "Annual Leave", status: "Pending" },
  ];

  const [roles, setRoles] = useState(
    users.reduce((acc, user) => ({ ...acc, [user.id]: "User" }), {})
  );

  const handleRoleChange = (id, newRole) => {
    setRoles({ ...roles, [id]: newRole });
  };

  return (
    <div>
      <Header/>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Leave Type</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="text-center">
              <td className="border p-2">{user.id}</td>
              <td className="border p-2">{user.name}</td>
              <td className="border p-2">{user.date}</td>
              <td className="border p-2">{user.leaveType}</td>
              <td className="border p-2">{user.status}</td>
              <td className="border p-2">
                <select
                  value={roles[user.id]}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  className="border rounded p-1"
                >
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                  <option value="Manager">Manager</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUserAccounts;
