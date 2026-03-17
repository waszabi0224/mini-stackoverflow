import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/client";

function ProfileForm() {
    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);

    const [tickets, setTickets] = useState([]);

    const {id} = useParams();

    const navigate = useNavigate();

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
        const confirmation = confirm("Biztosan törölni akarod ezt a ticketet?");
        if(confirmation) {
            setLoading(true);
            setError("");

            try {
            const data = await apiFetch(`/tickets/${id}`, {
                method: "DELETE",
                auth: true,
            });
            loadingTickets();
            navigate("/profil");
            } catch(err) {
                setError(err.message || "Nem sikerült törölni a ticketet.");
            } finally {
                setLoading(false);
            }
        }
        else {
            loadingTickets();
        }
    }

    useEffect(() => {
        loadingTickets();
    },[id]);

    return (
        <div className="bg-taupe-300 min-w-screen min-h-screen flex flex-col items-center">
            <div className="border-x">
                <h1 className="text-3xl font-medium mt-5 mx-20">Ticketjeim</h1>
                <div className="">
                    <ul className="space-y-5 m-7 mx-20 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {tickets.map((t) => (
                            <li key={t.id} className="flex flex-col border rounded bg-slate-200 max-w-130">
                                <div className="flex flex-col">
                                    <div className="text-xl font-semibold text-left p-3 max-h-25 line-clamp-3">{t.title}</div>
                                    <div className="text-md text-gray-700 text-left px-3 max-h-20 line-clamp-3">{t.description}</div>
                                </div>
                                                
                                <div className="flex flex-col items-start text-sm m-3 underline">
                                    <Link to={`/tickets/${t.id}/edit`}>Módosítás</Link>
                                    <button onClick={() => deleteTicket(t.id)}>Törlés</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {loading && <div className="p-4">Betöltés...</div>}
            {error && <div className="text-red-600">{error}</div>}
            {tickets.length === 0 && <div className="text-red-600">Nincsenek tickejeid.</div>}
        </div>
    );
}

export default ProfileForm;
