import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import { Link } from "react-router-dom";

function HomeForm() {
    const [tickets, setTickets] = useState([]);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    useEffect(() => {
        async function loadTickets() {
            setLoading(true);
            setError("");

            try {
                const data = await apiFetch("/tickets", {
                    method: "GET",
                });
                const list = data.tickets;
                setTickets(list);
            } catch(err) {
                setError(err.message || "Nem sikerült betölteni a ticketeket.");
            } finally {
                setLoading(false);
            }
        };
        loadTickets();
    }, []);

    if(loading) return <div className="p-4">Betöltés...</div>;
    if(error) return <div className="p-4 text-red-600">{error}</div>;

    return (
        <div>
            <ul className="space-y-3">
                {tickets.map((t) => (
                    <li key={t.id} className="border rounded p-3 bg-white">
                        <div className="text-sm">{t.owner.username}</div>
                        <div className="font-semibold">{t.title}</div>
                        <div className="text-sm text-gray-600">{t.description}</div>

                        <div className="mt-2">
                            <Link className="underline text-sm" to={`/tickets/${t.id}`}>Részletek</Link>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default HomeForm;
