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

    return (
        <div className="flex justify-center items-start min-w-screen min-h-screen bg-taupe-300">
            <div className="border-x">
                <ul className="space-y-5 m-7 mx-20">
                    <h1 className="text-3xl font-semibold">Legújabb kérdések</h1>
                    {tickets.map((t) => (
                        <li key={t.id} className="border rounded-md bg-slate-200 w-130">
                            <div className="flex flex-col">
                                <div className="text-xl font-semibold text-left p-3 max-h-25 line-clamp-3">{t.title}</div>
                                <div className="text-md text-gray-700 text-left px-3 max-h-20 line-clamp-3">{t.description}</div>
                            </div>

                            <div className="flex justify-end items-end gap-2 text-sm text-gray-500 mt-4 mr-3">
                                <div className="">{t.owner.username}</div>
                                <div className="">{new Date(t.createdAt).toISOString().split("T")[0]}</div>
                            </div>
                        
                            <div className="flex justify-start items-start ml-6 mb-3">
                                <Link className="underline text-md" to={`/tickets/${t.id}`}>Részletek</Link>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {loading && <div className="p-4">Betöltés...</div>}
            {error && <div className="p-4 text-red-600">{error}</div>}
        </div>
    );
}

export default HomeForm;
