import Router from "express";
import db from "../db/prisma.js";
import isAuthenticated from "../utils/middlewares.js";

const router = Router();

//létrehozás
router.post('/', isAuthenticated, async(req, res, next) => {
    try {
        const ownerId = req.payload.userId;
        const { title, description } = req.body;
        if(!title || !description) {
            res.status(400);
            throw new Error("Töltsd ki a kötelező mezőket.");
        }

        const ticket = await createTicket({ title, description }, ownerId);
        res.json({
            ticket,
        });
    } catch (err) {
        next(err);
    }
});

//összes listázása
router.get('/', async(req, res, next) => {
    try {
        const tickets = await findTicket();
        res.json({
            tickets,
        });
    } catch (err) {
        next(err);
    }
});

//egy listázása
router.get('/:id', isAuthenticated, async(req, res, next) => {
    try {
        const ownerId = req.payload.userId;
        const tickets = await findTicketByUserId(ownerId);
        res.json({
            tickets,
        });
    } catch (err) {
        next(err);
    }
});

//módosítás
router.patch('/:id', isAuthenticated, async(req, res, next) => {
    try {
        const ticketId = Number(req.params.id);
        const ownerId = req.payload.userId;
        const { title, description } = req.body;

        let ticket = await findTicketById(ticketId);

        if(!ticket) {
            res.status(400);
            throw new Error("Nincs ilyen ticket.");
        }

        if(ticket.userId !== ownerId) {
            res.status(400);
            throw new Error("Nem módosíthatod ezt a ticketet.");
        }

        ticket = await updateTicket({ title, description }, ticketId);
        res.json({
            ticket,
        });
    } catch (err) {
        next(err);
    }
});

//törlés
router.delete('/:id', isAuthenticated, async(req, res, next) => {
    try {
        const ticketId = Number(req.params.id);
        const ownerId = req.payload.userId;

        let ticket = await findTicketById(ticketId);

        if(!ticket) {
            res.status(400);
            throw new Error("Nincs ilyen ticket.");
        }

        if(ticket.userId !== ownerId) {
            res.status(400);
            throw new Error("Nem törölheted ezt a ticketet.");
        }

        ticket = await deleteTicket(ticketId);
        res.json({
            ticket,
        });
    } catch (err) {
        next(err);
    }
});

function createTicket(ticket, ownerId) {
    return db.ticket.create({
        data: {
            userId: ownerId,
            title: ticket.title,
            description: ticket.description,
        },
    });
}

function updateTicket(updateticket, id) {
    return db.ticket.update({
        where: {
            id,
        },
        data: {
            title: updateticket.title,
            description: updateticket.description,
        },
    });
}

function deleteTicket(id) {
    return db.ticket.delete({
        where: {
            id,
        },
    });
}

function findTicket() {
    return db.ticket.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
}

function findTicketByUserId(id) {
    return db.ticket.findMany({
        where: {
            userId: id,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}

function findTicketById(id) {
    return db.ticket.findUnique({
        where: {
            id,
        },
    });
}

export default router;
