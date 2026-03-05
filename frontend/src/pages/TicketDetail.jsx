import React from "react";
import { useParams } from "react-router-dom";

function TicketDetail() {
    const { id } = useParams();
    return (
        <div className="text-xl">Ticket részletek: {id}</div>
    );
}

export default TicketDetail;