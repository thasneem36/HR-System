import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeaveContext } from '../../components/EmployeeRM/LeaveContext';
import './LeaveRequestPage.css';

function LeaveRequestPage() {
  const navigate = useNavigate();
  const { addLeaveRequest } = useLeaveContext() || {};
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    numLeaveDays: '',
    reason: '',
    attachment: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (addLeaveRequest) {
      addLeaveRequest({
        ...formData,
        name: 'HMM.Thasneem',
        submittedAt: new Date().toLocaleString()
      });
    }
    navigate('/employeedashboard');
  };

  return (
    <div className="leave-request-page">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate('/employeedashboard')}>
          <i className="fas fa-arrow-left"></i>
          Back to Dashboard
        </button>
        <h1>Request Leave</h1>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="leave-request-form">
          <div className="form-section">
            <h2>Leave Details</h2>
            <div className="form-group">
              <label htmlFor="leaveType">Leave Type</label>
              <select
                id="leaveType"
                name="leaveType"
                value={formData.leaveType}
                onChange={handleChange}
                required
              >
                <option value="">Select Leave Type</option>
                <option value="annual">Annual Leave</option>
                <option value="sick">Sick Leave</option>
                <option value="personal">Personal Leave</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startDate">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="endDate">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="numLeaveDays">Number of Days</label>
                <input
                  type="number"
                  id="numLeaveDays"
                  name="numLeaveDays"
                  value={formData.numLeaveDays}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Additional Information</h2>
            <div className="form-group">
              <label htmlFor="reason">Reason for Leave</label>
              <textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
                placeholder="Please provide a detailed reason for your leave request"
                rows="4"
              />
            </div>

            <div className="form-group">
              <label htmlFor="attachment">Supporting Documents (Optional)</label>
              <input
                type="file"
                id="attachment"
                name="attachment"
                onChange={handleChange}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <small className="file-hint">Accepted formats: PDF, DOC, DOCX, JPG, PNG</small>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={() => navigate('/employeedashboard')}>
              Cancel
            </button>
            <button type="submit" className="submit-button">
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LeaveRequestPage; 