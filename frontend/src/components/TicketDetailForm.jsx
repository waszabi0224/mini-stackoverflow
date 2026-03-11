import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import { useNavigate, useParams } from "react-router-dom";
import CommentForm from "./CommentForm";

function TicketDetailForm() {
    const [ticket, setTicket] = useState();

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");
    
    const { id } = useParams();

    const [comments, setComments] = useState([]);
    
    useEffect(() => {
        async function loadingTicketsDetail() {
            setLoading(true);
            setError("");

            try {
                const data = await apiFetch(`/tickets/${id}`, {
                    method: "GET",
                });
                setTicket(data.ticket ?? data);
            } catch(err) {
                setError(err.message || "Nem sikerült a betöltés");
            } finally {
                setLoading(false);
            }
        }

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

        loadingTicketsDetail();
        loadingComments();
    }, [id]);

    if(loading) return <div className="p-4">Betöltés...</div>
    if(error) return <div className="p-4 text-red-600">{error}</div>
    if(!ticket) return <div className="p-4 text-red-600">{error}</div>

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold">{ticket.title}</h1>
            <p className="text-gray-600 mt-2">{ticket.description}</p>
            <div className="text-sm mt-4">Létrehozva: {ticket.createdAt}</div>
            <div className="text-sm mt-4">Módosítva: {ticket.updatedAt}</div>
            <div className="text-sm mt-4">Feltöltő: {ticket.owner.username}</div>
            <div className="text-sm mt-4">{ticket.comments}</div>

            <ul className="space-y-3">
                {comments.map((c) => (
                    <li key={c.id} className="border rounded p-3 bg-white">
                        <div className="text-sm">{c.owner.username}</div>
                        <div className="text-sm">{c.text}</div>
                        <div className="text-sm">{c.createdAt}</div>
                    </li>
                ))}
            </ul>
            <CommentForm ticketId={id}/>
        </div>
    );
}

export default TicketDetailForm;
