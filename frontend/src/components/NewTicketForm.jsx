import { useNavigate } from "react-router-dom";
import { getToken } from "../utils/token";
import { useState } from "react";
import { apiFetch } from "../api/client";

function NewTicketForm() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        description: "",
    });

    //const [auth, setAuth] = useState(false);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState();

    function onChange(e) {
        setForm((f) => ({...f, [e.target.name]: e.target.value}));
    }
    
    const auth = true;

    async function onsubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError("");
        
        try {
            const data = await apiFetch("/tickets", {
                method: "POST",
                body: {
                    title: form.title,
                    description: form.description,
                },
                auth,
            });
            if(Error === "TokenExpiredError") {
                navigate("/auth/bejelentkezés");
            }
            navigate("/tickets");
        } catch(err) {
            setError(err.message || "Nem sikerült létrehozni a ticketet.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={onsubmit} className="space-y-3">
            <div>
                <label className="block text-sm mb-1" >Ticket neve</label>
                <input className="w-full border rounded px-3 py-2" name="title" value={form.title} onChange={onChange} required></input>
            </div>

            <div>
                <label className="block text-sm mb-1">Leírás</label>
                <input className="w-full border rounded px-3 py-2" name="description" value={form.description} onChange={onChange} required></input>
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <button className="w-full bg-black text-white rounded px-3 py-2 disabled:opacity-50" disabled={loading}>{loading ? "Feldolgozás..." : "Létrehozás"}</button>
        </form>
    );
}

export default NewTicketForm;
