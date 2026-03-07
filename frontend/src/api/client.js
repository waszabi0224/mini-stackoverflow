import { getToken } from "../utils/token.js";

const URL = import.meta.env.VITE_API_URL;

export async function apiFetch(path, { method, body, auth = false }) {
    //ez csak eltárolja a JSON http kérés formáját
    const headers = { "Content-Type": "application/json" };

    //ha auth=false, hívásnál nincs megadva, akkor az nem védett endpoint
    if (auth) {
        const token = getToken();
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }
    }

    const res = await fetch(`${URL}${path}`, { method, headers, body: JSON.stringify(body) });

    //a fetch hívás értékét leellenőrzi, hogy JSON-e
    const isJson = res.headers.get("content-type")?.includes("application/json");
    const data = isJson ? await res.json() : null;

    if(!res.ok) {
        const msg = data?.error || data?.message || `HTTP ${res.status}`;
        throw new Error(msg);
    }

    return data;
}
