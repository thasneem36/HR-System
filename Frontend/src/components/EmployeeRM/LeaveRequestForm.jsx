import React, { useState, useEffect } from 'react';
import { useLeaveContext } from './LeaveContext';
import './LeaveRequestForm.css';

const LeaveRequestForm = ({ onClose }) => {
  const context = useLeaveContext();
  const { addLeaveRequest } = context || {};

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
    setFormData((prev) => ({
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

    onClose();
  };

  useEffect(() => {
    document.title = "Leave Request Form";
  }, []);

  return (
    <div className="leave-request-form">
      <form onSubmit={handleSubmit}>
        {/* Leave Type */}
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

        {/* Date Fields */}
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
            <label htmlFor="numLeaveDays">Number of Leave Days</label>
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

        {/* Reason */}
        <div className="form-group">
          <label htmlFor="reason">Reason</label>
          <textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
            placeholder="Please provide a reason for your leave request"
          ></textarea>
        </div>

        {/* Attachment */}
        <div className="form-group">
          <label htmlFor="attachment">Attachment (if any)</label>
          <input
            type="file"
            id="attachment"
            name="attachment"
            onChange={handleChange}
          />
        </div>

        {/* Actions */}
        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="submit-button">
            Submit Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeaveRequestForm;
