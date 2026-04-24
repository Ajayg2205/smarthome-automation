import { useEffect, useRef } from "react";

export function useWebSocket({ onDeviceUpdate, onRuleTriggered }) {
    const ws = useRef(null);

    useEffect(() => {
        ws.current = new WebSocket("ws://localhost:8000/ws/devices/");

        ws.current.onopen = () => {
            console.log("[WS] Connected");
        };

        ws.current.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            if (msg.type === "device_update")  onDeviceUpdate?.(msg.device);
            if (msg.type === "rule_triggered") onRuleTriggered?.(msg);
        };

        ws.current.onclose = () => {
            console.log("[WS] Disconnected");
        };

        return () => ws.current?.close();
    }, []);
}