import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import { getToken } from "../utils/token";

function CommentUpdateForm({ comment, onCreated }) {
    const [error, setError] = useState("");

    const[loading, setLoading] = useState(false);

    const [text, setText] = useState();

    const [editing, setEditing] = useState(false);

    const [userId, setUserId] = useState();

    const token = getToken();

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
                } catch(err) {
                    setError(err.message || "Nem sikerült módosítani a kommentet.");
                } finally {
                    setLoading(false);
                }
            }
            addUser();
        }
        else {
            return;
        }
    }, [token]);
    
    function startEdit() {
        setEditing(true);
        setText(comment.text);
    }

    function onChange(e) {
        setText(e.target.value);
    }

    async function onSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const data = await apiFetch(`/comments/${comment.id}`, {
            method: "PATCH",
            body: {
                text,
            },
            auth: true,
        });
        setEditing(false);
        onCreated();
        } catch(err) {
            setError(err.message || "Nem sikerült a módosítás.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <ul className="bg-white flex max-w-full gap-1">
            {!editing ? (
                <>
                    <div>
                        {(userId === comment.userId) && <button type="button" onClick={startEdit} className="underline text-sm">Módosítás</button>}
                    </div>
                </>
            ) : (
                <>
                    <textarea className="w-140 border rounded p-2 resize-none overflow-hidden" value={text} onChange={onChange} rows={2} onInput={(e) => {e.target.style.height = "auto"; e.target.style.height = e.target.scrollHeight + "px";}}/>

                    <div className="flex justify-center items-end mb-2">
                        <button onClick={onSubmit} className="px-3 h-10 rounded bg-black text-white disabled:opacity-50" disabled={loading}>{loading ? "Mentés..." : "Mentés"}</button>
                    </div>
                </>
            )}
            {error && <div className="text-sm text-red-600">{error}</div>}
        </ul>
    );
}

export default CommentUpdateForm;
