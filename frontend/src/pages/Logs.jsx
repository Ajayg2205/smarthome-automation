import { useState, useEffect } from "react";
import api from "../api/index.js";
import Navbar from "../components/Navbar.jsx";

export default function Logs({ user, onLogout }) {
    const [logs,    setLogs]    = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter,  setFilter]  = useState("all");

    useEffect(() => {
        api.get("/logs/")
           .then(res => setLogs(res.data))
           .finally(() => setLoading(false));
    }, []);

    const sourceColor = {
        api:        { bg: "#dbeafe", color: "#1d4ed8" },
        mqtt:       { bg: "#dcfce7", color: "#166534" },
        automation: { bg: "#fef3c7", color: "#92400e" },
    };

    const filtered = filter === "all" ? logs : logs.filter(l => l.source === filter);

    return (
        <div style={{ minHeight: "100vh", background: "#f3f4f6" }}>
            <Navbar user={user} onLogout={onLogout} />
            <div style={{ padding: "32px" }}>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                    <div>
                        <h2 style={{ margin: 0 }}>Activity Log</h2>
                        <p style={{ margin: "4px 0 0", color: "#888", fontSize: "14px" }}>
                            All device actions — {logs.length} total entries
                        </p>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                        {["all", "api", "mqtt", "automation"].map(f => (
                            <button key={f} onClick={() => setFilter(f)} style={{
                                padding: "6px 14px", borderRadius: "20px", border: "none",
                                cursor: "pointer", fontSize: "13px", fontWeight: "500",
                                background: filter === f ? "#667eea" : "#e5e7eb",
                                color: filter === f ? "white" : "#374151"
                            }}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
                        ))}
                    </div>
                </div>

                {loading ? <p style={{ color: "#888" }}>Loading logs...</p> : (
                    <div style={{
                        background: "white", borderRadius: "12px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflow: "hidden"
                    }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                                    {["Device", "Action", "Source", "User", "Time"].map(h => (
                                        <th key={h} style={{
                                            padding: "12px 16px", textAlign: "left",
                                            fontSize: "13px", fontWeight: "600", color: "#374151"
                                        }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr><td colSpan={5} style={{ padding: "32px", textAlign: "center", color: "#888" }}>No logs found.</td></tr>
                                ) : filtered.map(log => (
                                    <tr key={log.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                                        <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "500" }}>
                                            {log.device_name}
                                        </td>
                                        <td style={{ padding: "12px 16px" }}>
                                            <span style={{
                                                padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600",
                                                background: log.action === "ON" ? "#dcfce7" : "#fee2e2",
                                                color: log.action === "ON" ? "#166534" : "#dc2626"
                                            }}>{log.action}</span>
                                        </td>
                                        <td style={{ padding: "12px 16px" }}>
                                            <span style={{
                                                padding: "3px 10px", borderRadius: "20px", fontSize: "12px",
                                                ...(sourceColor[log.source] || { bg: "#f3f4f6", color: "#374151" }),
                                                background: sourceColor[log.source]?.bg
                                            }}>{log.source}</span>
                                        </td>
                                        <td style={{ padding: "12px 16px", fontSize: "13px", color: "#888" }}>
                                            {log.user_name || "—"}
                                        </td>
                                        <td style={{ padding: "12px 16px", fontSize: "13px", color: "#888" }}>
                                            {new Date(log.timestamp).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}