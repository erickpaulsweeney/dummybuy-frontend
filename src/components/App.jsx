import React from "react";
import { Routes, Route } from "react-router-dom";
import AdDetail from "./AdDetail";
import Home from "./Home";
import Layout from "./Layout";
import Login from "./Login";
import SignUp from "./Signup";

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />}/>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="/ads/:id" element={<AdDetail />} />
            </Route>
        </Routes>
    );
}
