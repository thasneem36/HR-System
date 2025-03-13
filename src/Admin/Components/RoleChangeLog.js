import React from "react";

const RoleChangeLog = ({ roleChangeLog = [] }) => {
  return (
    <div>
      <h3>Role Change Log</h3>
      <table className="log-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Old Role</th>
            <th>New Role</th>
            <th>Change Time</th>
          </tr>
        </thead>
        <tbody>
          {roleChangeLog.length > 0 ? (
            roleChangeLog.map((log) => (
              <tr key={log.id}>
                <td>{log.user}</td>
                <td>{log.oldRole}</td>
                <td>{log.newRole}</td>
                <td>{new Date(log.id).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No role changes recorded</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RoleChangeLog;
