import { useState } from "react";
import api from "../api";

export default function Login({ onLogin }) {
    const [email,    setEmail]    = useState("");
    const [password, setPassword] = useState("");
    const [error,    setError]    = useState("");
    const [loading,  setLoading]  = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await api.post("/auth/login/", { email, password });
            localStorage.setItem("access",  res.data.access);
            localStorage.setItem("refresh", res.data.refresh);
            localStorage.setItem("role",    res.data.role);
            localStorage.setItem("name",    res.data.name);
            onLogin(res.data);
        } catch {
            setError("Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: "100vh", display: "flex",
            alignItems: "center", justifyContent: "center",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        }}>
            <div style={{
                background: "white", borderRadius: "16px",
                padding: "40px", width: "100%", maxWidth: "380px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.2)"
            }}>
                <div style={{ textAlign: "center", marginBottom: "32px" }}>
                    <div style={{ fontSize: "40px" }}>🏠</div>
                    <h2 style={{ margin: "8px 0 4px", fontSize: "24px" }}>Smart Home</h2>
                    <p style={{ color: "#888", margin: 0, fontSize: "14px" }}>Sign in to your dashboard</p>
                </div>

                {error && (
                    <div style={{
                        background: "#fee2e2", color: "#dc2626",
                        padding: "10px 14px", borderRadius: "8px",
                        marginBottom: "16px", fontSize: "14px"
                    }}>{error}</div>
                )}

                <form onSubmit={submit}>
                    <div style={{ marginBottom: "16px" }}>
                        <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
                            Email
                        </label>
                        <input
                            type="email" value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            style={{
                                width: "100%", padding: "10px 14px",
                                border: "1px solid #ddd", borderRadius: "8px",
                                fontSize: "14px", boxSizing: "border-box"
                            }}
                            placeholder="admin@test.com"
                        />
                    </div>

                    <div style={{ marginBottom: "24px" }}>
                        <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>
                            Password
                        </label>
                        <input
                            type="password" value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            style={{
                                width: "100%", padding: "10px 14px",
                                border: "1px solid #ddd", borderRadius: "8px",
                                fontSize: "14px", boxSizing: "border-box"
                            }}
                            placeholder="••••••"
                        />
                    </div>

                    <button type="submit" disabled={loading} style={{
                        width: "100%", padding: "12px",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "white", border: "none", borderRadius: "8px",
                        fontSize: "15px", fontWeight: "600", cursor: "pointer"
                    }}>
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>
            </div>
        </div>
    );
}