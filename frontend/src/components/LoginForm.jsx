import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiFetch } from "../api/client.js";
import { setToken } from "../utils/token.js";
import { useSearchParams } from "react-router-dom";

function LoginForm() {
    const navigate = useNavigate();

    const [params] = useSearchParams();

    const msg = params.get("msg");

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
            setError(err.message || "Sikertelen bejelentkezés.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={onSubmit} className="bg-taupe-300 min-w-screen min-h-screen flex flex-col items-center gap-1">
            <h1 className="text-3xl font-medium mt-20">Bejelentkezés</h1>
            <div>
                <label className="block text-sm mb-1">Email</label>
                <input className="border rounded px-3 py-2 w-60 bg-stone-200" name="email" type="email" value={form.email} onChange={onChange} required/>
            </div>
            <div>
                <label className="block text-sm mb-1">Jelszó</label>
                <input className="border rounded px-3 py-2 w-60 bg-stone-200" name="password" type="password" value={form.password} onChange={onChange}></input>
            </div>

            <button className="bg-black mt-3 w-35 text-white rounded px-3 py-2 disabled:opacity-50 cursor-pointer hover:scale-105 transition-all" disabled={loading}>{loading ? "Feldolgozás..." : "Bejelentkezés"}</button>

            <div className="text-sm text-center mt-4 hover:text-gray-600 hover:scale-105 transition-all">
                <span>Nincs még fiókod? </span>
                <Link className="font-semibold underline" to="/register">Regisztrálj!</Link>
            </div>

            {msg && <div className="text-sm text-red-600">{msg}</div>};
            {error && <div className="text-red-600 text-sm">{error}</div>}
        </form>
    );
}

export default LoginForm;
