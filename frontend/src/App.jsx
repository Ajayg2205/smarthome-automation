import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Rules from "./pages/Rules.jsx";
import Logs from "./pages/Logs.jsx";

export default function App() {
    const [user, setUser] = useState(() => {
        const name = localStorage.getItem("name");
        const role = localStorage.getItem("role");
        return name ? { name, role } : null;
    });

    if (!user) {
        return <Login onLogin={(data) => setUser(data)} />;
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/"       element={<Dashboard user={user} onLogout={() => setUser(null)} />} />
                <Route path="/rules"  element={<Rules user={user} onLogout={() => setUser(null)} />} />
                <Route path="/logs"   element={<Logs  user={user} onLogout={() => setUser(null)} />} />
                <Route path="*"       element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}