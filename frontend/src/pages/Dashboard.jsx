import { useState, useEffect } from "react";
import api from "../api/index.js";
import DeviceCard from "../components/DeviceCard.jsx";
import Navbar from "../components/Navbar.jsx";
import { useWebSocket } from "../hooks/useWebSocket.js";

export default function Dashboard({ user, onLogout }) {
    const [devices,      setDevices]      = useState([]);
    const [rooms,        setRooms]        = useState([]);
    const [notification, setNotification] = useState("");
    const [loading,      setLoading]      = useState(true);
    const [showForm,     setShowForm]     = useState(false);
    const [newDevice,    setNewDevice]    = useState({ device_name: "", device_type: "Light", room: "" });

    useEffect(() => {
        Promise.all([api.get("/devices/"), api.get("/rooms/")])
            .then(([devRes, roomRes]) => {
                setDevices(devRes.data);
                setRooms(roomRes.data);
                if (roomRes.data.length > 0) {
                    setNewDevice(d => ({ ...d, room: roomRes.data[0].id }));
                }
            })
            .finally(() => setLoading(false));
    }, []);

    useWebSocket({
        onDeviceUpdate: (updated) => {
            setDevices(prev => prev.map(d => d.id === updated.id ? updated : d));
        },
        onRuleTriggered: (msg) => {
            setNotification(`⚡ Rule "${msg.rule}" turned ${msg.device} ${msg.action}`);
            setTimeout(() => setNotification(""), 4000);
        }
    });

    const addDevice = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/devices/", newDevice);
            setDevices(prev => [...prev, res.data]);
            setShowForm(false);
            setNewDevice({ device_name: "", device_type: "Light", room: rooms[0]?.id });
        } catch (err) {
            alert("Failed to add device");
        }
    };

    const inputStyle = {
        width: "100%", padding: "8px 12px", border: "1px solid #ddd",
        borderRadius: "8px", fontSize: "14px", boxSizing: "border-box"
    };

    return (
        <div style={{ minHeight: "100vh", background: "#f3f4f6" }}>
            <Navbar user={user} onLogout={onLogout} />

            {notification && (
                <div style={{
                    background: "#fef3c7", borderLeft: "4px solid #f59e0b",
                    padding: "12px 32px", fontSize: "14px", color: "#92400e"
                }}>{notification}</div>
            )}

            <div style={{ padding: "32px" }}>
                {/* Header row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: "20px" }}>All Devices</h2>
                        <p style={{ margin: "4px 0 0", color: "#888", fontSize: "14px" }}>
                            {devices.filter(d => d.status === "ON").length} of {devices.length} devices ON · Updates in real-time
                        </p>
                    </div>
                    <button onClick={() => setShowForm(!showForm)} style={{
                        background: "#667eea", color: "white", border: "none",
                        borderRadius: "8px", padding: "10px 20px",
                        cursor: "pointer", fontWeight: "600", fontSize: "14px"
                    }}>
                        {showForm ? "✕ Cancel" : "+ Add Device"}
                    </button>
                </div>

                {/* Add Device Form */}
                {showForm && (
                    <div style={{
                        background: "white", borderRadius: "12px", padding: "24px",
                        marginBottom: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
                    }}>
                        <h3 style={{ margin: "0 0 16px", fontSize: "16px" }}>Add New Device</h3>
                        <form onSubmit={addDevice}>
                            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                                <div style={{ flex: 1, minWidth: "150px" }}>
                                    <label style={{ fontSize: "13px", fontWeight: "500", display: "block", marginBottom: "4px" }}>Device Name</label>
                                    <input
                                        style={inputStyle}
                                        placeholder="e.g. Bedroom Light"
                                        value={newDevice.device_name}
                                        onChange={e => setNewDevice({...newDevice, device_name: e.target.value})}
                                        required
                                    />
                                </div>
                                <div style={{ flex: 1, minWidth: "130px" }}>
                                    <label style={{ fontSize: "13px", fontWeight: "500", display: "block", marginBottom: "4px" }}>Type</label>
                                    <select style={inputStyle} value={newDevice.device_type}
                                        onChange={e => setNewDevice({...newDevice, device_type: e.target.value})}>
                                        <option>Light</option>
                                        <option>Fan</option>
                                        <option>AC</option>
                                        <option>Lock</option>
                                        <option>Sensor</option>
                                    </select>
                                </div>
                                <div style={{ flex: 1, minWidth: "130px" }}>
                                    <label style={{ fontSize: "13px", fontWeight: "500", display: "block", marginBottom: "4px" }}>Room</label>
                                    <select style={inputStyle} value={newDevice.room}
                                        onChange={e => setNewDevice({...newDevice, room: e.target.value})}>
                                        {rooms.map(r => <option key={r.id} value={r.id}>{r.room_name}</option>)}
                                    </select>
                                </div>
                                <div style={{ display: "flex", alignItems: "flex-end" }}>
                                    <button type="submit" style={{
                                        background: "#667eea", color: "white", border: "none",
                                        borderRadius: "8px", padding: "9px 24px",
                                        cursor: "pointer", fontWeight: "600", fontSize: "14px"
                                    }}>Add</button>
                                </div>
                            </div>
                        </form>
                    </div>
                )}

                {/* Device Grid */}
                {loading ? (
                    <p style={{ color: "#888" }}>Loading devices...</p>
                ) : (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                        {devices.map(device => (
                            <DeviceCard key={device.id} device={device} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}