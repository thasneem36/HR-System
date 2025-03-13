import React, { useState } from "react";
// import "./ManageEmployees.css";
import '../Components/ManageEmployees.css'
import Header from "../navBar/Header";

const ManageEmployees = () => {

    const [employees, setEmployees] = useState([
        { id: 1, name: "John Doe", department: "IT", jobTitle: "Software Engineer", role: "Staff", status: "Active" },
        { id: 2, name: "Jane Smith", department: "HR", jobTitle: "Project Manager", role: "HR", status: "Active" },
    ]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [viewMode, setViewMode] = useState("list");
    const [newEmployee, setNewEmployee] = useState({
        name: "", department: "", jobTitle: "", role: "Staff", status: "Active"
    });

    // Handle Edit
    const handleEdit = (emp) => {
        setSelectedEmployee(emp);
        setViewMode("edit");
    };

    // Handle Delete
    const handleDelete = (id) => {
        setEmployees(employees.filter(emp => emp.id !== id));
    };

    // Handle View
    const handleView = (emp) => {
        setSelectedEmployee(emp);
        setViewMode("view");
    };

    // Handle Activate/Deactivate Toggle
    const handleToggleStatus = (id) => {
        setEmployees(employees.map(emp => 
            emp.id === id ? { ...emp, status: emp.status === "Active" ? "Deactivated" : "Active" } : emp
        ));
    };

    // Handle Save after Edit
    const handleSave = (updatedEmployee) => {
        setEmployees(employees.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp));
        setViewMode("list");
    };

    // Handle Adding a New Employee
    const handleAddEmployee = () => {
        if (newEmployee.name && newEmployee.department && newEmployee.jobTitle) {
            setEmployees([...employees, { id: employees.length + 1, ...newEmployee }]);
            setNewEmployee({ name: "", department: "", jobTitle: "", role: "Staff", status: "Active" });
            setViewMode("list");
        } else {
            alert("Please fill all fields before adding!");
        }
    };

    if (viewMode === "edit" && selectedEmployee) {
        return (
            <div className="edit-employee-container">
                <h2>Edit Employee</h2>
                <input type="text" value={selectedEmployee.name} onChange={(e) => setSelectedEmployee({ ...selectedEmployee, name: e.target.value })} />
                <input type="text" value={selectedEmployee.department} onChange={(e) => setSelectedEmployee({ ...selectedEmployee, department: e.target.value })} />
                <input type="text" value={selectedEmployee.jobTitle} onChange={(e) => setSelectedEmployee({ ...selectedEmployee, jobTitle: e.target.value })} />
                <select value={selectedEmployee.role} onChange={(e) => setSelectedEmployee({ ...selectedEmployee, role: e.target.value })}>
                    <option value="HR">HR</option>
                    <option value="RM">RM</option>
                    <option value="Staff">Staff</option>
                </select>
                <button onClick={() => handleSave(selectedEmployee)}>Save</button>
                <button onClick={() => setViewMode("list")}>Back</button>
            </div>
        );
    }

    if (viewMode === "view" && selectedEmployee) {
        return (
            <div className="view-employee-container">
                <h2>View Employee</h2>
                <p><strong>Name:</strong> {selectedEmployee.name}</p>
                <p><strong>Department:</strong> {selectedEmployee.department}</p>
                <p><strong>Job Title:</strong> {selectedEmployee.jobTitle}</p>
                <p><strong>Role:</strong> {selectedEmployee.role}</p>
                <p><strong>Status:</strong> {selectedEmployee.status}</p>
                <button onClick={() => setViewMode("list")}>Back</button>
            </div>
        );
    }

    if (viewMode === "add") {
        return (
            <div className="add-employee-container">
                <h2>Add Employee</h2>
                <input type="text" placeholder="Name" value={newEmployee.name} onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })} />
                <input type="text" placeholder="Department" value={newEmployee.department} onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })} />
                <input type="text" placeholder="Job Title" value={newEmployee.jobTitle} onChange={(e) => setNewEmployee({ ...newEmployee, jobTitle: e.target.value })} />
                <select value={newEmployee.role} onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}>
                    <option value="HR">HR</option>
                    <option value="RM">RM</option>
                    <option value="Staff">Staff</option>
                </select>
                <button onClick={handleAddEmployee}>Add</button>
                <button onClick={() => setViewMode("list")}>Back</button>
            </div>
        );
    }

    return (
        <div>
            <Header />
            <div className="manage-employees-container">
            <h2>Manage Employees</h2>
            <div className="employee-actions">
                <input type="text" placeholder="Search..." />
                <button>Search</button>
                <button onClick={() => setViewMode("add")}>Add</button>
            </div>
            <table className="employee-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Job Title</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((emp) => (
                        <tr key={emp.id}>
                            <td>{emp.id}</td>
                            <td>{emp.name}</td>
                            <td>{emp.department}</td>
                            <td>{emp.jobTitle}</td>
                            <td>{emp.role}</td>
                            <td className={emp.status === "Active" ? "status-active" : "status-deactivated"}>{emp.status}</td>
                            <td>
                                <button onClick={() => handleEdit(emp)}>Edit</button>
                                <button onClick={() => handleDelete(emp.id)}>Delete</button>
                                <button onClick={() => handleView(emp)}>View</button>
                                <button onClick={() => handleToggleStatus(emp.id)}>
                                    {emp.status === "Active" ? "Deactivate" : "Activate"}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </div>
    );
};

export default ManageEmployees;
