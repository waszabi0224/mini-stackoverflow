import TicketUpdateForm from "../components/TicketUpdateForm.jsx";

const TicketUpdate = () => {
    return (
        <div className="max-w-md max-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Ticket módosítása</h1>
            <TicketUpdateForm />
        </div>
    );
}

export default TicketUpdate;
