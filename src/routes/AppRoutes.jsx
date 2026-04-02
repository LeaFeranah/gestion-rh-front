import React from "react";
import { Routes, Route } from "react-router-dom";
//import Societes from "../pages/Societes";
import Login from "../pages/Login";
import Register from "../pages/Register";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import SocietePage from "../components/societe/SocietePage";

export default function AppRoutes() {
  return (
    <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/dashboard" element={<Societes />} /> */}
        <Route path="/dashboard" element={<DashboardPage/>}/>
        <Route path="/societe" element={<SocietePage/>}/>
    </Routes>
  );
}
