/* eslint-disable @typescript-eslint/no-unused-vars */
// auth/register/page.tsx
"use client";
import { useState } from "react";

export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch("/api/v1/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });
    
        if (res.ok) {
            const { token } = await res.json();
            // Store the token in a cookie or local storage
            document.cookie = `token=${token}; path=/`;
            // Redirect user or update UI accordingly
        } else {
            // Handle error
        }
    };
    

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                <button type="submit">Register</button>
            </form>
        </div>
    );
}
