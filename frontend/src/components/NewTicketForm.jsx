import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { apiFetch } from "../api/client";

function NewTicketForm() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        description: "",
    });

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState();

    function onChange(e) {
        setForm((f) => ({...f, [e.target.name]: e.target.value}));
    }
    
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
                auth: true,
            });
            navigate("/tickets");
        } catch(err) {
            setError(err.message || "Nem sikerült létrehozni a ticketet.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={onsubmit} className="bg-taupe-300 min-w-screen min-h-screen flex flex-col items-center gap-1">
            <h1 className="text-3xl font-medium mt-20">Új ticket</h1>
            <div>
                <label className="block text-sm mb-1" >Ticket neve</label>
                <textarea className="border rounded px-3 py-2 w-80 bg-stone-200 resize-none overflow-hidden" name="title" value={form.title} onChange={onChange} rows={2} onInput={(e) => {e.target.style.height = "auto"; e.target.style.height = e.target.scrollHeight + "px";}} required></textarea>
            </div>

            <div>
                <label className="block text-sm mb-1">Leírás</label>
                <textarea className="border rounded px-3 py-2 w-90 bg-stone-200 resize-none overflow-hidden" name="description" value={form.description} onChange={onChange} rows={2} onInput={(e) => {e.target.style.height = "auto"; e.target.style.height = e.target.scrollHeight + "px";}} required></textarea>
            </div>

            <button className="bg-black mt-3 w-35 text-white rounded px-3 py-2 disabled:opacity-50 cursor-pointer hover:scale-105 transition-all" disabled={loading}>{loading ? "Feldolgozás..." : "Létrehozás"}</button>
        
            {error && <div className="text-sm text-red-600">{error}</div>}
        </form>
    );
}

export default NewTicketForm;
