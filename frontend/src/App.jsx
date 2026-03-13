import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import TicketDetail from "./pages/TicketDetail.jsx";
import NewTicket from "./pages/NewTicket.jsx";
import Profile from "./pages/Profile.jsx";
import Tickets from "./pages/Tickets.jsx";
import Header from "./components/Header.jsx";
import TicketUpdate from "./pages/TicketUpdate.jsx";

function App() {
  return (
      <div className="App">
        <Header />
          <Routes>
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/new-ticket" element={<NewTicket />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/tickets/:id" element={<TicketDetail />} />
            <Route path="/tickets/:id/edit" element={<TicketUpdate />} />
          </Routes>
      </div>
  );
}

export default App;
