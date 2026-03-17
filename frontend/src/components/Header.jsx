import { useNavigate, Link } from "react-router-dom";
import { getToken, removeToken } from "../utils/token.js";
import logo from "../images/logo.png";
import menu from "../images/menu.png";
import { useState } from "react";

function Header() {
    const navigate = useNavigate();
    const token = getToken();

    const [open, setOpen] = useState("false");

    function Logout() {
        const confirmation = confirm("Biztosan ki akarsz lépni?");
        if(confirmation) {
            removeToken();
            navigate("/tickets");
        }
    }

    return (
        <header className="border-b bg-olive-300">
            <nav className="flex items-center justify-between px-4 font-medium">
                <div className="flex items-center gap-3 text-lg">
                    <Link to="/tickets">
                        <img src={logo} alt="Logo" className="h-15"/>
                    </Link>
                    {token ? (
                        <>
                        <Link to="/new-ticket" className="hover:text-gray-600 hover:scale-105 transition-all">Új ticket</Link>
                        <Link to="/profil" className="hover:text-gray-600 hover:scale-105 transition-all">Ticketjeim</Link>
                        </>
                    ) : (
                        <>
                        <Link to="/login" className="hover:text-gray-600 hover:scale-105 transition-all">Új ticket</Link>
                        <Link to="/login" className="hover:text-gray-600 hover:scale-105 transition-all">Ticketjeim</Link>
                        </>
                    )}
                </div>
            
                <div className="text-lg hidden sm:flex gap-2">
                    {token ? (
                        <>
                        <button onClick={Logout} className="hover:text-gray-600 hover:scale-105 transition-all cursor-pointer">Kijelentkezés</button>
                        </>
                    ) : (
                        <>
                        <Link to="/login" className="hover:text-gray-600 hover:scale-105 transition-all">Bejelentkezés</Link>
                        <Link to="/register" className="hover:text-gray-600 hover:scale-105 transition-all">Regisztráció</Link>
                        </>
                    )}
                </div>

                <button className="cursor-pointer sm:hidden" onClick={() => setOpen(!open)}><img src={menu} alt="Menu" className="h-10"/></button>

                
            </nav>
            {open && (
                    <div className="flex flex-col items-end gap-3 text-lg font-medium sm:hidden px-4">
                        {token ? (
                            <>
                            <button onClick={Logout} className="hover:text-gray-600 hover:scale-105 transition-all cursor-pointer">Kijelentkezés</button>
                            </>
                        ) : (
                            <>
                            <Link to="/login" className="hover:text-gray-600 hover:scale-105 transition-all">Bejelentkezés</Link>
                            <Link to="/register" className="hover:text-gray-600 hover:scale-105 transition-all">Regisztráció</Link>
                            </>
                        )}
                    </div>
                )}
        </header>
    );
}

export default Header;
