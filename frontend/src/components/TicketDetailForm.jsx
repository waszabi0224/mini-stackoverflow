import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import { useNavigate, useParams } from "react-router-dom";
import CommentForm from "./CommentForm";
import CommentUpdateForm from "./CommentUpdateForm.jsx";
import { getToken } from "../utils/token.js";

function TicketDetailForm() {
    const [ticket, setTicket] = useState();

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");
    
    const { id } = useParams();

    const [comments, setComments] = useState([]);

    const [userId, setUserId] = useState();

    const [role, setRole] = useState();

    const token = getToken();

    const navigate = useNavigate();

    useEffect(() => {
        if(token) {
            async function addUser() {
                setLoading(true);
                setError("");

                try {
                    const user = await apiFetch("/auth/profil", {
                        method: "GET",
                        auth: true,
                    });
                    setUserId(user.id);
                    setRole(user.role);
                } catch(err) {
                    setError(err.message || "Nem sikerült módosítani a kommentet.");
                } finally {
                    setLoading(false);
                }
            }
            addUser();
        } else {
            return;
        }
    }, [token]);
    
    async function loadingComments() {
            setLoading(true);
            setError("");

            try {
                const data = await apiFetch(`/comments/${id}`, {
                    method: "GET",
                });
                const list = data.comments;
                setComments(list);
            } catch(err) {
                setError(err.message || "Nincs még hozzászólás.");
            } finally {
                setLoading(false);
            }
        }

        async function deleteComment(commentId) {
            setLoading(true);
            setError("");

            const confirmation = confirm("Biztosan törölni akarod ezt a kommentet?");
            if(confirmation) {
                try {
                    const data = await apiFetch(`/comments/${commentId}`, {
                        method: "DELETE",
                        auth: true,
                    });
                    loadingComments();
                } catch(err) {
                    setError(err.message || "Nem sikerült módosítani a kommentet.");
                } finally {
                    setLoading(false);
                }
            }
            else {
                loadingComments();
            }
        }

    useEffect(() => {
        async function loadingTicketsDetail() {
            setLoading(true);
            setError("");

            try {
                const data = await apiFetch(`/tickets/${id}`, {
                    method: "GET",
                });
                setTicket(data.ticket);
            } catch(err) {
                setError(err.message || "Nem sikerült a betöltés");
            } finally {
                setLoading(false);
            }
        }

        loadingTicketsDetail();
        loadingComments();
    }, [id]);

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
                navigate("/tickets");

                } catch(err) {
                    setError(err.message || "Nem sikerült törölni a ticketet.");
                } finally {
                    setLoading(false);
                }
            }
        }

    if(!ticket) return <div className="p-4 text-red-600">{error}</div>;

    return (
        <div className="flex justify-center items-start min-w-screen min-h-screen bg-taupe-300">
            <div className="m-7 space-y-5">
                <h1 className="text-3xl font-semibold">Részletek</h1>
                <div className="flex flex-col border rounded-md bg-slate-200 w-160">
                    <div className="flex justify-start gap-2 text-sm text-gray-500 mt-4 ml-3">Feltöltő: {ticket.owner.username}</div>
                    <div className="text-xl font-semibold text-left p-3">{ticket.title}</div>
                    <div className="text-md text-gray-700 text-left px-3">{ticket.description}</div>
                    <div className="flex justify-end gap-2 text-sm text-gray-500 mt-4 mr-3">Létrehozva: {new Date(ticket.createdAt).toISOString().split("T")[0]}</div>
                    <div className="flex justify-end gap-2 text-sm text-gray-500 mt-1 mb-2 mr-3">Módosítva: {new Date(ticket.updatedAt).toISOString().split("T")[0]}</div>
                
                    <div className="flex flex-col justify-start items-start text-sm m-3">
                        {role === "ADMIN" && <button type="button" onClick={() => deleteTicket(ticket.id)} className="underline">Törlés</button>}
                    </div>
                </div>

                <ul className="flex justify-center items-center flex-col gap-3">
                    {comments.map((c) => (
                        <li key={c.id} className="border rounded bg-white w-150">
                            <div className="flex justify-start gap-2 text-sm text-gray-500 mt-4 ml-3">{c.owner.username}</div>
                            <div className="text-md text-gray-700 text-left px-3">{c.text}</div>
                            <div className="flex justify-end gap-2 text-sm text-gray-500 mt-4 mr-3">Létrehozva: {new Date(c.createdAt).toISOString().split("T")[0]}</div>
                            <div className="flex justify-end gap-2 text-sm text-gray-500 mt-1 mr-3">Módosítva: {new Date(c.updatedAt).toISOString().split("T")[0]}</div>

                            <div className="flex flex-col justify-start items-start text-sm m-3">
                                <CommentUpdateForm key={c.id} comment={c} onCreated={loadingComments}/>
                                {(userId === c.userId || role === "ADMIN") && <button type="button" onClick={() => deleteComment(c.id)} className="underline cursor-pointer">Törlés</button>}
                            </div>
                        </li>
                    ))}
                </ul>

                {token && <div><CommentForm ticketId={id} onCreated={loadingComments}/></div>}
            </div>

            {loading && <div className="p-4">Betöltés...</div>}
            {error && <div className="p-4 text-red-600">{error}</div>}
            {!ticket && <div className="p-4 text-red-600">{error}</div>}
        </div>
    );
}

export default TicketDetailForm;
