import { useState, useEffect } from "react";
import api from "../api/index.js";
import Navbar from "../components/Navbar.jsx";

export default function Rules({ user, onLogout }) {
    const [rules,   setRules]   = useState([]);
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        name: "", trigger_type: "time", trigger_value: "07:00",
        action_device: "", action: "ON", is_active: true
    });

    useEffect(() => {
        Promise.all([api.get("/automation/rules/"), api.get("/devices/")])
            .then(([rRes, dRes]) => {
                setRules(rRes.data);
                setDevices(dRes.data);
                if (dRes.data.length > 0) setForm(f => ({ ...f, action_device: dRes.data[0].id }));
            })
            .finally(() => setLoading(false));
    }, []);

    const addRule = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/automation/rules/", form);
            setRules(prev => [...prev, res.data]);
            setShowForm(false);
        } catch { alert("Failed to add rule"); }
    };

    const deleteRule = async (id) => {
        if (!confirm("Delete this rule?")) return;
        await api.delete(`/automation/rules/${id}/`);
        setRules(prev => prev.filter(r => r.id !== id));
    };

    const toggleRule = async (rule) => {
        const res = await api.patch(`/automation/rules/${rule.id}/`, { is_active: !rule.is_active });
        setRules(prev => prev.map(r => r.id === rule.id ? res.data : r));
    };

    const inputStyle = {
        width: "100%", padding: "8px 12px", border: "1px solid #ddd",
        borderRadius: "8px", fontSize: "14px", boxSizing: "border-box"
    };

    return (
        <div style={{ minHeight: "100vh", background: "#f3f4f6" }}>
            <Navbar user={user} onLogout={onLogout} />
            <div style={{ padding: "32px" }}>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                    <div>
                        <h2 style={{ margin: 0 }}>Automation Rules</h2>
                        <p style={{ margin: "4px 0 0", color: "#888", fontSize: "14px" }}>
                            Rules run automatically every minute
                        </p>
                    </div>
                    <button onClick={() => setShowForm(!showForm)} style={{
                        background: "#667eea", color: "white", border: "none",
                        borderRadius: "8px", padding: "10px 20px",
                        cursor: "pointer", fontWeight: "600"
                    }}>
                        {showForm ? "✕ Cancel" : "+ Add Rule"}
                    </button>
                </div>

                {/* Add Rule Form */}
                {showForm && (
                    <div style={{
                        background: "white", borderRadius: "12px", padding: "24px",
                        marginBottom: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
                    }}>
                        <h3 style={{ margin: "0 0 16px" }}>New Automation Rule</h3>
                        <form onSubmit={addRule}>
                            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "12px" }}>
                                <div style={{ flex: 2, minWidth: "160px" }}>
                                    <label style={{ fontSize: "13px", fontWeight: "500", display: "block", marginBottom: "4px" }}>Rule Name</label>
                                    <input style={inputStyle} placeholder="e.g. Morning Lights"
                                        value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                                </div>
                                <div style={{ flex: 1, minWidth: "130px" }}>
                                    <label style={{ fontSize: "13px", fontWeight: "500", display: "block", marginBottom: "4px" }}>Trigger Type</label>
                                    <select style={inputStyle} value={form.trigger_type}
                                        onChange={e => setForm({...form, trigger_type: e.target.value})}>
                                        <option value="time">Time</option>
                                        <option value="device_state">Device State</option>
                                    </select>
                                </div>
                                <div style={{ flex: 1, minWidth: "130px" }}>
                                    <label style={{ fontSize: "13px", fontWeight: "500", display: "block", marginBottom: "4px" }}>
                                        {form.trigger_type === "time" ? "Time (HH:MM)" : "device_id:status"}
                                    </label>
                                    <input style={inputStyle}
                                        placeholder={form.trigger_type === "time" ? "07:30" : "1:ON"}
                                        value={form.trigger_value}
                                        onChange={e => setForm({...form, trigger_value: e.target.value})} required />
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                                <div style={{ flex: 2, minWidth: "160px" }}>
                                    <label style={{ fontSize: "13px", fontWeight: "500", display: "block", marginBottom: "4px" }}>Device to Control</label>
                                    <select style={inputStyle} value={form.action_device}
                                        onChange={e => setForm({...form, action_device: e.target.value})}>
                                        {devices.map(d => <option key={d.id} value={d.id}>{d.device_name}</option>)}
                                    </select>
                                </div>
                                <div style={{ flex: 1, minWidth: "100px" }}>
                                    <label style={{ fontSize: "13px", fontWeight: "500", display: "block", marginBottom: "4px" }}>Action</label>
                                    <select style={inputStyle} value={form.action}
                                        onChange={e => setForm({...form, action: e.target.value})}>
                                        <option value="ON">Turn ON</option>
                                        <option value="OFF">Turn OFF</option>
                                    </select>
                                </div>
                                <div style={{ display: "flex", alignItems: "flex-end" }}>
                                    <button type="submit" style={{
                                        background: "#667eea", color: "white", border: "none",
                                        borderRadius: "8px", padding: "9px 24px",
                                        cursor: "pointer", fontWeight: "600"
                                    }}>Save Rule</button>
                                </div>
                            </div>
                        </form>
                    </div>
                )}

                {/* Rules List */}
                {loading ? <p style={{ color: "#888" }}>Loading rules...</p> : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {rules.length === 0 && (
                            <div style={{
                                background: "white", borderRadius: "12px", padding: "32px",
                                textAlign: "center", color: "#888"
                            }}>No rules yet. Click "+ Add Rule" to create one.</div>
                        )}
                        {rules.map(rule => (
                            <div key={rule.id} style={{
                                background: "white", borderRadius: "12px", padding: "20px",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                opacity: rule.is_active ? 1 : 0.6
                            }}>
                                <div>
                                    <div style={{ fontWeight: "600", fontSize: "15px", marginBottom: "4px" }}>
                                        {rule.is_active ? "🟢" : "⚫"} {rule.name}
                                    </div>
                                    <div style={{ fontSize: "13px", color: "#888" }}>
                                        {rule.trigger_type === "time" ? `⏰ At ${rule.trigger_value}` : `🔌 When device ${rule.trigger_value}`}
                                        {" → "}
                                        <strong>{rule.device_name}</strong> turns <strong>{rule.action}</strong>
                                    </div>
                                    {rule.last_triggered && (
                                        <div style={{ fontSize: "12px", color: "#aaa", marginTop: "2px" }}>
                                            Last triggered: {new Date(rule.last_triggered).toLocaleString()}
                                        </div>
                                    )}
                                </div>
                                <div style={{ display: "flex", gap: "8px" }}>
                                    <button onClick={() => toggleRule(rule)} style={{
                                        background: rule.is_active ? "#fef3c7" : "#dcfce7",
                                        color: rule.is_active ? "#92400e" : "#166534",
                                        border: "none", borderRadius: "8px",
                                        padding: "6px 14px", cursor: "pointer", fontSize: "13px"
                                    }}>
                                        {rule.is_active ? "Disable" : "Enable"}
                                    </button>
                                    <button onClick={() => deleteRule(rule.id)} style={{
                                        background: "#fee2e2", color: "#dc2626",
                                        border: "none", borderRadius: "8px",
                                        padding: "6px 14px", cursor: "pointer", fontSize: "13px"
                                    }}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}