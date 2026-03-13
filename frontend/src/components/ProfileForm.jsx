import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/client";

function ProfileForm() {
    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);

    const [tickets, setTickets] = useState([]);

    const {id} = useParams();


    async function loadingTickets() {
        setLoading(true);
        setError("");

        try {
            const data = await apiFetch(`/tickets/me`, {
                method: "GET",
                auth: true,
            });
            const list = data.tickets;
            setTickets(list);
        } catch(err) {
            setError(err.message || "Nem sikerült betölteni a ticketeket.");
        } finally {
            setLoading(false);
        }
    };

    async function deleteTicket(id) {
        setLoading(true);
        setError("");

        const confirmation = confirm("Biztosan törölni akarod ezt a ticketet?");
        if(confirmation) {
            try {
            const data = await apiFetch(`/tickets/${id}`, {
                method: "DELETE",
                auth: true,
            });
            loadingTickets();
            } catch(err) {
                setError(err.message || "Nem sikerült törölni a ticketet.");
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        loadingTickets();
    },[id]);

    if(loading) return <div className="p-4">Betöltés...</div>;
    if(error) return <div className="text-red-600">{error}</div>;

    return (
        <div>
            <ul className="space-y-3">
                {tickets.map((t) => (
                    <li key={t.id} className="border rounded p-3 bg-white">
                        <div className="text-sm">{t.owner.username}</div>
                        <div className="font-semibold">{t.title}</div>
                        <div className="text-sm text-gray-600">{t.description}</div>

                        <div className="mt-2">
                            <Link className="underline text-sm" to={`/tickets/${t.id}/edit`}>Módosítás</Link>
                        </div>

                        <button onClick={() => deleteTicket(t.id)} className="underline text-sm mt-2">Törlés</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ProfileForm;
