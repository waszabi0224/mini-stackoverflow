import NewTicketForm from "../components/NewTicketForm";

const NewTicket = () => {
    return (
        <div className="max-w-md max-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Ticket létrehozása</h1>
            <NewTicketForm />
        </div>
    )
}

export default NewTicket;
