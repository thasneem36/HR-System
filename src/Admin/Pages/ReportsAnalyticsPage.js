import React, { useState } from "react";
import AttendanceReports from "../Components/AttendanceReports";
import LeaveReports from "../Components/LeaveReports";
import PerformanceReports from "../Components/PerformanceReports";
import ExportButtons from "../Components/ExportButtons";
import { Dropdown, Button } from "antd";
import '../Components/Report.css'
import Header from "../navBar/Header";

const ReportsAnalyticsPage = () => {
  const [selectedReport, setSelectedReport] = useState("attendance");

  return (
    <div style={{ padding: "20px" }} className="box">
      <Header/>
      <h1>Reports & Analytics</h1>
      <Dropdown
        menu={{
          items: [
            { key: "attendance", label: "Attendance Reports" },
            { key: "leave", label: "Leave Reports" },
            { key: "performance", label: "Performance Reports" },
          ],
          onClick: (e) => setSelectedReport(e.key),
        }}
      >
        <Button>Select Report Type</Button>
      </Dropdown>

      {selectedReport === "attendance" && <AttendanceReports />}
      {selectedReport === "leave" && <LeaveReports />}
      {selectedReport === "performance" && <PerformanceReports />}

      <ExportButtons />
    </div>
  );
};

export default ReportsAnalyticsPage;