import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import { useNavigate, useParams } from "react-router-dom";

function TicketUpdateForm() {
    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        title: "",
        description: "",
    });

    const navigate = useNavigate();

    const { id } = useParams();

    function onChange(e) {
        setForm((f) => ({...f, [e.target.name]: e.target.value}));
    }

    useEffect(() => {
        async function loadTicket() {
            setLoading(true);
            setError("");

            try {
                const data = await apiFetch(`/tickets/${id}`, {
                    method: "GET",
                });
                setForm({
                    title: data.ticket.title ?? "",
                    description: data.ticket.description ?? "",
                });
            } catch(err) {
                setError(err.message || "Nem sikerült betölteni a ticketet.");
            } finally {
                setLoading(false);
            }
        }
        loadTicket();
    }, [id]);


    async function onSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const data = await apiFetch(`/tickets/${id}`, {
                method: "PATCH",
                body: {
                    title: form.title,
                    description: form.description,
                },
                auth: true,
        });
        setForm(data.ticket);
        navigate("/profil");
        } catch(err) {
            setError(err.message || "Nem módosíthatod ezt a ticketet.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={onSubmit} className="bg-taupe-300 min-w-screen min-h-screen flex flex-col items-center gap-1">
            <h1 className="text-3xl font-medium mt-20">Ticket módosítása</h1>
            <div>
                <label className="block text-sm mb-1">Ticket neve</label>
                <textarea className="border rounded px-3 py-2 w-130 bg-stone-200 resize-none overflow-hidden" name="title" value={form.title ?? ""} onChange={onChange} onInput={(e) => {e.target.style.height = "auto"; e.target.style.height = e.target.scrollHeight + "px";}}></textarea>
            </div>

            <div>
                <label className="block text-sm mb-1">Leírás</label>
                <textarea className="border rounded px-3 py-2 w-130 bg-stone-200 resize-none overflow-hidden" name="description" value={form.description ?? ""} onChange={onChange} onInput={(e) => {e.target.style.height = "auto"; e.target.style.height = e.target.scrollHeight + "px";}}></textarea>
            </div>

            <button className="bg-black mt-3 w-35 text-white rounded px-3 py-2 disabled:opacity-50 cursor-pointer hover:scale-105 transition-all" disabled={loading}>{loading ? "Feldolgozás..." : "Módosítás"}</button>

            {error && <div className="text-sm text-red-600">{error}</div>}
        </form>
    );
}

export default TicketUpdateForm;
