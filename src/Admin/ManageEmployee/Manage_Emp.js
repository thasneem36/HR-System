import React from "react";
import style from "./Manage_Emp.css";
import Header from "../navBar/Header";

function nav(){
  return (
    <div className="mainbox">
      <Header/>
    <div className="box1">
    <button>Search</button>
    <button>Edit</button>
    <button>Add</button>
    </div>

    <div className="box2">
    <ul className="boxui">
      <li>ID</li>
      <li>Name</li>
      <li>Department</li>
      <li>Job Title</li>
      <li>Action</li>
    </ul>

    </div>



    </div>
  )
}

export default nav;