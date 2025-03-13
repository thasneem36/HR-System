import React, { useState } from "react";

const UserRolesManagement = ({ setRoleChangeLog }) => {
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", role: "HR", department: "Finance", permissions: { downloadReport: true, editUsers: false, payroll: false } },
    { id: 2, name: "Jane Smith", role: "Staff", department: "IT", permissions: { downloadReport: false, editUsers: false, payroll: false } },
    { id: 3, name: "Mike Johnson", role: "RM", department: "HR", permissions: { downloadReport: true, editUsers: true, payroll: true } }
  ]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [updatedPermissions, setUpdatedPermissions] = useState({});
  const [newRole, setNewRole] = useState("");

  const openPermissionModal = (user) => {
    setSelectedUser(user);
    setUpdatedPermissions({ ...user.permissions });
    setNewRole(user.role);
    setShowPermissionModal(true);
  };

  const closePermissionModal = () => {
    setShowPermissionModal(false);
    setSelectedUser(null);
  };

  const togglePermission = (perm) => {
    setUpdatedPermissions((prev) => ({
      ...prev,
      [perm]: !prev[perm],
    }));
  };

  const confirmSaveChanges = () => {
    setShowConfirmModal(true);
  };

  const saveChanges = () => {
    if (!selectedUser) return;

    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === selectedUser.id
          ? { ...user, role: newRole, permissions: updatedPermissions }
          : user
      )
    );

    setRoleChangeLog((prevLog) => [
      ...prevLog,
      {
        id: Date.now(),
        user: selectedUser.name,
        oldRole: selectedUser.role,
        newRole,
      },
    ]);

    setShowConfirmModal(false);
    setShowPermissionModal(false);
  };

  return (
    <div>
      <h3>Manage User Roles</h3>
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Department</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.department}</td>
              <td>{user.role}</td>
              <td>
                <button className="manage-btn" onClick={() => openPermissionModal(user)}>Manage</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Permission Management Modal */}
      {showPermissionModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Manage {selectedUser?.name}'s Permissions</h3>

            <label>
              Change Role:
              <select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                <option value="HR">HR</option>
                <option value="RM">RM</option>
                <option value="Staff">Staff</option>
              </select>
            </label>

            <label>
              <input type="checkbox" checked={updatedPermissions.downloadReport} onChange={() => togglePermission("downloadReport")} />
              Download Report
            </label>
            <label>
              <input type="checkbox" checked={updatedPermissions.editUsers} onChange={() => togglePermission("editUsers")} />
              Edit Users
            </label>
            <label>
              <input type="checkbox" checked={updatedPermissions.payroll} onChange={() => togglePermission("payroll")} />
              Payroll
            </label>

            <button className="save-btn" onClick={confirmSaveChanges}>Save</button>
            <button className="close-btn" onClick={closePermissionModal}>Close</button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Confirm Changes</h3>
            <p>Are you sure you want to save these changes?</p>
            <button className="confirm-btn" onClick={saveChanges}>Yes, Save</button>
            <button className="cancel-btn" onClick={() => setShowConfirmModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserRolesManagement;
