import { Routes, Route, Link, Navigate } from "react-router-dom";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import TicketDetail from "./pages/TicketDetail.jsx";
import NewTicket from "./pages/NewTicket.jsx";
import Profile from "./pages/Profile.jsx";
import Tickets from "./pages/Tickets.jsx";
import Header from "./components/Header.jsx";

function App() {
  return (
      <div className="App">
        <Header />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/" element={<Tickets />} />
            <Route path="/tickets/:id" element={<TicketDetail />} />
            <Route path="/new-ticket" element={<NewTicket />} />
          </Routes>
      </div>
  );
}

export default App;
