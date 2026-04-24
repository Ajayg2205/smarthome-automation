import api from "../api";

export default function DeviceCard({ device, onUpdated }) {
    const isOn = device.status === "ON";

    const toggle = async () => {
        try {
            const action = isOn ? "OFF" : "ON";
            await api.post(`/devices/${device.id}/control/`, { action });
            // WebSocket will update the UI automatically
        } catch (err) {
            alert("Control failed: " + err.message);
        }
    };

    return (
        <div style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "20px",
            background: isOn ? "#fffbeb" : "#f9fafb",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            minWidth: "200px"
        }}>
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>
                {device.device_type === "Light" ? "💡" :
                 device.device_type === "Fan"   ? "🌀" :
                 device.device_type === "Lock"  ? "🔒" : "🔌"}
            </div>
            <div style={{ fontWeight: "600", fontSize: "16px" }}>{device.device_name}</div>
            <div style={{ color: "#888", fontSize: "13px", marginBottom: "12px" }}>
                {device.room} · {device.device_type}
            </div>
            <button onClick={toggle} style={{
                padding: "8px 20px",
                borderRadius: "20px",
                border: "none",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "13px",
                background: isOn ? "#f59e0b" : "#6b7280",
                color: "white",
                transition: "all 0.2s"
            }}>
                {isOn ? "● ON" : "○ OFF"}
            </button>
        </div>
    );
}