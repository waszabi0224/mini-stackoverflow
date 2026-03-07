import { Routes, Route, Link, Navigate } from "react-router-dom";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import TicketDetail from "./pages/TicketDetail.jsx";
import NewTicket from "./pages/NewTicket.jsx";
import Profile from "./pages/Profile.jsx";
import Tickets from "./pages/Tickets.jsx";

function App() {
  return (
      <div className="App">
        <nav className="flex gap-4 mb-6">
          <Link to="/tickets">Home</Link>
          <Link to="/new-ticket">Új ticket</Link>
          <Link to="/profile">Profil</Link>
          <Link to="/login">Bejelentkezés</Link>
          <Link to="/register">Regisztráció</Link>
          <Link to="/tickets/:id">Ticket részletek</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Navigate to="/tickets" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/tickets/:id" element={<TicketDetail />} />
          <Route path="/new-ticket" element={<NewTicket />} />
        </Routes>
      </div>
  );
}

export default App
