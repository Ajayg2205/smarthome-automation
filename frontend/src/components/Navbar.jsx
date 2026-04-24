import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
    const navigate  = useNavigate();
    const location  = useLocation();
    const activePath = location.pathname;

    const navBtn = (label, path) => (
        <button onClick={() => navigate(path)} style={{
            background: activePath === path ? "rgba(255,255,255,0.25)" : "transparent",
            color: "white",
            border: activePath === path ? "1px solid rgba(255,255,255,0.4)" : "1px solid transparent",
            borderRadius: "8px",
            padding: "6px 16px",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: "500"
        }}>{label}</button>
    );

    return (
        <div style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            padding: "14px 32px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                <span style={{ color: "white", fontSize: "18px", fontWeight: "600" }}>
                    🏠 Smart Home
                </span>
                <div style={{ display: "flex", gap: "8px" }}>
                    {navBtn("Dashboard", "/")}
                    {navBtn("Rules",     "/rules")}
                    {navBtn("Logs",      "/logs")}
                </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "14px" }}>
                    👤 {user.name}
                </span>
                <button onClick={onLogout} style={{
                    background: "rgba(255,255,255,0.15)",
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.3)",
                    borderRadius: "8px",
                    padding: "6px 16px",
                    cursor: "pointer",
                    fontSize: "13px"
                }}>Logout</button>
            </div>
        </div>
    );
}