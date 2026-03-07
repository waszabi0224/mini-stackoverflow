import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/client.js";
import { setToken } from "../utils/token.js";

function LoginForm() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const onChange = (e) => {
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    }

    async function onSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const data = await apiFetch("/auth/bejelentkezes", {
                method: "POST",
                body: {
                    email: form.email,
                    password: form.password,
                },
            });

            setToken(data.accessToken);
            navigate("/tickets");
        } catch(err) {
            setError(err.message || "Sikertelen bejelentkezés");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-3">
            <div>
                <label className="block text-sm mb-1">Email</label>
                <input className="w-full border rounded px-3 py-2" name="email" type="email" value={form.email} onChange={onChange} required/>
            </div>
            <div>
                <label className="block text-sm mb-1">Jelszó</label>
                <input className="w-full border rounded px-3 py-2" name="password" type="password" value={form.password} onChange={onChange}></input>
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <button className="w-full bg-black text-white rounded px-3 py-2 disabled:opacity-50" disabled={loading}>{loading ? "Feldolgozás..." : "Bejelentkezés"}</button>
        </form>
    );
}

export default LoginForm;
