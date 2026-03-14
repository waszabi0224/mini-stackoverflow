import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";

function CommentUpdateForm({ comment, onCreated }) {
    const [error, setError] = useState("");

    const[loading, setLoading] = useState(false);

    const [text, setText] = useState();

    const [editing, setEditing] = useState(false);

    const [userId, setUserId] = useState();

    useEffect(() => {
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
    }, []);

    const canEdit = userId === comment.userId;
    
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

    if(error) return <div className="text-sm text-red-600">{error}</div>;

    return (
        <ul className="bg-white">
            {!editing ? (
                <>
                    <div className="text-sm"></div>
                    {canEdit && <button type="button" onClick={startEdit} className="underline text-sm mt-2">Módosítás</button>}
                </>
            ) : (
                <>
                    <textarea className="w-full border rounded p-2" value={text} onChange={onChange} rows={2}/>

                    <div className="mt-2 flex gap-2">
                        <button onClick={onSubmit} className="px-3 py-1 rounded bg-black text-white disabled:opacity-50" disabled={loading}>{loading ? "Mentés..." : "Mentés"}</button>
                    </div>
                </>
            )}
        </ul>
    );
}

export default CommentUpdateForm;
