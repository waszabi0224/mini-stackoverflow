import { useNavigate, Link } from "react-router-dom";
import { getToken, removeToken } from "../utils/token.js";

function Header() {
    const navigate = useNavigate();
    const token = getToken();

    function Logout() {
        const confirmation = confirm("Biztosan ki akarsz lépni?");
        if(confirmation) {
            removeToken();
            navigate("/tickets");
        }
    }

    return (
        <header className="border-b bg-white">
            <nav className="max-w-5xl mx-auto p-2 flex gap-4">
                <Link to="/tickets">Főoldal</Link>
                <div>
                    {token ? (
                        <>
                        <Link to="/new-ticket">Új ticket</Link>
                        </>
                    ) : (
                        <>
                        <Link to="/login">Új ticket</Link>
                        </>
                    )}
                </div>
                <div className="ml-auto flex items-center gap-3">
                    {token ? (
                        <>
                        <button onClick={Logout}>Kijelentkezés</button>
                        </>
                    ) : (
                        <>
                        <Link to="/login">Bejelentkezés</Link>
                        <Link to="/register" >Regisztráció</Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}

export default Header;
