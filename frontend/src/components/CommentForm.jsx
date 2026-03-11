import { useState } from "react";
import { apiFetch } from "../api/client";

function CommentForm({ ticketId }) {
    const [error, setError] = useState("");

    const[loading, setLoading] = useState(false);

    const [text, setText] = useState();

    function onChange(e) {
        setText(e.target.value);
    }

    async function onSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const data = await apiFetch(`/comments/${ticketId}`, {
            method: "POST",
            body: {
                text,
            },
            auth: true,
        });
        setText(data.text);
        } catch(err) {
            setError(err.message || "Nem sikerült hozzászólni.");
        } finally {
            setLoading(false);
        }
        
    }

    if(error) return <div className="text-sm text-red-600">{error}</div>;
    if(loading) return <div className="p-4">Betöltés...</div>;

    return (
        <form onSubmit={onSubmit} className="mt-6 space-y-2">
            <div className="flex gap-2 items-start">
                <textarea className="flex-1 border rounded p-2" name="text" rows={2} value={text} onChange={onChange} placeholder="Szólj hozzá..." required/>
                <button className="px-3 py-2 rounded bg-black text-white disabled:opacity-50" disabled={loading}>{loading ? "Mentés..." : "Küldés"}</button>
            </div>
        </form>
    );
}

export default CommentForm;
