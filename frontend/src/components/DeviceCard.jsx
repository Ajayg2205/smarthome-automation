import { useState, useEffect } from "react";
import api from "../api/index.js";

export default function DeviceCard({ device }) {
    const [status, setStatus] = useState(device.status);

    useEffect(() => {
        setStatus(device.status);
    }, [device.status]);

    const isOn = status === "ON";

    const toggle = async () => {
        const action = isOn ? "OFF" : "ON";
        setStatus(action);
        try {
            await api.post(`/devices/${device.id}/control/`, { action });
        } catch (err) {
            setStatus(isOn ? "ON" : "OFF");
            console.error("Control failed:", err);
        }
    };

    return (
        <div style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "20px",
            background: isOn ? "#fffbeb" : "#f9fafb",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            minWidth: "200px",
            textAlign: "center"
        }}>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>
                {device.device_type === "Light" ? "💡" :
                 device.device_type === "Fan"   ? "🌀" :
                 device.device_type === "Lock"  ? "🔒" :
                 device.device_type === "AC"    ? "❄️" : "🔌"}
            </div>
            <div style={{ fontWeight: "600", fontSize: "16px" }}>
                {device.device_name}
            </div>
            <div style={{ color: "#888", fontSize: "13px", marginBottom: "14px" }}>
                {device.room} · {device.device_type}
            </div>
            <button onClick={toggle} style={{
                padding: "8px 24px",
                borderRadius: "20px",
                border: "none",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "13px",
                background: isOn ? "#f59e0b" : "#6b7280",
                color: "white"
            }}>
                {isOn ? "● ON" : "○ OFF"}
            </button>
        </div>
    );
}