import { useState } from "react";
import { apiFetch } from "../api/client";
import { useSearchParams } from "react-router-dom";

function CommentForm({ ticketId, onCreated }) {
    const [error, setError] = useState("");

    const[loading, setLoading] = useState(false);

    const [text, setText] = useState();

    const [params] = useSearchParams();

    const msg = params.get("msg");

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
        setText("");
        onCreated();
        } catch(err) {
            setError(err.message || "Nem sikerült hozzászólni.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={onSubmit} className="flex flex-col">
            <div className="flex max-w-full gap-1 justify-center items-end">
                <textarea className="border rounded p-2 bg-stone-200 w-130 resize-none overflow-hidden" name="text" rows={2} value={text} onChange={onChange} onInput={(e) => {e.target.style.height = "auto"; e.target.style.height = e.target.scrollHeight + "px";}} placeholder="Szólj hozzá..." required/>
                <button className="bg-black w-25 h-10 mb-2 text-white rounded disabled:opacity-50 cursor-pointer hover:scale-105 transition-all" disabled={loading}>{loading ? "Mentés..." : "Küldés"}</button>
            </div>

            {msg && <div className="text-sm text-red-600">{msg}</div>}
            {error && <div className="text-sm text-red-600">{error}</div>}
            {loading && <div className="p-4">Betöltés...</div>}
        </form>
    );
}

export default CommentForm;
