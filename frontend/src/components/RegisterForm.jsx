import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiFetch } from "../api/client.js";
import { setToken } from "../utils/token.js";

function RegisterForm() {
    const navigate = useNavigate();

    //ezzel inicializáljuk az input értékeket (ezeket lehetne külön is, form nélkül, akkor az onChange function helyett mindegyiknek külön neve lenne, pl: (e) => setEmail(e.target.value)
    const [form, setForm] = useState({
        email: "",
        username: "",
        password: "",
        role: "USER",
        birthDate: "",
        gender: "MALE",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    //ez a függvény, ami alapján az onChange megtalálja a névhez tartozó adattagokat
    function onChange(e) {
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    }

    //useEffect() akkor kell, ha valamilyen állapotváltozásra akarunk valamit lefuttatni
    async function onSubmit(e) {
        e.preventDefault(); //ez letiltja az alap HTML submitot
        setLoading(true);
        setError("");

        try {
            const data = await apiFetch("/auth/regisztracio", {
                method: "POST",
                body: {
                    email: form.email,
                    username: form.username,
                    password: form.password,
                    role: "USER",
                    birthDate: form.birthDate,
                    gender: form.gender,
                },
            });

            setToken(data.accessToken);
            navigate("/tickets");
        } catch(err) {
            setError(err.message || "Sikertelen regisztráció");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={onSubmit} className="bg-taupe-300 min-w-screen min-h-screen flex flex-col items-center gap-1">
            <h1 className="text-3xl font-medium mt-20">Regisztráció</h1>
            <div>
                <label className="block text-sm mb-1">Email</label>
                <input className="border rounded px-3 py-2 w-60 bg-stone-200" name="email" type="email" value={form.email} onChange={onChange} required/>
            </div>

            <div>
                <label className="block text-sm mb-1">Felhasználónév</label>
                <input className="border rounded px-3 py-2 w-60 bg-stone-200" name="username" value={form.username} onChange={onChange} required/>
            </div>

            <div>
                <label className="block text-sm mb-1">Jelszó</label>
                <input className="border rounded px-3 py-2 w-60 bg-stone-200" name="password" type="password" value={form.password} onChange={onChange} required/>
            </div>

            <div>
                <label className="block text-sm mb-1">Születési dátum</label>
                <input className="border rounded px-3 py-2 w-40 bg-stone-200" name="birthDate" type="date" value={form.birthDate} onChange={onChange} required/>
            </div>

            <div>
                <label className="block text-sm mb-1">Nem</label>
                <select className="w-full border rounded px-3 py-2 bg-stone-200" name="gender" value={form.gender} onChange={onChange}>
                    <option value="MALE">Férfi</option>
                    <option value="FEMALE">Nő</option>
                </select>
            </div>

            <button className="bg-black mt-3 w-35 text-white rounded px-3 py-2 disabled:opacity-50 cursor-pointer hover:scale-105 transition-all" disabled={loading}>{loading ? "Feldolgozás..." : "Regisztráció"}</button>

            <div className="text-sm text-center mt-4 hover:text-gray-600 hover:scale-105 transition-all">
                <span>Van már fiókod? </span>
                <Link className="font-semibold underline" to="/login">Jelentkezz be!</Link>
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}
        </form>
    );
}

export default RegisterForm;
