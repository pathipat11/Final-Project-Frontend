// auth/login/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch("/api/v1/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        if (res.ok) {
            const { token } = await res.json();
            localStorage.setItem("token", token); // Store token in local storage
            router.push("/"); // Redirect to home page
        } else {
            const { message } = await res.json();
            setError(message);
        }
    };

    return (
        <div>
            <h1>Login</h1>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}
