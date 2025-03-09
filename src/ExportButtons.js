import React from "react";
import { Button } from "antd";

const ExportButtons = () => {
  return (
    <div style={{ marginTop: "20px" }}>
      <Button>Export as Excel</Button>
      <Button style={{ marginLeft: "10px" }}>Export as PDF</Button>
      <Button style={{ marginLeft: "10px" }}>Export as CSV</Button>
    </div>
  );
};

export default ExportButtons;