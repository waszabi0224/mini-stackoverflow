import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import { Navigate, useNavigate, useParams } from "react-router-dom";

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
                const data = apiFetch(`/tickets/${id}`, {
                    method: "GET",
                });
                setForm({
                    title: data.title,
                    description: data.description,
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
        navigate("/profile");
        } catch(err) {
            setError(err.message || "Nem módosíthatod ezt a ticketet.");
        } finally {
            setLoading(false);
        }
    }

    if(error) return <div className="text-sm text-red-600">{error}</div>;

    return (
        <form onSubmit={onSubmit} className="space-y-3">
            <div>
                <label className="block text-sm mb-1">Ticket neve</label>
                <input className="w-full border rounded px-3 py-2" name="title" value={form.title ?? ""} onChange={onChange}></input>
            </div>

            <div>
                <label className="block text-sm mb-1">Leírás</label>
                <input className="w-full border rounded px-3 py-2" name="description" value={form.description ?? ""} onChange={onChange}></input>
            </div>

            <button className="w-full bg-black text-white rounded px-3 py-2 disabled:opacity-50" disabled={loading}>{loading ? "Feldolgozás..." : "Módosítás"}</button>
        </form>
    );
}

export default TicketUpdateForm;
